import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * Messages d'erreur personnalisés en français
 */
const financialMessages = {
  'feeType.required': 'Le type de frais est requis',
  'amount.required': 'Le montant est requis',
  'amount.min': 'Le montant doit être positif',
  'academicYear.required': "L'année académique est requise",
  'studentId.exists': "L'élève spécifié n'existe pas",
  'feeId.exists': "Le type de frais spécifié n'existe pas",
  'amountPaid.range': 'Le montant doit être compris entre 0.01 et 999999.99',
  'paymentDate.required': 'La date de paiement est requise',
  'paymentMethod.required': 'Le mode de paiement est requis',
}

/**
 * Validateur pour configurer les frais scolaires
 */
export const setSchoolFeesValidator = vine.create(
  vine.object({
    feeType: vine.string().trim(),
    amount: vine.number().min(0),
    currency: vine.enum(['USD', 'CDF', 'EUR']).optional(),
    academicYear: vine.string().trim(),
    term: vine.string().trim().optional(),
    isMandatory: vine.boolean().optional(),
    description: vine.string().trim().optional(),
  })
)

/**
 * Validateur pour enregistrer un paiement
 */
export const recordPaymentValidator = vine.create(
  vine.object({
    studentId: vine.string().exists({ table: 'students', column: 'id' }),
    feeId: vine.string().exists({ table: 'school_fees', column: 'id' }),
    amountPaid: vine.number().range([0.01, 999999.99]),
    paymentDate: vine.date({ formats: ['YYYY-MM-DD'] }),
    paymentMethod: vine.enum(['cash', 'bank_transfer', 'mobile_money', 'check']),
    referenceNumber: vine.string().trim().optional(),
    notes: vine.string().trim().optional(),
  })
)

/**
 * Validateur pour mettre à jour les frais
 */
export const updateFeesValidator = vine.create(
  vine.object({
    amount: vine.number().min(0).optional(),
    isMandatory: vine.boolean().optional(),
    description: vine.string().trim().optional(),
  })
)

/**
 * Application des messages personnalisés (Indispensable pour éviter TS6133)
 */
const provider = new SimpleMessagesProvider(financialMessages)

setSchoolFeesValidator.messagesProvider = provider
recordPaymentValidator.messagesProvider = provider
updateFeesValidator.messagesProvider = provider
