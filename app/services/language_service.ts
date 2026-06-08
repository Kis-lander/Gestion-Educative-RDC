import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export const supportedAppLanguages = ['fr', 'en', 'ln', 'sw', 'kg', 'lua'] as const

type SupportedAppLanguage = (typeof supportedAppLanguages)[number]

function isSupportedLanguage(language: unknown): language is SupportedAppLanguage {
  return typeof language === 'string' && supportedAppLanguages.includes(language as SupportedAppLanguage)
}

export async function getDefaultAppLanguage() {
  try {
    const row = await db.from('inspection_settings').where('key', 'defaultLanguage').first()
    const language = row?.value ? JSON.parse(row.value) : 'fr'

    return isSupportedLanguage(language) ? language : 'fr'
  } catch {
    return 'fr'
  }
}

export async function resolveAppLanguage({ auth, session }: Pick<HttpContext, 'auth' | 'session'>) {
  const sessionLanguage = session.get('locale') as string | undefined
  if (isSupportedLanguage(sessionLanguage)) return sessionLanguage

  const userLanguage = auth.user?.preferredLanguage
  const defaultLanguage = await getDefaultAppLanguage()

  if (isSupportedLanguage(userLanguage) && userLanguage !== 'fr') return userLanguage

  return defaultLanguage
}

export function canUseAppLanguage(language: unknown): language is SupportedAppLanguage {
  return isSupportedLanguage(language)
}
