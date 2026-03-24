// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vHighlight from './directives/v-highlight';
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

const app = createApp(App)

app.use(router)

// Custom directives
// Highlight directive that adds a green border for 2 seconds
app.directive('highlight', {
    mounted(el, binding) {
        if (binding.value) {
            el.classList.add('border', 'border-success')
            setTimeout(() => el.classList.remove('border', 'border-success'), 2000)
        }
    }
})

// Focus directive that focuses the element when mounted
app.directive('focus', {
    mounted(el) {
        el.focus && el.focus()
    }
})

// Registering v-highlight directive from external file
app.directive('v-highlight', vHighlight);

app.mount('#app')