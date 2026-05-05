import { type HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import {
  createAcademicSessionValidator,
  updateAcademicSessionValidator,
  setCurrentSessionValidator,
  getSessionReportValidator,
  createHolidayValidator,
  transferSessionValidator,
} from '#validators/session'

export default class SessionController {
  /**
   * Créer une session académique
   */
  public async createAcademicSession({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createAcademicSessionValidator)

    const sessionData = await db.transaction(async (trx) => {
      // Désactiver les autres sessions si celle-ci est active
      if (payload.isActive) {
        await trx.from('academic_sessions').update({ is_active: false })
      }

      // Créer la session principale
      const session = await trx
        .table('academic_sessions')
        .insert({
          name: payload.name,
          start_date: payload.startDate.toSQLDate(),
          end_date: payload.endDate.toSQLDate(),
          is_active: payload.isActive || false,
          status: payload.isActive ? 'active' : 'upcoming',
          created_at: new Date(),
        })
        .returning('*')

      const sessionId = session[0].id

      // Créer les trimestres en masse
      if (payload.terms && payload.terms.length > 0) {
        const termsToInsert = payload.terms.map((term: any) => ({
          session_id: sessionId,
          term_number: term.termNumber,
          name: term.name,
          start_date: term.startDate.toSQLDate(),
          end_date: term.endDate.toSQLDate(),
          exam_start_date: term.examStartDate?.toSQLDate(),
          exam_end_date: term.examEndDate?.toSQLDate(),
          created_at: new Date(),
        }))
        await trx.table('academic_terms').insert(termsToInsert)
      }

      return session[0]
    })

    return response.created({
      success: true,
      message: 'Session académique créée avec succès',
      session: sessionData,
    })
  }

  /**
   * Obtenir toutes les sessions académiques
   */
  public async getAcademicSessions({ response }: HttpContext) {
    const sessions = await db.from('academic_sessions').orderBy('start_date', 'desc')

    // Charger les trimestres pour chaque session
    for (const session of sessions) {
      session.terms = await db
        .from('academic_terms')
        .where('session_id', session.id)
        .orderBy('term_number', 'asc')
    }

    return response.ok({
      success: true,
      sessions: sessions,
    })
  }

  /**
   * Mettre à jour une session académique
   */
  public async updateAcademicSession({ request, params, response }: HttpContext) {
    const payload = await request.validateUsing(updateAcademicSessionValidator)

    const session = await db.from('academic_sessions').where('id', params.id).first()

    if (!session) {
      return response.notFound({
        success: false,
        message: 'Session académique non trouvée',
      })
    }

    await db.transaction(async (trx) => {
      // Si on active cette session, désactiver les autres
      if (payload.isActive) {
        await trx
          .from('academic_sessions')
          .where('id', '!=', params.id)
          .update({ is_active: false, status: 'completed' })
      }

      const updates: any = {}
      if (payload.name) updates.name = payload.name
      if (payload.startDate) updates.start_date = payload.startDate.toSQLDate()
      if (payload.endDate) updates.end_date = payload.endDate.toSQLDate()
      if (payload.isActive !== undefined) updates.is_active = payload.isActive
      if (payload.status) updates.status = payload.status

      if (Object.keys(updates).length > 0) {
        await trx.from('academic_sessions').where('id', params.id).update(updates)
      }
    })

    return response.ok({
      success: true,
      message: 'Session académique mise à jour avec succès',
    })
  }

  /**
   * Définir la session active pour une école
   */
  public async setCurrentSession({ request, response }: HttpContext) {
    const payload = await request.validateUsing(setCurrentSessionValidator)

    const session = await db.from('academic_sessions').where('id', payload.sessionId).first()

    if (!session) {
      return response.notFound({
        success: false,
        message: 'Session académique non trouvée',
      })
    }

    await db.transaction(async (trx) => {
      await trx.from('school_sessions').where('school_id', payload.schoolId).delete()

      await trx.table('school_sessions').insert({
        school_id: payload.schoolId,
        session_id: payload.sessionId,
        set_at: new Date(),
      })
    })

    return response.ok({
      success: true,
      message: 'Session active définie avec succès',
    })
  }

  /**
   * Obtenir la session active d'une école
   */
  public async getCurrentSession({ params, response }: HttpContext) {
    const schoolSession = await db
      .from('school_sessions')
      .where('school_id', params.schoolId)
      .join('academic_sessions', 'school_sessions.session_id', 'academic_sessions.id')
      .select('school_sessions.*', 'academic_sessions.name', 'academic_sessions.status')
      .first()

    if (!schoolSession) {
      return response.ok({
        success: true,
        session: null,
      })
    }

    schoolSession.terms = await db
      .from('academic_terms')
      .where('session_id', schoolSession.session_id)
      .orderBy('term_number', 'asc')

    return response.ok({
      success: true,
      session: schoolSession,
    })
  }

  /**
   * Transférer les données d'une session à une autre
   */
  public async transferSession({ request, response }: HttpContext) {
    const payload = await request.validateUsing(transferSessionValidator)

    const results = {
      students: 0,
      teachers: 0,
      classes: 0,
      grades: 0,
    }

    await db.transaction(async (trx) => {
      // Transférer les élèves
      if (payload.transferData.students) {
        const students = await trx
          .from('students')
          .where('school_id', payload.schoolId)
          .where('academic_status', 'active')

        if (students.length > 0) {
          const enrollments = students.map((s) => ({
            student_id: s.id,
            session_id: payload.toSessionId,
            class_id: s.class_id,
            enrollment_date: new Date(),
            created_at: new Date(),
          }))
          await trx.table('student_enrollments').insert(enrollments)
          results.students = students.length
        }
      }

      // Transférer les enseignants
      if (payload.transferData.teachers) {
        const teachers = await trx
          .from('teachers')
          .where('school_id', payload.schoolId)
          .where('status', 'active')

        if (teachers.length > 0) {
          const assignments = teachers.map((t) => ({
            teacher_id: t.id,
            session_id: payload.toSessionId,
            assigned_at: new Date(),
          }))
          await trx.table('teacher_assignments').insert(assignments)
          results.teachers = teachers.length
        }
      }

      // Transférer les classes
      if (payload.transferData.classes) {
        const classes = await trx.from('classes').where('school_id', payload.schoolId)

        if (classes.length > 0) {
          const classSessions = classes.map((c) => ({
            class_id: c.id,
            session_id: payload.toSessionId,
            created_at: new Date(),
          }))
          await trx.table('class_sessions').insert(classSessions)
          results.classes = classes.length
        }
      }

      // Transférer les notes (History)
      if (payload.transferData.grades) {
        const grades = await trx
          .from('grades')
          .whereIn(
            'student_id',
            db.from('students').select('id').where('school_id', payload.schoolId)
          )
          .where('session_id', payload.fromSessionId)

        if (grades.length > 0) {
          const gradeHistory = grades.map((g) => ({
            grade_id: g.id,
            session_id: payload.toSessionId,
            transferred_at: new Date(),
          }))
          await trx.table('grade_history').insert(gradeHistory)
          results.grades = grades.length
        }
      }
    })

    return response.ok({
      success: true,
      message: 'Transfert de session effectué avec succès',
      results,
    })
  }

  /**
   * Créer un congé scolaire
   */
  public async createHoliday({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createHolidayValidator)

    const holiday = await db
      .table('school_holidays')
      .insert({
        session_id: payload.sessionId,
        name: payload.name,
        start_date: payload.startDate.toSQLDate(),
        end_date: payload.endDate.toSQLDate(),
        type: payload.type,
        applicable_to_all: payload.applicableToAll || false,
        school_ids: payload.schoolIds ? JSON.stringify(payload.schoolIds) : null,
        created_at: new Date(),
      })
      .returning('*')

    return response.created({
      success: true,
      message: 'Congé créé avec succès',
      holiday: holiday[0],
    })
  }

  /**
   * Obtenir les rapports de session
   */
  public async getSessionReport({ request, response }: HttpContext) {
    const payload = await request.validateUsing(getSessionReportValidator)

    const session = await db.from('academic_sessions').where('id', payload.sessionId).first()

    if (!session) {
      return response.notFound({
        success: false,
        message: 'Session académique non trouvée',
      })
    }

    const report: any = {
      session: session,
      terms: await db
        .from('academic_terms')
        .where('session_id', payload.sessionId)
        .orderBy('term_number', 'asc'),
    }

    if (payload.schoolId) {
      const schoolStats = await db
        .from('student_enrollments')
        .where('session_id', payload.sessionId)
        .whereIn(
          'student_id',
          db.from('students').select('id').where('school_id', payload.schoolId)
        )
        .count('* as total')
        .first()

      report.schoolStats = {
        enrolledStudents: Number(schoolStats?.total) || 0,
      }

      if (payload.includeDetails) {
        const grades = await db
          .from('grades')
          .where('session_id', payload.sessionId)
          .whereIn(
            'student_id',
            db.from('students').select('id').where('school_id', payload.schoolId)
          )
          .avg('score as average')
          .first()

        report.schoolStats.averageGrade = Number(grades?.average) || 0
      }
    } else {
      const allEnrollments = await db
        .from('student_enrollments')
        .where('session_id', payload.sessionId)
        .count('* as total')
        .first()

      report.globalStats = {
        totalEnrollments: Number(allEnrollments?.total) || 0,
      }
    }

    return response.ok({
      success: true,
      report,
    })
  }
}
