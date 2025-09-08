import apiClient from './client';
import { Vacancy, CreateVacancyRequest, UpdateVacancyRequest } from '@/types';

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
  // Получить все вакансии с фильтрами
  getVacancies: async (filters: VacancyFilters = {}): Promise<VacanciesResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/v1/vacancies?${params.toString()}`);
    return response.data;
  },

  // Получить вакансию по ID
  getVacancy: async (id: string): Promise<Vacancy> => {
    const response = await apiClient.get(`/v1/vacancies/${id}`);
    return response.data;
  },

  // Создать новую вакансию
  createVacancy: async (vacancy: CreateVacancyRequest): Promise<Vacancy> => {
    const response = await apiClient.post('/v1/vacancies', vacancy);
    return response.data;
  },

  // Обновить вакансию
  updateVacancy: async (id: string, vacancy: UpdateVacancyRequest): Promise<Vacancy> => {
    const response = await apiClient.put(`/v1/vacancies/${id}`, vacancy);
    return response.data;
  },

  // Удалить вакансию
  deleteVacancy: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/vacancies/${id}`);
  },

  // Поиск вакансий (используя POST /search как в backend)
  searchVacancies: async (criteria: any): Promise<Vacancy[]> => {
    const response = await apiClient.post('/v1/vacancies/search', criteria);
    return response.data;
  },

  // ЗАМЕТКА: Эти эндпоинты НЕ СУЩЕСТВУЮТ в backend - требуют реализации
  // Получить статистику по вакансиям
  getVacancyStats: async (): Promise<{
    total: number;
    active: number;
    paused: number;
    closed: number;
    totalCandidates: number;
    totalInterviews: number;
  }> => {
    // TODO: Добавить в backend job-service
    throw new Error('API endpoint /api/v1/vacancies/stats not implemented in backend');
  },

  // Получить кандидатов по вакансии
  getVacancyCandidates: async (id: string): Promise<any[]> => {
    // TODO: Добавить в backend job-service
    throw new Error('API endpoint /api/v1/vacancies/{id}/candidates not implemented in backend');
  },

  // Архивировать вакансию
  archiveVacancy: async (id: string): Promise<void> => {
    // TODO: Добавить в backend job-service
    throw new Error('API endpoint /api/v1/vacancies/{id}/archive not implemented in backend');
  },

  // Опубликовать вакансию
  publishVacancy: async (id: string): Promise<void> => {
    // TODO: Добавить в backend job-service
    throw new Error('API endpoint /api/v1/vacancies/{id}/publish not implemented in backend');
  },

  // Приостановить вакансию
  pauseVacancy: async (id: string): Promise<void> => {
    // TODO: Добавить в backend job-service
    throw new Error('API endpoint /api/v1/vacancies/{id}/pause not implemented in backend');
  }
};

export default vacanciesApi;
