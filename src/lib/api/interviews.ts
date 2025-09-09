import { mockInterviews, mockTodayInterviews, mockQuestions, simulateApiDelay } from '../mock-data';

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
  // Получить все интервью с фильтрами - MOCKED
  getInterviews: async (filters: InterviewFilters = {}): Promise<InterviewsResponse> => {
    await simulateApiDelay(400);
    
    let filteredInterviews = [...mockInterviews];
    
    // Apply filters
    if (filters.candidateId) {
      filteredInterviews = filteredInterviews.filter(i => i.candidateId === filters.candidateId);
    }
    if (filters.vacancyId) {
      filteredInterviews = filteredInterviews.filter(i => i.vacancyId === filters.vacancyId);
    }
    if (filters.status) {
      filteredInterviews = filteredInterviews.filter(i => i.status === filters.status);
    }
    if (filters.type) {
      filteredInterviews = filteredInterviews.filter(i => i.type === filters.type);
    }
    if (filters.interviewerId) {
      filteredInterviews = filteredInterviews.filter(i => i.interviewerIds?.includes(filters.interviewerId!));
    }
    
    // Apply date filters
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filteredInterviews = filteredInterviews.filter(i => new Date(i.scheduledAt) >= fromDate);
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      filteredInterviews = filteredInterviews.filter(i => new Date(i.scheduledAt) <= toDate);
    }
    
    // Apply sorting
    const sortBy = filters.sortBy || 'scheduledAt';
    const sortOrder = filters.sortOrder || 'desc';
    filteredInterviews.sort((a, b) => {
      const aValue = (a as any)[sortBy];
      const bValue = (b as any)[sortBy];
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const paginatedInterviews = filteredInterviews.slice(startIndex, startIndex + limit);
    
    return {
      interviews: paginatedInterviews,
      total: filteredInterviews.length,
      page,
      limit
    };
  },

  // Получить интервью по ID - MOCKED
  getInterview: async (id: string): Promise<Interview> => {
    await simulateApiDelay(300);
    
    const interview = mockInterviews.find(i => i.id === id);
    if (!interview) {
      throw new Error('Interview not found');
    }
    
    return interview;
  },

  // Создать новое интервью - MOCKED
  createInterview: async (interview: CreateInterviewRequest): Promise<Interview> => {
    await simulateApiDelay(600);
    
    const newInterview: Interview = {
      id: `interview_${Date.now()}`,
      candidateId: interview.candidateId,
      candidateName: `Candidate ${interview.candidateId}`,
      candidateEmail: `candidate${interview.candidateId}@example.com`,
      vacancyId: interview.vacancyId,
      vacancyTitle: `Vacancy ${interview.vacancyId}`,
      scheduledAt: interview.scheduledAt,
      duration: interview.duration,
      type: interview.type,
      status: 'scheduled',
      interviewerIds: interview.interviewerIds,
      notes: interview.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockInterviews.push(newInterview);
    return newInterview;
  },

  // Обновить интервью - MOCKED
  updateInterview: async (id: string, interview: UpdateInterviewRequest): Promise<Interview> => {
    await simulateApiDelay(500);
    
    const existingInterview = mockInterviews.find(i => i.id === id);
    if (!existingInterview) {
      throw new Error('Interview not found');
    }
    
    const updatedInterview = {
      ...existingInterview,
      ...interview,
      updatedAt: new Date()
    };
    
    const index = mockInterviews.findIndex(i => i.id === id);
    mockInterviews[index] = updatedInterview;
    
    return updatedInterview;
  },

  // Удалить интервью - MOCKED
  deleteInterview: async (id: string): Promise<void> => {
    await simulateApiDelay(300);
    
    const index = mockInterviews.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error('Interview not found');
    }
    
    mockInterviews.splice(index, 1);
  },

  // Получить статистику по интервью - MOCKED
  getInterviewStats: async (): Promise<{
    total: number;
    scheduled: number;
    completed: number;
    cancelled: number;
    averageScore: number;
    averageDuration: number;
  }> => {
    await simulateApiDelay(300);
    
    const total = mockInterviews.length;
    const scheduled = mockInterviews.filter(i => i.status === 'Scheduled').length;
    const completed = mockInterviews.filter(i => i.status === 'Completed').length;
    const cancelled = mockInterviews.filter(i => i.status === 'Cancelled').length;
    
    const completedInterviews = mockInterviews.filter(i => i.status === 'Completed' && i.score);
    const averageScore = completedInterviews.length > 0 
      ? completedInterviews.reduce((sum, i) => sum + (i.score || 0), 0) / completedInterviews.length
      : 0;
    
    const averageDuration = mockInterviews.length > 0
      ? mockInterviews.reduce((sum, i) => sum + i.duration, 0) / mockInterviews.length
      : 0;
    
    return {
      total,
      scheduled,
      completed,
      cancelled,
      averageScore,
      averageDuration
    };
  },

  // === AI Interview Session API ===

  // Валидация сессии интервью - MOCKED
  validateSession: async (sessionId: string, _token?: string): Promise<{
    success: boolean;
    data?: InterviewValidation;
    error?: { code: string; message: string; };
  }> => {
    await simulateApiDelay(200);
    
    const todaysInterview = mockTodayInterviews.find(i => i.sessionId === sessionId);
    if (!todaysInterview) {
      return {
        success: false,
        error: { code: 'SESSION_NOT_FOUND', message: 'Interview session not found' }
      };
    }
    
    const now = new Date();
    const scheduledTime = new Date(todaysInterview.scheduledTime);
    const endTime = new Date(scheduledTime.getTime() + todaysInterview.duration * 60000);
    
    if (now > endTime) {
      return {
        success: false,
        error: { code: 'SESSION_EXPIRED', message: 'Interview session has expired' }
      };
    }
    
    return {
      success: true,
      data: {
        isValid: true,
        session: todaysInterview,
        remainingTime: Math.max(0, endTime.getTime() - now.getTime())
      }
    };
  },

  // Получить детали интервью сессии - MOCKED
  getInterviewDetails: async (sessionId: string): Promise<{
    success: boolean;
    data?: InterviewSession;
    error?: { code: string; message: string; };
  }> => {
    await simulateApiDelay(250);
    
    const session = mockTodayInterviews.find(i => i.sessionId === sessionId);
    if (!session) {
      return {
        success: false,
        error: { code: 'SESSION_NOT_FOUND', message: 'Interview session not found' }
      };
    }
    
    return {
      success: true,
      data: session
    };
  },

  // Присоединиться к интервью (получить комнату) - MOCKED
  joinInterview: async (sessionId: string): Promise<{
    success: boolean;
    data?: RoomCredentials;
    error?: { code: string; message: string; };
  }> => {
    await simulateApiDelay(400);
    
    const session = mockTodayInterviews.find(i => i.sessionId === sessionId);
    if (!session) {
      return {
        success: false,
        error: { code: 'SESSION_NOT_FOUND', message: 'Interview session not found' }
      };
    }
    
    return {
      success: true,
      data: {
        roomUrl: `https://mock-daily.co/room-${sessionId}`,
        token: `mock-token-${sessionId}-${Date.now()}`,
        expiresAt: new Date(Date.now() + session.duration * 60000),
        enableRecording: true,
        maxDuration: session.duration
      }
    };
  },

  // Завершить интервью - MOCKED
  endInterview: async (sessionId: string, duration: number): Promise<{
    success: boolean;
    data?: InterviewResult;
    error?: { code: string; message: string; };
  }> => {
    await simulateApiDelay(300);
    
    const session = mockTodayInterviews.find(i => i.sessionId === sessionId);
    if (!session) {
      return {
        success: false,
        error: { code: 'SESSION_NOT_FOUND', message: 'Interview session not found' }
      };
    }
    
    // Update session status
    session.status = 'completed';
    
    return {
      success: true,
      data: {
        sessionId,
        duration,
        completedAt: new Date(),
        status: 'completed',
        nextSteps: 'Thank you for completing the interview. You will receive feedback within 2-3 business days.'
      }
    };
  },

  // Сообщить о технической проблеме - MOCKED
  reportIssue: async (
    _sessionId: string, 
    _issueType: 'audio' | 'connection' | 'browser' | 'other', 
    _description: string
  ): Promise<{
    success: boolean;
    data?: { ticketId: string };
    error?: { code: string; message: string; };
  }> => {
    await simulateApiDelay(400);
    
    return {
      success: true,
      data: {
        ticketId: `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
    };
  },

  // Проверить статус комнаты - MOCKED
  checkRoomStatus: async (sessionId: string): Promise<{
    success: boolean;
    data?: { 
      isActive: boolean; 
      participantCount: number;
      aiBotJoined: boolean;
    };
    error?: { code: string; message: string; };
  }> => {
    await simulateApiDelay(200);
    
    const session = mockTodayInterviews.find(i => i.sessionId === sessionId);
    if (!session) {
      return {
        success: false,
        error: { code: 'SESSION_NOT_FOUND', message: 'Interview session not found' }
      };
    }
    
    return {
      success: true,
      data: {
        isActive: session.status === 'in_progress',
        participantCount: Math.floor(Math.random() * 3) + 1,
        aiBotJoined: true
      }
    };
  },

  // Получить вопросы для интервью - MOCKED
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
    await simulateApiDelay(300);
    
    const session = mockTodayInterviews.find(i => i.sessionId === sessionId);
    if (!session) {
      return {
        success: false,
        error: { code: 'SESSION_NOT_FOUND', message: 'Interview session not found' }
      };
    }
    
    // Get all questions from different categories
    const allQuestions = [
      ...mockQuestions.technical,
      ...mockQuestions.behavioral,
      ...mockQuestions.experience
    ];
    
    // Filter questions by difficulty and type
    const filteredQuestions = allQuestions
      .filter(q => q.difficulty === session.difficulty)
      .slice(0, 5); // Return first 5 questions
    
    return {
      success: true,
      data: {
        questions: filteredQuestions.map(q => ({
          id: q.id,
          question: q.question,
          category: q.category,
          difficulty: q.difficulty,
          expectedDuration: 300 // Default 5 minutes
        }))
      }
    };
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
