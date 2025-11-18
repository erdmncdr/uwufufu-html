import apiClient from './client';
import {
  WorldcupVoteDto,
  SmashOrPassVoteDto,
  QuizResults,
} from '@uwufufu/shared';

export const votesApi = {
  submitWorldcupVote: async (data: WorldcupVoteDto) => {
    const response = await apiClient.post('/votes/worldcup', data);
    return response.data;
  },

  submitSmashOrPassVote: async (data: SmashOrPassVoteDto) => {
    const response = await apiClient.post('/votes/smash-or-pass', data);
    return response.data;
  },

  getResults: async (quizId: string, lang?: string): Promise<QuizResults> => {
    const response = await apiClient.get(`/votes/results/${quizId}`, {
      params: { lang },
    });
    return response.data;
  },
};
