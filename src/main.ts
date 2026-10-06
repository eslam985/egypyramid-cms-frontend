import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'
import i18n from './i18n/index.js'
import App from './App.vue'
import router from './router/index.js'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
