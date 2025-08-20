<template>
  <div class="flex items-center justify-between mb-6">
    <div class="flex items-center gap-4">
      <p class="text-sm text-gray-600" data-testid="todo-count">
        {{ activeCount }} {{ activeCount === 1 ? 'item' : 'items' }} left
      </p>
      
      <div class="flex bg-gray-100 rounded-lg p-1">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="emit('filter-change', filter.value)"
          :class="[
            'px-3 py-1 rounded-md text-sm font-medium transition-all duration-200',
            currentFilter === filter.value
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          ]"
          :data-testid="`filter-${filter.value}`"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <button
      v-if="hasCompleted"
      @click="emit('clear-completed')"
      class="text-sm text-gray-600 hover:text-red-600 transition-colors duration-200"
      data-testid="clear-completed"
    >
      Clear completed
    </button>
  </div>
</template>

<script setup lang="ts">
import type { FilterType } from '../types/todo';

interface Props {
  currentFilter: FilterType;
  activeCount: number;
  hasCompleted: boolean;
}

interface Emits {
  (e: 'filter-change', filter: FilterType): void;
  (e: 'clear-completed'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const filters = [
  { value: 'all' as FilterType, label: 'All' },
  { value: 'active' as FilterType, label: 'Active' },
  { value: 'completed' as FilterType, label: 'Completed' },
];
</script>