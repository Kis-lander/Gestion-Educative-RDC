import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Role from '#models/role'
import db from '@adonisjs/lucid/services/db'
import {
  createUserValidator,
  updateUserValidator,
  suspendAccountValidator,
  createRoleValidator,
  updateRoleValidator,
  getSystemLogsValidator,
} from '#validators/admin'

export default class AdminController {
  /**
   * Créer un utilisateur
   */
  public async createUser({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)

    const user = await User.create({
      ...payload,
      status: 'active',
    })

    return response.created({
      success: true,
      message: 'Utilisateur créé avec succès',
      user,
    })
  }

  /**
   * Mettre à jour un utilisateur
   */
  public async updateUser({ request, params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const payload = await request.validateUsing(updateUserValidator)

    user.merge(payload)
    await user.save()

    return response.ok({
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      user,
    })
  }

  /**
   * Supprimer un utilisateur
   */
  public async deleteUser({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()

    return response.ok({
      success: true,
      message: 'Utilisateur supprimé avec succès',
    })
  }

  /**
   * Obtenir tous les utilisateurs (avec filtrage et pagination)
   */
  public async getUsers({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const role = request.input('role')
    const status = request.input('status')

    const users = await User.query()
      .if(role, (query) => query.where('role', role))
      .if(status, (query) => query.where('status', status))
      .preload('school')
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)

    return response.ok({
      success: true,
      users,
    })
  }

  /**
   * Activer un utilisateur
   */
  public async activateUser({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    user.status = 'active'
    await user.save()

    return response.ok({
      success: true,
      message: 'Utilisateur activé avec succès',
    })
  }

  /**
   * Suspendre un utilisateur
   */
  public async suspendUser({ request, params, response, auth }: HttpContext) {
    const payload = await request.validateUsing(suspendAccountValidator)
    const user = await User.findOrFail(params.id)

    user.status = 'suspended'

    await db.transaction(async (trx) => {
      user.useTransaction(trx)
      await user.save()

      await trx.table('user_suspensions').insert({
        user_id: user.id,
        reason: payload.reason || 'Non spécifiée',
        suspended_by: auth.user?.id,
        suspended_at: new Date(),
      })
    })

    return response.ok({
      success: true,
      message: 'Utilisateur suspendu avec succès',
    })
  }

  /**
   * Créer un rôle
   */
  public async createRole({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createRoleValidator)
    const role = await Role.create(payload)

    return response.created({
      success: true,
      message: 'Rôle créé avec succès',
      role,
    })
  }

  /**
   * Obtenir tous les rôles
   */
  public async getRoles({ response }: HttpContext) {
    const roles = await Role.all()

    return response.ok({
      success: true,
      roles,
    })
  }

  /**
   * Mettre à jour un rôle
   */
  public async updateRole({ request, params, response }: HttpContext) {
    const role = await Role.findOrFail(params.id)
    const payload = await request.validateUsing(updateRoleValidator)

    role.merge(payload)
    await role.save()

    return response.ok({
      success: true,
      message: 'Rôle mis à jour avec succès',
      role,
    })
  }

  /**
   * Obtenir les logs système
   */
  public async getSystemLogs({ request, response }: HttpContext) {
    const payload = await request.validateUsing(getSystemLogsValidator)

    const query = db.from('system_logs')

    if (payload.startDate) query.where('created_at', '>=', payload.startDate.toJSDate())
    if (payload.endDate) query.where('created_at', '<=', payload.endDate.toJSDate())
    if (payload.action) query.where('action', payload.action)
    if (payload.userId) query.where('user_id', payload.userId)

    const logs = await query
      .orderBy('created_at', 'desc')
      .paginate(payload.page || 1, payload.limit || 100)

    return response.ok({
      success: true,
      logs,
    })
  }

  /**
   * Obtenir les logs d'activité utilisateur
   */
  public async getUserActivityLogs({ params, request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 50)

    const logs = await db
      .from('user_activity_logs')
      .where('user_id', params.userId)
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return response.ok({
      success: true,
      logs,
    })
  }
}
