import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * Messages d'erreur personnalisés en français
 */
const messageErrorMessages = {
  'receiverId.exists': "Le destinataire spécifié n'existe pas",
  'subject.required': 'Le sujet du message est requis',
  'content.required': 'Le contenu du message est requis',
  'schoolId.exists': "L'école spécifiée n'existe pas",
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
 * Validateur pour l'envoi d'un message direct
 */
export const sendMessageValidator = vine.create(
  vine.object({
    receiverId: vine.string().exists({ table: 'users', column: 'id' }),
    subject: vine.string().trim().maxLength(255),
    content: vine.string().trim(),
    type: vine.enum(['official', 'parent_teacher', 'general', 'system']).optional(),
  })
)

/**
 * Validateur pour les communications globales (Niveau National/Provincial)
 */
export const sendGlobalCommunicationValidator = vine.create(
  vine.object({
    subject: vine.string().trim().maxLength(255),
    content: vine.string().trim(),
    targetRole: vine.enum(communicationTargets).optional(),
    targetProvince: vine.string().trim().optional(),
  })
)

/**
 * Validateur pour les communications au sein d'une école
 */
export const sendSchoolCommunicationValidator = vine.create(
  vine.object({
    schoolId: vine.string().exists({ table: 'schools', column: 'id' }),
    subject: vine.string().trim().maxLength(255),
    content: vine.string().trim(),
    targetRole: vine.enum(communicationTargets).optional(),
  })
)

/**
 * Application des messages personnalisés
 */
const provider = new SimpleMessagesProvider(messageErrorMessages)

sendMessageValidator.messagesProvider = provider
sendGlobalCommunicationValidator.messagesProvider = provider
sendSchoolCommunicationValidator.messagesProvider = provider
