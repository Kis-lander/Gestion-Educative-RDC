import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class InspectionOnlyMiddleware {
  /**
   * Middleware strictement dedie au role "inspection".
   */
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user

    if (!user) {
      return ctx.response.unauthorized({
        message: 'Acces non autorise : vous devez etre connecte.',
      })
    }

    if (user.role !== 'inspection') {
      return ctx.response.forbidden({
        message:
          "Acces refuse. Cette fonctionnalite est reservee exclusivement a l'Inspection pedagogique.",
      })
    }

    return next()
  }
}
