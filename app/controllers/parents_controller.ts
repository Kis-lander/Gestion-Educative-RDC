import { type HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

// Imports des modèles via subpath alias
import Parent from '#models/parent'
// import Student from '#models/student'
import User from '#models/user'
import Message from '#models/message'
import Grade from '#models/grade'
import Discipline from '#models/discipline'

// Imports des validateurs VineJS
import { sendMessageToTeacherValidator, justifyAbsenceValidator } from '#validators/parent'

export default class ParentController {
  /**
   * Obtenir mes enfants avec statistiques
   */
  public async getChildren({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const parent = await Parent.findByOrFail('user_id', user.id)

    const children = await parent
      .related('children')
      .query()
      .preload('user')
      .preload('class')
      .preload('school')

    const childrenWithStats = await Promise.all(
      children.map(async (child) => {
        const averageGrade = await Grade.query()
          .where('student_id', child.id)
          .avg('score as average')

        const pendingPayments = await db
          .from('fee_payments')
          .where('student_id', child.id)
          .where('status', 'pending')
          .sum('amount_paid as total')

        const disciplineCount = await Discipline.query()
          .where('student_id', child.id)
          .whereBetween('incident_date', [
            DateTime.now().minus({ months: 3 }).toISODate()!,
            DateTime.now().toISODate()!,
          ])
          .count('* as total')

        return {
          ...child.toJSON(),
          stats: {
            averageGrade: Number(averageGrade[0].$extras.average || 0),
            pendingPayments: Number(pendingPayments[0].total || 0),
            recentDisciplineCount: Number(disciplineCount[0].$extras.total),
          },
        }
      })
    )

    return response.ok({
      success: true,
      children: childrenWithStats,
    })
  }

  /**
   * Obtenir les notes d'un enfant
   */
  public async getChildGrades({ params, auth, request, response }: HttpContext) {
    // Utilisation des inputs directs car le validateur VineJS n'est pas fourni pour getChildGrades dans votre snippet
    const term = request.input('term')
    const academicYear = request.input('academic_year')
    const subjectId = request.input('subject_id')

    const user = auth.getUserOrFail()
    const parent = await Parent.findByOrFail('user_id', user.id)

    // Vérifier l'association
    await parent.related('children').query().where('students.id', params.studentId).firstOrFail()

    const query = Grade.query()
      .where('student_id', params.studentId)
      .preload('subject')
      .preload('class')

    if (term) query.where('term', term)
    if (academicYear) query.where('academic_year', academicYear)
    if (subjectId) query.where('subject_id', subjectId)

    const grades = await query.orderBy('exam_date', 'desc')

    // Calcul des moyennes par matière
    const subjectsMap = new Map()
    for (const grade of grades) {
      if (grade.score === null || !Number.isFinite(grade.score)) continue

      const sId = grade.subjectId
      if (!subjectsMap.has(sId)) {
        subjectsMap.set(sId, {
          subject: grade.subject.name,
          coefficient: grade.subject.coefficient,
          grades: [],
          average: 0,
        })
      }
      subjectsMap.get(sId).grades.push(grade.score)
    }

    for (const data of subjectsMap.values()) {
      const sum = data.grades.reduce((a: number, b: number) => a + b, 0)
      data.average = sum / data.grades.length
    }

    return response.ok({
      success: true,
      grades,
      subjectsSummary: Array.from(subjectsMap.values()),
    })
  }

  /**
   * Envoyer un message à un enseignant
   */
  public async sendMessageToTeacher({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(sendMessageToTeacherValidator)
    const user = auth.getUserOrFail()

    // Vérifier l'existence du destinataire
    await User.query()
      .where('id', payload.teacherId)
      .where('role', 'teacher')
      .where('status', 'active')
      .firstOrFail()

    const message = new Message()
    message.senderId = user.id
    message.receiverId = payload.teacherId
    message.subject = payload.subject
    message.content = payload.content
    message.type = 'parent_teacher'

    if (payload.studentId) {
      const parent = await Parent.findByOrFail('user_id', user.id)
      const child = await parent
        .related('children')
        .query()
        .where('students.id', payload.studentId)
        .firstOrFail()

      message.schoolId = child.schoolId
    }

    await message.save()

    return response.created({
      success: true,
      message: 'Message envoyé avec succès',
      sentMessage: message,
    })
  }

  /**
   * Justifier une absence
   */
  public async justifyAbsence({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(justifyAbsenceValidator)
    const user = auth.getUserOrFail()
    const parent = await Parent.findByOrFail('user_id', user.id)

    const absence = await db.from('attendances').where('id', payload.absenceId).first()

    if (!absence) {
      return response.notFound({ success: false, message: 'Absence non trouvée' })
    }

    // Vérifier que l'enfant appartient bien au parent
    await parent.related('children').query().where('students.id', absence.student_id).firstOrFail()

    await db.from('attendances').where('id', payload.absenceId).update({
      status: 'excused',
      justification: payload.justification,
      justification_document: payload.documentUrl,
      justified_at: DateTime.now().toSQL(),
      justified_by: user.id,
    })

    return response.ok({ success: true, message: 'Absence justifiée avec succès' })
  }

  /**
   * Obtenir les paiements d'un enfant
   */
  public async getChildPayments({ params, response }: HttpContext) {
    const payments = await db
      .from('fee_payments')
      .where('student_id', params.studentId)
      .join('school_fees', 'fee_payments.fee_id', 'school_fees.id')
      .orderBy('payment_date', 'desc')
      .select(
        'fee_payments.*',
        'school_fees.fee_type',
        'school_fees.description as fee_description'
      )

    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount_paid, 0)

    const totalDueResult = await db
      .from('school_fees')
      .where('student_id', params.studentId)
      .sum('amount as total')
      .first()

    const totalDue = Number(totalDueResult?.total || 0)

    return response.ok({
      success: true,
      payments,
      summary: {
        totalPaid,
        totalDue,
        balance: totalDue - totalPaid,
      },
    })
  }
}
