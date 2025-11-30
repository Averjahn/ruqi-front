export const profileDocuments = {
  namespaced: true,
  state: {
    acts: [
      {
        name: 'Смирнова В.К.',
        status: {
          type: 'needs-signature',
          text: 'Нужно подписать',
        },
        createdDate: '01.10.2021',
        requestName: 'Название заявки',
      },
      {
        name: 'ООО «Секвоя»',
        validityPeriod: '01.10.2022',
        createdDate: '01.10.2021',
        requestName: 'Название заявки',
      },
      {
        name: 'Иванов И.И.',
        status: {
          type: 'needs-signature',
          text: 'Нужно подписать',
        },
        createdDate: '01.10.2021',
        requestName: 'Название заявки',
      },
    ],
    actsTotalCount: 100,
    contracts: [
      {
        performerName: 'Иванов И.И.',
        status: {
          type: 'needs-signature',
          text: 'Нужно подписать',
        },
        documentType: 'Пользовательское соглашение',
        createdDate: '01.10.2021',
        signedDate: null,
      },
      {
        performerName: 'Петров П.П.',
        status: {
          type: 'signed',
          text: 'Подписан',
        },
        createdDate: '01.10.2021',
        signedDate: '01.10.2021',
      },
    ],
    contractsTotalCount: 100,
  },
  getters: {
    acts: (state) => state.acts,
    actsTotalCount: (state) => state.actsTotalCount,
    contracts: (state) => state.contracts,
    contractsTotalCount: (state) => state.contractsTotalCount,
  },
  mutations: {
    setActs(state, acts) {
      state.acts = Array.isArray(acts) ? acts : []
    },
    setActsTotalCount(state, count) {
      state.actsTotalCount = Number.isFinite(count) ? count : 0
    },
    setContracts(state, contracts) {
      state.contracts = Array.isArray(contracts) ? contracts : []
    },
    setContractsTotalCount(state, count) {
      state.contractsTotalCount = Number.isFinite(count) ? count : 0
    },
  },
  actions: {
    updateActs({ commit }, { acts, totalCount }) {
      commit('setActs', acts)
      if (totalCount !== undefined) {
        commit('setActsTotalCount', totalCount)
      } else if (Array.isArray(acts)) {
        commit('setActsTotalCount', acts.length)
      }
    },
    updateContracts({ commit }, { contracts, totalCount }) {
      commit('setContracts', contracts)
      if (totalCount !== undefined) {
        commit('setContractsTotalCount', totalCount)
      } else if (Array.isArray(contracts)) {
        commit('setContractsTotalCount', contracts.length)
      }
    },
  },
}











