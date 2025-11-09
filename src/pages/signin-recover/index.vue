<template>
  <div class="recover-password">
    <div class="recover-password__wrapper">
      <div class="recover-password_header">
        <img src="@/assets/icons/ruqi_dark_blue_rounded.svg" />
        <img class="logo-text" src="@/assets/icons/logo.svg" />
        <h3>Восстановление пароля</h3>

      </div>

      <!-- Шаг 1: Отправка кода -->
      <div class="recover-password_body" v-if="step === 1">
        <Input class="input" label="Телефон" :value="formattedPhone" @input="onPhone" />

        <MainButton
          type="primary"
          text="Отправить код"
          :loading="loading"
          class="recover-password__btn"
          @click="requestCode"
          :disabled="disableHandler"
        />
        <MainButton class="recover-password__btn" type="primary-outline" text="Назад" @click="back" />
      </div>

      <!-- Шаг 2: Ввод кода -->
      <div class="recover-password_body" v-if="step === 2">
        <CodeInput 
          label="Код из телеграм"
          placeholder="Введите код из телеграм"
          v-model="code"
        />

        <ResendCodeTimer 
          :duration="60" 
          :auto-start="true"
          @resend="handleResendCode"
        />

        <MainButton 
          type="primary" 
          text="Продолжить" 
          :loading="loading" 
          :disabled="!code || code.length < 4" 
          class="recover-password__btn"
          @click="confirmCode"
        />

        <MainButton class="recover-password__btn" type="primary-outline" text="Назад" @click="step = 1" />
      </div>

      <!-- Шаг 3: Ввод пароля -->
      <div class="recover-password_body" v-if="step === 3">
        <h4>Создайте новый пароль</h4>
        
        <Input 
          class="input" 
          label="Пароль" 
          v-model="password"
          type="password"
          placeholder="Введите пароль"
        />

        <Input 
          class="input" 
          label="Подтвердите пароль" 
          v-model="confirmPassword"
          type="password"
          placeholder="Подтвердите пароль"
        />

        <MainButton
          type="primary"
          text="Создать пароль"
          :loading="loading"
          :disabled="!isPasswordValid"
          class="recover-password__btn"
          @click="changePassword"
        />

        <MainButton class="recover-password__btn" type="primary-outline" text="Назад" @click="step = 2" />
      </div>
    </div>
  </div>
</template>

<script>
import { rulesSets } from '@/constants/validations'
import { formatPhone } from '@/constants/masks'
import { clearPhoneAlwaysSeven, clearPhoneWithoutPlus, getAPIError, getAPIErrorMessage, getStringFromSeconds } from '@/constants/helpers'
import OtpInput from '@/components/atoms/OtpInput.vue'
import MainButton from '@/components/atoms/MainButton.vue'
import ResendCodeTimer from '@/components/atoms/ResendCodeTimer.vue'
import FooterInfo from '@/components/atoms/FooterInfo.vue'
import Input from '@/components/atoms/Input.vue'
import CodeInput from '@/components/atoms/CodeInput.vue'
import authApi from '@/services/authApi'
import { mapActions } from 'vuex'

