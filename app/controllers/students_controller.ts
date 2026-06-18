import { type HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import { randomBytes } from 'node:crypto'
import vine from '@vinejs/vine'

// Imports des modèles (Subpath alias)
import Student from '#models/student'
import User from '#models/user'
import Class from '#models/class'
import Grade from '#models/grade'
import Assignment from '#models/assignment'
import AssignmentSubmission from '#models/assignment_submission'
import ForumTopic from '#models/forum_topic'
// import ForumPost from '#models/forum_post'
import Discipline from '#models/discipline'
import Message from '#models/message'

// Import dynamique pour éviter les soucis de circularité sur TransferAuthorization
// On l'importera dans la méthode concernée comme dans ton code original

// Import des validateurs VineJS
import { submitAssignmentValidator, postForumQuestionValidator } from '#validators/student'

export default class StudentController {
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

  public async indexPage({ auth, request, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const page = Number(request.input('page', 1))
    const classId = request.input('class_id')
    const status = request.input('status')
    const gender = request.input('gender')
    const search = String(request.input('search', '')).trim()

    const query = Student.query()
      .where('schoolId', user.schoolId)
      .preload('user')
      .preload('class')
      .if(classId, (studentQuery) => studentQuery.where('classId', classId))
      .if(status, (studentQuery) => studentQuery.where('academicStatus', status))
      .if(gender, (studentQuery) => studentQuery.where('gender', gender))
      .if(search, (studentQuery) => {
        studentQuery.where((searchQuery) => {
          searchQuery
            .whereILike('registrationNumber', `%${search}%`)
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
    const [classes, total, active, girls, boys] = await Promise.all([
      Class.query().where('schoolId', user.schoolId).orderBy('name', 'asc'),
      Student.query().where('schoolId', user.schoolId).count('* as total').first(),
      Student.query()
        .where('schoolId', user.schoolId)
        .where('academicStatus', 'active')
        .count('* as total')
        .first(),
      Student.query().where('schoolId', user.schoolId).where('gender', 'female').count('* as total').first(),
      Student.query().where('schoolId', user.schoolId).where('gender', 'male').count('* as total').first(),
    ])

    return view.render('students/index', {
      school: {
        id: user.schoolId,
        name: 'Gestion Éducative RDC',
      },
      students: paginator.all(),
      classes,
      stats: {
        total: Number(total?.$extras.total || 0),
        active: Number(active?.$extras.total || 0),
        girls: Number(girls?.$extras.total || 0),
        boys: Number(boys?.$extras.total || 0),
      },
      pagination: this.getPaginationMeta(paginator),
      url: '/students',
    })
  }

  public async createPage({ auth, request, view }: HttpContext) {
    const user = auth.getUserOrFail()
    await this.ensureRdcDasClasses(user.schoolId)

    const classes = await Class.query()
      .where('schoolId', user.schoolId)
      .orderBy('gradeLevel', 'asc')
      .orderBy('name', 'asc')

    return view.render('students/create', {
      school: {
        id: user.schoolId,
        name: 'Gestion Éducative RDC',
      },
      classes,
      schoolOptions: this.getRdcSchoolOptions(),
      selectedClassId: request.input('class_id', ''),
    })
  }

  public async showPage({ auth, params, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const student = await Student.query()
      .where('id', params.id)
      .where('schoolId', user.schoolId)
      .preload('user')
      .preload('class')
      .preload('school')
      .firstOrFail()

    const [recentGrades, incidentsCount] = await Promise.all([
      Grade.query()
        .where('studentId', student.id)
        .preload('subject')
        .orderBy('examDate', 'desc')
        .limit(5),
      Discipline.query().where('studentId', student.id).count('* as total').first(),
    ])

    const averageGrade = recentGrades.length
      ? (
          recentGrades.reduce((sum, grade) => sum + Number(grade.score || 0), 0) /
          recentGrades.length
        ).toFixed(1)
      : '-'

    return view.render('students/show', {
      school: {
        id: user.schoolId,
        name: student.school?.name || 'Gestion Éducative RDC',
      },
      student,
      recentGrades,
      stats: {
        averageGrade,
        incidentsCount: Number(incidentsCount?.$extras.total || 0),
      },
    })
  }

  public async store({ auth, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const schema = vine.compile(
      vine.object({
        firstName: vine.string().trim(),
        postnom: vine.string().trim(),
        lastName: vine.string().trim(),
        email: vine.string().email().unique({ table: 'users', column: 'email' }),
        phone: vine.string().trim().optional(),
        classId: vine.string().exists({ table: 'classes', column: 'id' }).optional(),
        schoolOption: vine.string().trim().optional(),
        birthDate: vine.date({ formats: ['YYYY-MM-DD'] }),
        birthPlace: vine.string().trim().optional(),
        nationality: vine.string().trim().optional(),
        gender: vine.enum(['male', 'female']),
        parentPhone: vine.string().trim(),
        address: vine.string().trim().optional(),
        medicalInfo: vine.string().trim().optional(),
      })
    )
    const payload = await request.validateUsing(schema)
    const selectedClass = payload.classId
      ? await Class.query().where('id', payload.classId).where('schoolId', user.schoolId).first()
      : null
    const schoolOptions = this.getRdcSchoolOptions()
    const isHumanities = this.isHumanitiesClass(selectedClass)

    if (isHumanities && (!payload.schoolOption || !schoolOptions.includes(payload.schoolOption))) {
      session.flash('error', "Veuillez sélectionner une option valide pour cette classe des humanités.")
      return response.redirect().back()
    }

    const tempPassword = randomBytes(6).toString('hex')
    const registrationNumber = `STU-${Date.now()}`

    await db.transaction(async (trx) => {
      const studentUser = new User()
      studentUser.useTransaction(trx)
      studentUser.schoolId = user.schoolId
      studentUser.firstName = payload.firstName
      studentUser.postnom = payload.postnom
      studentUser.lastName = payload.lastName
      studentUser.email = payload.email.trim().toLowerCase()
      studentUser.phone = payload.phone || null
      studentUser.password = tempPassword
      studentUser.role = 'student'
      studentUser.status = 'active'
      studentUser.mustChangePassword = true
      await studentUser.save()

      const student = new Student()
      student.useTransaction(trx)
      student.userId = studentUser.id
      student.schoolId = user.schoolId
      student.classId = payload.classId || null
      student.schoolOption = isHumanities ? payload.schoolOption! : null
      student.registrationNumber = registrationNumber
      student.birthDate = payload.birthDate
      student.birthPlace = payload.birthPlace || ''
      student.nationality = payload.nationality || 'Congolaise'
      student.gender = payload.gender
      student.parentPhone = payload.parentPhone
      student.address = payload.address || ''
      student.medicalInfo = payload.medicalInfo || null
      student.academicStatus = 'active'
      student.shift = 'morning'
      await student.save()
    })

    session.flash(
      'success',
      `Élève créé avec succès. Email: ${payload.email}. Mot de passe temporaire: ${tempPassword}`
    )

    return response.redirect('/students/create')
  }

  /**
   * Obtenir mon profil
   */
  public async getMyProfile({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const student = await Student.query()
      .where('user_id', user.id)
      .preload('user')
      .preload('class', (classQuery) => {
        classQuery.preload('teacher', (teacherQuery) => {
          teacherQuery.preload('user')
        })
      })
      .preload('school')
      .firstOrFail()

    // Statistiques
    const grades = await Grade.query().where('student_id', student.id).avg('score as average')

    const assignments = await AssignmentSubmission.query().where('student_id', student.id)

    const submitted = assignments.filter((a) => a.status === 'submitted').length
    const graded = assignments.filter((a) => a.status === 'graded').length

    const disciplineCount = await Discipline.query()
      .where('student_id', student.id)
      .count('* as total')

    return response.ok({
      success: true,
      profile: {
        ...student.toJSON(),
        stats: {
          averageGrade: Number(grades[0].$extras.average || 0),
          assignmentsSubmitted: submitted,
          assignmentsGraded: graded,
          disciplineIncidents: Number(disciplineCount[0].$extras.total),
        },
      },
    })
  }

  /**
   * Obtenir mes notes
   */
  public async getMyGrades({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const student = await Student.findByOrFail('user_id', user.id)

    const term = request.input('term')
    const academicYear = request.input('academic_year')

    const query = Grade.query().where('student_id', student.id).preload('subject').preload('class')

    if (term) query.where('term', term)
    if (academicYear) query.where('academic_year', academicYear)

    const grades = await query.orderBy('exam_date', 'desc')

    // Calculer les moyennes par matière
    const subjectsMap = new Map()
    for (const grade of grades) {
      if (grade.score === null) continue

      const score = grade.score

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
      data.grades.push(score)
      if (score > data.best) data.best = score
      if (score < data.worst) data.worst = score
    }

    for (const data of subjectsMap.values()) {
      const sum = data.grades.reduce((a: number, b: number) => a + b, 0)
      data.average = sum / data.grades.length
    }

    // Calculer la moyenne générale
    let totalPoints = 0
    let totalCoefficients = 0
    for (const data of subjectsMap.values()) {
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

  /**
   * Obtenir mon bulletin
   */
  public async getMyReportCard({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const student = await Student.query()
      .where('user_id', user.id)
      .preload('user')
      .preload('class')
      .firstOrFail()

    const term = request.input('term')
    const academicYear = request.input('academic_year')

    const grades = await Grade.query()
      .where('student_id', student.id)
      .where('term', term)
      .where('academic_year', academicYear)
      .where('published', true)
      .preload('subject')
      .orderBy('created_at', 'asc')

    // Calculer les moyennes par matière
    const subjectsGrades = new Map()
    let totalPoints = 0
    let totalCoefficients = 0

    for (const grade of grades) {
      if (grade.score === null) continue

      const score = grade.score

      const subjectId = grade.subjectId
      if (!subjectsGrades.has(subjectId)) {
        subjectsGrades.set(subjectId, {
          subject: grade.subject.name,
          coefficient: grade.subject.coefficient,
          grades: [],
          average: 0,
        })
      }
      subjectsGrades.get(subjectId).grades.push(score)
    }
    for (const data of subjectsGrades.values()) {
      const sum = data.grades.reduce((a: number, b: number) => a + b, 0)
      data.average = sum / data.grades.length
      totalPoints += data.average * data.coefficient
      totalCoefficients += data.coefficient
    }

    const overallAverage = totalCoefficients > 0 ? totalPoints / totalCoefficients : 0

    const appreciation = await db
      .from('appreciations')
      .where('student_id', student.id)
      .where('term', term)
      .where('academic_year', academicYear)
      .first()

    return response.ok({
      success: true,
      reportCard: {
        student: {
          name: student.user?.fullName || '-',
          registrationNumber: student.registrationNumber,
          class: student.class?.name,
        },
        term: term,
        academicYear: academicYear,
        grades: Array.from(subjectsGrades.values()),
        overallAverage: overallAverage,
        appreciation: appreciation?.comment || 'Continuez vos efforts !',
        rank: await this.calculateRank(student.id, student.classId!, term, academicYear),
      },
    })
  }

  private async calculateRank(
    studentId: string,
    classId: string,
    term: string,
    academicYear: string
  ): Promise<number> {
    const averages = await db
      .from('grades')
      .join('students', 'grades.student_id', 'students.id')
      .where('students.class_id', classId)
      .where('grades.term', term)
      .where('grades.academic_year', academicYear)
      .select('grades.student_id')
      .avg('grades.score as average')
      .groupBy('grades.student_id')
      .orderBy('average', 'desc')

    const studentIndex = averages.findIndex((a) => a.student_id === studentId)
    return studentIndex + 1
  }

  /**
   * Obtenir mes devoirs
   */
  public async getAssignments({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const student = await Student.findByOrFail('user_id', user.id)

    const assignments = await Assignment.query()
      .where('class_id', student.classId!)
      .where('status', 'published')
      .preload('subject')
      .preload('teacher', (teacherQuery) => {
        teacherQuery.preload('user')
      })
      .orderBy('due_date', 'asc')

    const assignmentsWithStatus = await Promise.all(
      assignments.map(async (assignment) => {
        const submission = await AssignmentSubmission.query()
          .where('assignment_id', assignment.id)
          .where('student_id', student.id)
          .first()

        const isLate = submission?.submittedAt && submission.submittedAt > assignment.dueDate
        const daysRemaining = Math.ceil(assignment.dueDate.diff(DateTime.now(), 'days').days)

        return {
          ...assignment.toJSON(),
          submission: submission,
          status: submission ? submission.status : 'not_submitted',
          isLate: !!isLate,
          daysRemaining: daysRemaining,
          isOverdue: daysRemaining < 0,
        }
      })
    )

    return response.ok({
      success: true,
      assignments: assignmentsWithStatus,
    })
  }

  /**
   * Soumettre un devoir
   */
  public async submitAssignment({ auth, request, response }: HttpContext) {
    const payload = await request.validateUsing(submitAssignmentValidator)
    const user = auth.getUserOrFail()
    const student = await Student.findByOrFail('user_id', user.id)

    const assignment = await Assignment.findOrFail(payload.assignmentId)

    if (assignment.classId !== student.classId) {
      return response.forbidden({
        success: false,
        message: "Ce devoir n'est pas pour votre classe",
      })
    }

    const isLate = DateTime.now() > assignment.dueDate

    const submission = await AssignmentSubmission.updateOrCreate(
      {
        assignmentId: assignment.id,
        studentId: student.id,
      },
      {
        submissionContent: payload.submissionContent,
        attachmentUrl: payload.attachmentUrl,
        submittedAt: DateTime.now(),
        isLate: isLate,
        status: 'submitted',
      }
    )

    return response.ok({
      success: true,
      message: 'Devoir soumis avec succès',
      submission,
    })
  }

  /**
   * Obtenir mes incidents disciplinaires
   */
  public async getMyDiscipline({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const student = await Student.findByOrFail('user_id', user.id)

    const disciplines = await Discipline.query()
      .where('student_id', student.id)
      .preload('reporter')
      .orderBy('incident_date', 'desc')

    const summary = {
      total: disciplines.length,
      byType: {} as Record<string, number>,
      bySeverity: {
        minor: disciplines.filter((d) => d.severity === 'minor').length,
        moderate: disciplines.filter((d) => d.severity === 'moderate').length,
        major: disciplines.filter((d) => d.severity === 'major').length,
        critical: disciplines.filter((d) => d.severity === 'critical').length,
      },
    }

    for (const discipline of disciplines) {
      const type = discipline.incidentType
      summary.byType[type] = (summary.byType[type] || 0) + 1
    }

    return response.ok({
      success: true,
      disciplines,
      summary,
    })
  }

  /**
   * Poster une question sur le forum
   */
  public async postForumQuestion({ auth, request, response }: HttpContext) {
    const payload = await request.validateUsing(postForumQuestionValidator)
    const user = auth.getUserOrFail()
    const student = await Student.findByOrFail('user_id', user.id)

    if (payload.classId !== student.classId) {
      return response.forbidden({
        success: false,
        message: 'Vous ne pouvez poster que dans votre classe',
      })
    }

    const topic = await ForumTopic.create({
      subjectId: payload.subjectId,
      classId: payload.classId,
      createdBy: user.id,
      title: payload.title,
      content: payload.content,
      isPinned: false,
      isLocked: false,
      viewsCount: 0,
    })

    return response.created({
      success: true,
      message: 'Question postée avec succès',
      topic,
    })
  }

  /**
   * Obtenir mes questions sur le forum
   */
  public async getMyForumQuestions({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const topics = await ForumTopic.query()
      .where('created_by', user.id)
      .preload('subject')
      .preload('class')
      .preload('posts')
      .orderBy('createdAt', 'desc')

    return response.ok({
      success: true,
      questions: topics,
    })
  }

  /**
   * Envoyer un message à un enseignant
   */
  public async sendMessageToTeacher({ auth, request, response }: HttpContext) {
    // Note: Adapté pour correspondre à votre logique de requête all() si le validateur est partagé
    const { teacherId, subject, content } = request.all()
    const user = auth.getUserOrFail()
    const student = await Student.findByOrFail('user_id', user.id)

    await User.query().where('id', teacherId).where('role', 'teacher').firstOrFail()

    const message = await Message.create({
      senderId: user.id,
      receiverId: teacherId,
      subject,
      content,
      type: 'parent_teacher',
      schoolId: student.schoolId,
    })

    return response.created({
      success: true,
      message: 'Message envoyé avec succès',
      sentMessage: message,
    })
  }

  /**
   * Obtenir mon emploi du temps
   */
  public async getMyTimetable({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const student = await Student.findByOrFail('user_id', user.id)

    const academicYear = request.input('academic_year')
    const term = request.input('term')

    const query = db
      .from('timetables')
      .where('class_id', student.classId!)
      .join('subjects', 'timetables.subject_id', 'subjects.id')
      .join('teachers', 'timetables.teacher_id', 'teachers.id')
      .join('users', 'teachers.user_id', 'users.id')
      .select(
        'timetables.*',
        'subjects.name as subject_name',
        'subjects.code as subject_code',
        'users.first_name as teacher_first_name',
        'users.last_name as teacher_last_name'
      )

    if (academicYear) query.where('academic_year', academicYear)
    if (term) query.where('term', term)

    const timetable = await query.orderBy('day_of_week').orderBy('start_time')

    const dayMap: Record<number, string> = {
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday',
    }

    const organizedTimetable: Record<string, any[]> = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
    }

    for (const entry of timetable) {
      const dayKey = dayMap[entry.day_of_week]
      if (dayKey) organizedTimetable[dayKey].push(entry)
    }

    return response.ok({
      success: true,
      timetable: organizedTimetable,
    })
  }

  /**
   * Obtenir mes présences
   */
  public async getMyAttendance({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const student = await Student.findByOrFail('user_id', user.id)

    const startDate = request.input('start_date')
    const endDate = request.input('end_date')

    const query = db.from('attendances').where('student_id', student.id)

    if (startDate) query.where('date', '>=', startDate)
    if (endDate) query.where('date', '<=', endDate)

    const attendances = await query.orderBy('date', 'desc')

    const stats = {
      present: attendances.filter((a) => a.status === 'present').length,
      absent: attendances.filter((a) => a.status === 'absent').length,
      late: attendances.filter((a) => a.status === 'late').length,
      excused: attendances.filter((a) => a.status === 'excused').length,
      total: attendances.length,
      attendanceRate: 0,
    }

    stats.attendanceRate =
      stats.total > 0 ? ((stats.present + stats.excused) / stats.total) * 100 : 0

    return response.ok({
      success: true,
      attendances,
      stats,
    })
  }

  /**
   * Demander un transfert
   */
  public async requestTransfer({ auth, request, response }: HttpContext) {
    const { targetSchoolCode, reason } = request.all()
    const user = auth.getUserOrFail()
    const student = await Student.findByOrFail('user_id', user.id)

    const targetSchool = await db
      .from('schools')
      .where('code', targetSchoolCode)
      .where('status', 'active')
      .first()

    if (!targetSchool) {
      return response.notFound({
        success: false,
        message: 'École cible non trouvée ou inactive',
      })
    }

    const { default: TransferAuthorization } = await import('#models/transfer_authorization')

    const authorization = await TransferAuthorization.create({
      studentId: student.id,
      fromSchoolId: student.schoolId,
      toSchoolId: targetSchool.id,
      authorizationCode: Math.random().toString(36).substring(2, 10).toUpperCase(), // Simulé ici
      status: 'pending',
      reason: reason || 'Demande de transfert',
      validUntil: DateTime.now().plus({ days: 30 }),
      issuedAt: DateTime.now(),
    })

    return response.created({
      success: true,
      message: 'Demande de transfert envoyée',
      authorizationCode: authorization.authorizationCode,
      validUntil: authorization.validUntil,
    })
  }
}
