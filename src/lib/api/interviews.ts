import apiClient from './client';

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  vacancyId: string;
  vacancyTitle: string;
  scheduledAt: Date;
  duration: number;
  type: 'technical' | 'behavioral' | 'cultural' | 'mixed';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'expired';
  interviewerIds: string[];
  meetingUrl?: string;
  meetingId?: string;
  notes?: string;
  score?: number;
  feedback?: string;
  recordingUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InterviewsResponse {
  interviews: Interview[];
  total: number;
  page: number;
  limit: number;
}

export interface InterviewFilters {
  candidateId?: string;
  vacancyId?: string;
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  interviewerId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateInterviewRequest {
  candidateId: string;
  vacancyId: string;
  scheduledAt: Date;
  duration: number;
  type: 'technical' | 'behavioral' | 'cultural' | 'mixed';
  interviewerIds: string[];
  notes?: string;
}

export interface UpdateInterviewRequest {
  scheduledAt?: Date;
  duration?: number;
  type?: 'technical' | 'behavioral' | 'cultural' | 'mixed';
  interviewerIds?: string[];
  notes?: string;
  score?: number;
  feedback?: string;
}

export interface InterviewSession {
  sessionId: string;
  interviewId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  jobDescription?: string;
  department?: string;
  scheduledTime: Date;
  duration: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'expired';
  interviewType: 'technical' | 'behavioral' | 'cultural' | 'mixed';
  difficulty: 'junior' | 'middle' | 'senior';
  roomUrl?: string;
  token?: string;
}

export interface InterviewValidation {
  isValid: boolean;
  session?: InterviewSession;
  error?: string;
  remainingTime?: number;
}

export interface RoomCredentials {
  roomUrl: string;
  token: string;
  expiresAt: Date;
  enableRecording: boolean;
  maxDuration: number;
}

export interface InterviewResult {
  sessionId: string;
  duration: number;
  completedAt: Date;
  status: 'completed' | 'terminated' | 'technical_issue';
  nextSteps?: string;
}

export const interviewsApi = {
  // Получить все интервью с фильтрами
  getInterviews: async (filters: InterviewFilters = {}): Promise<InterviewsResponse> => {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get(`/v1/interviews?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.warn("Interviews endpoint not available, returning empty results");
      return {
        interviews: [],
        total: 0,
        page: filters.page || 1,
        limit: filters.limit || 10
      };
    }
  },

  // Получить интервью по ID
  getInterview: async (id: string): Promise<Interview> => {
    const response = await apiClient.get(`/v1/interviews/${id}`);
    return response.data;
  },

  // Создать новое интервью
  createInterview: async (interview: CreateInterviewRequest): Promise<Interview> => {
    const response = await apiClient.post('/v1/interviews', interview);
    return response.data;
  },

  // Обновить интервью
  updateInterview: async (id: string, interview: UpdateInterviewRequest): Promise<Interview> => {
    const response = await apiClient.put(`/v1/interviews/${id}`, interview);
    return response.data;
  },

  // Удалить интервью
  deleteInterview: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/interviews/${id}`);
  },

  // Получить статистику по интервью
  getInterviewStats: async (): Promise<{
    total: number;
    scheduled: number;
    completed: number;
    cancelled: number;
    averageScore: number;
    averageDuration: number;
  }> => {
    try {
      const response = await apiClient.get('/v1/interviews/stats');
      return response.data;
    } catch (error) {
      console.warn("Interview stats endpoint not available, returning mock data");
      return {
        total: 0,
        scheduled: 0,
        completed: 0,
        cancelled: 0,
        averageScore: 0,
        averageDuration: 0
      };
    }
  },

  // === AI Interview Session API ===

  // Валидация сессии интервью
  validateSession: async (sessionId: string, token?: string): Promise<{
    success: boolean;
    data?: InterviewValidation;
    error?: { code: string; message: string; };
  }> => {
    const response = await apiClient.post(`/v1/interviews/validate/${sessionId}`, { token });
    return response.data;
  },

  // Получить детали интервью сессии
  getInterviewDetails: async (sessionId: string): Promise<{
    success: boolean;
    data?: InterviewSession;
    error?: { code: string; message: string; };
  }> => {
    const response = await apiClient.get(`/v1/interviews/session/${sessionId}`);
    return response.data;
  },

  // Присоединиться к интервью (получить комнату)
  joinInterview: async (sessionId: string): Promise<{
    success: boolean;
    data?: RoomCredentials;
    error?: { code: string; message: string; };
  }> => {
    const response = await apiClient.post(`/v1/interviews/${sessionId}/join`);
    return response.data;
  },

  // Завершить интервью
  endInterview: async (sessionId: string, duration: number): Promise<{
    success: boolean;
    data?: InterviewResult;
    error?: { code: string; message: string; };
  }> => {
    const response = await apiClient.post(`/v1/interviews/${sessionId}/end`, { duration });
    return response.data;
  },

  // Сообщить о технической проблеме
  reportIssue: async (
    sessionId: string, 
    issueType: 'audio' | 'connection' | 'browser' | 'other', 
    description: string
  ): Promise<{
    success: boolean;
    data?: { ticketId: string };
    error?: { code: string; message: string; };
  }> => {
    const response = await apiClient.post(`/v1/interviews/${sessionId}/report-issue`, {
      issueType,
      description,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
    });
    return response.data;
  },

  // Проверить статус комнаты
  checkRoomStatus: async (sessionId: string): Promise<{
    success: boolean;
    data?: { 
      isActive: boolean; 
      participantCount: number;
      aiBotJoined: boolean;
    };
    error?: { code: string; message: string; };
  }> => {
    const response = await apiClient.get(`/v1/interviews/${sessionId}/room-status`);
    return response.data;
  },

  // Получить вопросы для интервью
  getInterviewQuestions: async (sessionId: string): Promise<{
    success: boolean;
    data?: {
      questions: Array<{
        id: string;
        question: string;
        category: string;
        difficulty: string;
        expectedDuration: number;
      }>;
    };
    error?: { code: string; message: string; };
  }> => {
    const response = await apiClient.get(`/v1/interviews/${sessionId}/questions`);
    return response.data;
  },

  // === Traditional Interview Management ===

  // Запланировать интервью
  scheduleInterview: async (interviewData: {
    candidateId: string;
    vacancyId: string;
    scheduledAt: Date;
    duration: number;
    type: string;
    interviewerIds: string[];
  }): Promise<Interview> => {
    const response = await apiClient.post('/v1/interviews/schedule', interviewData);
    return response.data;
  },

  // Перенести интервью
  rescheduleInterview: async (id: string, newDateTime: Date): Promise<Interview> => {
    const response = await apiClient.patch(`/v1/interviews/${id}/reschedule`, { scheduledAt: newDateTime });
    return response.data;
  },

  // Отменить интервью
  cancelInterview: async (id: string, reason?: string): Promise<void> => {
    await apiClient.patch(`/v1/interviews/${id}/cancel`, { reason });
  },

  // Начать интервью
  startInterview: async (id: string): Promise<Interview> => {
    const response = await apiClient.patch(`/v1/interviews/${id}/start`);
    return response.data;
  },

  // Завершить традиционное интервью
  completeInterview: async (id: string, data: {
    score?: number;
    feedback?: string;
    notes?: string;
  }): Promise<Interview> => {
    const response = await apiClient.patch(`/v1/interviews/${id}/complete`, data);
    return response.data;
  },

  // Получить календарь интервью
  getInterviewCalendar: async (startDate: Date, endDate: Date): Promise<Interview[]> => {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });

    const response = await apiClient.get(`/v1/interviews/calendar?${params.toString()}`);
    return response.data;
  },

  // Получить доступных интервьюеров
  getAvailableInterviewers: async (date: Date, duration: number): Promise<{
    id: string;
    name: string;
    email: string;
    department: string;
    availableSlots: Date[];
  }[]> => {
    const params = new URLSearchParams({
      date: date.toISOString(),
      duration: duration.toString()
    });

    const response = await apiClient.get(`/v1/interviews/available-interviewers?${params.toString()}`);
    return response.data;
  }
};

export default interviewsApi;
