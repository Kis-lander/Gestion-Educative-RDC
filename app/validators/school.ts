import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * Messages d'erreur personnalisés en français
 */
const schoolMessages = {
  'name.required': "Le nom de l'école est requis",
  'name.unique': 'Une école avec ce nom existe déjà',
  'province.required': 'La province est requise',
  'territory.required': 'Le territoire est requis',
  'address.required': "L'adresse est requise",
  'phone.required': 'Le numéro de téléphone est requis',
  'phone.mobile': 'Veuillez fournir un numéro de téléphone valide',
  'email.email': 'Veuillez fournir une adresse email valide',
  'directorName.required': 'Le nom du directeur est requis',
  'directorPhone.mobile': 'Veuillez fournir un numéro de téléphone valide pour le directeur',
  'schoolId.exists': "Cette école n'existe pas",
}

/**
 * Validateur pour l'enregistrement d'une école
 */
export const registerSchoolValidator = vine.create(
  vine.object({
    name: vine.string().trim().maxLength(255).unique({ table: 'schools', column: 'name' }),
    province: vine.string().trim(),
    territory: vine.string().trim(),
    address: vine.string().trim(),
    phone: vine
      .string()
      .trim()
      .mobile(() => {
        return { locale: ['fr-FR'] }
      }),
    email: vine.string().trim().email(),
    directorName: vine.string().trim(),
    directorPhone: vine
      .string()
      .trim()
      .mobile(() => {
        return { locale: ['fr-FR'] }
      }),
    directorEmail: vine.string().trim().email().optional(),
  })
)

/**
 * Validateur pour la mise à jour d'une école
 */
export const updateSchoolValidator = vine.create(
  vine.object({
    name: vine.string().trim().maxLength(255).optional(),
    province: vine.string().trim().optional(),
    territory: vine.string().trim().optional(),
    address: vine.string().trim().optional(),
    phone: vine.string().trim().optional(),
    email: vine.string().trim().email().optional(),
    logoUrl: vine.string().trim().optional(),
  })
)

/**
 * Validateur pour l'approbation d'une école
 */
export const approveSchoolValidator = vine.create(
  vine.object({
    schoolId: vine.string().exists({ table: 'schools', column: 'id' }),
    notes: vine.string().trim().optional(),
  })
)

/**
 * Application des messages personnalisés (Indispensable pour supprimer l'erreur TS6133)
 */
const provider = new SimpleMessagesProvider(schoolMessages)

registerSchoolValidator.messagesProvider = provider
updateSchoolValidator.messagesProvider = provider
approveSchoolValidator.messagesProvider = provider
