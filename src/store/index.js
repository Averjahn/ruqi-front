import { createStore } from 'vuex'
import { notifications } from './notifications.js'
import { auth } from './auth.js'
import { watchedObjects } from './watchedObjects.js'
import { user } from './user.js'
import { dictionary } from './dictionary.js'
import { finances } from './finances.js'
import { payments } from './payments.js'
import { profilePage } from './profilePage.js'
import { app } from './app.js'

const store = createStore({
  modules: {
    notifications,
    auth,
    watchedObjects,
    user,
    dictionary,
    finances,
    payments,
    profilePage,
    app,
  },
})

const initialState = JSON.parse(JSON.stringify(store.state))

store.registerModule('rootActions', {
  namespaced: true,
  actions: {
    async logout ({}) {
      await store.replaceState(JSON.parse(JSON.stringify(initialState)))
    },
  },
})

export default store
