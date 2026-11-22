import type { RouteRecordRaw } from 'vue-router'
import FullCalendarView from '@/views/FullCalendar.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'calendar',
    component: FullCalendarView,
    meta: { title: 'World Calendar' },
  },
]

export default routes
