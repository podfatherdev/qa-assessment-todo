<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
      <p class="text-gray-600">Manage users and their roles</p>
    </div>

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

    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">Users</h2>
      </div>
      
      <div class="divide-y divide-gray-200">
        <div 
          v-for="user in users" 
          :key="user.id" 
          class="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
        >
          <div class="flex items-center gap-4">
            <div
              :class="[
                'w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold',
                user.role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'
              ]"
            >
              {{ user.name.charAt(0) }}
            </div>
            
            <div class="flex-1">
              <div v-if="editingUser?.id === user.id" class="space-y-2">
                <input
                  v-model="editForm.name"
                  type="text"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="User name"
                />
                <select
                  v-model="editForm.role"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div v-else>
                <h3 class="font-medium text-gray-900">{{ user.name }}</h3>
                <p class="text-sm text-gray-500">@{{ user.username }}</p>
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  ]"
                >
                  {{ user.role }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <div v-if="editingUser?.id === user.id" class="flex gap-2">
              <button
                @click="saveUser"
                :disabled="saving"
                class="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ saving ? 'Saving...' : 'Save' }}
              </button>
              <button
                @click="cancelEdit"
                :disabled="saving"
                class="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            </div>
            
            <button
              v-else
              @click="startEdit(user)"
              class="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="successMessage" class="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-md p-4 shadow-lg">
      <p class="text-green-700">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { AdminService } from '../services/adminService';
import type { User } from '../types/todo';

const users = ref<User[]>([]);
const loading = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const editingUser = ref<User | null>(null);
const editForm = ref({
  name: '',
  role: 'user' as 'admin' | 'user'
});

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

const startEdit = (user: User) => {
  editingUser.value = user;
  editForm.value = {
    name: user.name,
    role: user.role
  };
};

const cancelEdit = () => {
  editingUser.value = null;
  editForm.value = {
    name: '',
    role: 'user'
  };
};

const saveUser = async () => {
  if (!editingUser.value) return;
  
  saving.value = true;
  
  try {
    const updates: { name?: string; role?: 'admin' | 'user' } = {};
    
    if (editForm.value.name !== editingUser.value.name) {
      updates.name = editForm.value.name;
    }
    
    if (editForm.value.role !== editingUser.value.role) {
      updates.role = editForm.value.role;
    }
    
    if (Object.keys(updates).length > 0) {
      const updatedUser = await AdminService.updateUser(editingUser.value.id, updates);
      
      // Update the user in our local list
      const userIndex = users.value.findIndex(u => u.id === updatedUser.id);
      if (userIndex !== -1) {
        users.value[userIndex] = updatedUser;
      }
      
      showSuccessMessage('User updated successfully!');
    }
    
    cancelEdit();
  } catch (err) {
    error.value = 'Failed to update user. Please try again.';
    console.error('Error updating user:', err);
  } finally {
    saving.value = false;
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