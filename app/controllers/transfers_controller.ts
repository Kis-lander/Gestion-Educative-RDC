import type { HttpContext } from '@adonisjs/core/http'

export default class TransfersController {
  private notImplemented({ response }: HttpContext, action: string) {
    return response.notImplemented({ message: `${action} not implemented yet` })
  }

  public async verifyAuthorization(ctx: HttpContext) { return this.notImplemented(ctx, 'verifyAuthorization') }
  public async requestTransfer(ctx: HttpContext) { return this.notImplemented(ctx, 'requestTransfer') }
  public async getPendingTransfers(ctx: HttpContext) { return this.notImplemented(ctx, 'getPendingTransfers') }
  public async approveTransfer(ctx: HttpContext) { return this.notImplemented(ctx, 'approveTransfer') }
  public async rejectTransfer(ctx: HttpContext) { return this.notImplemented(ctx, 'rejectTransfer') }
}
