import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Student from '#models/student'
import User from '#models/user'
import School from '#models/school'
import Class from '#models/class'
import Teacher from '#models/teacher'
import Message from '#models/message'
import Grade from '#models/grade'
import Assignment from '#models/assignment'
import Parent from '#models/parent'
import { DateTime } from 'luxon'
import {
  getAcademicStatsValidator,
  getFinancialStatsValidator,
  getPerformanceStatsValidator,
} from '#validators/dashboard'
import {
  getGovernanceContext,
  listSchoolSections,
  positionLabel,
} from '#services/school_governance_service'

export default class DashboardController {
  public async workspace({ auth, request, response, view }: HttpContext) {
    const user = auth.getUserOrFail()

    if (user.role === 'inspection') {
      return response.redirect('/inspection/dashboard')
    }

    if (user.role === 'director' && request.input('legacy_dashboard') === '1') {
      return this.directorDashboardPage({ auth, view })
    }
    if (user.role === 'director') return this.governanceDashboardPage({ auth, view })
    if (user.role === 'teacher') return this.teacherDashboardPage({ auth, view })
    if (user.role === 'parent') return this.parentDashboardPage({ auth, view })
    if (user.role === 'student') return this.studentDashboardPage({ auth, view })
    if (user.role === 'finance_director') return this.financeDashboardPage({ auth, request, view })
    if (user.role === 'discipline_director') return response.redirect('/discipline')
    if (user.role === 'secretary') return this.governanceDashboardPage({ auth, view })

    const roleLabels: Record<string, string> = {
      director: "Direction d'école",
      finance_director: 'Direction financière',
      discipline_director: 'Direction de discipline',
      teacher: 'Enseignant',
      parent: 'Parent',
      student: 'Élève',
      secretary: 'Secrétariat',
    }

    return view.render('dashboard/index', {
      title: 'Tableau de bord - Gestion Éducative RDC',
      stats: {
        totalStudents: 0,
        newStudents: 0,
        totalTeachers: 0,
        totalClasses: 0,
        averageGrade: '0.0',
      },
      recentActivities: [
        {
          description: `Connecté en tant que ${roleLabels[user.role] ?? user.role}`,
          time: 'Maintenant',
        },
      ],
    })
  }

  private getFallbackSchool(user: User) {
    return {
      id: user.schoolId,
      name: 'Gestion Éducative RDC',
    }
  }

