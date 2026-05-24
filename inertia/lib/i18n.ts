export const supportedLocales = ['fr', 'en', 'ln', 'sw', 'kg', 'lua'] as const

export type SupportedLocale = (typeof supportedLocales)[number]
export type TranslationKey =
  | 'auth.login.title'
  | 'auth.login.subtitle'
  | 'auth.login.submit'
  | 'auth.signup.title'
  | 'auth.signup.subtitle'
  | 'auth.signup.submit'
  | 'auth.fields.email'
  | 'auth.fields.fullName'
  | 'auth.fields.password'
  | 'auth.fields.passwordConfirmation'
  | 'auth.fields.role'
  | 'nav.login'
  | 'nav.logout'
  | 'nav.signup'

const translations: Record<SupportedLocale, Record<TranslationKey, string>> = {
  fr: {
    'auth.login.title': 'Connexion',
    'auth.login.subtitle': 'Accédez à votre espace selon votre rôle',
    'auth.login.submit': 'Se connecter',
    'auth.signup.title': 'Créer un compte',
    'auth.signup.subtitle': 'Renseignez vos informations pour rejoindre la plateforme',
    'auth.signup.submit': 'Créer le compte',
    'auth.fields.email': 'Email',
    'auth.fields.fullName': 'Nom complet',
    'auth.fields.password': 'Mot de passe',
    'auth.fields.passwordConfirmation': 'Confirmer le mot de passe',
    'auth.fields.role': 'Rôle',
    'nav.login': 'Connexion',
    'nav.logout': 'Déconnexion',
    'nav.signup': 'Créer un compte',
  },
  en: {
    'auth.login.title': 'Login',
    'auth.login.subtitle': 'Access your education management workspace',
    'auth.login.submit': 'Log in',
    'auth.signup.title': 'Create an account',
    'auth.signup.subtitle': 'Enter your information to join the platform',
    'auth.signup.submit': 'Create account',
    'auth.fields.email': 'Email',
    'auth.fields.fullName': 'Full name',
    'auth.fields.password': 'Password',
    'auth.fields.passwordConfirmation': 'Confirm password',
    'auth.fields.role': 'Role',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.signup': 'Create account',
  },
  ln: {
    'auth.login.title': 'Kokota',
    'auth.login.subtitle': 'Kota na esika na yo ya boyangeli mateya',
    'auth.login.submit': 'Kokota',
    'auth.signup.title': 'Kosala compte',
    'auth.signup.subtitle': 'Tondisa makambo na yo mpo na kokota na plateforme',
    'auth.signup.submit': 'Kosala compte',
    'auth.fields.email': 'Email',
    'auth.fields.fullName': 'Nkombo mobimba',
    'auth.fields.password': 'Mot de passe',
    'auth.fields.passwordConfirmation': 'Ndimisa mot de passe',
    'auth.fields.role': 'Role',
    'nav.login': 'Kokota',
    'nav.logout': 'Kobima',
    'nav.signup': 'Kosala compte',
  },
  sw: {
    'auth.login.title': 'Ingia',
    'auth.login.subtitle': 'Ingia kwenye nafasi yako ya usimamizi wa elimu',
    'auth.login.submit': 'Ingia',
    'auth.signup.title': 'Fungua akaunti',
    'auth.signup.subtitle': 'Jaza taarifa zako ili ujiunge na jukwaa',
    'auth.signup.submit': 'Fungua akaunti',
    'auth.fields.email': 'Email',
    'auth.fields.fullName': 'Jina kamili',
    'auth.fields.password': 'Nenosiri',
    'auth.fields.passwordConfirmation': 'Thibitisha nenosiri',
    'auth.fields.role': 'Role',
    'nav.login': 'Ingia',
    'nav.logout': 'Toka',
    'nav.signup': 'Fungua akaunti',
  },
  kg: {
    'auth.login.title': 'Kukota',
    'auth.login.subtitle': 'Kota na kisika kiaku kia lutwadisu lwa malongi',
    'auth.login.submit': 'Kukota',
    'auth.signup.title': 'Sala compte',
    'auth.signup.subtitle': 'Sonika bansangu zaku sambu na kukota na plateforme',
    'auth.signup.submit': 'Sala compte',
    'auth.fields.email': 'Email',
    'auth.fields.fullName': 'Nkumbu ya mvimba',
    'auth.fields.password': 'Mot de passe',
    'auth.fields.passwordConfirmation': 'Ndimisa mot de passe',
    'auth.fields.role': 'Role',
    'nav.login': 'Kukota',
    'nav.logout': 'Kubasika',
    'nav.signup': 'Sala compte',
  },
  lua: {
    'auth.login.title': 'Kulowa',
    'auth.login.subtitle': 'Lowa mu tshitupa tshieba tsha bulombodi bua dilonga',
    'auth.login.submit': 'Kulowa',
    'auth.signup.title': 'Bumba compte',
    'auth.signup.subtitle': 'Tshila malu ebe bua kulowa mu plateforme',
    'auth.signup.submit': 'Bumba compte',
    'auth.fields.email': 'Email',
    'auth.fields.fullName': 'Dina dijima',
    'auth.fields.password': 'Mot de passe',
    'auth.fields.passwordConfirmation': 'Ndimisa mot de passe',
    'auth.fields.role': 'Role',
    'nav.login': 'Kulowa',
    'nav.logout': 'Kupatuka',
    'nav.signup': 'Bumba compte',
  },
}

export function normalizeLocale(locale?: string | null): SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale) ? (locale as SupportedLocale) : 'fr'
}

export function translate(locale: string | null | undefined, key: TranslationKey) {
  const normalizedLocale = normalizeLocale(locale)

  return translations[normalizedLocale][key] ?? translations.fr[key] ?? key
}
