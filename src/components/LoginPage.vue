<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          BugDo
        </h1>
        <p class="text-gray-600 mb-8">
          Please log in to continue
        </p>
      </div>

      <div class="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div class="text-center">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">
            Choose Your Role
          </h2>
        </div>

        <div class="space-y-4">
          <button
            @click="loginAs('user')"
            :disabled="loading"
            class="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            data-testid="login-user"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Log in as User
          </button>

          <button
            @click="loginAs('admin')"
            :disabled="loading"
            class="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            data-testid="login-admin"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Log in as Admin
          </button>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="text-sm text-gray-600 space-y-2">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span><strong>Admin:</strong> Can see and manage all todos</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span><strong>User:</strong> Can only see and manage their own todos</span>
            </div>
          </div>
        </div>

        <div v-if="error" class="text-center">
          <p class="text-red-600 text-sm" data-testid="login-error">
            {{ error }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { AuthService } from '../services/authService';

const emit = defineEmits<{
    (e: "login-success"): void;
}>();

const loading = ref(false);
const error = ref('');

const loginAs = async (role: 'admin' | 'user') => {
  loading.value = true;
  error.value = '';

  try {
    await AuthService.login(role);
    emit('login-success');
  } catch (err) {
    error.value = 'Login failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
