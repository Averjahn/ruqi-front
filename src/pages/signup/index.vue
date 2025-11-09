<template>
  <div class="signup-page">
    <div class="signup-page__wrapper">
      <AuthLogoHeader title="Регистрация" />

      <!-- Шаг 1: Ввод телефона -->
      <div class="signup-page__body" v-if="step === 1">
        <Form ref="phoneForm" class="content_container">
          <InputGroup>
            <InputBlock>
              <FormField label="Телефон">
                <Input
                  v-model="phone"
                  name="phone"
                  class="form_input"
                  clearable
                  @input="onPhone"
                  @keyup.enter="requestCode"
                  :rules="[rules.required, ...rulesSets.phone]"
                  placeholder="+7 (999) 000-00-00"
                />
              </FormField>
            </InputBlock>
          </InputGroup>
        </Form>

        <MainButton
          type="primary"
          text="Отправить код"
          :loading="loading"
          :disabled="disableHandler"
          class="signup-page__btn"
          @click="requestCode"
        />

        <FooterInfo 
          text="Введите свой номер телефона для быстрой и безопасной регистрации. Мы отправим код подтверждения в Telegram для завершения регистрации."
        />

        <MainButton 
          type="neutral" 
          text="У меня есть логин" 
          class="signup-page__btn signup-page__btn--secondary"
          @click="goToSignIn" 
        />

        <MainButton
          v-if="isDevelopment"
          type="primary-outline"
          text="Следующий шаг (временно)"
          @click="goToNextStep"
          class="signup-page__btn"
        />

        <div class="agreements_check">
          <AgreementCheck
            v-model="termAgree"
            text="Я ознакомился(-ась) и согласен(-на) с"
            link-text="политикой в отношении обработки персональных данных"
            link-route="/privacy-policy"
          />
          <AgreementCheck
            v-model="agree"
            text="Я ознакомился(-ась) и даю согласие на"
            link-text="обработку моих персональных данных"
            link-route="/personal"
          />
        </div>
      </div>

      <!-- Шаг 2: Ввод кода из Telegram -->
      <div class="signup-page__body" v-if="step === 2">
        <div class="content_container">
          <CodeInput
            label="Код из телеграм"
            placeholder="Введите код из телеграм"
            v-model="code"
          />

          <ResendCodeTimer
            :duration="180"
            :auto-start="true"
            @resend="sendCodeAgain"
          />

          <MainButton
            type="primary"
            text="Продолжить"
            @click="verifyCode"
            :disabled="!code || code.length < 4 || loading"
            :loading="loading"
            class="signup-page__btn"
          />

          <MainButton
            type="primary-outline"
            text="Назад"
            @click="changeCallRequestedStatus"
            :disabled="loading"
            class="signup-page__btn"
          />

          <MainButton
            v-if="isDevelopment"
            type="primary-outline"
            text="Следующий шаг (временно)"
            @click="goToNextStep"
            class="signup-page__btn"
          />
        </div>
      </div>

      <!-- Шаг 3: Создание пароля -->
      <div class="signup-page__body" v-if="step === 3">
        <h4>Создайте пароль</h4>
        
        <Form ref="passwordForm" class="content_container">
          <InputGroup>
            <InputBlock>
              <FormField label="Пароль">
                <Input
                  v-model="password"
                  name="password"
                  class="form_input"
                  type="password"
                  clearable
                  :rules="passwordRules"
                  @keyup.enter="createAccount"
                  placeholder="Введите пароль"
                />
              </FormField>
            </InputBlock>
            <InputBlock>
              <FormField label="Подтвердите пароль">
                <Input
                  v-model="confirmPassword"
                  name="confirmPassword"
                  class="form_input"
                  type="password"
                  clearable
                  :rules="confirmPasswordRules"
                  @keyup.enter="createAccount"
                  placeholder="Подтвердите пароль"
                />
              </FormField>
            </InputBlock>
          </InputGroup>
        </Form>

        <MainButton
          type="primary"
          text="Создать аккаунт"
          :loading="loading"
          :disabled="!isPasswordValid"
          class="signup-page__btn"
          @click="createAccount"
        />

        <MainButton 
          type="neutral" 
          text="Назад" 
          class="signup-page__btn signup-page__btn--secondary"
          @click="step = 2" 
        />

        <MainButton
          v-if="isDevelopment"
          type="primary-outline"
          text="Следующий шаг (временно)"
          @click="goToNextStep"
          class="signup-page__btn"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import MainButton from '@/components/atoms/MainButton.vue'
