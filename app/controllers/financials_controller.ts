import type { HttpContext } from '@adonisjs/core/http'

export default class FinancialsController {
  private notImplemented({ response }: HttpContext, action: string) {
    return response.notImplemented({ message: `${action} not implemented yet` })
  }

  public async getFees(ctx: HttpContext) { return this.notImplemented(ctx, 'getFees') }
  public async setFees(ctx: HttpContext) { return this.notImplemented(ctx, 'setFees') }
  public async updateFees(ctx: HttpContext) { return this.notImplemented(ctx, 'updateFees') }
  public async deleteFees(ctx: HttpContext) { return this.notImplemented(ctx, 'deleteFees') }
  public async getPayments(ctx: HttpContext) { return this.notImplemented(ctx, 'getPayments') }
  public async recordPayment(ctx: HttpContext) { return this.notImplemented(ctx, 'recordPayment') }
  public async getStudentPayments(ctx: HttpContext) { return this.notImplemented(ctx, 'getStudentPayments') }
  public async generateReceipt(ctx: HttpContext) { return this.notImplemented(ctx, 'generateReceipt') }
  public async getIncomeReport(ctx: HttpContext) { return this.notImplemented(ctx, 'getIncomeReport') }
  public async getOutstandingPayments(ctx: HttpContext) { return this.notImplemented(ctx, 'getOutstandingPayments') }
  public async getStudentFinancialStatus(ctx: HttpContext) { return this.notImplemented(ctx, 'getStudentFinancialStatus') }
  public async getFinancialStats(ctx: HttpContext) { return this.notImplemented(ctx, 'getFinancialStats') }
}
