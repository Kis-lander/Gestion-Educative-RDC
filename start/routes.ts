import router from '@adonisjs/core/services/router'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import { edgePageContext } from '#start/view_context'

async function getWelcomeStats() {
  const [schools, students, teachers, provinces] = await Promise.all([
    db.from('schools').count('* as total').first(),
    db.from('students').count('* as total').first(),
    db.from('teachers').count('* as total').first(),
    db.from('schools').whereNotNull('province').countDistinct('province as total').first(),
  ])

  return {
    totalSchools: Number(schools?.total ?? 0),
    totalStudents: Number(students?.total ?? 0),
    totalTeachers: Number(teachers?.total ?? 0),
    totalProvinces: Number(provinces?.total ?? 0),
  }
}

router
  .get('/', async ({ view }) => {
    return view.render('welcome/index', {
      title: 'Gestion Educative RDC - Plateforme nationale',
      stats: await getWelcomeStats(),
    })
  })
  .as('welcome.index')
router.get('/home', async ({ inertia }) => inertia.render('home', {})).as('home')
router.get('/about', async ({ view }) => view.render('welcome/about')).as('about')
router
  .get('/welcome', async ({ view }) => {
    return view.render('welcome/index', {
      title: 'Gestion Educative RDC - Plateforme nationale',
      stats: await getWelcomeStats(),
    })
  })
  .as('welcome.landing')
router.get('/welcome/about', async ({ view }) => view.render('welcome/about')).as('welcome.about')
router
  .get('/welcome/features', async ({ view }) => view.render('welcome/features'))
  .as('welcome.features')
router
  .get('/welcome/contact', async ({ view }) => view.render('welcome/contact'))
  .as('welcome.contact')
router.get('/welcome/terms', async ({ view }) => view.render('welcome/terms')).as('welcome.terms')
router
  .get('/register-school', async ({ view }) =>
    view.render('schools/register', { title: "Inscription de l'ecole - Gestion Educative RDC" })
  )
  .as('schools.register.create')
router.post('/register-school', [controllers.Schools, 'registerSchool']).as('schools.register')
router.get('/help', [controllers.Help, 'index']).as('help.index')
router.get('/help/faq', [controllers.Help, 'faq']).as('help.faq')
router.get('/help/guides', [controllers.Help, 'guides']).as('help.guides')
router.get('/help/tutorial', [controllers.Help, 'tutorial']).as('help.tutorial')
router.get('/help/contact', [controllers.Help, 'contact']).as('help.contact')
router.get('/help/documentation', [controllers.Help, 'documentation']).as('help.documentation')

router
  .group(() => {
    router.get('/login', [controllers.Session, 'create']).as('session.create')
    router.post('/login', [controllers.Session, 'store']).as('session.store')
    router.get('/signup', [controllers.NewAccount, 'create']).as('new_account.create')
    router.post('/signup', [controllers.NewAccount, 'store']).as('new_account.store')
  })
  .use(middleware.guest())

router
  .post('/logout', [controllers.Session, 'destroy'])
  .as('session.destroy')
  .use(middleware.auth())

router
  .get('/inspection/dashboard', [controllers.Dashboard, 'inspection'])
  .as('inspection.dashboard')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['inspection'] })])

router
  .group(() => {
    router.get('/schools', [controllers.Inspections, 'schoolsPage'])
    router.get('/schools/pending', [controllers.Inspections, 'pendingSchoolsPage'])
    router.get('/schools/:id/classes', [controllers.Inspections, 'schoolClassesPage'])
    router.get('/schools/:id/inspect', [controllers.Inspections, 'inspectSchoolPage'])
    router.post('/schools/:id/inspect', [controllers.Inspections, 'storeSchoolInspection'])
    router.get('/schools/:id', [controllers.Inspections, 'schoolDetailsPage'])
    router.get('/schools/:id/approve', [controllers.Inspections, 'approveSchoolPage'])
    router.post('/schools/:id/generate-credentials', [
      controllers.Inspections,
      'approveAndGenerateCredentials',
    ])
    router.post('/schools/:id/reject', [controllers.Inspections, 'rejectSchool'])
    router.post('/schools/:id/toggle-suspend', [controllers.Inspections, 'toggleSuspendSchool'])
    router.get('/communications/global', [controllers.Inspections, 'communicationsGlobalPage'])
    router
      .post('/communications/global', [controllers.Inspections, 'sendGlobalCommunication'])
      .as('inspection.communications.global.store')
    router.get('/communications/school', [controllers.Inspections, 'communicationsSchoolPage'])
    router.post('/communications/school', [controllers.Messages, 'sendSchoolCommunication'])
    router.get('/communications/history', [controllers.Inspections, 'communicationsHistoryPage'])
    router.get('/communications/:id', [controllers.Inspections, 'communicationDetails'])
    router.get('/reports/schools', [controllers.Inspections, 'reportsSchoolsPage'])
    router.get('/reports/performance', [controllers.Inspections, 'reportsPerformancePage'])
    router.get('/reports/statistics', [controllers.Inspections, 'reportsStatisticsPage'])
    router.get('/reports/transfers', [controllers.Inspections, 'reportsTransfersPage'])
    router.get('/reports/school/:id', [controllers.Inspections, 'schoolReportPage'])
    router.get('/settings', [controllers.Inspections, 'settingsPage'])
    router
      .post('/settings/general', [controllers.Inspections, 'saveSettings'])
      .as('inspection.settings.general.store')
    router
      .post('/settings/inspection', [controllers.Inspections, 'saveSettings'])
      .as('inspection.settings.inspection.store')
    router
      .post('/settings/notifications', [controllers.Inspections, 'saveSettings'])
      .as('inspection.settings.notifications.store')
    router
      .post('/settings/backup', [controllers.Inspections, 'saveSettings'])
      .as('inspection.settings.backup.store')
    router
      .post('/settings/security', [controllers.Inspections, 'saveSettings'])
      .as('inspection.settings.security.store')
    router.get('/schools/export', [controllers.Inspections, 'exportSchools'])
  })
  .prefix('/inspection')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['inspection'] })])

