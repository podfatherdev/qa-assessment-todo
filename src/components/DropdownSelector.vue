<!--
  DropdownSelector Component
  
  A reusable dropdown selector component with a circular indicator button.
  Can be used for user assignment, role selection, or any other selection scenarios.
  
  Props:
  - currentValue: string | number - The current selected value
  - options: Array<{value: any, label: string, color?: string, initial?: string, disabled?: boolean}> - Available options
  - title: string - Tooltip text for the indicator button
  - dropdownTitle: string - Title text shown in the dropdown
  - size: 'sm' | 'md' | 'lg' - Size of the indicator button
  - disabled: boolean - Whether the selector is disabled
  
  Events:
  - change: (value: any) - Emitted when a new option is selected
-->
<template>
  <div class="relative">
    <button
      @click="toggleSelector"
      :class="[
        'flex-shrink-0 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-200 hover:scale-110',
        getSizeClasses(size),
        getOptionColor(currentValue),
        disabled && 'opacity-50 cursor-not-allowed'
      ]"
      :title="title"
      :disabled="disabled"
      :data-testid="`${testIdPrefix}-indicator`"
    >
      {{ getOptionInitial(currentValue) }}
    </button>

    <!-- Selector dropdown -->
    <div
      v-if="showSelector && !disabled"
      :class="[
        'absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10',
        dropdownWidthClass
      ]"
      :data-testid="`${testIdPrefix}-dropdown`"
    >
      <div class="p-2">
        <p class="text-xs text-gray-500 mb-2 font-medium">{{ dropdownTitle }}</p>
        <button
          v-for="option in options"
          :key="option.value"
          @click="selectOption(option.value)"
          :class="[
            'w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors duration-200',
            option.value === currentValue || option.disabled
              ? 'bg-gray-100 text-gray-500 cursor-default'
              : 'hover:bg-gray-50 text-gray-700'
          ]"
          :disabled="option.value === currentValue || option.disabled"
          :data-testid="`${testIdPrefix}-option`"
        >
          <div 
            :class="[
              'w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-semibold',
              option.color || getOptionColor(option.value)
            ]"
          >
            {{ option.initial || getOptionInitial(option.value) }}
          </div>
          <span>{{ option.label }}</span>
          <span v-if="option.value === currentValue" class="text-xs text-gray-400 ml-auto">(current)</span>
        </button>
      </div>
    </div>

    <!-- Click outside overlay to close selector -->
    <div
      v-if="showSelector && !disabled"
      class="fixed inset-0 z-5"
      @click="closeSelector"
      :data-testid="`${testIdPrefix}-overlay`"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Option {
  value: any;
  label: string;
  color?: string;
  initial?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<{
  currentValue: any;
  options: Option[];
  title?: string;
  dropdownTitle?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  testIdPrefix?: string;
  dropdownWidth?: 'sm' | 'md' | 'lg';
}>(), {
  title: '',
  dropdownTitle: 'Select:',
  size: 'md',
  disabled: false,
  testIdPrefix: 'selector',
  dropdownWidth: 'md'
});

const emit = defineEmits<{
  (e: "change", value: any): void;
}>();

const showSelector = ref(false);

// Size classes for the indicator button
const getSizeClasses = (size: string) => {
  switch (size) {
    case 'sm':
      return 'w-6 h-6 text-xs';
    case 'lg':
      return 'w-10 h-10 text-base';
    default:
      return 'w-8 h-8 text-sm';
  }
};

// Dropdown width classes
const dropdownWidthClass = computed(() => {
  switch (props.dropdownWidth) {
    case 'sm':
      return 'min-w-[120px]';
    case 'lg':
      return 'min-w-[200px]';
    default:
      return 'min-w-[160px]';
  }
});

// Get color for a given option value
const getOptionColor = (value: any) => {
  const option = props.options.find(opt => opt.value === value);
  if (option?.color) {
    return option.color;
  }
  
  // Default color logic based on common patterns
  if (typeof value === 'string') {
    if (value === 'admin') return 'bg-purple-500';
    if (value === 'user') return 'bg-blue-500';
    if (value === 'moderator') return 'bg-green-500';
  }
  
  // Default color
  return 'bg-gray-500';
};

// Get initial letter for a given option value
const getOptionInitial = (value: any) => {
  const option = props.options.find(opt => opt.value === value);
  if (option?.initial) {
    return option.initial;
  }
  
  // Default initial logic
  if (typeof value === 'string') {
    return value.charAt(0).toUpperCase();
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  
  return '?';
};

const toggleSelector = () => {
  if (props.disabled) return;
  showSelector.value = !showSelector.value;
};

const closeSelector = () => {
  showSelector.value = false;
};

const selectOption = (value: any) => {
  if (value === props.currentValue) return;
  emit('change', value);
  showSelector.value = false;
};
</script>