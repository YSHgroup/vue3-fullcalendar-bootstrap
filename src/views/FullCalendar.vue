<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import {calendarOptions} from '@/services/calendarOptionService'


</script>

<template>
    <BRow>
      <FullCalendar :options="calendarOptions" >
        <template #eventContent="arg">
          <h6 class="my-1 px-1 text-truncate">{{ arg.event.title }}</h6>
        </template>
      </FullCalendar>
    </BRow>
</template>
