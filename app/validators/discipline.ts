import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * Messages d'erreur personnalisés en français
 */
const disciplineMessages = {
  'studentId.exists': "L'élève spécifié n'existe pas",
  'incidentType.required': "Le type d'incident est requis",
  'description.required': "La description de l'incident est requise",
  'severity.required': "La gravité de l'incident est requise",
  'incidentDate.required': "La date de l'incident est requise",
  'incidentId.exists': "L'incident spécifié n'existe pas",
  'sanction.required': 'La sanction est requise',
}

/**
 * Validateur pour signaler un incident
 */
export const reportIncidentValidator = vine.create(
  vine.object({
    studentId: vine.string().exists({ table: 'students', column: 'id' }),
    incidentType: vine.enum([
      'absence',
      'late',
      'misconduct',
      'violence',
      'fraud',
      'uniform_violation',
      'other',
    ]),
    description: vine.string().trim(),
    severity: vine.enum(['minor', 'moderate', 'major', 'critical']),
    incidentDate: vine.date({ formats: ['YYYY-MM-DD'] }),
    actionTaken: vine.string().trim().optional(),
    parentNotified: vine.boolean().optional(),
  })
)

/**
 * Validateur pour appliquer une sanction
 */
export const applySanctionValidator = vine.create(
  vine.object({
    incidentId: vine.string().exists({ table: 'disciplines', column: 'id' }),
    sanction: vine.enum(['warning', 'community_service', 'suspension', 'expulsion', 'none']),
    details: vine.string().trim().optional(),
    duration: vine.number().optional(),
  })
)

/**
 * Validateur pour mettre à jour un incident
 */
export const updateIncidentValidator = vine.create(
  vine.object({
    description: vine.string().trim().optional(),
    severity: vine.enum(['minor', 'moderate', 'major', 'critical']).optional(),
    actionTaken: vine.string().trim().optional(),
    sanction: vine
      .enum(['warning', 'community_service', 'suspension', 'expulsion', 'none'])
      .optional(),
  })
)

/**
 * Validateur pour la notification aux parents
 */
export const notifyParentValidator = vine.create(
  vine.object({
    incidentId: vine.string().exists({ table: 'disciplines', column: 'id' }),
    message: vine.string().trim(),
  })
)

/**
 * Application des messages personnalisés (Prévient l'erreur TS6133)
 */
const provider = new SimpleMessagesProvider(disciplineMessages)

reportIncidentValidator.messagesProvider = provider
applySanctionValidator.messagesProvider = provider
updateIncidentValidator.messagesProvider = provider
notifyParentValidator.messagesProvider = provider
