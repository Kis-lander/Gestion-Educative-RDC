import { DateTime } from 'luxon'

export type AssignmentLike = {
  dueDate: DateTime
  dueTime?: string | null
  status: 'draft' | 'published' | 'closed'
}

export type SubmissionLike = {
  status?: 'draft' | 'submitted' | 'graded' | string | null
  submittedAt?: DateTime | null
  isLate?: boolean | null
  grade?: string | number | null
} | null

export function assignmentDeadlineAt(assignment: Pick<AssignmentLike, 'dueDate' | 'dueTime'>) {
  const dueTime = String(assignment.dueTime || '').trim()
  const parts = dueTime
    ? dueTime.split(':').map((part) => Number(part))
    : [23, 59, 59]
  const [hour = 23, minute = 59, second = 59] = parts

  return assignment.dueDate.set({
    hour: Number.isFinite(hour) ? hour : 23,
    minute: Number.isFinite(minute) ? minute : 59,
    second: Number.isFinite(second) ? second : 59,
    millisecond: 999,
  })
}

export function assignmentStatusMeta(assignment: AssignmentLike, now = DateTime.now()) {
  const deadlineAt = assignmentDeadlineAt(assignment)
  const isOverdue = now > deadlineAt
  const daysRemaining = Math.ceil(deadlineAt.diff(now, 'days').days)
  const daysLate = isOverdue ? Math.max(1, Math.ceil(now.diff(deadlineAt, 'days').days)) : 0

  if (assignment.status === 'draft') {
    return {
      effectiveStatus: 'draft',
      statusLabel: 'Brouillon',
      statusClass: 'bg-yellow-100 text-yellow-800',
      borderClass: 'border-yellow-500',
      canSubmit: false,
      isOverdue,
      daysRemaining,
      daysLate,
      deadlineAt,
    }
  }

  if (assignment.status === 'closed') {
    return {
      effectiveStatus: 'closed',
      statusLabel: 'Clôturé',
      statusClass: 'bg-gray-100 text-gray-800',
      borderClass: 'border-gray-400',
      canSubmit: false,
      isOverdue,
      daysRemaining,
      daysLate,
      deadlineAt,
    }
  }

  if (isOverdue) {
    return {
      effectiveStatus: 'expired',
      statusLabel: 'Expiré',
      statusClass: 'bg-red-100 text-red-800',
      borderClass: 'border-red-500',
      canSubmit: false,
      isOverdue,
      daysRemaining,
      daysLate,
      deadlineAt,
    }
  }

  return {
    effectiveStatus: 'published',
    statusLabel: 'Publié',
    statusClass: 'bg-green-100 text-green-800',
    borderClass: 'border-green-500',
    canSubmit: true,
    isOverdue,
    daysRemaining,
    daysLate,
    deadlineAt,
  }
}

export function assignmentSubmissionMeta(
  assignment: AssignmentLike,
  submission: SubmissionLike,
  now = DateTime.now()
) {
  const assignmentMeta = assignmentStatusMeta(assignment, now)
  const hasSubmitted = !!submission && ['submitted', 'graded'].includes(String(submission.status))
  const submittedLate =
    hasSubmitted &&
    (!!submission?.isLate ||
      (!!submission?.submittedAt && submission.submittedAt > assignmentMeta.deadlineAt))

  if (hasSubmitted && submission?.status === 'graded') {
    return {
      status: submittedLate ? 'late_graded' : 'graded',
      label: submittedLate ? 'Noté, remis en retard' : 'Noté',
      badgeClass: submittedLate ? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800',
      isSubmitted: true,
      isGraded: true,
      isLate: submittedLate,
      canSubmit: false,
    }
  }

  if (hasSubmitted) {
    return {
      status: submittedLate ? 'late_submitted' : 'submitted',
      label: submittedLate ? 'Remis en retard' : 'Soumis',
      badgeClass: submittedLate ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800',
      isSubmitted: true,
      isGraded: false,
      isLate: submittedLate,
      canSubmit: assignmentMeta.canSubmit,
    }
  }

  if (assignmentMeta.isOverdue || assignmentMeta.effectiveStatus === 'closed') {
    return {
      status: 'missing',
      label: 'Non rendu',
      badgeClass: 'bg-red-100 text-red-800',
      isSubmitted: false,
      isGraded: false,
      isLate: false,
      canSubmit: false,
    }
  }

  return {
    status: 'pending',
    label: 'À rendre',
    badgeClass: 'bg-yellow-100 text-yellow-800',
    isSubmitted: false,
    isGraded: false,
    isLate: false,
    canSubmit: assignmentMeta.canSubmit,
  }
}