router
  .group(() => {
    router.get('/reports/schools', [controllers.Inspections, 'schoolsReportData'])
    router.get('/reports/performance', [controllers.Inspections, 'performanceReportData'])
    router.get('/reports/statistics', [controllers.Inspections, 'statisticsReportData'])
    router.get('/reports/transfers', [controllers.Inspections, 'transfersReportData'])
    router.get('/reports/transfers/export', [controllers.Inspections, 'exportTransfersReport'])
    router.post('/backup', [controllers.Inspections, 'triggerBackup'])
    router.get('/backup/download/:filename', [controllers.Inspections, 'downloadBackup'])
    router.get('/logs', [controllers.Inspections, 'logs'])
    router.get('/logs/export', [controllers.Inspections, 'exportLogs'])
  })
  .prefix('/api/inspection')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['inspection'] })])

router
  .get('/dashboard', [controllers.Dashboard, 'workspace'])
  .as('dashboard')
  .use(middleware.auth())

router
  .get('/settings', ({ auth, response }) => {
    return auth.user?.role === 'inspection'
      ? response.redirect('/inspection/settings')
      : response.redirect('/settings/general')
  })
  .as('settings')
  .use(middleware.auth())

router
  .get('/settings/general', ({ auth, view }) => {
    return view.render('settings/general', {
      school: { id: auth.user?.schoolId, name: 'Gestion Éducative RDC' },
      settings: {
        displayName: auth.user?.fullName || '',
        bio: '',
        website: '',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        itemsPerPage: 20,
        defaultExportFormat: 'pdf',
        compressExports: false,
      },
      currentDate: new Date().toLocaleDateString('fr-FR'),
    })
  })
  .as('settings.general')
  .use(middleware.auth())

router
  .post('/settings/general', ({ response, session }) => {
    session.flash('success', 'Paramètres enregistrés.')
    return response.redirect('/settings/general')
  })
  .as('settings.general.store')
  .use(middleware.auth())

router
  .get('/teachers', ({ auth, response }) => {
    return auth.user?.role === 'inspection'
      ? response.redirect('/inspection/schools')
      : response.redirect('/schools/teachers')
  })
  .as('teachers.index')
  .use(middleware.auth())

router
  .get('/teachers/create', ({ response }) => response.redirect('/schools/teachers/create'))
  .as('teachers.create')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['director'] })])

router
  .get('/schools/accounts', [controllers.Schools, 'accountsPage'])
  .as('schools.accounts.index')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['director'] })])

router
  .get('/schools/accounts/create', [controllers.Schools, 'createAccountPage'])
  .as('schools.accounts.create')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['director'] })])

router
  .post('/schools/accounts/create', [controllers.Schools, 'storeAccount'])
  .as('schools.accounts.store')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['director'] })])

router
  .get('/schools/accounts/:id/edit', [controllers.Schools, 'editAccountPage'])
  .as('schools.accounts.edit')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['director'] })])

router
  .post('/schools/accounts/:id/edit', [controllers.Schools, 'updateAccount'])
  .as('schools.accounts.update')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['director'] })])

router
  .get('/communication/messages', ({ response }) => {
    return response.redirect('/communication/messages/inbox')
  })
  .as('inspection.messages')
  .use(middleware.auth())

router
  .get('/communication/messages/compose', [controllers.Messages, 'composePage'])
  .as('communication.messages.compose')
  .use(middleware.auth())

router
  .get('/communication/messages/sent', [controllers.Messages, 'sentPage'])
  .as('communication.messages.sent')
  .use(middleware.auth())

router
  .get('/communication/messages/inbox', [controllers.Messages, 'inboxPage'])
  .as('communication.messages.inbox')
  .use(middleware.auth())

router
  .get('/communication/messages/read/:id', [controllers.Messages, 'readPage'])
  .as('communication.messages.read')
  .use(middleware.auth())

router
  .get('/communication/messages/:id/edit', [controllers.Messages, 'editPage'])
  .as('communication.messages.edit')
  .use(middleware.auth())

router
  .post('/communication/messages/:id/edit', [controllers.Messages, 'updateWebMessage'])
  .as('communication.messages.update')
  .use(middleware.auth())

router
  .post('/communication/messages/mark-all-read', [controllers.Messages, 'markAllReadWeb'])
  .as('communication.messages.mark_all_read')
  .use(middleware.auth())

router
  .delete('/communication/messages/:id/delete', [controllers.Messages, 'deleteWebMessage'])
  .as('communication.messages.delete')
  .use(middleware.auth())

router
  .get('/communication/messages/send', [controllers.Messages, 'redirectSendToCompose'])
  .as('communication.messages.send.redirect')
  .use(middleware.auth())

router
  .post('/communication/messages/send', [controllers.Messages, 'sendWebMessage'])
  .as('communication.messages.send')
  .use(middleware.auth())

router
  .get('/communication/notifications', [controllers.Messages, 'notificationsPage'])
  .as('communication.notifications.index')
  .use(middleware.auth())

router
  .get('/api/notifications', [controllers.Messages, 'notificationsApi'])
  .as('api.notifications.index')
  .use(middleware.auth())

router
  .post('/api/notifications/:id/read', [controllers.Messages, 'markNotificationRead'])
  .as('api.notifications.read')
  .use(middleware.auth())

router
  .put('/api/notifications/:id/read', [controllers.Messages, 'markNotificationRead'])
  .as('api.notifications.read.put')
  .use(middleware.auth())

router
  .post('/api/notifications/mark-all-read', [controllers.Messages, 'markAllNotificationsRead'])
  .as('api.notifications.mark_all_read')
  .use(middleware.auth())

router
  .put('/api/notifications/read-all', [controllers.Messages, 'markAllNotificationsRead'])
  .as('api.notifications.read_all')
  .use(middleware.auth())

router
  .delete('/api/notifications/delete-all', [controllers.Messages, 'deleteAllNotifications'])
  .as('api.notifications.delete_all')
  .use(middleware.auth())

router
  .group(() => {
    router
      .get('/classes/:id/students', [controllers.Teachers, 'getClassStudentsForAttendance'])
      .as('api.teacher.attendance.classes.students')
    router
      .get('/attendance/class/:id', [controllers.Teachers, 'getClassAttendance'])
      .as('api.teacher.attendance.class')
    router.post('/attendance', [controllers.Teachers, 'markAttendance']).as('api.teacher.attendance.store')
  })
  .prefix('/api/teacher')
  .use([
    middleware.auth(),
    middleware.role({ allowedRoles: ['teacher', 'director', 'discipline_director'] }),
  ])

router
  .get('/api/users/stats', [controllers.Inspections, 'usersStats'])
  .as('inspection.users.stats')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['inspection'] })])

