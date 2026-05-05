import { type HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import School from '#models/school'
import {
  searchSchoolsValidator,
  startExchangeValidator,
  shareBestPracticeValidator,
  createEventValidator,
  joinEventValidator,
} from '#validators/inter_school' // Assurez-vous que ces validateurs sont exportés individuellement

export default class InterSchoolController {
  /**
   * Rechercher des écoles
   */
  public async searchSchools({ request, response }: HttpContext) {
    const payload = await request.validateUsing(searchSchoolsValidator)

    const query = School.query().where('status', 'active')

    if (payload.query) {
      query.where('name', 'ILIKE', `%${payload.query}%`)
    }
    if (payload.province) {
      query.where('province', payload.province)
    }
    if (payload.territory) {
      query.where('territory', payload.territory)
    }

    const page = payload.page || 1
    const limit = payload.limit || 20

    const schools = await query
      .select('id', 'name', 'province', 'territory', 'code')
      .paginate(page, limit)

    return response.ok({
      success: true,
      schools,
    })
  }

  /**
   * Obtenir les informations publiques d'une école
   */
  public async getSchoolPublicInfo({ params, response }: HttpContext) {
    const school = await School.query()
      .where('id', params.id)
      .where('status', 'active')
      .select('id', 'name', 'province', 'territory', 'address', 'phone', 'email')
      .firstOrFail()

    return response.ok({
      success: true,
      school,
    })
  }

  /**
   * Démarrer un échange inter-écoles
   */
  public async startExchange({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(startExchangeValidator)

    // Note: Utilisation de db.table() pour les tables sans modèle spécifique
    const [exchange] = await db
      .table('inter_school_exchanges')
      .insert({
        from_school_id: auth.user!.schoolId,
        to_school_id: payload.targetSchoolId,
        subject: payload.subject,
        message: payload.message,
        exchange_type: payload.exchangeType,
        proposed_date: payload.proposedDate,
        participants: JSON.stringify(payload.participants),
        status: 'pending',
        // Lucid gère created_at via insert si configuré, sinon :
        created_at: new Date(),
      })
      .returning('*')

    return response.created({
      success: true,
      message: "Demande d'échange envoyée avec succès",
      exchange,
    })
  }

  /**
   * Partager une meilleure pratique
   */
  public async shareBestPractice({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(shareBestPracticeValidator)

    const [bestPractice] = await db
      .table('best_practices')
      .insert({
        school_id: auth.user!.schoolId,
        title: payload.title,
        category: payload.category,
        description: payload.description,
        results: payload.results,
        resources: JSON.stringify(payload.resources || []),
        tags: JSON.stringify(payload.tags || []),
        is_public: payload.isPublic ?? true,
        created_at: new Date(),
      })
      .returning('*')

    return response.created({
      success: true,
      message: 'Pratique partagée avec succès',
      bestPractice,
    })
  }

  /**
   * Obtenir les meilleures pratiques
   */
  public async getBestPractices({ request, response }: HttpContext) {
    const query = db
      .from('best_practices')
      .join('schools', 'best_practices.school_id', 'schools.id')
      .where('best_practices.is_public', true)
      .select('best_practices.*', 'schools.name as school_name', 'schools.province')

    const category = request.input('category')
    if (category) {
      query.where('best_practices.category', category)
    }

    const practices = await query.orderBy('best_practices.created_at', 'desc').limit(50)

    return response.ok({
      success: true,
      practices,
    })
  }

  /**
   * Créer un événement inter-écoles
   */
  public async createEvent({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(createEventValidator)

    const [event] = await db
      .table('inter_school_events')
      .insert({
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
      })
      .returning('*')

    return response.created({
      success: true,
      message: 'Événement créé avec succès',
      event,
    })
  }

  /**
   * Obtenir les événements
   */
  public async getEvents({ response }: HttpContext) {
    const events = await db
      .from('inter_school_events')
      .join('schools', 'inter_school_events.organizer_school_id', 'schools.id')
      .where('inter_school_events.status', 'open')
      .where('inter_school_events.start_date', '>=', new Date())
      .select('inter_school_events.*', 'schools.name as organizer_name')
      .orderBy('inter_school_events.start_date', 'asc')

    return response.ok({
      success: true,
      events,
    })
  }

  /**
   * Participer à un événement
   */
  public async joinEvent({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(joinEventValidator)

    // Vérifier la disponibilité
    const event = await db.from('inter_school_events').where('id', payload.eventId).first()

    if (!event) {
      return response.notFound({
        success: false,
        message: 'Événement non trouvé',
      })
    }

    const [registration] = await db
      .table('event_participants')
      .insert({
        event_id: payload.eventId,
        school_id: auth.user!.schoolId,
        participants_count: payload.participantsCount,
        notes: payload.notes,
        status: 'registered',
        registered_at: new Date(),
      })
      .returning('*')

    return response.created({
      success: true,
      message: 'Participation enregistrée avec succès',
      registration,
    })
  }
}
