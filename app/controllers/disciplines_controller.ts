import type { HttpContext } from '@adonisjs/core/http'

export default class DisciplinesController {
  private notImplemented({ response }: HttpContext, action: string) {
    return response.notImplemented({ message: `${action} not implemented yet` })
  }

  public async getStudents(ctx: HttpContext) { return this.notImplemented(ctx, 'getStudents') }
  public async getStudentDetails(ctx: HttpContext) { return this.notImplemented(ctx, 'getStudentDetails') }
  public async getAllIncidents(ctx: HttpContext) { return this.notImplemented(ctx, 'getAllIncidents') }
  public async reportIncident(ctx: HttpContext) { return this.notImplemented(ctx, 'reportIncident') }
  public async updateIncident(ctx: HttpContext) { return this.notImplemented(ctx, 'updateIncident') }
  public async deleteIncident(ctx: HttpContext) { return this.notImplemented(ctx, 'deleteIncident') }
  public async getStudentIncidents(ctx: HttpContext) { return this.notImplemented(ctx, 'getStudentIncidents') }
  public async applySanction(ctx: HttpContext) { return this.notImplemented(ctx, 'applySanction') }
  public async updateSanction(ctx: HttpContext) { return this.notImplemented(ctx, 'updateSanction') }
  public async getStudentDisciplineReport(ctx: HttpContext) { return this.notImplemented(ctx, 'getStudentDisciplineReport') }
  public async getClassDisciplineReport(ctx: HttpContext) { return this.notImplemented(ctx, 'getClassDisciplineReport') }
  public async getDisciplineSummary(ctx: HttpContext) { return this.notImplemented(ctx, 'getDisciplineSummary') }
  public async getDisciplineStats(ctx: HttpContext) { return this.notImplemented(ctx, 'getDisciplineStats') }
  public async notifyParent(ctx: HttpContext) { return this.notImplemented(ctx, 'notifyParent') }
}
