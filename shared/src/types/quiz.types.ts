import { Language } from './user.types';

export type QuizType = 'worldcup' | 'personality' | 'smash_or_pass' | 'vs' | 'poll';
export type QuizVisibility = 'public' | 'unlisted' | 'private';
export type QuizSortBy = 'trending' | 'newest' | 'most_played' | 'most_liked';

export interface I18nField {
  en: string;
  tr: string;
}

export interface Quiz {
  id: string;
  slug: string;
  type: QuizType;
  title: I18nField;
  description: I18nField;
  coverImageUrl?: string;
  categoryId: string;
  createdById: string;
  visibility: QuizVisibility;
  isNSFW: boolean;
  playCount: number;
  likeCount: number;
  bookmarkCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizItem {
  id: string;
  quizId: string;
  label: I18nField;
  imageUrl: string;
  orderIndex: number;
  extraMeta?: Record<string, any>;
}

export interface Category {
  id: string;
  slug: string;
  name: I18nField;
  description: I18nField;
  icon?: string;
}

export interface Tag {
  id: string;
  slug: string;
  name: I18nField;
}

export interface CreateQuizDto {
  type: QuizType;
  title: I18nField;
  description: I18nField;
  coverImageUrl?: string;
  categoryId: string;
  tagIds?: string[];
  visibility?: QuizVisibility;
  isNSFW?: boolean;
  items: CreateQuizItemDto[];
}

export interface CreateQuizItemDto {
  label: I18nField;
  imageUrl: string;
  orderIndex: number;
  extraMeta?: Record<string, any>;
}

export interface UpdateQuizDto {
  title?: I18nField;
  description?: I18nField;
  coverImageUrl?: string;
  categoryId?: string;
  tagIds?: string[];
  visibility?: QuizVisibility;
  isNSFW?: boolean;
}

export interface QuizListQuery {
  page?: number;
  limit?: number;
  sort?: QuizSortBy;
  category?: string;
  tag?: string;
  type?: QuizType;
  search?: string;
  lang?: Language;
}

export interface QuizWithRelations extends Quiz {
  category: Category;
  tags: Tag[];
  creator: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  items: QuizItem[];
  isLikedByUser?: boolean;
  isBookmarkedByUser?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