router
  .get('/api/schools/:id/info', [controllers.Inspections, 'schoolCommunicationInfo'])
  .as('inspection.schools.communication.info')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['inspection'] })])

router
  .get('/api/schools/:id/communications', [controllers.Inspections, 'schoolCommunicationsHistory'])
  .as('inspection.schools.communication.history')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['inspection'] })])

router
  .get('/api/communications/:id', [controllers.Inspections, 'communicationDetailsJson'])
  .as('inspection.communications.details.json')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['inspection'] })])

router.get('/profile', [controllers.Auth, 'profile']).as('profile').use(middleware.auth())
router
  .get('/profile/edit', [controllers.Auth, 'editProfilePage'])
  .as('profile.edit')
  .use(middleware.auth())
router
  .get('/profile/security', [controllers.Auth, 'securityPage'])
  .as('profile.security')
  .use(middleware.auth())
router
  .get('/profile/preferences', [controllers.Auth, 'preferencesPage'])
  .as('profile.preferences')
  .use(middleware.auth())
router
  .get('/profile/activity', [controllers.Auth, 'activityPage'])
  .as('profile.activity')
  .use(middleware.auth())
router
  .post('/api/profile/avatar', [controllers.Auth, 'updateAvatar'])
  .as('profile.avatar.update')
  .use(middleware.auth())

router
  .group(() => {
    router.get('/classes', [controllers.Academics, 'classesPage']).as('academic.classes.index')
    router
      .get('/classes/create', [controllers.Academics, 'createClassPage'])
      .as('academic.classes.create')
    router
      .post('/classes/seed-rdc-das', [controllers.Academics, 'seedRdcDasClasses'])
      .as('academic.classes.seed_rdc_das')
    router.post('/classes', [controllers.Academics, 'createClass']).as('academic.classes.store')
    router.get('/classes/:id', [controllers.Academics, 'showClassPage']).as('academic.classes.show')
    router
      .get('/classes/:id/edit', [controllers.Academics, 'editClassPage'])
      .as('academic.classes.edit')
    router
      .post('/classes/:id', [controllers.Academics, 'updateClass'])
      .as('academic.classes.update.post')
    router.put('/classes/:id', [controllers.Academics, 'updateClass']).as('academic.classes.update')
    router
      .delete('/classes/:id', [controllers.Academics, 'deleteClass'])
      .as('academic.classes.destroy')
    router.get('/grades', [controllers.Academics, 'gradesPage']).as('academic.grades.index')
    router.get('/grades/add', [controllers.Academics, 'addGradesPage']).as('academic.grades.add')
    router.post('/grades', [controllers.Academics, 'addGrade']).as('academic.grades.store')
    router
      .post('/grades/publish', [controllers.Academics, 'publishGrades'])
      .as('academic.grades.publish')
    router
      .get('/timetable/create', [controllers.Academics, 'createTimetablePage'])
      .as('academic.timetable.create')
    router
      .get('/timetable/class/:classId', [controllers.Academics, 'classTimetablePage'])
      .as('academic.timetable.class')
    router
      .get('/grades/class/:classId', [controllers.Academics, 'getGradesByClass'])
      .as('academic.grades.class')
    router
      .get('/classes/:id/students', [controllers.Academics, 'getClassStudents'])
      .as('academic.classes.students')
    router
      .get('/classes/:classId/subjects', [controllers.Academics, 'getClassSubjects'])
      .as('academic.classes.subjects')
  })
  .prefix('/academic')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['director', 'teacher'] })])

router
  .group(() => {
    router
      .get('/classes/:id/students', [controllers.Academics, 'getClassStudents'])
      .as('legacy.api.classes.students')
    router
      .get('/classes/:classId/subjects', [controllers.Academics, 'getClassSubjects'])
      .as('legacy.api.classes.subjects')
    router
      .get('/grades/class/:classId', [controllers.Academics, 'getGradesByClass'])
      .as('legacy.api.grades.class')
    router
      .get('/timetable/class/:classId', [controllers.Pedagogicals, 'getClassTimetable'])
      .as('legacy.api.timetable.class')
    router
      .post('/timetable/create', [controllers.Pedagogicals, 'createTimetable'])
      .as('legacy.api.timetable.create')
  })
  .prefix('/api')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['director', 'teacher'] })])

router
  .group(() => {
    router.get('/', [controllers.Students, 'indexPage']).as('students.index')
    router.get('/create', [controllers.Students, 'createPage']).as('students.create')
    router.post('/create', [controllers.Students, 'store']).as('students.store')
  })
  .prefix('/students')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['director', 'teacher', 'discipline_director'] })])

router
  .group(() => {
    router.get('/classes', [controllers.Academics, 'classesPage']).as('schools.classes.index')
    router
      .get('/classes/create', [controllers.Academics, 'createClassPage'])
      .as('schools.classes.create')
    router
      .post('/classes/seed-rdc-das', [controllers.Academics, 'seedRdcDasClasses'])
      .as('schools.classes.seed_rdc_das')
    router.post('/classes', [controllers.Academics, 'createClass']).as('schools.classes.store')
    router
      .get('/classes/:id/students', [controllers.Academics, 'classStudentsPage'])
      .as('schools.classes.students')
    router.get('/classes/:id/edit', [controllers.Academics, 'editClassPage']).as('schools.classes.edit')
    router.get('/classes/:id', [controllers.Academics, 'showClassPage']).as('schools.classes.show')
    router.post('/classes/:id', [controllers.Academics, 'updateClass']).as('schools.classes.update.post')
    router.put('/classes/:id', [controllers.Academics, 'updateClass']).as('schools.classes.update')
    router.delete('/classes/:id', [controllers.Academics, 'deleteClass']).as('schools.classes.destroy')
    router.get('/timetable', [controllers.Academics, 'timetablePage']).as('schools.timetable.index')
    router
      .get('/timetable/create', [controllers.Academics, 'createTimetablePage'])
      .as('schools.timetable.create')
  })
  .prefix('/schools')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['director'] })])

router
  .group(() => {
    router.get('/', [controllers.Schools, 'teachersPage']).as('schools.teachers.index')
    router.get('/create', [controllers.Schools, 'createTeacherPage']).as('schools.teachers.create')
    router.post('/', [controllers.Schools, 'addTeacher']).as('schools.teachers.store')
    router.get('/:id', ({ response }) => response.redirect('/schools/teachers')).as('schools.teachers.show')
    router.get('/:id/edit', ({ response }) => response.redirect('/schools/teachers')).as('schools.teachers.edit')
    router
      .get('/:id/schedule', ({ response }) => response.redirect('/schools/teachers'))
      .as('schools.teachers.schedule')
    router.put('/:id', ({ response }) => response.redirect('/schools/teachers')).as('schools.teachers.update')
    router
      .delete('/:id', ({ response }) => response.ok({ success: true, message: 'Action non disponible.' }))
      .as('schools.teachers.destroy')
  })
  .prefix('/schools/teachers')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['director'] })])

