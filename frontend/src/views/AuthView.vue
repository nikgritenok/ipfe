<script setup lang="ts">
import { ref } from 'vue'
import AuthForm from '@/components/AuthForm.vue'
</script>

<template>
  <main>
    <div class="wrapper"><AuthForm /></div>
    >
  </main>
</template>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
