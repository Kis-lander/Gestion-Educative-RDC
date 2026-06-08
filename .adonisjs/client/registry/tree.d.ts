/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  welcome: {
    index: typeof routes['welcome.index']
    landing: typeof routes['welcome.landing']
    about: typeof routes['welcome.about']
    features: typeof routes['welcome.features']
    contact: typeof routes['welcome.contact']
    terms: typeof routes['welcome.terms']
  }
  home: typeof routes['home']
  about: typeof routes['about']
  schools: {
    register: typeof routes['schools.register'] & {
      create: typeof routes['schools.register.create']
    }
    accounts: {
      index: typeof routes['schools.accounts.index']
      create: typeof routes['schools.accounts.create']
      store: typeof routes['schools.accounts.store']
      edit: typeof routes['schools.accounts.edit']
      update: typeof routes['schools.accounts.update']
    }
    classes: {
      index: typeof routes['schools.classes.index']
      create: typeof routes['schools.classes.create']
      seedRdcDas: typeof routes['schools.classes.seed_rdc_das']
      store: typeof routes['schools.classes.store']
      students: typeof routes['schools.classes.students']
      edit: typeof routes['schools.classes.edit']
      show: typeof routes['schools.classes.show']
      update: typeof routes['schools.classes.update'] & {
        post: typeof routes['schools.classes.update.post']
      }
      destroy: typeof routes['schools.classes.destroy']
    }
    timetable: {
      index: typeof routes['schools.timetable.index']
      create: typeof routes['schools.timetable.create']
    }
    teachers: {
      index: typeof routes['schools.teachers.index']
      create: typeof routes['schools.teachers.create']
      store: typeof routes['schools.teachers.store']
      show: typeof routes['schools.teachers.show']
      edit: typeof routes['schools.teachers.edit']
      schedule: typeof routes['schools.teachers.schedule']
      update: typeof routes['schools.teachers.update']
      destroy: typeof routes['schools.teachers.destroy']
    }
    profile: {
      update: {
        web: typeof routes['schools.profile.update.web']
      }
    }
    registerSchool: typeof routes['schools.register_school']
    dashboard: typeof routes['schools.dashboard']
    updateSchoolProfile: typeof routes['schools.update_school_profile']
    addTeacher: typeof routes['schools.add_teacher']
  }
  help: {
    index: typeof routes['help.index']
    faq: typeof routes['help.faq']
    guides: typeof routes['help.guides']
    tutorial: typeof routes['help.tutorial']
    contact: typeof routes['help.contact']
    documentation: typeof routes['help.documentation']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  inspection: {
    dashboard: typeof routes['inspection.dashboard']
    communications: {
      global: {
        store: typeof routes['inspection.communications.global.store']
      }
      details: {
        json: typeof routes['inspection.communications.details.json']
      }
    }
    settings: {
      general: {
        store: typeof routes['inspection.settings.general.store']
      }
      inspection: {
        store: typeof routes['inspection.settings.inspection.store']
      }
      notifications: {
        store: typeof routes['inspection.settings.notifications.store']
      }
      backup: {
        store: typeof routes['inspection.settings.backup.store']
      }
      security: {
        store: typeof routes['inspection.settings.security.store']
      }
    }
    messages: typeof routes['inspection.messages']
    users: {
      stats: typeof routes['inspection.users.stats']
    }
    schools: {
      communication: {
        info: typeof routes['inspection.schools.communication.info']
        history: typeof routes['inspection.schools.communication.history']
      }
    }
    sendSchoolCommunication: typeof routes['inspection.send_school_communication']
  }
  inspections: {
    schoolsPage: typeof routes['inspections.schools_page']
    pendingSchoolsPage: typeof routes['inspections.pending_schools_page']
    schoolClassesPage: typeof routes['inspections.school_classes_page']
    inspectSchoolPage: typeof routes['inspections.inspect_school_page']
    storeSchoolInspection: typeof routes['inspections.store_school_inspection']
    schoolDetailsPage: typeof routes['inspections.school_details_page']
    approveSchoolPage: typeof routes['inspections.approve_school_page']
    approveAndGenerateCredentials: typeof routes['inspections.approve_and_generate_credentials']
    rejectSchool: typeof routes['inspections.reject_school']
    toggleSuspendSchool: typeof routes['inspections.toggle_suspend_school']
    communicationsGlobalPage: typeof routes['inspections.communications_global_page']
    communicationsSchoolPage: typeof routes['inspections.communications_school_page']
    communicationsHistoryPage: typeof routes['inspections.communications_history_page']
    communicationDetails: typeof routes['inspections.communication_details']
    reportsSchoolsPage: typeof routes['inspections.reports_schools_page']
    reportsPerformancePage: typeof routes['inspections.reports_performance_page']
    reportsStatisticsPage: typeof routes['inspections.reports_statistics_page']
    reportsTransfersPage: typeof routes['inspections.reports_transfers_page']
    schoolReportPage: typeof routes['inspections.school_report_page']
    settingsPage: typeof routes['inspections.settings_page']
    exportSchools: typeof routes['inspections.export_schools']
    schoolsReportData: typeof routes['inspections.schools_report_data']
    performanceReportData: typeof routes['inspections.performance_report_data']
    statisticsReportData: typeof routes['inspections.statistics_report_data']
    transfersReportData: typeof routes['inspections.transfers_report_data']
    exportTransfersReport: typeof routes['inspections.export_transfers_report']
    triggerBackup: typeof routes['inspections.trigger_backup']
    downloadBackup: typeof routes['inspections.download_backup']
    logs: typeof routes['inspections.logs']
    exportLogs: typeof routes['inspections.export_logs']
    getAllSchools: typeof routes['inspections.get_all_schools']
    getSchoolById: typeof routes['inspections.get_school_by_id']
    approveSchool: typeof routes['inspections.approve_school']
    suspendSchool: typeof routes['inspections.suspend_school']
    inspectSchool: typeof routes['inspections.inspect_school']
    sendGlobalCommunication: typeof routes['inspections.send_global_communication']
    getGlobalStats: typeof routes['inspections.get_global_stats']
    generateSchoolReport: typeof routes['inspections.generate_school_report']
  }
  messages: {
    sendSchoolCommunication: typeof routes['messages.send_school_communication']
    getMessages: typeof routes['messages.get_messages']
    sendMessage: typeof routes['messages.send_message']
    markAsRead: typeof routes['messages.mark_as_read']
    getConversations: typeof routes['messages.get_conversations']
    getConversation: typeof routes['messages.get_conversation']
  }
  dashboard: typeof routes['dashboard']
  settings: typeof routes['settings'] & {
    getLanguage: typeof routes['settings.get_language']
    saveLanguage: typeof routes['settings.save_language']
    saveRegional: typeof routes['settings.save_regional']
    resetGeneral: typeof routes['settings.reset_general']
    updateEmail: typeof routes['settings.update_email']
    revokeSession: typeof routes['settings.revoke_session']
    revokeAllSessions: typeof routes['settings.revoke_all_sessions']
    deactivateAccount: typeof routes['settings.deactivate_account']
    deleteAccount: typeof routes['settings.delete_account']
    saveNotificationTypes: typeof routes['settings.save_notification_types']
    saveQuietHours: typeof routes['settings.save_quiet_hours']
    saveVisibility: typeof routes['settings.save_visibility']
    exportData: typeof routes['settings.export_data']
    deleteData: typeof routes['settings.delete_data']
    blockUser: typeof routes['settings.block_user']
    unblockUser: typeof routes['settings.unblock_user']
    general: typeof routes['settings.general'] & {
      store: typeof routes['settings.general.store']
    }
    accountPage: typeof routes['settings.account_page']
    languagePage: typeof routes['settings.language_page']
    notificationsPage: typeof routes['settings.notifications_page']
    saveNotifications: typeof routes['settings.save_notifications']
    privacyPage: typeof routes['settings.privacy_page']
  }
  teachers: {
    index: typeof routes['teachers.index']
    create: typeof routes['teachers.create']
    attendanceIndexPage: typeof routes['teachers.attendance_index_page']
    attendanceMarkPage: typeof routes['teachers.attendance_mark_page']
    getMyClasses: typeof routes['teachers.get_my_classes']
    getAssignments: typeof routes['teachers.get_assignments']
    createAssignment: typeof routes['teachers.create_assignment']
    gradeSubmission: typeof routes['teachers.grade_submission']
    createForumTopic: typeof routes['teachers.create_forum_topic']
    getClassStudentsForAttendance: typeof routes['teachers.get_class_students_for_attendance']
    getClassAttendance: typeof routes['teachers.get_class_attendance']
    markAttendance: typeof routes['teachers.mark_attendance']
  }
  communication: {
    messages: {
      compose: typeof routes['communication.messages.compose']
      sent: typeof routes['communication.messages.sent']
      inbox: typeof routes['communication.messages.inbox']
      read: typeof routes['communication.messages.read']
      edit: typeof routes['communication.messages.edit']
      update: typeof routes['communication.messages.update']
      markAllRead: typeof routes['communication.messages.mark_all_read']
      delete: typeof routes['communication.messages.delete']
      send: typeof routes['communication.messages.send'] & {
        redirect: typeof routes['communication.messages.send.redirect']
      }
    }
    notifications: {
      index: typeof routes['communication.notifications.index']
    }
    sendGlobalCommunication: typeof routes['communication.send_global_communication']
    sendSchoolCommunication: typeof routes['communication.send_school_communication']
  }
  api: {
    notifications: {
      index: typeof routes['api.notifications.index']
      read: typeof routes['api.notifications.read'] & {
        put: typeof routes['api.notifications.read.put']
      }
      markAllRead: typeof routes['api.notifications.mark_all_read']
      readAll: typeof routes['api.notifications.read_all']
      deleteAll: typeof routes['api.notifications.delete_all']
    }
    teacher: {
      attendance: {
        classes: {
          students: typeof routes['api.teacher.attendance.classes.students']
        }
        class: typeof routes['api.teacher.attendance.class']
        store: typeof routes['api.teacher.attendance.store']
      }
    }
    teachers: {
      availableSlots: typeof routes['api.teachers.available_slots']
    }
  }
  profile: typeof routes['profile'] & {
    edit: typeof routes['profile.edit']
    security: typeof routes['profile.security']
    preferences: typeof routes['profile.preferences'] & {
      update: typeof routes['profile.preferences.update']
    }
    activity: typeof routes['profile.activity']
    avatar: {
      update: typeof routes['profile.avatar.update']
    }
  }
  academic: {
    classes: {
      index: typeof routes['academic.classes.index']
      create: typeof routes['academic.classes.create']
      seedRdcDas: typeof routes['academic.classes.seed_rdc_das']
      store: typeof routes['academic.classes.store']
      show: typeof routes['academic.classes.show']
      edit: typeof routes['academic.classes.edit']
      update: typeof routes['academic.classes.update'] & {
        post: typeof routes['academic.classes.update.post']
      }
      destroy: typeof routes['academic.classes.destroy']
      students: typeof routes['academic.classes.students']
      subjects: typeof routes['academic.classes.subjects']
    }
    grades: {
      index: typeof routes['academic.grades.index']
      add: typeof routes['academic.grades.add']
      store: typeof routes['academic.grades.store']
      publish: typeof routes['academic.grades.publish']
      class: typeof routes['academic.grades.class']
    }
    timetable: {
      create: typeof routes['academic.timetable.create']
      class: typeof routes['academic.timetable.class']
    }
    calendar: typeof routes['academic.calendar']
  }
  legacy: {
    api: {
      classes: {
        students: typeof routes['legacy.api.classes.students']
        subjects: typeof routes['legacy.api.classes.subjects']
      }
      grades: {
        class: typeof routes['legacy.api.grades.class']
      }
      timetable: {
        class: typeof routes['legacy.api.timetable.class']
        create: typeof routes['legacy.api.timetable.create']
      }
      students: {
        financialStatus: typeof routes['legacy.api.students.financial_status']
      }
    }
  }
  students: {
    index: typeof routes['students.index']
    create: typeof routes['students.create']
    store: typeof routes['students.store']
    show: typeof routes['students.show']
    getMyProfile: typeof routes['students.get_my_profile']
    getMyGrades: typeof routes['students.get_my_grades']
    getMyReportCard: typeof routes['students.get_my_report_card']
    getMyDiscipline: typeof routes['students.get_my_discipline']
    getAssignments: typeof routes['students.get_assignments']
    submitAssignment: typeof routes['students.submit_assignment']
    getMyForumQuestions: typeof routes['students.get_my_forum_questions']
    postForumQuestion: typeof routes['students.post_forum_question']
    sendMessageToTeacher: typeof routes['students.send_message_to_teacher']
    getMyTimetable: typeof routes['students.get_my_timetable']
    getMyAttendance: typeof routes['students.get_my_attendance']
    requestTransfer: typeof routes['students.request_transfer']
  }
  discipline: {
    dashboard: typeof routes['discipline.dashboard']
    incidents: {
      index: typeof routes['discipline.incidents.index']
      report: typeof routes['discipline.incidents.report']
      store: typeof routes['discipline.incidents.store']
      show: typeof routes['discipline.incidents.show']
      edit: typeof routes['discipline.incidents.edit']
      update: typeof routes['discipline.incidents.update'] & {
        post: typeof routes['discipline.incidents.update.post']
      }
      destroy: typeof routes['discipline.incidents.destroy']
    }
    students: {
      index: typeof routes['discipline.students.index']
      show: typeof routes['discipline.students.show']
    }
    sanctions: {
      apply: typeof routes['discipline.sanctions.apply'] & {
        store: typeof routes['discipline.sanctions.apply.store']
      }
    }
  }
  financial: {
    index: typeof routes['financial.index']
    fees: {
      index: typeof routes['financial.fees.index']
      create: typeof routes['financial.fees.create']
      store: typeof routes['financial.fees.store']
      structure: typeof routes['financial.fees.structure']
      edit: typeof routes['financial.fees.edit']
      update: typeof routes['financial.fees.update'] & {
        post: typeof routes['financial.fees.update.post']
      }
      toggleStatus: typeof routes['financial.fees.toggle_status']
      destroy: typeof routes['financial.fees.destroy']
    }
    payments: {
      index: typeof routes['financial.payments.index']
      record: typeof routes['financial.payments.record']
      store: typeof routes['financial.payments.store']
      receipt: typeof routes['financial.payments.receipt']
      print: typeof routes['financial.payments.print']
      destroy: typeof routes['financial.payments.destroy']
    }
    reports: {
      income: typeof routes['financial.reports.income']
      outstanding: typeof routes['financial.reports.outstanding']
      statistics: typeof routes['financial.reports.statistics']
      export: typeof routes['financial.reports.export']
    }
  }
  academics: {
    studentGradesPage: typeof routes['academics.student_grades_page']
    getClasses: typeof routes['academics.get_classes']
    createClass: typeof routes['academics.create_class']
    getClassById: typeof routes['academics.get_class_by_id']
    updateClass: typeof routes['academics.update_class']
    deleteClass: typeof routes['academics.delete_class']
    getClassStudents: typeof routes['academics.get_class_students']
    getSubjects: typeof routes['academics.get_subjects']
    createSubject: typeof routes['academics.create_subject']
    updateSubject: typeof routes['academics.update_subject']
    deleteSubject: typeof routes['academics.delete_subject']
    getClassSubjects: typeof routes['academics.get_class_subjects']
    addSubjectToClass: typeof routes['academics.add_subject_to_class']
    removeSubjectFromClass: typeof routes['academics.remove_subject_from_class']
    getGradesByClass: typeof routes['academics.get_grades_by_class']
    getGradesByStudent: typeof routes['academics.get_grades_by_student']
    addGrade: typeof routes['academics.add_grade']
    updateGrade: typeof routes['academics.update_grade']
    deleteGrade: typeof routes['academics.delete_grade']
    publishGrades: typeof routes['academics.publish_grades']
    getAcademicStats: typeof routes['academics.get_academic_stats']
    getProgressStats: typeof routes['academics.get_progress_stats']
  }
  parents: {
    childGradesDetailsPage: typeof routes['parents.child_grades_details_page']
    disciplinePage: typeof routes['parents.discipline_page']
    attendancePage: typeof routes['parents.attendance_page']
    paymentsPage: typeof routes['parents.payments_page']
    appointmentsPage: typeof routes['parents.appointments_page']
    appointmentRequestPage: typeof routes['parents.appointment_request_page']
    requestAppointment: typeof routes['parents.request_appointment']
    getChildren: typeof routes['parents.get_children']
    getChildGrades: typeof routes['parents.get_child_grades']
    sendMessageToTeacher: typeof routes['parents.send_message_to_teacher']
    getChildPayments: typeof routes['parents.get_child_payments']
    getChildAttendance: typeof routes['parents.get_child_attendance']
    justifyAbsence: typeof routes['parents.justify_absence']
  }
  auth: {
    login: typeof routes['auth.login']
    requestOtp: typeof routes['auth.request_otp']
    verifyOtp: typeof routes['auth.verify_otp']
    forgotPassword: typeof routes['auth.forgot_password']
    resetPassword: typeof routes['auth.reset_password']
    logout: typeof routes['auth.logout']
    changePassword: typeof routes['auth.change_password']
    getProfile: typeof routes['auth.get_profile']
    updateProfile: typeof routes['auth.update_profile']
    generateSchoolCredentials: typeof routes['auth.generate_school_credentials']
  }
  transfers: {
    verifyAuthorization: typeof routes['transfers.verify_authorization']
    requestTransfer: typeof routes['transfers.request_transfer']
    getPendingTransfers: typeof routes['transfers.get_pending_transfers']
    approveTransfer: typeof routes['transfers.approve_transfer']
    rejectTransfer: typeof routes['transfers.reject_transfer']
    completeTransfer: typeof routes['transfers.complete_transfer']
  }
  pedagogicals: {
    generateReportCard: typeof routes['pedagogicals.generate_report_card']
    getClassTimetable: typeof routes['pedagogicals.get_class_timetable']
    createTimetable: typeof routes['pedagogicals.create_timetable']
    publishGrades: typeof routes['pedagogicals.publish_grades']
    createAcademicCalendar: typeof routes['pedagogicals.create_academic_calendar']
    createExamSchedule: typeof routes['pedagogicals.create_exam_schedule']
    getStudentProgress: typeof routes['pedagogicals.get_student_progress']
  }
  financials: {
    getFees: typeof routes['financials.get_fees']
    setFees: typeof routes['financials.set_fees']
    updateFees: typeof routes['financials.update_fees']
    deleteFees: typeof routes['financials.delete_fees']
    recordPayment: typeof routes['financials.record_payment']
    getStudentPayments: typeof routes['financials.get_student_payments']
    getIncomeReport: typeof routes['financials.get_income_report']
    getFinancialStats: typeof routes['financials.get_financial_stats']
  }
  disciplines: {
    getStudents: typeof routes['disciplines.get_students']
    getStudentDetails: typeof routes['disciplines.get_student_details']
    reportIncident: typeof routes['disciplines.report_incident']
    deleteIncident: typeof routes['disciplines.delete_incident']
    applySanction: typeof routes['disciplines.apply_sanction']
    notifyParent: typeof routes['disciplines.notify_parent']
  }
  interSchools: {
    searchSchools: typeof routes['inter_schools.search_schools']
    getSchoolPublicInfo: typeof routes['inter_schools.get_school_public_info']
    startExchange: typeof routes['inter_schools.start_exchange']
    getBestPractices: typeof routes['inter_schools.get_best_practices']
    shareBestPractice: typeof routes['inter_schools.share_best_practice']
    getEvents: typeof routes['inter_schools.get_events']
    createEvent: typeof routes['inter_schools.create_event']
    joinEvent: typeof routes['inter_schools.join_event']
  }
  admin: {
    getUsers: typeof routes['admin.get_users']
    createUser: typeof routes['admin.create_user']
    updateUser: typeof routes['admin.update_user']
    deleteUser: typeof routes['admin.delete_user']
    activateUser: typeof routes['admin.activate_user']
    suspendUser: typeof routes['admin.suspend_user']
    getRoles: typeof routes['admin.get_roles']
    createRole: typeof routes['admin.create_role']
    updateRole: typeof routes['admin.update_role']
    getSystemLogs: typeof routes['admin.get_system_logs']
    getUserActivityLogs: typeof routes['admin.get_user_activity_logs']
  }
}