router
  .get('/discipline', [controllers.Disciplines, 'dashboardPage'])
  .as('discipline.dashboard')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['director', 'discipline_director'] })])

router
  .group(() => {
    router.get('/incidents', [controllers.Disciplines, 'incidentsPage']).as('discipline.incidents.index')
    router
      .get('/incidents/report', [controllers.Disciplines, 'reportIncidentPage'])
      .as('discipline.incidents.report')
    router
      .post('/incidents/report', [controllers.Disciplines, 'storeIncidentWeb'])
      .as('discipline.incidents.store')
    router
      .get('/incidents/:id/show', [controllers.Disciplines, 'showIncidentPage'])
      .as('discipline.incidents.show')
    router
      .get('/incidents/:id/edit', [controllers.Disciplines, 'editIncidentPage'])
      .as('discipline.incidents.edit')
    router
      .put('/incidents/:id/update', [controllers.Disciplines, 'updateIncidentWeb'])
      .as('discipline.incidents.update')
    router
      .post('/incidents/:id/update', [controllers.Disciplines, 'updateIncidentWeb'])
      .as('discipline.incidents.update.post')
    router
      .delete('/incidents/:id', [controllers.Disciplines, 'deleteIncident'])
      .as('discipline.incidents.destroy')
    router.get('/students', [controllers.Disciplines, 'studentsPage']).as('discipline.students.index')
    router.get('/students/search', async (ctx) =>
      ctx.view.render('discipline/students/search', await edgePageContext(ctx))
    )
    router
      .get('/students/:id', [controllers.Disciplines, 'getStudentDetails'])
      .as('discipline.students.show')
    router
      .get('/sanctions/apply', [controllers.Disciplines, 'applySanctionPage'])
      .as('discipline.sanctions.apply')
    router
      .post('/sanctions/apply', [controllers.Disciplines, 'applySanctionWeb'])
      .as('discipline.sanctions.apply.store')
    router.get('/sanctions', ({ response }) => response.redirect('/discipline/incidents'))
    router.get('/sanctions/list', async (ctx) =>
      ctx.view.render('discipline/sanctions/index', await edgePageContext(ctx))
    )
    router.get('/sanctions/:id/edit', async (ctx) =>
      ctx.view.render('discipline/sanctions/edit', await edgePageContext(ctx))
    )
    router.get('/incidents/student/:id', async (ctx) =>
      ctx.view.render('discipline/incidents/student', await edgePageContext(ctx))
    )
    router.get('/appeals', async (ctx) =>
      ctx.view.render('discipline/appeals/index', await edgePageContext(ctx))
    )
    router.get('/appeals/create', async (ctx) =>
      ctx.view.render('discipline/appeals/create', await edgePageContext(ctx))
    )
    router.get('/appeals/:id/review', async (ctx) =>
      ctx.view.render('discipline/appeals/review', await edgePageContext(ctx))
    )
    router.get('/reports/class', async (ctx) =>
      ctx.view.render('discipline/reports/class', await edgePageContext(ctx))
    )
    router.get('/reports/school', async (ctx) =>
      ctx.view.render('discipline/reports/school', await edgePageContext(ctx))
    )
    router.get('/reports/statistics', async (ctx) =>
      ctx.view.render('discipline/reports/statistics', await edgePageContext(ctx))
    )
    router.get('/reports/student', async (ctx) =>
      ctx.view.render('discipline/reports/student', await edgePageContext(ctx))
    )
  })
  .prefix('/discipline')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['director', 'discipline_director'] })])

router
  .get('/academic/calendar', async (ctx) =>
    ctx.view.render('academic/calendar/index', await edgePageContext(ctx))
  )
  .as('academic.calendar')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['director', 'teacher'] })])

router
  .group(() => {
    router.get('/', ({ response }) => response.redirect('/financial/payments')).as('financial.index')
    router.get('/fees', [controllers.Financials, 'feesPage']).as('financial.fees.index')
    router.get('/fees/create', [controllers.Financials, 'createFeePage']).as('financial.fees.create')
    router.post('/fees/create', [controllers.Financials, 'setFees']).as('financial.fees.store')
    router
      .get('/fees/structure', [controllers.Financials, 'feesStructurePage'])
      .as('financial.fees.structure')
    router.get('/fees/:id/edit', [controllers.Financials, 'editFeePage']).as('financial.fees.edit')
    router.put('/fees/:id/update', [controllers.Financials, 'updateFees']).as('financial.fees.update')
    router
      .post('/fees/:id/update', [controllers.Financials, 'updateFees'])
      .as('financial.fees.update.post')
    router
      .post('/fees/:id/toggle-status', [controllers.Financials, 'toggleFeeStatus'])
      .as('financial.fees.toggle_status')
    router.delete('/fees/:id', [controllers.Financials, 'deleteFees']).as('financial.fees.destroy')
    router.get('/payments', [controllers.Financials, 'paymentsPage']).as('financial.payments.index')
    router
      .get('/payments/record', [controllers.Financials, 'recordPaymentPage'])
      .as('financial.payments.record')
    router
      .post('/payments/record', [controllers.Financials, 'recordPayment'])
      .as('financial.payments.store')
    router
      .get('/payments/receipt/:id', [controllers.Financials, 'receiptPage'])
      .as('financial.payments.receipt')
    router
      .get('/payments/print-receipt/:id', [controllers.Financials, 'printReceiptPage'])
      .as('financial.payments.print')
    router
      .delete('/payments/:id', [controllers.Financials, 'deletePayment'])
      .as('financial.payments.destroy')
    router
      .get('/reports/income', [controllers.Financials, 'incomeReportPage'])
      .as('financial.reports.income')
    router
      .get('/reports/outstanding', [controllers.Financials, 'outstandingReportPage'])
      .as('financial.reports.outstanding')
    router
      .get('/reports/statistics', [controllers.Financials, 'statisticsReportPage'])
      .as('financial.reports.statistics')
    router
      .get('/reports/export', [controllers.Financials, 'exportReport'])
      .as('financial.reports.export')
    router.get('/payments/student/:id', async (ctx) =>
      ctx.view.render('financial/payments/student', await edgePageContext(ctx))
    )
    router.get('/payment-plans', async (ctx) =>
      ctx.view.render('financial/payment-plans/index', await edgePageContext(ctx))
    )
    router.get('/payment-plans/create', async (ctx) =>
      ctx.view.render('financial/payment-plans/create', await edgePageContext(ctx))
    )
    router.get('/payment-plans/:id', async (ctx) =>
      ctx.view.render('financial/payment-plans/show', await edgePageContext(ctx))
    )
    router.get('/payment-plans/:id/installments', async (ctx) =>
      ctx.view.render('financial/payment-plans/installments', await edgePageContext(ctx))
    )
    router.get('/scholarships', async (ctx) =>
      ctx.view.render('financial/scholarships/index', await edgePageContext(ctx))
    )
    router.get('/scholarships/create', async (ctx) =>
      ctx.view.render('financial/scholarships/create', await edgePageContext(ctx))
    )
    router.get('/scholarships/:id/edit', async (ctx) =>
      ctx.view.render('financial/scholarships/edit', await edgePageContext(ctx))
    )
    router.get('/scholarships/student/:id', async (ctx) =>
      ctx.view.render('financial/scholarships/student', await edgePageContext(ctx))
    )
    router.get('/reports/student-status', async (ctx) =>
      ctx.view.render('financial/reports/student-status', await edgePageContext(ctx))
    )
  })
  .prefix('/financial')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['director', 'finance_director'] })])

