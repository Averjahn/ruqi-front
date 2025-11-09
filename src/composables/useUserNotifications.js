import axios from '@/plugins/axios'
import { ref } from 'vue'
import router from '@/router'
import { USER_NOTIFICATIONS } from '@/constants/constants'
import testNotificationsData from '@/test-notifications.json'

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
  const allTestNotifications = ref(testNotificationsData?.data || [])
  
  // Отладочный вывод для проверки загрузки данных
  if (allTestNotifications.value.length === 0) {
    console.warn('Test notifications data is empty!', testNotificationsData)
  } else {
    console.log('Test notifications loaded:', allTestNotifications.value.length, 'items')
  }

  const sendReadStatus = async (notification_ids) => {
    // ВРЕМЕННО ОТКЛЮЧЕНО: запрос к API уведомлений
    // const response = await axios.put(
    //   'v2/user/notification/massupdate',
    //   { notification_ids, web_status: 3 },
    //   { errorMessage: 'Ошибка при изменении статуса уведомления' },
    // )
    // if (response?.data?.success) {
    //   userNotifications?.value?.forEach((notification) => {
    //     if (notification_ids?.includes(notification.id)) notification.web_status = 3
    //   })
    // }
    
    // Обновляем статус локально без запроса к API
    userNotifications?.value?.forEach((notification) => {
      if (notification_ids?.includes(notification.id)) notification.web_status = 3
    })
  }

  const sendReadStatusAll = async () => {
    // ВРЕМЕННО ОТКЛЮЧЕНО: запрос к API уведомлений
    // const response = await axios.put(
    //   'v2/user/notification/massupdate',
    //   { web_status: 3, all: true },
    //   { errorMessage: 'Ошибка при изменении статуса уведомления' },
    // )
    // if (response?.data?.success) {
    //   userNotifications?.value?.forEach((notification) => (notification.web_status = 3))
    // }
    
    // Обновляем статус локально без запроса к API
    userNotifications?.value?.forEach((notification) => (notification.web_status = 3))
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
    
    // ВРЕМЕННО ОТКЛЮЧЕНО: запрос к API уведомлений
    // try {
    //   const response = await axios.get('v2/user/notification/list', {
    //     params: params.value,
    //     errorMessage: 'Ошибка при получении списка уведомлений',
    //   })
    //   if (response?.data?.success && response?.data?.data?.length > 0) {
    //     totalPages.value = response?.data?.meta?.last_page
    //     userNotifications.value = [...userNotifications.value, ...response.data?.data]
    //     busy.value = response.data.meta?.current_page >= response.data.meta?.last_page
    //     loading.value = false
    //     return
    //   }
    // } catch (error) {
    //   console.log('API error, using test data:', error)
    // }
    
    // Используем тестовые данные из JSON файла
    const testData = allTestNotifications.value || []
    
    if (testData.length === 0) {
      console.error('No test notifications data available!')
      loading.value = false
      return
    }
    
    const perPage = params.value.per_page || 5
    const currentPage = params.value.page || 1
    const startIndex = (currentPage - 1) * perPage
    const endIndex = startIndex + perPage
    const pageData = testData.slice(startIndex, endIndex)
    
    if (concat) {
      userNotifications.value = [...userNotifications.value, ...pageData]
    } else {
      userNotifications.value = pageData
    }
    
    // Вычисляем общее количество страниц
    totalPages.value = Math.ceil(testData.length / perPage) || 1
    busy.value = currentPage >= totalPages.value
    loading.value = false
  }

  const loadPage = async (page) => {
    loading.value = true
    params.value.page = page
    
    // ВРЕМЕННО ОТКЛЮЧЕНО: запрос к API уведомлений
    // try {
    //   const response = await axios.get('v2/user/notification/list', {
    //     params: params.value,
    //     errorMessage: 'Ошибка при получении списка уведомлений',
    //   })
    //   if (response?.data?.success && response?.data?.data?.length > 0) {
    //     userNotifications.value = response.data?.data
    //     loading.value = false
    //     return true
    //   }
    // } catch (error) {
    //   console.log('API error, using test data:', error)
    // }
    
    // Используем тестовые данные из JSON файла
    const testData = allTestNotifications.value || []
    
    if (testData.length === 0) {
      console.error('No test notifications data available!')
      loading.value = false
      return false
    }
    
    const perPage = params.value.per_page || 5
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    userNotifications.value = testData.slice(startIndex, endIndex)
    loading.value = false
    return true
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
