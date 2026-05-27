import env from '#start/env'

type SendOtpPayload = {
  to: string
  code: string
  purpose: string
  expiresInMinutes: number
}

type SendDirectorCredentialsPayload = {
  to: string
  schoolName: string
  schoolCode: string
  directorName: string
  email: string
  password: string
}

type SendAccountCredentialsPayload = {
  to: string
  schoolName: string
  fullName: string
  roleLabel: string
  email: string
  password: string
}

type BrevoErrorBody = {
  code?: string
  message?: string
}

export default class OtpMailService {
  public async sendOtp(payload: SendOtpPayload) {
    await this.sendEmail({
      to: payload.to,
      subject: 'Votre code de vérification',
      htmlContent: this.getOtpHtmlContent(payload),
      textContent: this.getOtpTextContent(payload),
      consoleMessage: `[OTP:${payload.purpose}] ${payload.code} pour ${payload.to}. Expire dans ${payload.expiresInMinutes} minutes.`,
    })
  }

  public async sendDirectorCredentials(payload: SendDirectorCredentialsPayload) {
    await this.sendEmail({
      to: payload.to,
      subject: 'Identifiants de connexion de votre école',
      htmlContent: this.getDirectorCredentialsHtmlContent(payload),
      textContent: this.getDirectorCredentialsTextContent(payload),
      consoleMessage: `[DIRECTOR_CREDENTIALS] ${payload.schoolName} -> ${payload.to} / ${payload.password}`,
    })
  }

  public async sendAccountCredentials(payload: SendAccountCredentialsPayload) {
    await this.sendEmail({
      to: payload.to,
      subject: 'Identifiants de connexion - Gestion Educative RDC',
      htmlContent: this.getAccountCredentialsHtmlContent(payload),
      textContent: this.getAccountCredentialsTextContent(payload),
      consoleMessage: `[ACCOUNT_CREDENTIALS] ${payload.roleLabel} ${payload.fullName} -> ${payload.to} / ${payload.password}`,
    })
  }

  private async sendEmail(payload: {
    to: string
    subject: string
    htmlContent: string
    textContent: string
    consoleMessage: string
  }) {
    const mailer = env.get('MAIL_MAILER')

    if (mailer === 'console') {
      console.log(payload.consoleMessage)
      return
    }

    if (mailer === 'brevo_api') {
      await this.sendWithBrevo(payload)
      return
    }

    throw new Error('MAIL_MAILER=smtp requiert une configuration SMTP non implémentée. Utilisez brevo_api.')
  }

  private async sendWithBrevo(payload: {
    to: string
    subject: string
    htmlContent: string
    textContent: string
  }) {
    const apiKey = env.get('BREVO_API_KEY')

    if (!apiKey) {
      throw new Error('BREVO_API_KEY est requis quand MAIL_MAILER=brevo_api.')
    }

    const response = await fetch(`${env.get('BREVO_API_URL')}/smtp/email`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          email: env.get('BREVO_SENDER_EMAIL'),
          name: env.get('BREVO_SENDER_NAME'),
        },
        to: [{ email: payload.to }],
        subject: payload.subject,
        htmlContent: payload.htmlContent,
        textContent: payload.textContent,
      }),
    })

    if (!response.ok) {
      const body = await response.text()
      let brevoMessage = body

      try {
        const parsedBody = JSON.parse(body) as BrevoErrorBody
        brevoMessage = parsedBody.message || parsedBody.code || body
      } catch {
        brevoMessage = body
      }

      throw new Error(`Brevo a refusé l'envoi (${response.status}) : ${brevoMessage}`)
    }
  }

  private getOtpTextContent(payload: SendOtpPayload) {
    return [
      'Gestion Educative RDC',
      '',
      `Votre code de vérification est : ${payload.code}`,
      `Il expire dans ${payload.expiresInMinutes} minutes.`,
      '',
      "Si vous n'avez pas demandé ce code, ignorez cet email.",
    ].join('\n')
  }

  private getOtpHtmlContent(payload: SendOtpPayload) {
    return `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
        <h2 style="margin: 0 0 12px;">Gestion Educative RDC</h2>
        <p>Votre code de vérification est :</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 6px; margin: 18px 0;">
          ${payload.code}
        </p>
        <p>Ce code expire dans ${payload.expiresInMinutes} minutes.</p>
        <p style="color: #6b7280; font-size: 13px;">
          Si vous n'avez pas demandé ce code, ignorez cet email.
        </p>
      </div>
    `
  }

  private getDirectorCredentialsTextContent(payload: SendDirectorCredentialsPayload) {
    return [
      'Gestion Educative RDC',
      '',
      `Votre école "${payload.schoolName}" a été approuvée.`,
      '',
      'Identifiants de connexion :',
      `Code école : ${payload.schoolCode}`,
      `Directeur : ${payload.directorName}`,
      `Email : ${payload.email}`,
      `Mot de passe temporaire : ${payload.password}`,
      '',
      'Veuillez changer ce mot de passe après votre première connexion.',
    ].join('\n')
  }

  private getDirectorCredentialsHtmlContent(payload: SendDirectorCredentialsPayload) {
    return `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
        <h2 style="margin: 0 0 12px;">Gestion Educative RDC</h2>
        <p>Votre école <strong>${payload.schoolName}</strong> a été approuvée.</p>
        <div style="margin: 18px 0; padding: 16px; border: 1px solid #dbeafe; border-radius: 10px; background: #eff6ff;">
          <p style="margin: 0 0 8px;"><strong>Code école :</strong> ${payload.schoolCode}</p>
          <p style="margin: 0 0 8px;"><strong>Directeur :</strong> ${payload.directorName}</p>
          <p style="margin: 0 0 8px;"><strong>Email :</strong> ${payload.email}</p>
          <p style="margin: 0;"><strong>Mot de passe temporaire :</strong> ${payload.password}</p>
        </div>
        <p>Veuillez changer ce mot de passe après votre première connexion.</p>
      </div>
    `
  }

  private getAccountCredentialsTextContent(payload: SendAccountCredentialsPayload) {
    return [
      'Gestion Educative RDC',
      '',
      `Un compte ${payload.roleLabel} a été créé pour ${payload.fullName}.`,
      `École : ${payload.schoolName}`,
      '',
      'Identifiants de connexion :',
      `Email : ${payload.email}`,
      `Mot de passe temporaire : ${payload.password}`,
      '',
      'Veuillez changer ce mot de passe après votre première connexion.',
    ].join('\n')
  }

  private getAccountCredentialsHtmlContent(payload: SendAccountCredentialsPayload) {
    return `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
        <h2 style="margin: 0 0 12px;">Gestion Educative RDC</h2>
        <p>Un compte <strong>${payload.roleLabel}</strong> a été créé pour <strong>${payload.fullName}</strong>.</p>
        <p>École : <strong>${payload.schoolName}</strong></p>
        <div style="margin: 18px 0; padding: 16px; border: 1px solid #dbeafe; border-radius: 10px; background: #eff6ff;">
          <p style="margin: 0 0 8px;"><strong>Email :</strong> ${payload.email}</p>
          <p style="margin: 0;"><strong>Mot de passe temporaire :</strong> ${payload.password}</p>
        </div>
        <p>Veuillez changer ce mot de passe après votre première connexion.</p>
      </div>
    `
  }
}