router
  .get('/api/students/:studentId/financial-status', [
    controllers.Financials,
    'studentFinancialStatus',
  ])
  .as('legacy.api.students.financial_status')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['director', 'finance_director'] })])

router
  .group(() => {
    router.get('/profile', async (ctx) =>
      ctx.view.render('schools/profile/index', await edgePageContext(ctx))
    )
    router.get('/profile/edit', async (ctx) =>
      ctx.view.render('schools/profile/edit', await edgePageContext(ctx))
    )
    router.get('/profile/settings', async (ctx) =>
      ctx.view.render('schools/profile/settings', await edgePageContext(ctx))
    )
    router
      .post('/profile/update', [controllers.Schools, 'updateSchoolProfile'])
      .as('schools.profile.update.web')
    router.get('/subjects', async (ctx) =>
      ctx.view.render('schools/subjects/index', await edgePageContext(ctx))
    )
    router.get('/subjects/create', async (ctx) =>
      ctx.view.render('schools/subjects/create', await edgePageContext(ctx))
    )
    router.get('/subjects/:id/edit', async (ctx) =>
      ctx.view.render('schools/subjects/edit', await edgePageContext(ctx))
    )
    router.get('/subjects/assign', async (ctx) =>
      ctx.view.render('schools/subjects/assign', await edgePageContext(ctx))
    )
    router.get('/timetable/:id/edit', async (ctx) =>
      ctx.view.render('schools/timetable/edit', await edgePageContext(ctx))
    )
    router.get('/timetable/print', async (ctx) =>
      ctx.view.render('schools/timetable/print', await edgePageContext(ctx))
    )
    router.get('/transfers/authorize', async (ctx) =>
      ctx.view.render('schools/transfers/authorize', await edgePageContext(ctx))
    )
    router.get('/transfers/history', async (ctx) =>
      ctx.view.render('schools/transfers/history', await edgePageContext(ctx))
    )
    router.get('/transfers/pending', async (ctx) =>
      ctx.view.render('schools/transfers/pending', await edgePageContext(ctx))
    )
    router.get('/transfers/requests', async (ctx) =>
      ctx.view.render('schools/transfers/requests', await edgePageContext(ctx))
    )
  })
  .prefix('/schools')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['director'] })])

router
  .group(() => {
    router.get('/groups', async (ctx) =>
      ctx.view.render('communication/groups/index', await edgePageContext(ctx))
    )
    router.get('/groups/create', async (ctx) =>
      ctx.view.render('communication/groups/create', await edgePageContext(ctx))
    )
    router.get('/groups/:id/members', async (ctx) =>
      ctx.view.render('communication/groups/members', await edgePageContext(ctx))
    )
    router.get('/messages/conversation/:id', async (ctx) =>
      ctx.view.render('communication/messages/conversation', await edgePageContext(ctx))
    )
    router.get('/messages/trash', async (ctx) =>
      ctx.view.render('communication/messages/trash', await edgePageContext(ctx))
    )
    router.get('/notifications/settings', async (ctx) =>
      ctx.view.render('communication/notifications/settings', await edgePageContext(ctx))
    )
  })
  .prefix('/communication')
  .use(middleware.auth())

router
  .group(() => {
    router.get('/account', async (ctx) =>
      ctx.view.render('settings/account', await edgePageContext(ctx))
    )
    router.get('/language', async (ctx) =>
      ctx.view.render('settings/language', await edgePageContext(ctx))
    )
    router.get('/notifications', async (ctx) =>
      ctx.view.render('settings/notifications', await edgePageContext(ctx))
    )
    router.get('/privacy', async (ctx) =>
      ctx.view.render('settings/privacy', await edgePageContext(ctx))
    )
  })
  .prefix('/settings')
  .use(middleware.auth())

