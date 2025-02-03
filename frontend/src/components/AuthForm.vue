<script setup lang="ts">
import { ref } from 'vue'

const isLogin = ref(true)

const firstname = ref('')
const lastname = ref('')
const login = ref('')
const password = ref('')
const role = ref({ name: 'студент', value: 'student' })
const roleOptions = ref([
  { name: 'студент', value: 'student' },
  { name: 'учитель', value: 'teacher' },
])

const test = () => {
  console.log('test')
}

console.log(role.value)
</script>

<template>
  <div v-if="isLogin" class="bg-surface-50 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
    <div
      class="min-w-400 bg-surface-0 dark:bg-surface-900 shadow rounded-border w-full lg:w-6/12 mx-auto"
    >
      <div>
        <label class="text-surface-900 dark:text-surface-0 font-medium mb-2 block">Роль</label>
        <app-select
          class="w-full mb-4 selectbutton"
          v-model="role"
          optionLabel="name"
          :options="roleOptions"
        />
        <label for="firstname1" class="text-surface-900 dark:text-surface-0 font-medium mb-2 block"
          >Имя</label
        >
        <app-input id="firstname1" type="text" placeholder="Иван" class="w-full mb-4" />

        <label for="lastname1" class="text-surface-900 dark:text-surface-0 font-medium mb-2 block"
          >Фамилия</label
        >
        <app-input id="lastname1" type="text" placeholder="Иванов" class="w-full mb-4" />
        <label for="login1" class="text-surface-900 dark:text-surface-0 font-medium mb-2 block"
          >Логин</label
        >
        <app-input id="login1" type="text" placeholder="" class="w-full mb-4" />
        <label for="password1" class="text-surface-900 dark:text-surface-0 font-medium mb-2 block"
          >Пароль</label
        >
        <app-input id="password1" type="password" placeholder="" class="w-full mb-4" />

        <div class="flex items-center justify-content-between mb-3">
          <div class="flex items-center">
            <label>Уже есть аккаунт?</label>
          </div>
          <a
            @click="isLogin = !isLogin"
            class="font-medium no-underline ml-8 text-primary text-right cursor-pointer"
            >Войти</a
          >
        </div>

        <app-button label="Зарегистрироваться" icon="pi pi-user" class="w-full" />
      </div>
    </div>
  </div>
  <div v-else="isLogin" class="bg-surface-50 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
    <div
      class="min-w-400 bg-surface-0 dark:bg-surface-900 p-6 shadow rounded-border w-full lg:w-6/12 mx-auto"
    >
      <div>
        <label for="login1" class="text-surface-900 dark:text-surface-0 font-medium mb-2 block"
          >Логин</label
        >
        <app-input id="login1" type="text" placeholder="" class="w-full mb-4" />
        <label for="password1" class="text-surface-900 dark:text-surface-0 font-medium mb-2 block"
          >Пароль</label
        >
        <app-input id="password1" type="password" placeholder="" class="w-full mb-4" />

        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center">
            <label>Нет аккаунта?</label>
          </div>
          <a
            @click="isLogin = !isLogin"
            class="font-medium no-underline ml-8 text-primary text-right cursor-pointer"
            >Зарегистрироваться</a
          >
        </div>

        <app-button @click="test" label="Войти" icon="pi pi-user" class="w-full" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.selectbutton :deep(.p-togglebutton) {
  flex: 1;
}

.min-w-400 {
  min-width: 400px;
}
</style>
