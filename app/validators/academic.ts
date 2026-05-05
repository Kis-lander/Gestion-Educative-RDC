import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * Messages d'erreur personnalisés en français
 */
const academicMessages = {
  'name.required': 'Le nom de la classe est requis',
  'name.maxLength': 'Le nom ne doit pas dépasser 100 caractères',
  'gradeLevel.required': 'Le niveau est requis',
  'gradeLevel.range': 'Le niveau doit être entre 1 et 12',
  'maxCapacity.range': 'La capacité maximale doit être entre 10 et 100',
  'studentId.exists': "L'élève spécifié n'existe pas",
  'subjectId.exists': "La matière spécifiée n'existe pas",
  'classId.exists': "La classe spécifiée n'existe pas",
  'teacherId.exists': "L'enseignant spécifié n'existe pas",
  'score.range': 'La note doit être comprise entre 0 et 20',
  'score.required': 'La note est requise',
  'examDate.date': "La date de l'examen doit être une date valide",
  'code.unique': 'Ce code de matière est déjà utilisé',
  'subject.name.unique': 'Ce nom de matière existe déjà',
}

/**
 * Validateur pour la création d'une classe
 */
export const createClassValidator = vine.create(
  vine.object({
    name: vine.string().trim().maxLength(100),
    level: vine.string().trim(),
    gradeLevel: vine.number().range([1, 12]),
    maxCapacity: vine.number().range([10, 100]).optional(),
    shift: vine.enum(['morning', 'afternoon', 'evening']).optional(),
    teacherId: vine.string().exists({ table: 'teachers', column: 'id' }).optional(),
  })
)

/**
 * Validateur pour la mise à jour d'une classe
 */
export const updateClassValidator = vine.create(
  vine.object({
    name: vine.string().trim().maxLength(100).optional(),
    maxCapacity: vine.number().range([10, 100]).optional(),
    shift: vine.enum(['morning', 'afternoon', 'evening']).optional(),
    teacherId: vine.string().exists({ table: 'teachers', column: 'id' }).optional(),
  })
)

/**
 * Validateur pour l'ajout d'une note (Grade)
 */
export const addGradeValidator = vine.create(
  vine.object({
    studentId: vine.string().exists({ table: 'students', column: 'id' }),
    subjectId: vine.string().exists({ table: 'subjects', column: 'id' }),
    classId: vine.string().exists({ table: 'classes', column: 'id' }),
    term: vine.string().trim(),
    examType: vine.string().trim(),
    score: vine.number().range([0, 20]),
    maxScore: vine.number().range([1, 100]).optional(),
    teacherComments: vine.string().trim().optional(),
    examDate: vine.date({ formats: ['YYYY-MM-DD'] }),
  })
)

/**
 * Validateur pour la mise à jour d'une note
 */
export const updateGradeValidator = vine.create(
  vine.object({
    score: vine.number().range([0, 20]).optional(),
    teacherComments: vine.string().trim().optional(),
    published: vine.boolean().optional(),
  })
)

/**
 * Validateur pour la création d'une matière (Subject)
 */
export const createSubjectValidator = vine.create(
  vine.object({
    name: vine.string().trim().maxLength(100).unique({ table: 'subjects', column: 'name' }),
    code: vine.string().trim().maxLength(20).unique({ table: 'subjects', column: 'code' }),
    description: vine.string().trim().optional(),
    coefficient: vine.number().range([1, 5]).optional(),
  })
)

/**
 * Application du provider de messages
 */
const provider = new SimpleMessagesProvider(academicMessages)

createClassValidator.messagesProvider = provider
updateClassValidator.messagesProvider = provider
addGradeValidator.messagesProvider = provider
updateGradeValidator.messagesProvider = provider
createSubjectValidator.messagesProvider = provider