  private async governanceDashboardPage({ auth, view }: Pick<HttpContext, 'auth' | 'view'>) {
    const user = auth.getUserOrFail()
    const schoolId = user.schoolId
    const [school, context, sections] = await Promise.all([
      School.find(schoolId),
      getGovernanceContext(user),
      listSchoolSections(schoolId),
    ])
    const visibleSections = context.canManageAllSections
      ? sections
      : sections.filter((section) => section.id === context.sectionId)
    const visibleSectionIds = visibleSections.map((section) => section.id)
    const classQuery = Class.query()
      .where('schoolId', schoolId)
      .whereNull('archivedAt')
      .if(visibleSectionIds.length > 0, (query) =>
        query.whereIn('schoolSectionId', visibleSectionIds)
      )
      .if(!context.canManageAllSections && visibleSectionIds.length === 0, (query) =>
        query.whereRaw('1 = 0')
      )
    const classes = await classQuery.orderBy('gradeLevel', 'asc').orderBy('name', 'asc')
    const classIds = classes.map((classObj) => classObj.id)
    const [studentRows, teacherRows, staffRows] = await Promise.all([
      classIds.length
        ? db
            .from('students')
            .whereIn('class_id', classIds)
            .where('academic_status', 'active')
            .select('class_id')
            .count('* as total')
            .groupBy('class_id')
        : [],
      visibleSectionIds.length
        ? db
            .from('class_subject')
            .join('classes', 'class_subject.class_id', 'classes.id')
            .whereIn('classes.school_section_id', visibleSectionIds)
            .whereNotNull('class_subject.teacher_id')
            .countDistinct('class_subject.teacher_id as total')
            .first()
        : Promise.resolve({ total: 0 }),
      db
        .from('school_staff_assignments')
        .leftJoin('users', 'school_staff_assignments.user_id', 'users.id')
        .leftJoin('school_sections', 'school_staff_assignments.school_section_id', 'school_sections.id')
        .where('school_staff_assignments.school_id', schoolId)
        .where('school_staff_assignments.is_active', true)
        .if(!context.canManageAllSections, (query) =>
          query.where('school_staff_assignments.school_section_id', context.sectionId)
        )
        .select(
          'school_staff_assignments.position',
          'school_sections.name as section_name',
          'users.id as user_id',
          'users.first_name',
          'users.postnom',
          'users.last_name'
        ),
    ])
    const studentsByClass = new Map(
      studentRows.map((row) => [String(row.class_id), Number(row.total || 0)])
    )
    const sectionCards = visibleSections.map((section) => {
      const sectionClasses = classes.filter((classObj) => classObj.schoolSectionId === section.id)
      const sectionClassIds = new Set(sectionClasses.map((classObj) => classObj.id))

      return {
        id: section.id,
        code: section.code,
        name: section.name,
        classesCount: sectionClasses.length,
        studentsCount: studentRows
          .filter((row) => sectionClassIds.has(String(row.class_id)))
          .reduce((sum, row) => sum + Number(row.total || 0), 0),
      }
    })
    const quickActionsByPosition: Record<string, { label: string; href: string; icon: string }[]> = {
      promoter: [
        { label: 'Gérer les responsables', href: '/schools/accounts', icon: 'fa-users-gear' },
        { label: 'Consulter les classes', href: '/academic/classes', icon: 'fa-chalkboard' },
        { label: 'Suivre les finances', href: '/financial', icon: 'fa-coins' },
        { label: 'Rapports de l’établissement', href: '/reports/academic/school', icon: 'fa-chart-line' },
      ],
      preschool_director: [
        { label: 'Gérer les classes', href: '/academic/classes', icon: 'fa-shapes' },
        { label: 'Gérer les élèves', href: '/students', icon: 'fa-children' },
        { label: 'Gérer les enseignants', href: '/teachers', icon: 'fa-chalkboard-user' },
        { label: 'Suivre les présences', href: '/teacher/attendance', icon: 'fa-calendar-check' },
      ],
      primary_director: [
        { label: 'Gérer les classes', href: '/academic/classes', icon: 'fa-chalkboard' },
        { label: 'Gérer les élèves', href: '/students', icon: 'fa-users' },
        { label: 'Notes et bulletins', href: '/academic/grades', icon: 'fa-star' },
        { label: 'Gérer les enseignants', href: '/teachers', icon: 'fa-chalkboard-user' },
      ],
      prefect: [
        { label: 'Direction des études', href: '/schools/accounts', icon: 'fa-user-tie' },
        { label: 'Classes du secondaire', href: '/academic/classes', icon: 'fa-school' },
        { label: 'Examens et résultats', href: '/academic/exams', icon: 'fa-file-signature' },
        { label: 'Discipline scolaire', href: '/discipline', icon: 'fa-gavel' },
      ],
      studies_director: [
        { label: 'Organiser les classes', href: '/academic/classes', icon: 'fa-chalkboard' },
        { label: 'Emplois du temps', href: '/schools/timetable', icon: 'fa-calendar-days' },
        { label: 'Notes et bulletins', href: '/academic/grades', icon: 'fa-star' },
        { label: 'Examens', href: '/academic/exams', icon: 'fa-file-circle-check' },
      ],
      pedagogical_advisor: [
        { label: 'Référentiel des matières', href: '/schools/subjects/catalog', icon: 'fa-book-open' },
        { label: 'Suivi des enseignants', href: '/teachers', icon: 'fa-person-chalkboard' },
        { label: 'Performances scolaires', href: '/reports/academic/performance', icon: 'fa-chart-column' },
        { label: 'Documentation pédagogique', href: '/help/documentation', icon: 'fa-book' },
      ],
      discipline_director: [
        { label: 'Tableau de discipline', href: '/discipline', icon: 'fa-gavel' },
        { label: 'Incidents disciplinaires', href: '/discipline/incidents', icon: 'fa-triangle-exclamation' },
        { label: 'Suivi des élèves', href: '/discipline/students', icon: 'fa-user-shield' },
        { label: 'Rapports de discipline', href: '/discipline/reports/statistics', icon: 'fa-chart-pie' },
      ],
      deputy_discipline_director: [
        { label: 'Suivi des élèves', href: '/discipline/students', icon: 'fa-user-shield' },
        { label: 'Signaler un incident', href: '/discipline/incidents/report', icon: 'fa-clipboard-list' },
        { label: 'Incidents disciplinaires', href: '/discipline/incidents', icon: 'fa-triangle-exclamation' },
        { label: 'Sanctions', href: '/discipline/sanctions', icon: 'fa-scale-balanced' },
      ],
      finance_director: [
        { label: 'Tableau financier', href: '/financial', icon: 'fa-coins' },
        { label: 'Frais scolaires', href: '/financial/fees', icon: 'fa-file-invoice-dollar' },
        { label: 'Paiements', href: '/financial/payments', icon: 'fa-money-check-dollar' },
        { label: 'Rapports financiers', href: '/reports/exports', icon: 'fa-chart-line' },
      ],
      secretary: [
        { label: 'Dossiers des élèves', href: '/students', icon: 'fa-folder-open' },
        { label: 'Correspondances', href: '/communication/messages', icon: 'fa-envelope' },
        { label: 'Documents scolaires', href: '/reports/exports', icon: 'fa-file-lines' },
        { label: 'Archives et exports', href: '/reports/exports/downloads', icon: 'fa-box-archive' },
      ],
    }
    const supervisor = context.supervisorPosition
      ? staffRows.find((staff) => {
          if (staff.position !== context.supervisorPosition) return false
          if (context.supervisorPosition === 'promoter') return true
          if (context.sectionName) return staff.section_name === context.sectionName
          return true
        })
      : null
    const supervisorName = supervisor
      ? [supervisor.first_name, supervisor.last_name, supervisor.postnom].filter(Boolean).join(' ')
      : null

    return view.render('dashboard/governance', {
      school: school || this.getFallbackSchool(user),
      governance: context,
      stats: {
        sections: visibleSections.length,
        classes: classes.length,
        students: studentRows.reduce((sum, row) => sum + Number(row.total || 0), 0),
        teachers: Number(teacherRows?.total || 0),
      },
      sectionCards,
      quickActions: quickActionsByPosition[context.position] || [],
      supervisorName,
      staff: staffRows.map((staff) => ({
        fullName: [staff.first_name, staff.last_name, staff.postnom].filter(Boolean).join(' '),
        positionLabel: positionLabel(staff.position),
        sectionName: staff.section_name || 'Toutes les sections',
      })),
      classes: classes.slice(0, 8).map((classObj) => ({
        id: classObj.id,
        name: classObj.name,
        studentsCount: studentsByClass.get(classObj.id) || 0,
      })),
    })
  }

