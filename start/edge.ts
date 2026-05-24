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
