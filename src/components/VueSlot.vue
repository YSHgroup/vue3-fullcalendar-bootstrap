<script setup lang="ts">
    import { ref } from 'vue';
    const message =ref<string[]>(['Header', 'Hello world', 'Footer'])
</script>
<template>
    <div>
        <header>

            <slot name="header" :text="message[0]" :count="1"></slot>
        </header>
        <div>
            <slot :text="message[1]"></slot>
        </div>
        <footer>
            <slot name="footer" :text="message[2]"></slot>
        </footer>
    </div>
</template>
<style scoped></style>