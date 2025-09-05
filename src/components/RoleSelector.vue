<template>
  <div class="relative">
    <button
      @click="toggleRoleSelector"
      :class="[
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold transition-all duration-200 hover:scale-110',
        getRoleColor(currentRole)
      ]"
      :title="`Click to change role from ${currentRole}`"
      data-testid="role-indicator"
    >
      {{ getRoleInitial(currentRole) }}
    </button>

    <!-- Role selector dropdown -->
    <div
      v-if="showSelector"
      class="absolute top-10 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]"
      data-testid="role-selector"
    >
      <div class="p-2">
        <p class="text-xs text-gray-500 mb-2 font-medium">Change role to:</p>
        <button
          v-for="role in availableRoles"
          :key="role.value"
          @click="changeRole(role.value)"
          :class="[
            'w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors duration-200',
            role.value === currentRole
              ? 'bg-gray-100 text-gray-500 cursor-default'
              : 'hover:bg-gray-50 text-gray-700'
          ]"
          :disabled="role.value === currentRole"
          data-testid="role-option"
        >
          <div
            :class="[
              'w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-semibold',
              getRoleColor(role.value)
            ]"
          >
            {{ getRoleInitial(role.value) }}
          </div>
          <span>{{ role.label }}</span>
          <span v-if="role.value === currentRole" class="text-xs text-gray-400 ml-auto">(current)</span>
        </button>
      </div>
    </div>

    <!-- Click outside overlay to close selector -->
    <div
      v-if="showSelector"
      class="fixed inset-0 z-5"
      @click="closeRoleSelector"
      data-testid="selector-overlay"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  currentRole: 'admin' | 'user';
}>();

const emit = defineEmits<{
  (e: "role-change", role: 'admin' | 'user'): void;
}>();

const showSelector = ref(false);

const availableRoles = [
  { value: 'admin' as const, label: 'Admin' },
  { value: 'user' as const, label: 'User' }
];

const getRoleColor = (role: 'admin' | 'user') => {
  return role === 'admin' ? 'bg-purple-500' : 'bg-blue-500';
};

const getRoleInitial = (role: 'admin' | 'user') => {
  return role === 'admin' ? 'A' : 'U';
};

const toggleRoleSelector = () => {
  showSelector.value = !showSelector.value;
};

const closeRoleSelector = () => {
  showSelector.value = false;
};

const changeRole = (role: 'admin' | 'user') => {
  if (role === props.currentRole) return;
  emit('role-change', role);
  showSelector.value = false;
};
</script>
