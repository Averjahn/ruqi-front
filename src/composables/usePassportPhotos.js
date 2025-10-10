import { getAPIError } from '@/constants/helpers'
import axios from '@/plugins/axios'
import { useStore } from 'vuex'
import { ref } from 'vue'

export default function usePassportPhotos ({
  needUpdateDocumentsStatuses,
  deletePhotoUrl = 'v2/user/passportfile',
  addPhotoUrl = 'v2/user/passportfile',
} = {}) {
  const store = useStore()
  const photos = ref({})
  const loadings = ref({})
  const preregToken = ref(null)
  const showNotification = (data) => store.dispatch('notifications/showNotification', data)
  const updateDocumentsStatuses = () => store.dispatch('profilePage/updateDocumentsStatuses')

  const deletePhoto = async (photoId) => {
    loadings.value[photoId] = true
    const file = photos.value[photoId] || {}
    const params = {
      file_id: file.id,
    }
    if (preregToken.value) params.prereg_token = preregToken.value
    const response = await axios.delete(deletePhotoUrl, { params })
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

  const addPhoto = async (file, photoId) => {
    loadings.value[photoId] = true
    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', photoId)
    if (preregToken.value) formData.append('prereg_token', preregToken.value)
    const response = await axios.post(addPhotoUrl, formData)
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

  const fetchPhoto = async () => {
    loadings.value.all = true
    const response = await axios.get('v2/user/passport')
    if (response?.data?.success) {
      response.data.data?.passport_files?.forEach((item) => (photos.value[item.file_type] = item))
    } else {
      showNotification({
        type: 'error',
        text: getAPIError(response) || 'Ошибка при получении фото',
      })
    }
    loadings.value.all = false
  }

  return {
    photos,
    loadings,
    deletePhoto,
    addPhoto,
    fetchPhoto,
    preregToken,
  }
}
