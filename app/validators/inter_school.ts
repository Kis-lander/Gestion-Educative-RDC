import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * Messages d'erreur personnalisés en français
 */
const interSchoolMessages = {
  'targetSchoolId.exists': "L'école cible spécifiée n'existe pas",
  'subject.required': "Le sujet de l'échange est requis",
  'message.required': 'Le message est requis',
  'title.required': 'Le titre est requis',
  'description.required': 'La description est requise',
  'startDate.required': 'La date de début est requise',
  'endDate.required': 'La date de fin est requise',
  'endDate.afterField': 'La date de fin doit être après la date de début',
  'eventId.exists': "L'événement spécifié n'existe pas",
  'participantsCount.range': 'Le nombre de participants doit être compris entre 1 et 100',
}

/**
 * Validateur pour la recherche d'écoles partenaires
 */
export const searchSchoolsValidator = vine.create(
  vine.object({
    query: vine.string().trim().optional(),
    province: vine.string().trim().optional(),
    territory: vine.string().trim().optional(),
    level: vine.string().trim().optional(),
    page: vine.number().range([1, 100]).optional(),
    limit: vine.number().range([1, 50]).optional(),
  })
)

/**
 * Validateur pour initier un échange entre écoles
 */
export const startExchangeValidator = vine.create(
  vine.object({
    targetSchoolId: vine.string().exists({ table: 'schools', column: 'id' }),
    subject: vine.string().trim().maxLength(255),
    message: vine.string().trim(),
    exchangeType: vine.enum(['academic', 'sports', 'cultural', 'general']),
    proposedDate: vine.date({ formats: ['YYYY-MM-DD'] }).optional(),
    participants: vine.number().range([1, 100]).optional(),
  })
)

/**
 * Validateur pour partager une bonne pratique
 */
export const shareBestPracticeValidator = vine.create(
  vine.object({
    title: vine.string().trim().maxLength(255),
    category: vine.string().trim(),
    description: vine.string().trim(),
    results: vine.string().trim().optional(),
    resources: vine
      .array(
        vine.object({
          type: vine.string(),
          url: vine.string(),
          description: vine.string().optional(),
        })
      )
      .optional(),
    tags: vine.array(vine.string()).optional(),
    isPublic: vine.boolean().optional(),
  })
)

/**
 * Validateur pour créer un événement inter-écoles
 */
export const createEventValidator = vine.create(
  vine.object({
    title: vine.string().trim().maxLength(255),
    description: vine.string().trim(),
    eventType: vine.enum(['seminar', 'workshop', 'competition', 'sports', 'cultural']),
    startDate: vine.date({ formats: ['YYYY-MM-DD'] }),
    endDate: vine.date({ formats: ['YYYY-MM-DD'] }).afterField('startDate'),
    location: vine.string().trim(),
    maxParticipants: vine.number().range([1, 1000]).optional(),
    registrationDeadline: vine.date({ formats: ['YYYY-MM-DD'] }),
    participationFee: vine.number().min(0).optional(),
  })
)

/**
 * Validateur pour rejoindre un événement
 */
export const joinEventValidator = vine.create(
  vine.object({
    eventId: vine.string().exists({ table: 'inter_school_events', column: 'id' }),
    participantsCount: vine.number().range([1, 100]),
    notes: vine.string().trim().optional(),
  })
)

/**
 * Application des messages personnalisés
 */
const provider = new SimpleMessagesProvider(interSchoolMessages)

searchSchoolsValidator.messagesProvider = provider
startExchangeValidator.messagesProvider = provider
shareBestPracticeValidator.messagesProvider = provider
createEventValidator.messagesProvider = provider
joinEventValidator.messagesProvider = provider
