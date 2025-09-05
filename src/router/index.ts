import { createRouter, createWebHistory } from 'vue-router'
import TodosPage from '../views/TodosPage.vue'
import { AuthService } from '../services/authService'
import LoginPage from '../components/LoginPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginPage,
      meta: { requiresAuth: false }
    },
    {
      path: '/todos',
      name: 'todos',
      component: TodosPage,
      meta: { requiresAuth: true }
    },
    // Redirect any unknown routes to login
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// Navigation guards
router.beforeEach(async (to, _from, next) => {
  const isAuthenticated = AuthService.isAuthenticated()

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Route requires auth but user is not authenticated
    next('/')
  } else if (to.name === 'login' && isAuthenticated) {
    // User is authenticated but trying to access login page
    next('/todos')
  } else {
    next()
  }
})

export default router