  private async directorDashboardPage({ auth, view }: Pick<HttpContext, 'auth' | 'view'>) {
    const user = auth.getUserOrFail()
    const schoolId = user.schoolId
    const school = schoolId ? await School.find(schoolId) : null
    const monthStart = DateTime.now().startOf('month').toSQLDate()
    const [students, newStudents, teachers, classes] = await Promise.all([
      Student.query().where('schoolId', schoolId).where('academicStatus', 'active').count('* as total').first(),
      Student.query().where('schoolId', schoolId).where('createdAt', '>=', monthStart).count('* as total').first(),
      User.query().where('schoolId', schoolId).where('role', 'teacher').where('status', 'active').count('* as total').first(),
      Class.query()
        .where('schoolId', schoolId)
        .whereNull('archivedAt')
        .orderBy('gradeLevel', 'asc')
        .orderBy('name', 'asc'),
    ])
    const classIds = classes.map((classObj) => classObj.id)
    const studentRows = classIds.length
      ? await db
          .from('students')
          .select('class_id')
          .count('* as total')
          .whereIn('class_id', classIds)
          .where('academic_status', 'active')
          .groupBy('class_id')
      : []
    const studentsByClass = new Map(
      studentRows.map((row) => [String(row.class_id), Number(row.total || 0)])
    )
    const attendanceRows = classIds.length
      ? await db
          .from('attendances')
          .select('class_id')
          .select(
            db.raw(
              "sum(case when status in ('present', 'excused') then 1 else 0 end) as present_total"
            )
          )
          .count('* as total')
          .whereIn('class_id', classIds)
          .where('date', '>=', monthStart)
          .groupBy('class_id')
      : []
    const attendanceByClass = new Map(
      attendanceRows.map((row) => {
        const total = Number(row.total || 0)
        const presentTotal = Number(row.present_total || 0)

        return [
          String(row.class_id),
          {
            total,
            presentTotal,
            rate: total ? Math.round((presentTotal / total) * 100) : 0,
          },
        ]
      })
    )
    const totalAttendance = attendanceRows.reduce((sum, row) => sum + Number(row.total || 0), 0)
    const totalPresentAttendance = attendanceRows.reduce(
      (sum, row) => sum + Number(row.present_total || 0),
      0
    )
    const attendanceRate = totalAttendance
      ? Math.round((totalPresentAttendance / totalAttendance) * 100)
      : 0

    return view.render('dashboard/director', {
      school: school || this.getFallbackSchool(user),
      stats: {
        students: Number(students?.$extras.total || 0),
        newStudents: Number(newStudents?.$extras.total || 0),
        teachers: Number(teachers?.$extras.total || 0),
        classes: classes.length,
        attendanceRate,
      },
      alerts: [],
      upcomingEvents: [],
      classes,
      classPerformance: classes.map((classObj) => ({
        id: classObj.id,
        name: classObj.name,
        studentsCount: studentsByClass.get(classObj.id) || 0,
        averageGrade: '-',
        attendanceRate: attendanceByClass.get(classObj.id)?.rate || 0,
      })),
    })
  }

