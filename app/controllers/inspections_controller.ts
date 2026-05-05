import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import School from '#models/school'
import User from '#models/user'
import Message from '#models/message'
import { DateTime } from 'luxon'
import {
  getSchoolsValidator,
  inspectSchoolValidator,
  sendGlobalCommunicationValidator,
  generateSchoolReportValidator,
} from '#validators/inspection'

export default class InspectionController {
  /**
   * Obtenir la liste des écoles (avec filtres et pagination)
   */
  public async getAllSchools({ request, response }: HttpContext) {
    const payload = await request.validateUsing(getSchoolsValidator)

    const schools = await School.query()
      .if(payload.status, (query) => query.where('status', payload.status!))
      .if(payload.province, (query) => query.where('province', payload.province!))
      .if(payload.territory, (query) => query.where('territory', payload.territory!))
      .if(payload.startDate, (query) =>
        query.where('created_at', '>=', payload.startDate!.toJSDate())
      )
      .if(payload.endDate, (query) => query.where('created_at', '<=', payload.endDate!.toJSDate()))
      .preload('users', (userQuery) => {
        userQuery.where('role', 'director')
      })
      .orderBy('createdAt', 'desc')
      .paginate(payload.page || 1, payload.limit || 20)

    return response.ok({
      success: true,
      schools,
    })
  }

  /**
   * Obtenir les détails d'une école
   */
  public async getSchoolById({ params, response }: HttpContext) {
    const school = await School.query()
      .where('id', params.id)
      .preload('users')
      .preload('students')
      .preload('classes')
      .firstOrFail()

    // Statistiques complémentaires optimisées
    const teacherCount = await User.query()
      .where('school_id', params.id)
      .where('role', 'teacher')
      .count('* as total')
      .first()

    return response.ok({
      success: true,
      school,
      stats: {
        teachers: Number(teacherCount?.$extras.total || 0),
        totalStudents: school.students.length,
        activeClasses: school.classes.length,
      },
    })
  }

  /**
   * Approuver une école
   */
  public async approveSchool({ params, response, auth }: HttpContext) {
    const school = await School.findOrFail(params.id)

    school.status = 'active'
    school.approvedAt = DateTime.now()

    await db.transaction(async (trx) => {
      school.useTransaction(trx)
      await school.save()

      const director = await User.query()
        .useTransaction(trx)
        .where('school_id', school.id)
        .where('role', 'director')
        .first()

      if (director) {
        await Message.create(
          {
            senderId: auth.user!.id,
            receiverId: director.id,
            subject: 'Approbation de votre établissement',
            content: `Félicitations ! Votre établissement "${school.name}" a été approuvé.`,
            type: 'official',
          },
          { client: trx }
        )
      }
    })

    return response.ok({
      success: true,
      message: 'École approuvée avec succès',
      school,
    })
  }

  /**
   * Suspendre une école
   */
  public async suspendSchool({ params, request, response }: HttpContext) {
    const { reason } = request.only(['reason'])
    const school = await School.findOrFail(params.id)

    school.status = 'suspended'

    await db.transaction(async (trx) => {
      school.useTransaction(trx)
      await school.save()

      await trx.table('school_suspensions').insert({
        school_id: school.id,
        reason: reason || 'Non spécifiée',
        suspended_at: new Date(),
      })
    })

    return response.ok({
      success: true,
      message: 'École suspendue avec succès',
    })
  }

  /**
   * Inspecter une école
   */
  public async inspectSchool({ request, response }: HttpContext) {
    const payload = await request.validateUsing(inspectSchoolValidator)
    const school = await School.findOrFail(payload.schoolId)

    const [inspectionId] = await db.table('school_inspections').returning('id').insert({
      school_id: school.id,
      inspection_date: payload.inspectionDate.toJSDate(),
      inspector: payload.inspector,
      report: payload.report,
      rating: payload.rating,
      recommendations: payload.recommendations,
      follow_up_date: payload.followUpDate?.toJSDate(),
      created_at: new Date(),
    })

    return response.created({
      success: true,
      message: "Rapport d'inspection enregistré",
      inspectionId,
    })
  }

