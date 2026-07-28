import edge from 'edge.js'
import { migrate } from 'edge.js/plugins/migrate'

edge.use(migrate)

const exactPageAreas = [
  {
    path: '/parent/dashboard',
    title: 'Espace Parent',
    subtitle: 'Suivez la scolarité de vos enfants.',
  },
  {
    path: '/parent/classes',
    title: 'Classes',
    subtitle: 'Consultez uniquement les classes de vos enfants.',
  },
  {
    path: '/parent/subjects',
    title: 'Matières',
    subtitle: 'Matières suivies par vos enfants, selon leurs classes.',
  },
  {
    path: '/parent/children',
    title: 'Mes enfants',
    subtitle: 'Liste de tous vos enfants inscrits.',
  },
  {
    path: '/parent/teachers',
    title: 'Enseignants',
    subtitle: 'Enseignants rattachés aux classes et matières de vos enfants.',
  },
  {
    path: '/parent/grades',
    title: 'Notes des enfants',
    subtitle: 'Consultez les résultats scolaires.',
  },
  {
    path: '/parent/discipline',
    title: 'Suivi disciplinaire',
    subtitle: 'Consultez le comportement de vos enfants.',
  },
  {
    path: '/parent/attendance',
    title: 'Suivi des présences',
    subtitle: "Consultez l'assiduité de vos enfants.",
  },
  {
    path: '/parent/attendance/justify',
    title: "Justification d'absence",
    subtitle: 'Expliquez une absence et joignez les informations utiles.',
  },
  {
    path: '/parent/payments',
    title: 'Paiements des enfants',
    subtitle: "Consultez l'historique des transactions.",
  },
  {
    path: '/parent/payments/history',
    title: 'Historique des paiements',
    subtitle: 'Consultez toutes les transactions enregistrées.',
  },
  {
    path: '/parent/payments/status',
    title: 'Situation financière',
    subtitle: 'Suivez les montants dus, payés et restants.',
  },
  {
    path: '/parent/messages',
    title: 'Messagerie',
    subtitle: 'Consultez et gérez vos messages.',
  },
  {
    path: '/parent/messages/send',
    title: 'Nouveau message',
    subtitle: "Envoyez un message à un membre de l'équipe scolaire.",
  },
  {
    path: '/parent/messages/notifications',
    title: 'Notifications',
    subtitle: 'Centre de notifications.',
  },
  {
    path: '/parent/appointments',
    title: 'Rendez-vous',
    subtitle: 'Gérez vos rendez-vous avec les enseignants.',
  },
  {
    path: '/parent/appointments/request',
    title: 'Demande de rendez-vous',
    subtitle: 'Prenez rendez-vous avec un enseignant.',
  },
  {
    path: '/parent/appointments/reschedule',
    title: 'Demande de rendez-vous',
    subtitle: 'Prenez rendez-vous avec un enseignant.',
  },
  {
    path: '/parent/appointments/schedule',
    title: 'Planning des rendez-vous',
    subtitle: 'Vue hebdomadaire de vos rendez-vous.',
  },
]

const patternPageAreas = [
  {
    pattern: /^\/parent\/children\/[^/]+\/profile$/,
    title: "Profil de l'élève",
    subtitle: "Consultez les informations détaillées de l'élève.",
  },
  {
    pattern: /^\/parent\/children\/[^/]+$/,
    title: "Détails de l'élève",
    subtitle: "Consultez le dossier scolaire de l'élève.",
  },
  {
    pattern: /^\/parent\/grades\/child\/[^/]+$/,
    title: 'Détail des résultats',
    subtitle: 'Consultez les notes détaillées par matière.',
  },
  {
    pattern: /^\/parent\/(?:grades\/report-card|report-card\/child)\/[^/]+$/,
    title: 'Bulletin scolaire',
    subtitle: "Consultez le bulletin de l'élève.",
  },
  {
    pattern: /^\/parent\/discipline\/(?:details\/)?[^/]+$/,
    title: "Détail de l'incident",
    subtitle: 'Consultez les informations de discipline.',
  },
  {
    pattern: /^\/parent\/payments\/(?:receipt|print-receipt)\/[^/]+$/,
    title: 'Reçu de paiement',
    subtitle: 'Consultez le reçu de la transaction.',
  },
  {
    pattern: /^\/parent\/messages\/[^/]+$/,
    title: 'Conversation',
    subtitle: 'Suivez vos échanges avec l’école.',
  },
  {
    pattern: /^\/parent\/appointments\/[^/]+$/,
    title: 'Rendez-vous',
    subtitle: 'Consultez les détails du rendez-vous.',
  },
]

