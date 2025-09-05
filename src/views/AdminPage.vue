<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <Header
        title="Admin Panel"
        subtitle="Manage users and their roles"
      />

      <Panel>
        <div v-if="loading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>

        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p class="text-red-700">{{ error }}</p>
          <button
            @click="fetchUsers"
            class="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>

        <div v-else class="space-y-3">
          <div class="mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Users ({{ users.length }})</h2>
          </div>

          <UserItem
            v-for="user in users"
            :key="user.id"
            :user="user"
            @update-name="updateUserName"
            @update-role="updateUserRole"
          />
        </div>
      </Panel>

      <!-- Success notification -->
      <div v-if="successMessage" class="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-md p-4 shadow-lg">
        <p class="text-green-700">{{ successMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { AdminService } from '../services/adminService';
import Header from '../components/Header.vue';
import Panel from '../components/Panel.vue';
import UserItem from '../components/UserItem.vue';
import type { User } from '../types/todo';

const users = ref<User[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const fetchUsers = async () => {
  loading.value = true;
  error.value = null;

  try {
    users.value = await AdminService.getAllUsers();
  } catch (err) {
    error.value = 'Failed to load users. Please try again.';
    console.error('Error fetching users:', err);
  } finally {
    loading.value = false;
  }
};

const updateUserName = async (userId: number, name: string) => {
  try {
    const updatedUser = await AdminService.updateUser(userId, { name });

    // Update the user in our local list
    const userIndex = users.value.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users.value[userIndex] = updatedUser;
    }

    showSuccessMessage('User name updated successfully!');
  } catch (err) {
    error.value = 'Failed to update user name. Please try again.';
    console.error('Error updating user name:', err);
  }
};

const updateUserRole = async (userId: number, role: 'admin' | 'user') => {
  try {
    const updatedUser = await AdminService.updateUser(userId, { role });

    // Update the user in our local list
    const userIndex = users.value.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users.value[userIndex] = updatedUser;
    }

    showSuccessMessage(`User role changed to ${role} successfully!`);
  } catch (err) {
    error.value = 'Failed to update user role. Please try again.';
    console.error('Error updating user role:', err);
  }
};

const showSuccessMessage = (message: string) => {
  successMessage.value = message;
  setTimeout(() => {
    successMessage.value = null;
  }, 3000);
};

onMounted(() => {
  fetchUsers();
});
</script>
