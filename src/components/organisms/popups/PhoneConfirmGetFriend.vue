<template>
  <PopupContainer class="age_popup" maxWidth="359px">
    <template v-slot:header>
      <div class="age_content">
        <h3 class="title_with_button">
          <div class="title_text">Введите код из {{ codeTypeText.headerTarget }}</div>
        </h3>
        <div v-if="showAttention" class="description">
          Время хранения токена истекло. Пожалуйста обновите страницу для повторного ввода кода.
        </div>
        <div v-else class="description">
          Мы отправили {{ codeTypeText.type }} с кодом <br />
          на {{ codeTypeText.target }} {{ phone }}
        </div>
      </div>
    </template>
    <template v-slot>
      <OtpInput ref="otpInput" :isValid="isCodeValid" class="otp_input" @onChanged="onChanged">
        <template #errorMessage>Неверный код</template>
      </OtpInput>
      <div class="agreements_check">
        <div class="row">
          <div class="personal-agreement-checkbox">
            <Checkbox v-model="termAgree" />
            <div class="agreement-check">
              <div>
                Я ознакомился (-ась) и согласен (-на) с
                <span class="agreement-src" @click="$router.push('/privacy-policy')">
                  политикой в отношении обработки персональных данных
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="personal-agreement-checkbox">
            <Checkbox v-model="agree" />
            <div class="agreement-check">
              <div>
                Я ознакомился(-ась) и даю
                <span class="agreement-src" @click="$router.push('/personal')">
                  согласие на обработку моих персональных данных
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-slot:footer>
      <div class="action_block">
        <Button :disabled="continueDisabled || loading" :loading="loading" @click="confirmCode">продолжить</Button>
        <ButtonText v-if="!isTimerRunning" type="s" @click="requestCodeAgain('telegram')" class="repeat_button">
          Отправить код еще раз
        </ButtonText>
        <ButtonText v-if="!isTimerRunning" type="s" @click="requestCodeAgain('sms')" class="repeat_button">
          Получить код из СМС
        </ButtonText>

        <div v-else class="remaining_time">
          Отправить еще раз <b>через {{ remaining }}</b>
        </div>
      </div>
    </template>
  </PopupContainer>
</template>

<script>
import PopupContainer from '@/components/atoms/PopupContainer.vue'
import { rules, rulesSets } from '@/constants/validations'
import { getAPIError } from '@/constants/helpers'
import { mapMutations, mapActions } from 'vuex'
import OtpInput from '@/components/atoms/OtpInput.vue'
import useTimer from '@/composables/useSnackbarTimer'

export default {
  components: {
    PopupContainer,
    OtpInput,
  },
  setup () {
    const { launchTimer, clearTimer, isTimerRunning, remaining } = useTimer({
      timerId: 'getFriendRegistrationTimer',
    })

    return {
      launchTimer,
      isTimerRunning,
      remaining,
      clearTimer,
    }
  },
  props: {},
  data () {
    return {
      rules,
      rulesSets,
      window: '',
      once_token: null,
      continueDisabled: true,
      isCodeValid: true,
      phone: null,
      loading: false,
      agree: true,
      termAgree: true,
      showAttention: false,
      tokenTimer: null,
      confirmMethod: 'telegram',
      verification_by: 'telegram',
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
  beforeUnmount () {
    clearTimeout(this.tokenTimer)
  },
  mounted () {
    this.getData()
    this.startTokenTimer()
  },
  methods: {
    ...mapMutations('user', ['updateUserData']),
    ...mapActions('auth', ['auth']),
    ...mapActions('notifications', ['showNotification']),

    requestCodeAgain (method) {
      this.verification_by = method
      this.confirmMethod = method
      this.getData()
    },

    startTokenTimer () {
      this.tokenTimer = setTimeout(() => {
        this.showAttention = true
      }, 600000)
    },

    onChanged (event) {
      this.code = event
      this.continueDisabled = event.length < 4
      this.isCodeValid = true
      if (event.length === 4) this.confirmCode()
    },

    async confirmCode () {
      if (!this.agree || !this.termAgree) {
        this.showNotification({
          type: 'error',
          text: 'Для продолжения использования сервиса необходимо согласиться на обработку персональных данных и с политикой в отношении обработки персональных данных.',
        })
        return
      }
      this.loading = true
      const response = await this.$axios.post('v2/getfriend/code/submit', {
        once_token: this.once_token,
        code_confirm: this.code,
      })
      if (response?.data?.success) {
        await this.auth(response?.data?.data?.token)
        this.$router.push('/')
      } else {
        if (!response?.data?.error) {
          this.isCodeValid = false
          this.continueDisabled = true
          this.$refs.otpInput.reset()
        } else {
          this.showNotification({ text: getAPIError(response) || 'Ошибка при отправке кода из смс' })
          if (response?.data?.error?.find((error) => error?.code === 353143)) {
            this.$router.push('/signin')
          }
        }
      }
      this.loading = false
    },

    async getData () {
      this.loading = true
      const response = await this.$axios.post('v2/getfriend/check', {
        prereg_token: this.$route.query.prereg_token,
        verification_by: this.verification_by,
      })
      if (!response?.data?.success && this?.once_token && [974905, 976905].includes(response?.data?.error[0]?.code)) {
        this.confirmMethod = 'sms'
        this.launchTimer(180)
        return
      }
      if (response?.data?.success) {
        this.confirmMethod = response.data?.data?.code_sended?.method
        this.phone = response.data.data?.phone
        this.once_token = response.data.data?.once_token
        this.launchTimer(180)
      } else {
        this.showNotification({ text: getAPIError(response) || 'Ошибка при получении данных для регистрации' })
      }
      this.loading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.age_popup {
  .age_content {
    text-align: center;
  }
  .age_icon {
    margin-bottom: 24px;
  }
  .row {
    text-align: left;
  }
  .label {
    font-weight: 600;
    margin-bottom: 16px;
  }
  .title_with_button {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
  }
  .description {
    color: #7a91a9;
    line-height: 22px;
    margin-bottom: 24px;
  }
  .data_input {
    width: 100%;
  }
  .repeat_button {
    margin-top: 24px;
  }
  .remaining_time {
    margin-top: 24px;
    text-align: center;
  }
  .title_text {
    flex: 1;
    text-align: center;
    padding-right: 30px;
  }
}
.personal-agreement-checkbox {
  margin-top: 24px;
  gap: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.agreement-check {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  text-align: left;
  .agreement-src {
    cursor: pointer;
    color: #0082de;
    text-decoration: underline;
  }
}
.action_block {
  margin-top: 24px;
  display: flex;
  flex-direction: column;

  .action_btns {
    display: flex;
    flex-direction: row;
    gap: 24px;
    align-self: flex-end;
    .agreement-actions-btns {
      @media screen and (max-width: 768px) {
        width: auto;
      }
      width: 258px;
    }
  }
}
.default_header {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  position: relative;
}
.close {
  position: absolute;
  top: 0px;
  right: 0px;
  justify-self: flex-end;
  cursor: pointer;
  transition: all 200ms ease-in-out;
  &:hover {
    transform: scale(1.2);
  }
}
.otp_input {
  margin: 0 auto;
}

.agreements_check {
  display: flex;
  gap: 4px;
  flex-direction: column;
}
</style>
