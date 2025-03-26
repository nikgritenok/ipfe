import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const token = ref(localStorage.getItem('jwt') || '')
  const router = useRouter()
  const user = ref({
    firstName: '',
    lastName: '',
    login: '',
    role: '',
  })

  async function register(
    firstName: string,
    lastName: string,
    login: string,
    password: string,
    role: string,
  ) {
    try {
      const response = await api.post('/register', {
        firstName,
        lastName,
        login,
        password,
        role,
      })

      if (response.data.token) {
        token.value = response.data.token
        localStorage.setItem('jwt', response.data.token)
        isLoggedIn.value = true
        router.push('/')
      }
    } catch (error) {
      console.error('Ошибка регистрации:', error)
    }
  }

  async function loginUser(login: string, password: string) {
    try {
      const response = await api.post('/login', {
        login,
        password,
      })

      if (response.data.token) {
        token.value = response.data.token
        localStorage.setItem('jwt', response.data.token)
        isLoggedIn.value = true
        router.push('/')
      }
    } catch (error) {
      console.error('Ошибка авторизации:', error)
    }
  }

  async function getUserData() {
    try {
      const response = await api.get('/me')
      user.value = response.data
    } catch (error) {
      console.error('Ошибка получения данных пользователя:', error)
    }
  }

  function logout() {
    token.value = ''
    isLoggedIn.value = false
    localStorage.removeItem('jwt')
    router.push('/login')
  }

  async function deleteUser() {
    try {
      await api.delete('/delete')
      logout()
    } catch (error) {
      console.error('Ошибка удаления пользователя:', error)
    }
  }

  return { isLoggedIn, token, register, loginUser, logout, getUserData, user, deleteUser }
})
