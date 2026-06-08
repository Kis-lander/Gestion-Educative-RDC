import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * Messages d'erreur personnalisés en français
 */
const teacherMessages = {
  'email.unique': 'Cette adresse email est déjà utilisée',
  'qualification.required': "La qualification de l'enseignant est requise",
  'hireDate.required': "La date d'embauche est requise",
  'dueDate.date': 'La date de rendu doit être une date valide',
  'maxPoints.range': 'Les points maximums doivent être entre 0 et 100',
  'grade.range': 'La note doit être comprise entre 0 et 100',
  'students.*.studentId.exists': "L'un des élèves spécifiés n'existe pas",
}

/**
 * Validateur pour la création d'un enseignant
 */
export const createTeacherValidator = vine.create(
  vine.object({
    email: vine.string().trim().email().unique({ table: 'users', column: 'email' }),
    firstName: vine.string().trim().maxLength(100),
    postnom: vine.string().trim().maxLength(100),
    lastName: vine.string().trim().maxLength(100),
    phone: vine.string().trim(),
    qualification: vine.string().trim(),
    specialization: vine.string().trim().optional(),
    hireDate: vine.date({ formats: ['YYYY-MM-DD'] }),
    subjects: vine.array(vine.string().exists({ table: 'subjects', column: 'id' })).optional(),
  })
)

/**
 * Validateur pour la mise à jour d'un enseignant
 */
export const updateTeacherValidator = vine.create(
  vine.object({
    firstName: vine.string().trim().optional(),
    postnom: vine.string().trim().optional(),
    lastName: vine.string().trim().optional(),
    phone: vine.string().trim().optional(),
    qualification: vine.string().trim().optional(),
    specialization: vine.string().trim().optional(),
    status: vine.enum(['active', 'on_leave', 'terminated']).optional(),
  })
)

/**
 * Validateur pour la création d'un devoir (Assignment)
 */
export const createAssignmentValidator = vine.create(
  vine.object({
    classId: vine.string().exists({ table: 'classes', column: 'id' }),
    subjectId: vine.string().exists({ table: 'subjects', column: 'id' }),
    title: vine.string().trim().maxLength(255),
    description: vine.string().trim().optional(),
    instructions: vine.string().trim().optional(),
    dueDate: vine.date({ formats: ['YYYY-MM-DD'] }),
    dueTime: vine.string().optional(),
    maxPoints: vine.number().range([0, 100]).optional(),
    attachmentUrl: vine.string().trim().optional(),
  })
)

/**
 * Validateur pour la notation (Grade Submission)
 */
export const gradeSubmissionValidator = vine.create(
  vine.object({
    grade: vine.number().range([0, 100]),
    teacherFeedback: vine.string().trim().optional(),
  })
)

/**
 * Validateur pour l'appel (Attendance)
 */
export const markAttendanceValidator = vine.create(
  vine.object({
    classId: vine.string().exists({ table: 'classes', column: 'id' }),
    date: vine.date({ formats: ['YYYY-MM-DD'] }),
    period: vine.enum(['morning', 'afternoon', 'full']).optional(),
    students: vine.array(
      vine.object({
        studentId: vine.string().exists({ table: 'students', column: 'id' }),
        status: vine.enum(['present', 'absent', 'late', 'excused']),
        reason: vine.string().trim().optional(),
      })
    ),
  })
)

/**
 * Application des messages personnalisés
 */
const provider = new SimpleMessagesProvider(teacherMessages)

createTeacherValidator.messagesProvider = provider
updateTeacherValidator.messagesProvider = provider
createAssignmentValidator.messagesProvider = provider
gradeSubmissionValidator.messagesProvider = provider
markAttendanceValidator.messagesProvider = provider
