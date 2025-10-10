import axios from '@/plugins/axios'

export const dictionary = {
  namespaced: true,

  state: {
    professions: [],
    isProfessionsLoad: false,
    professionsLoading: false,
  },

  getters: {
    professionsLoading (state) {
      return state.professionsLoading
    },
    professions (state) {
      return state.professions
    },
  },

  actions: {
    showError ({ dispatch }, text) {
      dispatch('notifications/showNotification', { type: 'error', text }, { root: true })
    },

    async fetchProfessionsOnce ({ state, dispatch }) {
      if (!state.isProfessionsLoad) await dispatch('fetchProfessions')
    },

    async fetchProfessions ({ commit, dispatch }) {
      commit('setProfessionsLoading', true)
      const professions = await axios.get('v1/dictionary/professions')
      if (Array.isArray(professions?.data?.data)) {
        commit('setProfessions', professions.data.data)
      } else {
        dispatch('showError', 'Ошибка при загрузке списка профессий')
      }
      commit('setProfessionsLoading', false)
    },
  },

  mutations: {
    setProfessionsLoading (state, value) {
      state.professionsLoading = value
    },
    setProfessions (state, professions) {
      state.professions = professions
      state.isProfessionsLoad = true
    },
  },
}
