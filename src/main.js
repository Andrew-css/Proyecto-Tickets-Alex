
import { createApp } from 'vue'
import {Quasar, Dialog} from 'quasar'
import { createPinia} from 'pinia'
// import './style.css'
import App from './App.vue'
import {router} from "./routes/routes.js"
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

const pinia = createPinia()
const app = createApp(App)

app.use(Quasar, {
    plugins:{Dialog}
})
app.use(router)
app.use(pinia)
app.mount('#app')
