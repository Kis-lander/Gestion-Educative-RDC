import type { HttpContext } from '@adonisjs/core/http'

export default class MessagesController {
  private notImplemented({ response }: HttpContext, action: string) {
    return response.notImplemented({ message: `${action} not implemented yet` })
  }

  public async getMessages(ctx: HttpContext) { return this.notImplemented(ctx, 'getMessages') }
  public async getUnreadCount(ctx: HttpContext) { return this.notImplemented(ctx, 'getUnreadCount') }
  public async sendMessage(ctx: HttpContext) { return this.notImplemented(ctx, 'sendMessage') }
  public async markAsRead(ctx: HttpContext) { return this.notImplemented(ctx, 'markAsRead') }
  public async deleteMessage(ctx: HttpContext) { return this.notImplemented(ctx, 'deleteMessage') }
  public async getConversations(ctx: HttpContext) { return this.notImplemented(ctx, 'getConversations') }
  public async getConversation(ctx: HttpContext) { return this.notImplemented(ctx, 'getConversation') }
  public async getNotifications(ctx: HttpContext) { return this.notImplemented(ctx, 'getNotifications') }
  public async markNotificationAsRead(ctx: HttpContext) { return this.notImplemented(ctx, 'markNotificationAsRead') }
  public async markAllAsRead(ctx: HttpContext) { return this.notImplemented(ctx, 'markAllAsRead') }
  public async uploadAttachment(ctx: HttpContext) { return this.notImplemented(ctx, 'uploadAttachment') }
}
