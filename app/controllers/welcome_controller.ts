import type { HttpContext } from '@adonisjs/core/http'

/**
 * Pages publiques d’accueil et de présentation (vues Edge).
 */
export default class WelcomeController {
  /** Page affichée à la racine `/` (lancement de l’app). */
  public async index({ view }: HttpContext) {
    return view.render('welcome/index')
  }

  /** Ancienne page d’accueil (cartes + liens) — `/welcome`. */
  public async landing({ view }: HttpContext) {
    return view.render('welcome/index')
  }

  public async about({ view }: HttpContext) {
    return view.render('welcome/about')
  }

  public async features({ view }: HttpContext) {
    return view.render('welcome/features')
  }

  public async contact({ view }: HttpContext) {
    return view.render('welcome/contact')
  }

  public async terms({ view }: HttpContext) {
    return view.render('welcome/terms')
  }
}
