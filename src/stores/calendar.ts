import { ref, computed } from 'vue'
import { createPinia, defineStore } from 'pinia'
import type { CustomEvent } from '@/interfaces'

export const pinia = createPinia()

export const useCalendarStore = defineStore('calendar', () => {
  const calendarApi = ref()
  const modal = ref(false)
  const addedEvents = ref<CustomEvent[]>([])

  const getCalendarApi = computed(() => calendarApi.value)
  const getAddedEvents = computed(() => addedEvents.value)

  const setCalendarApi = (value: any) => {
    calendarApi.value = value
  }
  const setModal = () => {
    modal.value = !modal.value
  }
  const setAddedEvents = (value: CustomEvent | string | number , type: string) => {
    const id = addedEvents.value.length
    const  newEvent = { ...value as CustomEvent, id }

    switch (type) {
      case 'add':
        addedEvents.value.push(newEvent as CustomEvent)
        break
      case 'delete':
        delete addedEvents.value[value as any]
        break
      default:
        break
    }
    addedEvents.value.push()
  }

  return { calendarApi, modal, addedEvents, getCalendarApi, getAddedEvents, setCalendarApi, setModal, setAddedEvents }
})