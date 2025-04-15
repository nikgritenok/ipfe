<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppMenu from '@/components/AppMenu.vue'
import { useCoursesStore } from '@/stores/courses'
import type { Course } from '@/types/course'

const route = useRoute()
const router = useRouter()
const store = useCoursesStore()

const course = ref<Course | null>(null)
const isEditing = ref(false)

onMounted(async () => {
  const courseId = route.params.id as string
  course.value = await store.fetchCourseById(courseId)
})

const handleEdit = () => {
  isEditing.value = true
}

const handleDelete = async () => {
  if (course.value && confirm('Вы уверены, что хотите удалить этот курс?')) {
    const success = await store.deleteCourse(course.value._id)
    if (success) {
      router.push('/courses')
    }
  }
}

const handleAddToFavorites = async () => {
  if (course.value) {
    await store.addToFavorites(course.value._id)
  }
}

const handleRemoveFromFavorites = async () => {
  if (course.value) {
    await store.removeFromFavorites(course.value._id)
  }
}
</script>

<template>
  <div class="course-view">
    <AppMenu />
    <div class="content">
      <div v-if="store.loading" class="loading">Загрузка...</div>
      <div v-else-if="store.error" class="error">
        {{ store.error }}
      </div>
      <div v-else-if="course" class="course-details">
        <div class="course-header">
          <img :src="course.image" :alt="course.title" class="course-image" />
          <div class="course-info">
            <h1>{{ course.title }}</h1>
            <div class="course-meta">
              <span class="price">{{ course.price }} ₽</span>
              <span class="level">{{ course.level }}</span>
              <span class="category">{{ course.category }}</span>
            </div>
            <div class="course-actions">
              <button class="btn btn-primary" @click="handleAddToFavorites">
                Добавить в избранное
              </button>
              <button class="btn btn-secondary" @click="handleEdit">Редактировать</button>
              <button class="btn btn-danger" @click="handleDelete">Удалить</button>
            </div>
          </div>
        </div>

        <div class="course-content">
          <div class="description">
            <h2>Описание</h2>
            <p>{{ course.description }}</p>
          </div>

          <div class="tags">
            <h2>Теги</h2>
            <div class="tag-list">
              <span v-for="tag in course.tags" :key="tag._id" class="tag">
                {{ tag.name }}
              </span>
            </div>
          </div>

          <div class="author">
            <h2>Автор</h2>
            <p>{{ course.author.firstName }} {{ course.author.lastName }}</p>
          </div>
        </div>
      </div>
      <div v-else class="not-found">Курс не найден</div>
    </div>
  </div>
</template>

<style scoped>
.course-view {
  display: flex;
  min-height: 100vh;
}

.content {
  flex: 1;
  padding: 20px;
}

.loading,
.error,
.not-found {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
}

.error {
  color: #dc3545;
}

.course-details {
  max-width: 1200px;
  margin: 0 auto;
}

.course-header {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
}

.course-image {
  width: 400px;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
}

.course-info {
  flex: 1;
}

h1 {
  margin: 0 0 20px;
  font-size: 2.5em;
  color: #333;
}

.course-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.price {
  font-size: 1.5em;
  font-weight: bold;
  color: #28a745;
}

.level,
.category {
  background: #f8f9fa;
  padding: 5px 10px;
  border-radius: 4px;
  color: #666;
}

.course-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
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

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.course-content {
  display: grid;
  gap: 30px;
}

.description,
.tags,
.author {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  margin: 0 0 15px;
  font-size: 1.5em;
  color: #333;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  background: #e9ecef;
  padding: 5px 10px;
  border-radius: 4px;
  color: #495057;
}
</style>
