<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppMenu from '@/components/AppMenu.vue'
import { useAuthStore } from '@/stores/auth'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

const authStore = useAuthStore()
const confirm = useConfirm()
const toast = useToast()

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

const deleteUser = async () => {
  try {
    await authStore.deleteUser()
  } catch (err) {
    error.value = 'Не удалось удалить пользователя'
  }
}

onMounted(fetchUserData)

const confirm1 = () => {
  confirm.require({
    message: 'Вы уверены, что хотите удалить свой профиль?',
    header: 'Удаление профиля',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Нет',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Удалить',
      severity: 'danger',
    },
    accept: () => {
      deleteUser()
      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 })
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
    },
  })
}
</script>

<template>
  <app-toast />
  <app-confirm />
  <AppMenu />
  <div class="card-wrapper">
    <app-card class="mt-4" style="width: 50rem">
      <template #title>Профиль</template>
      <template #content>
        <p class="mt-2"><strong>Имя:</strong> {{ user.firstName }}</p>
        <p class="mt-2"><strong>Фамилия:</strong> {{ user.lastName }}</p>
        <p class="mt-2"><strong>Логин:</strong> {{ user.login }}</p>
        <p class="mt-2"><strong>Роль:</strong> {{ user.role }}</p>
        <app-button
          @click="confirm1()"
          class="mt-4"
          label="Удалить аккаунт"
          severity="danger"
        ></app-button>
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
