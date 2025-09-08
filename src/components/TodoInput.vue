<template>
  <div class="mb-6">
    <form @submit.prevent="addTodo" class="relative">
      <input
        v-model="newTodo"
        type="text"
        placeholder="What needs to be done?"
        class="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        :class="{ 'border-red-300 focus:ring-red-500': error }"
        data-testid="new-todo-input"
      />
      <button
        type="submit"
        :disabled="!newTodo.trim()"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        data-testid="add-todo-button"
      >
        Add
      </button>
    </form>
    <p v-if="error" class="mt-2 text-sm text-red-600" data-testid="todo-error">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
    (e: "add-todo", text: string): void;
}>();

defineExpose({
  clearInput
});

const newTodo = ref('');
const error = ref('');

const addTodo = () => {
  const text = newTodo.value.trim();

  if (!text) {
    error.value = 'Please enter a todo item';
    return;
  }

  if (text.length > 60) {
    error.value = 'Todo item must be less than 200 characters';
    return;
  }

  error.value = '';
  emit('add-todo', text);
};

function clearInput () {
  newTodo.value = '';
}
</script>
