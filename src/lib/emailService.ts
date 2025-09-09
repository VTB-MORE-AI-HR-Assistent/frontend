interface Candidate {
  id: string;
  name: string;
  email: string;
  score: number;
}

interface Vacancy {
  title: string;
  company: string;
}

interface SendInvitationRequest {
  candidates: Candidate[];
  vacancy: Vacancy;
}

interface SendInvitationResult {
  candidateId: string;
  success: boolean;
  error?: string;
  emailId?: string;
  mockEmail: string;
}

interface SendInvitationResponse {
  success: boolean;
  message: string;
  results: SendInvitationResult[];
  summary: {
    total: number;
    sent: number;
    failed: number;
  };
}

export class EmailService {
  private static readonly API_BASE_URL = '/api';

  /**
   * Отправляет приглашения на интервью выбранным кандидатам
   */
  static async sendInvitations(
    candidates: Candidate[],
    vacancy: Vacancy
  ): Promise<SendInvitationResponse> {
    try {
      const requestData: SendInvitationRequest = {
        candidates,
        vacancy
      };

      const response = await fetch(`${this.API_BASE_URL}/send-invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result: SendInvitationResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Ошибка при отправке приглашений:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Неизвестная ошибка при отправке приглашений'
      );
    }
  }

  /**
   * Форматирует результаты отправки для отображения пользователю
   */
  static formatSendResults(response: SendInvitationResponse): string {
    const { summary } = response;
    
    if (summary.sent === summary.total) {
      return `✅ Все приглашения отправлены успешно (${summary.sent}/${summary.total})`;
    } else if (summary.sent > 0) {
      return `⚠️ Частично отправлено: ${summary.sent}/${summary.total} приглашений`;
    } else {
      return `❌ Не удалось отправить ни одного приглашения (0/${summary.total})`;
    }
  }

  /**
   * Получает детальную информацию об ошибках отправки
   */
  static getFailedCandidates(response: SendInvitationResponse): SendInvitationResult[] {
    return response.results.filter(result => !result.success);
  }

  /**
   * Получает список успешно отправленных приглашений
   */
  static getSuccessfulCandidates(response: SendInvitationResponse): SendInvitationResult[] {
    return response.results.filter(result => result.success);
  }
}

export type { 
  Candidate, 
  Vacancy, 
  SendInvitationRequest, 
  SendInvitationResult, 
  SendInvitationResponse 
};
