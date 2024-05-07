import { ref, computed } from 'vue'
import { createPinia, defineStore } from 'pinia'
import type { CustomEvent, SelectedSlot } from '@/interfaces'

export const pinia = createPinia()

export const useCalendarStore = defineStore('calendar', () => {
	const calendarApi = ref()
	const modal = ref(false)
	const addedEvents = ref<CustomEvent[]>([])
	const selectedSlot = ref<SelectedSlot>({modal: false, times: {
		start: null,
		end: null
	}})

	const getCalendarApi = computed(() => calendarApi.value)
	const getAddedEvents = computed(() => addedEvents.value)
	const getSelectedSlot = computed(() => selectedSlot.value)

	const setCalendarApi = (value: any) => {
		calendarApi.value = value
	}
	const setModal = () => {
		modal.value = !modal.value
	}
	const setAddedEvents = (
		value: CustomEvent | string | number,
		type: string
	) => {
		const id = addedEvents.value.length
		const newEvent = { ...(value as CustomEvent), id, backgroundColor: 'chocolate' }

		switch (type) {
			case 'add':
				addedEvents.value.push(newEvent as CustomEvent)
				calendarApi.value && calendarApi.value.addEvent(newEvent)
				break
			case 'delete':
				delete addedEvents.value[value as any]
				break
			default:
				break
		}
		addedEvents.value.push()
	}
	const setSelectedSlot = (value: any) => {
		selectedSlot.value = value
	}

	return {
		calendarApi,
		modal,
		selectedSlot,
		addedEvents,
		getCalendarApi,
		getAddedEvents,
		getSelectedSlot,
		setCalendarApi,
		setModal,
		setAddedEvents,
		setSelectedSlot,
	}
})
