import db from '@adonisjs/lucid/services/db'

export type StudentClassRank = {
  rank: number | null
  totalStudents: number
}

export async function getStudentPublishedClassRank(
  studentId: string,
  classId: string | null | undefined
): Promise<StudentClassRank> {
  if (!classId) {
    return { rank: null, totalStudents: 0 }
  }

  const totalRow = await db.from('students').where('class_id', classId).count('* as total').first()
  const gradeRows = await db
    .from('grades')
    .where('class_id', classId)
    .where('published', true)
    .select('student_id')
    .select(db.raw('avg((score / nullif(max_score, 0)) * 20) as average'))
    .groupBy('student_id')

  const rankedRows = gradeRows
    .map((row) => ({
      studentId: String(row.student_id),
      average: Number(row.average),
    }))
    .filter((row) => Number.isFinite(row.average))
    .sort((a, b) => b.average - a.average)

  const studentIndex = rankedRows.findIndex((row) => row.studentId === studentId)

  return {
    rank: studentIndex >= 0 ? studentIndex + 1 : null,
    totalStudents: Number(totalRow?.total || 0),
  }
}
