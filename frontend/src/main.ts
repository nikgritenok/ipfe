import './assets/main.css'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'

import { createPinia } from 'pinia'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Checkbox from 'primevue/checkbox'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ConfirmDialog from 'primevue/confirmdialog'
import FileUpload from 'primevue/fileupload'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Menubar from 'primevue/menubar'
import Select from 'primevue/select'
import SelectButton from 'primevue/selectbutton'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import { createApp } from 'vue'
import Aura from '@primevue/themes/aura'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.use(ToastService)
app.use(ConfirmationService)

app.use(createPinia())
app.use(router)

app.component('app-button', Button)
app.component('app-checkbox', Checkbox)
app.component('app-input', InputText)
app.component('app-select-button', SelectButton)
app.component('app-select', Select)
app.component('app-menu', Menubar)
app.component('app-card', Card)
app.component('app-confirm', ConfirmDialog)
app.component('app-toast', Toast)
app.component('app-textarea', Textarea)
app.component('app-input-number', InputNumber)
app.component('app-file-upload', FileUpload)
app.mount('#app')
