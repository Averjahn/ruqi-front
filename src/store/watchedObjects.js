import axios from '@/plugins/axios'

export const watchedObjects = {
  namespaced: true,

  state: {
    watchedObjects: [],
  },

  getters: {
    watchedObjects: (state) => state.watchedObjects || [],
  },

  actions: {
    getWatchedObjects ({ commit }) {
      commit('setWatchedObjects', JSON.parse(localStorage.getItem('watchedObjectsStore')) || [])
    },

    async addToWatchedObject ({ commit, state }, uuid) {
      const object = state.watchedObjects.find((item) => item.uuid === uuid)
      if (object) {
        commit('addWatchedObject', object)
      } else {
        const response = await axios.get('v2/user/object', {
          params: { uuid },
          errorMessage: 'Не удалось загрузить данные объекта для добавления в просмотренные',
        })
        if (response?.data?.success) commit('addWatchedObject', response.data.data)
      }
    },
  },

  mutations: {
    setWatchedObjects: (state, watchedObjects) => {
      state.watchedObjects = watchedObjects
    },

    addWatchedObject (state, object) {
      const existingTaskIndex = state.watchedObjects.findIndex((item) => item.uuid === object.uuid)
      if (existingTaskIndex !== -1) state.watchedObjects.splice(existingTaskIndex, 1)
      state.watchedObjects.unshift(object)
      localStorage.setItem('watchedObjectsStore', JSON.stringify(state.watchedObjects))
    },
  },
}
