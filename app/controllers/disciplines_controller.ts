import { type HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Discipline from '#models/discipline'
import Student from '#models/student'
import Message from '#models/message'
import {
  reportIncidentValidator,
  applySanctionValidator,
  // updateIncidentValidator,
  notifyParentValidator,
} from '#validators/discipline'
import { DateTime } from 'luxon'

export default class DisciplineController {
  /**
   * Obtenir tous les élèves avec statistiques
   */
  public async getStudents({ request, response }: HttpContext) {
    const classId = request.input('class_id')
    const search = request.input('search')

    const query = Student.query()
      .where('academic_status', 'active')
      .preload('user')
      .preload('class')

    if (classId) {
      query.where('class_id', classId)
    }

    if (search) {
      query.whereHas('user', (userQuery) => {
        userQuery
          .where('first_name', 'ILIKE', `%${search}%`)
          .orWhere('last_name', 'ILIKE', `%${search}%`)
      })
    }

    const students = await query.orderBy('created_at', 'desc')

    // Optimisation : Charger les stats disciplinaires des 3 derniers mois
    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        const incidents = await Discipline.query()
          .where('student_id', student.id)
          .where('incident_date', '>=', DateTime.now().minus({ months: 3 }).toSQLDate()!)

        const majorIncidents = incidents.filter(
          (i) => i.severity === 'major' || i.severity === 'critical'
        ).length

        return {
          ...student.toJSON(),
          disciplineStats: {
            totalIncidents: incidents.length,
            majorIncidents: majorIncidents,
            lastIncident: incidents[0]?.incidentDate,
          },
        }
      })
    )

    return response.ok({
      success: true,
      students: studentsWithStats,
    })
  }

  /**
   * Détails d'un élève et ses incidents
   */
  public async getStudentDetails({ params, response }: HttpContext) {
    const student = await Student.query()
      .where('id', params.id)
      .preload('user')
      .preload('class')
      .preload('school')
      .firstOrFail()

    const incidents = await Discipline.query()
      .where('student_id', student.id)
      .preload('reporter')
      .orderBy('incident_date', 'desc')

    const summary = {
      total: incidents.length,
      byType: {} as Record<string, number>,
      bySeverity: {
        minor: incidents.filter((i) => i.severity === 'minor').length,
        moderate: incidents.filter((i) => i.severity === 'moderate').length,
        major: incidents.filter((i) => i.severity === 'major').length,
        critical: incidents.filter((i) => i.severity === 'critical').length,
      },
      monthlyTrend: await this.getMonthlyTrend(student.id),
    }

    for (const incident of incidents) {
      summary.byType[incident.incidentType] = (summary.byType[incident.incidentType] || 0) + 1
    }

    return response.ok({
      success: true,
      student,
      incidents,
      summary,
    })
  }

  private async getMonthlyTrend(studentId: string) {
    return await db
      .from('disciplines')
      .where('student_id', studentId)
      .select(db.raw("DATE_TRUNC('month', incident_date) as month"))
      .count('* as total')
      .groupBy('month')
      .orderBy('month', 'desc')
      .limit(6)
  }

  /**
   * Signaler un incident (Utilise reportIncidentValidator)
   */
  public async reportIncident({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(reportIncidentValidator)
    const user = auth.user!

    const discipline = await Discipline.create({
      studentId: payload.studentId,
      reportedBy: user.id,
      incidentType: payload.incidentType,
      description: payload.description,
      severity: payload.severity,
      incidentDate: payload.incidentDate,
      actionTaken: payload.actionTaken,
      parentNotified: payload.parentNotified || false,
      sanction: 'none',
    })

    if (payload.parentNotified) {
      // Logique de notification simplifiée intégrée ou appel interne
    }

    return response.created({
      success: true,
      message: 'Incident signalé avec succès',
      discipline,
    })
  }

  /**
   * Appliquer une sanction (Utilise applySanctionValidator)
   */
  public async applySanction({ request, response }: HttpContext) {
    const payload = await request.validateUsing(applySanctionValidator)

    const discipline = await Discipline.findOrFail(payload.incidentId)
    discipline.sanction = payload.sanction

    if (payload.details) {
      discipline.actionTaken = `${discipline.actionTaken || ''}\nSanction: ${payload.details}`
    }

    await discipline.save()

    if (payload.sanction === 'suspension') {
      const student = await Student.find(discipline.studentId)
      if (student) {
        student.academicStatus = 'suspended'
        await student.save()
      }
    }

    return response.ok({ success: true, discipline })
  }

  /**
   * Notifier les parents (Utilise notifyParentValidator)
   */
  public async notifyParent({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(notifyParentValidator)
    const user = auth.user!

    const discipline = await Discipline.findOrFail(payload.incidentId)
    const student = await Student.query()
      .where('id', discipline.studentId)
      .preload('user')
      .firstOrFail()

    const parents = await db
      .from('parent_student')
      .where('student_id', student.id)
      .join('parents', 'parent_student.parent_id', 'parents.id')
      .join('users', 'parents.user_id', 'users.id')
      .select('users.id as userId')

    for (const p of parents) {
      await Message.create({
        senderId: user.id,
        receiverId: p.userId,
        subject: `Notification disciplinaire - ${student.user.firstName} ${student.user.lastName}`,
        content: payload.message,
        type: 'official',
        schoolId: student.schoolId,
      })
    }

    discipline.parentNotified = true
    discipline.parentNotifiedAt = DateTime.now()
    await discipline.save()

    return response.ok({
      success: true,
      message: `${parents.length} parent(s) notifié(s)`,
    })
  }

  /**
   * Supprimer un incident
   */
  public async deleteIncident({ params, response }: HttpContext) {
    const discipline = await Discipline.findOrFail(params.id)
    await discipline.delete()
    return response.ok({ success: true, message: 'Incident supprimé' })
  }
}
