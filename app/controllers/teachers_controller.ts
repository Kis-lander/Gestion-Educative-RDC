import { type HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import { edgePageContext } from '#start/view_context'

// Imports des modèles via subpath alias
import Teacher from '#models/teacher'
import Class from '#models/class'
import Student from '#models/student'
import Assignment from '#models/assignment'
import AssignmentSubmission from '#models/assignment_submission'
import ForumTopic from '#models/forum_topic'
// import ForumPost from '#models/forum_post'

// Imports des validateurs VineJS
import {
  createAssignmentValidator,
  gradeSubmissionValidator,
  markAttendanceValidator,
} from '#validators/teacher'

export default class TeacherController {
  private async getAttendanceClassesForUser(user: any) {
    const query = Class.query().orderBy('gradeLevel', 'asc').orderBy('name', 'asc')

    if (['director', 'discipline_director'].includes(user.role)) {
      return query.where('schoolId', user.schoolId)
    }

    const teacher = await Teacher.query().where('userId', user.id).first()
    return teacher ? query.where('teacherId', teacher.id) : []
  }

  private async authorizeAttendanceClass(user: any, classId: string) {
    if (['director', 'discipline_director'].includes(user.role)) {
      return Class.query().where('id', classId).where('schoolId', user.schoolId).firstOrFail()
    }

    const teacher = await Teacher.findByOrFail('user_id', user.id)
    return Class.query().where('id', classId).where('teacher_id', teacher.id).firstOrFail()
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
    const startDate =
      ctx.request.input('start_date') || DateTime.now().startOf('month').toISODate()
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
              name: [row.first_name, row.postnom, row.last_name].filter(Boolean).join(' '),
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
        const presentCount = classRows.filter((row) => row.status === 'present' || row.status === 'excused').length
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
    const totalPresent = allRows.filter((row) => row.status === 'present' || row.status === 'excused').length

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

    const query = Class.query()
      .where('teacher_id', teacher.id)

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
      attachmentUrl: payload.attachmentUrl,
      status: 'draft',
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
