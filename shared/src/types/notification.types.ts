export type NotificationType =
  | 'quiz_liked'
  | 'quiz_commented'
  | 'comment_replied'
  | 'quiz_featured'
  | 'user_followed';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  payload: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}

export interface NotificationPayload {
  quiz_liked: {
    quizId: string;
    quizTitle: { en: string; tr: string };
    likedByUsername: string;
  };
  quiz_commented: {
    quizId: string;
    quizTitle: { en: string; tr: string };
    commentedByUsername: string;
    commentPreview: string;
  };
  comment_replied: {
    quizId: string;
    commentId: string;
    repliedByUsername: string;
    replyPreview: string;
  };
  quiz_featured: {
    quizId: string;
    quizTitle: { en: string; tr: string };
  };
  user_followed: {
    followedByUserId: string;
    followedByUsername: string;
  };
}
