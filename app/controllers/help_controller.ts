import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import { edgePageContext } from '#start/view_context'
import {
  getGovernanceContext,
  navigationPolicyFor,
  positionLabel,
} from '#services/school_governance_service'
import { randomBytes } from 'node:crypto'
import { extname } from 'node:path'

const popularArticles = [
  {
    slug: 'accounts',
    title: 'Créer les comptes de votre école',
    description:
      'Directeurs, enseignants, élèves, parents, responsables de section et personnel administratif.',
    link: '/help/guides#accounts',
    icon: 'fa-user-plus',
    modules: ['accounts'],
  },
  {
    slug: 'grades',
    title: 'Saisir et publier les notes',
    description: 'De la saisie enseignant à la consultation par les parents et les élèves.',
    link: '/help/guides#grades',
    icon: 'fa-star',
    modules: ['grades'],
  },
  {
    slug: 'finance',
    title: 'Enregistrer un paiement et imprimer un reçu',
    description: 'Frais scolaires, paiements, reçus, bourses, plans de paiement et impayés.',
    link: '/help/guides#finance',
    icon: 'fa-receipt',
    modules: ['finance'],
  },
  {
    slug: 'transfers',
    title: 'Suivre une demande de transfert',
    description: "Circuit entre l'école de départ, l'école d'accueil et l'inspection.",
    link: '/help/documentation#transfers',
    icon: 'fa-right-left',
    modules: ['transfers'],
  },
  {
    slug: 'communication',
    title: 'Communiquer avec les familles',
    description: 'Messages, notifications, conversations et suivi des échanges.',
    link: '/help/documentation#communication',
    icon: 'fa-comments',
    modules: ['communication'],
  },
]

const guides = [
  {
    id: 'quick-start',
    category: 'quick-start',
    categoryLabel: 'Démarrage',
    title: 'Démarrer une école en production',
    description: 'Validez le profil, créez les sections, classes, matières et premiers comptes.',
    readTime: 8,
    difficulty: 'Essentiel',
    icon: 'fa-rocket',
    color: 'from-blue-600 to-indigo-600',
    link: '/help/documentation#getting-started',
    modules: ['getting-started'],
  },
  {
    id: 'accounts',
    category: 'administrators',
    categoryLabel: 'Administration',
    title: 'Créer les utilisateurs et limiter leurs accès',
    description:
      "Attribuez les rôles, sections et périmètres pour protéger les données de l'école.",
    readTime: 7,
    difficulty: 'Intermédiaire',
    icon: 'fa-users-gear',
    color: 'from-slate-700 to-slate-900',
    link: '/help/documentation#user-management',
    modules: ['accounts'],
  },
  {
    id: 'students',
    category: 'administrators',
    categoryLabel: 'Scolarité',
    title: 'Gérer élèves, classes et matières',
    description:
      'Inscrivez les élèves, organisez les classes et assignez les matières du programme national.',
    readTime: 10,
    difficulty: 'Essentiel',
    icon: 'fa-school',
    color: 'from-emerald-600 to-teal-600',
    link: '/help/documentation#academic',
    modules: ['classes', 'students', 'subjects'],
  },
  {
    id: 'grades',
    category: 'teachers',
    categoryLabel: 'Enseignants',
    title: 'Saisir, corriger et publier les notes',
    description:
      'Utilisez les vues par classe, matière et trimestre avant la génération des bulletins.',
    readTime: 6,
    difficulty: 'Essentiel',
    icon: 'fa-pen-to-square',
    color: 'from-amber-500 to-orange-600',
    link: '/help/documentation#academic',
    modules: ['grades'],
  },
  {
    id: 'finance',
    category: 'administrators',
    categoryLabel: 'Finances',
    title: 'Piloter frais scolaires et paiements',
    description:
      'Définissez les frais, encaissez les paiements, imprimez les reçus et suivez les impayés.',
    readTime: 9,
    difficulty: 'Intermédiaire',
    icon: 'fa-coins',
    color: 'from-green-600 to-lime-600',
    link: '/help/documentation#financial',
    modules: ['finance'],
  },
  {
    id: 'discipline',
    category: 'administrators',
    categoryLabel: 'Discipline',
    title: 'Suivre incidents, sanctions et appels',
    description:
      'Déclarez un incident, appliquez une sanction, notifiez les parents et consultez les rapports.',
    readTime: 7,
    difficulty: 'Intermédiaire',
    icon: 'fa-scale-balanced',
    color: 'from-red-600 to-rose-700',
    link: '/help/documentation#discipline',
    modules: ['discipline'],
  },
  {
    id: 'parents',
    category: 'parents',
    categoryLabel: 'Parents',
    title: "Suivre la scolarité d'un enfant",
    description:
      "Consultez notes, présences, discipline, paiements et messages depuis l'espace parent.",
    readTime: 5,
    difficulty: 'Facile',
    icon: 'fa-children',
    color: 'from-pink-600 to-rose-600',
    link: '/help/documentation#family-spaces',
    modules: ['family'],
  },
]

