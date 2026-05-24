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

export default class OtpMailService {
  public async sendOtp(payload: SendOtpPayload) {
    await this.sendEmail({
      to: payload.to,
      subject: 'Votre code de verification',
      htmlContent: this.getOtpHtmlContent(payload),
      textContent: this.getOtpTextContent(payload),
      consoleMessage: `[OTP:${payload.purpose}] ${payload.code} pour ${payload.to}. Expire dans ${payload.expiresInMinutes} minutes.`,
    })
  }

  public async sendDirectorCredentials(payload: SendDirectorCredentialsPayload) {
    await this.sendEmail({
      to: payload.to,
      subject: 'Identifiants de connexion de votre ecole',
      htmlContent: this.getDirectorCredentialsHtmlContent(payload),
      textContent: this.getDirectorCredentialsTextContent(payload),
      consoleMessage: `[DIRECTOR_CREDENTIALS] ${payload.schoolName} -> ${payload.to} / ${payload.password}`,
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

    throw new Error('MAIL_MAILER=smtp requiert une configuration SMTP non implementee. Utilisez brevo_api.')
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
      throw new Error(`Brevo API a refuse l'envoi OTP (${response.status}): ${body}`)
    }
  }

  private getOtpTextContent(payload: SendOtpPayload) {
    return [
      'Gestion Educative RDC',
      '',
      `Votre code de verification est: ${payload.code}`,
      `Il expire dans ${payload.expiresInMinutes} minutes.`,
      '',
      "Si vous n'avez pas demande ce code, ignorez cet email.",
    ].join('\n')
  }

  private getOtpHtmlContent(payload: SendOtpPayload) {
    return `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
        <h2 style="margin: 0 0 12px;">Gestion Educative RDC</h2>
        <p>Votre code de verification est:</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 6px; margin: 18px 0;">
          ${payload.code}
        </p>
        <p>Ce code expire dans ${payload.expiresInMinutes} minutes.</p>
        <p style="color: #6b7280; font-size: 13px;">
          Si vous n'avez pas demande ce code, ignorez cet email.
        </p>
      </div>
    `
  }

  private getDirectorCredentialsTextContent(payload: SendDirectorCredentialsPayload) {
    return [
      'Gestion Educative RDC',
      '',
      `Votre ecole "${payload.schoolName}" a ete approuvee.`,
      '',
      'Identifiants de connexion:',
      `Code ecole: ${payload.schoolCode}`,
      `Directeur: ${payload.directorName}`,
      `Email: ${payload.email}`,
      `Mot de passe temporaire: ${payload.password}`,
      '',
      'Veuillez changer ce mot de passe apres votre premiere connexion.',
    ].join('\n')
  }

  private getDirectorCredentialsHtmlContent(payload: SendDirectorCredentialsPayload) {
    return `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
        <h2 style="margin: 0 0 12px;">Gestion Educative RDC</h2>
        <p>Votre ecole <strong>${payload.schoolName}</strong> a ete approuvee.</p>
        <div style="margin: 18px 0; padding: 16px; border: 1px solid #dbeafe; border-radius: 10px; background: #eff6ff;">
          <p style="margin: 0 0 8px;"><strong>Code ecole:</strong> ${payload.schoolCode}</p>
          <p style="margin: 0 0 8px;"><strong>Directeur:</strong> ${payload.directorName}</p>
          <p style="margin: 0 0 8px;"><strong>Email:</strong> ${payload.email}</p>
          <p style="margin: 0;"><strong>Mot de passe temporaire:</strong> ${payload.password}</p>
        </div>
        <p>Veuillez changer ce mot de passe apres votre premiere connexion.</p>
      </div>
    `
  }
}
