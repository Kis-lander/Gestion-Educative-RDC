/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  welcome: {
    index: typeof routes['welcome.index']
    landing: typeof routes['welcome.landing']
    testimonials: {
      store: typeof routes['welcome.testimonials.store']
    }
    about: typeof routes['welcome.about']
    features: typeof routes['welcome.features']
    contact: typeof routes['welcome.contact']
    terms: typeof routes['welcome.terms']
  }
  home: typeof routes['home']
  about: typeof routes['about']
  errors: {
    maintenance: typeof routes['errors.maintenance']
  }
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
      credentials: typeof routes['schools.accounts.credentials']
    }
    classes: {
      index: typeof routes['schools.classes.index']
      archives: typeof routes['schools.classes.archives']
      restore: typeof routes['schools.classes.restore']
      destroyPermanently: typeof routes['schools.classes.destroy_permanently']
      create: typeof routes['schools.classes.create']
      seedRdcDas: typeof routes['schools.classes.seed_rdc_das']
      store: typeof routes['schools.classes.store']
      students: typeof routes['schools.classes.students']
      edit: typeof routes['schools.classes.edit']
      show: typeof routes['schools.classes.show']
      subjects: {
        store: typeof routes['schools.classes.subjects.store']
        destroy: typeof routes['schools.classes.subjects.destroy']
      }
      update: typeof routes['schools.classes.update'] & {
        post: typeof routes['schools.classes.update.post']
      }
      destroy: typeof routes['schools.classes.destroy'] & {
        post: typeof routes['schools.classes.destroy.post']
      }
    }
    timetable: {
      index: typeof routes['schools.timetable.index']
      create: typeof routes['schools.timetable.create']
      store: typeof routes['schools.timetable.store']
    }
    transfers: {
      request: typeof routes['schools.transfers.request']
    }
    teachers: {
      index: typeof routes['schools.teachers.index']
      create: typeof routes['schools.teachers.create']
      store: typeof routes['schools.teachers.store']
      show: typeof routes['schools.teachers.show']
      edit: typeof routes['schools.teachers.edit']
      schedule: typeof routes['schools.teachers.schedule']
      credentials: typeof routes['schools.teachers.credentials']
      update: typeof routes['schools.teachers.update'] & {
        post: typeof routes['schools.teachers.update.post']
      }
      replace: typeof routes['schools.teachers.replace']
      destroy: typeof routes['schools.teachers.destroy']
    }
    profile: {
      update: {
        web: typeof routes['schools.profile.update.web']
      }
    }
    subjects: {
      index: typeof routes['schools.subjects.index']
      store: typeof routes['schools.subjects.store']
      assign: typeof routes['schools.subjects.assign'] & {
        store: typeof routes['schools.subjects.assign.store']
      }
      catalog: typeof routes['schools.subjects.catalog']
      assignments: {
        destroy: typeof routes['schools.subjects.assignments.destroy']
      }
      classes: typeof routes['schools.subjects.classes'] & {
        destroy: typeof routes['schools.subjects.classes.destroy']
      }
      edit: typeof routes['schools.subjects.edit']
      update: typeof routes['schools.subjects.update'] & {
        post: typeof routes['schools.subjects.update.post']
      }
      destroy: typeof routes['schools.subjects.destroy']
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
    contact: typeof routes['help.contact'] & {
      send: typeof routes['help.contact.send']
    }
    documentation: typeof routes['help.documentation']
    views: {
      track: typeof routes['help.views.track']
    }
    feedback: typeof routes['help.feedback']
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
      carousel: {
        store: typeof routes['inspection.settings.carousel.store']
        update: typeof routes['inspection.settings.carousel.update']
        delete: typeof routes['inspection.settings.carousel.delete']
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
    rejectSchoolRedirect: typeof routes['inspections.reject_school_redirect']
    rejectSchool: typeof routes['inspections.reject_school']
    toggleSuspendSchool: typeof routes['inspections.toggle_suspend_school']
    deleteSchool: typeof routes['inspections.delete_school']
    inspectionTeachersPage: typeof routes['inspections.inspection_teachers_page']
    communicationsGlobalPage: typeof routes['inspections.communications_global_page']
    communicationsSchoolPage: typeof routes['inspections.communications_school_page']
    communicationsHistoryPage: typeof routes['inspections.communications_history_page']
    communicationDetails: typeof routes['inspections.communication_details']
    helpFeedbackPage: typeof routes['inspections.help_feedback_page']
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
    conversationPage: typeof routes['messages.conversation_page']
    trashPage: typeof routes['messages.trash_page']
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
    dashboardPage: typeof routes['teachers.dashboard_page']
    classesPage: typeof routes['teachers.classes_page']
    classShowPage: typeof routes['teachers.class_show_page']
    classStudentsPage: typeof routes['teachers.class_students_page']
    assignmentsPage: typeof routes['teachers.assignments_page']
    assignmentCreatePage: typeof routes['teachers.assignment_create_page']
    storeAssignmentWeb: typeof routes['teachers.store_assignment_web']
    gradeSubmissionPage: typeof routes['teachers.grade_submission_page']
    assignmentShowPage: typeof routes['teachers.assignment_show_page']
    assignmentEditPage: typeof routes['teachers.assignment_edit_page']
    publishAssignment: typeof routes['teachers.publish_assignment']
    closeAssignment: typeof routes['teachers.close_assignment']
    removeAssignmentAttachment: typeof routes['teachers.remove_assignment_attachment']
    assignmentSubmissionsPage: typeof routes['teachers.assignment_submissions_page']
    attendanceIndexPage: typeof routes['teachers.attendance_index_page']
    attendanceMarkPage: typeof routes['teachers.attendance_mark_page']
    attendanceReportPage: typeof routes['teachers.attendance_report_page']
    attendanceStudentPage: typeof routes['teachers.attendance_student_page']
    gradesPage: typeof routes['teachers.grades_page']
    gradeAddPage: typeof routes['teachers.grade_add_page']
    storeGradeWeb: typeof routes['teachers.store_grade_web']
    gradeClassPage: typeof routes['teachers.grade_class_page']
    gradeEditPage: typeof routes['teachers.grade_edit_page']
    timetablePage: typeof routes['teachers.timetable_page']
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
      restore: typeof routes['communication.messages.restore']
      permanentDelete: typeof routes['communication.messages.permanent_delete']
      emptyTrash: typeof routes['communication.messages.empty_trash']
      restoreAll: typeof routes['communication.messages.restore_all']
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
    messages: {
      unreadCount: typeof routes['api.messages.unread_count']
      conversation: typeof routes['api.messages.conversation'] & {
        export: typeof routes['api.messages.conversation.export']
      }
      send: typeof routes['api.messages.send']
      updateConversation: typeof routes['api.messages.update_conversation']
      deleteConversation: typeof routes['api.messages.delete_conversation']
      attachment: typeof routes['api.messages.attachment']
      restore: typeof routes['api.messages.restore']
      permanentDelete: typeof routes['api.messages.permanent_delete']
      emptyTrash: typeof routes['api.messages.empty_trash']
      restoreAll: typeof routes['api.messages.restore_all']
    }
    forum: {
      attachment: typeof routes['api.forum.attachment']
      topic: {
        view: typeof routes['api.forum.topic.view']
      }
      message: {
        react: typeof routes['api.forum.message.react']
      }
    }
    student: {
      forum: {
        export: typeof routes['api.student.forum.export']
        topic: {
          resolve: typeof routes['api.student.forum.topic.resolve']
          view: typeof routes['api.student.forum.topic.view']
        }
      }
      pendingAssignmentsCount: typeof routes['api.student.pending_assignments_count']
    }
    teacher: {
      forum: {
        export: typeof routes['api.teacher.forum.export']
      }
      assignments: {
        export: typeof routes['api.teacher.assignments.export']
        submissions: {
          export: typeof routes['api.teacher.assignments.submissions.export']
        }
      }
      classes: {
        export: typeof routes['api.teacher.classes.export']
        subjects: typeof routes['api.teacher.classes.subjects']
        students: {
          export: typeof routes['api.teacher.classes.students.export']
        }
      }
      attendance: {
        classes: {
          students: typeof routes['api.teacher.attendance.classes.students']
        }
        class: typeof routes['api.teacher.attendance.class']
        export: typeof routes['api.teacher.attendance.export']
        student: typeof routes['api.teacher.attendance.student'] & {
          export: typeof routes['api.teacher.attendance.student.export']
        }
        store: typeof routes['api.teacher.attendance.store']
      }
      grades: {
        export: typeof routes['api.teacher.grades.export']
        class: typeof routes['api.teacher.grades.class'] & {
          export: typeof routes['api.teacher.grades.class.export']
          publish: typeof routes['api.teacher.grades.class.publish']
        }
        publish: typeof routes['api.teacher.grades.publish']
      }
      sendMessage: typeof routes['api.teacher.send_message']
      notifications: {
        count: typeof routes['api.teacher.notifications.count']
      }
    }
    notifications: {
      index: typeof routes['api.notifications.index']
      read: typeof routes['api.notifications.read'] & {
        put: typeof routes['api.notifications.read.put']
      }
      markAllRead: typeof routes['api.notifications.mark_all_read']
      readAll: typeof routes['api.notifications.read_all']
      deleteAll: typeof routes['api.notifications.delete_all']
    }
    teachers: {
      availableSlots: typeof routes['api.teachers.available_slots']
      resetPassword: typeof routes['api.teachers.reset_password']
      list: typeof routes['api.teachers.list']
    }
    profile: {
      advancedPreferences: {
        update: typeof routes['api.profile.advanced_preferences.update']
      }
    }
    parent: {
      attendance: {
        show: typeof routes['api.parent.attendance.show']
      }
      payments: {
        export: typeof routes['api.parent.payments.export']
        history: {
          export: typeof routes['api.parent.payments.history.export']
        }
      }
      messages: {
        send: typeof routes['api.parent.messages.send']
      }
    }
    reports: {
      academic: {
        performance: {
          export: typeof routes['api.reports.academic.performance.export']
        }
        class: {
          export: typeof routes['api.reports.academic.class.export']
        }
        student: {
          export: typeof routes['api.reports.academic.student.export']
        }
        subject: {
          export: typeof routes['api.reports.academic.subject.export']
        }
      }
      financial: {
        income: {
          export: typeof routes['api.reports.financial.income.export']
        }
        expenses: {
          export: typeof routes['api.reports.financial.expenses.export']
        }
        balance: {
          export: typeof routes['api.reports.financial.balance.export']
        }
        forecasts: {
          export: typeof routes['api.reports.financial.forecasts.export']
        }
      }
      disciplinary: {
        summary: {
          export: typeof routes['api.reports.disciplinary.summary.export']
        }
        trends: {
          export: typeof routes['api.reports.disciplinary.trends.export']
        }
        comparisons: {
          export: typeof routes['api.reports.disciplinary.comparisons.export']
        }
      }
    }
  }
  profile: typeof routes['profile'] & {
    edit: typeof routes['profile.edit']
    security: typeof routes['profile.security']
    changePassword: typeof routes['profile.change_password']
    preferences: typeof routes['profile.preferences'] & {
      update: typeof routes['profile.preferences.update']
    }
    notificationsPreferences: {
      update: typeof routes['profile.notifications_preferences.update']
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
      edit: typeof routes['academic.grades.edit']
      update: {
        web: typeof routes['academic.grades.update.web']
      }
      delete: {
        web: typeof routes['academic.grades.delete.web']
      }
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
    profilePage: typeof routes['students.profile_page']
    assignmentsPage: typeof routes['students.assignments_page']
    assignmentShowPage: typeof routes['students.assignment_show_page']
    assignmentSubmitPage: typeof routes['students.assignment_submit_page']
    submitAssignmentWeb: typeof routes['students.submit_assignment_web']
    gradesPage: typeof routes['students.grades_page']
    getMyProfile: typeof routes['students.get_my_profile']
    getMyGrades: typeof routes['students.get_my_grades']
    getMyReportCard: typeof routes['students.get_my_report_card']
    getMyDiscipline: typeof routes['students.get_my_discipline']
    getAssignments: typeof routes['students.get_assignments']
    pendingAssignmentsCount: typeof routes['students.pending_assignments_count']
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
  transfers: {
    authorizeTransferPage: typeof routes['transfers.authorize_transfer_page']
    pendingTransfersPage: typeof routes['transfers.pending_transfers_page']
    requestsPage: typeof routes['transfers.requests_page']
    transferHistoryPage: typeof routes['transfers.transfer_history_page']
    transferDetails: typeof routes['transfers.transfer_details']
    updateReason: typeof routes['transfers.update_reason']
    cancelTransfer: typeof routes['transfers.cancel_transfer']
    authorizeTransfer: typeof routes['transfers.authorize_transfer']
    rejectIncomingTransfer: typeof routes['transfers.reject_incoming_transfer']
    verifyAuthorization: typeof routes['transfers.verify_authorization']
    requestTransfer: typeof routes['transfers.request_transfer']
    getPendingTransfers: typeof routes['transfers.get_pending_transfers']
    approveTransfer: typeof routes['transfers.approve_transfer']
    rejectTransfer: typeof routes['transfers.reject_transfer']
    completeTransfer: typeof routes['transfers.complete_transfer']
  }
  academics: {
    studentGradesPage: typeof routes['academics.student_grades_page']
    publishGradesPage: typeof routes['academics.publish_grades_page']
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
  teacher: {
    assignments: {
      submissions: {
        grade: {
          store: typeof routes['teacher.assignments.submissions.grade.store']
          update: typeof routes['teacher.assignments.submissions.grade.update']
        }
      }
      update: {
        post: typeof routes['teacher.assignments.update.post']
        put: typeof routes['teacher.assignments.update.put']
      }
    }
    students: {
      grades: typeof routes['teacher.students.grades']
    }
    grades: {
      update: typeof routes['teacher.grades.update']
      delete: typeof routes['teacher.grades.delete']
    }
    forum: {
      topic: {
        update: typeof routes['teacher.forum.topic.update']
        delete: typeof routes['teacher.forum.topic.delete']
      }
      reply: {
        update: typeof routes['teacher.forum.reply.update']
        delete: typeof routes['teacher.forum.reply.delete']
      }
    }
  }
  forums: {
    teacherIndex: typeof routes['forums.teacher_index']
    teacherCreate: typeof routes['forums.teacher_create']
    storeTeacherTopic: typeof routes['forums.store_teacher_topic']
    myTeacherTopics: typeof routes['forums.my_teacher_topics']
    teacherTopic: typeof routes['forums.teacher_topic']
    teacherReply: typeof routes['forums.teacher_reply']
    toggleLock: typeof routes['forums.toggle_lock']
    togglePin: typeof routes['forums.toggle_pin']
    studentIndex: typeof routes['forums.student_index']
    studentCreate: typeof routes['forums.student_create']
    storeStudentTopic: typeof routes['forums.store_student_topic']
    myStudentQuestions: typeof routes['forums.my_student_questions']
    studentTopic: typeof routes['forums.student_topic']
    studentReply: typeof routes['forums.student_reply']
  }
  student: {
    assignments: {
      submissions: {
        index: typeof routes['student.assignments.submissions.index']
        show: typeof routes['student.assignments.submissions.show']
        legacy: typeof routes['student.assignments.submissions.legacy']
      }
    }
    forum: {
      topic: {
        update: typeof routes['student.forum.topic.update']
        delete: typeof routes['student.forum.topic.delete']
      }
      reply: {
        update: typeof routes['student.forum.reply.update']
        delete: typeof routes['student.forum.reply.delete']
      }
    }
  }
  parents: {
    dashboardPage: typeof routes['parents.dashboard_page']
    childrenPage: typeof routes['parents.children_page']
    classesPage: typeof routes['parents.classes_page']
    subjectsPage: typeof routes['parents.subjects_page']
    teachersPage: typeof routes['parents.teachers_page']
    childShowPage: typeof routes['parents.child_show_page']
    childProfilePage: typeof routes['parents.child_profile_page']
    gradesPage: typeof routes['parents.grades_page']
    childGradesDetailsPage: typeof routes['parents.child_grades_details_page']
    disciplinePage: typeof routes['parents.discipline_page']
    attendancePage: typeof routes['parents.attendance_page']
    attendanceJustifyPage: typeof routes['parents.attendance_justify_page']
    paymentsPage: typeof routes['parents.payments_page']
    paymentsHistoryPage: typeof routes['parents.payments_history_page']
    paymentsStatusPage: typeof routes['parents.payments_status_page']
    paymentStatusPdfRedirect: typeof routes['parents.payment_status_pdf_redirect']
    initiatePaymentRedirect: typeof routes['parents.initiate_payment_redirect']
    paymentPlanRequestRedirect: typeof routes['parents.payment_plan_request_redirect']
    paymentReceiptPage: typeof routes['parents.payment_receipt_page']
    printPaymentReceiptPage: typeof routes['parents.print_payment_receipt_page']
    parentMessagesPage: typeof routes['parents.parent_messages_page']
    parentMessageSendPage: typeof routes['parents.parent_message_send_page']
    parentNotificationsPage: typeof routes['parents.parent_notifications_page']
    parentConversationPage: typeof routes['parents.parent_conversation_page']
    appointmentsPage: typeof routes['parents.appointments_page']
    appointmentRequestPage: typeof routes['parents.appointment_request_page']
    requestAppointment: typeof routes['parents.request_appointment']
    childrenStats: typeof routes['parents.children_stats']
    exportGrades: typeof routes['parents.export_grades']
    exportAttendance: typeof routes['parents.export_attendance']
    appointmentSchedule: typeof routes['parents.appointment_schedule']
    cancelAppointment: typeof routes['parents.cancel_appointment']
    exportAppointments: typeof routes['parents.export_appointments']
    parentConversationData: typeof routes['parents.parent_conversation_data']
    markConversationRead: typeof routes['parents.mark_conversation_read']
    markAllParentMessagesRead: typeof routes['parents.mark_all_parent_messages_read']
    respondToIncident: typeof routes['parents.respond_to_incident']
    markNotificationRead: typeof routes['parents.mark_notification_read']
    markAllNotificationsRead: typeof routes['parents.mark_all_notifications_read']
    deleteAllNotifications: typeof routes['parents.delete_all_notifications']
    parentUnreadCount: typeof routes['parents.parent_unread_count']
    getChildren: typeof routes['parents.get_children']
    getChildGrades: typeof routes['parents.get_child_grades']
    sendMessageToTeacher: typeof routes['parents.send_message_to_teacher']
    getChildPayments: typeof routes['parents.get_child_payments']
    getChildAttendance: typeof routes['parents.get_child_attendance']
    justifyAbsence: typeof routes['parents.justify_absence']
  }
  parent: {
    grades: {
      reportCard: typeof routes['parent.grades.report_card']
    }
    reportCard: {
      child: typeof routes['parent.report_card.child']
    }
    discipline: {
      details: typeof routes['parent.discipline.details'] & {
        alias: typeof routes['parent.discipline.details.alias']
      }
    }
    attendance: {
      justify: {
        store: typeof routes['parent.attendance.justify.store']
      }
    }
    messages: {
      send: {
        store: typeof routes['parent.messages.send.store']
      }
    }
    appointments: {
      reschedule: typeof routes['parent.appointments.reschedule']
      show: {
        alias: typeof routes['parent.appointments.show.alias']
      }
    }
  }
  interSchool: {
    searchPage: typeof routes['inter_school.search_page']
    searchResultsPage: typeof routes['inter_school.search_results_page']
    schoolPublicPage: typeof routes['inter_school.school_public_page']
    contactSchool: typeof routes['inter_school.contact_school']
    eventsPage: typeof routes['inter_school.events_page']
    eventCreatePage: typeof routes['inter_school.event_create_page']
    storeEventWeb: typeof routes['inter_school.store_event_web']
    myEventsPage: typeof routes['inter_school.my_events_page']
    events: {
      show: typeof routes['inter-school.events.show'] & {
        alias: typeof routes['inter-school.events.show.alias']
      }
      edit: {
        alias: typeof routes['inter-school.events.edit.alias']
      }
    }
    eventRegisterPage: typeof routes['inter_school.event_register_page']
    registerEventWeb: typeof routes['inter_school.register_event_web']
    cancelEvent: typeof routes['inter_school.cancel_event']
    exchangesPage: typeof routes['inter_school.exchanges_page']
    exchangeStartPage: typeof routes['inter_school.exchange_start_page']
    storeExchangeWeb: typeof routes['inter_school.store_exchange_web']
    exchanges: {
      show: typeof routes['inter-school.exchanges.show'] & {
        alias: typeof routes['inter-school.exchanges.show.alias']
      }
    }
    exchangeMessagesPage: typeof routes['inter_school.exchange_messages_page']
    bestPracticesPage: typeof routes['inter_school.best_practices_page']
    bestPracticeCategoriesPage: typeof routes['inter_school.best_practice_categories_page']
    bestPracticeSharePage: typeof routes['inter_school.best_practice_share_page']
    storeBestPracticeWeb: typeof routes['inter_school.store_best_practice_web']
    bestPractices: {
      show: typeof routes['inter-school.best-practices.show'] & {
        alias: typeof routes['inter-school.best-practices.show.alias']
      }
    }
    saveSchool: typeof routes['inter_school.save_school']
    getSchoolPublicInfo: typeof routes['inter_school.get_school_public_info']
    exportSearch: typeof routes['inter_school.export_search']
    calendarEvents: typeof routes['inter_school.calendar_events']
    exportEvents: typeof routes['inter_school.export_events']
    cancelRegistration: typeof routes['inter_school.cancel_registration']
    exportExchanges: typeof routes['inter_school.export_exchanges']
    acceptExchange: typeof routes['inter_school.accept_exchange']
    declineExchange: typeof routes['inter_school.decline_exchange']
    completeExchange: typeof routes['inter_school.complete_exchange']
    exchangeMessages: typeof routes['inter_school.exchange_messages']
    sendExchangeMessage: typeof routes['inter_school.send_exchange_message']
    exportExchangeMessages: typeof routes['inter_school.export_exchange_messages']
    exportBestPractices: typeof routes['inter_school.export_best_practices']
    likeBestPractice: typeof routes['inter_school.like_best_practice']
    commentBestPractice: typeof routes['inter_school.comment_best_practice']
  }
  reports: {
    academicPerformanceData: typeof routes['reports.academic_performance_data']
    financialIncomeData: typeof routes['reports.financial_income_data']
    financialExpensesData: typeof routes['reports.financial_expenses_data']
    financialBalanceData: typeof routes['reports.financial_balance_data']
    financialForecastsData: typeof routes['reports.financial_forecasts_data']
    disciplinarySummaryData: typeof routes['reports.disciplinary_summary_data']
    disciplinaryTrendsData: typeof routes['reports.disciplinary_trends_data']
    disciplinaryComparisonsData: typeof routes['reports.disciplinary_comparisons_data']
    deleteExport: typeof routes['reports.delete_export']
    academicClassPage: typeof routes['reports.academic_class_page']
    academicPerformancePage: typeof routes['reports.academic_performance_page']
    academicSchoolPage: typeof routes['reports.academic_school_page']
    studentProgressPage: typeof routes['reports.student_progress_page']
    subjectReportPage: typeof routes['reports.subject_report_page']
    exportsPage: typeof routes['reports.exports_page']
    exportsGeneratePage: typeof routes['reports.exports_generate_page']
    generateExport: typeof routes['reports.generate_export']
    exportsDownloadsPage: typeof routes['reports.exports_downloads_page']
    downloadExport: typeof routes['reports.download_export']
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
