<template>
  <div class="container">
    <img class="mb_24" src="@/assets/icon_deprecated/mail.svg" />
    <div class="description">
      Подтверждение привязки email...
    </div>
    <div v-if="loading" class="loading">
      Обработка запроса...
    </div>
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import authApiService from '@/services/authApi'

export default {
  name: 'EmailConfirmPage',
  data () {
    return {
      loading: false,
      error: null,
    }
  },
  async mounted () {
    await this.confirmEmail()
  },
  methods: {
    ...mapActions('notifications', ['showNotification']),

    async confirmEmail () {
      const hash = this.$route.query.hash
      
      if (!hash) {
        this.error = 'Хэш не найден в ссылке'
        this.showNotification({ type: 'error', text: 'Хэш не найден в ссылке' })
        return
      }

      this.loading = true
      this.error = null

      try {
        const response = await authApiService.confirmEmailBind(hash)
        
        if (response.success) {
          this.showNotification({ type: 'success', text: 'Email успешно привязан' })
          this.$router.push('/client/profile')
        } else {
          const errorMessage = response.error?.[0]?.msg || response.error || 'Ошибка при подтверждении email'
          this.error = errorMessage
          this.showNotification({ type: 'error', text: errorMessage })
        }
      } catch (error) {
        const errorMessage = 'Ошибка при подтверждении email'
        this.error = errorMessage
        this.showNotification({ type: 'error', text: errorMessage })
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 64px 24px 60px 24px;
  text-align: center;
}
.description {
  color: #7a91a9;
  font-size: 18px;
  font-weight: 600;
  margin: 0 auto;
  margin-bottom: 24px;
  max-width: 560px;
}
.loading {
  color: #7a91a9;
  font-size: 16px;
  margin-top: 16px;
}
.error {
  color: #e74c3c;
  font-size: 16px;
  margin-top: 16px;
}
@media (max-width: 490px) {
  .container {
    padding: 32px 24px 60px 24px;
    h1 {
      font-size: 35px;
      line-height: 38px;
    }
  }
}
</style>
