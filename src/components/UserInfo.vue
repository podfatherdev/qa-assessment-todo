<template>
  <div class="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="flex items-center gap-3">
      <div
        :class="[
          'w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold',
          user.role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'
        ]"
      >
        {{ user.name.charAt(0) }}
      </div>
      <div>
        <h3 class="font-semibold text-gray-900" data-testid="user-name">
          {{ user.name }}
        </h3>
      </div>
    </div>

    <button
      @click="logout"
      class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
      data-testid="logout-button"
    >
      Log out
    </button>
  </div>
</template>

<script setup lang="ts">
import type { User } from '../types/todo';

const props = defineProps<{
    user: User;
}>();

const emit = defineEmits<{
    (e: "logout"): void;
}>();

const logout = () => {
  emit('logout');
};
</script>
