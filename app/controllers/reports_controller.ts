import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import { edgePageContext } from '#start/view_context'
import { DateTime } from 'luxon'
import { mkdir, readdir, stat, unlink, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { randomUUID } from 'node:crypto'

export default class ReportsController {
  private exportDir() {
    return app.publicPath('reports/exports')
  }

  private schoolId(ctx: HttpContext) {
    return ctx.auth.user?.schoolId || ''
  }

  private currentYear() {
    return DateTime.now().year
  }

  private async classes(schoolId: string) {
    if (!schoolId) return []
    return db
      .from('classes')
      .where('school_id', schoolId)
      .whereNull('archived_at')
      .orderBy('grade_level', 'asc')
      .orderBy('name', 'asc')
      .select('id', 'name', 'level', 'grade_level')
  }

  private async firstClassId(schoolId: string) {
    const row = await db.from('classes').where('school_id', schoolId).whereNull('archived_at').select('id').first()
    return row?.id || ''
  }

  private async firstSubject() {
    const row = await db.from('subjects').orderBy('name', 'asc').select('id', 'name', 'coefficient').first()
    return row || { id: '', name: 'Matiere', coefficient: 1 }
  }

  private async firstStudent(schoolId: string) {
    const row = await db
      .from('students')
      .leftJoin('users', 'students.user_id', 'users.id')
      .leftJoin('classes', 'students.class_id', 'classes.id')
      .where('students.school_id', schoolId)
      .select(
        'students.id',
        'students.registration_number',
        'students.birth_date',
        'students.parent_phone',
        'users.first_name',
        'users.last_name',
        'users.postnom',
        'classes.name as class_name'
      )
      .first()

    if (!row) {
      return {
        id: '',
        name: 'Eleve',
        className: '-',
        registrationNumber: '-',
        birthDate: '-',
        parentName: '-',
      }
    }

    return {
      id: row.id,
      name: [row.first_name, row.last_name, row.postnom].filter(Boolean).join(' ') || 'Eleve',
      className: row.class_name || '-',
      registrationNumber: row.registration_number || '-',
      birthDate: row.birth_date ? DateTime.fromJSDate(row.birth_date).toFormat('dd/MM/yyyy') : '-',
      parentName: row.parent_phone || '-',
    }
  }

  private csvValue(value: unknown) {
    const text = String(value ?? '').replace(/\r?\n/g, ' ').trim()
    return `"${text.replace(/"/g, '""')}"`
  }

  private sendExport(response: HttpContext['response'], name: string, data: unknown, format = 'csv') {
    const extension = format === 'excel' ? 'csv' : format
    const filename = `${name}-${DateTime.now().toFormat('yyyyLLdd-HHmm')}.${extension}`
    if (format === 'json') {
      response.header('Content-Type', 'application/json; charset=utf-8')
      response.header('Content-Disposition', `attachment; filename="${filename}"`)
      return response.send(JSON.stringify(data, null, 2))
    }

    const rows = Array.isArray(data) ? data : Object.entries(data as Record<string, unknown>)
    const csv = Array.isArray(rows[0])
      ? (rows as unknown[][]).map((row) => row.map((value) => this.csvValue(value)).join(',')).join('\n')
      : Object.entries(data as Record<string, unknown>)
          .map(([key, value]) => [key, value].map((entry) => this.csvValue(entry)).join(','))
          .join('\n')

    response.header('Content-Type', 'text/csv; charset=utf-8')
    response.header('Content-Disposition', `attachment; filename="${filename}"`)
    return response.send(`\uFEFF${csv}`)
  }

  private groupTotals(rows: any[], labelKey: string, valueKey = 'amount') {
    const totals = new Map<string, number>()
    rows.forEach((row) => {
      const label = String(row[labelKey] || 'Non precise')
      totals.set(label, (totals.get(label) || 0) + Number(row[valueKey] || 0))
    })
    return {
      labels: [...totals.keys()],
      values: [...totals.values()],
    }
  }

  private monthLabels(count = 6) {
    return Array.from({ length: count }, (_, index) =>
      DateTime.now().minus({ months: count - index - 1 }).toFormat('LLL')
    )
  }

  private async payments(schoolId: string) {
    if (!schoolId) return []
    return db
      .from('fee_payments')
      .leftJoin('students', 'fee_payments.student_id', 'students.id')
      .leftJoin('users', 'students.user_id', 'users.id')
      .leftJoin('school_fees', 'fee_payments.fee_id', 'school_fees.id')
      .where('students.school_id', schoolId)
      .select(
        'fee_payments.amount_paid',
        'fee_payments.payment_date',
        'fee_payments.payment_method',
        'fee_payments.receipt_number',
        'school_fees.fee_type',
        'users.first_name',
        'users.last_name',
        'users.postnom'
      )
  }

  private formatPayments(rows: any[]) {
    return rows.map((row) => ({
      date: row.payment_date ? DateTime.fromJSDate(row.payment_date).toFormat('dd/MM/yyyy') : '-',
      studentName: [row.first_name, row.last_name, row.postnom].filter(Boolean).join(' ') || '-',
      feeType: row.fee_type || 'Frais',
      amount: Number(row.amount_paid || 0),
      method: row.payment_method || '-',
      receiptNumber: row.receipt_number || '-',
    }))
  }

  private async incidents(schoolId: string) {
    if (!schoolId) return []
    return db
      .from('disciplines')
      .leftJoin('students', 'disciplines.student_id', 'students.id')
      .leftJoin('users', 'students.user_id', 'users.id')
      .leftJoin('classes', 'students.class_id', 'classes.id')
      .where('students.school_id', schoolId)
      .select(
        'disciplines.id',
        'disciplines.incident_date',
        'disciplines.incident_type',
        'disciplines.severity',
        'disciplines.sanction',
        'disciplines.action_taken',
        'students.id as student_id',
        'classes.name as class_name',
        'users.first_name',
        'users.last_name',
        'users.postnom'
      )
  }

  private zeroChart(labels: string[] = []) {
    return { labels, values: labels.map(() => 0) }
  }

  public async academicClassPage(ctx: HttpContext) {
    const schoolId = this.schoolId(ctx)
    const classId = String(ctx.request.input('class_id') || (await this.firstClassId(schoolId)))
    const classes = await this.classes(schoolId)
    const selectedClass = classes.find((classObj) => classObj.id === classId) || classes[0] || { name: 'Classe' }
    const subjects = await db.from('subjects').orderBy('name', 'asc').select('id', 'name')
    const students = await db
      .from('students')
      .leftJoin('users', 'students.user_id', 'users.id')
      .where('students.class_id', classId || '__none__')
      .select('students.registration_number', 'users.first_name', 'users.last_name', 'users.postnom')

    const formattedStudents = students.map((student, index) => ({
      rank: index + 1,
      registrationNumber: student.registration_number || '-',
      name: [student.first_name, student.last_name, student.postnom].filter(Boolean).join(' ') || '-',
      average: 0,
    }))

    return ctx.view.render(
      'reports/academic/class-report',
      await edgePageContext(ctx, {
        classId,
        term: ctx.request.input('term', 'T1'),
        academicYear: ctx.request.input('year', `${this.currentYear()}`),
        stats: {
          totalStudents: formattedStudents.length,
          averageGrade: 0,
          successRate: 0,
          bestStudent: formattedStudents[0]?.name || '-',
        },
        className: selectedClass.name,
        subjects,
        students: formattedStudents,
        subjectLabels: subjects.map((subject) => subject.name),
        subjectAverages: subjects.map(() => 0),
      })
    )
  }

  public async academicPerformancePage(ctx: HttpContext) {
    return ctx.view.render(
      'reports/academic/performance',
      await edgePageContext(ctx, {
        classes: await this.classes(this.schoolId(ctx)),
      })
    )
  }

  public async academicSchoolPage(ctx: HttpContext) {
    const context = await edgePageContext(ctx)
    const schoolId = this.schoolId(ctx)
    const [students, classes] = await Promise.all([
      db.from('students').where('school_id', schoolId).count('* as total').first(),
      db.from('classes').where('school_id', schoolId).whereNull('archived_at').count('* as total').first(),
    ])

    return ctx.view.render('reports/academic/school-report', {
      ...context,
      schoolName: (context.school as any)?.name || 'Etablissement',
      documentTitle: "Rapport scolaire de l'etablissement",
      academicYear: `${this.currentYear() - 1}-${this.currentYear()}`,
      termLabel: 'Annee scolaire',
      generationDate: DateTime.now().toFormat('dd/MM/yyyy'),
      stats: {
        totalStudents: Number(students?.total || 0),
        totalClasses: Number(classes?.total || 0),
        overallAverage: 0,
        successRate: 0,
        passedCount: 0,
        failedCount: 0,
      },
      classesData: [],
      topStudents: [],
      subjectsPerformance: [],
      trend: { y1: 0, y2: 0, y3: 0, y3Percent: 0 },
      recommendations: 'Completez les notes pour obtenir une analyse detaillee.',
    })
  }

  public async studentProgressPage(ctx: HttpContext) {
    return ctx.view.render(
      'reports/academic/student-progress',
      await edgePageContext(ctx, {
        student: await this.firstStudent(this.schoolId(ctx)),
        subjectDetails: [],
      })
    )
  }

  public async subjectReportPage(ctx: HttpContext) {
    return ctx.view.render(
      'reports/academic/subject-report',
      await edgePageContext(ctx, {
        subject: await this.firstSubject(),
        term: ctx.request.input('term', 'T1'),
        academicYear: ctx.request.input('year', `${this.currentYear()}`),
        stats: { average: 0, best: 0, worst: 0, successRate: 0 },
      })
    )
  }

  public async academicPerformanceData(ctx: HttpContext) {
    const classes = await this.classes(this.schoolId(ctx))
    const labels = classes.map((classObj) => classObj.name)
    return ctx.response.ok({
      summary: { average: 0, successRate: 0, excellentCount: 0, difficultCount: 0, trend: 0 },
      trend: { labels: ['T1', 'T2', 'T3'], current: [0, 0, 0], previous: [0, 0, 0] },
      classPerformance: this.zeroChart(labels),
      subjectPerformance: this.zeroChart([]),
      classDetails: labels.map((className) => ({
        className,
        studentsCount: 0,
        average: 0,
        successRate: 0,
        excellentCount: 0,
        goodCount: 0,
        averageCount: 0,
        passCount: 0,
        failCount: 0,
      })),
      distribution: [
        { range: '16-20', count: 0, percentage: 0, color: 'green' },
        { range: '10-15', count: 0, percentage: 0, color: 'yellow' },
        { range: '0-9', count: 0, percentage: 0, color: 'red' },
      ],
    })
  }

  public async financialIncomeData(ctx: HttpContext) {
    const rows = await this.payments(this.schoolId(ctx))
    const transactions = this.formatPayments(rows)
    const total = transactions.reduce((sum, item) => sum + item.amount, 0)
    const byType = this.groupTotals(transactions, 'feeType')
    return ctx.response.ok({
      summary: {
        total,
        count: transactions.length,
        average: transactions.length ? Math.round(total / transactions.length) : 0,
        bestDay: transactions[0]?.date || '--',
      },
      daily: this.zeroChart(this.monthLabels(7)),
      byType,
      monthly: this.zeroChart(this.monthLabels(6)),
      topContributors: transactions.slice(0, 10).map((item) => ({ name: item.studentName, total: item.amount })),
      transactions,
    })
  }

  public async financialExpensesData(ctx: HttpContext) {
    return ctx.response.ok({
      summary: { total: 0, count: 0, average: 0, largest: 0 },
      trend: this.zeroChart(this.monthLabels(6)),
      byCategory: this.zeroChart(['Salaires', 'Fournitures', 'Maintenance']),
      topSuppliers: [],
      monthly: { labels: this.monthLabels(6), current: [0, 0, 0, 0, 0, 0], previous: [0, 0, 0, 0, 0, 0] },
      expenses: [],
    })
  }

  public async financialBalanceData(ctx: HttpContext) {
    const rows = await this.payments(this.schoolId(ctx))
    const totalIncome = rows.reduce((sum, row) => sum + Number(row.amount_paid || 0), 0)
    return ctx.response.ok({
      summary: {
        totalIncome,
        totalExpenses: 0,
        netBalance: totalIncome,
        grossMargin: totalIncome ? 100 : 0,
        operatingRatio: 0,
        liquidity: totalIncome,
      },
      trend: { labels: this.monthLabels(6), income: [0, 0, 0, 0, 0, totalIncome], expenses: [0, 0, 0, 0, 0, 0] },
      incomeBreakdown: this.groupTotals(this.formatPayments(rows), 'feeType'),
      expensesBreakdown: this.zeroChart(['Depenses']),
      cashFlow: this.monthLabels(6).map((month) => ({ month, flow: 0 })),
      periodic: this.monthLabels(6).map((period) => ({ period, income: 0, expenses: 0, balance: 0, growth: 0 })),
    })
  }

  public async financialForecastsData(ctx: HttpContext) {
    const labels = this.monthLabels(Number(ctx.request.input('horizon', 6)))
    return ctx.response.ok({
      summary: { totalIncome: 0, totalExpenses: 0, netBalance: 0, growthRate: 0 },
      monthly: {
        labels,
        income: labels.map(() => 0),
        expenses: labels.map(() => 0),
        balance: labels.map(() => 0),
      },
      scenarios: {
        optimistic: labels.map(() => 0),
        realistic: labels.map(() => 0),
        pessimistic: labels.map(() => 0),
      },
      details: labels.map((month) => ({ month, income: 0, expenses: 0, balance: 0, trend: 0 })),
      recommendations: 'Les previsions seront plus fiables apres plusieurs mois de donnees financieres.',
    })
  }

  public async disciplinarySummaryData(ctx: HttpContext) {
    const rows = await this.incidents(this.schoolId(ctx))
    const byType = this.groupTotals(rows.map((row) => ({ type: row.incident_type || 'Incident', amount: 1 })), 'type')
    const bySeverity = this.groupTotals(rows.map((row) => ({ severity: row.severity || 'mineur', amount: 1 })), 'severity')
    return ctx.response.ok({
      summary: {
        totalIncidents: rows.length,
        majorIncidents: rows.filter((row) => ['major', 'severe', 'grave'].includes(String(row.severity))).length,
        totalSanctions: rows.filter((row) => row.sanction).length,
        resolutionRate: rows.length ? Math.round((rows.filter((row) => row.action_taken).length / rows.length) * 100) : 0,
      },
      byType,
      bySeverity,
      byClass: this.groupTotals(rows.map((row) => ({ className: row.class_name || 'Classe', amount: 1 })), 'className'),
      bySanction: this.groupTotals(rows.map((row) => ({ sanction: row.sanction || 'Aucune', amount: 1 })), 'sanction'),
      topStudents: rows.slice(0, 10).map((row) => ({
        name: [row.first_name, row.last_name, row.postnom].filter(Boolean).join(' ') || '-',
        className: row.class_name || '-',
        incidentCount: 1,
        majorCount: 0,
        sanctionsCount: row.sanction ? 1 : 0,
      })),
      recentIncidents: rows.slice(0, 20).map((row) => ({
        date: row.incident_date ? DateTime.fromJSDate(row.incident_date).toFormat('dd/MM/yyyy') : '-',
        studentName: [row.first_name, row.last_name, row.postnom].filter(Boolean).join(' ') || '-',
        typeLabel: row.incident_type || '-',
        severityLabel: row.severity || '-',
        sanctionLabel: row.sanction || '-',
        status: row.action_taken ? 'resolved' : 'pending',
      })),
    })
  }

  public async disciplinaryTrendsData(ctx: HttpContext) {
    const labels = this.monthLabels(Number(ctx.request.input('months', 6)))
    return ctx.response.ok({
      summary: { annualGrowth: 0, peakMonth: labels.at(-1) || '-', lowMonth: labels[0] || '-', trend: 'stable' },
      global: this.zeroChart(labels),
      forecast: { labels, historical: labels.map(() => 0), predicted: labels.map(() => 0) },
      byType: { labels, datasets: [] },
      byClass: { labels, datasets: [] },
      seasonal: { averages: Array(12).fill(0), analysis: 'Aucune tendance saisonniere detectee.' },
      details: labels.map((period) => ({ period, incidents: 0, change: 0, movingAverage: 0, forecast: 0 })),
    })
  }

  public async disciplinaryComparisonsData(ctx: HttpContext) {
    return ctx.response.ok({
      global: {
        totalYear1: 0,
        totalYear2: 0,
        totalChange: 0,
        majorYear1: 0,
        majorYear2: 0,
        majorChange: 0,
        resYear1: 0,
        resYear2: 0,
        resChange: 0,
      },
      byType: { labels: [], year1: [], year2: [] },
      byClass: [],
      improvements: [],
      declines: [],
    })
  }

  public async reportsPage(ctx: HttpContext, viewName: string) {
    return ctx.view.render(viewName, await edgePageContext(ctx, { classes: await this.classes(this.schoolId(ctx)) }))
  }

  public async exportsPage(ctx: HttpContext) {
    const exports = await this.listExports(ctx)
    return ctx.view.render(
      'reports/exports/index',
      await edgePageContext(ctx, {
        exports,
        stats: {
          total: exports.length,
          thisMonth: exports.length,
          pending: 0,
          formats: 4,
        },
        pagination: { total: exports.length, perPage: 50, currentPage: 1, lastPage: 1 },
      })
    )
  }

  public async exportsGeneratePage(ctx: HttpContext) {
    return ctx.view.render('reports/exports/generate', await edgePageContext(ctx))
  }

  public async exportsDownloadsPage(ctx: HttpContext) {
    const downloads = await this.listExports(ctx)
    return ctx.view.render(
      'reports/exports/downloads',
      await edgePageContext(ctx, {
        downloads,
        stats: {
          total: downloads.length,
          totalSize: `${downloads.length} fichier(s)`,
          thisMonth: downloads.length,
          lastDownload: downloads[0]?.downloadedAt || '-',
        },
        pagination: { total: downloads.length, perPage: 50, currentPage: 1, lastPage: 1 },
      })
    )
  }

  private async listExports(_ctx: HttpContext) {
    await mkdir(this.exportDir(), { recursive: true })
    const files = await readdir(this.exportDir())
    const entries = await Promise.all(
      files.map(async (file) => {
        const filePath = join(this.exportDir(), file)
        const info = await stat(filePath)
        const [type = 'custom', format = 'csv'] = file.split('-')
        return {
          id: file,
          filename: file,
          type,
          format: format.replace(/\..+$/, ''),
          size: `${Math.max(1, Math.round(info.size / 1024))} KB`,
          status: 'completed',
          createdAt: DateTime.fromJSDate(info.birthtime),
          downloadedAt: DateTime.fromJSDate(info.mtime).toFormat('dd/MM/yyyy HH:mm'),
          downloadCount: 1,
        }
      })
    )
    return entries.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
  }

  public async generateExport({ request, response }: HttpContext) {
    await mkdir(this.exportDir(), { recursive: true })
    const type = String(request.input('reportType', 'custom'))
    const format = String(request.input('format', 'csv'))
    const extension = format === 'excel' ? 'csv' : format
    const filename = `${type}-${format}-${DateTime.now().toFormat('yyyyLLdd-HHmmss')}-${randomUUID().slice(0, 8)}.${extension}`
    const content =
      format === 'json'
        ? JSON.stringify({ type, generatedAt: DateTime.now().toISO(), filters: request.all() }, null, 2)
        : `Type,Genere le\n${this.csvValue(type)},${this.csvValue(DateTime.now().toFormat('dd/MM/yyyy HH:mm'))}\n`
    await writeFile(join(this.exportDir(), filename), content, 'utf8')
    return response.redirect('/reports/exports')
  }

  public async downloadExport({ params, response }: HttpContext) {
    const filename = basename(String(params.id))
    return response.download(join(this.exportDir(), filename))
  }

  public async deleteExport({ params, response }: HttpContext) {
    const filename = basename(String(params.id))
    await unlink(join(this.exportDir(), filename)).catch(() => null)
    return response.ok({ success: true })
  }

  public async exportData(ctx: HttpContext) {
    const name = String(ctx.params.name || 'rapport')
    return this.sendExport(ctx.response, name, { rapport: name, genereLe: DateTime.now().toISO() }, ctx.request.input('format', 'csv'))
  }
}
