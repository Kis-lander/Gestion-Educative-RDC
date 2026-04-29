import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class SchoolContextMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user

    /**
     * Vérification : Si l'utilisateur n'est pas de l'inspection (qui a une vue globale),
     * il doit impérativement être rattaché à une école.
     */
    if (user && user.role !== 'inspection' && !user.schoolId) {
      return ctx.response.badRequest({
        message: 'Utilisateur non associé à une école. Accès restreint.',
      })
    }

    /**
     * On injecte le schoolId dans l'objet request.
     * Grâce à l'augmentation de module faite à l'étape 1,
     * TypeScript ne signalera pas d'erreur.
     */
    ;(ctx.request as typeof ctx.request & { schoolId?: string }).schoolId = user?.schoolId

    return next()
  }
}
