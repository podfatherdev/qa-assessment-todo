<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8 max-w-2xl">
      <Header>
        BugDo
        <template #subtitle>
          I got a whole lotta <em>bugs</em> todo
        </template>
      </Header>

      <UserInfo v-if="currentUser" :user="currentUser" @logout="handleLogout" />

      <Panel>
        <TodoInput @add-todo="addTodo" />

        <TodoFilter
          :current-filter="currentFilter"
          :active-count="activeCount"
          :has-completed="hasCompleted"
          @filter-change="setFilter"
          @clear-completed="clearCompleted"
        />

        <div v-if="loading" class="text-center py-8" data-testid="loading">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p class="mt-2 text-gray-600">Loading todos...</p>
        </div>

        <div v-else-if="error" class="text-center py-8" data-testid="error">
          <div class="text-red-500 mb-4">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-red-600 font-medium">{{ error }}</p>
          <button
            @click="loadTodos"
            class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>

        <div v-else>
          <div v-if="filteredTodos.length === 0" class="text-center py-8" data-testid="empty-state">
            <div class="text-gray-400 mb-4">
              <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-gray-600 text-lg">
              {{ emptyStateMessage }}
            </p>
          </div>

          <div v-else class="space-y-3" data-testid="todo-list">
            <TodoItem
              v-for="todo in filteredTodos"
              :key="todo.id"
              :todo="todo"
              :show-user-indicator="currentUser?.role === 'admin'"
              :current-user-role="currentUser?.role"
              @toggle="toggleTodo"
              @edit="editTodo"
              @delete="deleteTodo"
              @reassign="reassignTodo"
            />
          </div>
        </div>
      </Panel>

      <footer class="text-center mt-8 text-gray-500 text-sm">
        Double-click to edit a todo
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header from '../components/Header.vue';
import Panel from '../components/Panel.vue';
import UserInfo from '../components/UserInfo.vue';
import TodoInput from '../components/TodoInput.vue';
import TodoItem from '../components/TodoItem.vue';
import TodoFilter from '../components/TodoFilter.vue';
import { TodoService } from '../services/todoService';
import { AuthService } from '../services/authService';
import type { Todo, FilterType, User } from '../types/todo';

const router = useRouter();
const todos = ref<Todo[]>([]);
const currentFilter = ref<FilterType>('all');
const loading = ref(false);
const error = ref('');
const currentUser = ref<User | null>(null);

const filteredTodos = computed(() => {
  switch (currentFilter.value) {
    case 'active':
      return todos.value.filter(todo => !todo.completed);
    case 'completed':
      return todos.value.filter(todo => todo.completed);
    default:
      return todos.value;
  }
});

const activeCount = computed(() =>
  todos.value.filter(todo => !todo.completed).length
);

const hasCompleted = computed(() =>
  todos.value.some(todo => todo.completed)
);

const emptyStateMessage = computed(() => {
  if (todos.value.length === 0) {
    return 'No todos yet. Add one above!';
  }

  switch (currentFilter.value) {
    case 'active':
      return 'No active todos. Great job!';
    case 'completed':
      return 'No completed todos yet.';
    default:
      return 'No todos to show.';
  }
});

const loadCurrentUser = async () => {
  try {
    currentUser.value = await AuthService.getCurrentUser();
  } catch (err) {
    // Token might be expired or invalid
    AuthService.logout();
    router.push({ name: 'login' });
  }
};

const handleLogout = () => {
  AuthService.logout();
  router.push({ name: 'login' });
};

const loadTodos = async () => {
  loading.value = true;
  error.value = '';

  try {
    todos.value = await TodoService.getAllTodos();
  } catch (err) {
    error.value = 'Failed to load todos. Please check if the server is running.';
  } finally {
    loading.value = false;
  }
};

const addTodo = async (text: string) => {
  try {
    const newTodo = await TodoService.createTodo(text);
    todos.value.push(newTodo);
  } catch (err) {
    error.value = 'Failed to add todo. Please try again.';
  }
};

const toggleTodo = async (id: number) => {
  const todo = todos.value.find(t => t.id === id);
  if (!todo) return;

  try {
    const updatedTodo = await TodoService.updateTodo(id, {
      completed: !todo.completed
    });

    const index = todos.value.findIndex(t => t.id === id);
    todos.value[index] = updatedTodo;
  } catch (err) {
    error.value = 'Failed to update todo. Please try again.';
  }
};

const editTodo = async (id: number, text: string) => {
  try {
    const updatedTodo = await TodoService.updateTodo(id, { text });

    const index = todos.value.findIndex(t => t.id === id);
    todos.value[index] = updatedTodo;
  } catch (err) {
    error.value = 'Failed to update todo. Please try again.';
  }
};

const deleteTodo = async (todo: Todo) => {
  try {
    await TodoService.deleteTodo(todo);
    todos.value = todos.value.filter(t => t.id !== todo.id);
  } catch (err) {
    error.value = 'Failed to delete todo. Please try again.';
  }
};

const clearCompleted = async () => {
  try {
    await TodoService.clearCompleted();
    todos.value = todos.value.filter(t => !t.completed);
  } catch (err) {
    error.value = 'Failed to clear completed todos. Please try again.';
  }
};

const reassignTodo = async (id: number, userId: number) => {
  try {
    const updatedTodo = await TodoService.reassignTodo(id, userId);

    const index = todos.value.findIndex(t => t.id === id);
    todos.value[index] = updatedTodo;
  } catch (err) {
    error.value = 'Failed to reassign todo. Please try again.';
  }
};

const setFilter = (filter: FilterType) => {
  currentFilter.value = filter;
};

onMounted(async () => {
  await loadCurrentUser();
  loadTodos();
});
</script>
