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
// Проверяем статус клиента при загрузке приложения
store.dispatch('auth/checkClientStatus').then((isClient) => {
  if (isClient) {
    console.log('✅ Клиент авторизован:', store.getters['auth/clientStatus'])
  } else {
    console.log('❌ Клиент не авторизован')
  }
})

router.beforeEach((to, from, next) => {
  store.dispatch('app/startLoading')
  const isLogged = store.getters['auth/isLogged']
  
  // Разрешаем доступ к страницам авторизации/регистрации всегда (даже при прямом вводе URL)
  const isAuthPage = to.path.startsWith('/client/signin') || 
                     to.path.startsWith('/client/signup') || 
                     to.path.startsWith('/client/signin-recovery') ||
                     to.path.startsWith('/client/organisationData')
  
  // Если это страница авторизации - всегда разрешаем доступ
  if (isAuthPage) {
    next()
    return
  }
  
  // Если страница требует авторизации и пользователь не залогинен
  if (to.matched.some((record) => record.meta.requiresAuth) && !isLogged) {
    next({ path: '/client/signin' })
    store.dispatch('app/stopLoading')
    return
  }
  
  // Для всех остальных случаев разрешаем переход
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
