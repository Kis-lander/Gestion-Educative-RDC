import { type HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Class from '#models/class'
import Student from '#models/student'
import Grade from '#models/grade'
import Subject from '#models/subject'
import Teacher from '#models/teacher'
import vine from '@vinejs/vine'
import {
  createClassValidator,
  updateClassValidator,
  addGradeValidator,
  updateGradeValidator,
  createSubjectValidator,
} from '#validators/academic'
import { DateTime } from 'luxon'

export default class AcademicController {
  /**
   * ==================== GESTION DES CLASSES ====================
   */

  /**
   * Obtenir toutes les classes de l'école
   */
  public async getClasses({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const academicYear = request.input('academic_year')
    const level = request.input('level')

    const query = Class.query().where('schoolId', user.schoolId)

    if (academicYear) {
      query.where('academicYear', academicYear)
    }
    if (level) {
      query.where('level', level)
    }

    const classes = await query
      .preload('teacher', (teacherQuery) => {
        teacherQuery.preload('user')
      })
      .preload('students', (studentQuery) => {
        studentQuery.where('academicStatus', 'active')
      })
      .orderBy('gradeLevel', 'asc')

    // Ajouter les statistiques pour chaque classe
    const classesWithStats = await Promise.all(
      classes.map(async (classObj) => {
        const studentsCountResult = await Student.query()
          .where('classId', classObj.id)
          .where('academicStatus', 'active')
          .count('*', 'total')

        const averageGradeResult = await Grade.query()
          .where('classId', classObj.id)
          .avg('score', 'average')

        const totalStudents = Number(studentsCountResult[0].$extras.total)
        const average = Number(averageGradeResult[0].$extras.average || 0)

        return {
          ...classObj.toJSON(),
          studentsCount: totalStudents,
          averageGrade: average,
          occupancyRate:
            classObj.maxCapacity > 0 ? (totalStudents / classObj.maxCapacity) * 100 : 0,
        }
      })
    )

    return response.ok({
      success: true,
      classes: classesWithStats,
    })
  }

  /**
   * Obtenir les détails d'une classe
   */
  public async getClassById({ params, response }: HttpContext) {
    const classObj = await Class.query()
      .where('id', params.id)
      .preload('teacher', (teacherQuery) => {
        teacherQuery.preload('user')
      })
      .preload('students', (studentQuery) => {
        studentQuery.where('academicStatus', 'active').preload('user')
      })
      .preload('subjects')
      .firstOrFail()

    // Statistiques de la classe
    const stats = {
      totalStudents: classObj.students.length,
      averageGrade: await this.getClassAverage(classObj.id),
      boysCount: classObj.students.filter((s) => s.gender === 'male').length,
      girlsCount: classObj.students.filter((s) => s.gender === 'female').length,
      attendanceRate: await this.getClassAttendance(classObj.id),
    }

    return response.ok({
      success: true,
      class: classObj,
      stats: stats,
    })
  }

  /**
   * Créer une nouvelle classe
   */
  public async createClass({ request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(createClassValidator)

    // Vérifier qu'une classe avec le même nom n'existe pas pour cette année
    const currentYear = DateTime.now().year.toString()
    const existingClass = await Class.query()
      .where('schoolId', user.schoolId)
      .where('name', payload.name)
      .where('academicYear', currentYear)
      .first()

    if (existingClass) {
      return response.conflict({
        success: false,
        message: 'Une classe avec ce nom existe déjà pour cette année académique',
      })
    }

    const classObj = new Class()
    classObj.schoolId = user.schoolId
    classObj.name = payload.name
    classObj.level = payload.level
    classObj.gradeLevel = payload.gradeLevel
    classObj.maxCapacity = payload.maxCapacity || 50
    classObj.currentEnrollment = 0
    classObj.academicYear = currentYear
    classObj.shift = payload.shift || 'morning'
    classObj.teacherId = payload.teacherId ?? null

    await classObj.save()

    return response.created({
      success: true,
      message: 'Classe créée avec succès',
      class: classObj,
    })
  }

  /**
   * Mettre à jour une classe
   */
  public async updateClass({ request, params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(updateClassValidator)

    const classObj = await Class.query()
      .where('id', params.id)
      .where('schoolId', user.schoolId)
      .firstOrFail()

    classObj.merge(payload)
    await classObj.save()

    return response.ok({
      success: true,
      message: 'Classe mise à jour avec succès',
      class: classObj,
    })
  }

  /**
   * Supprimer une classe
   */
  public async deleteClass({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const classObj = await Class.query()
      .where('id', params.id)
      .where('schoolId', user.schoolId)
      .firstOrFail()

    // Vérifier s'il y a des élèves dans la classe
    const studentsCountResult = await Student.query()
      .where('classId', classObj.id)
      .where('academicStatus', 'active')
      .count('*', 'total')

    if (Number(studentsCountResult[0].$extras.total) > 0) {
      return response.badRequest({
        success: false,
        message: 'Impossible de supprimer une classe qui contient des élèves',
      })
    }

    await classObj.delete()

    return response.ok({
      success: true,
      message: 'Classe supprimée avec succès',
    })
  }

  /**
   * Obtenir les élèves d'une classe
   */
  public async getClassStudents({ params, request, response }: HttpContext) {
    const search = request.input('search')
    const status = request.input('status', 'active')

    const query = Student.query()
      .where('classId', params.id)
      .where('academicStatus', status)
      .preload('user')
      .preload('parents', (parentQuery) => {
        parentQuery.preload('user')
      })

    if (search) {
      query.whereHas('user', (userQuery) => {
        userQuery
          .where('firstName', 'ILIKE', `%${search}%`)
          .orWhere('lastName', 'ILIKE', `%${search}%`)
      })
    }

    const students = await query.orderBy('createdAt', 'desc')

    // Ajouter les moyennes pour chaque élève
    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        const averageGradeResult = await Grade.query()
          .where('studentId', student.id)
          .avg('score', 'average')

        return {
          ...student.toJSON(),
          averageGrade: Number(averageGradeResult[0].$extras.average || 0),
        }
      })
    )

    return response.ok({
      success: true,
      students: studentsWithStats,
      total: students.length,
    })
  }

  /**
   * ==================== GESTION DES MATIÈRES ====================
   */

  /**
   * Obtenir toutes les matières
   */
  public async getSubjects({ response }: HttpContext) {
    const subjects = await Subject.query().orderBy('name', 'asc')

    return response.ok({
      success: true,
      subjects: subjects,
    })
  }

  /**
   * Créer une nouvelle matière
   */
  public async createSubject({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createSubjectValidator)

    const subject = new Subject()
    subject.name = payload.name
    subject.code = payload.code.toUpperCase()
    subject.description = payload.description || ''
    subject.coefficient = payload.coefficient || 1

    await subject.save()

    return response.created({
      success: true,
      message: 'Matière créée avec succès',
      subject: subject,
    })
  }

  /**
   * Mettre à jour une matière
   */
  public async updateSubject({ request, params, response }: HttpContext) {
    const updateSubjectSchema = vine.compile(
      vine.object({
        name: vine.string().trim().maxLength(100).optional(),
        description: vine.string().trim().optional(),
        coefficient: vine.number().range([1, 5]).optional(),
      })
    )
    const payload = await request.validateUsing(updateSubjectSchema)

    const subject = await Subject.findOrFail(params.id)
    subject.merge(payload)
    await subject.save()

    return response.ok({
      success: true,
      message: 'Matière mise à jour avec succès',
      subject: subject,
    })
  }

  /**
   * Supprimer une matière
   */
  public async deleteSubject({ params, response }: HttpContext) {
    const subject = await Subject.findOrFail(params.id)

    // Vérifier si la matière est utilisée dans des notes
    const gradesCountResult = await Grade.query().where('subjectId', subject.id).count('*', 'total')

    if (Number(gradesCountResult[0].$extras.total) > 0) {
      return response.badRequest({
        success: false,
        message: 'Impossible de supprimer une matière qui a des notes associées',
      })
    }

    await subject.delete()

    return response.ok({
      success: true,
      message: 'Matière supprimée avec succès',
    })
  }

  /**
   * Assigner une matière à une classe
   */
  public async addSubjectToClass({ request, params, response }: HttpContext) {
    const assignmentSchema = vine.compile(
      vine.object({
        subjectId: vine.string().exists({ table: 'subjects', column: 'id' }),
        teacherId: vine.string().exists({ table: 'teachers', column: 'id' }),
        hoursPerWeek: vine.number().range([1, 20]).optional(),
      })
    )
    const payload = await request.validateUsing(assignmentSchema)

    const classObj = await Class.findOrFail(params.classId)

    // Vérifier si la matière est déjà assignée
    const existingAssignment = await db
      .from('class_subject')
      .where('class_id', classObj.id)
      .where('subject_id', payload.subjectId)
      .first()

    if (existingAssignment) {
      return response.conflict({
        success: false,
        message: 'Cette matière est déjà assignée à cette classe',
      })
    }

    await db.table('class_subject').insert({
      class_id: classObj.id,
      subject_id: payload.subjectId,
      teacher_id: payload.teacherId,
      hours_per_week: payload.hoursPerWeek || 4,
      created_at: DateTime.now().toSQL(),
    })

    return response.created({
      success: true,
      message: 'Matière assignée à la classe avec succès',
    })
  }

  /**
   * Obtenir les matières d'une classe
   */
  public async getClassSubjects({ params, response }: HttpContext) {
    const subjects = await db
      .from('class_subject')
      .where('class_id', params.classId)
      .join('subjects', 'class_subject.subject_id', 'subjects.id')
      .join('teachers', 'class_subject.teacher_id', 'teachers.id')
      .join('users', 'teachers.user_id', 'users.id')
      .select(
        'class_subject.*',
        'subjects.name as subject_name',
        'subjects.code as subject_code',
        'subjects.coefficient',
        'users.first_name as teacher_first_name',
        'users.last_name as teacher_last_name'
      )

    return response.ok({
      success: true,
      subjects: subjects,
    })
  }

  /**
   * ==================== GESTION DES NOTES (GRADES) ====================
   */

  /**
   * Obtenir les notes d'une classe
   */
  public async getGradesByClass({ params, request, response }: HttpContext) {
    const term = request.input('term')
    const academicYear = request.input('academic_year')
    const subjectId = request.input('subject_id')

    const query = Grade.query()
      .where('classId', params.classId)
      .preload('student', (studentQuery) => {
        studentQuery.preload('user')
      })
      .preload('subject')

    if (term) query.where('term', term)
    if (academicYear) query.where('academicYear', academicYear)
    if (subjectId) query.where('subjectId', subjectId)

    const grades = await query.orderBy('examDate', 'desc')

    // Organiser les notes par élève
    const gradesByStudent = new Map()

    for (const grade of grades) {
      const studentId = grade.studentId
      if (!gradesByStudent.has(studentId)) {
        gradesByStudent.set(studentId, {
          student: grade.student,
          grades: [],
          average: 0,
        })
      }
      gradesByStudent.get(studentId).grades.push(grade)
    }

    // Calculer les moyennes
    for (const data of gradesByStudent.values()) {
      const numericScores = data.grades
        .map((grade: Grade) => grade.score)
        .filter((score: number | null): score is number => score !== null && Number.isFinite(score))
      const sum = numericScores.reduce((acc: number, score: number) => acc + score, 0)
      data.average = numericScores.length > 0 ? sum / numericScores.length : 0
    }

    return response.ok({
      success: true,
      gradesByStudent: Array.from(gradesByStudent.values()),
      totalGrades: grades.length,
    })
  }

  /**
   * Obtenir les notes d'un élève
   */
  public async getGradesByStudent({ params, request, response }: HttpContext) {
    const term = request.input('term')
    const academicYear = request.input('academic_year')

    const query = Grade.query()
      .where('studentId', params.studentId)
      .preload('subject')
      .preload('class')

    if (term) query.where('term', term)
    if (academicYear) query.where('academicYear', academicYear)

    const grades = await query.orderBy('examDate', 'desc')

    // Calculer les moyennes par matière
    const subjectsMap = new Map()
    let totalPoints = 0
    let totalCoefficients = 0

    for (const grade of grades) {
      if (grade.score === null || !Number.isFinite(grade.score)) continue

      const subjectId = grade.subjectId
      if (!subjectsMap.has(subjectId)) {
        subjectsMap.set(subjectId, {
          subject: grade.subject.name,
          coefficient: grade.subject.coefficient,
          grades: [],
          average: 0,
          best: 0,
          worst: 20,
        })
      }
      const data = subjectsMap.get(subjectId)
      data.grades.push(grade.score)
      if (grade.score > data.best) data.best = grade.score
      if (grade.score < data.worst) data.worst = grade.score
    }

    for (const data of subjectsMap.values()) {
      const sum = data.grades.reduce((a: number, b: number) => a + b, 0)
      data.average = data.grades.length > 0 ? sum / data.grades.length : 0
      totalPoints += data.average * data.coefficient
      totalCoefficients += data.coefficient
    }

    const overallAverage = totalCoefficients > 0 ? totalPoints / totalCoefficients : 0

    return response.ok({
      success: true,
      grades: grades,
      subjectsSummary: Array.from(subjectsMap.values()),
      overallAverage: overallAverage,
    })
  }

  /**
   * Ajouter une note
   */
  public async addGrade({ request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(addGradeValidator)

    // Vérifier que l'utilisateur a le droit d'ajouter une note
    const teacher = await Teacher.query()
      .where('userId', user.id)
      .where('schoolId', user.schoolId)
      .first()

    if (!teacher && user.role !== 'director') {
      return response.forbidden({
        success: false,
        message: "Vous n'êtes pas autorisé à ajouter des notes",
      })
    }

    // Vérifier que l'élève est bien dans la classe
    const student = await Student.query()
      .where('id', payload.studentId)
      .where('classId', payload.classId)
      .first()

    if (!student) {
      return response.badRequest({
        success: false,
        message: "Cet élève n'appartient pas à la classe spécifiée",
      })
    }

    // Vérifier si une note existe déjà pour cet examen
    const existingGrade = await Grade.query()
      .where('studentId', payload.studentId)
      .where('subjectId', payload.subjectId)
      .where('term', payload.term)
      .where('examType', payload.examType)
      .first()

    if (existingGrade) {
      return response.conflict({
        success: false,
        message: 'Une note existe déjà pour cet examen',
      })
    }

    const grade = new Grade()
    grade.fill({
      ...payload,
      percentage: (payload.score / (payload.maxScore || 20)) * 100,
      published: false,
    })

    await grade.save()

    return response.created({
      success: true,
      message: 'Note ajoutée avec succès',
      grade: grade,
    })
  }

  /**
   * Mettre à jour une note
   */
  public async updateGrade({ request, params, response }: HttpContext) {
    const payload = await request.validateUsing(updateGradeValidator)

    const grade = await Grade.findOrFail(params.id)

    if (payload.score !== undefined) {
      grade.score = payload.score
      grade.percentage = grade.maxScore > 0 ? (grade.score / grade.maxScore) * 100 : 0
    }
    if (payload.teacherComments !== undefined) grade.teacherComments = payload.teacherComments
    if (payload.published !== undefined) {
      grade.published = payload.published
      if (payload.published) {
        grade.publishedAt = DateTime.now()
      }
    }

    await grade.save()

    return response.ok({
      success: true,
      message: 'Note mise à jour avec succès',
      grade: grade,
    })
  }

  /**
   * Publier les notes d'une classe
   */
  public async publishGrades({ request, response }: HttpContext) {
    const publishSchema = vine.compile(
      vine.object({
        classId: vine.string().exists({ table: 'classes', column: 'id' }),
        term: vine.string().trim(),
        academicYear: vine.string().trim(),
        notifyParents: vine.boolean().optional(),
      })
    )
    const payload = await request.validateUsing(publishSchema)

    const updatedRows = await Grade.query()
      .where('classId', payload.classId)
      .where('term', payload.term)
      .where('academicYear', payload.academicYear)
      .update({
        published: true,
        publishedAt: DateTime.now().toSQL(),
      })

    // Notifier les parents si demandé
    if (payload.notifyParents) {
      const students = await Student.query()
        .where('classId', payload.classId)
        .preload('parents', (parentQuery) => {
          parentQuery.preload('user')
        })

      for (const student of students) {
        for (const parent of student.parents) {
          await db.table('notifications').insert({
            user_id: parent.userId,
            type: 'grades_published',
            title: 'Notes publiées',
            content: `Les notes du ${payload.term} pour votre enfant ${student.user?.firstName} ${student.user?.lastName} sont disponibles sur la plateforme.`,
            created_at: DateTime.now().toSQL(),
          })
        }
      }
    }

    return response.ok({
      success: true,
      message: `${updatedRows[0]} note(s) publiée(s) avec succès`,
    })
  }

  /**
   * Supprimer une note
   */
  public async deleteGrade({ params, response }: HttpContext) {
    const grade = await Grade.findOrFail(params.id)
    await grade.delete()

    return response.ok({
      success: true,
      message: 'Note supprimée avec succès',
    })
  }

  /**
   * ==================== MÉTHODES PRIVÉES ====================
   */

  /**
   * Calculer la moyenne d'une classe
   */
  private async getClassAverage(classId: string): Promise<number> {
    const result = await Grade.query().where('classId', classId).avg('score', 'average')

    return Number(result[0].$extras.average || 0)
  }

  /**
   * Calculer le taux de présence d'une classe
   */
  private async getClassAttendance(classId: string): Promise<number> {
    const result = await db
      .from('attendances')
      .where('class_id', classId)
      .where('status', 'present')
      .count('*', 'present')
      .first()

    const totalResult = await db
      .from('attendances')
      .where('class_id', classId)
      .count('*', 'total')
      .first()

    const total = Number(totalResult?.total || 0)
    if (total === 0) return 0

    return (Number(result?.present || 0) / total) * 100
  }

  /**
   * ==================== STATISTIQUES ACADÉMIQUES ====================
   */

  /**
   * Obtenir les statistiques académiques
   */
  public async getAcademicStats({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const academicYear = request.input('academic_year', DateTime.now().year.toString())

    // Statistiques générales
    const totalStudentsResult = await Student.query()
      .where('schoolId', user.schoolId)
      .where('academicStatus', 'active')
      .count('*', 'total')

    const totalClassesResult = await Class.query()
      .where('schoolId', user.schoolId)
      .where('academicYear', academicYear)
      .count('*', 'total')

    const averageGradeResult = await Grade.query()
      .whereHas('student', (query) => {
        query.where('schoolId', user.schoolId)
      })
      .avg('score', 'average')

    // Répartition par niveau
    const studentsByLevel = await db
      .from('students')
      .join('classes', 'students.class_id', 'classes.id')
      .where('students.school_id', user.schoolId)
      .where('students.academic_status', 'active')
      .select('classes.level')
      .count('*', 'total')
      .groupBy('classes.level')

    // Performance par matière
    const performanceBySubject = await db
      .from('grades')
      .join('subjects', 'grades.subject_id', 'subjects.id')
      .join('students', 'grades.student_id', 'students.id')
      .where('students.school_id', user.schoolId)
      .select('subjects.name', 'subjects.code')
      .avg('grades.score as average')
      .groupBy('subjects.name', 'subjects.code')
      .orderBy('average', 'desc')

    return response.ok({
      success: true,
      stats: {
        totalStudents: Number(totalStudentsResult[0].$extras.total),
        totalClasses: Number(totalClassesResult[0].$extras.total),
        averageGrade: Number(averageGradeResult[0].$extras.average || 0),
        studentsByLevel,
        performanceBySubject,
      },
    })
  }

  /**
   * Obtenir les statistiques de progression
   */
  public async getProgressStats({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const classId = request.input('class_id')
    const startDate = request.input('start_date')
    const endDate = request.input('end_date')

    const query = Grade.query()
      .whereHas('student', (studentQuery) => {
        studentQuery.where('schoolId', user.schoolId)
        if (classId) {
          studentQuery.where('classId', classId)
        }
      })
      .preload('subject')

    if (startDate) {
      query.where('examDate', '>=', startDate)
    }
    if (endDate) {
      query.where('examDate', '<=', endDate)
    }

    const grades = await query.orderBy('examDate', 'asc')

    // Progression par matière
    const progressionBySubject = new Map()

    for (const grade of grades) {
      const subjectId = grade.subjectId
      if (!progressionBySubject.has(subjectId)) {
        progressionBySubject.set(subjectId, {
          subject: grade.subject.name,
          data: [],
        })
      }
      progressionBySubject.get(subjectId).data.push({
        date: grade.examDate,
        average: grade.score ?? 0,
      })
    }

    return response.ok({
      success: true,
      progression: Array.from(progressionBySubject.values()),
    })
  }
}
