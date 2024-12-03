import { createApp } from 'vue'
import App from './App.vue'

import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'

/**
 * https://cn.vitejs.dev/guide/build#load-error-handling
 */
window.addEventListener('vite:preloadError', () => {
  window.location.reload()
})

// window.addEventListener('beforeunload', (event) => {
//   event.preventDefault()
//   event.returnValue = ''
// })

createApp(App).mount('#app')
