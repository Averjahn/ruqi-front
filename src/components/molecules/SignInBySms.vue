<template>
  <template v-if="step === 2">
    <div class="sign_in_by_sms_container">
      <div class="logo_icons">
        <div class="form_header">Введите код из SMS</div>
        <p class="recover-password__description">
          Мы отправили SMS с кодом на номер <br />
          {{ phone }}
        </p>
      </div>

      <OtpInput :isValid="isCodeValid" class="code_input" @onInput="onChangedCode">
        <template #errorMessage>Неверный код</template>
      </OtpInput>

      <div class="footer_actions">
        <Button
          size="l"
          :loading="loading"
          :disabled="continueDisabled"
          class="recover-password__btn"
          @click="submitCode"
        >
          Продолжить
        </Button>

        <div>
          <div class="remaining" v-if="isTimerRunning">
            Повторная отправка кода через <b>{{ remainingTimeString }}</b>
          </div>
          <ButtonText v-else class="recover-password__resent-link" type="s" @click="sendCodeAgain">
            Отправить код еще раз
          </ButtonText>
        </div>
        <ButtonText :disabled="isTimerRunning" type="s" @click="goBack">Назад</ButtonText>
      </div>
    </div>
  </template>
</template>

<script>
import { mapActions } from 'vuex'
import { clearPhoneAlwaysSeven, clearPhoneWithoutPlus, getStringFromSeconds } from '@/constants/helpers'
import { rules, rulesSets } from '@/constants/validations'
import { formatPhone } from '@/constants/masks'
import OtpInput from '@/components/atoms/OtpInput.vue'
import useTimer from '@/composables/useSnackbarTimer'

export default {
  components: { OtpInput },
  name: 'SignInBySms',
  layout: 'empty',
  props: {
    phone: {
      type: String,
      default: '',
    },
  },
  setup () {
    const { launchTimer, isTimerRunning, remaining, clearTimer } = useTimer({
      timerId: 'signinBySms',
    })
    return {
      launchTimer,
      isTimerRunning,
      remaining,
    }
  },
  data () {
    return {
      rules,
      rulesSets,
      step: 1,
      code: null,
      continueDisabled: true,
      loading: false,
      isCodeValid: true,
      // phone: '',
      inputRules: [(v) => !!v || 'Заполните поле'],
      passwordRules: [(v) => !!v || 'Заполните поле'],
    }
  },
  computed: {
    remainingTimeString () {
      return getStringFromSeconds(this.remaining)
    },
    disableHandler () {
      return !this.phone
    },
  },
  mounted () {
    this.step = 2
    this.launchTimer(180)
  },
  methods: {
    ...mapActions('notifications', ['showNotification']),
    ...mapActions('auth', ['auth']),

    onSubmit () {
      if (!this.$refs.sms_form.validate()) return
      this.sendCode()
    },

    async sendCodeAgain () {
      this.showNotification({
        type: 'success',
        text: 'Код успешно отправлен на ' + this.phone,
      })
      this.sendCode()
    },
    goBack () {
      this.clearTimer
      this.$emit('changeallRequestedStatus')
    },
    changeOldMethod () {
      this.clearTimer
      this.$emit('changeOldMethod')
    },

    async sendCode () {
      this.loading = true
      const response = await this.$axios.get(
        'api/v2/auth/recovery/client/request-code',
        { 
          params: { login_phone: clearPhoneWithoutPlus(this.phone) },
          errorMessage: 'Ошибка при запросе смс кода' 
        },
      )
      if (response?.data?.success) {
        if (response?.data?.data?.code_sended?.method === 'waitcall') {
          this.changeOldMethod()
          this.loading = false
          return
        }
        this.step = 2
        this.launchTimer(180)
      }
      this.loading = false
    },

    async submitCode () {
      if (this.loading) return
      this.loading = true
      const response = await this.$axios.post(
        'v2/auth/login/contractor',
        { phone_or_email: clearPhoneWithoutPlus(this.phone), code: this.code },
        { errorMessage: 'Ошибка при отправке смс кода' },
      )
      if (response?.data?.success) {
        await this.auth(response.data.data?.token)
        this.$router.push('/')
      }
      this.loading = false
    },

    onChangedCode (event) {
      this.code = event
      this.continueDisabled = event.length < 4
    },
  },
}
</script>

<style lang="scss">
.sign_in_by_sms_container {
  .recover-password__description {
    font-size: 16px;
    font-weight: 400;
    color: #7a91a9;
    text-align: center;
  }

  .recover-password__btn {
    width: 100%;
  }

  .remaining {
    color: #7a91a9;
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 700;
  }

  .footer_actions {
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 8px;
  }

  .code_input {
    align-self: center;
  }

  .recover-password__resent-link {
    cursor: pointer;
  }
}
</style>