  /**
   * Envoyer communication globale (Optimisé avec insertion en masse)
   */
  public async sendGlobalCommunication({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(sendGlobalCommunicationValidator)

    const targetUsersQuery = User.query().where('status', 'active')

    if (payload.targetRole && payload.targetRole !== 'all') {
      targetUsersQuery.where('role', payload.targetRole)
    }

    if (payload.targetProvince) {
      targetUsersQuery.whereHas('school', (q) => q.where('province', payload.targetProvince!))
    }

    const users = await targetUsersQuery.select('id')

    // Utilisation de CreateMany pour éviter des centaines de requêtes individuelles
    const messagesData = users.map((user) => ({
      senderId: auth.user!.id,
      receiverId: user.id,
      subject: payload.subject,
      content: payload.content,
      type: 'official' as const,
      isGlobal: true,
    }))

    await Message.createMany(messagesData)

    return response.created({
      success: true,
      message: `Communication envoyée à ${users.length} destinataires`,
    })
  }

  /**
   * Générer rapport d'école
   */
  public async generateSchoolReport({ request, response }: HttpContext) {
    const payload = await request.validateUsing(generateSchoolReportValidator)
    const school = await School.findOrFail(payload.schoolId)

    const reportData: any = {
      school,
      period: { start: payload.startDate, end: payload.endDate },
    }

    // Exécution parallèle des sous-rapports
    const tasks: Promise<any>[] = []

    if (['academic', 'complete'].includes(payload.reportType)) {
      tasks.push(
        this.getAcademicReport(school.id, payload).then((res) => (reportData.academic = res))
      )
    }
    if (['financial', 'complete'].includes(payload.reportType)) {
      tasks.push(
        this.getFinancialReport(school.id, payload).then((res) => (reportData.financial = res))
      )
    }
    if (['disciplinary', 'complete'].includes(payload.reportType)) {
      tasks.push(
        this.getDisciplinaryReport(school.id, payload).then(
          (res) => (reportData.disciplinary = res)
        )
      )
    }

    await Promise.all(tasks)

    return response.ok({ success: true, report: reportData })
  }

  private async getAcademicReport(schoolId: string, params: any) {
    const [avgGrade, topStudents] = await Promise.all([
      db
        .from('grades')
        .join('students', 'grades.student_id', 'students.id')
        .where('students.school_id', schoolId)
        .whereBetween('grades.exam_date', [params.startDate.toJSDate(), params.endDate.toJSDate()])
        .avg('grades.score as average')
        .first(),
      db
        .from('grades')
        .join('students', 'grades.student_id', 'students.id')
        .where('students.school_id', schoolId)
        .select('students.*')
        .avg('grades.score as average')
        .groupBy('students.id')
        .orderBy('average', 'desc')
        .limit(10),
    ])

    return { averageGrade: Number(avgGrade?.average || 0), topStudents }
  }

  private async getFinancialReport(schoolId: string, params: any) {
    const payments = await db
      .from('fee_payments')
      .join('school_fees', 'fee_payments.fee_id', 'school_fees.id')
      .where('school_fees.school_id', schoolId)
      .whereBetween('fee_payments.payment_date', [
        params.startDate.toJSDate(),
        params.endDate.toJSDate(),
      ])
      .sum('fee_payments.amount_paid as total')
      .first()

    return { totalCollected: Number(payments?.total || 0) }
  }

  private async getDisciplinaryReport(schoolId: string, params: any) {
    const incidents = await db
      .from('disciplines')
      .join('students', 'disciplines.student_id', 'students.id')
      .where('students.school_id', schoolId)
      .whereBetween('disciplines.incident_date', [
        params.startDate.toJSDate(),
        params.endDate.toJSDate(),
      ])
      .count('* as total')
      .first()

    return { totalIncidents: Number(incidents?.total || 0) }
  }

  /**
   * Statistiques globales (v6 optimized)
   */
  public async getGlobalStats({ response }: HttpContext) {
    const [schools, students, teachers, users] = await Promise.all([
      School.query()
        .select(
          db.raw('count(*) as total'),
          db.raw("count(*) filter (where status = 'active') as active")
        )
        .first(),
      db.from('students').count('* as total').first(),
      User.query().where('role', 'teacher').count('* as total').first(),
      User.query().count('* as total').first(),
    ])

    return response.ok({
      success: true,
      stats: {
        schools: {
          total: Number(schools?.$extras.total || 0),
          active: Number(schools?.$extras.active || 0),
        },
        students: Number(students?.total || 0),
        teachers: Number(teachers?.$extras.total || 0),
        users: Number(users?.$extras.total || 0),
      },
    })
  }
}
