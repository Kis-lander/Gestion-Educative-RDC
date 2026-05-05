import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * Messages d'erreur personnalisés en français
 */
const parentMessages = {
  'email.unique': 'Cette adresse email est déjà utilisée',
  'phone.mobile': 'Veuillez fournir un numéro de téléphone valide',
  'relationship.required': 'Le lien de parenté est requis',
  'teacherId.exists': "L'enseignant spécifié n'existe pas",
  'content.required': 'Le message est requis',
  'children.*.exists': "L'un des élèves spécifiés n'existe pas",
  'absenceId.exists': "Cette absence n'existe pas",
}

/**
 * Validateur pour la création d'un parent
 */
export const createParentValidator = vine.create(
  vine.object({
    email: vine.string().trim().email().unique({ table: 'users', column: 'email' }),
    firstName: vine.string().trim().maxLength(100),
    lastName: vine.string().trim().maxLength(100),
    phone: vine
      .string()
      .trim()
      .mobile(() => {
        return { locale: ['fr-FR'] }
      }),
    profession: vine.string().trim().optional(),
    emergencyPhone: vine.string().trim().optional(),
    relationship: vine.string().trim(),
    children: vine.array(vine.string().exists({ table: 'students', column: 'id' })),
  })
)

/**
 * Validateur pour l'envoi de message à un enseignant
 */
export const sendMessageToTeacherValidator = vine.create(
  vine.object({
    teacherId: vine.string().exists({ table: 'users', column: 'id' }),
    subject: vine.string().trim().maxLength(255),
    content: vine.string().trim(),
    studentId: vine.string().exists({ table: 'students', column: 'id' }).optional(),
  })
)

/**
 * Validateur pour justifier une absence
 */
export const justifyAbsenceValidator = vine.create(
  vine.object({
    absenceId: vine.string().exists({ table: 'absences', column: 'id' }),
    justification: vine.string().trim(),
    documentUrl: vine.string().trim().optional(),
  })
)

/**
 * Application des messages personnalisés
 */
const provider = new SimpleMessagesProvider(parentMessages)

createParentValidator.messagesProvider = provider
sendMessageToTeacherValidator.messagesProvider = provider
justifyAbsenceValidator.messagesProvider = provider
