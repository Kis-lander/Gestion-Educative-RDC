import { type HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import SchoolFee from '#models/school_fee'
import FeePayment from '#models/fee_payment'
// import Student from '#models/student'
// import Message from '#models/message'
import {
  setSchoolFeesValidator,
  recordPaymentValidator,
  updateFeesValidator,
} from '#validators/financial'
// import { DateTime } from 'luxon'

export default class FinancialController {
  /**
   * Définir les frais scolaires
   */
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

    fee.merge(payload)
    await fee.save()

    return response.ok({
      success: true,
      message: 'Frais mis à jour avec succès',
      fee,
    })
  }

  /**
   * Enregistrer un paiement
   */
  public async recordPayment({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(recordPaymentValidator)
    const user = auth.user!

    const payment = await FeePayment.create({
      studentId: payload.studentId,
      feeId: payload.feeId,
      amountPaid: payload.amountPaid,
      paymentDate: payload.paymentDate,
      paymentMethod: payload.paymentMethod,
      referenceNumber: payload.referenceNumber,
      notes: payload.notes,
      recordedBy: user.id,
      // Génération du numéro de reçu
      receiptNumber: `REC-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    })

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
}
