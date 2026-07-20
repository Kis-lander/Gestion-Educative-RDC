import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import { positionLabel } from '#services/school_governance_service'
import { randomBytes } from 'node:crypto'
import { extname } from 'node:path'

const popularArticles = [
  {
    slug: 'accounts',
    title: 'Créer les comptes de votre école',
    description: 'Directeurs, enseignants, élèves, parents, responsables de section et personnel administratif.',
    link: '/help/guides#accounts',
    icon: 'fa-user-plus',
  },
  {
    slug: 'grades',
    title: 'Saisir et publier les notes',
    description: 'De la saisie enseignant à la consultation par les parents et les élèves.',
    link: '/help/guides#grades',
    icon: 'fa-star',
  },
  {
    slug: 'finance',
    title: 'Enregistrer un paiement et imprimer un reçu',
    description: 'Frais scolaires, paiements, reçus, bourses, plans de paiement et impayés.',
    link: '/help/guides#finance',
    icon: 'fa-receipt',
  },
  {
    slug: 'transfers',
    title: 'Suivre une demande de transfert',
    description: "Circuit entre l'école de départ, l'école d'accueil et l'inspection.",
    link: '/help/documentation#transfers',
    icon: 'fa-right-left',
  },
  {
    slug: 'communication',
    title: 'Communiquer avec les familles',
    description: 'Messages, notifications, conversations et suivi des échanges.',
    link: '/help/documentation#communication',
    icon: 'fa-comments',
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
  },
  {
    id: 'accounts',
    category: 'administrators',
    categoryLabel: 'Administration',
    title: 'Créer les utilisateurs et limiter leurs accès',
    description: "Attribuez les rôles, sections et périmètres pour protéger les données de l'école.",
    readTime: 7,
    difficulty: 'Intermédiaire',
    icon: 'fa-users-gear',
    color: 'from-slate-700 to-slate-900',
    link: '/help/documentation#user-management',
  },
  {
    id: 'students',
    category: 'administrators',
    categoryLabel: 'Scolarité',
    title: 'Gérer élèves, classes et matières',
    description: 'Inscrivez les élèves, organisez les classes et assignez les matières du programme national.',
    readTime: 10,
    difficulty: 'Essentiel',
    icon: 'fa-school',
    color: 'from-emerald-600 to-teal-600',
    link: '/help/documentation#academic',
  },
  {
    id: 'grades',
    category: 'teachers',
    categoryLabel: 'Enseignants',
    title: 'Saisir, corriger et publier les notes',
    description: 'Utilisez les vues par classe, matière et trimestre avant la génération des bulletins.',
    readTime: 6,
    difficulty: 'Essentiel',
    icon: 'fa-pen-to-square',
    color: 'from-amber-500 to-orange-600',
    link: '/help/documentation#academic',
  },
  {
    id: 'finance',
    category: 'administrators',
    categoryLabel: 'Finances',
    title: 'Piloter frais scolaires et paiements',
    description: 'Définissez les frais, encaissez les paiements, imprimez les reçus et suivez les impayés.',
    readTime: 9,
    difficulty: 'Intermédiaire',
    icon: 'fa-coins',
    color: 'from-green-600 to-lime-600',
    link: '/help/documentation#financial',
  },
  {
    id: 'discipline',
    category: 'administrators',
    categoryLabel: 'Discipline',
    title: 'Suivre incidents, sanctions et appels',
    description: 'Déclarez un incident, appliquez une sanction, notifiez les parents et consultez les rapports.',
    readTime: 7,
    difficulty: 'Intermédiaire',
    icon: 'fa-scale-balanced',
    color: 'from-red-600 to-rose-700',
    link: '/help/documentation#discipline',
  },
  {
    id: 'parents',
    category: 'parents',
    categoryLabel: 'Parents',
    title: "Suivre la scolarité d'un enfant",
    description: "Consultez notes, présences, discipline, paiements et messages depuis l'espace parent.",
    readTime: 5,
    difficulty: 'Facile',
    icon: 'fa-children',
    color: 'from-pink-600 to-rose-600',
    link: '/help/documentation#family-spaces',
  },
]

const tutorials = [
  {
    category: 'basics',
    title: 'Prendre en main le tableau de bord',
    description: 'Repérez les raccourcis, notifications, modules visibles et actions rapides selon votre rôle.',
    duration: '4 min',
    steps: 4,
    icon: 'fa-gauge-high',
  },
  {
    category: 'features',
    title: 'Créer une classe et y affecter les matières',
    description: "Préparez la structure pédagogique avant l'inscription ou l'affectation des élèves.",
    duration: '6 min',
    steps: 5,
    icon: 'fa-chalkboard',
  },
  {
    category: 'features',
    title: 'Envoyer une communication ciblée',
    description: 'Rédigez un message, choisissez les destinataires et suivez les conversations.',
    duration: '5 min',
    steps: 4,
    icon: 'fa-envelope-open-text',
  },
  {
    category: 'features',
    title: 'Traiter une demande de transfert',
    description: "Vérifiez l'autorisation, le statut et l'historique avant de finaliser la décision.",
    duration: '6 min',
    steps: 5,
    icon: 'fa-right-left',
  },
  {
    category: 'advanced',
    title: 'Analyser les rapports scolaires et financiers',
    description: 'Comparez performance, recouvrement, discipline et transferts pour décider avec de bons indicateurs.',
    duration: '8 min',
    steps: 6,
    icon: 'fa-chart-line',
  },
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
    const normalizedSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 120)
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

  public async index({ view }: HttpContext) {
    await this.incrementHelpView('help-index')
    const viewCounts = await this.getHelpViewCounts(popularArticles.map((article) => article.slug))

    return view.render('help/index', {
      popularArticles: popularArticles.map((article) => ({
        ...article,
        views: viewCounts.get(article.slug) || 0,
      })),
    })
  }

  public async faq({ view }: HttpContext) {
    await this.incrementHelpView('faq')
    return view.render('help/faq')
  }

  public async guides({ view }: HttpContext) {
    await this.incrementHelpView('guides')
    const viewCounts = await this.getHelpViewCounts(guides.map((guide) => guide.id))
    const guidesWithViews = guides.map((guide) => ({
      ...guide,
      views: viewCounts.get(guide.id) || 0,
    }))

    return view.render('help/guides', {
      guides: guidesWithViews,
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

  public async tutorial({ view }: HttpContext) {
    await this.incrementHelpView('tutorial')
    return view.render('help/tutorial', { tutorials })
  }

  public async contact({ view }: HttpContext) {
    await this.incrementHelpView('contact')
    return view.render('help/contact')
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
      session.flash('error', "Aucun compte inspection actif n'est disponible pour recevoir votre demande.")
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

    session.flash('success', 'Votre demande a été enregistrée. Le support vous répondra dès que possible.')
    return response.redirect('/help/contact')
  }

  public async documentation({ view }: HttpContext) {
    await this.incrementHelpView('documentation')
    return view.render('help/documentation')
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
    const page = String(request.input('page', 'documentation')).trim().slice(0, 120) || 'documentation'
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
