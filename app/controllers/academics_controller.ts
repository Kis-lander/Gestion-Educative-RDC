import { type HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Class from '#models/class'
import Student from '#models/student'
import Grade from '#models/grade'
import Subject from '#models/subject'
import Teacher from '#models/teacher'
import vine from '@vinejs/vine'
import {
  createClassValidator,
  updateClassValidator,
  addGradeValidator,
  updateGradeValidator,
  createSubjectValidator,
} from '#validators/academic'
import { DateTime } from 'luxon'
import { getClassSchoolOption } from '#services/school_class_service'
import {
  getGovernanceContext,
  resolveSectionIdForLevel,
} from '#services/school_governance_service'

export default class AcademicController {
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

  public async gradesPage({ auth, request, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const page = Number(request.input('page', 1))
    const classId = request.input('class_id')
    const subjectId = request.input('subject_id')
    const term = request.input('term')
    const published = request.input('published')

    const gradesQuery = Grade.query()
      .whereHas('class', (classQuery) =>
        classQuery.where('schoolId', user.schoolId).whereNull('archivedAt')
      )
      .preload('student', (studentQuery) => studentQuery.preload('user'))
      .preload('class')
      .preload('subject')
      .if(classId, (query) => query.where('classId', classId))
      .if(subjectId, (query) => query.where('subjectId', subjectId))
      .if(term, (query) => query.where('term', term))
      .if(published === 'true', (query) => query.where('published', true))
      .if(published === 'false', (query) => query.where('published', false))
      .orderBy('examDate', 'desc')

    const paginator = await gradesQuery.paginate(page, 20)
    const classes = await Class.query()
      .where('schoolId', user.schoolId)
      .whereNull('archivedAt')
      .orderBy('name', 'asc')
    const subjects = await Subject.query().orderBy('name', 'asc')
    const stats = await db
      .from('grades')
      .join('classes', 'grades.class_id', 'classes.id')
      .where('classes.school_id', user.schoolId)
      .select(
        db.raw('count(*) as total_grades'),
        db.raw('count(*) filter (where grades.published = true) as published'),
        db.raw('coalesce(avg(grades.score), 0) as average'),
        db.raw('count(distinct grades.student_id) as students_concerned')
      )
      .first()

    return view.render('academic/grades/index', {
      school: this.getFallbackSchool(user),
      classes,
      subjects,
      grades: paginator.all().map((grade) => ({
        id: grade.id,
        examDate: grade.examDate,
        studentName: grade.student?.user?.fullName || 'Élève inconnu',
        className: grade.class?.name || '-',
        subjectName: grade.subject?.name || '-',
        examType: grade.examType,
        score: grade.score ?? 0,
        maxScore: grade.maxScore,
        term: grade.term,
        published: grade.published,
      })),
      stats: {
        totalGrades: Number(stats?.total_grades || 0),
        published: Number(stats?.published || 0),
        average: Number(stats?.average || 0).toFixed(1),
        studentsConcerned: Number(stats?.students_concerned || 0),
      },
      pagination: this.getPaginationMeta(paginator),
      url: '/academic/grades',
    })
  }

  public async addGradesPage({ auth, request, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const classes = await Class.query()
      .where('schoolId', user.schoolId)
      .whereNull('archivedAt')
      .orderBy('name', 'asc')

    return view.render('academic/grades/add', {
      school: this.getFallbackSchool(user),
      classes,
      selectedClassId: request.input('class_id', ''),
    })
  }

  public async timetablePage({ auth, request, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const currentYear = DateTime.now().year
    const classes = await Class.query()
      .where('schoolId', user.schoolId)
      .whereNull('archivedAt')
      .orderBy('gradeLevel', 'asc')
      .orderBy('name', 'asc')

    return view.render('schools/timetable/index', {
      school: this.getFallbackSchool(user),
      classes,
      currentYear,
      selectedClassId: request.input('class_id', ''),
    })
  }

  public async createTimetablePage({ auth, request, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const currentYear = DateTime.now().year

    const [classes, teachers] = await Promise.all([
      Class.query()
        .where('schoolId', user.schoolId)
        .whereNull('archivedAt')
        .orderBy('gradeLevel', 'asc')
        .orderBy('name', 'asc'),
      Teacher.query()
        .where('schoolId', user.schoolId)
        .where('status', 'active')
        .preload('user')
        .orderBy('createdAt', 'desc'),
    ])

    return view.render('schools/timetable/create', {
      school: this.getFallbackSchool(user),
      classes,
      teachers,
      currentYear,
      selectedClassId: request.input('class_id', ''),
    })
  }

  public async classTimetablePage({ params, response }: HttpContext) {
    return response.redirect(`/schools/timetable?class_id=${params.classId}`)
  }

  /**
   * ==================== GESTION DES CLASSES ====================
   */

  /**
   * Obtenir toutes les classes de l'école
   */
  public async classesPage({ auth, request, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const governance = await getGovernanceContext(user)
    const requestedSectionId = String(request.input('section_id', '')).trim() || null
    const sectionId = governance.canManageAllSections ? requestedSectionId : governance.sectionId
    const page = Number(request.input('page', 1))
    const level = request.input('level')
    const shift = request.input('shift')
    const search = String(request.input('search', '')).trim()

    const query = Class.query()
      .where('schoolId', user.schoolId)
      .whereNull('archivedAt')
      .if(sectionId, (classQuery) => classQuery.where('schoolSectionId', sectionId))
      .if(!governance.canManageAllSections && !sectionId, (classQuery) =>
        classQuery.whereRaw('1 = 0')
      )
      .preload('teacher', (teacherQuery) => teacherQuery.preload('user'))
      .if(level, (classQuery) => classQuery.where('level', level))
      .if(shift, (classQuery) => classQuery.where('shift', shift))
      .if(search, (classQuery) => classQuery.whereILike('name', `%${search}%`))
      .orderBy('gradeLevel', 'asc')
      .orderBy('name', 'asc')

    const paginator = await query.paginate(page, 12)
    const pageClasses = paginator.all()
    const classIds = pageClasses.map((classObj) => classObj.id)
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
    const allClasses = await Class.query()
      .where('schoolId', user.schoolId)
      .whereNull('archivedAt')
      .if(sectionId, (classQuery) => classQuery.where('schoolSectionId', sectionId))
      .if(!governance.canManageAllSections && !sectionId, (classQuery) =>
        classQuery.whereRaw('1 = 0')
      )
    const allClassIds = allClasses.map((classObj) => classObj.id)
    const totalStudentsRow = allClassIds.length
      ? await Student.query()
          .whereIn('classId', allClassIds)
          .where('academicStatus', 'active')
          .count('* as total')
          .first()
      : null
    const totalStudents = Number(totalStudentsRow?.$extras.total || 0)
    const totalCapacity = allClasses.reduce(
      (sum, classObj) => sum + Number(classObj.maxCapacity || 0),
      0
    )
    const levels = [
      ...new Set([
        ...this.getRdcDasClassCatalog().map((classObj) => classObj.level),
        ...allClasses.map((classObj) => classObj.level).filter(Boolean),
      ]),
    ].sort()

    return view.render('schools/classes/index', {
      school: this.getFallbackSchool(user),
      classes: pageClasses.map((classObj) => {
        const studentsCount = studentsByClass.get(classObj.id) || 0

        return {
          id: classObj.id,
          name: classObj.name,
          level: classObj.level,
          gradeLevel: classObj.gradeLevel,
          shift: classObj.shift,
          maxCapacity: classObj.maxCapacity,
          studentsCount,
          teacherName: classObj.teacher?.user?.fullName || null,
          occupancyRate: classObj.maxCapacity
            ? Math.min(100, Math.round((studentsCount / classObj.maxCapacity) * 100))
            : 0,
        }
      }),
      stats: {
        total: allClasses.length,
        active: allClasses.length,
        averageSize: allClasses.length ? Math.round(totalStudents / allClasses.length) : 0,
        occupancyRate: totalCapacity ? Math.round((totalStudents / totalCapacity) * 100) : 0,
      },
      levels,
      rdcClassCatalog: this.getRdcDasClassCatalog(),
      pagination: this.getPaginationMeta(paginator),
      url: '/academic/classes',
      selectedSectionId: sectionId || '',
    })
  }

  public async archivedClassesPage({ auth, request, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const page = Number(request.input('page', 1))
    const paginator = await db
      .from('classes')
      .leftJoin('users', 'classes.archived_by', 'users.id')
      .where('classes.school_id', user.schoolId)
      .whereNotNull('classes.archived_at')
      .select(
        'classes.id',
        'classes.name',
        'classes.level',
        'classes.grade_level as grade_level',
        'classes.academic_year as academic_year',
        'classes.archived_at',
        'users.first_name',
        'users.postnom',
        'users.last_name'
      )
      .orderBy('classes.archived_at', 'desc')
      .paginate(page, 20)

    return view.render('schools/classes/archives', {
      school: this.getFallbackSchool(user),
      classes: paginator.all().map((classObj) => ({
        id: classObj.id,
        name: classObj.name,
        level: classObj.level,
        gradeLevel: classObj.grade_level,
        academicYear: classObj.academic_year,
        archivedAt: DateTime.fromJSDate(new Date(classObj.archived_at)),
        archivedBy:
          [classObj.first_name, classObj.last_name, classObj.postnom].filter(Boolean).join(' ') ||
          'Directeur',
      })),
      pagination: this.getPaginationMeta(paginator),
      url: '/schools/classes-archives',
    })
  }

  public async createClassPage({ auth, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const teachers = await Teacher.query()
      .where('schoolId', user.schoolId)
      .where('status', 'active')
      .preload('user')
      .orderBy('createdAt', 'desc')

    return view.render('schools/classes/create', {
      school: this.getFallbackSchool(user),
      teachers,
      rdcClassCatalog: this.getRdcDasClassCatalog(),
    })
  }

  public async seedRdcDasClasses({ auth, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const governance = await getGovernanceContext(user)
    const currentYear = DateTime.now().year.toString()
    let created = 0

    for (const classItem of this.getRdcDasClassCatalog()) {
      const schoolSectionId = await resolveSectionIdForLevel(
        user.schoolId,
        classItem.level,
        classItem.gradeLevel
      )
      if (!governance.canManageAllSections && schoolSectionId !== governance.sectionId) continue
      const existingClass = await Class.query()
        .where('schoolId', user.schoolId)
        .whereNull('archivedAt')
        .where('name', classItem.name)
        .where('academicYear', currentYear)
        .first()

      if (existingClass) continue

      await Class.create({
        schoolId: user.schoolId,
        name: classItem.name,
        level: classItem.level,
        gradeLevel: classItem.gradeLevel,
        maxCapacity: 50,
        currentEnrollment: 0,
        academicYear: currentYear,
        shift: 'morning',
        teacherId: null,
        schoolSectionId,
      })
      created += 1
    }

    session.flash(
      'success',
      created
        ? `${created} classe(s) RDC/DAS ajoutée(s).`
        : 'Les classes RDC/DAS existent déjà pour cette année scolaire.'
    )

    return response.redirect('/academic/classes')
  }

  public async showClassPage({ auth, params, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const governance = await getGovernanceContext(user)
    const classObj = await Class.query()
      .where('id', params.id)
      .where('schoolId', user.schoolId)
      .whereNull('archivedAt')
      .if(!governance.canManageAllSections, (query) =>
        query.where('schoolSectionId', governance.sectionId)
      )
      .preload('teacher', (teacherQuery) => teacherQuery.preload('user'))
      .firstOrFail()
    const studentsCount = await Student.query()
      .where('classId', classObj.id)
      .where('academicStatus', 'active')
      .count('* as total')
    const subjects = await db
      .from('class_subject')
      .where('class_subject.class_id', classObj.id)
      .join('subjects', 'class_subject.subject_id', 'subjects.id')
      .join('teachers', 'class_subject.teacher_id', 'teachers.id')
      .join('users', 'teachers.user_id', 'users.id')
      .select(
        'class_subject.*',
        'subjects.name as subject_name',
        'users.first_name as teacher_first_name',
        'users.last_name as teacher_last_name'
      )
    const assignedSubjectIds = subjects.map((subject) => subject.subject_id)
    const classOption = getClassSchoolOption(classObj)
    const [subjectPrograms, teachers] = await Promise.all([
      db
        .from('subject_programs')
        .where('grade_level_min', '<=', classObj.gradeLevel)
        .where('grade_level_max', '>=', classObj.gradeLevel)
        .where((query) => {
          query.where('level', 'Tous').orWhere('level', classObj.level)
        })
        .where((query) => {
          query.whereNull('school_option')
          if (classOption) query.orWhere('school_option', classOption)
        })
        .select(
          'subject_id',
          'school_option',
          'default_coefficient',
          'default_hours_per_week'
        )
        .orderByRaw('case when school_option is null then 1 else 0 end'),
      Teacher.query().where('schoolId', user.schoolId).where('status', 'active').preload('user'),
    ])
    const programBySubject = new Map<string, (typeof subjectPrograms)[number]>()
    for (const program of subjectPrograms) {
      if (!programBySubject.has(program.subject_id)) {
        programBySubject.set(program.subject_id, program)
      }
    }
    const availableSubjectIds = Array.from(programBySubject.keys()).filter(
      (subjectId) => !assignedSubjectIds.includes(subjectId)
    )
    const availableSubjectModels = availableSubjectIds.length
      ? await Subject.query()
          .where('isStandard', true)
          .whereIn('id', availableSubjectIds)
          .orderBy('name', 'asc')
      : []
    const availableSubjects = availableSubjectModels.map((subject) => {
      const program = programBySubject.get(subject.id)
      return {
        ...subject.serialize(),
        defaultCoefficient: Number(program?.default_coefficient || subject.coefficient || 1),
        defaultHoursPerWeek: Number(program?.default_hours_per_week || 2),
      }
    })

    return view.render('schools/classes/show', {
      school: this.getFallbackSchool(user),
      classObj,
      subjects,
      availableSubjects,
      teachers,
      timetable: [],
      stats: {
        studentsCount: Number(studentsCount[0].$extras.total || 0),
        averageGrade: await this.getClassAverage(classObj.id),
        attendanceRate: await this.getClassAttendance(classObj.id),
      },
    })
  }

  public async editClassPage({ auth, params, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const governance = await getGovernanceContext(user)
    const [classObj, teachers] = await Promise.all([
      Class.query()
        .where('id', params.id)
        .where('schoolId', user.schoolId)
        .whereNull('archivedAt')
        .if(!governance.canManageAllSections, (query) =>
          query.where('schoolSectionId', governance.sectionId)
        )
        .firstOrFail(),
      Teacher.query().where('schoolId', user.schoolId).where('status', 'active').preload('user'),
    ])

    return view.render('schools/classes/edit', {
      school: this.getFallbackSchool(user),
      classObj,
      teachers,
    })
  }

  public async classStudentsPage({ auth, params, request, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const governance = await getGovernanceContext(user)
    const page = Number(request.input('page', 1))
    const classObj = await Class.query()
      .where('id', params.id)
      .where('schoolId', user.schoolId)
      .whereNull('archivedAt')
      .if(!governance.canManageAllSections, (query) =>
        query.where('schoolSectionId', governance.sectionId)
      )
      .firstOrFail()
    const paginator = await Student.query()
      .where('classId', classObj.id)
      .preload('user')
      .orderBy('createdAt', 'desc')
      .paginate(page, 20)

    return view.render('schools/classes/students', {
      school: this.getFallbackSchool(user),
      classObj,
      students: paginator.all().map((student) => ({
        ...student.serialize(),
        user: student.user,
        averageGrade: 0,
        attendanceRate: 0,
      })),
      pagination: this.getPaginationMeta(paginator),
      url: `/schools/classes/${classObj.id}/students`,
    })
  }

  public async getClasses({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const academicYear = request.input('academic_year')
    const level = request.input('level')

    const query = Class.query().where('schoolId', user.schoolId).whereNull('archivedAt')

    if (academicYear) {
      query.where('academicYear', academicYear)
    }
    if (level) {
      query.where('level', level)
    }

    const classes = await query
      .preload('teacher', (teacherQuery) => {
        teacherQuery.preload('user')
      })
      .preload('students', (studentQuery) => {
        studentQuery.where('academicStatus', 'active')
      })
      .orderBy('gradeLevel', 'asc')

    // Ajouter les statistiques pour chaque classe
    const classesWithStats = await Promise.all(
      classes.map(async (classObj) => {
        const studentsCountResult = await Student.query()
          .where('classId', classObj.id)
          .where('academicStatus', 'active')
          .count('*', 'total')

        const averageGradeResult = await Grade.query()
          .where('classId', classObj.id)
          .avg('score', 'average')

        const totalStudents = Number(studentsCountResult[0].$extras.total)
        const average = Number(averageGradeResult[0].$extras.average || 0)

        return {
          ...classObj.toJSON(),
          studentsCount: totalStudents,
          averageGrade: average,
          occupancyRate:
            classObj.maxCapacity > 0 ? (totalStudents / classObj.maxCapacity) * 100 : 0,
        }
      })
    )

    return response.ok({
      success: true,
      classes: classesWithStats,
    })
  }

  /**
   * Obtenir les détails d'une classe
   */
  public async getClassById({ params, response }: HttpContext) {
    const classObj = await Class.query()
      .where('id', params.id)
      .whereNull('archivedAt')
      .preload('teacher', (teacherQuery) => {
        teacherQuery.preload('user')
      })
      .preload('students', (studentQuery) => {
        studentQuery.where('academicStatus', 'active').preload('user')
      })
      .preload('subjects')
      .firstOrFail()

    // Statistiques de la classe
    const stats = {
      totalStudents: classObj.students.length,
      averageGrade: await this.getClassAverage(classObj.id),
      boysCount: classObj.students.filter((s) => s.gender === 'male').length,
      girlsCount: classObj.students.filter((s) => s.gender === 'female').length,
      attendanceRate: await this.getClassAttendance(classObj.id),
    }

    return response.ok({
      success: true,
      class: classObj,
      stats: stats,
    })
  }

  /**
   * Créer une nouvelle classe
   */
  public async createClass({ request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(createClassValidator)
    const governance = await getGovernanceContext(user)
    const schoolSectionId = await resolveSectionIdForLevel(
      user.schoolId,
      payload.level,
      payload.gradeLevel
    )

    if (!governance.canManageAllSections && schoolSectionId !== governance.sectionId) {
      return response.forbidden({
        success: false,
        message: "Vous ne pouvez créer une classe que dans votre section scolaire.",
      })
    }

    // Vérifier qu'une classe avec le même nom n'existe pas pour cette année
    const currentYear = DateTime.now().year.toString()
    const existingClass = await Class.query()
      .where('schoolId', user.schoolId)
      .where('name', payload.name)
      .where('academicYear', currentYear)
      .whereNull('archivedAt')
      .first()

    if (existingClass) {
      return response.conflict({
        success: false,
        message: 'Une classe avec ce nom existe déjà pour cette année scolaire',
      })
    }

    const classObj = new Class()
    classObj.schoolId = user.schoolId
    classObj.name = payload.name
    classObj.level = payload.level
    classObj.gradeLevel = payload.gradeLevel
    classObj.maxCapacity = payload.maxCapacity || 50
    classObj.currentEnrollment = 0
    classObj.academicYear = currentYear
    classObj.shift = payload.shift || 'morning'
    classObj.teacherId = payload.teacherId ?? null
    classObj.schoolSectionId = schoolSectionId

    await classObj.save()

    if (request.header('accept')?.includes('text/html')) {
      return response.redirect('/academic/classes')
    }

    return response.created({
      success: true,
      message: 'Classe créée avec succès',
      class: classObj,
    })
  }

  /**
   * Mettre à jour une classe
   */
  public async updateClass({ request, params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(updateClassValidator)
    const governance = await getGovernanceContext(user)

    const classObj = await Class.query()
      .where('id', params.id)
      .where('schoolId', user.schoolId)
      .whereNull('archivedAt')
      .if(!governance.canManageAllSections, (query) =>
        query.where('schoolSectionId', governance.sectionId)
      )
      .firstOrFail()

    classObj.merge(payload)
    await classObj.save()

    if (request.header('accept')?.includes('text/html')) {
      return response.redirect(`/academic/classes/${classObj.id}`)
    }

    return response.ok({
      success: true,
      message: 'Classe mise à jour avec succès',
      class: classObj,
    })
  }

  /**
   * Supprimer une classe
   */
  public async deleteClass({ params, auth, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const governance = await getGovernanceContext(user)

    if (user.role !== 'director') {
      return response.forbidden({
        success: false,
        message: 'Seul le directeur peut supprimer une classe.',
      })
    }

    const classObj = await Class.query()
      .where('id', params.id)
      .where('schoolId', user.schoolId)
      .whereNull('archivedAt')
      .if(!governance.canManageAllSections, (query) =>
        query.where('schoolSectionId', governance.sectionId)
      )
      .firstOrFail()

    classObj.archivedAt = DateTime.now()
    classObj.archivedBy = user.id
    await classObj.save()

    if (request.header('accept')?.includes('text/html')) {
      session.flash(
        'success',
        `La classe ${classObj.name} a été archivée. Ses dossiers historiques sont conservés.`
      )
      return response.redirect('/schools/classes')
    }

    return response.ok({
      success: true,
      message: 'Classe archivée avec succès',
    })
  }

  public async restoreClass({ params, auth, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const archivedClass = await db
      .from('classes')
      .where('id', params.id)
      .where('school_id', user.schoolId)
      .whereNotNull('archived_at')
      .first()

    if (!archivedClass) {
      session.flash('error', 'Cette classe archivée est introuvable.')
      return response.redirect('/schools/classes-archives')
    }

    await db
      .from('classes')
      .where('id', archivedClass.id)
      .update({ archived_at: null, archived_by: null, updated_at: new Date() })

    session.flash('success', `La classe ${archivedClass.name} a été restaurée.`)
    return response.redirect('/schools/classes-archives')
  }

  public async permanentlyDeleteClass({ params, auth, response, session }: HttpContext) {
    const user = auth.getUserOrFail()

    if (user.role !== 'director') {
      return response.forbidden({
        success: false,
        message: 'Seul le directeur peut supprimer définitivement une classe.',
      })
    }

    const archivedClass = await db
      .from('classes')
      .where('id', params.id)
      .where('school_id', user.schoolId)
      .whereNotNull('archived_at')
      .first()

    if (!archivedClass) {
      session.flash('error', 'Cette classe archivée est introuvable.')
      return response.redirect('/schools/classes-archives')
    }

    await db.transaction(async (trx) => {
      // Ces deux relations n'ont pas de suppression en cascade dans leur migration.
      await trx.from('grades').where('class_id', archivedClass.id).delete()
      await trx.from('assignments').where('class_id', archivedClass.id).delete()

      // Les autres relations sont configurées en CASCADE. Les élèves sont conservés
      // et leur class_id devient NULL grâce à la contrainte SET NULL.
      await trx.from('classes').where('id', archivedClass.id).delete()
    })

    session.flash(
      'success',
      `La classe ${archivedClass.name} et ses données pédagogiques ont été supprimées définitivement.`
    )
    return response.redirect('/schools/classes-archives')
  }

  /**
   * Obtenir les élèves d'une classe
   */
  public async getClassStudents({ params, request, response }: HttpContext) {
    const search = request.input('search')
    const status = request.input('status', 'active')

    const query = Student.query()
      .where('classId', params.id)
      .where('academicStatus', status)
      .preload('user')
      .preload('parents', (parentQuery) => {
        parentQuery.preload('user')
      })

    if (search) {
      query.whereHas('user', (userQuery) => {
        userQuery
          .where('firstName', 'ILIKE', `%${search}%`)
          .orWhere('postnom', 'ILIKE', `%${search}%`)
          .orWhere('lastName', 'ILIKE', `%${search}%`)
      })
    }

    const students = await query.orderBy('createdAt', 'desc')

    // Ajouter les moyennes pour chaque élève
    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        const averageGradeResult = await Grade.query()
          .where('studentId', student.id)
          .avg('score', 'average')

        return {
          ...student.toJSON(),
          averageGrade: Number(averageGradeResult[0].$extras.average || 0),
        }
      })
    )

    return response.ok({
      success: true,
      students: studentsWithStats,
      total: students.length,
    })
  }

  /**
   * ==================== GESTION DES MATIÈRES ====================
   */

  public async subjectsPage({ auth, request, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const governance = await getGovernanceContext(user)
    const page = Number(request.input('page', 1))
    const schoolSubjectRows = await db
      .from('class_subject')
      .join('classes', 'class_subject.class_id', 'classes.id')
      .where('classes.school_id', user.schoolId)
      .whereNull('classes.archived_at')
      .if(!governance.canManageAllSections, (query) =>
        query.where('classes.school_section_id', governance.sectionId)
      )
      .select('class_subject.subject_id')
      .avg('class_subject.coefficient as average_coefficient')
      .groupBy('class_subject.subject_id')
    const schoolSubjectIds = schoolSubjectRows.map((row) => row.subject_id)
    const localCoefficientBySubject = new Map(
      schoolSubjectRows.map((row) => [
        String(row.subject_id),
        Number(row.average_coefficient || 1),
      ])
    )
    const paginator = await Subject.query()
      .where('isStandard', true)
      .if(schoolSubjectIds.length > 0, (query) => query.whereIn('id', schoolSubjectIds))
      .if(schoolSubjectIds.length === 0, (query) => query.whereRaw('1 = 0'))
      .orderBy('name', 'asc')
      .paginate(page, 20)
    const subjects = paginator.all()
    const subjectIds = subjects.map((subject) => subject.id)

    const assignmentRows = subjectIds.length
      ? await db
          .from('class_subject')
          .join('classes', 'class_subject.class_id', 'classes.id')
          .where('classes.school_id', user.schoolId)
          .whereNull('classes.archived_at')
          .if(!governance.canManageAllSections, (query) =>
            query.where('classes.school_section_id', governance.sectionId)
          )
          .whereIn('class_subject.subject_id', subjectIds)
          .select('class_subject.subject_id', 'class_subject.class_id', 'class_subject.teacher_id')
      : []

    const assignmentsBySubject = new Map<string, { classes: Set<string>; teachers: Set<string> }>()
    for (const row of assignmentRows) {
      const current = assignmentsBySubject.get(row.subject_id) || {
        classes: new Set<string>(),
        teachers: new Set<string>(),
      }
      if (row.class_id) current.classes.add(row.class_id)
      if (row.teacher_id) current.teachers.add(row.teacher_id)
      assignmentsBySubject.set(row.subject_id, current)
    }

    const [schoolAssignments, equippedClasses] = await Promise.all([
      db
        .from('class_subject')
        .join('classes', 'class_subject.class_id', 'classes.id')
        .where('classes.school_id', user.schoolId)
        .whereNull('classes.archived_at')
        .if(!governance.canManageAllSections, (query) =>
          query.where('classes.school_section_id', governance.sectionId)
        )
        .select('class_subject.coefficient'),
      db
        .from('class_subject')
        .join('classes', 'class_subject.class_id', 'classes.id')
        .where('classes.school_id', user.schoolId)
        .whereNull('classes.archived_at')
        .if(!governance.canManageAllSections, (query) =>
          query.where('classes.school_section_id', governance.sectionId)
        )
        .countDistinct('classes.id as total')
        .first(),
    ])
    const averageCoefficient =
      schoolAssignments.length > 0
        ? Number(
            (
              schoolAssignments.reduce(
                (sum, assignment) => sum + Number(assignment.coefficient || 0),
                0
              ) / schoolAssignments.length
            ).toFixed(1)
          )
        : 0

    return view.render('schools/subjects/index', {
      school: this.getFallbackSchool(user),
      subjects: subjects.map((subject) => ({
        ...subject.serialize(),
        coefficient: localCoefficientBySubject.get(subject.id) || subject.coefficient,
        classesCount: assignmentsBySubject.get(subject.id)?.classes.size || 0,
        teachersCount: assignmentsBySubject.get(subject.id)?.teachers.size || 0,
      })),
      stats: {
        total: schoolSubjectIds.length,
        assigned: schoolSubjectIds.length,
        averageCoefficient,
        classesWithSubjects: Number(equippedClasses?.total || 0),
      },
      pagination: this.getPaginationMeta(paginator),
      url: '/schools/subjects',
    })
  }

  public async nationalSubjectsPage({ auth, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const [subjects, programs] = await Promise.all([
      Subject.query().where('isStandard', true).orderBy('name', 'asc'),
      db
        .from('subject_programs')
        .select(
          'subject_id',
          'level',
          'grade_level_min',
          'grade_level_max',
          'school_option',
          'default_coefficient',
          'default_hours_per_week'
        )
        .orderBy('level', 'asc')
        .orderBy('school_option', 'asc'),
    ])
    const programsBySubject = new Map<string, any[]>()

    for (const program of programs) {
      const subjectPrograms = programsBySubject.get(program.subject_id) || []
      subjectPrograms.push({
        level: program.level,
        gradeLevelMin: Number(program.grade_level_min),
        gradeLevelMax: Number(program.grade_level_max),
        schoolOption: program.school_option,
        coefficient: Number(program.default_coefficient || 1),
        hoursPerWeek: Number(program.default_hours_per_week || 2),
      })
      programsBySubject.set(program.subject_id, subjectPrograms)
    }

    return view.render('schools/subjects/catalog', {
      school: this.getFallbackSchool(user),
      subjects: subjects.map((subject) => {
        const subjectPrograms = programsBySubject.get(subject.id) || []

        return {
          ...subject.serialize(),
          programs: subjectPrograms,
          searchText: [
            subject.code,
            subject.name,
            subject.description,
            ...subjectPrograms.flatMap((program) => [program.level, program.schoolOption]),
          ]
            .filter(Boolean)
            .join(' '),
        }
      }),
    })
  }

  public async editSubjectPage({ auth, params, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const governance = await getGovernanceContext(user)
    const subject = await Subject.findOrFail(params.id)
    const assignments = await db
      .from('class_subject')
      .join('classes', 'class_subject.class_id', 'classes.id')
      .leftJoin('teachers', 'class_subject.teacher_id', 'teachers.id')
      .leftJoin('users', 'teachers.user_id', 'users.id')
      .where('class_subject.subject_id', subject.id)
      .where('classes.school_id', user.schoolId)
      .whereNull('classes.archived_at')
      .if(!governance.canManageAllSections, (query) =>
        query.where('classes.school_section_id', governance.sectionId)
      )
      .select(
        'class_subject.id',
        'class_subject.class_id',
        'class_subject.hours_per_week',
        'class_subject.coefficient',
        'classes.name as class_name',
        'users.first_name',
        'users.postnom',
        'users.last_name'
      )
      .orderBy('classes.grade_level', 'asc')
      .orderBy('classes.name', 'asc')

    const classIds = assignments.map((assignment) => assignment.class_id)
    const [studentsCount, averageGrade] = await Promise.all([
      classIds.length
        ? db
            .from('students')
            .where('school_id', user.schoolId)
            .where('academic_status', 'active')
            .whereIn('class_id', classIds)
            .countDistinct('id as total')
            .first()
        : Promise.resolve({ total: 0 }),
      db
        .from('grades')
        .join('classes', 'grades.class_id', 'classes.id')
        .where('grades.subject_id', subject.id)
        .where('classes.school_id', user.schoolId)
        .avg('grades.score as average')
        .first(),
    ])

    return view.render('schools/subjects/edit', {
      school: this.getFallbackSchool(user),
      subject,
      classes: assignments.map((assignment) => ({
        assignmentId: assignment.id,
        classId: assignment.class_id,
        className: assignment.class_name,
        teacherName:
          [assignment.first_name, assignment.last_name, assignment.postnom]
            .filter(Boolean)
            .join(' ') || null,
        hoursPerWeek: Number(assignment.hours_per_week || 0),
        coefficient: Number(assignment.coefficient || subject.coefficient || 1),
      })),
      stats: {
        classesCount: assignments.length,
        teachersCount: new Set(
          assignments
            .map((assignment) =>
              [assignment.first_name, assignment.last_name, assignment.postnom]
                .filter(Boolean)
                .join(' ')
            )
            .filter(Boolean)
        ).size,
        studentsCount: Number(studentsCount?.total || 0),
        averageGrade:
          averageGrade?.average === null || averageGrade?.average === undefined
            ? null
            : Number(averageGrade.average).toFixed(1),
      },
    })
  }

  public async assignSubjectsPage({ auth, request, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const governance = await getGovernanceContext(user)
    const [classes, subjects, teachers, rows, subjectPrograms] = await Promise.all([
      Class.query()
        .where('schoolId', user.schoolId)
        .whereNull('archivedAt')
        .if(!governance.canManageAllSections, (query) =>
          query.where('schoolSectionId', governance.sectionId)
        )
        .orderBy('gradeLevel', 'asc')
        .orderBy('name', 'asc'),
      Subject.query().where('isStandard', true).orderBy('name', 'asc'),
      Teacher.query()
        .where('schoolId', user.schoolId)
        .where('status', 'active')
        .preload('user')
        .orderBy('createdAt', 'desc'),
      db
        .from('class_subject')
        .join('classes', 'class_subject.class_id', 'classes.id')
        .join('subjects', 'class_subject.subject_id', 'subjects.id')
        .leftJoin('teachers', 'class_subject.teacher_id', 'teachers.id')
        .leftJoin('users', 'teachers.user_id', 'users.id')
        .where('classes.school_id', user.schoolId)
        .whereNull('classes.archived_at')
        .if(!governance.canManageAllSections, (query) =>
          query.where('classes.school_section_id', governance.sectionId)
        )
        .select(
          'class_subject.id',
          'class_subject.class_id',
          'class_subject.subject_id',
          'class_subject.hours_per_week',
          'class_subject.coefficient',
          'classes.name as class_name',
          'subjects.name as subject_name',
          'users.first_name',
          'users.postnom',
          'users.last_name'
        )
        .orderBy('classes.grade_level', 'asc')
        .orderBy('classes.name', 'asc')
        .orderBy('subjects.name', 'asc'),
      db
        .from('subject_programs')
        .select(
          'subject_id',
          'level',
          'grade_level_min',
          'grade_level_max',
          'school_option',
          'default_coefficient',
          'default_hours_per_week'
        ),
    ])

    const assignments = rows.map((row) => ({
      id: row.id,
      classId: row.class_id,
      subjectId: row.subject_id,
      className: row.class_name,
      subjectName: row.subject_name,
      teacherName:
        [row.first_name, row.last_name, row.postnom].filter(Boolean).join(' ') || 'Non assigné',
      hoursPerWeek: Number(row.hours_per_week || 0),
      coefficient: Number(row.coefficient || 1),
    }))
    const summaries = new Map<string, any>()
    for (const assignment of assignments) {
      const summary = summaries.get(assignment.classId) || {
        className: assignment.className,
        subjects: [],
        totalHours: 0,
      }
      summary.subjects.push({
        name: assignment.subjectName,
        hours: assignment.hoursPerWeek,
        coefficient: assignment.coefficient,
      })
      summary.totalHours += assignment.hoursPerWeek
      summaries.set(assignment.classId, summary)
    }

    return view.render('schools/subjects/assign', {
      school: this.getFallbackSchool(user),
      classes: classes.map((classObj) => ({
        ...classObj.serialize(),
        schoolOption: getClassSchoolOption(classObj),
      })),
      subjects,
      subjectPrograms,
      teachers,
      assignments,
      classSummaries: Array.from(summaries.values()),
      selectedSubjectId: String(request.input('subject_id', '')),
    })
  }

  /**
   * Obtenir toutes les matières
   */
  public async getSubjects({ response }: HttpContext) {
    const subjects = await Subject.query().where('isStandard', true).orderBy('name', 'asc')

    return response.ok({
      success: true,
      subjects: subjects,
    })
  }

  /**
   * Créer une nouvelle matière
   */
  public async createSubject({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createSubjectValidator)
    const subject = await Subject.query()
      .where('id', payload.subjectId)
      .where('isStandard', true)
      .firstOrFail()

    if (request.header('accept')?.includes('text/html')) {
      session.flash('success', `La matière ${subject.name} est prête à être assignée.`)
      return response.redirect(`/schools/subjects/assign?subject_id=${subject.id}`)
    }

    return response.created({
      success: true,
      message: 'Matière du référentiel sélectionnée',
      subject: subject,
    })
  }

  /**
   * Mettre à jour une matière
   */
  public async updateSubject({ request, params, response, session }: HttpContext) {
    const subject = await Subject.findOrFail(params.id)

    if (request.header('accept')?.includes('text/html')) {
      session.flash(
        'error',
        "Le nom et le code sont imposés par le référentiel national des matières."
      )
      return response.redirect(`/schools/subjects/${subject.id}/edit`)
    }

    return response.ok({
      success: false,
      message: 'Cette matière est protégée par le référentiel national.',
      subject: subject,
    })
  }

  /**
   * Supprimer une matière
   */
  public async deleteSubject({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const governance = await getGovernanceContext(user)
    const subject = await Subject.findOrFail(params.id)

    const gradesCountResult = await db
      .from('grades')
      .join('classes', 'grades.class_id', 'classes.id')
      .where('grades.subject_id', subject.id)
      .where('classes.school_id', user.schoolId)
      .if(!governance.canManageAllSections, (query) =>
        query.where('classes.school_section_id', governance.sectionId)
      )
      .count('* as total')
      .first()

    if (Number(gradesCountResult?.total || 0) > 0) {
      return response.badRequest({
        success: false,
        message: 'Impossible de supprimer une matière qui a des notes associées',
      })
    }

    await db
      .from('class_subject')
      .where('subject_id', subject.id)
      .whereIn(
        'class_id',
        db
          .from('classes')
          .where('school_id', user.schoolId)
          .if(!governance.canManageAllSections, (query) =>
            query.where('school_section_id', governance.sectionId)
          )
          .select('id')
      )
      .delete()

    return response.ok({
      success: true,
      message: 'Matière retirée du programme de cet établissement',
    })
  }

  /**
   * Assigner une matière à une classe
   */
  public async addSubjectToClass({
    auth,
    request,
    params,
    response,
    session,
  }: HttpContext) {
    const user = auth.getUserOrFail()
    const governance = await getGovernanceContext(user)
    const wantsHtml = request.accepts(['html', 'json']) === 'html'
    const assignmentSchema = vine.compile(
      vine.object({
        subjectId: vine.string().exists({ table: 'subjects', column: 'id' }),
        teacherId: vine.string().exists({ table: 'teachers', column: 'id' }),
        hoursPerWeek: vine.number().range([1, 20]).optional(),
        coefficient: vine.number().range([1, 5]).optional(),
      })
    )
    const payload = await request.validateUsing(assignmentSchema)

    const classId = params.classId || request.input('classId')
    const classObj = await Class.query()
      .where('id', classId)
      .where('schoolId', user.schoolId)
      .whereNull('archivedAt')
      .if(!governance.canManageAllSections, (query) =>
        query.where('schoolSectionId', governance.sectionId)
      )
      .firstOrFail()
    await Teacher.query()
      .where('id', payload.teacherId)
      .where('schoolId', user.schoolId)
      .firstOrFail()
    const subject = await Subject.query()
      .where('id', payload.subjectId)
      .where('isStandard', true)
      .firstOrFail()
    const classOption = getClassSchoolOption(classObj)
    const program = await db
      .from('subject_programs')
      .where('subject_id', subject.id)
      .where('grade_level_min', '<=', classObj.gradeLevel)
      .where('grade_level_max', '>=', classObj.gradeLevel)
      .where((query) => {
        query.where('level', 'Tous').orWhere('level', classObj.level)
      })
      .where((query) => {
        query.whereNull('school_option')
        if (classOption) query.orWhere('school_option', classOption)
      })
      .orderByRaw('case when school_option is null then 1 else 0 end')
      .first()

    if (!program) {
      return response.badRequest({
        success: false,
        message: `Cette matière ne fait pas partie du programme prévu pour ${classObj.name}.`,
      })
    }

    // Vérifier si la matière est déjà assignée
    const existingAssignment = await db
      .from('class_subject')
      .where('class_id', classObj.id)
      .where('subject_id', payload.subjectId)
      .first()

    if (existingAssignment) {
      if (wantsHtml) {
        session.flash('error', 'Cette matière est déjà assignée à cette classe.')
        return response.redirect('/schools/subjects/assign')
      }

      return response.conflict({
        success: false,
        message: 'Cette matière est déjà assignée à cette classe',
      })
    }

    await db.table('class_subject').insert({
      class_id: classObj.id,
      subject_id: payload.subjectId,
      teacher_id: payload.teacherId,
      hours_per_week: payload.hoursPerWeek || program.default_hours_per_week || 2,
      coefficient:
        payload.coefficient || program.default_coefficient || subject.coefficient || 1,
      created_at: DateTime.now().toSQL(),
    })

    if (wantsHtml) {
      session.flash('success', 'Matière assignée à la classe avec succès.')
      return response.redirect('/schools/subjects/assign')
    }

    return response.created({
      success: true,
      message: 'Matière assignée à la classe avec succès',
    })
  }

  /**
   * Obtenir les matières d'une classe
   */
  public async removeSubjectFromClass({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const governance = await getGovernanceContext(user)
    const classObj = await Class.query()
      .where('id', params.classId)
      .where('schoolId', user.schoolId)
      .whereNull('archivedAt')
      .if(!governance.canManageAllSections, (query) =>
        query.where('schoolSectionId', governance.sectionId)
      )
      .firstOrFail()

    const deleted = await db
      .from('class_subject')
      .where('class_id', classObj.id)
      .where('subject_id', params.subjectId)
      .delete()

    if (!deleted) {
      return response.notFound({
        success: false,
        message: 'Cette matiere n est pas assignee a cette classe',
      })
    }

    return response.ok({
      success: true,
      message: 'Matiere retiree de la classe avec succes',
    })
  }

  public async getClassSubjects({ params, response }: HttpContext) {
    const subjects = await db
      .from('class_subject')
      .where('class_id', params.classId)
      .join('subjects', 'class_subject.subject_id', 'subjects.id')
      .join('teachers', 'class_subject.teacher_id', 'teachers.id')
      .join('users', 'teachers.user_id', 'users.id')
      .select(
        'class_subject.*',
        'subjects.name as subject_name',
        'subjects.code as subject_code',
        'class_subject.coefficient',
        'users.first_name as teacher_first_name',
        'users.last_name as teacher_last_name'
      )

    return response.ok({
      success: true,
      subjects: subjects,
    })
  }

  /**
   * ==================== GESTION DES NOTES (GRADES) ====================
   */

  /**
   * Obtenir les notes d'une classe
   */
  public async getGradesByClass({ params, request, response }: HttpContext) {
    const term = request.input('term')
    const academicYear = request.input('academic_year')
    const subjectId = request.input('subject_id')

    const query = Grade.query()
      .where('classId', params.classId)
      .preload('student', (studentQuery) => {
        studentQuery.preload('user')
      })
      .preload('subject')

    if (term) query.where('term', term)
    if (academicYear) query.where('academicYear', academicYear)
    if (subjectId) query.where('subjectId', subjectId)

    const grades = await query.orderBy('examDate', 'desc')

    // Organiser les notes par élève
    const gradesByStudent = new Map()

    for (const grade of grades) {
      const studentId = grade.studentId
      if (!gradesByStudent.has(studentId)) {
        gradesByStudent.set(studentId, {
          student: grade.student,
          grades: [],
          average: 0,
        })
      }
      gradesByStudent.get(studentId).grades.push(grade)
    }

    // Calculer les moyennes
    for (const data of gradesByStudent.values()) {
      const numericScores = data.grades
        .map((grade: Grade) => grade.score)
        .filter((score: number | null): score is number => score !== null && Number.isFinite(score))
      const sum = numericScores.reduce((acc: number, score: number) => acc + score, 0)
      data.average = numericScores.length > 0 ? sum / numericScores.length : 0
    }

    return response.ok({
      success: true,
      gradesByStudent: Array.from(gradesByStudent.values()),
      totalGrades: grades.length,
    })
  }

  /**
   * Obtenir les notes d'un élève
   */
  public async getGradesByStudent({ params, request, response }: HttpContext) {
    const term = request.input('term')
    const academicYear = request.input('academic_year')

    const query = Grade.query()
      .where('studentId', params.studentId)
      .preload('subject')
      .preload('class')

    if (term) query.where('term', term)
    if (academicYear) query.where('academicYear', academicYear)

    const grades = await query.orderBy('examDate', 'desc')

    // Calculer les moyennes par matière
    const subjectsMap = new Map()
    let totalPoints = 0
    let totalCoefficients = 0

    for (const grade of grades) {
      if (grade.score === null || !Number.isFinite(grade.score)) continue

      const subjectId = grade.subjectId
      if (!subjectsMap.has(subjectId)) {
        subjectsMap.set(subjectId, {
          subject: grade.subject.name,
          coefficient: grade.subject.coefficient,
          grades: [],
          average: 0,
          best: 0,
          worst: 20,
        })
      }
      const data = subjectsMap.get(subjectId)
      data.grades.push(grade.score)
      if (grade.score > data.best) data.best = grade.score
      if (grade.score < data.worst) data.worst = grade.score
    }

    for (const data of subjectsMap.values()) {
      const sum = data.grades.reduce((a: number, b: number) => a + b, 0)
      data.average = data.grades.length > 0 ? sum / data.grades.length : 0
      totalPoints += data.average * data.coefficient
      totalCoefficients += data.coefficient
    }

    const overallAverage = totalCoefficients > 0 ? totalPoints / totalCoefficients : 0

    return response.ok({
      success: true,
      grades: grades,
      subjectsSummary: Array.from(subjectsMap.values()),
      overallAverage: overallAverage,
    })
  }

  public async removeSubjectAssignment({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const governance = await getGovernanceContext(user)
    const assignment = await db
      .from('class_subject')
      .join('classes', 'class_subject.class_id', 'classes.id')
      .where('class_subject.id', params.id)
      .where('classes.school_id', user.schoolId)
      .if(!governance.canManageAllSections, (query) =>
        query.where('classes.school_section_id', governance.sectionId)
      )
      .select('class_subject.id')
      .first()

    if (!assignment) {
      return response.notFound({ success: false, message: 'Assignation introuvable.' })
    }

    await db.from('class_subject').where('id', assignment.id).delete()
    return response.ok({ success: true, message: 'Assignation retirée avec succès.' })
  }

  public async getSubjectClasses({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const governance = await getGovernanceContext(user)
    const classes = await db
      .from('class_subject')
      .join('classes', 'class_subject.class_id', 'classes.id')
      .leftJoin('teachers', 'class_subject.teacher_id', 'teachers.id')
      .leftJoin('users', 'teachers.user_id', 'users.id')
      .where('class_subject.subject_id', params.id)
      .where('classes.school_id', user.schoolId)
      .whereNull('classes.archived_at')
      .if(!governance.canManageAllSections, (query) =>
        query.where('classes.school_section_id', governance.sectionId)
      )
      .select(
        'classes.id',
        'classes.name',
        'class_subject.hours_per_week',
        'users.first_name',
        'users.postnom',
        'users.last_name'
      )
      .orderBy('classes.name', 'asc')

    return response.ok({
      success: true,
      classes: classes.map((classObj) => ({
        id: classObj.id,
        name: classObj.name,
        hoursPerWeek: Number(classObj.hours_per_week || 0),
        teacherName:
          [classObj.first_name, classObj.last_name, classObj.postnom]
            .filter(Boolean)
            .join(' ') || null,
      })),
    })
  }

  public async studentGradesPage({ auth, params, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const student = await Student.query()
      .where('id', params.studentId)
      .where('schoolId', user.schoolId)
      .preload('user')
      .preload('class')
      .preload('school')
      .firstOrFail()

    const grades = await Grade.query()
      .where('studentId', student.id)
      .preload('subject')
      .orderBy('examDate', 'asc')
    const assignedSubjects = student.classId
      ? await db
          .from('class_subject')
          .where('class_subject.class_id', student.classId)
          .join('subjects', 'class_subject.subject_id', 'subjects.id')
          .select(
            'subjects.id as subject_id',
            'subjects.name as subject_name',
            'subjects.coefficient'
          )
      : []
    const parentRecord = await db
      .from('parent_student')
      .join('parents', 'parent_student.parent_id', 'parents.id')
      .join('users', 'parents.user_id', 'users.id')
      .where('parent_student.student_id', student.id)
      .select(
        'users.first_name as firstName',
        'users.postnom as postnom',
        'users.last_name as lastName',
        'parents.relationship'
      )
      .first()
    const attendance = await db
      .from('attendances')
      .where('student_id', student.id)
      .select(
        db.raw(
          "sum(case when status in ('present', 'excused') then 1 else 0 end) as present_total"
        )
      )
      .count('* as total')
      .first()
    const attendanceTotal = Number(attendance?.total || 0)
    const attendanceRate = attendanceTotal
      ? Math.round((Number(attendance?.present_total || 0) / attendanceTotal) * 100)
      : null

    const normalizeTerm = (term?: string | null) => {
      const value = String(term || '').toLowerCase()
      if (value.includes('2') || value.includes('t2')) return 't2'
      if (value.includes('3') || value.includes('t3')) return 't3'
      return 't1'
    }
    const average = (values: number[]) =>
      values.length
        ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1))
        : 0

    const subjectBuckets = new Map<
      string,
      {
        name: string
        coefficient: number
        terms: { t1: number[]; t2: number[]; t3: number[] }
      }
    >()
    for (const subject of assignedSubjects) {
      subjectBuckets.set(subject.subject_id, {
        name: subject.subject_name || 'Matière',
        coefficient: Number(subject.coefficient || 1),
        terms: { t1: [], t2: [], t3: [] },
      })
    }

    for (const grade of grades) {
      if (grade.score === null || !Number.isFinite(Number(grade.score))) continue

      const term = normalizeTerm(grade.term)
      const score = Number(grade.score)

      if (!subjectBuckets.has(grade.subjectId)) {
        subjectBuckets.set(grade.subjectId, {
          name: grade.subject?.name || 'Matière',
          coefficient: Number(grade.subject?.coefficient || 1),
          terms: { t1: [], t2: [], t3: [] },
        })
      }
      subjectBuckets.get(grade.subjectId)!.terms[term].push(score)
    }

    const subjectRows = Array.from(subjectBuckets.values()).map((subject) => {
      const t1 = average(subject.terms.t1)
      const t2 = average(subject.terms.t2)
      const t3 = average(subject.terms.t3)
      const values = [t1, t2, t3].filter((value) => value > 0)
      const first = values[0] || 0
      const last = values[values.length - 1] || 0

      return {
        name: subject.name,
        t1,
        t2,
        t3,
        average: average(values),
        coefficient: subject.coefficient,
        trend: last - first,
        hasGrades: values.length > 0,
      }
    })
    const weightedAverage = (items: Array<{ value: number; coefficient: number }>) => {
      const validItems = items.filter((item) => item.value > 0)
      const coefficientTotal = validItems.reduce((sum, item) => sum + item.coefficient, 0)
      if (!coefficientTotal) return 0

      return Number(
        (
          validItems.reduce((sum, item) => sum + item.value * item.coefficient, 0) /
          coefficientTotal
        ).toFixed(1)
      )
    }
    const termAverages = {
      t1: weightedAverage(subjectRows.map((subject) => ({ value: subject.t1, coefficient: subject.coefficient }))),
      t2: weightedAverage(subjectRows.map((subject) => ({ value: subject.t2, coefficient: subject.coefficient }))),
      t3: weightedAverage(subjectRows.map((subject) => ({ value: subject.t3, coefficient: subject.coefficient }))),
    }
    const overallAverage = weightedAverage(
      subjectRows.map((subject) => ({ value: subject.average, coefficient: subject.coefficient }))
    )
    const totalCoefficient = Array.from(subjectBuckets.values()).reduce(
      (sum, subject) => sum + subject.coefficient,
      0
    )
    const activeStudents = student.classId
      ? await Student.query()
          .where('classId', student.classId)
          .where('academicStatus', 'active')
          .select('id')
      : []
    const totalStudents = activeStudents.length
    const rankRows = student.classId
      ? await Grade.query()
          .whereIn(
            'studentId',
            activeStudents.map((classStudent) => classStudent.id)
          )
          .preload('subject')
      : []
    const averagesByStudent = new Map<string, Map<string, number[]>>()
    for (const grade of rankRows) {
      if (grade.score === null || !Number.isFinite(Number(grade.score))) continue
      if (!averagesByStudent.has(grade.studentId)) averagesByStudent.set(grade.studentId, new Map())
      const subjects = averagesByStudent.get(grade.studentId)!
      if (!subjects.has(grade.subjectId)) subjects.set(grade.subjectId, [])
      subjects.get(grade.subjectId)!.push(Number(grade.score))
    }
    const rankedStudents = Array.from(averagesByStudent.entries())
      .map(([studentId, subjects]) => {
        const items = Array.from(subjects.entries()).map(([subjectId, scores]) => {
          const subject = subjectBuckets.get(subjectId)
          return {
            value: average(scores),
            coefficient: subject?.coefficient || 1,
          }
        })

        return { studentId, average: weightedAverage(items) }
      })
      .filter((item) => item.average > 0)
      .sort((a, b) => b.average - a.average)
    const rankIndex = rankedStudents.findIndex((item) => item.studentId === student.id)
    const rank = rankIndex >= 0 ? rankIndex + 1 : '-'
    const decile = typeof rank === 'number' && totalStudents
      ? Math.max(1, Math.ceil((rank / totalStudents) * 10))
      : '-'
    const parentName = parentRecord
      ? [
          [parentRecord.firstName, parentRecord.lastName, parentRecord.postnom].filter(Boolean).join(' '),
          parentRecord.relationship ? `(${parentRecord.relationship})` : '',
        ]
          .filter(Boolean)
          .join(' ')
      : '-'
    const attendanceLabel = attendanceRate === null ? '-' : `${attendanceRate}%`

    return view.render('academic/grades/student-grades', {
      school: {
        id: user.schoolId,
        name: student.school?.name || 'Gestion Éducative RDC',
      },
      student: {
        id: student.id,
        name: student.user?.fullName || 'Élève',
        registrationNumber: student.registrationNumber || '-',
        className: student.class?.name || 'Non affecté',
        birthDate: student.birthDate ? student.birthDate.toFormat('dd/MM/yyyy') : '-',
        parentName,
        parentPhone: student.parentPhone || '-',
      },
      termsSummary: [
        { term: 'Trimestre 1', average: termAverages.t1, rank, attendance: attendanceRate || 0, attendanceLabel, hasGrades: termAverages.t1 > 0 },
        { term: 'Trimestre 2', average: termAverages.t2, rank, attendance: attendanceRate || 0, attendanceLabel, hasGrades: termAverages.t2 > 0 },
        { term: 'Trimestre 3', average: termAverages.t3, rank, attendance: attendanceRate || 0, attendanceLabel, hasGrades: termAverages.t3 > 0 },
      ],
      subjectsGrades: subjectRows,
      termAverages,
      overallAverage,
      hasOverallAverage: overallAverage > 0,
      totalCoefficient,
      rank,
      totalStudents,
      decile,
    })
  }

  /**
   * Ajouter une note
   */
  public async addGrade({ request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(addGradeValidator)

    // Vérifier que l'utilisateur a le droit d'ajouter une note
    const teacher = await Teacher.query()
      .where('userId', user.id)
      .where('schoolId', user.schoolId)
      .first()

    if (!teacher && user.role !== 'director') {
      return response.forbidden({
        success: false,
        message: "Vous n'êtes pas autorisé à ajouter des notes",
      })
    }

    // Vérifier que l'élève est bien dans la classe
    const student = await Student.query()
      .where('id', payload.studentId)
      .where('classId', payload.classId)
      .first()

    if (!student) {
      return response.badRequest({
        success: false,
        message: "Cet élève n'appartient pas à la classe spécifiée",
      })
    }

    // Vérifier si une note existe déjà pour cet examen
    const existingGrade = await Grade.query()
      .where('studentId', payload.studentId)
      .where('subjectId', payload.subjectId)
      .where('term', payload.term)
      .where('examType', payload.examType)
      .first()

    if (existingGrade) {
      return response.conflict({
        success: false,
        message: 'Une note existe déjà pour cet examen',
      })
    }

    const grade = new Grade()
    grade.fill({
      ...payload,
      percentage: (payload.score / (payload.maxScore || 20)) * 100,
      published: false,
    })

    await grade.save()

    return response.created({
      success: true,
      message: 'Note ajoutée avec succès',
      grade: grade,
    })
  }

  /**
   * Mettre à jour une note
   */
  public async updateGrade({ request, params, response }: HttpContext) {
    const payload = await request.validateUsing(updateGradeValidator)

    const grade = await Grade.findOrFail(params.id)

    if (payload.score !== undefined) {
      grade.score = payload.score
      grade.percentage = grade.maxScore > 0 ? (grade.score / grade.maxScore) * 100 : 0
    }
    if (payload.teacherComments !== undefined) grade.teacherComments = payload.teacherComments
    if (payload.published !== undefined) {
      grade.published = payload.published
      if (payload.published) {
        grade.publishedAt = DateTime.now()
      }
    }

    await grade.save()

    return response.ok({
      success: true,
      message: 'Note mise à jour avec succès',
      grade: grade,
    })
  }

  /**
   * Publier les notes d'une classe
   */
  public async publishGrades({ request, response }: HttpContext) {
    const publishSchema = vine.compile(
      vine.object({
        classId: vine.string().exists({ table: 'classes', column: 'id' }),
        term: vine.string().trim(),
        academicYear: vine.string().trim().optional(),
        notifyParents: vine.boolean().optional(),
      })
    )
    const payload = await request.validateUsing(publishSchema)

    const updatedRows = await Grade.query()
      .where('classId', payload.classId)
      .where('term', payload.term)
      .update({
        published: true,
        publishedAt: DateTime.now().toSQL(),
      })

    // Notifier les parents si demandé
    if (payload.notifyParents) {
      const students = await Student.query()
        .where('classId', payload.classId)
        .preload('parents', (parentQuery) => {
          parentQuery.preload('user')
        })

      for (const student of students) {
        for (const parent of student.parents) {
          await db.table('notifications').insert({
            user_id: parent.userId,
            type: 'grades_published',
            title: 'Notes publiées',
            content: `Les notes du ${payload.term} pour votre enfant ${student.user?.fullName || 'votre enfant'} sont disponibles sur la plateforme.`,
            created_at: DateTime.now().toSQL(),
          })
        }
      }
    }

    return response.ok({
      success: true,
      message: `${updatedRows[0]} note(s) publiée(s) avec succès`,
    })
  }

  /**
   * Supprimer une note
   */
  public async deleteGrade({ params, response }: HttpContext) {
    const grade = await Grade.findOrFail(params.id)
    await grade.delete()

    return response.ok({
      success: true,
      message: 'Note supprimée avec succès',
    })
  }

  /**
   * ==================== MÉTHODES PRIVÉES ====================
   */

  /**
   * Calculer la moyenne d'une classe
   */
  private async getClassAverage(classId: string): Promise<number> {
    const result = await Grade.query().where('classId', classId).avg('score', 'average')

    return Number(result[0].$extras.average || 0)
  }

  /**
   * Calculer le taux de présence d'une classe
   */
  private async getClassAttendance(classId: string): Promise<number> {
    try {
      const result = await db
        .from('attendances')
        .where('class_id', classId)
        .where('status', 'present')
        .count('*', 'present')
        .first()

      const totalResult = await db
        .from('attendances')
        .where('class_id', classId)
        .count('*', 'total')
        .first()

      const total = Number(totalResult?.total || 0)
      if (total === 0) return 0

      return (Number(result?.present || 0) / total) * 100
    } catch (error) {
      return 0
    }
  }

  /**
   * ==================== STATISTIQUES SCOLAIRES ====================
   */

  /**
   * Obtenir les statistiques scolaires
   */
  public async getAcademicStats({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const academicYear = request.input('academic_year', DateTime.now().year.toString())

    // Statistiques générales
    const totalStudentsResult = await Student.query()
      .where('schoolId', user.schoolId)
      .where('academicStatus', 'active')
      .count('*', 'total')

    const totalClassesResult = await Class.query()
      .where('schoolId', user.schoolId)
      .where('academicYear', academicYear)
      .whereNull('archivedAt')
      .count('*', 'total')

    const averageGradeResult = await Grade.query()
      .whereHas('student', (query) => {
        query.where('schoolId', user.schoolId)
      })
      .avg('score', 'average')

    // Répartition par niveau
    const studentsByLevel = await db
      .from('students')
      .join('classes', 'students.class_id', 'classes.id')
      .where('students.school_id', user.schoolId)
      .where('students.academic_status', 'active')
      .select('classes.level')
      .count('*', 'total')
      .groupBy('classes.level')

    // Performance par matière
    const performanceBySubject = await db
      .from('grades')
      .join('subjects', 'grades.subject_id', 'subjects.id')
      .join('students', 'grades.student_id', 'students.id')
      .where('students.school_id', user.schoolId)
      .select('subjects.name', 'subjects.code')
      .avg('grades.score as average')
      .groupBy('subjects.name', 'subjects.code')
      .orderBy('average', 'desc')

    return response.ok({
      success: true,
      stats: {
        totalStudents: Number(totalStudentsResult[0].$extras.total),
        totalClasses: Number(totalClassesResult[0].$extras.total),
        averageGrade: Number(averageGradeResult[0].$extras.average || 0),
        studentsByLevel,
        performanceBySubject,
      },
    })
  }

  /**
   * Obtenir les statistiques de progression
   */
  public async getProgressStats({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const classId = request.input('class_id')
    const startDate = request.input('start_date')
    const endDate = request.input('end_date')

    const query = Grade.query()
      .whereHas('student', (studentQuery) => {
        studentQuery.where('schoolId', user.schoolId)
        if (classId) {
          studentQuery.where('classId', classId)
        }
      })
      .preload('subject')

    if (startDate) {
      query.where('examDate', '>=', startDate)
    }
    if (endDate) {
      query.where('examDate', '<=', endDate)
    }

    const grades = await query.orderBy('examDate', 'asc')

    // Progression par matière
    const progressionBySubject = new Map()

    for (const grade of grades) {
      const subjectId = grade.subjectId
      if (!progressionBySubject.has(subjectId)) {
        progressionBySubject.set(subjectId, {
          subject: grade.subject.name,
          data: [],
        })
      }
      progressionBySubject.get(subjectId).data.push({
        date: grade.examDate,
        average: grade.score ?? 0,
      })
    }

    return response.ok({
      success: true,
      progression: Array.from(progressionBySubject.values()),
    })
  }
}
