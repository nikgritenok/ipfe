import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const token = ref('')
  const role = ref('')

  function register(
    firstName: string,
    lastName: string,
    login: string,
    password: string,
    role: string,
  ) {
    try {
      const response = axios.post('http://localhost:5001/register', {
        firstName,
        lastName,
        login,
        password,
        role,
      })
      console.log(response)
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
    }
  }

  return { isLoggedIn, token, register }
})
