import type { HttpContext } from '@adonisjs/core/http'

export default class AcademicsController {
  private notImplemented({ response }: HttpContext, action: string) {
    return response.notImplemented({ message: `${action} not implemented yet` })
  }

  public async getClasses(ctx: HttpContext) { return this.notImplemented(ctx, 'getClasses') }
  public async createClass(ctx: HttpContext) { return this.notImplemented(ctx, 'createClass') }
  public async updateClass(ctx: HttpContext) { return this.notImplemented(ctx, 'updateClass') }
  public async deleteClass(ctx: HttpContext) { return this.notImplemented(ctx, 'deleteClass') }
  public async getClassStudents(ctx: HttpContext) { return this.notImplemented(ctx, 'getClassStudents') }
  public async getSubjects(ctx: HttpContext) { return this.notImplemented(ctx, 'getSubjects') }
  public async addSubjectToClass(ctx: HttpContext) { return this.notImplemented(ctx, 'addSubjectToClass') }
}
