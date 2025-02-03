<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const logout = () => {
  console.log('logout')
  authStore.logout()
}

interface IMenuItem {
  label: string
  icon: string
  path: string
}

const items = ref<IMenuItem[]>([
  {
    label: 'Домой',
    icon: 'pi pi-home',
    path: '/',
  },
  {
    label: 'Профиль',
    icon: 'pi pi-user',
    path: '/profile',
  },
])
</script>

<template>
  <div class="card">
    <app-menu :model="items">
      <template #item="{ item, props }">
        <router-link class="flex align-items-center" :to="item.path" v-bind="props.action">
          <span :class="item.icon" class="p-menuitem-icon"></span>
          <span>{{ item.label }}</span>
        </router-link>
      </template>
      <template #end>
        <div @click="logout" class="flex align-items-center menu-exit custom-end-item">
          <span class="pi pi-sign-out p-menuitem-icon"></span>
          <span class="ml-2">Выход</span>
        </div>
      </template>
    </app-menu>
  </div>
</template>

<style scoped>
.custom-end-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-radius: var(--p-content-border-radius);
  transition:
    background-color 0.2s,
    box-shadow 0.2s;
}
.custom-end-item:hover {
  background-color: var(--p-navigation-item-focus-background);
}
</style>
