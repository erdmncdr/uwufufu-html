export type VoteAction = 'smash' | 'pass' | 'select';

export interface Vote {
  id: string;
  quizId: string;
  quizItemId: string;
  userId?: string;
  ipHash: string;
  createdAt: Date;
}

export interface WorldcupVoteDto {
  quizId: string;
  itemAId: string;
  itemBId: string;
  winnerId: string;
  sessionId?: string;
}

export interface SmashOrPassVoteDto {
  quizId: string;
  itemId: string;
  action: 'smash' | 'pass';
}

export interface PersonalityQuizAnswerDto {
  quizId: string;
  questionId: string;
  answerId: string;
}

export interface QuizResults {
  quizId: string;
  totalVotes: number;
  itemResults: ItemResult[];
}

export interface ItemResult {
  itemId: string;
  label: {
    en: string;
    tr: string;
  };
  imageUrl: string;
  voteCount: number;
  percentage: number;
  rank?: number;
}

export interface WorldcupMatchup {
  id: string;
  quizId: string;
  roundNumber: number;
  itemAId: string;
  itemBId: string;
  winnerItemId?: string;
}

export interface WorldcupSession {
  sessionId: string;
  quizId: string;
  currentRound: number;
  totalRounds: number;
  matchups: WorldcupMatchup[];
  winnerId?: string;
}
