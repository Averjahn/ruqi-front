import { getAPIError } from '@/constants/helpers'
import axios from '@/plugins/axios'

export const payments = {
  namespaced: true,

  state: {
    payments: [],
  },

  getters: {
    payments (state) {
      return state.payments
    },
  },

  actions: {
    showError ({ dispatch }, response, text) {
      dispatch('notifications/showNotification', { type: 'error', text: getAPIError(response) || text }, { root: true })
    },

    async fetchPayments ({ dispatch, commit }) {
      const response = await axios.get('v2/user/paymentinfos')
      if (response?.data?.success) {
        commit('setPayments', response.data.data)
      } else {
        dispatch('showError', response, 'Ошибка при загрузке списка оплат')
      }
    },

    async updatePayments ({ dispatch, commit }, payments) {
      const response = await axios.patch('v2/user/paymentinfos/edit', payments)
      if (response?.data?.success) {
        commit('setPayments', response.data.data)
      } else {
        dispatch('showError', response, 'Ошибка при сохранении списка оплат')
      }
    },
  },

  mutations: {
    setPayments (state, data) {
      state.payments = data
    },
  },
}
