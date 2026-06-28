import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * Messages d'erreur personnalisés en français
 */
const dashboardMessages = {
  'startDate.date': 'La date de début doit être une date valide',
  'endDate.date': 'La date de fin doit être une date valide',
  'classId.exists': "La classe spécifiée n'existe pas",
  'subjectId.exists': "La matière spécifiée n'existe pas",
  'schoolId.exists': "L'école spécifiée n'existe pas",
}

/**
 * Validateur pour les statistiques générales du tableau de bord
 */
export const getDashboardStatsValidator = vine.create(
  vine.object({
    startDate: vine.date({ formats: ['YYYY-MM-DD'] }).optional(),
    endDate: vine.date({ formats: ['YYYY-MM-DD'] }).optional(),
    schoolId: vine.string().exists({ table: 'schools', column: 'id' }).optional(),
    period: vine.enum(['day', 'week', 'month', 'year', 'all']).optional(),
  })
)

/**
 * Validateur pour les statistiques scolaires
 */
export const getAcademicStatsValidator = vine.create(
  vine.object({
    classId: vine.string().exists({ table: 'classes', column: 'id' }).optional(),
    term: vine.string().trim().optional(),
    academicYear: vine.string().trim().optional(),
  })
)

/**
 * Validateur pour les statistiques financières
 */
export const getFinancialStatsValidator = vine.create(
  vine.object({
    startDate: vine.date({ formats: ['YYYY-MM-DD'] }).optional(),
    endDate: vine.date({ formats: ['YYYY-MM-DD'] }).optional(),
    category: vine.string().trim().optional(),
  })
)

/**
 * Validateur pour les statistiques de présence (Attendance)
 */
export const getAttendanceStatsValidator = vine.create(
  vine.object({
    classId: vine.string().exists({ table: 'classes', column: 'id' }).optional(),
    startDate: vine.date({ formats: ['YYYY-MM-DD'] }),
    endDate: vine.date({ formats: ['YYYY-MM-DD'] }),
  })
)

/**
 * Validateur pour les statistiques de performance (Notes/Résultats)
 */
export const getPerformanceStatsValidator = vine.create(
  vine.object({
    classId: vine.string().exists({ table: 'classes', column: 'id' }).optional(),
    subjectId: vine.string().exists({ table: 'subjects', column: 'id' }).optional(),
    term: vine.string().trim().optional(),
  })
)

/**
 * Application des messages personnalisés
 */
const provider = new SimpleMessagesProvider(dashboardMessages)

getDashboardStatsValidator.messagesProvider = provider
getAcademicStatsValidator.messagesProvider = provider
getFinancialStatsValidator.messagesProvider = provider
getAttendanceStatsValidator.messagesProvider = provider
getPerformanceStatsValidator.messagesProvider = provider
