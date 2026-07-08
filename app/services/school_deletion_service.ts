import db from '@adonisjs/lucid/services/db'

export async function deleteSchoolWithLinkedAccounts(
  schoolId: string,
  client: any = db
) {
  const linkedUsers = await client
    .from('users')
    .where('school_id', schoolId)
    .whereNot('role', 'inspection')
    .select('id')
  const linkedUserIds = linkedUsers.map((user: { id: string }) => user.id)

  await client
    .from('users')
    .where('school_id', schoolId)
    .where('role', 'inspection')
    .update({ school_id: null, updated_at: new Date() })

  await client
    .from('student_school_histories')
    .where((query: any) => {
      query.where('school_id', schoolId).orWhere('destination_school_id', schoolId)
    })
    .delete()

  await client
    .from('transfer_authorizations')
    .where((query: any) => {
      query.where('from_school_id', schoolId).orWhere('to_school_id', schoolId)
    })
    .delete()

  await client.from('schools').where('id', schoolId).delete()

  if (linkedUserIds.length) {
    await client
      .from('users')
      .whereIn('id', linkedUserIds)
      .whereNot('role', 'inspection')
      .delete()
  }
}
