import type { HttpContext } from '@adonisjs/core/http'

export default class InspectionsController {
  private notImplemented({ response }: HttpContext, action: string) {
    return response.notImplemented({ message: `${action} not implemented yet` })
  }

  public async getAllSchools(ctx: HttpContext) { return this.notImplemented(ctx, 'getAllSchools') }
  public async getSchoolById(ctx: HttpContext) { return this.notImplemented(ctx, 'getSchoolById') }
  public async approveSchool(ctx: HttpContext) { return this.notImplemented(ctx, 'approveSchool') }
  public async suspendSchool(ctx: HttpContext) { return this.notImplemented(ctx, 'suspendSchool') }
  public async generateSchoolCredentials(ctx: HttpContext) { return this.notImplemented(ctx, 'generateSchoolCredentials') }
  public async sendGlobalCommunication(ctx: HttpContext) { return this.notImplemented(ctx, 'sendGlobalCommunication') }
  public async sendSchoolCommunication(ctx: HttpContext) { return this.notImplemented(ctx, 'sendSchoolCommunication') }
  public async getCommunicationHistory(ctx: HttpContext) { return this.notImplemented(ctx, 'getCommunicationHistory') }
  public async getGlobalStats(ctx: HttpContext) { return this.notImplemented(ctx, 'getGlobalStats') }
  public async getSchoolsStats(ctx: HttpContext) { return this.notImplemented(ctx, 'getSchoolsStats') }
  public async getPerformanceStats(ctx: HttpContext) { return this.notImplemented(ctx, 'getPerformanceStats') }
  public async generateSchoolsReport(ctx: HttpContext) { return this.notImplemented(ctx, 'generateSchoolsReport') }
  public async generateTransfersReport(ctx: HttpContext) { return this.notImplemented(ctx, 'generateTransfersReport') }
}
