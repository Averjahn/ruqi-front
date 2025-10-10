<template>
  <div class="container">
    <img class="mb_24" src="@/assets/icon_deprecated/mail.svg" />
    <div class="description">
      Мы получили запрос на изменение email, привязанного к вашему аккаунту RUQI.ru. Чтобы подтвердить изменение email,
      нажмите кнопку:
    </div>
    <div class="button_block">
      <Button class="action_button" :loading="loading" @click="approveEmail">Подтвердить email</Button>
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
  mounted () {},
  methods: {
    ...mapActions('notifications', ['showNotification']),

    async approveEmail () {
      this.loading = true
      const response = await this.$axios.patch('v2/user/setnewloginemail', {
        token: this.$route.query.hash,
      })
      if (response?.data?.success) {
        this.showNotification({ type: 'success', text: 'Email успешно подтверждён' })
        this.$router.push('/')
      } else {
        this.showNotification({ type: 'error', text: getAPIError(response) || 'Ошибка при подтверждении email' })
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
