import type { AuthResponse, User } from '../types/todo';

const API_BASE_URL = '/api';

export class AuthService {
  private static TOKEN_KEY = 'todo_auth_token';

  static async login(username: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const authData = await response.json();
      this.setToken(authData.token);
      return authData;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  static async getCurrentUser(): Promise<User> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to get user info');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }

  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}