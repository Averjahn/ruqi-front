<template>
  <section class="confirm-popup">
    <h4 class="confirm-popup__title">Введите код из {{ codeTypeText.headerTarget }}</h4>

    <div class="confirm-popup__description">
      Отправили {{ codeTypeText.type }} с кодом на
      {{ codeTypeText.target  }} <b>{{ confirmTarget }}</b> <br />
      Введите его в поле ниже
    </div>

    <OtpInput :isValid="isCodeValid" class="confirm-popup__otp-input" @onChanged="onChanged">
      <template #errorMessage>Неверный код</template>
    </OtpInput>

    <ButtonText
      v-if="!isTimerRunning"
      type="s"
      @click="$emit('repeatCode', 'telegram')"
      class="confirm-popup__repeat-button"
    >
      Отправить код еще раз
    </ButtonText>
    <ButtonText
      v-if="!isTimerRunning"
      type="s"
      @click="$emit('repeatCode', 'sms')"
      class="confirm-popup__repeat-button"
    >
      Получить код из СМС
    </ButtonText>

    <div v-else class="confirm-popup__description">
      Отправить еще раз <b>через {{ remaining }}</b>
    </div>

    <div class="confirm-popup__action">
      <Button @click="$emit('close')" type="outlined" class="confirm-popup__button">Назад</Button>
      <Button :loading="loading" :disabled="continueDisabled" class="confirm-popup__button" @click="submit">
        Продолжить
      </Button>
    </div>
  </section>
</template>

<script>
import { mapActions } from 'vuex'
import { getAPIError } from '@/constants/helpers'
import OtpInput from '@/components/atoms/OtpInput.vue'

export default {
  name: 'CodeConfirmPopup',
  components: { OtpInput },
  props: {
    confirmTarget: {
      type: String,
      default: '',
    },
    confirmMethod: {
      type: String,
      default: 'telegram',
    },
    onceToken: {
      type: String,
      default: '',
    },
    isTimerRunning: {
      type: Boolean,
      default: true,
    },
    remaining: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      continueDisabled: true,
      loading: false,
      isCodeValid: true,
      code: null,
    }
  },
  computed: {
    codeTypeText () {
      switch (this.confirmMethod) {
        case 'sms':
          return {
            headerTarget: 'смс',
            target: 'номер',
            type: 'смс',
          }
        case 'email':
        return {
          headerTarget: 'email',
            target: 'email',
            type: 'письмо',
          }
        case 'telegram':
        return {
          headerTarget: 'телеграм',
            target: 'телеграм',
            type: 'сообщение',
          }
        default:
        return {
          headerTarget: 'телеграм',
            target: 'телеграм',
            type: 'сообщение',
          }
      }
    },
  },
  mounted () {},
  unmounted () {},
  methods: {
    ...mapActions('notifications', ['showNotification']),
    ...mapActions('auth', ['signIn']),

    onChanged (event) {
      this.code = event
      this.continueDisabled = event.length < 4
    },

    async submit () {
      this.loading = true

      const response = await this.$axios.post('v2/preregistration/code/submit', {
        once_token: this.onceToken,
        code: this.code,
      })
      if (response?.data?.success) {
        await this.signIn({
          once_token: this.onceToken,
        })

        this.$router.push('/')
      } else {
        if (response?.data?.error[0].msg === 'Неверный код подтверждения') {
          this.isCodeValid = false
        }
        this.showNotification({ text: getAPIError(response) || 'Ошибка при попытке отправить данные на сервер' })
      }

      this.loading = false
    },
  },
}
</script>

<style lang="scss">
.confirm-popup {
  padding: 32px;
  text-align: center;
  background: #fff;
  max-width: 600px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 32px;
}

.confirm-popup__title {
  margin-bottom: 24px;
}

.confirm-popup__description {
  color: #263043;
  line-height: 22px;
  margin-bottom: 24px;
}

.confirm-popup__otp-input {
  margin: 0 auto 24px auto;
}

.confirm-popup__action {
  display: flex;
  column-gap: 24px;
  row-gap: 12px;
  flex-wrap: wrap;
}

.confirm-popup__repeat-button {
  margin-bottom: 24px;
  text-decoration: underline;
  font-weight: 400;
}

.confirm-popup__button {
  min-width: 244px;
  flex: 1;
}
</style>
