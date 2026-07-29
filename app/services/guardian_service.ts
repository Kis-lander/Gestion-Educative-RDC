import db from '@adonisjs/lucid/services/db'
import Student from '#models/student'
import Parent from '#models/parent'

export type GuardianSummary = {
  id: string
  userId: string
  fullName: string
  email: string | null
  phone: string | null
  relationship: string | null
  isPrimary: boolean
}

type GuardianRow = {
  id: string
  user_id: string
  first_name?: string | null
  firstName?: string | null
  postnom?: string | null
  last_name?: string | null
  lastName?: string | null
  email?: string | null
  phone?: string | null
  pivot_relationship?: string | null
  parent_relationship?: string | null
  is_primary?: boolean | number | null
  student_id?: string
}

function fullName(row: GuardianRow) {
  return [row.first_name ?? row.firstName, row.last_name ?? row.lastName, row.postnom]
    .filter(Boolean)
    .join(' ')
}

function mapGuardian(row: GuardianRow): GuardianSummary {
  return {
    id: row.id,
    userId: row.user_id,
    fullName: fullName(row),
    email: row.email || null,
    phone: row.phone || null,
    relationship: row.pivot_relationship || row.parent_relationship || null,
    isPrimary: Boolean(row.is_primary),
  }
}

function guardianBaseQuery() {
  return db
    .from('parent_student')
    .join('parents', 'parent_student.parent_id', 'parents.id')
    .join('users', 'parents.user_id', 'users.id')
    .select(
      'parents.id as id',
      'parents.user_id as user_id',
      'users.first_name',
      'users.postnom',
      'users.last_name',
      'users.email',
      'users.phone',
      'parent_student.student_id',
      'parent_student.is_primary',
      'parent_student.relationship as pivot_relationship',
      'parents.relationship as parent_relationship'
    )
    .orderBy('parent_student.is_primary', 'desc')
    .orderBy('users.last_name', 'asc')
    .orderBy('users.first_name', 'asc')
}

export async function getStudentGuardians(studentId: string) {
  const rows = await guardianBaseQuery().where('parent_student.student_id', studentId)
  return rows.map(mapGuardian)
}

export async function getPrimaryGuardianForStudent(studentId: string) {
  const guardians = await getStudentGuardians(studentId)
  return guardians[0] || null
}

export async function getPrimaryGuardiansForStudents(studentIds: string[]) {
  const uniqueStudentIds = [...new Set(studentIds.filter(Boolean))]
  const guardiansByStudent = new Map<string, GuardianSummary>()

  if (!uniqueStudentIds.length) {
    return guardiansByStudent
  }

  const rows = await guardianBaseQuery().whereIn('parent_student.student_id', uniqueStudentIds)

  for (const row of rows) {
    if (!row.student_id || guardiansByStudent.has(row.student_id)) continue
    guardiansByStudent.set(row.student_id, mapGuardian(row))
  }

  return guardiansByStudent
}

export async function getChildrenForParentUser(userId: string) {
  const parent = await Parent.query().where('userId', userId).first()

  if (!parent) {
    return []
  }

  return Student.query()
    .whereIn(
      'id',
      db.from('parent_student').select('student_id').where('parent_id', parent.id)
    )
    .preload('user')
    .preload('class')
    .preload('school')
    .orderBy('created_at', 'desc')
}

export function formatGuardianLabel(guardian: GuardianSummary | null | undefined) {
  if (!guardian) return ''
  return [guardian.fullName, guardian.relationship ? `(${guardian.relationship})` : '']
    .filter(Boolean)
    .join(' ')
}
