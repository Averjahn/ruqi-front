const initialState = () =>
  JSON.parse(
    JSON.stringify({
      isVisible: false,
      text: '',
      type: 'error',
      await: false,
    }),
  )

let timerId

export const notifications = {
  namespaced: true,

  state: {
    notification: initialState(),
  },

  getters: {
    notification (state) {
      return state.notification
    },
  },

  actions: {
    showNotification ({ commit }, data) {
      data.isVisible = true
      commit('setNotification', data)
      clearTimeout(timerId)
      timerId = setTimeout(() => {
        commit('removeNotification')
      }, data?.timeout ?? 3000)
    },
  },

  mutations: {
    setNotification (state, data) {
      state.notification = Object.assign(initialState(), data)
    },
    removeNotification (state) {
      state.notification = Object.assign({}, initialState())
    },
  },
}