  private async teacherDashboardPage({ auth, view }: Pick<HttpContext, 'auth' | 'view'>) {
    const user = auth.getUserOrFail()
    const teacher = await Teacher.query().where('userId', user.id).first()
    const classes = teacher
      ? await Class.query()
          .where('teacherId', teacher.id)
          .whereNull('archivedAt')
          .orderBy('name', 'asc')
      : []
    const classIds = classes.map((classObj) => classObj.id)
    const [assignments, studentRows] = await Promise.all([
      classIds.length
        ? Assignment.query().whereIn('classId', classIds).orderBy('createdAt', 'desc').limit(5)
        : [],
      classIds.length
        ? db
            .from('students')
            .select('class_id')
            .count('* as total')
            .whereIn('class_id', classIds)
            .where('academic_status', 'active')
            .groupBy('class_id')
        : [],
    ])
    const studentsByClass = new Map(
      studentRows.map((row) => [String(row.class_id), Number(row.total || 0)])
    )

    return view.render('dashboard/teacher', {
      stats: {
        myClasses: classes.length,
        myStudents: classes.reduce(
          (sum, classObj) => sum + (studentsByClass.get(classObj.id) || 0),
          0
        ),
        assignments: assignments.length,
        pendingSubmissions: 0,
      },
      myClasses: classes.map((classObj) => ({
        id: classObj.id,
        name: classObj.name,
        studentsCount: studentsByClass.get(classObj.id) || 0,
      })),
      recentAssignments: assignments.map((assignment) => ({
        id: assignment.id,
        title: assignment.title,
        className: classes.find((classObj) => classObj.id === assignment.classId)?.name || '-',
        subjectName: '-',
        dueDate: assignment.dueDate?.toFormat('dd/MM/yyyy') || '-',
        submissionsCount: 0,
        totalStudents: 0,
      })),
      todayAttendance: classes.map((classObj) => ({
        className: classObj.name,
        presentCount: 0,
        totalStudents: studentsByClass.get(classObj.id) || 0,
        rate: 0,
      })),
    })
  }

