import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import listPlugin from '@fullcalendar/list'
import allLocales from '@fullcalendar/core/locales-all'
import enLocale from '@fullcalendar/core/locales/en-gb'

import type { FullCalendar as F } from '@/interfaces'

import events from './eventService'
import { handleDateClick } from './functions/calendarManipulator'


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
	locales: allLocales,
	locale: enLocale, // 'fr'
	nowIndicator: true,
	navLinks: true,
	headerToolbar: {
		start:
			'dayGridYear,dayGridMonth,timeGridWeek,timeGridDay,timeGridFive listWeek,listMonth',
		center: 'title',
		end: 'addResource prevYear,prev,today,next,nextYear',
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
				days: 5,
			},
			buttonText: 'Fivedays',
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
	initialEvents: 'https://fullcalendar.io/api/demo-feeds/events.json',

	eventSources: [
		...events
	],
}
