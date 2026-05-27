import edge from 'edge.js'
import { migrate } from 'edge.js/plugins/migrate'

edge.use(migrate)

edge.global('formatDate', (value: unknown) => {
  if (!value) return '-'

  const date =
    typeof value === 'object' && value !== null && 'toJSDate' in value
      ? (value as { toJSDate: () => Date }).toJSDate()
      : new Date(value as string | number | Date)

  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
})

edge.global('formatDateTime', (value: unknown) => {
  if (!value) return '-'

  const date =
    typeof value === 'object' && value !== null && 'toJSDate' in value
      ? (value as { toJSDate: () => Date }).toJSDate()
      : new Date(value as string | number | Date)

  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
})

edge.global('formatCurrency', (amount: unknown, currency = 'USD') => {
  const numericAmount = Number(amount ?? 0)
  const value = Number.isFinite(numericAmount) ? numericAmount : 0

  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      maximumFractionDigits: currency === 'CDF' ? 0 : 2,
    }).format(value)
  } catch {
    return `${value.toLocaleString('fr-FR')} ${currency}`
  }
})
