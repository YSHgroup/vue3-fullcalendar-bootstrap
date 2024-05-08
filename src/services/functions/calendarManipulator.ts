import type { FullCalendar as F } from '@/interfaces'
import { useCalendarStore } from '@/stores/calendar'

export const handleDateClick = (arg: F.DateClickArg) => {
	console.log('Date click! ', arg)
}

export const handleSelect = (selectionInfo: any) => {
	const calendarStore = useCalendarStore()
	calendarStore.setSelectedSlot({
		modal: true,
		times: {
			start: selectionInfo.start,
			end: selectionInfo.end
		}
	})
}