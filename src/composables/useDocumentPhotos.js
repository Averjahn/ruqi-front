import { getAPIError } from '@/constants/helpers'
import axios from '@/plugins/axios'
import { useStore } from 'vuex'
import { ref, computed } from 'vue'

export default function useDocumentPhotos ({ needUpdateDocumentsStatuses } = {}) {
  const store = useStore()
  const photos = ref({})
  const loadings = ref({})
  const showNotification = (data) => store.dispatch('notifications/showNotification', data)
  const updateDocumentsStatuses = () => store.dispatch('profilePage/updateDocumentsStatuses')
  const user = computed(() => store.getters['user/user'])

  const deletePhoto = async (photoId) => {
    loadings.value[photoId] = true
    const file = photos.value[photoId] || {}
    const response = await axios.post('v2/user/documentfilestatus', {
      user_id: user.value.id,
      type: file.file_type,
      name: file.name,
      is_active: 0,
      file_id: file.id,
    })
    if (response?.data?.success) {
      photos.value[photoId] = {}
      if (needUpdateDocumentsStatuses) updateDocumentsStatuses()
    } else {
      showNotification({
        type: 'error',
        text: getAPIError(response) || 'Ошибка при удалении фото',
      })
    }
    loadings.value[photoId] = false
  }

  const addFile = async (file, type, photoId) => {
    loadings.value[photoId] = true
    const formData = new FormData()
    formData.append('user_id', user.value.id)
    formData.append('file', file)
    formData.append('type', type)
    formData.append('name', photoId)
    const response = await axios.post('v2/user/documentfile', formData)
    if (response?.data?.success) {
      photos.value[photoId] = response.data.data
      if (needUpdateDocumentsStatuses) updateDocumentsStatuses()
    } else {
      showNotification({
        type: 'error',
        text: getAPIError(response) || 'Ошибка при сохранении фото',
      })
    }
    loadings.value[photoId] = false
  }

  return {
    photos,
    loadings,
    deletePhoto,
    addFile,
  }
}
