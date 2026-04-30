import type { HttpContext } from '@adonisjs/core/http'

export default class ParentsController {
  private notImplemented({ response }: HttpContext, action: string) {
    return response.notImplemented({ message: `${action} not implemented yet` })
  }

  public async getChildren(ctx: HttpContext) { return this.notImplemented(ctx, 'getChildren') }
  public async getChildDetails(ctx: HttpContext) { return this.notImplemented(ctx, 'getChildDetails') }
  public async getChildGrades(ctx: HttpContext) { return this.notImplemented(ctx, 'getChildGrades') }
  public async getChildReportCard(ctx: HttpContext) { return this.notImplemented(ctx, 'getChildReportCard') }
  public async getChildDiscipline(ctx: HttpContext) { return this.notImplemented(ctx, 'getChildDiscipline') }
  public async getMessages(ctx: HttpContext) { return this.notImplemented(ctx, 'getMessages') }
  public async sendMessageToTeacher(ctx: HttpContext) { return this.notImplemented(ctx, 'sendMessageToTeacher') }
  public async replyToMessage(ctx: HttpContext) { return this.notImplemented(ctx, 'replyToMessage') }
  public async getChildPayments(ctx: HttpContext) { return this.notImplemented(ctx, 'getChildPayments') }
  public async initiatePayment(ctx: HttpContext) { return this.notImplemented(ctx, 'initiatePayment') }
  public async getChildForumActivity(ctx: HttpContext) { return this.notImplemented(ctx, 'getChildForumActivity') }
  public async justifyAbsence(ctx: HttpContext) { return this.notImplemented(ctx, 'justifyAbsence') }
}
