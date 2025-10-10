import { getAPIError } from '@/constants/helpers'
import axios from '@/plugins/axios'

export const user = {
  namespaced: true,

  state: {
    user: {
      settings: {},
      visibility_sections: [],
    },
    notificationsCount: {
      all: 0,
      important: 0,
      system: 0,
    },
  },

  getters: {
    user (state) {
      return state.user
    },
    notificationsCount (state) {
      return state.notificationsCount
    },
  },

  actions: {
    showError ({ dispatch }, text) {
      dispatch('notifications/showNotification', { text }, { root: true })
    },

    async fetchUser ({ commit, dispatch }) {
      if (!this.getters['auth/isLogged']) return
      const response = await axios.get('v1/user/my')
      if (response?.data?.data) {
        commit('updateUserData', response.data.data)
      } else {
        dispatch('showError', 'Не удалось получить пользователя')
      }
    },

    async fetchNotificationsCount ({ commit }) {
      const response = await axios.get('v2/user/notification/getcount', {
        errorMessage: 'Ошибка при получении количества непрочитанных уведомлений',
      })
      if (response?.data?.success) commit('setNotificationsCount', response.data.data)
    },

    async fetchNotifications ({ dispatch, commit }, params) {
      const response = await axios.get(process.env.API_NOTIFICATION_URL + 'v1/notifications', { params })
      if (response?.data?.success) {
        return response
      } else {
        dispatch('showError', getAPIError({ response, message: 'Ошибка при получении уведомлений' }))
      }
    },

    async putReadNotifications ({ commit, dispatch }, body) {
      const response = await axios.put('/user/notifications/read/', body)
      if (response?.data?.success) {
        return response
      } else {
        dispatch(
          'showError',
          getAPIError({ response, message: 'Ошибка при изменении стутса непрочитанных уведомлений' }),
        )
      }
    },

    async putAvailability ({ commit, dispatch }, ready_status) {
      const response = await axios.put('v2/user/readystatus', { ready_status })
      if (response?.data?.success) {
        commit('updateUserData', {
          ready_status: response.data.data.ready_status,
        })
        return true
      } else {
        dispatch('showError', getAPIError(response) || 'Не удалось сменить статус')
        return false
      }
    },
  },

  mutations: {
    updateUserData (state, payload) {
      state.user = {
        ...state.user,
        ...JSON.parse(JSON.stringify(payload)),
      }
    },
    setNotificationsCount (state, notificationsCount) {
      state.notificationsCount = notificationsCount
    },
    setViewedFiltersTrue (state) {
      state.user = {
        ...state.user,
        is_filter_view: true,
      }
    },
  },
}
