
// Import Bootstrap and BootstrapVue CSS files (order is important)
// import 'bootstrap/scss/bootstrap.scss'
import './scss/global.scss';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'floating-vue/dist/style.css' //The css file to use the floating-vue component styles
import '@vuepic/vue-datepicker/dist/main.css'

import { createApp } from 'vue'
import { createBootstrap} from 'bootstrap-vue-next'
import FloatingVue from 'floating-vue'
import VuedatePicker from '@vuepic/vue-datepicker'
import { pinia } from './stores/calendar';

import App from './App.vue'
import router from './router'

const app = createApp(App)

FloatingVue.options.distance = 2

app.use(pinia)
console.log('amin')
app.use(router)

app.use(createBootstrap())
app.use(FloatingVue)
app.component('VueDatePicker', VuedatePicker)

app.mount('#app')
