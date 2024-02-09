import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  scrollBehavior: () => ({top: 0, left: 0}),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if(to.meta && to.meta.title === 'string') {
    document.title = to.meta.title
  }
  next()
})

export default router
