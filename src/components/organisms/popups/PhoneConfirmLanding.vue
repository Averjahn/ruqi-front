<template>
  <PopupContainer v-if="window === 'phone_input'" class="code_popup" maxWidth="359px">
    <template v-slot:header>
      <div class="title">
        <div class="default_header">
          <h3>Создание профиля</h3>
        </div>
        <ButtonIconDeprecated class="forward_btn" v-if="authInterval || isTimerRunning" @click="onForward">
          <img src="@/assets/icon_deprecated/arrow_right_black.svg" />
        </ButtonIconDeprecated>
      </div>
    </template>
    <template v-slot>
      <Form ref="form">
        <div class="age_content">
          <div class="description">Пожалуйста, подтвердите ваш номер телефона для входа в систему</div>
          <div class="row">
            <div class="label">Телефон</div>
            <Input :value="phone" :rules="[rules.required, ...rulesSets.phone]" @input="onPhone" />
          </div>
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
        </div>
      </Form>
    </template>

    <template v-slot:footer>
      <div class="action_block">
        <Button :disabled="isTimerRunning || loading" :loading="loading" @click="sendData">
          {{ !!this.remaining ? `Отправить код через ${remainingTimeString}` : 'Отправить код' }}
        </Button>
      </div>
    </template>
  </PopupContainer>

  <PopupContainer v-else-if="window === 'code_window'" class="code_popup" maxWidth="359px">
    <template v-slot:header>
      <div class="age_content">
        <h3 class="title_with_button">
          <ButtonIconDeprecated @click="onBack">
            <img src="@/assets/icon_deprecated/arrow_left_black.svg" />
          </ButtonIconDeprecated>
          <div class="title_text">Введите код из {{ codeTypeText.headerTarget }}</div>
        </h3>
        <div class="description">
          Мы отправили {{ codeTypeText.type }} с кодом <br />
          на {{ codeTypeText.target }} {{ phone }}
        </div>
        <OtpInput ref="otpInput" :isValid="isCodeValid" class="otp_input" @onChanged="onChanged">
          <template #errorMessage>Неверный код</template>
        </OtpInput>
      </div>
    </template>

    <template v-slot:footer>
      <div class="action_block">
        <Button :disabled="continueDisabled || loading" :loading="loading" @click="sendCode">Продолжить</Button>
        <ButtonText v-if="!isTimerRunning" type="s" @click="requestCodeAgain('telegram')" class="repeat_button">
          Отправить код еще раз
        </ButtonText>
        <ButtonText v-if="!isTimerRunning" type="s" @click="requestCodeAgain('sms')" class="repeat_button">
          Получить код из СМС
        </ButtonText>

        <div v-else class="remaining_time">
          Отправить еще раз <b>через {{ remainingTimeString }}</b>
        </div>
      </div>
    </template>
  </PopupContainer>

  <PopupContainer v-else class="code_popup" maxWidth="330px">
    <template v-slot:header>
      <div class="age_content">
        <h3 class="title_with_button">
          <div class="title_text">Вход по звонку</div>
        </h3>
        <div class="action_view">
          <div class="action_description">
            Сделайте бесплатный звонок с номера <span class="phone_no_wrap">{{ phone }}</span
            >, чтобы авторизоваться
          </div>
          <div class="call_phone">
            <img class="phone_icon" src="@/assets/icons/phone_call_filled_lightBlue.svg" />
            <span class="phone_no_wrap call_to_phone">{{ callToPhone }}</span>
            <ButtonIconGhost @click="copyPhoneNumber">
              <img src="@/assets/icons/copy_outlined.svg" />
            </ButtonIconGhost>
          </div>
        </div>
      </div>
    </template>

    <template v-slot:footer>
      <Section class="actions_container">
        <Button size="l" @click="makeCall" :loading="loading" class="signin_button call_btn"> Позвонить </Button>
        <Button
          size="l"
          type="outlined"
          @click="changeCallRequestedStatus"
          :disabled="loading || isTimerRunning"
          :loading="loading"
          class="signin_button"
        >
          {{ !!this.remaining ? `Изменить номер через ${remainingTimeString}` : 'Изменить номер' }}
        </Button>
      </Section>
    </template>
  </PopupContainer>
</template>

<script>
import PopupContainer from '@/components/atoms/PopupContainer.vue'
import { rules, rulesSets } from '@/constants/validations'
import { getAPIError, replace8to7inPhone, getStringFromSeconds } from '@/constants/helpers'
import { mapMutations, mapActions } from 'vuex'
import { formatPhone } from '@/constants/masks'
import OtpInput from '@/components/atoms/OtpInput.vue'
import useTimer from '@/composables/useTimer'

