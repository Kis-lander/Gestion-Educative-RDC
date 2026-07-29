import app from '@adonisjs/core/services/app'
import { type HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import type { StatusPageRange, StatusPageRenderer } from '@adonisjs/core/types/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * Status pages are used to display a custom HTML pages for certain error
   * codes. You might want to enable them in production only, but feel
   * free to enable them in development as well.
   */
  protected renderStatusPages = app.inProduction

  /**
   * Status pages is a collection of error code range and a callback
   * to return the HTML contents to send as a response.
   */
  protected statusPages: Record<StatusPageRange, StatusPageRenderer> = {
    '404': (_, { inertia }) => inertia.render('errors/not_found', {}),
    '500..599': (_, { inertia }) => inertia.render('errors/server_error', {}),
  }

  private wantsJson(ctx: HttpContext) {
    return (
      String(ctx.request.header('accept') || '').includes('application/json') ||
      String(ctx.request.header('content-type') || '').includes('application/json')
    )
  }

  private async renderErrorPage(ctx: HttpContext, status: number, template: string, data = {}) {
    return ctx.response.status(status).send(
      await ctx.view.render(`errors/${template}`, {
        url: ctx.request.url(),
        showDetails: !app.inProduction,
        ...data,
      })
    )
  }

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    const exception = error as { code?: string; status?: number; message?: string }

    if (exception.code === 'E_BAD_CSRF_TOKEN') {
      if (this.wantsJson(ctx)) {
        return ctx.response.status(419).send({
          success: false,
          message: 'Session expirée. Veuillez rafraîchir la page puis réessayer.',
        })
      }

      ctx.session.flash(
        'error',
        'Session expirée ou formulaire ouvert trop longtemps. Veuillez réessayer.'
      )

      return ctx.response.redirect().back()
    }

    const status = Number(exception.status || 500)
    const message =
      exception.message ||
      (status >= 500 ? 'Erreur interne du serveur.' : "L'action demandée n'a pas pu être exécutée.")

    if (status >= 400 && status < 500 && ![401, 403, 404].includes(status)) {
      if (this.wantsJson(ctx)) {
        return ctx.response.status(status).send({
          success: false,
          message,
        })
      }

      ctx.session.flash('error', message)
      return ctx.response.redirect().back()
    }

    if ([401, 403, 404].includes(status) || status >= 500) {
      if (this.wantsJson(ctx)) {
        return ctx.response.status(status).send({
          success: false,
          message: status >= 500 ? 'Erreur interne du serveur.' : message,
        })
      }

      if (status === 401) return this.renderErrorPage(ctx, 401, '401')
      if (status === 403) return this.renderErrorPage(ctx, 403, '403')
      if (status === 404) return this.renderErrorPage(ctx, 404, '404')

      return this.renderErrorPage(ctx, status, '500', {
        errorCode: exception.code || `ERR-${status}`,
        errorMessage: exception.message,
      })
    }

    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
