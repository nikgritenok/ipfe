import { defineStore } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const token = ref(localStorage.getItem('jwt') || '')
  const router = useRouter()
  const toast = useToast()
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
      const { data } = await api.post('/register', {
        firstName,
        lastName,
        login,
        password,
        role,
      })

      if (data.token) {
        token.value = data.token
        localStorage.setItem('jwt', data.token)
        isLoggedIn.value = true
        router.push('/')
      }
    } catch (error: any) {
      let errorMessage = 'Произошла ошибка при регистрации'

      if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED') {
        errorMessage =
          'Не удалось подключиться к серверу. Проверьте подключение к интернету и попробуйте снова.'
      } else if (error.response?.status === 500) {
        errorMessage = 'Ошибка сервера. Пожалуйста, попробуйте позже.'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: errorMessage,
        life: 5000,
      })
    }
  }

  async function loginUser(login: string, password: string) {
    try {
      const { data } = await api.post('/login', {
        login,
        password,
      })

      if (data.token) {
        token.value = data.token
        localStorage.setItem('jwt', data.token)
        isLoggedIn.value = true
        router.push('/')
      }
    } catch (error: any) {
      let errorMessage = 'Неверный логин или пароль'

      if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED') {
        errorMessage =
          'Не удалось подключиться к серверу. Проверьте подключение к интернету и попробуйте снова.'
      } else if (error.response?.status === 500) {
        errorMessage = 'Ошибка сервера. Пожалуйста, попробуйте позже.'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: errorMessage,
        life: 5000,
      })
    }
  }

  async function getUserData() {
    try {
      const { data } = await api.get('/me')
      const { firstName, lastName, login, role } = data
      user.value = { firstName, lastName, login, role }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Не удалось получить данные пользователя'
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: errorMessage,
        life: 3000,
      })
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
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Не удалось удалить аккаунт'
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: errorMessage,
        life: 3000,
      })
    }
  }

  return { isLoggedIn, token, register, loginUser, logout, getUserData, user, deleteUser }
})
