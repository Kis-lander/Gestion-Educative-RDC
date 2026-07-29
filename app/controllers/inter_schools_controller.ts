import { type HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import School from '#models/school'
import { edgePageContext } from '#start/view_context'
import {
  searchSchoolsValidator,
  startExchangeValidator,
  shareBestPracticeValidator,
  createEventValidator,
  joinEventValidator,
} from '#validators/inter_school'

type Row = Record<string, any>

export default class InterSchoolController {
  private categoryLabels: Record<string, string> = {
    pedagogy: 'Pedagogie',
    technology: 'Technologie',
    management: 'Gestion',
    discipline: 'Discipline',
    sports: 'Sports',
    culture: 'Culture',
  }

  private eventTypeLabels: Record<string, string> = {
    seminar: 'Seminaire',
    workshop: 'Atelier',
    competition: 'Concours',
    sports: 'Sport',
    cultural: 'Culture',
  }

  private exchangeTypeLabels: Record<string, string> = {
    academic: 'Pedagogique',
    sports: 'Sportif',
    cultural: 'Culturel',
    general: 'General',
  }

  private async context(ctx: HttpContext, extra: Row = {}) {
    return { ...(await edgePageContext(ctx)), ...extra }
  }

  private schoolId(ctx: HttpContext) {
    return ctx.auth.user?.schoolId
  }

  private async safeRows<T = Row>(builder: Promise<T[]> | any, fallback: T[] = []) {
    try {
      return (await builder) as T[]
    } catch {
      return fallback
    }
  }

  private async safeRow<T = Row>(builder: Promise<T | null> | any, fallback: T | null = null) {
    try {
      return (await builder) as T | null
    } catch {
      return fallback
    }
  }

  private date(value: unknown, fallback?: DateTime) {
    if (!value) return fallback ?? DateTime.now()
    if (value instanceof Date) return DateTime.fromJSDate(value)
    const parsed = DateTime.fromISO(String(value))
    return parsed.isValid ? parsed : (fallback ?? DateTime.now())
  }

  private normalizeJson(value: unknown, fallback: any[] = []) {
    if (Array.isArray(value)) return value
    if (!value) return fallback
    try {
      return JSON.parse(String(value))
    } catch {
      return fallback
    }
  }

  private formatSchool(row: Row) {
    return {
      id: row.id,
      name: row.name || 'Ecole',
      code: row.code,
      province: row.province || '-',
      territory: row.territory || row.city || '-',
      address: row.address,
      phone: row.phone,
      email: row.email,
      type: row.type || row.school_type || 'public',
      studentsCount: Number(row.students_count ?? row.studentsCount ?? 0),
      teachersCount: Number(row.teachers_count ?? row.teachersCount ?? 0),
      classesCount: Number(row.classes_count ?? row.classesCount ?? 0),
      contactName: row.contact_name,
    }
  }

  private formatEvent(row: Row) {
    const start = this.date(row.start_date ?? row.startDate)
    const end = this.date(row.end_date ?? row.endDate, start)
    const now = DateTime.now()
    const status =
      row.status === 'cancelled'
        ? 'cancelled'
        : start > now
          ? 'upcoming'
          : end < now
            ? 'completed'
            : 'ongoing'

    return {
      id: row.id,
      title: row.title || 'Evenement inter-ecoles',
      description: row.description || '',
      type: row.event_type || row.type || 'seminar',
      typeLabel: this.eventTypeLabels[row.event_type || row.type] || 'Evenement',
      status,
      statusLabel: status === 'upcoming' ? 'A venir' : status === 'ongoing' ? 'En cours' : status === 'completed' ? 'Termine' : 'Annule',
      startDate: start.toISODate(),
      endDate: end.toISODate(),
      location: row.location || '-',
      organizerSchoolId: row.organizer_school_id ?? row.organizerSchoolId,
      organizerSchoolName: row.organizer_name || row.school_name || 'Ecole organisatrice',
      maxParticipants: row.max_participants ?? row.maxParticipants,
      participantsCount: Number(row.participants_count ?? row.participantsCount ?? 0),
      registrationDeadline: row.registration_deadline,
      participationFee: Number(row.participation_fee ?? row.participationFee ?? 0),
      additionalInfo: row.additional_info,
      canRegister: status === 'upcoming',
    }
  }

  private formatExchange(row: Row, schoolId?: string) {
    const fromMine = row.from_school_id === schoolId
    const partnerSchoolId = fromMine ? row.to_school_id : row.from_school_id
    const partnerSchoolName = fromMine
      ? row.to_school_name || row.partner_school_name || 'Ecole partenaire'
      : row.from_school_name || row.partner_school_name || 'Ecole partenaire'

    return {
      id: row.id,
      subject: row.subject || 'Echange inter-ecoles',
      message: row.message || row.description || '',
      type: row.exchange_type || row.type || 'general',
      typeLabel: this.exchangeTypeLabels[row.exchange_type || row.type] || 'General',
      status: row.status || 'pending',
      statusLabel: row.status === 'accepted' ? 'Accepte' : row.status === 'declined' ? 'Refuse' : row.status === 'completed' ? 'Termine' : 'En attente',
      partnerSchoolId,
      partnerSchoolName,
      proposedDate: row.proposed_date,
      participantsCount: Number(row.participants ?? row.participants_count ?? 0),
      messagesCount: Number(row.messages_count ?? 0),
      createdAt: this.date(row.created_at).toFormat('dd/MM/yyyy HH:mm'),
      canAccept: !fromMine && row.status === 'pending',
      canDecline: !fromMine && row.status === 'pending',
      canComplete: row.status === 'accepted',
    }
  }

  private formatPractice(row: Row) {
    return {
      id: row.id,
      schoolId: row.school_id,
      title: row.title || 'Bonne pratique',
      category: row.category || 'pedagogy',
      categoryLabel: this.categoryLabels[row.category] || 'Pedagogie',
      description: row.description || '',
      results: row.results || '',
      resources: this.normalizeJson(row.resources),
      tags: this.normalizeJson(row.tags),
      schoolName: row.school_name || 'Ecole',
      schoolProvince: row.province || '-',
      schoolType: row.school_type || row.type || '-',
      schoolStudentsCount: row.students_count,
      authorName: row.author_name || row.school_name || 'Ecole',
      createdAt: this.date(row.created_at).toFormat('dd/MM/yyyy'),
      likes: Number(row.likes ?? 0),
      views: Number(row.views ?? 0),
      rating: Number(row.rating ?? 0),
      commentsCount: Number(row.comments_count ?? 0),
    }
  }

  private async schoolsList(currentSchoolId?: string) {
    const rows = await this.safeRows(
      School.query()
        .where('status', 'active')
        .if(currentSchoolId, (query) => query.whereNot('id', currentSchoolId!))
        .select('id', 'name', 'province', 'territory', 'address', 'phone', 'email', 'code')
        .orderBy('name', 'asc')
        .limit(100)
    )

    return rows.map((school: any) => this.formatSchool(school.$attributes ?? school))
  }

  private async publicEvents() {
    const rows = await this.safeRows(
      db
        .from('inter_school_events')
        .leftJoin('schools', 'inter_school_events.organizer_school_id', 'schools.id')
        .select('inter_school_events.*', 'schools.name as organizer_name')
        .orderBy('inter_school_events.start_date', 'asc')
    )
    return rows.map((row) => this.formatEvent(row))
  }

  private async exchangesForSchool(schoolId?: string) {
    if (!schoolId) return []
    const rows = await this.safeRows(
      db
        .from('inter_school_exchanges')
        .leftJoin('schools as from_schools', 'inter_school_exchanges.from_school_id', 'from_schools.id')
        .leftJoin('schools as to_schools', 'inter_school_exchanges.to_school_id', 'to_schools.id')
        .where((query) => {
          query.where('from_school_id', schoolId).orWhere('to_school_id', schoolId)
        })
        .select(
          'inter_school_exchanges.*',
          'from_schools.name as from_school_name',
          'to_schools.name as to_school_name'
        )
        .orderBy('inter_school_exchanges.created_at', 'desc')
    )
    return rows.map((row) => this.formatExchange(row, schoolId))
  }

  private async publicPractices() {
    const rows = await this.safeRows(
      db
        .from('best_practices')
        .leftJoin('schools', 'best_practices.school_id', 'schools.id')
        .where('best_practices.is_public', true)
        .select('best_practices.*', 'schools.name as school_name', 'schools.province')
        .orderBy('best_practices.created_at', 'desc')
    )
    return rows.map((row) => this.formatPractice(row))
  }

  private csv(response: HttpContext['response'], filename: string, rows: Row[]) {
    const headers = Object.keys(rows[0] || { message: '' })
    const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`
    const body = [headers.join(','), ...rows.map((row) => headers.map((header) => escape(row[header])).join(','))].join('\n')

    response.header('content-type', 'text/csv; charset=utf-8')
    response.header('content-disposition', `attachment; filename="${filename}"`)
    return response.send(body)
  }

  public async searchPage(ctx: HttpContext) {
    return ctx.view.render(
      'inter-school/search/index',
      await this.context(ctx, { recentSearches: [] })
    )
  }

  public async searchResultsPage(ctx: HttpContext) {
    const currentSchoolId = this.schoolId(ctx)
    const q = String(ctx.request.input('q') || ctx.request.input('query') || '').trim()
    const province = ctx.request.input('province')
    const territory = ctx.request.input('territory')

    const query = School.query().where('status', 'active')
    if (currentSchoolId) query.whereNot('id', currentSchoolId)
    if (q) query.where('name', 'ILIKE', `%${q}%`)
    if (province) query.where('province', province)
    if (territory) query.where('territory', territory)

    const schools = (await this.safeRows(query.orderBy('name', 'asc').limit(100))).map((school: any) =>
      this.formatSchool(school.$attributes ?? school)
    )

    const results = {
      total: schools.length,
      schools,
      publicCount: schools.filter((school) => school.type === 'public').length,
      privateCount: schools.filter((school) => school.type === 'private').length,
      provincesCount: new Set(schools.map((school) => school.province)).size,
    }

    return ctx.view.render('inter-school/search/results', await this.context(ctx, { results }))
  }

  public async schoolPublicPage({ params, response }: HttpContext) {
    return response.redirect(`/api/inter-school/schools/${params.id}/info`)
  }

  public async contactSchool({ request, response }: HttpContext) {
    const schoolId = request.input('school_id')
    const subject = request.input('subject')
    const params = new URLSearchParams()
    if (schoolId) params.set('school_id', schoolId)
    if (subject) params.set('subject', subject)
    return response.redirect(`/communication/messages/compose?${params.toString()}`)
  }

  public async eventsPage(ctx: HttpContext) {
    const events = await this.publicEvents()
    const stats = {
      total: events.length,
      upcoming: events.filter((event) => event.status === 'upcoming').length,
      ongoing: events.filter((event) => event.status === 'ongoing').length,
      totalParticipants: events.reduce((sum, event) => sum + event.participantsCount, 0),
    }
    return ctx.view.render('inter-school/events/index', await this.context(ctx, { events, stats }))
  }

  public async eventCreatePage(ctx: HttpContext) {
    return ctx.view.render('inter-school/events/create', await this.context(ctx))
  }

  public async storeEventWeb(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(createEventValidator)
    const [event] = await db
      .table('inter_school_events')
      .insert({
        organizer_school_id: this.schoolId(ctx),
        title: payload.title,
        description: payload.description,
        event_type: payload.eventType,
        start_date: payload.startDate,
        end_date: payload.endDate,
        location: payload.location,
        max_participants: payload.maxParticipants,
        registration_deadline: payload.registrationDeadline,
        participation_fee: payload.participationFee,
        status: 'open',
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('*')

    return ctx.response.redirect(`/inter-school/events/${event.id}/show`)
  }

  public async myEventsPage(ctx: HttpContext) {
    const schoolId = this.schoolId(ctx)
    const allEvents = await this.publicEvents()
    const organizedEvents = allEvents.filter((event) => event.organizerSchoolId === schoolId)
    const participatingRows = await this.safeRows(
      db
        .from('event_participants')
        .leftJoin('inter_school_events', 'event_participants.event_id', 'inter_school_events.id')
        .leftJoin('schools', 'inter_school_events.organizer_school_id', 'schools.id')
        .where('event_participants.school_id', schoolId || '')
        .select(
          'event_participants.id as registration_id',
          'event_participants.status as registration_status',
          'inter_school_events.*',
          'schools.name as organizer_name'
        )
    )
    const participatingEvents = participatingRows.map((row) => ({
      ...this.formatEvent(row),
      registrationId: row.registration_id,
      registrationStatus: row.registration_status,
    }))
    const stats = {
      myEvents: organizedEvents.length,
      myParticipations: participatingEvents.length,
      upcoming: organizedEvents.filter((event) => event.status === 'upcoming').length,
      totalParticipants: organizedEvents.reduce((sum, event) => sum + event.participantsCount, 0),
    }

    return ctx.view.render(
      'inter-school/events/my-events',
      await this.context(ctx, { organizedEvents, participatingEvents, stats })
    )
  }

  public async eventShowPage(ctx: HttpContext) {
    const row = await this.safeRow(
      db
        .from('inter_school_events')
        .leftJoin('schools', 'inter_school_events.organizer_school_id', 'schools.id')
        .where('inter_school_events.id', ctx.params.id)
        .select('inter_school_events.*', 'schools.name as organizer_name')
        .first()
    )
    if (!row) return ctx.response.redirect('/inter-school/events')

    const participants = await this.safeRows(
      db
        .from('event_participants')
        .leftJoin('schools', 'event_participants.school_id', 'schools.id')
        .where('event_participants.event_id', ctx.params.id)
        .select('event_participants.*', 'schools.name as school_name')
    )

    return ctx.view.render(
      'inter-school/events/show',
      await this.context(ctx, {
        event: this.formatEvent(row),
        participants: participants.map((participant) => ({
          id: participant.id,
          schoolName: participant.school_name || 'Ecole',
          participantsCount: participant.participants_count || 1,
        })),
      })
    )
  }

  public async eventRegisterPage(ctx: HttpContext) {
    const row = await this.safeRow(db.from('inter_school_events').where('id', ctx.params.id).first())
    if (!row) return ctx.response.redirect('/inter-school/events')
    return ctx.view.render('inter-school/events/register', await this.context(ctx, { event: this.formatEvent(row) }))
  }

  public async registerEventWeb(ctx: HttpContext) {
    await db.table('event_participants').insert({
      event_id: ctx.params.id,
      school_id: this.schoolId(ctx),
      participants_count: Number(ctx.request.input('participantsCount') || 1),
      notes: ctx.request.input('notes'),
      status: 'registered',
      registered_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    })
    return ctx.response.redirect(`/inter-school/events/${ctx.params.id}/show`)
  }

  public async exchangesPage(ctx: HttpContext) {
    const exchanges = await this.exchangesForSchool(this.schoolId(ctx))
    const partners = exchanges.slice(0, 6).map((exchange) => ({
      id: exchange.partnerSchoolId,
      name: exchange.partnerSchoolName,
      exchangesCount: 1,
    }))
    const stats = {
      total: exchanges.length,
      active: exchanges.filter((exchange) => exchange.status === 'accepted').length,
      pending: exchanges.filter((exchange) => exchange.status === 'pending').length,
      partners: new Set(exchanges.map((exchange) => exchange.partnerSchoolId)).size,
    }
    return ctx.view.render(
      'inter-school/exchanges/index',
      await this.context(ctx, { exchanges, partners, stats })
    )
  }

  public async exchangeStartPage(ctx: HttpContext) {
    return ctx.view.render(
      'inter-school/exchanges/start',
      await this.context(ctx, { schools: await this.schoolsList(this.schoolId(ctx)) })
    )
  }

  public async storeExchangeWeb(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(startExchangeValidator)
    const [exchange] = await db
      .table('inter_school_exchanges')
      .insert({
        from_school_id: this.schoolId(ctx),
        to_school_id: payload.targetSchoolId,
        subject: payload.subject,
        message: payload.message,
        exchange_type: payload.exchangeType,
        proposed_date: payload.proposedDate,
        participants: payload.participants,
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('*')
    return ctx.response.redirect(`/inter-school/exchanges/${exchange.id}/show`)
  }

  public async exchangeShowPage(ctx: HttpContext) {
    const exchange = (await this.exchangesForSchool(this.schoolId(ctx))).find((item) => item.id === ctx.params.id)
    if (!exchange) return ctx.response.redirect('/inter-school/exchanges')
    const activities = [{ date: exchange.createdAt, label: 'Demande créée', description: exchange.subject }]
    return ctx.view.render('inter-school/exchanges/show', await this.context(ctx, { exchange, activities }))
  }

  public async exchangeMessagesPage(ctx: HttpContext) {
    const exchange = (await this.exchangesForSchool(this.schoolId(ctx))).find((item) => item.id === ctx.params.id)
    if (!exchange) return ctx.response.redirect('/inter-school/exchanges')
    return ctx.view.render('inter-school/exchanges/messages', await this.context(ctx, { exchange }))
  }

  public async bestPracticesPage(ctx: HttpContext) {
    const category = ctx.request.input('category')
    const practices = (await this.publicPractices()).filter((practice) => !category || practice.category === category)
    const stats = {
      total: practices.length,
      thisMonth: practices.filter((practice) => this.date(practice.createdAt).hasSame(DateTime.now(), 'month')).length,
      schools: new Set(practices.map((practice) => practice.schoolId)).size,
      popularCategory: practices[0]?.categoryLabel || '-',
    }
    return ctx.view.render(
      'inter-school/best-practices/index',
      await this.context(ctx, { practices, stats })
    )
  }

  public async bestPracticeCategoriesPage(ctx: HttpContext) {
    const practices = await this.publicPractices()
    const stats = {
      total: practices.length,
      pedagogy: practices.filter((practice) => practice.category === 'pedagogy').length,
      technology: practices.filter((practice) => practice.category === 'technology').length,
      management: practices.filter((practice) => practice.category === 'management').length,
      discipline: practices.filter((practice) => practice.category === 'discipline').length,
      sports: practices.filter((practice) => practice.category === 'sports').length,
      culture: practices.filter((practice) => practice.category === 'culture').length,
    }
    return ctx.view.render(
      'inter-school/best-practices/categories',
      await this.context(ctx, { stats, trends: [] })
    )
  }

  public async bestPracticeSharePage(ctx: HttpContext) {
    return ctx.view.render('inter-school/best-practices/share', await this.context(ctx))
  }

  public async storeBestPracticeWeb(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(shareBestPracticeValidator)
    const [practice] = await db
      .table('best_practices')
      .insert({
        school_id: this.schoolId(ctx),
        title: payload.title,
        category: payload.category,
        description: payload.description,
        results: payload.results,
        resources: JSON.stringify(payload.resources || []),
        tags: JSON.stringify(payload.tags || []),
        is_public: payload.isPublic ?? true,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('*')
    return ctx.response.redirect(`/inter-school/best-practices/${practice.id}/show`)
  }

  public async bestPracticeShowPage(ctx: HttpContext) {
    const row = await this.safeRow(
      db
        .from('best_practices')
        .leftJoin('schools', 'best_practices.school_id', 'schools.id')
        .where('best_practices.id', ctx.params.id)
        .select('best_practices.*', 'schools.name as school_name', 'schools.province')
        .first()
    )
    if (!row) return ctx.response.redirect('/inter-school/best-practices')

    const practice = this.formatPractice(row)
    const similarPractices = (await this.publicPractices())
      .filter((item) => item.id !== practice.id && item.category === practice.category)
      .slice(0, 3)
    const comments = await this.safeRows(
      db
        .from('best_practice_comments')
        .leftJoin('users', 'best_practice_comments.user_id', 'users.id')
        .where('best_practice_comments.practice_id', practice.id)
        .select('best_practice_comments.*', 'users.first_name', 'users.last_name')
        .orderBy('best_practice_comments.created_at', 'desc')
    )

    return ctx.view.render(
      'inter-school/best-practices/show',
      await this.context(ctx, {
        practice,
        similarPractices,
        comments: comments.map((comment) => ({
          id: comment.id,
          authorName: `${comment.first_name || ''} ${comment.last_name || ''}`.trim() || 'Utilisateur',
          content: comment.content,
          date: this.date(comment.created_at).toFormat('dd/MM/yyyy HH:mm'),
          likes: comment.likes || 0,
        })),
      })
    )
  }

  public async searchSchools({ request, response }: HttpContext) {
    const payload = await request.validateUsing(searchSchoolsValidator)
    const query = School.query().where('status', 'active')
    if (payload.query) query.where('name', 'ILIKE', `%${payload.query}%`)
    if (payload.province) query.where('province', payload.province)
    if (payload.territory) query.where('territory', payload.territory)
    const schools = await query.select('id', 'name', 'province', 'territory', 'code').paginate(payload.page || 1, payload.limit || 20)
    return response.ok({ success: true, schools })
  }

  public async getSchoolPublicInfo({ params, response }: HttpContext) {
    const school = await School.query()
      .where('id', params.id)
      .where('status', 'active')
      .select('id', 'name', 'province', 'territory', 'address', 'phone', 'email')
      .firstOrFail()
    return response.ok({ success: true, school: this.formatSchool(school.$attributes) })
  }

  public async saveSchool({ response }: HttpContext) {
    return response.ok({ success: true, message: 'École enregistrée dans vos favoris.' })
  }

  public async exportSearch(ctx: HttpContext) {
    const schools = await this.schoolsList(this.schoolId(ctx))
    return this.csv(ctx.response, 'recherche-ecoles.csv', schools)
  }

  public async startExchange({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(startExchangeValidator)
    const [exchange] = await db.table('inter_school_exchanges').insert({
      from_school_id: auth.user!.schoolId,
      to_school_id: payload.targetSchoolId,
      subject: payload.subject,
      message: payload.message,
      exchange_type: payload.exchangeType,
      proposed_date: payload.proposedDate,
      participants: payload.participants,
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date(),
    }).returning('*')
    return response.created({ success: true, message: "Demande d'échange envoyée avec succès.", exchange })
  }

  public async updateExchangeStatus({ params, request, response }: HttpContext) {
    const status = request.input('status')
    await db.from('inter_school_exchanges').where('id', params.id).update({ status, updated_at: new Date() })
    return response.ok({ success: true })
  }

  public async acceptExchange(ctx: HttpContext) {
    ctx.request.updateBody({ ...ctx.request.all(), status: 'accepted' })
    return this.updateExchangeStatus(ctx)
  }

  public async declineExchange(ctx: HttpContext) {
    ctx.request.updateBody({ ...ctx.request.all(), status: 'declined' })
    return this.updateExchangeStatus(ctx)
  }

  public async completeExchange(ctx: HttpContext) {
    ctx.request.updateBody({ ...ctx.request.all(), status: 'completed' })
    return this.updateExchangeStatus(ctx)
  }

  public async exchangeMessages({ params, auth, response }: HttpContext) {
    const rows = await this.safeRows(
      db
        .from('inter_school_exchange_messages')
        .leftJoin('users', 'inter_school_exchange_messages.sender_id', 'users.id')
        .leftJoin('schools', 'inter_school_exchange_messages.school_id', 'schools.id')
        .where('inter_school_exchange_messages.exchange_id', params.id)
        .select('inter_school_exchange_messages.*', 'users.first_name', 'users.last_name', 'schools.name as school_name')
        .orderBy('inter_school_exchange_messages.created_at', 'asc')
    )
    return response.ok({
      success: true,
      messages: rows.map((row) => ({
        id: row.id,
        content: row.content,
        senderName: `${row.first_name || ''} ${row.last_name || ''}`.trim() || 'Utilisateur',
        senderSchool: row.school_name || 'Ecole',
        isMine: row.sender_id === auth.user?.id,
        read: true,
        attachmentUrl: row.attachment_url,
        time: this.date(row.created_at).toFormat('dd/MM/yyyy HH:mm'),
      })),
    })
  }

  public async sendExchangeMessage({ params, request, auth, response }: HttpContext) {
    const content = request.input('content') || 'Message'
    const [message] = await db.table('inter_school_exchange_messages').insert({
      exchange_id: params.id,
      sender_id: auth.user?.id,
      school_id: auth.user?.schoolId,
      content,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning('*')
    return response.created({ success: true, message })
  }

  public async exportExchangeMessages(ctx: HttpContext) {
    return this.csv(ctx.response, 'messages-echange.csv', [{ echange: ctx.params.id, export: 'messages' }])
  }

  public async exportExchanges(ctx: HttpContext) {
    return this.csv(ctx.response, 'echanges-inter-ecoles.csv', await this.exchangesForSchool(this.schoolId(ctx)))
  }

  public async shareBestPractice({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(shareBestPracticeValidator)
    const [bestPractice] = await db.table('best_practices').insert({
      school_id: auth.user!.schoolId,
      title: payload.title,
      category: payload.category,
      description: payload.description,
      results: payload.results,
      resources: JSON.stringify(payload.resources || []),
      tags: JSON.stringify(payload.tags || []),
      is_public: payload.isPublic ?? true,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning('*')
    return response.created({ success: true, message: 'Pratique partagée avec succès.', bestPractice })
  }

  public async getBestPractices({ request, response }: HttpContext) {
    const practices = (await this.publicPractices()).filter(
      (practice) => !request.input('category') || practice.category === request.input('category')
    )
    return response.ok({ success: true, practices })
  }

  public async likeBestPractice({ params, response }: HttpContext) {
    await this.safeRow(db.from('best_practices').where('id', params.id).increment('likes', 1))
    return response.ok({ success: true })
  }

  public async commentBestPractice({ params, request, auth, response }: HttpContext) {
    const content = request.input('content')
    if (!content) return response.badRequest({ success: false, message: 'Le commentaire est requis.' })
    await db.table('best_practice_comments').insert({
      practice_id: params.id,
      user_id: auth.user?.id,
      content,
      created_at: new Date(),
      updated_at: new Date(),
    })
    return response.created({ success: true })
  }

  public async exportBestPractices(ctx: HttpContext) {
    return this.csv(ctx.response, 'meilleures-pratiques.csv', await this.publicPractices())
  }

  public async createEvent({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(createEventValidator)
    const [event] = await db.table('inter_school_events').insert({
      organizer_school_id: auth.user!.schoolId,
      title: payload.title,
      description: payload.description,
      event_type: payload.eventType,
      start_date: payload.startDate,
      end_date: payload.endDate,
      location: payload.location,
      max_participants: payload.maxParticipants,
      registration_deadline: payload.registrationDeadline,
      participation_fee: payload.participationFee,
      status: 'open',
      created_at: new Date(),
      updated_at: new Date(),
    }).returning('*')
    return response.created({ success: true, message: 'Événement créé avec succès.', event })
  }

  public async getEvents({ response }: HttpContext) {
    return response.ok({ success: true, events: await this.publicEvents() })
  }

  public async calendarEvents({ request, response }: HttpContext) {
    const year = Number(request.input('year') || DateTime.now().year)
    const month = Number(request.input('month') || DateTime.now().month)
    const events = (await this.publicEvents()).filter((event) => {
      const date = this.date(event.startDate)
      return date.year === year && date.month === month
    })
    return response.ok({ success: true, events })
  }

  public async exportEvents(ctx: HttpContext) {
    return this.csv(ctx.response, 'evenements-inter-ecoles.csv', await this.publicEvents())
  }

  public async cancelEvent({ params, response }: HttpContext) {
    await db.from('inter_school_events').where('id', params.id).update({ status: 'cancelled', updated_at: new Date() })
    return response.ok({ success: true })
  }

  public async cancelRegistration({ params, response }: HttpContext) {
    await db.from('event_participants').where('id', params.id).update({ status: 'cancelled', updated_at: new Date() })
    return response.ok({ success: true })
  }

  public async joinEvent({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(joinEventValidator)
    const [registration] = await db.table('event_participants').insert({
      event_id: payload.eventId,
      school_id: auth.user!.schoolId,
      participants_count: payload.participantsCount,
      notes: payload.notes,
      status: 'registered',
      registered_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    }).returning('*')
    return response.created({ success: true, message: 'Participation enregistrée avec succès.', registration })
  }
}
