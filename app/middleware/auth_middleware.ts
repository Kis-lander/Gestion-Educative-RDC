import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class SchoolRoleMiddleware {
  /**
   * Sans argument, ce middleware verifie seulement que l'utilisateur est connecte.
   * Si des roles sont fournis, il applique aussi la restriction de role.
   */
  async handle(
    ctx: HttpContext,
    next: NextFn,
    params?: { allowedRoles?: string[] }
  ) {
    const user = ctx.auth.user

    if (!user) {
      return ctx.response.unauthorized({ message: 'Non authentifie' })
    }

    const allowedRoles = params?.allowedRoles ?? []

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return ctx.response.forbidden({
        message: `Acces refuse. Roles autorises: ${allowedRoles.join(', ')}`,
      })
    }

    return next()
  }
}
