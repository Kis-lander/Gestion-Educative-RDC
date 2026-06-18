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

export default class SchoolController {
  private mailService = new OtpMailService()

  private getRdcSchoolOptions() {
    return [
      'Chimie-biologie',
      'Commerciale et gestion',
      'Construction',
      'Coupe et couture',
      'Électricité',
      'Électronique',
      'Hôtellerie et restauration',
      'Industrie agricole',
      'Informatique',
      'Latin-philo',
      'Littéraire',
      'Math-physique',
      'Mecanique generale',
      'Mécanique automobile',
      'Nutrition',
      'Petrochimie',
      'Psychopedagogie',
      'Pédagogie générale',
      'Pédagogie maternelle',
      'Pédagogie primaire',
      'Secrétariat-administration',
      'Sociale',
      'Technique commerciale',
      'Vétérinaire',
    ]
  }

  private isHumanitiesClass(classObj?: Class | null) {
    if (!classObj) return false
    return classObj.level?.toLowerCase().includes('humanit') || classObj.gradeLevel >= 9
  }

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
    }

    return labels[role]
  }

  private async getSchoolName(schoolId?: string | null) {
    if (!schoolId) return 'Gestion Éducative RDC'
    const school = await School.find(schoolId)
    return school?.name || 'Gestion Éducative RDC'
  }

  private getRdcDasClassCatalog() {
    return [
      { name: '1ère Maternelle', level: 'Maternelle', gradeLevel: 1 },
      { name: '2ème Maternelle', level: 'Maternelle', gradeLevel: 2 },
      { name: '3ème Maternelle', level: 'Maternelle', gradeLevel: 3 },
      { name: '1ère Primaire', level: 'Primaire', gradeLevel: 1 },
      { name: '2ème Primaire', level: 'Primaire', gradeLevel: 2 },
      { name: '3ème Primaire', level: 'Primaire', gradeLevel: 3 },
      { name: '4ème Primaire', level: 'Primaire', gradeLevel: 4 },
      { name: '5ème Primaire', level: 'Primaire', gradeLevel: 5 },
      { name: '6ème Primaire', level: 'Primaire', gradeLevel: 6 },
      { name: '7ème Éducation de base', level: 'Éducation de base', gradeLevel: 7 },
      { name: '8ème Éducation de base', level: 'Éducation de base', gradeLevel: 8 },
      { name: '1ère Humanités', level: 'Humanités', gradeLevel: 9 },
      { name: '2ème Humanités', level: 'Humanités', gradeLevel: 10 },
      { name: '3ème Humanités', level: 'Humanités', gradeLevel: 11 },
      { name: '4ème Humanités', level: 'Humanités', gradeLevel: 12 },
    ]
  }

  private async ensureRdcDasClasses(schoolId?: string | null) {
    if (!schoolId) return

    const currentYear = DateTime.now().year.toString()
    const existingCount = await Class.query()
      .where('schoolId', schoolId)
      .where('academicYear', currentYear)
      .count('* as total')
      .first()

    if (Number(existingCount?.$extras.total || 0) > 0) return

    await Class.createMany(
      this.getRdcDasClassCatalog().map((classItem) => ({
        schoolId,
        name: classItem.name,
        level: classItem.level,
        gradeLevel: classItem.gradeLevel,
        maxCapacity: 50,
        currentEnrollment: 0,
        academicYear: currentYear,
        shift: 'morning' as const,
        teacherId: null,
      }))
    )
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
    const [classesCount] = await Class.query().where('schoolId', school.id).count('* as total')

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
          searchQuery.whereILike('employeeNumber', `%${search}%`).orWhereHas('user', (userQuery) => {
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
    const [total, active, subjectsCount] = await Promise.all([
      Teacher.query().where('schoolId', user.schoolId).count('* as total').first(),
      Teacher.query().where('schoolId', user.schoolId).where('status', 'active').count('* as total').first(),
      Subject.query().count('* as total').first(),
    ])

    return view.render('schools/teachers/index', {
      school: this.getFallbackSchool(user),
      teachers: paginator.all().map((teacher) => ({
        ...teacher.serialize(),
        user: teacher.user,
        subjectsCount: 0,
        classesCount: 0,
      })),
      pagination: this.getPaginationMeta(paginator),
      url: '/schools/teachers',
      stats: {
        total: Number(total?.$extras.total || 0),
        active: Number(active?.$extras.total || 0),
        qualified: Number(active?.$extras.total || 0),
        subjectsCount: Number(subjectsCount?.$extras.total || 0),
        totalHours: 0,
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

    const linkedClassIds = [...new Set(subjectRows.map((row) => row.classId ?? row.class_id).filter(Boolean))]
    const classesQuery = Class.query()
      .where('schoolId', teacher.schoolId)
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
      ? Math.round((normalizedGrades.reduce((total, score) => total + score, 0) / normalizedGrades.length) * 10) / 10
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
          [evaluation.first_name, evaluation.last_name, evaluation.postnom].filter(Boolean).join(' ') ||
          'Inspection',
        comments: evaluation.comments || 'Aucun commentaire',
        score: Number(evaluation.score || 0),
      })),
    })
  }

  public async editTeacherPage({ auth, params, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const teacher = await this.getTeacherForDirector(params.id, user.schoolId)
    const assignments = await this.getTeacherAssignments(teacher)
    const subjects = await Subject.query().orderBy('name', 'asc')

    ;(teacher as any).subjectIds = assignments.subjectIds

    return view.render('schools/teachers/edit', {
      school: this.getFallbackSchool(user),
      teacher,
      subjects,
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
    const entries = await db
      .from('timetables')
      .join('subjects', 'timetables.subject_id', 'subjects.id')
      .join('classes', 'timetables.class_id', 'classes.id')
      .where('timetables.teacher_id', teacher.id)
      .where('classes.school_id', teacher.schoolId)
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
      .orderBy('timetables.day_of_week', 'asc')

    const dayKeys: Record<number, 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'> = {
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
          ? entries.map((entry) => `${String(entry.start_time).slice(0, 5)}-${String(entry.end_time).slice(0, 5)}`)
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

    summary.totalHours = Math.round(summary.totalHours * 10) / 10
    summary.classesCount = classIds.size
    summary.subjectsCount = subjectIds.size

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

      teacher.useTransaction(trx)
      teacher.status = 'terminated'
      await teacher.save()

      teacher.user.useTransaction(trx)
      teacher.user.status = 'inactive'
      await teacher.user.save()
    })

    return response.ok({ success: true, message: 'Enseignant desactive avec succes.' })
  }

  public async resetTeacherPassword({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const teacher = await this.getTeacherForDirector(params.id, user.schoolId)
    const tempPassword = crypto.randomBytes(8).toString('hex')
    const schoolName = await this.getSchoolName(user.schoolId)

    teacher.user.password = tempPassword
    teacher.user.mustChangePassword = true
    await teacher.user.save()

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
      return response.ok({
        success: true,
        message:
          error instanceof Error
            ? `Mot de passe reinitialise, mais email non envoye : ${error.message}`
            : 'Mot de passe reinitialise, mais email non envoye.',
      })
    }

    return response.ok({ success: true, message: 'Nouveau mot de passe envoye par email.' })
  }

  public async addTeacher({ request, auth, response }: HttpContext) {
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

    if (request.header('accept')?.includes('text/html')) {
      return response.redirect('/schools/teachers')
    }

    return response.created({
      success: true,
      teacher: { ...teacher.serialize(), user: teacherUser.serialize() },
      credentials: { email: teacherUser.email, temporaryPassword: tempPassword },
    })
  }

  public async createAccountPage({ auth, view }: HttpContext) {
    const user = auth.getUserOrFail()
    await this.ensureRdcDasClasses(user.schoolId)

    const [classes, students] = await Promise.all([
      Class.query()
        .where('schoolId', user.schoolId)
        .orderBy('gradeLevel', 'asc')
        .orderBy('name', 'asc'),
      Student.query()
        .where('schoolId', user.schoolId)
        .where('academicStatus', 'active')
        .preload('user')
        .preload('class')
        .orderBy('createdAt', 'desc'),
    ])

    return view.render('schools/accounts/create', {
      school: this.getFallbackSchool(user),
      classes,
      students,
      schoolOptions: this.getRdcSchoolOptions(),
      roles: [
        { value: 'teacher', label: 'Enseignant' },
        { value: 'discipline_director', label: 'Directeur de discipline' },
        { value: 'finance_director', label: 'Directeur financier' },
        { value: 'student', label: 'Élève' },
        { value: 'parent', label: 'Parent' },
      ],
    })
  }

  public async accountsPage({ auth, request, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const search = String(request.input('search', '')).trim()
    const role = request.input('role')

    const accounts = await User.query()
      .where('schoolId', user.schoolId)
      .whereIn('role', ['teacher', 'discipline_director', 'finance_director', 'student', 'parent'])
      .if(role, (query) => query.where('role', role))
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
      accounts: accounts.map((account) => ({
        id: account.id,
        fullName: account.fullName,
        email: account.email,
        phone: account.phone || '-',
        role: account.role,
        roleLabel: this.getRoleLabel(account.role),
        status: account.status,
      })),
      selectedRole: role || '',
      search,
      roles: [
        { value: 'teacher', label: 'Enseignant' },
        { value: 'discipline_director', label: 'Directeur de discipline' },
        { value: 'finance_director', label: 'Directeur financier' },
        { value: 'student', label: 'Élève' },
        { value: 'parent', label: 'Parent' },
      ],
    })
  }

  public async editAccountPage({ auth, params, view }: HttpContext) {
    const director = auth.getUserOrFail()
    await this.ensureRdcDasClasses(director.schoolId)

    const account = await User.query()
      .where('id', params.id)
      .where('schoolId', director.schoolId)
      .whereIn('role', ['teacher', 'discipline_director', 'finance_director', 'student', 'parent'])
      .firstOrFail()

    const [classes, students, teacher, student, parent] = await Promise.all([
      Class.query().where('schoolId', director.schoolId).orderBy('gradeLevel', 'asc').orderBy('name', 'asc'),
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
      const links = await db.from('parent_student').where('parent_id', parent.id).select('student_id')
      selectedChildrenIds = links.map((link) => link.student_id)
    }

    return view.render('schools/accounts/edit', {
      school: this.getFallbackSchool(director),
      account,
      teacher,
      student,
      parent,
      classes,
      schoolOptions: this.getRdcSchoolOptions(),
      students,
      selectedChildrenIds,
      roleLabel: this.getRoleLabel(account.role),
    })
  }

  public async updateAccount({ auth, params, request, response, session }: HttpContext) {
    const director = auth.getUserOrFail()
    const account = await User.query()
      .where('id', params.id)
      .where('schoolId', director.schoolId)
      .whereIn('role', ['teacher', 'discipline_director', 'finance_director', 'student', 'parent'])
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
    const existingEmail = await User.query().where('email', email).whereNot('id', account.id).first()

    if (existingEmail) {
      session.flash('error', 'Cette adresse email est déjà utilisée par un autre compte.')
      return response.redirect().back()
    }

    if (account.role === 'parent' && (!payload.relationship || !payload.childrenIds?.length)) {
      session.flash('error', 'Le lien de parenté et au moins un élève rattaché sont requis pour un parent.')
      return response.redirect().back()
    }

    const selectedClass = payload.classId
      ? await Class.query().where('id', payload.classId).where('schoolId', director.schoolId).first()
      : null
    const schoolOptions = this.getRdcSchoolOptions()
    const isHumanities = this.isHumanitiesClass(selectedClass)

    if (account.role === 'student' && isHumanities && (!payload.schoolOption || !schoolOptions.includes(payload.schoolOption))) {
      session.flash('error', "Veuillez sélectionner une option valide pour cette classe des humanités.")
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

  public async storeAccount({ auth, request, response, session, view }: HttpContext) {
    const director = auth.getUserOrFail()

    if (!director.schoolId) {
      session.flash('error', "Votre compte n'est lié à aucune école.")
      return response.redirect('/dashboard')
    }

    const schema = vine.compile(
      vine.object({
        role: vine.enum(['teacher', 'discipline_director', 'finance_director', 'student', 'parent']),
        firstName: vine.string().trim(),
        postnom: vine.string().trim(),
        lastName: vine.string().trim(),
        email: vine.string().trim().email().unique({ table: 'users', column: 'email' }),
        phone: vine.string().trim().optional(),
        qualification: vine.string().trim().optional(),
        specialization: vine.string().trim().optional(),
        classId: vine.string().optional(),
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

    if (payload.role === 'student' && (!payload.birthDate || !payload.gender || !payload.parentPhone)) {
      session.flash('error', "La date de naissance, le sexe et le téléphone parent sont requis pour un élève.")
      return response.redirect().back()
    }

    if (payload.role === 'parent' && (!payload.relationship || !payload.childrenIds?.length)) {
      session.flash('error', 'Le lien de parenté et au moins un élève lié sont requis pour un parent.')
      return response.redirect().back()
    }

    const selectedClass = payload.classId
      ? await Class.query().where('id', payload.classId).where('schoolId', director.schoolId).first()
      : null
    const schoolOptions = this.getRdcSchoolOptions()
    const isHumanities = this.isHumanitiesClass(selectedClass)

    if (payload.role === 'student' && isHumanities && (!payload.schoolOption || !schoolOptions.includes(payload.schoolOption))) {
      session.flash('error', "Veuillez sélectionner une option valide pour cette classe des humanités.")
      return response.redirect().back()
    }

    const tempPassword = crypto.randomBytes(8).toString('hex')
    const email = payload.email.trim().toLowerCase()
    const school = await School.find(director.schoolId)
    let createdUser: User
    let profileReference = ''

    await db.transaction(async (trx) => {
      createdUser = new User()
      createdUser.useTransaction(trx)
      createdUser.schoolId = director.schoolId
      createdUser.firstName = payload.firstName
      createdUser.postnom = payload.postnom
      createdUser.lastName = payload.lastName
      createdUser.email = email
      createdUser.phone = payload.phone || null
      createdUser.password = tempPassword
      createdUser.role = payload.role
      createdUser.status = 'active'
      createdUser.mustChangePassword = true
      await createdUser.save()

      if (payload.role === 'teacher') {
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
        student.classId = payload.classId || null
        student.schoolOption = isHumanities ? payload.schoolOption! : null
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

    const credentials = {
      fullName: createdUser!.fullName,
      role: createdUser!.role,
      roleLabel: this.getRoleLabel(createdUser!.role),
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
