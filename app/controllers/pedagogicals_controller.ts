import type { HttpContext } from '@adonisjs/core/http'

export default class PedagogicalsController {
  private notImplemented({ response }: HttpContext, action: string) {
    return response.notImplemented({ message: `${action} not implemented yet` })
  }

  public async getGrades(ctx: HttpContext) { return this.notImplemented(ctx, 'getGrades') }
  public async addGrade(ctx: HttpContext) { return this.notImplemented(ctx, 'addGrade') }
  public async updateGrade(ctx: HttpContext) { return this.notImplemented(ctx, 'updateGrade') }
  public async publishGrades(ctx: HttpContext) { return this.notImplemented(ctx, 'publishGrades') }
  public async generateReportCard(ctx: HttpContext) { return this.notImplemented(ctx, 'generateReportCard') }
  public async getClassReportCards(ctx: HttpContext) { return this.notImplemented(ctx, 'getClassReportCards') }
  public async getClassTimetable(ctx: HttpContext) { return this.notImplemented(ctx, 'getClassTimetable') }
  public async setTimetable(ctx: HttpContext) { return this.notImplemented(ctx, 'setTimetable') }
  public async getAcademicStats(ctx: HttpContext) { return this.notImplemented(ctx, 'getAcademicStats') }
  public async getStudentStats(ctx: HttpContext) { return this.notImplemented(ctx, 'getStudentStats') }
}