  private async parentDashboardPage({ auth, view }: Pick<HttpContext, 'auth' | 'view'>) {
    const user = auth.getUserOrFail()
    const parent = await Parent.query().where('userId', user.id).first()
    const children = parent
      ? await Student.query()
          .whereIn('id', db.from('parent_student').select('student_id').where('parent_id', parent.id))
          .preload('user')
          .preload('class')
      : []
    const messages = await Message.query()
      .where('receiverId', user.id)
      .preload('sender')
      .orderBy('createdAt', 'desc')
      .limit(5)

    return view.render('dashboard/parent', {
      stats: {
        childrenCount: children.length,
        averageGrade: '-',
        unreadMessages: messages.filter((message) => !message.isRead).length,
        pendingPayments: 0,
      },
      children: children.map((child) => ({
        ...child.toJSON(),
        id: child.id,
        registrationNumber: child.registrationNumber || '-',
        user: child.user,
        class: child.class || { name: 'Non affecté' },
        averageGrade: '-',
      })),
      recentMessages: messages.map((message) => ({
        id: message.id,
        senderName: message.sender?.fullName || 'Expéditeur',
        subject: message.subject,
      })),
    })
  }

  private async studentDashboardPage({ auth, view }: Pick<HttpContext, 'auth' | 'view'>) {
    const user = auth.getUserOrFail()
    const studentProfile = await Student.query()
      .where('userId', user.id)
      .preload('class')
      .preload('school')
      .first()
    const grades = studentProfile
      ? await Grade.query().where('studentId', studentProfile.id).preload('subject').orderBy('examDate', 'desc').limit(5)
      : []
    const averageGrade = grades.length
      ? (grades.reduce((sum, grade) => sum + Number(grade.score || 0), 0) / grades.length).toFixed(1)
      : '-'
    const parentRecord = studentProfile
      ? await db
          .from('parent_student')
          .join('parents', 'parent_student.parent_id', 'parents.id')
          .join('users', 'parents.user_id', 'users.id')
          .where('parent_student.student_id', studentProfile.id)
          .select(
            'users.first_name as firstName',
            'users.postnom as postnom',
            'users.last_name as lastName',
            'parents.relationship'
          )
          .first()
      : null
    const parentName = parentRecord
      ? [
          [parentRecord.firstName, parentRecord.lastName, parentRecord.postnom].filter(Boolean).join(' '),
          parentRecord.relationship ? `(${parentRecord.relationship})` : '',
        ]
          .filter(Boolean)
          .join(' ')
      : ''

    return view.render('dashboard/student', {
      stats: {
        averageGrade,
        rank: '-',
        totalStudents: 0,
        pendingAssignments: 0,
        attendanceRate: 0,
      },
      student: {
        firstName: user.firstName,
        postnom: user.postnom,
        lastName: user.lastName,
        fullName: user.fullName,
        className: studentProfile?.class?.name || 'Non affecté',
        schoolName: studentProfile?.school?.name || 'Gestion Éducative RDC',
        registrationNumber: studentProfile?.registrationNumber || '-',
        birthDate: studentProfile?.birthDate?.toFormat('dd/MM/yyyy') || '-',
        parentName,
      },
      recentGrades: grades.map((grade) => ({
        subjectName: grade.subject?.name || '-',
        examType: grade.examType,
        date: grade.examDate?.toFormat('dd/MM/yyyy') || '-',
        score: Number(grade.score || 0),
      })),
      pendingAssignments: [],
      timetable: [],
      forumTopics: [],
    })
  }

