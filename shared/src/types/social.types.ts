export interface Like {
  id: string;
  quizId: string;
  userId: string;
  createdAt: Date;
}

export interface Bookmark {
  id: string;
  quizId: string;
  userId: string;
  createdAt: Date;
}

export interface Comment {
  id: string;
  quizId: string;
  userId: string;
  parentCommentId?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentWithUser extends Comment {
  user: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  replies?: CommentWithUser[];
}

export interface CreateCommentDto {
  quizId: string;
  content: string;
  parentCommentId?: string;
}

export interface UpdateCommentDto {
  content: string;
}