export default {
  components: {
    PopupContainer,
    OtpInput,
  },
  setup () {
    const { launchTimer, clearTimer, isTimerRunning, remaining } = useTimer({
      timerId: 'landingRegistrationTimer',
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
      window: 'phone_input',
      once_token: null,
      continueDisabled: true,
      isCodeValid: true,
      phone: null,
      birthday: null,
      loading: false,
      agree: true,
      termAgree: true,
      callToPhone: null,
      authInterval: null,
      confirmMethod: 'telegram',
      verification_by: 'telegram',
    }
  },
  computed: {
    remainingTimeString () {
      return getStringFromSeconds(this.remaining)
    },
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
  mounted () {
    const { formattedValue } = formatPhone({ value: this.$route.query.phone || '' })
    this.phone = formattedValue
    if (this.isPhoneCorrect(formattedValue)) this.sendData()
  },
  async beforeUnmount () {
    if (this.authInterval) clearInterval(this.authInterval)
  },
  methods: {
    ...mapMutations('user', ['updateUserData']),
    ...mapActions('auth', ['auth']),
    ...mapActions('notifications', ['showNotification']),

    isPhoneCorrect (phone) {
      if (!phone) return false
      for (let i = 0; i < rulesSets.phone.length; i++) {
        if (rulesSets.phone[i](phone) !== true) return false
      }
      return true
    },

    onChanged (event) {
      this.code = event
      this.continueDisabled = event.length < 4
      this.isCodeValid = true
      if (event.length === 4) this.sendCode()
    },

    requestCodeAgain (method) {
      this.verification_by = method
      this.confirmMethod = method
      this.sendData()
    },
    async sendCode () {
      this.loading = true
      const response = await this.$axios.post('v2/land/code/submit', {
        once_token: this.once_token,
        code: this.code,
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
        }
      }
      this.loading = false
    },

    async sendData () {
      if (!this.agree || !this.termAgree) {
        this.showNotification({
          type: 'error',
          text: 'Для продолжения использования сервиса необходимо согласиться на обработку персональных данных и с политикой в отношении обработки персональных данных.',
        })
        return
      }
      this.loading = true
      let response = await this.$axios.post(
        'v2/land/form/submit',
        {
          firstname: this.$route.query.firstname,
          lastname: this.$route.query.lastname,
          phone: this.phone,
          referrer: this.$route.query.referrer ?? document.referrer ?? '',
          locationhref: this.$route.query.location_href ?? '',
          verification_by: this.verification_by,
        },
        { errorMessage: 'Ошибка при отправке данных для регистрации' },
      )
      if (!response?.data?.success && this?.once_token && [974905, 976905].includes(response?.data?.error[0]?.code)) {
        this.confirmMethod = 'sms'
        this.window = 'code_window'
        this.launchTimer(180)
        return
      }
      if (response?.data?.success) {
        this.confirmMethod = response.data.data?.code_sended?.method
        this.once_token = response.data?.data?.once_token
        this.launchTimer(180)
        if (this.confirmMethod === 'waitcall') {
          this.authInterval = setInterval(this.authCallCheck, 5000)
          this.callToPhone = replace8to7inPhone(response?.data?.data?.code_sended?.callto)
          this.window = 'waitCall_window'
        } else {
          this.window = 'code_window'
        }
      } else {
        this.showNotification({ text: getAPIError(response) || 'Непредвиденная ошибка при регистрации.' })
      }
      this.loading = false
    },

    onPhone (event) {
      const { formattedValue, cursorPosition } = formatPhone({
        value: event.target.value,
        cursorPosition: event.target.selectionEnd,
      })
      this.phone = formattedValue ? '' : 'null'
      this.$nextTick(() => {
        this.phone = formattedValue
        this.$nextTick(() => {
          event.target.setSelectionRange(cursorPosition, cursorPosition)
        })
      })
    },

    onBack () {
      this.window = 'phone_input'
    },
    onForward () {
      if (this.authInterval) {
        this.window = 'waitCall_window'
      } else if (!this.authInterval && this.isTimerRunning) {
        this.window = 'code_window'
      }
    },
    copyPhoneNumber () {
      navigator.clipboard
        .writeText(this.phone)
        .then(() => {
          this.showNotification({ type: 'success', text: 'Номер скопирован' })
        })
        .catch(() => {
          this.showNotification({ type: 'error', text: 'Не удалось скопировать номер' })
        })
    },
    makeCall () {
      const telUrl = `tel:${this.callToPhone}`
      window.location.href = telUrl
    },
    changeCallRequestedStatus () {
      if (this.authInterval) {
        clearInterval(this.authInterval)
        this.authInterval = null
      }
      this.onBack()
    },
    async authCallCheck () {
      if (!this.once_token) return
      const response = await this.$axios.get('v2/auth/recovery/pollingwaitcall', {
        params: {
          once_token: this.once_token,
        },
      })
      if (response?.data?.data?.status === 'validated') {
        if (this.authInterval) {
          clearInterval(this.authInterval)
          this.authInterval = null
        }
        await this.auth(response.data.data?.token)
        this.$router.push('/')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.code_popup {
  .title {
    display: flex;
    width: 100%;
    flex: 1;
    .forward_btn {
      justify-self: flex-end;
    }
    // justify-content: space-between;
  }
  .otp_input {
    display: inline-block;
  }
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
    width: 100%;
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
    width: 100%;
    align-self: center;
    display: flex;
    justify-content: center;
    // margin-top: 24px;
  }
  .remaining_time {
    margin-top: 24px;
    text-align: center;
  }
  .title_text {
    flex: 1;
    text-align: center;
    // padding-right: 30px;
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
  justify-content: center;
  gap: 12px;
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
.action_view {
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-items: center;
  border-radius: 16px;
  border: 1px solid #0000001a;
  .call_phone {
    margin: 0 auto;
    display: flex;
    gap: 8px;
    align-items: center;
    .phone_icon {
      width: 28px;
      height: auto;
    }
  }
}
.default_header {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  position: relative;
}
.signin_button {
  width: 100%;
  padding-right: 0;
  padding-left: 0;

  .slot {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
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
.call_btn {
  opacity: 0;
  display: none !important;
}
.actions_container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
@media (max-width: 768px) {
  .action_description {
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
  }
  .action_view {
    padding: 16px;
  }
  .call_btn {
    opacity: 1;
    display: flex !important;
  }
}
.agreements_check {
  display: flex;
  gap: 4px;
  flex-direction: column;
}
</style>
