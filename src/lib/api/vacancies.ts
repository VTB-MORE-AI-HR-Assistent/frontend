import { Vacancy } from '@/types';
import { mockVacancies, mockStats, simulateApiDelay } from '../mock-data';

export interface VacanciesResponse {
  vacancies: Vacancy[];
  total: number;
  page: number;
  limit: number;
}

export interface VacancyFilters {
  search?: string;
  department?: string;
  status?: string;
  location?: string;
  type?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const vacanciesApi = {
  // Получить все вакансии с фильтрами - MOCKED
  getVacancies: async (filters: VacancyFilters = {}): Promise<VacanciesResponse> => {
    await simulateApiDelay(500);
    
    let filteredVacancies = [...mockVacancies];
    
    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredVacancies = filteredVacancies.filter(v => 
        v.title.toLowerCase().includes(searchLower) ||
        v.department.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.department) {
      filteredVacancies = filteredVacancies.filter(v => v.department === filters.department);
    }
    
    if (filters.status) {
      filteredVacancies = filteredVacancies.filter(v => v.status === filters.status);
    }
    
    // Apply pagination
    const page = filters.page || 0;
    const limit = filters.limit || 10;
    const start = page * limit;
    const paginatedVacancies = filteredVacancies.slice(start, start + limit);
    
    return {
      vacancies: paginatedVacancies,
      total: filteredVacancies.length,
      page,
      limit
    };
  },

  // Получить вакансию по ID - MOCKED
  getVacancy: async (id: string): Promise<Vacancy> => {
    await simulateApiDelay(300);
    
    const vacancy = mockVacancies.find(v => v.id === id);
    if (!vacancy) {
      throw new Error('Vacancy not found');
    }
    
    return vacancy;
  },

  // Создать новую вакансию (из JSON данных)
  createVacancy: async (vacancy: Omit<Vacancy, 'id' | 'createdAt' | 'applicants' | 'interviewed'>): Promise<Vacancy> => {
    const response = await apiClient.post('/v1/vacancies', vacancy);
    return response.data;
  },

  // Обновить вакансию
  updateVacancy: async (id: string, vacancy: Partial<Omit<Vacancy, 'id' | 'createdAt'>>): Promise<Vacancy> => {
    const response = await apiClient.put(`/v1/vacancies/${id}`, vacancy);
    return response.data;
  },

  // Удалить вакансию
  deleteVacancy: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/vacancies/${id}`);
  },

  // Поиск вакансий (используя POST /search как в backend)
  searchVacancies: async (criteria: Record<string, unknown>): Promise<Vacancy[]> => {
    const response = await apiClient.post('/v1/vacancies/search', criteria);
    return response.data;
  },

  // Получить статистику по вакансиям - MOCKED
  getVacancyStats: async (): Promise<{
    total: number;
    active: number;
    paused: number;
    closed: number;
    totalCandidates: number;
    totalInterviews: number;
  }> => {
    await simulateApiDelay(400);
    return mockStats.vacancies;
  },

  // Получить кандидатов по вакансии
  getVacancyCandidates: async (id: string): Promise<Record<string, unknown>[]> => {
    const response = await apiClient.get(`/v1/vacancies/${id}/candidates`);
    return response.data;
  },

  // Архивировать вакансию
  archiveVacancy: async (id: string): Promise<void> => {
    await apiClient.post(`/v1/vacancies/${id}/archive`);
  },

  // Опубликовать вакансию
  publishVacancy: async (id: string): Promise<void> => {
    await apiClient.post(`/v1/vacancies/${id}/publish`);
  },

  // Приостановить вакансию
  pauseVacancy: async (id: string): Promise<void> => {
    await apiClient.post(`/v1/vacancies/${id}/pause`);
  },

  // Загрузить и распарсить файл вакансии - MOCKED
  uploadVacancyFile: async (file: File): Promise<Vacancy> => {
    await simulateApiDelay(1500);
    
    // Mock parsed vacancy from file
    const mockParsedVacancy: Vacancy = {
      id: `vac-${Date.now()}`,
      title: `Parsed Position from ${file.name}`,
      department: 'IT',
      location: 'Moscow',
      type: 'Full-time',
      status: 'Active',
      applicants: 0,
      interviewed: 0,
      description: 'This is a parsed job description from the uploaded file.',
      requirements: ['Requirement 1', 'Requirement 2', 'Requirement 3'],
      salary: { min: 150000, max: 250000, currency: 'RUB' },
      createdAt: new Date()
    };
    
    return mockParsedVacancy;
  },

  // Предварительный просмотр парсинга файла вакансии (без сохранения)
  previewVacancyFile: async (file: File): Promise<Record<string, unknown>> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/v1/vacancies/parse-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default vacanciesApi;
