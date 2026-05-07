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
  about: typeof routes['about']
  help: {
    index: typeof routes['help.index']
    faq: typeof routes['help.faq']
    guides: typeof routes['help.guides']
    tutorial: typeof routes['help.tutorial']
    contact: typeof routes['help.contact']
    documentation: typeof routes['help.documentation']
  }
  schools: {
    registerSchool: typeof routes['schools.register_school']
    dashboard: typeof routes['schools.dashboard']
    updateSchoolProfile: typeof routes['schools.update_school_profile']
    addTeacher: typeof routes['schools.add_teacher']
  }
  auth: {
    login: typeof routes['auth.login']
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
  inspections: {
    getAllSchools: typeof routes['inspections.get_all_schools']
    getSchoolById: typeof routes['inspections.get_school_by_id']
    approveSchool: typeof routes['inspections.approve_school']
    suspendSchool: typeof routes['inspections.suspend_school']
    inspectSchool: typeof routes['inspections.inspect_school']
    sendGlobalCommunication: typeof routes['inspections.send_global_communication']
    getGlobalStats: typeof routes['inspections.get_global_stats']
    generateSchoolReport: typeof routes['inspections.generate_school_report']
  }
  inspection: {
    sendSchoolCommunication: typeof routes['inspection.send_school_communication']
  }
  academics: {
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
    getGradesByClass: typeof routes['academics.get_grades_by_class']
    getGradesByStudent: typeof routes['academics.get_grades_by_student']
    addGrade: typeof routes['academics.add_grade']
    updateGrade: typeof routes['academics.update_grade']
    deleteGrade: typeof routes['academics.delete_grade']
    publishGrades: typeof routes['academics.publish_grades']
    getAcademicStats: typeof routes['academics.get_academic_stats']
    getProgressStats: typeof routes['academics.get_progress_stats']
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
  teachers: {
    getMyClasses: typeof routes['teachers.get_my_classes']
    getAssignments: typeof routes['teachers.get_assignments']
    createAssignment: typeof routes['teachers.create_assignment']
    gradeSubmission: typeof routes['teachers.grade_submission']
    createForumTopic: typeof routes['teachers.create_forum_topic']
    markAttendance: typeof routes['teachers.mark_attendance']
  }
  parents: {
    getChildren: typeof routes['parents.get_children']
    getChildGrades: typeof routes['parents.get_child_grades']
    sendMessageToTeacher: typeof routes['parents.send_message_to_teacher']
    getChildPayments: typeof routes['parents.get_child_payments']
    justifyAbsence: typeof routes['parents.justify_absence']
  }
  students: {
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
  disciplines: {
    getStudents: typeof routes['disciplines.get_students']
    getStudentDetails: typeof routes['disciplines.get_student_details']
    reportIncident: typeof routes['disciplines.report_incident']
    deleteIncident: typeof routes['disciplines.delete_incident']
    applySanction: typeof routes['disciplines.apply_sanction']
    notifyParent: typeof routes['disciplines.notify_parent']
  }
  messages: {
    getMessages: typeof routes['messages.get_messages']
    sendMessage: typeof routes['messages.send_message']
    markAsRead: typeof routes['messages.mark_as_read']
    getConversations: typeof routes['messages.get_conversations']
    getConversation: typeof routes['messages.get_conversation']
  }
  communication: {
    sendGlobalCommunication: typeof routes['communication.send_global_communication']
    sendSchoolCommunication: typeof routes['communication.send_school_communication']
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
