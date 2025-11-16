import axios from '@/plugins/axios'
import authApi from '@/services/authApi'

export const auth = {
  namespaced: true,

  state: {
    isLogged: false,
    clientStatus: null,
  },

  getters: {
    isLogged (state) {
      return state.isLogged
    },
    clientStatus (state) {
      return state.clientStatus
    },
    isClient (state) {
      return state.clientStatus !== null
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

    async logOut ({ commit, dispatch }) {
      // Очищаем токен из axios
      axios.setToken(null)
      // Очищаем состояние авторизации
      commit('clearAuth')
      // Очищаем localStorage
      localStorage.removeItem('ruqi_employee_auth_data')
      // Вызываем rootActions logout если есть
      try {
        await dispatch('rootActions/logout', null, { root: true })
      } catch (e) {
        // Игнорируем ошибку если rootActions/logout не существует
      }
    },

    async checkClientStatus ({ commit, dispatch }) {
      try {
        const result = await authApi.getClientStatus()
        if (result.success) {
          // Клиент авторизован, обновляем состояние
          commit('setClientStatus', result.data)
          return true
        } else {
          // Клиент не авторизован или ошибка
          commit('clearClientStatus')
          return false
        }
      } catch (error) {
        // Ошибка сети или сервера
        commit('clearClientStatus')
        return false
      }
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
    setClientStatus (state, status) {
      state.clientStatus = status
    },
    clearClientStatus (state) {
      state.clientStatus = null
    },
    clearAuth (state) {
      state.isLogged = false
      state.clientStatus = null
    },
  },
}
