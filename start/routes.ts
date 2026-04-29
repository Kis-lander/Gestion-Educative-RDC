import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'

router.group(() => {

  // ==================== ROUTES PUBLIQUES ====================
  router.post('/register-school', [controllers.School, 'registerSchool'])
  router.post('/login', [controllers.Auth, 'login'])
  router.post('/forgot-password', [controllers.Auth, 'forgotPassword'])
  router.post('/reset-password', [controllers.Auth, 'resetPassword'])
  router.get('/verify-transfer/:code', [controllers.Transfer, 'verifyAuthorization'])

  // ==================== ROUTES PROTÉGÉES ====================
  router.group(() => {
    
    // Auth routes
    router.post('/logout', [controllers.Auth, 'logout'])
    router.post('/change-password', [controllers.Auth, 'changePassword'])
    router.get('/profile', [controllers.Auth, 'getProfile'])
    router.put('/profile', [controllers.Auth, 'updateProfile'])

    // ==================== ROUTES INSPECTION ====================
    router.group(() => {
      // Gestion des écoles
      router.get('/schools', [controllers.Inspection, 'getAllSchools'])
      router.get('/schools/:id', [controllers.Inspection, 'getSchoolById'])
      router.post('/schools/approve/:id', [controllers.Inspection, 'approveSchool'])
      router.post('/schools/suspend/:id', [controllers.Inspection, 'suspendSchool'])
      router.post('/schools/generate-credentials/:id', [controllers.Inspection, 'generateSchoolCredentials'])
      
      // Communications
      router.post('/communications/global', [controllers.Inspection, 'sendGlobalCommunication'])
      router.post('/communications/school/:schoolId', [controllers.Inspection, 'sendSchoolCommunication'])
      router.get('/communications/history', [controllers.Inspection, 'getCommunicationHistory'])
      
      // Statistiques
      router.get('/stats/global', [controllers.Inspection, 'getGlobalStats'])
      router.get('/stats/schools', [controllers.Inspection, 'getSchoolsStats'])
      router.get('/stats/performance', [controllers.Inspection, 'getPerformanceStats'])
      
      // Rapports
      router.get('/reports/schools', [controllers.Inspection, 'generateSchoolsReport'])
      router.get('/reports/transfers', [controllers.Inspection, 'generateTransfersReport'])
      
    }).prefix('/inspection').use(middleware.inspection())

    // --- BLOC AVEC CONTEXTE ÉCOLE (Middlewares: Auth + SchoolContext) ---
    router.group(() => {

      // ==================== ROUTES ÉCOLES (Direction) ====================
      router.group(() => {
        // Dashboard
        router.get('/dashboard', [controllers.School, 'dashboard'])
        router.get('/stats', [controllers.School, 'getSchoolStats'])
        
        // Gestion de l'école
        router.get('/profile', [controllers.School, 'getSchoolProfile'])
        router.put('/profile', [controllers.School, 'updateSchoolProfile'])
        
        // Gestion des classes
        router.get('/classes', [controllers.Academic, 'getClasses'])
        router.post('/classes', [controllers.Academic, 'createClass'])
        router.put('/classes/:id', [controllers.Academic, 'updateClass'])
        router.delete('/classes/:id', [controllers.Academic, 'deleteClass'])
        router.get('/classes/:id/students', [controllers.Academic, 'getClassStudents'])
        
        // Gestion des matières
        router.get('/subjects', [controllers.Academic, 'getSubjects'])
        router.post('/subjects', [controllers.Academic, 'addSubjectToClass'])
        
        // Gestion des enseignants
        router.get('/teachers', [controllers.School, 'getTeachers'])
        router.post('/teachers', [controllers.School, 'addTeacher'])
        router.put('/teachers/:id', [controllers.School, 'updateTeacher'])
        router.delete('/teachers/:id', [controllers.School, 'removeTeacher'])
        
        // Transferts d'élèves
        router.post('/transfers/request', [controllers.Transfer, 'requestTransfer'])
        router.get('/transfers/pending', [controllers.Transfer, 'getPendingTransfers'])
        router.post('/transfers/approve/:id', [controllers.Transfer, 'approveTransfer'])
        router.post('/transfers/reject/:id', [controllers.Transfer, 'rejectTransfer'])
        
      }).prefix('/school').use(middleware.role({ allowedRoles: ['director'] }))

      // ==================== ROUTES DIRECTION PÉDAGOGIQUE ====================
      router.group(() => {
        // Résultats scolaires
        router.get('/grades', [controllers.Pedagogical, 'getGrades'])
        router.post('/grades', [controllers.Pedagogical, 'addGrade'])
        router.put('/grades/:id', [controllers.Pedagogical, 'updateGrade'])
        router.post('/grades/publish/:classId', [controllers.Pedagogical, 'publishGrades'])
        
        // Bulletins
        router.get('/report-cards/student/:studentId', [controllers.Pedagogical, 'generateReportCard'])
        router.get('/report-cards/class/:classId', [controllers.Pedagogical, 'getClassReportCards'])
        
        // Emploi du temps
        router.get('/timetable/class/:classId', [controllers.Pedagogical, 'getClassTimetable'])
        router.post('/timetable', [controllers.Pedagogical, 'setTimetable'])
        
        // Statistiques académiques
        router.get('/stats/academic', [controllers.Pedagogical, 'getAcademicStats'])
        router.get('/stats/student/:studentId', [controllers.Pedagogical, 'getStudentStats'])
        
      }).prefix('/pedagogical').use(middleware.role({ allowedRoles: ['director', 'discipline_director'] }))

      // ==================== ROUTES DIRECTION FINANCIÈRE ====================
      router.group(() => {
        // Frais scolaires
        router.get('/fees', [controllers.Financial, 'getFees'])
        router.post('/fees', [controllers.Financial, 'setFees'])
        router.put('/fees/:id', [controllers.Financial, 'updateFees'])
        router.delete('/fees/:id', [controllers.Financial, 'deleteFees'])
        
        // Paiements
        router.get('/payments', [controllers.Financial, 'getPayments'])
        router.post('/payments', [controllers.Financial, 'recordPayment'])
        router.get('/payments/student/:studentId', [controllers.Financial, 'getStudentPayments'])
        router.get('/payments/receipt/:id', [controllers.Financial, 'generateReceipt'])
        
        // Rapports financiers
        router.get('/reports/income', [controllers.Financial, 'getIncomeReport'])
        router.get('/reports/outstanding', [controllers.Financial, 'getOutstandingPayments'])
        router.get('/reports/student/:studentId', [controllers.Financial, 'getStudentFinancialStatus'])
        
        // Statistiques
        router.get('/stats/financial', [controllers.Financial, 'getFinancialStats'])
        
      }).prefix('/financial').use(middleware.role({ allowedRoles: ['finance_director', 'director'] }))

      // ==================== ROUTES PROFESSEURS ====================
      router.group(() => {
        // Mes classes et matières
        router.get('/my-classes', [controllers.Teacher, 'getMyClasses'])
        router.get('/my-subjects', [controllers.Teacher, 'getMySubjects'])
        
        // Devoirs
        router.get('/assignments', [controllers.Teacher, 'getAssignments'])
        router.post('/assignments', [controllers.Teacher, 'createAssignment'])
        router.put('/assignments/:id', [controllers.Teacher, 'updateAssignment'])
        router.delete('/assignments/:id', [controllers.Teacher, 'deleteAssignment'])
        router.post('/assignments/:id/publish', [controllers.Teacher, 'publishAssignment'])
        router.get('/assignments/:id/submissions', [controllers.Teacher, 'getSubmissions'])
        router.post('/assignments/submissions/:id/grade', [controllers.Teacher, 'gradeSubmission'])
        
        // Notes
        router.get('/grades', [controllers.Teacher, 'getGrades'])
        router.post('/grades', [controllers.Teacher, 'addGrade'])
        router.put('/grades/:id', [controllers.Teacher, 'updateGrade'])
        
        // Forum pédagogique
        router.get('/forum/topics', [controllers.Teacher, 'getForumTopics'])
        router.post('/forum/topics', [controllers.Teacher, 'createForumTopic'])
        router.post('/forum/topics/:id/posts', [controllers.Teacher, 'replyToTopic'])
        router.put('/forum/topics/:id/pin', [controllers.Teacher, 'pinTopic'])
        router.put('/forum/topics/:id/lock', [controllers.Teacher, 'lockTopic'])
        
        // Présences
        router.get('/attendance/class/:classId', [controllers.Teacher, 'getAttendance'])
        router.post('/attendance', [controllers.Teacher, 'markAttendance'])
        
      }).prefix('/teacher').use(middleware.role({ allowedRoles: ['teacher'] }))

      // ==================== ROUTES PARENTS ====================
      router.group(() => {
        // Enfants
        router.get('/children', [controllers.Parent, 'getChildren'])
        router.get('/children/:id', [controllers.Parent, 'getChildDetails'])
        
        // Résultats scolaires
        router.get('/grades/child/:studentId', [controllers.Parent, 'getChildGrades'])
        router.get('/report-card/child/:studentId', [controllers.Parent, 'getChildReportCard'])
        
        // Discipline
        router.get('/discipline/child/:studentId', [controllers.Parent, 'getChildDiscipline'])
        
        // Communication
        router.get('/messages', [controllers.Parent, 'getMessages'])
        router.post('/messages/teacher/:teacherId', [controllers.Parent, 'sendMessageToTeacher'])
        router.post('/messages/:id/reply', [controllers.Parent, 'replyToMessage'])
        
        // Paiements
        router.get('/payments/child/:studentId', [controllers.Parent, 'getChildPayments'])
        router.post('/payments/initiate', [controllers.Parent, 'initiatePayment'])
        
        // Forum
        router.get('/forum/child/:studentId', [controllers.Parent, 'getChildForumActivity'])
        
        // Absences
        router.post('/absence/justify/:absenceId', [controllers.Parent, 'justifyAbsence'])
        
      }).prefix('/parent').use(middleware.role({ allowedRoles: ['parent'] }))

      // ==================== ROUTES ÉLÈVES ====================
      router.group(() => {
        // Mon profil académique
        router.get('/my-profile', [controllers.Student, 'getMyProfile'])
        router.get('/my-grades', [controllers.Student, 'getMyGrades'])
        router.get('/my-report-card', [controllers.Student, 'getMyReportCard'])
        
        // Discipline
        router.get('/my-discipline', [controllers.Student, 'getMyDiscipline'])
        
        // Devoirs
        router.get('/assignments', [controllers.Student, 'getAssignments'])
        router.get('/assignments/:id', [controllers.Student, 'getAssignmentDetail'])
        router.post('/assignments/:id/submit', [controllers.Student, 'submitAssignment'])
        router.put('/assignments/submissions/:id', [controllers.Student, 'updateSubmission'])
        
        // Forum
        router.get('/forum/questions', [controllers.Student, 'getMyForumQuestions'])
        router.post('/forum/questions', [controllers.Student, 'postForumQuestion'])
        router.post('/forum/questions/:id/reply', [controllers.Student, 'replyToForum'])
        
        // Communication
        router.get('/messages', [controllers.Student, 'getMessages'])
        router.post('/messages/teacher/:teacherId', [controllers.Student, 'sendMessageToTeacher'])
        
        // Emploi du temps
        router.get('/timetable', [controllers.Student, 'getMyTimetable'])
        
        // Présences
        router.get('/attendance', [controllers.Student, 'getMyAttendance'])
        
      }).prefix('/student').use(middleware.role({ allowedRoles: ['student'] }))

      // ==================== ROUTES DIRECTION DE DISCIPLINE ====================
      router.group(() => {
        // Gestion des élèves
        router.get('/students', [controllers.Discipline, 'getStudents'])
        router.get('/students/:id', [controllers.Discipline, 'getStudentDetails'])
        
        // Incidents
        router.get('/incidents', [controllers.Discipline, 'getAllIncidents'])
        router.post('/incidents', [controllers.Discipline, 'reportIncident'])
        router.put('/incidents/:id', [controllers.Discipline, 'updateIncident'])
        router.delete('/incidents/:id', [controllers.Discipline, 'deleteIncident'])
        router.get('/incidents/student/:studentId', [controllers.Discipline, 'getStudentIncidents'])
        
        // Sanctions
        router.post('/sanctions', [controllers.Discipline, 'applySanction'])
        router.put('/sanctions/:id', [controllers.Discipline, 'updateSanction'])
        
        // Rapport de discipline
        router.get('/reports/student/:studentId', [controllers.Discipline, 'getStudentDisciplineReport'])
        router.get('/reports/class/:classId', [controllers.Discipline, 'getClassDisciplineReport'])
        router.get('/reports/summary', [controllers.Discipline, 'getDisciplineSummary'])
        
        // Statistiques
        router.get('/stats', [controllers.Discipline, 'getDisciplineStats'])
        
        // Notifications aux parents
        router.post('/notify-parent/:incidentId', [controllers.Discipline, 'notifyParent'])
        
      }).prefix('/discipline').use(middleware.role({ allowedRoles: ['discipline_director', 'director'] }))

    }).use(middleware.schoolContext())
    // --- FIN DU BLOC AVEC CONTEXTE ÉCOLE ---

    // ==================== ROUTES COMMUNICATION ====================
    router.group(() => {
      // Messages
      router.get('/messages', [controllers.Message, 'getMessages'])
      router.get('/messages/unread', [controllers.Message, 'getUnreadCount'])
      router.post('/messages/send', [controllers.Message, 'sendMessage'])
      router.put('/messages/:id/read', [controllers.Message, 'markAsRead'])
      router.delete('/messages/:id', [controllers.Message, 'deleteMessage'])
      
      // Conversations
      router.get('/conversations', [controllers.Message, 'getConversations'])
      router.get('/conversations/:userId', [controllers.Message, 'getConversation'])
      
      // Notifications
      router.get('/notifications', [controllers.Message, 'getNotifications'])
      router.put('/notifications/:id/read', [controllers.Message, 'markNotificationAsRead'])
      router.put('/notifications/read-all', [controllers.Message, 'markAllAsRead'])
      
      // Pièces jointes
      router.post('/attachments/upload', [controllers.Message, 'uploadAttachment'])
      
    }).prefix('/communication')

    // ==================== ROUTES INTER-ÉCOLES ====================
    router.group(() => {
      // Recherche d'écoles
      router.get('/search', [controllers.InterSchool, 'searchSchools'])
      router.get('/:id/info', [controllers.InterSchool, 'getSchoolPublicInfo'])
      
      // Échanges inter-écoles
      router.get('/exchanges', [controllers.InterSchool, 'getExchanges'])
      router.post('/exchanges', [controllers.InterSchool, 'startExchange'])
      router.post('/exchanges/:id/message', [controllers.InterSchool, 'sendExchangeMessage'])
      
      // Meilleures pratiques
      router.get('/best-practices', [controllers.InterSchool, 'getBestPractices'])
      router.post('/best-practices/share', [controllers.InterSchool, 'shareBestPractice'])
      
      // Événements communs
      router.get('/events', [controllers.InterSchool, 'getEvents'])
      router.post('/events', [controllers.InterSchool, 'createEvent'])
      router.post('/events/:id/join', [controllers.InterSchool, 'joinEvent'])
      
    }).prefix('/inter-school')

    // ==================== ROUTES ADMINISTRATION ====================
    router.group(() => {
      // Utilisateurs
      router.get('/users', [controllers.Admin, 'getUsers'])
      router.post('/users', [controllers.Admin, 'createUser'])
      router.put('/users/:id', [controllers.Admin, 'updateUser'])
      router.delete('/users/:id', [controllers.Admin, 'deleteUser'])
      router.post('/users/:id/activate', [controllers.Admin, 'activateUser'])
      router.post('/users/:id/suspend', [controllers.Admin, 'suspendUser'])
      
      // Rôles et permissions
      router.get('/roles', [controllers.Admin, 'getRoles'])
      router.post('/roles', [controllers.Admin, 'createRole'])
      router.put('/roles/:id', [controllers.Admin, 'updateRole'])
      
      // Logs système
      router.get('/logs', [controllers.Admin, 'getSystemLogs'])
      router.get('/logs/users', [controllers.Admin, 'getUserActivityLogs'])
      
    }).prefix('/admin').use(middleware.role({ allowedRoles: ['inspection'] }))
    
  }).use(middleware.auth()) // Clôture globale par l'authentification

}).prefix('/api/v1')