const tutorials = [
  {
    category: 'basics',
    title: 'Prendre en main le tableau de bord',
    description:
      'Repérez les raccourcis, notifications, modules visibles et actions rapides selon votre rôle.',
    duration: '4 min',
    steps: 4,
    icon: 'fa-gauge-high',
    modules: ['dashboard'],
  },
  {
    category: 'features',
    title: 'Créer une classe et y affecter les matières',
    description:
      "Préparez la structure pédagogique avant l'inscription ou l'affectation des élèves.",
    duration: '6 min',
    steps: 5,
    icon: 'fa-chalkboard',
    modules: ['classes', 'subjects'],
  },
  {
    category: 'features',
    title: 'Envoyer une communication ciblée',
    description: 'Rédigez un message, choisissez les destinataires et suivez les conversations.',
    duration: '5 min',
    steps: 4,
    icon: 'fa-envelope-open-text',
    modules: ['communication'],
  },
  {
    category: 'features',
    title: 'Traiter une demande de transfert',
    description:
      "Vérifiez l'autorisation, le statut et l'historique avant de finaliser la décision.",
    duration: '6 min',
    steps: 5,
    icon: 'fa-right-left',
    modules: ['transfers'],
  },
  {
    category: 'advanced',
    title: 'Analyser les rapports scolaires et financiers',
    description:
      'Comparez performance, recouvrement, discipline et transferts pour décider avec de bons indicateurs.',
    duration: '8 min',
    steps: 6,
    icon: 'fa-chart-line',
    modules: ['reports', 'finance', 'discipline', 'grades'],
  },
]

const guideCategories = [
  { value: 'quick-start', label: 'Demarrage' },
  { value: 'administrators', label: 'Administration' },
  { value: 'teachers', label: 'Enseignants' },
  { value: 'parents', label: 'Parents' },
]

const tutorialCategories = [
  { value: 'basics', label: 'Bases' },
  { value: 'features', label: 'Fonctionnalites' },
  { value: 'advanced', label: 'Avance' },
]

const faqCategories = [
  { value: 'account', label: 'Comptes', modules: ['accounts'] },
  { value: 'school', label: 'Ecole', modules: ['school', 'inspection'] },
  { value: 'academic', label: 'Scolarite', modules: ['classes', 'students', 'grades'] },
  { value: 'finance', label: 'Finances', modules: ['finance'] },
  { value: 'discipline', label: 'Discipline', modules: ['discipline'] },
  { value: 'communication', label: 'Communication', modules: ['communication', 'transfers'] },
  { value: 'technical', label: 'Technique', modules: ['technical'] },
]

const documentationSections = [
  { id: 'getting-started', number: 1, title: 'Demarrage', modules: ['getting-started'] },
  { id: 'user-management', number: 2, title: 'Roles et acces', modules: ['accounts'] },
  {
    id: 'school-management',
    number: 3,
    title: 'Ecole et inspection',
    modules: ['school', 'inspection'],
  },
  {
    id: 'academic',
    number: 4,
    title: 'Scolarite',
    modules: ['classes', 'students', 'subjects', 'grades'],
  },
  { id: 'financial', number: 5, title: 'Finances', modules: ['finance'] },
  { id: 'discipline', number: 6, title: 'Discipline', modules: ['discipline'] },
  { id: 'communication', number: 7, title: 'Communication', modules: ['communication'] },
  { id: 'transfers', number: 8, title: 'Transferts', modules: ['transfers'] },
  { id: 'inter-school', number: 9, title: 'Inter-écoles', modules: ['inter-school'] },
  { id: 'family-spaces', number: 10, title: 'Espaces famille', modules: ['family'] },
  { id: 'reports', number: 11, title: 'Rapports', modules: ['reports'] },
  { id: 'troubleshooting', number: 12, title: 'Depannage', modules: ['technical'] },
]

