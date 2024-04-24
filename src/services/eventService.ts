import { format } from 'date-fns'
import type { FullCalendar as F } from '@/interfaces'

export const getData = async (url: string) => {
	const response = await fetch(url)
	const data = await response.json()
	return data
}

export const fetchEvent = async ({
	range,
	country,
}: {
	range: string[]
	country: string
}) => {
	const baseURL = `https://date.nager.at/api/v3/publicholidays/`

	const year = format(range[0], 'yyyy')
	const eventsForYear = await getData(`${baseURL}${year}/${country}`)
	console.log('date--', eventsForYear)

	return eventsForYear.map((event: Record<string, string | boolean>) => {
		event['id'] = event.name
		event['region'] = country
		event['title'] = event.name
		event['start'] = event.date
		event['allDay'] = true

		return event
	})
}

export default [
	{
		events: [
			{ title: 'Happy New Year', date: '2024-01-01' },
			{ title: 'On Feb first', date: '2024-02-01' },
			{ title: 'Lunar day', date: '2024-02-10' },
			{ title: 'My birthday', date: '2024-02-18' },
		],
		backgroundColor: 'green',
	},
	{
		events: (info, successCallback, failureCallback) => {
			return fetchEvent({
				range: [info.startStr, info.endStr],
				country: 'US',
			})
		},
		backgroundColor: 'darkgrey',
	},
	{
		events: (info, successCallback, failureCallback) => {
			return fetchEvent({
				range: [info.startStr, info.endStr],
				country: 'GB',
			})
		},
		backgroundColor: 'brown',
	},
	{
		events: (info, successCallback, failureCallback) => {
			return fetchEvent({
				range: [info.startStr, info.endStr],
				country: 'HK',
			})
		},
		backgroundColor: 'lime',
	},
] as F.EventSourceInput[]
