import "./bootstrap.js"

import {createApp} from "vue";
import {createPinia} from 'pinia'
import router from './router'
import App from './App.vue'
import {i18n} from "@/i18n";
import ToastService from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const app = createApp(App)

app.use(createPinia())
    .use(router)
    .use(i18n)
    .use(ToastService, {
        autoClose: 3000,
        position: 'top-right',
        transition: 'zoom',
        theme: 'dark'
    })
    .mount('#app')

