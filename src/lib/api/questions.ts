import apiClient from './client';

export interface Question {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty: 'junior' | 'middle' | 'senior';
  type: 'technical' | 'behavioral' | 'situational' | 'cultural';
  tags: string[];
  expectedAnswerTime: number; // in minutes
  position?: string;
  department?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface QuestionsResponse {
  questions: Question[];
  total: number;
  page: number;
  limit: number;
}

export interface QuestionFilters {
  search?: string;
  category?: string;
  difficulty?: string;
  type?: string;
  position?: string;
  department?: string;
  tags?: string[];
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateQuestionRequest {
  title: string;
  content: string;
  category: string;
  difficulty: 'junior' | 'middle' | 'senior';
  type: 'technical' | 'behavioral' | 'situational' | 'cultural';
  tags?: string[];
  expectedAnswerTime: number;
  position?: string;
  department?: string;
}

export interface UpdateQuestionRequest {
  title?: string;
  content?: string;
  category?: string;
  difficulty?: 'junior' | 'middle' | 'senior';
  type?: 'technical' | 'behavioral' | 'situational' | 'cultural';
  tags?: string[];
  expectedAnswerTime?: number;
  position?: string;
  department?: string;
  isActive?: boolean;
}

export interface QuestionBank {
  id: string;
  name: string;
  description: string;
  questionIds: string[];
  position: string;
  difficulty: string;
  estimatedDuration: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const questionsApi = {
  // Получить все вопросы с фильтрами
  getQuestions: async (filters: QuestionFilters = {}): Promise<QuestionsResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const response = await apiClient.get(`/api/v1/questions?${params.toString()}`);
    return response.data;
  },

  // Получить вопрос по ID
  getQuestion: async (id: string): Promise<Question> => {
    const response = await apiClient.get(`/api/v1/questions/${id}`);
    return response.data;
  },

  // Создать новый вопрос
  createQuestion: async (question: CreateQuestionRequest): Promise<Question> => {
    const response = await apiClient.post('/api/v1/questions', question);
    return response.data;
  },

  // Обновить вопрос
  updateQuestion: async (id: string, question: UpdateQuestionRequest): Promise<Question> => {
    const response = await apiClient.put(`/api/v1/questions/${id}`, question);
    return response.data;
  },

  // Удалить вопрос
  deleteQuestion: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/questions/${id}`);
  },

  // Получить статистику по вопросам
  getQuestionsStats: async (): Promise<{
    total: number;
    byCategory: Record<string, number>;
    byDifficulty: Record<string, number>;
    byType: Record<string, number>;
    active: number;
    inactive: number;
  }> => {
    const response = await apiClient.get('/api/v1/questions/stats');
    return response.data;
  },

  // Активировать/деактивировать вопрос
  toggleQuestionStatus: async (id: string, isActive: boolean): Promise<Question> => {
    const response = await apiClient.patch(`/api/v1/questions/${id}/status`, { isActive });
    return response.data;
  },

  // Массовые операции
  bulkUpdateStatus: async (questionIds: string[], isActive: boolean): Promise<void> => {
    await apiClient.patch('/api/v1/questions/bulk/status', { questionIds, isActive });
  },

  bulkDelete: async (questionIds: string[]): Promise<void> => {
    await apiClient.delete('/api/v1/questions/bulk', { data: { questionIds } });
  },

  bulkUpdateCategory: async (questionIds: string[], category: string): Promise<void> => {
    await apiClient.patch('/api/v1/questions/bulk/category', { questionIds, category });
  },

  // === Skills API ===

  // Получить все навыки
  getSkills: async (): Promise<any[]> => {
    const response = await apiClient.get('/api/v1/skills');
    return response.data;
  },

  // Создать навык
  createSkill: async (skill: { name: string; description?: string }): Promise<any> => {
    const response = await apiClient.post('/api/v1/skills', skill);
    return response.data;
  },

  // === Positions API ===

  // Получить все позиции
  getPositions: async (): Promise<any[]> => {
    const response = await apiClient.get('/api/v1/positions');
    return response.data;
  },

  // Создать позицию
  createPosition: async (position: { name: string; description?: string }): Promise<any> => {
    const response = await apiClient.post('/api/v1/positions', position);
    return response.data;
  },

  // === Skill Requirements API ===

  // Получить требования к навыкам
  getSkillRequirements: async (): Promise<any[]> => {
    const response = await apiClient.get('/api/v1/skill-requirements');
    return response.data;
  },

  // ЗАМЕТКА: Следующие эндпоинты НЕ СУЩЕСТВУЮТ в backend - требуют реализации

  // === Question Banks - НЕ РЕАЛИЗОВАНЫ ===
  getQuestionBanks: async (): Promise<QuestionBank[]> => {
    throw new Error('API endpoint /api/v1/questions/banks not implemented in backend');
  },

  getQuestionBank: async (id: string): Promise<QuestionBank> => {
    throw new Error('API endpoint /api/v1/questions/banks/{id} not implemented in backend');
  },

  createQuestionBank: async (bank: any): Promise<QuestionBank> => {
    throw new Error('API endpoint POST /api/v1/questions/banks not implemented in backend');
  },

  updateQuestionBank: async (id: string, bank: any): Promise<QuestionBank> => {
    throw new Error('API endpoint PUT /api/v1/questions/banks/{id} not implemented in backend');
  },

  deleteQuestionBank: async (id: string): Promise<void> => {
    throw new Error('API endpoint DELETE /api/v1/questions/banks/{id} not implemented in backend');
  },

  addQuestionsToBank: async (bankId: string, questionIds: string[]): Promise<QuestionBank> => {
    throw new Error('API endpoint POST /api/v1/questions/banks/{id}/questions not implemented in backend');
  },

  removeQuestionsFromBank: async (bankId: string, questionIds: string[]): Promise<QuestionBank> => {
    throw new Error('API endpoint DELETE /api/v1/questions/banks/{id}/questions not implemented in backend');
  },

  // === Interview Questions Generation - НЕ РЕАЛИЗОВАНЫ ===
  getRecommendedQuestions: async (params: any): Promise<Question[]> => {
    throw new Error('API endpoint /api/v1/questions/recommended not implemented in backend');
  },

  generateInterviewQuestions: async (params: any): Promise<Question[]> => {
    throw new Error('API endpoint POST /api/v1/questions/generate not implemented in backend');
  },

  // === Categories and Tags - НЕ РЕАЛИЗОВАНЫ ===
  getCategories: async (): Promise<string[]> => {
    throw new Error('API endpoint /api/v1/questions/categories not implemented in backend');
  },

  getTags: async (): Promise<string[]> => {
    throw new Error('API endpoint /api/v1/questions/tags not implemented in backend');
  },

  // === Import/Export - НЕ РЕАЛИЗОВАНЫ ===
  importQuestions: async (file: File): Promise<any> => {
    throw new Error('API endpoint POST /api/v1/questions/import not implemented in backend');
  },

  exportQuestions: async (filters: QuestionFilters = {}, format: 'csv' | 'xlsx' | 'json' = 'csv'): Promise<Blob> => {
    throw new Error('API endpoint GET /api/v1/questions/export not implemented in backend');
  }
};

export default questionsApi;
