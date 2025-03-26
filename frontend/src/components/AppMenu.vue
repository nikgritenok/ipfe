<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const logout = () => {
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
      <template #start>
        <svg
          width="80"
          height="40"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-2175.5490227034993 -1510.2720825195313 4609.597197752327 2280.1921142578126"
        >
          <desc>Created with Snap</desc>
          <defs></defs>
          <g>
            <g transform="matrix(18.5294,0,0,18.5294,-1960.996,-1295.719)">
              <g>
                <path
                  d="M78.4,66.5c-5.5,4.8-9.9,15.2-9.9,15.2s-6.9-11.4-12.9-15.3c-9.5-6.1-13.6-6.2-13.6-6.2V65c0,0,7.8,1.2,11.7,4.6   c8.2,7.1,14.8,18.5,14.8,18.5S74.4,75,80.1,70.5C88.1,64.3,95,65,95,65v-4.8C95,60.1,85.1,60.7,78.4,66.5z"
                  fill="#ffffff"
                  style=""
                ></path>
                <path
                  d="M42,80c-6.4-3.6-17.8-4.3-17.8-4.3s8.7-10.1,10.5-17C37.5,47.9,36.2,44,36.2,44l-4.6,1.6c0,0,1.3,7.7-0.6,12.4   c-4.1,9.9-13,19.8-13,19.8s14.6,1.3,20.7,5.1c8.6,5.4,10.2,12,10.2,12l4.6-1.6C53.5,93.4,49.7,84.4,42,80z"
                  fill="#ffffff"
                  style=""
                ></path>
                <path
                  d="M35.3,36.8c11.3-0.9,14.6-3.4,14.6-3.4l-3-3.8c0,0-6.9,3.7-12.1,3.4c-10.9-0.6-23.3-5.6-23.3-5.6s3.5,14,1.8,20.9   C10.9,58.2,5,61.8,5,61.8l3,3.8c0,0,7.5-6.5,9.1-15.1c1.3-7.1-1.7-18-1.7-18S28,37.4,35.3,36.8z"
                  fill="#ffffff"
                  style=""
                ></path>
                <path
                  d="M37.4,17.8c7.3-1.1,16.7-7.4,16.7-7.4s-0.6,13.2,2.4,19.8c4.6,10.2,8,12.5,8,12.5l2.7-4c0,0-5.9-5.2-7.3-10.2   C56.9,18.2,57.7,5,57.7,5s-12.3,7.8-19.5,8.5c-10.2,1-15.6-3.3-15.6-3.3l-2.7,4.1C19.9,14.2,28.6,19.1,37.4,17.8z"
                  fill="#ffffff"
                  style=""
                ></path>
                <path
                  d="M65,60.5c0,0,3.1-7.2,7.4-10.1c9-6.1,21.9-9.7,21.9-9.7s-11.5-8.9-14.5-15.4c-4.2-9.1-1.9-15.6-1.9-15.6l-4.8-1.2   c0,0-1.9,9.6,2.2,17.4c3.4,6.4,12.5,13.2,12.5,13.2S75,42.9,69.6,47.8c-8.3,7.6-9.4,11.5-9.4,11.5L65,60.5z"
                  fill="#ffffff"
                  style=""
                ></path>
              </g>
              <desc>Created with Snap</desc>
              <defs></defs>
            </g>
            <g>
              <g transform="matrix(1.024,0,0,-1.024,0,0)">
                <path
                  d="M104 0L104 723L201 723L201 0L104 0ZM409 723L602 723Q681 723 737 696Q793 670 823 620Q854 570 854 499Q854 456 841 414Q828 373 799 339Q771 306 725 286Q679 266 613 266L506 266L506 0L409 0L409 723ZM506 359L612 359Q655 359 683 373Q711 387 727 408Q743 430 750 454Q757 478 757 497Q757 519 750 542Q743 566 726 585Q710 605 683 617Q657 630 618 630L506 630L506 359ZM1004 0L1004 723L1433 723L1433 630L1101 630L1101 399L1392 399L1392 307L1101 307L1101 0L1004 0ZM1593 0L1593 723L2063 723L2063 630L1690 630L1690 410L2023 410L2023 317L1690 317L1690 93L2077 93L2077 0L1593 0Z"
                  fill="#ffffff"
                  style=""
                ></path>
              </g>
            </g>
          </g>
        </svg>
      </template>
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