import Input from '@/components/atoms/Input.vue'
import Form from '@/components/atoms/Form.vue'
import AgreementCheck from '@/components/atoms/AgreementCheck.vue'
import CodeInput from '@/components/atoms/CodeInput.vue'
import ResendCodeTimer from '@/components/atoms/ResendCodeTimer.vue'
import AuthLogoHeader from '@/components/molecules/AuthLogoHeader.vue'
import InputGroup from '@/components/molecules/InputGroup.vue'
import InputBlock from '@/components/atoms/InputBlock.vue'
import FormField from '@/components/atoms/FormField.vue'
import FooterInfo from '@/components/atoms/FooterInfo.vue'
import { getAPIError, clearPhoneAlwaysSeven, clearPhoneWithoutPlus, getStringFromSeconds } from '@/constants/helpers'
import { formatPhone } from '@/constants/masks'
import { rules, rulesSets } from '@/constants/validations'
import useTimer from '@/composables/useSnackbarTimer'
import authApi from '@/services/authApi'

export default {
  name: 'SignUp',
  layout: 'empty',
  components: { MainButton, Input, Form, AgreementCheck, CodeInput, ResendCodeTimer, AuthLogoHeader, InputGroup, InputBlock, FormField, FooterInfo },
  setup () {
    const { launchTimer, isTimerRunning, remaining } = useTimer({
      timerId: 'signupSms',
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
      loading: false,
      agree: true,
      termAgree: true,
      phone: '',
      step: 1,
      isDevelopment: process.env.NODE_ENV === 'development',
      callToPhone: null,
      password: '',
      confirmPassword: '',
      onceToken: null,
      code: '',
      authToken: null,
      userId: null,
      clientUuid: null,
      accountUuid: null,
      passwordRules: [(v) => !!v || 'Заполните поле']
    }
  },
  computed: {
    remainingTimeString () {
      return getStringFromSeconds(this.remaining)
    },
    disableHandler () {
      return !this.phone
    },
    formattedPhone () {
      return this.phone
    },
    isPasswordValid () {
      return this.password && this.confirmPassword && this.password === this.confirmPassword
    },
    confirmPasswordRules () {
      return [
        (v) => !!v || 'Подтвердите пароль',
        (v) => v === this.password || 'Пароли не совпадают'
      ]
    }
  },
  methods: {
    ...mapActions('notifications', ['showNotification']),


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

    async requestCode () {
      if (this.$refs.phoneForm && !this.$refs.phoneForm.validate()) {
        return
      }
      
      if (!this.agree || !this.termAgree) {
        this.showNotification({
          type: 'error',
          text: 'Для продолжения использования сервиса необходимо согласиться на обработку персональных данных и с политикой в отношении обработки персональных данных.',
        })
        return
      }
      
      this.loading = true
      try {
        // Отправляем номер телефона на регистрацию
        const phone = clearPhoneWithoutPlus(this.phone)
        const result = await authApi.registerClient(phone)
        
        if (result.success) {
          // Сохраняем телефон в localStorage
          localStorage.setItem('registration_phone', phone)
          
          // Сохраняем once_token, client_uuid, account_uuid согласно документации
          this.onceToken = result.data?.once_token
          this.clientUuid = result.data?.client_uuid
          this.accountUuid = result.data?.account_uuid
          
          if (!this.onceToken) {
            this.showNotification({
              type: 'error',
              text: 'Не получен токен для подтверждения кода'
            })
            this.loading = false
            return
          }
          
          // Переходим к вводу кода из Telegram
          this.step = 2
          const method = result.data?.code_sended?.method || 'telegram'
          const target = result.data?.code_sended?.target || phone
          this.showNotification({
            type: 'success',
            text: `Код отправлен через ${method === 'telegram' ? 'Telegram' : 'SMS'} на ${target}`
          })
        } else {
          this.showNotification({
            type: 'error',
            text: result.error?.msg || result.error?.[0]?.msg || 'Ошибка при отправке номера телефона'
          })
        }
      } catch (error) {
        this.showNotification({
          type: 'error',
          text: getAPIError(error) || 'Ошибка при отправке номера телефона'
        })
      } finally {
        this.loading = false
      }
    },


    async sendCodeAgain() {
      if (this.loading) return
      this.loading = true
      try {
        const phone = clearPhoneWithoutPlus(this.phone)
        const result = await authApi.registerClient(phone)
        
        if (result.success) {
          // Сохраняем once_token, client_uuid, account_uuid согласно документации
          this.onceToken = result.data?.once_token
          this.clientUuid = result.data?.client_uuid
          this.accountUuid = result.data?.account_uuid
          this.showNotification({
            type: 'success',
            text: 'Код отправлен повторно'
          })
        } else {
          this.showNotification({
            type: 'error',
            text: result.error?.msg || result.error?.[0]?.msg || 'Ошибка при запросе кода'
          })
        }
      } catch (error) {
        this.showNotification({
          type: 'error',
          text: getAPIError(error) || 'Ошибка при запросе кода'
        })
      } finally {
        this.loading = false
      }
    },

    async verifyCode() {
      if (!this.code || this.code.length !== 4) {
        this.showNotification({
          type: 'error',
          text: 'Введите код из 4 цифр'
        })
        return
      }

      if (!this.onceToken) {
        this.showNotification({
          type: 'error',
          text: 'Токен подтверждения не найден. Пожалуйста, начните регистрацию заново.'
        })
        return
      }

      this.loading = true
      try {
        const result = await authApi.verifyCode(this.onceToken, this.code)
        
        if (result.success) {
          // Сохраняем authToken для использования как Bearer токен в заголовке Authorization
          this.authToken = result.data?.authToken
          this.clientUuid = result.data?.client_uuid
          this.accountUuid = result.data?.account_uuid
          
          if (!this.authToken) {
            this.showNotification({
              type: 'error',
              text: 'Токен авторизации не получен'
            })
            this.loading = false
            return
          }

          // Переходим к установке пароля
          this.step = 3
          this.showNotification({
            type: 'success',
            text: result.data?.message || 'Регистрация завершена успешно. Теперь создайте пароль.'
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

    copyPhoneNumber() {
      if (this.callToPhone) {
        navigator.clipboard.writeText(this.callToPhone)
        this.showNotification({
          type: 'success',
          text: 'Номер скопирован в буфер обмена'
        })
      }
    },

    changeCallRequestedStatus() {
      if (this.isTimerRunning) {
        return
      }
      this.step = 1
      this.code = ''
      this.onceToken = null
      this.authToken = null
      if (this.authInterval) {
        clearInterval(this.authInterval)
      }
    },

    async createAccount() {
      if (this.$refs.passwordForm && !this.$refs.passwordForm.validate()) {
        return
      }

      if (!this.isPasswordValid) {
        this.showNotification({
          type: 'error',
          text: 'Пароли не совпадают или не заполнены'
        })
        return
      }

      if (!this.authToken) {
        this.showNotification({
          type: 'error',
          text: 'Токен авторизации не найден. Пожалуйста, начните регистрацию заново.'
        })
        return
      }

      this.loading = true
      try {
        // Устанавливаем пароль с authToken в заголовке Authorization Bearer
        const result = await authApi.setupClientPassword(
          this.authToken,
          this.password,
          this.confirmPassword
        )
        
        if (result.success) {
          // Сохраняем токен авторизации в store и localStorage
          // Используем токен из ответа API, если он есть, иначе используем authToken из предыдущего шага
          const token = result.data?.authToken || result.data?.token || this.authToken
          if (token) {
            await this.$store.dispatch('auth/auth', token)
          } else if (this.authToken) {
            // Если токена в ответе нет, используем authToken из предыдущего шага
            await this.$store.dispatch('auth/auth', this.authToken)
          }
          
          // Сохраняем телефон в store и localStorage
          const phone = clearPhoneWithoutPlus(this.phone)
          this.$store.commit('user/setRegistrationData', { 
            phone,
            firstname: 'Иван',
            lastname: 'Петров',
            middlename: 'Сергеевич',
            email: 'test@example.com',
            birthday: '1990-01-15',
            citizenship: 'RU'
          })
          localStorage.setItem('registration_phone', phone)
          
          this.showNotification({
            type: 'success',
            text: 'Пароль установлен! Переходим к заполнению данных организации.'
          })
          
          // Переходим в organisationData
          this.$router.push('/client/organisationData')
        } else {
          this.showNotification({
            type: 'error',
            text: result.error?.[0]?.msg || 'Ошибка при установке пароля'
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

    goToSignIn () {
      this.$router.push('/client/signin')
    },

    goToNextStep () {
      // Временный переход по шагам внутри страницы signup
      if (this.step === 1) {
        // Шаг 1 -> Шаг 2: переход к вводу кода
        // Имитируем успешную отправку кода
        this.code = '1234' // Заполняем временный код
        this.onceToken = 'temp_once_token'
        this.step = 2
        return
      }
      if (this.step === 2) {
        // Шаг 2 -> Шаг 3: переход к созданию пароля
        // Имитируем успешную верификацию кода
        this.authToken = 'temp_auth_token'
        this.userId = 123
        this.step = 3
        return
      }
      if (this.step === 3) {
        // Шаг 3 -> завершение регистрации
        // Имитируем успешную установку пароля
        this.password = 'TestPassword123!'
        this.confirmPassword = 'TestPassword123!'
        // Переход на страницу данных организации
        this.$router.push('/client/organisationData')
        return
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.signup-page {
  min-height: 100%;
  width: 100%;
  padding: 24px 16px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;

  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    width: 100%;
    max-width: 568px;
    box-sizing: border-box;
    padding: 40px 32px;
    border-radius: 24px;
    background: #fff;
    box-shadow: 0px 8px 48px 4px #0234e30a, 0px 0px 10px 0px #1735f508;
    
    @media (max-width: 768px) {
      padding: 0;
      box-shadow: none;
      background: transparent;
    }
  }

  &__header {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;

    h3 {
      color: #212529;
      font-family: 'Source Sans 3', sans-serif;
      font-size: 24px;
      font-weight: 600;
      line-height: 1.2;
      text-align: center;
      margin: 12px 0 0 0;
    }

    img:first-child {
      width: 40px;
      height: 40px;
    }

    .logo-text {
      width: 146px;
      height: 48px;
    }
  }

  .logo_icons {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }

  .ruqi_logo_text {
    width: auto;
    height: 48px;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;

    h4 {
      color: #263043;
      font-size: 20px;
      font-weight: 600;
      line-height: 24px;
      text-align: center;
      margin: 0 0 16px 0;
    }

    .form-row {
      display: flex;
      gap: 16px;
      
      @media (max-width: 768px) {
        flex-direction: column;
        gap: 20px;
      }
    }
  }

  &__btn {
    width: 100%;
    max-width: none;

    &--secondary {
      background: #e9ecef;
      border: none;
      color: #212529;
      font-family: 'Source Sans 3', sans-serif;
      font-size: 16px;
      font-weight: 600;
    }
  }

  &__info {
    background: #f8f9fa;
    border: 1px solid #ced4da;
    border-radius: 8px;
    padding: 16px 20px;
    margin: 8px 0;

    p {
      margin: 0;
      font-family: 'Source Sans 3', sans-serif;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.5;
      color: #6c757d;
    }
  }

  .remaining {
    text-align: center;
    font-size: 14px;
    color: #666666;
    margin: 8px 0;
  }


  .content_container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .input_group {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    text-align: left;
  }

  .input_block {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .label {
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #666666;
  }

  .form_input {
    width: 100%;
  }

  .agreements_check {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .personal-agreement-checkbox {
    display: flex;
    align-items: flex-start;
    gap: 8px;

    .checkbox {
      margin-top: 2px;
    }

    .agreement-check {
      flex: 1;
      font-family: 'Source Sans Pro', sans-serif;
      font-size: 16px;
      font-weight: 400;
      line-height: 22px;
      letter-spacing: 0%;
      color: #212529;

      .agreement-src {
        color: #007bff;
        cursor: pointer;
        text-decoration: underline;

        &:hover {
          color: #4e64f2;
        }
      }
    }
  }

  // Стили для экрана звонка
  .call_instruction_card {
    padding: 16px 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: white;
    width: 100%;
  }

  .call_instruction_text {
    font-size: 18px;
    font-weight: 600;
    line-height: 26px;
    text-align: center;
    color: #263043;
    max-width: 438px;
  }

  .phone_display {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
    width: 100%;
  }

  .phone_icon {
    width: 28px;
    height: 28px;
  }

  .phone_number {
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    color: #263043;
  }

  .copy_icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 1;
    }
  }

  .call_btn_mobile {
    width: 100%;
    max-width: none;
    display: none; /* Скрыта по умолчанию */
    text-align: center;
  }

  .change_number_btn {
    width: 100%;
    max-width: none;
    text-align: center;
  }

  @media (max-width: 768px) {
    /* Показываем кнопку "Позвонить" на мобильных устройствах */
    .call_btn_mobile {
      display: block !important;
    }
  }
}

.mb_8 {
  margin-bottom: 8px;
}

.mb_18 {
  margin-bottom: 18px;
}
</style>