export default {
  layout: 'empty',
  components: { OtpInput, MainButton, ResendCodeTimer, FooterInfo, Input, CodeInput },
  data () {
    return {
      step: 1,
      formattedPhone: '+7',
      code: '',
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
  computed: {
    isPasswordValid () {
      return this.password && this.confirmPassword && this.password === this.confirmPassword
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
        // Используем authApi для запроса кода восстановления
        const result = await authApi.requestRecoveryCode(phone, this.verification_by)
        
        if (result.success) {
          // Сохраняем once_token из ответа
          this.once_token = result.data?.once_token || result.data?.onceToken
          this.step = 2
        } else {
          this.showNotification({
            type: 'error',
            text: result.error?.msg || result.error?.[0]?.msg || 'Ошибка при запросе кода восстановления'
          })
        }
      } catch (error) {
        this.showNotification({ 
          type: 'error', 
          text: getAPIError(error) || 'Ошибка при запросе кода восстановления' 
        })
      } finally {
        this.loading = false
      }
    },

    async confirmCode() {
      if (this.loading) return
      if (!this.once_token) {
        this.showNotification({
          type: 'error',
          text: 'Ошибка: отсутствует токен. Пожалуйста, запросите код заново.'
        })
        return
      }
      
      this.loading = true
      
      try {
        // Используем once_token для подтверждения кода
        const result = await authApi.confirmRecoveryCode(this.once_token, this.code)
        
        if (result.success) {
          // Сохраняем новый once_token для установки пароля
          this.once_token = result.data?.once_token || result.data?.onceToken
          // Код подтвержден, переходим на шаг 3
          this.step = 3
          this.showNotification({
            type: 'success',
            text: 'Код подтвержден. Создайте новый пароль.'
          })
        } else {
          this.showNotification({
            type: 'error',
            text: result.error?.msg || result.error?.[0]?.msg || 'Неверный код подтверждения'
          })
        }
      } catch (error) {
        this.showNotification({
          type: 'error',
          text: getAPIError(error) || 'Ошибка при подтверждении кода'
        })
      } finally {
        this.loading = false
      }
    },

    async requestCodeAgain (method) {
      this.verification_by = method || 'telegram'
      this.confirmMethod = method || 'telegram'
      
      if (this.loading) return
      this.loading = true
      const phone = clearPhoneWithoutPlus(this.formattedPhone)
      
      try {
        // Используем authApi для повторного запроса кода с указанием метода
        const result = await authApi.requestRecoveryCode(phone, this.verification_by)
        
        if (result.success) {
          // Сохраняем once_token из ответа
          this.once_token = result.data?.once_token || result.data?.onceToken
          this.showNotification({
            type: 'success',
            text: 'Код отправлен повторно'
          })
        } else {
          this.showNotification({
            type: 'error',
            text: result.error?.msg || result.error?.[0]?.msg || 'Ошибка при запросе кода восстановления'
          })
        }
      } catch (error) {
        this.showNotification({ 
          type: 'error', 
          text: getAPIError(error) || 'Ошибка при запросе кода восстановления' 
        })
      } finally {
        this.loading = false
      }
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
      if (!this.isPasswordValid) {
        this.showNotification({
          type: 'error',
          text: 'Пароли не совпадают или не заполнены'
        })
        return
      }

      if (!this.once_token) {
        this.showNotification({
          type: 'error',
          text: 'Ошибка: отсутствует токен. Пожалуйста, начните процесс заново.'
        })
        return
      }

      this.loading = true
      try {
        // Используем authApi для установки пароля после восстановления
        const result = await authApi.setNewPassword(
          this.once_token,
          this.password,
          this.confirmPassword
        )
        
        if (result.success && result.data) {
          // Согласно документации, восстановление пароля возвращает authToken (не token)
          const authToken = result.data.authToken
          if (authToken) {
            // Авторизуем пользователя с полученным токеном
            await this.auth(authToken)
          
          this.showNotification({
            type: 'success',
            text: 'Пароль успешно изменен! Переходим на главную страницу.'
          })
          
            // Переходим на главную страницу
            setTimeout(() => {
              this.$router.push('/')
            }, 1500)
          } else {
            this.showNotification({
              type: 'error',
              text: 'Токен авторизации не получен'
            })
          }
        } else {
          this.showNotification({
            type: 'error',
            text: result.error?.msg || result.error?.[0]?.msg || 'Ошибка при установке пароля'
          })
        }
      } catch (error) {
        console.error('Ошибка установки пароля:', error)
        this.showNotification({
          type: 'error',
          text: getAPIError(error) || 'Ошибка при установке пароля'
        })
      } finally {
        this.loading = false
      }
    },

    handleResendCode() {
      // Обработчик для повторной отправки кода через ResendCodeTimer
      this.requestCodeAgain('telegram')
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
    gap: 8px;

    img:first-child {
      width: 40px;
      height: 40px;
    }

    .logo-text {
      width: 146px;
      height: 48px;
    }

    h3 {
      color: #212529;
      font-family: 'Source Sans 3', sans-serif;
      font-size: 24px;
      font-weight: 600;
      line-height: 1.2;
      text-align: center;
      margin: 12px 0 0 0;
    }
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
    max-width: none;
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
