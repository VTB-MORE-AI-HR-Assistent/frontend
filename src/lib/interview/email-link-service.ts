// Phase 5: Email Link Service for Interview Invitations
import { InterviewStatus } from '@/lib/api/interview'

// Types for email link management
export interface InterviewLinkData {
  sessionId: string
  token: string
  candidateEmail: string
  candidateName: string
  interviewDate: Date
  duration: number // in minutes
  position: string
  expiresAt: Date
}

export interface LinkValidationResult {
  valid: boolean
  reason?: 'expired' | 'invalid' | 'not_found' | 'already_used' | 'not_scheduled'
  interviewData?: InterviewLinkData
  timeUntilInterview?: number // in minutes
}

export interface EmailInvitation {
  to: string
  candidateName: string
  position: string
  scheduledDate: Date
  duration: number
  link: string
  hrContactEmail?: string
  hrContactPhone?: string
  instructions?: string[]
}

// JWT Token utilities (mock implementation)
class JWTService {
  private static readonly SECRET = 'vtb-ai-hr-secret-key' // In production, use environment variable

  static generateToken(payload: any, expiresIn: number = 24 * 60 * 60 * 1000): string {
    // Mock JWT token generation with proper Unicode handling
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64')
    const data = Buffer.from(JSON.stringify({
      ...payload,
      iat: Date.now(),
      exp: Date.now() + expiresIn
    })).toString('base64')
    // In production, this would include proper signing
    const signature = Buffer.from(`${header}.${data}.${this.SECRET}`).toString('base64')
    return `${header}.${data}.${signature}`
  }

  static decodeToken(token: string): any {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null
      
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'))
      
      // Check expiration
      if (payload.exp && payload.exp < Date.now()) {
        return null
      }
      
      return payload
    } catch (error) {
      console.error('Token decode error:', error)
      return null
    }
  }

  static validateToken(token: string): boolean {
    const decoded = this.decodeToken(token)
    return decoded !== null
  }
}

// Email Link Service
export class EmailLinkService {
  // Dynamic URL generation for correct environment
  private static getBaseUrl(): string {
    // Client-side: use current origin
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    // Server-side: use environment variable or default
    return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
  }
  
  private static readonly LINK_EXPIRY_HOURS = 48 // Links expire after 48 hours
  private static readonly PRE_INTERVIEW_WINDOW = 15 // Allow joining 15 minutes before scheduled time

  /**
   * Generate an interview invitation link
   */
  static generateInterviewLink(data: Omit<InterviewLinkData, 'token' | 'expiresAt'>): string {
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + this.LINK_EXPIRY_HOURS)

    const tokenPayload = {
      sessionId: data.sessionId,
      candidateEmail: data.candidateEmail,
      candidateName: data.candidateName,
      interviewDate: data.interviewDate.toISOString(),
      position: data.position,
      type: 'interview_invitation'
    }

    const token = JWTService.generateToken(
      tokenPayload,
      this.LINK_EXPIRY_HOURS * 60 * 60 * 1000
    )

    // Store link data in mock storage (in production, this would be in database)
    this.storeLinkData({
      ...data,
      token,
      expiresAt
    })

