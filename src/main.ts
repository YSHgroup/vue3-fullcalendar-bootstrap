import './scss/global.scss';

// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'floating-vue/dist/style.css' //The css file to use the floating-vue component styles

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createBootstrap} from 'bootstrap-vue-next'
import FloatingVue from 'floating-vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(createBootstrap())
app.use(FloatingVue)

app.mount('#app')
