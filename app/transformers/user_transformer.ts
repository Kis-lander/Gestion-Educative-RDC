import type User from '#models/user'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    const row = this.pick(this.resource, ['id', 'fullName', 'email', 'createdAt', 'updatedAt'])
    const first = this.resource.firstName?.charAt(0) ?? ''
    const last = this.resource.lastName?.charAt(0) ?? ''
    return { ...row, initials: `${first}${last}`.toUpperCase() }
  }
}
