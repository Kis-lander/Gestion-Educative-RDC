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
import { edgePageContext } from '#start/view_context'

export default class DisciplineController {
  private async renderWithContext(ctx: HttpContext, template: string, data: Record<string, any>) {
    return ctx.view.render(template, {
      ...(await edgePageContext(ctx)),
      ...data,
    })
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

  private getTypeLabel(type: string) {
    const labels: Record<string, string> = {
      absence: 'Absence',
      late: 'Retard',
      misconduct: 'Inconduite',
      violence: 'Violence',
      fraud: 'Fraude',
      uniform_violation: 'Tenue non conforme',
      other: 'Autre',
    }

    return labels[type] || type
  }

  private getSeverityLabel(severity: string) {
    const labels: Record<string, string> = {
      minor: 'Mineure',
      moderate: 'Modérée',
      major: 'Majeure',
      critical: 'Critique',
    }

    return labels[severity] || severity
  }

  private getSanctionLabel(sanction: string | null) {
    const labels: Record<string, string> = {
      warning: 'Avertissement',
      community_service: "Travail d'intérêt général",
      suspension: 'Suspension',
      expulsion: 'Exclusion',
      none: 'Aucune',
    }

    return sanction ? labels[sanction] || sanction : '-'
  }

  private serializeIncident(incident: Discipline) {
    const status = incident.sanction && incident.sanction !== 'none' ? 'resolved' : 'pending'

    return {
      id: incident.id,
      studentId: incident.studentId,
      studentName: incident.student?.user?.fullName || '-',
      registrationNumber: incident.student?.registrationNumber || '-',
      className: incident.student?.class?.name || 'Non affecté',
      type: incident.incidentType,
      typeLabel: this.getTypeLabel(incident.incidentType),
      severity: incident.severity,
      severityLabel: this.getSeverityLabel(incident.severity),
      status,
      sanction: incident.sanction === 'none' ? null : this.getSanctionLabel(incident.sanction),
      sanctionLabel: this.getSanctionLabel(incident.sanction),
      description: incident.description,
      actionTaken: incident.actionTaken,
      date: incident.incidentDate,
      createdAt: incident.createdAt,
      updatedAt: incident.updatedAt,
      reporterName: incident.reporter?.fullName || '-',
      parentNotified: incident.parentNotified,
      parentNotifiedAt: incident.parentNotifiedAt,
      parentResponse: incident.parentResponse,
      pastIncidentsCount: 0,
      location: null,
      witnesses: null,
    }
  }

  public async dashboardPage(ctx: HttpContext) {
    const { auth } = ctx
    const user = auth.getUserOrFail()
    const incidents = await Discipline.query()
      .whereHas('student', (studentQuery) => studentQuery.where('schoolId', user.schoolId))
      .preload('student', (studentQuery) => {
        studentQuery.preload('user')
        studentQuery.preload('class')
      })
      .preload('reporter')
      .orderBy('incidentDate', 'desc')
      .limit(5)
    const totalIncidents = await Discipline.query()
      .whereHas('student', (studentQuery) => studentQuery.where('schoolId', user.schoolId))
      .count('* as total')
      .first()
    const majorIncidents = await Discipline.query()
      .whereHas('student', (studentQuery) => studentQuery.where('schoolId', user.schoolId))
      .whereIn('severity', ['major', 'critical'])
      .count('* as total')
      .first()

    return this.renderWithContext(ctx, 'discipline/dashboard', {
      school: { id: user.schoolId, name: 'Gestion Éducative RDC' },
      stats: {
        totalIncidents: Number(totalIncidents?.$extras.total || 0),
        majorIncidents: Number(majorIncidents?.$extras.total || 0),
        affectedStudents: 0,
        activeSanctions: 0,
        activeSuspensions: 0,
        pendingIncidents: 0,
      },
      topStudents: [],
      recentIncidents: incidents.map((incident) => ({
        id: incident.id,
        studentId: incident.studentId,
        studentName: incident.student?.user?.fullName || '-',
        type: incident.incidentType,
        typeLabel: incident.incidentType,
        severity: incident.severity,
        severityLabel: incident.severity,
        description: incident.description,
        date: incident.incidentDate,
        reporterName: incident.reporter?.fullName || '-',
      })),
    })
  }

  public async incidentsPage(ctx: HttpContext) {
    const { auth, request } = ctx
    const user = auth.getUserOrFail()
    const page = Number(request.input('page', 1))
    const type = request.input('type')
    const severity = request.input('severity')
    const startDate = request.input('start_date')
    const endDate = request.input('end_date')

    const query = Discipline.query()
      .whereHas('student', (studentQuery) => studentQuery.where('schoolId', user.schoolId))
      .preload('student', (studentQuery) => {
        studentQuery.preload('user')
        studentQuery.preload('class')
      })
      .preload('reporter')
      .if(type, (incidentQuery) => incidentQuery.where('incidentType', type))
      .if(severity, (incidentQuery) => incidentQuery.where('severity', severity))
      .if(startDate && endDate, (incidentQuery) => {
        incidentQuery.whereBetween('incidentDate', [startDate, endDate])
      })
      .orderBy('incidentDate', 'desc')

    const paginator = await query.paginate(page, 20)
    const total = await Discipline.query()
      .whereHas('student', (studentQuery) => studentQuery.where('schoolId', user.schoolId))
      .count('* as total')
      .first()
    const weekStart = DateTime.now().startOf('week').toSQLDate()
    const thisWeek = await Discipline.query()
      .whereHas('student', (studentQuery) => studentQuery.where('schoolId', user.schoolId))
      .where('incidentDate', '>=', weekStart!)
      .count('* as total')
      .first()

    return this.renderWithContext(ctx, 'discipline/incidents/index', {
      school: { id: user.schoolId, name: 'Gestion Éducative RDC' },
      incidents: paginator.all().map((incident) => this.serializeIncident(incident)),
      stats: {
        total: Number(total?.$extras.total || 0),
        thisWeek: Number(thisWeek?.$extras.total || 0),
        pending: 0,
        resolved: 0,
      },
      pagination: this.getPaginationMeta(paginator),
      url: '/discipline/incidents',
    })
  }

  public async reportIncidentPage(ctx: HttpContext) {
    const { auth, request } = ctx
    const user = auth.getUserOrFail()
    const selectedStudentId = request.input('student_id', '')
    const students = await Student.query()
      .where('schoolId', user.schoolId)
      .where('academicStatus', 'active')
      .preload('user')
      .preload('class')
      .orderBy('createdAt', 'desc')

    return this.renderWithContext(ctx, 'discipline/incidents/report', {
      school: { id: user.schoolId, name: 'Gestion Éducative RDC' },
      students: students.map((student) => ({
        id: student.id,
        name: student.user?.fullName || student.registrationNumber,
        className: student.class?.name || 'Non affecté',
        registrationNumber: student.registrationNumber,
      })),
      selectedStudentId,
      studentIncidentCount: 0,
    })
  }

  public async storeIncidentWeb({ auth, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const student = await Student.query()
      .where('id', request.input('studentId'))
      .where('schoolId', user.schoolId)
      .firstOrFail()

    await Discipline.create({
      studentId: student.id,
      reportedBy: user.id,
      incidentType: request.input('incidentType'),
      description: request.input('description'),
      severity: request.input('severity'),
      incidentDate: DateTime.fromISO(request.input('incidentDate')),
      actionTaken: request.input('actionTaken') || null,
      parentNotified: Boolean(request.input('parentNotified')),
      sanction: 'none',
    })

    session.flash('success', 'Incident enregistré avec succès.')
    return response.redirect('/discipline/incidents')
  }

  public async showIncidentPage(ctx: HttpContext) {
    const { auth, params } = ctx
    const user = auth.getUserOrFail()
    const incident = await Discipline.query()
      .where('id', params.id)
      .whereHas('student', (studentQuery) => studentQuery.where('schoolId', user.schoolId))
      .preload('student', (studentQuery) => {
        studentQuery.preload('user')
        studentQuery.preload('class')
      })
      .preload('reporter')
      .firstOrFail()

    return this.renderWithContext(ctx, 'discipline/incidents/show', {
      school: { id: user.schoolId, name: 'Gestion Éducative RDC' },
      incident: this.serializeIncident(incident),
      previousIncidents: [],
    })
  }

  public async editIncidentPage(ctx: HttpContext) {
    const { auth, params } = ctx
    const user = auth.getUserOrFail()
    const incident = await Discipline.query()
      .where('id', params.id)
      .whereHas('student', (studentQuery) => studentQuery.where('schoolId', user.schoolId))
      .preload('student', (studentQuery) => {
        studentQuery.preload('user')
        studentQuery.preload('class')
      })
      .preload('reporter')
      .firstOrFail()

    return this.renderWithContext(ctx, 'discipline/incidents/edit', {
      school: { id: user.schoolId, name: 'Gestion Éducative RDC' },
      incident: this.serializeIncident(incident),
    })
  }

  public async updateIncidentWeb({ auth, params, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const incident = await Discipline.query()
      .where('id', params.id)
      .whereHas('student', (studentQuery) => studentQuery.where('schoolId', user.schoolId))
      .firstOrFail()

    incident.merge({
      incidentType: request.input('incidentType', incident.incidentType),
      description: request.input('description', incident.description),
      severity: request.input('severity', incident.severity),
      incidentDate: request.input('incidentDate')
        ? DateTime.fromISO(request.input('incidentDate'))
        : incident.incidentDate,
      actionTaken: request.input('actionTaken') || null,
      parentNotified: Boolean(request.input('parentNotified')),
    })
    await incident.save()

    session.flash('success', 'Incident mis à jour.')
    return response.redirect(`/discipline/incidents/${incident.id}/show`)
  }

  public async applySanctionPage(ctx: HttpContext) {
    const { auth, request } = ctx
    const user = auth.getUserOrFail()
    const incident = await Discipline.query()
      .where('id', request.input('incident_id'))
      .whereHas('student', (studentQuery) => studentQuery.where('schoolId', user.schoolId))
      .preload('student', (studentQuery) => {
        studentQuery.preload('user')
        studentQuery.preload('class')
      })
      .preload('reporter')
      .firstOrFail()

    return this.renderWithContext(ctx, 'discipline/sanctions/apply', {
      school: { id: user.schoolId, name: 'Gestion Éducative RDC' },
      incident: this.serializeIncident(incident),
      previousSanctions: [],
      selectedSanctionType: incident.sanction === 'none' ? 'warning' : incident.sanction,
    })
  }

  public async applySanctionWeb({ auth, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const incident = await Discipline.query()
      .where('id', request.input('incidentId'))
      .whereHas('student', (studentQuery) => studentQuery.where('schoolId', user.schoolId))
      .firstOrFail()

    incident.sanction = request.input('sanctionType', 'warning')
    incident.actionTaken = [incident.actionTaken, request.input('details')].filter(Boolean).join('\n')
    await incident.save()

    session.flash('success', 'Sanction appliquée.')
    return response.redirect(`/discipline/incidents/${incident.id}/show`)
  }

  public async studentsPage(ctx: HttpContext) {
    const { auth, request } = ctx
    const user = auth.getUserOrFail()
    const page = Number(request.input('page', 1))
    const classId = request.input('class_id')
    const search = String(request.input('search', '')).trim()
    const query = Student.query()
      .where('schoolId', user.schoolId)
      .preload('user')
      .preload('class')
      .if(classId, (studentQuery) => studentQuery.where('classId', classId))
      .if(search, (studentQuery) => {
        studentQuery.whereHas('user', (userQuery) => {
          userQuery
            .whereILike('firstName', `%${search}%`)
            .orWhereILike('postnom', `%${search}%`)
            .orWhereILike('lastName', `%${search}%`)
        })
      })
      .orderBy('createdAt', 'desc')
    const paginator = await query.paginate(page, 20)
    const classes = await db
      .from('classes')
      .where('school_id', user.schoolId)
      .whereNull('archived_at')
      .select('id', 'name')
      .orderBy('name', 'asc')

    return this.renderWithContext(ctx, 'discipline/students/index', {
      school: { id: user.schoolId, name: 'Gestion Éducative RDC' },
      classes,
      students: paginator.all().map((student) => ({
        id: student.id,
        registrationNumber: student.registrationNumber,
        name: student.user?.fullName || '-',
        className: student.class?.name || 'Non affecté',
        incidentCount: 0,
        status: 'exemplary',
        lastIncidentDate: null,
      })),
      stats: {
        total: paginator.total,
        withIncidents: 0,
        activeSanctions: 0,
        exemplary: paginator.total,
      },
      pagination: this.getPaginationMeta(paginator),
      url: '/discipline/students',
    })
  }

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
        subject: `Notification disciplinaire - ${student.user.fullName}`,
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
