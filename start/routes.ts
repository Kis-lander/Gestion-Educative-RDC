import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'

router
  .group(() => {
    // ==================== ROUTES PUBLIQUES ====================
    router.post('/register-school', [controllers.Schools, 'registerSchool'])
    router.post('/login', [controllers.Auth, 'login'])
    router.post('/forgot-password', [controllers.Auth, 'forgotPassword'])
    router.post('/reset-password', [controllers.Auth, 'resetPassword'])
    router.get('/verify-transfer/:code', [controllers.Transfers, 'verifyAuthorization'])

    // ==================== ROUTES PROTÉGÉES ====================
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
            // Gestion des écoles
            router.get('/schools', [controllers.Inspections, 'getAllSchools'])
            router.get('/schools/:id', [controllers.Inspections, 'getSchoolById'])
            router.post('/schools/approve/:id', [controllers.Inspections, 'approveSchool'])
            router.post('/schools/suspend/:id', [controllers.Inspections, 'suspendSchool'])
            router.post('/schools/generate-credentials/:id', [
              controllers.Inspections,
              'generateSchoolCredentials',
            ])

            // Communications
            router.post('/communications/global', [
              controllers.Inspections,
              'sendGlobalCommunication',
            ])
            router.post('/communications/school/:schoolId', [
              controllers.Inspections,
              'sendSchoolCommunication',
            ])
            router.get('/communications/history', [
              controllers.Inspections,
              'getCommunicationHistory',
            ])

            // Statistiques
            router.get('/stats/global', [controllers.Inspections, 'getGlobalStats'])
            router.get('/stats/schools', [controllers.Inspections, 'getSchoolsStats'])
            router.get('/stats/performance', [controllers.Inspections, 'getPerformanceStats'])

            // Rapports
            router.get('/reports/schools', [controllers.Inspections, 'generateSchoolsReport'])
            router.get('/reports/transfers', [controllers.Inspections, 'generateTransfersReport'])
          })
          .prefix('/inspection')
          .use(middleware.role({ allowedRoles: ['inspection'] }))

        // ==================== ROUTES ÉCOLES (Direction) ====================
        router
          .group(() => {
            // Dashboard
            router.get('/dashboard', [controllers.Schools, 'dashboard'])
            router.get('/stats', [controllers.Schools, 'getSchoolStats'])

            // Gestion de l'école
            router.get('/profile', [controllers.Schools, 'getSchoolProfile'])
            router.put('/profile', [controllers.Schools, 'updateSchoolProfile'])

            // Gestion des classes
            router.get('/classes', [controllers.Academics, 'getClasses'])
            router.post('/classes', [controllers.Academics, 'createClass'])
            router.put('/classes/:id', [controllers.Academics, 'updateClass'])
            router.delete('/classes/:id', [controllers.Academics, 'deleteClass'])
            router.get('/classes/:id/students', [controllers.Academics, 'getClassStudents'])

            // Gestion des matières
            router.get('/subjects', [controllers.Academics, 'getSubjects'])
            router.post('/subjects', [controllers.Academics, 'addSubjectToClass'])

            // Gestion des enseignants
            router.get('/teachers', [controllers.Schools, 'getTeachers'])
            router.post('/teachers', [controllers.Schools, 'addTeacher'])
            router.put('/teachers/:id', [controllers.Schools, 'updateTeacher'])
            router.delete('/teachers/:id', [controllers.Schools, 'removeTeacher'])

            // Transferts d'élèves
            router.post('/transfers/request', [controllers.Transfers, 'requestTransfer'])
            router.get('/transfers/pending', [controllers.Transfers, 'getPendingTransfers'])
            router.post('/transfers/approve/:id', [controllers.Transfers, 'approveTransfer'])
            router.post('/transfers/reject/:id', [controllers.Transfers, 'rejectTransfer'])
          })
          .prefix('/school')
          .use(middleware.role({ allowedRoles: ['director'] }))

        // ==================== ROUTES DIRECTION PÉDAGOGIQUE ====================
        router
          .group(() => {
            // Résultats scolaires
            router.get('/grades', [controllers.Pedagogicals, 'getGrades'])
            router.post('/grades', [controllers.Pedagogicals, 'addGrade'])
            router.put('/grades/:id', [controllers.Pedagogicals, 'updateGrade'])
            router.post('/grades/publish/:classId', [controllers.Pedagogicals, 'publishGrades'])

            // Bulletins
            router.get('/report-cards/student/:studentId', [
              controllers.Pedagogicals,
              'generateReportCard',
            ])
            router.get('/report-cards/class/:classId', [
              controllers.Pedagogicals,
              'getClassReportCards',
            ])

            // Emploi du temps
            router.get('/timetable/class/:classId', [controllers.Pedagogicals, 'getClassTimetable'])
            router.post('/timetable', [controllers.Pedagogicals, 'setTimetable'])

            // Statistiques académiques
            router.get('/stats/academic', [controllers.Pedagogicals, 'getAcademicStats'])
            router.get('/stats/student/:studentId', [controllers.Pedagogicals, 'getStudentStats'])
          })
          .prefix('/pedagogical')
          .use(middleware.role({ allowedRoles: ['director', 'discipline_director'] }))

        // ==================== ROUTES DIRECTION FINANCIÈRE ====================
        router
          .group(() => {
            // Frais scolaires
            router.get('/fees', [controllers.Financials, 'getFees'])
            router.post('/fees', [controllers.Financials, 'setFees'])
            router.put('/fees/:id', [controllers.Financials, 'updateFees'])
            router.delete('/fees/:id', [controllers.Financials, 'deleteFees'])

            // Paiements
            router.get('/payments', [controllers.Financials, 'getPayments'])
            router.post('/payments', [controllers.Financials, 'recordPayment'])
            router.get('/payments/student/:studentId', [
              controllers.Financials,
              'getStudentPayments',
            ])
            router.get('/payments/receipt/:id', [controllers.Financials, 'generateReceipt'])

            // Rapports financiers
            router.get('/reports/income', [controllers.Financials, 'getIncomeReport'])
            router.get('/reports/outstanding', [controllers.Financials, 'getOutstandingPayments'])
            router.get('/reports/student/:studentId', [
              controllers.Financials,
              'getStudentFinancialStatus',
            ])

            // Statistiques
            router.get('/stats/financial', [controllers.Financials, 'getFinancialStats'])
          })
          .prefix('/financial')
          .use(middleware.role({ allowedRoles: ['finance_director', 'director'] }))

        // ==================== ROUTES PROFESSEURS ====================
        router
          .group(() => {
            // Mes classes et matières
            router.get('/my-classes', [controllers.Teachers, 'getMyClasses'])
            router.get('/my-subjects', [controllers.Teachers, 'getMySubjects'])

            // Devoirs
            router.get('/assignments', [controllers.Teachers, 'getAssignments'])
            router.post('/assignments', [controllers.Teachers, 'createAssignment'])
            router.put('/assignments/:id', [controllers.Teachers, 'updateAssignment'])
            router.delete('/assignments/:id', [controllers.Teachers, 'deleteAssignment'])
            router.post('/assignments/:id/publish', [controllers.Teachers, 'publishAssignment'])
            router.get('/assignments/:id/submissions', [controllers.Teachers, 'getSubmissions'])
            router.post('/assignments/submissions/:id/grade', [
              controllers.Teachers,
              'gradeSubmission',
            ])

            // Notes
            router.get('/grades', [controllers.Teachers, 'getGrades'])
            router.post('/grades', [controllers.Teachers, 'addGrade'])
            router.put('/grades/:id', [controllers.Teachers, 'updateGrade'])

            // Forum pédagogique
            router.get('/forum/topics', [controllers.Teachers, 'getForumTopics'])
            router.post('/forum/topics', [controllers.Teachers, 'createForumTopic'])
            router.post('/forum/topics/:id/posts', [controllers.Teachers, 'replyToTopic'])
            router.put('/forum/topics/:id/pin', [controllers.Teachers, 'pinTopic'])
            router.put('/forum/topics/:id/lock', [controllers.Teachers, 'lockTopic'])

            // Présences
            router.get('/attendance/class/:classId', [controllers.Teachers, 'getAttendance'])
            router.post('/attendance', [controllers.Teachers, 'markAttendance'])
          })
          .prefix('/teacher')
          .use(middleware.role({ allowedRoles: ['teacher'] }))

        // ==================== ROUTES PARENTS ====================
        router
          .group(() => {
            // Enfants
            router.get('/children', [controllers.Parents, 'getChildren'])
            router.get('/children/:id', [controllers.Parents, 'getChildDetails'])

            // Résultats scolaires
            router.get('/grades/child/:studentId', [controllers.Parents, 'getChildGrades'])
            router.get('/report-card/child/:studentId', [controllers.Parents, 'getChildReportCard'])

            // Discipline
            router.get('/discipline/child/:studentId', [controllers.Parents, 'getChildDiscipline'])

            // Communication
            router.get('/messages', [controllers.Parents, 'getMessages'])
            router.post('/messages/teacher/:teacherId', [
              controllers.Parents,
              'sendMessageToTeacher',
            ])
            router.post('/messages/:id/reply', [controllers.Parents, 'replyToMessage'])

            // Paiements
            router.get('/payments/child/:studentId', [controllers.Parents, 'getChildPayments'])
            router.post('/payments/initiate', [controllers.Parents, 'initiatePayment'])

            // Forum
            router.get('/forum/child/:studentId', [controllers.Parents, 'getChildForumActivity'])

            // Absences
            router.post('/absence/justify/:absenceId', [controllers.Parents, 'justifyAbsence'])
          })
          .prefix('/parent')
          .use(middleware.role({ allowedRoles: ['parent'] }))

        // ==================== ROUTES ÉLÈVES ====================
        router
          .group(() => {
            // Mon profil académique
            router.get('/my-profile', [controllers.Students, 'getMyProfile'])
            router.get('/my-grades', [controllers.Students, 'getMyGrades'])
            router.get('/my-report-card', [controllers.Students, 'getMyReportCard'])

            // Discipline
            router.get('/my-discipline', [controllers.Students, 'getMyDiscipline'])

            // Devoirs
            router.get('/assignments', [controllers.Students, 'getAssignments'])
            router.get('/assignments/:id', [controllers.Students, 'getAssignmentDetail'])
            router.post('/assignments/:id/submit', [controllers.Students, 'submitAssignment'])
            router.put('/assignments/submissions/:id', [controllers.Students, 'updateSubmission'])

            // Forum
            router.get('/forum/questions', [controllers.Students, 'getMyForumQuestions'])
            router.post('/forum/questions', [controllers.Students, 'postForumQuestion'])
            router.post('/forum/questions/:id/reply', [controllers.Students, 'replyToForum'])

            // Communication
            router.get('/messages', [controllers.Students, 'getMessages'])
            router.post('/messages/teacher/:teacherId', [
              controllers.Students,
              'sendMessageToTeacher',
            ])

            // Emploi du temps
            router.get('/timetable', [controllers.Students, 'getMyTimetable'])

            // Présences
            router.get('/attendance', [controllers.Students, 'getMyAttendance'])
          })
          .prefix('/student')
          .use(middleware.role({ allowedRoles: ['student'] }))

        // ==================== ROUTES DIRECTION DE DISCIPLINE ====================
        router
          .group(() => {
            // Gestion des élèves
            router.get('/students', [controllers.Disciplines, 'getStudents'])
            router.get('/students/:id', [controllers.Disciplines, 'getStudentDetails'])

            // Incidents
            router.get('/incidents', [controllers.Disciplines, 'getAllIncidents'])
            router.post('/incidents', [controllers.Disciplines, 'reportIncident'])
            router.put('/incidents/:id', [controllers.Disciplines, 'updateIncident'])
            router.delete('/incidents/:id', [controllers.Disciplines, 'deleteIncident'])
            router.get('/incidents/student/:studentId', [
              controllers.Disciplines,
              'getStudentIncidents',
            ])

            // Sanctions
            router.post('/sanctions', [controllers.Disciplines, 'applySanction'])
            router.put('/sanctions/:id', [controllers.Disciplines, 'updateSanction'])

            // Rapport de discipline
            router.get('/reports/student/:studentId', [
              controllers.Disciplines,
              'getStudentDisciplineReport',
            ])
            router.get('/reports/class/:classId', [
              controllers.Disciplines,
              'getClassDisciplineReport',
            ])
            router.get('/reports/summary', [controllers.Disciplines, 'getDisciplineSummary'])

            // Statistiques
            router.get('/stats', [controllers.Disciplines, 'getDisciplineStats'])

            // Notifications aux parents
            router.post('/notify-parent/:incidentId', [controllers.Disciplines, 'notifyParent'])
          })
          .prefix('/discipline')
          .use(middleware.role({ allowedRoles: ['discipline_director', 'director'] }))

        // ==================== ROUTES COMMUNICATION ====================
        router
          .group(() => {
            // Messages
            router.get('/messages', [controllers.Messages, 'getMessages'])
            router.get('/messages/unread', [controllers.Messages, 'getUnreadCount'])
            router.post('/messages/send', [controllers.Messages, 'sendMessage'])
            router.put('/messages/:id/read', [controllers.Messages, 'markAsRead'])
            router.delete('/messages/:id', [controllers.Messages, 'deleteMessage'])

            // Conversations
            router.get('/conversations', [controllers.Messages, 'getConversations'])
            router.get('/conversations/:userId', [controllers.Messages, 'getConversation'])

            // Notifications
            router.get('/notifications', [controllers.Messages, 'getNotifications'])
            router.put('/notifications/:id/read', [controllers.Messages, 'markNotificationAsRead'])
            router.put('/notifications/read-all', [controllers.Messages, 'markAllAsRead'])

            // Pièces jointes
            router.post('/attachments/upload', [controllers.Messages, 'uploadAttachment'])
          })
          .prefix('/communication')

        // ==================== ROUTES INTER-ÉCOLES ====================
        router
          .group(() => {
            // Recherche d'écoles
            router.get('/search', [controllers.InterSchools, 'searchSchools'])
            router.get('/:id/info', [controllers.InterSchools, 'getSchoolPublicInfo'])

            // Échanges inter-écoles
            router.get('/exchanges', [controllers.InterSchools, 'getExchanges'])
            router.post('/exchanges', [controllers.InterSchools, 'startExchange'])
            router.post('/exchanges/:id/message', [controllers.InterSchools, 'sendExchangeMessage'])

            // Meilleures pratiques
            router.get('/best-practices', [controllers.InterSchools, 'getBestPractices'])
            router.post('/best-practices/share', [controllers.InterSchools, 'shareBestPractice'])

            // Événements communs
            router.get('/events', [controllers.InterSchools, 'getEvents'])
            router.post('/events', [controllers.InterSchools, 'createEvent'])
            router.post('/events/:id/join', [controllers.InterSchools, 'joinEvent'])
          })
          .prefix('/inter-school')

        // ==================== ROUTES ADMINISTRATION ====================
        router
          .group(() => {
            // Utilisateurs
            router.get('/users', [controllers.Admins, 'getUsers'])
            router.post('/users', [controllers.Admins, 'createUser'])
            router.put('/users/:id', [controllers.Admins, 'updateUser'])
            router.delete('/users/:id', [controllers.Admins, 'deleteUser'])
            router.post('/users/:id/activate', [controllers.Admins, 'activateUser'])
            router.post('/users/:id/suspend', [controllers.Admins, 'suspendUser'])

            // Rôles et permissions
            router.get('/roles', [controllers.Admins, 'getRoles'])
            router.post('/roles', [controllers.Admins, 'createRole'])
            router.put('/roles/:id', [controllers.Admins, 'updateRole'])

            // Logs système
            router.get('/logs', [controllers.Admins, 'getSystemLogs'])
            router.get('/logs/users', [controllers.Admins, 'getUserActivityLogs'])
          })
          .prefix('/admin')
          .use(middleware.role({ allowedRoles: ['inspection'] }))
      })
      .use(middleware.auth()) // Clôture globale de l'authentification
  })
  .prefix('/api/v1')