router
  .group(() => {
    router.get('/users', async (ctx) =>
      ctx.view.render('admin/users/index', await edgePageContext(ctx))
    )
    router.get('/users/create', async (ctx) =>
      ctx.view.render('admin/users/create', await edgePageContext(ctx))
    )
    router.get('/users/:id', async (ctx) =>
      ctx.view.render('admin/users/show', await edgePageContext(ctx))
    )
    router.get('/users/:id/edit', async (ctx) =>
      ctx.view.render('admin/users/edit', await edgePageContext(ctx))
    )
    router.get('/users/:id/permissions', async (ctx) =>
      ctx.view.render('admin/users/permissions', await edgePageContext(ctx))
    )
    router.get('/users/:id/roles', async (ctx) =>
      ctx.view.render('admin/users/roles', await edgePageContext(ctx))
    )
    router.get('/roles', async (ctx) =>
      ctx.view.render('admin/roles/index', await edgePageContext(ctx))
    )
    router.get('/roles/create', async (ctx) =>
      ctx.view.render('admin/roles/create', await edgePageContext(ctx))
    )
    router.get('/roles/:id/edit', async (ctx) =>
      ctx.view.render('admin/roles/edit', await edgePageContext(ctx))
    )
    router.get('/roles/:id/permissions', async (ctx) =>
      ctx.view.render('admin/roles/permissions', await edgePageContext(ctx))
    )
    router.get('/logs/activity', async (ctx) =>
      ctx.view.render('admin/logs/activity', await edgePageContext(ctx))
    )
    router.get('/logs/system', async (ctx) =>
      ctx.view.render('admin/logs/system', await edgePageContext(ctx))
    )
    router.get('/logs/users', async (ctx) =>
      ctx.view.render('admin/logs/users', await edgePageContext(ctx))
    )
    router.get('/settings/backup', async (ctx) =>
      ctx.view.render('admin/settings/backup', await edgePageContext(ctx))
    )
    router.get('/settings/email', async (ctx) =>
      ctx.view.render('admin/settings/email', await edgePageContext(ctx))
    )
    router.get('/settings/general', async (ctx) =>
      ctx.view.render('admin/settings/general', await edgePageContext(ctx))
    )
    router.get('/settings/security', async (ctx) =>
      ctx.view.render('admin/settings/security', await edgePageContext(ctx))
    )
  })
  .prefix('/admin')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['inspection'] })])

router
  .group(() => {
    router.get('/calendar/create', async (ctx) =>
      ctx.view.render('academic/calendar/create', await edgePageContext(ctx))
    )
    router.get('/calendar/:id/edit', async (ctx) =>
      ctx.view.render('academic/calendar/edit', await edgePageContext(ctx))
    )
    router.get('/calendar/school', async (ctx) =>
      ctx.view.render('academic/calendar/school', await edgePageContext(ctx))
    )
    router.get('/exams/create', async (ctx) =>
      ctx.view.render('academic/exams/create', await edgePageContext(ctx))
    )
    router.get('/exams/:id/edit', async (ctx) =>
      ctx.view.render('academic/exams/edit', await edgePageContext(ctx))
    )
    router.get('/exams/results', async (ctx) =>
      ctx.view.render('academic/exams/results', await edgePageContext(ctx))
    )
    router.get('/exams/schedule', async (ctx) =>
      ctx.view.render('academic/exams/schedule', await edgePageContext(ctx))
    )
    router.get('/grades/bulk', async (ctx) =>
      ctx.view.render('academic/grades/bulk', await edgePageContext(ctx))
    )
    router.get('/grades/:id/edit', async (ctx) =>
      ctx.view.render('academic/grades/edit', await edgePageContext(ctx))
    )
    router.get('/grades/class/:classId/view', async (ctx) =>
      ctx.view.render('academic/grades/class-grades', await edgePageContext(ctx))
    )
    router.get('/grades/student/:studentId', async (ctx) =>
      ctx.view.render('academic/grades/student-grades', await edgePageContext(ctx))
    )
    router.get('/grades/publish', async (ctx) =>
      ctx.view.render('academic/grades/publish', await edgePageContext(ctx))
    )
    router.get('/report-cards', async (ctx) =>
      ctx.view.render('academic/report-cards/index', await edgePageContext(ctx))
    )
    router.get('/report-cards/generate', async (ctx) =>
      ctx.view.render('academic/report-cards/generate', await edgePageContext(ctx))
    )
    router.get('/report-cards/class/:classId', async (ctx) =>
      ctx.view.render('academic/report-cards/class', await edgePageContext(ctx))
    )
    router.get('/report-cards/:id', async (ctx) =>
      ctx.view.render('academic/report-cards/show', await edgePageContext(ctx))
    )
    router.get('/report-cards/:id/print', async (ctx) =>
      ctx.view.render('academic/report-cards/print', await edgePageContext(ctx))
    )
    router.get('/sessions', async (ctx) =>
      ctx.view.render('academic/sessions/index', await edgePageContext(ctx))
    )
    router.get('/sessions/active', async (ctx) =>
      ctx.view.render('academic/sessions/active', await edgePageContext(ctx))
    )
    router.get('/sessions/create', async (ctx) =>
      ctx.view.render('academic/sessions/create', await edgePageContext(ctx))
    )
    router.get('/sessions/:id/edit', async (ctx) =>
      ctx.view.render('academic/sessions/edit', await edgePageContext(ctx))
    )
    router.get('/sessions/transfer', async (ctx) =>
      ctx.view.render('academic/sessions/transfer', await edgePageContext(ctx))
    )
  })
  .prefix('/academic')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['director', 'teacher'] })])

router
  .group(() => {
    router.get('/classes', async (ctx) =>
      ctx.view.render('teacher/classes/index', await edgePageContext(ctx))
    )
    router.get('/classes/:id', async (ctx) =>
      ctx.view.render('teacher/classes/show', await edgePageContext(ctx))
    )
    router.get('/classes/:id/students', async (ctx) =>
      ctx.view.render('teacher/classes/students', await edgePageContext(ctx))
    )
    router.get('/assignments', async (ctx) =>
      ctx.view.render('teacher/assignments/index', await edgePageContext(ctx))
    )
    router.get('/assignments/create', async (ctx) =>
      ctx.view.render('teacher/assignments/create', await edgePageContext(ctx))
    )
    router.get('/assignments/:id', async (ctx) =>
      ctx.view.render('teacher/assignments/show', await edgePageContext(ctx))
    )
    router.get('/assignments/:id/edit', async (ctx) =>
      ctx.view.render('teacher/assignments/edit', await edgePageContext(ctx))
    )
    router.get('/assignments/:id/submissions', async (ctx) =>
      ctx.view.render('teacher/assignments/submissions', await edgePageContext(ctx))
    )
    router.get('/assignments/submissions/:id/grade', async (ctx) =>
      ctx.view.render('teacher/assignments/grade', await edgePageContext(ctx))
    )
    router.get('/attendance', [controllers.Teachers, 'attendanceIndexPage'])
    router.get('/attendance/mark', [controllers.Teachers, 'attendanceMarkPage'])
    router.get('/attendance/report', async (ctx) =>
      ctx.view.render('teacher/attendance/report', await edgePageContext(ctx))
    )
    router.get('/attendance/student/:id', async (ctx) =>
      ctx.view.render('teacher/attendance/student', await edgePageContext(ctx))
    )
    router.get('/grades', async (ctx) =>
      ctx.view.render('teacher/grades/index', await edgePageContext(ctx))
    )
    router.get('/grades/add', async (ctx) =>
      ctx.view.render('teacher/grades/add', await edgePageContext(ctx))
    )
    router.get('/grades/class/:classId', async (ctx) =>
      ctx.view.render('teacher/grades/class', await edgePageContext(ctx))
    )
    router.get('/grades/:id/edit', async (ctx) =>
      ctx.view.render('teacher/grades/edit', await edgePageContext(ctx))
    )
    router.get('/forum', async (ctx) =>
      ctx.view.render('teacher/forum/index', await edgePageContext(ctx))
    )
    router.get('/forum/create', async (ctx) =>
      ctx.view.render('teacher/forum/create', await edgePageContext(ctx))
    )
    router.get('/forum/my-topics', async (ctx) =>
      ctx.view.render('teacher/forum/my-topics', await edgePageContext(ctx))
    )
    router.get('/forum/topic/:id', async (ctx) =>
      ctx.view.render('teacher/forum/topic', await edgePageContext(ctx))
    )
    router.get('/timetable', ({ response }) => response.redirect('/schools/timetable'))
  })
  .prefix('/teacher')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['teacher', 'director', 'discipline_director'] })])

