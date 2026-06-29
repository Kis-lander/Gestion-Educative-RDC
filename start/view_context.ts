import { type HttpContext } from '@adonisjs/core/http'
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
  const selectedTerm = String(request.input('term', 'T1'))
  const selectedTermLabel =
    selectedTerm === 'T2' ? 'Trimestre 2' : selectedTerm === 'T3' ? 'Trimestre 3' : 'Trimestre 1'

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
        .orderBy('gradeLevel', 'asc')
        .orderBy('name', 'asc')
    } catch {}

    try {
      students = await Student.query()
        .where('schoolId', user.schoolId)
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
  } catch {}

  try {
    users = await User.query().orderBy('createdAt', 'desc').limit(50)
  } catch {}

  const firstClass = classes[0] || { id: '', name: 'Classe non sélectionnée', level: '', students: [] }
  const firstStudent = students[0] || {
    id: '',
    name: user?.fullName || 'Élève',
    user,
    class: firstClass,
    registrationNumber: '-',
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
