import Message from '#models/message'
import TransferAuthorization from '#models/transfer_authorization'
import User from '#models/user'

export default class TransferNotificationService {
  public async notifyDirector(
    transfer: TransferAuthorization,
    director: User,
    senderId?: string
  ) {
    const existingNotification = await Message.query()
      .where('receiverId', director.id)
      .where('subject', 'Demande de transfert entrante')
      .whereILike('content', `%${transfer.authorizationCode}%`)
      .first()

    if (existingNotification) {
      return existingNotification
    }

    if (!transfer.$preloaded.student) {
      await transfer.load('student', (studentQuery) => studentQuery.preload('user'))
    }
    if (!transfer.$preloaded.fromSchool) {
      await transfer.load('fromSchool')
    }

    const sourceDirector = senderId
      ? null
      : await User.query()
          .where('schoolId', transfer.fromSchoolId)
          .where('role', 'director')
          .orderByRaw("case when status = 'active' then 0 else 1 end")
          .first()

    return Message.create({
      senderId: senderId || sourceDirector?.id || transfer.student.userId,
      receiverId: director.id,
      schoolId: transfer.toSchoolId,
      subject: 'Demande de transfert entrante',
      content:
        `${transfer.fromSchool.name} demande le transfert de ` +
        `${transfer.student.user.fullName} vers votre établissement. ` +
        `Code : ${transfer.authorizationCode}.`,
      type: 'official',
      isGlobal: false,
      isRead: false,
      hasAttachment: false,
    })
  }

  public async syncPendingForDirector(director: User) {
    if (director.role !== 'director' || !director.schoolId) {
      return
    }

    const pendingTransfers = await TransferAuthorization.query()
      .where('toSchoolId', director.schoolId)
      .where('status', 'pending')
      .preload('student', (studentQuery) => studentQuery.preload('user'))
      .preload('fromSchool')
      .orderBy('createdAt', 'desc')

    await Promise.all(
      pendingTransfers.map((transfer) => this.notifyDirector(transfer, director))
    )
  }
}
