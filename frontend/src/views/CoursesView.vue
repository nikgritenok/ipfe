<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppMenu from '@/components/AppMenu.vue'
import CourseList from '@/components/CourseList.vue'
import CourseForm from '@/components/CourseForm.vue'

const router = useRouter()
const showForm = ref(false)

const handleCreateCourse = () => {
  showForm.value = true
}

const handleFormSubmit = () => {
  showForm.value = false
  router.push('/courses')
}

const handleFormCancel = () => {
  showForm.value = false
}
</script>

<template>
  <AppMenu />
  <div class="courses-view">
    <div class="content">
      <div class="header">
        <h1>Курсы</h1>
        <button class="btn btn-primary" @click="handleCreateCourse">Добавить курс</button>
      </div>

      <CourseForm v-if="showForm" @submit="handleFormSubmit" @cancel="handleFormCancel" />
      <CourseList v-else />
    </div>
  </div>
</template>

<style scoped>
.courses-view {
  display: flex;
  min-height: 100vh;
}

.content {
  flex: 1;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h1 {
  margin: 0;
  font-size: 2em;
  color: #333;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>
