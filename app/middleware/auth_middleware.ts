import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import {
  getGovernanceContext,
  navigationPolicyFor,
  type GovernanceContext,
} from '#services/school_governance_service'

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

    let governance: GovernanceContext | null = null
    let navigation = navigationPolicyFor(user.role)

    if (user.schoolId) {
      try {
        governance = await getGovernanceContext(user)
        navigation = governance.navigation
      } catch {}
    }

    const originalRender = ctx.view.render.bind(ctx.view)
    ;(ctx.view as any).render = (template: string, state: Record<string, any> = {}) => {
      return originalRender(template, {
        ...state,
        governance: state.governance || governance,
        navigation: state.navigation || navigation,
      })
    }

    const url = ctx.request.url()
    const path = url.split('?')[0]
    const governedDirectorPaths = [
      '/financial',
      '/schools/transfers',
      '/discipline',
      '/schools/accounts',
      '/schools/subjects',
      '/students',
      '/teachers',
      '/academic',
    ]
    const needsPositionCheck =
      user.role === 'director' && governedDirectorPaths.some((prefix) => path.startsWith(prefix))

    if (needsPositionCheck) {
      if (!governance) {
        governance = await getGovernanceContext(user)
        navigation = governance.navigation
      }
      const position = governance.position
      const isPromoter = position === 'promoter'
      const isSectionDirector = ['preschool_director', 'primary_director', 'prefect'].includes(position)
      const isStudiesDirector = position === 'studies_director'
      const isPedagogicalAdvisor = position === 'pedagogical_advisor'

      const canAccess =
        (path.startsWith('/financial') && (isPromoter || isSectionDirector)) ||
        (path.startsWith('/schools/transfers') && (isPromoter || position === 'prefect')) ||
        (path.startsWith('/discipline') && (isPromoter || position === 'prefect')) ||
        (path.startsWith('/schools/accounts') &&
          (isPromoter || isSectionDirector || isStudiesDirector)) ||
        (path.startsWith('/schools/subjects') &&
          (isPromoter || isSectionDirector || isStudiesDirector || isPedagogicalAdvisor)) ||
        (path.startsWith('/students') && (isPromoter || isSectionDirector || isStudiesDirector)) ||
        (path.startsWith('/teachers') &&
          (isPromoter || isSectionDirector || isStudiesDirector || isPedagogicalAdvisor)) ||
        (path.startsWith('/academic') &&
          (isPromoter || isSectionDirector || isStudiesDirector || isPedagogicalAdvisor))

      if (!canAccess) {
        return ctx.response.forbidden({
          message: `Acces refuse pour la fonction ${governance.positionLabel}.`,
        })
      }
    }

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
