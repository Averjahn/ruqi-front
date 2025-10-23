<template>
  <div class="telegram-auth">
    <MainButton
      type="primary"
      text="Войти через Telegram"
      :loading="loading"
      :disabled="loading"
      class="telegram-auth__button"
      @click="initTelegramAuth"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import MainButton from '@/components/atoms/MainButton.vue'
import { getAPIError } from '@/constants/helpers'

export default {
  name: 'TelegramAuth',
  components: { MainButton },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['success', 'error'],
  methods: {
    ...mapActions('notifications', ['showNotification']),
    ...mapActions('auth', ['auth']),

    initTelegramAuth() {
      // Проверяем, что Telegram WebApp доступен
      if (window.Telegram && window.Telegram.WebApp) {
        this.authenticateWithTelegram()
      } else {
        // Если Telegram WebApp недоступен, показываем инструкции
        this.showTelegramInstructions()
      }
    },

    async authenticateWithTelegram() {
      try {
        const tg = window.Telegram.WebApp
        
        // Получаем данные пользователя из Telegram
        const user = tg.initDataUnsafe?.user
        if (!user) {
          throw new Error('Не удалось получить данные пользователя из Telegram')
        }

        // Формируем данные для отправки на сервер
        const telegramData = {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username,
          photo_url: user.photo_url,
          auth_date: tg.initDataUnsafe?.auth_date,
          hash: tg.initDataUnsafe?.hash
        }

        // Отправляем запрос на авторизацию
        const response = await this.$axios.post('v2/auth/telegram', telegramData)
        
        if (response?.data?.success && response?.data?.data?.token) {
          // Успешная авторизация
          await this.auth(response.data.data.token)
          this.$emit('success')
          this.$router.push('/')
        } else {
          throw new Error(getAPIError(response) || 'Ошибка авторизации через Telegram')
        }
      } catch (error) {
        console.error('Telegram auth error:', error)
        this.showNotification({
          type: 'error',
          text: error.message || 'Ошибка авторизации через Telegram'
        })
        this.$emit('error', error)
      }
    },

    showTelegramInstructions() {
      this.showNotification({
        type: 'info',
        text: 'Для авторизации через Telegram откройте приложение в Telegram боте'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.telegram-auth {
  &__button {
    width: 100%;
    min-height: 48px;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
