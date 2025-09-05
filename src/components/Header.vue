<template>
  <header class="text-center mb-8">
    <h1 class="text-4xl font-bold text-gray-900 mb-2 animate-fade-in">
      {{ title }}
    </h1>
    <p v-if="subtitle" class="text-gray-600" v-html="subtitle">
    </p>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>