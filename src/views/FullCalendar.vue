<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { type DateClickArg } from '@fullcalendar/interaction'
import type {CalendarOptions} from '@fullcalendar/core'

const handleDateClick = (arg: DateClickArg) => {
  alert('Date click! ' + arg.dateStr)
}

const toggleWeekends = () => {
  console.log('toggle-->', calendarOptions.weekends)
  calendarOptions.weekends = !calendarOptions.weekends
}

const calendarOptions: CalendarOptions = {
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  dateClick: handleDateClick,
  events: [
    {title: 'My first event', date: '2024-2-1'},
    {title: 'Lunar day', date: '2024-2-10'},
    {title: 'My birthday', date: '2024-2-18'}
  ]
}



</script>

<template>
    <BRow>
      <BButton variant="outline-primary" pill @click="toggleWeekends" >toggle weekends</BButton>
      <FullCalendar :options="calendarOptions" >
        <template #eventContent="arg">
          <b>{{ arg.event.title }}</b>
        </template>
      </FullCalendar>
    </BRow>
</template>