  private async financeDashboardPage({ auth, request, view }: Pick<HttpContext, 'auth' | 'request' | 'view'>) {
    auth.getUserOrFail()
    const currentYear = Number(request.input('year', DateTime.now().year))

    return view.render('dashboard/finance', {
      stats: {
        totalCollected: 0,
        monthlyCollected: 0,
        totalExpected: 0,
        outstanding: 0,
        recoveryRate: 0,
      },
      currentYear,
      debtors: [],
      recentPayments: [],
    })
  }

  /**
   * Page dashboard Inspection
   */
  public async inspection({ view }: HttpContext) {
    const [schoolStats, studentCount, teacherCount, schoolsByProvince, pendingSchools, activeSchools] =
      await Promise.all([
        School.query()
          .select(
            db.raw('count(*) as total'),
            db.raw("count(*) filter (where status = 'active') as active"),
            db.raw("count(*) filter (where status = 'pending') as pending")
          )
          .first(),
        db.from('students').count('* as total').first(),
        User.query().where('role', 'teacher').count('* as total').first(),
        db.from('schools').select('province').count('* as total').groupBy('province'),
        School.query().where('status', 'pending').orderBy('created_at', 'desc').limit(5),
        School.query().where('status', 'active').orderBy('updated_at', 'desc').limit(5),
      ])

    const totalSchools = Number(schoolStats?.$extras.total || 0)
    const provinceRows = schoolsByProvince.map((province) => {
      const count = Number(province.total || 0)

      return {
        name: province.province || 'Non renseignée',
        count,
        percentage: totalSchools ? Math.round((count / totalSchools) * 100) : 0,
      }
    })

    return view.render('dashboard/inspection', {
      title: 'Inspection Pédagogique - Gestion Éducative RDC',
      stats: {
        schools: {
          total: totalSchools,
          active: Number(schoolStats?.$extras.active || 0),
          pending: Number(schoolStats?.$extras.pending || 0),
        },
        students: Number(studentCount?.total || 0),
        teachers: Number(teacherCount?.$extras.total || 0),
        coverageRate: totalSchools ? 100 : 0,
        schoolsByProvince: provinceRows,
      },
      pendingSchools,
      activeSchools,
      systemAlerts: [],
    })
  }

  /**
   * Dashboard principal
   */
  public async index(ctx: HttpContext) {
    const { auth, response } = ctx
    const user = auth.user!

    switch (user.role) {
      case 'inspection':
        return this.getInspectionDashboard(ctx)
      case 'director':
        return this.getDirectorDashboard(ctx)
      case 'teacher':
        return this.getTeacherDashboard(ctx)
      case 'parent':
        return this.getParentDashboard(ctx)
      case 'student':
        return this.getStudentDashboard(ctx)
      default:
        return response.ok({ success: true, data: {} })
    }
  }

  /**
   * Dashboard Inspection
   */
  private async getInspectionDashboard({ response }: HttpContext) {
    const [schoolStats, studentCount, teacherCount, schoolsByProvince, averageGrades] =
      await Promise.all([
        School.query()
          .select(
            db.raw('count(*) as total'),
            db.raw("count(*) filter (where status = 'active') as active"),
            db.raw("count(*) filter (where status = 'pending') as pending")
          )
          .first(),
        db.from('students').count('* as total').first(),
        User.query().where('role', 'teacher').count('* as total').first(),
        db.from('schools').select('province').count('* as total').groupBy('province'),
        db.from('grades').avg('score as average').first(),
      ])

    return response.ok({
      success: true,
      stats: {
        schools: {
          total: Number(schoolStats?.$extras.total || 0),
          active: Number(schoolStats?.$extras.active || 0),
          pending: Number(schoolStats?.$extras.pending || 0),
        },
        students: Number(studentCount?.total || 0),
        teachers: Number(teacherCount?.$extras.total || 0),
        averageGrade: Number(averageGrades?.average || 0),
        schoolsByProvince,
      },
    })
  }

