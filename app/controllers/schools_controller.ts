import type { HttpContext } from '@adonisjs/core/http'

export default class SchoolsController {
  private notImplemented({ response }: HttpContext, action: string) {
    return response.notImplemented({ message: `${action} not implemented yet` })
  }

  public async registerSchool(ctx: HttpContext) { return this.notImplemented(ctx, 'registerSchool') }
  public async dashboard(ctx: HttpContext) { return this.notImplemented(ctx, 'dashboard') }
  public async getSchoolStats(ctx: HttpContext) { return this.notImplemented(ctx, 'getSchoolStats') }
  public async getSchoolProfile(ctx: HttpContext) { return this.notImplemented(ctx, 'getSchoolProfile') }
  public async updateSchoolProfile(ctx: HttpContext) { return this.notImplemented(ctx, 'updateSchoolProfile') }
  public async getTeachers(ctx: HttpContext) { return this.notImplemented(ctx, 'getTeachers') }
  public async addTeacher(ctx: HttpContext) { return this.notImplemented(ctx, 'addTeacher') }
  public async updateTeacher(ctx: HttpContext) { return this.notImplemented(ctx, 'updateTeacher') }
  public async removeTeacher(ctx: HttpContext) { return this.notImplemented(ctx, 'removeTeacher') }
}