router
  .group(() => {
    router.get('/profile', async (ctx) =>
      ctx.view.render('student/profile', await edgePageContext(ctx))
    )
    router.get('/assignments', async (ctx) =>
      ctx.view.render('student/assignments/index', await edgePageContext(ctx))
    )
    router.get('/assignments/:id', async (ctx) =>
      ctx.view.render('student/assignments/show', await edgePageContext(ctx))
    )
    router.get('/assignments/:id/submit', async (ctx) =>
      ctx.view.render('student/assignments/submit', await edgePageContext(ctx))
    )
    router.get('/assignments/:id/submissions', async (ctx) =>
      ctx.view.render('student/assignments/submissions', await edgePageContext(ctx))
    )
    router.get('/attendance', async (ctx) =>
      ctx.view.render('student/attendance/index', await edgePageContext(ctx))
    )
    router.get('/attendance/report', async (ctx) =>
      ctx.view.render('student/attendance/report', await edgePageContext(ctx))
    )
    router.get('/discipline', async (ctx) =>
      ctx.view.render('student/discipline/index', await edgePageContext(ctx))
    )
    router.get('/discipline/:id', async (ctx) =>
      ctx.view.render('student/discipline/details', await edgePageContext(ctx))
    )
    router.get('/forum', async (ctx) =>
      ctx.view.render('student/forum/index', await edgePageContext(ctx))
    )
    router.get('/forum/create', async (ctx) =>
      ctx.view.render('student/forum/create', await edgePageContext(ctx))
    )
    router.get('/forum/my-questions', async (ctx) =>
      ctx.view.render('student/forum/my-questions', await edgePageContext(ctx))
    )
    router.get('/forum/topic/:id', async (ctx) =>
      ctx.view.render('student/forum/topic', await edgePageContext(ctx))
    )
    router.get('/grades', async (ctx) =>
      ctx.view.render('student/grades/index', await edgePageContext(ctx))
    )
    router.get('/grades/details', async (ctx) =>
      ctx.view.render('student/grades/details', await edgePageContext(ctx))
    )
    router.get('/grades/report-card', async (ctx) => {
      const context = await edgePageContext(ctx)

      return ctx.view.render('student/grades/report-card', {
        ...context,
        academicYear: `${context.currentYear - 1}-${context.currentYear}`,
        termLabel: context.selectedTermLabel,
        totalCoefficient: 0,
        totalPoints: 0,
        overallAverage: 0,
        rank: '-',
        totalStudents: context.totalStudents,
        decision: '-',
        behavior: { grade: 'Satisfaisant', rating: 3 },
        attendance: { rate: 0, absences: 0, lates: 0 },
        appreciation: '-',
        observations: '-',
        principalName: '-',
        generationDate: DateTime.now().toLocaleString(DateTime.DATE_SHORT),
      })
    })
    router.get('/messages', ({ response }) => response.redirect('/communication/messages'))
    router.get('/messages/send', ({ response }) => response.redirect('/communication/messages/compose'))
    router.get('/messages/:id', ({ params, response }) =>
      response.redirect(`/communication/messages/read/${params.id}`)
    )
    router.get('/timetable', async (ctx) =>
      ctx.view.render('student/timetable/index', await edgePageContext(ctx))
    )
    router.get('/timetable/print', async (ctx) =>
      ctx.view.render('student/timetable/print', await edgePageContext(ctx))
    )
    router.get('/transfers/request', async (ctx) =>
      ctx.view.render('student/transfers/request', await edgePageContext(ctx))
    )
    router.get('/transfers/status', async (ctx) =>
      ctx.view.render('student/transfers/status', await edgePageContext(ctx))
    )
  })
  .prefix('/student')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['student', 'director'] })])

router
  .group(() => {
    router.get('/children', async (ctx) =>
      ctx.view.render('parent/children/index', await edgePageContext(ctx))
    )
    router.get('/children/:id', async (ctx) =>
      ctx.view.render('parent/children/show', await edgePageContext(ctx))
    )
    router.get('/children/:id/profile', async (ctx) =>
      ctx.view.render('parent/children/profile', await edgePageContext(ctx))
    )
    router.get('/grades', async (ctx) =>
      ctx.view.render('parent/grades/index', await edgePageContext(ctx))
    )
    router.get('/grades/child/:studentId', async (ctx) =>
      ctx.view.render('parent/grades/details', await edgePageContext(ctx))
    )
    router.get('/grades/report-card/:studentId', async (ctx) =>
      ctx.view.render('parent/grades/report-card', await edgePageContext(ctx))
    )
    router.get('/discipline', async (ctx) =>
      ctx.view.render('parent/discipline/index', await edgePageContext(ctx))
    )
    router.get('/discipline/:id', async (ctx) =>
      ctx.view.render('parent/discipline/details', await edgePageContext(ctx))
    )
    router.get('/attendance', async (ctx) =>
      ctx.view.render('parent/attendance/index', await edgePageContext(ctx))
    )
    router.get('/attendance/justify', async (ctx) =>
      ctx.view.render('parent/attendance/justify', await edgePageContext(ctx))
    )
    router.get('/payments', async (ctx) =>
      ctx.view.render('parent/payments/index', await edgePageContext(ctx))
    )
    router.get('/payments/history', async (ctx) =>
      ctx.view.render('parent/payments/history', await edgePageContext(ctx))
    )
    router.get('/payments/status', async (ctx) =>
      ctx.view.render('parent/payments/status', await edgePageContext(ctx))
    )
    router.get('/messages', ({ response }) => response.redirect('/communication/messages'))
    router.get('/messages/send', ({ response }) => response.redirect('/communication/messages/compose'))
    router.get('/messages/notifications', ({ response }) =>
      response.redirect('/communication/notifications')
    )
    router.get('/messages/:id', ({ params, response }) =>
      response.redirect(`/communication/messages/read/${params.id}`)
    )
    router.get('/appointments', async (ctx) =>
      ctx.view.render('parent/appointments/index', await edgePageContext(ctx))
    )
    router.get('/appointments/request', async (ctx) =>
      ctx.view.render('parent/appointments/request', await edgePageContext(ctx))
    )
    router.get('/appointments/schedule', async (ctx) =>
      ctx.view.render('parent/appointments/schedule', await edgePageContext(ctx))
    )
  })
  .prefix('/parent')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['parent', 'director'] })])

