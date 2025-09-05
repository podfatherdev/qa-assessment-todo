<!--
  UserItem Component
  
  A user management item component styled to match TodoItem. Features inline editing
  for user names (double-click to edit) and a role selector dropdown. Includes
  hover animations and visual role indicators.
  
  Props:
  - user: User - The user object to display and manage
  
  Events:
  - update-name: (userId: number, name: string) - Emitted when user name is changed
  - update-role: (userId: number, role: 'admin' | 'user') - Emitted when user role is changed
-->
<template>
  <div 
    class="group bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 animate-slide-up"
  >
    <div class="flex items-center gap-3">
      <!-- User avatar -->
      <div
        :class="[
          'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold',
          user.role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'
        ]"
      >
        {{ user.name.charAt(0) }}
      </div>

      <!-- User info with inline editing -->
      <div class="flex-1 min-w-0">
        <input
          v-if="editing"
          ref="editInput"
          v-model="editName"
          @blur="saveEdit"
          @keydown.enter="saveEdit"
          @keydown.escape="cancelEdit"
          class="w-full px-0 py-1 text-gray-900 bg-transparent border-0 border-b-2 border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 text-lg font-medium"
          data-testid="edit-user-input"
        />
        <div v-else @dblclick="startEdit" class="cursor-pointer select-none">
          <h3 
            class="font-medium text-gray-900 text-lg mb-1"
            data-testid="user-name"
          >
            {{ user.name }}
          </h3>
          <p class="text-sm text-gray-500 mb-1" data-testid="username">
            @{{ user.username }}
          </p>
          <span
            :class="[
              'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
              user.role === 'admin' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-blue-100 text-blue-800'
            ]"
            data-testid="user-role-badge"
          >
            {{ user.role }}
          </span>
        </div>
      </div>

      <!-- Role selector -->
      <div class="flex-shrink-0">
        <RoleSelector 
          :current-role="user.role"
          @role-change="changeRole"
        />
      </div>

      <!-- Action buttons (appear on hover) -->
      <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          v-if="!editing"
          @click="startEdit"
          class="p-1 text-gray-400 hover:text-blue-500 transition-colors duration-200"
          aria-label="Edit user name"
          data-testid="edit-user"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import RoleSelector from './RoleSelector.vue';
import type { User } from '../types/todo';

const props = defineProps<{
  user: User;
}>();

const emit = defineEmits<{
  (e: "update-name", userId: number, name: string): void;
  (e: "update-role", userId: number, role: 'admin' | 'user'): void;
}>();

const editing = ref(false);
const editName = ref(props.user.name);
const editInput = ref<HTMLInputElement | null>(null);

const startEdit = async () => {
  editing.value = true;
  editName.value = props.user.name;
  await nextTick();
  editInput.value?.focus();
  editInput.value?.select();
};

const saveEdit = () => {
  if (editName.value.trim() === '') {
    cancelEdit();
    return;
  }
  
  if (editName.value.trim() !== props.user.name) {
    emit('update-name', props.user.id, editName.value.trim());
  }
  
  editing.value = false;
};

const cancelEdit = () => {
  editing.value = false;
  editName.value = props.user.name;
};

const changeRole = (role: 'admin' | 'user') => {
  emit('update-role', props.user.id, role);
};
</script>