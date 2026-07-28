import db from '@adonisjs/lucid/services/db'
import Assignment from '#models/assignment'
import Class from '#models/class'
import Student from '#models/student'
import { getClassFamilyName } from '#services/school_class_service'

function classFamiliesMatch(leftName: string, rightName: string) {
  const left = getClassFamilyName(leftName)
  const right = getClassFamilyName(rightName)

  return left === right || left.startsWith(`${right} - `) || right.startsWith(`${left} - `)
}

function classesShareSectionScope(left: Class, right: Class) {
  if (!left.schoolSectionId || !right.schoolSectionId) return true
  return left.schoolSectionId === right.schoolSectionId
}

export async function assignmentAudienceClassIds(assignment: Assignment) {
  const classObj = assignment.class || (await Class.find(assignment.classId))
  if (!classObj) return [assignment.classId].filter(Boolean)

  const rows = await Class.query()
    .where('schoolId', classObj.schoolId)
    .where('academicYear', classObj.academicYear)
    .where('level', classObj.level)
    .where('gradeLevel', classObj.gradeLevel)
    .where('shift', classObj.shift)
    .whereNull('archivedAt')

  const classIds = rows
    .filter((row) => {
      if (!classesShareSectionScope(row, classObj)) return false
      return classFamiliesMatch(row.name, classObj.name)
    })
    .map((row) => row.id)

  return classIds.length ? classIds : [assignment.classId]
}

export async function studentAssignmentClassIds(student: Student) {
  if (!student.classId) return []

  const classObj = student.class || (await Class.find(student.classId))
  if (!classObj) return [student.classId]

  const rows = await Class.query()
    .where('schoolId', student.schoolId)
    .where('academicYear', classObj.academicYear)
    .where('level', classObj.level)
    .where('gradeLevel', classObj.gradeLevel)
    .where('shift', classObj.shift)
    .whereNull('archivedAt')

  const classIds = rows
    .filter((row) => {
      if (!classesShareSectionScope(row, classObj)) return false
      return classFamiliesMatch(row.name, classObj.name)
    })
    .map((row) => row.id)

  return classIds.length ? classIds : [student.classId]
}

export async function visibleAssignmentsForStudent(student: Student) {
  const classIds = await studentAssignmentClassIds(student)
  if (!classIds.length) return []

  const assignments = await Assignment.query()
    .whereIn('classId', classIds)
    .whereIn('status', ['published', 'closed'])
    .preload('subject')
    .preload('class')
    .orderBy('dueDate', 'asc')

  return assignments.map((assignment) => {
    assignment.$extras.visibleClassIds = classIds
    return assignment
  })
}

export async function activeStudentsForAssignment(assignment: Assignment) {
  const classIds = await assignmentAudienceClassIds(assignment)
  if (!classIds.length) return []

  return Student.query()
    .whereIn('classId', classIds)
    .where('academicStatus', 'active')
    .preload('user')
    .orderBy('registrationNumber', 'asc')
}

export async function activeStudentCountForAssignment(assignment: Assignment) {
  const classIds = await assignmentAudienceClassIds(assignment)
  if (!classIds.length) return 0

  const row = await db
    .from('students')
    .whereIn('class_id', classIds)
    .where('academic_status', 'active')
    .count('* as total')
    .first()

  return Number(row?.total || 0)
}
