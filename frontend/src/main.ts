import './assets/main.css'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import SelectButton from 'primevue/selectbutton'
import Menubar from 'primevue/menubar'

const app = createApp(App)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})

app.use(createPinia())
app.use(router)

app.component('app-button', Button)
app.component('app-checkbox', Checkbox)
app.component('app-input', InputText)
app.component('app-select', SelectButton)
app.component('app-menu', Menubar)

app.mount('#app')
