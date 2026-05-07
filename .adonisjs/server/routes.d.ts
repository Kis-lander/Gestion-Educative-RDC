import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'welcome.index': { paramsTuple?: []; params?: {} }
    'about': { paramsTuple?: []; params?: {} }
    'welcome.landing': { paramsTuple?: []; params?: {} }
    'welcome.about': { paramsTuple?: []; params?: {} }
    'welcome.features': { paramsTuple?: []; params?: {} }
    'welcome.contact': { paramsTuple?: []; params?: {} }
    'welcome.terms': { paramsTuple?: []; params?: {} }
    'help.index': { paramsTuple?: []; params?: {} }
    'help.faq': { paramsTuple?: []; params?: {} }
    'help.guides': { paramsTuple?: []; params?: {} }
    'help.tutorial': { paramsTuple?: []; params?: {} }
    'help.contact': { paramsTuple?: []; params?: {} }
    'help.documentation': { paramsTuple?: []; params?: {} }
    'schools.register_school': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.forgot_password': { paramsTuple?: []; params?: {} }
    'auth.reset_password': { paramsTuple?: []; params?: {} }
    'transfers.verify_authorization': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'auth.change_password': { paramsTuple?: []; params?: {} }
    'auth.get_profile': { paramsTuple?: []; params?: {} }
    'auth.update_profile': { paramsTuple?: []; params?: {} }
    'inspections.get_all_schools': { paramsTuple?: []; params?: {} }
    'inspections.get_school_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.approve_school': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.suspend_school': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.inspect_school': { paramsTuple?: []; params?: {} }
    'auth.generate_school_credentials': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.send_global_communication': { paramsTuple?: []; params?: {} }
    'inspection.send_school_communication': { paramsTuple?: []; params?: {} }
    'inspections.get_global_stats': { paramsTuple?: []; params?: {} }
    'inspections.generate_school_report': { paramsTuple?: []; params?: {} }
    'schools.dashboard': { paramsTuple?: []; params?: {} }
    'schools.update_school_profile': { paramsTuple?: []; params?: {} }
    'academics.get_classes': { paramsTuple?: []; params?: {} }
    'academics.create_class': { paramsTuple?: []; params?: {} }
    'academics.get_class_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academics.update_class': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academics.delete_class': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academics.get_class_students': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academics.get_subjects': { paramsTuple?: []; params?: {} }
    'academics.create_subject': { paramsTuple?: []; params?: {} }
    'academics.update_subject': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academics.delete_subject': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academics.get_class_subjects': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'academics.add_subject_to_class': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'academics.get_grades_by_class': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'academics.get_grades_by_student': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'academics.add_grade': { paramsTuple?: []; params?: {} }
    'academics.update_grade': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academics.delete_grade': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academics.publish_grades': { paramsTuple?: []; params?: {} }
    'schools.add_teacher': { paramsTuple?: []; params?: {} }
    'transfers.request_transfer': { paramsTuple?: []; params?: {} }
    'transfers.get_pending_transfers': { paramsTuple?: []; params?: {} }
    'transfers.approve_transfer': { paramsTuple?: []; params?: {} }
    'transfers.reject_transfer': { paramsTuple?: []; params?: {} }
    'transfers.complete_transfer': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academics.get_academic_stats': { paramsTuple?: []; params?: {} }
    'academics.get_progress_stats': { paramsTuple?: []; params?: {} }
    'pedagogicals.generate_report_card': { paramsTuple?: []; params?: {} }
    'pedagogicals.get_class_timetable': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'pedagogicals.create_timetable': { paramsTuple?: []; params?: {} }
    'pedagogicals.publish_grades': { paramsTuple?: []; params?: {} }
    'pedagogicals.create_academic_calendar': { paramsTuple?: []; params?: {} }
    'pedagogicals.create_exam_schedule': { paramsTuple?: []; params?: {} }
    'pedagogicals.get_student_progress': { paramsTuple?: []; params?: {} }
    'financials.get_fees': { paramsTuple?: []; params?: {} }
    'financials.set_fees': { paramsTuple?: []; params?: {} }
    'financials.update_fees': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financials.delete_fees': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financials.record_payment': { paramsTuple?: []; params?: {} }
    'financials.get_student_payments': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'financials.get_income_report': { paramsTuple?: []; params?: {} }
    'financials.get_financial_stats': { paramsTuple?: []; params?: {} }
    'teachers.get_my_classes': { paramsTuple?: []; params?: {} }
    'teachers.get_assignments': { paramsTuple?: []; params?: {} }
    'teachers.create_assignment': { paramsTuple?: []; params?: {} }
    'teachers.grade_submission': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teachers.create_forum_topic': { paramsTuple?: []; params?: {} }
    'teachers.mark_attendance': { paramsTuple?: []; params?: {} }
    'parents.get_children': { paramsTuple?: []; params?: {} }
    'parents.get_child_grades': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'parents.send_message_to_teacher': { paramsTuple?: []; params?: {} }
    'parents.get_child_payments': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'parents.justify_absence': { paramsTuple?: []; params?: {} }
    'students.get_my_profile': { paramsTuple?: []; params?: {} }
    'students.get_my_grades': { paramsTuple?: []; params?: {} }
    'students.get_my_report_card': { paramsTuple?: []; params?: {} }
    'students.get_my_discipline': { paramsTuple?: []; params?: {} }
    'students.get_assignments': { paramsTuple?: []; params?: {} }
    'students.submit_assignment': { paramsTuple?: []; params?: {} }
    'students.get_my_forum_questions': { paramsTuple?: []; params?: {} }
    'students.post_forum_question': { paramsTuple?: []; params?: {} }
    'students.send_message_to_teacher': { paramsTuple?: []; params?: {} }
    'students.get_my_timetable': { paramsTuple?: []; params?: {} }
    'students.get_my_attendance': { paramsTuple?: []; params?: {} }
    'students.request_transfer': { paramsTuple?: []; params?: {} }
    'disciplines.get_students': { paramsTuple?: []; params?: {} }
    'disciplines.get_student_details': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'disciplines.report_incident': { paramsTuple?: []; params?: {} }
    'disciplines.delete_incident': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'disciplines.apply_sanction': { paramsTuple?: []; params?: {} }
    'disciplines.notify_parent': { paramsTuple?: []; params?: {} }
    'messages.get_messages': { paramsTuple?: []; params?: {} }
    'messages.send_message': { paramsTuple?: []; params?: {} }
    'messages.mark_as_read': { paramsTuple?: []; params?: {} }
    'messages.get_conversations': { paramsTuple?: []; params?: {} }
    'messages.get_conversation': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'communication.send_global_communication': { paramsTuple?: []; params?: {} }
    'communication.send_school_communication': { paramsTuple?: []; params?: {} }
    'inter_schools.search_schools': { paramsTuple?: []; params?: {} }
    'inter_schools.get_school_public_info': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inter_schools.start_exchange': { paramsTuple?: []; params?: {} }
    'inter_schools.get_best_practices': { paramsTuple?: []; params?: {} }
    'inter_schools.share_best_practice': { paramsTuple?: []; params?: {} }
    'inter_schools.get_events': { paramsTuple?: []; params?: {} }
    'inter_schools.create_event': { paramsTuple?: []; params?: {} }
    'inter_schools.join_event': { paramsTuple?: []; params?: {} }
    'admin.get_users': { paramsTuple?: []; params?: {} }
    'admin.create_user': { paramsTuple?: []; params?: {} }
    'admin.update_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.delete_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.activate_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.suspend_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.get_roles': { paramsTuple?: []; params?: {} }
    'admin.create_role': { paramsTuple?: []; params?: {} }
    'admin.update_role': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.get_system_logs': { paramsTuple?: []; params?: {} }
    'admin.get_user_activity_logs': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'welcome.index': { paramsTuple?: []; params?: {} }
    'about': { paramsTuple?: []; params?: {} }
    'welcome.landing': { paramsTuple?: []; params?: {} }
    'welcome.about': { paramsTuple?: []; params?: {} }
    'welcome.features': { paramsTuple?: []; params?: {} }
    'welcome.contact': { paramsTuple?: []; params?: {} }
    'welcome.terms': { paramsTuple?: []; params?: {} }
    'help.index': { paramsTuple?: []; params?: {} }
    'help.faq': { paramsTuple?: []; params?: {} }
    'help.guides': { paramsTuple?: []; params?: {} }
    'help.tutorial': { paramsTuple?: []; params?: {} }
    'help.contact': { paramsTuple?: []; params?: {} }
    'help.documentation': { paramsTuple?: []; params?: {} }
    'auth.get_profile': { paramsTuple?: []; params?: {} }
    'inspections.get_all_schools': { paramsTuple?: []; params?: {} }
    'inspections.get_school_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.get_global_stats': { paramsTuple?: []; params?: {} }
    'schools.dashboard': { paramsTuple?: []; params?: {} }
    'academics.get_classes': { paramsTuple?: []; params?: {} }
    'academics.get_class_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academics.get_class_students': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academics.get_subjects': { paramsTuple?: []; params?: {} }
    'academics.get_class_subjects': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'academics.get_grades_by_class': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'academics.get_grades_by_student': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'transfers.get_pending_transfers': { paramsTuple?: []; params?: {} }
    'academics.get_academic_stats': { paramsTuple?: []; params?: {} }
    'academics.get_progress_stats': { paramsTuple?: []; params?: {} }
    'pedagogicals.get_class_timetable': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'financials.get_fees': { paramsTuple?: []; params?: {} }
    'financials.get_student_payments': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'financials.get_income_report': { paramsTuple?: []; params?: {} }
    'financials.get_financial_stats': { paramsTuple?: []; params?: {} }
    'teachers.get_my_classes': { paramsTuple?: []; params?: {} }
    'teachers.get_assignments': { paramsTuple?: []; params?: {} }
    'parents.get_children': { paramsTuple?: []; params?: {} }
    'parents.get_child_grades': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'parents.get_child_payments': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'students.get_my_profile': { paramsTuple?: []; params?: {} }
    'students.get_my_grades': { paramsTuple?: []; params?: {} }
    'students.get_my_report_card': { paramsTuple?: []; params?: {} }
    'students.get_my_discipline': { paramsTuple?: []; params?: {} }
    'students.get_assignments': { paramsTuple?: []; params?: {} }
    'students.get_my_forum_questions': { paramsTuple?: []; params?: {} }
    'students.get_my_timetable': { paramsTuple?: []; params?: {} }
    'students.get_my_attendance': { paramsTuple?: []; params?: {} }
    'disciplines.get_students': { paramsTuple?: []; params?: {} }
    'disciplines.get_student_details': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'messages.get_messages': { paramsTuple?: []; params?: {} }
    'messages.get_conversations': { paramsTuple?: []; params?: {} }
    'messages.get_conversation': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'inter_schools.search_schools': { paramsTuple?: []; params?: {} }
    'inter_schools.get_school_public_info': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inter_schools.get_best_practices': { paramsTuple?: []; params?: {} }
    'inter_schools.get_events': { paramsTuple?: []; params?: {} }
    'admin.get_users': { paramsTuple?: []; params?: {} }
    'admin.get_roles': { paramsTuple?: []; params?: {} }
    'admin.get_system_logs': { paramsTuple?: []; params?: {} }
    'admin.get_user_activity_logs': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'welcome.index': { paramsTuple?: []; params?: {} }
    'about': { paramsTuple?: []; params?: {} }
    'welcome.landing': { paramsTuple?: []; params?: {} }
    'welcome.about': { paramsTuple?: []; params?: {} }
    'welcome.features': { paramsTuple?: []; params?: {} }
    'welcome.contact': { paramsTuple?: []; params?: {} }
    'welcome.terms': { paramsTuple?: []; params?: {} }
    'help.index': { paramsTuple?: []; params?: {} }
    'help.faq': { paramsTuple?: []; params?: {} }
    'help.guides': { paramsTuple?: []; params?: {} }
    'help.tutorial': { paramsTuple?: []; params?: {} }
    'help.contact': { paramsTuple?: []; params?: {} }
    'help.documentation': { paramsTuple?: []; params?: {} }
    'auth.get_profile': { paramsTuple?: []; params?: {} }
    'inspections.get_all_schools': { paramsTuple?: []; params?: {} }
    'inspections.get_school_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.get_global_stats': { paramsTuple?: []; params?: {} }
    'schools.dashboard': { paramsTuple?: []; params?: {} }
    'academics.get_classes': { paramsTuple?: []; params?: {} }
    'academics.get_class_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academics.get_class_students': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academics.get_subjects': { paramsTuple?: []; params?: {} }
    'academics.get_class_subjects': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'academics.get_grades_by_class': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'academics.get_grades_by_student': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'transfers.get_pending_transfers': { paramsTuple?: []; params?: {} }
    'academics.get_academic_stats': { paramsTuple?: []; params?: {} }
    'academics.get_progress_stats': { paramsTuple?: []; params?: {} }
    'pedagogicals.get_class_timetable': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'financials.get_fees': { paramsTuple?: []; params?: {} }
    'financials.get_student_payments': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'financials.get_income_report': { paramsTuple?: []; params?: {} }
    'financials.get_financial_stats': { paramsTuple?: []; params?: {} }
    'teachers.get_my_classes': { paramsTuple?: []; params?: {} }
    'teachers.get_assignments': { paramsTuple?: []; params?: {} }
    'parents.get_children': { paramsTuple?: []; params?: {} }
    'parents.get_child_grades': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'parents.get_child_payments': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'students.get_my_profile': { paramsTuple?: []; params?: {} }
    'students.get_my_grades': { paramsTuple?: []; params?: {} }
    'students.get_my_report_card': { paramsTuple?: []; params?: {} }
    'students.get_my_discipline': { paramsTuple?: []; params?: {} }
    'students.get_assignments': { paramsTuple?: []; params?: {} }
    'students.get_my_forum_questions': { paramsTuple?: []; params?: {} }
    'students.get_my_timetable': { paramsTuple?: []; params?: {} }
    'students.get_my_attendance': { paramsTuple?: []; params?: {} }
    'disciplines.get_students': { paramsTuple?: []; params?: {} }
    'disciplines.get_student_details': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'messages.get_messages': { paramsTuple?: []; params?: {} }
    'messages.get_conversations': { paramsTuple?: []; params?: {} }
    'messages.get_conversation': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'inter_schools.search_schools': { paramsTuple?: []; params?: {} }
    'inter_schools.get_school_public_info': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inter_schools.get_best_practices': { paramsTuple?: []; params?: {} }
    'inter_schools.get_events': { paramsTuple?: []; params?: {} }
    'admin.get_users': { paramsTuple?: []; params?: {} }
    'admin.get_roles': { paramsTuple?: []; params?: {} }
    'admin.get_system_logs': { paramsTuple?: []; params?: {} }
    'admin.get_user_activity_logs': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'schools.register_school': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.forgot_password': { paramsTuple?: []; params?: {} }
    'auth.reset_password': { paramsTuple?: []; params?: {} }
    'transfers.verify_authorization': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'auth.change_password': { paramsTuple?: []; params?: {} }
    'inspections.approve_school': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.suspend_school': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.inspect_school': { paramsTuple?: []; params?: {} }
    'auth.generate_school_credentials': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.send_global_communication': { paramsTuple?: []; params?: {} }
    'inspection.send_school_communication': { paramsTuple?: []; params?: {} }
    'inspections.generate_school_report': { paramsTuple?: []; params?: {} }
    'academics.create_class': { paramsTuple?: []; params?: {} }
    'academics.create_subject': { paramsTuple?: []; params?: {} }
    'academics.add_subject_to_class': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'academics.add_grade': { paramsTuple?: []; params?: {} }
    'academics.publish_grades': { paramsTuple?: []; params?: {} }
    'schools.add_teacher': { paramsTuple?: []; params?: {} }
    'transfers.request_transfer': { paramsTuple?: []; params?: {} }
    'transfers.approve_transfer': { paramsTuple?: []; params?: {} }
    'transfers.reject_transfer': { paramsTuple?: []; params?: {} }
    'transfers.complete_transfer': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'pedagogicals.generate_report_card': { paramsTuple?: []; params?: {} }
    'pedagogicals.create_timetable': { paramsTuple?: []; params?: {} }
    'pedagogicals.publish_grades': { paramsTuple?: []; params?: {} }
    'pedagogicals.create_academic_calendar': { paramsTuple?: []; params?: {} }
    'pedagogicals.create_exam_schedule': { paramsTuple?: []; params?: {} }
    'pedagogicals.get_student_progress': { paramsTuple?: []; params?: {} }
    'financials.set_fees': { paramsTuple?: []; params?: {} }
    'financials.record_payment': { paramsTuple?: []; params?: {} }
    'teachers.create_assignment': { paramsTuple?: []; params?: {} }
    'teachers.grade_submission': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teachers.create_forum_topic': { paramsTuple?: []; params?: {} }
    'teachers.mark_attendance': { paramsTuple?: []; params?: {} }
    'parents.send_message_to_teacher': { paramsTuple?: []; params?: {} }
    'parents.justify_absence': { paramsTuple?: []; params?: {} }
    'students.submit_assignment': { paramsTuple?: []; params?: {} }
    'students.post_forum_question': { paramsTuple?: []; params?: {} }
    'students.send_message_to_teacher': { paramsTuple?: []; params?: {} }
    'students.request_transfer': { paramsTuple?: []; params?: {} }
    'disciplines.report_incident': { paramsTuple?: []; params?: {} }
    'disciplines.apply_sanction': { paramsTuple?: []; params?: {} }
    'disciplines.notify_parent': { paramsTuple?: []; params?: {} }
    'messages.send_message': { paramsTuple?: []; params?: {} }
    'communication.send_global_communication': { paramsTuple?: []; params?: {} }
    'communication.send_school_communication': { paramsTuple?: []; params?: {} }
    'inter_schools.start_exchange': { paramsTuple?: []; params?: {} }
    'inter_schools.share_best_practice': { paramsTuple?: []; params?: {} }
    'inter_schools.create_event': { paramsTuple?: []; params?: {} }
    'inter_schools.join_event': { paramsTuple?: []; params?: {} }
    'admin.create_user': { paramsTuple?: []; params?: {} }
    'admin.activate_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.suspend_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.create_role': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'auth.update_profile': { paramsTuple?: []; params?: {} }
    'schools.update_school_profile': { paramsTuple?: []; params?: {} }
    'academics.update_class': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academics.update_subject': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academics.update_grade': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financials.update_fees': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'messages.mark_as_read': { paramsTuple?: []; params?: {} }
    'admin.update_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.update_role': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'academics.delete_class': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academics.delete_subject': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academics.delete_grade': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financials.delete_fees': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'disciplines.delete_incident': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.delete_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}