import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'

import type { FullCalendar as F } from '@/interfaces'

const handleDateClick = (arg: F.DateClickArg) => {
	alert('Date click! ' + arg.dateStr)
}

export const calendarOptions: F.CalendarOptions = {
	plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, bootstrap5Plugin],
	themeSystem: 'bootstrap5',
	initialView: 'dayGridMonth',
	headerToolbar: {
		start:
			'dayGridYear,dayGridMonth,timeGridWeek,timeGridDay timeGridFive',
		center: 'title',
		end: 'addResource prevYear,prev,next,nextYear',
	},
	buttonIcons: {
		prev: 'arrow-left-square',
    prevYear: 'box-arrow-left',
		next: 'arrow-right-square',
    nextYear: 'box-arrow-right',
	},
	footerToolbar: {
		start: 'custom1,custom2',
		center: '',
		end: 'prev,next',
	},
	views: {
		timeGridFive: {
			type: 'timeGrid',
			duration: {
				days: 5,
			},
			buttonText: 'Fivedays',
		},
    timeGridDay: {
      titleFormat: { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' }
    }
	},
	monthStartFormat: {
		month: 'long',
		day: 'numeric',
	},
	customButtons: {
		custom1: {
			text: 'custom 1',
			click: function () {
				alert('clicked custom button 1!')
			},
		},
		custom2: {
			text: 'custom 2',
			click: function () {
				alert('clicked custom button 2!')
			},
		},
	},
	dateClick: handleDateClick,
	events: [
		{ title: 'Happy New Year', date: '2024-01-01' },
		{ title: 'On Feb first', date: '2024-02-01' },
		{ title: 'Lunar day', date: '2024-02-10' },
		{ title: 'My birthday', date: '2024-02-18' },
	],
}
