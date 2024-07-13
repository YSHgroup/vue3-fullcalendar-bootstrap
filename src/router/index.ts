import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import routes from './routes'

const BASE_TITLE = "Calendar - Vue3"
const router = createRouter({
  scrollBehavior: () => ({top: 0, left: 0}),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if(to.meta && typeof to.meta.title === 'string') {
    document.title = to.meta.title
  }
  next()
})

router.afterEach(( to, from )=>{
  if(to.meta.title) {
    nextTick(() => {
      document.title = `${to.meta.title} | ${BASE_TITLE}`
    })
  } else {
    document.title = BASE_TITLE
  }
})

export default router
