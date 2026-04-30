import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'schools.register_school': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.forgot_password': { paramsTuple?: []; params?: {} }
    'auth.reset_password': { paramsTuple?: []; params?: {} }
    'transfers.verify_authorization': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'auth.change_password': { paramsTuple?: []; params?: {} }
    'auth.get_profile': { paramsTuple?: []; params?: {} }
    'auth.update_profile': { paramsTuple?: []; params?: {} }
    'inspections.get_all_schools': { paramsTuple?: []; params?: {} }
    'inspections.get_school_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.approve_school': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.suspend_school': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.generate_school_credentials': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.send_global_communication': { paramsTuple?: []; params?: {} }
    'inspections.send_school_communication': { paramsTuple: [ParamValue]; params: {'schoolId': ParamValue} }
    'inspections.get_communication_history': { paramsTuple?: []; params?: {} }
    'inspections.get_global_stats': { paramsTuple?: []; params?: {} }
    'inspections.get_schools_stats': { paramsTuple?: []; params?: {} }
    'inspections.get_performance_stats': { paramsTuple?: []; params?: {} }
    'inspections.generate_schools_report': { paramsTuple?: []; params?: {} }
    'inspections.generate_transfers_report': { paramsTuple?: []; params?: {} }
    'schools.dashboard': { paramsTuple?: []; params?: {} }
    'schools.get_school_stats': { paramsTuple?: []; params?: {} }
    'schools.get_school_profile': { paramsTuple?: []; params?: {} }
    'schools.update_school_profile': { paramsTuple?: []; params?: {} }
    'academics.get_classes': { paramsTuple?: []; params?: {} }
    'academics.create_class': { paramsTuple?: []; params?: {} }
    'academics.update_class': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academics.delete_class': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academics.get_class_students': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academics.get_subjects': { paramsTuple?: []; params?: {} }
    'academics.add_subject_to_class': { paramsTuple?: []; params?: {} }
    'schools.get_teachers': { paramsTuple?: []; params?: {} }
    'schools.add_teacher': { paramsTuple?: []; params?: {} }
    'schools.update_teacher': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.remove_teacher': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transfers.request_transfer': { paramsTuple?: []; params?: {} }
    'transfers.get_pending_transfers': { paramsTuple?: []; params?: {} }
    'transfers.approve_transfer': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transfers.reject_transfer': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'pedagogicals.get_grades': { paramsTuple?: []; params?: {} }
    'pedagogicals.add_grade': { paramsTuple?: []; params?: {} }
    'pedagogicals.update_grade': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'pedagogicals.publish_grades': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'pedagogicals.generate_report_card': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'pedagogicals.get_class_report_cards': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'pedagogicals.get_class_timetable': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'pedagogicals.set_timetable': { paramsTuple?: []; params?: {} }
    'pedagogicals.get_academic_stats': { paramsTuple?: []; params?: {} }
    'pedagogicals.get_student_stats': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'financials.get_fees': { paramsTuple?: []; params?: {} }
    'financials.set_fees': { paramsTuple?: []; params?: {} }
    'financials.update_fees': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financials.delete_fees': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financials.get_payments': { paramsTuple?: []; params?: {} }
    'financials.record_payment': { paramsTuple?: []; params?: {} }
    'financials.get_student_payments': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'financials.generate_receipt': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financials.get_income_report': { paramsTuple?: []; params?: {} }
    'financials.get_outstanding_payments': { paramsTuple?: []; params?: {} }
    'financials.get_student_financial_status': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'financials.get_financial_stats': { paramsTuple?: []; params?: {} }
    'teachers.get_my_classes': { paramsTuple?: []; params?: {} }
    'teachers.get_my_subjects': { paramsTuple?: []; params?: {} }
    'teachers.get_assignments': { paramsTuple?: []; params?: {} }
    'teachers.create_assignment': { paramsTuple?: []; params?: {} }
    'teachers.update_assignment': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teachers.delete_assignment': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teachers.publish_assignment': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teachers.get_submissions': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teachers.grade_submission': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teachers.get_grades': { paramsTuple?: []; params?: {} }
    'teachers.add_grade': { paramsTuple?: []; params?: {} }
    'teachers.update_grade': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teachers.get_forum_topics': { paramsTuple?: []; params?: {} }
    'teachers.create_forum_topic': { paramsTuple?: []; params?: {} }
    'teachers.reply_to_topic': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teachers.pin_topic': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teachers.lock_topic': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teachers.get_attendance': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'teachers.mark_attendance': { paramsTuple?: []; params?: {} }
    'parents.get_children': { paramsTuple?: []; params?: {} }
    'parents.get_child_details': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'parents.get_child_grades': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'parents.get_child_report_card': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'parents.get_child_discipline': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'parents.get_messages': { paramsTuple?: []; params?: {} }
    'parents.send_message_to_teacher': { paramsTuple: [ParamValue]; params: {'teacherId': ParamValue} }
    'parents.reply_to_message': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'parents.get_child_payments': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'parents.initiate_payment': { paramsTuple?: []; params?: {} }
    'parents.get_child_forum_activity': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'parents.justify_absence': { paramsTuple: [ParamValue]; params: {'absenceId': ParamValue} }
    'students.get_my_profile': { paramsTuple?: []; params?: {} }
    'students.get_my_grades': { paramsTuple?: []; params?: {} }
    'students.get_my_report_card': { paramsTuple?: []; params?: {} }
    'students.get_my_discipline': { paramsTuple?: []; params?: {} }
    'students.get_assignments': { paramsTuple?: []; params?: {} }
    'students.get_assignment_detail': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'students.submit_assignment': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'students.update_submission': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'students.get_my_forum_questions': { paramsTuple?: []; params?: {} }
    'students.post_forum_question': { paramsTuple?: []; params?: {} }
    'students.reply_to_forum': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'students.get_messages': { paramsTuple?: []; params?: {} }
    'students.send_message_to_teacher': { paramsTuple: [ParamValue]; params: {'teacherId': ParamValue} }
    'students.get_my_timetable': { paramsTuple?: []; params?: {} }
    'students.get_my_attendance': { paramsTuple?: []; params?: {} }
    'disciplines.get_students': { paramsTuple?: []; params?: {} }
    'disciplines.get_student_details': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'disciplines.get_all_incidents': { paramsTuple?: []; params?: {} }
    'disciplines.report_incident': { paramsTuple?: []; params?: {} }
    'disciplines.update_incident': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'disciplines.delete_incident': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'disciplines.get_student_incidents': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'disciplines.apply_sanction': { paramsTuple?: []; params?: {} }
    'disciplines.update_sanction': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'disciplines.get_student_discipline_report': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'disciplines.get_class_discipline_report': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'disciplines.get_discipline_summary': { paramsTuple?: []; params?: {} }
    'disciplines.get_discipline_stats': { paramsTuple?: []; params?: {} }
    'disciplines.notify_parent': { paramsTuple: [ParamValue]; params: {'incidentId': ParamValue} }
    'messages.get_messages': { paramsTuple?: []; params?: {} }
    'messages.get_unread_count': { paramsTuple?: []; params?: {} }
    'messages.send_message': { paramsTuple?: []; params?: {} }
    'messages.mark_as_read': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'messages.delete_message': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'messages.get_conversations': { paramsTuple?: []; params?: {} }
    'messages.get_conversation': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'messages.get_notifications': { paramsTuple?: []; params?: {} }
    'messages.mark_notification_as_read': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'messages.mark_all_as_read': { paramsTuple?: []; params?: {} }
    'messages.upload_attachment': { paramsTuple?: []; params?: {} }
    'inter_schools.search_schools': { paramsTuple?: []; params?: {} }
    'inter_schools.get_school_public_info': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inter_schools.get_exchanges': { paramsTuple?: []; params?: {} }
    'inter_schools.start_exchange': { paramsTuple?: []; params?: {} }
    'inter_schools.send_exchange_message': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inter_schools.get_best_practices': { paramsTuple?: []; params?: {} }
    'inter_schools.share_best_practice': { paramsTuple?: []; params?: {} }
    'inter_schools.get_events': { paramsTuple?: []; params?: {} }
    'inter_schools.create_event': { paramsTuple?: []; params?: {} }
    'inter_schools.join_event': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admins.get_users': { paramsTuple?: []; params?: {} }
    'admins.create_user': { paramsTuple?: []; params?: {} }
    'admins.update_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admins.delete_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admins.activate_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admins.suspend_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admins.get_roles': { paramsTuple?: []; params?: {} }
    'admins.create_role': { paramsTuple?: []; params?: {} }
    'admins.update_role': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admins.get_system_logs': { paramsTuple?: []; params?: {} }
    'admins.get_user_activity_logs': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'schools.register_school': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.forgot_password': { paramsTuple?: []; params?: {} }
    'auth.reset_password': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'auth.change_password': { paramsTuple?: []; params?: {} }
    'inspections.approve_school': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.suspend_school': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.generate_school_credentials': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.send_global_communication': { paramsTuple?: []; params?: {} }
    'inspections.send_school_communication': { paramsTuple: [ParamValue]; params: {'schoolId': ParamValue} }
    'academics.create_class': { paramsTuple?: []; params?: {} }
    'academics.add_subject_to_class': { paramsTuple?: []; params?: {} }
    'schools.add_teacher': { paramsTuple?: []; params?: {} }
    'transfers.request_transfer': { paramsTuple?: []; params?: {} }
    'transfers.approve_transfer': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transfers.reject_transfer': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'pedagogicals.add_grade': { paramsTuple?: []; params?: {} }
    'pedagogicals.publish_grades': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'pedagogicals.set_timetable': { paramsTuple?: []; params?: {} }
    'financials.set_fees': { paramsTuple?: []; params?: {} }
    'financials.record_payment': { paramsTuple?: []; params?: {} }
    'teachers.create_assignment': { paramsTuple?: []; params?: {} }
    'teachers.publish_assignment': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teachers.grade_submission': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teachers.add_grade': { paramsTuple?: []; params?: {} }
    'teachers.create_forum_topic': { paramsTuple?: []; params?: {} }
    'teachers.reply_to_topic': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teachers.mark_attendance': { paramsTuple?: []; params?: {} }
    'parents.send_message_to_teacher': { paramsTuple: [ParamValue]; params: {'teacherId': ParamValue} }
    'parents.reply_to_message': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'parents.initiate_payment': { paramsTuple?: []; params?: {} }
    'parents.justify_absence': { paramsTuple: [ParamValue]; params: {'absenceId': ParamValue} }
    'students.submit_assignment': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'students.post_forum_question': { paramsTuple?: []; params?: {} }
    'students.reply_to_forum': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'students.send_message_to_teacher': { paramsTuple: [ParamValue]; params: {'teacherId': ParamValue} }
    'disciplines.report_incident': { paramsTuple?: []; params?: {} }
    'disciplines.apply_sanction': { paramsTuple?: []; params?: {} }
    'disciplines.notify_parent': { paramsTuple: [ParamValue]; params: {'incidentId': ParamValue} }
    'messages.send_message': { paramsTuple?: []; params?: {} }
    'messages.upload_attachment': { paramsTuple?: []; params?: {} }
    'inter_schools.start_exchange': { paramsTuple?: []; params?: {} }
    'inter_schools.send_exchange_message': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inter_schools.share_best_practice': { paramsTuple?: []; params?: {} }
    'inter_schools.create_event': { paramsTuple?: []; params?: {} }
    'inter_schools.join_event': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admins.create_user': { paramsTuple?: []; params?: {} }
    'admins.activate_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admins.suspend_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admins.create_role': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'transfers.verify_authorization': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'auth.get_profile': { paramsTuple?: []; params?: {} }
    'inspections.get_all_schools': { paramsTuple?: []; params?: {} }
    'inspections.get_school_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.get_communication_history': { paramsTuple?: []; params?: {} }
    'inspections.get_global_stats': { paramsTuple?: []; params?: {} }
    'inspections.get_schools_stats': { paramsTuple?: []; params?: {} }
    'inspections.get_performance_stats': { paramsTuple?: []; params?: {} }
    'inspections.generate_schools_report': { paramsTuple?: []; params?: {} }
    'inspections.generate_transfers_report': { paramsTuple?: []; params?: {} }
    'schools.dashboard': { paramsTuple?: []; params?: {} }
    'schools.get_school_stats': { paramsTuple?: []; params?: {} }
    'schools.get_school_profile': { paramsTuple?: []; params?: {} }
    'academics.get_classes': { paramsTuple?: []; params?: {} }
    'academics.get_class_students': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academics.get_subjects': { paramsTuple?: []; params?: {} }
    'schools.get_teachers': { paramsTuple?: []; params?: {} }
    'transfers.get_pending_transfers': { paramsTuple?: []; params?: {} }
    'pedagogicals.get_grades': { paramsTuple?: []; params?: {} }
    'pedagogicals.generate_report_card': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'pedagogicals.get_class_report_cards': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'pedagogicals.get_class_timetable': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'pedagogicals.get_academic_stats': { paramsTuple?: []; params?: {} }
    'pedagogicals.get_student_stats': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'financials.get_fees': { paramsTuple?: []; params?: {} }
    'financials.get_payments': { paramsTuple?: []; params?: {} }
    'financials.get_student_payments': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'financials.generate_receipt': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financials.get_income_report': { paramsTuple?: []; params?: {} }
    'financials.get_outstanding_payments': { paramsTuple?: []; params?: {} }
    'financials.get_student_financial_status': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'financials.get_financial_stats': { paramsTuple?: []; params?: {} }
    'teachers.get_my_classes': { paramsTuple?: []; params?: {} }
    'teachers.get_my_subjects': { paramsTuple?: []; params?: {} }
    'teachers.get_assignments': { paramsTuple?: []; params?: {} }
    'teachers.get_submissions': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teachers.get_grades': { paramsTuple?: []; params?: {} }
    'teachers.get_forum_topics': { paramsTuple?: []; params?: {} }
    'teachers.get_attendance': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'parents.get_children': { paramsTuple?: []; params?: {} }
    'parents.get_child_details': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'parents.get_child_grades': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'parents.get_child_report_card': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'parents.get_child_discipline': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'parents.get_messages': { paramsTuple?: []; params?: {} }
    'parents.get_child_payments': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'parents.get_child_forum_activity': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'students.get_my_profile': { paramsTuple?: []; params?: {} }
    'students.get_my_grades': { paramsTuple?: []; params?: {} }
    'students.get_my_report_card': { paramsTuple?: []; params?: {} }
    'students.get_my_discipline': { paramsTuple?: []; params?: {} }
    'students.get_assignments': { paramsTuple?: []; params?: {} }
    'students.get_assignment_detail': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'students.get_my_forum_questions': { paramsTuple?: []; params?: {} }
    'students.get_messages': { paramsTuple?: []; params?: {} }
    'students.get_my_timetable': { paramsTuple?: []; params?: {} }
    'students.get_my_attendance': { paramsTuple?: []; params?: {} }
    'disciplines.get_students': { paramsTuple?: []; params?: {} }
    'disciplines.get_student_details': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'disciplines.get_all_incidents': { paramsTuple?: []; params?: {} }
    'disciplines.get_student_incidents': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'disciplines.get_student_discipline_report': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'disciplines.get_class_discipline_report': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'disciplines.get_discipline_summary': { paramsTuple?: []; params?: {} }
    'disciplines.get_discipline_stats': { paramsTuple?: []; params?: {} }
    'messages.get_messages': { paramsTuple?: []; params?: {} }
    'messages.get_unread_count': { paramsTuple?: []; params?: {} }
    'messages.get_conversations': { paramsTuple?: []; params?: {} }
    'messages.get_conversation': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'messages.get_notifications': { paramsTuple?: []; params?: {} }
    'inter_schools.search_schools': { paramsTuple?: []; params?: {} }
    'inter_schools.get_school_public_info': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inter_schools.get_exchanges': { paramsTuple?: []; params?: {} }
    'inter_schools.get_best_practices': { paramsTuple?: []; params?: {} }
    'inter_schools.get_events': { paramsTuple?: []; params?: {} }
    'admins.get_users': { paramsTuple?: []; params?: {} }
    'admins.get_roles': { paramsTuple?: []; params?: {} }
    'admins.get_system_logs': { paramsTuple?: []; params?: {} }
    'admins.get_user_activity_logs': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'transfers.verify_authorization': { paramsTuple: [ParamValue]; params: {'code': ParamValue} }
    'auth.get_profile': { paramsTuple?: []; params?: {} }
    'inspections.get_all_schools': { paramsTuple?: []; params?: {} }
    'inspections.get_school_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.get_communication_history': { paramsTuple?: []; params?: {} }
    'inspections.get_global_stats': { paramsTuple?: []; params?: {} }
    'inspections.get_schools_stats': { paramsTuple?: []; params?: {} }
    'inspections.get_performance_stats': { paramsTuple?: []; params?: {} }
    'inspections.generate_schools_report': { paramsTuple?: []; params?: {} }
    'inspections.generate_transfers_report': { paramsTuple?: []; params?: {} }
    'schools.dashboard': { paramsTuple?: []; params?: {} }
    'schools.get_school_stats': { paramsTuple?: []; params?: {} }
    'schools.get_school_profile': { paramsTuple?: []; params?: {} }
    'academics.get_classes': { paramsTuple?: []; params?: {} }
    'academics.get_class_students': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academics.get_subjects': { paramsTuple?: []; params?: {} }
    'schools.get_teachers': { paramsTuple?: []; params?: {} }
    'transfers.get_pending_transfers': { paramsTuple?: []; params?: {} }
    'pedagogicals.get_grades': { paramsTuple?: []; params?: {} }
    'pedagogicals.generate_report_card': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'pedagogicals.get_class_report_cards': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'pedagogicals.get_class_timetable': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'pedagogicals.get_academic_stats': { paramsTuple?: []; params?: {} }
    'pedagogicals.get_student_stats': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'financials.get_fees': { paramsTuple?: []; params?: {} }
    'financials.get_payments': { paramsTuple?: []; params?: {} }
    'financials.get_student_payments': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'financials.generate_receipt': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financials.get_income_report': { paramsTuple?: []; params?: {} }
    'financials.get_outstanding_payments': { paramsTuple?: []; params?: {} }
    'financials.get_student_financial_status': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'financials.get_financial_stats': { paramsTuple?: []; params?: {} }
    'teachers.get_my_classes': { paramsTuple?: []; params?: {} }
    'teachers.get_my_subjects': { paramsTuple?: []; params?: {} }
    'teachers.get_assignments': { paramsTuple?: []; params?: {} }
    'teachers.get_submissions': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teachers.get_grades': { paramsTuple?: []; params?: {} }
    'teachers.get_forum_topics': { paramsTuple?: []; params?: {} }
    'teachers.get_attendance': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'parents.get_children': { paramsTuple?: []; params?: {} }
    'parents.get_child_details': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'parents.get_child_grades': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'parents.get_child_report_card': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'parents.get_child_discipline': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'parents.get_messages': { paramsTuple?: []; params?: {} }
    'parents.get_child_payments': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'parents.get_child_forum_activity': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'students.get_my_profile': { paramsTuple?: []; params?: {} }
    'students.get_my_grades': { paramsTuple?: []; params?: {} }
    'students.get_my_report_card': { paramsTuple?: []; params?: {} }
    'students.get_my_discipline': { paramsTuple?: []; params?: {} }
    'students.get_assignments': { paramsTuple?: []; params?: {} }
    'students.get_assignment_detail': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'students.get_my_forum_questions': { paramsTuple?: []; params?: {} }
    'students.get_messages': { paramsTuple?: []; params?: {} }
    'students.get_my_timetable': { paramsTuple?: []; params?: {} }
    'students.get_my_attendance': { paramsTuple?: []; params?: {} }
    'disciplines.get_students': { paramsTuple?: []; params?: {} }
    'disciplines.get_student_details': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'disciplines.get_all_incidents': { paramsTuple?: []; params?: {} }
    'disciplines.get_student_incidents': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'disciplines.get_student_discipline_report': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'disciplines.get_class_discipline_report': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'disciplines.get_discipline_summary': { paramsTuple?: []; params?: {} }
    'disciplines.get_discipline_stats': { paramsTuple?: []; params?: {} }
    'messages.get_messages': { paramsTuple?: []; params?: {} }
    'messages.get_unread_count': { paramsTuple?: []; params?: {} }
    'messages.get_conversations': { paramsTuple?: []; params?: {} }
    'messages.get_conversation': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'messages.get_notifications': { paramsTuple?: []; params?: {} }
    'inter_schools.search_schools': { paramsTuple?: []; params?: {} }
    'inter_schools.get_school_public_info': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inter_schools.get_exchanges': { paramsTuple?: []; params?: {} }
    'inter_schools.get_best_practices': { paramsTuple?: []; params?: {} }
    'inter_schools.get_events': { paramsTuple?: []; params?: {} }
    'admins.get_users': { paramsTuple?: []; params?: {} }
    'admins.get_roles': { paramsTuple?: []; params?: {} }
    'admins.get_system_logs': { paramsTuple?: []; params?: {} }
    'admins.get_user_activity_logs': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'auth.update_profile': { paramsTuple?: []; params?: {} }
    'schools.update_school_profile': { paramsTuple?: []; params?: {} }
    'academics.update_class': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.update_teacher': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'pedagogicals.update_grade': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financials.update_fees': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teachers.update_assignment': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teachers.update_grade': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teachers.pin_topic': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teachers.lock_topic': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'students.update_submission': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'disciplines.update_incident': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'disciplines.update_sanction': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'messages.mark_as_read': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'messages.mark_notification_as_read': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'messages.mark_all_as_read': { paramsTuple?: []; params?: {} }
    'admins.update_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admins.update_role': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'academics.delete_class': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.remove_teacher': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financials.delete_fees': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teachers.delete_assignment': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'disciplines.delete_incident': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'messages.delete_message': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admins.delete_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}