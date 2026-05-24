import { AssignmentSubmissionSchema } from '#database/schema'
import { DateTime } from 'luxon'
import { column, belongsTo, beforeSave } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

// Utilisation des alias de chemin (#models)
import Assignment from '#models/assignment'
import Student from '#models/student'

export default class AssignmentSubmission extends AssignmentSubmissionSchema {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare assignmentId: string

  @column()
  declare studentId: string

  @column()
  declare submissionContent: string | null

  @column()
  declare attachmentUrl: string | null

  @column.dateTime()
  declare submittedAt: DateTime | null

  // Les colonnes SQL decimal sont exposées en string par Lucid/Knex.
  @column()
  declare grade: string | null

  @column()
  declare teacherFeedback: string | null

  @column()
  declare isLate: boolean

  @column()
  declare status: 'draft' | 'submitted' | 'graded'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * RELATIONS
   */

  // Le devoir concerné par cette soumission
  @belongsTo(() => Assignment)
  declare assignment: BelongsTo<typeof Assignment>

  // L'élève qui a rendu le travail
  @belongsTo(() => Student)
  declare student: BelongsTo<typeof Student>

  /**
   * HOOKS
   * Logique automatique pour vérifier le retard lors de la soumission
   */
  @beforeSave()
  public static async checkSubmissionStatus(submission: AssignmentSubmission) {
    // Si l'élève soumet son travail et qu'on a les données du devoir
    if (submission.status === 'submitted' && !submission.submittedAt) {
      submission.submittedAt = DateTime.now()

      // On charge le devoir pour comparer les dates si nécessaire
      const assignment = await Assignment.find(submission.assignmentId)
      if (assignment) {
        submission.isLate = DateTime.now() > assignment.dueDate
      }
    }
  }
}
