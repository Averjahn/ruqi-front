<template>
  <div class="recover-password">
    <template v-if="step === 1">
      <div class="recover-password__wrapper">
        <div class="recover-password_header">
          <img class="mb_8" src="@/assets/icons/ruqi_dark_blue_rounded.svg" />
          <img class="mb_18" src="@/assets/icons/logo.svg" />
          <h3>Восстановление пароля</h3>
        </div>

        <div class="recover-password_body">
          <Input class="input" label="Телефон" :value="formattedPhone" @input="onPhone" :disabled="isTimerRunning" />

          <div class="remaining" v-if="isTimerRunning">
            Отправить код повторно <b>{{ remainingTimeString }}</b>
          </div>

          <MainButton
            v-if="isTimerRunning && step === 1"
            type="primary"
            text="Ввести код"
            :loading="loading"
            class="recover-password__btn"
            @click="step = 2"
            :disabled="loading"
          />
          <MainButton
            v-if="!isTimerRunning && step === 1"
            type="primary"
            text="Отправить код"
            :loading="loading"
            class="recover-password__btn"
            @click="requestCode"
            :disabled="disableHandler || isTimerRunning"
          />
          <MainButton class="recover-password__btn" type="primary-outline" text="Назад" @click="back" />
        </div>
      </div>
    </template>

    <template v-if="step === 2">
      <div class="recover-password__wrapper">
        <div class="recover-password_header">
          <img class="mb_8" src="@/assets/icons/ruqi_dark_blue_rounded.svg" />
          <img class="mb_18" src="@/assets/icons/logo.svg" />
          <h3>Восстановление пароля</h3>
          <FooterInfo 
            :text="`Мы отправили ${codeTypeText.type} с кодом на ${codeTypeText.target} ${formattedPhone}`"
          />
        </div>
        <div class="recover-password_body">
          <OtpInput :isValid="isCodeValid" class="mb_16" @onInput="onChangedCode">
            <template #errorMessage>Неверный код</template>
          </OtpInput>

          <div class="remaining" v-if="isTimerRunning">
            Отправить код повторно <b>{{ remainingTimeString }}</b>
          </div>

          <button v-if="!isTimerRunning" @click="requestCodeAgain('telegram')" class="recover-password__text-button">Отправить код повторно</button>
          <button v-if="!isTimerRunning && initialResponseMethod !== 'sms'" @click="requestCodeAgain('sms')" class="recover-password__text-button">Получить код из СМС</button>

          <MainButton 
            type="primary" 
            text="Продолжить" 
            :loading="loading" 
            :disabled="continueDisabled" 
            class="recover-password__btn" 
            @click="submitCode" 
          />
          <MainButton class="recover-password__btn" type="primary-outline" text="Назад" @click="back" />
        </div>
      </div>
    </template>

    <template v-if="step === 3">
      <div class="recover-password__wrapper">
        <Form ref="form" class="form">
          <div class="recover-password_header mb_32">
            <img class="mb_8" src="@/assets/icons/ruqi_dark_blue_rounded.svg" />
            <img class="mb_18" src="@/assets/icons/logo.svg" />
            <h3>Придумайте пароль</h3>
          </div>
          <div class="recover-password_body">
            <Input
              class="input"
              label="Пароль"
              type="password"
              v-model="password"
              validationType="input"
              :rules="rulesSets.password"
            />

            <Input
              class="input"
              label="Повторите пароль"
              type="password"
              v-model="confirmPassword"
              validationType="input"
              :rules="[...rulesSets.password, passwordMatchChecking]"
            />

            <div class="recover-password__requirement">
              <b>Требования к паролю</b>
              <ul class="recover-password__requirement-list">
                <li :class="{ green: passwordCheck.length }">Пароль должен состоять минимум из 8 символов</li>
                <li :class="{ green: passwordCheck.upperCase }">Обязательно используйте заглавные</li>
                <li :class="{ green: passwordCheck.lowerCase }">Обязательно используйте строчные буквы</li>
                <li :class="{ green: passwordCheck.numbers }">Добавьте хотя бы одну цифру</li>
              </ul>
            </div>

            <MainButton
              type="primary"
              text="войти в систему"
              :loading="loading"
              class="recover-password__btn"
              @click="changePassword"
              :disabled="changePasswordDisabled"
            />
          </div>
        </Form>
      </div>
    </template>
  </div>
