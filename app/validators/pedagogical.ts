import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * Messages d'erreur personnalisés en français
 */
const pedagogicalMessages = {
  'required': 'Le champ {{ field }} est obligatoire',
  'string': 'Le champ {{ field }} doit être une chaîne de caractères',
  'number': 'Le champ {{ field }} doit être un nombre',
  'array': 'Le champ {{ field }} doit être une liste',
  'boolean': 'Le champ {{ field }} doit être un booléen',
  'database.exists': "La ressource spécifiée n'existe pas",
  'classId.exists': "La classe spécifiée n'existe pas",
  'studentId.exists': "L'élève spécifié n'existe pas",
  'subjectId.exists': "La matière spécifiée n'existe pas",
  'teacherId.exists': "L'enseignant spécifié n'existe pas",
  'schoolId.exists': "L'école spécifiée n'existe pas",
  'term.required': 'Le trimestre est requis',
  'academicYear.required': "L'année scolaire est requise",
  'dayOfWeek.range': 'Le jour de la semaine doit être entre 1 (Lundi) et 7 (Dimanche)',
  'examDate.afterField': "La date d'examen doit être postérieure à la date de début de période",
}

const provider = new SimpleMessagesProvider(pedagogicalMessages)

/**
 * Validateur pour la création de l'emploi du temps
 */
export const createTimetableValidator = vine.create(
  vine.object({
    classId: vine.string().exists({ table: 'classes', column: 'id' }),
    academicYear: vine.string().trim(),
    term: vine.string().trim(),
    schedule: vine.array(
      vine.object({
        dayOfWeek: vine.number().range([1, 7]),
        startTime: vine.string(),
        endTime: vine.string(),
        subjectId: vine.string().exists({ table: 'subjects', column: 'id' }),
        teacherId: vine.string().exists({ table: 'teachers', column: 'id' }),
        room: vine.string().trim().optional(),
      })
    ),
  })
)

/**
 * Validateur pour la génération des bulletins (Report Card)
 */
export const generateReportCardValidator = vine.create(
  vine.object({
    studentId: vine.string().exists({ table: 'students', column: 'id' }),
    term: vine.string().trim(),
    academicYear: vine.string().trim(),
    includeBehavior: vine.boolean().optional(),
    includeAttendance: vine.boolean().optional(),
    format: vine.enum(['pdf', 'html']).optional(),
  })
)

/**
 * Validateur pour la publication des notes
 */
export const publishGradesValidator = vine.create(
  vine.object({
    classId: vine.string().exists({ table: 'classes', column: 'id' }),
    term: vine.string().trim(),
    academicYear: vine.string().trim(),
    notifyParents: vine.boolean().optional(),
  })
)

/**
 * Validateur pour le calendrier scolaire
 */
export const createAcademicCalendarValidator = vine.create(
  vine.object({
    schoolId: vine.string().exists({ table: 'schools', column: 'id' }),
    academicYear: vine.string().trim(),
    events: vine.array(
      vine.object({
        title: vine.string().trim(),
        description: vine.string().trim().optional(),
        startDate: vine.date({ formats: ['YYYY-MM-DD'] }),
        endDate: vine.date({ formats: ['YYYY-MM-DD'] }),
        eventType: vine.enum(['holiday', 'exam', 'break', 'special_event']),
      })
    ),
  })
)

/**
 * Validateur pour le suivi de progression
 */
export const getStudentProgressValidator = vine.create(
  vine.object({
    studentId: vine.string().exists({ table: 'students', column: 'id' }),
    startDate: vine.date({ formats: ['YYYY-MM-DD'] }).optional(),
    endDate: vine.date({ formats: ['YYYY-MM-DD'] }).optional(),
    subjects: vine.array(vine.string()).optional(),
  })
)

/**
 * Validateur pour le planning des examens
 */
export const createExamScheduleValidator = vine.create(
  vine.object({
    classId: vine.string().exists({ table: 'classes', column: 'id' }),
    examPeriod: vine.string().trim(),
    startDate: vine.date({ formats: ['YYYY-MM-DD'] }),
    endDate: vine.date({ formats: ['YYYY-MM-DD'] }),
    exams: vine.array(
      vine.object({
        subjectId: vine.string().exists({ table: 'subjects', column: 'id' }),
        examDate: vine.date({ formats: ['YYYY-MM-DD'] }).afterField('startDate'),
        startTime: vine.string(),
        duration: vine.number().range([1, 480]),
        room: vine.string().trim(),
        maxPoints: vine.number().range([1, 100]),
      })
    ),
  })
)

/**
 * Application du provider de messages à tous les validateurs
 */
createTimetableValidator.messagesProvider = provider
generateReportCardValidator.messagesProvider = provider
publishGradesValidator.messagesProvider = provider
createAcademicCalendarValidator.messagesProvider = provider
getStudentProgressValidator.messagesProvider = provider
createExamScheduleValidator.messagesProvider = provider