router
  .group(() => {
    router.get('/search', async (ctx) =>
      ctx.view.render('inter-school/search/index', await edgePageContext(ctx))
    )
    router.get('/search/results', async (ctx) =>
      ctx.view.render('inter-school/search/results', await edgePageContext(ctx))
    )
    router.get('/events', async (ctx) =>
      ctx.view.render('inter-school/events/index', await edgePageContext(ctx))
    )
    router.get('/events/create', async (ctx) =>
      ctx.view.render('inter-school/events/create', await edgePageContext(ctx))
    )
    router.get('/events/my-events', async (ctx) =>
      ctx.view.render('inter-school/events/my-events', await edgePageContext(ctx))
    )
    router.get('/events/:id', async (ctx) =>
      ctx.view.render('inter-school/events/show', await edgePageContext(ctx))
    )
    router.get('/events/:id/register', async (ctx) =>
      ctx.view.render('inter-school/events/register', await edgePageContext(ctx))
    )
    router.get('/exchanges', async (ctx) =>
      ctx.view.render('inter-school/exchanges/index', await edgePageContext(ctx))
    )
    router.get('/exchanges/start', async (ctx) =>
      ctx.view.render('inter-school/exchanges/start', await edgePageContext(ctx))
    )
    router.get('/exchanges/:id', async (ctx) =>
      ctx.view.render('inter-school/exchanges/show', await edgePageContext(ctx))
    )
    router.get('/exchanges/:id/messages', async (ctx) =>
      ctx.view.render('inter-school/exchanges/messages', await edgePageContext(ctx))
    )
    router.get('/best-practices', async (ctx) =>
      ctx.view.render('inter-school/best-practices/index', await edgePageContext(ctx))
    )
    router.get('/best-practices/categories', async (ctx) =>
      ctx.view.render('inter-school/best-practices/categories', await edgePageContext(ctx))
    )
    router.get('/best-practices/share', async (ctx) =>
      ctx.view.render('inter-school/best-practices/share', await edgePageContext(ctx))
    )
    router.get('/best-practices/:id', async (ctx) =>
      ctx.view.render('inter-school/best-practices/show', await edgePageContext(ctx))
    )
  })
  .prefix('/inter-school')
  .use(middleware.auth())

router
  .group(() => {
    router.get('/academic/class', async (ctx) =>
      ctx.view.render('reports/academic/class-report', await edgePageContext(ctx))
    )
    router.get('/academic/performance', async (ctx) =>
      ctx.view.render('reports/academic/performance', await edgePageContext(ctx))
    )
    router.get('/academic/school', async (ctx) =>
      ctx.view.render('reports/academic/school-report', await edgePageContext(ctx))
    )
    router.get('/academic/student-progress', async (ctx) =>
      ctx.view.render('reports/academic/student-progress', await edgePageContext(ctx))
    )
    router.get('/academic/subject', async (ctx) =>
      ctx.view.render('reports/academic/subject-report', await edgePageContext(ctx))
    )
    router.get('/disciplinary/comparisons', async (ctx) =>
      ctx.view.render('reports/disciplinary/comparisons', await edgePageContext(ctx))
    )
    router.get('/disciplinary/summary', async (ctx) =>
      ctx.view.render('reports/disciplinary/summary', await edgePageContext(ctx))
    )
    router.get('/disciplinary/trends', async (ctx) =>
      ctx.view.render('reports/disciplinary/trends', await edgePageContext(ctx))
    )
    router.get('/financial/balance', async (ctx) =>
      ctx.view.render('reports/financial/balance', await edgePageContext(ctx))
    )
    router.get('/financial/expenses', async (ctx) =>
      ctx.view.render('reports/financial/expenses', await edgePageContext(ctx))
    )
    router.get('/financial/forecasts', async (ctx) =>
      ctx.view.render('reports/financial/forecasts', await edgePageContext(ctx))
    )
    router.get('/financial/income', async (ctx) =>
      ctx.view.render('reports/financial/income', await edgePageContext(ctx))
    )
    router.get('/exports', async (ctx) =>
      ctx.view.render('reports/exports/index', await edgePageContext(ctx))
    )
    router.get('/exports/generate', async (ctx) =>
      ctx.view.render('reports/exports/generate', await edgePageContext(ctx))
    )
    router.get('/exports/downloads', async (ctx) =>
      ctx.view.render('reports/exports/downloads', await edgePageContext(ctx))
    )
  })
  .prefix('/reports')
  .use([middleware.auth(), middleware.role({ allowedRoles: ['director', 'inspection', 'finance_director', 'discipline_director'] })])

router
  .group(() => {
    // ==================== ROUTES PUBLIQUES ====================
    router.post('/register-school', [controllers.Schools, 'registerSchool'])
    router.post('/login', [controllers.Auth, 'login'])
    router.post('/auth/otp/request', [controllers.Auth, 'requestOtp'])
    router.post('/auth/otp/verify', [controllers.Auth, 'verifyOtp'])
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
            router.get('/classes/:id/students', [controllers.Teachers, 'getClassStudentsForAttendance'])
            router.get('/attendance/class/:id', [controllers.Teachers, 'getClassAttendance'])
            router.post('/attendance', [controllers.Teachers, 'markAttendance'])
          })
          .prefix('/teacher')
          .use(middleware.role({ allowedRoles: ['teacher', 'director', 'discipline_director'] }))

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
