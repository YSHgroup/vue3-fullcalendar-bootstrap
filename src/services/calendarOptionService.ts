import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import listPlugin from '@fullcalendar/list'
import allLocales from '@fullcalendar/core/locales-all'
import enLocale from '@fullcalendar/core/locales/en-gb'

import type { FullCalendar as F } from '@/interfaces'

import events from './eventService'
import { handleDateClick, handleSelect } from './functions/calendarManipulator'

import { useCalendarStore } from '@/stores/calendar'

export const openModal = () => {
	const calendarStore = useCalendarStore()
	const {setModal} = calendarStore
	setModal()
}

export const calendarOptions: F.CalendarOptions = {
	plugins: [
		dayGridPlugin,
		interactionPlugin,
		timeGridPlugin,
		bootstrap5Plugin,
		listPlugin,
	],
	themeSystem: 'bootstrap5',
	initialView: 'dayGridMonth',
	height: "100%",
	locales: allLocales,
	locale: enLocale, // 'fr'
	nowIndicator: true,
	navLinks: true,
	weekNumbers: true,
	weekText: 'W-	',
	selectable: true,
	dayMaxEvents: true,
	editable: true,
	// eventStartEditable: true,

	eventRemove(arg) {
		console.log('remove---', arg)
	},
	headerToolbar: {
		start:
			'dayGridYear,dayGridMonth,timeGridWeek,timeGridDay,timeGridFive listWeek,listMonth',
		center: 'title',
		end: 'addEvent prevYear,prev,today,next,nextYear',
	},
	buttonIcons: {
		prev: 'arrow-left-square',
		prevYear: 'box-arrow-left',
		next: 'arrow-right-square',
		nextYear: 'box-arrow-right',
	},
	views: {
		timeGridFive: {
			type: 'timeGrid',
			duration: {
				days: 7,
			},
			buttonText: 'Work days',
			weekends: false
		},
		timeGridDay: {
			titleFormat: {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
				weekday: 'short',
			},
		},
		listWeek: {
			buttonText: 'List Week',
		},
		listMonth: {
			buttonText: 'List Month',
		},
	},
	monthStartFormat: {
		month: 'long',
		day: 'numeric',
	},
	customButtons: {
		addEvent: {
			text: 'Add',
			click: () => openModal()
		}
	},

	dateClick: handleDateClick,
	select: handleSelect,

	initialEvents: 'https://fullcalendar.io/api/demo-feeds/events.json',

	eventSources: [
		...events
	],
}
