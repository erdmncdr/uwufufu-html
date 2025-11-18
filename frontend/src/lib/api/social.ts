import apiClient from './client';
import { CreateCommentDto, UpdateCommentDto, CommentWithUser } from '@uwufufu/shared';

export const socialApi = {
  // Likes
  likeQuiz: async (quizId: string) => {
    const response = await apiClient.post(`/social/quizzes/${quizId}/like`);
    return response.data;
  },

  unlikeQuiz: async (quizId: string) => {
    const response = await apiClient.delete(`/social/quizzes/${quizId}/like`);
    return response.data;
  },

  // Bookmarks
  bookmarkQuiz: async (quizId: string) => {
    const response = await apiClient.post(`/social/quizzes/${quizId}/bookmark`);
    return response.data;
  },

  unbookmarkQuiz: async (quizId: string) => {
    const response = await apiClient.delete(`/social/quizzes/${quizId}/bookmark`);
    return response.data;
  },

  // Comments
  getComments: async (quizId: string): Promise<CommentWithUser[]> => {
    const response = await apiClient.get(`/social/quizzes/${quizId}/comments`);
    return response.data;
  },

  createComment: async (data: CreateCommentDto) => {
    const response = await apiClient.post('/social/comments', data);
    return response.data;
  },

  updateComment: async (id: string, data: UpdateCommentDto) => {
    const response = await apiClient.put(`/social/comments/${id}`, data);
    return response.data;
  },

  deleteComment: async (id: string) => {
    await apiClient.delete(`/social/comments/${id}`);
  },
};
