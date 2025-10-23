<template>
  <div class="container">
    <img class="mb_24" src="@/assets/icon_deprecated/confirm.svg" />
    <div class="description">
      Подтвердите регистрацию в системе RUQI. Недавно вы заполнили анкету регистрации в нашей системе, мы хотим знать
      что это точно были вы. Для подтверждения регистрации, нажмите кнопку ниже
    </div>
    <div class="button_block">
      <MainButton class="action_button" :loading="loading" @click="approveEmail">Перейти в личный кабинет</MainButton>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getAPIError } from '@/constants/helpers'
export default {
  name: 'unavailablePage',
  data () {
    return {
      loading: false,
    }
  },
  mounted () {
    this.approveEmail()
  },
  methods: {
    ...mapActions('notifications', ['showNotification']),
    ...mapActions('auth', ['auth']),

    async approveEmail () {
      this.loading = true
      const response = await this.$axios.post('v2/auth/login/contractor', {
        confirm_token: this.$route.query.confirm_token,
      })
      if (response?.data?.success) {
        await this.auth(response?.data?.data?.token)
      } else {
        this.showNotification({ type: 'error', text: getAPIError(response) || 'Ошибка при получении токена' })
      }
      this.loading = false
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
.button_block {
  display: flex;
  justify-content: center;
}
.action_button {
  flex: 1;
  max-width: 460px;
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
