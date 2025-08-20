import type { Todo } from '../types/todo';
import { AuthService } from './authService';

const API_BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = AuthService.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export class TodoService {
  static async getAllTodos(): Promise<Todo[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  }

  static async createTodo(text: string): Promise<Todo> {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create todo');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  }

  static async updateTodo(id: number, updates: Partial<Pick<Todo, 'text' | 'completed'>>): Promise<Todo> {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  }

  static async deleteTodo(todo: Todo): Promise<void> {
    try {
      const encodedText = encodeURI(todo.text)
      const response = await fetch(`${API_BASE_URL}/todos/${encodedText}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        console.error('Bad delete response', response)
        throw new Error('Failed to delete todo');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }

  static async clearCompleted(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/completed`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to clear completed todos');
      }
    } catch (error) {
      console.error('Error clearing completed todos:', error);
      throw error;
    }
  }

  static async reassignTodo(id: number, userId: number): Promise<Todo> {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}/reassign`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to reassign todo');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error reassigning todo:', error);
      throw error;
    }
  }
}