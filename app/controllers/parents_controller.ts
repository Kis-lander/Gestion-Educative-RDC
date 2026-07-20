import { type HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

// Imports des modèles via subpath alias
import Parent from '#models/parent'
import Student from '#models/student'
import User from '#models/user'
import Message from '#models/message'
import Grade from '#models/grade'
import Discipline from '#models/discipline'
import FeePayment from '#models/fee_payment'
import SchoolFee from '#models/school_fee'
import Teacher from '#models/teacher'
import { edgePageContext } from '#start/view_context'
import {
  formatGuardianLabel,
  getPrimaryGuardianForStudent,
  getPrimaryGuardiansForStudents,
} from '#services/guardian_service'

// Imports des validateurs VineJS
import { sendMessageToTeacherValidator } from '#validators/parent'

export default class ParentController {
  private formatScore(value: number | null | undefined) {
    if (value === null || value === undefined || !Number.isFinite(Number(value))) return '-'

    return Number(value).toFixed(1).replace(/\.0$/, '')
  }

  private average(values: number[]) {
    if (!values.length) return null

    return values.reduce((sum, value) => sum + value, 0) / values.length
  }

  private getIncidentTypeLabel(type: string) {
    const labels: Record<string, string> = {
      absence: 'Absence',
      late: 'Retard',
      misconduct: 'Inconduite',
      violence: 'Violence',
      fraud: 'Fraude',
      uniform_violation: 'Tenue non conforme',
      other: 'Autre',
    }

    return labels[type] || 'Autre'
  }

  private getSeverityLabel(severity: string) {
    const labels: Record<string, string> = {
      minor: 'Mineure',
      moderate: 'Modérée',
      major: 'Majeure',
      critical: 'Critique',
    }

    return labels[severity] || '-'
  }

  private getSanctionLabel(sanction: string | null | undefined) {
    const labels: Record<string, string> = {
      warning: 'Avertissement',
      community_service: "Travail d'intérêt général",
      suspension: 'Suspension',
      expulsion: 'Exclusion',
      none: 'Aucune',
    }

    return labels[sanction || 'none'] || 'Aucune'
  }

  private getPaymentMethodLabel(method: string | null | undefined) {
    const labels: Record<string, string> = {
      cash: 'Espèces',
      bank_transfer: 'Virement',
      mobile_money: 'Mobile Money',
      check: 'Chèque',
      cheque: 'Chèque',
      card: 'Carte',
    }

    return labels[method || ''] || 'Autre'
  }

  private getPeriodRange(period: string) {
    const now = DateTime.now()
    const academicStartYear = now.month >= 9 ? now.year : now.year - 1

    if (period === 'month') {
      return {
        start: now.minus({ months: 1 }).startOf('day'),
        end: now.endOf('day'),
      }
    }

    const ranges: Record<string, { start: DateTime; end: DateTime }> = {
      T1: {
        start: DateTime.local(academicStartYear, 9, 1),
        end: DateTime.local(academicStartYear, 12, 31),
      },
      T2: {
        start: DateTime.local(academicStartYear + 1, 1, 1),
        end: DateTime.local(academicStartYear + 1, 3, 31),
      },
      T3: {
        start: DateTime.local(academicStartYear + 1, 4, 1),
        end: DateTime.local(academicStartYear + 1, 7, 31),
      },
    }

    return ranges[period] || null
  }

  private getAttendancePeriodRange(period: string, month?: number, year?: number) {
    const now = DateTime.now()
    const selectedYear = year || now.year
    const academicStartYear = now.month >= 9 ? now.year : now.year - 1

    if (period === 'month') {
      const selectedMonth = month || now.month
      const date = DateTime.local(selectedYear, selectedMonth, 1)

      return {
        start: date.startOf('month'),
        end: date.endOf('month'),
      }
    }

    const defaultMonth = DateTime.local(selectedYear, month || now.month, 1)

    const ranges: Record<string, { start: DateTime; end: DateTime }> = {
      term1: {
        start: DateTime.local(academicStartYear, 9, 1),
        end: DateTime.local(academicStartYear, 12, 31),
      },
      term2: {
        start: DateTime.local(academicStartYear + 1, 1, 1),
        end: DateTime.local(academicStartYear + 1, 3, 31),
      },
      term3: {
        start: DateTime.local(academicStartYear + 1, 4, 1),
        end: DateTime.local(academicStartYear + 1, 7, 31),
      },
      year: {
        start: DateTime.local(academicStartYear, 9, 1),
        end: DateTime.local(academicStartYear + 1, 7, 31),
      },
    }

    return ranges[period] || {
      start: defaultMonth.startOf('month'),
      end: defaultMonth.endOf('month'),
    }
  }

  private getAttendancePeriodLabel(period: string | null | undefined) {
    const labels: Record<string, string> = {
      morning: 'Matin',
      afternoon: 'Après-midi',
      full: 'Journée',
    }

    return labels[period || ''] || 'Journée'
  }

  private buildAttendanceStats(records: any[]) {
    const presentCount = records.filter((record) => record.status === 'present').length
    const absentCount = records.filter((record) => record.status === 'absent').length
    const lateCount = records.filter((record) => record.status === 'late').length
    const excusedCount = records.filter((record) => record.status === 'excused').length
    const total = records.length

    return {
      presentRate: total ? Math.round(((presentCount + excusedCount) / total) * 100) : 0,
      presentCount,
      absentCount,
      lateCount,
      excusedCount,
      total,
    }
  }

  private formatAttendanceRecords(records: any[]) {
    return records.map((record) => ({
      id: record.id,
      studentId: record.student_id,
      date: record.date,
      period: record.period,
      periodLabel: this.getAttendancePeriodLabel(record.period),
      status: record.status,
      reason: record.reason || record.justification || '',
      justified: Boolean(record.justified_at || record.justification),
    }))
  }

  private buildAttendanceCalendar(records: any[]) {
    return records.reduce<Record<string, any>>((calendar, record) => {
      const date =
        typeof record.date === 'string'
          ? record.date.slice(0, 10)
          : DateTime.fromJSDate(record.date).toISODate()

      if (date) {
        calendar[date] = {
          status: record.status,
          justified: Boolean(record.justified_at || record.justification),
        }
      }

      return calendar
    }, {})
  }

  private buildAttendanceChart(records: any[]) {
    const buckets = new Map<string, { present: number; absent: number; total: number }>()

    for (let index = 5; index >= 0; index--) {
      const month = DateTime.now().minus({ months: index })
      buckets.set(month.toFormat('LLL yyyy'), { present: 0, absent: 0, total: 0 })
    }

    for (const record of records) {
      const date =
        typeof record.date === 'string' ? DateTime.fromISO(record.date) : DateTime.fromJSDate(record.date)
      const key = date.toFormat('LLL yyyy')
      const bucket = buckets.get(key)

      if (!bucket) continue
      bucket.total += 1
      if (record.status === 'present' || record.status === 'excused') bucket.present += 1
      if (record.status === 'absent') bucket.absent += 1
    }

    return {
      labels: Array.from(buckets.keys()),
      values: {
        present: Array.from(buckets.values()).map((bucket) =>
          bucket.total ? Math.round((bucket.present / bucket.total) * 100) : 0
        ),
        absent: Array.from(buckets.values()).map((bucket) =>
          bucket.total ? Math.round((bucket.absent / bucket.total) * 100) : 0
        ),
      },
    }
  }

  private async getAppointmentChildren(user: User) {
    const parentProfile = user.role === 'director' ? null : await Parent.findByOrFail('user_id', user.id)
    const childrenModels =
      user.role === 'director'
        ? await Student.query()
            .where('school_id', user.schoolId)
            .preload('user')
            .preload('class')
            .preload('school')
            .orderBy('created_at', 'desc')
            .limit(100)
        : await parentProfile!.related('children').query().preload('user').preload('class').preload('school')

    return childrenModels.map((child) => ({
      id: child.id,
      name: child.user?.fullName || child.registrationNumber,
      className: child.class?.name || 'Non affecté',
      schoolId: child.schoolId,
      school: child.school,
    }))
  }

  private async getAppointmentTeachers(schoolIds: string[]) {
    if (!schoolIds.length) return []

    const teachers = await Teacher.query()
      .whereIn('school_id', schoolIds)
      .where('status', 'active')
      .preload('user')
      .orderBy('created_at', 'desc')

    return teachers.map((teacher) => ({
      id: teacher.id,
      userId: teacher.userId,
      name: teacher.user?.fullName || teacher.employeeNumber,
      subject: teacher.specialization || teacher.qualification || 'Enseignant',
      schoolId: teacher.schoolId,
    }))
  }

  private buildAvailableAppointmentSlots(date: string) {
    const selectedDate = DateTime.fromISO(date)
    if (!selectedDate.isValid || selectedDate < DateTime.now().startOf('day')) return []
    if (selectedDate.weekday === 7) return []

    const weekdaySlots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00']
    const saturdaySlots = ['08:00', '09:00', '10:00']

    return (selectedDate.weekday === 6 ? saturdaySlots : weekdaySlots).map((time) => ({ time }))
  }

  private async getParentChildren(user: User) {
    const parentProfile = user.role === 'director' ? null : await Parent.findByOrFail('user_id', user.id)
    const childrenModels =
      user.role === 'director'
        ? await Student.query()
            .where('school_id', user.schoolId)
            .preload('user')
            .preload('class')
            .preload('school')
            .orderBy('created_at', 'desc')
            .limit(100)
        : await parentProfile!.related('children').query().preload('user').preload('class').preload('school')

    const childIds = childrenModels.map((child) => child.id)
    const guardiansByStudent = await getPrimaryGuardiansForStudents(childIds)
    const relationshipRows = parentProfile
      ? await db
          .from('parent_student')
          .where('parent_id', parentProfile.id)
          .whereIn('student_id', childIds)
          .select('student_id', 'relationship', 'is_primary')
      : []
    const relationshipByStudent = new Map(
      relationshipRows.map((row) => [
        row.student_id,
        {
          relationship: row.relationship || parentProfile?.relationship || null,
          isPrimary: Boolean(row.is_primary),
        },
      ])
    )

    return Promise.all(
      childrenModels.map(async (child) => {
        const grades = await Grade.query().where('student_id', child.id).preload('subject')
        const scores = grades.map((grade) => Number(grade.score)).filter((score) => Number.isFinite(score))
        const averageGrade = this.average(scores)
        const bestGrade = grades
          .filter((grade) => Number.isFinite(Number(grade.score)))
          .sort((a, b) => Number(b.score) - Number(a.score))[0]
        const worstGrade = grades
          .filter((grade) => Number.isFinite(Number(grade.score)))
          .sort((a, b) => Number(a.score) - Number(b.score))[0]
        const attendanceRows = await db.from('attendances').where('student_id', child.id)
        const attendanceStats = this.buildAttendanceStats(attendanceRows)
        const disciplineCount = await Discipline.query().where('student_id', child.id).count('* as total')

        const primaryGuardian = guardiansByStudent.get(child.id) || null
        const currentParentLink = relationshipByStudent.get(child.id)

        return {
          id: child.id,
          name: child.user?.fullName || child.registrationNumber,
          className: child.class?.name || 'Non affecte',
          registrationNumber: child.registrationNumber || '-',
          birthDate: child.birthDate?.toFormat('dd/MM/yyyy') || '-',
          birthPlace: child.birthPlace || '-',
          nationality: child.nationality || 'Congolaise',
          gender: child.gender,
          address: child.address || '-',
          medicalInfo: child.medicalInfo,
          primaryGuardian,
          parentName: formatGuardianLabel(primaryGuardian) || '-',
          parentRelationship: primaryGuardian?.relationship || '-',
          currentParentRelationship: currentParentLink?.relationship || '-',
          currentParentIsPrimary: currentParentLink?.isPrimary || false,
          parentPhone: primaryGuardian?.phone || child.parentPhone,
          schoolId: child.schoolId,
          school: child.school,
          academicStatus: child.academicStatus || 'active',
          enrollmentDate: child.enrollmentDate?.toFormat('dd/MM/yyyy') || '-',
          averageGrade: this.formatScore(averageGrade),
          attendanceRate: attendanceStats.presentRate,
          disciplineIncidents: Number(disciplineCount[0].$extras.total || 0),
          rank: '-',
          totalStudents: child.classId
            ? await Student.query().where('class_id', child.classId).count('* as total').then((rows) => Number(rows[0].$extras.total || 0))
            : 0,
          bestSubject: bestGrade?.subject?.name || '-',
          bestSubjectGrade: this.formatScore(bestGrade?.score),
          worstSubject: worstGrade?.subject?.name || '-',
          worstSubjectGrade: this.formatScore(worstGrade?.score),
          mainTeacherId: null,
        }
      })
    )
  }

  private async parentPageContext(ctx: HttpContext, extra: Record<string, any> = {}) {
    return edgePageContext(ctx, extra)
  }

  private csv(response: HttpContext['response'], filename: string, rows: Record<string, any>[]) {
    const headers = Object.keys(rows[0] || { message: '' })
    const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`
    response.header('content-type', 'text/csv; charset=utf-8')
    response.header('content-disposition', `attachment; filename="${filename}"`)
    return response.send([
      headers.join(','),
      ...rows.map((row) => headers.map((header) => escape(row[header])).join(',')),
    ].join('\n'))
  }

  private parseAppointmentMessage(message: Message) {
    const content = message.content || ''
    const getValue = (label: string) => {
      const line = content
        .split('\n')
        .find((item) => item.toLowerCase().startsWith(`${label.toLowerCase()}:`))

      return line ? line.slice(label.length + 1).trim() : ''
    }

    return {
      childName: getValue('Élève') || '-',
      date: getValue('Date proposée') || message.createdAt,
      time: getValue('Créneau') || '-',
      reason: getValue('Motif') || message.subject.replace(/^\[URGENT\]\s*/, '').replace('Demande de rendez-vous - ', ''),
    }
  }

  private async getAuthorizedChild(user: User, studentId: string) {
    if (user.role === 'director') {
      return Student.query()
        .where('id', studentId)
        .where('school_id', user.schoolId)
        .preload('user')
        .preload('class')
        .preload('school')
        .firstOrFail()
    }

    const parent = await Parent.findByOrFail('user_id', user.id)

    return parent
      .related('children')
      .query()
      .where('students.id', studentId)
      .preload('user')
      .preload('class')
      .preload('school')
      .firstOrFail()
  }

  /**
   * Page détail des notes d'un enfant
   */
  public async childGradesDetailsPage({ auth, params, request, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const selectedTerm = String(request.input('term', 'T1'))
    let currentTerm = selectedTerm
    const selectedSubjectId = String(request.input('subject_id', '')).trim() || null
    const child = await this.getAuthorizedChild(user, params.studentId)

    const gradesQuery = Grade.query()
      .where('student_id', child.id)
      .where('term', currentTerm)
      .preload('subject')
      .orderBy('exam_date', 'asc')

    if (selectedSubjectId) gradesQuery.where('subject_id', selectedSubjectId)

    let grades = await gradesQuery

    if (!grades.length && !selectedSubjectId) {
      const availableGrades = await Grade.query()
        .where('student_id', child.id)
        .preload('subject')
        .orderBy('exam_date', 'asc')

      currentTerm = availableGrades[0]?.term || selectedTerm
      grades = availableGrades.filter((grade) => grade.term === currentTerm)
    }

    const currentSubjectId = selectedSubjectId || grades[0]?.subjectId || null
    const subjectGrades = currentSubjectId
      ? grades.filter((grade) => grade.subjectId === currentSubjectId)
      : []
    const scores = subjectGrades
      .map((grade) => Number(grade.score))
      .filter((score) => Number.isFinite(score))
    const averageScore = this.average(scores)
    const bestScore = scores.length ? Math.max(...scores) : null
    const worstScore = scores.length ? Math.min(...scores) : null
    const baseSubject = subjectGrades[0]?.subject

    const classAverageRow =
      child.classId && currentSubjectId
        ? await Grade.query()
            .where('class_id', child.classId)
            .where('subject_id', currentSubjectId)
            .where('term', currentTerm)
            .avg('score as average')
        : []
    const classAverage = Number(classAverageRow[0]?.$extras.average)
    const normalizedClassAverage = Number.isFinite(classAverage) ? classAverage : null

    const rankingRows =
      child.classId && currentSubjectId
        ? await db
            .from('grades')
            .where('class_id', child.classId)
            .where('subject_id', currentSubjectId)
            .where('term', currentTerm)
            .select('student_id')
            .avg('score as average')
            .groupBy('student_id')
            .orderBy('average', 'desc')
        : []
    const rankIndex = rankingRows.findIndex((row) => row.student_id === child.id)

    const termAverages: Record<string, string> = {}
    for (const term of ['T1', 'T2', 'T3']) {
      if (!currentSubjectId) {
        termAverages[term] = '-'
        continue
      }

      const termScores = await Grade.query()
        .where('student_id', child.id)
        .where('subject_id', currentSubjectId)
        .where('term', term)
        .avg('score as average')
      const termAverage = Number(termScores[0]?.$extras.average)
      termAverages[term] = this.formatScore(Number.isFinite(termAverage) ? termAverage : null)
    }

    const t1 = Number(termAverages.T1)
    const t3 = Number(termAverages.T3)
    const trend = Number.isFinite(t1) && Number.isFinite(t3) ? t3 - t1 : null

    const gradesDetails = await Promise.all(
      subjectGrades.map(async (grade) => {
        const evaluationAverageRow =
          child.classId && currentSubjectId
            ? await Grade.query()
                .where('class_id', child.classId)
                .where('subject_id', currentSubjectId)
                .where('term', grade.term)
                .where('exam_type', grade.examType)
                .avg('score as average')
            : []
        const evaluationAverage = Number(evaluationAverageRow[0]?.$extras.average)

        return {
          type: grade.examType,
          date: grade.examDate?.toFormat('dd/MM/yyyy') || '-',
          score: this.formatScore(grade.score),
          comment: grade.teacherComments || '-',
          classAverage: this.formatScore(Number.isFinite(evaluationAverage) ? evaluationAverage : null),
        }
      })
    )

    return view.render('parent/grades/details', {
      title: `Détail des notes - ${child.user?.fullName || child.registrationNumber}`,
      user,
      school: child.school || { id: user.schoolId, name: 'Gestion Éducative RDC' },
      child: {
        id: child.id,
        name: child.user?.fullName || child.registrationNumber,
        className: child.class?.name || 'Non affecté',
        registrationNumber: child.registrationNumber || '-',
      },
      subject: {
        id: currentSubjectId || '',
        name: baseSubject?.name || 'Aucune matière',
        coefficient: baseSubject?.coefficient || 0,
        average: this.formatScore(averageScore),
        bestGrade: this.formatScore(bestScore),
        worstGrade: this.formatScore(worstScore),
        classAverage: this.formatScore(normalizedClassAverage),
        rank: rankIndex >= 0 ? rankIndex + 1 : '-',
        totalStudents: rankingRows.length || '-',
        diffFromAverage:
          averageScore !== null && normalizedClassAverage !== null
            ? this.formatScore(averageScore - normalizedClassAverage)
            : '-',
        t1: termAverages.T1 || '-',
        t2: termAverages.T2 || '-',
        t3: termAverages.T3 || '-',
        trend: trend === null ? '-' : this.formatScore(trend),
      },
      currentTerm,
      selectedTerm: currentTerm,
      gradesDetails,
      evalLabels: gradesDetails.map((grade) => `${grade.type} ${grade.date}`),
      evalScores: subjectGrades.map((grade) => Number(grade.score || 0)),
      evalClassAverages: gradesDetails.map((grade) => Number(grade.classAverage) || 0),
    })
  }

  /**
   * Page suivi disciplinaire des enfants
   */
  public async disciplinePage({ auth, request, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const selectedPeriod = String(request.input('period', 'all')).trim() || 'all'
    const requestedChildId = String(request.input('child_id', '')).trim() || null

    const childrenModels =
      user.role === 'director'
        ? await Student.query()
            .where('school_id', user.schoolId)
            .preload('user')
            .preload('class')
            .preload('school')
            .orderBy('created_at', 'desc')
            .limit(100)
        : await (await Parent.findByOrFail('user_id', user.id))
            .related('children')
            .query()
            .preload('user')
            .preload('class')
            .preload('school')

    const children = childrenModels.map((child) => ({
      id: child.id,
      name: child.user?.fullName || child.registrationNumber,
      className: child.class?.name || 'Non affecté',
      registrationNumber: child.registrationNumber || '-',
      school: child.school,
    }))

    const selectedChild =
      children.find((child) => child.id === requestedChildId) || children[0] || null

    let incidents: any[] = []

    if (selectedChild) {
      const incidentQuery = Discipline.query()
        .where('student_id', selectedChild.id)
        .preload('reporter')
        .orderBy('incident_date', 'desc')

      const range = this.getPeriodRange(selectedPeriod)
      if (range) {
        incidentQuery.whereBetween('incident_date', [
          range.start.toSQLDate()!,
          range.end.toSQLDate()!,
        ])
      }

      const incidentRows = await incidentQuery
      incidents = incidentRows.map((incident) => ({
        id: incident.id,
        date: incident.incidentDate,
        type: incident.incidentType,
        typeLabel: this.getIncidentTypeLabel(incident.incidentType),
        severity: incident.severity,
        severityLabel: this.getSeverityLabel(incident.severity),
        description: incident.description || '-',
        sanction: this.getSanctionLabel(incident.sanction),
        reporterName: incident.reporter?.fullName || '-',
      }))
    }

    const byType = {
      absence: incidents.filter((incident) => incident.type === 'absence').length,
      late: incidents.filter((incident) => incident.type === 'late').length,
      misconduct: incidents.filter((incident) => incident.type === 'misconduct').length,
      violence: incidents.filter((incident) => incident.type === 'violence').length,
      other: incidents.filter((incident) =>
        ['fraud', 'uniform_violation', 'other'].includes(incident.type)
      ).length,
    }
    const lastIncident = incidents[0]
    const chartBuckets = new Map<string, number>()

    for (let index = 5; index >= 0; index--) {
      const month = DateTime.now().minus({ months: index })
      chartBuckets.set(month.toFormat('LLL yyyy'), 0)
    }

    for (const incident of incidents) {
      const date = DateTime.isDateTime(incident.date) ? incident.date : DateTime.fromJSDate(incident.date)
      const key = date.toFormat('LLL yyyy')
      if (chartBuckets.has(key)) chartBuckets.set(key, (chartBuckets.get(key) || 0) + 1)
    }

    return view.render('parent/discipline/index', {
      title: 'Discipline - Gestion Éducative RDC',
      user,
      school: selectedChild?.school || { id: user.schoolId, name: 'Gestion Éducative RDC' },
      children,
      selectedChild,
      selectedChildId: selectedChild?.id || '',
      selectedPeriod,
      incidents,
      stats: {
        total: incidents.length,
        lastIncidentDate: lastIncident?.date?.toFormat('dd/MM/yyyy') || null,
        byType,
      },
      chartLabels: Array.from(chartBuckets.keys()),
      chartValues: Array.from(chartBuckets.values()),
      pagination: { total: incidents.length, perPage: 20, currentPage: 1, lastPage: 1, from: 1, to: incidents.length },
      url: '/parent/discipline',
    })
  }

  /**
   * Page paiements des enfants
   */
  public async paymentsPage({ auth, request, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const currentYear = DateTime.now().year
    const selectedYear = Number(request.input('year', currentYear))
    const requestedChildId = String(request.input('child_id', '')).trim() || null

    const childrenModels =
      user.role === 'director'
        ? await Student.query()
            .where('school_id', user.schoolId)
            .preload('user')
            .preload('class')
            .preload('school')
            .orderBy('created_at', 'desc')
            .limit(100)
        : await (await Parent.findByOrFail('user_id', user.id))
            .related('children')
            .query()
            .preload('user')
            .preload('class')
            .preload('school')

    const children = childrenModels.map((child) => ({
      id: child.id,
      name: child.user?.fullName || child.registrationNumber,
      className: child.class?.name || 'Non affecté',
      registrationNumber: child.registrationNumber || '-',
      schoolId: child.schoolId,
      school: child.school,
    }))

    const selectedChild =
      children.find((child) => child.id === requestedChildId) || children[0] || null

    let fees: SchoolFee[] = []
    let payments: FeePayment[] = []

    if (selectedChild) {
      const academicYears = [String(selectedYear), `${selectedYear}-${selectedYear + 1}`]
      fees = await SchoolFee.query()
        .where('school_id', selectedChild.schoolId)
        .whereIn('academic_year', academicYears)
        .orderBy('created_at', 'asc')

      payments = await FeePayment.query()
        .where('student_id', selectedChild.id)
        .whereRaw('extract(year from payment_date) = ?', [selectedYear])
        .preload('fee')
        .orderBy('payment_date', 'desc')
    }

    const paidByFee = payments.reduce<Record<string, number>>((totals, payment) => {
      totals[payment.feeId] = (totals[payment.feeId] || 0) + Number(payment.amountPaid || 0)
      return totals
    }, {})

    const feeDetails = fees.map((fee) => {
      const amount = Number(fee.amount || 0)
      const paid = paidByFee[fee.id] || 0
      const balance = Math.max(amount - paid, 0)
      const percentage = amount > 0 ? Math.min(Math.round((paid / amount) * 100), 100) : 0

      return {
        id: fee.id,
        type: fee.feeType,
        term: fee.term,
        description: fee.description || '-',
        amount,
        paid,
        balance,
        percentage,
        dueDate: null,
        isOverdue: false,
      }
    })

    const totalDue = feeDetails.reduce((sum, fee) => sum + fee.amount, 0)
    const totalPaid = payments.reduce((sum, payment) => sum + Number(payment.amountPaid || 0), 0)
    const balance = Math.max(totalDue - totalPaid, 0)
    const paymentProgress = totalDue > 0 ? Math.min(Math.round((totalPaid / totalDue) * 100), 100) : 0

    return view.render('parent/payments/index', {
      title: 'Paiements - Gestion Éducative RDC',
      user,
      school: selectedChild?.school || { id: user.schoolId, name: 'Gestion Éducative RDC' },
      children,
      selectedChild,
      selectedChildId: selectedChild?.id || '',
      currentYear,
      selectedYear,
      totalPaid,
      totalDue,
      balance,
      paymentProgress,
      feeDetails,
      recentPayments: payments.slice(0, 10).map((payment) => ({
        id: payment.id,
        date: payment.paymentDate,
        receiptNumber: payment.receiptNumber || '-',
        feeType: payment.fee?.feeType || '-',
        amount: Number(payment.amountPaid || 0),
        method: payment.paymentMethod || 'other',
        methodLabel: this.getPaymentMethodLabel(payment.paymentMethod),
      })),
    })
  }

  /**
   * Page présences des enfants
   */
  public async attendancePage({ auth, request, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const selectedPeriod = String(request.input('period', 'month')).trim() || 'month'
    const requestedChildId = String(request.input('child_id', '')).trim() || null

    const childrenModels =
      user.role === 'director'
        ? await Student.query()
            .where('school_id', user.schoolId)
            .preload('user')
            .preload('class')
            .preload('school')
            .orderBy('created_at', 'desc')
            .limit(100)
        : await (await Parent.findByOrFail('user_id', user.id))
            .related('children')
            .query()
            .preload('user')
            .preload('class')
            .preload('school')

    const children = childrenModels.map((child) => ({
      id: child.id,
      name: child.user?.fullName || child.registrationNumber,
      className: child.class?.name || 'Non affecté',
      registrationNumber: child.registrationNumber || '-',
      school: child.school,
    }))

    const selectedChild =
      children.find((child) => child.id === requestedChildId) || children[0] || null

    let rawRecords: any[] = []

    if (selectedChild) {
      const range = this.getAttendancePeriodRange(selectedPeriod)
      rawRecords = await db
        .from('attendances')
        .where('student_id', selectedChild.id)
        .whereBetween('date', [range.start.toSQLDate()!, range.end.toSQLDate()!])
        .orderBy('date', 'desc')
    }

    const stats = this.buildAttendanceStats(rawRecords)
    const attendanceRecords = this.formatAttendanceRecords(rawRecords)
    const unjustifiedAbsences = attendanceRecords.filter(
      (record) => record.status === 'absent' && !record.justified
    )
    const chart = this.buildAttendanceChart(rawRecords)

    return view.render('parent/attendance/index', {
      title: 'Présences - Gestion Éducative RDC',
      user,
      school: selectedChild?.school || { id: user.schoolId, name: 'Gestion Éducative RDC' },
      children,
      selectedChild,
      selectedChildId: selectedChild?.id || '',
      selectedPeriod,
      stats,
      attendanceRecords,
      unjustifiedAbsences,
      calendarData: this.buildAttendanceCalendar(rawRecords),
      chartLabels: chart.labels,
      chartValues: chart.values,
    })
  }

  /**
   * Données JSON des présences d'un enfant
   */
  public async getChildAttendance({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const child = await this.getAuthorizedChild(user, params.studentId)
    const selectedPeriod = String(request.input('period', 'month')).trim() || 'month'
    const month = Number(request.input('month', DateTime.now().month))
    const year = Number(request.input('year', DateTime.now().year))
    const range = this.getAttendancePeriodRange(selectedPeriod, month, year)

    const rawRecords = await db
      .from('attendances')
      .where('student_id', child.id)
      .whereBetween('date', [range.start.toSQLDate()!, range.end.toSQLDate()!])
      .orderBy('date', 'desc')
    const chart = this.buildAttendanceChart(rawRecords)

    return response.ok({
      success: true,
      stats: this.buildAttendanceStats(rawRecords),
      calendarData: this.buildAttendanceCalendar(rawRecords),
      chartLabels: chart.labels,
      chartValues: chart.values,
      attendanceRecords: this.formatAttendanceRecords(rawRecords),
    })
  }

  /**
   * Page de demande de rendez-vous parent-enseignant
   */
  public async appointmentRequestPage(ctx: HttpContext) {
    const { auth, request, view } = ctx
    const user = auth.getUserOrFail()
    const children = await this.getAppointmentChildren(user)
    const schoolIds = Array.from(
      new Set(
        children
          .map((child) => child.schoolId)
          .filter((schoolId): schoolId is string => Boolean(schoolId))
      )
    )
    const teachers = await this.getAppointmentTeachers(schoolIds)
    const requestedStudentId = String(request.input('student_id', '')).trim()
    const selectedStudentId = children.some((child) => child.id === requestedStudentId)
      ? requestedStudentId
      : ''
    const selectedReason = String(request.input('reason', '')).trim()

    return view.render(
      'parent/appointments/request',
      await edgePageContext(ctx, {
        school: children[0]?.school || { id: user.schoolId, name: 'Gestion Éducative RDC' },
        children,
        teachers,
        selectedStudentId,
        selectedReason,
      })
    )
  }

  /**
   * Liste les demandes de rendez-vous envoyées par le parent.
   */
  public async appointmentsPage(ctx: HttpContext) {
    const { auth, request, view } = ctx
    const user = auth.getUserOrFail()
    const children = await this.getAppointmentChildren(user)
    const selectedStatus = String(request.input('status', '')).trim()
    const selectedChildId = String(request.input('child_id', '')).trim()
    const startDate = String(request.input('start_date', '')).trim()

    const query = Message.query()
      .where('sender_id', user.id)
      .where('type', 'parent_teacher')
      .whereILike('subject', '%Demande de rendez-vous%')
      .preload('receiver')
      .orderBy('created_at', 'desc')

    const messages = await query
    const selectedChildName = children.find((child) => child.id === selectedChildId)?.name || ''

    const appointments = messages
      .map((message) => {
        const details = this.parseAppointmentMessage(message)

        return {
          id: message.id,
          teacherName: message.receiver?.fullName || 'Enseignant',
          subject: 'Demande de rendez-vous',
          childName: details.childName,
          date: details.date,
          time: details.time,
          reason: details.reason,
          status: 'pending',
          teacherComment: '',
        }
      })
      .filter((appointment) => !selectedStatus || appointment.status === selectedStatus)
      .filter((appointment) => !selectedChildName || appointment.childName === selectedChildName)
      .filter((appointment) => !startDate || String(appointment.date).slice(0, 10) >= startDate)

    return view.render(
      'parent/appointments/index',
      await edgePageContext(ctx, {
        children,
        appointments,
        stats: {
          total: appointments.length,
          pending: appointments.filter((appointment) => appointment.status === 'pending').length,
          confirmed: 0,
          completed: 0,
        },
      })
    )
  }

  /**
   * Enregistre une demande de rendez-vous comme message parent-enseignant.
   */
  public async requestAppointment({ auth, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const studentId = String(request.input('studentId', '')).trim()
    const teacherId = String(request.input('teacherId', '')).trim()
    const reason = String(request.input('reason', '')).trim()
    const proposedDate = String(request.input('proposedDate', '')).trim()
    const selectedSlot = String(request.input('selectedSlot', '')).trim()
    const message = String(request.input('message', '')).trim()
    const urgent = Boolean(request.input('urgent'))

    if (!studentId || !teacherId || !reason || !proposedDate || !selectedSlot) {
      session.flash('error', 'Veuillez remplir tous les champs obligatoires.')
      return response.redirect().back()
    }

    const child = await this.getAuthorizedChild(user, studentId)
    const teacher = await Teacher.query()
      .where('id', teacherId)
      .where('school_id', child.schoolId)
      .where('status', 'active')
      .preload('user')
      .firstOrFail()

    const appointmentMessage = new Message()
    appointmentMessage.senderId = user.id
    appointmentMessage.receiverId = teacher.userId
    appointmentMessage.schoolId = child.schoolId
    appointmentMessage.subject = `${urgent ? '[URGENT] ' : ''}Demande de rendez-vous - ${reason}`
    appointmentMessage.type = 'parent_teacher'
    appointmentMessage.content = [
      `Élève: ${child.user?.fullName || child.registrationNumber}`,
      `Date proposée: ${proposedDate}`,
      `Créneau: ${selectedSlot}`,
      `Motif: ${reason}`,
      message ? `Message: ${message}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    await appointmentMessage.save()
    session.flash('success', 'Votre demande de rendez-vous a été envoyée à l’enseignant.')

    return response.redirect('/parent/appointments')
  }

  /**
   * Créneaux proposés pour un enseignant à une date donnée.
   */
  public async getTeacherAvailableSlots({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const date = String(request.input('date', '')).trim()
    const teacher = await Teacher.query()
      .where('id', params.teacherId)
      .where('status', 'active')
      .firstOrFail()

    if (user.role !== 'director') {
      const children = await this.getAppointmentChildren(user)
      const schoolIds = new Set(children.map((child) => child.schoolId))
      if (!schoolIds.has(teacher.schoolId)) {
        return response.forbidden({ success: false, message: 'Enseignant non autorisé' })
      }
    } else if (teacher.schoolId !== user.schoolId) {
      return response.forbidden({ success: false, message: 'Enseignant non autorisé' })
    }

    return response.ok({
      success: true,
      slots: this.buildAvailableAppointmentSlots(date),
    })
  }

  /**
   * Obtenir mes enfants avec statistiques
   */
  public async getChildren({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const parent = await Parent.findByOrFail('user_id', user.id)

    const children = await parent
      .related('children')
      .query()
      .preload('user')
      .preload('class')
      .preload('school')

    const childrenWithStats = await Promise.all(
      children.map(async (child) => {
        const averageGrade = await Grade.query()
          .where('student_id', child.id)
          .avg('score as average')

        const pendingPayments = await db
          .from('fee_payments')
          .where('student_id', child.id)
          .where('status', 'pending')
          .sum('amount_paid as total')

        const disciplineCount = await Discipline.query()
          .where('student_id', child.id)
          .whereBetween('incident_date', [
            DateTime.now().minus({ months: 3 }).toISODate()!,
            DateTime.now().toISODate()!,
          ])
          .count('* as total')

        return {
          ...child.toJSON(),
          stats: {
            averageGrade: Number(averageGrade[0].$extras.average || 0),
            pendingPayments: Number(pendingPayments[0].total || 0),
            recentDisciplineCount: Number(disciplineCount[0].$extras.total),
          },
        }
      })
    )

    return response.ok({
      success: true,
      children: childrenWithStats,
    })
  }

  /**
   * Obtenir les notes d'un enfant
   */
  public async getChildGrades({ params, auth, request, response }: HttpContext) {
    // Utilisation des inputs directs car le validateur VineJS n'est pas fourni pour getChildGrades dans votre snippet
    const term = request.input('term')
    const academicYear = request.input('academic_year')
    const subjectId = String(request.input('subject_id', '')).trim() || null

    const user = auth.getUserOrFail()
    const parent = await Parent.findByOrFail('user_id', user.id)

    // Vérifier l'association
    await parent.related('children').query().where('students.id', params.studentId).firstOrFail()

    const query = Grade.query()
      .where('student_id', params.studentId)
      .preload('subject')
      .preload('class')

    if (term) query.where('term', term)
    if (academicYear) query.where('academic_year', academicYear)
    if (subjectId) query.where('subject_id', subjectId)

    const grades = await query.orderBy('exam_date', 'desc')

    // Calcul des moyennes par matière
    const subjectsMap = new Map()
    for (const grade of grades) {
      if (grade.score === null || !Number.isFinite(grade.score)) continue

      const sId = grade.subjectId
      if (!subjectsMap.has(sId)) {
        subjectsMap.set(sId, {
          subject: grade.subject.name,
          coefficient: grade.subject.coefficient,
          grades: [],
          average: 0,
        })
      }
      subjectsMap.get(sId).grades.push(grade.score)
    }

    for (const data of subjectsMap.values()) {
      const sum = data.grades.reduce((a: number, b: number) => a + b, 0)
      data.average = sum / data.grades.length
    }

    return response.ok({
      success: true,
      grades,
      subjectsSummary: Array.from(subjectsMap.values()),
    })
  }

  /**
   * Envoyer un message à un enseignant
   */
  public async sendMessageToTeacher({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(sendMessageToTeacherValidator)
    const user = auth.getUserOrFail()

    // Vérifier l'existence du destinataire
    await User.query()
      .where('id', payload.teacherId)
      .where('role', 'teacher')
      .where('status', 'active')
      .firstOrFail()

    const message = new Message()
    message.senderId = user.id
    message.receiverId = payload.teacherId
    message.subject = payload.subject
    message.content = payload.content
    message.type = 'parent_teacher'

    if (payload.studentId) {
      const parent = await Parent.findByOrFail('user_id', user.id)
      const child = await parent
        .related('children')
        .query()
        .where('students.id', payload.studentId)
        .firstOrFail()

      message.schoolId = child.schoolId
    }

    await message.save()

    return response.created({
      success: true,
      message: 'Message envoyé avec succès',
      sentMessage: message,
    })
  }

  /**
   * Justifier une absence
   */
  public async justifyAbsence({ request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const parent = await Parent.findByOrFail('user_id', user.id)
    const absenceId = String(request.input('absenceId') || request.input('recordId') || '').trim()
    const reason = String(request.input('reason') || '').trim()
    const details = String(request.input('justification') || '').trim()
    const justification = [reason, details].filter(Boolean).join(' - ')
    const documentUrl = String(request.input('documentUrl') || '').trim() || null

    if (!absenceId || !justification) {
      return response.badRequest({ success: false, message: 'La justification est requise.' })
    }

    const absence = await db.from('attendances').where('id', absenceId).first()

    if (!absence) {
      return response.notFound({ success: false, message: 'Absence non trouvée' })
    }

    // Vérifier que l'enfant appartient bien au parent
    await parent.related('children').query().where('students.id', absence.student_id).firstOrFail()

    await db.from('attendances').where('id', absenceId).update({
      status: 'excused',
      justification,
      justification_document: documentUrl,
      justified_at: DateTime.now().toSQL(),
      justified_by: user.id,
    })

    return response.ok({ success: true, message: 'Absence justifiée avec succès' })
  }

  /**
   * Obtenir les paiements d'un enfant
   */
  public async getChildPayments({ params, response }: HttpContext) {
    const payments = await db
      .from('fee_payments')
      .where('student_id', params.studentId)
      .join('school_fees', 'fee_payments.fee_id', 'school_fees.id')
      .orderBy('payment_date', 'desc')
      .select(
        'fee_payments.*',
        'school_fees.fee_type',
        'school_fees.description as fee_description'
      )

    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount_paid, 0)

    const totalDueResult = await db
      .from('school_fees')
      .where('student_id', params.studentId)
      .sum('amount as total')
      .first()

    const totalDue = Number(totalDueResult?.total || 0)

    return response.ok({
      success: true,
      payments,
      summary: {
        totalPaid,
        totalDue,
        balance: totalDue - totalPaid,
      },
    })
  }

  public async childrenPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const children = await this.getParentChildren(user)
    const averages = children
      .map((child) => Number(child.averageGrade))
      .filter((average) => Number.isFinite(average))
    const totalPayments = await db
      .from('fee_payments')
      .whereIn('student_id', children.map((child) => child.id))
      .sum('amount_paid as total')
      .first()

    return ctx.view.render(
      'parent/children/index',
      await this.parentPageContext(ctx, {
        school: children[0]?.school || { id: user.schoolId, name: 'Gestion Educative RDC' },
        children,
        stats: {
          total: children.length,
          averageGrade: this.formatScore(this.average(averages)),
          attendanceRate: children.length
            ? Math.round(children.reduce((sum, child) => sum + Number(child.attendanceRate || 0), 0) / children.length)
            : 0,
          totalPayments: Number(totalPayments?.total || 0),
        },
      })
    )
  }

  public async dashboardPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const children = await this.getParentChildren(user)
    const messages = await Message.query()
      .where((query) => query.where('sender_id', user.id).orWhere('receiver_id', user.id))
      .preload('sender')
      .preload('receiver')
      .orderBy('created_at', 'desc')
      .limit(5)
    const averages = children.map((child) => Number(child.averageGrade)).filter(Number.isFinite)

    return ctx.view.render(
      'parent/dashboard',
      await this.parentPageContext(ctx, {
        school: children[0]?.school || { id: user.schoolId, name: 'Gestion Educative RDC' },
        children: children.slice(0, 4),
        recentMessages: messages.map((message) => {
          const other = message.senderId === user.id ? message.receiver : message.sender
          return {
            id: other?.id || message.id,
            senderName: other?.fullName || other?.email || 'Utilisateur',
            subject: message.subject,
            preview: message.content,
            time: message.createdAt?.toFormat('dd/MM/yyyy HH:mm') || '',
            isRead: message.isRead,
          }
        }),
        alerts: [],
        stats: {
          childrenCount: children.length,
          averageGrade: this.formatScore(this.average(averages)),
          unreadMessages: messages.filter((message) => message.receiverId === user.id && !message.isRead).length,
          pendingPayments: 0,
        },
      })
    )
  }

  public async childShowPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const child = (await this.getParentChildren(user)).find((item) => item.id === ctx.params.id)
    if (!child) return ctx.response.redirect('/parent/children')

    const grades = await Grade.query()
      .where('student_id', child.id)
      .preload('subject')
      .orderBy('exam_date', 'desc')
      .limit(10)
    const recentGrades = grades.map((grade) => ({
      subject: grade.subject?.name || '-',
      score: this.formatScore(grade.score),
      date: grade.examDate?.toFormat('dd/MM/yyyy') || '-',
      comment: grade.teacherComments || '-',
    }))
    const recentComments = grades
      .filter((grade) => grade.teacherComments)
      .slice(0, 5)
      .map((grade) => ({
        subject: grade.subject?.name || '-',
        comment: grade.teacherComments,
        teacher: '-',
        date: grade.examDate?.toFormat('dd/MM/yyyy') || '-',
      }))

    return ctx.view.render(
      'parent/children/show',
      await this.parentPageContext(ctx, {
        school: child.school || { id: user.schoolId, name: 'Gestion Educative RDC' },
        child,
        recentGrades,
        recentComments,
        chartLabels: recentGrades.map((grade) => grade.subject),
        chartDatasets: [
          {
            label: 'Notes',
            data: recentGrades.map((grade) => Number(grade.score) || 0),
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, .12)',
            tension: 0.35,
          },
        ],
      })
    )
  }

  public async childProfilePage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const child = (await this.getParentChildren(user)).find((item) => item.id === ctx.params.id)
    if (!child) return ctx.response.redirect('/parent/children')

    return ctx.view.render(
      'parent/children/profile',
      await this.parentPageContext(ctx, {
        school: child.school || { id: user.schoolId, name: 'Gestion Educative RDC' },
        child,
      })
    )
  }

  public async gradesPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const children = await this.getParentChildren(user)
    const selectedChildId = String(ctx.request.input('child_id', children[0]?.id || '')).trim()
    const selectedTerm = String(ctx.request.input('term', 'T1')).trim()
    const selectedChild = children.find((child) => child.id === selectedChildId) || children[0] || null

    let grades: Grade[] = []
    if (selectedChild) {
      grades = await Grade.query()
        .where('student_id', selectedChild.id)
        .where('term', selectedTerm)
        .preload('subject')
        .orderBy('exam_date', 'asc')
    }

    const bySubject = new Map<string, any>()
    for (const grade of grades) {
      const key = grade.subjectId || grade.subject?.name || grade.id
      if (!bySubject.has(key)) {
        bySubject.set(key, {
          id: key,
          name: grade.subject?.name || '-',
          coefficient: grade.subject?.coefficient || 1,
          scores: [],
          compo: null,
          interro: null,
          devoir: null,
          appreciation: grade.teacherComments || '',
        })
      }
      const subject = bySubject.get(key)
      subject.scores.push(Number(grade.score))
      const examType = String(grade.examType || '').toLowerCase()
      if (examType.includes('composition') || examType.includes('exam')) subject.compo = this.formatScore(grade.score)
      else if (examType.includes('inter')) subject.interro = this.formatScore(grade.score)
      else subject.devoir = this.formatScore(grade.score)
      if (grade.teacherComments) subject.appreciation = grade.teacherComments
    }

    const subjectsGrades = Array.from(bySubject.values()).map((subject) => ({
      ...subject,
      average: this.formatScore(this.average(subject.scores)),
    }))
    const averages = subjectsGrades.map((subject) => Number(subject.average)).filter(Number.isFinite)
    const overallAverage = this.formatScore(this.average(averages))

    return ctx.view.render(
      'parent/grades/index',
      await this.parentPageContext(ctx, {
        school: selectedChild?.school || { id: user.schoolId, name: 'Gestion Educative RDC' },
        children,
        selectedChild,
        selectedChildId: selectedChild?.id || '',
        selectedTerm,
        subjectsGrades,
        overallAverage,
        rank: '-',
        totalStudents: selectedChild?.totalStudents || 0,
        teacherComments: subjectsGrades
          .filter((subject) => subject.appreciation)
          .map((subject) => ({
            subject: subject.name,
            comment: subject.appreciation,
            teacher: '-',
            date: DateTime.now().toFormat('dd/MM/yyyy'),
          })),
        subjectsNames: subjectsGrades.map((subject) => subject.name),
        subjectsAverages: subjectsGrades.map((subject) => Number(subject.average) || 0),
        termsLabels: ['T1', 'T2', 'T3'],
        termsAverages: ['T1', 'T2', 'T3'].map((term) => (term === selectedTerm ? Number(overallAverage) || 0 : 0)),
      })
    )
  }

  public async reportCardPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const child = await this.getAuthorizedChild(user, ctx.params.studentId)
    const grades = await Grade.query().where('student_id', child.id).preload('subject')
    const rows = grades.map((grade) => ({
      subject: grade.subject?.name || '-',
      coefficient: grade.subject?.coefficient || 1,
      score: Number(grade.score || 0),
      points: Number(grade.score || 0) * Number(grade.subject?.coefficient || 1),
    }))
    const totalCoefficient = rows.reduce((sum, grade) => sum + Number(grade.coefficient || 0), 0)
    const totalPoints = rows.reduce((sum, grade) => sum + Number(grade.points || 0), 0)
    const primaryGuardian = await getPrimaryGuardianForStudent(child.id)

    return ctx.view.render(
      'parent/grades/report-card',
      await this.parentPageContext(ctx, {
        student: {
          id: child.id,
          name: child.user?.fullName || child.registrationNumber,
          registrationNumber: child.registrationNumber,
          className: child.class?.name || '-',
          birthDate: child.birthDate?.toFormat('dd/MM/yyyy') || '-',
          nationality: child.nationality || 'Congolaise',
          isRepeating: false,
          parentName: formatGuardianLabel(primaryGuardian) || '-',
          parentRelationship: primaryGuardian?.relationship || '-',
        },
        school: child.school || { id: user.schoolId, name: 'Gestion Educative RDC' },
        grades: rows,
        totalCoefficient,
        totalPoints,
        overallAverage: totalCoefficient ? this.formatScore(totalPoints / totalCoefficient) : '-',
        rank: '-',
        totalStudents: child.classId
          ? await Student.query().where('class_id', child.classId).count('* as total').then((r) => Number(r[0].$extras.total || 0))
          : 0,
      })
    )
  }

  public async disciplineDetailsPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const incident = await Discipline.query().where('id', ctx.params.id).preload('student', (q) => q.preload('user').preload('class').preload('school')).firstOrFail()
    await this.getAuthorizedChild(user, incident.studentId)
    const child = {
      id: incident.studentId,
      name: incident.student?.user?.fullName || '-',
      className: incident.student?.class?.name || '-',
    }
    const previous = await Discipline.query().where('student_id', incident.studentId).whereNot('id', incident.id).orderBy('incident_date', 'desc').limit(5)

    return ctx.view.render(
      'parent/discipline/details',
      await this.parentPageContext(ctx, {
        school: incident.student?.school || { id: user.schoolId, name: 'Gestion Educative RDC' },
        child,
        incident: {
          id: incident.id,
          date: incident.incidentDate,
          time: incident.incidentDate?.toFormat('HH:mm'),
          type: incident.incidentType,
          typeLabel: this.getIncidentTypeLabel(incident.incidentType),
          severity: incident.severity,
          severityLabel: this.getSeverityLabel(incident.severity),
          description: incident.description || '-',
          location: null,
          witnesses: null,
          actionTaken: incident.actionTaken,
          sanction: incident.sanction || 'none',
          sanctionLabel: this.getSanctionLabel(incident.sanction),
          sanctionDuration: null,
          parentNotified: Boolean(incident.parentNotifiedAt),
          parentNotifiedAt: incident.parentNotifiedAt,
          parentResponse: incident.parentResponse,
          parentResponded: Boolean(incident.parentResponse),
        },
        previousIncidents: previous.map((item) => ({
          id: item.id,
          date: item.incidentDate,
          typeLabel: this.getIncidentTypeLabel(item.incidentType),
          severity: item.severity,
          severityLabel: this.getSeverityLabel(item.severity),
        })),
      })
    )
  }

  public async attendanceJustifyPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const childId = String(ctx.request.input('child_id', '')).trim()
    const childModel = childId ? await this.getAuthorizedChild(user, childId) : null
    const fallbackChild = !childModel ? (await this.getParentChildren(user))[0] : null
    const child = childModel
      ? { id: childModel.id, name: childModel.user?.fullName || childModel.registrationNumber }
      : { id: fallbackChild?.id || '', name: fallbackChild?.name || '-' }
    return ctx.view.render(
      'parent/attendance/justify',
      await this.parentPageContext(ctx, {
        child,
        absenceDate: DateTime.now().toISODate(),
        recordId: ctx.request.input('record_id') || '',
        parent: { phone: user.phone || '' },
      })
    )
  }

  public async paymentsHistoryPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const children = await this.getParentChildren(user)
    const child = children.find((item) => item.id === ctx.request.input('child_id')) || children[0]
    if (!child) return ctx.response.redirect('/parent/payments')
    const rows = await FeePayment.query().where('student_id', child.id).preload('fee').orderBy('payment_date', 'desc')
    const payments = rows.map((payment) => ({
      id: payment.id,
      date: payment.paymentDate,
      receiptNumber: payment.receiptNumber || '-',
      feeType: payment.fee?.feeType || '-',
      description: payment.fee?.description || '-',
      amount: Number(payment.amountPaid || 0),
      method: payment.paymentMethod || 'other',
      methodLabel: this.getPaymentMethodLabel(payment.paymentMethod),
      referenceNumber: payment.referenceNumber || '-',
    }))
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0)

    return ctx.view.render(
      'parent/payments/history',
      await this.parentPageContext(ctx, {
        school: child.school || { id: user.schoolId, name: 'Gestion Educative RDC' },
        child,
        payments,
        stats: {
          totalTransactions: payments.length,
          totalAmount,
          averagePayment: payments.length ? totalAmount / payments.length : 0,
          worstYear: DateTime.now().year,
        },
        chartLabels: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'],
        chartValues: Array.from({ length: 12 }, (_, index) =>
          payments
            .filter((payment) => {
              const date = payment.date instanceof DateTime ? payment.date : DateTime.fromJSDate(payment.date as any)
              return date.month === index + 1
            })
            .reduce((sum, payment) => sum + payment.amount, 0)
        ),
      })
    )
  }

  public async paymentsStatusPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const children = await this.getParentChildren(user)
    const child = children.find((item) => item.id === ctx.request.input('child_id')) || children[0]
    if (!child) return ctx.response.redirect('/parent/payments')
    const fees = await SchoolFee.query().where('school_id', child.schoolId)
    const payments = await FeePayment.query().where('student_id', child.id)
    const totalAnnualFees = fees.reduce((sum, fee) => sum + Number(fee.amount || 0), 0)
    const totalPaid = payments.reduce((sum, payment) => sum + Number(payment.amountPaid || 0), 0)

    return ctx.view.render(
      'parent/payments/status',
      await this.parentPageContext(ctx, {
        school: child.school || { id: user.schoolId, name: 'Gestion Educative RDC' },
        child,
        totalAnnualFees,
        totalPaid,
        balance: Math.max(totalAnnualFees - totalPaid, 0),
        paymentsCount: payments.length,
        termDetails: ['T1', 'T2', 'T3'].map((term) => ({
          name: term,
          amount: totalAnnualFees / 3,
          paid: totalPaid / 3,
          balance: Math.max((totalAnnualFees - totalPaid) / 3, 0),
        })),
        upcomingDeadlines: [],
      })
    )
  }

  public async parentMessagesPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const messages = await Message.query()
      .where((query) => query.where('sender_id', user.id).orWhere('receiver_id', user.id))
      .whereNull('deleted_at')
      .preload('sender')
      .preload('receiver')
      .orderBy('created_at', 'desc')

    const conversationsMap = new Map<string, any>()
    for (const message of messages) {
      const otherUser = message.senderId === user.id ? message.receiver : message.sender
      if (!otherUser || conversationsMap.has(otherUser.id)) continue
      conversationsMap.set(otherUser.id, {
        userId: otherUser.id,
        userName: otherUser.fullName || otherUser.email,
        lastMessage: message.content,
        lastMessageTime: message.createdAt?.toFormat('dd/MM/yyyy HH:mm') || '',
        unreadCount: messages.filter((item) => item.senderId === otherUser.id && item.receiverId === user.id && !item.isRead).length,
      })
    }

    return ctx.view.render(
      'parent/messages/index',
      await this.parentPageContext(ctx, {
        conversations: Array.from(conversationsMap.values()),
        stats: {
          total: messages.length,
          unread: messages.filter((message) => message.receiverId === user.id && !message.isRead).length,
          sent: messages.filter((message) => message.senderId === user.id).length,
          conversations: conversationsMap.size,
        },
      })
    )
  }

  public async parentMessageSendPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const children = await this.getParentChildren(user)
    const schoolIds = Array.from(new Set(children.map((child) => child.schoolId).filter(Boolean)))
    const teachers = await this.getAppointmentTeachers(schoolIds as string[])
    const selectedTeacherId = String(ctx.request.input('teacher_id', '')).trim()
    return ctx.view.render(
      'parent/messages/send',
      await this.parentPageContext(ctx, {
        school: children[0]?.school || { id: user.schoolId, name: 'Gestion Educative RDC' },
        children,
        teachers: teachers.map((teacher) => ({ ...teacher, id: teacher.userId })),
        selectedChildId: ctx.request.input('student_id') || '',
        selectedTeacherId,
        selectedSubject: teachers.find((teacher) => teacher.userId === selectedTeacherId)?.subject || '',
      })
    )
  }

  public async sendParentMessage({ auth, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const receiverId = String(request.input('receiverId') || request.input('teacherId') || '').trim()
    const content = String(request.input('content') || '').trim()
    const subject = String(request.input('subject') || 'Message parent').trim()
    const studentId = String(request.input('studentId') || '').trim()

    if (!receiverId || !content) {
      session?.flash?.('error', 'Veuillez choisir un destinataire et saisir un message.')
      return response.redirect().back()
    }

    const message = new Message()
    message.senderId = user.id
    message.receiverId = receiverId
    message.subject = request.input('urgent') ? `[URGENT] ${subject}` : subject
    message.content = content
    message.type = 'parent_teacher'
    message.schoolId = user.schoolId
    if (studentId) {
      const child = await this.getAuthorizedChild(user, studentId)
      message.schoolId = child.schoolId
    }
    await message.save()

    const expectsJson =
      request.url().startsWith('/api/') ||
      request.header('accept')?.includes('application/json') ||
      request.header('content-type')?.includes('application/json')

    if (expectsJson) {
      return response.created({ success: true, message })
    }
    session.flash('success', 'Message envoye avec succes.')
    return response.redirect('/parent/messages')
  }

  public async parentConversationPage(ctx: HttpContext) {
    const receiver = await User.findOrFail(ctx.params.id)
    return ctx.view.render(
      'parent/messages/conversation',
      await this.parentPageContext(ctx, {
        receiver: {
          id: receiver.id,
          name: receiver.fullName || receiver.email,
          roleLabel: receiver.role === 'teacher' ? 'Enseignant' : receiver.role,
        },
      })
    )
  }

  public async parentConversationData({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const rows = await Message.query()
      .where((query) => {
        query
          .where((q) => q.where('sender_id', user.id).where('receiver_id', params.userId))
          .orWhere((q) => q.where('sender_id', params.userId).where('receiver_id', user.id))
      })
      .whereNull('deleted_at')
      .orderBy('created_at', 'asc')

    return response.ok({
      success: true,
      messages: rows.map((message) => ({
        id: message.id,
        content: message.content,
        isMine: message.senderId === user.id,
        time: message.createdAt?.toFormat('dd/MM/yyyy HH:mm') || '',
      })),
    })
  }

  public async markConversationRead({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    await Message.query()
      .where('sender_id', params.userId)
      .where('receiver_id', user.id)
      .where('is_read', false)
      .update({ is_read: true, read_at: DateTime.now().toSQL() })
    return response.ok({ success: true })
  }

  public async markAllParentMessagesRead({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    await Message.query().where('receiver_id', user.id).where('is_read', false).update({ is_read: true, read_at: DateTime.now().toSQL() })
    return response.ok({ success: true })
  }

  public async parentNotificationsPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const messages = await Message.query().where('receiver_id', user.id).orderBy('created_at', 'desc').limit(50)
    const notifications = messages.map((message) => ({
      id: message.id,
      type: 'message',
      title: message.subject || 'Nouveau message',
      message: message.content,
      isRead: message.isRead,
      time: message.createdAt?.toFormat('dd/MM/yyyy HH:mm') || '',
      link: `/parent/messages/${message.senderId}`,
    }))

    return ctx.view.render(
      'parent/messages/notifications',
      await this.parentPageContext(ctx, {
        notifications,
        stats: {
          total: notifications.length,
          unread: notifications.filter((notification) => !notification.isRead).length,
          read: notifications.filter((notification) => notification.isRead).length,
          thisWeek: notifications.length,
        },
      })
    )
  }

  public async parentUnreadCount({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const unread = await Message.query().where('receiver_id', user.id).where('is_read', false).count('* as total')
    return response.ok({ unread: Number(unread[0].$extras.total || 0) })
  }

  public async childrenStats({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const children = await this.getParentChildren(user)
    const averages = children.map((child) => Number(child.averageGrade)).filter(Number.isFinite)
    return response.ok({
      total: children.length,
      averageGrade: this.formatScore(this.average(averages)),
      attendanceRate: children.length
        ? Math.round(children.reduce((sum, child) => sum + Number(child.attendanceRate || 0), 0) / children.length)
        : 0,
      totalPayments: 0,
    })
  }

  public async exportGrades({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const child = await this.getAuthorizedChild(user, String(request.input('child_id')))
    const grades = await Grade.query().where('student_id', child.id).preload('subject')
    return this.csv(
      response,
      'notes-parent.csv',
      grades.map((grade) => ({
        enfant: child.user?.fullName || child.registrationNumber,
        matiere: grade.subject?.name || '-',
        note: grade.score,
        trimestre: grade.term,
        date: grade.examDate?.toFormat('dd/MM/yyyy') || '',
      }))
    )
  }

  public async exportAttendance({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const child = await this.getAuthorizedChild(user, String(request.input('child_id')))
    const records = await db.from('attendances').where('student_id', child.id).orderBy('date', 'desc')
    return this.csv(response, 'presences-parent.csv', records)
  }

  public async exportPayments({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const child = await this.getAuthorizedChild(user, String(request.input('child_id')))
    const payments = await FeePayment.query().where('student_id', child.id).preload('fee')
    return this.csv(
      response,
      'paiements-parent.csv',
      payments.map((payment) => ({
        recu: payment.receiptNumber,
        frais: payment.fee?.feeType,
        montant: payment.amountPaid,
        date: payment.paymentDate?.toFormat('dd/MM/yyyy') || '',
      }))
    )
  }

  public async cancelAppointment({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    await Message.query().where('id', params.id).where('sender_id', user.id).update({ deleted_at: DateTime.now().toSQL() })
    return response.ok({ success: true })
  }

  public async appointmentSchedule({ response }: HttpContext) {
    return response.ok({ success: true, appointments: [] })
  }

  public async exportAppointments(ctx: HttpContext) {
    return this.csv(ctx.response, 'rendez-vous-parent.csv', [])
  }

  public async respondToIncident({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const incident = await Discipline.findOrFail(params.id)
    await this.getAuthorizedChild(user, incident.studentId)
    await Discipline.query().where('id', incident.id).update({
      parent_response: request.input('response'),
      parent_notified_at: DateTime.now().toSQL(),
    })
    return response.ok({ success: true })
  }

  public async markNotificationRead(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    await Message.query()
      .where('id', ctx.params.id)
      .where('receiver_id', user.id)
      .update({ is_read: true, read_at: DateTime.now().toSQL() })
    return ctx.response.ok({ success: true })
  }

  public async markAllNotificationsRead(ctx: HttpContext) {
    return this.markAllParentMessagesRead(ctx)
  }

  public async deleteAllNotifications({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    await Message.query().where('receiver_id', user.id).update({ deleted_at: DateTime.now().toSQL() })
    return response.ok({ success: true })
  }
}
