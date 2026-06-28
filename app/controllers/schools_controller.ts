import { type HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import School from '#models/school'
import User from '#models/user'
import Student from '#models/student'
import Teacher from '#models/teacher'
import Parent from '#models/parent'
import Class from '#models/class'
import Subject from '#models/subject'
import OtpMailService from '#services/otp_mail_service'
import vine from '@vinejs/vine'
import crypto from 'node:crypto'
import { DateTime } from 'luxon'
import {
  RDC_CLASS_CATALOG,
  RDC_SCHOOL_OPTIONS,
  getClassSchoolOption,
  isHumanitiesClass,
  resolveEnrollmentClass,
} from '#services/school_class_service'
import {
  POSITION_BASE_ROLES,
  SECTION_POSITION_OPTIONS,
  SCHOOL_POSITIONS,
  canCreatePosition,
  getGovernanceContext,
  isSchoolWidePosition,
  listSchoolSections,
  positionLabel,
  type SchoolPosition,
} from '#services/school_governance_service'

export default class SchoolController {
  private mailService = new OtpMailService()

  private getPaginationMeta(paginator: { toJSON: () => any }) {
    const meta = paginator.toJSON().meta

    return {
      total: meta.total,
      perPage: meta.perPage,
      currentPage: meta.currentPage,
      lastPage: meta.lastPage,
      from: meta.total ? (meta.currentPage - 1) * meta.perPage + 1 : 0,
      to: Math.min(meta.currentPage * meta.perPage, meta.total),
    }
  }

  private getFallbackSchool(user: { schoolId?: string | null }) {
    return {
      id: user.schoolId,
      name: 'Gestion Éducative RDC',
    }
  }

  private getRoleLabel(role: User['role']) {
    const labels: Record<User['role'], string> = {
      inspection: 'Inspection',
      director: "Direction d'école",
      finance_director: 'Direction financière',
      teacher: 'Enseignant',
      parent: 'Parent',
      student: 'Élève',
      discipline_director: 'Direction de discipline',
      secretary: 'Secrétariat',
    }

    return labels[role]
  }

  private async getSchoolName(schoolId?: string | null) {
    if (!schoolId) return 'Gestion Éducative RDC'
    const school = await School.find(schoolId)
    return school?.name || 'Gestion Éducative RDC'
  }

  /**
   * Enregistrer une nouvelle école (demande d'inscription)
   */
  public async registerSchool({ request, response, session }: HttpContext) {
    const schema = vine.compile(
      vine.object({
        name: vine.string().trim().maxLength(255).unique({ table: 'schools', column: 'name' }),
        province: vine.string(),
        territory: vine.string(),
        address: vine.string(),
        phone: vine.string(),
        email: vine.string().email().unique({ table: 'schools', column: 'email' }),
        directorName: vine.string().trim().minLength(2),
        directorPhone: vine.string(),
        directorEmail: vine
          .string()
          .email()
          .unique({ table: 'users', column: 'email' })
          .unique({ table: 'schools', column: 'director_email' }),
      })
    )

    const validatedData = await request.validateUsing(schema)

    // Générer un code unique pour l'école
    const schoolCode = `SCH-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`

    let school: School
    await db.transaction(async (trx) => {
      school = new School()
      school.useTransaction(trx)
      school.merge({
        name: validatedData.name,
        code: schoolCode,
        province: validatedData.province,
        territory: validatedData.territory,
        address: validatedData.address,
        phone: validatedData.phone,
        email: validatedData.email,
        directorName: validatedData.directorName.trim(),
        directorPhone: validatedData.directorPhone.trim(),
        directorEmail: validatedData.directorEmail.trim().toLowerCase(),
        status: 'pending',
      })
      await school.save()

      // Notifier l'inspection sans creer le compte directeur avant approbation.
      const inspectors = await trx
        .from('users')
        .where('role', 'inspection')
        .where('status', 'active')
        .select('id')

      if (inspectors.length) {
        await trx.table('messages').insert(
          inspectors.map((inspector) => ({
            sender_id: null,
            receiver_id: inspector.id,
            school_id: school.id,
            subject: "Nouvelle demande d'inscription d'école",
            content: `L'ecole ${school.name} a soumis une demande d'inscription. Elle attend une validation dans la liste des ecoles en attente.`,
            type: 'system',
            is_global: false,
            is_read: false,
            has_attachment: false,
            created_at: new Date(),
            updated_at: new Date(),
          }))
        )
      }
    })

    const result = {
      success: true,
      message: "Demande d'inscription soumise avec succès. En attente d'approbation.",
      school: {
        id: school!.id,
        name: school!.name,
        code: school!.code,
        status: school!.status,
      },
    }

    if (request.header('accept')?.includes('text/html')) {
      session.flash('success', result.message)
      return response.redirect('/login')
    }

    return response.created(result)
  }

  /**
   * Dashboard de l'école
   */
  public async dashboard({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (!user.schoolId) {
      return response.badRequest({ success: false, message: 'Utilisateur non associé à une école' })
    }

    const school = await School.findOrFail(user.schoolId)

    // Statistiques avec Lucid 22 (Aggregate queries)
    const [studentsCount] = await Student.query()
      .where('schoolId', school.id)
      .where('academicStatus', 'active')
      .count('* as total')
    const [teachersCount] = await Teacher.query().where('schoolId', school.id).count('* as total')
    const [classesCount] = await Class.query()
      .where('schoolId', school.id)
      .whereNull('archivedAt')
      .count('* as total')

    const recentStudents = await Student.query()
      .where('schoolId', school.id)
      .orderBy('createdAt', 'desc')
      .limit(5)
      .preload('user')

    // Note: 'receivedMessages' doit être défini dans ton modèle User
    const recentMessages = await user
      .related('receivedMessages')
      .query()
      .orderBy('createdAt', 'desc')
      .limit(5)

    const totalStudents = Number(studentsCount.$extras.total)
    const totalClasses = Number(classesCount.$extras.total)

    return response.ok({
      success: true,
      school: school.serialize(),
      stats: {
        totalStudents,
        totalTeachers: Number(teachersCount.$extras.total),
        totalClasses,
        averageClassSize: totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0,
      },
      recentActivities: {
        students: recentStudents.map((s) => ({
          id: s.id,
          name: s.user.fullName,
          registrationNumber: s.registrationNumber,
          enrolledAt: s.createdAt,
        })),
        messages: recentMessages,
      },
      userRole: user.role,
    })
  }

  /**
   * Mettre à jour le profil de l'école
   */
  public async updateSchoolProfile({ request, auth, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const school = await School.findOrFail(user.schoolId)

    const schema = vine.compile(
      vine.object({
        name: vine.string().optional(),
        province: vine.string().optional(),
        territory: vine.string().optional(),
        address: vine.string().optional(),
        phone: vine.string().optional(),
        email: vine.string().email().optional(),
        logoUrl: vine.string().optional(),
      })
    )

    const data = await request.validateUsing(schema)
    school.merge({
      ...data,
      hasElectricity: request.input('hasElectricity') === 'on',
      hasInternet: request.input('hasInternet') === 'on',
      hasLibrary: request.input('hasLibrary') === 'on',
    })
    await school.save()

    if (request.header('accept')?.includes('text/html')) {
      session.flash('success', "Profil de l'Ã©cole mis Ã  jour")
      return response.redirect('/schools/profile')
    }

    return response.ok({
      success: true,
      message: "Profil de l'école mis à jour",
      school,
    })
  }

  /**
   * Ajouter un enseignant
   */
  public async teachersPage({ auth, request, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const page = Number(request.input('page', 1))
    const status = request.input('status')
    const qualification = request.input('qualification')
    const search = String(request.input('search', '')).trim()

    const query = Teacher.query()
      .where('schoolId', user.schoolId)
      .preload('user')
      .if(status, (teacherQuery) => teacherQuery.where('status', status))
      .if(qualification, (teacherQuery) => teacherQuery.where('qualification', qualification))
      .if(search, (teacherQuery) => {
        teacherQuery.where((searchQuery) => {
          searchQuery
            .whereILike('employeeNumber', `%${search}%`)
            .orWhereHas('user', (userQuery) => {
              userQuery
                .whereILike('firstName', `%${search}%`)
                .orWhereILike('postnom', `%${search}%`)
                .orWhereILike('lastName', `%${search}%`)
                .orWhereILike('email', `%${search}%`)
            })
        })
      })
      .orderBy('createdAt', 'desc')

    const paginator = await query.paginate(page, 20)
    const teachers = paginator.all()
    const [total, active, qualified, assignmentRows, primaryClassRows] = await Promise.all([
      Teacher.query().where('schoolId', user.schoolId).count('* as total').first(),
      Teacher.query()
        .where('schoolId', user.schoolId)
        .where('status', 'active')
        .count('* as total')
        .first(),
      Teacher.query()
        .where('schoolId', user.schoolId)
        .whereNotNull('qualification')
        .whereNot('qualification', '')
        .count('* as total')
        .first(),
      db
        .from('class_subject')
        .join('classes', 'class_subject.class_id', 'classes.id')
        .where('classes.school_id', user.schoolId)
        .whereNull('classes.archived_at')
        .select(
          'class_subject.teacher_id',
          'class_subject.subject_id',
          'class_subject.class_id',
          'class_subject.hours_per_week'
        ),
      db
        .from('classes')
        .where('school_id', user.schoolId)
        .whereNull('archived_at')
        .whereNotNull('teacher_id')
        .select('teacher_id', 'id as class_id'),
    ])

    const workloadByTeacher = new Map<
      string,
      { subjects: Set<string>; classes: Set<string>; totalHours: number }
    >()
    const getWorkload = (teacherId: string) => {
      const existing = workloadByTeacher.get(teacherId)
      if (existing) return existing

      const workload = {
        subjects: new Set<string>(),
        classes: new Set<string>(),
        totalHours: 0,
      }
      workloadByTeacher.set(teacherId, workload)
      return workload
    }

    for (const row of assignmentRows) {
      if (!row.teacher_id) continue
      const workload = getWorkload(row.teacher_id)
      if (row.subject_id) workload.subjects.add(row.subject_id)
      if (row.class_id) workload.classes.add(row.class_id)
      workload.totalHours += Number(row.hours_per_week || 0)
    }

    for (const row of primaryClassRows) {
      if (!row.teacher_id) continue
      getWorkload(row.teacher_id).classes.add(row.class_id)
    }

    const assignedSubjects = new Set(
      assignmentRows.map((row) => row.subject_id).filter(Boolean)
    )
    const totalHours = assignmentRows.reduce(
      (sum, row) => sum + Number(row.hours_per_week || 0),
      0
    )

    return view.render('schools/teachers/index', {
      school: this.getFallbackSchool(user),
      teachers: teachers.map((teacher) => {
        const workload = workloadByTeacher.get(teacher.id)

        return {
          ...teacher.serialize(),
          user: teacher.user,
          subjectsCount: workload?.subjects.size || 0,
          classesCount: workload?.classes.size || 0,
          totalHours: workload?.totalHours || 0,
        }
      }),
      pagination: this.getPaginationMeta(paginator),
      url: '/schools/teachers',
      stats: {
        total: Number(total?.$extras.total || 0),
        active: Number(active?.$extras.total || 0),
        qualified: Number(qualified?.$extras.total || 0),
        subjectsCount: assignedSubjects.size,
        totalHours,
      },
    })
  }

  public async createTeacherPage({ auth, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const subjects = await Subject.query().orderBy('name', 'asc')

    return view.render('schools/teachers/create', {
      school: this.getFallbackSchool(user),
      subjects,
    })
  }

  public async listActiveTeachers({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const teachers = await Teacher.query()
      .where('schoolId', user.schoolId)
      .where('status', 'active')
      .preload('user')
      .orderBy('createdAt', 'desc')

    return response.ok({
      success: true,
      teachers: teachers.map((teacher) => ({
        id: teacher.id,
        user: {
          firstName: teacher.user.firstName,
          postnom: teacher.user.postnom,
          lastName: teacher.user.lastName,
          fullName: teacher.user.fullName,
        },
      })),
    })
  }

  private async getTeacherForDirector(teacherId: string, schoolId?: string | null) {
    if (!schoolId) {
      throw new Error("Votre compte n'est lie a aucune ecole.")
    }

    return Teacher.query()
      .where('id', teacherId)
      .where('schoolId', schoolId)
      .preload('user')
      .firstOrFail()
  }

  private async getTeacherAssignments(teacher: Teacher) {
    const subjectRows = await db
      .from('class_subject')
      .join('subjects', 'class_subject.subject_id', 'subjects.id')
      .where('class_subject.teacher_id', teacher.id)
      .select(
        'subjects.id as id',
        'subjects.name as name',
        'subjects.coefficient as coefficient',
        'class_subject.class_id as classId',
        'class_subject.hours_per_week as hoursPerWeek'
      )
      .orderBy('subjects.name', 'asc')

    const subjectsById = new Map<string, any>()
    for (const row of subjectRows) {
      const subjectId = row.id
      const hoursPerWeek = Number(row.hoursPerWeek ?? row.hours_per_week ?? 0)
      const current = subjectsById.get(subjectId)

      subjectsById.set(subjectId, {
        id: subjectId,
        name: row.name,
        coefficient: row.coefficient,
        hoursPerWeek: (current?.hoursPerWeek || 0) + hoursPerWeek,
      })
    }

    const linkedClassIds = [
      ...new Set(subjectRows.map((row) => row.classId ?? row.class_id).filter(Boolean)),
    ]
    const classesQuery = Class.query()
      .where('schoolId', teacher.schoolId)
      .whereNull('archivedAt')
      .where((query) => {
        query.where('teacherId', teacher.id)
        if (linkedClassIds.length) {
          query.orWhereIn('id', linkedClassIds)
        }
      })
      .orderBy('gradeLevel', 'asc')
      .orderBy('name', 'asc')

    const teacherClasses = await classesQuery
    const classIds = teacherClasses.map((classObj) => classObj.id)
    const studentCounts = classIds.length
      ? await db
          .from('students')
          .whereIn('class_id', classIds)
          .groupBy('class_id')
          .select('class_id')
          .count('* as total')
      : []
    const studentsCountByClass = new Map(
      studentCounts.map((row) => [row.class_id, Number(row.total || 0)])
    )

    for (const classObj of teacherClasses) {
      ;(classObj as any).studentsCount = studentsCountByClass.get(classObj.id) || 0
    }

    const teacherSubjects = [...subjectsById.values()]
    const totalStudents = teacherClasses.reduce(
      (total, classObj) => total + Number((classObj as any).studentsCount || 0),
      0
    )
    const totalHours = teacherSubjects.reduce(
      (total, subject) => total + Number(subject.hoursPerWeek || 0),
      0
    )

    ;(teacher as any).subjectIds = teacherSubjects.map((subject) => subject.id)
    ;(teacher as any).subjectsCount = teacherSubjects.length
    ;(teacher as any).classesCount = teacherClasses.length
    ;(teacher as any).totalStudents = totalStudents
    ;(teacher as any).totalHours = totalHours

    return {
      teacherSubjects,
      teacherClasses,
      subjectIds: teacherSubjects.map((subject) => subject.id),
      totalStudents,
      totalHours,
    }
  }

  public async showTeacherPage({ auth, params, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const teacher = await this.getTeacherForDirector(params.id, user.schoolId)
    const assignments = await this.getTeacherAssignments(teacher)
    const assignmentsCount = await db
      .from('assignments')
      .where('teacher_id', teacher.id)
      .count('* as total')
      .first()
    const classIds = assignments.teacherClasses.map((classObj) => classObj.id)
    const attendanceRows = classIds.length
      ? await db.from('attendances').whereIn('class_id', classIds).select('status')
      : []
    const presentRows = attendanceRows.filter(
      (row) => row.status === 'present' || row.status === 'excused'
    ).length
    const gradeRows = await db
      .from('grades')
      .join('class_subject', (join) => {
        join
          .on('grades.class_id', '=', 'class_subject.class_id')
          .andOn('grades.subject_id', '=', 'class_subject.subject_id')
      })
      .where('class_subject.teacher_id', teacher.id)
      .whereNotNull('grades.score')
      .select('grades.score', 'grades.max_score')
    const normalizedGrades = gradeRows
      .map((row) => {
        const score = Number(row.score)
        const maxScore = Number(row.max_score || 20)
        return Number.isFinite(score) && maxScore > 0 ? (score / maxScore) * 20 : null
      })
      .filter((score): score is number => score !== null)
    const averageGradeGiven = normalizedGrades.length
      ? Math.round(
          (normalizedGrades.reduce((total, score) => total + score, 0) / normalizedGrades.length) *
            10
        ) / 10
      : null
    const evaluationRows = await db
      .from('teacher_evaluations')
      .leftJoin('users', 'teacher_evaluations.evaluator_id', 'users.id')
      .where('teacher_evaluations.teacher_id', teacher.id)
      .select(
        'teacher_evaluations.evaluation_date',
        'teacher_evaluations.score',
        'teacher_evaluations.comments',
        'users.first_name',
        'users.postnom',
        'users.last_name'
      )
      .orderBy('teacher_evaluations.evaluation_date', 'desc')
      .limit(5)

    ;(teacher as any).assignmentsCount = Number(assignmentsCount?.total || 0)
    ;(teacher as any).mainClasses =
      assignments.teacherClasses
        .filter((classObj) => classObj.teacherId === teacher.id)
        .map((classObj) => classObj.name)
        .join(', ') || 'Aucune'
    ;(teacher as any).attendanceRate = attendanceRows.length
      ? Math.round((presentRows / attendanceRows.length) * 100)
      : 0
    ;(teacher as any).averageGradeGiven = averageGradeGiven

    return view.render('schools/teachers/show', {
      school: this.getFallbackSchool(user),
      teacher,
      teacherSubjects: assignments.teacherSubjects,
      teacherClasses: assignments.teacherClasses,
      evaluations: evaluationRows.map((evaluation) => ({
        date: DateTime.fromJSDate(new Date(evaluation.evaluation_date)).toFormat('dd/MM/yyyy'),
        inspector:
          [evaluation.first_name, evaluation.last_name, evaluation.postnom]
            .filter(Boolean)
            .join(' ') || 'Inspection',
        comments: evaluation.comments || 'Aucun commentaire',
        score: Number(evaluation.score || 0),
      })),
    })
  }

  public async editTeacherPage({ auth, params, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const teacher = await this.getTeacherForDirector(params.id, user.schoolId)
    const assignments = await this.getTeacherAssignments(teacher)
    const [subjects, replacementTeachers] = await Promise.all([
      Subject.query().orderBy('name', 'asc'),
      Teacher.query()
        .where('schoolId', user.schoolId)
        .where('status', 'active')
        .whereNot('id', teacher.id)
        .preload('user')
        .orderBy('createdAt', 'desc'),
    ])

    ;(teacher as any).subjectIds = assignments.subjectIds

    return view.render('schools/teachers/edit', {
      school: this.getFallbackSchool(user),
      teacher,
      subjects,
      replacementTeachers,
    })
  }

  private getDurationHours(startTime: string, endTime: string) {
    const [startHour, startMinute] = String(startTime).split(':').map(Number)
    const [endHour, endMinute] = String(endTime).split(':').map(Number)
    const start = startHour * 60 + (startMinute || 0)
    const end = endHour * 60 + (endMinute || 0)
    return Math.max((end - start) / 60, 0)
  }

  public async scheduleTeacherPage({ auth, params, request, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const teacher = await this.getTeacherForDirector(params.id, user.schoolId)
    const now = DateTime.now()
    const selectedYear = Number(request.input('year', now.weekYear))
    const selectedWeek = Number(request.input('week', now.weekNumber))
    const weekStart = DateTime.fromObject({
      weekYear: selectedYear,
      weekNumber: selectedWeek,
      weekday: 1,
    })
    const weekEnd = weekStart.plus({ days: 4 })
    const [entries, assignmentRows] = await Promise.all([
      db
        .from('timetables')
        .join('subjects', 'timetables.subject_id', 'subjects.id')
        .join('classes', 'timetables.class_id', 'classes.id')
        .where('timetables.teacher_id', teacher.id)
        .where('classes.school_id', teacher.schoolId)
        .whereNull('classes.archived_at')
        .select(
          'timetables.day_of_week',
          'timetables.start_time',
          'timetables.end_time',
          'timetables.room',
          'subjects.id as subject_id',
          'subjects.name as subject_name',
          'classes.id as class_id',
          'classes.name as class_name'
        )
        .orderBy('timetables.start_time', 'asc')
        .orderBy('timetables.day_of_week', 'asc'),
      db
        .from('class_subject')
        .join('subjects', 'class_subject.subject_id', 'subjects.id')
        .join('classes', 'class_subject.class_id', 'classes.id')
        .where('class_subject.teacher_id', teacher.id)
        .where('classes.school_id', teacher.schoolId)
        .whereNull('classes.archived_at')
        .select(
          'class_subject.id',
          'class_subject.hours_per_week',
          'subjects.id as subject_id',
          'subjects.name as subject_name',
          'classes.id as class_id',
          'classes.name as class_name'
        )
        .orderBy('classes.grade_level', 'asc')
        .orderBy('classes.name', 'asc')
        .orderBy('subjects.name', 'asc'),
    ])

    const dayKeys: Record<
      number,
      'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'
    > = {
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday',
    }
    const defaultTimes = ['07:30-08:20', '08:20-09:10', '09:30-10:20', '10:20-11:10', '11:10-12:00']
    const timeSlots = [
      ...new Set(
        entries.length
          ? entries.map(
              (entry) =>
                `${String(entry.start_time).slice(0, 5)}-${String(entry.end_time).slice(0, 5)}`
            )
          : defaultTimes
      ),
    ].sort()
    const timetable = timeSlots.map((time) => ({
      time,
      monday: { class: '', content: null as any },
      tuesday: { class: '', content: null as any },
      wednesday: { class: '', content: null as any },
      thursday: { class: '', content: null as any },
      friday: { class: '', content: null as any },
      saturday: { class: '', content: null as any },
    }))
    const rowByTime = new Map(timetable.map((slot) => [slot.time, slot]))
    const summary: Record<string, number> = {
      totalHours: 0,
      classesCount: 0,
      subjectsCount: 0,
      mondayHours: 0,
      tuesdayHours: 0,
      wednesdayHours: 0,
      thursdayHours: 0,
      fridayHours: 0,
      saturdayHours: 0,
    }
    const classIds = new Set<string>()
    const subjectIds = new Set<string>()

    for (const entry of entries) {
      const time = `${String(entry.start_time).slice(0, 5)}-${String(entry.end_time).slice(0, 5)}`
      const dayKey = dayKeys[Number(entry.day_of_week)]
      const row = rowByTime.get(time)
      if (!dayKey || !row) continue

      row[dayKey] = {
        class: 'bg-blue-50 dark:bg-blue-900/20',
        content: {
          subject: entry.subject_name,
          class: entry.class_name,
          room: entry.room || '-',
        },
      }

      const hours = this.getDurationHours(entry.start_time, entry.end_time)
      summary.totalHours += hours
      summary[`${dayKey}Hours`] += hours
      classIds.add(entry.class_id)
      subjectIds.add(entry.subject_id)
    }

    const assignedClassIds = new Set<string>()
    const assignedSubjectIds = new Set<string>()
    let assignedHours = 0
    const scheduledPairs = new Set(
      entries.map((entry) => `${entry.class_id}:${entry.subject_id}`)
    )
    const assignedCourses = assignmentRows.map((assignment) => {
      assignedClassIds.add(assignment.class_id)
      assignedSubjectIds.add(assignment.subject_id)
      assignedHours += Number(assignment.hours_per_week || 0)

      return {
        id: assignment.id,
        classId: assignment.class_id,
        className: assignment.class_name,
        subjectId: assignment.subject_id,
        subjectName: assignment.subject_name,
        hoursPerWeek: Number(assignment.hours_per_week || 0),
        scheduled: scheduledPairs.has(`${assignment.class_id}:${assignment.subject_id}`),
      }
    })

    summary.plannedHours = Math.round(summary.totalHours * 10) / 10
    summary.totalHours = Math.round(assignedHours * 10) / 10
    summary.classesCount = assignedClassIds.size || classIds.size
    summary.subjectsCount = assignedSubjectIds.size || subjectIds.size

    const weeks = Array.from({ length: 9 }, (_, index) => {
      const date = now.plus({ weeks: index - 4 })
      return {
        value: `${date.weekYear}-W${String(date.weekNumber).padStart(2, '0')}`,
        label: `Semaine ${date.weekNumber}`,
        selected: date.weekYear === selectedYear && date.weekNumber === selectedWeek,
      }
    })

    return view.render('schools/teachers/schedule', {
      school: this.getFallbackSchool(user),
      teacher,
      weekRange: `${weekStart.toFormat('dd/MM/yyyy')} - ${weekEnd.toFormat('dd/MM/yyyy')}`,
      weeks,
      timetable,
      summary,
      assignedCourses,
      hasScheduledEntries: entries.length > 0,
      availabilities: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'].map((day) => ({
        day,
        slots: 'Sur rendez-vous',
        available: true,
      })),
    })
  }

  public async updateTeacher({ auth, params, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const teacher = await this.getTeacherForDirector(params.id, user.schoolId)
    const schema = vine.compile(
      vine.object({
        firstName: vine.string().trim(),
        postnom: vine.string().trim(),
        lastName: vine.string().trim(),
        phone: vine.string().trim().optional(),
        qualification: vine.string().trim(),
        specialization: vine.string().trim().optional(),
        status: vine.enum(['active', 'on_leave', 'terminated']),
        subjects: vine.array(vine.string()).optional(),
      })
    )
    const payload = await request.validateUsing(schema)
    const selectedSubjectIds = payload.subjects || []

    await db.transaction(async (trx) => {
      teacher.user.useTransaction(trx)
      teacher.user.firstName = payload.firstName
      teacher.user.postnom = payload.postnom
      teacher.user.lastName = payload.lastName
      teacher.user.phone = payload.phone || null
      teacher.user.status = payload.status === 'terminated' ? 'inactive' : 'active'
      await teacher.user.save()

      teacher.useTransaction(trx)
      teacher.qualification = payload.qualification
      teacher.specialization = payload.specialization || ''
      teacher.status = payload.status
      await teacher.save()

      if (payload.status === 'terminated') {
        await trx.from('class_subject').where('teacher_id', teacher.id).update({
          teacher_id: null,
          updated_at: new Date(),
        })
        await trx.from('classes').where('teacher_id', teacher.id).update({
          teacher_id: null,
          updated_at: new Date(),
        })
        await trx.from('timetables').where('teacher_id', teacher.id).update({
          teacher_id: null,
          updated_at: new Date(),
        })
        await trx
          .from('assignments')
          .where('teacher_id', teacher.id)
          .whereIn('status', ['draft', 'published'])
          .update({ status: 'closed', updated_at: new Date() })
      }

      if (selectedSubjectIds.length) {
        await trx
          .from('class_subject')
          .where('teacher_id', teacher.id)
          .whereNotIn('subject_id', selectedSubjectIds)
          .update({ teacher_id: null, updated_at: new Date() })
      } else {
        await trx
          .from('class_subject')
          .where('teacher_id', teacher.id)
          .update({ teacher_id: null, updated_at: new Date() })
      }
    })

    session.flash('success', 'Enseignant modifie avec succes.')
    return response.redirect(`/schools/teachers/${teacher.id}`)
  }

  public async deleteTeacher({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const teacher = await this.getTeacherForDirector(params.id, user.schoolId)

    await db.transaction(async (trx) => {
      await trx.from('class_subject').where('teacher_id', teacher.id).update({
        teacher_id: null,
        updated_at: new Date(),
      })
      await trx.from('classes').where('teacher_id', teacher.id).update({
        teacher_id: null,
        updated_at: new Date(),
      })
      await trx.from('timetables').where('teacher_id', teacher.id).update({
        teacher_id: null,
        updated_at: new Date(),
      })
      await trx
        .from('assignments')
        .where('teacher_id', teacher.id)
        .whereIn('status', ['draft', 'published'])
        .update({ status: 'closed', updated_at: new Date() })

      teacher.useTransaction(trx)
      teacher.status = 'terminated'
      await teacher.save()

      teacher.user.useTransaction(trx)
      teacher.user.status = 'inactive'
      await teacher.user.save()
    })

    return response.ok({ success: true, message: 'Enseignant desactive avec succes.' })
  }

  public async replaceTeacher({ auth, params, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const teacher = await this.getTeacherForDirector(params.id, user.schoolId)
    const schema = vine.compile(
      vine.object({
        replacementTeacherId: vine.string().trim(),
      })
    )
    const payload = await request.validateUsing(schema)

    if (teacher.status === 'terminated') {
      session.flash('error', 'Cet enseignant est déjà désactivé.')
      return response.redirect().back()
    }

    if (payload.replacementTeacherId === teacher.id) {
      session.flash('error', 'Un enseignant ne peut pas se remplacer lui-même.')
      return response.redirect().back()
    }

    const replacement = await Teacher.query()
      .where('id', payload.replacementTeacherId)
      .where('schoolId', user.schoolId)
      .where('status', 'active')
      .preload('user')
      .first()

    if (!replacement) {
      session.flash('error', "Le remplaçant doit être un enseignant actif de votre établissement.")
      return response.redirect().back()
    }

    const activeClassRows = await db
      .from('classes')
      .where('school_id', user.schoolId)
      .whereNull('archived_at')
      .select('id')
    const activeClassIds = activeClassRows.map((classObj) => classObj.id)
    const [outgoingTimetable, replacementTimetable] = await Promise.all([
      activeClassIds.length
        ? db
            .from('timetables')
            .whereIn('class_id', activeClassIds)
            .where('teacher_id', teacher.id)
            .select(
              'academic_year',
              'term',
              'shift',
              'day_of_week',
              'start_time',
              'end_time'
            )
        : [],
      db
        .from('timetables')
        .where('teacher_id', replacement.id)
        .select(
          'academic_year',
          'term',
          'shift',
          'day_of_week',
          'start_time',
          'end_time'
        ),
    ])
    const hasScheduleConflict = outgoingTimetable.some((outgoing) =>
      replacementTimetable.some(
        (existing) =>
          existing.academic_year === outgoing.academic_year &&
          existing.term === outgoing.term &&
          existing.shift === outgoing.shift &&
          Number(existing.day_of_week) === Number(outgoing.day_of_week) &&
          String(existing.start_time) < String(outgoing.end_time) &&
          String(existing.end_time) > String(outgoing.start_time)
      )
    )

    if (hasScheduleConflict) {
      session.flash(
        'error',
        `Le remplacement est impossible : l'emploi du temps de ${replacement.user.fullName} contient un créneau en conflit.`
      )
      return response.redirect().back()
    }

    const transferred = {
      mainClasses: 0,
      courses: 0,
      timetableEntries: 0,
      activeAssignments: 0,
    }
    const affectedRows = (result: number | any[]) =>
      Array.isArray(result) ? result.length : Number(result || 0)

    await db.transaction(async (trx) => {
      if (activeClassIds.length) {
        transferred.mainClasses = affectedRows(
          await trx
            .from('classes')
            .whereIn('id', activeClassIds)
            .where('teacher_id', teacher.id)
            .update({ teacher_id: replacement.id, updated_at: new Date() })
        )

        transferred.courses = affectedRows(
          await trx
            .from('class_subject')
            .whereIn('class_id', activeClassIds)
            .where('teacher_id', teacher.id)
            .update({ teacher_id: replacement.id, updated_at: new Date() })
        )

        transferred.timetableEntries = affectedRows(
          await trx
            .from('timetables')
            .whereIn('class_id', activeClassIds)
            .where('teacher_id', teacher.id)
            .update({ teacher_id: replacement.id, updated_at: new Date() })
        )

        transferred.activeAssignments = affectedRows(
          await trx
            .from('assignments')
            .whereIn('class_id', activeClassIds)
            .where('teacher_id', teacher.id)
            .whereIn('status', ['draft', 'published'])
            .update({ teacher_id: replacement.id, updated_at: new Date() })
        )
      }

      teacher.useTransaction(trx)
      teacher.status = 'terminated'
      await teacher.save()

      teacher.user.useTransaction(trx)
      teacher.user.status = 'inactive'
      await teacher.user.save()
    })

    session.flash(
      'success',
      `${teacher.user.fullName} a été remplacé par ${replacement.user.fullName} : ` +
        `${transferred.mainClasses} classe(s), ${transferred.courses} cours, ` +
        `${transferred.timetableEntries} créneau(x) et ${transferred.activeAssignments} devoir(s) transféré(s).`
    )

    return response.redirect(`/schools/teachers/${replacement.id}`)
  }

  public async resetTeacherPassword({
    auth,
    params,
    request,
    response,
    view,
  }: HttpContext) {
    const user = auth.getUserOrFail()
    const teacher = await this.getTeacherForDirector(params.id, user.schoolId)
    const tempPassword = crypto.randomBytes(8).toString('hex')
    const schoolName = await this.getSchoolName(user.schoolId)

    teacher.user.password = tempPassword
    teacher.user.mustChangePassword = true
    await teacher.user.save()

    let emailDelivery = {
      sent: true,
      message: `Les nouveaux identifiants ont été envoyés à ${teacher.user.email}.`,
    }

    try {
      await this.mailService.sendAccountCredentials({
        to: teacher.user.email,
        schoolName,
        fullName: teacher.user.fullName,
        roleLabel: 'Enseignant',
        email: teacher.user.email,
        password: tempPassword,
      })
    } catch (error) {
      emailDelivery = {
        sent: false,
        message:
          error instanceof Error
            ? `Mot de passe réinitialisé, mais email non envoyé : ${error.message}`
            : 'Mot de passe réinitialisé, mais email non envoyé.',
      }
    }

    const credentials = {
      fullName: teacher.user.fullName,
      role: teacher.user.role,
      roleLabel: 'Enseignant',
      email: teacher.user.email,
      password: tempPassword,
      schoolName,
      profileReference: teacher.employeeNumber,
      createdAt: DateTime.now().toFormat('dd/MM/yyyy HH:mm'),
    }

    if (request.accepts(['html', 'json']) === 'html') {
      return view.render('schools/accounts/credentials', {
        school: this.getFallbackSchool(user),
        credentials,
        emailDelivery,
      })
    }

    return response.ok({
      success: true,
      message: emailDelivery.sent
        ? 'Nouveau mot de passe envoyé par email.'
        : 'Nouveau mot de passe généré, mais email non envoyé.',
      credentials: {
        email: credentials.email,
        temporaryPassword: credentials.password,
      },
      emailDelivery,
    })
  }

  public async addTeacher({ request, auth, response, view }: HttpContext) {
    const user = auth.getUserOrFail()

    const schema = vine.compile(
      vine.object({
        firstName: vine.string(),
        postnom: vine.string(),
        lastName: vine.string(),
        email: vine.string().email().unique({ table: 'users', column: 'email' }),
        phone: vine.string(),
        qualification: vine.string(),
        specialization: vine.string(),
      })
    )

    const data = await request.validateUsing(schema)
    const tempPassword = crypto.randomBytes(8).toString('hex')

    // Créer l'utilisateur via transaction recommandée en Lucid 22
    const teacherUser = await User.create({
      schoolId: user.schoolId,
      email: data.email,
      password: tempPassword,
      firstName: data.firstName,
      postnom: data.postnom,
      lastName: data.lastName,
      phone: data.phone,
      role: 'teacher',
      status: 'active',
      mustChangePassword: true,
    })

    const employeeNumber = `TCH-${String(user.schoolId).slice(0, 4)}-${Date.now()}`

    const teacher = await Teacher.create({
      userId: teacherUser.id,
      schoolId: user.schoolId!,
      employeeNumber,
      qualification: data.qualification,
      specialization: data.specialization,
      hireDate: DateTime.now(),
      status: 'active',
    })

    const schoolName = await this.getSchoolName(user.schoolId)
    const credentials = {
      fullName: teacherUser.fullName,
      role: teacherUser.role,
      roleLabel: 'Enseignant',
      email: teacherUser.email,
      password: tempPassword,
      schoolName,
      profileReference: employeeNumber,
      createdAt: DateTime.now().toFormat('dd/MM/yyyy HH:mm'),
    }
    let emailDelivery = {
      sent: true,
      message: `Les identifiants ont été envoyés à ${teacherUser.email}.`,
    }

    try {
      await this.mailService.sendAccountCredentials({
        to: teacherUser.email,
        schoolName,
        fullName: teacherUser.fullName,
        roleLabel: 'Enseignant',
        email: teacherUser.email,
        password: tempPassword,
      })
    } catch (error) {
      emailDelivery = {
        sent: false,
        message:
          error instanceof Error
            ? error.message
            : "L'email n'a pas pu être envoyé automatiquement.",
      }
    }

    if (request.accepts(['html', 'json']) === 'html') {
      return view.render('schools/accounts/credentials', {
        school: this.getFallbackSchool(user),
        credentials,
        emailDelivery,
      })
    }

    return response.created({
      success: true,
      teacher: { ...teacher.serialize(), user: teacherUser.serialize() },
      credentials: { email: teacherUser.email, temporaryPassword: tempPassword },
      emailDelivery,
    })
  }

  public async createAccountPage({ auth, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const governance = await getGovernanceContext(user)
    const sections = await listSchoolSections(user.schoolId)
    const visibleSections = governance.canManageAllSections
      ? sections
      : sections.filter((section) => section.id === governance.sectionId)
    const governanceRoles = governance.creatablePositions.map((position) => ({
      value: position,
      label: positionLabel(position),
      schoolWide: isSchoolWidePosition(position),
      sectionCodes: Object.entries({
        maternelle: ['preschool_director'],
        primaire: ['primary_director'],
        secondaire: ['prefect', 'studies_director', 'pedagogical_advisor'],
        all_sections: ['finance_director', 'secretary'],
      })
        .filter(([, positions]) => positions.includes(position))
        .map(([code]) => code),
    }))
    const canCreateLearnerAccounts = [
      'promoter',
      'preschool_director',
      'primary_director',
      'prefect',
      'studies_director',
    ].includes(governance.position)

    const [classes, students] = await Promise.all([
      Class.query()
        .where('schoolId', user.schoolId)
        .whereNull('archivedAt')
        .if(!governance.canManageAllSections, (query) =>
          query.where('schoolSectionId', governance.sectionId)
        )
        .orderBy('gradeLevel', 'asc')
        .orderBy('name', 'asc'),
      Student.query()
        .where('schoolId', user.schoolId)
        .where('academicStatus', 'active')
        .if(!governance.canManageAllSections, (query) =>
          query.whereHas('class', (classQuery) =>
            classQuery.where('schoolSectionId', governance.sectionId)
          )
        )
        .preload('user')
        .preload('class')
        .orderBy('createdAt', 'desc'),
    ])

    return view.render('schools/accounts/create', {
      school: this.getFallbackSchool(user),
      classes,
      classCatalog: RDC_CLASS_CATALOG,
      students,
      schoolOptions: RDC_SCHOOL_OPTIONS,
      sections: visibleSections,
      governance,
      roles: [
        ...governanceRoles,
        ...(canCreateLearnerAccounts
          ? [
              { value: 'student', label: 'Élève' },
              { value: 'parent', label: 'Parent' },
            ]
          : []),
      ],
    })
  }

  public async accountsPage({ auth, request, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const search = String(request.input('search', '')).trim()
    const role = request.input('role')
    const governance = await getGovernanceContext(user)
    const assignments = await db
      .from('school_staff_assignments')
      .leftJoin('school_sections', 'school_staff_assignments.school_section_id', 'school_sections.id')
      .where('school_staff_assignments.school_id', user.schoolId)
      .where('school_staff_assignments.is_active', true)
      .select(
        'school_staff_assignments.user_id',
        'school_staff_assignments.position',
        'school_staff_assignments.school_section_id',
        'school_sections.name as section_name'
      )
    const assignmentByUser = new Map(assignments.map((assignment) => [assignment.user_id, assignment]))
    const sectionUserIds = governance.canManageAllSections
      ? null
      : assignments
          .filter(
            (assignment) =>
              assignment.school_section_id === governance.sectionId ||
              isSchoolWidePosition(assignment.position)
          )
          .map((assignment) => assignment.user_id)

    const accounts = await User.query()
      .where('schoolId', user.schoolId)
      .whereNot('id', user.id)
      .whereIn('role', [
        'director',
        'teacher',
        'discipline_director',
        'finance_director',
        'secretary',
        'student',
        'parent',
      ])
      .if(sectionUserIds !== null, (query) => {
        query.where((scope) => {
          if (sectionUserIds!.length) scope.whereIn('id', sectionUserIds!)
          scope.orWhereIn(
            'id',
            db
              .from('students')
              .join('classes', 'students.class_id', 'classes.id')
              .where('classes.school_section_id', governance.sectionId)
              .select('students.user_id')
          )
        })
      })
      .if(search, (query) => {
        query.where((searchQuery) => {
          searchQuery
            .whereILike('firstName', `%${search}%`)
            .orWhereILike('postnom', `%${search}%`)
            .orWhereILike('lastName', `%${search}%`)
            .orWhereILike('email', `%${search}%`)
        })
      })
      .orderBy('createdAt', 'desc')

    return view.render('schools/accounts/index', {
      school: this.getFallbackSchool(user),
      accounts: accounts
        .map((account) => {
          const assignment = assignmentByUser.get(account.id)
          return {
            id: account.id,
            fullName: account.fullName,
            email: account.email,
            phone: account.phone || '-',
            role: assignment?.position || account.role,
            roleLabel: assignment ? positionLabel(assignment.position) : this.getRoleLabel(account.role),
            sectionName: assignment?.section_name || null,
            status: account.status,
          }
        })
        .filter((account) => !role || account.role === role),
      selectedRole: role || '',
      search,
      roles: [
        ...Object.entries(SCHOOL_POSITIONS)
          .filter(([position]) => position !== 'promoter')
          .map(([value, label]) => ({ value, label })),
        { value: 'student', label: 'Élève' },
        { value: 'parent', label: 'Parent' },
      ],
    })
  }

  public async editAccountPage({ auth, params, view }: HttpContext) {
    const director = auth.getUserOrFail()

    const account = await User.query()
      .where('id', params.id)
      .where('schoolId', director.schoolId)
      .whereIn('role', [
        'director',
        'teacher',
        'discipline_director',
        'finance_director',
        'secretary',
        'student',
        'parent',
      ])
      .firstOrFail()

    const [classes, students, teacher, student, parent] = await Promise.all([
      Class.query()
        .where('schoolId', director.schoolId)
        .whereNull('archivedAt')
        .orderBy('gradeLevel', 'asc')
        .orderBy('name', 'asc'),
      Student.query()
        .where('schoolId', director.schoolId)
        .where('academicStatus', 'active')
        .preload('user')
        .preload('class')
        .orderBy('createdAt', 'desc'),
      Teacher.query().where('userId', account.id).first(),
      Student.query().where('userId', account.id).first(),
      Parent.query().where('userId', account.id).first(),
    ])

    let selectedChildrenIds: string[] = []
    if (parent) {
      const links = await db
        .from('parent_student')
        .where('parent_id', parent.id)
        .select('student_id')
      selectedChildrenIds = links.map((link) => link.student_id)
    }
    const staffAssignment = await db
      .from('school_staff_assignments')
      .leftJoin('school_sections', 'school_staff_assignments.school_section_id', 'school_sections.id')
      .where('school_staff_assignments.user_id', account.id)
      .where('school_staff_assignments.is_active', true)
      .select('school_staff_assignments.position', 'school_sections.name as section_name')
      .first()

    return view.render('schools/accounts/edit', {
      school: this.getFallbackSchool(director),
      account,
      teacher,
      student,
      parent,
      classes,
      schoolOptions: RDC_SCHOOL_OPTIONS,
      students,
      selectedChildrenIds,
      roleLabel: staffAssignment
        ? `${positionLabel(staffAssignment.position)} — ${staffAssignment.section_name || "Toute l'école"}`
        : this.getRoleLabel(account.role),
    })
  }

  public async updateAccount({ auth, params, request, response, session }: HttpContext) {
    const director = auth.getUserOrFail()
    const account = await User.query()
      .where('id', params.id)
      .where('schoolId', director.schoolId)
      .whereIn('role', [
        'director',
        'teacher',
        'discipline_director',
        'finance_director',
        'secretary',
        'student',
        'parent',
      ])
      .firstOrFail()

    const schema = vine.compile(
      vine.object({
        firstName: vine.string().trim(),
        postnom: vine.string().trim(),
        lastName: vine.string().trim(),
        email: vine.string().trim().email(),
        phone: vine.string().trim().optional(),
        status: vine.enum(['active', 'inactive', 'suspended', 'pending']).optional(),
        qualification: vine.string().trim().optional(),
        specialization: vine.string().trim().optional(),
        classId: vine.string().optional(),
        className: vine.string().trim().optional(),
        schoolOption: vine.string().trim().optional(),
        birthDate: vine.date({ formats: ['YYYY-MM-DD'] }).optional(),
        birthPlace: vine.string().trim().optional(),
        nationality: vine.string().trim().optional(),
        gender: vine.enum(['male', 'female']).optional(),
        parentPhone: vine.string().trim().optional(),
        address: vine.string().trim().optional(),
        medicalInfo: vine.string().trim().optional(),
        relationship: vine.string().trim().optional(),
        profession: vine.string().trim().optional(),
        emergencyPhone: vine.string().trim().optional(),
        childrenIds: vine.array(vine.string()).optional(),
      })
    )
    const payload = await request.validateUsing(schema)
    const email = payload.email.trim().toLowerCase()
    const existingEmail = await User.query()
      .where('email', email)
      .whereNot('id', account.id)
      .first()

    if (existingEmail) {
      session.flash('error', 'Cette adresse email est déjà utilisée par un autre compte.')
      return response.redirect().back()
    }

    if (account.role === 'parent' && (!payload.relationship || !payload.childrenIds?.length)) {
      session.flash(
        'error',
        'Le lien de parenté et au moins un élève rattaché sont requis pour un parent.'
      )
      return response.redirect().back()
    }

    const selectedClass = payload.classId
      ? await Class.query()
          .where('id', payload.classId)
          .where('schoolId', director.schoolId)
          .whereNull('archivedAt')
          .first()
      : null
    const schoolOptions = RDC_SCHOOL_OPTIONS
    const isHumanities = isHumanitiesClass(selectedClass)

    if (
      account.role === 'student' &&
      isHumanities &&
      (!payload.schoolOption || !schoolOptions.includes(payload.schoolOption as any))
    ) {
      session.flash(
        'error',
        'Veuillez sélectionner une option valide pour cette classe des humanités.'
      )
      return response.redirect().back()
    }

    await db.transaction(async (trx) => {
      account.useTransaction(trx)
      account.firstName = payload.firstName
      account.postnom = payload.postnom
      account.lastName = payload.lastName
      account.email = email
      account.phone = payload.phone || null
      account.status = payload.status || account.status
      await account.save()

      if (account.role === 'teacher') {
        const teacher = await Teacher.query({ client: trx }).where('userId', account.id).first()
        if (teacher) {
          teacher.qualification = payload.qualification || teacher.qualification
          teacher.specialization = payload.specialization || ''
          await teacher.save()
        }
      }

      if (account.role === 'student') {
        const student = await Student.query({ client: trx }).where('userId', account.id).first()
        if (student) {
          student.classId = payload.classId || null
          student.schoolOption = isHumanities ? payload.schoolOption! : null
          if (payload.birthDate) student.birthDate = payload.birthDate
          student.birthPlace = payload.birthPlace || ''
          student.nationality = payload.nationality || 'Congolaise'
          if (payload.gender) student.gender = payload.gender
          student.parentPhone = payload.parentPhone || student.parentPhone
          student.address = payload.address || ''
          student.medicalInfo = payload.medicalInfo || null
          await student.save()
        }
      }

      if (account.role === 'parent') {
        const parent = await Parent.query({ client: trx }).where('userId', account.id).first()
        if (parent) {
          parent.relationship = payload.relationship || parent.relationship
          parent.profession = payload.profession || null
          parent.emergencyPhone = payload.emergencyPhone || payload.phone || parent.emergencyPhone
          await parent.save()

          if (payload.childrenIds) {
            const validChildren = await Student.query({ client: trx })
              .whereIn('id', payload.childrenIds)
              .where('schoolId', director.schoolId)

            if (validChildren.length !== payload.childrenIds.length) {
              throw new Error("Un des élèves sélectionnés n'appartient pas à votre école.")
            }

            await trx.from('parent_student').where('parent_id', parent.id).delete()
            if (validChildren.length) {
              await trx.table('parent_student').insert(
                validChildren.map((student, index) => ({
                  parent_id: parent.id,
                  student_id: student.id,
                  is_primary: index === 0,
                  created_at: new Date(),
                  updated_at: new Date(),
                }))
              )
            }
          }
        }
      }
    })

    session.flash('success', 'Compte modifié avec succès.')
    return response.redirect('/schools/accounts')
  }

  public async resetAccountCredentials({
    auth,
    params,
    request,
    response,
    view,
  }: HttpContext) {
    const director = auth.getUserOrFail()
    const account = await User.query()
      .where('id', params.id)
      .where('schoolId', director.schoolId)
      .whereIn('role', [
        'director',
        'teacher',
        'discipline_director',
        'finance_director',
        'secretary',
        'student',
        'parent',
      ])
      .firstOrFail()
    const tempPassword = crypto.randomBytes(8).toString('hex')
    const schoolName = await this.getSchoolName(director.schoolId)

    account.password = tempPassword
    account.mustChangePassword = true
    await account.save()

    let profileReference = '-'
    if (account.role === 'teacher') {
      const teacher = await Teacher.query().where('userId', account.id).first()
      profileReference = teacher?.employeeNumber || '-'
    } else if (account.role === 'student') {
      const student = await Student.query().where('userId', account.id).first()
      profileReference = student?.registrationNumber || '-'
    } else if (account.role === 'parent') {
      const parent = await Parent.query().where('userId', account.id).first()
      if (parent) {
        const linkedChildren = await db
          .from('parent_student')
          .where('parent_id', parent.id)
          .count('* as total')
          .first()
        profileReference = `${Number(linkedChildren?.total || 0)} élève(s) lié(s)`
      }
    }

    const resetAssignment = await db
      .from('school_staff_assignments')
      .where('user_id', account.id)
      .where('is_active', true)
      .select('position')
      .first()
    const credentials = {
      fullName: account.fullName,
      role: account.role,
      roleLabel: resetAssignment
        ? positionLabel(resetAssignment.position)
        : this.getRoleLabel(account.role),
      email: account.email,
      password: tempPassword,
      schoolName,
      profileReference,
      createdAt: DateTime.now().toFormat('dd/MM/yyyy HH:mm'),
    }
    let emailDelivery = {
      sent: true,
      message: `Les nouveaux identifiants ont été envoyés à ${account.email}.`,
    }

    try {
      await this.mailService.sendAccountCredentials({
        to: account.email,
        schoolName,
        fullName: account.fullName,
        roleLabel: credentials.roleLabel,
        email: account.email,
        password: tempPassword,
      })
    } catch (error) {
      emailDelivery = {
        sent: false,
        message:
          error instanceof Error
            ? `Identifiants générés, mais email non envoyé : ${error.message}`
            : 'Identifiants générés, mais email non envoyé.',
      }
    }

    if (request.accepts(['html', 'json']) === 'html') {
      return view.render('schools/accounts/credentials', {
        school: this.getFallbackSchool(director),
        credentials,
        emailDelivery,
      })
    }

    return response.ok({
      success: true,
      message: emailDelivery.sent
        ? 'Nouveaux identifiants envoyés par email.'
        : 'Nouveaux identifiants générés, mais email non envoyé.',
      credentials: { email: account.email, temporaryPassword: tempPassword },
      emailDelivery,
    })
  }

  public async storeAccount({ auth, request, response, session, view }: HttpContext) {
    const director = auth.getUserOrFail()
    const governance = await getGovernanceContext(director)

    if (!director.schoolId) {
      session.flash('error', "Votre compte n'est lié à aucune école.")
      return response.redirect('/dashboard')
    }

    const schema = vine.compile(
      vine.object({
        role: vine.enum([
          'preschool_director',
          'primary_director',
          'prefect',
          'studies_director',
          'pedagogical_advisor',
          'teacher',
          'discipline_director',
          'deputy_discipline_director',
          'finance_director',
          'secretary',
          'student',
          'parent',
        ]),
        sectionId: vine.string().optional(),
        firstName: vine.string().trim(),
        postnom: vine.string().trim(),
        lastName: vine.string().trim(),
        email: vine.string().trim().email().unique({ table: 'users', column: 'email' }),
        phone: vine.string().trim().optional(),
        qualification: vine.string().trim().optional(),
        specialization: vine.string().trim().optional(),
        classId: vine.string().optional(),
        className: vine.string().trim().optional(),
        schoolOption: vine.string().trim().optional(),
        birthDate: vine.date({ formats: ['YYYY-MM-DD'] }).optional(),
        birthPlace: vine.string().trim().optional(),
        nationality: vine.string().trim().optional(),
        gender: vine.enum(['male', 'female']).optional(),
        parentPhone: vine.string().trim().optional(),
        address: vine.string().trim().optional(),
        medicalInfo: vine.string().trim().optional(),
        relationship: vine.string().trim().optional(),
        profession: vine.string().trim().optional(),
        emergencyPhone: vine.string().trim().optional(),
        childrenIds: vine.array(vine.string()).optional(),
      })
    )
    const payload = await request.validateUsing(schema)
    const requestedPosition =
      payload.role in POSITION_BASE_ROLES ? (payload.role as SchoolPosition) : null
    const canCreateLearnerAccounts = [
      'promoter',
      'preschool_director',
      'primary_director',
      'prefect',
      'studies_director',
    ].includes(governance.position)

    if (requestedPosition && !canCreatePosition(governance, requestedPosition)) {
      session.flash('error', "Vous n'êtes pas autorisé à créer cette fonction.")
      return response.redirect().back()
    }
    if (['student', 'parent'].includes(payload.role) && !canCreateLearnerAccounts) {
      session.flash('error', "Vous n'êtes pas autorisé à créer ce type de compte.")
      return response.redirect().back()
    }

    const sectionId = isSchoolWidePosition(requestedPosition)
      ? null
      : governance.canManageAllSections
        ? payload.sectionId
        : governance.sectionId

    if (requestedPosition && !isSchoolWidePosition(requestedPosition) && !sectionId) {
      session.flash('error', 'Veuillez sélectionner la section scolaire concernée.')
      return response.redirect().back()
    }

    if (sectionId && requestedPosition) {
      const validSection = await db
        .from('school_sections')
        .where('id', sectionId)
        .where('school_id', director.schoolId)
        .where('is_active', true)
        .first()
      if (!validSection) {
        session.flash('error', "La section scolaire sélectionnée n'appartient pas à cette école.")
        return response.redirect().back()
      }
      if (!SECTION_POSITION_OPTIONS[validSection.code]?.includes(requestedPosition)) {
        session.flash(
          'error',
          `${positionLabel(requestedPosition)} ne peut pas être affecté à ${validSection.name}.`
        )
        return response.redirect().back()
      }
    }

    const uniqueStaffPositions: SchoolPosition[] = [
      'preschool_director',
      'primary_director',
      'prefect',
      'studies_director',
      'pedagogical_advisor',
      'discipline_director',
      'deputy_discipline_director',
      'finance_director',
      'secretary',
    ]
    if (requestedPosition && uniqueStaffPositions.includes(requestedPosition)) {
      const existingAssignmentQuery = db
        .from('school_staff_assignments')
        .where('school_id', director.schoolId)
        .where('position', requestedPosition)
        .where('is_active', true)

      if (isSchoolWidePosition(requestedPosition)) {
        existingAssignmentQuery.whereNull('school_section_id')
      } else {
        existingAssignmentQuery.where('school_section_id', sectionId)
      }

      const existingAssignment = await existingAssignmentQuery.first()
      if (existingAssignment) {
        session.flash(
          'error',
          isSchoolWidePosition(requestedPosition)
            ? `${positionLabel(requestedPosition)} est dÃ©jÃ  nommÃ© pour toute l'Ã©cole.`
            : `${positionLabel(requestedPosition)} est dÃ©jÃ  nommÃ© pour cette section.`
        )
        return response.redirect().back()
      }
    }

    if (
      payload.role === 'student' &&
      (!payload.birthDate || !payload.gender || !payload.parentPhone)
    ) {
      session.flash(
        'error',
        'La date de naissance, le sexe et le téléphone parent sont requis pour un élève.'
      )
      return response.redirect().back()
    }

    if (payload.role === 'parent' && (!payload.relationship || !payload.childrenIds?.length)) {
      session.flash(
        'error',
        'Le lien de parenté et au moins un élève lié sont requis pour un parent.'
      )
      return response.redirect().back()
    }

    if (payload.role === 'student' && !payload.classId && !payload.className) {
      session.flash('error', 'Veuillez sélectionner ou renseigner la classe de l’élève.')
      return response.redirect().back()
    }

    const tempPassword = crypto.randomBytes(8).toString('hex')
    const email = payload.email.trim().toLowerCase()
    const school = await School.find(director.schoolId)
    let createdUser: User
    let profileReference = ''

    try {
      await db.transaction(async (trx) => {
        const selectedClass =
          payload.role === 'student'
            ? await resolveEnrollmentClass({
                schoolId: director.schoolId!,
                classId: payload.classId,
                className: payload.className,
                schoolOption: payload.schoolOption,
                allowedSectionId: governance.canManageAllSections ? null : governance.sectionId,
                trx,
              })
            : null

        createdUser = new User()
        createdUser.useTransaction(trx)
        createdUser.schoolId = director.schoolId
        createdUser.firstName = payload.firstName
        createdUser.postnom = payload.postnom
        createdUser.lastName = payload.lastName
        createdUser.email = email
        createdUser.phone = payload.phone || null
        createdUser.password = tempPassword
        createdUser.role = requestedPosition
          ? POSITION_BASE_ROLES[requestedPosition]
          : (payload.role as User['role'])
        createdUser.status = 'active'
        createdUser.mustChangePassword = true
        await createdUser.save()

        if (requestedPosition) {
          await trx.table('school_staff_assignments').insert({
            school_id: director.schoolId,
            school_section_id: sectionId,
            user_id: createdUser.id,
            position: requestedPosition,
            is_primary: true,
            is_active: true,
            created_by: director.id,
            created_at: new Date(),
            updated_at: new Date(),
          })
        }

        if (requestedPosition === 'teacher') {
          const teacher = new Teacher()
          teacher.useTransaction(trx)
          teacher.userId = createdUser.id
          teacher.schoolId = director.schoolId!
          teacher.employeeNumber = `TCH-${String(director.schoolId).slice(0, 4)}-${Date.now()}`
          teacher.qualification = payload.qualification || 'Non renseignée'
          teacher.specialization = payload.specialization || ''
          teacher.hireDate = DateTime.now()
          teacher.status = 'active'
          await teacher.save()
          profileReference = teacher.employeeNumber
        }

        if (payload.role === 'student') {
          const student = new Student()
          student.useTransaction(trx)
          student.userId = createdUser.id
          student.schoolId = director.schoolId!
          student.classId = selectedClass!.id
          student.schoolOption = isHumanitiesClass(selectedClass)
            ? getClassSchoolOption(selectedClass) || payload.schoolOption!
            : null
          student.registrationNumber = `STU-${Date.now()}`
          student.birthDate = payload.birthDate!
          student.birthPlace = payload.birthPlace || ''
          student.nationality = payload.nationality || 'Congolaise'
          student.gender = payload.gender!
          student.parentPhone = payload.parentPhone!
          student.address = payload.address || ''
          student.medicalInfo = payload.medicalInfo || null
          student.academicStatus = 'active'
          student.shift = 'morning'
          await student.save()
          await trx
            .from('classes')
            .where('id', selectedClass!.id)
            .increment('current_enrollment', 1)
          profileReference = student.registrationNumber
        }

        if (payload.role === 'parent') {
          const parent = new Parent()
          parent.useTransaction(trx)
          parent.userId = createdUser.id
          parent.relationship = payload.relationship!
          parent.profession = payload.profession || null
          parent.emergencyPhone = payload.emergencyPhone || payload.phone || ''
          await parent.save()

          const validChildren = await Student.query({ client: trx })
            .whereIn('id', payload.childrenIds!)
            .where('schoolId', director.schoolId)

          if (validChildren.length !== payload.childrenIds!.length) {
            throw new Error("Un des élèves sélectionnés n'appartient pas à votre école.")
          }

          await trx.table('parent_student').insert(
            validChildren.map((student, index) => ({
              parent_id: parent.id,
              student_id: student.id,
              is_primary: index === 0,
              created_at: new Date(),
              updated_at: new Date(),
            }))
          )
          profileReference = `${validChildren.length} élève(s) lié(s)`
        }
      })
    } catch (error) {
      session.flash(
        'error',
        error instanceof Error ? error.message : 'La création du compte a échoué.'
      )
      return response.redirect().back()
    }

    const credentials = {
      fullName: createdUser!.fullName,
      role: createdUser!.role,
      roleLabel: requestedPosition
        ? positionLabel(requestedPosition)
        : this.getRoleLabel(createdUser!.role),
      email: createdUser!.email,
      password: tempPassword,
      schoolName: school?.name || (await this.getSchoolName(director.schoolId)),
      profileReference,
      createdAt: DateTime.now().toFormat('dd/MM/yyyy HH:mm'),
    }
    let emailDelivery = {
      sent: true,
      message: `Les identifiants ont été envoyés à ${credentials.email}.`,
    }

    try {
      await this.mailService.sendAccountCredentials({
        to: credentials.email,
        schoolName: credentials.schoolName,
        fullName: credentials.fullName,
        roleLabel: credentials.roleLabel,
        email: credentials.email,
        password: credentials.password,
      })
    } catch (error) {
      emailDelivery = {
        sent: false,
        message:
          error instanceof Error
            ? error.message
            : "L'email n'a pas pu être envoyé automatiquement.",
      }
    }

    session.flash(
      emailDelivery.sent ? 'success' : 'error',
      emailDelivery.sent
        ? 'Compte créé, identifiants générés et email envoyé.'
        : 'Compte créé et identifiants générés, mais email non envoyé.'
    )

    return view.render('schools/accounts/credentials', {
      school: this.getFallbackSchool(director),
      credentials,
      emailDelivery,
    })
  }
}