  /**
   * Dashboard Directeur
   */
  private async getDirectorDashboard({ auth, response }: HttpContext) {
    const schoolId = auth.user!.schoolId
    const monthStart = DateTime.now().startOf('month').toSQLDate()

    const [students, teachers, classes, performance, attendance] = await Promise.all([
      Student.query()
        .where('school_id', schoolId!)
        .where('academic_status', 'active')
        .count('* as total')
        .first(),
      User.query()
        .where('school_id', schoolId!)
        .where('role', 'teacher')
        .where('status', 'active')
        .count('* as total')
        .first(),
      db
        .from('classes')
        .where('school_id', schoolId!)
        .whereNull('archived_at')
        .count('* as total')
        .first(),
      db
        .from('grades')
        .innerJoin('students', 'grades.student_id', 'students.id')
        .where('students.school_id', schoolId!)
        .avg('score as average')
        .first(),
      db
        .from('attendances')
        .innerJoin('students', 'attendances.student_id', 'students.id')
        .where('students.school_id', schoolId!)
        .where('attendances.date', '>=', monthStart)
        .select(
          db.raw(
            "sum(case when attendances.status in ('present', 'excused') then 1 else 0 end) as present_total"
          )
        )
        .count('* as total')
        .first(),
    ])
    const attendanceTotal = Number(attendance?.total || 0)
    const presentAttendanceTotal = Number(attendance?.present_total || 0)

    return response.ok({
      success: true,
      stats: {
        students: Number(students?.$extras.total || 0),
        teachers: Number(teachers?.$extras.total || 0),
        classes: Number(classes?.total || 0),
        attendanceRate: attendanceTotal
          ? Math.round((presentAttendanceTotal / attendanceTotal) * 100)
          : 0,
        averageGrade: Number(performance?.average || 0),
      },
    })
  }

  /**
   * Dashboard Enseignant
   */
  private async getTeacherDashboard({ auth, response }: HttpContext) {
    const userId = auth.user!.id

    const myClasses = await db
      .from('classes')
      .where('teacher_id', userId)
      .whereNull('archived_at')
      .select('id')
    const classIds = myClasses.map((c) => c.id)

    const [students, assignments, pendingSubmissions] = await Promise.all([
      db.from('students').whereIn('class_id', classIds).count('* as total').first(),
      db
        .from('assignments')
        .where('teacher_id', userId)
        .where('status', 'published')
        .count('* as total')
        .first(),
      db
        .from('assignment_submissions')
        .whereIn('assignment_id', db.from('assignments').select('id').where('teacher_id', userId))
        .where('status', 'submitted')
        .count('* as total')
        .first(),
    ])

    return response.ok({
      success: true,
      stats: {
        myClasses: myClasses.length,
        myStudents: Number(students?.total || 0),
        assignments: Number(assignments?.total || 0),
        pendingSubmissions: Number(pendingSubmissions?.total || 0),
      },
    })
  }

  /**
   * Dashboard Parent
   */
  private async getParentDashboard({ auth, response }: HttpContext) {
    const userId = auth.user!.id

    const children = await db
      .from('parent_student')
      .join('students', 'parent_student.student_id', 'students.id')
      .where('parent_student.parent_id', db.from('parents').select('id').where('user_id', userId))
      .select('students.*')

    const childIds = children.map((c) => c.id)

    const [averageGrades, pendingPayments] = await Promise.all([
      db.from('grades').whereIn('student_id', childIds).avg('score as average').first(),
      db
        .from('fee_payments')
        .whereIn('student_id', childIds)
        .where('status', 'pending')
        .sum('amount as total')
        .first(),
    ])

    return response.ok({
      success: true,
      stats: {
        childrenCount: children.length,
        children,
        averageGrade: Number(averageGrades?.average || 0),
        pendingPayments: Number(pendingPayments?.total || 0),
      },
    })
  }

