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

export default class DashboardController {
  public async workspace({ auth, request, response, view }: HttpContext) {
    const user = auth.getUserOrFail()

    if (user.role === 'inspection') {
      return response.redirect('/inspection/dashboard')
    }

    if (user.role === 'director') return this.directorDashboardPage({ auth, view })
    if (user.role === 'teacher') return this.teacherDashboardPage({ auth, view })
    if (user.role === 'parent') return this.parentDashboardPage({ auth, view })
    if (user.role === 'student') return this.studentDashboardPage({ auth, view })
    if (user.role === 'finance_director') return this.financeDashboardPage({ auth, request, view })
    if (user.role === 'discipline_director') return response.redirect('/discipline')

    const roleLabels: Record<string, string> = {
      director: "Direction d'école",
      finance_director: 'Direction financière',
      discipline_director: 'Direction de discipline',
      teacher: 'Enseignant',
      parent: 'Parent',
      student: 'Élève',
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

  private async directorDashboardPage({ auth, view }: Pick<HttpContext, 'auth' | 'view'>) {
    const user = auth.getUserOrFail()
    const schoolId = user.schoolId
    const school = schoolId ? await School.find(schoolId) : null
    const monthStart = DateTime.now().startOf('month').toSQLDate()
    const [students, newStudents, teachers, classes] = await Promise.all([
      Student.query().where('schoolId', schoolId).where('academicStatus', 'active').count('* as total').first(),
      Student.query().where('schoolId', schoolId).where('createdAt', '>=', monthStart).count('* as total').first(),
      User.query().where('schoolId', schoolId).where('role', 'teacher').where('status', 'active').count('* as total').first(),
      Class.query().where('schoolId', schoolId).orderBy('gradeLevel', 'asc').orderBy('name', 'asc'),
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

    return view.render('dashboard/director', {
      school: school || this.getFallbackSchool(user),
      stats: {
        students: Number(students?.$extras.total || 0),
        newStudents: Number(newStudents?.$extras.total || 0),
        teachers: Number(teachers?.$extras.total || 0),
        classes: classes.length,
        attendanceRate: this.calculateAttendanceRate(null),
      },
      alerts: [],
      upcomingEvents: [],
      classes,
      classPerformance: classes.map((classObj) => ({
        id: classObj.id,
        name: classObj.name,
        studentsCount: studentsByClass.get(classObj.id) || 0,
        averageGrade: '-',
        attendanceRate: 0,
      })),
    })
  }

  private async teacherDashboardPage({ auth, view }: Pick<HttpContext, 'auth' | 'view'>) {
    const user = auth.getUserOrFail()
    const teacher = await Teacher.query().where('userId', user.id).first()
    const classes = teacher ? await Class.query().where('teacherId', teacher.id).orderBy('name', 'asc') : []
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
        ...child,
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
        lastName: user.lastName,
        className: studentProfile?.class?.name || 'Non affecté',
        schoolName: studentProfile?.school?.name || 'Gestion Éducative RDC',
        registrationNumber: studentProfile?.registrationNumber || '-',
        birthDate: studentProfile?.birthDate?.toFormat('dd/MM/yyyy') || '-',
        parentName: '-',
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

    const [students, teachers, classes, performance] = await Promise.all([
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
      db.from('classes').where('school_id', schoolId!).count('* as total').first(),
      db
        .from('grades')
        .innerJoin('students', 'grades.student_id', 'students.id')
        .where('students.school_id', schoolId!)
        .avg('score as average')
        .first(),
    ])

    return response.ok({
      success: true,
      stats: {
        students: Number(students?.$extras.total || 0),
        teachers: Number(teachers?.$extras.total || 0),
        classes: Number(classes?.total || 0),
        attendanceRate: 0,
        averageGrade: Number(performance?.average || 0),
      },
    })
  }

  /**
   * Dashboard Enseignant
   */
  private async getTeacherDashboard({ auth, response }: HttpContext) {
    const userId = auth.user!.id

    const myClasses = await db.from('classes').where('teacher_id', userId).select('id')
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

  private calculateAttendanceRate(rate: any): number {
    return rate ? 85 : 0 // Ta logique simplifiée conservée
  }

  /**
   * Statistiques académiques détaillées
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
