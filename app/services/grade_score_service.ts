export type GradeScoreLike = {
  score?: number | string | null
  maxScore?: number | string | null
  max_score?: number | string | null
}

export function normalizedGradeScore(grade: GradeScoreLike) {
  const score = Number(grade.score)
  const maxScore = Number(grade.maxScore ?? grade.max_score ?? 20)

  if (!Number.isFinite(score) || !Number.isFinite(maxScore) || maxScore <= 0) return null
  return (score / maxScore) * 20
}

export function formatScore(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) return '-'
  return Number(value).toFixed(1).replace(/\.0$/, '')
}

export function normalizedGradeLabel(grade: GradeScoreLike) {
  return formatScore(normalizedGradeScore(grade))
}
