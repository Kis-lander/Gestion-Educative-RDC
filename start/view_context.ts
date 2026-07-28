import { type HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import Class from '#models/class'
import Student from '#models/student'
import Teacher from '#models/teacher'
import Subject from '#models/subject'
import User from '#models/user'
import { resolveAppLanguage } from '#services/language_service'
import {
  getGovernanceContext,
  navigationPolicyFor,
  type NavigationPolicy,
} from '#services/school_governance_service'
import { getSubjectCodesForSection } from '#services/national_subject_catalog'
import {
  SECTION_EVALUATION_POLICIES,
  allEvaluationPeriodOptions,
  allEvaluationTypeOptions,
  evaluationPeriodLabel,
  evaluationPolicyForClass,
} from '#services/academic_evaluation_service'

export async function edgePageContext(
  { auth, request, session }: Pick<HttpContext, 'auth' | 'request' | 'session'>,
  overrides: Record<string, any> = {}
) {
  const user = auth.user
  const appLanguage = await resolveAppLanguage({ auth, session })
  const school = {
    id: user?.schoolId || null,
    name: 'Gestion Éducative RDC',
  }
  const currentYear = DateTime.now().year
  let selectedTerm = String(request.input('term', ''))
  let selectedTermLabel = evaluationPeriodLabel(selectedTerm || 'T1-P1')

  let classes: any[] = []
  let students: any[] = []
  let teachers: any[] = []
  let subjects: any[] = []
  let users: any[] = []
  let navigation: NavigationPolicy = navigationPolicyFor(user?.role || null)
  let governance: any = null

  if (user?.schoolId) {
    try {
      governance = await getGovernanceContext(user)
      navigation = governance.navigation
    } catch {}

    try {
      classes = await Class.query()
        .where('schoolId', user.schoolId)
        .whereNull('archivedAt')
        .if(governance && !governance.canManageAllSections, (query) =>
          query.where('schoolSectionId', governance.sectionId)
        )
        .orderBy('gradeLevel', 'asc')
        .orderBy('name', 'asc')
    } catch {}

    try {
      students = await Student.query()
        .where('schoolId', user.schoolId)
        .if(governance && !governance.canManageAllSections, (query) =>
          query.whereHas('class', (classQuery) =>
            classQuery.where('schoolSectionId', governance.sectionId)
          )
        )
        .preload('user')
        .preload('class')
        .orderBy('createdAt', 'desc')
        .limit(50)
    } catch {}

    try {
      teachers = await Teacher.query()
        .where('schoolId', user.schoolId)
        .preload('user')
        .orderBy('createdAt', 'desc')
        .limit(50)
    } catch {}
  }

  try {
    subjects = await Subject.query().orderBy('name', 'asc').limit(100)
    const allowedSubjectCodes =
      governance && !governance.canManageAllSections
        ? getSubjectCodesForSection(governance.sectionCode)
        : null
    if (allowedSubjectCodes) {
      subjects = subjects.filter((subject) => subject.code && allowedSubjectCodes.includes(subject.code))
    }
  } catch {}

  try {
    users = await User.query().orderBy('createdAt', 'desc').limit(50)
  } catch {}

  const sectionIds = Array.from(
    new Set(classes.map((classObj) => classObj.schoolSectionId).filter(Boolean))
  ) as string[]
  const sections = sectionIds.length
    ? await db.from('school_sections').whereIn('id', sectionIds).select('id', 'code')
    : []
  const sectionCodeById = new Map(sections.map((section) => [String(section.id), section.code]))

  const classEvaluationPolicies = Object.fromEntries(
    classes.map((classObj) => [
      classObj.id,
      evaluationPolicyForClass(
        sectionCodeById.get(String(classObj.schoolSectionId || '')),
        classObj.gradeLevel
      ),
    ])
  )

  const firstClass = classes[0] || {
    id: '',
    name: 'Classe non sélectionnée',
    level: '',
    students: [],
  }
  const firstStudent = students[0] || {
    id: '',
    name: user?.fullName || 'Élève',
    user,
    class: firstClass,
    registrationNumber: '-',
  }
  const studentClass = firstStudent.class || firstClass
  const studentEvaluationPolicy =
    classEvaluationPolicies[studentClass.id] ||
    evaluationPolicyForClass(undefined, studentClass.gradeLevel)
  if (!selectedTerm) {
    selectedTerm = studentEvaluationPolicy.periods[0]?.value || 'T1-P1'
    selectedTermLabel = evaluationPeriodLabel(selectedTerm)
  }

  return {
    school,
    currentYear,
    appLanguage,
    selectedYear: currentYear,
    selectedTerm,
    selectedTermLabel,
    selectedClassId: request.input('class_id', ''),
    selectedStudentId: request.input('student_id', ''),
    user,
    governance,
    navigation,
    evaluationPolicies: SECTION_EVALUATION_POLICIES,
    classEvaluationPolicies,
    fallbackTermOptions: allEvaluationPeriodOptions(governance?.sectionCode),
    fallbackEvaluationTypeOptions: allEvaluationTypeOptions(governance?.sectionCode),
    studentEvaluationPolicy,
    studentTermOptions: studentEvaluationPolicy.periods,
    users,
    classes,
    classObj: firstClass,
    students,
    student: firstStudent,
    teachers,
    subjects,
    subject: subjects[0] || { id: '', name: 'Matière', coefficient: 1 },
    children: [],
    child: firstStudent,
    grades: [],
    subjectsGrades: [],
    assignments: [],
    assignment: { id: '', title: 'Devoir', maxPoints: 20 },
    submissions: [],
    attendance: [],
    attendances: [],
    timetable: [],
    incidents: [],
    incident: { id: '', title: 'Incident', severity: 'minor' },
    sanctions: [],
    appeals: [],
    payments: [],
    payment: { id: '', receiptNumber: '-', amountPaid: 0, currency: 'USD' },
    fees: [],
    fee: { id: '', feeType: 'Frais scolaires', amount: 0, currency: 'USD' },
    plans: [],
    scholarships: [],
    reports: [],
    report: {},
    roles: [],
    role: { id: '', name: 'Rôle', permissions: [] },
    logs: [],
    notifications: [],
    messages: [],
    message: { id: '', subject: 'Message', content: '', sender: user, receiver: null },
    conversations: [],
    events: [],
    event: { id: '', title: 'Événement' },
    exchanges: [],
    exchange: { id: '', title: 'Échange' },
    practices: [],
    practice: { id: '', title: 'Bonne pratique' },
    schools: [],
    stats: {},
    summary: {},
    pagination: { total: 0, perPage: 20, currentPage: 1, lastPage: 1, from: 0, to: 0 },
    url: request.url(),
    termAverage: 0,
    termRank: 0,
    totalStudents: students.length,
    bestSubject: '-',
    bestGrade: '-',
    appreciation: '-',
    ...overrides,
  }
}
