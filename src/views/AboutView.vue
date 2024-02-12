<template>
  <div class="about row min-vh-50 text-center">
    <h1>This page is to show how to use the floating-vue</h1>
    <div class="col g-2">
      <f-dropdown
        :triggers="['click', 'focus']"
        :distance="1"
        placement="right"
        class="p-2"
      >
        <b-button> Click me </b-button>
        <template #popper>
          <button v-close-popper>Close</button>
          <b-form-input
            class="tooltip-content"
            v-model="msg"
            placeholder="Tooltip-content"
          />
          <p class="p-2">
            {{ msg }}
          </p>
        </template>
      </f-dropdown>

      <Tooltip placement="top-start" distance="0" skidding="1">
        <a>Sponsor me</a>

        <template #popper> Help me fund my Open Source work! </template>
      </Tooltip>

      <vue-slot>
        <template v-slot:header="slotProps">
          <h2>{{ slotProps.text }}</h2>
          <p>{{ slotProps.count }}</p>
        </template>
        <template v-slot="{ text }">
          <p>{{ text }}</p>
        </template>
        <template #footer="{ text }">
          <footer>
            <h3>{{ text }}</h3>
          </footer>
        </template>
      </vue-slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import {
  Dropdown as FDropdown,
  Tooltip,
  Popper,
  PopperContent,
  PopperMethods,
  ThemeClass,
} from "floating-vue";
import VueSlot from "@/components/VueSlot.vue";

const msg = ref<string>("");
</script>

<style scoped></style>
