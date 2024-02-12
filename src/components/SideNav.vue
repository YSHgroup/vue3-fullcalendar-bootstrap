<script setup lang="ts">
import { RouterLink } from "vue-router";

defineProps<{
  msg: string;
}>();
</script>

<template>
  <b-nav  pills vertical class="greetings align-items-center br-2">
    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/logo.svg"
      width="125"
      height="125"
    />
    <h1 class="green">{{ msg }}</h1>

    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </b-nav>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
