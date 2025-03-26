<script setup lang="ts">
import { onMounted } from 'vue'
import { useCoursesStore } from '@/stores/courses'
import type { Course } from '@/types/course'

const store = useCoursesStore()

onMounted(async () => {
  await store.fetchCourses()
})
</script>

<template>
  <div class="course-list">
    <div v-if="store.loading" class="loading">Загрузка...</div>
    <div v-else-if="store.error" class="error">
      {{ store.error }}
    </div>
    <div v-else class="courses-grid">
      <div v-for="course in store.courses" :key="course._id" class="course-card">
        <img :src="course.image" :alt="course.title" class="course-image" />
        <div class="course-content">
          <h3 class="course-title">{{ course.title }}</h3>
          <p class="course-description">{{ course.description }}</p>
          <div class="course-meta">
            <span class="course-price">{{ course.price }} ₽</span>
            <span class="course-level">{{ course.level }}</span>
            <span class="course-category">{{ course.category }}</span>
          </div>
          <div class="course-tags">
            <span v-for="tag in course.tags" :key="tag._id" class="tag">
              {{ tag.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="store.totalPages > 1" class="pagination">
      <button
        :disabled="store.currentPage === 1"
        @click="store.fetchCourses({ page: store.currentPage - 1 })"
      >
        Назад
      </button>
      <span>Страница {{ store.currentPage }} из {{ store.totalPages }}</span>
      <button
        :disabled="store.currentPage === store.totalPages"
        @click="store.fetchCourses({ page: store.currentPage + 1 })"
      >
        Вперед
      </button>
    </div>
  </div>
</template>

<style scoped>
.course-list {
  padding: 20px;
}

.loading,
.error {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
}

.error {
  color: #dc3545;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.course-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
  background: white;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.course-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.course-content {
  padding: 15px;
}

.course-title {
  margin: 0 0 10px;
  font-size: 1.2em;
  color: #333;
}

.course-description {
  color: #666;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-meta {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 0.9em;
  color: #666;
}

.course-price {
  color: #28a745;
  font-weight: bold;
}

.course-level,
.course-category {
  background: #f8f9fa;
  padding: 2px 8px;
  border-radius: 4px;
}

.course-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  background: #e9ecef;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  color: #495057;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.pagination button:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background: #f8f9fa;
}
</style>
