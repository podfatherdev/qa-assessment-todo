<template>
  <div 
    class="group bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 animate-slide-up"
    :class="{ 'opacity-75': todo.completed }"
  >
    <div class="flex items-center gap-3">
      <button
        @click="toggleComplete"
        :class="[
          'flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200',
          todo.completed 
            ? 'bg-green-500 border-green-500 text-white' 
            : 'border-gray-300 hover:border-green-400'
        ]"
        :aria-label="todo.completed ? 'Mark as incomplete' : 'Mark as complete'"
        data-testid="toggle-todo"
      >
        <svg 
          v-if="todo.completed" 
          class="w-3 h-3 mx-auto" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fill-rule="evenodd" 
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
            clip-rule="evenodd" 
          />
        </svg>
      </button>

      
      <div class="flex-0 min-w-0">
        <input
          v-if="editing"
          ref="editInput"
          v-model="editText"
          @blur="saveEdit"
          @keydown.enter="saveEdit"
          @keydown.escape="cancelEdit"
          class="w-full px-0 py-1 text-gray-900 bg-transparent border-0 border-b-2 border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600"
          data-testid="edit-todo-input"
        />
        <div v-else @dblclick="startEdit" class="cursor-pointer select-none">
          <p 
            :class="[
              'text-gray-900 mb-1',
              todo.completed && 'line-through text-gray-500'
            ]"
            data-testid="todo-text"
            v-html="todo.text"
          >
          </p>
          <p class="text-xs text-gray-400" data-testid="todo-timestamp">
            Updated {{ formatTimestamp(todo.updatedAt) }}
          </p>
        </div>
      </div>

      
      <!-- User assignment indicator -->
      <div class="flex-1 self-baseline">
        <div class="relative">
          <button
            @click="toggleUserSelector"
            :class="[
              'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold transition-all duration-200 hover:scale-110',
              getUserColor(todo.userId)
            ]"
            :title="canReassign ? `Click to reassign from ${getUserName(todo.userId)}` : getUserName(todo.userId)"
            data-testid="user-indicator"
            :disabled="!canReassign"
          >
            {{ getUserInitial(todo.userId) }}
          </button>

          <!-- User selector dropdown -->
          <div
            v-if="showSelector"
            class="absolute top-8 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px]"
            data-testid="user-selector"
          >
            <div class="p-2">
              <p class="text-xs text-gray-500 mb-2 font-medium">Reassign to:</p>
              <button
                v-for="user in availableUsers"
                :key="user.id"
                @click="reassignTask(user.id)"
                :class="[
                  'w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors duration-200',
                  user.id === todo.userId 
                    ? 'bg-gray-100 text-gray-500 cursor-default' 
                    : 'hover:bg-gray-50 text-gray-700'
                ]"
                :disabled="user.id === todo.userId"
                data-testid="user-option"
              >
                <div 
                  :class="[
                    'w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-semibold',
                    getUserColor(user.id)
                  ]"
                >
                  {{ getUserInitial(user.id) }}
                </div>
                <span>{{ user.name }}</span>
                <span v-if="user.id === todo.userId" class="text-xs text-gray-400 ml-auto">(current)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          v-if="!editing"
          @click="startEdit"
          class="p-1 text-gray-400 hover:text-blue-500 transition-colors duration-200"
          aria-label="Edit todo"
          data-testid="edit-todo"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          @click="deleteTodo"
          class="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
          aria-label="Delete todo"
          data-testid="delete-todo"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Click outside overlay to close selector -->
    <div
      v-if="showSelector"
      class="fixed inset-0 z-5"
      @click="closeUserSelector"
      data-testid="selector-overlay"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from 'vue';
import type { Todo } from '../types/todo';

interface Props {
  todo: Todo;
  showUserIndicator?: boolean;
  currentUserRole?: string;
}

interface Emits {
  (e: 'toggle', id: number): void;
  (e: 'edit', id: number, text: string): void;
  (e: 'delete', id: number): void;
  (e: 'reassign', id: number, userId: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const editing = ref(false);
const editText = ref(props.todo.text);
const editInput = ref<HTMLInputElement | null>(null);
const showSelector = ref(false);

// User mapping for display purposes
const userMap = {
  1: { name: 'Admin User', initial: 'A', color: 'bg-purple-500' },
  2: { name: 'Regular User', initial: 'U', color: 'bg-blue-500' }
};

const availableUsers = [
  { id: 1, name: 'Admin User' },
  { id: 2, name: 'Regular User' }
];

const canReassign = computed(() => {
  return props.currentUserRole === 'admin';
});

const getUserColor = (userId: number) => {
  return userMap[userId as keyof typeof userMap]?.color || 'bg-gray-500';
};

const getUserName = (userId: number) => {
  return userMap[userId as keyof typeof userMap]?.name || 'Unknown User';
};

const getUserInitial = (userId: number) => {
  return userMap[userId as keyof typeof userMap]?.initial || '?';
};

const toggleUserSelector = () => {
  if (!canReassign.value) return;
  showSelector.value = !showSelector.value;
};

const closeUserSelector = () => {
  showSelector.value = false;
};

const reassignTask = (userId: number) => {
  if (userId === props.todo.userId) return;
  emit('reassign', props.todo.id, userId);
  showSelector.value = false;
};
const toggleComplete = () => {
  emit('toggle', props.todo.id);
};

const startEdit = async () => {
  editing.value = true;
  editText.value = props.todo.text;
  await nextTick();
  editInput.value?.focus();
  editInput.value?.select();
};

const saveEdit = () => {
  if (editText.value.trim() === '') {
    cancelEdit();
    return;
  }
  
  if (editText.value.trim() !== props.todo.text) {
    emit('edit', props.todo.id, editText.value.trim());
  }
  
  editing.value = false;
};

const cancelEdit = () => {
  editing.value = false;
  editText.value = props.todo.text;
};

const deleteTodo = () => {
  emit('delete', props.todo);
};

const formatTimestamp = (timestamp: Date) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSecs = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSecs < 5) {
    return 'just now';
  } else if (diffInSecs < 60) {
    return `${diffInSecs} sec${diffInSecs === 1 ? '' : 's'} ago`;
  } else if (diffInSecs < 60 * 60) {
    const mins = Math.floor(diffInSecs / 60)
    return `${mins} min${mins === 1 ? '' : 's'} ago`;
  } else if (diffInSecs < 1440 * 60) {
    const hours = Math.floor(diffInSecs / (60 * 60));
    return `${hours} hr${hours === 1 ? '' : 's'} ago`;
  } else {
    const days = Math.floor(diffInSecs / (1440 * 60));
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
};
</script>