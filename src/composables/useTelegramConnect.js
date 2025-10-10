import axios from '@/plugins/axios'
import { ref } from 'vue'

export default function useTelegramConnect () {
  let telegramLoading = ref(false)
  let telegramLink = ref(false)
  let response = null

  const connectTelegram = async () => {
    if (telegramLoading.value) await response
    if (!telegramLink.value) await fetchTelegramLink()
    if (telegramLink.value) window.open(telegramLink.value, '_blank')
  }

  const fetchTelegramLink = async () => {
    telegramLoading.value = true
    response = await axios.get('v2/user/telegram/link', {
      errorMessage: 'Ошибка при получении ссылки на телеграм бота',
    })
    if (response?.data?.success) telegramLink.value = response.data.data?.telegramLink
    telegramLoading.value = false
  }

  return {
    telegramLoading,
    connectTelegram,
    telegramLink,
  }
}