const contactSubjectLabels: Record<string, string> = {
  access: 'Accès ou rôle',
  academic: 'Scolarité, notes ou présences',
  finance: 'Paiement ou finances',
  discipline: 'Discipline ou sanction',
  transfer: "Transfert d'élève",
  communication: 'Messages ou notifications',
  technical: 'Problème technique',
  feature: "Demande d'amélioration",
}

const contactRoleLabels: Record<string, string> = {
  inspection: 'Inspection',
  director: "Direction d'école",
  finance_director: 'Direction financière',
  teacher: 'Enseignant',
  parent: 'Parent',
  student: 'Élève',
  discipline_director: 'Direction de discipline',
  secretary: 'Secrétariat',
}

export default class HelpController {
  private async getHelpProfile(ctx: HttpContext) {
    const user = ctx.auth.user
    const modules = new Set(['dashboard', 'communication', 'technical'])
    let roleLabel = 'Utilisateur'
    let summary =
      'Consultez les aides générales, puis connectez-vous pour voir les contenus limités à votre rôle.'
    let primaryAction = 'Vérifiez les modules visibles dans le menu latéral.'
    let governance = null
    const governanceRoles = [
      'director',
      'finance_director',
      'discipline_director',
      'secretary',
      'teacher',
    ]

    if (user) {
      roleLabel = contactRoleLabels[user.role] || user.role
      summary = "Votre centre d'aide met en avant les modules visibles et les actions autorisées."
      primaryAction = 'Commencez par les guides recommandés pour votre tableau de bord.'

      if (user.schoolId && governanceRoles.includes(user.role)) {
        try {
          governance = await getGovernanceContext(user)
          roleLabel = governance.positionLabel || roleLabel
        } catch {}
      }

      const navigation = governance?.navigation || navigationPolicyFor(user.role)

      if (user.role === 'inspection') {
        ;['inspection', 'school', 'teachers', 'reports', 'communication', 'technical'].forEach(
          (module) => modules.add(module)
        )
      }

      if (user.role === 'parent') {
        ;[
          'family',
          'students',
          'grades',
          'discipline',
          'finance',
          'communication',
          'technical',
        ].forEach((module) => modules.add(module))
      }

      if (user.role === 'student') {
        ;['family', 'grades', 'classes', 'communication', 'transfers', 'technical'].forEach(
          (module) => modules.add(module)
        )
      }

      if (navigation?.canViewClasses) modules.add('classes')
      if (navigation?.canViewSubjects) modules.add('subjects')
      if (navigation?.canViewStudents) modules.add('students')
      if (navigation?.canViewTeachers) modules.add('teachers')
      if (navigation?.canViewAccounts) modules.add('accounts')
      if (navigation?.canViewGrades) modules.add('grades')
      if (navigation?.canViewDiscipline) modules.add('discipline')
      if (navigation?.canViewFinance) modules.add('finance')
      if (navigation?.canViewTransfers) modules.add('transfers')

      if (
        ['director', 'finance_director', 'discipline_director', 'secretary', 'teacher'].includes(
          user.role
        )
      ) {
        modules.add('school')
      }

      if (
        ['director', 'finance_director', 'discipline_director', 'inspection'].includes(user.role)
      ) {
        modules.add('reports')
      }

      if (['director', 'inspection'].includes(user.role)) {
        modules.add('inter-school')
      }
    } else {
      ;[
        'getting-started',
        'school',
        'inspection',
        'accounts',
        'classes',
        'students',
        'grades',
        'finance',
        'discipline',
        'communication',
        'transfers',
        'inter-school',
        'family',
        'reports',
      ].forEach((module) => modules.add(module))
    }

    modules.add('getting-started')

    const visibleModules = [...modules]
    const hasModule = (contentModules: string[]) =>
      !user || contentModules.some((module) => modules.has(module))

    const recommendedActions = [
      primaryAction,
      modules.has('accounts')
        ? 'Vérifiez les rôles et les périmètres avant de créer des comptes.'
        : null,
      modules.has('grades')
        ? 'Contrôlez la classe, la matière et le trimestre avant toute saisie de notes.'
        : null,
      modules.has('finance') ? 'Consulter les historiques avant de corriger un paiement.' : null,
      modules.has('discipline')
        ? 'Vérifiez l’élève, l’incident et la sanction avant notification aux parents.'
        : null,
      modules.has('family')
        ? 'Sélectionnez l’enfant ou le dossier lié avant de lire les données.'
        : null,
    ].filter(Boolean)

    return {
      roleLabel,
      summary,
      visibleModules,
      recommendedActions,
      filterContent: <T extends { modules?: string[] }>(items: T[]) =>
        items.filter((item) => hasModule(item.modules || [])),
      visibleFaqCategories: faqCategories.filter((category) => hasModule(category.modules)),
      visibleDocumentationSections: documentationSections.filter((section) =>
        hasModule(section.modules)
      ),
    }
  }

