<template>
  <header class="text-center mb-8">
    <h1 class="text-4xl font-bold text-gray-900 mb-2 animate-fade-in">
      <slot />
    </h1>
    <p class="text-gray-600">
      <slot name="subtitle" />
    </p>
  </header>
</template>

<script setup lang="ts">
</script>
