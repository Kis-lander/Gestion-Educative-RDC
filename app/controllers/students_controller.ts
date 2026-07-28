import { type HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import { randomBytes } from 'node:crypto'
import { extname } from 'node:path'
import vine from '@vinejs/vine'
import { edgePageContext } from '#start/view_context'

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
import School from '#models/school'
import OtpMailService from '#services/otp_mail_service'
import {
  formatGuardianLabel,
  getPrimaryGuardianForStudent,
  getPrimaryGuardiansForStudents,
} from '#services/guardian_service'
import {
  RDC_CLASS_CATALOG,
  RDC_SCHOOL_OPTIONS,
  filterClassCatalogForSection,
  getClassSchoolOption,
  getSchoolOptionsForSection,
  isHumanitiesClass,
  resolveEnrollmentClass,
} from '#services/school_class_service'
import { getGovernanceContext } from '#services/school_governance_service'

// Import dynamique pour éviter les soucis de circularité sur TransferAuthorization
// On l'importera dans la méthode concernée comme dans ton code original

// Import des validateurs VineJS
import { submitAssignmentValidator, postForumQuestionValidator } from '#validators/student'
import {
  assignmentDeadlineAt,
  assignmentStatusMeta,
  assignmentSubmissionMeta,
} from '#services/assignment_status_service'
import {
  studentAssignmentClassIds,
  visibleAssignmentsForStudent,
} from '#services/assignment_visibility_service'
import {
  evaluationPeriodLabel,
  evaluationPolicyForClass,
  evaluationTypeLabel,
} from '#services/academic_evaluation_service'
import {
  formatScore,
} from '#services/grade_score_service'

export default class StudentController {
  private mailService = new OtpMailService()

  private async storeSubmissionAttachment(request: HttpContext['request']) {
    const attachment = request.file('attachment', {
      size: '20mb',
      extnames: ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'zip'],
    })

    if (!attachment) return null
    if (!attachment.isValid) {
      throw new Error(attachment.errors[0]?.message || 'Fichier joint invalide')
    }

    const extension = extname(attachment.clientName) || `.${attachment.extname || 'bin'}`
    const fileName = `${Date.now()}-${randomBytes(8).toString('hex')}${extension}`
    await attachment.move(app.publicPath('uploads/submissions'), { name: fileName })
    return `/uploads/submissions/${fileName}`
  }

  private async getCurrentStudent(user: any) {
    return Student.query().where('userId', user.id).preload('user').preload('class').firstOrFail()
  }

  private async formatStudentAssignment(assignment: Assignment, student: Student) {
    const submission = await AssignmentSubmission.query()
      .where('assignmentId', assignment.id)
      .where('studentId', student.id)
      .first()

    const assignmentMeta = assignmentStatusMeta(assignment)
    const submissionMeta = assignmentSubmissionMeta(assignment, submission)

    return {
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      instructions: assignment.instructions,
      subjectId: assignment.subjectId,
      subjectName: assignment.subject?.name || '-',
      className: assignment.class?.name || '-',
      dueDate: assignment.dueDate,
      dueTime: assignment.dueTime,
      maxPoints: assignment.maxPoints,
      term: assignment.term || null,
      termLabel: evaluationPeriodLabel(assignment.term),
      evaluationType: assignment.evaluationType || 'devoir',
      evaluationTypeLabel: evaluationTypeLabel(assignment.evaluationType || 'devoir'),
      attachmentUrl: assignment.attachmentUrl,
      publishedAt: assignment.publishedAt,
      status: submissionMeta.status,
      rawStatus: assignment.status,
      statusLabel: submissionMeta.label,
      statusClass: submissionMeta.badgeClass,
      borderClass: submissionMeta.isSubmitted
        ? submissionMeta.badgeClass.includes('orange')
          ? 'border-orange-500'
          : 'border-green-500'
        : assignmentMeta.borderClass,
      canSubmit: submissionMeta.canSubmit,
      submissionId: submission?.id || null,
      submission,
      grade: submission?.grade ? Number(submission.grade) : null,
      teacherFeedback: submission?.teacherFeedback || null,
      daysRemaining: assignmentMeta.daysRemaining,
      daysLate: assignmentMeta.daysLate,
      isOverdue: assignmentMeta.isOverdue,
      deadlineAt: assignmentMeta.deadlineAt,
    }
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
    const governance = await getGovernanceContext(user)
    const page = Number(request.input('page', 1))
    const classId = request.input('class_id')
    const status = request.input('status')
    const gender = request.input('gender')
    const search = String(request.input('search', '')).trim()

    const query = Student.query()
      .where('schoolId', user.schoolId)
      .if(!governance.canManageAllSections, (studentQuery) =>
        studentQuery.whereHas('class', (classQuery) =>
          classQuery.where('schoolSectionId', governance.sectionId)
        )
      )
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
      Class.query()
        .where('schoolId', user.schoolId)
        .whereNull('archivedAt')
        .if(!governance.canManageAllSections, (classQuery) =>
          classQuery.where('schoolSectionId', governance.sectionId)
        )
        .orderBy('name', 'asc'),
      Student.query()
        .where('schoolId', user.schoolId)
        .if(!governance.canManageAllSections, (studentQuery) =>
          studentQuery.whereHas('class', (classQuery) =>
            classQuery.where('schoolSectionId', governance.sectionId)
          )
        )
        .count('* as total')
        .first(),
      Student.query()
        .where('schoolId', user.schoolId)
        .if(!governance.canManageAllSections, (studentQuery) =>
          studentQuery.whereHas('class', (classQuery) =>
            classQuery.where('schoolSectionId', governance.sectionId)
          )
        )
        .where('academicStatus', 'active')
        .count('* as total')
        .first(),
      Student.query()
        .where('schoolId', user.schoolId)
        .if(!governance.canManageAllSections, (studentQuery) =>
          studentQuery.whereHas('class', (classQuery) =>
            classQuery.where('schoolSectionId', governance.sectionId)
          )
        )
        .where('gender', 'female')
        .count('* as total')
        .first(),
      Student.query()
        .where('schoolId', user.schoolId)
        .if(!governance.canManageAllSections, (studentQuery) =>
          studentQuery.whereHas('class', (classQuery) =>
            classQuery.where('schoolSectionId', governance.sectionId)
          )
        )
        .where('gender', 'male')
        .count('* as total')
        .first(),
    ])

    const pageStudents = paginator.all()
    const guardiansByStudent = await getPrimaryGuardiansForStudents(
      pageStudents.map((student) => student.id)
    )
    const students = pageStudents.map((student) => {
      const primaryGuardian = guardiansByStudent.get(student.id) || null

      return Object.assign(student, {
        primaryGuardian,
        parentName: formatGuardianLabel(primaryGuardian) || '-',
        parentRelationship: primaryGuardian?.relationship || '-',
        parentPhone: primaryGuardian?.phone || student.parentPhone,
      })
    })

    return view.render('students/index', {
      school: {
        id: user.schoolId,
        name: 'Gestion Éducative RDC',
      },
      students,
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
    const governance = await getGovernanceContext(user)
    const classes = await Class.query()
      .where('schoolId', user.schoolId)
      .whereNull('archivedAt')
      .if(!governance.canManageAllSections, (classQuery) =>
        classQuery.where('schoolSectionId', governance.sectionId)
      )
      .orderBy('gradeLevel', 'asc')
      .orderBy('name', 'asc')

    return view.render('students/create', {
      school: {
        id: user.schoolId,
        name: 'Gestion Éducative RDC',
      },
      classes,
      classCatalog: filterClassCatalogForSection(
        governance.canManageAllSections ? null : governance.sectionCode,
        RDC_CLASS_CATALOG
      ),
      schoolOptions: governance.canManageAllSections
        ? RDC_SCHOOL_OPTIONS
        : getSchoolOptionsForSection(governance.sectionCode),
      selectedClassId: request.input('class_id', ''),
    })
  }

  public async showPage({ auth, params, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const governance = await getGovernanceContext(user)
    const student = await Student.query()
      .where('id', params.id)
      .where('schoolId', user.schoolId)
      .if(!governance.canManageAllSections, (studentQuery) =>
        studentQuery.whereHas('class', (classQuery) =>
          classQuery.where('schoolSectionId', governance.sectionId)
        )
      )
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

    const primaryGuardian = await getPrimaryGuardianForStudent(student.id)

    return view.render('students/show', {
      school: {
        id: user.schoolId,
        name: student.school?.name || 'Gestion Éducative RDC',
      },
      student: Object.assign(student, {
        primaryGuardian,
        parentName: formatGuardianLabel(primaryGuardian) || '-',
        parentRelationship: primaryGuardian?.relationship || '-',
        parentPhone: primaryGuardian?.phone || student.parentPhone,
      }),
      recentGrades,
      stats: {
        averageGrade,
        incidentsCount: Number(incidentsCount?.$extras.total || 0),
      },
    })
  }

  public async store({ auth, request, response, session, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const governance = await getGovernanceContext(user)
    const schema = vine.compile(
      vine.object({
        firstName: vine.string().trim(),
        postnom: vine.string().trim(),
        lastName: vine.string().trim(),
        email: vine.string().email().unique({ table: 'users', column: 'email' }),
        phone: vine.string().trim().optional(),
        classId: vine.string().optional(),
        className: vine.string().trim().optional(),
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
    if (!payload.classId && !payload.className) {
      session.flash('error', 'Veuillez sélectionner ou renseigner la classe de l’élève.')
      return response.redirect().back()
    }

    const tempPassword = randomBytes(6).toString('hex')
    const registrationNumber = `STU-${Date.now()}`
    let createdStudentUser: User

    try {
      await db.transaction(async (trx) => {
        const selectedClass = await resolveEnrollmentClass({
          schoolId: user.schoolId!,
          classId: payload.classId,
          className: payload.className,
          schoolOption: payload.schoolOption,
          allowedSectionId: governance.canManageAllSections ? null : governance.sectionId,
          trx,
        })

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
        createdStudentUser = studentUser

        const student = new Student()
        student.useTransaction(trx)
        student.userId = studentUser.id
        student.schoolId = user.schoolId
        student.classId = selectedClass.id
        student.schoolOption = isHumanitiesClass(selectedClass)
          ? getClassSchoolOption(selectedClass) || payload.schoolOption!
          : null
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

        await trx.from('classes').where('id', selectedClass.id).increment('current_enrollment', 1)
      })
    } catch (error) {
      session.flash(
        'error',
        error instanceof Error ? error.message : "L'inscription de l'élève a échoué."
      )
      return response.redirect().back()
    }

    const school = await School.find(user.schoolId)
    const schoolName = school?.name || 'Gestion Éducative RDC'
    const credentials = {
      fullName: createdStudentUser!.fullName,
      role: createdStudentUser!.role,
      roleLabel: 'Élève',
      email: createdStudentUser!.email,
      password: tempPassword,
      schoolName,
      profileReference: registrationNumber,
      createdAt: DateTime.now().toFormat('dd/MM/yyyy HH:mm'),
    }
    let emailDelivery = {
      sent: true,
      message: `Les identifiants ont été envoyés à ${credentials.email}.`,
    }

    try {
      await this.mailService.sendAccountCredentials({
        to: credentials.email,
        schoolName,
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

    return view.render('schools/accounts/credentials', {
      school: {
        id: user.schoolId,
        name: schoolName,
      },
      credentials,
      emailDelivery,
    })
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

  public async gradesPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const student = await this.getCurrentStudent(user)
    const section = student.class?.schoolSectionId
      ? await db.from('school_sections').where('id', student.class.schoolSectionId).first()
      : null
    const studentEvaluationPolicy = evaluationPolicyForClass(
      section?.code || null,
      student.class?.gradeLevel
    )
    const requestedTerm = String(ctx.request.input('term', '')).trim()
    const availableTermRows = await Grade.query()
      .where('studentId', student.id)
      .whereNotNull('term')
      .select('term')
      .orderBy('examDate', 'desc')
    const availableAssignmentTermRows = await db
      .from('assignment_submissions')
      .join('assignments', 'assignment_submissions.assignment_id', 'assignments.id')
      .where('assignment_submissions.student_id', student.id)
      .where('assignment_submissions.status', 'graded')
      .whereNotNull('assignment_submissions.grade')
      .whereNotNull('assignments.term')
      .select('assignments.term')
      .orderBy('assignment_submissions.submitted_at', 'desc')
    const availableTerms = Array.from(
      new Set(
        [
          ...availableTermRows.map((grade) => grade.term),
          ...availableAssignmentTermRows.map((row) => row.term),
        ]
          .map((term) => String(term || '').trim())
          .filter(Boolean)
      )
    )
    const selectedTerm =
      requestedTerm ||
      availableTerms[0] ||
      studentEvaluationPolicy.periods[0]?.value ||
      'T1-P1'
    const selectedTermLabel = evaluationPeriodLabel(selectedTerm)
    const studentTermOptions = [
      ...studentEvaluationPolicy.periods,
      ...availableTerms
        .filter((term) => !studentEvaluationPolicy.periods.some((option) => option.value === term))
        .map((term) => ({ value: term, label: evaluationPeriodLabel(term) })),
    ]
    const grades = await Grade.query()
      .where('studentId', student.id)
      .where('term', selectedTerm)
      .preload('subject')
      .orderBy('examDate', 'desc')
    const assignmentSubmissions = await AssignmentSubmission.query()
      .where('studentId', student.id)
      .where('status', 'graded')
      .whereNotNull('grade')
      .preload('assignment', (assignmentQuery) => {
        assignmentQuery.where('term', selectedTerm).preload('subject')
      })
      .orderBy('submittedAt', 'desc')

    const scoreLabel = (score: unknown, maxScore: unknown) =>
      `${formatScore(Number(score))}/${formatScore(Number(maxScore || 20))}`
    const fieldForEvaluation = (examType: string) => {
      const normalized = examType.toLowerCase()
      if (normalized.includes('examen')) return 'exam'
      if (normalized.includes('devoir')) return 'devoir'
      if (normalized.includes('interro')) return 'interro'
      if (normalized.includes('travail')) return 'compo'
      return 'compo'
    }
    const subjectsById = new Map<string, any>()

    for (const grade of grades) {
      const rawScore = Number(grade.score)
      const rawMaxScore = Number(grade.maxScore || 20)
      if (!Number.isFinite(rawScore) || !Number.isFinite(rawMaxScore) || rawMaxScore <= 0) continue

      const subjectId = grade.subjectId
      if (!subjectsById.has(subjectId)) {
        subjectsById.set(subjectId, {
          id: subjectId,
          name: grade.subject?.name || '-',
          coefficient: grade.subject?.coefficient || 1,
          compo: null,
          interro: null,
          devoir: null,
          exam: null,
          totalScore: 0,
          totalMaxScore: 0,
          appreciation: grade.teacherComments || '',
        })
      }

      const subject = subjectsById.get(subjectId)
      const field = fieldForEvaluation(String(grade.examType || ''))
      subject[field] = scoreLabel(rawScore, rawMaxScore)
      subject.totalScore += rawScore
      subject.totalMaxScore += rawMaxScore
      if (!subject.appreciation && grade.teacherComments) subject.appreciation = grade.teacherComments
    }

    for (const submission of assignmentSubmissions) {
      if (!submission.assignment) continue

      const rawScore = Number(submission.grade)
      const rawMaxScore = Number(submission.assignment.maxPoints || 20)
      if (!Number.isFinite(rawScore) || !Number.isFinite(rawMaxScore) || rawMaxScore <= 0) continue

      const subjectId = submission.assignment.subjectId
      if (!subjectsById.has(subjectId)) {
        subjectsById.set(subjectId, {
          id: subjectId,
          name: submission.assignment.subject?.name || '-',
          coefficient: submission.assignment.subject?.coefficient || 1,
          compo: null,
          interro: null,
          devoir: null,
          exam: null,
          totalScore: 0,
          totalMaxScore: 0,
          appreciation: submission.teacherFeedback || '',
        })
      }

      const subject = subjectsById.get(subjectId)
      const field =
        submission.assignment.evaluationType === 'interrogation' ? 'interro' : 'devoir'
      subject[field] = scoreLabel(rawScore, rawMaxScore)
      subject.totalScore += rawScore
      subject.totalMaxScore += rawMaxScore
      if (!subject.appreciation && submission.teacherFeedback) {
        subject.appreciation = submission.teacherFeedback
      }
    }

    const subjectsGrades = Array.from(subjectsById.values()).map((subject) => {
      const average = subject.totalMaxScore > 0
        ? (subject.totalScore / subject.totalMaxScore) * 20
        : null

      return {
        ...subject,
        totalScore: undefined,
        totalMaxScore: undefined,
        average: formatScore(average),
      }
    })

    const termScores = subjectsGrades
      .map((subject) => Number(subject.average))
      .filter(Number.isFinite)
    const termAverage = termScores.length
      ? formatScore(termScores.reduce((sum, score) => sum + score, 0) / termScores.length)
      : '-'
    const best = subjectsGrades
      .filter((subject) => Number.isFinite(Number(subject.average)))
      .sort((left, right) => Number(right.average) - Number(left.average))[0]
    const totalCoefficient = subjectsGrades.reduce(
      (sum, subject) => sum + Number(subject.coefficient || 0),
      0
    )
    const classRows = student.classId
      ? await db.from('students').where('class_id', student.classId).count('* as total').first()
      : null

    return ctx.view.render(
      'student/grades/index',
      await edgePageContext(ctx, {
        student: { name: student.user?.fullName || '' },
        selectedTerm,
        selectedTermLabel,
        studentEvaluationPolicy,
        studentTermOptions,
        subjectsGrades,
        termAverage,
        termRank: '-',
        totalStudents: Number(classRows?.total || 0),
        bestSubject: best?.name || '-',
        bestGrade: best?.average || '-',
        appreciation:
          termAverage === '-'
            ? '-'
            : Number(termAverage) >= 15
              ? 'Très bien'
              : Number(termAverage) >= 10
                ? 'Satisfaisant'
                : 'À améliorer',
        totalCoefficient,
        subjectNames: subjectsGrades.map((subject) => subject.name),
        subjectAverages: subjectsGrades.map((subject) => Number(subject.average) || 0),
        classAverages: subjectsGrades.map(() => 0),
        generalAppreciation: '',
      })
    )
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
  public async assignmentsPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const student = await this.getCurrentStudent(user)
    const subjectId = ctx.request.input('subject_id')
    const status = ctx.request.input('status')
    const search = String(ctx.request.input('search', '')).trim()

    let assignments = await visibleAssignmentsForStudent(student)
    assignments = assignments.filter((assignment) => {
      if (subjectId && assignment.subjectId !== subjectId) return false
      if (search && !assignment.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })

    let formattedAssignments = await Promise.all(
      assignments.map((assignment) => this.formatStudentAssignment(assignment, student))
    )

    if (status) {
      formattedAssignments = formattedAssignments.filter((assignment) => {
        if (status === 'pending') return assignment.status === 'pending'
        if (status === 'submitted') return ['submitted', 'late_submitted'].includes(assignment.status)
        if (status === 'graded') return ['graded', 'late_graded'].includes(assignment.status)
        if (status === 'missing') return assignment.status === 'missing'
        return true
      })
    }

    const subjectsById = new Map(
      assignments
        .filter((assignment) => assignment.subject)
        .map((assignment) => [assignment.subjectId, { id: assignment.subjectId, name: assignment.subject!.name }])
    )

    return ctx.view.render(
      'student/assignments/index',
      await edgePageContext(ctx, {
        student: { name: student.user?.fullName || '' },
        assignments: formattedAssignments,
        subjects: [...subjectsById.values()],
        stats: {
          total: formattedAssignments.length,
          pending: formattedAssignments.filter((assignment) => assignment.status === 'pending').length,
          submitted: formattedAssignments.filter((assignment) =>
            ['submitted', 'late_submitted'].includes(assignment.status)
          ).length,
          graded: formattedAssignments.filter((assignment) =>
            ['graded', 'late_graded'].includes(assignment.status)
          ).length,
          missing: formattedAssignments.filter((assignment) => assignment.status === 'missing').length,
        },
        pagination: { total: formattedAssignments.length, perPage: 50, currentPage: 1, lastPage: 1 },
      })
    )
  }

  public async assignmentShowPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const student = await this.getCurrentStudent(user)
    const visibleClassIds = await studentAssignmentClassIds(student)
    const assignment = await Assignment.query()
      .where('id', ctx.params.id)
      .whereIn('classId', visibleClassIds)
      .whereIn('status', ['published', 'closed'])
      .preload('subject')
      .preload('class')
      .firstOrFail()

    return ctx.view.render(
      'student/assignments/show',
      await edgePageContext(ctx, {
        assignment: await this.formatStudentAssignment(assignment, student),
      })
    )
  }

  public async assignmentSubmitPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const student = await this.getCurrentStudent(user)
    const visibleClassIds = await studentAssignmentClassIds(student)
    const assignment = await Assignment.query()
      .where('id', ctx.params.id)
      .whereIn('classId', visibleClassIds)
      .where('status', 'published')
      .preload('subject')
      .preload('class')
      .firstOrFail()
    const formattedAssignment = await this.formatStudentAssignment(assignment, student)
    if (!formattedAssignment.canSubmit) {
      ctx.session.flash('error', 'La date limite est dépassée. Ce devoir est clôturé et ne peut plus être soumis.')
      return ctx.response.redirect(`/student/assignments/${assignment.id}`)
    }

    return ctx.view.render(
      'student/assignments/submit',
      await edgePageContext(ctx, {
        assignment: formattedAssignment,
        existingSubmission: formattedAssignment.submission,
      })
    )
  }

  public async submitAssignmentWeb({ auth, params, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const student = await this.getCurrentStudent(user)
    const visibleClassIds = await studentAssignmentClassIds(student)
    const assignment = await Assignment.query()
      .where('id', params.id)
      .whereIn('classId', visibleClassIds)
      .where('status', 'published')
      .firstOrFail()

    const deadlineAt = assignmentDeadlineAt(assignment)
    if (DateTime.now() > deadlineAt) {
      session.flash('error', 'La date limite est dépassée. Ce devoir est clôturé et ne peut plus être soumis.')
      return response.redirect(`/student/assignments/${assignment.id}`)
    }

    let attachmentUrl: string | null = null
    try {
      attachmentUrl = await this.storeSubmissionAttachment(request)
    } catch (error) {
      session.flash('error', error instanceof Error ? error.message : 'Fichier joint invalide')
      return response.redirect().back()
    }

    const existing = await AssignmentSubmission.query()
      .where('assignmentId', assignment.id)
      .where('studentId', student.id)
      .first()

    const content = String(request.input('content') || request.input('submissionContent') || '').trim()
    if (!content && !attachmentUrl && !existing?.attachmentUrl) {
      session.flash('error', 'Ajoutez une réponse ou un fichier avant de soumettre.')
      return response.redirect().back()
    }

    await AssignmentSubmission.updateOrCreate(
      {
        assignmentId: assignment.id,
        studentId: student.id,
      },
      {
        submissionContent: content,
        attachmentUrl: attachmentUrl || existing?.attachmentUrl || null,
        submittedAt: DateTime.now(),
        isLate: DateTime.now() > deadlineAt,
        status: 'submitted',
      }
    )

    return response.redirect(`/student/assignments/${assignment.id}`)
  }

  public async submissionsPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const student = await this.getCurrentStudent(user)
    const submissions = await AssignmentSubmission.query()
      .where('studentId', student.id)
      .preload('assignment', (assignmentQuery) => assignmentQuery.preload('subject').preload('class'))
      .orderBy('submittedAt', 'desc')

    const formattedSubmissions = submissions.map((submission) => ({
      id: submission.id,
      assignmentId: submission.assignmentId,
      assignmentTitle: submission.assignment?.title || '-',
      subjectName: submission.assignment?.subject?.name || '-',
      submittedAt: submission.submittedAt,
      grade: submission.grade ? Number(submission.grade) : null,
      maxPoints: submission.assignment?.maxPoints || 20,
      feedback: submission.teacherFeedback,
    }))
    const graded = formattedSubmissions.filter((submission) => submission.grade !== null)
    const averageGrade = graded.length
      ? Math.round((graded.reduce((total, submission) => total + Number(submission.grade || 0), 0) / graded.length) * 10) / 10
      : null

    return ctx.view.render(
      'student/assignments/submissions',
      await edgePageContext(ctx, {
        student: { name: student.user?.fullName || '' },
        submissions: formattedSubmissions,
        stats: {
          total: formattedSubmissions.length,
          graded: graded.length,
          pending: formattedSubmissions.length - graded.length,
          averageGrade,
        },
        pagination: { total: formattedSubmissions.length, perPage: 50, currentPage: 1, lastPage: 1 },
      })
    )
  }

  public async submissionShowPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const student = await this.getCurrentStudent(user)
    const visibleClassIds = await studentAssignmentClassIds(student)
    const submission = await AssignmentSubmission.query()
      .where('id', ctx.params.id)
      .where('studentId', student.id)
      .preload('assignment')
      .firstOrFail()

    if (!submission.assignment || !visibleClassIds.includes(submission.assignment.classId)) {
      return ctx.response.notFound()
    }

    return ctx.response.redirect(
      `/student/assignments/${submission.assignmentId}?submission=${submission.id}`
    )
  }

  public async getAssignments({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const student = await Student.findByOrFail('user_id', user.id)

    const assignments = await visibleAssignmentsForStudent(student)
    await Promise.all(
      assignments.map((assignment) =>
        assignment.load('teacher', (teacherQuery) => {
          teacherQuery.preload('user')
        })
      )
    )

    const assignmentsWithStatus = await Promise.all(
      assignments.map(async (assignment) => {
        const submission = await AssignmentSubmission.query()
          .where('assignment_id', assignment.id)
          .where('student_id', student.id)
          .first()

        const assignmentMeta = assignmentStatusMeta(assignment)
        const submissionMeta = assignmentSubmissionMeta(assignment, submission)

        return {
          ...assignment.toJSON(),
          submission: submission,
          status: submissionMeta.status,
          statusLabel: submissionMeta.label,
          canSubmit: submissionMeta.canSubmit,
          isLate: submissionMeta.isLate,
          daysRemaining: assignmentMeta.daysRemaining,
          daysLate: assignmentMeta.daysLate,
          isOverdue: assignmentMeta.isOverdue,
          deadlineAt: assignmentMeta.deadlineAt,
        }
      })
    )

    return response.ok({
      success: true,
      assignments: assignmentsWithStatus,
    })
  }

  public async pendingAssignmentsCount({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const student = await Student.findByOrFail('user_id', user.id)
    const assignments = await visibleAssignmentsForStudent(student)
    if (!assignments.length) return response.ok({ success: true, count: 0 })

    const submissionRows = await db
      .from('assignment_submissions')
      .where('student_id', student.id)
      .whereIn(
        'assignment_id',
        assignments.map((assignment) => assignment.id)
      )
      .select('assignment_id', 'status', 'submitted_at', 'is_late')

    const submissionByAssignmentId = new Map(
      submissionRows.map((submission) => [
        String(submission.assignment_id),
        {
          status: submission.status,
          submittedAt: submission.submitted_at
            ? DateTime.fromJSDate(new Date(submission.submitted_at))
            : null,
          isLate: !!submission.is_late,
        },
      ])
    )

    const count = assignments.filter((assignment) => {
      const submissionMeta = assignmentSubmissionMeta(
        assignment,
        submissionByAssignmentId.get(assignment.id) || null
      )

      return !submissionMeta.isSubmitted
    }).length

    return response.ok({ success: true, count })
  }

  /**
   * Soumettre un devoir
   */
  public async submitAssignment({ auth, request, response }: HttpContext) {
    const payload = await request.validateUsing(submitAssignmentValidator)
    const user = auth.getUserOrFail()
    const student = await Student.findByOrFail('user_id', user.id)

    const visibleClassIds = await studentAssignmentClassIds(student)
    const assignment = await Assignment.query()
      .where('id', payload.assignmentId)
      .whereIn('classId', visibleClassIds)
      .firstOrFail()

    if (!visibleClassIds.includes(assignment.classId)) {
      return response.forbidden({
        success: false,
        message: "Ce devoir n'est pas pour votre classe",
      })
    }

    const deadlineAt = assignmentDeadlineAt(assignment)
    if (assignment.status !== 'published' || DateTime.now() > deadlineAt) {
      return response.badRequest({
        success: false,
        message: 'La date limite est dépassée. Ce devoir est clôturé et ne peut plus être soumis.',
      })
    }

    const isLate = DateTime.now() > deadlineAt

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
