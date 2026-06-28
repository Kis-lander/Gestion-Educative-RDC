import edge from 'edge.js'
import { migrate } from 'edge.js/plugins/migrate'

edge.use(migrate)

const pageAreas = [
  {
    prefixes: ['/schools/subjects'],
    title: 'Gestion des matières',
    subtitle: 'Créez les matières puis assignez-les aux classes et aux enseignants.',
  },
  {
    prefixes: ['/academic/classes', '/schools/classes'],
    title: 'Gestion des classes',
    subtitle: 'Organisez les classes, leurs élèves, leurs matières et leurs enseignants.',
  },
  {
    prefixes: ['/students'],
    title: 'Gestion des élèves',
    subtitle: 'Consultez les dossiers des élèves et gérez leur parcours scolaire.',
  },
  {
    prefixes: ['/teachers', '/schools/teachers', '/teacher'],
    title: 'Espace enseignant',
    subtitle: 'Gérez les enseignants, leurs cours, leurs classes et leurs activités.',
  },
  {
    prefixes: ['/schools/accounts', '/admin/users'],
    title: 'Gestion des comptes',
    subtitle: 'Créez les comptes et gérez les accès des utilisateurs.',
  },
  {
    prefixes: ['/academic/grades', '/student/grades', '/parent/grades'],
    title: 'Notes et évaluations',
    subtitle: 'Saisissez, consultez et analysez les résultats scolaires.',
  },
  {
    prefixes: ['/academic/report-cards'],
    title: 'Bulletins scolaires',
    subtitle: 'Générez et consultez les bulletins des élèves.',
  },
  {
    prefixes: ['/academic/exams'],
    title: 'Gestion des examens',
    subtitle: 'Planifiez les examens et consultez leurs résultats.',
  },
  {
    prefixes: ['/academic/calendar'],
    title: 'Calendrier scolaire',
    subtitle: 'Planifiez les événements et les activités de l’année scolaire.',
  },
  {
    prefixes: ['/academic/sessions'],
    title: 'Sessions scolaires',
    subtitle: 'Configurez et suivez les périodes de l’année scolaire.',
  },
  {
    prefixes: ['/schools/timetable', '/student/timetable'],
    title: 'Emploi du temps',
    subtitle: 'Organisez et consultez les horaires de cours.',
  },
  {
    prefixes: ['/discipline', '/student/discipline', '/parent/discipline'],
    title: 'Gestion de la discipline',
    subtitle: 'Suivez les incidents, les sanctions et les mesures disciplinaires.',
  },
  {
    prefixes: ['/financial', '/parent/payments'],
    title: 'Gestion financière',
    subtitle: 'Suivez les frais scolaires, les paiements et les rapports financiers.',
  },
  {
    prefixes: ['/communication/messages'],
    title: 'Messagerie',
    subtitle: 'Échangez des messages avec les membres de la communauté scolaire.',
  },
  {
    prefixes: ['/communication/groups'],
    title: 'Groupes de communication',
    subtitle: 'Créez des groupes et organisez leurs membres.',
  },
  {
    prefixes: ['/communication/notifications'],
    title: 'Notifications',
    subtitle: 'Consultez et configurez les notifications de la plateforme.',
  },
  {
    prefixes: ['/schools/transfers', '/student/transfers'],
    title: 'Transferts scolaires',
    subtitle: 'Gérez et suivez les demandes de transfert des élèves.',
  },
  {
    prefixes: ['/schools/profile', '/profile'],
    title: 'Profil et préférences',
    subtitle: 'Consultez et mettez à jour les informations du profil.',
  },
  {
    prefixes: ['/settings', '/admin/settings'],
    title: 'Paramètres',
    subtitle: 'Configurez les préférences et les règles de fonctionnement.',
  },
  {
    prefixes: ['/inspection/schools'],
    title: 'Établissements scolaires',
    subtitle: 'Consultez, approuvez et supervisez les établissements scolaires.',
  },
  {
    prefixes: ['/inspection/teachers'],
    title: 'Enseignants',
    subtitle: 'Consultez les enseignants des établissements supervisés.',
  },
  {
    prefixes: ['/inspection/communications'],
    title: 'Communication de l’inspection',
    subtitle: 'Diffusez et suivez les communications adressées aux établissements.',
  },
  {
    prefixes: ['/inspection/reports', '/reports'],
    title: 'Rapports et analyses',
    subtitle: 'Consultez les indicateurs et générez les rapports de suivi.',
  },
  {
    prefixes: ['/inspection/settings'],
    title: 'Paramètres de l’inspection',
    subtitle: 'Configurez les préférences et les règles de supervision.',
  },
  {
    prefixes: ['/parent/children'],
    title: 'Suivi des enfants',
    subtitle: 'Consultez les informations scolaires et la progression de vos enfants.',
  },
  {
    prefixes: ['/student/assignments', '/teacher/assignments'],
    title: 'Devoirs et travaux',
    subtitle: 'Créez, consultez et suivez les devoirs scolaires.',
  },
  {
    prefixes: ['/student/attendance', '/teacher/attendance', '/parent/attendance'],
    title: 'Présences',
    subtitle: 'Consultez et gérez les présences et les absences.',
  },
  {
    prefixes: ['/student/forum', '/teacher/forum'],
    title: 'Forum pédagogique',
    subtitle: 'Partagez des questions, des réponses et des ressources pédagogiques.',
  },
  {
    prefixes: ['/inter-school'],
    title: 'Échanges interscolaires',
    subtitle: 'Découvrez et organisez les activités entre établissements.',
  },
  {
    prefixes: ['/admin/roles'],
    title: 'Rôles et permissions',
    subtitle: 'Définissez les rôles et contrôlez les autorisations.',
  },
  {
    prefixes: ['/admin/logs'],
    title: 'Journaux du système',
    subtitle: 'Consultez les activités et les événements enregistrés.',
  },
]

edge.global('pageHeader', (requestUrl: unknown) => {
  const path = String(requestUrl || '/').split('?')[0].replace(/\/+$/, '') || '/'
  const area = pageAreas.find(({ prefixes }) =>
    prefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
  )

  let title = area?.title || 'Tableau de bord'
  let subtitle =
    area?.subtitle || 'Consultez les informations essentielles et gérez vos activités.'

  if (path.includes('/classes-archives')) {
    return {
      title: 'Archives des classes',
      subtitle: 'Restaurez une classe archivée ou supprimez-la définitivement.',
    }
  }

  if (path.includes('/subjects/assign')) {
    return {
      title: 'Assignation des matières',
      subtitle: 'Associez chaque matière à une classe, un enseignant et un volume horaire.',
    }
  }

  if (/\/create(?:\/|$)/.test(path)) {
    title = `Créer — ${title}`
    subtitle = `Renseignez les informations nécessaires pour ajouter un nouvel élément.`
  } else if (/\/edit(?:\/|$)/.test(path) || /\/[^/]+\/edit$/.test(path)) {
    title = `Modifier — ${title}`
    subtitle = 'Mettez à jour les informations puis enregistrez vos modifications.'
  } else if (path.includes('/reports/') || path.endsWith('/reports')) {
    title = `Rapport — ${title}`
    subtitle = 'Analysez les données disponibles et consultez les indicateurs détaillés.'
  }

  return { title, subtitle }
})

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
