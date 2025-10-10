import axios from '@/plugins/axios'

export const auth = {
  namespaced: true,

  state: {
    isLogged: false,
  },

  getters: {
    isLogged (state) {
      return state.isLogged
    },
  },

  actions: {
    async auth ({ commit, dispatch }, token) {
      commit('setToken', token)
      await dispatch('user/fetchUser', null, { root: true })
    },

    async signIn ({ commit, dispatch }, payload) {
      const response = await axios.post('v2/auth/login/contractor', payload)
      if (response?.data?.success) {
        commit('setToken', response.data.data?.token)
        await dispatch('user/fetchUser', null, { root: true })
      }
      return response
    },

    async logOut ({ dispatch }) {
      localStorage.clear()
      await dispatch('rootActions/logout', null, { root: true })
      axios.setToken(null)
    },
  },

  mutations: {
    setToken (state, token) {
      localStorage.setItem('ruqi_employee_auth_data', token)
      axios.setToken(token)
      state.isLogged = true
    },
    checkToken (state) {
      const token = localStorage.getItem('ruqi_employee_auth_data')
      if (token) {
        axios.setToken(token)
        state.isLogged = true
      }
    },
  },
}
