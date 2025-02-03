import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useRouter } from 'vue-router'

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
      const response = await axios.post('http://localhost:5001/register', {
        firstName,
        lastName,
        login,
        password,
        role,
      })

      if (response.data.token) {
        token.value = response.data.token
        localStorage.setItem('jwt', response.data.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
        console.log('Authorization header:', axios.defaults.headers.common['Authorization'])
        isLoggedIn.value = true
        router.push('/')
      }

      console.log(response)
    } catch (error) {
      console.error('Ошибка регистрации:', error)
    }
  }

  async function loginUser(login: string, password: string) {
    try {
      const response = await axios.post('http://localhost:5001/login', {
        login,
        password,
      })

      if (response.data.token) {
        token.value = response.data.token
        localStorage.setItem('jwt', response.data.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
        isLoggedIn.value = true
        router.push('/')
      }
    } catch (error) {
      console.error('Ошибка авторизации:', error)
    }
  }

  async function getUserData() {
    try {
      const token = localStorage.getItem('jwt')
      const response = await axios.get('http://localhost:5001/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      user.value = response.data
    } catch (error) {
      console.error('Ошибка получения данных пользователя:', error)
    }
  }

  function logout() {
    token.value = ''
    isLoggedIn.value = false
    localStorage.removeItem('jwt')
    delete axios.defaults.headers.common['Authorization']
    router.push('/login')
  }

  return { isLoggedIn, token, register, loginUser, logout, getUserData, user }
})
