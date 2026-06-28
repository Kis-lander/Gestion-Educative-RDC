import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * Messages d'erreur personnalisés en français
 */
const transferMessages = {
  'studentId.exists': "L'élève spécifié n'existe pas",
  'targetSchoolCode.exists': "L'école cible spécifiée n'existe pas",
  'transferId.exists': "La demande de transfert spécifiée n'existe pas",
  'rejectionReason.required': 'La raison du rejet est requise',
  'authorizationCode.exists': "Le code d'autorisation est invalide",
}

/**
 * Validateur pour demander un transfert
 */
export const requestTransferValidator = vine.create(
  vine.object({
    studentId: vine.string().exists({ table: 'students', column: 'id' }),
    targetSchoolCode: vine.string().trim().minLength(3).maxLength(100),
    reason: vine.string().trim().optional(),
  })
)

/**
 * Validateur pour approuver un transfert
 */
export const approveTransferValidator = vine.create(
  vine.object({
    transferId: vine.string().exists({ table: 'transfer_authorizations', column: 'id' }),
    notes: vine.string().trim().optional(),
  })
)

/**
 * Validateur pour rejeter un transfert
 */
export const rejectTransferValidator = vine.create(
  vine.object({
    transferId: vine.string().exists({ table: 'transfer_authorizations', column: 'id' }),
    rejectionReason: vine.string().trim(),
  })
)

/**
 * Validateur pour vérifier une autorisation
 */
export const verifyAuthorizationValidator = vine.create(
  vine.object({
    authorizationCode: vine
      .string()
      .trim()
      .exists({ table: 'transfer_authorizations', column: 'authorization_code' }),
  })
)

/**
 * Application des messages personnalisés
 */
const provider = new SimpleMessagesProvider(transferMessages)

requestTransferValidator.messagesProvider = provider
approveTransferValidator.messagesProvider = provider
rejectTransferValidator.messagesProvider = provider
verifyAuthorizationValidator.messagesProvider = provider
