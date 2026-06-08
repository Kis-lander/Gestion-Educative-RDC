import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * Messages d'erreur personnalisés en français
 */
const accountMessages = {
  'email.unique': 'Cette adresse email est déjà utilisée',
  'email.email': 'Veuillez fournir une adresse email valide',
  'role.required': 'Le rôle est requis',
  'schoolId.required': "L'école est requise",
  'schoolId.exists': "L'école spécifiée n'existe pas",
  'userId.exists': "L'utilisateur spécifié n'existe pas",
  'reason.required': 'La raison est requise pour la suspension',
  'classId.exists': "La classe spécifiée n'existe pas",
}

/**
 * Validateur pour la création d'un compte utilisateur individuel
 */
export const createUserAccountValidator = vine.create(
  vine.object({
    email: vine.string().trim().email().unique({ table: 'users', column: 'email' }),
    firstName: vine.string().trim().maxLength(100),
    postnom: vine.string().trim().maxLength(100),
    lastName: vine.string().trim().maxLength(100),
    phone: vine.string().trim().optional(),
    role: vine.enum([
      'director',
      'finance_director',
      'teacher',
      'parent',
      'student',
      'discipline_director',
    ]),
    schoolId: vine.string().exists({ table: 'schools', column: 'id' }),
    sendEmail: vine.boolean().optional(),
  })
)

/**
 * Validateur pour la création massive de comptes
 */
export const createBulkAccountsValidator = vine.create(
  vine.object({
    accounts: vine.array(
      vine.object({
        email: vine.string().trim().email(),
        firstName: vine.string().trim(),
        postnom: vine.string().trim(),
        lastName: vine.string().trim(),
        role: vine.enum(['teacher', 'student']),
        classId: vine.string().exists({ table: 'classes', column: 'id' }).optional(),
      })
    ),
    schoolId: vine.string().exists({ table: 'schools', column: 'id' }),
    autoGeneratePassword: vine.boolean().optional(),
  })
)

/**
 * Validateur pour l'activation d'un compte
 */
export const activateAccountValidator = vine.create(
  vine.object({
    userId: vine.string().exists({ table: 'users', column: 'id' }),
    sendNotification: vine.boolean().optional(),
  })
)

/**
 * Validateur pour la suspension d'un compte
 */
export const suspendAccountValidator = vine.create(
  vine.object({
    userId: vine.string().exists({ table: 'users', column: 'id' }),
    reason: vine.string().trim(),
    duration: vine.number().optional(),
    sendNotification: vine.boolean().optional(),
  })
)

/**
 * Validateur pour la réinitialisation de mot de passe par un admin
 */
export const resetUserPasswordValidator = vine.create(
  vine.object({
    userId: vine.string().exists({ table: 'users', column: 'id' }),
    sendEmail: vine.boolean().optional(),
    forceReset: vine.boolean().optional(),
  })
)

/**
 * Application des messages personnalisés
 */
const provider = new SimpleMessagesProvider(accountMessages)

createUserAccountValidator.messagesProvider = provider
createBulkAccountsValidator.messagesProvider = provider
activateAccountValidator.messagesProvider = provider
suspendAccountValidator.messagesProvider = provider
resetUserPasswordValidator.messagesProvider = provider