  private async renderHelp(ctx: HttpContext, template: string, data: Record<string, any> = {}) {
    const helpProfile = data.helpProfile || (await this.getHelpProfile(ctx))

    return ctx.view.render(
      template,
      await edgePageContext(ctx, {
        helpProfile,
        ...data,
      })
    )
  }

  private getHelpContentTitles() {
    return new Map([
      ...popularArticles.map((article) => [article.slug, article.title] as const),
      ...guides.map((guide) => [guide.id, guide.title] as const),
      ['help-index', "Centre d'aide"],
      ['faq', 'FAQ'],
      ['guides', 'Guides pratiques'],
      ['tutorial', 'Parcours tutoriels'],
      ['contact', 'Support'],
      ['documentation', 'Documentation fonctionnelle'],
    ])
  }

  private async getHelpViewCounts(slugs: string[]) {
    if (!slugs.length) return new Map<string, number>()

    try {
      const rows = await db
        .from('help_content_views')
        .select('slug', 'views_count')
        .whereIn('slug', slugs)

      return new Map(rows.map((row) => [String(row.slug), Number(row.views_count || 0)]))
    } catch {
      return new Map<string, number>()
    }
  }

  private async incrementHelpView(slug: string) {
    const normalizedSlug = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .slice(0, 120)
    const title = this.getHelpContentTitles().get(normalizedSlug)

    if (!normalizedSlug || !title) return 0

    const result = await db.rawQuery(
      `
        insert into help_content_views (slug, title, views_count, created_at, updated_at)
        values (?, ?, 1, now(), now())
        on conflict (slug)
        do update set
          title = excluded.title,
          views_count = help_content_views.views_count + 1,
          updated_at = now()
        returning views_count
      `,
      [normalizedSlug, title]
    )

    return Number(result.rows?.[0]?.views_count || 0)
  }

  private async notifyInspectionUsersAboutFeedback(feedback: {
    authorName: string | null
    page: string
    remark: string | null
    schoolId: string | null
  }) {
    const inspectionUsers = await db
      .from('users')
      .select('id')
      .where('role', 'inspection')
      .where('status', 'active')

    if (!inspectionUsers.length) return

    const now = new Date()
    const author = feedback.authorName || 'Utilisateur'
    const remarkPreview = feedback.remark
      ? feedback.remark.slice(0, 300)
      : 'Aucune remarque detaillee.'

    await db.table('messages').multiInsert(
      inspectionUsers.map((inspectionUser) => ({
        sender_id: null,
        receiver_id: inspectionUser.id,
        school_id: feedback.schoolId,
        subject: 'Nouvelle remarque sur la documentation',
        content: `${author} a signale que la page "${feedback.page}" n'etait pas utile.\n\nRemarque: ${remarkPreview}\n\n[notification-link:/inspection/help-feedback]`,
        type: 'system',
        is_global: false,
        is_read: false,
        has_attachment: false,
        created_at: now,
        updated_at: now,
      }))
    )
  }

