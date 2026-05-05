import { type HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

// Imports des modèles via subpath alias
import Teacher from '#models/teacher'
import Class from '#models/class'
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
      .preload('students', (studentQuery) => {
        studentQuery.where('academic_status', 'active')
      })

    if (academicYear) {
      query.where('academic_year', academicYear)
    }

    const classes = await query.orderBy('grade_level', 'asc')

    const classesWithStats = await Promise.all(
      classes.map(async (classObj) => {
        const studentsCount = await db
          .from('students')
          .where('class_id', classObj.id)
          .where('academic_status', 'active')
          .count('* as total')

        const averageGrade = await db
          .from('grades')
          .where('class_id', classObj.id)
          .if(term, (q) => q.where('term', term))
          .avg('score as average')

        return {
          ...classObj.toJSON(),
          studentsCount: Number(studentsCount[0].total),
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
    const teacher = await Teacher.findByOrFail('user_id', user.id)

    // Vérifier légitimité
    await Class.query().where('id', payload.classId).where('teacher_id', teacher.id).firstOrFail()

    const formattedDate = payload.date.toISODate()!

    await db.transaction(async (trx) => {
      // Nettoyer les doublons pour la même journée
      await trx
        .from('attendances')
        .where('class_id', payload.classId)
        .where('date', formattedDate)
        .delete()

      // Insertion de masse
      const attendanceData = payload.students.map((s: any) => ({
        class_id: payload.classId,
        student_id: s.studentId,
        date: formattedDate,
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
