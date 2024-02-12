<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import SideNav from "./components/SideNav.vue";
</script>

<template>
  <b-container tag="main" class="min-vh-100">
    <b-row class="py-4">
      <b-col cols="2" class="px-2 py-4 bg-primary text-white rounded-2">

        <side-nav msg="You did it!" />

      </b-col>
      <b-col cols="10"> <RouterView /> </b-col>
    </b-row>
  </b-container>
  
</template>

<style scoped></style>
