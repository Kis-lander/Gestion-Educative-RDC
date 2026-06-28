import { type HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import SchoolFee from '#models/school_fee'
import FeePayment from '#models/fee_payment'
import Student from '#models/student'
// import Message from '#models/message'
import {
  setSchoolFeesValidator,
  recordPaymentValidator,
  updateFeesValidator,
} from '#validators/financial'
import { DateTime } from 'luxon'

export default class FinancialController {
  private getPaginationMeta(paginator: { toJSON: () => any }) {
    const meta = paginator.toJSON().meta

    return {
      total: meta.total,
      perPage: meta.perPage,
      currentPage: meta.currentPage,
      lastPage: meta.lastPage,
      from: meta.total ? (meta.currentPage - 1) * meta.perPage + 1 : 0,
      to: Math.min(meta.currentPage * meta.perPage, meta.total),
    }
  }

  private getFallbackSchool(user: { schoolId?: string | null }) {
    return {
      id: user.schoolId,
      name: 'Gestion Éducative RDC',
    }
  }

  private toCsv(rows: unknown[][]) {
    return rows
      .map((row) =>
        row
          .map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`)
          .join(',')
      )
      .join('\n')
  }

  public async paymentsPage({ auth, request, view }: HttpContext) {
    const user = auth.user!
    const page = Number(request.input('page', 1))
    const startDate = request.input('start_date')
    const endDate = request.input('end_date')
    const method = request.input('method')
    const feeType = request.input('fee_type')
    const search = String(request.input('search', '')).trim()

    const query = FeePayment.query()
      .whereHas('fee', (feeQuery) => feeQuery.where('school_id', user.schoolId!))
      .preload('fee')
      .preload('student', (studentQuery) => studentQuery.preload('user'))
      .preload('recorder')
      .if(startDate && endDate, (paymentQuery) => {
        paymentQuery.whereBetween('payment_date', [startDate, endDate])
      })
      .if(method, (paymentQuery) => paymentQuery.where('payment_method', method))
      .if(feeType, (paymentQuery) => {
        paymentQuery.whereHas('fee', (feeQuery) => feeQuery.where('fee_type', feeType))
      })
      .if(search, (paymentQuery) => {
        paymentQuery.where((searchQuery) => {
          searchQuery
            .whereILike('receipt_number', `%${search}%`)
            .orWhereHas('student', (studentQuery) => {
              studentQuery.whereHas('user', (userQuery) => {
                userQuery
                  .whereILike('first_name', `%${search}%`)
                  .orWhereILike('last_name', `%${search}%`)
              })
            })
        })
      })
      .orderBy('payment_date', 'desc')

    const paginator = await query.paginate(page, 20)
    const allPayments = await FeePayment.query()
      .whereHas('fee', (feeQuery) => feeQuery.where('school_id', user.schoolId!))
      .preload('fee')
    const byMethod = allPayments.reduce<Record<string, number>>((totals, payment) => {
      const key = payment.paymentMethod || 'unknown'
      totals[key] = (totals[key] || 0) + Number(payment.amountPaid || 0)
      return totals
    }, {})
    const byFeeMap = allPayments.reduce<Record<string, number>>((totals, payment) => {
      const key = payment.fee?.feeType || 'Autre'
      totals[key] = (totals[key] || 0) + Number(payment.amountPaid || 0)
      return totals
    }, {})
    const totalAmount = allPayments.reduce((sum, payment) => sum + Number(payment.amountPaid || 0), 0)
    const today = DateTime.now().toISODate()
    const feeTypes = await SchoolFee.query()
      .where('school_id', user.schoolId!)
      .select('fee_type')
      .groupBy('fee_type')
      .orderBy('fee_type', 'asc')

    return view.render('financial/payments/index', {
      school: this.getFallbackSchool(user),
      payments: paginator.all().map((payment) => ({
        id: payment.id,
        paymentDate: payment.paymentDate,
        receiptNumber: payment.receiptNumber,
        studentName: payment.student?.user?.fullName || '-',
        registrationNumber: payment.student?.registrationNumber || '-',
        feeType: payment.fee?.feeType || '-',
        amountPaid: payment.amountPaid,
        currency: payment.currency || payment.fee?.currency || 'USD',
        paymentMethod: payment.paymentMethod,
        recordedByName: payment.recorder?.fullName || '-',
      })),
      stats: {
        total: allPayments.length,
        totalAmount,
        averagePayment: allPayments.length ? totalAmount / allPayments.length : 0,
        todayCount: allPayments.filter((payment) => payment.paymentDate?.toISODate() === today).length,
        byMethod,
        byFeeType: Object.entries(byFeeMap).map(([type, total]) => ({ type, total })),
        trend: 0,
      },
      pagination: this.getPaginationMeta(paginator),
      url: '/financial/payments',
      filters: { startDate, endDate, method, feeType, search },
      feeTypes: feeTypes.map((fee) => fee.feeType).filter(Boolean),
    })
  }

  public async feesPage({ auth, request, view }: HttpContext) {
    const user = auth.user!
    const page = Number(request.input('page', 1))
    const type = request.input('type')
    const term = request.input('term')
    const year = request.input('year')

    const query = SchoolFee.query()
      .where('school_id', user.schoolId!)
      .if(type, (feeQuery) => feeQuery.where('fee_type', type))
      .if(term, (feeQuery) => feeQuery.where('term', term))
      .if(year, (feeQuery) => feeQuery.where('academic_year', year))
      .orderBy('created_at', 'desc')

    const paginator = await query.paginate(page, 20)
    const fees = await SchoolFee.query().where('school_id', user.schoolId!)
    const payments = await FeePayment.query()
      .whereHas('fee', (feeQuery) => feeQuery.where('school_id', user.schoolId!))
      .preload('fee')
    const collectedByFee = payments.reduce<Record<string, number>>((totals, payment) => {
      totals[payment.feeId] = (totals[payment.feeId] || 0) + Number(payment.amountPaid || 0)
      return totals
    }, {})
    const totalAmount = fees.reduce((sum, fee) => sum + Number(fee.amount || 0), 0)
    const totalCollected = payments.reduce((sum, payment) => sum + Number(payment.amountPaid || 0), 0)
    const typeSummaryMap = fees.reduce<Record<string, { total: number; count: number }>>(
      (summary, fee) => {
        const key = fee.feeType || 'Autre'
        summary[key] = summary[key] || { total: 0, count: 0 }
        summary[key].total += Number(fee.amount || 0)
        summary[key].count += 1
        return summary
      },
      {}
    )
    const feeTypes = Object.keys(typeSummaryMap).sort((left, right) => left.localeCompare(right))

    return view.render('financial/fees/index', {
      school: this.getFallbackSchool(user),
      fees: paginator.all().map((fee) => {
        const collected = collectedByFee[fee.id] || 0
        const amount = Number(fee.amount || 0)

        return {
          id: fee.id,
          type: fee.feeType,
          description: fee.description,
          amount,
          currency: fee.currency || 'USD',
          term: fee.term,
          dueDate: null,
          status: 'active',
          isMandatory: fee.isMandatory,
          collectionRate: amount ? Math.min(100, Math.round((collected / amount) * 100)) : 0,
        }
      }),
      stats: {
        total: fees.length,
        active: fees.length,
        totalAmount,
        collected: totalAmount ? Math.round((totalCollected / totalAmount) * 100) : 0,
      },
      currentYear: DateTime.now().year,
      typeSummary: Object.entries(typeSummaryMap).map(([summaryType, summary]) => ({
        type: summaryType,
        total: summary.total,
        count: summary.count,
      })),
      feeTypes,
      pagination: this.getPaginationMeta(paginator),
      url: '/financial/fees',
    })
  }

  public async createFeePage({ auth, view }: HttpContext) {
    return view.render('financial/fees/create', {
      school: this.getFallbackSchool(auth.user!),
      currentYear: DateTime.now().year,
    })
  }

  public async feesStructurePage({ auth, view }: HttpContext) {
    const feeTypes = await SchoolFee.query()
      .where('school_id', auth.user!.schoolId!)
      .select('fee_type')
      .groupBy('fee_type')
      .orderBy('fee_type', 'asc')

    return view.render('financial/fees/structure', {
      school: this.getFallbackSchool(auth.user!),
      currentYear: DateTime.now().year,
      feeTypes: feeTypes.map((fee) => fee.feeType).filter(Boolean),
      structure: [],
    })
  }

  public async incomeReportPage({ auth, view }: HttpContext) {
    const feeTypes = await SchoolFee.query()
      .where('school_id', auth.user!.schoolId!)
      .select('fee_type')
      .groupBy('fee_type')
      .orderBy('fee_type', 'asc')

    return view.render('financial/reports/income', {
      school: this.getFallbackSchool(auth.user!),
      feeTypes: feeTypes.map((fee) => fee.feeType).filter(Boolean),
    })
  }

  public async outstandingReportPage({ auth, view }: HttpContext) {
    const classes = await db
      .from('classes')
      .where('school_id', auth.user!.schoolId!)
      .whereNull('archived_at')
      .select('id', 'name')
      .orderBy('name', 'asc')

    return view.render('financial/reports/outstanding', {
      school: this.getFallbackSchool(auth.user!),
      classes,
    })
  }

  public async statisticsReportPage({ auth, view }: HttpContext) {
    return view.render('financial/reports/statistics', {
      school: this.getFallbackSchool(auth.user!),
      currentYear: DateTime.now().year,
    })
  }

  public async exportReport({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const format = String(request.input('format', 'csv')).toLowerCase()

    if (format !== 'csv') {
      return response.badRequest({ message: 'Seul le format CSV est disponible pour cet export.' })
    }

    const payments = await FeePayment.query()
      .whereHas('fee', (feeQuery) => feeQuery.where('school_id', user.schoolId!))
      .preload('fee')
      .preload('student', (studentQuery) => {
        studentQuery.preload('user')
        studentQuery.preload('class')
      })
      .preload('recorder')
      .orderBy('payment_date', 'desc')
      .limit(5000)

    const rows = [
      [
        'Date',
        'Recu',
        'Eleve',
        'Matricule',
        'Classe',
        'Type de frais',
        'Montant',
        'Devise',
        'Methode',
        'Reference',
        'Enregistre par',
      ],
      ...payments.map((payment) => [
        payment.paymentDate?.toFormat('dd/MM/yyyy') || '',
        payment.receiptNumber,
        payment.student?.user?.fullName || '',
        payment.student?.registrationNumber || '',
        payment.student?.class?.name || '',
        payment.fee?.feeType || '',
        payment.amountPaid,
        payment.currency || payment.fee?.currency || 'USD',
        this.getPaymentMethodLabel(payment.paymentMethod),
        payment.referenceNumber || '',
        payment.recorder?.fullName || '',
      ]),
    ]

    response.header('Content-Type', 'text/csv; charset=utf-8')
    response.header('Content-Disposition', 'attachment; filename="rapport-financier.csv"')
    return response.send(this.toCsv(rows))
  }

  public async editFeePage({ auth, params, view }: HttpContext) {
    const fee = await SchoolFee.query()
      .where('id', params.id)
      .where('school_id', auth.user!.schoolId!)
      .firstOrFail()
    const totalCollectedResult = await FeePayment.query().where('fee_id', fee.id).sum('amount_paid as total')
    const totalCollected = Number(totalCollectedResult[0]?.$extras.total || 0)
    const collectionRate = fee.amount ? Math.min(100, Math.round((totalCollected / fee.amount) * 100)) : 0

    return view.render('financial/fees/edit', {
      school: this.getFallbackSchool(auth.user!),
      fee: {
        id: fee.id,
        type: fee.feeType,
        description: fee.description,
        amount: fee.amount,
        currency: fee.currency || 'USD',
        term: fee.term,
        academicYear: fee.academicYear,
        dueDate: null,
        isMandatory: fee.isMandatory,
        status: 'active',
        lateFee: null,
        discountPercentage: null,
        totalCollected,
        collectionRate,
        payersCount: 0,
        outstandingCount: 0,
      },
    })
  }

  public async recordPaymentPage({ auth, request, view }: HttpContext) {
    const user = auth.user!
    const [students, fees] = await Promise.all([
      Student.query()
        .where('school_id', user.schoolId!)
        .where('academic_status', 'active')
        .preload('user')
        .preload('class')
        .orderBy('registration_number', 'asc'),
      SchoolFee.query().where('school_id', user.schoolId!).orderBy('created_at', 'desc'),
    ])

    return view.render('financial/payments/record', {
      school: this.getFallbackSchool(user),
      students: students.map((student) => ({
        id: student.id,
        name: student.user?.fullName || student.registrationNumber,
        className: student.class?.name || 'Non affecté',
        registrationNumber: student.registrationNumber,
      })),
      fees,
      selectedStudentId: request.input('student_id', ''),
    })
  }

  public async studentFinancialStatus({ params, response }: HttpContext) {
    const student = await Student.query()
      .where('id', params.studentId)
      .preload('class')
      .firstOrFail()
    const fees = await SchoolFee.query()
      .where('school_id', student.schoolId)
      .where('is_mandatory', true)
    const payments = await FeePayment.query().where('student_id', student.id)

    const totalDue = fees.reduce((sum, fee) => sum + Number(fee.amount || 0), 0)
    const totalPaid = payments.reduce((sum, payment) => sum + Number(payment.amountPaid || 0), 0)

    return response.ok({
      className: student.class?.name || 'Non affecté',
      registrationNumber: student.registrationNumber,
      balance: totalDue - totalPaid,
    })
  }
  private getPaymentMethodLabel(method: string | null) {
    const labels: Record<string, string> = {
      cash: 'Espèces',
      bank_transfer: 'Virement bancaire',
      mobile_money: 'Mobile Money',
      check: 'Chèque',
      card: 'Carte bancaire',
    }

    return method ? labels[method] || method : '-'
  }

  public async receiptPage({ params, view }: HttpContext) {
    const payment = await FeePayment.query()
      .where('id', params.id)
      .preload('fee', (feeQuery) => feeQuery.preload('school'))
      .preload('student', (studentQuery) => {
        studentQuery.preload('user')
        studentQuery.preload('class')
      })
      .preload('recorder')
      .firstOrFail()
    const fees = await SchoolFee.query()
      .where('school_id', payment.fee.schoolId)
      .where('is_mandatory', true)
    const payments = await FeePayment.query().where('student_id', payment.studentId)
    const totalDue = fees.reduce((sum, fee) => sum + Number(fee.amount || 0), 0)
    const totalPaid = payments.reduce((sum, item) => sum + Number(item.amountPaid || 0), 0)

    return view.render('financial/payments/receipt', {
      school: payment.fee.school,
      payment: {
        id: payment.id,
        receiptNumber: payment.receiptNumber,
        paymentDate: payment.paymentDate,
        paymentTime: payment.createdAt.toFormat('HH:mm'),
        recordedByName: payment.recorder?.fullName || '-',
        paymentMethodLabel: this.getPaymentMethodLabel(payment.paymentMethod),
        studentName: payment.student?.user?.fullName || '-',
        studentRegistrationNumber: payment.student?.registrationNumber || '-',
        studentClassName: payment.student?.class?.name || 'Non affecté',
        parentName: '-',
        feeType: payment.fee.feeType,
        term: payment.fee.term,
        academicYear: payment.fee.academicYear,
        amountPaid: payment.amountPaid,
        currency: payment.currency || payment.fee.currency || 'USD',
        referenceNumber: payment.referenceNumber,
        notes: payment.notes,
        balanceAfter: totalDue - totalPaid,
      },
      generationDate: DateTime.now().toFormat('dd/MM/yyyy HH:mm'),
    })
  }

  /**
   * Définir les frais scolaires
   */
  public async printReceiptPage({ params, view }: HttpContext) {
    const payment = await FeePayment.query()
      .where('id', params.id)
      .preload('fee', (feeQuery) => feeQuery.preload('school'))
      .preload('student', (studentQuery) => {
        studentQuery.preload('user')
        studentQuery.preload('class')
      })
      .preload('recorder')
      .firstOrFail()
    const fees = await SchoolFee.query()
      .where('school_id', payment.fee.schoolId)
      .where('is_mandatory', true)
    const payments = await FeePayment.query().where('student_id', payment.studentId)
    const totalDue = fees.reduce((sum, fee) => sum + Number(fee.amount || 0), 0)
    const totalPaid = payments.reduce((sum, item) => sum + Number(item.amountPaid || 0), 0)

    return view.render('financial/payments/print-receipt', {
      school: payment.fee.school,
      payment: {
        id: payment.id,
        receiptNumber: payment.receiptNumber,
        paymentDate: payment.paymentDate,
        paymentTime: payment.createdAt.toFormat('HH:mm'),
        recordedByName: payment.recorder?.fullName || '-',
        paymentMethodLabel: this.getPaymentMethodLabel(payment.paymentMethod),
        studentName: payment.student?.user?.fullName || '-',
        studentRegistrationNumber: payment.student?.registrationNumber || '-',
        studentClassName: payment.student?.class?.name || 'Non affecté',
        feeType: payment.fee.feeType,
        term: payment.fee.term,
        academicYear: payment.fee.academicYear,
        amountPaid: payment.amountPaid,
        currency: payment.currency || payment.fee.currency || 'USD',
        referenceNumber: payment.referenceNumber,
        balanceAfter: totalDue - totalPaid,
      },
      generationDate: DateTime.now().toFormat('dd/MM/yyyy HH:mm'),
    })
  }

  public async setFees({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(setSchoolFeesValidator)
    const user = auth.user!

    const fee = await SchoolFee.create({
      schoolId: user.schoolId!,
      feeType: payload.feeType,
      amount: payload.amount,
      currency: payload.currency || 'USD',
      academicYear: payload.academicYear,
      term: payload.term,
      isMandatory: payload.isMandatory ?? true,
      description: payload.description,
    })

    if (request.header('accept')?.includes('text/html')) {
      return response.redirect('/financial/fees')
    }

    return response.created({
      success: true,
      message: 'Frais scolaires définis avec succès',
      fee,
    })
  }

  /**
   * Obtenir les frais scolaires
   */
  public async getFees({ request, auth, response }: HttpContext) {
    const schoolId = auth.user?.schoolId
    const academicYear = request.input('academic_year')
    const term = request.input('term')

    const query = SchoolFee.query().where('school_id', schoolId!)

    if (academicYear) query.where('academic_year', academicYear)
    if (term) query.where('term', term)

    const fees = await query.orderBy('created_at', 'desc')

    return response.ok({
      success: true,
      fees,
    })
  }

  /**
   * Mettre à jour les frais
   */
  public async updateFees({ request, params, response }: HttpContext) {
    const payload = await request.validateUsing(updateFeesValidator)
    const fee = await SchoolFee.findOrFail(params.id)

    fee.merge({
      feeType: payload.feeType ?? fee.feeType,
      amount: payload.amount ?? fee.amount,
      currency: payload.currency ?? fee.currency,
      term: payload.term ?? fee.term,
      isMandatory: payload.isMandatory ?? false,
      description: payload.description ?? fee.description,
    })
    await fee.save()

    if (request.header('accept')?.includes('text/html')) {
      return response.redirect('/financial/fees')
    }

    return response.ok({
      success: true,
      message: 'Frais mis à jour avec succès',
      fee,
    })
  }

  public async toggleFeeStatus({ response }: HttpContext) {
    return response.ok({
      success: true,
      message: "Le statut des frais est géré automatiquement avec la structure actuelle.",
    })
  }

  /**
   * Enregistrer un paiement
   */
  public async recordPayment({ request, auth, response, session }: HttpContext) {
    const payload = await request.validateUsing(recordPaymentValidator)
    const user = auth.user!

    const payment = await FeePayment.create({
      studentId: payload.studentId,
      feeId: payload.feeId,
      amountPaid: payload.amountPaid,
      currency: request.input('currency', 'USD'),
      paymentDate: payload.paymentDate,
      paymentMethod: payload.paymentMethod,
      referenceNumber: payload.referenceNumber,
      notes: payload.notes,
      recordedBy: user.id,
      // Génération du numéro de reçu
      receiptNumber: `REC-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    })

    if (request.header('accept')?.includes('text/html')) {
      session.flash('success', 'Paiement enregistré avec succès.')
      return response.redirect(`/financial/payments/receipt/${payment.id}`)
    }

    return response.created({
      success: true,
      message: 'Paiement enregistré avec succès',
      payment,
    })
  }

  /**
   * Obtenir les paiements d'un élève avec balance
   */
  public async getStudentPayments({ params, response }: HttpContext) {
    const studentId = params.studentId

    const payments = await FeePayment.query()
      .where('student_id', studentId)
      .preload('fee')
      .preload('recorder')
      .orderBy('payment_date', 'desc')

    const totalPaid = payments.reduce((sum, payment) => sum + payment.amountPaid, 0)

    // Calcul du total dû basé sur les frais obligatoires
    const fees = await SchoolFee.query()
      .whereHas('school', (schoolQuery) => {
        schoolQuery.whereHas('students', (s) => s.where('id', studentId))
      })
      .where('is_mandatory', true)

    const totalDue = fees.reduce((sum, fee) => sum + fee.amount, 0)

    return response.ok({
      success: true,
      payments,
      summary: {
        totalPaid,
        totalDue,
        balance: totalDue - totalPaid,
        paymentCount: payments.length,
      },
    })
  }

  /**
   * Rapport des revenus par période
   */
  public async getIncomeReport({ request, auth, response }: HttpContext) {
    const schoolId = auth.user?.schoolId
    const startDate = request.input('start_date')
    const endDate = request.input('end_date')

    const query = FeePayment.query()
      .whereHas('fee', (f) => f.where('school_id', schoolId!))
      .preload('fee')

    if (startDate && endDate) {
      query.whereBetween('payment_date', [startDate, endDate])
    }

    const payments = await query.orderBy('payment_date', 'desc')
    const totalIncome = payments.reduce((sum, payment) => sum + payment.amountPaid, 0)

    // Revenus groupés par type de frais
    const byFeeType: Record<string, number> = {}
    payments.forEach((p) => {
      const type = p.fee.feeType
      byFeeType[type] = (byFeeType[type] || 0) + p.amountPaid
    })

    return response.ok({
      success: true,
      report: {
        totalIncome,
        byFeeType,
        transactionCount: payments.length,
        payments: request.input('include_details') ? payments : undefined,
      },
    })
  }

  /**
   * Statistiques financières globales
   */
  public async getFinancialStats({ auth, response }: HttpContext) {
    const schoolId = auth.user?.schoolId

    // Revenus par mois (12 derniers mois)
    const monthlyIncome = await db
      .from('fee_payments')
      .join('school_fees', 'fee_payments.fee_id', 'school_fees.id')
      .where('school_fees.school_id', schoolId!)
      .select(db.raw("DATE_TRUNC('month', payment_date) as month"))
      .sum('amount_paid as total')
      .groupBy('month')
      .orderBy('month', 'desc')
      .limit(12)

    // Taux de recouvrement
    const totalDueResult = await db
      .from('school_fees')
      .where('school_id', schoolId!)
      .where('is_mandatory', true)
      .sum('amount as total')

    const totalCollectedResult = await db
      .from('fee_payments')
      .join('school_fees', 'fee_payments.fee_id', 'school_fees.id')
      .where('school_fees.school_id', schoolId!)
      .sum('amount_paid as total')

    const totalDue = Number(totalDueResult[0]?.total) || 0
    const totalCollected = Number(totalCollectedResult[0]?.total) || 0

    return response.ok({
      success: true,
      stats: {
        monthlyIncome,
        totalDue,
        totalCollected,
        recoveryRate: totalDue > 0 ? (totalCollected / totalDue) * 100 : 0,
      },
    })
  }

  /**
   * Supprimer des frais
   */
  public async deleteFees({ params, response }: HttpContext) {
    const fee = await SchoolFee.findOrFail(params.id)
    await fee.delete()
    return response.ok({ success: true, message: 'Frais supprimés' })
  }

  public async deletePayment({ params, auth, response }: HttpContext) {
    const payment = await FeePayment.query()
      .where('id', params.id)
      .whereHas('fee', (feeQuery) => feeQuery.where('school_id', auth.user!.schoolId!))
      .firstOrFail()

    await payment.delete()

    return response.ok({ success: true, message: 'Paiement supprimé' })
  }
}
