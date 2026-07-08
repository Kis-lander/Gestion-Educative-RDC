/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'welcome.index': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/home'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'about': {
    methods: ["GET","HEAD"]
    pattern: '/about'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'welcome.landing': {
    methods: ["GET","HEAD"]
    pattern: '/welcome'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'welcome.testimonials.store': {
    methods: ["POST"]
    pattern: '/testimonials'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'welcome.about': {
    methods: ["GET","HEAD"]
    pattern: '/welcome/about'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'welcome.features': {
    methods: ["GET","HEAD"]
    pattern: '/welcome/features'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'welcome.contact': {
    methods: ["GET","HEAD"]
    pattern: '/welcome/contact'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'welcome.terms': {
    methods: ["GET","HEAD"]
    pattern: '/welcome/terms'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'schools.register.create': {
    methods: ["GET","HEAD"]
    pattern: '/register-school'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'schools.register': {
    methods: ["POST"]
    pattern: '/register-school'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['registerSchool']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['registerSchool']>>>
    }
  }
  'help.index': {
    methods: ["GET","HEAD"]
    pattern: '/help'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/help_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/help_controller').default['index']>>>
    }
  }
  'help.faq': {
    methods: ["GET","HEAD"]
    pattern: '/help/faq'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/help_controller').default['faq']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/help_controller').default['faq']>>>
    }
  }
  'help.guides': {
    methods: ["GET","HEAD"]
    pattern: '/help/guides'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/help_controller').default['guides']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/help_controller').default['guides']>>>
    }
  }
  'help.tutorial': {
    methods: ["GET","HEAD"]
    pattern: '/help/tutorial'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/help_controller').default['tutorial']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/help_controller').default['tutorial']>>>
    }
  }
  'help.contact': {
    methods: ["GET","HEAD"]
    pattern: '/help/contact'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/help_controller').default['contact']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/help_controller').default['contact']>>>
    }
  }
  'help.documentation': {
    methods: ["GET","HEAD"]
    pattern: '/help/documentation'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/help_controller').default['documentation']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/help_controller').default['documentation']>>>
    }
  }
  'session.create': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'new_account.create': {
    methods: ["GET","HEAD"]
    pattern: '/signup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
    }
  }
  'new_account.store': {
    methods: ["POST"]
    pattern: '/signup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
    }
  }
  'session.destroy': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
    }
  }
  'inspection.dashboard': {
    methods: ["GET","HEAD"]
    pattern: '/inspection/dashboard'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_controller').default['inspection']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/dashboard_controller').default['inspection']>>>
    }
  }
  'inspections.schools_page': {
    methods: ["GET","HEAD"]
    pattern: '/inspection/schools'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['schoolsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['schoolsPage']>>>
    }
  }
  'inspections.pending_schools_page': {
    methods: ["GET","HEAD"]
    pattern: '/inspection/schools/pending'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['pendingSchoolsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['pendingSchoolsPage']>>>
    }
  }
  'inspections.school_classes_page': {
    methods: ["GET","HEAD"]
    pattern: '/inspection/schools/:id/classes'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['schoolClassesPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['schoolClassesPage']>>>
    }
  }
  'inspections.inspect_school_page': {
    methods: ["GET","HEAD"]
    pattern: '/inspection/schools/:id/inspect'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['inspectSchoolPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['inspectSchoolPage']>>>
    }
  }
  'inspections.store_school_inspection': {
    methods: ["POST"]
    pattern: '/inspection/schools/:id/inspect'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/inspection').inspectSchoolValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/inspection').inspectSchoolValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['storeSchoolInspection']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['storeSchoolInspection']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'inspections.school_details_page': {
    methods: ["GET","HEAD"]
    pattern: '/inspection/schools/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['schoolDetailsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['schoolDetailsPage']>>>
    }
  }
  'inspections.approve_school_page': {
    methods: ["GET","HEAD"]
    pattern: '/inspection/schools/:id/approve'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['approveSchoolPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['approveSchoolPage']>>>
    }
  }
  'inspections.approve_and_generate_credentials': {
    methods: ["POST"]
    pattern: '/inspection/schools/:id/generate-credentials'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['approveAndGenerateCredentials']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['approveAndGenerateCredentials']>>>
    }
  }
  'inspections.reject_school_redirect': {
    methods: ["GET","HEAD"]
    pattern: '/inspection/schools/:id/reject'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['rejectSchoolRedirect']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['rejectSchoolRedirect']>>>
    }
  }
  'inspections.reject_school': {
    methods: ["POST"]
    pattern: '/inspection/schools/:id/reject'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['rejectSchool']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['rejectSchool']>>>
    }
  }
  'inspections.toggle_suspend_school': {
    methods: ["POST"]
    pattern: '/inspection/schools/:id/toggle-suspend'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['toggleSuspendSchool']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['toggleSuspendSchool']>>>
    }
  }
  'inspections.inspection_teachers_page': {
    methods: ["GET","HEAD"]
    pattern: '/inspection/teachers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['inspectionTeachersPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['inspectionTeachersPage']>>>
    }
  }
  'inspections.communications_global_page': {
    methods: ["GET","HEAD"]
    pattern: '/inspection/communications/global'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['communicationsGlobalPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['communicationsGlobalPage']>>>
    }
  }
  'inspection.communications.global.store': {
    methods: ["POST"]
    pattern: '/inspection/communications/global'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/inspection').sendGlobalCommunicationValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/inspection').sendGlobalCommunicationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['sendGlobalCommunication']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['sendGlobalCommunication']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'inspections.communications_school_page': {
    methods: ["GET","HEAD"]
    pattern: '/inspection/communications/school'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['communicationsSchoolPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['communicationsSchoolPage']>>>
    }
  }
  'messages.send_school_communication': {
    methods: ["POST"]
    pattern: '/inspection/communications/school'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/message').sendSchoolCommunicationValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/message').sendSchoolCommunicationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['sendSchoolCommunication']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['sendSchoolCommunication']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'inspections.communications_history_page': {
    methods: ["GET","HEAD"]
    pattern: '/inspection/communications/history'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['communicationsHistoryPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['communicationsHistoryPage']>>>
    }
  }
  'inspections.communication_details': {
    methods: ["GET","HEAD"]
    pattern: '/inspection/communications/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['communicationDetails']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['communicationDetails']>>>
    }
  }
  'inspections.reports_schools_page': {
    methods: ["GET","HEAD"]
    pattern: '/inspection/reports/schools'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['reportsSchoolsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['reportsSchoolsPage']>>>
    }
  }
  'inspections.reports_performance_page': {
    methods: ["GET","HEAD"]
    pattern: '/inspection/reports/performance'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['reportsPerformancePage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['reportsPerformancePage']>>>
    }
  }
  'inspections.reports_statistics_page': {
    methods: ["GET","HEAD"]
    pattern: '/inspection/reports/statistics'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['reportsStatisticsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['reportsStatisticsPage']>>>
    }
  }
  'inspections.reports_transfers_page': {
    methods: ["GET","HEAD"]
    pattern: '/inspection/reports/transfers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['reportsTransfersPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['reportsTransfersPage']>>>
    }
  }
  'inspections.school_report_page': {
    methods: ["GET","HEAD"]
    pattern: '/inspection/reports/school/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['schoolReportPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['schoolReportPage']>>>
    }
  }
  'inspections.settings_page': {
    methods: ["GET","HEAD"]
    pattern: '/inspection/settings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['settingsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['settingsPage']>>>
    }
  }
  'inspection.settings.general.store': {
    methods: ["POST"]
    pattern: '/inspection/settings/general'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['saveSettings']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['saveSettings']>>>
    }
  }
  'inspection.settings.inspection.store': {
    methods: ["POST"]
    pattern: '/inspection/settings/inspection'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['saveSettings']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['saveSettings']>>>
    }
  }
  'inspection.settings.notifications.store': {
    methods: ["POST"]
    pattern: '/inspection/settings/notifications'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['saveSettings']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['saveSettings']>>>
    }
  }
  'inspection.settings.backup.store': {
    methods: ["POST"]
    pattern: '/inspection/settings/backup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['saveSettings']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['saveSettings']>>>
    }
  }
  'inspection.settings.security.store': {
    methods: ["POST"]
    pattern: '/inspection/settings/security'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['saveSettings']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['saveSettings']>>>
    }
  }
  'inspection.settings.carousel.store': {
    methods: ["POST"]
    pattern: '/inspection/settings/carousel'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['storeCarouselImage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['storeCarouselImage']>>>
    }
  }
  'inspection.settings.carousel.update': {
    methods: ["POST"]
    pattern: '/inspection/settings/carousel/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['updateCarouselImage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['updateCarouselImage']>>>
    }
  }
  'inspection.settings.carousel.delete': {
    methods: ["POST"]
    pattern: '/inspection/settings/carousel/:id/delete'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['deleteCarouselImage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['deleteCarouselImage']>>>
    }
  }
  'inspections.export_schools': {
    methods: ["GET","HEAD"]
    pattern: '/inspection/schools/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['exportSchools']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['exportSchools']>>>
    }
  }
  'inspections.schools_report_data': {
    methods: ["GET","HEAD"]
    pattern: '/api/inspection/reports/schools'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['schoolsReportData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['schoolsReportData']>>>
    }
  }
  'inspections.performance_report_data': {
    methods: ["GET","HEAD"]
    pattern: '/api/inspection/reports/performance'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['performanceReportData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['performanceReportData']>>>
    }
  }
  'inspections.statistics_report_data': {
    methods: ["GET","HEAD"]
    pattern: '/api/inspection/reports/statistics'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['statisticsReportData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['statisticsReportData']>>>
    }
  }
  'inspections.transfers_report_data': {
    methods: ["GET","HEAD"]
    pattern: '/api/inspection/reports/transfers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['transfersReportData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['transfersReportData']>>>
    }
  }
  'inspections.export_transfers_report': {
    methods: ["GET","HEAD"]
    pattern: '/api/inspection/reports/transfers/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['exportTransfersReport']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['exportTransfersReport']>>>
    }
  }
  'inspections.trigger_backup': {
    methods: ["POST"]
    pattern: '/api/inspection/backup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['triggerBackup']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['triggerBackup']>>>
    }
  }
  'inspections.download_backup': {
    methods: ["GET","HEAD"]
    pattern: '/api/inspection/backup/download/:filename'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { filename: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['downloadBackup']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['downloadBackup']>>>
    }
  }
  'inspections.logs': {
    methods: ["GET","HEAD"]
    pattern: '/api/inspection/logs'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['logs']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['logs']>>>
    }
  }
  'inspections.export_logs': {
    methods: ["GET","HEAD"]
    pattern: '/api/inspection/logs/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['exportLogs']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['exportLogs']>>>
    }
  }
  'dashboard': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_controller').default['workspace']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/dashboard_controller').default['workspace']>>>
    }
  }
  'settings': {
    methods: ["GET","HEAD"]
    pattern: '/settings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'settings.get_language': {
    methods: ["GET","HEAD"]
    pattern: '/api/settings/language'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['getLanguage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['getLanguage']>>>
    }
  }
  'settings.save_language': {
    methods: ["POST"]
    pattern: '/api/settings/language'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['saveLanguage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['saveLanguage']>>>
    }
  }
  'settings.save_regional': {
    methods: ["POST"]
    pattern: '/api/settings/regional'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['saveRegional']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['saveRegional']>>>
    }
  }
  'settings.reset_general': {
    methods: ["POST"]
    pattern: '/api/settings/general/reset'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['resetGeneral']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['resetGeneral']>>>
    }
  }
  'settings.update_email': {
    methods: ["PUT"]
    pattern: '/api/settings/account/email'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['updateEmail']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['updateEmail']>>>
    }
  }
  'settings.revoke_session': {
    methods: ["POST"]
    pattern: '/api/settings/account/revoke-session/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['revokeSession']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['revokeSession']>>>
    }
  }
  'settings.revoke_all_sessions': {
    methods: ["POST"]
    pattern: '/api/settings/account/revoke-all-sessions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['revokeAllSessions']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['revokeAllSessions']>>>
    }
  }
  'settings.deactivate_account': {
    methods: ["POST"]
    pattern: '/api/settings/account/deactivate'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['deactivateAccount']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['deactivateAccount']>>>
    }
  }
  'settings.delete_account': {
    methods: ["DELETE"]
    pattern: '/api/settings/account/delete'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['deleteAccount']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['deleteAccount']>>>
    }
  }
  'settings.save_notification_types': {
    methods: ["POST"]
    pattern: '/api/settings/notification-types'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['saveNotificationTypes']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['saveNotificationTypes']>>>
    }
  }
  'settings.save_quiet_hours': {
    methods: ["POST"]
    pattern: '/api/settings/quiet-hours'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['saveQuietHours']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['saveQuietHours']>>>
    }
  }
  'settings.save_visibility': {
    methods: ["POST"]
    pattern: '/api/settings/privacy/visibility'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['saveVisibility']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['saveVisibility']>>>
    }
  }
  'settings.export_data': {
    methods: ["GET","HEAD"]
    pattern: '/api/settings/privacy/export-data'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['exportData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['exportData']>>>
    }
  }
  'settings.delete_data': {
    methods: ["DELETE"]
    pattern: '/api/settings/privacy/delete-data'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['deleteData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['deleteData']>>>
    }
  }
  'settings.block_user': {
    methods: ["POST"]
    pattern: '/api/settings/privacy/block'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['blockUser']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['blockUser']>>>
    }
  }
  'settings.unblock_user': {
    methods: ["DELETE"]
    pattern: '/api/settings/privacy/unblock/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['unblockUser']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['unblockUser']>>>
    }
  }
  'settings.general': {
    methods: ["GET","HEAD"]
    pattern: '/settings/general'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['generalPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['generalPage']>>>
    }
  }
  'settings.general.store': {
    methods: ["POST"]
    pattern: '/settings/general'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['saveGeneral']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['saveGeneral']>>>
    }
  }
  'teachers.index': {
    methods: ["GET","HEAD"]
    pattern: '/teachers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'teachers.create': {
    methods: ["GET","HEAD"]
    pattern: '/teachers/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'schools.accounts.index': {
    methods: ["GET","HEAD"]
    pattern: '/schools/accounts'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['accountsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['accountsPage']>>>
    }
  }
  'schools.accounts.create': {
    methods: ["GET","HEAD"]
    pattern: '/schools/accounts/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['createAccountPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['createAccountPage']>>>
    }
  }
  'schools.accounts.store': {
    methods: ["POST"]
    pattern: '/schools/accounts/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['storeAccount']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['storeAccount']>>>
    }
  }
  'schools.accounts.edit': {
    methods: ["GET","HEAD"]
    pattern: '/schools/accounts/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['editAccountPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['editAccountPage']>>>
    }
  }
  'schools.accounts.update': {
    methods: ["POST"]
    pattern: '/schools/accounts/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['updateAccount']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['updateAccount']>>>
    }
  }
  'schools.accounts.credentials': {
    methods: ["POST"]
    pattern: '/schools/accounts/:id/credentials'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['resetAccountCredentials']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['resetAccountCredentials']>>>
    }
  }
  'inspection.messages': {
    methods: ["GET","HEAD"]
    pattern: '/communication/messages'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'communication.messages.compose': {
    methods: ["GET","HEAD"]
    pattern: '/communication/messages/compose'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['composePage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['composePage']>>>
    }
  }
  'communication.messages.sent': {
    methods: ["GET","HEAD"]
    pattern: '/communication/messages/sent'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['sentPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['sentPage']>>>
    }
  }
  'communication.messages.inbox': {
    methods: ["GET","HEAD"]
    pattern: '/communication/messages/inbox'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['inboxPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['inboxPage']>>>
    }
  }
  'communication.messages.read': {
    methods: ["GET","HEAD"]
    pattern: '/communication/messages/read/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['readPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['readPage']>>>
    }
  }
  'communication.messages.edit': {
    methods: ["GET","HEAD"]
    pattern: '/communication/messages/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['editPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['editPage']>>>
    }
  }
  'communication.messages.update': {
    methods: ["POST"]
    pattern: '/communication/messages/:id/edit'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/message').sendMessageValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/message').sendMessageValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['updateWebMessage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['updateWebMessage']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'communication.messages.mark_all_read': {
    methods: ["POST"]
    pattern: '/communication/messages/mark-all-read'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['markAllReadWeb']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['markAllReadWeb']>>>
    }
  }
  'communication.messages.delete': {
    methods: ["DELETE"]
    pattern: '/communication/messages/:id/delete'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['deleteWebMessage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['deleteWebMessage']>>>
    }
  }
  'communication.messages.restore': {
    methods: ["POST"]
    pattern: '/communication/messages/:id/restore'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['restoreWebMessage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['restoreWebMessage']>>>
    }
  }
  'communication.messages.permanent_delete': {
    methods: ["DELETE"]
    pattern: '/communication/messages/:id/permanent'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['deleteWebMessagePermanently']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['deleteWebMessagePermanently']>>>
    }
  }
  'communication.messages.empty_trash': {
    methods: ["DELETE"]
    pattern: '/communication/messages/empty-trash'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['emptyTrashWeb']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['emptyTrashWeb']>>>
    }
  }
  'communication.messages.restore_all': {
    methods: ["POST"]
    pattern: '/communication/messages/restore-all'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['restoreAllWeb']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['restoreAllWeb']>>>
    }
  }
  'communication.messages.send.redirect': {
    methods: ["GET","HEAD"]
    pattern: '/communication/messages/send'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['redirectSendToCompose']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['redirectSendToCompose']>>>
    }
  }
  'communication.messages.send': {
    methods: ["POST"]
    pattern: '/communication/messages/send'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/message').sendMessageValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/message').sendMessageValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['sendWebMessage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['sendWebMessage']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'api.messages.conversation': {
    methods: ["GET","HEAD"]
    pattern: '/api/messages/conversation/:userId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { userId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['getConversationWeb']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['getConversationWeb']>>>
    }
  }
  'api.messages.send': {
    methods: ["POST"]
    pattern: '/api/messages/send'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['sendConversationWeb']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['sendConversationWeb']>>>
    }
  }
  'api.messages.update_conversation': {
    methods: ["PUT"]
    pattern: '/api/messages/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['updateConversationMessage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['updateConversationMessage']>>>
    }
  }
  'api.messages.delete_conversation': {
    methods: ["DELETE"]
    pattern: '/api/messages/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['deleteConversationMessage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['deleteConversationMessage']>>>
    }
  }
  'api.messages.conversation.export': {
    methods: ["GET","HEAD"]
    pattern: '/api/messages/conversation/:userId/export'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { userId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['exportConversationWeb']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['exportConversationWeb']>>>
    }
  }
  'api.messages.attachment': {
    methods: ["GET","HEAD"]
    pattern: '/api/messages/:id/attachment'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['downloadAttachment']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['downloadAttachment']>>>
    }
  }
  'api.forum.attachment': {
    methods: ["GET","HEAD"]
    pattern: '/api/forum/:type/:id/attachment'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { type: ParamValue; id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['downloadAttachment']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['downloadAttachment']>>>
    }
  }
  'api.student.forum.export': {
    methods: ["GET","HEAD"]
    pattern: '/api/student/forum/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['exportStudentForum']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['exportStudentForum']>>>
    }
  }
  'api.teacher.forum.export': {
    methods: ["GET","HEAD"]
    pattern: '/api/teacher/forum/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['exportTeacherForum']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['exportTeacherForum']>>>
    }
  }
  'api.student.forum.topic.resolve': {
    methods: ["POST"]
    pattern: '/api/student/forum/topic/:id/resolve'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['resolveStudentTopic']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['resolveStudentTopic']>>>
    }
  }
  'api.student.forum.topic.view': {
    methods: ["POST"]
    pattern: '/api/student/forum/topic/:id/view'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['recordStudentTopicView']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['recordStudentTopicView']>>>
    }
  }
  'api.forum.topic.view': {
    methods: ["POST"]
    pattern: '/api/forum/topic/:id/view'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['recordTeacherTopicView']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['recordTeacherTopicView']>>>
    }
  }
  'api.teacher.assignments.export': {
    methods: ["GET","HEAD"]
    pattern: '/api/teacher/assignments/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['exportAssignments']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['exportAssignments']>>>
    }
  }
  'api.teacher.assignments.submissions.export': {
    methods: ["GET","HEAD"]
    pattern: '/api/teacher/assignments/:id/submissions/export'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['exportSubmissions']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['exportSubmissions']>>>
    }
  }
  'api.messages.restore': {
    methods: ["POST"]
    pattern: '/api/messages/:id/restore'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['restoreWebMessage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['restoreWebMessage']>>>
    }
  }
  'api.messages.permanent_delete': {
    methods: ["DELETE"]
    pattern: '/api/messages/:id/permanent'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['deleteWebMessagePermanently']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['deleteWebMessagePermanently']>>>
    }
  }
  'api.messages.empty_trash': {
    methods: ["DELETE"]
    pattern: '/api/messages/empty-trash'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['emptyTrashWeb']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['emptyTrashWeb']>>>
    }
  }
  'api.messages.restore_all': {
    methods: ["POST"]
    pattern: '/api/messages/restore-all'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['restoreAllWeb']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['restoreAllWeb']>>>
    }
  }
  'communication.notifications.index': {
    methods: ["GET","HEAD"]
    pattern: '/communication/notifications'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['notificationsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['notificationsPage']>>>
    }
  }
  'api.notifications.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/notifications'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['notificationsApi']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['notificationsApi']>>>
    }
  }
  'api.notifications.read': {
    methods: ["POST"]
    pattern: '/api/notifications/:id/read'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['markNotificationRead']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['markNotificationRead']>>>
    }
  }
  'api.notifications.read.put': {
    methods: ["PUT"]
    pattern: '/api/notifications/:id/read'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['markNotificationRead']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['markNotificationRead']>>>
    }
  }
  'api.notifications.mark_all_read': {
    methods: ["POST"]
    pattern: '/api/notifications/mark-all-read'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['markAllNotificationsRead']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['markAllNotificationsRead']>>>
    }
  }
  'api.notifications.read_all': {
    methods: ["PUT"]
    pattern: '/api/notifications/read-all'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['markAllNotificationsRead']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['markAllNotificationsRead']>>>
    }
  }
  'api.notifications.delete_all': {
    methods: ["DELETE"]
    pattern: '/api/notifications/delete-all'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['deleteAllNotifications']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['deleteAllNotifications']>>>
    }
  }
  'api.teacher.classes.export': {
    methods: ["GET","HEAD"]
    pattern: '/api/teacher/classes/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['exportClasses']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['exportClasses']>>>
    }
  }
  'api.teacher.classes.subjects': {
    methods: ["GET","HEAD"]
    pattern: '/api/teacher/classes/:id/my-subjects'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['classSubjectsData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['classSubjectsData']>>>
    }
  }
  'api.teacher.attendance.classes.students': {
    methods: ["GET","HEAD"]
    pattern: '/api/teacher/classes/:id/students'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['getClassStudentsForAttendance']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['getClassStudentsForAttendance']>>>
    }
  }
  'api.teacher.classes.students.export': {
    methods: ["GET","HEAD"]
    pattern: '/api/teacher/classes/:id/students/export'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['exportClassStudents']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['exportClassStudents']>>>
    }
  }
  'api.teacher.grades.export': {
    methods: ["GET","HEAD"]
    pattern: '/api/teacher/grades/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['exportGrades']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['exportGrades']>>>
    }
  }
  'api.teacher.grades.class': {
    methods: ["GET","HEAD"]
    pattern: '/api/teacher/grades/class/:classId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { classId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['gradeClassData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['gradeClassData']>>>
    }
  }
  'api.teacher.grades.class.export': {
    methods: ["GET","HEAD"]
    pattern: '/api/teacher/grades/class/:classId/export'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { classId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['exportGrades']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['exportGrades']>>>
    }
  }
  'api.teacher.grades.publish': {
    methods: ["POST"]
    pattern: '/api/teacher/grades/publish'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['publishGrades']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['publishGrades']>>>
    }
  }
  'api.teacher.grades.class.publish': {
    methods: ["POST"]
    pattern: '/api/teacher/grades/class/:classId/publish'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { classId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['publishGrades']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['publishGrades']>>>
    }
  }
  'api.teacher.attendance.class': {
    methods: ["GET","HEAD"]
    pattern: '/api/teacher/attendance/class/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['getClassAttendance']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['getClassAttendance']>>>
    }
  }
  'api.teacher.attendance.export': {
    methods: ["GET","HEAD"]
    pattern: '/api/teacher/attendance/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['exportAttendance']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['exportAttendance']>>>
    }
  }
  'api.teacher.attendance.student': {
    methods: ["GET","HEAD"]
    pattern: '/api/teacher/attendance/student/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['attendanceStudentData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['attendanceStudentData']>>>
    }
  }
  'api.teacher.attendance.student.export': {
    methods: ["GET","HEAD"]
    pattern: '/api/teacher/attendance/student/:id/export'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['exportAttendanceStudent']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['exportAttendanceStudent']>>>
    }
  }
  'api.teacher.attendance.store': {
    methods: ["POST"]
    pattern: '/api/teacher/attendance'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/teacher').markAttendanceValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/teacher').markAttendanceValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['markAttendance']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['markAttendance']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'api.teacher.send_message': {
    methods: ["POST"]
    pattern: '/api/teacher/send-message'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['sendTeacherMessage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['sendTeacherMessage']>>>
    }
  }
  'api.teacher.notifications.count': {
    methods: ["GET","HEAD"]
    pattern: '/api/teacher/notifications/count'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['notificationsCount']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['notificationsCount']>>>
    }
  }
  'api.teachers.available_slots': {
    methods: ["GET","HEAD"]
    pattern: '/api/teachers/:teacherId/available-slots'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { teacherId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['getTeacherAvailableSlots']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['getTeacherAvailableSlots']>>>
    }
  }
  'inspection.users.stats': {
    methods: ["GET","HEAD"]
    pattern: '/api/users/stats'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['usersStats']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['usersStats']>>>
    }
  }
  'inspection.schools.communication.info': {
    methods: ["GET","HEAD"]
    pattern: '/api/schools/:id/info'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['schoolCommunicationInfo']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['schoolCommunicationInfo']>>>
    }
  }
  'inspection.schools.communication.history': {
    methods: ["GET","HEAD"]
    pattern: '/api/schools/:id/communications'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['schoolCommunicationsHistory']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['schoolCommunicationsHistory']>>>
    }
  }
  'inspection.communications.details.json': {
    methods: ["GET","HEAD"]
    pattern: '/api/communications/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['communicationDetailsJson']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['communicationDetailsJson']>>>
    }
  }
  'profile': {
    methods: ["GET","HEAD"]
    pattern: '/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['profile']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['profile']>>>
    }
  }
  'profile.edit': {
    methods: ["GET","HEAD"]
    pattern: '/profile/edit'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['editProfilePage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['editProfilePage']>>>
    }
  }
  'profile.security': {
    methods: ["GET","HEAD"]
    pattern: '/profile/security'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['securityPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['securityPage']>>>
    }
  }
  'profile.change_password': {
    methods: ["POST"]
    pattern: '/profile/change-password'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth').changePasswordValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').changePasswordValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['changePassword']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['changePassword']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'profile.preferences': {
    methods: ["GET","HEAD"]
    pattern: '/profile/preferences'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['preferencesPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['preferencesPage']>>>
    }
  }
  'profile.preferences.update': {
    methods: ["POST"]
    pattern: '/profile/preferences'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['updatePreferences']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['updatePreferences']>>>
    }
  }
  'profile.activity': {
    methods: ["GET","HEAD"]
    pattern: '/profile/activity'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['activityPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['activityPage']>>>
    }
  }
  'profile.avatar.update': {
    methods: ["POST"]
    pattern: '/api/profile/avatar'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['updateAvatar']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['updateAvatar']>>>
    }
  }
  'academic.classes.index': {
    methods: ["GET","HEAD"]
    pattern: '/academic/classes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['classesPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['classesPage']>>>
    }
  }
  'academic.classes.create': {
    methods: ["GET","HEAD"]
    pattern: '/academic/classes/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['createClassPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['createClassPage']>>>
    }
  }
  'academic.classes.seed_rdc_das': {
    methods: ["POST"]
    pattern: '/academic/classes/seed-rdc-das'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['seedRdcDasClasses']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['seedRdcDasClasses']>>>
    }
  }
  'academic.classes.store': {
    methods: ["POST"]
    pattern: '/academic/classes'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/academic').createClassValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/academic').createClassValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['createClass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['createClass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'academic.classes.show': {
    methods: ["GET","HEAD"]
    pattern: '/academic/classes/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['showClassPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['showClassPage']>>>
    }
  }
  'academic.classes.edit': {
    methods: ["GET","HEAD"]
    pattern: '/academic/classes/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['editClassPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['editClassPage']>>>
    }
  }
  'academic.classes.update.post': {
    methods: ["POST"]
    pattern: '/academic/classes/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/academic').updateClassValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/academic').updateClassValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['updateClass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['updateClass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'academic.classes.update': {
    methods: ["PUT"]
    pattern: '/academic/classes/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/academic').updateClassValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/academic').updateClassValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['updateClass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['updateClass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'academic.classes.destroy': {
    methods: ["DELETE"]
    pattern: '/academic/classes/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['deleteClass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['deleteClass']>>>
    }
  }
  'academic.grades.index': {
    methods: ["GET","HEAD"]
    pattern: '/academic/grades'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['gradesPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['gradesPage']>>>
    }
  }
  'academic.grades.add': {
    methods: ["GET","HEAD"]
    pattern: '/academic/grades/add'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['addGradesPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['addGradesPage']>>>
    }
  }
  'academic.grades.store': {
    methods: ["POST"]
    pattern: '/academic/grades'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/academic').addGradeValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/academic').addGradeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['addGrade']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['addGrade']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'academic.grades.publish': {
    methods: ["POST"]
    pattern: '/academic/grades/publish'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['publishGrades']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['publishGrades']>>>
    }
  }
  'academic.timetable.create': {
    methods: ["GET","HEAD"]
    pattern: '/academic/timetable/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['createTimetablePage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['createTimetablePage']>>>
    }
  }
  'academic.timetable.class': {
    methods: ["GET","HEAD"]
    pattern: '/academic/timetable/class/:classId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { classId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['classTimetablePage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['classTimetablePage']>>>
    }
  }
  'academic.grades.class': {
    methods: ["GET","HEAD"]
    pattern: '/academic/grades/class/:classId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { classId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getGradesByClass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getGradesByClass']>>>
    }
  }
  'academic.classes.students': {
    methods: ["GET","HEAD"]
    pattern: '/academic/classes/:id/students'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getClassStudents']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getClassStudents']>>>
    }
  }
  'academic.classes.subjects': {
    methods: ["GET","HEAD"]
    pattern: '/academic/classes/:classId/subjects'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { classId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getClassSubjects']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getClassSubjects']>>>
    }
  }
  'legacy.api.classes.students': {
    methods: ["GET","HEAD"]
    pattern: '/api/classes/:id/students'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getClassStudents']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getClassStudents']>>>
    }
  }
  'legacy.api.classes.subjects': {
    methods: ["GET","HEAD"]
    pattern: '/api/classes/:classId/subjects'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { classId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getClassSubjects']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getClassSubjects']>>>
    }
  }
  'legacy.api.grades.class': {
    methods: ["GET","HEAD"]
    pattern: '/api/grades/class/:classId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { classId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getGradesByClass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getGradesByClass']>>>
    }
  }
  'legacy.api.timetable.class': {
    methods: ["GET","HEAD"]
    pattern: '/api/timetable/class/:classId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { classId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['getClassTimetable']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['getClassTimetable']>>>
    }
  }
  'legacy.api.timetable.create': {
    methods: ["POST"]
    pattern: '/api/timetable/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['createTimetable']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['createTimetable']>>>
    }
  }
  'students.index': {
    methods: ["GET","HEAD"]
    pattern: '/students'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['indexPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['indexPage']>>>
    }
  }
  'students.create': {
    methods: ["GET","HEAD"]
    pattern: '/students/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['createPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['createPage']>>>
    }
  }
  'students.store': {
    methods: ["POST"]
    pattern: '/students/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['store']>>>
    }
  }
  'students.show': {
    methods: ["GET","HEAD"]
    pattern: '/students/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['showPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['showPage']>>>
    }
  }
  'schools.classes.index': {
    methods: ["GET","HEAD"]
    pattern: '/schools/classes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['classesPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['classesPage']>>>
    }
  }
  'schools.classes.archives': {
    methods: ["GET","HEAD"]
    pattern: '/schools/classes-archives'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['archivedClassesPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['archivedClassesPage']>>>
    }
  }
  'schools.classes.restore': {
    methods: ["POST"]
    pattern: '/schools/classes-archives/:id/restore'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['restoreClass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['restoreClass']>>>
    }
  }
  'schools.classes.destroy_permanently': {
    methods: ["POST"]
    pattern: '/schools/classes-archives/:id/delete'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['permanentlyDeleteClass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['permanentlyDeleteClass']>>>
    }
  }
  'schools.classes.create': {
    methods: ["GET","HEAD"]
    pattern: '/schools/classes/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['createClassPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['createClassPage']>>>
    }
  }
  'schools.classes.seed_rdc_das': {
    methods: ["POST"]
    pattern: '/schools/classes/seed-rdc-das'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['seedRdcDasClasses']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['seedRdcDasClasses']>>>
    }
  }
  'schools.classes.store': {
    methods: ["POST"]
    pattern: '/schools/classes'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/academic').createClassValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/academic').createClassValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['createClass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['createClass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'schools.classes.students': {
    methods: ["GET","HEAD"]
    pattern: '/schools/classes/:id/students'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['classStudentsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['classStudentsPage']>>>
    }
  }
  'schools.classes.edit': {
    methods: ["GET","HEAD"]
    pattern: '/schools/classes/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['editClassPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['editClassPage']>>>
    }
  }
  'schools.classes.show': {
    methods: ["GET","HEAD"]
    pattern: '/schools/classes/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['showClassPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['showClassPage']>>>
    }
  }
  'schools.classes.subjects.store': {
    methods: ["POST"]
    pattern: '/schools/classes/:classId/subjects'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { classId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['addSubjectToClass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['addSubjectToClass']>>>
    }
  }
  'schools.classes.subjects.destroy': {
    methods: ["DELETE"]
    pattern: '/schools/classes/:classId/subjects/:subjectId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { classId: ParamValue; subjectId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['removeSubjectFromClass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['removeSubjectFromClass']>>>
    }
  }
  'schools.classes.update.post': {
    methods: ["POST"]
    pattern: '/schools/classes/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/academic').updateClassValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/academic').updateClassValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['updateClass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['updateClass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'schools.classes.update': {
    methods: ["PUT"]
    pattern: '/schools/classes/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/academic').updateClassValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/academic').updateClassValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['updateClass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['updateClass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'schools.classes.destroy.post': {
    methods: ["POST"]
    pattern: '/schools/classes/:id/delete'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['deleteClass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['deleteClass']>>>
    }
  }
  'schools.classes.destroy': {
    methods: ["DELETE"]
    pattern: '/schools/classes/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['deleteClass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['deleteClass']>>>
    }
  }
  'schools.timetable.index': {
    methods: ["GET","HEAD"]
    pattern: '/schools/timetable'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['timetablePage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['timetablePage']>>>
    }
  }
  'schools.timetable.create': {
    methods: ["GET","HEAD"]
    pattern: '/schools/timetable/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['createTimetablePage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['createTimetablePage']>>>
    }
  }
  'schools.timetable.store': {
    methods: ["POST"]
    pattern: '/schools/timetable'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['createTimetable']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['createTimetable']>>>
    }
  }
  'schools.transfers.request': {
    methods: ["POST"]
    pattern: '/schools/transfers/request'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/transfer').requestTransferValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/transfer').requestTransferValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['requestTransfer']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['requestTransfer']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'schools.teachers.index': {
    methods: ["GET","HEAD"]
    pattern: '/schools/teachers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['teachersPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['teachersPage']>>>
    }
  }
  'schools.teachers.create': {
    methods: ["GET","HEAD"]
    pattern: '/schools/teachers/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['createTeacherPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['createTeacherPage']>>>
    }
  }
  'schools.teachers.store': {
    methods: ["POST"]
    pattern: '/schools/teachers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['addTeacher']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['addTeacher']>>>
    }
  }
  'schools.teachers.show': {
    methods: ["GET","HEAD"]
    pattern: '/schools/teachers/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['showTeacherPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['showTeacherPage']>>>
    }
  }
  'schools.teachers.edit': {
    methods: ["GET","HEAD"]
    pattern: '/schools/teachers/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['editTeacherPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['editTeacherPage']>>>
    }
  }
  'schools.teachers.schedule': {
    methods: ["GET","HEAD"]
    pattern: '/schools/teachers/:id/schedule'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['scheduleTeacherPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['scheduleTeacherPage']>>>
    }
  }
  'schools.teachers.credentials': {
    methods: ["POST"]
    pattern: '/schools/teachers/:id/credentials'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['resetTeacherPassword']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['resetTeacherPassword']>>>
    }
  }
  'schools.teachers.update.post': {
    methods: ["POST"]
    pattern: '/schools/teachers/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['updateTeacher']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['updateTeacher']>>>
    }
  }
  'schools.teachers.update': {
    methods: ["PUT"]
    pattern: '/schools/teachers/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['updateTeacher']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['updateTeacher']>>>
    }
  }
  'schools.teachers.replace': {
    methods: ["POST"]
    pattern: '/schools/teachers/:id/replace'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['replaceTeacher']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['replaceTeacher']>>>
    }
  }
  'schools.teachers.destroy': {
    methods: ["DELETE"]
    pattern: '/schools/teachers/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['deleteTeacher']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['deleteTeacher']>>>
    }
  }
  'api.teachers.reset_password': {
    methods: ["POST"]
    pattern: '/api/teachers/:id/reset-password'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['resetTeacherPassword']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['resetTeacherPassword']>>>
    }
  }
  'api.teachers.list': {
    methods: ["GET","HEAD"]
    pattern: '/api/teachers/list'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['listActiveTeachers']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['listActiveTeachers']>>>
    }
  }
  'discipline.dashboard': {
    methods: ["GET","HEAD"]
    pattern: '/discipline'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['dashboardPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['dashboardPage']>>>
    }
  }
  'discipline.incidents.index': {
    methods: ["GET","HEAD"]
    pattern: '/discipline/incidents'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['incidentsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['incidentsPage']>>>
    }
  }
  'discipline.incidents.report': {
    methods: ["GET","HEAD"]
    pattern: '/discipline/incidents/report'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['reportIncidentPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['reportIncidentPage']>>>
    }
  }
  'discipline.incidents.store': {
    methods: ["POST"]
    pattern: '/discipline/incidents/report'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['storeIncidentWeb']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['storeIncidentWeb']>>>
    }
  }
  'discipline.incidents.show': {
    methods: ["GET","HEAD"]
    pattern: '/discipline/incidents/:id/show'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['showIncidentPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['showIncidentPage']>>>
    }
  }
  'discipline.incidents.edit': {
    methods: ["GET","HEAD"]
    pattern: '/discipline/incidents/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['editIncidentPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['editIncidentPage']>>>
    }
  }
  'discipline.incidents.update': {
    methods: ["PUT"]
    pattern: '/discipline/incidents/:id/update'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['updateIncidentWeb']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['updateIncidentWeb']>>>
    }
  }
  'discipline.incidents.update.post': {
    methods: ["POST"]
    pattern: '/discipline/incidents/:id/update'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['updateIncidentWeb']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['updateIncidentWeb']>>>
    }
  }
  'discipline.incidents.destroy': {
    methods: ["DELETE"]
    pattern: '/discipline/incidents/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['deleteIncident']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['deleteIncident']>>>
    }
  }
  'discipline.students.index': {
    methods: ["GET","HEAD"]
    pattern: '/discipline/students'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['studentsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['studentsPage']>>>
    }
  }
  'discipline.students.show': {
    methods: ["GET","HEAD"]
    pattern: '/discipline/students/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['getStudentDetails']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['getStudentDetails']>>>
    }
  }
  'discipline.sanctions.apply': {
    methods: ["GET","HEAD"]
    pattern: '/discipline/sanctions/apply'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['applySanctionPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['applySanctionPage']>>>
    }
  }
  'discipline.sanctions.apply.store': {
    methods: ["POST"]
    pattern: '/discipline/sanctions/apply'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['applySanctionWeb']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['applySanctionWeb']>>>
    }
  }
  'academic.calendar': {
    methods: ["GET","HEAD"]
    pattern: '/academic/calendar'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'financial.index': {
    methods: ["GET","HEAD"]
    pattern: '/financial'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'financial.fees.index': {
    methods: ["GET","HEAD"]
    pattern: '/financial/fees'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['feesPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['feesPage']>>>
    }
  }
  'financial.fees.create': {
    methods: ["GET","HEAD"]
    pattern: '/financial/fees/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['createFeePage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['createFeePage']>>>
    }
  }
  'financial.fees.store': {
    methods: ["POST"]
    pattern: '/financial/fees/create'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/financial').setSchoolFeesValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/financial').setSchoolFeesValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['setFees']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['setFees']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'financial.fees.structure': {
    methods: ["GET","HEAD"]
    pattern: '/financial/fees/structure'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['feesStructurePage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['feesStructurePage']>>>
    }
  }
  'financial.fees.edit': {
    methods: ["GET","HEAD"]
    pattern: '/financial/fees/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['editFeePage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['editFeePage']>>>
    }
  }
  'financial.fees.update': {
    methods: ["PUT"]
    pattern: '/financial/fees/:id/update'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/financial').updateFeesValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/financial').updateFeesValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['updateFees']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['updateFees']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'financial.fees.update.post': {
    methods: ["POST"]
    pattern: '/financial/fees/:id/update'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/financial').updateFeesValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/financial').updateFeesValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['updateFees']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['updateFees']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'financial.fees.toggle_status': {
    methods: ["POST"]
    pattern: '/financial/fees/:id/toggle-status'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['toggleFeeStatus']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['toggleFeeStatus']>>>
    }
  }
  'financial.fees.destroy': {
    methods: ["DELETE"]
    pattern: '/financial/fees/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['deleteFees']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['deleteFees']>>>
    }
  }
  'financial.payments.index': {
    methods: ["GET","HEAD"]
    pattern: '/financial/payments'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['paymentsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['paymentsPage']>>>
    }
  }
  'financial.payments.record': {
    methods: ["GET","HEAD"]
    pattern: '/financial/payments/record'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['recordPaymentPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['recordPaymentPage']>>>
    }
  }
  'financial.payments.store': {
    methods: ["POST"]
    pattern: '/financial/payments/record'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/financial').recordPaymentValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/financial').recordPaymentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['recordPayment']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['recordPayment']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'financial.payments.receipt': {
    methods: ["GET","HEAD"]
    pattern: '/financial/payments/receipt/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['receiptPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['receiptPage']>>>
    }
  }
  'financial.payments.print': {
    methods: ["GET","HEAD"]
    pattern: '/financial/payments/print-receipt/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['printReceiptPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['printReceiptPage']>>>
    }
  }
  'financial.payments.destroy': {
    methods: ["DELETE"]
    pattern: '/financial/payments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['deletePayment']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['deletePayment']>>>
    }
  }
  'financial.reports.income': {
    methods: ["GET","HEAD"]
    pattern: '/financial/reports/income'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['incomeReportPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['incomeReportPage']>>>
    }
  }
  'financial.reports.outstanding': {
    methods: ["GET","HEAD"]
    pattern: '/financial/reports/outstanding'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['outstandingReportPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['outstandingReportPage']>>>
    }
  }
  'financial.reports.statistics': {
    methods: ["GET","HEAD"]
    pattern: '/financial/reports/statistics'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['statisticsReportPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['statisticsReportPage']>>>
    }
  }
  'financial.reports.export': {
    methods: ["GET","HEAD"]
    pattern: '/financial/reports/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['exportReport']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['exportReport']>>>
    }
  }
  'legacy.api.students.financial_status': {
    methods: ["GET","HEAD"]
    pattern: '/api/students/:studentId/financial-status'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { studentId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['studentFinancialStatus']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['studentFinancialStatus']>>>
    }
  }
  'schools.profile.update.web': {
    methods: ["POST"]
    pattern: '/schools/profile/update'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['updateSchoolProfile']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schools_controller').default['updateSchoolProfile']>>>
    }
  }
  'schools.subjects.index': {
    methods: ["GET","HEAD"]
    pattern: '/schools/subjects'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['subjectsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['subjectsPage']>>>
    }
  }
  'schools.subjects.store': {
    methods: ["POST"]
    pattern: '/schools/subjects'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/academic').createSubjectValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/academic').createSubjectValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['createSubject']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['createSubject']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'schools.subjects.assign': {
    methods: ["GET","HEAD"]
    pattern: '/schools/subjects/assign'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['assignSubjectsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['assignSubjectsPage']>>>
    }
  }
  'schools.subjects.catalog': {
    methods: ["GET","HEAD"]
    pattern: '/schools/subjects/catalog'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['nationalSubjectsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['nationalSubjectsPage']>>>
    }
  }
  'schools.subjects.assign.store': {
    methods: ["POST"]
    pattern: '/schools/subjects/assign'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['addSubjectToClass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['addSubjectToClass']>>>
    }
  }
  'schools.subjects.assignments.destroy': {
    methods: ["DELETE"]
    pattern: '/schools/subjects/assignments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['removeSubjectAssignment']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['removeSubjectAssignment']>>>
    }
  }
  'schools.subjects.classes': {
    methods: ["GET","HEAD"]
    pattern: '/schools/subjects/:id/classes'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getSubjectClasses']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getSubjectClasses']>>>
    }
  }
  'schools.subjects.classes.destroy': {
    methods: ["DELETE"]
    pattern: '/schools/subjects/:subjectId/classes/:classId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { subjectId: ParamValue; classId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['removeSubjectFromClass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['removeSubjectFromClass']>>>
    }
  }
  'schools.subjects.edit': {
    methods: ["GET","HEAD"]
    pattern: '/schools/subjects/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['editSubjectPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['editSubjectPage']>>>
    }
  }
  'schools.subjects.update.post': {
    methods: ["POST"]
    pattern: '/schools/subjects/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['updateSubject']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['updateSubject']>>>
    }
  }
  'schools.subjects.update': {
    methods: ["PUT"]
    pattern: '/schools/subjects/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['updateSubject']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['updateSubject']>>>
    }
  }
  'schools.subjects.destroy': {
    methods: ["DELETE"]
    pattern: '/schools/subjects/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['deleteSubject']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['deleteSubject']>>>
    }
  }
  'transfers.authorize_transfer_page': {
    methods: ["GET","HEAD"]
    pattern: '/schools/transfers/authorize'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['authorizeTransferPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['authorizeTransferPage']>>>
    }
  }
  'transfers.pending_transfers_page': {
    methods: ["GET","HEAD"]
    pattern: '/schools/transfers/pending'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['pendingTransfersPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['pendingTransfersPage']>>>
    }
  }
  'transfers.requests_page': {
    methods: ["GET","HEAD"]
    pattern: '/schools/transfers/requests'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['requestsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['requestsPage']>>>
    }
  }
  'transfers.transfer_history_page': {
    methods: ["GET","HEAD"]
    pattern: '/schools/transfers/history/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['transferHistoryPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['transferHistoryPage']>>>
    }
  }
  'transfers.transfer_details': {
    methods: ["GET","HEAD"]
    pattern: '/schools/transfers/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['transferDetails']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['transferDetails']>>>
    }
  }
  'transfers.update_reason': {
    methods: ["PUT"]
    pattern: '/schools/transfers/:id/reason'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['updateReason']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['updateReason']>>>
    }
  }
  'transfers.cancel_transfer': {
    methods: ["POST"]
    pattern: '/schools/transfers/:id/cancel'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['cancelTransfer']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['cancelTransfer']>>>
    }
  }
  'transfers.authorize_transfer': {
    methods: ["POST"]
    pattern: '/schools/transfers/:id/authorize'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['authorizeTransfer']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['authorizeTransfer']>>>
    }
  }
  'transfers.reject_incoming_transfer': {
    methods: ["POST"]
    pattern: '/schools/transfers/:id/reject'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['rejectIncomingTransfer']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['rejectIncomingTransfer']>>>
    }
  }
  'messages.conversation_page': {
    methods: ["GET","HEAD"]
    pattern: '/communication/messages/conversation/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['conversationPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['conversationPage']>>>
    }
  }
  'messages.trash_page': {
    methods: ["GET","HEAD"]
    pattern: '/communication/messages/trash'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['trashPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['trashPage']>>>
    }
  }
  'settings.account_page': {
    methods: ["GET","HEAD"]
    pattern: '/settings/account'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['accountPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['accountPage']>>>
    }
  }
  'settings.language_page': {
    methods: ["GET","HEAD"]
    pattern: '/settings/language'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['languagePage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['languagePage']>>>
    }
  }
  'settings.notifications_page': {
    methods: ["GET","HEAD"]
    pattern: '/settings/notifications'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['notificationsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['notificationsPage']>>>
    }
  }
  'settings.save_notifications': {
    methods: ["POST"]
    pattern: '/settings/notifications'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['saveNotifications']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['saveNotifications']>>>
    }
  }
  'settings.privacy_page': {
    methods: ["GET","HEAD"]
    pattern: '/settings/privacy'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['privacyPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['privacyPage']>>>
    }
  }
  'academics.student_grades_page': {
    methods: ["GET","HEAD"]
    pattern: '/academic/grades/student/:studentId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { studentId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['studentGradesPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['studentGradesPage']>>>
    }
  }
  'teachers.dashboard_page': {
    methods: ["GET","HEAD"]
    pattern: '/teacher/dashboard'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['dashboardPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['dashboardPage']>>>
    }
  }
  'teachers.classes_page': {
    methods: ["GET","HEAD"]
    pattern: '/teacher/classes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['classesPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['classesPage']>>>
    }
  }
  'teachers.class_show_page': {
    methods: ["GET","HEAD"]
    pattern: '/teacher/classes/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['classShowPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['classShowPage']>>>
    }
  }
  'teachers.class_students_page': {
    methods: ["GET","HEAD"]
    pattern: '/teacher/classes/:id/students'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['classStudentsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['classStudentsPage']>>>
    }
  }
  'teachers.assignments_page': {
    methods: ["GET","HEAD"]
    pattern: '/teacher/assignments'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['assignmentsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['assignmentsPage']>>>
    }
  }
  'teachers.assignment_create_page': {
    methods: ["GET","HEAD"]
    pattern: '/teacher/assignments/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['assignmentCreatePage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['assignmentCreatePage']>>>
    }
  }
  'teachers.store_assignment_web': {
    methods: ["POST"]
    pattern: '/teacher/assignments/create'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/teacher').createAssignmentValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/teacher').createAssignmentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['storeAssignmentWeb']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['storeAssignmentWeb']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'teachers.grade_submission_page': {
    methods: ["GET","HEAD"]
    pattern: '/teacher/assignments/submissions/:id/grade'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['gradeSubmissionPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['gradeSubmissionPage']>>>
    }
  }
  'teacher.assignments.submissions.grade.store': {
    methods: ["POST"]
    pattern: '/teacher/assignments/submissions/:id/grade'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/teacher').gradeSubmissionValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/teacher').gradeSubmissionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['gradeSubmissionWeb']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['gradeSubmissionWeb']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'teacher.assignments.submissions.grade.update': {
    methods: ["PUT"]
    pattern: '/teacher/assignments/submissions/:id/grade'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/teacher').gradeSubmissionValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/teacher').gradeSubmissionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['gradeSubmissionWeb']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['gradeSubmissionWeb']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'teachers.assignment_show_page': {
    methods: ["GET","HEAD"]
    pattern: '/teacher/assignments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['assignmentShowPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['assignmentShowPage']>>>
    }
  }
  'teachers.assignment_edit_page': {
    methods: ["GET","HEAD"]
    pattern: '/teacher/assignments/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['assignmentEditPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['assignmentEditPage']>>>
    }
  }
  'teacher.assignments.update.post': {
    methods: ["POST"]
    pattern: '/teacher/assignments/:id/update'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['updateAssignmentWeb']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['updateAssignmentWeb']>>>
    }
  }
  'teacher.assignments.update.put': {
    methods: ["PUT"]
    pattern: '/teacher/assignments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['updateAssignmentWeb']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['updateAssignmentWeb']>>>
    }
  }
  'teachers.publish_assignment': {
    methods: ["POST"]
    pattern: '/teacher/assignments/:id/publish'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['publishAssignment']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['publishAssignment']>>>
    }
  }
  'teachers.close_assignment': {
    methods: ["POST"]
    pattern: '/teacher/assignments/:id/close'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['closeAssignment']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['closeAssignment']>>>
    }
  }
  'teachers.remove_assignment_attachment': {
    methods: ["POST"]
    pattern: '/teacher/assignments/:id/remove-attachment'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['removeAssignmentAttachment']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['removeAssignmentAttachment']>>>
    }
  }
  'teachers.assignment_submissions_page': {
    methods: ["GET","HEAD"]
    pattern: '/teacher/assignments/:id/submissions'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['assignmentSubmissionsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['assignmentSubmissionsPage']>>>
    }
  }
  'teachers.attendance_index_page': {
    methods: ["GET","HEAD"]
    pattern: '/teacher/attendance'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['attendanceIndexPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['attendanceIndexPage']>>>
    }
  }
  'teachers.attendance_mark_page': {
    methods: ["GET","HEAD"]
    pattern: '/teacher/attendance/mark'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['attendanceMarkPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['attendanceMarkPage']>>>
    }
  }
  'teachers.attendance_report_page': {
    methods: ["GET","HEAD"]
    pattern: '/teacher/attendance/report'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['attendanceReportPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['attendanceReportPage']>>>
    }
  }
  'teachers.attendance_student_page': {
    methods: ["GET","HEAD"]
    pattern: '/teacher/attendance/student/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['attendanceStudentPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['attendanceStudentPage']>>>
    }
  }
  'teachers.grades_page': {
    methods: ["GET","HEAD"]
    pattern: '/teacher/grades'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['gradesPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['gradesPage']>>>
    }
  }
  'teachers.grade_add_page': {
    methods: ["GET","HEAD"]
    pattern: '/teacher/grades/add'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['gradeAddPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['gradeAddPage']>>>
    }
  }
  'teachers.store_grade_web': {
    methods: ["POST"]
    pattern: '/teacher/grades'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['storeGradeWeb']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['storeGradeWeb']>>>
    }
  }
  'teachers.grade_class_page': {
    methods: ["GET","HEAD"]
    pattern: '/teacher/grades/class/:classId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { classId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['gradeClassPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['gradeClassPage']>>>
    }
  }
  'teachers.grade_edit_page': {
    methods: ["GET","HEAD"]
    pattern: '/teacher/grades/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['gradeEditPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['gradeEditPage']>>>
    }
  }
  'teacher.grades.update': {
    methods: ["PUT"]
    pattern: '/teacher/grades/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['updateGradeWeb']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['updateGradeWeb']>>>
    }
  }
  'teacher.grades.delete': {
    methods: ["DELETE"]
    pattern: '/teacher/grades/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['deleteGradeWeb']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['deleteGradeWeb']>>>
    }
  }
  'forums.teacher_index': {
    methods: ["GET","HEAD"]
    pattern: '/teacher/forum'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['teacherIndex']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['teacherIndex']>>>
    }
  }
  'forums.teacher_create': {
    methods: ["GET","HEAD"]
    pattern: '/teacher/forum/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['teacherCreate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['teacherCreate']>>>
    }
  }
  'forums.store_teacher_topic': {
    methods: ["POST"]
    pattern: '/teacher/forum/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['storeTeacherTopic']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['storeTeacherTopic']>>>
    }
  }
  'forums.my_teacher_topics': {
    methods: ["GET","HEAD"]
    pattern: '/teacher/forum/my-topics'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['myTeacherTopics']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['myTeacherTopics']>>>
    }
  }
  'forums.teacher_topic': {
    methods: ["GET","HEAD"]
    pattern: '/teacher/forum/topic/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['teacherTopic']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['teacherTopic']>>>
    }
  }
  'forums.teacher_reply': {
    methods: ["POST"]
    pattern: '/teacher/forum/topic/:id/reply'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['teacherReply']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['teacherReply']>>>
    }
  }
  'teacher.forum.topic.update': {
    methods: ["PUT"]
    pattern: '/teacher/forum/topic/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['updateTopic']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['updateTopic']>>>
    }
  }
  'teacher.forum.topic.delete': {
    methods: ["DELETE"]
    pattern: '/teacher/forum/topic/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['deleteTopic']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['deleteTopic']>>>
    }
  }
  'teacher.forum.reply.update': {
    methods: ["PUT"]
    pattern: '/teacher/forum/reply/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['updateReply']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['updateReply']>>>
    }
  }
  'teacher.forum.reply.delete': {
    methods: ["DELETE"]
    pattern: '/teacher/forum/reply/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['deleteReply']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['deleteReply']>>>
    }
  }
  'forums.toggle_lock': {
    methods: ["POST"]
    pattern: '/teacher/forum/topic/:id/toggle-lock'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['toggleLock']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['toggleLock']>>>
    }
  }
  'forums.toggle_pin': {
    methods: ["POST"]
    pattern: '/teacher/forum/topic/:id/toggle-pin'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['togglePin']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['togglePin']>>>
    }
  }
  'students.assignments_page': {
    methods: ["GET","HEAD"]
    pattern: '/student/assignments'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['assignmentsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['assignmentsPage']>>>
    }
  }
  'student.assignments.submissions.index': {
    methods: ["GET","HEAD"]
    pattern: '/student/assignments/submissions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['submissionsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['submissionsPage']>>>
    }
  }
  'students.assignment_show_page': {
    methods: ["GET","HEAD"]
    pattern: '/student/assignments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['assignmentShowPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['assignmentShowPage']>>>
    }
  }
  'students.assignment_submit_page': {
    methods: ["GET","HEAD"]
    pattern: '/student/assignments/:id/submit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['assignmentSubmitPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['assignmentSubmitPage']>>>
    }
  }
  'students.submit_assignment_web': {
    methods: ["POST"]
    pattern: '/student/assignments/:id/submit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['submitAssignmentWeb']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['submitAssignmentWeb']>>>
    }
  }
  'student.assignments.submissions.legacy': {
    methods: ["GET","HEAD"]
    pattern: '/student/assignments/:id/submissions'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['submissionsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['submissionsPage']>>>
    }
  }
  'forums.student_index': {
    methods: ["GET","HEAD"]
    pattern: '/student/forum'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['studentIndex']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['studentIndex']>>>
    }
  }
  'forums.student_create': {
    methods: ["GET","HEAD"]
    pattern: '/student/forum/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['studentCreate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['studentCreate']>>>
    }
  }
  'forums.store_student_topic': {
    methods: ["POST"]
    pattern: '/student/forum/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['storeStudentTopic']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['storeStudentTopic']>>>
    }
  }
  'forums.my_student_questions': {
    methods: ["GET","HEAD"]
    pattern: '/student/forum/my-questions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['myStudentQuestions']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['myStudentQuestions']>>>
    }
  }
  'forums.student_topic': {
    methods: ["GET","HEAD"]
    pattern: '/student/forum/topic/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['studentTopic']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['studentTopic']>>>
    }
  }
  'forums.student_reply': {
    methods: ["POST"]
    pattern: '/student/forum/topic/:id/reply'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['studentReply']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['studentReply']>>>
    }
  }
  'student.forum.topic.update': {
    methods: ["PUT"]
    pattern: '/student/forum/topic/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['updateTopic']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['updateTopic']>>>
    }
  }
  'student.forum.topic.delete': {
    methods: ["DELETE"]
    pattern: '/student/forum/topic/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['deleteTopic']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['deleteTopic']>>>
    }
  }
  'student.forum.reply.update': {
    methods: ["PUT"]
    pattern: '/student/forum/reply/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['updateReply']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['updateReply']>>>
    }
  }
  'student.forum.reply.delete': {
    methods: ["DELETE"]
    pattern: '/student/forum/reply/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['deleteReply']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forums_controller').default['deleteReply']>>>
    }
  }
  'parents.dashboard_page': {
    methods: ["GET","HEAD"]
    pattern: '/parent/dashboard'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['dashboardPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['dashboardPage']>>>
    }
  }
  'parents.children_page': {
    methods: ["GET","HEAD"]
    pattern: '/parent/children'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['childrenPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['childrenPage']>>>
    }
  }
  'parents.child_show_page': {
    methods: ["GET","HEAD"]
    pattern: '/parent/children/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['childShowPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['childShowPage']>>>
    }
  }
  'parents.child_profile_page': {
    methods: ["GET","HEAD"]
    pattern: '/parent/children/:id/profile'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['childProfilePage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['childProfilePage']>>>
    }
  }
  'parents.grades_page': {
    methods: ["GET","HEAD"]
    pattern: '/parent/grades'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['gradesPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['gradesPage']>>>
    }
  }
  'parents.child_grades_details_page': {
    methods: ["GET","HEAD"]
    pattern: '/parent/grades/child/:studentId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { studentId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['childGradesDetailsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['childGradesDetailsPage']>>>
    }
  }
  'parent.grades.report_card': {
    methods: ["GET","HEAD"]
    pattern: '/parent/grades/report-card/:studentId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { studentId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['reportCardPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['reportCardPage']>>>
    }
  }
  'parent.report_card.child': {
    methods: ["GET","HEAD"]
    pattern: '/parent/report-card/child/:studentId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { studentId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['reportCardPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['reportCardPage']>>>
    }
  }
  'parents.discipline_page': {
    methods: ["GET","HEAD"]
    pattern: '/parent/discipline'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['disciplinePage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['disciplinePage']>>>
    }
  }
  'parent.discipline.details': {
    methods: ["GET","HEAD"]
    pattern: '/parent/discipline/details/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['disciplineDetailsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['disciplineDetailsPage']>>>
    }
  }
  'parent.discipline.details.alias': {
    methods: ["GET","HEAD"]
    pattern: '/parent/discipline/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['disciplineDetailsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['disciplineDetailsPage']>>>
    }
  }
  'parents.attendance_page': {
    methods: ["GET","HEAD"]
    pattern: '/parent/attendance'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['attendancePage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['attendancePage']>>>
    }
  }
  'parents.attendance_justify_page': {
    methods: ["GET","HEAD"]
    pattern: '/parent/attendance/justify'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['attendanceJustifyPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['attendanceJustifyPage']>>>
    }
  }
  'parent.attendance.justify.store': {
    methods: ["POST"]
    pattern: '/parent/attendance/justify'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['justifyAbsence']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['justifyAbsence']>>>
    }
  }
  'parents.payments_page': {
    methods: ["GET","HEAD"]
    pattern: '/parent/payments'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['paymentsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['paymentsPage']>>>
    }
  }
  'parents.payments_history_page': {
    methods: ["GET","HEAD"]
    pattern: '/parent/payments/history'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['paymentsHistoryPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['paymentsHistoryPage']>>>
    }
  }
  'parents.payments_status_page': {
    methods: ["GET","HEAD"]
    pattern: '/parent/payments/status'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['paymentsStatusPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['paymentsStatusPage']>>>
    }
  }
  'parents.parent_messages_page': {
    methods: ["GET","HEAD"]
    pattern: '/parent/messages'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['parentMessagesPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['parentMessagesPage']>>>
    }
  }
  'parents.parent_message_send_page': {
    methods: ["GET","HEAD"]
    pattern: '/parent/messages/send'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['parentMessageSendPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['parentMessageSendPage']>>>
    }
  }
  'parent.messages.send.store': {
    methods: ["POST"]
    pattern: '/parent/messages/send'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['sendParentMessage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['sendParentMessage']>>>
    }
  }
  'parents.parent_notifications_page': {
    methods: ["GET","HEAD"]
    pattern: '/parent/messages/notifications'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['parentNotificationsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['parentNotificationsPage']>>>
    }
  }
  'parents.parent_conversation_page': {
    methods: ["GET","HEAD"]
    pattern: '/parent/messages/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['parentConversationPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['parentConversationPage']>>>
    }
  }
  'parents.appointments_page': {
    methods: ["GET","HEAD"]
    pattern: '/parent/appointments'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['appointmentsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['appointmentsPage']>>>
    }
  }
  'parents.appointment_request_page': {
    methods: ["GET","HEAD"]
    pattern: '/parent/appointments/request'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['appointmentRequestPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['appointmentRequestPage']>>>
    }
  }
  'parents.request_appointment': {
    methods: ["POST"]
    pattern: '/parent/appointments/request'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['requestAppointment']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['requestAppointment']>>>
    }
  }
  'parent.appointments.reschedule': {
    methods: ["GET","HEAD"]
    pattern: '/parent/appointments/reschedule'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['appointmentRequestPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['appointmentRequestPage']>>>
    }
  }
  'parent.appointments.show.alias': {
    methods: ["GET","HEAD"]
    pattern: '/parent/appointments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['appointmentsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['appointmentsPage']>>>
    }
  }
  'parents.children_stats': {
    methods: ["GET","HEAD"]
    pattern: '/api/parent/children/stats'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['childrenStats']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['childrenStats']>>>
    }
  }
  'parents.export_grades': {
    methods: ["GET","HEAD"]
    pattern: '/api/parent/grades/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['exportGrades']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['exportGrades']>>>
    }
  }
  'parents.export_attendance': {
    methods: ["GET","HEAD"]
    pattern: '/api/parent/attendance/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['exportAttendance']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['exportAttendance']>>>
    }
  }
  'api.parent.payments.export': {
    methods: ["GET","HEAD"]
    pattern: '/api/parent/payments/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['exportPayments']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['exportPayments']>>>
    }
  }
  'api.parent.payments.history.export': {
    methods: ["GET","HEAD"]
    pattern: '/api/parent/payments/history/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['exportPayments']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['exportPayments']>>>
    }
  }
  'parents.appointment_schedule': {
    methods: ["GET","HEAD"]
    pattern: '/api/parent/appointments/schedule'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['appointmentSchedule']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['appointmentSchedule']>>>
    }
  }
  'parents.cancel_appointment': {
    methods: ["DELETE"]
    pattern: '/api/parent/appointments/:id/cancel'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['cancelAppointment']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['cancelAppointment']>>>
    }
  }
  'parents.export_appointments': {
    methods: ["GET","HEAD"]
    pattern: '/api/parent/appointments/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['exportAppointments']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['exportAppointments']>>>
    }
  }
  'parents.parent_conversation_data': {
    methods: ["GET","HEAD"]
    pattern: '/api/parent/messages/conversation/:userId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { userId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['parentConversationData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['parentConversationData']>>>
    }
  }
  'api.parent.messages.send': {
    methods: ["POST"]
    pattern: '/api/parent/messages/send'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['sendParentMessage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['sendParentMessage']>>>
    }
  }
  'parents.mark_conversation_read': {
    methods: ["POST"]
    pattern: '/api/parent/messages/mark-read/:userId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { userId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['markConversationRead']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['markConversationRead']>>>
    }
  }
  'parents.mark_all_parent_messages_read': {
    methods: ["POST"]
    pattern: '/api/parent/messages/mark-all-read'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['markAllParentMessagesRead']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['markAllParentMessagesRead']>>>
    }
  }
  'parents.respond_to_incident': {
    methods: ["POST"]
    pattern: '/api/parent/discipline/:id/respond'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['respondToIncident']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['respondToIncident']>>>
    }
  }
  'parents.mark_notification_read': {
    methods: ["POST"]
    pattern: '/api/parent/notifications/:id/read'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['markNotificationRead']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['markNotificationRead']>>>
    }
  }
  'parents.mark_all_notifications_read': {
    methods: ["POST"]
    pattern: '/api/parent/notifications/mark-all-read'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['markAllNotificationsRead']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['markAllNotificationsRead']>>>
    }
  }
  'parents.delete_all_notifications': {
    methods: ["DELETE"]
    pattern: '/api/parent/notifications/delete-all'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['deleteAllNotifications']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['deleteAllNotifications']>>>
    }
  }
  'parents.parent_unread_count': {
    methods: ["GET","HEAD"]
    pattern: '/api/parent/unread-count'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['parentUnreadCount']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['parentUnreadCount']>>>
    }
  }
  'inter_school.search_page': {
    methods: ["GET","HEAD"]
    pattern: '/inter-school/search'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['searchPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['searchPage']>>>
    }
  }
  'inter_school.search_results_page': {
    methods: ["GET","HEAD"]
    pattern: '/inter-school/search/results'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['searchResultsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['searchResultsPage']>>>
    }
  }
  'inter_school.school_public_page': {
    methods: ["GET","HEAD"]
    pattern: '/inter-school/schools/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['schoolPublicPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['schoolPublicPage']>>>
    }
  }
  'inter_school.contact_school': {
    methods: ["GET","HEAD"]
    pattern: '/inter-school/contact'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['contactSchool']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['contactSchool']>>>
    }
  }
  'inter_school.events_page': {
    methods: ["GET","HEAD"]
    pattern: '/inter-school/events'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['eventsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['eventsPage']>>>
    }
  }
  'inter_school.event_create_page': {
    methods: ["GET","HEAD"]
    pattern: '/inter-school/events/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['eventCreatePage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['eventCreatePage']>>>
    }
  }
  'inter_school.store_event_web': {
    methods: ["POST"]
    pattern: '/inter-school/events/create'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/inter_school').createEventValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/inter_school').createEventValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['storeEventWeb']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['storeEventWeb']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'inter_school.my_events_page': {
    methods: ["GET","HEAD"]
    pattern: '/inter-school/events/my-events'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['myEventsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['myEventsPage']>>>
    }
  }
  'inter-school.events.show': {
    methods: ["GET","HEAD"]
    pattern: '/inter-school/events/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['eventShowPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['eventShowPage']>>>
    }
  }
  'inter-school.events.show.alias': {
    methods: ["GET","HEAD"]
    pattern: '/inter-school/events/:id/show'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['eventShowPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['eventShowPage']>>>
    }
  }
  'inter-school.events.edit.alias': {
    methods: ["GET","HEAD"]
    pattern: '/inter-school/events/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['eventShowPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['eventShowPage']>>>
    }
  }
  'inter_school.event_register_page': {
    methods: ["GET","HEAD"]
    pattern: '/inter-school/events/:id/register'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['eventRegisterPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['eventRegisterPage']>>>
    }
  }
  'inter_school.register_event_web': {
    methods: ["POST"]
    pattern: '/inter-school/events/:id/register'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['registerEventWeb']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['registerEventWeb']>>>
    }
  }
  'inter_school.cancel_event': {
    methods: ["POST"]
    pattern: '/inter-school/events/:id/cancel'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['cancelEvent']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['cancelEvent']>>>
    }
  }
  'inter_school.exchanges_page': {
    methods: ["GET","HEAD"]
    pattern: '/inter-school/exchanges'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['exchangesPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['exchangesPage']>>>
    }
  }
  'inter_school.exchange_start_page': {
    methods: ["GET","HEAD"]
    pattern: '/inter-school/exchanges/start'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['exchangeStartPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['exchangeStartPage']>>>
    }
  }
  'inter_school.store_exchange_web': {
    methods: ["POST"]
    pattern: '/inter-school/exchanges/start'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/inter_school').startExchangeValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/inter_school').startExchangeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['storeExchangeWeb']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['storeExchangeWeb']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'inter-school.exchanges.show': {
    methods: ["GET","HEAD"]
    pattern: '/inter-school/exchanges/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['exchangeShowPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['exchangeShowPage']>>>
    }
  }
  'inter-school.exchanges.show.alias': {
    methods: ["GET","HEAD"]
    pattern: '/inter-school/exchanges/:id/show'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['exchangeShowPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['exchangeShowPage']>>>
    }
  }
  'inter_school.exchange_messages_page': {
    methods: ["GET","HEAD"]
    pattern: '/inter-school/exchanges/:id/messages'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['exchangeMessagesPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['exchangeMessagesPage']>>>
    }
  }
  'inter_school.best_practices_page': {
    methods: ["GET","HEAD"]
    pattern: '/inter-school/best-practices'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['bestPracticesPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['bestPracticesPage']>>>
    }
  }
  'inter_school.best_practice_categories_page': {
    methods: ["GET","HEAD"]
    pattern: '/inter-school/best-practices/categories'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['bestPracticeCategoriesPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['bestPracticeCategoriesPage']>>>
    }
  }
  'inter_school.best_practice_share_page': {
    methods: ["GET","HEAD"]
    pattern: '/inter-school/best-practices/share'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['bestPracticeSharePage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['bestPracticeSharePage']>>>
    }
  }
  'inter_school.store_best_practice_web': {
    methods: ["POST"]
    pattern: '/inter-school/best-practices/share'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/inter_school').shareBestPracticeValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/inter_school').shareBestPracticeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['storeBestPracticeWeb']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['storeBestPracticeWeb']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'inter-school.best-practices.show': {
    methods: ["GET","HEAD"]
    pattern: '/inter-school/best-practices/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['bestPracticeShowPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['bestPracticeShowPage']>>>
    }
  }
  'inter-school.best-practices.show.alias': {
    methods: ["GET","HEAD"]
    pattern: '/inter-school/best-practices/:id/show'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['bestPracticeShowPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['bestPracticeShowPage']>>>
    }
  }
  'inter_school.save_school': {
    methods: ["POST"]
    pattern: '/api/inter-school/save-school'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['saveSchool']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['saveSchool']>>>
    }
  }
  'inter_school.get_school_public_info': {
    methods: ["GET","HEAD"]
    pattern: '/api/inter-school/schools/:id/info'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['getSchoolPublicInfo']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['getSchoolPublicInfo']>>>
    }
  }
  'inter_school.export_search': {
    methods: ["GET","HEAD"]
    pattern: '/api/inter-school/search/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['exportSearch']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['exportSearch']>>>
    }
  }
  'inter_school.calendar_events': {
    methods: ["GET","HEAD"]
    pattern: '/api/inter-school/events/calendar'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['calendarEvents']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['calendarEvents']>>>
    }
  }
  'inter_school.export_events': {
    methods: ["GET","HEAD"]
    pattern: '/api/inter-school/events/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['exportEvents']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['exportEvents']>>>
    }
  }
  'inter_school.cancel_registration': {
    methods: ["POST"]
    pattern: '/api/inter-school/events/registrations/:id/cancel'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['cancelRegistration']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['cancelRegistration']>>>
    }
  }
  'inter_school.export_exchanges': {
    methods: ["GET","HEAD"]
    pattern: '/api/inter-school/exchanges/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['exportExchanges']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['exportExchanges']>>>
    }
  }
  'inter_school.accept_exchange': {
    methods: ["POST"]
    pattern: '/api/inter-school/exchanges/:id/accept'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['acceptExchange']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['acceptExchange']>>>
    }
  }
  'inter_school.decline_exchange': {
    methods: ["POST"]
    pattern: '/api/inter-school/exchanges/:id/decline'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['declineExchange']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['declineExchange']>>>
    }
  }
  'inter_school.complete_exchange': {
    methods: ["POST"]
    pattern: '/api/inter-school/exchanges/:id/complete'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['completeExchange']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['completeExchange']>>>
    }
  }
  'inter_school.exchange_messages': {
    methods: ["GET","HEAD"]
    pattern: '/api/inter-school/exchanges/:id/messages'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['exchangeMessages']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['exchangeMessages']>>>
    }
  }
  'inter_school.send_exchange_message': {
    methods: ["POST"]
    pattern: '/api/inter-school/exchanges/:id/send'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['sendExchangeMessage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['sendExchangeMessage']>>>
    }
  }
  'inter_school.export_exchange_messages': {
    methods: ["GET","HEAD"]
    pattern: '/api/inter-school/exchanges/:id/messages/export'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['exportExchangeMessages']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['exportExchangeMessages']>>>
    }
  }
  'inter_school.export_best_practices': {
    methods: ["GET","HEAD"]
    pattern: '/api/inter-school/best-practices/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['exportBestPractices']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['exportBestPractices']>>>
    }
  }
  'inter_school.like_best_practice': {
    methods: ["POST"]
    pattern: '/api/inter-school/best-practices/:id/like'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['likeBestPractice']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['likeBestPractice']>>>
    }
  }
  'inter_school.comment_best_practice': {
    methods: ["POST"]
    pattern: '/api/inter-school/best-practices/:id/comment'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['commentBestPractice']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['commentBestPractice']>>>
    }
  }
  'reports.academic_performance_data': {
    methods: ["GET","HEAD"]
    pattern: '/api/reports/academic/performance'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['academicPerformanceData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['academicPerformanceData']>>>
    }
  }
  'api.reports.academic.performance.export': {
    methods: ["GET","HEAD"]
    pattern: '/api/reports/academic/performance/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportData']>>>
    }
  }
  'api.reports.academic.class.export': {
    methods: ["GET","HEAD"]
    pattern: '/api/reports/academic/class/:id/export'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportData']>>>
    }
  }
  'api.reports.academic.student.export': {
    methods: ["GET","HEAD"]
    pattern: '/api/reports/academic/student/:id/export'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportData']>>>
    }
  }
  'api.reports.academic.subject.export': {
    methods: ["GET","HEAD"]
    pattern: '/api/reports/academic/subject/:id/export'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportData']>>>
    }
  }
  'reports.financial_income_data': {
    methods: ["GET","HEAD"]
    pattern: '/api/reports/financial/income'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['financialIncomeData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['financialIncomeData']>>>
    }
  }
  'api.reports.financial.income.export': {
    methods: ["GET","HEAD"]
    pattern: '/api/reports/financial/income/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportData']>>>
    }
  }
  'reports.financial_expenses_data': {
    methods: ["GET","HEAD"]
    pattern: '/api/reports/financial/expenses'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['financialExpensesData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['financialExpensesData']>>>
    }
  }
  'api.reports.financial.expenses.export': {
    methods: ["GET","HEAD"]
    pattern: '/api/reports/financial/expenses/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportData']>>>
    }
  }
  'reports.financial_balance_data': {
    methods: ["GET","HEAD"]
    pattern: '/api/reports/financial/balance'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['financialBalanceData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['financialBalanceData']>>>
    }
  }
  'api.reports.financial.balance.export': {
    methods: ["GET","HEAD"]
    pattern: '/api/reports/financial/balance/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportData']>>>
    }
  }
  'reports.financial_forecasts_data': {
    methods: ["GET","HEAD"]
    pattern: '/api/reports/financial/forecasts'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['financialForecastsData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['financialForecastsData']>>>
    }
  }
  'api.reports.financial.forecasts.export': {
    methods: ["GET","HEAD"]
    pattern: '/api/reports/financial/forecasts/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportData']>>>
    }
  }
  'reports.disciplinary_summary_data': {
    methods: ["GET","HEAD"]
    pattern: '/api/reports/disciplinary/summary'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['disciplinarySummaryData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['disciplinarySummaryData']>>>
    }
  }
  'api.reports.disciplinary.summary.export': {
    methods: ["GET","HEAD"]
    pattern: '/api/reports/disciplinary/summary/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportData']>>>
    }
  }
  'reports.disciplinary_trends_data': {
    methods: ["GET","HEAD"]
    pattern: '/api/reports/disciplinary/trends'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['disciplinaryTrendsData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['disciplinaryTrendsData']>>>
    }
  }
  'api.reports.disciplinary.trends.export': {
    methods: ["GET","HEAD"]
    pattern: '/api/reports/disciplinary/trends/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportData']>>>
    }
  }
  'reports.disciplinary_comparisons_data': {
    methods: ["GET","HEAD"]
    pattern: '/api/reports/disciplinary/comparisons'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['disciplinaryComparisonsData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['disciplinaryComparisonsData']>>>
    }
  }
  'api.reports.disciplinary.comparisons.export': {
    methods: ["GET","HEAD"]
    pattern: '/api/reports/disciplinary/comparisons/export'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportData']>>>
    }
  }
  'reports.delete_export': {
    methods: ["DELETE"]
    pattern: '/api/reports/exports/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['deleteExport']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['deleteExport']>>>
    }
  }
  'reports.academic_class_page': {
    methods: ["GET","HEAD"]
    pattern: '/reports/academic/class'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['academicClassPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['academicClassPage']>>>
    }
  }
  'reports.academic_performance_page': {
    methods: ["GET","HEAD"]
    pattern: '/reports/academic/performance'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['academicPerformancePage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['academicPerformancePage']>>>
    }
  }
  'reports.academic_school_page': {
    methods: ["GET","HEAD"]
    pattern: '/reports/academic/school'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['academicSchoolPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['academicSchoolPage']>>>
    }
  }
  'reports.student_progress_page': {
    methods: ["GET","HEAD"]
    pattern: '/reports/academic/student-progress'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['studentProgressPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['studentProgressPage']>>>
    }
  }
  'reports.subject_report_page': {
    methods: ["GET","HEAD"]
    pattern: '/reports/academic/subject'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['subjectReportPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['subjectReportPage']>>>
    }
  }
  'reports.exports_page': {
    methods: ["GET","HEAD"]
    pattern: '/reports/exports'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportsPage']>>>
    }
  }
  'reports.exports_generate_page': {
    methods: ["GET","HEAD"]
    pattern: '/reports/exports/generate'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportsGeneratePage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportsGeneratePage']>>>
    }
  }
  'reports.generate_export': {
    methods: ["POST"]
    pattern: '/reports/exports/generate'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['generateExport']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['generateExport']>>>
    }
  }
  'reports.exports_downloads_page': {
    methods: ["GET","HEAD"]
    pattern: '/reports/exports/downloads'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportsDownloadsPage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['exportsDownloadsPage']>>>
    }
  }
  'reports.download_export': {
    methods: ["GET","HEAD"]
    pattern: '/reports/exports/download/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['downloadExport']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reports_controller').default['downloadExport']>>>
    }
  }
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
  'auth.request_otp': {
    methods: ["POST"]
    pattern: '/api/v1/auth/otp/request'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth').requestOtpValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').requestOtpValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['requestOtp']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['requestOtp']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.verify_otp': {
    methods: ["POST"]
    pattern: '/api/v1/auth/otp/verify'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth').verifyOtpValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').verifyOtpValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['verifyOtp']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['verifyOtp']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.forgot_password': {
    methods: ["POST"]
    pattern: '/api/v1/forgot-password'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth').forgotPasswordValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').forgotPasswordValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['forgotPassword']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['forgotPassword']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.reset_password': {
    methods: ["POST"]
    pattern: '/api/v1/reset-password'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth').resetPasswordValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').resetPasswordValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['resetPassword']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['resetPassword']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'transfers.verify_authorization': {
    methods: ["POST"]
    pattern: '/api/v1/verify-transfer'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/transfer').verifyAuthorizationValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/transfer').verifyAuthorizationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['verifyAuthorization']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['verifyAuthorization']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/inspection').getSchoolsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['getAllSchools']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['getAllSchools']>>> | { status: 422; response: { errors: SimpleError[] } }
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
  'inspections.inspect_school': {
    methods: ["POST"]
    pattern: '/api/v1/inspection/schools/inspect'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/inspection').inspectSchoolValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/inspection').inspectSchoolValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['inspectSchool']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['inspectSchool']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.generate_school_credentials': {
    methods: ["POST"]
    pattern: '/api/v1/inspection/schools/generate-credentials/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['generateSchoolCredentials']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['generateSchoolCredentials']>>>
    }
  }
  'inspections.send_global_communication': {
    methods: ["POST"]
    pattern: '/api/v1/inspection/communications/global'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/inspection').sendGlobalCommunicationValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/inspection').sendGlobalCommunicationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['sendGlobalCommunication']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['sendGlobalCommunication']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'inspection.send_school_communication': {
    methods: ["POST"]
    pattern: '/api/v1/inspection/communications/school'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/message').sendSchoolCommunicationValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/message').sendSchoolCommunicationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['sendSchoolCommunication']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['sendSchoolCommunication']>>> | { status: 422; response: { errors: SimpleError[] } }
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
  'inspections.generate_school_report': {
    methods: ["POST"]
    pattern: '/api/v1/inspection/reports/school'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/inspection').generateSchoolReportValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/inspection').generateSchoolReportValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['generateSchoolReport']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inspections_controller').default['generateSchoolReport']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      body: ExtractBody<InferInput<(typeof import('#validators/academic').createClassValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/academic').createClassValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['createClass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['createClass']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'academics.get_class_by_id': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/school/classes/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getClassById']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getClassById']>>>
    }
  }
  'academics.update_class': {
    methods: ["PUT"]
    pattern: '/api/v1/school/classes/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/academic').updateClassValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/academic').updateClassValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['updateClass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['updateClass']>>> | { status: 422; response: { errors: SimpleError[] } }
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
  'academics.create_subject': {
    methods: ["POST"]
    pattern: '/api/v1/school/subjects'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/academic').createSubjectValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/academic').createSubjectValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['createSubject']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['createSubject']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'academics.update_subject': {
    methods: ["PUT"]
    pattern: '/api/v1/school/subjects/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['updateSubject']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['updateSubject']>>>
    }
  }
  'academics.delete_subject': {
    methods: ["DELETE"]
    pattern: '/api/v1/school/subjects/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['deleteSubject']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['deleteSubject']>>>
    }
  }
  'academics.get_class_subjects': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/school/classes/:classId/subjects'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { classId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getClassSubjects']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getClassSubjects']>>>
    }
  }
  'academics.add_subject_to_class': {
    methods: ["POST"]
    pattern: '/api/v1/school/classes/:classId/subjects'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { classId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['addSubjectToClass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['addSubjectToClass']>>>
    }
  }
  'academics.remove_subject_from_class': {
    methods: ["DELETE"]
    pattern: '/api/v1/school/classes/:classId/subjects/:subjectId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { classId: ParamValue; subjectId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['removeSubjectFromClass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['removeSubjectFromClass']>>>
    }
  }
  'academics.get_grades_by_class': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/school/classes/:classId/grades'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { classId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getGradesByClass']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getGradesByClass']>>>
    }
  }
  'academics.get_grades_by_student': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/school/students/:studentId/grades'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { studentId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getGradesByStudent']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getGradesByStudent']>>>
    }
  }
  'academics.add_grade': {
    methods: ["POST"]
    pattern: '/api/v1/school/grades'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/academic').addGradeValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/academic').addGradeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['addGrade']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['addGrade']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'academics.update_grade': {
    methods: ["PUT"]
    pattern: '/api/v1/school/grades/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/academic').updateGradeValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/academic').updateGradeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['updateGrade']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['updateGrade']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'academics.delete_grade': {
    methods: ["DELETE"]
    pattern: '/api/v1/school/grades/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['deleteGrade']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['deleteGrade']>>>
    }
  }
  'academics.publish_grades': {
    methods: ["POST"]
    pattern: '/api/v1/school/grades/publish'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['publishGrades']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['publishGrades']>>>
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
  'transfers.request_transfer': {
    methods: ["POST"]
    pattern: '/api/v1/school/transfers/request'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/transfer').requestTransferValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/transfer').requestTransferValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['requestTransfer']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['requestTransfer']>>> | { status: 422; response: { errors: SimpleError[] } }
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
    pattern: '/api/v1/school/transfers/approve'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/transfer').approveTransferValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/transfer').approveTransferValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['approveTransfer']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['approveTransfer']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'transfers.reject_transfer': {
    methods: ["POST"]
    pattern: '/api/v1/school/transfers/reject'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/transfer').rejectTransferValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/transfer').rejectTransferValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['rejectTransfer']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['rejectTransfer']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'transfers.complete_transfer': {
    methods: ["POST"]
    pattern: '/api/v1/school/transfers/:id/complete'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['completeTransfer']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['completeTransfer']>>>
    }
  }
  'academics.get_academic_stats': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/school/stats/academic'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getAcademicStats']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getAcademicStats']>>>
    }
  }
  'academics.get_progress_stats': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/school/stats/progress'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getProgressStats']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/academics_controller').default['getProgressStats']>>>
    }
  }
  'pedagogicals.generate_report_card': {
    methods: ["POST"]
    pattern: '/api/v1/pedagogical/report-cards/student'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/pedagogical').generateReportCardValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/pedagogical').generateReportCardValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['generateReportCard']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['generateReportCard']>>> | { status: 422; response: { errors: SimpleError[] } }
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
  'pedagogicals.create_timetable': {
    methods: ["POST"]
    pattern: '/api/v1/pedagogical/timetable'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['createTimetable']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['createTimetable']>>>
    }
  }
  'pedagogicals.publish_grades': {
    methods: ["POST"]
    pattern: '/api/v1/pedagogical/grades/publish'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/pedagogical').publishGradesValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/pedagogical').publishGradesValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['publishGrades']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['publishGrades']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'pedagogicals.create_academic_calendar': {
    methods: ["POST"]
    pattern: '/api/v1/pedagogical/calendar'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/pedagogical').createAcademicCalendarValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/pedagogical').createAcademicCalendarValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['createAcademicCalendar']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['createAcademicCalendar']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'pedagogicals.create_exam_schedule': {
    methods: ["POST"]
    pattern: '/api/v1/pedagogical/exam-schedules'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/pedagogical').createExamScheduleValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/pedagogical').createExamScheduleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['createExamSchedule']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['createExamSchedule']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'pedagogicals.get_student_progress': {
    methods: ["POST"]
    pattern: '/api/v1/pedagogical/students/progress'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/pedagogical').getStudentProgressValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/pedagogical').getStudentProgressValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['getStudentProgress']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pedagogicals_controller').default['getStudentProgress']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      body: ExtractBody<InferInput<(typeof import('#validators/financial').setSchoolFeesValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/financial').setSchoolFeesValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['setFees']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['setFees']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'financials.update_fees': {
    methods: ["PUT"]
    pattern: '/api/v1/financial/fees/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/financial').updateFeesValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/financial').updateFeesValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['updateFees']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['updateFees']>>> | { status: 422; response: { errors: SimpleError[] } }
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
  'financials.record_payment': {
    methods: ["POST"]
    pattern: '/api/v1/financial/payments'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/financial').recordPaymentValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/financial').recordPaymentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['recordPayment']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/financials_controller').default['recordPayment']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      body: ExtractBody<InferInput<(typeof import('#validators/teacher').createAssignmentValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/teacher').createAssignmentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['createAssignment']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['createAssignment']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'teachers.grade_submission': {
    methods: ["POST"]
    pattern: '/api/v1/teacher/assignments/submissions/:id/grade'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/teacher').gradeSubmissionValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/teacher').gradeSubmissionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['gradeSubmission']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['gradeSubmission']>>> | { status: 422; response: { errors: SimpleError[] } }
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
  'teachers.get_class_students_for_attendance': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/teacher/classes/:id/students'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['getClassStudentsForAttendance']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['getClassStudentsForAttendance']>>>
    }
  }
  'teachers.get_class_attendance': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/teacher/attendance/class/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['getClassAttendance']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['getClassAttendance']>>>
    }
  }
  'teachers.mark_attendance': {
    methods: ["POST"]
    pattern: '/api/v1/teacher/attendance'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/teacher').markAttendanceValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/teacher').markAttendanceValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['markAttendance']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/teachers_controller').default['markAttendance']>>> | { status: 422; response: { errors: SimpleError[] } }
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
  'parents.send_message_to_teacher': {
    methods: ["POST"]
    pattern: '/api/v1/parent/messages/teacher'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/parent').sendMessageToTeacherValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/parent').sendMessageToTeacherValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['sendMessageToTeacher']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['sendMessageToTeacher']>>> | { status: 422; response: { errors: SimpleError[] } }
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
  'parents.get_child_attendance': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/parent/attendance/:studentId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { studentId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['getChildAttendance']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['getChildAttendance']>>>
    }
  }
  'parents.justify_absence': {
    methods: ["POST"]
    pattern: '/api/v1/parent/absence/justify'
    types: {
      body: {}
      paramsTuple: []
      params: {}
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
  'students.submit_assignment': {
    methods: ["POST"]
    pattern: '/api/v1/student/assignments/submit'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/student').submitAssignmentValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/student').submitAssignmentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['submitAssignment']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['submitAssignment']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      body: ExtractBody<InferInput<(typeof import('#validators/student').postForumQuestionValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/student').postForumQuestionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['postForumQuestion']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['postForumQuestion']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'students.send_message_to_teacher': {
    methods: ["POST"]
    pattern: '/api/v1/student/messages/teacher'
    types: {
      body: {}
      paramsTuple: []
      params: {}
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
  'students.request_transfer': {
    methods: ["POST"]
    pattern: '/api/v1/student/transfers/request'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/students_controller').default['requestTransfer']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/students_controller').default['requestTransfer']>>>
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
  'disciplines.report_incident': {
    methods: ["POST"]
    pattern: '/api/v1/discipline/incidents'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/discipline').reportIncidentValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/discipline').reportIncidentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['reportIncident']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['reportIncident']>>> | { status: 422; response: { errors: SimpleError[] } }
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
  'disciplines.apply_sanction': {
    methods: ["POST"]
    pattern: '/api/v1/discipline/sanctions'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/discipline').applySanctionValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/discipline').applySanctionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['applySanction']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['applySanction']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'disciplines.notify_parent': {
    methods: ["POST"]
    pattern: '/api/v1/discipline/notify-parent'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/discipline').notifyParentValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/discipline').notifyParentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['notifyParent']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/disciplines_controller').default['notifyParent']>>> | { status: 422; response: { errors: SimpleError[] } }
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
  'messages.send_message': {
    methods: ["POST"]
    pattern: '/api/v1/communication/messages/send'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/message').sendMessageValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/message').sendMessageValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['sendMessage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['sendMessage']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'messages.mark_as_read': {
    methods: ["PUT"]
    pattern: '/api/v1/communication/messages/read'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['markAsRead']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['markAsRead']>>>
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
  'communication.send_global_communication': {
    methods: ["POST"]
    pattern: '/api/v1/communication/communications/global'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/message').sendGlobalCommunicationValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/message').sendGlobalCommunicationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['sendGlobalCommunication']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['sendGlobalCommunication']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'communication.send_school_communication': {
    methods: ["POST"]
    pattern: '/api/v1/communication/communications/school'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/message').sendSchoolCommunicationValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/message').sendSchoolCommunicationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['sendSchoolCommunication']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/messages_controller').default['sendSchoolCommunication']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'inter_schools.search_schools': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/inter-school/search'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/inter_school').searchSchoolsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['searchSchools']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['searchSchools']>>> | { status: 422; response: { errors: SimpleError[] } }
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
  'inter_schools.start_exchange': {
    methods: ["POST"]
    pattern: '/api/v1/inter-school/exchanges'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/inter_school').startExchangeValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/inter_school').startExchangeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['startExchange']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['startExchange']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      body: ExtractBody<InferInput<(typeof import('#validators/inter_school').shareBestPracticeValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/inter_school').shareBestPracticeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['shareBestPractice']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['shareBestPractice']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      body: ExtractBody<InferInput<(typeof import('#validators/inter_school').createEventValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/inter_school').createEventValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['createEvent']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['createEvent']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'inter_schools.join_event': {
    methods: ["POST"]
    pattern: '/api/v1/inter-school/events/join'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/inter_school').joinEventValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/inter_school').joinEventValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['joinEvent']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inter_schools_controller').default['joinEvent']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.get_users': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['getUsers']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['getUsers']>>>
    }
  }
  'admin.create_user': {
    methods: ["POST"]
    pattern: '/api/v1/admin/users'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin').createUserValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/admin').createUserValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['createUser']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['createUser']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.update_user': {
    methods: ["PUT"]
    pattern: '/api/v1/admin/users/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin').updateUserValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/admin').updateUserValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['updateUser']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['updateUser']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.delete_user': {
    methods: ["DELETE"]
    pattern: '/api/v1/admin/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['deleteUser']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['deleteUser']>>>
    }
  }
  'admin.activate_user': {
    methods: ["POST"]
    pattern: '/api/v1/admin/users/:id/activate'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['activateUser']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['activateUser']>>>
    }
  }
  'admin.suspend_user': {
    methods: ["POST"]
    pattern: '/api/v1/admin/users/:id/suspend'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin').suspendAccountValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/admin').suspendAccountValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['suspendUser']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['suspendUser']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.get_roles': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/roles'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['getRoles']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['getRoles']>>>
    }
  }
  'admin.create_role': {
    methods: ["POST"]
    pattern: '/api/v1/admin/roles'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin').createRoleValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/admin').createRoleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['createRole']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['createRole']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.update_role': {
    methods: ["PUT"]
    pattern: '/api/v1/admin/roles/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin').updateRoleValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/admin').updateRoleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['updateRole']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['updateRole']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.get_system_logs': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/logs'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/admin').getSystemLogsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['getSystemLogs']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['getSystemLogs']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.get_user_activity_logs': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/admin/logs/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['getUserActivityLogs']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['getUserActivityLogs']>>>
    }
  }
}
