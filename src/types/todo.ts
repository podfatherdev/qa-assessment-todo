export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  updatedAt: Date;
  userId: number;
}

export type FilterType = 'all' | 'active' | 'completed';

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}