export const app = {
  namespaced: true,

  state: {
    loading: 0,
  },

  getters: {
    loadingCounter (state) {
      return state.loading
    },
    loading (state) {
      return state.loading > 0
    },
  },

  actions: {
    startLoading ({ commit }) {
      commit('increment')
    },
    stopLoading ({ commit }) {
      commit('decrement')
    },
  },

  mutations: {
    setLoading (state, value) {
      state.loading = value
    },
    increment (state) {
      state.loading++
    },
    decrement (state) {
      state.loading = Math.max(state.loading - 1, 0)
    },
  },
}
