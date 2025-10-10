import axios from '@/plugins/axios'
import { ref } from 'vue'
import router from '@/router'
import { USER_NOTIFICATIONS } from '@/constants/constants'

export default function useUserNotifications () {
  const params = ref({
    page: 1,
    per_page: 5,
    filters: [],
  })
  const busy = ref(true)
  const loading = ref(false)
  const totalPages = ref(0)
  const userNotifications = ref([])

  const sendReadStatus = async (notification_ids) => {
    const response = await axios.put(
      'v2/user/notification/massupdate',
      { notification_ids, web_status: 3 },
      { errorMessage: 'Ошибка при изменении статуса уведомления' },
    )
    if (response?.data?.success) {
      userNotifications?.value?.forEach((notification) => {
        if (notification_ids?.includes(notification.id)) notification.web_status = 3
      })
    }
  }

  const sendReadStatusAll = async () => {
    const response = await axios.put(
      'v2/user/notification/massupdate',
      { web_status: 3, all: true },
      { errorMessage: 'Ошибка при изменении статуса уведомления' },
    )
    if (response?.data?.success) {
      userNotifications?.value?.forEach((notification) => (notification.web_status = 3))
    }
  }

  const navigateTo = async (notification) => {
    let rawUrl

    if (notification?.type === 'mailing_app') {
      rawUrl = USER_NOTIFICATIONS[notification.mailing_list?.type]?.getLink(notification)
    } else {
      rawUrl = USER_NOTIFICATIONS[notification.type]?.getLink(notification)
    }
    if (!rawUrl) return
    const isRelative = !/^https?:\/\//.test(rawUrl) && !rawUrl.includes('.')
    if (isRelative) {
      await router.push(rawUrl)
    } else {
      let fullUrl = rawUrl
      if (!/^https?:\/\//.test(fullUrl)) {
        fullUrl = 'https://' + fullUrl
      }
      const urlObj = new URL(fullUrl)
      const isExternal = urlObj.hostname !== window.location.hostname
      if (isExternal) {
        window.open(fullUrl, '_blank')
      } else {
        await router.push(urlObj.pathname + urlObj.search + urlObj.hash)
      }
    }
    sendReadStatus([notification.id])
  }

  const fetchUserNotifications = async (concat = false) => {
    loading.value = true
    if (!concat) {
      params.value.page = 1
      userNotifications.value = []
    }
    const response = await axios.get('v2/user/notification/list', {
      params: params.value,
      errorMessage: 'Ошибка при получении списка уведомлений',
    })
    if (response?.data?.success) {
      totalPages.value = response?.data?.meta?.last_page
      userNotifications.value = [...userNotifications.value, ...response.data?.data]
      busy.value = response.data.meta?.current_page >= response.data.meta?.last_page
    }
    loading.value = false
  }

  const loadPage = async (page) => {
    loading.value = true
    params.value.page = page
    const response = await axios.get('v2/user/notification/list', {
      params: params.value,
      errorMessage: 'Ошибка при получении списка уведомлений',
    })
    if (response?.data?.success) userNotifications.value = response.data?.data
    loading.value = false
    return !!response?.data?.success
  }

  const loadMore = () => {
    if (busy.value || loading.value) return
    params.value.page++
    fetchUserNotifications(true)
  }

  return {
    loading,
    fetchUserNotifications,
    userNotifications,
    loadMore,
    navigateTo,
    sendReadStatus,
    sendReadStatusAll,
    totalPages,
    loadPage,
  }
}
