import { ref, computed } from 'vue'
import { createPinia } from 'pinia'
import { defineStore } from 'pinia'

export const pinia = createPinia()

export const useCalendarStore = defineStore('calendar', () => {
  const calendarApi = ref()
  const modal = ref(false)

  const getCalendarApi = computed(() => calendarApi.value)

  const setCalendarApi = (value: any) => {
    calendarApi.value = value
  }

  const setModal = () => {
    modal.value = !modal.value
  }

  return { calendarApi, modal, getCalendarApi, setCalendarApi, setModal }
})