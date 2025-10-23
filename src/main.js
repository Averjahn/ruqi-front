import { createApp } from 'vue'
import rqComponents from '@/components'
import axios from '@/plugins/axios'
import dayjs from '@/plugins/dayjs'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

export const createRqApp = (App, Definition) => {
  const app = createApp(App, Definition)

  rqComponents.forEach((component) => {
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

createRqApp(App).mount('#app')
