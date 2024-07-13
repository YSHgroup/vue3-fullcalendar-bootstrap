<script setup lang="ts">
import { RouterView } from "vue-router";
import SideNav from "./components/SideNav.vue";
import { ref } from "vue";
import { useCalendarStore } from "./stores/calendar";

const date = ref(new Date())
const calendarStore = useCalendarStore()

const dateClicked = (date: string) => {
    console.log(`Selected ${date}`);
    calendarStore.getCalendarApi && calendarStore.getCalendarApi.gotoDate(date)
  }

</script>

<template>
  <b-row >
    <b-col cols="12" class="bg-secondary text-white col-xxl-2">
      <side-nav msg="FullCalendar with Vue 3">
        <template v-slot:content>
          <vue-date-picker
            v-model="date"
            inline
            auto-apply
            :enable-time-picker="false"
            @date-update="dateClicked"
          ></vue-date-picker>
        </template>
      </side-nav>
    </b-col>

    <b-col cols="12" class="vh-100 p-4 col-xxl-10">
      <b-container fluid tag="main" class="h-100">
        <RouterView />
      </b-container>
    </b-col>
  </b-row>
</template>

<style scoped lang="scss">
</style>
