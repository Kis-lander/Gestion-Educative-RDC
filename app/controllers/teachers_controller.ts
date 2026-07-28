import { type HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import { randomBytes } from 'node:crypto'
import { extname } from 'node:path'
import { edgePageContext } from '#start/view_context'
import {
  assignmentStatusMeta,
  assignmentSubmissionMeta,
} from '#services/assignment_status_service'
import {
  activeStudentCountForAssignment,
  activeStudentsForAssignment,
} from '#services/assignment_visibility_service'

// Imports des modèles via subpath alias
import Teacher from '#models/teacher'
import Class from '#models/class'
import Student from '#models/student'
import Assignment from '#models/assignment'
import AssignmentSubmission from '#models/assignment_submission'
import ForumTopic from '#models/forum_topic'
import Grade from '#models/grade'
import Message from '#models/message'
// import ForumPost from '#models/forum_post'
import { formatGuardianLabel, getPrimaryGuardiansForStudents } from '#services/guardian_service'
import {
  SECTION_EVALUATION_POLICIES,
  allEvaluationPeriodOptions,
  allEvaluationTypeOptions,
  evaluationPolicyForClass,
  evaluationPeriodLabel,
  evaluationTypeLabel,
} from '#services/academic_evaluation_service'

// Imports des validateurs VineJS
import {
  createAssignmentValidator,
  gradeSubmissionValidator,
  markAttendanceValidator,
} from '#validators/teacher'

export default class TeacherController {
  private isUuid(value: unknown) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      String(value || '')
    )
  }

  private async storeAssignmentAttachment(
    request: HttpContext['request'],
    folder: 'assignments' | 'submissions' = 'assignments'
  ) {
    const attachment = request.file('attachment', {
      size: '20mb',
      extnames: [
        'pdf',
        'jpg',
        'jpeg',
        'png',
        'webp',
        'doc',
        'docx',
        'xls',
        'xlsx',
        'ppt',
        'pptx',
        'txt',
        'zip',
      ],
    })

    if (!attachment) return null
    if (!attachment.isValid) {
      throw new Error(attachment.errors[0]?.message || 'Fichier joint invalide')
    }

    const extension = extname(attachment.clientName) || `.${attachment.extname || 'bin'}`
    const fileName = `${Date.now()}-${randomBytes(8).toString('hex')}${extension}`
    await attachment.move(app.publicPath(`uploads/${folder}`), { name: fileName })
    return `/uploads/${folder}/${fileName}`
  }

  private csvValue(value: unknown) {
    const text = String(value ?? '')
      .replace(/\r?\n/g, ' ')
      .trim()
    return `"${text.replace(/"/g, '""')}"`
  }

  private async currentTeacher(user: any) {
    return Teacher.query().where('userId', user.id).first()
  }

  private async assignmentClasses(user: any, teacher: Teacher | null) {
    if (['director', 'discipline_director'].includes(user.role)) {
      return Class.query()
        .where('schoolId', user.schoolId)
        .whereNull('archivedAt')
        .orderBy('gradeLevel', 'asc')
        .orderBy('name', 'asc')
    }

    if (!teacher) return []

    const rows = await db
      .from('class_subject')
      .where('teacher_id', teacher.id)
      .select('class_id')
      .distinct()

    const classIds = rows.map((row) => row.class_id).filter(Boolean)
    if (!classIds.length) return []

    return Class.query()
      .whereIn('id', classIds)
      .whereNull('archivedAt')
      .orderBy('gradeLevel', 'asc')
      .orderBy('name', 'asc')
  }

  private async assignmentSubjects(classIds: string[]) {
    if (!classIds.length) return []

    const rows = await db
      .from('class_subject')
      .join('subjects', 'class_subject.subject_id', 'subjects.id')
      .whereIn('class_subject.class_id', classIds)
      .select('subjects.id', 'subjects.name')
      .distinct()
      .orderBy('subjects.name', 'asc')

    return rows.map((row) => ({ id: row.id, name: row.name }))
  }

  private assignmentQueryForUser(user: any, teacher: Teacher | null) {
    const query = Assignment.query().preload('class').preload('subject').preload('submissions')

    if (teacher) {
      query.where('teacherId', teacher.id)
    } else {
      query.whereHas('class', (classQuery) => classQuery.where('schoolId', user.schoolId))
    }

    return query
  }

  private async getTeacherAssignment(user: any, id: string) {
    const teacher = await this.currentTeacher(user)
    const query = Assignment.query()
      .where('id', id)
      .preload('class')
      .preload('subject')
      .preload('submissions', (submissionQuery) => {
        submissionQuery.preload('student', (studentQuery) => studentQuery.preload('user'))
      })

    if (teacher) {
      query.where('teacherId', teacher.id)
    } else {
      query.whereHas('class', (classQuery) => classQuery.where('schoolId', user.schoolId))
    }

    return query.firstOrFail()
  }

  private async formatAssignment(assignment: Assignment) {
    const submissions = assignment.submissions || []
    const statusMeta = assignmentStatusMeta(assignment)
    const totalStudents = await activeStudentCountForAssignment(assignment)
    const submittedCount = submissions.filter((submission) =>
      ['submitted', 'graded'].includes(submission.status)
    ).length
    const gradedCount = submissions.filter((submission) => submission.status === 'graded').length
    const lateCount = submissions.filter((submission) =>
      assignmentSubmissionMeta(assignment, submission).isLate
    ).length

    return {
      id: assignment.id,
      classId: assignment.classId,
      subjectId: assignment.subjectId,
      title: assignment.title,
      description: assignment.description,
      instructions: assignment.instructions,
      dueDate: assignment.dueDate,
      dueTime: assignment.dueTime,
      maxPoints: assignment.maxPoints,
      term: assignment.term || null,
      termLabel: evaluationPeriodLabel(assignment.term),
      evaluationType: assignment.evaluationType || 'devoir',
      evaluationTypeLabel: evaluationTypeLabel(assignment.evaluationType || 'devoir'),
      attachmentUrl: assignment.attachmentUrl,
      status: statusMeta.effectiveStatus,
      rawStatus: assignment.status,
      statusLabel: statusMeta.statusLabel,
      statusClass: statusMeta.statusClass,
      borderClass: statusMeta.borderClass,
      publishedAt: assignment.publishedAt,
      createdAt: assignment.createdAt,
      className: assignment.class?.name || '-',
      subjectName: assignment.subject?.name || '-',
      totalStudents,
      submittedCount,
      gradedCount,
      lateCount,
      missingCount: Math.max(totalStudents - submittedCount, 0),
      submissionRate: totalStudents ? Math.round((submittedCount / totalStudents) * 100) : 0,
      daysRemaining: statusMeta.daysRemaining,
      daysLate: statusMeta.daysLate,
      isOverdue: statusMeta.isOverdue,
      canSubmit: statusMeta.canSubmit,
      deadlineAt: statusMeta.deadlineAt,
    }
  }

  private async getAttendanceClassesForUser(user: any) {
    const query = Class.query()
      .whereNull('archivedAt')
      .orderBy('gradeLevel', 'asc')
      .orderBy('name', 'asc')

    if (['director', 'discipline_director'].includes(user.role)) {
      return query.where('schoolId', user.schoolId)
    }

    const teacher = await Teacher.query().where('userId', user.id).first()
    return teacher ? query.where('teacherId', teacher.id) : []
  }

  private formatScore(value: unknown) {
    const score = Number(value)
    if (!Number.isFinite(score)) return '-'
    return score.toFixed(1).replace(/\.0$/, '')
  }

  private async classSubjects(classId: string, teacher: Teacher | null, user: any) {
    const query = db
      .from('class_subject')
      .join('subjects', 'class_subject.subject_id', 'subjects.id')
      .where('class_subject.class_id', classId)
      .select('subjects.id', 'subjects.name', 'class_subject.coefficient')
      .distinct()
      .orderBy('subjects.name', 'asc')

    if (teacher && !['director', 'discipline_director'].includes(user.role)) {
      query.where('class_subject.teacher_id', teacher.id)
    }

    return query
  }

  private async classStudents(classId: string) {
    const students = await Student.query()
      .where('classId', classId)
      .preload('user')
      .orderBy('registrationNumber', 'asc')
    const guardiansByStudent = await getPrimaryGuardiansForStudents(
      students.map((student) => student.id)
    )

    return Promise.all(
      students.map(async (student) => {
        const primaryGuardian = guardiansByStudent.get(student.id) || null
        const grades = await Grade.query().where('studentId', student.id)
        const scores = grades.map((grade) => Number(grade.score)).filter(Number.isFinite)
        const average = scores.length
          ? scores.reduce((sum, score) => sum + score, 0) / scores.length
          : null
        const attendanceRows = await db.from('attendances').where('student_id', student.id)
        const present = attendanceRows.filter((row) =>
          ['present', 'excused'].includes(row.status)
        ).length
        const attendanceRate = attendanceRows.length
          ? Math.round((present / attendanceRows.length) * 100)
          : 0

        return {
          id: student.id,
          name: student.user?.fullName || student.registrationNumber,
          user: student.user,
          registrationNumber: student.registrationNumber,
          gender: student.gender,
          averageGrade: this.formatScore(average),
          attendanceRate,
          primaryGuardian,
          parentName: formatGuardianLabel(primaryGuardian) || '-',
          parentRelationship: primaryGuardian?.relationship || '-',
          parentPhone: primaryGuardian?.phone || student.parentPhone,
        }
      })
    )
  }

  private async formatClassForTeacher(classObj: Class, teacher: Teacher | null, user: any) {
    const students = await this.classStudents(classObj.id)
    const subjects = await this.classSubjects(classObj.id, teacher, user)
    const averages = students.map((student) => Number(student.averageGrade)).filter(Number.isFinite)
    const averageGrade = averages.length
      ? averages.reduce((sum, score) => sum + score, 0) / averages.length
      : null
    const attendanceRate = students.length
      ? Math.round(
          students.reduce((sum, student) => sum + Number(student.attendanceRate || 0), 0) /
            students.length
        )
      : 0

    return {
      id: classObj.id,
      name: classObj.name,
      level: classObj.level,
      gradeLevel: classObj.gradeLevel,
      schoolSectionId: classObj.schoolSectionId,
      shift: classObj.shift,
      academicYear: classObj.academicYear,
      maxCapacity: classObj.maxCapacity,
      studentsCount: students.length,
      averageGrade: this.formatScore(averageGrade),
      attendanceRate,
      subjects: subjects.map((subject) => ({
        id: subject.id,
        name: subject.name,
        coefficient: subject.coefficient,
        hoursPerWeek: 0,
      })),
    }
  }

  private async teacherClassesData(user: any) {
    const teacher = await this.currentTeacher(user)
    const classes = await this.assignmentClasses(user, teacher)
    const formatted = await Promise.all(
      classes.map((classObj) => this.formatClassForTeacher(classObj, teacher, user))
    )
    return { teacher, classes, formatted }
  }

  private async evaluationClassOptions(
    classes: Array<{ id: string; schoolSectionId?: string | null; gradeLevel?: number | null }>
  ) {
    const sectionIds = Array.from(
      new Set(classes.map((classObj) => classObj.schoolSectionId).filter(Boolean))
    ) as string[]
    const sections = sectionIds.length
      ? await db.from('school_sections').whereIn('id', sectionIds).select('id', 'code')
      : []
    const sectionCodeById = new Map(sections.map((section) => [String(section.id), section.code]))

    return Object.fromEntries(
      classes.map((classObj) => [
        classObj.id,
        evaluationPolicyForClass(
          sectionCodeById.get(String(classObj.schoolSectionId || '')),
          classObj.gradeLevel
        ),
      ])
    )
  }

  private evaluationTermOptionsFromPolicies(classEvaluationPolicies: Record<string, any>) {
    const options = new Map<string, string>()

    for (const policy of Object.values(classEvaluationPolicies)) {
      for (const period of policy.periods || []) {
        options.set(period.value, evaluationPeriodLabel(period.value))
      }
    }

    return options.size
      ? Array.from(options.entries()).map(([value, label]) => ({ value, label }))
      : allEvaluationPeriodOptions()
  }

  private async authorizeAttendanceClass(user: any, classId: string) {
    if (['director', 'discipline_director'].includes(user.role)) {
      return Class.query()
        .where('id', classId)
        .where('schoolId', user.schoolId)
        .whereNull('archivedAt')
        .firstOrFail()
    }

    const teacher = await Teacher.findByOrFail('user_id', user.id)
    const assignedRows = await db
      .from('class_subject')
      .where('teacher_id', teacher.id)
      .select('class_id')
      .distinct()
    const assignedClassIds = assignedRows.map((row) => row.class_id).filter(Boolean)

    return Class.query()
      .where('id', classId)
      .where((builder) => {
        builder.where('teacherId', teacher.id)
        if (assignedClassIds.length) builder.orWhereIn('id', assignedClassIds)
      })
      .whereNull('archivedAt')
      .firstOrFail()
  }

  public async attendanceMarkPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const myClasses = await this.getAttendanceClassesForUser(user)

    return ctx.view.render(
      'teacher/attendance/mark',
      await edgePageContext(ctx, {
        myClasses,
        selectedClassId: ctx.request.input('class_id', ''),
      })
    )
  }

  public async attendanceIndexPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const classes = await this.getAttendanceClassesForUser(user)
    const selectedClassId = String(ctx.request.input('class_id', ''))
    const startDate = ctx.request.input('start_date') || DateTime.now().startOf('month').toISODate()
    const endDate = ctx.request.input('end_date') || DateTime.now().toISODate()
    const allowedClassIds = classes.map((classObj) => classObj.id)
    const visibleClasses = selectedClassId
      ? classes.filter((classObj) => classObj.id === selectedClassId)
      : classes

    if (selectedClassId && !allowedClassIds.includes(selectedClassId)) {
      await this.authorizeAttendanceClass(user, selectedClassId)
    }

    const attendanceRows = visibleClasses.length
      ? await db
          .from('attendances')
          .join('students', 'attendances.student_id', 'students.id')
          .join('users', 'students.user_id', 'users.id')
          .select(
            'attendances.class_id',
            'attendances.student_id',
            'attendances.status',
            'students.registration_number',
            'users.first_name',
            'users.postnom',
            'users.last_name'
          )
          .whereIn(
            'attendances.class_id',
            visibleClasses.map((classObj) => classObj.id)
          )
          .whereBetween('attendances.date', [startDate, endDate])
      : []

    const rowsByClass = new Map<string, any[]>()
    for (const row of attendanceRows) {
      const classRows = rowsByClass.get(String(row.class_id)) || []
      classRows.push(row)
      rowsByClass.set(String(row.class_id), classRows)
    }

    const attendanceData = visibleClasses
      .map((classObj) => {
        const classRows = rowsByClass.get(classObj.id) || []
        const studentsById = new Map<string, any>()

        for (const row of classRows) {
          const studentId = String(row.student_id)
          if (!studentsById.has(studentId)) {
            studentsById.set(studentId, {
              id: studentId,
              name: [row.first_name, row.last_name, row.postnom].filter(Boolean).join(' '),
              registrationNumber: row.registration_number,
              present: 0,
              absent: 0,
              late: 0,
              excused: 0,
              rate: 0,
            })
          }

          const student = studentsById.get(studentId)
          if (row.status === 'present') student.present += 1
          if (row.status === 'absent') student.absent += 1
          if (row.status === 'late') student.late += 1
          if (row.status === 'excused') student.excused += 1
        }

        const students = Array.from(studentsById.values()).map((student) => {
          const total = student.present + student.absent + student.late + student.excused
          return {
            ...student,
            rate: total ? Math.round(((student.present + student.excused) / total) * 100) : 0,
          }
        })

        const totalRecords = classRows.length
        const presentCount = classRows.filter(
          (row) => row.status === 'present' || row.status === 'excused'
        ).length
        const absentCount = classRows.filter((row) => row.status === 'absent').length
        const lateCount = classRows.filter((row) => row.status === 'late').length

        return {
          className: classObj.name,
          period: { startDate, endDate },
          presentRate: totalRecords ? Math.round((presentCount / totalRecords) * 100) : 0,
          absentRate: totalRecords ? Math.round((absentCount / totalRecords) * 100) : 0,
          lateRate: totalRecords ? Math.round((lateCount / totalRecords) * 100) : 0,
          students,
          totalRecords,
        }
      })
      .filter((classAttendance) => classAttendance.totalRecords > 0)

    const allRows = attendanceRows
    const totalPresent = allRows.filter(
      (row) => row.status === 'present' || row.status === 'excused'
    ).length

    return ctx.view.render(
      'teacher/attendance/index',
      await edgePageContext(ctx, {
        classes,
        attendanceData,
        selectedClassId,
        selectedStartDate: startDate,
        selectedEndDate: endDate,
        stats: {
          totalClasses: classes.length,
          avgAttendance: allRows.length ? Math.round((totalPresent / allRows.length) * 100) : 0,
          totalAbsences: allRows.filter((row) => row.status === 'absent').length,
          totalLates: allRows.filter((row) => row.status === 'late').length,
        },
      })
    )
  }

  /**
   * Obtenir mes classes avec statistiques
   */
  public async getMyClasses({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const teacher = await Teacher.findByOrFail('user_id', user.id)

    const academicYear = request.input('academicYear')
    const term = request.input('term')

    const query = Class.query().where('teacher_id', teacher.id).whereNull('archivedAt')

    if (academicYear) {
      query.where('academic_year', academicYear)
    }

    const classes = await query.orderBy('grade_level', 'asc')
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

    const classesWithStats = await Promise.all(
      classes.map(async (classObj) => {
        const averageGrade = await db
          .from('grades')
          .where('class_id', classObj.id)
          .if(term, (q) => q.where('term', term))
          .avg('score as average')

        return {
          ...classObj.toJSON(),
          studentsCount: studentsByClass.get(classObj.id) || 0,
          averageGrade: Number(averageGrade[0].average || 0),
        }
      })
    )

    return response.ok({ success: true, classes: classesWithStats })
  }

  /**
   * Obtenir mes devoirs avec statistiques de soumission
   */
  public async assignmentsPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const teacher = await this.currentTeacher(user)
    const classes = await this.assignmentClasses(user, teacher)
    const classIds = classes.map((classObj) => classObj.id)
    const subjects = await this.assignmentSubjects(classIds)
    const classId = ctx.request.input('class_id')
    const subjectId = ctx.request.input('subject_id')
    const status = String(ctx.request.input('status', '')).trim()
    const search = String(ctx.request.input('search', '')).trim()

    const query = this.assignmentQueryForUser(user, teacher)
    query
      .if(classId, (assignmentQuery) => assignmentQuery.where('classId', classId))
      .if(subjectId, (assignmentQuery) => assignmentQuery.where('subjectId', subjectId))
      .if(search, (assignmentQuery) => assignmentQuery.whereILike('title', `%${search}%`))
      .orderBy('createdAt', 'desc')

    const assignments = await query
    let formattedAssignments = await Promise.all(
      assignments.map((assignment) => this.formatAssignment(assignment))
    )
    if (status) {
      formattedAssignments = formattedAssignments.filter((assignment) => assignment.status === status)
    }
    const stats = {
      total: formattedAssignments.length,
      published: formattedAssignments.filter((assignment) => assignment.status === 'published')
        .length,
      draft: formattedAssignments.filter((assignment) => assignment.status === 'draft').length,
      closed: formattedAssignments.filter((assignment) => assignment.status === 'closed').length,
      expired: formattedAssignments.filter((assignment) => assignment.status === 'expired').length,
      missingSubmissions: formattedAssignments.reduce(
        (total, assignment) => total + assignment.missingCount,
        0
      ),
      pendingSubmissions: formattedAssignments.reduce(
        (total, assignment) =>
          total + Math.max(assignment.submittedCount - assignment.gradedCount, 0),
        0
      ),
    }

    return ctx.view.render(
      'teacher/assignments/index',
      await edgePageContext(ctx, {
        assignments: formattedAssignments,
        classes,
        subjects,
        stats,
        pagination: {
          total: formattedAssignments.length,
          perPage: 50,
          currentPage: 1,
          lastPage: 1,
        },
      })
    )
  }

  public async attendanceReportPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const classes = await this.getAttendanceClassesForUser(user)
    const selectedClassId = String(ctx.request.input('class_id', classes[0]?.id || ''))
    const startDate = ctx.request.input('start_date') || DateTime.now().startOf('month').toISODate()
    const endDate = ctx.request.input('end_date') || DateTime.now().toISODate()
    const classObj = selectedClassId
      ? await this.authorizeAttendanceClass(user, selectedClassId)
      : classes[0]

    const rawStudents = classObj
      ? await Student.query()
          .where('classId', classObj.id)
          .where('academicStatus', 'active')
          .preload('user')
          .orderBy('registrationNumber', 'asc')
      : []

    const attendanceRows = classObj
      ? await db
          .from('attendances')
          .where('class_id', classObj.id)
          .whereBetween('date', [startDate, endDate])
      : []

    const rowsByStudent = new Map<string, any[]>()
    for (const row of attendanceRows) {
      const studentRows = rowsByStudent.get(String(row.student_id)) || []
      studentRows.push(row)
      rowsByStudent.set(String(row.student_id), studentRows)
    }

    const students = rawStudents.map((student, index) => {
      const rows = rowsByStudent.get(student.id) || []
      const present = rows.filter((row) => ['present', 'excused'].includes(row.status)).length
      const absent = rows.filter((row) => row.status === 'absent').length
      const late = rows.filter((row) => row.status === 'late').length
      const total = present + absent + late
      return {
        rank: index + 1,
        registrationNumber: student.registrationNumber,
        name: student.user?.fullName || '-',
        present,
        absent,
        late,
        rate: total ? Math.round((present / total) * 100) : 0,
      }
    })

    const totalPresent = students.reduce((sum, student) => sum + student.present, 0)
    const totalAbsent = students.reduce((sum, student) => sum + student.absent, 0)
    const totalLate = students.reduce((sum, student) => sum + student.late, 0)
    const totalRecords = totalPresent + totalAbsent + totalLate

    return ctx.view.render(
      'teacher/attendance/report',
      await edgePageContext(ctx, {
        classes,
        className: classObj?.name || '-',
        periodLabel: `${DateTime.fromISO(startDate).toFormat('dd/MM/yyyy')} - ${DateTime.fromISO(endDate).toFormat('dd/MM/yyyy')}`,
        generationDate: DateTime.now().toFormat('dd/MM/yyyy HH:mm'),
        students,
        totalStudents: rawStudents.length,
        totalDays: new Set(attendanceRows.map((row) => String(row.date))).size,
        totalPresent,
        totalAbsent,
        totalLate,
        presentRate: totalRecords ? Math.round((totalPresent / totalRecords) * 100) : 0,
        absentRate: totalRecords ? Math.round((totalAbsent / totalRecords) * 100) : 0,
        lateRate: totalRecords ? Math.round((totalLate / totalRecords) * 100) : 0,
        overallRate: totalRecords ? Math.round((totalPresent / totalRecords) * 100) : 0,
      })
    )
  }

  private async studentAttendancePayload(
    user: any,
    studentId: string,
    startDate?: string,
    endDate?: string
  ) {
    const student = await Student.query()
      .where('id', studentId)
      .preload('user')
      .preload('class')
      .firstOrFail()
    if (!student.classId) throw new Error('Cet eleve n est pas associe a une classe')
    await this.authorizeAttendanceClass(user, student.classId)

    const query = db.from('attendances').where('student_id', student.id).orderBy('date', 'desc')
    if (startDate && endDate) query.whereBetween('date', [startDate, endDate])
    else if (startDate) query.where('date', '>=', startDate)
    else if (endDate) query.where('date', '<=', endDate)

    const attendanceRecords = await query
    const present = attendanceRecords.filter((row) =>
      ['present', 'excused'].includes(row.status)
    ).length
    const absent = attendanceRecords.filter((row) => row.status === 'absent').length
    const late = attendanceRecords.filter((row) => row.status === 'late').length
    const total = present + absent + late

    return {
      student: {
        id: student.id,
        name: student.user?.fullName || '-',
        className: student.class?.name || '-',
        registrationNumber: student.registrationNumber,
      },
      attendanceRecords,
      stats: {
        present,
        absent,
        late,
        rate: total ? Math.round((present / total) * 100) : 0,
      },
    }
  }

  public async attendanceStudentPage(ctx: HttpContext) {
    const payload = await this.studentAttendancePayload(
      ctx.auth.getUserOrFail(),
      ctx.params.id,
      ctx.request.input('start_date'),
      ctx.request.input('end_date')
    )

    return ctx.view.render('teacher/attendance/student', await edgePageContext(ctx, payload))
  }

  public async dashboardPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const { formatted } = await this.teacherClassesData(user)
    const teacher = await this.currentTeacher(user)
    const assignments = await this.assignmentQueryForUser(user, teacher)
      .orderBy('createdAt', 'desc')
      .limit(5)
    const formattedAssignments = await Promise.all(
      assignments.map((assignment) => this.formatAssignment(assignment))
    )
    const topics = await ForumTopic.query()
      .where('author_id', user.id)
      .orderBy('created_at', 'desc')
      .limit(5)

    return ctx.view.render(
      'teacher/dashboard',
      await edgePageContext(ctx, {
        myClasses: formatted.slice(0, 4),
        recentAssignments: formattedAssignments,
        todayAttendance: formatted.map((item) => ({
          className: item.name,
          rate: item.attendanceRate,
          present: 0,
          total: item.studentsCount,
        })),
        forumTopics: topics.map((topic) => ({
          id: topic.id,
          title: topic.title,
          repliesCount: 0,
          viewsCount: topic.viewsCount || 0,
          createdAt: topic.createdAt,
        })),
        recentMessages: [],
        stats: {
          myClasses: formatted.length,
          myStudents: formatted.reduce((sum, item) => sum + item.studentsCount, 0),
          assignments: formattedAssignments.length,
          pendingSubmissions: formattedAssignments.reduce(
            (sum, item) => sum + Math.max(item.submittedCount - item.gradedCount, 0),
            0
          ),
        },
      })
    )
  }

  public async classesPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const { formatted } = await this.teacherClassesData(user)
    const totalStudents = formatted.reduce((sum, item) => sum + item.studentsCount, 0)
    const subjects = new Set(
      formatted.flatMap((item) => item.subjects.map((subject) => subject.id))
    )

    return ctx.view.render(
      'teacher/classes/index',
      await edgePageContext(ctx, {
        classes: formatted,
        currentYear: DateTime.now().year,
        stats: {
          total: formatted.length,
          totalStudents,
          avgClassSize: formatted.length ? Math.round(totalStudents / formatted.length) : 0,
          totalSubjects: subjects.size,
        },
      })
    )
  }

  public async classShowPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const teacher = await this.currentTeacher(user)
    const classModel = await this.authorizeAttendanceClass(user, ctx.params.id)
    const classObj = await this.formatClassForTeacher(classModel, teacher, user)
    const students = await this.classStudents(classObj.id)
    const assignments = await Assignment.query()
      .where('classId', classObj.id)
      .preload('subject')
      .preload('submissions')
      .orderBy('createdAt', 'desc')
      .limit(5)

    return ctx.view.render(
      'teacher/classes/show',
      await edgePageContext(ctx, {
        classObj,
        subjects: classObj.subjects,
        todaySchedule: [],
        recentStudents: students.slice(0, 10),
        recentAssignments: assignments.map((assignment) => ({
          id: assignment.id,
          title: assignment.title,
          subjectName: assignment.subject?.name || '-',
          dueDate: assignment.dueDate?.toFormat('dd/MM/yyyy') || '-',
          submittedCount: assignment.submissions.filter((submission) =>
            ['submitted', 'graded'].includes(submission.status)
          ).length,
          isOverdue: assignment.dueDate < DateTime.now(),
        })),
        stats: {
          studentsCount: students.length,
          averageGrade: classObj.averageGrade,
          attendanceRate: classObj.attendanceRate,
          assignmentsCount: assignments.length,
        },
      })
    )
  }

  public async classStudentsPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const teacher = await this.currentTeacher(user)
    const classModel = await this.authorizeAttendanceClass(user, ctx.params.id)
    const classObj = await this.formatClassForTeacher(classModel, teacher, user)
    const students = await this.classStudents(classObj.id)

    return ctx.view.render(
      'teacher/classes/students',
      await edgePageContext(ctx, { classObj, students })
    )
  }

  public async timetablePage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const { formatted } = await this.teacherClassesData(user)

    return ctx.view.render(
      'schools/timetable/index',
      await edgePageContext(ctx, {
        classes: formatted,
        currentYear: DateTime.now().year,
        selectedClassId: ctx.request.input('class_id', ''),
        canManageTimetable: ['director', 'discipline_director'].includes(user.role),
        timetableIndexUrl: '/teacher/timetable',
      })
    )
  }

  public async gradesPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const { teacher, classes, formatted } = await this.teacherClassesData(user)
    const classIds = classes.map((item) => item.id)
    const subjects = await this.assignmentSubjects(classIds)
    const query = Grade.query()
      .whereIn('classId', classIds)
      .preload('student', (q) => q.preload('user'))
      .preload('class')
      .preload('subject')

    if (ctx.request.input('class_id')) query.where('classId', ctx.request.input('class_id'))
    if (ctx.request.input('subject_id')) query.where('subjectId', ctx.request.input('subject_id'))
    if (ctx.request.input('term')) query.where('term', ctx.request.input('term'))
    if (ctx.request.input('published') !== undefined)
      query.where('published', String(ctx.request.input('published')) === 'true')
    if (teacher && !['director', 'discipline_director'].includes(user.role)) {
      const subjectRows = await db
        .from('class_subject')
        .where('teacher_id', teacher.id)
        .select('subject_id', 'class_id')
      query.where((builder) => {
        for (const row of subjectRows) {
          builder.orWhere((sub) =>
            sub.where('class_id', row.class_id).where('subject_id', row.subject_id)
          )
        }
      })
    }

    const gradeRows = await query.orderBy('examDate', 'desc').limit(200)
    const scores = gradeRows.map((grade) => Number(grade.score)).filter(Number.isFinite)
    const classEvaluationPolicies = await this.evaluationClassOptions(classes)
    const filterTermOptions = this.evaluationTermOptionsFromPolicies(classEvaluationPolicies)

    return ctx.view.render(
      'teacher/grades/index',
      await edgePageContext(ctx, {
        classes: formatted,
        subjects,
        classEvaluationPolicies,
        filterTermOptions,
        fallbackTermOptions: allEvaluationPeriodOptions(),
        fallbackEvaluationTypeOptions: allEvaluationTypeOptions(),
        filterPeriodLabel: 'Période scolaire',
        grades: gradeRows.map((grade) => ({
          id: grade.id,
          examDate: grade.examDate,
          studentName: grade.student?.user?.fullName || grade.student?.registrationNumber || '-',
          registrationNumber: grade.student?.registrationNumber || '-',
          className: grade.class?.name || '-',
          subjectName: grade.subject?.name || '-',
          score: grade.score,
          maxScore: grade.maxScore || 20,
          term: evaluationPeriodLabel(grade.term),
          examType: grade.examType,
          published: grade.published,
        })),
        stats: {
          totalGrades: gradeRows.length,
          published: gradeRows.filter((grade) => grade.published).length,
          average: this.formatScore(
            scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null
          ),
          students: new Set(gradeRows.map((grade) => grade.studentId)).size,
        },
      })
    )
  }

  public async gradeAddPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const { formatted } = await this.teacherClassesData(user)
    const selectedClassId = String(ctx.request.input('class_id', '')).trim()

    return ctx.view.render(
      'teacher/grades/add',
      await edgePageContext(ctx, {
        myClasses: formatted,
        selectedClassId,
        evaluationPolicies: SECTION_EVALUATION_POLICIES,
        classEvaluationPolicies: await this.evaluationClassOptions(formatted),
        fallbackTermOptions: allEvaluationPeriodOptions(),
        fallbackEvaluationTypeOptions: allEvaluationTypeOptions(),
      })
    )
  }

  public async gradeClassPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const teacher = await this.currentTeacher(user)
    const classModel = await this.authorizeAttendanceClass(user, ctx.params.classId)
    const subjects = await this.classSubjects(classModel.id, teacher, user)
    const subjectId = String(ctx.request.input('subject_id', '')).trim()
    const classEvaluationPolicies = await this.evaluationClassOptions([classModel])
    const evaluationPolicy = classEvaluationPolicies[classModel.id]
    const term = String(
      ctx.request.input('term', evaluationPolicy.periods[0]?.value || 'T1-P1')
    ).trim()
    const students = await this.classStudents(classModel.id)
    const grades = await Grade.query()
      .where('classId', classModel.id)
      .where('term', term)
      .if(subjectId, (query) => query.where('subjectId', subjectId))
      .preload('subject')

    const rows = students
      .map((student) => {
        const studentGrades = grades.filter((grade) => grade.studentId === student.id)
        const scores = studentGrades.map((grade) => Number(grade.score)).filter(Number.isFinite)
        const average = scores.length
          ? scores.reduce((sum, score) => sum + score, 0) / scores.length
          : 0
        return {
          ...student,
          rank: 0,
          average,
          gradesBySubject: subjects.map((subject) => ({
            subjectId: subject.id,
            score: studentGrades.find((grade) => grade.subjectId === subject.id)?.score || null,
          })),
          grade: {
            score: studentGrades[0]?.score || null,
            comment: studentGrades[0]?.teacherComments || null,
          },
        }
      })
      .sort((a, b) => b.average - a.average)
      .map((student, index) => ({ ...student, rank: index + 1 }))
    const scores = rows.map((student) => student.average).filter(Number.isFinite)
    const distribution = [0, 0, 0, 0, 0, 0, 0]
    scores.forEach((score) => {
      if (score < 5) distribution[0]++
      else if (score < 10) distribution[1]++
      else if (score < 12) distribution[2]++
      else if (score < 14) distribution[3]++
      else if (score < 16) distribution[4]++
      else if (score < 18) distribution[5]++
      else distribution[6]++
    })

    return ctx.view.render(
      'teacher/grades/class',
      await edgePageContext(ctx, {
        classId: classModel.id,
        className: classModel.name,
        term,
        termLabel: evaluationPeriodLabel(term),
        evaluationPolicy,
        subjectId,
        subjectName: subjects.find((subject) => subject.id === subjectId)?.name || '',
        subjects,
        subjectsList: subjects,
        students: rows,
        stats: {
          average: this.formatScore(
            scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null
          ),
          highest: this.formatScore(scores.length ? Math.max(...scores) : null),
          lowest: this.formatScore(scores.length ? Math.min(...scores) : null),
          passRate: scores.length
            ? Math.round((scores.filter((score) => score >= 10).length / scores.length) * 100)
            : 0,
        },
        distributionData: distribution,
      })
    )
  }

  public async gradeEditPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const { classes } = await this.teacherClassesData(user)
    const grade = await Grade.query()
      .where('id', ctx.params.id)
      .whereIn(
        'classId',
        classes.map((item) => item.id)
      )
      .preload('student', (q) => q.preload('user'))
      .preload('class')
      .preload('subject')
      .firstOrFail()

    return ctx.view.render(
      'teacher/grades/edit',
      await edgePageContext(ctx, {
        grade: {
          id: grade.id,
          studentName: grade.student?.user?.fullName || grade.student?.registrationNumber || '-',
          subjectName: grade.subject?.name || '-',
          className: grade.class?.name || '-',
          term: grade.term,
          score: grade.score || 0,
          maxScore: grade.maxScore || 20,
          teacherComments: grade.teacherComments,
          published: grade.published,
        },
      })
    )
  }

  public async assignmentCreatePage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const teacher = await this.currentTeacher(user)
    const classes = await this.assignmentClasses(user, teacher)
    const classEvaluationPolicies = await this.evaluationClassOptions(classes)
    const termOptions = this.evaluationTermOptionsFromPolicies(classEvaluationPolicies)

    return ctx.view.render(
      'teacher/assignments/create',
      await edgePageContext(ctx, {
        classes,
        evaluationPolicies: SECTION_EVALUATION_POLICIES,
        classEvaluationPolicies,
        termOptions,
        fallbackTermOptions: allEvaluationPeriodOptions(),
      })
    )
  }

  public async storeAssignmentWeb({ auth, request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createAssignmentValidator)
    const user = auth.getUserOrFail()
    const teacher = await this.currentTeacher(user)

    if (!teacher) {
      session.flash('error', "Aucun profil enseignant n'est lie a votre compte.")
      return response.redirect().back()
    }

    const classSubject = await db
      .from('class_subject')
      .where('class_id', payload.classId)
      .where('subject_id', payload.subjectId)
      .where('teacher_id', teacher.id)
      .first()

    if (!classSubject) {
      session.flash(
        'error',
        "Vous n'etes pas autorise a creer un devoir pour cette classe et cette matiere."
      )
      return response.redirect().back()
    }

    let attachmentUrl: string | null = null
    try {
      attachmentUrl = await this.storeAssignmentAttachment(request, 'assignments')
    } catch (error) {
      session.flash('error', error instanceof Error ? error.message : 'Fichier joint invalide')
      return response.redirect().back()
    }

    const saveAsDraft = Boolean(request.input('saveAsDraft'))
    const assignment = await Assignment.create({
      teacherId: teacher.id,
      classId: payload.classId,
      subjectId: payload.subjectId,
      title: payload.title,
      description: payload.description || null,
      instructions: payload.instructions || null,
      dueDate: payload.dueDate,
      dueTime: payload.dueTime || null,
      maxPoints: payload.maxPoints || 20,
      term: payload.term || null,
      evaluationType: payload.evaluationType || 'devoir',
      attachmentUrl,
      status: saveAsDraft ? 'draft' : 'published',
      publishedAt: saveAsDraft ? null : DateTime.now(),
    })

    return response.redirect(`/teacher/assignments/${assignment.id}`)
  }

  public async assignmentShowPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    if (!this.isUuid(ctx.params.id)) {
      ctx.session.flash('error', 'Identifiant du devoir invalide.')
      return ctx.response.redirect('/teacher/assignments')
    }
    const assignment = await this.getTeacherAssignment(user, ctx.params.id)
    const formatted = await this.formatAssignment(assignment)
    const recentSubmissions = (assignment.submissions || [])
      .filter((submission) => ['submitted', 'graded'].includes(submission.status))
      .slice()
      .sort(
        (a, b) => Number(b.submittedAt?.toMillis() || 0) - Number(a.submittedAt?.toMillis() || 0)
      )
      .slice(0, 5)
      .map((submission) => ({
        id: submission.id,
        studentName: submission.student?.user?.fullName || '-',
        submittedAt: submission.submittedAt,
        grade: submission.grade ? Number(submission.grade) : null,
      }))

    return ctx.view.render(
      'teacher/assignments/show',
      await edgePageContext(ctx, {
        assignment: formatted,
        recentSubmissions,
      })
    )
  }

  public async assignmentEditPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    if (!this.isUuid(ctx.params.id)) {
      ctx.session.flash('error', 'Identifiant du devoir invalide.')
      return ctx.response.redirect('/teacher/assignments')
    }
    const assignment = await this.getTeacherAssignment(user, ctx.params.id)

    return ctx.view.render(
      'teacher/assignments/edit',
      await edgePageContext(ctx, {
        assignment: await this.formatAssignment(assignment),
        termOptions: allEvaluationPeriodOptions(),
      })
    )
  }

  public async updateAssignmentWeb({ auth, params, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const assignment = await this.getTeacherAssignment(user, params.id)

    let attachmentUrl = assignment.attachmentUrl
    try {
      attachmentUrl =
        (await this.storeAssignmentAttachment(request, 'assignments')) || attachmentUrl
    } catch (error) {
      session.flash('error', error instanceof Error ? error.message : 'Fichier joint invalide')
      return response.redirect().back()
    }

    const status = String(request.input('status') || assignment.status) as
      | 'draft'
      | 'published'
      | 'closed'
    assignment.merge({
      title: String(request.input('title') || assignment.title).trim(),
      description: String(request.input('description') || '').trim() || null,
      instructions: String(request.input('instructions') || '').trim() || null,
      dueDate: DateTime.fromISO(String(request.input('dueDate') || assignment.dueDate.toISODate())),
      dueTime: String(request.input('dueTime') || '').trim() || null,
      maxPoints: Number(request.input('maxPoints') || assignment.maxPoints || 20),
      term: String(request.input('term') || assignment.term || '').trim() || null,
      evaluationType: String(request.input('evaluationType') || assignment.evaluationType || 'devoir') as
        | 'devoir'
        | 'interrogation',
      attachmentUrl,
      status,
      publishedAt:
        status === 'published' && !assignment.publishedAt ? DateTime.now() : assignment.publishedAt,
    })
    await assignment.save()

    if (request.method() === 'PUT') return response.ok({ success: true })
    return response.redirect(`/teacher/assignments/${assignment.id}`)
  }

  public async publishAssignment({ auth, params, response }: HttpContext) {
    if (!this.isUuid(params.id)) {
      return response.badRequest({ success: false, message: 'Identifiant du devoir invalide.' })
    }
    const assignment = await this.getTeacherAssignment(auth.getUserOrFail(), params.id)
    assignment.status = 'published'
    assignment.publishedAt = assignment.publishedAt || DateTime.now()
    await assignment.save()

    return response.ok({ success: true })
  }

  public async closeAssignment({ auth, params, response }: HttpContext) {
    if (!this.isUuid(params.id)) {
      return response.badRequest({ success: false, message: 'Identifiant du devoir invalide.' })
    }
    const assignment = await this.getTeacherAssignment(auth.getUserOrFail(), params.id)
    assignment.status = 'closed'
    await assignment.save()

    return response.ok({ success: true })
  }

  public async removeAssignmentAttachment({ auth, params, response }: HttpContext) {
    if (!this.isUuid(params.id)) {
      return response.badRequest({ success: false, message: 'Identifiant du devoir invalide.' })
    }
    const assignment = await this.getTeacherAssignment(auth.getUserOrFail(), params.id)
    assignment.attachmentUrl = null
    await assignment.save()

    return response.ok({ success: true })
  }

  public async assignmentSubmissionsPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    if (!this.isUuid(ctx.params.id)) {
      ctx.session.flash('error', 'Identifiant du devoir invalide.')
      return ctx.response.redirect('/teacher/assignments')
    }
    const assignment = await this.getTeacherAssignment(user, ctx.params.id)
    const students = await activeStudentsForAssignment(assignment)

    const submissionByStudent = new Map(
      (assignment.submissions || []).map((submission) => [submission.studentId, submission])
    )
    const submissions = students.map((student) => {
      const submission = submissionByStudent.get(student.id)
      const submissionMeta = assignmentSubmissionMeta(assignment, submission || null)
      return {
        id: submission?.id || '',
        studentName: student.user?.fullName || '-',
        registrationNumber: student.registrationNumber,
        status: submissionMeta.status,
        statusLabel: submissionMeta.label,
        statusClass: submissionMeta.badgeClass,
        submittedAt: submission?.submittedAt || null,
        grade: submission?.grade ? Number(submission.grade) : null,
        attachmentUrl: submission?.attachmentUrl || null,
        isGraded: submissionMeta.isGraded,
        isSubmitted: submissionMeta.isSubmitted,
        isLate: submissionMeta.isLate,
      }
    })
    const submitted = submissions.filter((submission) => submission.isSubmitted).length
    const graded = submissions.filter((submission) => submission.isGraded).length
    const late = submissions.filter((submission) => submission.isLate).length

    return ctx.view.render(
      'teacher/assignments/submissions',
      await edgePageContext(ctx, {
        assignment: await this.formatAssignment(assignment),
        submissions,
        stats: {
          total: students.length,
          submitted,
          graded,
          late,
          notSubmitted: Math.max(students.length - submitted, 0),
        },
      })
    )
  }

  public async gradeSubmissionPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const submission = await AssignmentSubmission.query()
      .where('id', ctx.params.id)
      .preload('assignment', (assignmentQuery) =>
        assignmentQuery.preload('class').preload('subject')
      )
      .preload('student', (studentQuery) => studentQuery.preload('user'))
      .firstOrFail()

    await this.getTeacherAssignment(user, submission.assignmentId)

    return ctx.view.render(
      'teacher/assignments/grade',
      await edgePageContext(ctx, {
        assignment: await this.formatAssignment(submission.assignment),
        submission: {
          id: submission.id,
          studentName: submission.student?.user?.fullName || '-',
          registrationNumber: submission.student?.registrationNumber || '-',
          submittedAt: submission.submittedAt,
          attachmentUrl: submission.attachmentUrl,
          submissionContent: submission.submissionContent,
          grade: submission.grade ? Number(submission.grade) : 0,
          teacherFeedback: submission.teacherFeedback,
        },
      })
    )
  }

  public async gradeSubmissionWeb(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(gradeSubmissionValidator)
    const user = ctx.auth.getUserOrFail()
    const submission = await AssignmentSubmission.query()
      .where('id', ctx.params.id)
      .preload('assignment')
      .firstOrFail()
    await this.getTeacherAssignment(user, submission.assignmentId)

    submission.merge({
      grade: payload.grade.toString(),
      teacherFeedback: payload.teacherFeedback || null,
      status: 'graded',
    })
    await submission.save()

    return ctx.response.redirect(`/teacher/assignments/${submission.assignmentId}/submissions`)
  }

  public async exportAssignments({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const teacher = await this.currentTeacher(user)
    const classId = request.input('class_id')
    const subjectId = request.input('subject_id')

    const query = this.assignmentQueryForUser(user, teacher)
    query
      .if(classId, (assignmentQuery) => assignmentQuery.where('classId', classId))
      .if(subjectId, (assignmentQuery) => assignmentQuery.where('subjectId', subjectId))
      .orderBy('createdAt', 'desc')

    const assignments = await query
    const formatted = await Promise.all(
      assignments.map((assignment) => this.formatAssignment(assignment))
    )
    const header = [
      'Titre',
      'Classe',
      'Matiere',
      'Statut',
      'Date limite',
      'Points',
      'Rendus',
      'Notes',
    ]
    const rows = formatted.map((assignment) =>
      [
        assignment.title,
        assignment.className,
        assignment.subjectName,
        assignment.status,
        assignment.dueDate?.toFormat('dd/MM/yyyy') || '',
        assignment.maxPoints,
        assignment.submittedCount,
        assignment.gradedCount,
      ].map((value) => this.csvValue(value))
    )

    response.header('Content-Type', 'text/csv; charset=utf-8')
    response.header(
      'Content-Disposition',
      `attachment; filename="devoirs-${DateTime.now().toFormat('yyyyLLdd-HHmm')}.csv"`
    )
    return response.send(
      `\uFEFF${header.map((value) => this.csvValue(value)).join(',')}\n${rows.map((row) => row.join(',')).join('\n')}`
    )
  }

  public async exportSubmissions({ auth, params, response }: HttpContext) {
    const assignment = await this.getTeacherAssignment(auth.getUserOrFail(), params.id)
    const students = await Student.query()
      .where('classId', assignment.classId)
      .where('academicStatus', 'active')
      .preload('user')
      .orderBy('registrationNumber', 'asc')

    const submissionByStudent = new Map(
      (assignment.submissions || []).map((submission) => [submission.studentId, submission])
    )
    const header = ['Matricule', 'Eleve', 'Statut', 'Date soumission', 'Note', 'Feedback']
    const rows = students.map((student) => {
      const submission = submissionByStudent.get(student.id)
      return [
        student.registrationNumber,
        student.user?.fullName || '-',
        submission?.status || 'not_submitted',
        submission?.submittedAt?.toFormat('dd/MM/yyyy HH:mm') || '',
        submission?.grade || '',
        submission?.teacherFeedback || '',
      ].map((value) => this.csvValue(value))
    })

    response.header('Content-Type', 'text/csv; charset=utf-8')
    response.header(
      'Content-Disposition',
      `attachment; filename="soumissions-${DateTime.now().toFormat('yyyyLLdd-HHmm')}.csv"`
    )
    return response.send(
      `\uFEFF${header.map((value) => this.csvValue(value)).join(',')}\n${rows.map((row) => row.join(',')).join('\n')}`
    )
  }

  public async classSubjectsData({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const teacher = await this.currentTeacher(user)
    await this.authorizeAttendanceClass(user, params.id)
    const subjects = await this.classSubjects(params.id, teacher, user)

    return response.ok({ success: true, subjects })
  }

  public async exportClasses({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const { formatted } = await this.teacherClassesData(user)
    const header = [
      'Classe',
      'Niveau',
      'Annee scolaire',
      'Eleves',
      'Moyenne',
      'Presence',
      'Matieres',
    ]
    const rows = formatted.map((classObj) =>
      [
        classObj.name,
        classObj.level,
        classObj.academicYear,
        classObj.studentsCount,
        classObj.averageGrade,
        `${classObj.attendanceRate}%`,
        classObj.subjects.map((subject) => subject.name).join(' | '),
      ].map((value) => this.csvValue(value))
    )

    response.header('Content-Type', 'text/csv; charset=utf-8')
    response.header(
      'Content-Disposition',
      `attachment; filename="classes-enseignant-${DateTime.now().toFormat('yyyyLLdd-HHmm')}.csv"`
    )
    return response.send(
      `\uFEFF${header.map((value) => this.csvValue(value)).join(',')}\n${rows.map((row) => row.join(',')).join('\n')}`
    )
  }

  public async exportClassStudents({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const classObj = await this.authorizeAttendanceClass(user, params.id)
    const students = await this.classStudents(params.id)
    const header = [
      'Matricule',
      'Eleve',
      'Tuteur principal',
      'Lien',
      'Telephone parent',
      'Moyenne',
      'Presence',
    ]
    const rows = students.map((student) =>
      [
        student.registrationNumber,
        student.name,
        student.primaryGuardian?.fullName || '-',
        student.parentRelationship || '-',
        student.parentPhone,
        student.averageGrade,
        `${student.attendanceRate}%`,
      ].map((value) => this.csvValue(value))
    )

    response.header('Content-Type', 'text/csv; charset=utf-8')
    response.header(
      'Content-Disposition',
      `attachment; filename="eleves-${classObj.name}-${DateTime.now().toFormat('yyyyLLdd-HHmm')}.csv"`
    )
    return response.send(
      `\uFEFF${header.map((value) => this.csvValue(value)).join(',')}\n${rows.map((row) => row.join(',')).join('\n')}`
    )
  }

  public async gradeClassData({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    await this.authorizeAttendanceClass(user, params.classId)
    const subjectId = request.input('subject_id')
    const term = request.input('term')
    const examType = request.input('exam_type')

    const query = Grade.query()
      .where('classId', params.classId)
      .preload('student', (studentQuery) => studentQuery.preload('user'))
      .preload('subject')
      .orderBy('examDate', 'desc')

    if (subjectId) query.where('subjectId', subjectId)
    if (term) query.where('term', term)
    if (examType) query.where('examType', examType)

    const grades = await query
    const gradesByStudent = new Map<string, any>()

    for (const grade of grades) {
      const student = grade.student
      if (!gradesByStudent.has(grade.studentId)) {
        gradesByStudent.set(grade.studentId, {
          id: grade.studentId,
          name: student?.user?.fullName || '-',
          registrationNumber: student?.registrationNumber || '',
          grades: [],
        })
      }

      gradesByStudent.get(grade.studentId).grades.push({
        id: grade.id,
        subjectId: grade.subjectId,
        subjectName: grade.subject?.name || '-',
        term: grade.term,
        examType: grade.examType,
        score: grade.score,
        maxScore: grade.maxScore,
        percentage: grade.percentage,
        teacherComments: grade.teacherComments,
        examDate: grade.examDate?.toISODate(),
        published: grade.published,
      })
    }

    return response.ok({ success: true, gradesByStudent: Array.from(gradesByStudent.values()) })
  }

  public async storeGradeWeb({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const classId = request.input('classId')
    await this.authorizeAttendanceClass(user, classId)

    const score = Number(request.input('score'))
    const maxScore = Number(request.input('maxScore', 20))
    if (!Number.isFinite(score) || !Number.isFinite(maxScore) || maxScore <= 0 || maxScore > 500) {
      return response.badRequest({
        success: false,
        message: 'La note ou la pondération est invalide',
      })
    }
    if (score < 0 || score > maxScore) {
      return response.badRequest({
        success: false,
        message: 'La note ne peut pas dépasser la pondération choisie',
      })
    }

    const existingGrade = await Grade.query()
      .where('studentId', request.input('studentId'))
      .where('subjectId', request.input('subjectId'))
      .where('classId', classId)
      .where('term', request.input('term'))
      .where('examType', request.input('examType'))
      .first()
    const grade = existingGrade || new Grade()

    grade.fill({
      studentId: request.input('studentId'),
      classId,
      subjectId: request.input('subjectId'),
      term: request.input('term'),
      examType: request.input('examType'),
      score,
      maxScore,
      teacherComments: request.input('teacherComments') || request.input('comment') || null,
      examDate: DateTime.fromISO(request.input('examDate') || DateTime.now().toISODate()!),
      published: Boolean(request.input('published', false)),
      publishedAt: request.input('published') ? DateTime.now() : null,
    })
    await grade.save()

    return response.status(existingGrade ? 200 : 201).send({ success: true, grade })
  }

  public async updateGradeWeb(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const grade = await Grade.query()
      .where('id', ctx.params.id)
      .preload('student', (studentQuery) => studentQuery.preload('user'))
      .preload('subject')
      .preload('class')
      .firstOrFail()

    await this.authorizeAttendanceClass(user, grade.classId)

    const score = Number(ctx.request.input('score', grade.score))
    const maxScore = grade.maxScore || 20
    if (!Number.isFinite(score) || score < 0 || score > maxScore) {
      return ctx.response.badRequest({
        success: false,
        message: 'La note ne peut pas dépasser la pondération choisie',
      })
    }

    grade.score = score
    grade.maxScore = maxScore
    grade.teacherComments = ctx.request.input('teacherComments', grade.teacherComments)
    grade.published = Boolean(ctx.request.input('published', grade.published))
    grade.publishedAt = grade.published ? DateTime.now() : null
    await grade.save()

    if (ctx.request.accepts(['html', 'json']) === 'json') {
      return ctx.response.ok({ success: true, grade })
    }

    ctx.session.flash('success', 'Note modifiee avec succes')
    return ctx.response.redirect('/teacher/grades')
  }

  public async deleteGradeWeb({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const grade = await Grade.findOrFail(params.id)
    await this.authorizeAttendanceClass(user, grade.classId)
    await grade.delete()

    return response.ok({ success: true })
  }

  public async publishGrades({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const classId = params.classId || request.input('classId') || request.input('class_id')
    const subjectId = request.input('subjectId') || request.input('subject_id')
    const term = request.input('term')

    if (classId) {
      await this.authorizeAttendanceClass(user, classId)
    }

    const query = Grade.query()
    if (classId) query.where('classId', classId)
    if (subjectId) query.where('subjectId', subjectId)
    if (term) query.where('term', term)

    const grades = await query
    for (const grade of grades) {
      if (!classId) await this.authorizeAttendanceClass(user, grade.classId)
      grade.published = true
      grade.publishedAt = DateTime.now()
      await grade.save()
    }

    return response.ok({ success: true, count: grades.length })
  }

  public async exportGrades({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const classId = params.classId || request.input('class_id')
    const subjectId = request.input('subject_id')
    const term = request.input('term')

    if (classId) await this.authorizeAttendanceClass(user, classId)

    const query = Grade.query()
      .preload('student', (studentQuery) => studentQuery.preload('user'))
      .preload('class')
      .preload('subject')
      .orderBy('examDate', 'desc')

    if (classId) query.where('classId', classId)
    if (subjectId) query.where('subjectId', subjectId)
    if (term) query.where('term', term)

    const grades = await query
    const authorizedGrades = []
    for (const grade of grades) {
      if (!classId) await this.authorizeAttendanceClass(user, grade.classId)
      authorizedGrades.push(grade)
    }

    const header = [
      'Eleve',
      'Classe',
      'Matiere',
      'Periode',
      'Evaluation',
      'Note',
      'Pourcentage',
      'Publiee',
    ]
    const rows = authorizedGrades.map((grade) =>
      [
        grade.student?.user?.fullName || '-',
        grade.class?.name || '-',
        grade.subject?.name || '-',
        grade.term,
        grade.examType,
        `${grade.score}/${grade.maxScore}`,
        `${this.formatScore(grade.percentage)}%`,
        grade.published ? 'Oui' : 'Non',
      ].map((value) => this.csvValue(value))
    )

    response.header('Content-Type', 'text/csv; charset=utf-8')
    response.header(
      'Content-Disposition',
      `attachment; filename="notes-${DateTime.now().toFormat('yyyyLLdd-HHmm')}.csv"`
    )
    return response.send(
      `\uFEFF${header.map((value) => this.csvValue(value)).join(',')}\n${rows.map((row) => row.join(',')).join('\n')}`
    )
  }

  public async attendanceStudentData({ auth, params, request, response }: HttpContext) {
    const payload = await this.studentAttendancePayload(
      auth.getUserOrFail(),
      params.id,
      request.input('start_date'),
      request.input('end_date')
    )
    return response.ok({
      success: true,
      attendances: payload.attendanceRecords,
      stats: payload.stats,
    })
  }

  public async exportAttendanceStudent({ auth, params, request, response }: HttpContext) {
    const payload = await this.studentAttendancePayload(
      auth.getUserOrFail(),
      params.id,
      request.input('start_date'),
      request.input('end_date')
    )
    const header = ['Date', 'Periode', 'Statut', 'Motif']
    const rows = payload.attendanceRecords.map((record) =>
      [record.date, record.period, record.status, record.reason || ''].map((value) =>
        this.csvValue(value)
      )
    )

    response.header('Content-Type', 'text/csv; charset=utf-8')
    response.header(
      'Content-Disposition',
      `attachment; filename="presences-${payload.student.registrationNumber}-${DateTime.now().toFormat('yyyyLLdd-HHmm')}.csv"`
    )
    return response.send(
      `\uFEFF${header.map((value) => this.csvValue(value)).join(',')}\n${rows.map((row) => row.join(',')).join('\n')}`
    )
  }

  public async exportAttendance({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const classes = await this.getAttendanceClassesForUser(user)
    const classIds = classes.map((classObj) => classObj.id)
    const selectedClassId = request.input('class_id')
    if (selectedClassId) await this.authorizeAttendanceClass(user, selectedClassId)

    const query = db
      .from('attendances')
      .join('students', 'attendances.student_id', 'students.id')
      .join('users', 'students.user_id', 'users.id')
      .join('classes', 'attendances.class_id', 'classes.id')
      .select(
        'attendances.date',
        'attendances.period',
        'attendances.status',
        'attendances.reason',
        'students.registration_number',
        'users.first_name',
        'users.last_name',
        'users.postnom',
        'classes.name as class_name'
      )

    if (selectedClassId) query.where('attendances.class_id', selectedClassId)
    else if (classIds.length) query.whereIn('attendances.class_id', classIds)
    else query.whereRaw('1 = 0')

    const rowsData = await query.orderBy('attendances.date', 'desc')
    const header = ['Date', 'Classe', 'Matricule', 'Eleve', 'Periode', 'Statut', 'Motif']
    const rows = rowsData.map((row) =>
      [
        row.date,
        row.class_name,
        row.registration_number,
        [row.first_name, row.last_name, row.postnom].filter(Boolean).join(' '),
        row.period,
        row.status,
        row.reason || '',
      ].map((value) => this.csvValue(value))
    )

    response.header('Content-Type', 'text/csv; charset=utf-8')
    response.header(
      'Content-Disposition',
      `attachment; filename="presences-${DateTime.now().toFormat('yyyyLLdd-HHmm')}.csv"`
    )
    return response.send(
      `\uFEFF${header.map((value) => this.csvValue(value)).join(',')}\n${rows.map((row) => row.join(',')).join('\n')}`
    )
  }

  public async sendTeacherMessage({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const recipient = request.input('recipient')
    const subject = request.input('subject') || 'Message de l enseignant'
    const content = request.input('content')
    const classId = request.input('classId')

    if (!content)
      return response.badRequest({ success: false, message: 'Le message est obligatoire' })
    if (classId) await this.authorizeAttendanceClass(user, classId)

    let receiverIds: string[] = []
    if (recipient && recipient !== 'all') {
      const student = await Student.query()
        .where('id', recipient)
        .where('classId', classId)
        .where('academicStatus', 'active')
        .first()

      if (!student) {
        return response.notFound({
          success: false,
          message: "L'eleve selectionne n'appartient pas a cette classe.",
        })
      }

      const parents = await db
        .from('parent_student')
        .join('parents', 'parent_student.parent_id', 'parents.id')
        .where('parent_student.student_id', student.id)
        .select('parents.user_id')

      receiverIds.push(...parents.map((parent) => parent.user_id).filter(Boolean))
    } else if (classId) {
      const students = await Student.query()
        .where('classId', classId)
        .where('academicStatus', 'active')
      const studentIds = students.map((student) => student.id)
      const parents = studentIds.length
        ? await db
            .from('parent_student')
            .join('parents', 'parent_student.parent_id', 'parents.id')
            .whereIn('parent_student.student_id', studentIds)
            .select('parents.user_id')
        : []

      receiverIds.push(...parents.map((parent) => parent.user_id).filter(Boolean))
    }

    receiverIds = [...new Set(receiverIds)]

    if (!receiverIds.length) {
      return response.badRequest({
        success: false,
        message: 'Aucun parent lie a cet eleve ou a cette classe.',
      })
    }

    for (const receiverId of receiverIds) {
      await Message.create({
        schoolId: user.schoolId,
        senderId: user.id,
        receiverId,
        subject,
        content,
        type: 'parent_teacher',
        isRead: false,
        isGlobal: false,
      })
    }

    return response.ok({ success: true, sent: receiverIds.length })
  }

  public async notificationsCount({ response }: HttpContext) {
    return response.ok({ success: true, count: 0 })
  }

  public async getAssignments({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const teacher = await Teacher.findByOrFail('user_id', user.id)

    const assignments = await Assignment.query()
      .where('teacher_id', teacher.id)
      .preload('class')
      .preload('subject')
      .orderBy('createdAt', 'desc')

    const assignmentsWithStats = await Promise.all(
      assignments.map(async (assignment) => {
        const submissions = await AssignmentSubmission.query().where('assignment_id', assignment.id)

        const submitted = submissions.filter((s) => s.status === 'submitted').length
        const graded = submissions.filter((s) => s.status === 'graded').length
        const total = submissions.length

        return {
          ...assignment.toJSON(),
          stats: {
            total,
            submitted,
            graded,
            pending: total - submitted,
            submissionRate: total > 0 ? (submitted / total) * 100 : 0,
          },
        }
      })
    )

    return response.ok({ success: true, assignments: assignmentsWithStats })
  }

  /**
   * Créer un devoir
   */
  public async createAssignment({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(createAssignmentValidator)
    const user = auth.getUserOrFail()
    const teacher = await Teacher.findByOrFail('user_id', user.id)

    // Vérification d'assignation via Query Builder
    const classSubject = await db
      .from('class_subject')
      .where('class_id', payload.classId)
      .where('subject_id', payload.subjectId)
      .where('teacher_id', teacher.id)
      .first()

    if (!classSubject) {
      return response.forbidden({
        success: false,
        message: "Vous n'êtes pas autorisé à créer un devoir pour ce groupe",
      })
    }

    const saveAsDraft = Boolean(request.input('saveAsDraft'))
    const shouldPublish =
      !saveAsDraft &&
      ['published', 'true', '1', 'on'].includes(String(request.input('status', 'published')))

    const assignment = await Assignment.create({
      teacherId: teacher.id,
      classId: payload.classId,
      subjectId: payload.subjectId,
      title: payload.title,
      description: payload.description,
      instructions: payload.instructions,
      dueDate: payload.dueDate,
      dueTime: payload.dueTime,
      maxPoints: payload.maxPoints || 20,
      term: payload.term || null,
      evaluationType: payload.evaluationType || 'devoir',
      attachmentUrl: payload.attachmentUrl,
      status: shouldPublish ? 'published' : 'draft',
      publishedAt: shouldPublish ? DateTime.now() : null,
    })

    return response.created({ success: true, assignment })
  }

  /**
   * Noter une soumission
   */
  public async gradeSubmission({ request, params, auth, response }: HttpContext) {
    const payload = await request.validateUsing(gradeSubmissionValidator)
    const user = auth.getUserOrFail()
    const teacher = await Teacher.findByOrFail('user_id', user.id)

    const submission = await AssignmentSubmission.query()
      .where('id', params.id)
      .preload('assignment')
      .firstOrFail()

    // Sécurité : vérifier que le devoir appartient bien à cet enseignant
    if (submission.assignment.teacherId !== teacher.id) {
      return response.forbidden({ message: 'Action non autorisée' })
    }

    submission.merge({
      grade: payload.grade.toString(),
      teacherFeedback: payload.teacherFeedback,
      status: 'graded',
    })
    await submission.save()

    // Notification
    const student = await db.from('students').where('id', submission.studentId).first()
    if (student) {
      await db.table('notifications').insert({
        user_id: student.user_id,
        type: 'assignment_graded',
        title: 'Devoir noté',
        content: `Votre devoir "${submission.assignment.title}" a été noté : ${payload.grade}/${submission.assignment.maxPoints}`,
        created_at: DateTime.now().toSQL(),
      })
    }

    return response.ok({ success: true, submission })
  }

  /**
   * Faire l'appel (Attendances)
   */
  public async markAttendance({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(markAttendanceValidator)
    const user = auth.getUserOrFail()
    const period = payload.period || 'morning'

    // Vérifier légitimité
    await this.authorizeAttendanceClass(user, payload.classId)

    const formattedDate = payload.date.toISODate()!

    await db.transaction(async (trx) => {
      // Nettoyer les doublons pour la même journée
      await trx
        .from('attendances')
        .where('class_id', payload.classId)
        .where('date', formattedDate)
        .where('period', period)
        .delete()

      // Insertion de masse
      const attendanceData = payload.students.map((s: any) => ({
        class_id: payload.classId,
        student_id: s.studentId,
        date: formattedDate,
        period,
        status: s.status,
        reason: s.reason,
        recorded_by: user.id,
        created_at: DateTime.now().toSQL(),
      }))

      await trx.table('attendances').insert(attendanceData)
    })

    return response.created({ success: true, message: 'Présences enregistrées' })
  }

  /**
   * Créer un sujet de forum
   */
  public async getClassStudentsForAttendance({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    await this.authorizeAttendanceClass(user, params.id)

    const students = await Student.query()
      .where('classId', params.id)
      .where('academicStatus', 'active')
      .preload('user')
      .orderBy('createdAt', 'asc')

    return response.ok({
      success: true,
      students: students.map((student) => ({
        id: student.id,
        registrationNumber: student.registrationNumber,
        name: student.user?.fullName || '-',
      })),
    })
  }

  public async getClassAttendance({ params, request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const date = request.input('date')
    const period = request.input('period') || 'morning'

    await this.authorizeAttendanceClass(user, params.id)

    const query = db.from('attendances').where('class_id', params.id)
    if (date) query.where('date', date)
    if (period) query.where('period', period)

    const attendances = await query

    return response.ok({
      success: true,
      attendances: attendances.map((attendance) => ({
        studentId: attendance.student_id,
        status: attendance.status,
        reason: attendance.reason || '',
      })),
    })
  }

  public async createForumTopic({ request, auth, response }: HttpContext) {
    // Utiliser un validateur approprié ici (ex: createForumTopicValidator)
    const user = auth.getUserOrFail()
    const body = request.all()

    const topic = await ForumTopic.create({
      subjectId: body.subjectId,
      classId: body.classId,
      createdBy: user.id,
      title: body.title,
      content: body.content,
      isPinned: false,
      isLocked: false,
    })

    return response.created({ success: true, topic })
  }
}
