import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes.js'
import store from '@/store'

const router = createRouter({
  history: createWebHistory(''),
  routes,
  scrollBehavior (to, from, savedPosition) {
    const scrollableElement = document.getElementById('default_layout')
    if (!scrollableElement) return false
    if (savedPosition) {
      scrollableElement.scrollTo(savedPosition)
      return false
    }
    if (to.hash) {
      const targetElement = document.querySelector(to.hash)
      if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' })
      return false
    }
    scrollableElement.scrollTo({ top: 0 })
    return false
  },
})

store.commit('auth/checkToken')
await store.dispatch('user/fetchUser')

router.beforeEach((to, from, next) => {
  store.dispatch('app/startLoading')
  const isLogged = store.getters['auth/isLogged']
  if (to.fullPath.includes('signin') && isLogged) {
    next({ path: '/' })
    store.dispatch('app/stopLoading')
    return
  }
  if (to.matched.some((record) => record.meta.requiresAuth) && !isLogged) {
    next({ path: '/client/signin' })
    store.dispatch('app/stopLoading')
    return
  }
  next()
})

router.afterEach(() => {
  store.dispatch('app/stopLoading')
})

router.onError((e) => {
  store.dispatch('app/stopLoading')
  window.RqloggerError({ type: 'router', error: e })
})
export default router
