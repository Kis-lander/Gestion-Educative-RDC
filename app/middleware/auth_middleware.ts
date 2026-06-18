import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class SchoolRoleMiddleware {
  /**
   * Sans argument, ce middleware verifie seulement que l'utilisateur est connecte.
   * Si des roles sont fournis, il applique aussi la restriction de role.
   */
  async handle(ctx: HttpContext, next: NextFn, params?: { allowedRoles?: string[] }) {
    const user = ctx.auth.user

    if (!user) {
      const acceptsHtml = ctx.request.accepts(['html', 'json']) === 'html'

      if (acceptsHtml && !ctx.request.url().startsWith('/api')) {
        ctx.session.flash('error', 'Veuillez vous connecter pour continuer')
        return ctx.response.redirect('/login')
      }

      return ctx.response.unauthorized({ message: 'Non authentifie' })
    }

    const allowedRoles = params?.allowedRoles ?? []

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return ctx.response.forbidden({
        message: `Acces refuse. Roles autorises: ${allowedRoles.join(', ')}`,
      })
    }

    const url = ctx.request.url()
    const canChangeTemporaryPassword =
      url.startsWith('/profile/security') ||
      url.startsWith('/profile/change-password') ||
      url.startsWith('/api/v1/change-password') ||
      url.startsWith('/logout') ||
      url.startsWith('/api/v1/logout')

    if (user.mustChangePassword && !canChangeTemporaryPassword) {
      const acceptsHtml = ctx.request.accepts(['html', 'json']) === 'html'

      if (acceptsHtml && !url.startsWith('/api')) {
        ctx.session.flash('error', 'Veuillez changer votre mot de passe temporaire pour continuer.')
        return ctx.response.redirect('/profile/security')
      }

      return ctx.response.status(403).send({
        success: false,
        message: 'Mot de passe temporaire a changer avant de continuer.',
        redirectTo: '/profile/security',
      })
    }

    return next()
  }
}
