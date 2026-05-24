import { type HttpContext } from '@adonisjs/core/http'
import School from '#models/school'
import User from '#models/user'
import Student from '#models/student'
import Teacher from '#models/teacher'
import Class from '#models/class'
import vine from '@vinejs/vine'
import crypto from 'node:crypto'
import { DateTime } from 'luxon'

export default class SchoolController {
  /**
   * Enregistrer une nouvelle école (demande d'inscription)
   */
  public async registerSchool({ request, response, session }: HttpContext) {
    const schema = vine.compile(
      vine.object({
        name: vine.string().trim().maxLength(255).unique({ table: 'schools', column: 'name' }),
        province: vine.string(),
        territory: vine.string(),
        address: vine.string(),
        phone: vine.string(),
        email: vine.string().email().unique({ table: 'schools', column: 'email' }),
        directorName: vine.string(),
        directorPhone: vine.string(),
        directorEmail: vine.string().email().unique({ table: 'users', column: 'email' }),
      })
    )

    const validatedData = await request.validateUsing(schema)

    // Générer un code unique pour l'école
    const schoolCode = `SCH-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`

    const school = await School.create({
      name: validatedData.name,
      code: schoolCode,
      province: validatedData.province,
      territory: validatedData.territory,
      address: validatedData.address,
      phone: validatedData.phone,
      email: validatedData.email,
      status: 'pending',
    })

    // Créer un compte utilisateur pour le directeur
    const tempPassword = crypto.randomBytes(8).toString('hex')
    const [firstName, ...lastNameParts] = validatedData.directorName.split(' ')

    await User.create({
      schoolId: school.id,
      email: validatedData.directorEmail,
      password: tempPassword,
      firstName: firstName,
      lastName: lastNameParts.join(' ') || 'Directeur',
      phone: validatedData.directorPhone,
      role: 'director',
      status: 'pending',
    })

    const result = {
      success: true,
      message: "Demande d'inscription soumise avec succès. En attente d'approbation.",
      school: {
        id: school.id,
        name: school.name,
        code: school.code,
        status: school.status,
      },
    }

    if (request.header('accept')?.includes('text/html')) {
      session.flash('success', result.message)
      return response.redirect('/login')
    }

    return response.created(result)
  }

  /**
   * Dashboard de l'école
   */
  public async dashboard({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (!user.schoolId) {
      return response.badRequest({ success: false, message: 'Utilisateur non associé à une école' })
    }

    const school = await School.findOrFail(user.schoolId)

    // Statistiques avec Lucid 22 (Aggregate queries)
    const [studentsCount] = await Student.query()
      .where('schoolId', school.id)
      .where('academicStatus', 'active')
      .count('* as total')
    const [teachersCount] = await Teacher.query().where('schoolId', school.id).count('* as total')
    const [classesCount] = await Class.query().where('schoolId', school.id).count('* as total')

    const recentStudents = await Student.query()
      .where('schoolId', school.id)
      .orderBy('createdAt', 'desc')
      .limit(5)
      .preload('user')

    // Note: 'receivedMessages' doit être défini dans ton modèle User
    const recentMessages = await user
      .related('receivedMessages')
      .query()
      .orderBy('createdAt', 'desc')
      .limit(5)

    const totalStudents = Number(studentsCount.$extras.total)
    const totalClasses = Number(classesCount.$extras.total)

    return response.ok({
      success: true,
      school: school.serialize(),
      stats: {
        totalStudents,
        totalTeachers: Number(teachersCount.$extras.total),
        totalClasses,
        averageClassSize: totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0,
      },
      recentActivities: {
        students: recentStudents.map((s) => ({
          id: s.id,
          name: s.user.fullName,
          registrationNumber: s.registrationNumber,
          enrolledAt: s.createdAt,
        })),
        messages: recentMessages,
      },
      userRole: user.role,
    })
  }

  /**
   * Mettre à jour le profil de l'école
   */
  public async updateSchoolProfile({ request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const school = await School.findOrFail(user.schoolId)

    const schema = vine.compile(
      vine.object({
        name: vine.string().optional(),
        address: vine.string().optional(),
        phone: vine.string().optional(),
        logoUrl: vine.string().optional(),
      })
    )

    const data = await request.validateUsing(schema)
    school.merge(data)
    await school.save()

    return response.ok({
      success: true,
      message: "Profil de l'école mis à jour",
      school,
    })
  }

  /**
   * Ajouter un enseignant
   */
  public async addTeacher({ request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const schema = vine.compile(
      vine.object({
        firstName: vine.string(),
        lastName: vine.string(),
        email: vine.string().email().unique({ table: 'users', column: 'email' }),
        phone: vine.string(),
        qualification: vine.string(),
        specialization: vine.string(),
      })
    )

    const data = await request.validateUsing(schema)
    const tempPassword = crypto.randomBytes(8).toString('hex')

    // Créer l'utilisateur via transaction recommandée en Lucid 22
    const teacherUser = await User.create({
      schoolId: user.schoolId,
      email: data.email,
      password: tempPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: 'teacher',
      status: 'active',
    })

    const employeeNumber = `TCH-${String(user.schoolId).slice(0, 4)}-${Date.now()}`

    const teacher = await Teacher.create({
      userId: teacherUser.id,
      schoolId: user.schoolId!,
      employeeNumber,
      qualification: data.qualification,
      specialization: data.specialization,
      hireDate: DateTime.now(),
      status: 'active',
    })

    return response.created({
      success: true,
      teacher: { ...teacher.serialize(), user: teacherUser.serialize() },
      credentials: { email: teacherUser.email, temporaryPassword: tempPassword },
    })
  }
}
