import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import ForumPost from '#models/forum_post'
import ForumTopic from '#models/forum_topic'
import Class from '#models/class'
import Message from '#models/message'
import Student from '#models/student'
import Subject from '#models/subject'
import User from '#models/user'
import { edgePageContext } from '#start/view_context'
import { getGovernanceContext } from '#services/school_governance_service'
import { randomBytes } from 'node:crypto'
import { extname, join, parse } from 'node:path'
import { DateTime } from 'luxon'

type ForumAudience = 'student' | 'teacher'
type SectionScope = { sectionId: string | null; classId: string | null; schoolId: string | null }

export default class ForumsController {
  private contentDispositionFilename(filename: string) {
    const asciiFallback =
      filename
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\x20-\x7E]/g, '_')
        .replace(/["\\]/g, '') || 'fichier-forum'

    return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodeURIComponent(filename)}`
  }

  private async storeForumAttachment(request: HttpContext['request']) {
    const attachment = request.file('attachment', {
      size: '20mb',
      extnames: ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'zip'],
    })

    if (!attachment) return null
    if (!attachment.isValid) {
      throw new Error(attachment.errors[0]?.message || 'Fichier joint invalide')
    }

    const extension = extname(attachment.clientName) || `.${attachment.extname || 'bin'}`
    const fileName = `${Date.now()}-${randomBytes(8).toString('hex')}${extension}`
    await attachment.move(app.publicPath('uploads/forum'), { name: fileName })

    return {
      url: `/uploads/forum/${fileName}`,
      name: attachment.clientName,
      size: attachment.size,
      mime: attachment.type ? `${attachment.type}/${attachment.subtype}` : null,
    }
  }

  private async getDownloadFilename(tableName: 'forum_topics' | 'forum_posts', itemId: string, originalName?: string | null) {
    const filename = originalName || 'fichier-forum'
    const duplicateRows = await db
      .from(tableName)
      .where('attachment_name', filename)
      .whereNotNull('attachment_url')
      .orderBy('created_at', 'asc')
      .select('id')

    const duplicateIndex = duplicateRows.findIndex((row) => String(row.id) === String(itemId))
    if (duplicateRows.length <= 1 || duplicateIndex <= 0) return filename

    const parsed = parse(filename)
    return `${parsed.name} (${duplicateIndex + 1})${parsed.ext}`
  }

  private formatAttachment(
    data: {
      id: string
      attachmentUrl?: string | null
      attachmentName?: string | null
      attachmentSize?: number | null
      attachmentMime?: string | null
    },
    type: 'topic' | 'post'
  ) {
    if (!data.attachmentUrl) return {}

    return {
      attachmentUrl: data.attachmentUrl,
      attachmentDownloadUrl: `/api/forum/${type}/${data.id}/attachment`,
      attachmentName: data.attachmentName || 'Fichier joint',
      attachmentSize: data.attachmentSize,
      attachmentMime: data.attachmentMime,
      attachmentIsImage: Boolean(data.attachmentMime?.startsWith('image/')),
    }
  }

  private async resolveSection(user: User) {
    if (user.role === 'student') {
      const student = await Student.query()
        .where('user_id', user.id)
        .preload('class')
        .firstOrFail()

      return {
        sectionId: student.class?.schoolSectionId || null,
        classId: student.classId,
        schoolId: student.schoolId,
      }
    }

    const governance = await getGovernanceContext(user)

    return {
      sectionId: governance.sectionId,
      classId: null,
      schoolId: user.schoolId,
    }
  }

  private async sectionClassIds(sectionId: string | null, schoolId: string | null) {
    if (!sectionId || !schoolId) return []

    const classes = await Class.query()
      .where('school_id', schoolId)
      .where('school_section_id', sectionId)
      .whereNull('archived_at')
      .orderBy('grade_level', 'asc')
      .orderBy('name', 'asc')

    return classes.map((classObj) => classObj.id)
  }

  private async sectionClasses(sectionId: string | null, schoolId: string | null) {
    if (!sectionId || !schoolId) return []

    return Class.query()
      .where('school_id', schoolId)
      .where('school_section_id', sectionId)
      .whereNull('archived_at')
      .orderBy('grade_level', 'asc')
      .orderBy('name', 'asc')
  }

  private async getSectionForumRecipientIds(scope: SectionScope, authorId: string) {
    if (!scope.sectionId || !scope.schoolId) return []

    const classIds = await this.sectionClassIds(scope.sectionId, scope.schoolId)
    const recipientIds = new Set<string>()

    if (classIds.length) {
      const studentRows = await db
        .from('students')
        .join('users', 'students.user_id', 'users.id')
        .whereIn('students.class_id', classIds)
        .where('students.school_id', scope.schoolId)
        .where('students.academic_status', 'active')
        .where('users.status', 'active')
        .select('users.id')

      studentRows.forEach((row) => recipientIds.add(String(row.id)))
    }

    const staffRows = await db
      .from('school_staff_assignments')
      .join('users', 'school_staff_assignments.user_id', 'users.id')
      .where('school_staff_assignments.school_id', scope.schoolId)
      .where('school_staff_assignments.is_active', true)
      .where('users.status', 'active')
      .where((query) => {
        query
          .where('school_staff_assignments.school_section_id', scope.sectionId!)
          .orWhereNull('school_staff_assignments.school_section_id')
      })
      .select('users.id')

    staffRows.forEach((row) => recipientIds.add(String(row.id)))
    recipientIds.delete(authorId)

    return [...recipientIds]
  }

  private forumLinkForRole(role: string | null | undefined, topicId: string) {
    return role === 'student' ? `/student/forum/topic/${topicId}` : `/teacher/forum/topic/${topicId}`
  }

  private async notifyForumMessage(
    scope: SectionScope,
    author: User,
    topic: ForumTopic,
    content: string,
    action: 'topic' | 'reply'
  ) {
    const recipientIds = await this.getSectionForumRecipientIds(scope, author.id)
    if (!recipientIds.length || !scope.schoolId) return

    const schoolId = scope.schoolId
    const recipients = await User.query().whereIn('id', recipientIds)
    const preview = content.trim() || topic.attachmentName || 'Fichier joint'
    const subject =
      action === 'topic'
        ? `Forum pédagogique : ${topic.title}`
        : `Nouvelle réponse : ${topic.title}`

    await Message.createMany(
      recipients.map((recipient) => ({
        senderId: author.id,
        receiverId: recipient.id,
        schoolId,
        subject,
        content: `${author.fullName}: ${preview}\n\n[forum-link:${this.forumLinkForRole(recipient.role, topic.id)}]`,
        type: 'system' as const,
        isGlobal: false,
        isRead: false,
        hasAttachment: false,
      }))
    )
  }

  private formatTopic(topic: ForumTopic & { posts?: ForumPost[] }, currentUserId?: string) {
    const posts = topic.posts || []
    const participants = new Set([topic.createdBy, ...posts.map((post) => post.userId).filter(Boolean)])
    const lastReply = posts
      .slice()
      .sort((a, b) => Number(a.createdAt?.toMillis() || 0) - Number(b.createdAt?.toMillis() || 0))
      .at(-1)

    return {
      id: topic.id,
      title: topic.title,
      content: topic.content,
      subjectName: topic.subject?.name || 'Discussion générale',
      className: topic.class?.name || 'Section',
      authorName: topic.creator?.fullName || 'Membre supprimé',
      isTeacher: topic.creator?.role === 'teacher' || topic.creator?.role === 'director',
      isMine: topic.createdBy === currentUserId,
      canEdit: topic.createdBy === currentUserId,
      canDelete: topic.createdBy === currentUserId,
      isPinned: topic.isPinned,
      isLocked: topic.isLocked,
      isResolved: Boolean(topic.isResolved),
      hasAnswer: Boolean(topic.isResolved) || posts.length > 0,
      repliesCount: posts.length,
      participants: participants.size,
      views: topic.viewsCount || 0,
      createdAt: topic.createdAt.toFormat('dd/MM/yyyy'),
      createdTime: topic.createdAt.toFormat('HH:mm'),
      edited: Boolean(topic.editedAt),
      editedAt: topic.editedAt?.toFormat('dd/MM/yyyy HH:mm') || null,
      lastReplyAt: lastReply?.createdAt?.toFormat('dd/MM/yyyy HH:mm') || null,
      ...this.formatAttachment(topic, 'topic'),
    }
  }

  private formatReply(reply: ForumPost, currentUserId?: string) {
    return {
      id: reply.id,
      content: reply.content,
      authorName: reply.user?.fullName || 'Membre supprimé',
      isTeacher: reply.user?.role === 'teacher' || reply.user?.role === 'director',
      isMine: reply.userId === currentUserId,
      canEdit: reply.userId === currentUserId,
      canDelete: reply.userId === currentUserId,
      parentPostId: reply.parentPostId,
      parentTopicId: reply.parentTopicId,
      parentTarget: reply.parentPost
        ? {
            type: 'post',
            id: reply.parentPost.id,
            authorName: reply.parentPost.user?.fullName || 'Auteur supprimé',
            content: reply.parentPost.content,
            attachmentName: reply.parentPost.attachmentName,
          }
        : reply.parentTopic
          ? {
              type: 'topic',
              id: reply.parentTopic.id,
              authorName: reply.parentTopic.creator?.fullName || 'Auteur supprimé',
              content: reply.parentTopic.content,
              attachmentName: reply.parentTopic.attachmentName,
            }
        : null,
      userType:
        reply.user?.role === 'student'
          ? 'Élève'
          : reply.user?.role === 'teacher'
            ? 'Enseignant'
            : 'Responsable',
      createdAt: reply.createdAt.toFormat('dd/MM/yyyy'),
      createdTime: reply.createdAt.toFormat('HH:mm'),
      edited: Boolean(reply.editedAt),
      editedAt: reply.editedAt?.toFormat('dd/MM/yyyy HH:mm') || null,
      ...this.formatAttachment(reply, 'post'),
    }
  }

  private async listContext(ctx: HttpContext, audience: ForumAudience) {
    const user = ctx.auth.getUserOrFail()
    const scope = await this.resolveSection(user)
    if (!scope.sectionId) {
      return ctx.view.render(
        `${audience}/forum/index`,
        await edgePageContext(ctx, {
          topics: [],
          pinnedTopics: [],
          questions: [],
          stats: { totalTopics: 0, myTopics: 0, myReplies: 0, popular: 0 },
          pagination: { total: 0, perPage: 20, currentPage: 1, lastPage: 1, from: 0, to: 0 },
          forumSectionId: null,
        })
      )
    }

    const classIds = await this.sectionClassIds(scope.sectionId, scope.schoolId)
    const subjectId = ctx.request.input('subject_id')
    const status = ctx.request.input('status')
    const search = String(ctx.request.input('search', '')).trim()

    const query = ForumTopic.query()
      .where('school_section_id', scope.sectionId || '')
      .if(subjectId, (topicQuery) => topicQuery.where('subject_id', subjectId))
      .if(status === 'open', (topicQuery) => topicQuery.where('is_locked', false))
      .if(status === 'closed', (topicQuery) => topicQuery.where('is_locked', true))
      .if(status === 'pinned', (topicQuery) => topicQuery.where('is_pinned', true))
      .if(search, (topicQuery) => {
        topicQuery.where((searchQuery) => {
          searchQuery.whereILike('title', `%${search}%`).orWhereILike('content', `%${search}%`)
        })
      })
      .preload('subject')
      .preload('class')
      .preload('creator')
      .preload('posts')
      .orderBy('is_pinned', 'desc')
      .orderBy('created_at', 'desc')

    const paginator = await query.paginate(Number(ctx.request.input('page', 1)), 20)
    const allTopics = paginator.all()
    const myTopics = allTopics.filter((topic) => topic.createdBy === user.id)
    const base = await edgePageContext(ctx, {
      classes: await this.sectionClasses(scope.sectionId, scope.schoolId),
      subjects: await Subject.query().orderBy('name', 'asc'),
      topics: allTopics.filter((topic) => !topic.isPinned).map((topic) => this.formatTopic(topic, user.id)),
      pinnedTopics: allTopics.filter((topic) => topic.isPinned).map((topic) => this.formatTopic(topic, user.id)),
      questions: myTopics.map((topic) => this.formatTopic(topic, user.id)),
      stats: {
        totalTopics: paginator.total,
        myTopics: myTopics.length,
        myReplies: allTopics.reduce((total, topic) => {
          return total + (topic.posts || []).filter((post) => post.userId === user.id).length
        }, 0),
        popular: allTopics.filter((topic) => (topic.viewsCount || 0) >= 10).length,
      },
      pagination: {
        total: paginator.total,
        perPage: paginator.perPage,
        currentPage: paginator.currentPage,
        lastPage: paginator.lastPage,
        from: paginator.total ? (paginator.currentPage - 1) * paginator.perPage + 1 : 0,
        to: Math.min(paginator.currentPage * paginator.perPage, paginator.total),
      },
      forumSectionId: scope.sectionId,
      forumClassIds: classIds,
    })

    return ctx.view.render(`${audience}/forum/index`, base)
  }

  public async teacherIndex(ctx: HttpContext) {
    return this.listContext(ctx, 'teacher')
  }

  public async studentIndex(ctx: HttpContext) {
    return this.listContext(ctx, 'student')
  }

  public async teacherCreate(ctx: HttpContext) {
    return this.createContext(ctx, 'teacher')
  }

  public async studentCreate(ctx: HttpContext) {
    return this.createContext(ctx, 'student')
  }

  private async createContext(ctx: HttpContext, audience: ForumAudience) {
    const user = ctx.auth.getUserOrFail()
    const scope = await this.resolveSection(user)

    return ctx.view.render(
      `${audience}/forum/create`,
      await edgePageContext(ctx, {
        classes: await this.sectionClasses(scope.sectionId, scope.schoolId),
        subjects: await Subject.query().orderBy('name', 'asc'),
        forumSectionId: scope.sectionId,
        defaultClassId: scope.classId,
      })
    )
  }

  public async storeTeacherTopic(ctx: HttpContext) {
    return this.storeTopic(ctx, 'teacher')
  }

  public async storeStudentTopic(ctx: HttpContext) {
    return this.storeTopic(ctx, 'student')
  }

  private async storeTopic({ auth, request, response, session }: HttpContext, audience: ForumAudience) {
    const user = auth.getUserOrFail()
    const scope = await this.resolveSection(user)
    if (!scope.sectionId) {
      session.flash('error', 'Aucune section n’est liée à votre compte.')
      return response.redirect().back()
    }

    const classId = String(request.input('classId') || scope.classId || '')
    const classObj = await Class.query()
      .where('id', classId)
      .where('school_section_id', scope.sectionId)
      .first()

    if (!classObj || !scope.sectionId) {
      session.flash('error', 'Cette discussion ne peut être publiée que dans votre section.')
      return response.redirect().back()
    }

    let attachmentData: Awaited<ReturnType<typeof this.storeForumAttachment>> = null
    try {
      attachmentData = await this.storeForumAttachment(request)
    } catch (error) {
      session.flash('error', error instanceof Error ? error.message : 'Fichier joint invalide')
      return response.redirect().back()
    }

    const content = String(request.input('content', '')).trim()
    if (!content && !attachmentData) {
      session.flash('error', 'Ajoutez un message ou un fichier avant de publier.')
      return response.redirect().back()
    }

    const topic = await ForumTopic.create({
      subjectId: request.input('subjectId') || null,
      classId: classObj.id,
      schoolSectionId: scope.sectionId,
      createdBy: user.id,
      title: String(request.input('title', '')).trim(),
      content,
      attachmentUrl: attachmentData?.url || null,
      attachmentName: attachmentData?.name || null,
      attachmentSize: attachmentData?.size || null,
      attachmentMime: attachmentData?.mime || null,
      isPinned: audience === 'teacher' && Boolean(request.input('pin')),
      isLocked: audience === 'teacher' && Boolean(request.input('lock')),
      isResolved: false,
      viewsCount: 0,
    })

    await this.notifyForumMessage(scope, user, topic, content, 'topic')

    return response.redirect(`/${audience}/forum`)
  }

  public async teacherTopic(ctx: HttpContext) {
    return this.topicContext(ctx, 'teacher')
  }

  public async studentTopic(ctx: HttpContext) {
    return this.topicContext(ctx, 'student')
  }

  private async topicContext(ctx: HttpContext, audience: ForumAudience) {
    const user = ctx.auth.getUserOrFail()
    const scope = await this.resolveSection(user)
    if (!scope.sectionId) return ctx.response.redirect(`/${audience}/forum`)

    const topic = await ForumTopic.query()
      .where('id', ctx.params.id)
      .where('school_section_id', scope.sectionId)
      .preload('subject')
      .preload('class')
      .preload('creator')
      .preload('posts', (postsQuery) => {
        postsQuery
          .preload('user')
          .preload('parentPost', (parentQuery) => parentQuery.preload('user'))
          .preload('parentTopic', (parentQuery) => parentQuery.preload('creator'))
          .orderBy('created_at', 'asc')
      })
      .firstOrFail()

    return ctx.view.render(
      `${audience}/forum/topic`,
      await edgePageContext(ctx, {
        topic: this.formatTopic(topic, user.id),
        replies: (topic.posts || []).map((reply) => this.formatReply(reply, user.id)),
      })
    )
  }

  public async teacherReply(ctx: HttpContext) {
    return this.storeReply(ctx, 'teacher')
  }

  public async studentReply(ctx: HttpContext) {
    return this.storeReply(ctx, 'student')
  }

  private async storeReply({ auth, params, request, response, session }: HttpContext, audience: ForumAudience) {
    const user = auth.getUserOrFail()
    const scope = await this.resolveSection(user)
    if (!scope.sectionId) {
      session.flash('error', 'Aucune section n’est liée à votre compte.')
      return response.redirect().back()
    }

    const topic = await ForumTopic.query()
      .where('id', params.id)
      .where('school_section_id', scope.sectionId)
      .firstOrFail()

    if (topic.isLocked) {
      session.flash('error', 'Ce sujet est verrouillé.')
      return response.redirect().back()
    }

    let attachmentData: Awaited<ReturnType<typeof this.storeForumAttachment>> = null
    try {
      attachmentData = await this.storeForumAttachment(request)
    } catch (error) {
      session.flash('error', error instanceof Error ? error.message : 'Fichier joint invalide')
      return response.redirect().back()
    }

    const content = String(request.input('content', '')).trim()
    const parentPostId = String(request.input('parentPostId') || request.input('parent_post_id') || '').trim()
    const parentTopicId = String(request.input('parentTopicId') || request.input('parent_topic_id') || '').trim()
    if (!content && !attachmentData) {
      session.flash('error', 'Ajoutez un message ou un fichier avant de publier.')
      return response.redirect().back()
    }

    let parentPost: ForumPost | null = null
    let parentTopic: ForumTopic | null = null
    if (parentPostId) {
      parentPost = await ForumPost.query()
        .where('id', parentPostId)
        .where('topic_id', topic.id)
        .first()

      if (!parentPost) {
        session.flash('error', 'Message ciblé introuvable.')
        return response.redirect().back()
      }
    }

    if (parentTopicId) {
      parentTopic = await ForumTopic.query()
        .where('id', parentTopicId)
        .where('school_section_id', scope.sectionId)
        .first()

      if (!parentTopic || parentTopic.id !== topic.id) {
        session.flash('error', 'Question ciblée introuvable.')
        return response.redirect().back()
      }
    }

    await ForumPost.create({
      topicId: topic.id,
      userId: user.id,
      content,
      attachmentUrl: attachmentData?.url || null,
      attachmentName: attachmentData?.name || null,
      attachmentSize: attachmentData?.size || null,
      attachmentMime: attachmentData?.mime || null,
      parentPostId: parentPost?.id || null,
      parentTopicId: parentPost ? null : parentTopic?.id || null,
      isApproved: true,
    })

    await this.notifyForumMessage(scope, user, topic, content || attachmentData?.name || 'Fichier joint', 'reply')

    return response.redirect(`/${audience}/forum/topic/${topic.id}`)
  }

  public async myTeacherTopics(ctx: HttpContext) {
    return this.myTopics(ctx, 'teacher', 'my-topics')
  }

  public async myStudentQuestions(ctx: HttpContext) {
    return this.myTopics(ctx, 'student', 'my-questions')
  }

  private async myTopics(ctx: HttpContext, audience: ForumAudience, viewName: string) {
    const user = ctx.auth.getUserOrFail()
    const scope = await this.resolveSection(user)
    if (!scope.sectionId) {
      return ctx.view.render(`${audience}/forum/${viewName}`, await edgePageContext(ctx, { topics: [], questions: [] }))
    }

    const topics = await ForumTopic.query()
      .where('created_by', user.id)
      .where('school_section_id', scope.sectionId)
      .preload('subject')
      .preload('class')
      .preload('creator')
      .preload('posts')
      .orderBy('created_at', 'desc')

    const formattedTopics = topics.map((topic) => this.formatTopic(topic, user.id))
    const stats = {
      total: formattedTopics.length,
      pinned: formattedTopics.filter((topic) => topic.isPinned).length,
      answered: formattedTopics.filter((topic) => topic.repliesCount > 0).length,
      totalReplies: formattedTopics.reduce((total, topic) => total + topic.repliesCount, 0),
      totalViews: formattedTopics.reduce((total, topic) => total + topic.views, 0),
    }

    return ctx.view.render(
      `${audience}/forum/${viewName}`,
      await edgePageContext(ctx, {
        topics: formattedTopics,
        questions: formattedTopics,
        myTopics: formattedTopics,
        myQuestions: formattedTopics,
        stats,
      })
    )
  }

  public async toggleLock({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const scope = await this.resolveSection(user)
    if (!scope.sectionId) return response.badRequest({ success: false, message: 'Section introuvable' })

    const topic = await ForumTopic.query()
      .where('id', params.id)
      .where('school_section_id', scope.sectionId)
      .firstOrFail()

    topic.isLocked = !topic.isLocked
    await topic.save()
    return response.ok({ success: true })
  }

  public async togglePin({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const scope = await this.resolveSection(user)
    if (!scope.sectionId) return response.badRequest({ success: false, message: 'Section introuvable' })

    const topic = await ForumTopic.query()
      .where('id', params.id)
      .where('school_section_id', scope.sectionId)
      .firstOrFail()

    topic.isPinned = !topic.isPinned
    await topic.save()
    return response.ok({ success: true })
  }

  public async deleteTopic({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const scope = await this.resolveSection(user)
    if (!scope.sectionId) return response.badRequest({ success: false, message: 'Section introuvable' })

    const topic = await ForumTopic.query()
      .where('id', params.id)
      .where('school_section_id', scope.sectionId)
      .firstOrFail()

    if (topic.createdBy !== user.id) {
      return response.forbidden({ success: false, message: 'Vous pouvez supprimer uniquement votre propre publication.' })
    }

    await topic.delete()
    return response.ok({ success: true })
  }

  public async updateTopic({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const scope = await this.resolveSection(user)
    if (!scope.sectionId) return response.badRequest({ success: false, message: 'Section introuvable' })

    const topic = await ForumTopic.query()
      .where('id', params.id)
      .where('school_section_id', scope.sectionId)
      .firstOrFail()

    if (topic.createdBy !== user.id) {
      return response.forbidden({ success: false, message: 'Vous pouvez modifier uniquement votre propre question.' })
    }

    const content = String(request.input('content') || '').trim()
    const title = String(request.input('title') || topic.title).trim()
    if (!content && !topic.attachmentUrl) {
      return response.badRequest({ success: false, message: 'Contenu requis' })
    }

    topic.title = title || topic.title
    topic.content = content
    topic.editedAt = DateTime.now()
    await topic.save()

    return response.ok({ success: true })
  }

  public async deleteReply({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const scope = await this.resolveSection(user)
    if (!scope.sectionId) return response.badRequest({ success: false, message: 'Section introuvable' })

    const reply = await ForumPost.query().where('id', params.id).firstOrFail()
    const topic = await ForumTopic.query()
      .where('id', reply.topicId)
      .where('school_section_id', scope.sectionId)
      .firstOrFail()

    if (reply.userId !== user.id) {
      return response.forbidden({ success: false, message: 'Vous pouvez supprimer uniquement votre propre message.' })
    }

    await reply.delete()
    return response.ok({ success: true, topicId: topic.id })
  }

  public async updateReply({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const scope = await this.resolveSection(user)
    if (!scope.sectionId) return response.badRequest({ success: false, message: 'Section introuvable' })

    const reply = await ForumPost.query().where('id', params.id).firstOrFail()
    await ForumTopic.query()
      .where('id', reply.topicId)
      .where('school_section_id', scope.sectionId)
      .firstOrFail()

    if (reply.userId !== user.id) {
      return response.forbidden({ success: false, message: 'Vous pouvez modifier uniquement votre propre message.' })
    }

    const content = String(request.input('content') || '').trim()
    if (!content && !reply.attachmentUrl) {
      return response.badRequest({ success: false, message: 'Contenu requis' })
    }

    reply.content = content
    reply.editedAt = DateTime.now()
    await reply.save()

    return response.ok({ success: true })
  }

  private csvValue(value: unknown) {
    const text = String(value ?? '').replace(/\r?\n/g, ' ').trim()
    return `"${text.replace(/"/g, '""')}"`
  }

  public async exportTeacherForum(ctx: HttpContext) {
    return this.exportForum(ctx, 'teacher')
  }

  public async exportStudentForum(ctx: HttpContext) {
    return this.exportForum(ctx, 'student')
  }

  private async exportForum({ auth, request, response }: HttpContext, audience: ForumAudience) {
    const user = auth.getUserOrFail()
    const scope = await this.resolveSection(user)

    const headers = [
      'Titre',
      'Classe',
      'Matiere',
      'Auteur',
      'Statut',
      'Resolu',
      'Reponses',
      'Vues',
      'Cree le',
      'Derniere reponse',
    ]

    if (!scope.sectionId) {
      response.header('Content-Type', 'text/csv; charset=utf-8')
      response.header('Content-Disposition', `attachment; filename="forum-${audience}-vide.csv"`)
      return response.send(`${headers.join(',')}\n`)
    }

    const classId = request.input('class_id')
    const subjectId = request.input('subject_id')
    const status = request.input('status')
    const search = String(request.input('search', '')).trim()

    const topics = await ForumTopic.query()
      .where('school_section_id', scope.sectionId)
      .if(classId, (topicQuery) => topicQuery.where('class_id', classId))
      .if(subjectId, (topicQuery) => topicQuery.where('subject_id', subjectId))
      .if(status === 'open', (topicQuery) => topicQuery.where('is_locked', false))
      .if(status === 'closed', (topicQuery) => topicQuery.where('is_locked', true))
      .if(status === 'pinned', (topicQuery) => topicQuery.where('is_pinned', true))
      .if(status === 'resolved', (topicQuery) => topicQuery.where('is_resolved', true))
      .if(search, (topicQuery) => {
        topicQuery.where((searchQuery) => {
          searchQuery.whereILike('title', `%${search}%`).orWhereILike('content', `%${search}%`)
        })
      })
      .preload('class')
      .preload('subject')
      .preload('creator')
      .preload('posts')
      .orderBy('is_pinned', 'desc')
      .orderBy('created_at', 'desc')

    const rows = topics.map((topic) => {
      const posts = topic.posts || []
      const lastReply = posts
        .slice()
        .sort((a, b) => Number(a.createdAt?.toMillis() || 0) - Number(b.createdAt?.toMillis() || 0))
        .at(-1)

      return [
        topic.title,
        topic.class?.name || '',
        topic.subject?.name || 'Discussion generale',
        topic.creator?.fullName || 'Membre supprime',
        topic.isLocked ? 'Ferme' : 'Ouvert',
        topic.isResolved ? 'Oui' : 'Non',
        posts.length,
        topic.viewsCount || 0,
        topic.createdAt?.toFormat('dd/MM/yyyy HH:mm') || '',
        lastReply?.createdAt?.toFormat('dd/MM/yyyy HH:mm') || '',
      ].map((value) => this.csvValue(value))
    })

    const csv = [`\uFEFF${headers.map((value) => this.csvValue(value)).join(',')}`, ...rows.map((row) => row.join(','))].join('\n')
    const fileDate = DateTime.now().toFormat('yyyyLLdd-HHmm')

    response.header('Content-Type', 'text/csv; charset=utf-8')
    response.header('Content-Disposition', `attachment; filename="forum-${audience}-${fileDate}.csv"`)
    return response.send(csv)
  }

  public async resolveStudentTopic({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const scope = await this.resolveSection(user)
    if (!scope.sectionId) return response.badRequest({ success: false, message: 'Section introuvable' })

    const topic = await ForumTopic.query()
      .where('id', params.id)
      .where('school_section_id', scope.sectionId)
      .firstOrFail()

    if (topic.createdBy !== user.id) {
      return response.forbidden({
        success: false,
        message: 'Vous pouvez résoudre uniquement votre propre question.',
      })
    }

    topic.isResolved = true
    topic.isLocked = true
    await topic.save()

    return response.ok({ success: true, isResolved: true, isLocked: true })
  }

  public async recordStudentTopicView(ctx: HttpContext) {
    return this.recordTopicView(ctx)
  }

  public async recordTeacherTopicView(ctx: HttpContext) {
    return this.recordTopicView(ctx)
  }

  private async recordTopicView({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const scope = await this.resolveSection(user)
    if (!scope.sectionId) return response.badRequest({ success: false, message: 'Section introuvable' })

    const topic = await ForumTopic.query()
      .where('id', params.id)
      .where('school_section_id', scope.sectionId)
      .firstOrFail()

    topic.viewsCount = (topic.viewsCount || 0) + 1
    await topic.save()

    return response.ok({ success: true, views: topic.viewsCount })
  }

  public async downloadAttachment({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const scope = await this.resolveSection(user)
    if (!scope.sectionId) return response.badRequest('Section introuvable')

    const type = String(params.type)
    const itemId = String(params.id)
    let attachmentUrl: string | null = null
    let attachmentName: string | null = null
    let attachmentMime: string | null = null
    let tableName: 'forum_topics' | 'forum_posts' = 'forum_topics'

    if (type === 'topic') {
      const topic = await ForumTopic.query()
        .where('id', itemId)
        .where('school_section_id', scope.sectionId)
        .firstOrFail()

      attachmentUrl = topic.attachmentUrl
      attachmentName = topic.attachmentName
      attachmentMime = topic.attachmentMime
    } else if (type === 'post') {
      const reply = await ForumPost.query().where('id', itemId).firstOrFail()
      await ForumTopic.query()
        .where('id', reply.topicId)
        .where('school_section_id', scope.sectionId)
        .firstOrFail()

      attachmentUrl = reply.attachmentUrl
      attachmentName = reply.attachmentName
      attachmentMime = reply.attachmentMime
      tableName = 'forum_posts'
    } else {
      return response.badRequest('Type de fichier invalide')
    }

    if (!attachmentUrl) return response.notFound('Fichier introuvable')

    const storedFileName = attachmentUrl.split('/').at(-1)
    if (!storedFileName) return response.notFound('Fichier introuvable')

    const downloadName = await this.getDownloadFilename(tableName, itemId, attachmentName)
    if (attachmentMime) response.header('Content-Type', attachmentMime)
    response.header('Content-Disposition', this.contentDispositionFilename(downloadName))

    return response.download(join(app.publicPath('uploads/forum'), storedFileName))
  }
}
