import axios from '@/plugins/axios'

export const finances = {
  namespaced: true,

  state: {
    acts: [],
  },

  getters: {
    acts (state) {
      return state.acts
    },
  },

  actions: {
    async fetchBalances () {
      return await axios.get('v2/user/balance')
    },

    async fetchActs ({ commit }, { params, concat }) {
      if (!concat) {
        commit('clearActs')
      }

      const acts = await axios.get('v2/user/timesheetitems', {
        params,
      })

      if (acts.data.success) {
        commit('setActs', { acts, concat })
      }

      return acts
    },
  },

  mutations: {
    clearActs (state) {
      state.acts = []
    },
    setActs (state, { acts, concat }) {
      state.acts = concat ? state.acts.concat(acts.data.data) : acts.data.data
    },
  },
}
