import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * Messages d'erreur personnalisés en français
 */
const sessionMessages = {
  'name.unique': 'Une session scolaire avec ce nom existe déjà',
  'startDate.required': 'La date de début est requise',
  'endDate.required': 'La date de fin est requise',
  'endDate.afterField': 'La date de fin doit être après la date de début',
  'sessionId.exists': "La session scolaire spécifiée n'existe pas",
  'termNumber.range': 'Le numéro du trimestre doit être entre 1 et 3',
  'examEndDate.afterField': 'La date de fin des examens doit être après la date de début',
  'schoolId.exists': "L'école spécifiée n'existe pas",
}

/**
 * Validateur pour la création d'une session scolaire
 */
export const createAcademicSessionValidator = vine.create(
  vine.object({
    name: vine.string().trim().unique({ table: 'academic_sessions', column: 'name' }),
    startDate: vine.date({ formats: ['YYYY-MM-DD'] }),
    endDate: vine.date({ formats: ['YYYY-MM-DD'] }),
    isActive: vine.boolean().optional(),
    terms: vine
      .array(
        vine.object({
          termNumber: vine.number().range([1, 3]),
          name: vine.string(),
          startDate: vine.date({ formats: ['YYYY-MM-DD'] }),
          endDate: vine.date({ formats: ['YYYY-MM-DD'] }).afterField('startDate'),
          examStartDate: vine.date({ formats: ['YYYY-MM-DD'] }),
          examEndDate: vine.date({ formats: ['YYYY-MM-DD'] }).afterField('examStartDate'),
        })
      )
      .optional(),
  })
)

/**
 * Validateur pour la mise à jour d'une session
 */
export const updateAcademicSessionValidator = vine.create(
  vine.object({
    name: vine.string().trim().optional(),
    startDate: vine.date({ formats: ['YYYY-MM-DD'] }).optional(),
    endDate: vine.date({ formats: ['YYYY-MM-DD'] }).optional(),
    isActive: vine.boolean().optional(),
    status: vine.enum(['upcoming', 'active', 'completed', 'archived']).optional(),
  })
)

/**
 * Validateur pour définir la session actuelle d'une école
 */
export const setCurrentSessionValidator = vine.create(
  vine.object({
    sessionId: vine.string().exists({ table: 'academic_sessions', column: 'id' }),
    schoolId: vine.string().exists({ table: 'schools', column: 'id' }),
  })
)

/**
 * Validateur pour obtenir le rapport de session
 */
export const getSessionReportValidator = vine.create(
  vine.object({
    sessionId: vine.string().exists({ table: 'academic_sessions', column: 'id' }),
    schoolId: vine.string().exists({ table: 'schools', column: 'id' }).optional(),
    includeDetails: vine.boolean().optional(),
  })
)

/**
 * Validateur pour la création de jours fériés/vacances
 */
export const createHolidayValidator = vine.create(
  vine.object({
    sessionId: vine.string().exists({ table: 'academic_sessions', column: 'id' }),
    name: vine.string().trim(),
    startDate: vine.date({ formats: ['YYYY-MM-DD'] }),
    endDate: vine.date({ formats: ['YYYY-MM-DD'] }).afterField('startDate'),
    type: vine.enum(['public_holiday', 'school_holiday', 'exam_break']),
    applicableToAll: vine.boolean().optional(),
    schoolIds: vine.array(vine.string().exists({ table: 'schools', column: 'id' })).optional(),
  })
)

/**
 * Validateur pour le transfert de données entre sessions
 */
export const transferSessionValidator = vine.create(
  vine.object({
    fromSessionId: vine.string().exists({ table: 'academic_sessions', column: 'id' }),
    toSessionId: vine.string().exists({ table: 'academic_sessions', column: 'id' }),
    schoolId: vine.string().exists({ table: 'schools', column: 'id' }),
    transferData: vine.object({
      students: vine.boolean().optional(),
      teachers: vine.boolean().optional(),
      classes: vine.boolean().optional(),
      grades: vine.boolean().optional(),
      financial: vine.boolean().optional(),
    }),
  })
)

/**
 * Application des messages personnalisés
 */
const provider = new SimpleMessagesProvider(sessionMessages)

createAcademicSessionValidator.messagesProvider = provider
updateAcademicSessionValidator.messagesProvider = provider
setCurrentSessionValidator.messagesProvider = provider
getSessionReportValidator.messagesProvider = provider
createHolidayValidator.messagesProvider = provider
transferSessionValidator.messagesProvider = provider
