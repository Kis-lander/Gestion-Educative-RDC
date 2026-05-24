import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class InspectionSeeder extends BaseSeeder {
  public async run() {
    const existing = await User.query().where('role', 'inspection').first()

    if (existing) {
      existing.status = 'active'
      await existing.save()
      return
    }

    await User.create({
      email: 'inspection@gestion-educative-rdc.cd',
      password: 'Inspection@2026',
      firstName: 'Inspection',
      lastName: 'RDC',
      role: 'inspection',
      status: 'active',
    })
  }
}
