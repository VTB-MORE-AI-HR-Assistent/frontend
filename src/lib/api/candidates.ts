import { Candidate } from '@/types';
import { mockCandidates, mockStats, simulateApiDelay } from '../mock-data';
import apiClient from './client';

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

export interface UploadCVsRequest {
  jobId?: number;
  files: File[];
}

export interface UploadCVsResponse {
  uploadId: string;
  status: 'COMPLETED' | 'COMPLETED_WITH_ERRORS' | 'FAILED';
  items: Array<{
    id: number;
    filename: string;
    status: 'COMPLETED' | 'FAILED';
    candidateId?: number;
    email?: string;
    errorCode?: string;
    errorMessage?: string;
  }>;
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
  // Получить всех кандидатов с фильтрами - MOCKED
  getCandidates: async (filters: CandidateFilters = {}): Promise<CandidatesResponse> => {
    await simulateApiDelay(600);
    
    let filteredCandidates = [...mockCandidates];
    
    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredCandidates = filteredCandidates.filter(c => 
        c.name.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower) ||
        c.position.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.status) {
      filteredCandidates = filteredCandidates.filter(c => c.status === filters.status);
    }
    
    if (filters.position) {
      filteredCandidates = filteredCandidates.filter(c => 
        c.position.toLowerCase().includes(filters.position!.toLowerCase())
      );
    }
    
    // Apply sorting
    if (filters.sortBy) {
      filteredCandidates.sort((a, b) => {
        const aVal = (a as any)[filters.sortBy!];
        const bVal = (b as any)[filters.sortBy!];
        const order = filters.sortOrder === 'desc' ? -1 : 1;
        return aVal > bVal ? order : -order;
      });
    }
    
    // Apply pagination
    const page = filters.page || 0;
    const limit = filters.limit || 10;
    const start = page * limit;
    const paginatedCandidates = filteredCandidates.slice(start, start + limit);
    
    return {
      candidates: paginatedCandidates,
      total: filteredCandidates.length,
      page,
      limit
    };
  },

  // Получить кандидата по ID - MOCKED
  getCandidate: async (id: string): Promise<Candidate> => {
    await simulateApiDelay(300);
    
    const candidate = mockCandidates.find(c => c.id === id);
    if (!candidate) {
      throw new Error('Candidate not found');
    }
    
    return candidate;
  },

  // Создать нового кандидата - MOCKED
  createCandidate: async (candidate: CreateCandidateRequest): Promise<Candidate> => {
    await simulateApiDelay(1000);
    
    // Create new candidate with mock data
    const newCandidate: Candidate = {
      id: `cand-${Date.now()}`,
      name: `${candidate.firstName} ${candidate.lastName}`,
      email: candidate.email,
      phone: candidate.phone || '+7 (999) 000-00-00',
      position: candidate.position,
      experience: candidate.experience || 0,
      skills: candidate.skills || [],
      matchScore: Math.floor(Math.random() * 40) + 60, // 60-100
      status: 'New',
      resumeUrl: candidate.resumeFile?.name || 'uploaded_resume.pdf',
      appliedAt: new Date()
    };
    
    // Add to mock data (in real app this would be persisted)
    mockCandidates.push(newCandidate);
    
    return newCandidate;
  },

  // Обновить кандидата - MOCKED
  updateCandidate: async (id: string, candidateUpdate: UpdateCandidateRequest): Promise<Candidate> => {
    await simulateApiDelay(500);
    
    const candidateIndex = mockCandidates.findIndex(c => c.id === id);
    if (candidateIndex === -1) {
      throw new Error('Candidate not found');
    }
    
    // Update candidate
    const updatedCandidate = {
      ...mockCandidates[candidateIndex],
      ...candidateUpdate,
      name: candidateUpdate.firstName && candidateUpdate.lastName 
        ? `${candidateUpdate.firstName} ${candidateUpdate.lastName}`
        : mockCandidates[candidateIndex].name
    };
    
    mockCandidates[candidateIndex] = updatedCandidate;
    return updatedCandidate;
  },

  // Upload CV function - MOCKED
  uploadCV: async (file: File, candidateData?: any): Promise<any> => {
    await simulateApiDelay(1200);
    
    // Mock CV analysis result
    return {
      id: `upload-${Date.now()}`,
      fileName: file.name,
      fileSize: file.size,
      status: 'processed',
      extractedData: {
        name: candidateData?.name || 'Extracted Name',
        email: candidateData?.email || 'extracted@email.com',
        phone: candidateData?.phone || '+7 (999) 123-45-67',
        skills: ['React', 'TypeScript', 'Node.js'],
        experience: Math.floor(Math.random() * 8) + 2,
        education: 'Bachelor\'s Degree in Computer Science'
      },
      matchScore: Math.floor(Math.random() * 40) + 60
    };
  },

  // Удалить кандидата - MOCKED
  deleteCandidate: async (id: string): Promise<void> => {
    await simulateApiDelay(300);
    
    const candidateIndex = mockCandidates.findIndex(c => c.id === id);
    if (candidateIndex === -1) {
      throw new Error('Candidate not found');
    }
    
    mockCandidates.splice(candidateIndex, 1);
  },

  // Получить статистику по кандидатам - MOCKED
  getCandidateStats: async (): Promise<{
    total: number;
    new: number;
    screening: number;
    interview: number;
    offer: number;
    hired: number;
    rejected: number;
  }> => {
    await simulateApiDelay(400);
    return mockStats.candidates;
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

  // Загрузить CV файлы
  uploadCVs: async (request: UploadCVsRequest): Promise<UploadCVsResponse> => {
    const formData = new FormData();
    
    // Добавляем jobId если есть
    if (request.jobId) {
      formData.append('jobId', request.jobId.toString());
    }
    
    // Добавляем файлы
    request.files.forEach(file => {
      formData.append('files', file);
    });

    const response = await apiClient.post('/api/v1/candidates/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
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

