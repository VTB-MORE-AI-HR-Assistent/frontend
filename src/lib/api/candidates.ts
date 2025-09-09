import apiClient from './client';
import { Candidate } from '@/types';

export interface CandidatesResponse {
  candidates: Candidate[];
  total: number;
  page: number;
  limit: number;
}

export interface CandidateFilters {
  search?: string;
  status?: string;
  department?: string;
  position?: string;
  experience?: string;
  skills?: string[];
  matchScore?: { min?: number; max?: number };
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateCandidateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  department: string;
  experience?: number;
  skills?: string[];
  resumeFile?: File;
  coverLetter?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  expectedSalary?: number;
  availability?: string;
  source?: string;
}

export interface UpdateCandidateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
  experience?: number;
  skills?: string[];
  status?: string;
  stage?: string;
  notes?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  expectedSalary?: number;
  availability?: string;
}

export interface CandidateNote {
  id: string;
  candidateId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CandidateAssessment {
  id: string;
  candidateId: string;
  type: string;
  score?: number;
  status: 'passed' | 'failed' | 'scheduled' | 'pending';
  date: Date;
  notes?: string;
}

export const candidatesApi = {
  // ЗАМЕТКА: Эти эндпоинты НЕ СУЩЕСТВУЮТ в backend - требуют реализации
  // Получить всех кандидатов с фильтрами
  getCandidates: async (filters: CandidateFilters = {}): Promise<CandidatesResponse> => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.position) params.append('position', filters.position);
    if (filters.experience) params.append('experience', filters.experience.toString());
    if (filters.skills && filters.skills.length > 0) {
      filters.skills.forEach(skill => params.append('skills', skill));
    }
    if (filters.page !== undefined) params.append('page', filters.page.toString());
    if (filters.size !== undefined) params.append('size', filters.size.toString());

    const response = await apiClient.get(`/v1/candidates?${params.toString()}`);
    return response.data;
  },

  // Получить кандидата по ID
  getCandidate: async (id: string): Promise<Candidate> => {
    const response = await apiClient.get(`/v1/candidates/${id}`);
    return response.data;
  },

  // Создать нового кандидата (используем upload для CV)
  createCandidate: async (candidate: CreateCandidateRequest): Promise<Candidate> => {
    const formData = new FormData();
    
    // Добавляем все поля кроме файла
    Object.entries(candidate).forEach(([key, value]) => {
      if (key !== 'resumeFile' && value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => formData.append(key, v.toString()));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Добавляем файл резюме если есть
    if (candidate.resumeFile) {
      formData.append('files', candidate.resumeFile);
    }

    // Используем реальный эндпоинт для создания кандидата
    const response = await apiClient.post('/v1/candidates', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Обновить кандидата
  updateCandidate: async (id: string, candidate: UpdateCandidateRequest): Promise<Candidate> => {
    const response = await apiClient.put(`/v1/candidates/${id}`, candidate);
    return response.data;
  },

  // Upload CV function
  uploadCV: async (file: File, candidateData?: any): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    
    if (candidateData) {
      Object.entries(candidateData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.post('/v1/candidates', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Удалить кандидата
  deleteCandidate: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/candidates/${id}`);
  },

  // Получить статистику по кандидатам
  getCandidateStats: async (): Promise<{
    total: number;
    new: number;
    screening: number;
    interview: number;
    offer: number;
    hired: number;
    rejected: number;
  }> => {
    const response = await apiClient.get('/v1/candidates/stats');
    return response.data;
  },

  // ЗАМЕТКА: Все нижеперечисленные эндпоинты НЕ РЕАЛИЗОВАНЫ в backend
  
  // Обновить статус кандидата
  updateCandidateStatus: async (id: string, status: string, stage?: string): Promise<Candidate> => {
    throw new Error('API endpoint PATCH /api/v1/candidates/{id}/status not implemented in backend');
  },

  // Добавить заметку к кандидату
  addCandidateNote: async (candidateId: string, content: string): Promise<CandidateNote> => {
    throw new Error('API endpoint POST /api/v1/candidates/{id}/notes not implemented in backend');
  },

  // Получить заметки кандидата
  getCandidateNotes: async (candidateId: string): Promise<CandidateNote[]> => {
    throw new Error('API endpoint GET /api/v1/candidates/{id}/notes not implemented in backend');
  },

  // Получить оценки кандидата
  getCandidateAssessments: async (candidateId: string): Promise<CandidateAssessment[]> => {
    throw new Error('API endpoint GET /api/v1/candidates/{id}/assessments not implemented in backend');
  },

  // Добавить оценку кандидату
  addCandidateAssessment: async (candidateId: string, assessment: {
    type: string;
    score?: number;
    status: string;
    notes?: string;
  }): Promise<CandidateAssessment> => {
    throw new Error('API endpoint POST /api/v1/candidates/{id}/assessments not implemented in backend');
  },

  // Скачать резюме кандидата
  downloadResume: async (candidateId: string): Promise<Blob> => {
    throw new Error('API endpoint GET /api/v1/candidates/{id}/resume not implemented in backend');
  },

  // Отправить email кандидату (используем реальный эндпоинт)
  sendEmail: async (candidateId: string, email: {
    subject: string;
    body: string;
    template?: string;
  }): Promise<void> => {
    // Используем реальный эндпоинт notification из backend
    await apiClient.post('/api/v1/interview-invitations', {
      candidateId,
      subject: email.subject,
      body: email.body
    });
  },

  // Получить статус загрузки CV
  getUploadStatus: async (uploadId: string): Promise<any> => {
    const response = await apiClient.get(`/api/v1/candidates/uploads/${uploadId}`);
    return response.data;
  },

  // Массовые операции - НЕ РЕАЛИЗОВАНЫ
  bulkUpdateStatus: async (candidateIds: string[], status: string, stage?: string): Promise<void> => {
    throw new Error('API endpoint PATCH /api/v1/candidates/bulk/status not implemented in backend');
  },

  bulkDelete: async (candidateIds: string[]): Promise<void> => {
    throw new Error('API endpoint DELETE /api/v1/candidates/bulk not implemented in backend');
  },

  // Экспорт кандидатов - НЕ РЕАЛИЗОВАН
  exportCandidates: async (filters: CandidateFilters = {}, format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> => {
    throw new Error('API endpoint GET /api/v1/candidates/export not implemented in backend');
  },

  // Поиск дубликатов - НЕ РЕАЛИЗОВАН
  findDuplicates: async (email?: string, phone?: string): Promise<Candidate[]> => {
    throw new Error('API endpoint GET /api/v1/candidates/duplicates not implemented in backend');
  }
};

export default candidatesApi;

