export type UserRole = 'user' | 'admin' | 'moderator';
export type Language = 'en' | 'tr';

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  role: UserRole;
  preferredLanguage: Language;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  preferredLanguage?: Language;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  preferredLanguage?: Language;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
