<script setup lang="ts">
import { useCalendarStore } from '@/stores/calendar';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';

const calendarStore = useCalendarStore()
const { modal } = storeToRefs(calendarStore)
const { setModal } = calendarStore

watch(modal, () => {
  console.log('---', modal.value)
})
</script>

<template>
  <teleport to="body">
    <div class="modal-wrapper" v-if="modal">
      <BCard header="Add Event" header-tag="header" footer="Card Footer" footer-tag="footer"
        class="fc-modal text-center bg-white" title="Add Event">
        <BCardText>Header and footers using props.</BCardText>
        <BButton variant="primary" @click="setModal()">Close</BButton>
      </BCard>
    </div>

  </teleport>
</template>

<style scoped lang="scss">
.modal-wrapper {
  width: 100%;
  height: 100vh;
  background-color: #0000006a;
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
}

.fc-modal {
  position: fixed;
  max-width: 600px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
