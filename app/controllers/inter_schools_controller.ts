import type { HttpContext } from '@adonisjs/core/http'

export default class InterSchoolsController {
  private notImplemented({ response }: HttpContext, action: string) {
    return response.notImplemented({ message: `${action} not implemented yet` })
  }

  public async searchSchools(ctx: HttpContext) { return this.notImplemented(ctx, 'searchSchools') }
  public async getSchoolPublicInfo(ctx: HttpContext) { return this.notImplemented(ctx, 'getSchoolPublicInfo') }
  public async getExchanges(ctx: HttpContext) { return this.notImplemented(ctx, 'getExchanges') }
  public async startExchange(ctx: HttpContext) { return this.notImplemented(ctx, 'startExchange') }
  public async sendExchangeMessage(ctx: HttpContext) { return this.notImplemented(ctx, 'sendExchangeMessage') }
  public async getBestPractices(ctx: HttpContext) { return this.notImplemented(ctx, 'getBestPractices') }
  public async shareBestPractice(ctx: HttpContext) { return this.notImplemented(ctx, 'shareBestPractice') }
  public async getEvents(ctx: HttpContext) { return this.notImplemented(ctx, 'getEvents') }
  public async createEvent(ctx: HttpContext) { return this.notImplemented(ctx, 'createEvent') }
  public async joinEvent(ctx: HttpContext) { return this.notImplemented(ctx, 'joinEvent') }
}