const pageAreas = [
  {
    prefixes: ['/schools/subjects'],
    title: 'Gestion des matières',
    subtitle: 'Créez les matières puis assignez-les aux classes et aux enseignants.',
  },
  {
    prefixes: ['/academic/classes', '/schools/classes', '/teacher/classes'],
    title: 'Gestion des classes',
    subtitle: 'Organisez les classes, leurs élèves, leurs matières et leurs enseignants.',
  },
  {
    prefixes: ['/students'],
    title: 'Gestion des élèves',
    subtitle: 'Consultez les dossiers des élèves et gérez leur parcours scolaire.',
  },
  {
    prefixes: ['/teachers', '/schools/teachers', '/teacher/dashboard'],
    title: 'Espace enseignant',
    subtitle: 'Gérez les enseignants, leurs cours, leurs classes et leurs activités.',
  },
  {
    prefixes: ['/schools/accounts', '/admin/users'],
    title: 'Gestion des comptes',
    subtitle: 'Créez les comptes et gérez les accès des utilisateurs.',
  },
  {
    prefixes: ['/academic/grades', '/teacher/grades', '/student/grades', '/parent/grades'],
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
    prefixes: ['/schools/timetable', '/teacher/timetable', '/student/timetable'],
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
    prefixes: ['/help'],
    title: "Centre d'aide",
    subtitle: 'Consultez la FAQ, les guides, les tutoriels et la documentation.',
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
    prefixes: ['/inspection/help-feedback'],
    title: 'Retours sur la documentation',
    subtitle: "Consultez les remarques envoyées depuis les pages d'aide.",
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
    prefixes: ['/parent/dashboard'],
    title: 'Espace Parent',
    subtitle: 'Suivez la scolarité de vos enfants.',
  },
  {
    prefixes: ['/parent/classes'],
    title: 'Classes',
    subtitle: 'Consultez uniquement les classes de vos enfants.',
  },
  {
    prefixes: ['/parent/subjects'],
    title: 'Matières',
    subtitle: 'Matières suivies par vos enfants, selon leurs classes.',
  },
  {
    prefixes: ['/parent/children'],
    title: 'Suivi des enfants',
    subtitle: 'Consultez les informations scolaires et la progression de vos enfants.',
  },
  {
    prefixes: ['/parent/teachers'],
    title: 'Enseignants',
    subtitle: 'Enseignants rattachés aux classes et matières de vos enfants.',
  },
  {
    prefixes: ['/parent/messages'],
    title: 'Messages',
    subtitle: "Échangez avec l'équipe scolaire et suivez vos conversations.",
  },
  {
    prefixes: ['/parent/appointments'],
    title: 'Rendez-vous',
    subtitle: 'Planifiez et suivez les rendez-vous scolaires.',
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
  const path =
    String(requestUrl || '/')
      .split('?')[0]
      .replace(/\/+$/, '') || '/'
  const exactArea = exactPageAreas.find((item) => item.path === path)
  const patternArea = patternPageAreas.find((item) => item.pattern.test(path))
  const area =
    exactArea ||
    patternArea ||
    pageAreas.find(({ prefixes }) =>
      prefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
    )

  let title = area?.title || 'Tableau de bord'
  let subtitle = area?.subtitle || 'Consultez les informations essentielles et gérez vos activités.'

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
