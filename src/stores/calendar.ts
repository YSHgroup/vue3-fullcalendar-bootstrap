import { ref, computed } from 'vue'
import { createPinia } from 'pinia'
import { defineStore } from 'pinia'

export const pinia = createPinia()

export const useCalendarStore = defineStore('calendar', () => {
  const modal = ref(false)

  const setModal = () => {
    modal.value = !modal.value
  }

  return { modal, setModal }
})