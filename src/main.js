import { createApp } from 'vue'
import axios from '@/plugins/axios'
import dayjs from '@/plugins/dayjs'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

// Lazy load components to reduce initial bundle size
const rqComponents = () => import('@/components')

export const createRqApp = async (App, Definition) => {
  const app = createApp(App, Definition)

  // Load components asynchronously
  const components = await rqComponents()
  components.default.forEach((component) => {
    app.component(component.name, component)
  })

  app.config.unwrapInjectedRef = true
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$dayjs = dayjs
  app.config.errorHandler = function (err, vm, info) {
    if (window.RqloggerError) window.RqloggerError({ type: 'vue', error: { err, vm, info } })
  }

  return app.use(store).use(router)
}

createRqApp(App).then(app => app.mount('#app'))