  /**
   * Dashboard Étudiant
   */
  private async getStudentDashboard({ auth, response }: HttpContext) {
    const userId = auth.user!.id
    const student = await Student.query().where('user_id', userId).first()

    if (!student) {
      return response.notFound({ success: false, message: 'Profil étudiant non trouvé' })
    }

    const [grades, assignments, completed] = await Promise.all([
      db.from('grades').where('student_id', student.id).avg('score as average').first(),
      db
        .from('assignments')
        .where('class_id', student.classId!)
        .where('status', 'published')
        .count('* as total')
        .first(),
      db
        .from('assignment_submissions')
        .where('student_id', student.id)
        .where('status', 'submitted')
        .count('* as total')
        .first(),
    ])

    return response.ok({
      success: true,
      stats: {
        averageGrade: Number(grades?.average || 0),
        assignments: Number(assignments?.total || 0),
        completedAssignments: Number(completed?.total || 0),
        attendanceRate: 0,
      },
    })
  }

  /**
   * Statistiques scolaires détaillées
   */
  public async getAcademicStats({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(getAcademicStatsValidator)
    const schoolId = auth.user!.schoolId

    const stats = await db
      .from('grades')
      .join('students', 'grades.student_id', 'students.id')
      .join('subjects', 'grades.subject_id', 'subjects.id')
      .where('students.school_id', schoolId!)
      .if(payload.classId, (q) => q.where('grades.class_id', payload.classId!))
      .if(payload.term, (q) => q.where('grades.term', payload.term!))
      .if(payload.academicYear, (q) => q.where('grades.academic_year', payload.academicYear!))
      .select('subjects.name as subject')
      .avg('grades.score as average')
      .groupBy('subjects.name')

    return response.ok({ success: true, stats })
  }

  /**
   * Statistiques financières
   */
  public async getFinancialStats({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(getFinancialStatsValidator)
    const schoolId = auth.user!.schoolId

    const query = db
      .from('fee_payments')
      .join('school_fees', 'fee_payments.fee_id', 'school_fees.id')
      .where('school_fees.school_id', schoolId!)

    if (payload.startDate)
      query.where('fee_payments.payment_date', '>=', payload.startDate.toJSDate())
    if (payload.endDate) query.where('fee_payments.payment_date', '<=', payload.endDate.toJSDate())

    const [totalCollected, breakdown] = await Promise.all([
      query.clone().sum('amount_paid as total').first(),
      query
        .clone()
        .select('school_fees.fee_type')
        .sum('amount_paid as total')
        .groupBy('school_fees.fee_type'),
    ])

    return response.ok({
      success: true,
      stats: {
        totalCollected: Number(totalCollected?.total || 0),
        breakdown,
      },
    })
  }

  /**
   * Performance des classes
   */
  public async getPerformanceStats({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(getPerformanceStatsValidator)
    const schoolId = auth.user!.schoolId

    const stats = await db
      .from('grades')
      .join('students', 'grades.student_id', 'students.id')
      .join('classes', 'students.class_id', 'classes.id')
      .where('students.school_id', schoolId!)
      .if(payload.classId, (q) => q.where('students.class_id', payload.classId!))
      .if(payload.subjectId, (q) => q.where('grades.subject_id', payload.subjectId!))
      .if(payload.term, (q) => q.where('grades.term', payload.term!))
      .select('classes.name as class')
      .avg('grades.score as average')
      .groupBy('classes.name')
      .orderBy('average', 'desc')

    return response.ok({ success: true, stats })
  }
}
