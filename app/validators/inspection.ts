import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * Messages d'erreur personnalisés en français
 */
const inspectionMessages = {
  'schoolId.exists': "L'école spécifiée n'existe pas",
  'inspectionDate.required': "La date d'inspection est requise",
  'inspector.required': "Le nom de l'inspecteur est requis",
  'report.required': "Le rapport d'inspection est requis",
  'rating.range': 'La note doit être comprise entre 0 et 10',
}

const communicationTargets = [
  'all',
  'promoter',
  'preschool_director',
  'primary_director',
  'prefect',
  'studies_director',
  'pedagogical_advisor',
  'discipline_director',
  'deputy_discipline_director',
  'finance_director',
  'secretary',
  'teacher',
  'parent',
] as const

/**
 * Validateur pour la liste des écoles (Filtres d'inspection)
 */
export const getSchoolsValidator = vine.create(
  vine.object({
    status: vine.enum(['active', 'suspended', 'pending']).optional(),
    province: vine.string().trim().optional(),
    territory: vine.string().trim().optional(),
    startDate: vine.date({ formats: ['YYYY-MM-DD'] }).optional(),
    endDate: vine.date({ formats: ['YYYY-MM-DD'] }).optional(),
    page: vine.number().range([1, 100]).optional(),
    limit: vine.number().range([1, 100]).optional(),
  })
)

/**
 * Validateur pour enregistrer une inspection
 */
export const inspectSchoolValidator = vine.create(
  vine.object({
    schoolId: vine.string().exists({ table: 'schools', column: 'id' }),
    inspectionDate: vine.date({ formats: ['YYYY-MM-DD'] }),
    inspector: vine.string().trim(),
    report: vine.string().trim(),
    rating: vine.number().range([0, 10]).optional(),
    recommendations: vine.string().trim().optional(),
    followUpDate: vine.date({ formats: ['YYYY-MM-DD'] }).optional(),
  })
)

/**
 * Validateur pour générer un rapport d'école
 */
export const generateSchoolReportValidator = vine.create(
  vine.object({
    schoolId: vine.string().exists({ table: 'schools', column: 'id' }),
    startDate: vine.date({ formats: ['YYYY-MM-DD'] }),
    endDate: vine.date({ formats: ['YYYY-MM-DD'] }),
    reportType: vine.enum(['academic', 'financial', 'disciplinary', 'complete']),
  })
)

/**
 * Validateur pour la vérification de la santé du système
 */
export const getSystemHealthValidator = vine.create(
  vine.object({
    checkDatabase: vine.boolean().optional(),
    checkStorage: vine.boolean().optional(),
    checkCache: vine.boolean().optional(),
    checkEmail: vine.boolean().optional(),
  })
)

/**
 * Validateur pour l'envoi d'une communication globale
 */
export const sendGlobalCommunicationValidator = vine.compile(
  vine.object({
    subject: vine.string().trim().minLength(3),
    content: vine.string().trim().minLength(10),
    targetRole: vine.enum(communicationTargets).optional(),
    targetProvince: vine.string().trim().optional(),
  })
)

/**
 * Application des messages personnalisés
 */
const provider = new SimpleMessagesProvider(inspectionMessages)

getSchoolsValidator.messagesProvider = provider
inspectSchoolValidator.messagesProvider = provider
generateSchoolReportValidator.messagesProvider = provider
getSystemHealthValidator.messagesProvider = provider
sendGlobalCommunicationValidator.messagesProvider = provider
