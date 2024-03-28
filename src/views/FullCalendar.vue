<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import {calendarOptions} from '@/services/calendarOptionService'


const toggleWeekends = () => {
  console.log('toggle-->', calendarOptions.weekends)
  calendarOptions.weekends = !calendarOptions.weekends
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
