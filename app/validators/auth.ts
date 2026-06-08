import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * Messages d'erreur personnalisés pour l'ensemble du validateur Auth
 */
const authMessages = {
  'email.required': "L'adresse email est requise",
  'email.email': 'Veuillez fournir une adresse email valide',
  'email.unique': 'Cette adresse email est déjà utilisée',
  'email.exists': 'Aucun compte associé à cette adresse email',
  'password.required': 'Le mot de passe est requis',
  'password.minLength': 'Le mot de passe doit contenir au moins 8 caractères',
  'password.confirmed': 'La confirmation du mot de passe ne correspond pas',
  'firstName.required': 'Le prénom est requis',
  'lastName.required': 'Le nom est requis',
  'currentPassword.required': 'Le mot de passe actuel est requis',
  'newPassword.minLength': 'Le nouveau mot de passe doit contenir au moins 8 caractères',
  'newPassword.confirmed': 'La confirmation du nouveau mot de passe ne correspond pas',
}

/**
 * Validateur pour la connexion (Login)
 */
export const loginValidator = vine.create(
  vine.object({
    email: vine.string().trim().email().exists({ table: 'users', column: 'email' }),
    password: vine.string(),
  })
)

/**
 * Validateur pour l'inscription (Register)
 */
export const registerValidator = vine.create(
  vine.object({
    email: vine.string().trim().email().unique({ table: 'users', column: 'email' }),
    password: vine.string().minLength(8).confirmed({ confirmationField: 'passwordConfirmation' }),
    firstName: vine.string().trim().maxLength(100),
    postnom: vine.string().trim().maxLength(100),
    lastName: vine.string().trim().maxLength(100),
    phone: vine.string().trim().optional(),
    role: vine.enum(['director', 'teacher', 'parent', 'student']).optional(),
  })
)

/**
 * Validateur pour le changement de mot de passe
 */
export const changePasswordValidator = vine.create(
  vine.object({
    currentPassword: vine.string(),
    newPassword: vine
      .string()
      .minLength(8)
      .confirmed({ confirmationField: 'newPasswordConfirmation' }),
  })
)

/**
 * Validateur pour l'oubli de mot de passe
 */
export const forgotPasswordValidator = vine.create(
  vine.object({
    email: vine.string().trim().email().exists({ table: 'users', column: 'email' }),
  })
)

/**
 * Validateur pour la réinitialisation du mot de passe
 */
export const resetPasswordValidator = vine.create(
  vine.object({
    token: vine.string(),
    // Changé en "newPassword" pour correspondre à la logique du contrôleur
    newPassword: vine
      .string()
      .minLength(8)
      .confirmed({ confirmationField: 'newPasswordConfirmation' }),
  })
)

/**
 * Validateur pour la mise à jour du profil
 */
export const requestOtpValidator = vine.create(
  vine.object({
    email: vine.string().trim().email().exists({ table: 'users', column: 'email' }),
    purpose: vine.string().trim().optional(),
  })
)

export const verifyOtpValidator = vine.create(
  vine.object({
    email: vine.string().trim().email().exists({ table: 'users', column: 'email' }),
    code: vine.string().trim().minLength(4).maxLength(10),
    purpose: vine.string().trim().optional(),
  })
)

export const updateProfileValidator = vine.create(
  vine.object({
    firstName: vine.string().trim().maxLength(100).optional(),
    postnom: vine.string().trim().maxLength(100).optional(),
    lastName: vine.string().trim().maxLength(100).optional(),
    phone: vine.string().trim().optional(),
  })
)

// Application des messages personnalisés globalement pour ce fichier
const provider = new SimpleMessagesProvider(authMessages)
loginValidator.messagesProvider = provider
registerValidator.messagesProvider = provider
changePasswordValidator.messagesProvider = provider
forgotPasswordValidator.messagesProvider = provider
resetPasswordValidator.messagesProvider = provider
requestOtpValidator.messagesProvider = provider
verifyOtpValidator.messagesProvider = provider
updateProfileValidator.messagesProvider = provider
