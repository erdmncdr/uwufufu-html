import apiClient from './client';
import {
  QuizWithRelations,
  PaginatedResponse,
  CreateQuizDto,
  UpdateQuizDto,
  QuizListQuery,
} from '@uwufufu/shared';

export const quizzesApi = {
  list: async (params: QuizListQuery): Promise<PaginatedResponse<QuizWithRelations>> => {
    const response = await apiClient.get('/quizzes', { params });
    return response.data;
  },

  getBySlug: async (slug: string, lang?: string): Promise<QuizWithRelations> => {
    const response = await apiClient.get(`/quizzes/${slug}`, {
      params: { lang },
    });
    return response.data;
  },

  create: async (data: CreateQuizDto): Promise<QuizWithRelations> => {
    const response = await apiClient.post('/quizzes', data);
    return response.data;
  },

  update: async (id: string, data: UpdateQuizDto): Promise<QuizWithRelations> => {
    const response = await apiClient.put(`/quizzes/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/quizzes/${id}`);
  },
};
