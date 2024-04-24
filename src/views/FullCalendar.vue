<script setup lang="ts">
  import { ref, watch } from 'vue'
  import FullCalendar from '@fullcalendar/vue3'
  import EventModal from '@/components/EventModal.vue'
  import {calendarOptions} from '@/services/calendarOptionService'
  import { useCalendarStore } from '@/stores/calendar';

  const calendarStore = useCalendarStore()
  const fullcalendar = ref()

  watch(fullcalendar, () => {
    if(fullcalendar.value) {
      calendarStore.setCalendarApi(fullcalendar.value.getApi())
    }
  })

</script>

<template>
  <FullCalendar :options="calendarOptions" ref="fullcalendar">
    <template #eventContent="arg">
      <h6 class="my-1 px-1 text-truncate">{{ arg.event.title }}</h6>
    </template>
  </FullCalendar>

  <event-modal />
</template>
