<!--
  RoleSelector Component
  
  A role selector component that uses the base DropdownSelector for changing
  between 'admin' and 'user' roles.
  
  Props:
  - currentRole: 'admin' | 'user' - The current role to display
  
  Events:
  - role-change: (role: 'admin' | 'user') - Emitted when a new role is selected
-->
<template>
  <DropdownSelector
    :current-value="currentRole"
    :options="roleOptions"
    :title="`Click to change role from ${currentRole}`"
    dropdown-title="Change role to:"
    size="md"
    test-id-prefix="role"
    dropdown-width="sm"
    @change="handleRoleChange"
  />
</template>

<script setup lang="ts">
import DropdownSelector from './DropdownSelector.vue';

const props = defineProps<{
  currentRole: 'admin' | 'user';
}>();

const emit = defineEmits<{
  (e: "role-change", role: 'admin' | 'user'): void;
}>();

const roleOptions = [
  { 
    value: 'admin', 
    label: 'Admin', 
    color: 'bg-purple-500', 
    initial: 'A' 
  },
  { 
    value: 'user', 
    label: 'User', 
    color: 'bg-blue-500', 
    initial: 'U' 
  }
];

const handleRoleChange = (role: 'admin' | 'user') => {
  emit('role-change', role);
};
</script>