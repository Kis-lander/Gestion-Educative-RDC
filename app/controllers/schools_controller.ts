import { type HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import School from '#models/school'
import User from '#models/user'
import Student from '#models/student'
import Teacher from '#models/teacher'
import Parent from '#models/parent'
import Class from '#models/class'
import Subject from '#models/subject'
import OtpMailService from '#services/otp_mail_service'
import vine from '@vinejs/vine'
import crypto from 'node:crypto'
import { DateTime } from 'luxon'

export default class SchoolController {
  private mailService = new OtpMailService()

  private getPaginationMeta(paginator: { toJSON: () => any }) {
    const meta = paginator.toJSON().meta

    return {
      total: meta.total,
      perPage: meta.perPage,
      currentPage: meta.currentPage,
      lastPage: meta.lastPage,
      from: meta.total ? (meta.currentPage - 1) * meta.perPage + 1 : 0,
      to: Math.min(meta.currentPage * meta.perPage, meta.total),
    }
  }

  private getFallbackSchool(user: { schoolId?: string | null }) {
    return {
      id: user.schoolId,
      name: 'Gestion Éducative RDC',
    }
  }

  private splitFullName(fullName: string) {
    const [firstName, ...lastNameParts] = fullName.trim().split(/\s+/)

    return {
      firstName,
      lastName: lastNameParts.join(' ') || 'Directeur',
    }
  }

  private getRoleLabel(role: User['role']) {
    const labels: Record<User['role'], string> = {
      inspection: 'Inspection',
      director: "Direction d'école",
      finance_director: 'Direction financière',
      teacher: 'Enseignant',
      parent: 'Parent',
      student: 'Élève',
      discipline_director: 'Direction de discipline',
    }

    return labels[role]
  }

  private async getSchoolName(schoolId?: string | null) {
    if (!schoolId) return 'Gestion Éducative RDC'
    const school = await School.find(schoolId)
    return school?.name || 'Gestion Éducative RDC'
  }

  private getRdcDasClassCatalog() {
    return [
      { name: '1ère Maternelle', level: 'Maternelle', gradeLevel: 1 },
      { name: '2ème Maternelle', level: 'Maternelle', gradeLevel: 2 },
      { name: '3ème Maternelle', level: 'Maternelle', gradeLevel: 3 },
      { name: '1ère Primaire', level: 'Primaire', gradeLevel: 1 },
      { name: '2ème Primaire', level: 'Primaire', gradeLevel: 2 },
      { name: '3ème Primaire', level: 'Primaire', gradeLevel: 3 },
      { name: '4ème Primaire', level: 'Primaire', gradeLevel: 4 },
      { name: '5ème Primaire', level: 'Primaire', gradeLevel: 5 },
      { name: '6ème Primaire', level: 'Primaire', gradeLevel: 6 },
      { name: '7ème Éducation de base', level: 'Éducation de base', gradeLevel: 7 },
      { name: '8ème Éducation de base', level: 'Éducation de base', gradeLevel: 8 },
      { name: '1ère Humanités', level: 'Humanités', gradeLevel: 9 },
      { name: '2ème Humanités', level: 'Humanités', gradeLevel: 10 },
      { name: '3ème Humanités', level: 'Humanités', gradeLevel: 11 },
      { name: '4ème Humanités', level: 'Humanités', gradeLevel: 12 },
    ]
  }

  private async ensureRdcDasClasses(schoolId?: string | null) {
    if (!schoolId) return

    const currentYear = DateTime.now().year.toString()
    const existingCount = await Class.query()
      .where('schoolId', schoolId)
      .where('academicYear', currentYear)
      .count('* as total')
      .first()

    if (Number(existingCount?.$extras.total || 0) > 0) return

    await Class.createMany(
      this.getRdcDasClassCatalog().map((classItem) => ({
        schoolId,
        name: classItem.name,
        level: classItem.level,
        gradeLevel: classItem.gradeLevel,
        maxCapacity: 50,
        currentEnrollment: 0,
        academicYear: currentYear,
        shift: 'morning' as const,
        teacherId: null,
      }))
    )
  }

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

    let school: School
    const tempPassword = crypto.randomBytes(8).toString('hex')
    const directorName = this.splitFullName(validatedData.directorName)

    await db.transaction(async (trx) => {
      school = new School()
      school.useTransaction(trx)
      school.merge({
        name: validatedData.name,
        code: schoolCode,
        province: validatedData.province,
        territory: validatedData.territory,
        address: validatedData.address,
        phone: validatedData.phone,
        email: validatedData.email,
        status: 'pending',
      })
      await school.save()

    // Créer un compte utilisateur pour le directeur
    const director = new User()
      director.useTransaction(trx)
      director.merge({
        schoolId: school.id,
        email: validatedData.directorEmail.trim().toLowerCase(),
        password: tempPassword,
        firstName: directorName.firstName,
        lastName: directorName.lastName,
        phone: validatedData.directorPhone,
        role: 'director',
        status: 'pending',
      })
      await director.save()
    })


    const result = {
      success: true,
      message: "Demande d'inscription soumise avec succès. En attente d'approbation.",
      school: {
        id: school!.id,
        name: school!.name,
        code: school!.code,
        status: school!.status,
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
  public async updateSchoolProfile({ request, auth, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const school = await School.findOrFail(user.schoolId)

    const schema = vine.compile(
      vine.object({
        name: vine.string().optional(),
        province: vine.string().optional(),
        territory: vine.string().optional(),
        address: vine.string().optional(),
        phone: vine.string().optional(),
        email: vine.string().email().optional(),
        logoUrl: vine.string().optional(),
      })
    )

    const data = await request.validateUsing(schema)
    school.merge({
      ...data,
      hasElectricity: request.input('hasElectricity') === 'on',
      hasInternet: request.input('hasInternet') === 'on',
      hasLibrary: request.input('hasLibrary') === 'on',
    })
    await school.save()

    if (request.header('accept')?.includes('text/html')) {
      session.flash('success', "Profil de l'Ã©cole mis Ã  jour")
      return response.redirect('/schools/profile')
    }

    return response.ok({
      success: true,
      message: "Profil de l'école mis à jour",
      school,
    })
  }

  /**
   * Ajouter un enseignant
   */
  public async teachersPage({ auth, request, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const page = Number(request.input('page', 1))
    const status = request.input('status')
    const qualification = request.input('qualification')
    const search = String(request.input('search', '')).trim()

    const query = Teacher.query()
      .where('schoolId', user.schoolId)
      .preload('user')
      .if(status, (teacherQuery) => teacherQuery.where('status', status))
      .if(qualification, (teacherQuery) => teacherQuery.where('qualification', qualification))
      .if(search, (teacherQuery) => {
        teacherQuery.where((searchQuery) => {
          searchQuery.whereILike('employeeNumber', `%${search}%`).orWhereHas('user', (userQuery) => {
            userQuery
              .whereILike('firstName', `%${search}%`)
              .orWhereILike('lastName', `%${search}%`)
              .orWhereILike('email', `%${search}%`)
          })
        })
      })
      .orderBy('createdAt', 'desc')

    const paginator = await query.paginate(page, 20)
    const [total, active, subjectsCount] = await Promise.all([
      Teacher.query().where('schoolId', user.schoolId).count('* as total').first(),
      Teacher.query().where('schoolId', user.schoolId).where('status', 'active').count('* as total').first(),
      Subject.query().count('* as total').first(),
    ])

    return view.render('schools/teachers/index', {
      school: this.getFallbackSchool(user),
      teachers: paginator.all().map((teacher) => ({
        ...teacher.serialize(),
        user: teacher.user,
        subjectsCount: 0,
        classesCount: 0,
      })),
      pagination: this.getPaginationMeta(paginator),
      url: '/schools/teachers',
      stats: {
        total: Number(total?.$extras.total || 0),
        active: Number(active?.$extras.total || 0),
        qualified: Number(active?.$extras.total || 0),
        subjectsCount: Number(subjectsCount?.$extras.total || 0),
        totalHours: 0,
      },
    })
  }

  public async createTeacherPage({ auth, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const subjects = await Subject.query().orderBy('name', 'asc')

    return view.render('schools/teachers/create', {
      school: this.getFallbackSchool(user),
      subjects,
    })
  }

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

    if (request.header('accept')?.includes('text/html')) {
      return response.redirect('/schools/teachers')
    }

    return response.created({
      success: true,
      teacher: { ...teacher.serialize(), user: teacherUser.serialize() },
      credentials: { email: teacherUser.email, temporaryPassword: tempPassword },
    })
  }

  public async createAccountPage({ auth, view }: HttpContext) {
    const user = auth.getUserOrFail()
    await this.ensureRdcDasClasses(user.schoolId)

    const [classes, students] = await Promise.all([
      Class.query()
        .where('schoolId', user.schoolId)
        .orderBy('gradeLevel', 'asc')
        .orderBy('name', 'asc'),
      Student.query()
        .where('schoolId', user.schoolId)
        .where('academicStatus', 'active')
        .preload('user')
        .preload('class')
        .orderBy('createdAt', 'desc'),
    ])

    return view.render('schools/accounts/create', {
      school: this.getFallbackSchool(user),
      classes,
      students,
      roles: [
        { value: 'teacher', label: 'Enseignant' },
        { value: 'discipline_director', label: 'Directeur de discipline' },
        { value: 'finance_director', label: 'Directeur financier' },
        { value: 'student', label: 'Élève' },
        { value: 'parent', label: 'Parent' },
      ],
    })
  }

  public async accountsPage({ auth, request, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const search = String(request.input('search', '')).trim()
    const role = request.input('role')

    const accounts = await User.query()
      .where('schoolId', user.schoolId)
      .whereIn('role', ['teacher', 'discipline_director', 'finance_director', 'student', 'parent'])
      .if(role, (query) => query.where('role', role))
      .if(search, (query) => {
        query.where((searchQuery) => {
          searchQuery
            .whereILike('firstName', `%${search}%`)
            .orWhereILike('lastName', `%${search}%`)
            .orWhereILike('email', `%${search}%`)
        })
      })
      .orderBy('createdAt', 'desc')

    return view.render('schools/accounts/index', {
      school: this.getFallbackSchool(user),
      accounts: accounts.map((account) => ({
        id: account.id,
        fullName: account.fullName,
        email: account.email,
        phone: account.phone || '-',
        role: account.role,
        roleLabel: this.getRoleLabel(account.role),
        status: account.status,
      })),
      selectedRole: role || '',
      search,
      roles: [
        { value: 'teacher', label: 'Enseignant' },
        { value: 'discipline_director', label: 'Directeur de discipline' },
        { value: 'finance_director', label: 'Directeur financier' },
        { value: 'student', label: 'Élève' },
        { value: 'parent', label: 'Parent' },
      ],
    })
  }

  public async editAccountPage({ auth, params, view }: HttpContext) {
    const director = auth.getUserOrFail()
    await this.ensureRdcDasClasses(director.schoolId)

    const account = await User.query()
      .where('id', params.id)
      .where('schoolId', director.schoolId)
      .whereIn('role', ['teacher', 'discipline_director', 'finance_director', 'student', 'parent'])
      .firstOrFail()

    const [classes, students, teacher, student, parent] = await Promise.all([
      Class.query().where('schoolId', director.schoolId).orderBy('gradeLevel', 'asc').orderBy('name', 'asc'),
      Student.query()
        .where('schoolId', director.schoolId)
        .where('academicStatus', 'active')
        .preload('user')
        .preload('class')
        .orderBy('createdAt', 'desc'),
      Teacher.query().where('userId', account.id).first(),
      Student.query().where('userId', account.id).first(),
      Parent.query().where('userId', account.id).first(),
    ])

    let selectedChildrenIds: string[] = []
    if (parent) {
      const links = await db.from('parent_student').where('parent_id', parent.id).select('student_id')
      selectedChildrenIds = links.map((link) => link.student_id)
    }

    return view.render('schools/accounts/edit', {
      school: this.getFallbackSchool(director),
      account,
      teacher,
      student,
      parent,
      classes,
      students,
      selectedChildrenIds,
      roleLabel: this.getRoleLabel(account.role),
    })
  }

  public async updateAccount({ auth, params, request, response, session }: HttpContext) {
    const director = auth.getUserOrFail()
    const account = await User.query()
      .where('id', params.id)
      .where('schoolId', director.schoolId)
      .whereIn('role', ['teacher', 'discipline_director', 'finance_director', 'student', 'parent'])
      .firstOrFail()

    const schema = vine.compile(
      vine.object({
        firstName: vine.string().trim(),
        postnom: vine.string().trim().optional(),
        lastName: vine.string().trim(),
        email: vine.string().trim().email(),
        phone: vine.string().trim().optional(),
        status: vine.enum(['active', 'inactive', 'suspended', 'pending']).optional(),
        qualification: vine.string().trim().optional(),
        specialization: vine.string().trim().optional(),
        classId: vine.string().optional(),
        birthDate: vine.date({ formats: ['YYYY-MM-DD'] }).optional(),
        birthPlace: vine.string().trim().optional(),
        nationality: vine.string().trim().optional(),
        gender: vine.enum(['male', 'female']).optional(),
        parentPhone: vine.string().trim().optional(),
        address: vine.string().trim().optional(),
        medicalInfo: vine.string().trim().optional(),
        relationship: vine.string().trim().optional(),
        profession: vine.string().trim().optional(),
        emergencyPhone: vine.string().trim().optional(),
        childrenIds: vine.array(vine.string()).optional(),
      })
    )
    const payload = await request.validateUsing(schema)
    const email = payload.email.trim().toLowerCase()
    const existingEmail = await User.query().where('email', email).whereNot('id', account.id).first()

    if (existingEmail) {
      session.flash('error', 'Cette adresse email est déjà utilisée par un autre compte.')
      return response.redirect().back()
    }

    if (account.role === 'parent' && (!payload.relationship || !payload.childrenIds?.length)) {
      session.flash('error', 'Le lien de parenté et au moins un élève rattaché sont requis pour un parent.')
      return response.redirect().back()
    }

    await db.transaction(async (trx) => {
      account.useTransaction(trx)
      account.firstName = payload.firstName
      account.postnom = account.role === 'student' ? payload.postnom || null : account.postnom
      account.lastName = payload.lastName
      account.email = email
      account.phone = payload.phone || null
      account.status = payload.status || account.status
      await account.save()

      if (account.role === 'teacher') {
        const teacher = await Teacher.query({ client: trx }).where('userId', account.id).first()
        if (teacher) {
          teacher.qualification = payload.qualification || teacher.qualification
          teacher.specialization = payload.specialization || ''
          await teacher.save()
        }
      }

      if (account.role === 'student') {
        const student = await Student.query({ client: trx }).where('userId', account.id).first()
        if (student) {
          student.classId = payload.classId || null
          if (payload.birthDate) student.birthDate = payload.birthDate
          student.birthPlace = payload.birthPlace || ''
          student.nationality = payload.nationality || 'Congolaise'
          if (payload.gender) student.gender = payload.gender
          student.parentPhone = payload.parentPhone || student.parentPhone
          student.address = payload.address || ''
          student.medicalInfo = payload.medicalInfo || null
          await student.save()
        }
      }

      if (account.role === 'parent') {
        const parent = await Parent.query({ client: trx }).where('userId', account.id).first()
        if (parent) {
          parent.relationship = payload.relationship || parent.relationship
          parent.profession = payload.profession || null
          parent.emergencyPhone = payload.emergencyPhone || payload.phone || parent.emergencyPhone
          await parent.save()

          if (payload.childrenIds) {
            const validChildren = await Student.query({ client: trx })
              .whereIn('id', payload.childrenIds)
              .where('schoolId', director.schoolId)

            if (validChildren.length !== payload.childrenIds.length) {
              throw new Error("Un des élèves sélectionnés n'appartient pas à votre école.")
            }

            await trx.from('parent_student').where('parent_id', parent.id).delete()
            if (validChildren.length) {
              await trx.table('parent_student').insert(
                validChildren.map((student, index) => ({
                  parent_id: parent.id,
                  student_id: student.id,
                  is_primary: index === 0,
                  created_at: new Date(),
                  updated_at: new Date(),
                }))
              )
            }
          }
        }
      }
    })

    session.flash('success', 'Compte modifié avec succès.')
    return response.redirect('/schools/accounts')
  }

  public async storeAccount({ auth, request, response, session, view }: HttpContext) {
    const director = auth.getUserOrFail()

    if (!director.schoolId) {
      session.flash('error', "Votre compte n'est lié à aucune école.")
      return response.redirect('/dashboard')
    }

    const schema = vine.compile(
      vine.object({
        role: vine.enum(['teacher', 'discipline_director', 'finance_director', 'student', 'parent']),
        firstName: vine.string().trim(),
        postnom: vine.string().trim().optional(),
        lastName: vine.string().trim(),
        email: vine.string().trim().email().unique({ table: 'users', column: 'email' }),
        phone: vine.string().trim().optional(),
        qualification: vine.string().trim().optional(),
        specialization: vine.string().trim().optional(),
        classId: vine.string().optional(),
        birthDate: vine.date({ formats: ['YYYY-MM-DD'] }).optional(),
        birthPlace: vine.string().trim().optional(),
        nationality: vine.string().trim().optional(),
        gender: vine.enum(['male', 'female']).optional(),
        parentPhone: vine.string().trim().optional(),
        address: vine.string().trim().optional(),
        medicalInfo: vine.string().trim().optional(),
        relationship: vine.string().trim().optional(),
        profession: vine.string().trim().optional(),
        emergencyPhone: vine.string().trim().optional(),
        childrenIds: vine.array(vine.string()).optional(),
      })
    )
    const payload = await request.validateUsing(schema)

    if (payload.role === 'student' && (!payload.birthDate || !payload.gender || !payload.parentPhone)) {
      session.flash('error', "La date de naissance, le sexe et le téléphone parent sont requis pour un élève.")
      return response.redirect().back()
    }

    if (payload.role === 'parent' && (!payload.relationship || !payload.childrenIds?.length)) {
      session.flash('error', 'Le lien de parenté et au moins un élève lié sont requis pour un parent.')
      return response.redirect().back()
    }

    const tempPassword = crypto.randomBytes(8).toString('hex')
    const email = payload.email.trim().toLowerCase()
    const school = await School.find(director.schoolId)
    let createdUser: User
    let profileReference = ''

    await db.transaction(async (trx) => {
      createdUser = new User()
      createdUser.useTransaction(trx)
      createdUser.schoolId = director.schoolId
      createdUser.firstName = payload.firstName
      createdUser.postnom = payload.role === 'student' ? payload.postnom || null : null
      createdUser.lastName = payload.lastName
      createdUser.email = email
      createdUser.phone = payload.phone || null
      createdUser.password = tempPassword
      createdUser.role = payload.role
      createdUser.status = 'active'
      await createdUser.save()

      if (payload.role === 'teacher') {
        const teacher = new Teacher()
        teacher.useTransaction(trx)
        teacher.userId = createdUser.id
        teacher.schoolId = director.schoolId!
        teacher.employeeNumber = `TCH-${String(director.schoolId).slice(0, 4)}-${Date.now()}`
        teacher.qualification = payload.qualification || 'Non renseignée'
        teacher.specialization = payload.specialization || ''
        teacher.hireDate = DateTime.now()
        teacher.status = 'active'
        await teacher.save()
        profileReference = teacher.employeeNumber
      }

      if (payload.role === 'student') {
        const student = new Student()
        student.useTransaction(trx)
        student.userId = createdUser.id
        student.schoolId = director.schoolId!
        student.classId = payload.classId || null
        student.registrationNumber = `STU-${Date.now()}`
        student.birthDate = payload.birthDate!
        student.birthPlace = payload.birthPlace || ''
        student.nationality = payload.nationality || 'Congolaise'
        student.gender = payload.gender!
        student.parentPhone = payload.parentPhone!
        student.address = payload.address || ''
        student.medicalInfo = payload.medicalInfo || null
        student.academicStatus = 'active'
        student.shift = 'morning'
        await student.save()
        profileReference = student.registrationNumber
      }

      if (payload.role === 'parent') {
        const parent = new Parent()
        parent.useTransaction(trx)
        parent.userId = createdUser.id
        parent.relationship = payload.relationship!
        parent.profession = payload.profession || null
        parent.emergencyPhone = payload.emergencyPhone || payload.phone || ''
        await parent.save()

        const validChildren = await Student.query({ client: trx })
          .whereIn('id', payload.childrenIds!)
          .where('schoolId', director.schoolId)

        if (validChildren.length !== payload.childrenIds!.length) {
          throw new Error("Un des élèves sélectionnés n'appartient pas à votre école.")
        }

        await trx.table('parent_student').insert(
          validChildren.map((student, index) => ({
            parent_id: parent.id,
            student_id: student.id,
            is_primary: index === 0,
            created_at: new Date(),
            updated_at: new Date(),
          }))
        )
        profileReference = `${validChildren.length} élève(s) lié(s)`
      }
    })

    const credentials = {
      fullName: `${createdUser!.firstName} ${createdUser!.lastName}`.trim(),
      role: createdUser!.role,
      roleLabel: this.getRoleLabel(createdUser!.role),
      email: createdUser!.email,
      password: tempPassword,
      schoolName: school?.name || (await this.getSchoolName(director.schoolId)),
      profileReference,
      createdAt: DateTime.now().toFormat('dd/MM/yyyy HH:mm'),
    }
    let emailDelivery = {
      sent: true,
      message: `Les identifiants ont été envoyés à ${credentials.email}.`,
    }

    try {
      await this.mailService.sendAccountCredentials({
        to: credentials.email,
        schoolName: credentials.schoolName,
        fullName: credentials.fullName,
        roleLabel: credentials.roleLabel,
        email: credentials.email,
        password: credentials.password,
      })
    } catch (error) {
      emailDelivery = {
        sent: false,
        message:
          error instanceof Error
            ? error.message
            : "L'email n'a pas pu être envoyé automatiquement.",
      }
    }

    session.flash(
      emailDelivery.sent ? 'success' : 'error',
      emailDelivery.sent
        ? 'Compte créé, identifiants générés et email envoyé.'
        : 'Compte créé et identifiants générés, mais email non envoyé.'
    )

    return view.render('schools/accounts/credentials', {
      school: this.getFallbackSchool(director),
      credentials,
      emailDelivery,
    })
  }
}
