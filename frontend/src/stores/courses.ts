import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'
import type { Course, CourseFormData, CourseQuery, CourseResponse } from '@/types/course'

export const useCoursesStore = defineStore('courses', () => {
  const courses = ref<Course[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalPages = ref(1)
  const currentPage = ref(1)
  const total = ref(0)

  const fetchCourses = async (query: CourseQuery = {}) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.get<CourseResponse>('/courses', { params: query })
      courses.value = response.data.data.courses
      totalPages.value = response.data.totalPages
      currentPage.value = response.data.currentPage
      total.value = response.data.total
    } catch (err) {
      error.value = 'Ошибка при загрузке курсов'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const fetchCourseById = async (id: string) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.get<{ status: string; data: { course: Course } }>(`/courses/${id}`)
      return response.data.data.course
    } catch (err) {
      error.value = 'Ошибка при загрузке курса'
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }

  const createCourse = async (courseData: CourseFormData) => {
    try {
      loading.value = true
      error.value = null
      const formData = new FormData()
      Object.entries(courseData).forEach(([key, value]) => {
        if (key === 'tags') {
          formData.append(key, JSON.stringify(value))
        } else if (value !== undefined) {
          formData.append(key, value.toString())
        }
      })
      const response = await api.post<{ status: string; data: { course: Course } }>(
        '/courses',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      return response.data.data.course
    } catch (err) {
      error.value = 'Ошибка при создании курса'
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }

  const updateCourse = async (id: string, courseData: CourseFormData) => {
    try {
      loading.value = true
      error.value = null
      const formData = new FormData()
      Object.entries(courseData).forEach(([key, value]) => {
        if (key === 'tags') {
          formData.append(key, JSON.stringify(value))
        } else if (value !== undefined) {
          formData.append(key, value.toString())
        }
      })
      const response = await api.put<{ status: string; data: { course: Course } }>(
        `/courses/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      return response.data.data.course
    } catch (err) {
      error.value = 'Ошибка при обновлении курса'
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteCourse = async (id: string) => {
    try {
      loading.value = true
      error.value = null
      await api.delete(`/courses/${id}`)
      return true
    } catch (err) {
      error.value = 'Ошибка при удалении курса'
      console.error(err)
      return false
    } finally {
      loading.value = false
    }
  }

  const addToFavorites = async (courseId: string) => {
    try {
      loading.value = true
      error.value = null
      await api.post(`/favorites/${courseId}`)
      return true
    } catch (err) {
      error.value = 'Ошибка при добавлении курса в избранное'
      console.error(err)
      return false
    } finally {
      loading.value = false
    }
  }

  const removeFromFavorites = async (courseId: string) => {
    try {
      loading.value = true
      error.value = null
      await api.delete(`/favorites/${courseId}`)
      return true
    } catch (err) {
      error.value = 'Ошибка при удалении курса из избранного'
      console.error(err)
      return false
    } finally {
      loading.value = false
    }
  }

  const getFavorites = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await api.get<{ status: string; data: { courses: Course[] } }>('/favorites')
      return response.data.data.courses
    } catch (err) {
      error.value = 'Ошибка при загрузке избранных курсов'
      console.error(err)
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    courses,
    loading,
    error,
    totalPages,
    currentPage,
    total,
    fetchCourses,
    fetchCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    addToFavorites,
    removeFromFavorites,
    getFavorites,
  }
})
