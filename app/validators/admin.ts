import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * Messages d'erreur personnalisés en français
 */
const adminMessages = {
  'email.unique': 'Cette adresse email est déjà utilisée',
  'password.minLength': 'Le mot de passe doit contenir au moins 8 caractères',
  'password.confirmed': 'La confirmation du mot de passe ne correspond pas',
  'role.required': 'Le rôle est requis',
  'role.enum': "Le rôle spécifié n'est pas valide",
  'userId.exists': "L'utilisateur spécifié n'existe pas",
  'roleId.exists': "Le rôle spécifié n'existe pas",
  'schoolId.exists': "Cette école n'existe pas",
  'limit.range': 'La limite doit être comprise entre 1 et 1000',
  'reason.required': 'La raison de la suspension est requise',
}

/**
 * Validateur pour la création d'un utilisateur
 */
export const createUserValidator = vine.create(
  vine.object({
    email: vine.string().trim().email().unique({ table: 'users', column: 'email' }),
    password: vine.string().minLength(8).confirmed({ confirmationField: 'passwordConfirmation' }),
    firstName: vine.string().trim().maxLength(100),
    lastName: vine.string().trim().maxLength(100),
    phone: vine.string().trim().optional(),
    role: vine.enum([
      'inspection',
      'director',
      'finance_director',
      'teacher',
      'parent',
      'student',
      'discipline_director',
    ]),
    schoolId: vine.string().exists({ table: 'schools', column: 'id' }).optional(),
  })
)

/**
 * Validateur pour la mise à jour d'un utilisateur
 */
export const updateUserValidator = vine.create(
  vine.object({
    firstName: vine.string().trim().optional(),
    lastName: vine.string().trim().optional(),
    phone: vine.string().trim().optional(),
    role: vine
      .enum([
        'inspection',
        'director',
        'finance_director',
        'teacher',
        'parent',
        'student',
        'discipline_director',
      ])
      .optional(),
    status: vine.enum(['active', 'inactive', 'suspended']).optional(),
    schoolId: vine.string().exists({ table: 'schools', column: 'id' }).optional(),
  })
)

/**
 * Validateur pour la suspension d'un compte
 */
export const suspendAccountValidator = vine.create(
  vine.object({
    reason: vine.string().trim(),
    duration: vine.number().optional(),
    sendNotification: vine.boolean().optional(),
  })
)

/**
 * Validateur pour la création d'un rôle
 */
export const createRoleValidator = vine.create(
  vine.object({
    name: vine.string().trim().unique({ table: 'roles', column: 'name' }),
    permissions: vine.array(vine.string()),
    description: vine.string().trim().optional(),
  })
)

/**
 * Validateur pour la mise à jour d'un rôle
 */
export const updateRoleValidator = vine.create(
  vine.object({
    name: vine.string().trim().optional(),
    permissions: vine.array(vine.string()).optional(),
    description: vine.string().trim().optional(),
  })
)

/**
 * Validateur pour l'assignation de rôle
 */
export const assignRoleValidator = vine.create(
  vine.object({
    userId: vine.string().exists({ table: 'users', column: 'id' }),
    roleId: vine.string().exists({ table: 'roles', column: 'id' }),
  })
)

/**
 * Validateur pour la récupération des logs système
 */
export const getSystemLogsValidator = vine.create(
  vine.object({
    startDate: vine.date({ formats: ['YYYY-MM-DD'] }).optional(),
    endDate: vine.date({ formats: ['YYYY-MM-DD'] }).optional(),
    action: vine.string().trim().optional(),
    userId: vine.string().exists({ table: 'users', column: 'id' }).optional(),
    limit: vine.number().range([1, 1000]).optional(),
    page: vine.number().range([1, 100]).optional(),
  })
)

/**
 * Application des messages personnalisés
 */
const provider = new SimpleMessagesProvider(adminMessages)

createUserValidator.messagesProvider = provider
updateUserValidator.messagesProvider = provider
suspendAccountValidator.messagesProvider = provider
createRoleValidator.messagesProvider = provider
updateRoleValidator.messagesProvider = provider
assignRoleValidator.messagesProvider = provider
getSystemLogsValidator.messagesProvider = provider
