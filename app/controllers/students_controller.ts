import type { HttpContext } from '@adonisjs/core/http'

export default class StudentsController {
  private notImplemented({ response }: HttpContext, action: string) {
    return response.notImplemented({ message: `${action} not implemented yet` })
  }

  public async getMyProfile(ctx: HttpContext) { return this.notImplemented(ctx, 'getMyProfile') }
  public async getMyGrades(ctx: HttpContext) { return this.notImplemented(ctx, 'getMyGrades') }
  public async getMyReportCard(ctx: HttpContext) { return this.notImplemented(ctx, 'getMyReportCard') }
  public async getMyDiscipline(ctx: HttpContext) { return this.notImplemented(ctx, 'getMyDiscipline') }
  public async getAssignments(ctx: HttpContext) { return this.notImplemented(ctx, 'getAssignments') }
  public async getAssignmentDetail(ctx: HttpContext) { return this.notImplemented(ctx, 'getAssignmentDetail') }
  public async submitAssignment(ctx: HttpContext) { return this.notImplemented(ctx, 'submitAssignment') }
  public async updateSubmission(ctx: HttpContext) { return this.notImplemented(ctx, 'updateSubmission') }
  public async getMyForumQuestions(ctx: HttpContext) { return this.notImplemented(ctx, 'getMyForumQuestions') }
  public async postForumQuestion(ctx: HttpContext) { return this.notImplemented(ctx, 'postForumQuestion') }
  public async replyToForum(ctx: HttpContext) { return this.notImplemented(ctx, 'replyToForum') }
  public async getMessages(ctx: HttpContext) { return this.notImplemented(ctx, 'getMessages') }
  public async sendMessageToTeacher(ctx: HttpContext) { return this.notImplemented(ctx, 'sendMessageToTeacher') }
  public async getMyTimetable(ctx: HttpContext) { return this.notImplemented(ctx, 'getMyTimetable') }
  public async getMyAttendance(ctx: HttpContext) { return this.notImplemented(ctx, 'getMyAttendance') }
}