  private async storeContactAttachment(request: HttpContext['request']) {
    const attachment = request.file('attachment', {
      size: '10mb',
      extnames: ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'zip'],
    })

    if (!attachment) return null
    if (!attachment.isValid) {
      throw new Error(attachment.errors[0]?.message || 'Fichier joint invalide.')
    }

    const extension = extname(attachment.clientName) || `.${attachment.extname || 'bin'}`
    const fileName = `${Date.now()}-${randomBytes(8).toString('hex')}${extension}`
    await attachment.move(app.publicPath('uploads/messages'), { name: fileName })

    return {
      url: `/uploads/messages/${fileName}`,
      name: attachment.clientName,
      size: attachment.size,
      mime: attachment.type ? `${attachment.type}/${attachment.subtype}` : null,
    }
  }

  private async getContactSenderRoleLabel(user: NonNullable<HttpContext['auth']['user']>) {
    if (user.schoolId) {
      const assignment = await db
        .from('school_staff_assignments')
        .where('user_id', user.id)
        .where('school_id', user.schoolId)
        .where('is_active', true)
        .select('position')
        .orderBy('is_primary', 'desc')
        .first()

      if (assignment?.position) {
        return positionLabel(assignment.position)
      }
    }

    return contactRoleLabels[user.role] || user.role
  }

  public async index(ctx: HttpContext) {
    await this.incrementHelpView('help-index')
    const helpProfile = await this.getHelpProfile(ctx)
    const visibleArticles = helpProfile.filterContent(popularArticles)
    const viewCounts = await this.getHelpViewCounts(popularArticles.map((article) => article.slug))

    return this.renderHelp(ctx, 'help/index', {
      helpProfile,
      popularArticles: visibleArticles.map((article) => ({
        ...article,
        views: viewCounts.get(article.slug) || 0,
      })),
    })
  }

  public async faq(ctx: HttpContext) {
    await this.incrementHelpView('faq')
    const helpProfile = await this.getHelpProfile(ctx)
    return this.renderHelp(ctx, 'help/faq', {
      helpProfile,
      faqCategories: helpProfile.visibleFaqCategories,
      visibleFaqCategoryValues: helpProfile.visibleFaqCategories.map((category) => category.value),
    })
  }

  public async guides(ctx: HttpContext) {
    await this.incrementHelpView('guides')
    const helpProfile = await this.getHelpProfile(ctx)
    const viewCounts = await this.getHelpViewCounts(guides.map((guide) => guide.id))
    const guidesWithViews = helpProfile.filterContent(guides).map((guide) => ({
      ...guide,
      views: viewCounts.get(guide.id) || 0,
    }))

    return this.renderHelp(ctx, 'help/guides', {
      helpProfile,
      guides: guidesWithViews,
      guideCategories: guideCategories.filter((category) =>
        guidesWithViews.some((guide) => guide.category === category.value)
      ),
      popularGuides: [...guidesWithViews]
        .sort((left, right) => right.views - left.views)
        .slice(0, 5)
        .map((guide) => ({
          id: guide.id,
          title: guide.title,
          link: guide.link,
          views: guide.views,
        })),
    })
  }

  public async tutorial(ctx: HttpContext) {
    await this.incrementHelpView('tutorial')
    const helpProfile = await this.getHelpProfile(ctx)
    const visibleTutorials = helpProfile.filterContent(tutorials)

    return this.renderHelp(ctx, 'help/tutorial', {
      helpProfile,
      tutorials: visibleTutorials,
      tutorialCategories: tutorialCategories.filter((category) =>
        visibleTutorials.some((tutorial) => tutorial.category === category.value)
      ),
    })
  }

  public async contact(ctx: HttpContext) {
    await this.incrementHelpView('contact')
    return this.renderHelp(ctx, 'help/contact')
  }

  public async sendContact({ request, response, session, auth }: HttpContext) {
    const subject = String(request.input('subject', '')).trim()
    const module = String(request.input('module', '')).trim().slice(0, 120)
    const message = String(request.input('message', '')).trim()
    const user = auth.user

    if (!subject || message.length < 10) {
      session.flash('error', 'Veuillez choisir un sujet et décrire votre demande.')
      return response.redirect('/help/contact')
    }

    const inspectionUsers = await db
      .from('users')
      .select('id')
      .where('role', 'inspection')
      .where('status', 'active')

    if (!inspectionUsers.length) {
      session.flash(
        'error',
        "Aucun compte inspection actif n'est disponible pour recevoir votre demande."
      )
      return response.redirect('/help/contact')
    }

    let attachmentData: Awaited<ReturnType<typeof this.storeContactAttachment>> = null

    try {
      attachmentData = await this.storeContactAttachment(request)
    } catch (error) {
      session.flash('error', error instanceof Error ? error.message : 'Fichier joint invalide.')
      return response.redirect('/help/contact')
    }

    const now = new Date()
    const authorName = user?.fullName || 'Utilisateur'
    const authorRole = user ? await this.getContactSenderRoleLabel(user) : null
    const subjectLabel = contactSubjectLabels[subject] || subject
    const content = [
      "Demande envoyée depuis le centre d'aide.",
      '',
      `Auteur: ${authorName}`,
      authorRole ? `Rôle: ${authorRole}` : null,
      user?.email ? `Email: ${user.email}` : null,
      module ? `Module concerné: ${module}` : null,
      '',
      message,
    ]
      .filter((line) => line !== null)
      .join('\n')

    await db.table('messages').multiInsert(
      inspectionUsers.map((inspectionUser) => ({
        sender_id: user?.id ?? null,
        receiver_id: inspectionUser.id,
        school_id: user?.schoolId ?? null,
        subject: `Support: ${subjectLabel}`,
        content,
        type: 'general',
        is_global: false,
        is_read: false,
        has_attachment: Boolean(attachmentData),
        attachment_url: attachmentData?.url || null,
        attachment_name: attachmentData?.name || null,
        attachment_size: attachmentData?.size || null,
        attachment_mime: attachmentData?.mime || null,
        created_at: now,
        updated_at: now,
      }))
    )

    session.flash(
      'success',
      'Votre demande a été enregistrée. Le support vous répondra dès que possible.'
    )
    return response.redirect('/help/contact')
  }

  public async documentation(ctx: HttpContext) {
    await this.incrementHelpView('documentation')
    const helpProfile = await this.getHelpProfile(ctx)
    return this.renderHelp(ctx, 'help/documentation', {
      helpProfile,
      documentationSections: helpProfile.visibleDocumentationSections,
      visibleDocumentationSectionIds: helpProfile.visibleDocumentationSections.map(
        (section) => section.id
      ),
    })
  }

  public async trackView({ request, response }: HttpContext) {
    const slug = String(request.input('slug', '')).trim()
    const views = await this.incrementHelpView(slug)

    if (!views) {
      return response.badRequest({
        success: false,
        message: 'Contenu introuvable.',
      })
    }

    return response.ok({ success: true, views })
  }

  public async feedback({ request, response, auth }: HttpContext) {
    const helpful = request.input('helpful') === true || request.input('helpful') === 'true'
    const page =
      String(request.input('page', 'documentation')).trim().slice(0, 120) || 'documentation'
    const remark = String(request.input('remark', '')).trim().slice(0, 2000)
    const user = auth.user

    if (!helpful && remark.length < 3) {
      return response.badRequest({
        success: false,
        message: 'Veuillez écrire une remarque avant de valider.',
      })
    }

    const authorName = user ? `${user.firstName} ${user.lastName}`.trim() : null

    await db.table('help_documentation_feedback').insert({
      helpful,
      page,
      remark: remark || null,
      status: helpful ? 'reviewed' : 'new',
      user_id: user?.id ?? null,
      school_id: user?.schoolId ?? null,
      user_role: user?.role ?? null,
      user_name: authorName,
      user_email: user?.email ?? null,
      user_agent: request.header('user-agent') ?? null,
      ip_address: request.ip(),
      created_at: new Date(),
      updated_at: new Date(),
    })

    if (!helpful) {
      await this.notifyInspectionUsersAboutFeedback({
        authorName,
        page,
        remark: remark || null,
        schoolId: user?.schoolId ?? null,
      })
    }

    return response.ok({ success: true })
  }
}
