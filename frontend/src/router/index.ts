import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'
import { useAuthStore } from '../stores/auth'
import AuthView from '../views/AuthView.vue'
import CoursesView from '../views/CoursesView.vue'
import ProfileView from '../views/ProfileView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: AuthView,
    },
    {
      path: '/',
      name: 'home',
      component: MainView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/courses',
      name: 'courses',
      component: CoursesView,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.token) {
    next('/login')
  } else {
    next()
  }
})

export default router
