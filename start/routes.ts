import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'

router.get('/', [controllers.Welcome, 'index']).as('welcome.index')
router.get('/about', [controllers.Welcome, 'about']).as('about')
router.get('/welcome', [controllers.Welcome, 'landing']).as('welcome.landing')
router.get('/welcome/about', [controllers.Welcome, 'about']).as('welcome.about')
router.get('/welcome/features', [controllers.Welcome, 'features']).as('welcome.features')
router.get('/welcome/contact', [controllers.Welcome, 'contact']).as('welcome.contact')
router.get('/welcome/terms', [controllers.Welcome, 'terms']).as('welcome.terms')
router.get('/help', [controllers.Help, 'index']).as('help.index')
router.get('/help/faq', [controllers.Help, 'faq']).as('help.faq')
router.get('/help/guides', [controllers.Help, 'guides']).as('help.guides')
router.get('/help/tutorial', [controllers.Help, 'tutorial']).as('help.tutorial')
router.get('/help/contact', [controllers.Help, 'contact']).as('help.contact')
router.get('/help/documentation', [controllers.Help, 'documentation']).as('help.documentation')

router
  .group(() => {
    // ==================== ROUTES PUBLIQUES ====================
    router.post('/register-school', [controllers.Schools, 'registerSchool'])
    router.post('/login', [controllers.Auth, 'login'])
    router.post('/forgot-password', [controllers.Auth, 'forgotPassword'])
    router.post('/reset-password', [controllers.Auth, 'resetPassword'])
    router.post('/verify-transfer', [controllers.Transfers, 'verifyAuthorization'])

    // ==================== ROUTES PROTEGEES ====================
    router
      .group(() => {
        // Auth routes
        router.post('/logout', [controllers.Auth, 'logout'])
        router.post('/change-password', [controllers.Auth, 'changePassword'])
        router.get('/profile', [controllers.Auth, 'getProfile'])
        router.put('/profile', [controllers.Auth, 'updateProfile'])

        // ==================== ROUTES INSPECTION ====================
        router
          .group(() => {
            // Gestion des ecoles
            router.get('/schools', [controllers.Inspections, 'getAllSchools'])
            router.get('/schools/:id', [controllers.Inspections, 'getSchoolById'])
            router.post('/schools/approve/:id', [controllers.Inspections, 'approveSchool'])
            router.post('/schools/suspend/:id', [controllers.Inspections, 'suspendSchool'])
            router.post('/schools/inspect', [controllers.Inspections, 'inspectSchool'])
            router.post('/schools/generate-credentials/:id', [
              controllers.Auth,
              'generateSchoolCredentials',
            ])

            // Communications
            router.post('/communications/global', [
              controllers.Inspections,
              'sendGlobalCommunication',
            ])
            router
              .post('/communications/school', [controllers.Messages, 'sendSchoolCommunication'])
              .as('inspection.send_school_communication')

            // Statistiques
            router.get('/stats/global', [controllers.Inspections, 'getGlobalStats'])

            // Rapports
            router.post('/reports/school', [controllers.Inspections, 'generateSchoolReport'])
          })
          .prefix('/inspection')
          .use(middleware.role({ allowedRoles: ['inspection'] }))

        // ==================== ROUTES ECOLES (Direction) ====================
        router
          .group(() => {
            // Dashboard
            router.get('/dashboard', [controllers.Schools, 'dashboard'])

            // Gestion de l'ecole
            router.put('/profile', [controllers.Schools, 'updateSchoolProfile'])

            // Gestion des classes
            router.get('/classes', [controllers.Academics, 'getClasses'])
            router.post('/classes', [controllers.Academics, 'createClass'])
            router.get('/classes/:id', [controllers.Academics, 'getClassById'])
            router.put('/classes/:id', [controllers.Academics, 'updateClass'])
            router.delete('/classes/:id', [controllers.Academics, 'deleteClass'])
            router.get('/classes/:id/students', [controllers.Academics, 'getClassStudents'])

            // Gestion des matieres
            router.get('/subjects', [controllers.Academics, 'getSubjects'])
            router.post('/subjects', [controllers.Academics, 'createSubject'])
            router.put('/subjects/:id', [controllers.Academics, 'updateSubject'])
            router.delete('/subjects/:id', [controllers.Academics, 'deleteSubject'])
            router.get('/classes/:classId/subjects', [controllers.Academics, 'getClassSubjects'])
            router.post('/classes/:classId/subjects', [controllers.Academics, 'addSubjectToClass'])

            // Gestion des notes
            router.get('/classes/:classId/grades', [controllers.Academics, 'getGradesByClass'])
            router.get('/students/:studentId/grades', [controllers.Academics, 'getGradesByStudent'])
            router.post('/grades', [controllers.Academics, 'addGrade'])
            router.put('/grades/:id', [controllers.Academics, 'updateGrade'])
            router.delete('/grades/:id', [controllers.Academics, 'deleteGrade'])
            router.post('/grades/publish', [controllers.Academics, 'publishGrades'])

            // Gestion des enseignants
            router.post('/teachers', [controllers.Schools, 'addTeacher'])

            // Transferts d'eleves
            router.post('/transfers/request', [controllers.Transfers, 'requestTransfer'])
            router.get('/transfers/pending', [controllers.Transfers, 'getPendingTransfers'])
            router.post('/transfers/approve', [controllers.Transfers, 'approveTransfer'])
            router.post('/transfers/reject', [controllers.Transfers, 'rejectTransfer'])
            router.post('/transfers/:id/complete', [controllers.Transfers, 'completeTransfer'])

            // Statistiques academiques
            router.get('/stats/academic', [controllers.Academics, 'getAcademicStats'])
            router.get('/stats/progress', [controllers.Academics, 'getProgressStats'])
          })
          .prefix('/school')
          .use(middleware.role({ allowedRoles: ['director'] }))

        // ==================== ROUTES DIRECTION PEDAGOGIQUE ====================
        router
          .group(() => {
            // Bulletins
            router.post('/report-cards/student', [controllers.Pedagogicals, 'generateReportCard'])

            // Emploi du temps
            router.get('/timetable/class/:classId', [controllers.Pedagogicals, 'getClassTimetable'])
            router.post('/timetable', [controllers.Pedagogicals, 'createTimetable'])

            // Publication des notes
            router.post('/grades/publish', [controllers.Pedagogicals, 'publishGrades'])

            // Calendrier et examens
            router.post('/calendar', [controllers.Pedagogicals, 'createAcademicCalendar'])
            router.post('/exam-schedules', [controllers.Pedagogicals, 'createExamSchedule'])

            // Suivi academique
            router.post('/students/progress', [controllers.Pedagogicals, 'getStudentProgress'])
          })
          .prefix('/pedagogical')
          .use(middleware.role({ allowedRoles: ['director', 'discipline_director'] }))

        // ==================== ROUTES DIRECTION FINANCIERE ====================
        router
          .group(() => {
            // Frais scolaires
            router.get('/fees', [controllers.Financials, 'getFees'])
            router.post('/fees', [controllers.Financials, 'setFees'])
            router.put('/fees/:id', [controllers.Financials, 'updateFees'])
            router.delete('/fees/:id', [controllers.Financials, 'deleteFees'])

            // Paiements
            router.post('/payments', [controllers.Financials, 'recordPayment'])
            router.get('/payments/student/:studentId', [
              controllers.Financials,
              'getStudentPayments',
            ])

            // Rapports financiers
            router.get('/reports/income', [controllers.Financials, 'getIncomeReport'])

            // Statistiques
            router.get('/stats/financial', [controllers.Financials, 'getFinancialStats'])
          })
          .prefix('/financial')
          .use(middleware.role({ allowedRoles: ['finance_director', 'director'] }))

        // ==================== ROUTES PROFESSEURS ====================
        router
          .group(() => {
            // Mes classes
            router.get('/my-classes', [controllers.Teachers, 'getMyClasses'])

            // Devoirs
            router.get('/assignments', [controllers.Teachers, 'getAssignments'])
            router.post('/assignments', [controllers.Teachers, 'createAssignment'])
            router.post('/assignments/submissions/:id/grade', [
              controllers.Teachers,
              'gradeSubmission',
            ])

            // Forum pedagogique
            router.post('/forum/topics', [controllers.Teachers, 'createForumTopic'])

            // Presences
            router.post('/attendance', [controllers.Teachers, 'markAttendance'])
          })
          .prefix('/teacher')
          .use(middleware.role({ allowedRoles: ['teacher'] }))

        // ==================== ROUTES PARENTS ====================
        router
          .group(() => {
            // Enfants
            router.get('/children', [controllers.Parents, 'getChildren'])

            // Resultats scolaires
            router.get('/grades/child/:studentId', [controllers.Parents, 'getChildGrades'])

            // Communication
            router.post('/messages/teacher', [controllers.Parents, 'sendMessageToTeacher'])

            // Paiements
            router.get('/payments/child/:studentId', [controllers.Parents, 'getChildPayments'])

            // Absences
            router.post('/absence/justify', [controllers.Parents, 'justifyAbsence'])
          })
          .prefix('/parent')
          .use(middleware.role({ allowedRoles: ['parent'] }))

        // ==================== ROUTES ELEVES ====================
        router
          .group(() => {
            // Mon profil academique
            router.get('/my-profile', [controllers.Students, 'getMyProfile'])
            router.get('/my-grades', [controllers.Students, 'getMyGrades'])
            router.get('/my-report-card', [controllers.Students, 'getMyReportCard'])

            // Discipline
            router.get('/my-discipline', [controllers.Students, 'getMyDiscipline'])

            // Devoirs
            router.get('/assignments', [controllers.Students, 'getAssignments'])
            router.post('/assignments/submit', [controllers.Students, 'submitAssignment'])

            // Forum
            router.get('/forum/questions', [controllers.Students, 'getMyForumQuestions'])
            router.post('/forum/questions', [controllers.Students, 'postForumQuestion'])

            // Communication
            router.post('/messages/teacher', [controllers.Students, 'sendMessageToTeacher'])

            // Emploi du temps
            router.get('/timetable', [controllers.Students, 'getMyTimetable'])

            // Presences
            router.get('/attendance', [controllers.Students, 'getMyAttendance'])

            // Transferts
            router.post('/transfers/request', [controllers.Students, 'requestTransfer'])
          })
          .prefix('/student')
          .use(middleware.role({ allowedRoles: ['student'] }))

        // ==================== ROUTES DIRECTION DE DISCIPLINE ====================
        router
          .group(() => {
            // Gestion des eleves
            router.get('/students', [controllers.Disciplines, 'getStudents'])
            router.get('/students/:id', [controllers.Disciplines, 'getStudentDetails'])

            // Incidents
            router.post('/incidents', [controllers.Disciplines, 'reportIncident'])
            router.delete('/incidents/:id', [controllers.Disciplines, 'deleteIncident'])

            // Sanctions
            router.post('/sanctions', [controllers.Disciplines, 'applySanction'])

            // Notifications aux parents
            router.post('/notify-parent', [controllers.Disciplines, 'notifyParent'])
          })
          .prefix('/discipline')
          .use(middleware.role({ allowedRoles: ['discipline_director', 'director'] }))

        // ==================== ROUTES COMMUNICATION ====================
        router
          .group(() => {
            // Messages
            router.get('/messages', [controllers.Messages, 'getMessages'])
            router.post('/messages/send', [controllers.Messages, 'sendMessage'])
            router.put('/messages/read', [controllers.Messages, 'markAsRead'])

            // Conversations
            router.get('/conversations', [controllers.Messages, 'getConversations'])
            router.get('/conversations/:userId', [controllers.Messages, 'getConversation'])

            // Communications officielles
            router
              .post('/communications/global', [controllers.Messages, 'sendGlobalCommunication'])
              .as('communication.send_global_communication')
            router
              .post('/communications/school', [controllers.Messages, 'sendSchoolCommunication'])
              .as('communication.send_school_communication')
          })
          .prefix('/communication')

        // ==================== ROUTES INTER-ECOLES ====================
        router
          .group(() => {
            // Recherche d'ecoles
            router.get('/search', [controllers.InterSchools, 'searchSchools'])
            router.get('/:id/info', [controllers.InterSchools, 'getSchoolPublicInfo'])

            // Echanges inter-ecoles
            router.post('/exchanges', [controllers.InterSchools, 'startExchange'])

            // Meilleures pratiques
            router.get('/best-practices', [controllers.InterSchools, 'getBestPractices'])
            router.post('/best-practices/share', [controllers.InterSchools, 'shareBestPractice'])

            // Evenements communs
            router.get('/events', [controllers.InterSchools, 'getEvents'])
            router.post('/events', [controllers.InterSchools, 'createEvent'])
            router.post('/events/join', [controllers.InterSchools, 'joinEvent'])
          })
          .prefix('/inter-school')

        // ==================== ROUTES ADMINISTRATION ====================
        router
          .group(() => {
            // Utilisateurs
            router.get('/users', [controllers.Admin, 'getUsers'])
            router.post('/users', [controllers.Admin, 'createUser'])
            router.put('/users/:id', [controllers.Admin, 'updateUser'])
            router.delete('/users/:id', [controllers.Admin, 'deleteUser'])
            router.post('/users/:id/activate', [controllers.Admin, 'activateUser'])
            router.post('/users/:id/suspend', [controllers.Admin, 'suspendUser'])

            // Roles et permissions
            router.get('/roles', [controllers.Admin, 'getRoles'])
            router.post('/roles', [controllers.Admin, 'createRole'])
            router.put('/roles/:id', [controllers.Admin, 'updateRole'])

            // Logs systeme
            router.get('/logs', [controllers.Admin, 'getSystemLogs'])
            router.get('/logs/users', [controllers.Admin, 'getUserActivityLogs'])
          })
          .prefix('/admin')
          .use(middleware.role({ allowedRoles: ['inspection'] }))
      })
      .use(middleware.auth()) // Cloture globale de l'authentification
  })
  .prefix('/api/v1')