</template>

<script>
import { rulesSets } from '@/constants/validations'
import { formatPhone } from '@/constants/masks'
import { clearPhoneAlwaysSeven, clearPhoneWithoutPlus, getAPIError, getStringFromSeconds } from '@/constants/helpers'
import OtpInput from '@/components/atoms/OtpInput.vue'
import MainButton from '@/components/atoms/MainButton.vue'
import useTimer from '@/composables/useSnackbarTimer'
import { useAuth } from '@/composables/useAuth'
import { mapActions } from 'vuex'

export default {
  layout: 'empty',
  components: { OtpInput, MainButton },
  setup () {
    const { launchTimer, isTimerRunning, remaining } = useTimer({
      timerId: 'signinRecover',
    })
    const { requestRecoveryCode, confirmRecoveryCode, setNewPassword, loading: authLoading, error: authError } = useAuth()
    
    return {
      launchTimer,
      isTimerRunning,
      remaining,
      requestRecoveryCode,
      confirmRecoveryCode,
      setNewPassword,
      authLoading,
      authError,
    }
  },
  data () {
    return {
      step: 1,
      formattedPhone: '+7',
      rulesSets,
      continueDisabled: true,
      loading: false,
      once_token: null,
      sms_once_token: null,
      isCodeValid: true,
      showRepeatButton: false,
      smsDate: null,
      password: '',
      confirmPassword: '',
      confirmMethod: 'telegram',
      initialResponseMethod: '',
      verification_by: 'telegram',
    }
  },
  watch: {},
  async mounted () {},
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
    changePasswordDisabled () {
      return Object.values(this.passwordCheck).includes(false)
    },
    disableHandler () {
      return this.formattedPhone?.length < 7
    },
    passwordCheck () {
      return {
        length: this.password.length > 7,
        upperCase: /[A-Z]/.test(this.password),
        lowerCase: /[a-z]/.test(this.password),
        numbers: /\d/.test(this.password),
      }
    },
  },

  methods: {
    ...mapActions('auth', ['auth']),
    ...mapActions('notifications', ['showNotification']),

    passwordMatchChecking (v) {
      return v === this.password || 'Пароли не совпадают'
    },

    onPhone (event) {
      const { formattedValue, cursorPosition } = formatPhone({
        value: event.target.value,
        cursorPosition: event.target.selectionEnd,
      })
      this.formattedPhone = formattedValue ? '' : 'null'
      this.$nextTick(() => {
        this.formattedPhone = formattedValue
        this.$nextTick(() => {
          event.target.setSelectionRange(cursorPosition, cursorPosition)
        })
      })
    },

    async requestCode () {
      if (this.loading) return
      this.loading = true
      const phone = clearPhoneWithoutPlus(this.formattedPhone)
      
      try {
        // Используем новый эндпоинт через useAuth с параметром verification_by
        const success = await this.requestRecoveryCode(phone, 'telegram')
        
        if (success) {
          this.step = 2
          this.launchTimer(180)
        } else {
          this.showNotification({ 
            type: 'error', 
            text: this.authError?.[0]?.msg || 'Ошибка при запросе кода восстановления' 
          })
        }
      } catch (error) {
        this.showNotification({ 
          type: 'error', 
          text: getAPIError(error) || 'Ошибка при запросе кода восстановления' 
        })
      }
      
      this.loading = false
    },
    async requestCodeAgain (method) {
      this.verification_by = method
      this.confirmMethod = method
      
      if (this.loading) return
      this.loading = true
      const phone = clearPhoneWithoutPlus(this.formattedPhone)
      
      try {
        // Используем новый эндпоинт через useAuth с выбранным методом
        const success = await this.requestRecoveryCode(phone, method)
        
        if (success) {
          this.launchTimer(180)
        } else {
          this.showNotification({ 
            type: 'error', 
            text: this.authError?.[0]?.msg || 'Ошибка при запросе кода восстановления' 
          })
        }
      } catch (error) {
        this.showNotification({ 
          type: 'error', 
          text: getAPIError(error) || 'Ошибка при запросе кода восстановления' 
        })
      }
      
      this.loading = false
    },

    onChangedCode (event) {
      this.code = event
      this.continueDisabled = event.length < 4
    },

    back () {
      this.step === 1 ? this.$router.push('/client/signin') : this.step--
    },

    async submitCode () {
      if (this.loading) return
      this.loading = true
      const phone = clearPhoneWithoutPlus(this.formattedPhone)
      
      try {
        // Используем новый эндпоинт через useAuth
        const success = await this.confirmRecoveryCode(phone, this.code)
        
        if (success) {
          this.step = 3
        } else {
          this.showNotification({
            type: 'error',
            text: this.authError?.[0]?.msg || 'Ошибка при отправке кода подтверждения на сервер',
          })
        }
      } catch (error) {
        this.showNotification({
          type: 'error',
          text: getAPIError(error) || 'Ошибка при отправке кода подтверждения на сервер',
        })
      } finally {
        this.loading = false
      }
    },

    async changePassword () {
      if (this.loading) return
      if (!this.$refs.form.validate()) return
      this.loading = true
      const phone = clearPhoneWithoutPlus(this.formattedPhone)
      
      try {
        // Используем новый эндпоинт через useAuth
        const success = await this.setNewPassword(phone, this.code, this.password)
        
        if (success) {
          this.$router.push('/client/signin')
        } else {
          this.showNotification({ 
            type: 'error', 
            text: this.authError?.[0]?.msg || 'Ошибка при сохранении нового пароля' 
          })
        }
      } catch (error) {
        this.showNotification({ 
          type: 'error', 
          text: getAPIError(error) || 'Ошибка при сохранении нового пароля' 
        })
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.recover-password {
  min-height: 100%;
  width: 100%;
  background: linear-gradient(90.3deg, #edf2ff -1.79%, #ffffff 99.73%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .form,
  .input {
    width: 100%;
  }

  .recover-password__wrapper {
    width: 100%;
    max-width: 568px;
    box-sizing: border-box;
    padding: 40px 32px;
    border-radius: 16px;
    background: #fff;
    display: flex;
    flex-direction: column;
    gap: 32px;
    align-items: center;
    margin-bottom: 27px;
    box-shadow:
      0px 8px 48px 4px #0234e30a,
      0px 0px 10px 0px #1735f508;
  }

  .recover-password_header {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .recover-password_body {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }

  .recover-password__description {
    font-size: 16px;
    font-weight: 400;
    color: #7a91a9;
    text-align: center;
  }

  .recover-password__btn {
    width: 100%;
  }

  .recover-password__label {
    font-size: 16px;
    font-weight: 600;
  }

  .recover-password__requirement {
    width: 100%;
    background: #eff2fd;
    border-radius: 16px;
    padding: 24px;
  }

  .green {
    color: #71d472;
  }
  .recover-password__requirement-list {
    list-style: disc;
    padding-left: 24px;
    margin-top: 8px;
    font-size: 14px;
    color: #666666;
  }
  .remaining {
    color: #b0baff;
    font-size: 18px;
    line-height: 26px;
  }

  .recover-password__text-button {
    background: none;
    border: none;
    color: #1735f5;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    padding: 8px 0;
    text-decoration: underline;

    &:hover {
      color: #0f2cc7;
    }
  }
  @media (max-width: 1000px) {
    background: white;
    .recover-password__wrapper {
      max-width: 100%;
      min-height: 100%;
      padding: 40px 16px;
      border-radius: 0;
      margin-bottom: 0;
      box-shadow: none;
    }
    
    .recover-password__btn {
      width: 100%;
      max-width: none;
    }
  }
}
</style>
