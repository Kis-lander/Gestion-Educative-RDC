import type { HttpContext } from '@adonisjs/core/http'

export default class TeachersController {
  private notImplemented({ response }: HttpContext, action: string) {
    return response.notImplemented({ message: `${action} not implemented yet` })
  }

  public async getMyClasses(ctx: HttpContext) { return this.notImplemented(ctx, 'getMyClasses') }
  public async getMySubjects(ctx: HttpContext) { return this.notImplemented(ctx, 'getMySubjects') }
  public async getAssignments(ctx: HttpContext) { return this.notImplemented(ctx, 'getAssignments') }
  public async createAssignment(ctx: HttpContext) { return this.notImplemented(ctx, 'createAssignment') }
  public async updateAssignment(ctx: HttpContext) { return this.notImplemented(ctx, 'updateAssignment') }
  public async deleteAssignment(ctx: HttpContext) { return this.notImplemented(ctx, 'deleteAssignment') }
  public async publishAssignment(ctx: HttpContext) { return this.notImplemented(ctx, 'publishAssignment') }
  public async getSubmissions(ctx: HttpContext) { return this.notImplemented(ctx, 'getSubmissions') }
  public async gradeSubmission(ctx: HttpContext) { return this.notImplemented(ctx, 'gradeSubmission') }
  public async getGrades(ctx: HttpContext) { return this.notImplemented(ctx, 'getGrades') }
  public async addGrade(ctx: HttpContext) { return this.notImplemented(ctx, 'addGrade') }
  public async updateGrade(ctx: HttpContext) { return this.notImplemented(ctx, 'updateGrade') }
  public async getForumTopics(ctx: HttpContext) { return this.notImplemented(ctx, 'getForumTopics') }
  public async createForumTopic(ctx: HttpContext) { return this.notImplemented(ctx, 'createForumTopic') }
  public async replyToTopic(ctx: HttpContext) { return this.notImplemented(ctx, 'replyToTopic') }
  public async pinTopic(ctx: HttpContext) { return this.notImplemented(ctx, 'pinTopic') }
  public async lockTopic(ctx: HttpContext) { return this.notImplemented(ctx, 'lockTopic') }
  public async getAttendance(ctx: HttpContext) { return this.notImplemented(ctx, 'getAttendance') }
  public async markAttendance(ctx: HttpContext) { return this.notImplemented(ctx, 'markAttendance') }
}
