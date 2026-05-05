import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * Messages d'erreur personnalisés en français
 */
const studentMessages = {
  'email.unique': 'Cette adresse email est déjà utilisée',
  'registrationNumber.unique': 'Ce matricule existe déjà',
  'birthDate.required': 'La date de naissance est requise',
  'birthPlace.required': 'Le lieu de naissance est requis',
  'gender.required': 'Le genre est requis',
  'classId.exists': "La classe spécifiée n'existe pas",
  'parentPhone.mobile': 'Veuillez fournir un numéro de téléphone valide',
  'assignmentId.exists': "Le devoir spécifié n'existe pas",
  'subjectId.exists': "La matière spécifiée n'existe pas",
}

/**
 * Validateur pour la création d'un élève
 */
export const createStudentValidator = vine.create(
  vine.object({
    email: vine.string().trim().email().unique({ table: 'users', column: 'email' }),
    firstName: vine.string().trim().maxLength(100),
    lastName: vine.string().trim().maxLength(100),
    registrationNumber: vine
      .string()
      .trim()
      .unique({ table: 'students', column: 'registration_number' }),
    birthDate: vine.date({ formats: ['YYYY-MM-DD'] }),
    birthPlace: vine.string().trim(),
    gender: vine.enum(['male', 'female']),
    classId: vine.string().exists({ table: 'classes', column: 'id' }),
    parentPhone: vine
      .string()
      .trim()
      .mobile(() => {
        return { locale: ['fr-FR'] }
      }),
    address: vine.string().trim().optional(),
    medicalInfo: vine.string().trim().optional(),
  })
)

/**
 * Validateur pour la mise à jour d'un élève
 */
export const updateStudentValidator = vine.create(
  vine.object({
    firstName: vine.string().trim().optional(),
    lastName: vine.string().trim().optional(),
    classId: vine.string().exists({ table: 'classes', column: 'id' }).optional(),
    parentPhone: vine.string().trim().optional(),
    address: vine.string().trim().optional(),
    medicalInfo: vine.string().trim().optional(),
    academicStatus: vine
      .enum(['active', 'transferred', 'graduated', 'suspended', 'expelled'])
      .optional(),
  })
)

/**
 * Validateur pour la soumission d'un devoir
 */
export const submitAssignmentValidator = vine.create(
  vine.object({
    assignmentId: vine.string().exists({ table: 'assignments', column: 'id' }),
    submissionContent: vine.string().trim().optional(),
    attachmentUrl: vine.string().trim().optional(),
  })
)

/**
 * Validateur pour poser une question sur le forum
 */
export const postForumQuestionValidator = vine.create(
  vine.object({
    subjectId: vine.string().exists({ table: 'subjects', column: 'id' }),
    classId: vine.string().exists({ table: 'classes', column: 'id' }),
    title: vine.string().trim().maxLength(255),
    content: vine.string().trim(),
  })
)

/**
 * Application des messages personnalisés
 */
const provider = new SimpleMessagesProvider(studentMessages)

createStudentValidator.messagesProvider = provider
updateStudentValidator.messagesProvider = provider
submitAssignmentValidator.messagesProvider = provider
postForumQuestionValidator.messagesProvider = provider
