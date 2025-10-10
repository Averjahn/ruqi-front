import { useStore } from 'vuex'
import { computed, onBeforeUnmount } from 'vue'

export default function useGlobalLoading () {
  const store = useStore()
  let localCounter = 0

  const loading = computed(() => store.getters['app/loading'])

  const startLoading = () => {
    localCounter++

    store.dispatch('app/startLoading')
  }

  const stopLoading = () => {
    localCounter--
    store.dispatch('app/stopLoading')
  }

  const resetLoading = () => {
    localCounter = 0
    store.commit('app/setLoading', 0)
  }

  onBeforeUnmount(() => {
    store.commit('app/setLoading', store.getters['app/loadingCounter'] - localCounter)
  })

  return {
    resetLoading,
    startLoading,
    stopLoading,
    loading,
  }
}
