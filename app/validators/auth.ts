import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string(),
  })
)

export const changePasswordValidator = vine.compile(
  vine.object({
    currentPassword: vine.string(),
    newPassword: vine
      .string()
      .minLength(8)
      .confirmed({ confirmationField: 'newPasswordConfirmation' }),
  })
)

export const updateProfileValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().optional(),
    lastName: vine.string().trim().optional(),
    phone: vine.string().optional(),
    avatarUrl: vine.string().optional(),
  })
)
