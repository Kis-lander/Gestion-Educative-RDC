import type { HttpContext } from '@adonisjs/core/http'

/**
 * Pages d'aide publiques (vues Edge).
 */
export default class HelpController {
  public async index({ view }: HttpContext) {
    return view.render('help/index')
  }

  public async faq({ view }: HttpContext) {
    return view.render('help/faq')
  }

  public async guides({ view }: HttpContext) {
    return view.render('help/guides')
  }

  public async tutorial({ view }: HttpContext) {
    return view.render('help/tutorial')
  }

  public async contact({ view }: HttpContext) {
    return view.render('help/contact')
  }

  public async documentation({ view }: HttpContext) {
    return view.render('help/documentation')
  }
}
