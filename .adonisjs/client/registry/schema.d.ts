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
  'settings.general': {
    methods: ["GET","HEAD"]
    pattern: '/settings/general'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
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
      response: unknown
      errorResponse: unknown
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
  'profile.preferences.save': {
    methods: ["POST"]
    pattern: '/profile/preferences'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['savePreferences']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['savePreferences']>>>
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
  'auth.save_language': {
    methods: ["POST"]
    pattern: '/api/settings/language'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['saveLanguage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['saveLanguage']>>>
    }
  }
  'auth.save_regional': {
    methods: ["POST"]
    pattern: '/api/settings/regional'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['saveRegional']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['saveRegional']>>>
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
      response: unknown
      errorResponse: unknown
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
      response: unknown
      errorResponse: unknown
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
      response: unknown
      errorResponse: unknown
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
      response: unknown
      errorResponse: unknown
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
      response: unknown
      errorResponse: unknown
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
  'parents.justify_absence': {
    methods: ["POST"]
    pattern: '/api/v1/parent/absence/justify'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/parent').justifyAbsenceValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/parent').justifyAbsenceValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['justifyAbsence']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/parents_controller').default['justifyAbsence']>>> | { status: 422; response: { errors: SimpleError[] } }
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