    return `${this.getBaseUrl()}/interview/${data.sessionId}?token=${encodeURIComponent(token)}`
  }

  /**
   * Validate an interview link
   */
  static async validateLink(sessionId: string, token: string): Promise<LinkValidationResult> {
    // Decode and validate token
    const tokenData = JWTService.decodeToken(token)
    
    if (!tokenData) {
      return {
        valid: false,
        reason: 'invalid'
      }
    }

    // Check if token matches session
    if (tokenData.sessionId !== sessionId) {
      return {
        valid: false,
        reason: 'invalid'
      }
    }

    // Get stored link data
    const linkData = await this.getLinkData(sessionId)
    
    if (!linkData) {
      return {
        valid: false,
        reason: 'not_found'
      }
    }

    // Check if link has expired
    if (new Date() > linkData.expiresAt) {
      return {
        valid: false,
        reason: 'expired'
      }
    }

    // Check if interview has already been used
    const interviewStatus = await this.getInterviewStatus(sessionId)
    if (interviewStatus === 'completed' || interviewStatus === 'in_progress') {
      return {
        valid: false,
        reason: 'already_used'
      }
    }

    // Check interview schedule
    const now = new Date()
    const interviewDate = new Date(linkData.interviewDate)
    const timeUntilInterview = Math.floor((interviewDate.getTime() - now.getTime()) / (1000 * 60))

    // Check if it's too early to join
    if (timeUntilInterview > this.PRE_INTERVIEW_WINDOW) {
      return {
        valid: false,
        reason: 'not_scheduled',
        interviewData: linkData,
        timeUntilInterview
      }
    }

    // Check if interview window has passed (e.g., more than 1 hour after scheduled time)
    if (timeUntilInterview < -60) {
      return {
        valid: false,
        reason: 'expired',
        interviewData: linkData
      }
    }

    return {
      valid: true,
      interviewData: linkData,
      timeUntilInterview: Math.max(0, timeUntilInterview)
    }
  }

  /**
   * Extract link parameters from URL
   */
  static extractLinkParams(url: string): { sessionId: string | null; token: string | null } {
    try {
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split('/')
      const sessionId = pathParts[pathParts.length - 1]
      const token = urlObj.searchParams.get('token')
      
      return {
        sessionId: sessionId || null,
        token: token || null
      }
    } catch (error) {
      return { sessionId: null, token: null }
    }
  }

  /**
   * Generate a new link for an expired interview
   */
  static async regenerateLink(sessionId: string, oldToken: string): Promise<string | null> {
    const oldTokenData = JWTService.decodeToken(oldToken)
    if (!oldTokenData) return null

    const linkData = await this.getLinkData(sessionId)
    if (!linkData) return null

    // Update interview date if it has passed
    const now = new Date()
    const interviewDate = new Date(linkData.interviewDate)
    if (interviewDate < now) {
      // Schedule for next available slot (e.g., tomorrow at the same time)
      interviewDate.setDate(interviewDate.getDate() + 1)
      linkData.interviewDate = interviewDate
    }

    return this.generateInterviewLink({
      sessionId: linkData.sessionId,
      candidateEmail: linkData.candidateEmail,
      candidateName: linkData.candidateName,
      interviewDate: linkData.interviewDate,
      duration: linkData.duration,
      position: linkData.position
    })
  }

  /**
   * Create email invitation content
   */
  static createEmailInvitation(data: EmailInvitation): {
    subject: string
    htmlBody: string
    textBody: string
  } {
    const formattedDate = new Intl.DateTimeFormat('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(data.scheduledDate)

    const subject = `Приглашение на интервью - ${data.position} - ВТБ`

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #1B4F8C 0%, #2563EB 100%);
      color: white;
      padding: 30px;
      border-radius: 8px 8px 0 0;
      text-align: center;
    }
    .content {
      background: white;
      padding: 30px;
      border: 1px solid #e0e0e0;
      border-radius: 0 0 8px 8px;
    }
    .button {
      display: inline-block;
      background: #1B4F8C;
      color: white;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
      font-weight: 600;
    }
    .button:hover {
      background: #143A66;
    }
    .info-box {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .requirements {
      background: #fff3cd;
      padding: 15px;
      border-left: 4px solid #ffc107;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>ВТБ Банк</h1>
    <p style="margin: 0;">Приглашение на интервью</p>
  </div>
  <div class="content">
    <p>Уважаемый(ая) <strong>${data.candidateName}</strong>,</p>
    
    <p>Благодарим Вас за интерес к позиции <strong>${data.position}</strong> в ВТБ Банке.</p>
    
    <p>Приглашаем Вас на онлайн-интервью с нашим AI-ассистентом.</p>
    
    <div class="info-box">
      <h3 style="margin-top: 0;">Детали интервью:</h3>
      <p><strong>📅 Дата и время:</strong> ${formattedDate}</p>
      <p><strong>⏱ Продолжительность:</strong> ${data.duration} минут</p>
      <p><strong>💼 Позиция:</strong> ${data.position}</p>
      <p><strong>🎧 Формат:</strong> Аудио-интервью (видео не требуется)</p>
    </div>
    
    <center>
      <a href="${data.link}" class="button">Перейти к интервью</a>
    </center>
    
    <div class="requirements">
      <h4 style="margin-top: 0;">Технические требования:</h4>
      <ul>
        <li>Современный браузер (Chrome, Firefox, Safari, Edge)</li>
        <li>Стабильное интернет-соединение</li>
        <li>Работающий микрофон</li>
        <li>Тихое помещение без посторонних шумов</li>
      </ul>
    </div>
    
    ${data.instructions && data.instructions.length > 0 ? `
    <div class="info-box">
      <h4 style="margin-top: 0;">Инструкции:</h4>
      <ol>
        ${data.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
      </ol>
    </div>
    ` : ''}
    
    <p><strong>Важно:</strong> Ссылка активна в течение 48 часов. Вы сможете присоединиться к интервью за 15 минут до назначенного времени.</p>
    
    ${data.hrContactEmail || data.hrContactPhone ? `
    <p>При возникновении вопросов, пожалуйста, свяжитесь с нами:</p>
    <ul>
      ${data.hrContactEmail ? `<li>Email: <a href="mailto:${data.hrContactEmail}">${data.hrContactEmail}</a></li>` : ''}
      ${data.hrContactPhone ? `<li>Телефон: ${data.hrContactPhone}</li>` : ''}
    </ul>
    ` : ''}
    
    <p>С уважением,<br>
    Команда подбора персонала<br>
    ВТБ Банк</p>
  </div>
  <div class="footer">
    <p>Это автоматическое сообщение. Пожалуйста, не отвечайте на него.</p>
    <p>© 2025 ВТБ Банк. Все права защищены.</p>
  </div>
</body>
</html>
    `

    const textBody = `
ВТБ Банк - Приглашение на интервью

Уважаемый(ая) ${data.candidateName},

Благодарим Вас за интерес к позиции ${data.position} в ВТБ Банке.

Приглашаем Вас на онлайн-интервью с нашим AI-ассистентом.

Детали интервью:
- Дата и время: ${formattedDate}
- Продолжительность: ${data.duration} минут
- Позиция: ${data.position}
- Формат: Аудио-интервью (видео не требуется)

Ссылка для участия:
${data.link}

Технические требования:
- Современный браузер (Chrome, Firefox, Safari, Edge)
- Стабильное интернет-соединение
- Работающий микрофон
- Тихое помещение без посторонних шумов

${data.instructions && data.instructions.length > 0 ? 
`Инструкции:
${data.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n')}
` : ''}

Важно: Ссылка активна в течение 48 часов. Вы сможете присоединиться к интервью за 15 минут до назначенного времени.

${data.hrContactEmail || data.hrContactPhone ? 
`При возникновении вопросов, пожалуйста, свяжитесь с нами:
${data.hrContactEmail ? `Email: ${data.hrContactEmail}` : ''}
${data.hrContactPhone ? `Телефон: ${data.hrContactPhone}` : ''}
` : ''}

С уважением,
Команда подбора персонала
ВТБ Банк

Это автоматическое сообщение. Пожалуйста, не отвечайте на него.
© 2025 ВТБ Банк. Все права защищены.
    `.trim()

    return {
      subject,
      htmlBody,
      textBody
    }
  }

  // Mock storage methods (in production, these would use a database)
  
  private static linkStorage = new Map<string, InterviewLinkData>()
  private static statusStorage = new Map<string, InterviewStatus>()

  private static storeLinkData(data: InterviewLinkData): void {
    this.linkStorage.set(data.sessionId, data)
  }

  private static async getLinkData(sessionId: string): Promise<InterviewLinkData | null> {
    // Simulate async database call
    await new Promise(resolve => setTimeout(resolve, 100))
    return this.linkStorage.get(sessionId) || null
  }

  private static async getInterviewStatus(sessionId: string): Promise<InterviewStatus | null> {
    // Simulate async database call
    await new Promise(resolve => setTimeout(resolve, 100))
    return this.statusStorage.get(sessionId) || 'scheduled'
  }

  static setInterviewStatus(sessionId: string, status: InterviewStatus): void {
    this.statusStorage.set(sessionId, status)
  }

  /**
   * Decode interview token to get session data
   */
  static decodeInterviewToken(token: string): any {
    return JWTService.decodeToken(token)
  }
}

// Helper function for candidate identity verification
export async function verifyCandidateIdentity(
  token: string,
  candidateEmail: string
): Promise<boolean> {
  const tokenData = JWTService.decodeToken(token)
  
  if (!tokenData) return false
  
  // In production, this would include additional verification steps like:
  // - OTP verification
  // - Email confirmation
  // - Identity document check
  
  return tokenData.candidateEmail === candidateEmail
}

// Helper function for scheduled time verification
export function isWithinScheduledWindow(
  scheduledDate: Date,
  windowMinutes: number = 15
): boolean {
  const now = new Date()
  const scheduled = new Date(scheduledDate)
  
  // Calculate time difference in minutes
  const diffMinutes = Math.floor((scheduled.getTime() - now.getTime()) / (1000 * 60))
  
  // Allow joining within window before and up to 60 minutes after scheduled time
  return diffMinutes <= windowMinutes && diffMinutes >= -60
}