import { type HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Class from '#models/class'
import Student from '#models/student'
import Grade from '#models/grade'
import School from '#models/school'
import {
  createTimetableValidator,
  generateReportCardValidator,
  publishGradesValidator,
  createAcademicCalendarValidator,
  getStudentProgressValidator,
  createExamScheduleValidator,
} from '#validators/pedagogical'
import { DateTime } from 'luxon'

export default class PedagogicalController {
  /**
   * Créer l'emploi du temps d'une classe
   */
  public async createTimetable({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(createTimetableValidator)

    // Vérifier que la classe appartient à l'école
    await Class.query()
      .where('id', payload.classId)
      .where('school_id', auth.user!.schoolId)
      .firstOrFail()

    // Utilisation d'une transaction pour la suppression/insertion groupée
    const timetableEntries = await db.transaction(async (trx) => {
      await trx
        .from('timetables')
        .where('class_id', payload.classId)
        .where('academic_year', payload.academicYear)
        .where('term', payload.term)
        .delete()

      const entries = payload.schedule.map((schedule) => ({
        class_id: payload.classId,
        academic_year: payload.academicYear,
        term: payload.term,
        day_of_week: schedule.dayOfWeek,
        start_time: schedule.startTime,
        end_time: schedule.endTime,
        subject_id: schedule.subjectId,
        teacher_id: schedule.teacherId,
        room: schedule.room,
        created_at: new Date(),
      }))

      return await trx.table('timetables').insert(entries).returning('*')
    })

    return response.created({
      success: true,
      message: 'Emploi du temps mis à jour avec succès',
      timetable: timetableEntries,
    })
  }

  /**
   * Obtenir l'emploi du temps d'une classe
   */
  public async getClassTimetable({ params, request, response }: HttpContext) {
    const academicYear = request.input('academic_year')
    const term = request.input('term')

    const query = db
      .from('timetables')
      .where('class_id', params.classId)
      .join('subjects', 'timetables.subject_id', 'subjects.id')
      .join('teachers', 'timetables.teacher_id', 'teachers.id')
      .join('users', 'teachers.user_id', 'users.id')
      .select(
        'timetables.*',
        'subjects.name as subject_name',
        'subjects.code as subject_code',
        'users.first_name as teacher_first_name',
        'users.last_name as teacher_last_name'
      )

    if (academicYear) query.where('academic_year', academicYear)
    if (term) query.where('term', term)

    const timetable = await query.orderBy('day_of_week').orderBy('start_time')

    const dayMap: Record<number, string> = {
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday',
      7: 'sunday',
    }

    const organizedTimetable: Record<string, any[]> = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
    }

    for (const entry of timetable) {
      const dayKey = dayMap[entry.day_of_week] || 'monday'
      if (organizedTimetable[dayKey]) organizedTimetable[dayKey].push(entry)
    }

    return response.ok({ success: true, timetable: organizedTimetable })
  }

  /**
   * Générer un bulletin scolaire
   */
  public async generateReportCard({ request, response }: HttpContext) {
    const payload = await request.validateUsing(generateReportCardValidator)

    const student = await Student.query()
      .where('id', payload.studentId)
      .preload('class')
      .preload('user')
      .preload('school')
      .firstOrFail()

    const grades = await Grade.query()
      .where('student_id', payload.studentId)
      .where('term', payload.term)
      .where('academic_year', payload.academicYear)
      .preload('subject')
      .orderBy('created_at', 'asc')

    const subjectsGrades = new Map()
    for (const grade of grades) {
      if (grade.score === null || !Number.isFinite(grade.score)) continue

      if (!subjectsGrades.has(grade.subjectId)) {
        subjectsGrades.set(grade.subjectId, {
          subject: grade.subject.name,
          coefficient: grade.subject.coefficient,
          scores: [],
          average: 0,
        })
      }
      subjectsGrades.get(grade.subjectId).scores.push(grade.score)
    }

    let totalPoints = 0
    let totalCoefficients = 0

    subjectsGrades.forEach((data) => {
      const sum = data.scores.reduce((a: number, b: number) => a + b, 0)
      data.average = data.scores.length > 0 ? sum / data.scores.length : 0
      totalPoints += data.average * data.coefficient
      totalCoefficients += data.coefficient
    })

    const overallAverage = totalCoefficients > 0 ? totalPoints / totalCoefficients : 0

    const appreciations = await db
      .from('appreciations')
      .where('student_id', payload.studentId)
      .where('term', payload.term)
      .where('academic_year', payload.academicYear)
      .first()

    // Logique simplifiée pour comportement et présence via des requêtes directes
    const behavior = payload.includeBehavior
      ? await this.getStudentBehavior(payload.studentId)
      : null
    const attendance = payload.includeAttendance
      ? await this.getStudentAttendance(payload.studentId)
      : null

    const reportCard = {
      student: {
        name: `${student.user.firstName} ${student.user.lastName}`,
        registrationNumber: student.registrationNumber,
        class: student.class.name,
      },
      school: {
        name: student.school?.name,
        academicYear: payload.academicYear,
        term: payload.term,
      },
      grades: Array.from(subjectsGrades.values()),
      overallAverage,
      appreciation: appreciations?.comment || 'Travail satisfaisant.',
      behavior,
      attendance,
      rank: await this.calculateRank(
        student.id,
        student.classId!,
        payload.term,
        payload.academicYear
      ),
    }

    return response.ok({ success: true, reportCard })
  }

  /**
   * Méthodes privées utilitaires
   */
  private async calculateRank(
    studentId: string,
    classId: string,
    term: string,
    academicYear: string
  ): Promise<number> {
    const averages = await db
      .from('grades')
      .join('students', 'grades.student_id', 'students.id')
      .where('students.class_id', classId)
      .where('grades.term', term)
      .where('grades.academic_year', academicYear)
      .select('grades.student_id')
      .avg('grades.score as average')
      .groupBy('grades.student_id')
      .orderBy('average', 'desc')

    const index = averages.findIndex((a) => a.student_id === studentId)
    return index !== -1 ? index + 1 : 0
  }

  private async getStudentBehavior(studentId: string) {
    const count = await db
      .from('disciplines')
      .where('student_id', studentId)
      .where('incident_date', '>=', DateTime.now().minus({ months: 3 }).toSQLDate())
      .count('* as total')
    return Number.parseInt(count[0].total) === 0 ? 'Excellent' : 'À surveiller'
  }

  private async getStudentAttendance(studentId: string) {
    const data = await db
      .from('attendances')
      .where('student_id', studentId)
      .where('date', '>=', DateTime.now().minus({ months: 3 }).toSQLDate())
      .select(
        db.raw('count(*) as total, count(case when status = "present" then 1 end) as present')
      )

    const total = Number.parseInt(data[0].total)
    return total > 0 ? (Number.parseInt(data[0].present) / total) * 100 : 100
  }

  /**
   * Publier les notes
   */
  public async publishGrades({ request, response }: HttpContext) {
    const payload = await request.validateUsing(publishGradesValidator)

    const updatedCount = await Grade.query()
      .where('class_id', payload.classId)
      .where('term', payload.term)
      .where('academic_year', payload.academicYear)
      .update({
        published: true,
        publishedAt: DateTime.now(),
      })

    return response.ok({
      success: true,
      message: `${updatedCount[0]} notes publiées avec succès`,
    })
  }

  /**
   * Calendrier Académique (Mass Insert)
   */
  public async createAcademicCalendar({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createAcademicCalendarValidator)

    await School.findOrFail(payload.schoolId)

    const events = await db.transaction(async (trx) => {
      await trx
        .from('academic_calendars')
        .where('school_id', payload.schoolId)
        .where('academic_year', payload.academicYear)
        .delete()

      const toInsert = payload.events.map((event) => ({
        ...event,
        school_id: payload.schoolId,
        academic_year: payload.academicYear,
        created_at: new Date(),
      }))

      return await trx.table('academic_calendars').insert(toInsert).returning('*')
    })

    return response.created({ success: true, events })
  }

  /**
   * Suivi de la progression d'un élève
   */
  public async getStudentProgress({ request, response }: HttpContext) {
    // Validation avec VineJS
    const payload = await request.validateUsing(getStudentProgressValidator)

    // Vérifier l'existence de l'élève
    await Student.findOrFail(payload.studentId)

    let query = Grade.query().where('student_id', payload.studentId).preload('subject')

    // Filtres optionnels
    if (payload.startDate) {
      query.where('exam_date', '>=', payload.startDate.toSQLDate()!)
    }
    if (payload.endDate) {
      query.where('exam_date', '<=', payload.endDate.toSQLDate()!)
    }
    if (payload.subjects && payload.subjects.length > 0) {
      query.whereIn('subject_id', payload.subjects)
    }

    const grades = await query.orderBy('exam_date', 'asc')

    // Structuration des données pour le frontend (ex: graphiques)
    const subjectsMap = new Map()

    for (const grade of grades) {
      if (grade.score === null || !Number.isFinite(grade.score)) continue

      if (!subjectsMap.has(grade.subjectId)) {
        subjectsMap.set(grade.subjectId, {
          subject: grade.subject.name,
          data: [],
        })
      }
      subjectsMap.get(grade.subjectId).data.push({
        date: grade.examDate,
        score: grade.score,
        examType: grade.examType,
      })
    }

    return response.ok({
      success: true,
      progress: Array.from(subjectsMap.values()),
    })
  }

  /**
   * Créer le planning des examens
   */
  public async createExamSchedule({ request, response }: HttpContext) {
    // Validation avec VineJS
    const payload = await request.validateUsing(createExamScheduleValidator)

    // Vérifier la classe
    await Class.findOrFail(payload.classId)

    // Utilisation d'une transaction pour garantir l'intégrité atomique
    const exams = await db.transaction(async (trx) => {
      // Supprimer l'ancien planning pour éviter les doublons sur la même période
      await trx
        .from('exam_schedules')
        .where('class_id', payload.classId)
        .where('exam_period', payload.examPeriod)
        .delete()

      // Préparation de l'insertion en masse (Bulk Insert)
      const examsToInsert = payload.exams.map((exam) => ({
        class_id: payload.classId,
        exam_period: payload.examPeriod,
        subject_id: exam.subjectId,
        exam_date: exam.examDate.toSQLDate(),
        start_time: exam.startTime,
        duration: exam.duration,
        room: exam.room,
        max_points: exam.maxPoints,
        created_at: new Date(),
      }))

      // Une seule requête SQL pour tous les examens
      return await trx.table('exam_schedules').insert(examsToInsert).returning('*')
    })

    return response.created({
      success: true,
      message: `Planning des examens créé avec succès (${exams.length} examens)`,
      exams,
    })
  }
}
