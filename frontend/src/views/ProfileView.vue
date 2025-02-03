<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppMenu from '@/components/AppMenu.vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const authStore = useAuthStore()

const loading = ref(true)
const error = ref('')

const user = ref({
  firstName: '',
  lastName: '',
  login: '',
  role: '',
})

const fetchUserData = async () => {
  try {
    await authStore.getUserData()
    user.value = authStore.user
  } catch (err) {
    error.value = 'Не удалось загрузить данные пользователя'
  } finally {
    loading.value = false
  }
}

onMounted(fetchUserData)
</script>

<template>
  <AppMenu />
  <div class="card-wrapper">
    <app-card class="mt-4" style="width: 50rem">
      <template #title>Профиль</template>
      <template #content>
        <p class="mt-2"><strong>Имя:</strong> {{ user.firstName }}</p>
        <p class="mt-2"><strong>Фамилия:</strong> {{ user.lastName }}</p>
        <p class="mt-2"><strong>Логин:</strong> {{ user.login }}</p>
        <p class="mt-2"><strong>Роль:</strong> {{ user.role }}</p>
      </template>
    </app-card>
  </div>
</template>

<style scoped>
.card-wrapper {
  display: flex;
  justify-content: center;
}
</style>
