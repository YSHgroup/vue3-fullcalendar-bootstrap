<script setup lang="ts">
  import { RouterLink } from "vue-router"

  defineProps({
    msg: {
      type: String
    }
  })

</script>

<template>
  <b-nav pills variant="primary" v-b-color-mode="'dark'"
    class="flex-xxl-column flex-row justify-content-center align-items-center text-center br-2 py-2 py-xxl-4">
    
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
    <h1 class="green">{{ msg }}</h1>
    <b-row gutter-y="2" offset="2">
      <RouterLink to="/">
        <BButton class="mx-auto" variant="success">Home</BButton>
      </RouterLink>
    </b-row>

    <b-row class="pt-4">
      <b-col cols="12">
        <slot name="content"></slot>
      </b-col>
    </b-row>
  </b-nav>
</template>

<style scoped>
</style>
