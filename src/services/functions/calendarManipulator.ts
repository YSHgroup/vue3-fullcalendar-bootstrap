import type { FullCalendar as F } from '@/interfaces'

export const handleDateClick = (arg: F.DateClickArg) => {
	alert('Date click! ' + arg.dateStr)
}