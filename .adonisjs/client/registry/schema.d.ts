/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'schools.register_school': {
    methods: ["POST"]
    pattern: '/api/v1/register-school'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['registerSchool']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['registerSchool']>>>
    }
  }
  'auth.login': {
    methods: ["POST"]
    pattern: '/api/v1/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['login']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['login']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.forgot_password': {
    methods: ["POST"]
    pattern: '/api/v1/forgot-password'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['forgotPassword']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['forgotPassword']>>>
    }
  }
  'auth.reset_password': {
    methods: ["POST"]
    pattern: '/api/v1/reset-password'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['resetPassword']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['resetPassword']>>>
    }
  }
  'transfers.verify_authorization': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/verify-transfer/:code'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { code: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['verifyAuthorization']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['verifyAuthorization']>>>
    }
  }
  'auth.logout': {
    methods: ["POST"]
    pattern: '/api/v1/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['logout']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['logout']>>>
    }
  }
  'auth.change_password': {
    methods: ["POST"]
    pattern: '/api/v1/change-password'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth').changePasswordValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').changePasswordValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['changePassword']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['changePassword']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.get_profile': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['getProfile']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['getProfile']>>>
    }
  }
  'auth.update_profile': {
    methods: ["PUT"]
    pattern: '/api/v1/profile'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth').updateProfileValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').updateProfileValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['updateProfile']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['updateProfile']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'inspections.get_all_schools': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/inspection/schools'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['getAllSchools']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['getAllSchools']>>>
    }
  }
  'inspections.get_school_by_id': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/inspection/schools/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['getSchoolById']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['getSchoolById']>>>
    }
  }
  'inspections.approve_school': {
    methods: ["POST"]
    pattern: '/api/v1/inspection/schools/approve/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['approveSchool']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['approveSchool']>>>
    }
  }
  'inspections.suspend_school': {
    methods: ["POST"]
    pattern: '/api/v1/inspection/schools/suspend/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['suspendSchool']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['suspendSchool']>>>
    }
  }
  'inspections.generate_school_credentials': {
    methods: ["POST"]
    pattern: '/api/v1/inspection/schools/generate-credentials/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['generateSchoolCredentials']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['generateSchoolCredentials']>>>
    }
  }
  'inspections.send_global_communication': {
    methods: ["POST"]
    pattern: '/api/v1/inspection/communications/global'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['sendGlobalCommunication']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['sendGlobalCommunication']>>>
    }
  }
  'inspections.send_school_communication': {
    methods: ["POST"]
    pattern: '/api/v1/inspection/communications/school/:schoolId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { schoolId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['sendSchoolCommunication']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['sendSchoolCommunication']>>>
    }
  }
  'inspections.get_communication_history': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/inspection/communications/history'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['getCommunicationHistory']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['getCommunicationHistory']>>>
    }
  }
  'inspections.get_global_stats': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/inspection/stats/global'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['getGlobalStats']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['getGlobalStats']>>>
    }
  }
  'inspections.get_schools_stats': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/inspection/stats/schools'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['getSchoolsStats']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['getSchoolsStats']>>>
    }
  }
  'inspections.get_performance_stats': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/inspection/stats/performance'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['getPerformanceStats']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['getPerformanceStats']>>>
    }
  }
  'inspections.generate_schools_report': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/inspection/reports/schools'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['generateSchoolsReport']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['generateSchoolsReport']>>>
    }
  }
  'inspections.generate_transfers_report': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/inspection/reports/transfers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['generateTransfersReport']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['generateTransfersReport']>>>
    }
  }
  'schools.dashboard': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/school/dashboard'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['dashboard']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['dashboard']>>>
    }
  }
  'schools.get_school_stats': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/school/stats'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['getSchoolStats']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['getSchoolStats']>>>
    }
  }
  'schools.get_school_profile': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/school/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['getSchoolProfile']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['getSchoolProfile']>>>
    }
  }
  'schools.update_school_profile': {
    methods: ["PUT"]
    pattern: '/api/v1/school/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['updateSchoolProfile']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['updateSchoolProfile']>>>
    }
  }
  'academics.get_classes': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/school/classes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getClasses']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getClasses']>>>
    }
  }
  'academics.create_class': {
    methods: ["POST"]
    pattern: '/api/v1/school/classes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['createClass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['createClass']>>>
    }
  }
  'academics.update_class': {
    methods: ["PUT"]
    pattern: '/api/v1/school/classes/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['updateClass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['updateClass']>>>
    }
  }
  'academics.delete_class': {
    methods: ["DELETE"]
    pattern: '/api/v1/school/classes/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['deleteClass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['deleteClass']>>>
    }
  }
  'academics.get_class_students': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/school/classes/:id/students'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getClassStudents']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getClassStudents']>>>
    }
  }
  'academics.get_subjects': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/school/subjects'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getSubjects']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getSubjects']>>>
    }
  }
  'academics.add_subject_to_class': {
    methods: ["POST"]
    pattern: '/api/v1/school/subjects'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['addSubjectToClass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['addSubjectToClass']>>>
    }
  }
  'schools.get_teachers': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/school/teachers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['getTeachers']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['getTeachers']>>>
    }
  }
  'schools.add_teacher': {
    methods: ["POST"]
    pattern: '/api/v1/school/teachers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['addTeacher']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['addTeacher']>>>
    }
  }
  'schools.update_teacher': {
    methods: ["PUT"]
    pattern: '/api/v1/school/teachers/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['updateTeacher']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['updateTeacher']>>>
    }
  }
  'schools.remove_teacher': {
    methods: ["DELETE"]
    pattern: '/api/v1/school/teachers/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['removeTeacher']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['removeTeacher']>>>
    }
  }
  'transfers.request_transfer': {
    methods: ["POST"]
    pattern: '/api/v1/school/transfers/request'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['requestTransfer']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['requestTransfer']>>>
    }
  }
  'transfers.get_pending_transfers': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/school/transfers/pending'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['getPendingTransfers']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['getPendingTransfers']>>>
    }
  }
  'transfers.approve_transfer': {
    methods: ["POST"]
    pattern: '/api/v1/school/transfers/approve/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['approveTransfer']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['approveTransfer']>>>
    }
  }
  'transfers.reject_transfer': {
    methods: ["POST"]
    pattern: '/api/v1/school/transfers/reject/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['rejectTransfer']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['rejectTransfer']>>>
    }
  }
  'pedagogicals.get_grades': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/pedagogical/grades'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['getGrades']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['getGrades']>>>
    }
  }
  'pedagogicals.add_grade': {
    methods: ["POST"]
    pattern: '/api/v1/pedagogical/grades'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['addGrade']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['addGrade']>>>
    }
  }
  'pedagogicals.update_grade': {
    methods: ["PUT"]
    pattern: '/api/v1/pedagogical/grades/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['updateGrade']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['updateGrade']>>>
    }
  }
  'pedagogicals.publish_grades': {
    methods: ["POST"]
    pattern: '/api/v1/pedagogical/grades/publish/:classId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { classId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['publishGrades']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['publishGrades']>>>
    }
  }
  'pedagogicals.generate_report_card': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/pedagogical/report-cards/student/:studentId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { studentId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['generateReportCard']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['generateReportCard']>>>
    }
  }
  'pedagogicals.get_class_report_cards': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/pedagogical/report-cards/class/:classId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { classId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['getClassReportCards']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['getClassReportCards']>>>
    }
  }
  'pedagogicals.get_class_timetable': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/pedagogical/timetable/class/:classId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { classId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['getClassTimetable']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['getClassTimetable']>>>
    }
  }
  'pedagogicals.set_timetable': {
    methods: ["POST"]
    pattern: '/api/v1/pedagogical/timetable'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['setTimetable']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['setTimetable']>>>
    }
  }
  'pedagogicals.get_academic_stats': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/pedagogical/stats/academic'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['getAcademicStats']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['getAcademicStats']>>>
    }
  }
  'pedagogicals.get_student_stats': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/pedagogical/stats/student/:studentId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { studentId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['getStudentStats']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['getStudentStats']>>>
    }
  }
  'financials.get_fees': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/financial/fees'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['getFees']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['getFees']>>>
    }
  }
  'financials.set_fees': {
    methods: ["POST"]
    pattern: '/api/v1/financial/fees'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['setFees']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['setFees']>>>
    }
  }
  'financials.update_fees': {
    methods: ["PUT"]
    pattern: '/api/v1/financial/fees/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['updateFees']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['updateFees']>>>
    }
  }
  'financials.delete_fees': {
    methods: ["DELETE"]
    pattern: '/api/v1/financial/fees/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['deleteFees']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['deleteFees']>>>
    }
  }
  'financials.get_payments': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/financial/payments'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['getPayments']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['getPayments']>>>
    }
  }
  'financials.record_payment': {
    methods: ["POST"]
    pattern: '/api/v1/financial/payments'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['recordPayment']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['recordPayment']>>>
    }
  }
  'financials.get_student_payments': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/financial/payments/student/:studentId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { studentId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['getStudentPayments']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['getStudentPayments']>>>
    }
  }
  'financials.generate_receipt': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/financial/payments/receipt/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['generateReceipt']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['generateReceipt']>>>
    }
  }
  'financials.get_income_report': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/financial/reports/income'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['getIncomeReport']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['getIncomeReport']>>>
    }
  }
  'financials.get_outstanding_payments': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/financial/reports/outstanding'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['getOutstandingPayments']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['getOutstandingPayments']>>>
    }
  }
  'financials.get_student_financial_status': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/financial/reports/student/:studentId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { studentId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['getStudentFinancialStatus']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['getStudentFinancialStatus']>>>
    }
  }
  'financials.get_financial_stats': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/financial/stats/financial'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['getFinancialStats']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['getFinancialStats']>>>
    }
  }
  'teachers.get_my_classes': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/teacher/my-classes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['getMyClasses']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['getMyClasses']>>>
    }
  }
  'teachers.get_my_subjects': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/teacher/my-subjects'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['getMySubjects']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['getMySubjects']>>>
    }
  }
  'teachers.get_assignments': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/teacher/assignments'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['getAssignments']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['getAssignments']>>>
    }
  }
  'teachers.create_assignment': {
    methods: ["POST"]
    pattern: '/api/v1/teacher/assignments'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['createAssignment']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['createAssignment']>>>
    }
  }
  'teachers.update_assignment': {
    methods: ["PUT"]
    pattern: '/api/v1/teacher/assignments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['updateAssignment']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['updateAssignment']>>>
    }
  }
  'teachers.delete_assignment': {
    methods: ["DELETE"]
    pattern: '/api/v1/teacher/assignments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['deleteAssignment']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['deleteAssignment']>>>
    }
  }
  'teachers.publish_assignment': {
    methods: ["POST"]
    pattern: '/api/v1/teacher/assignments/:id/publish'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['publishAssignment']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['publishAssignment']>>>
    }
  }
  'teachers.get_submissions': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/teacher/assignments/:id/submissions'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['getSubmissions']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['getSubmissions']>>>
    }
  }
  'teachers.grade_submission': {
    methods: ["POST"]
    pattern: '/api/v1/teacher/assignments/submissions/:id/grade'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['gradeSubmission']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['gradeSubmission']>>>
    }
  }
  'teachers.get_grades': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/teacher/grades'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['getGrades']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['getGrades']>>>
    }
  }
  'teachers.add_grade': {
    methods: ["POST"]
    pattern: '/api/v1/teacher/grades'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['addGrade']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['addGrade']>>>
    }
  }
  'teachers.update_grade': {
    methods: ["PUT"]
    pattern: '/api/v1/teacher/grades/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['updateGrade']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['updateGrade']>>>
    }
  }
  'teachers.get_forum_topics': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/teacher/forum/topics'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['getForumTopics']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['getForumTopics']>>>
    }
  }
  'teachers.create_forum_topic': {
    methods: ["POST"]
    pattern: '/api/v1/teacher/forum/topics'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['createForumTopic']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['createForumTopic']>>>
    }
  }
  'teachers.reply_to_topic': {
    methods: ["POST"]
    pattern: '/api/v1/teacher/forum/topics/:id/posts'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['replyToTopic']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['replyToTopic']>>>
    }
  }
  'teachers.pin_topic': {
    methods: ["PUT"]
    pattern: '/api/v1/teacher/forum/topics/:id/pin'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['pinTopic']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['pinTopic']>>>
    }
  }
  'teachers.lock_topic': {
    methods: ["PUT"]
    pattern: '/api/v1/teacher/forum/topics/:id/lock'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['lockTopic']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['lockTopic']>>>
    }
  }
  'teachers.get_attendance': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/teacher/attendance/class/:classId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { classId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['getAttendance']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['getAttendance']>>>
    }
  }
  'teachers.mark_attendance': {
    methods: ["POST"]
    pattern: '/api/v1/teacher/attendance'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['markAttendance']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['markAttendance']>>>
    }
  }
  'parents.get_children': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/parent/children'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['getChildren']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['getChildren']>>>
    }
  }
  'parents.get_child_details': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/parent/children/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['getChildDetails']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['getChildDetails']>>>
    }
  }
  'parents.get_child_grades': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/parent/grades/child/:studentId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { studentId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['getChildGrades']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['getChildGrades']>>>
    }
  }
  'parents.get_child_report_card': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/parent/report-card/child/:studentId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { studentId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['getChildReportCard']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['getChildReportCard']>>>
    }
  }
  'parents.get_child_discipline': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/parent/discipline/child/:studentId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { studentId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['getChildDiscipline']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['getChildDiscipline']>>>
    }
  }
  'parents.get_messages': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/parent/messages'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['getMessages']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['getMessages']>>>
    }
  }
  'parents.send_message_to_teacher': {
    methods: ["POST"]
    pattern: '/api/v1/parent/messages/teacher/:teacherId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { teacherId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['sendMessageToTeacher']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['sendMessageToTeacher']>>>
    }
  }
  'parents.reply_to_message': {
    methods: ["POST"]
    pattern: '/api/v1/parent/messages/:id/reply'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['replyToMessage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['replyToMessage']>>>
    }
  }
  'parents.get_child_payments': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/parent/payments/child/:studentId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { studentId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['getChildPayments']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['getChildPayments']>>>
    }
  }
  'parents.initiate_payment': {
    methods: ["POST"]
    pattern: '/api/v1/parent/payments/initiate'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['initiatePayment']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['initiatePayment']>>>
    }
  }
  'parents.get_child_forum_activity': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/parent/forum/child/:studentId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { studentId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['getChildForumActivity']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['getChildForumActivity']>>>
    }
  }
  'parents.justify_absence': {
    methods: ["POST"]
    pattern: '/api/v1/parent/absence/justify/:absenceId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { absenceId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['justifyAbsence']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['justifyAbsence']>>>
    }
  }
  'students.get_my_profile': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/student/my-profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['getMyProfile']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['getMyProfile']>>>
    }
  }
  'students.get_my_grades': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/student/my-grades'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['getMyGrades']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['getMyGrades']>>>
    }
  }
  'students.get_my_report_card': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/student/my-report-card'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['getMyReportCard']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['getMyReportCard']>>>
    }
  }
  'students.get_my_discipline': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/student/my-discipline'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['getMyDiscipline']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['getMyDiscipline']>>>
    }
  }
  'students.get_assignments': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/student/assignments'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['getAssignments']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['getAssignments']>>>
    }
  }
  'students.get_assignment_detail': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/student/assignments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['getAssignmentDetail']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['getAssignmentDetail']>>>
    }
  }
  'students.submit_assignment': {
    methods: ["POST"]
    pattern: '/api/v1/student/assignments/:id/submit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['submitAssignment']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['submitAssignment']>>>
    }
  }
  'students.update_submission': {
    methods: ["PUT"]
    pattern: '/api/v1/student/assignments/submissions/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['updateSubmission']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['updateSubmission']>>>
    }
  }
  'students.get_my_forum_questions': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/student/forum/questions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['getMyForumQuestions']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['getMyForumQuestions']>>>
    }
  }
  'students.post_forum_question': {
    methods: ["POST"]
    pattern: '/api/v1/student/forum/questions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['postForumQuestion']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['postForumQuestion']>>>
    }
  }
  'students.reply_to_forum': {
    methods: ["POST"]
    pattern: '/api/v1/student/forum/questions/:id/reply'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['replyToForum']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['replyToForum']>>>
    }
  }
  'students.get_messages': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/student/messages'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['getMessages']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['getMessages']>>>
    }
  }
  'students.send_message_to_teacher': {
    methods: ["POST"]
    pattern: '/api/v1/student/messages/teacher/:teacherId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { teacherId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['sendMessageToTeacher']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['sendMessageToTeacher']>>>
    }
  }
  'students.get_my_timetable': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/student/timetable'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['getMyTimetable']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['getMyTimetable']>>>
    }
  }
  'students.get_my_attendance': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/student/attendance'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['getMyAttendance']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['getMyAttendance']>>>
    }
  }
  'disciplines.get_students': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/discipline/students'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['getStudents']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['getStudents']>>>
    }
  }
  'disciplines.get_student_details': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/discipline/students/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['getStudentDetails']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['getStudentDetails']>>>
    }
  }
  'disciplines.get_all_incidents': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/discipline/incidents'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['getAllIncidents']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['getAllIncidents']>>>
    }
  }
  'disciplines.report_incident': {
    methods: ["POST"]
    pattern: '/api/v1/discipline/incidents'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['reportIncident']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['reportIncident']>>>
    }
  }
  'disciplines.update_incident': {
    methods: ["PUT"]
    pattern: '/api/v1/discipline/incidents/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['updateIncident']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['updateIncident']>>>
    }
  }
  'disciplines.delete_incident': {
    methods: ["DELETE"]
    pattern: '/api/v1/discipline/incidents/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['deleteIncident']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['deleteIncident']>>>
    }
  }
  'disciplines.get_student_incidents': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/discipline/incidents/student/:studentId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { studentId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['getStudentIncidents']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['getStudentIncidents']>>>
    }
  }
  'disciplines.apply_sanction': {
    methods: ["POST"]
    pattern: '/api/v1/discipline/sanctions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['applySanction']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['applySanction']>>>
    }
  }
  'disciplines.update_sanction': {
    methods: ["PUT"]
    pattern: '/api/v1/discipline/sanctions/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['updateSanction']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['updateSanction']>>>
    }
  }
  'disciplines.get_student_discipline_report': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/discipline/reports/student/:studentId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { studentId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['getStudentDisciplineReport']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['getStudentDisciplineReport']>>>
    }
  }
  'disciplines.get_class_discipline_report': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/discipline/reports/class/:classId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { classId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['getClassDisciplineReport']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['getClassDisciplineReport']>>>
    }
  }
  'disciplines.get_discipline_summary': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/discipline/reports/summary'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['getDisciplineSummary']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['getDisciplineSummary']>>>
    }
  }
  'disciplines.get_discipline_stats': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/discipline/stats'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['getDisciplineStats']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['getDisciplineStats']>>>
    }
  }
  'disciplines.notify_parent': {
    methods: ["POST"]
    pattern: '/api/v1/discipline/notify-parent/:incidentId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { incidentId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['notifyParent']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['notifyParent']>>>
    }
  }
  'messages.get_messages': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/communication/messages'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['getMessages']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['getMessages']>>>
    }
  }
  'messages.get_unread_count': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/communication/messages/unread'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['getUnreadCount']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['getUnreadCount']>>>
    }
  }
  'messages.send_message': {
    methods: ["POST"]
    pattern: '/api/v1/communication/messages/send'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['sendMessage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['sendMessage']>>>
    }
  }
  'messages.mark_as_read': {
    methods: ["PUT"]
    pattern: '/api/v1/communication/messages/:id/read'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['markAsRead']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['markAsRead']>>>
    }
  }
  'messages.delete_message': {
    methods: ["DELETE"]
    pattern: '/api/v1/communication/messages/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['deleteMessage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['deleteMessage']>>>
    }
  }
  'messages.get_conversations': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/communication/conversations'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['getConversations']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['getConversations']>>>
    }
  }
  'messages.get_conversation': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/communication/conversations/:userId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { userId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['getConversation']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['getConversation']>>>
    }
  }
  'messages.get_notifications': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/communication/notifications'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['getNotifications']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['getNotifications']>>>
    }
  }
  'messages.mark_notification_as_read': {
    methods: ["PUT"]
    pattern: '/api/v1/communication/notifications/:id/read'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['markNotificationAsRead']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['markNotificationAsRead']>>>
    }
  }
  'messages.mark_all_as_read': {
    methods: ["PUT"]
    pattern: '/api/v1/communication/notifications/read-all'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['markAllAsRead']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['markAllAsRead']>>>
    }
  }
  'messages.upload_attachment': {
    methods: ["POST"]
    pattern: '/api/v1/communication/attachments/upload'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['uploadAttachment']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['uploadAttachment']>>>
    }
  }
  'inter_schools.search_schools': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/inter-school/search'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['searchSchools']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['searchSchools']>>>
    }
  }
  'inter_schools.get_school_public_info': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/inter-school/:id/info'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['getSchoolPublicInfo']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['getSchoolPublicInfo']>>>
    }
  }
  'inter_schools.get_exchanges': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/inter-school/exchanges'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['getExchanges']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['getExchanges']>>>
    }
  }
  'inter_schools.start_exchange': {
    methods: ["POST"]
    pattern: '/api/v1/inter-school/exchanges'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['startExchange']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['startExchange']>>>
    }
  }
  'inter_schools.send_exchange_message': {
    methods: ["POST"]
    pattern: '/api/v1/inter-school/exchanges/:id/message'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['sendExchangeMessage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['sendExchangeMessage']>>>
    }
  }
  'inter_schools.get_best_practices': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/inter-school/best-practices'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['getBestPractices']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['getBestPractices']>>>
    }
  }
  'inter_schools.share_best_practice': {
    methods: ["POST"]
    pattern: '/api/v1/inter-school/best-practices/share'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['shareBestPractice']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['shareBestPractice']>>>
    }
  }
  'inter_schools.get_events': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/inter-school/events'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['getEvents']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['getEvents']>>>
    }
  }
  'inter_schools.create_event': {
    methods: ["POST"]
    pattern: '/api/v1/inter-school/events'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['createEvent']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['createEvent']>>>
    }
  }
  'inter_schools.join_event': {
    methods: ["POST"]
    pattern: '/api/v1/inter-school/events/:id/join'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['joinEvent']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['joinEvent']>>>
    }
  }
  'admins.get_users': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admins_controller').default['getUsers']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admins_controller').default['getUsers']>>>
    }
  }
  'admins.create_user': {
    methods: ["POST"]
    pattern: '/api/v1/admin/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admins_controller').default['createUser']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admins_controller').default['createUser']>>>
    }
  }
  'admins.update_user': {
    methods: ["PUT"]
    pattern: '/api/v1/admin/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admins_controller').default['updateUser']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admins_controller').default['updateUser']>>>
    }
  }
  'admins.delete_user': {
    methods: ["DELETE"]
    pattern: '/api/v1/admin/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admins_controller').default['deleteUser']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admins_controller').default['deleteUser']>>>
    }
  }
  'admins.activate_user': {
    methods: ["POST"]
    pattern: '/api/v1/admin/users/:id/activate'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admins_controller').default['activateUser']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admins_controller').default['activateUser']>>>
    }
  }
  'admins.suspend_user': {
    methods: ["POST"]
    pattern: '/api/v1/admin/users/:id/suspend'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admins_controller').default['suspendUser']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admins_controller').default['suspendUser']>>>
    }
  }
  'admins.get_roles': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/roles'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admins_controller').default['getRoles']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admins_controller').default['getRoles']>>>
    }
  }
  'admins.create_role': {
    methods: ["POST"]
    pattern: '/api/v1/admin/roles'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admins_controller').default['createRole']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admins_controller').default['createRole']>>>
    }
  }
  'admins.update_role': {
    methods: ["PUT"]
    pattern: '/api/v1/admin/roles/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admins_controller').default['updateRole']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admins_controller').default['updateRole']>>>
    }
  }
  'admins.get_system_logs': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/logs'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admins_controller').default['getSystemLogs']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admins_controller').default['getSystemLogs']>>>
    }
  }
  'admins.get_user_activity_logs': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/logs/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admins_controller').default['getUserActivityLogs']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admins_controller').default['getUserActivityLogs']>>>
    }
  }
}
