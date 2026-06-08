import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'welcome.index': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'about': { paramsTuple?: []; params?: {} }
    'welcome.landing': { paramsTuple?: []; params?: {} }
    'welcome.about': { paramsTuple?: []; params?: {} }
    'welcome.features': { paramsTuple?: []; params?: {} }
    'welcome.contact': { paramsTuple?: []; params?: {} }
    'welcome.terms': { paramsTuple?: []; params?: {} }
    'schools.register.create': { paramsTuple?: []; params?: {} }
    'schools.register': { paramsTuple?: []; params?: {} }
    'help.index': { paramsTuple?: []; params?: {} }
    'help.faq': { paramsTuple?: []; params?: {} }
    'help.guides': { paramsTuple?: []; params?: {} }
    'help.tutorial': { paramsTuple?: []; params?: {} }
    'help.contact': { paramsTuple?: []; params?: {} }
    'help.documentation': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'inspection.dashboard': { paramsTuple?: []; params?: {} }
    'inspections.schools_page': { paramsTuple?: []; params?: {} }
    'inspections.pending_schools_page': { paramsTuple?: []; params?: {} }
    'inspections.school_classes_page': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.inspect_school_page': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.store_school_inspection': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.school_details_page': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.approve_school_page': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.approve_and_generate_credentials': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.reject_school': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.toggle_suspend_school': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.communications_global_page': { paramsTuple?: []; params?: {} }
    'inspection.communications.global.store': { paramsTuple?: []; params?: {} }
    'inspections.communications_school_page': { paramsTuple?: []; params?: {} }
    'messages.send_school_communication': { paramsTuple?: []; params?: {} }
    'inspections.communications_history_page': { paramsTuple?: []; params?: {} }
    'inspections.communication_details': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.reports_schools_page': { paramsTuple?: []; params?: {} }
    'inspections.reports_performance_page': { paramsTuple?: []; params?: {} }
    'inspections.reports_statistics_page': { paramsTuple?: []; params?: {} }
    'inspections.reports_transfers_page': { paramsTuple?: []; params?: {} }
    'inspections.school_report_page': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.settings_page': { paramsTuple?: []; params?: {} }
    'inspection.settings.general.store': { paramsTuple?: []; params?: {} }
    'inspection.settings.inspection.store': { paramsTuple?: []; params?: {} }
    'inspection.settings.notifications.store': { paramsTuple?: []; params?: {} }
    'inspection.settings.backup.store': { paramsTuple?: []; params?: {} }
    'inspection.settings.security.store': { paramsTuple?: []; params?: {} }
    'inspections.export_schools': { paramsTuple?: []; params?: {} }
    'inspections.schools_report_data': { paramsTuple?: []; params?: {} }
    'inspections.performance_report_data': { paramsTuple?: []; params?: {} }
    'inspections.statistics_report_data': { paramsTuple?: []; params?: {} }
    'inspections.transfers_report_data': { paramsTuple?: []; params?: {} }
    'inspections.export_transfers_report': { paramsTuple?: []; params?: {} }
    'inspections.trigger_backup': { paramsTuple?: []; params?: {} }
    'inspections.download_backup': { paramsTuple: [ParamValue]; params: {'filename': ParamValue} }
    'inspections.logs': { paramsTuple?: []; params?: {} }
    'inspections.export_logs': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'settings': { paramsTuple?: []; params?: {} }
    'settings.get_language': { paramsTuple?: []; params?: {} }
    'settings.save_language': { paramsTuple?: []; params?: {} }
    'settings.save_regional': { paramsTuple?: []; params?: {} }
    'settings.reset_general': { paramsTuple?: []; params?: {} }
    'settings.update_email': { paramsTuple?: []; params?: {} }
    'settings.revoke_session': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'settings.revoke_all_sessions': { paramsTuple?: []; params?: {} }
    'settings.deactivate_account': { paramsTuple?: []; params?: {} }
    'settings.delete_account': { paramsTuple?: []; params?: {} }
    'settings.save_notification_types': { paramsTuple?: []; params?: {} }
    'settings.save_quiet_hours': { paramsTuple?: []; params?: {} }
    'settings.save_visibility': { paramsTuple?: []; params?: {} }
    'settings.export_data': { paramsTuple?: []; params?: {} }
    'settings.delete_data': { paramsTuple?: []; params?: {} }
    'settings.block_user': { paramsTuple?: []; params?: {} }
    'settings.unblock_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'settings.general': { paramsTuple?: []; params?: {} }
    'settings.general.store': { paramsTuple?: []; params?: {} }
    'teachers.index': { paramsTuple?: []; params?: {} }
    'teachers.create': { paramsTuple?: []; params?: {} }
    'schools.accounts.index': { paramsTuple?: []; params?: {} }
    'schools.accounts.create': { paramsTuple?: []; params?: {} }
    'schools.accounts.store': { paramsTuple?: []; params?: {} }
    'schools.accounts.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.accounts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspection.messages': { paramsTuple?: []; params?: {} }
    'communication.messages.compose': { paramsTuple?: []; params?: {} }
    'communication.messages.sent': { paramsTuple?: []; params?: {} }
    'communication.messages.inbox': { paramsTuple?: []; params?: {} }
    'communication.messages.read': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'communication.messages.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'communication.messages.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'communication.messages.mark_all_read': { paramsTuple?: []; params?: {} }
    'communication.messages.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'communication.messages.send.redirect': { paramsTuple?: []; params?: {} }
    'communication.messages.send': { paramsTuple?: []; params?: {} }
    'communication.notifications.index': { paramsTuple?: []; params?: {} }
    'api.notifications.index': { paramsTuple?: []; params?: {} }
    'api.notifications.read': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'api.notifications.read.put': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'api.notifications.mark_all_read': { paramsTuple?: []; params?: {} }
    'api.notifications.read_all': { paramsTuple?: []; params?: {} }
    'api.notifications.delete_all': { paramsTuple?: []; params?: {} }
    'api.teacher.attendance.classes.students': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'api.teacher.attendance.class': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'api.teacher.attendance.store': { paramsTuple?: []; params?: {} }
    'api.teachers.available_slots': { paramsTuple: [ParamValue]; params: {'teacherId': ParamValue} }
    'inspection.users.stats': { paramsTuple?: []; params?: {} }
    'inspection.schools.communication.info': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspection.schools.communication.history': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspection.communications.details.json': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile': { paramsTuple?: []; params?: {} }
    'profile.edit': { paramsTuple?: []; params?: {} }
    'profile.security': { paramsTuple?: []; params?: {} }
    'profile.preferences': { paramsTuple?: []; params?: {} }
    'profile.preferences.update': { paramsTuple?: []; params?: {} }
    'profile.activity': { paramsTuple?: []; params?: {} }
    'profile.avatar.update': { paramsTuple?: []; params?: {} }
    'academic.classes.index': { paramsTuple?: []; params?: {} }
    'academic.classes.create': { paramsTuple?: []; params?: {} }
    'academic.classes.seed_rdc_das': { paramsTuple?: []; params?: {} }
    'academic.classes.store': { paramsTuple?: []; params?: {} }
    'academic.classes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academic.classes.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academic.classes.update.post': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academic.classes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academic.classes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academic.grades.index': { paramsTuple?: []; params?: {} }
    'academic.grades.add': { paramsTuple?: []; params?: {} }
    'academic.grades.store': { paramsTuple?: []; params?: {} }
    'academic.grades.publish': { paramsTuple?: []; params?: {} }
    'academic.timetable.create': { paramsTuple?: []; params?: {} }
    'academic.timetable.class': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'academic.grades.class': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'academic.classes.students': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academic.classes.subjects': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'legacy.api.classes.students': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'legacy.api.classes.subjects': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'legacy.api.grades.class': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'legacy.api.timetable.class': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'legacy.api.timetable.create': { paramsTuple?: []; params?: {} }
    'students.index': { paramsTuple?: []; params?: {} }
    'students.create': { paramsTuple?: []; params?: {} }
    'students.store': { paramsTuple?: []; params?: {} }
    'students.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.classes.index': { paramsTuple?: []; params?: {} }
    'schools.classes.create': { paramsTuple?: []; params?: {} }
    'schools.classes.seed_rdc_das': { paramsTuple?: []; params?: {} }
    'schools.classes.store': { paramsTuple?: []; params?: {} }
    'schools.classes.students': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.classes.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.classes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.classes.update.post': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.classes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.classes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.timetable.index': { paramsTuple?: []; params?: {} }
    'schools.timetable.create': { paramsTuple?: []; params?: {} }
    'schools.teachers.index': { paramsTuple?: []; params?: {} }
    'schools.teachers.create': { paramsTuple?: []; params?: {} }
    'schools.teachers.store': { paramsTuple?: []; params?: {} }
    'schools.teachers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.teachers.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.teachers.schedule': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.teachers.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.teachers.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'discipline.dashboard': { paramsTuple?: []; params?: {} }
    'discipline.incidents.index': { paramsTuple?: []; params?: {} }
    'discipline.incidents.report': { paramsTuple?: []; params?: {} }
    'discipline.incidents.store': { paramsTuple?: []; params?: {} }
    'discipline.incidents.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'discipline.incidents.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'discipline.incidents.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'discipline.incidents.update.post': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'discipline.incidents.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'discipline.students.index': { paramsTuple?: []; params?: {} }
    'discipline.students.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'discipline.sanctions.apply': { paramsTuple?: []; params?: {} }
    'discipline.sanctions.apply.store': { paramsTuple?: []; params?: {} }
    'academic.calendar': { paramsTuple?: []; params?: {} }
    'financial.index': { paramsTuple?: []; params?: {} }
    'financial.fees.index': { paramsTuple?: []; params?: {} }
    'financial.fees.create': { paramsTuple?: []; params?: {} }
    'financial.fees.store': { paramsTuple?: []; params?: {} }
    'financial.fees.structure': { paramsTuple?: []; params?: {} }
    'financial.fees.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financial.fees.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financial.fees.update.post': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financial.fees.toggle_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financial.fees.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financial.payments.index': { paramsTuple?: []; params?: {} }
    'financial.payments.record': { paramsTuple?: []; params?: {} }
    'financial.payments.store': { paramsTuple?: []; params?: {} }
    'financial.payments.receipt': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financial.payments.print': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financial.payments.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financial.reports.income': { paramsTuple?: []; params?: {} }
    'financial.reports.outstanding': { paramsTuple?: []; params?: {} }
    'financial.reports.statistics': { paramsTuple?: []; params?: {} }
    'financial.reports.export': { paramsTuple?: []; params?: {} }
    'legacy.api.students.financial_status': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'schools.profile.update.web': { paramsTuple?: []; params?: {} }
    'settings.account_page': { paramsTuple?: []; params?: {} }
    'settings.language_page': { paramsTuple?: []; params?: {} }
    'settings.notifications_page': { paramsTuple?: []; params?: {} }
    'settings.save_notifications': { paramsTuple?: []; params?: {} }
    'settings.privacy_page': { paramsTuple?: []; params?: {} }
    'academics.student_grades_page': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'teachers.attendance_index_page': { paramsTuple?: []; params?: {} }
    'teachers.attendance_mark_page': { paramsTuple?: []; params?: {} }
    'parents.child_grades_details_page': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'parents.discipline_page': { paramsTuple?: []; params?: {} }
    'parents.attendance_page': { paramsTuple?: []; params?: {} }
    'parents.payments_page': { paramsTuple?: []; params?: {} }
    'parents.appointments_page': { paramsTuple?: []; params?: {} }
    'parents.appointment_request_page': { paramsTuple?: []; params?: {} }
    'parents.request_appointment': { paramsTuple?: []; params?: {} }
    'schools.register_school': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.request_otp': { paramsTuple?: []; params?: {} }
    'auth.verify_otp': { paramsTuple?: []; params?: {} }
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
    'academics.remove_subject_from_class': { paramsTuple: [ParamValue,ParamValue]; params: {'classId': ParamValue,'subjectId': ParamValue} }
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
    'teachers.get_class_students_for_attendance': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teachers.get_class_attendance': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teachers.mark_attendance': { paramsTuple?: []; params?: {} }
    'parents.get_children': { paramsTuple?: []; params?: {} }
    'parents.get_child_grades': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'parents.send_message_to_teacher': { paramsTuple?: []; params?: {} }
    'parents.get_child_payments': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'parents.get_child_attendance': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
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
    'home': { paramsTuple?: []; params?: {} }
    'about': { paramsTuple?: []; params?: {} }
    'welcome.landing': { paramsTuple?: []; params?: {} }
    'welcome.about': { paramsTuple?: []; params?: {} }
    'welcome.features': { paramsTuple?: []; params?: {} }
    'welcome.contact': { paramsTuple?: []; params?: {} }
    'welcome.terms': { paramsTuple?: []; params?: {} }
    'schools.register.create': { paramsTuple?: []; params?: {} }
    'help.index': { paramsTuple?: []; params?: {} }
    'help.faq': { paramsTuple?: []; params?: {} }
    'help.guides': { paramsTuple?: []; params?: {} }
    'help.tutorial': { paramsTuple?: []; params?: {} }
    'help.contact': { paramsTuple?: []; params?: {} }
    'help.documentation': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'inspection.dashboard': { paramsTuple?: []; params?: {} }
    'inspections.schools_page': { paramsTuple?: []; params?: {} }
    'inspections.pending_schools_page': { paramsTuple?: []; params?: {} }
    'inspections.school_classes_page': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.inspect_school_page': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.school_details_page': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.approve_school_page': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.communications_global_page': { paramsTuple?: []; params?: {} }
    'inspections.communications_school_page': { paramsTuple?: []; params?: {} }
    'inspections.communications_history_page': { paramsTuple?: []; params?: {} }
    'inspections.communication_details': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.reports_schools_page': { paramsTuple?: []; params?: {} }
    'inspections.reports_performance_page': { paramsTuple?: []; params?: {} }
    'inspections.reports_statistics_page': { paramsTuple?: []; params?: {} }
    'inspections.reports_transfers_page': { paramsTuple?: []; params?: {} }
    'inspections.school_report_page': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.settings_page': { paramsTuple?: []; params?: {} }
    'inspections.export_schools': { paramsTuple?: []; params?: {} }
    'inspections.schools_report_data': { paramsTuple?: []; params?: {} }
    'inspections.performance_report_data': { paramsTuple?: []; params?: {} }
    'inspections.statistics_report_data': { paramsTuple?: []; params?: {} }
    'inspections.transfers_report_data': { paramsTuple?: []; params?: {} }
    'inspections.export_transfers_report': { paramsTuple?: []; params?: {} }
    'inspections.download_backup': { paramsTuple: [ParamValue]; params: {'filename': ParamValue} }
    'inspections.logs': { paramsTuple?: []; params?: {} }
    'inspections.export_logs': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'settings': { paramsTuple?: []; params?: {} }
    'settings.get_language': { paramsTuple?: []; params?: {} }
    'settings.export_data': { paramsTuple?: []; params?: {} }
    'settings.general': { paramsTuple?: []; params?: {} }
    'teachers.index': { paramsTuple?: []; params?: {} }
    'teachers.create': { paramsTuple?: []; params?: {} }
    'schools.accounts.index': { paramsTuple?: []; params?: {} }
    'schools.accounts.create': { paramsTuple?: []; params?: {} }
    'schools.accounts.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspection.messages': { paramsTuple?: []; params?: {} }
    'communication.messages.compose': { paramsTuple?: []; params?: {} }
    'communication.messages.sent': { paramsTuple?: []; params?: {} }
    'communication.messages.inbox': { paramsTuple?: []; params?: {} }
    'communication.messages.read': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'communication.messages.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'communication.messages.send.redirect': { paramsTuple?: []; params?: {} }
    'communication.notifications.index': { paramsTuple?: []; params?: {} }
    'api.notifications.index': { paramsTuple?: []; params?: {} }
    'api.teacher.attendance.classes.students': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'api.teacher.attendance.class': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'api.teachers.available_slots': { paramsTuple: [ParamValue]; params: {'teacherId': ParamValue} }
    'inspection.users.stats': { paramsTuple?: []; params?: {} }
    'inspection.schools.communication.info': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspection.schools.communication.history': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspection.communications.details.json': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile': { paramsTuple?: []; params?: {} }
    'profile.edit': { paramsTuple?: []; params?: {} }
    'profile.security': { paramsTuple?: []; params?: {} }
    'profile.preferences': { paramsTuple?: []; params?: {} }
    'profile.activity': { paramsTuple?: []; params?: {} }
    'academic.classes.index': { paramsTuple?: []; params?: {} }
    'academic.classes.create': { paramsTuple?: []; params?: {} }
    'academic.classes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academic.classes.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academic.grades.index': { paramsTuple?: []; params?: {} }
    'academic.grades.add': { paramsTuple?: []; params?: {} }
    'academic.timetable.create': { paramsTuple?: []; params?: {} }
    'academic.timetable.class': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'academic.grades.class': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'academic.classes.students': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academic.classes.subjects': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'legacy.api.classes.students': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'legacy.api.classes.subjects': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'legacy.api.grades.class': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'legacy.api.timetable.class': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'students.index': { paramsTuple?: []; params?: {} }
    'students.create': { paramsTuple?: []; params?: {} }
    'students.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.classes.index': { paramsTuple?: []; params?: {} }
    'schools.classes.create': { paramsTuple?: []; params?: {} }
    'schools.classes.students': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.classes.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.classes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.timetable.index': { paramsTuple?: []; params?: {} }
    'schools.timetable.create': { paramsTuple?: []; params?: {} }
    'schools.teachers.index': { paramsTuple?: []; params?: {} }
    'schools.teachers.create': { paramsTuple?: []; params?: {} }
    'schools.teachers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.teachers.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.teachers.schedule': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'discipline.dashboard': { paramsTuple?: []; params?: {} }
    'discipline.incidents.index': { paramsTuple?: []; params?: {} }
    'discipline.incidents.report': { paramsTuple?: []; params?: {} }
    'discipline.incidents.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'discipline.incidents.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'discipline.students.index': { paramsTuple?: []; params?: {} }
    'discipline.students.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'discipline.sanctions.apply': { paramsTuple?: []; params?: {} }
    'academic.calendar': { paramsTuple?: []; params?: {} }
    'financial.index': { paramsTuple?: []; params?: {} }
    'financial.fees.index': { paramsTuple?: []; params?: {} }
    'financial.fees.create': { paramsTuple?: []; params?: {} }
    'financial.fees.structure': { paramsTuple?: []; params?: {} }
    'financial.fees.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financial.payments.index': { paramsTuple?: []; params?: {} }
    'financial.payments.record': { paramsTuple?: []; params?: {} }
    'financial.payments.receipt': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financial.payments.print': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financial.reports.income': { paramsTuple?: []; params?: {} }
    'financial.reports.outstanding': { paramsTuple?: []; params?: {} }
    'financial.reports.statistics': { paramsTuple?: []; params?: {} }
    'financial.reports.export': { paramsTuple?: []; params?: {} }
    'legacy.api.students.financial_status': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'settings.account_page': { paramsTuple?: []; params?: {} }
    'settings.language_page': { paramsTuple?: []; params?: {} }
    'settings.notifications_page': { paramsTuple?: []; params?: {} }
    'settings.privacy_page': { paramsTuple?: []; params?: {} }
    'academics.student_grades_page': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'teachers.attendance_index_page': { paramsTuple?: []; params?: {} }
    'teachers.attendance_mark_page': { paramsTuple?: []; params?: {} }
    'parents.child_grades_details_page': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'parents.discipline_page': { paramsTuple?: []; params?: {} }
    'parents.attendance_page': { paramsTuple?: []; params?: {} }
    'parents.payments_page': { paramsTuple?: []; params?: {} }
    'parents.appointments_page': { paramsTuple?: []; params?: {} }
    'parents.appointment_request_page': { paramsTuple?: []; params?: {} }
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
    'teachers.get_class_students_for_attendance': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teachers.get_class_attendance': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'parents.get_children': { paramsTuple?: []; params?: {} }
    'parents.get_child_grades': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'parents.get_child_payments': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'parents.get_child_attendance': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
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
    'home': { paramsTuple?: []; params?: {} }
    'about': { paramsTuple?: []; params?: {} }
    'welcome.landing': { paramsTuple?: []; params?: {} }
    'welcome.about': { paramsTuple?: []; params?: {} }
    'welcome.features': { paramsTuple?: []; params?: {} }
    'welcome.contact': { paramsTuple?: []; params?: {} }
    'welcome.terms': { paramsTuple?: []; params?: {} }
    'schools.register.create': { paramsTuple?: []; params?: {} }
    'help.index': { paramsTuple?: []; params?: {} }
    'help.faq': { paramsTuple?: []; params?: {} }
    'help.guides': { paramsTuple?: []; params?: {} }
    'help.tutorial': { paramsTuple?: []; params?: {} }
    'help.contact': { paramsTuple?: []; params?: {} }
    'help.documentation': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'inspection.dashboard': { paramsTuple?: []; params?: {} }
    'inspections.schools_page': { paramsTuple?: []; params?: {} }
    'inspections.pending_schools_page': { paramsTuple?: []; params?: {} }
    'inspections.school_classes_page': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.inspect_school_page': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.school_details_page': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.approve_school_page': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.communications_global_page': { paramsTuple?: []; params?: {} }
    'inspections.communications_school_page': { paramsTuple?: []; params?: {} }
    'inspections.communications_history_page': { paramsTuple?: []; params?: {} }
    'inspections.communication_details': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.reports_schools_page': { paramsTuple?: []; params?: {} }
    'inspections.reports_performance_page': { paramsTuple?: []; params?: {} }
    'inspections.reports_statistics_page': { paramsTuple?: []; params?: {} }
    'inspections.reports_transfers_page': { paramsTuple?: []; params?: {} }
    'inspections.school_report_page': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.settings_page': { paramsTuple?: []; params?: {} }
    'inspections.export_schools': { paramsTuple?: []; params?: {} }
    'inspections.schools_report_data': { paramsTuple?: []; params?: {} }
    'inspections.performance_report_data': { paramsTuple?: []; params?: {} }
    'inspections.statistics_report_data': { paramsTuple?: []; params?: {} }
    'inspections.transfers_report_data': { paramsTuple?: []; params?: {} }
    'inspections.export_transfers_report': { paramsTuple?: []; params?: {} }
    'inspections.download_backup': { paramsTuple: [ParamValue]; params: {'filename': ParamValue} }
    'inspections.logs': { paramsTuple?: []; params?: {} }
    'inspections.export_logs': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'settings': { paramsTuple?: []; params?: {} }
    'settings.get_language': { paramsTuple?: []; params?: {} }
    'settings.export_data': { paramsTuple?: []; params?: {} }
    'settings.general': { paramsTuple?: []; params?: {} }
    'teachers.index': { paramsTuple?: []; params?: {} }
    'teachers.create': { paramsTuple?: []; params?: {} }
    'schools.accounts.index': { paramsTuple?: []; params?: {} }
    'schools.accounts.create': { paramsTuple?: []; params?: {} }
    'schools.accounts.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspection.messages': { paramsTuple?: []; params?: {} }
    'communication.messages.compose': { paramsTuple?: []; params?: {} }
    'communication.messages.sent': { paramsTuple?: []; params?: {} }
    'communication.messages.inbox': { paramsTuple?: []; params?: {} }
    'communication.messages.read': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'communication.messages.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'communication.messages.send.redirect': { paramsTuple?: []; params?: {} }
    'communication.notifications.index': { paramsTuple?: []; params?: {} }
    'api.notifications.index': { paramsTuple?: []; params?: {} }
    'api.teacher.attendance.classes.students': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'api.teacher.attendance.class': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'api.teachers.available_slots': { paramsTuple: [ParamValue]; params: {'teacherId': ParamValue} }
    'inspection.users.stats': { paramsTuple?: []; params?: {} }
    'inspection.schools.communication.info': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspection.schools.communication.history': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspection.communications.details.json': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile': { paramsTuple?: []; params?: {} }
    'profile.edit': { paramsTuple?: []; params?: {} }
    'profile.security': { paramsTuple?: []; params?: {} }
    'profile.preferences': { paramsTuple?: []; params?: {} }
    'profile.activity': { paramsTuple?: []; params?: {} }
    'academic.classes.index': { paramsTuple?: []; params?: {} }
    'academic.classes.create': { paramsTuple?: []; params?: {} }
    'academic.classes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academic.classes.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academic.grades.index': { paramsTuple?: []; params?: {} }
    'academic.grades.add': { paramsTuple?: []; params?: {} }
    'academic.timetable.create': { paramsTuple?: []; params?: {} }
    'academic.timetable.class': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'academic.grades.class': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'academic.classes.students': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academic.classes.subjects': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'legacy.api.classes.students': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'legacy.api.classes.subjects': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'legacy.api.grades.class': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'legacy.api.timetable.class': { paramsTuple: [ParamValue]; params: {'classId': ParamValue} }
    'students.index': { paramsTuple?: []; params?: {} }
    'students.create': { paramsTuple?: []; params?: {} }
    'students.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.classes.index': { paramsTuple?: []; params?: {} }
    'schools.classes.create': { paramsTuple?: []; params?: {} }
    'schools.classes.students': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.classes.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.classes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.timetable.index': { paramsTuple?: []; params?: {} }
    'schools.timetable.create': { paramsTuple?: []; params?: {} }
    'schools.teachers.index': { paramsTuple?: []; params?: {} }
    'schools.teachers.create': { paramsTuple?: []; params?: {} }
    'schools.teachers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.teachers.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.teachers.schedule': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'discipline.dashboard': { paramsTuple?: []; params?: {} }
    'discipline.incidents.index': { paramsTuple?: []; params?: {} }
    'discipline.incidents.report': { paramsTuple?: []; params?: {} }
    'discipline.incidents.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'discipline.incidents.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'discipline.students.index': { paramsTuple?: []; params?: {} }
    'discipline.students.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'discipline.sanctions.apply': { paramsTuple?: []; params?: {} }
    'academic.calendar': { paramsTuple?: []; params?: {} }
    'financial.index': { paramsTuple?: []; params?: {} }
    'financial.fees.index': { paramsTuple?: []; params?: {} }
    'financial.fees.create': { paramsTuple?: []; params?: {} }
    'financial.fees.structure': { paramsTuple?: []; params?: {} }
    'financial.fees.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financial.payments.index': { paramsTuple?: []; params?: {} }
    'financial.payments.record': { paramsTuple?: []; params?: {} }
    'financial.payments.receipt': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financial.payments.print': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financial.reports.income': { paramsTuple?: []; params?: {} }
    'financial.reports.outstanding': { paramsTuple?: []; params?: {} }
    'financial.reports.statistics': { paramsTuple?: []; params?: {} }
    'financial.reports.export': { paramsTuple?: []; params?: {} }
    'legacy.api.students.financial_status': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'settings.account_page': { paramsTuple?: []; params?: {} }
    'settings.language_page': { paramsTuple?: []; params?: {} }
    'settings.notifications_page': { paramsTuple?: []; params?: {} }
    'settings.privacy_page': { paramsTuple?: []; params?: {} }
    'academics.student_grades_page': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'teachers.attendance_index_page': { paramsTuple?: []; params?: {} }
    'teachers.attendance_mark_page': { paramsTuple?: []; params?: {} }
    'parents.child_grades_details_page': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'parents.discipline_page': { paramsTuple?: []; params?: {} }
    'parents.attendance_page': { paramsTuple?: []; params?: {} }
    'parents.payments_page': { paramsTuple?: []; params?: {} }
    'parents.appointments_page': { paramsTuple?: []; params?: {} }
    'parents.appointment_request_page': { paramsTuple?: []; params?: {} }
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
    'teachers.get_class_students_for_attendance': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'teachers.get_class_attendance': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'parents.get_children': { paramsTuple?: []; params?: {} }
    'parents.get_child_grades': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'parents.get_child_payments': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
    'parents.get_child_attendance': { paramsTuple: [ParamValue]; params: {'studentId': ParamValue} }
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
    'schools.register': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'inspections.store_school_inspection': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.approve_and_generate_credentials': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.reject_school': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspections.toggle_suspend_school': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inspection.communications.global.store': { paramsTuple?: []; params?: {} }
    'messages.send_school_communication': { paramsTuple?: []; params?: {} }
    'inspection.settings.general.store': { paramsTuple?: []; params?: {} }
    'inspection.settings.inspection.store': { paramsTuple?: []; params?: {} }
    'inspection.settings.notifications.store': { paramsTuple?: []; params?: {} }
    'inspection.settings.backup.store': { paramsTuple?: []; params?: {} }
    'inspection.settings.security.store': { paramsTuple?: []; params?: {} }
    'inspections.trigger_backup': { paramsTuple?: []; params?: {} }
    'settings.save_language': { paramsTuple?: []; params?: {} }
    'settings.save_regional': { paramsTuple?: []; params?: {} }
    'settings.reset_general': { paramsTuple?: []; params?: {} }
    'settings.revoke_session': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'settings.revoke_all_sessions': { paramsTuple?: []; params?: {} }
    'settings.deactivate_account': { paramsTuple?: []; params?: {} }
    'settings.save_notification_types': { paramsTuple?: []; params?: {} }
    'settings.save_quiet_hours': { paramsTuple?: []; params?: {} }
    'settings.save_visibility': { paramsTuple?: []; params?: {} }
    'settings.block_user': { paramsTuple?: []; params?: {} }
    'settings.general.store': { paramsTuple?: []; params?: {} }
    'schools.accounts.store': { paramsTuple?: []; params?: {} }
    'schools.accounts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'communication.messages.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'communication.messages.mark_all_read': { paramsTuple?: []; params?: {} }
    'communication.messages.send': { paramsTuple?: []; params?: {} }
    'api.notifications.read': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'api.notifications.mark_all_read': { paramsTuple?: []; params?: {} }
    'api.teacher.attendance.store': { paramsTuple?: []; params?: {} }
    'profile.preferences.update': { paramsTuple?: []; params?: {} }
    'profile.avatar.update': { paramsTuple?: []; params?: {} }
    'academic.classes.seed_rdc_das': { paramsTuple?: []; params?: {} }
    'academic.classes.store': { paramsTuple?: []; params?: {} }
    'academic.classes.update.post': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academic.grades.store': { paramsTuple?: []; params?: {} }
    'academic.grades.publish': { paramsTuple?: []; params?: {} }
    'legacy.api.timetable.create': { paramsTuple?: []; params?: {} }
    'students.store': { paramsTuple?: []; params?: {} }
    'schools.classes.seed_rdc_das': { paramsTuple?: []; params?: {} }
    'schools.classes.store': { paramsTuple?: []; params?: {} }
    'schools.classes.update.post': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.teachers.store': { paramsTuple?: []; params?: {} }
    'discipline.incidents.store': { paramsTuple?: []; params?: {} }
    'discipline.incidents.update.post': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'discipline.sanctions.apply.store': { paramsTuple?: []; params?: {} }
    'financial.fees.store': { paramsTuple?: []; params?: {} }
    'financial.fees.update.post': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financial.fees.toggle_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financial.payments.store': { paramsTuple?: []; params?: {} }
    'schools.profile.update.web': { paramsTuple?: []; params?: {} }
    'settings.save_notifications': { paramsTuple?: []; params?: {} }
    'parents.request_appointment': { paramsTuple?: []; params?: {} }
    'schools.register_school': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.request_otp': { paramsTuple?: []; params?: {} }
    'auth.verify_otp': { paramsTuple?: []; params?: {} }
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
    'settings.update_email': { paramsTuple?: []; params?: {} }
    'api.notifications.read.put': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'api.notifications.read_all': { paramsTuple?: []; params?: {} }
    'academic.classes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.classes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.teachers.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'discipline.incidents.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financial.fees.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
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
    'settings.delete_account': { paramsTuple?: []; params?: {} }
    'settings.delete_data': { paramsTuple?: []; params?: {} }
    'settings.unblock_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'communication.messages.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'api.notifications.delete_all': { paramsTuple?: []; params?: {} }
    'academic.classes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.classes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schools.teachers.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'discipline.incidents.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financial.fees.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financial.payments.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academics.delete_class': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academics.delete_subject': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'academics.remove_subject_from_class': { paramsTuple: [ParamValue,ParamValue]; params: {'classId': ParamValue,'subjectId': ParamValue} }
    'academics.delete_grade': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'financials.delete_fees': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'disciplines.delete_incident': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.delete_user': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}