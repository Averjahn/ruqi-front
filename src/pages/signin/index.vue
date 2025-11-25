<template>
  <div class="login_page">
    <div class="form_block">
      <AuthLogoHeader :title="callRequested ? 'Восстановление пароля' : 'Вход в систему'" />
      <AuthTabs v-if="!callRequested" :value="currentTab" :old-method="oldMethod" @change="changeTab" />

      <template v-if="currentTab === 'by_password'">
        <Form ref="form" class="content_container">
          <InputGroup>
            <InputBlock>
              <FormField label="Email или номер телефона">
                <Input
                  v-model="login.phone_or_email"
                  name="phone_or_email"
                  @keyup.enter="signinHandler"
                  class="form_input"
                  clearable
                  :rules="inputRules"
                />
              </FormField>
            </InputBlock>
            <InputBlock>
              <FormField label="Пароль">
                <Input
                  v-model="login.password"
                  name="password"
                  class="form_input"
                  type="password"
                  :rules="passwordRules"
                  @keyup.enter="signinHandler"
                />
              </FormField>
            </InputBlock>
            <a class="password_forgot" @click="forgot()">Забыли пароль?</a>
          </InputGroup>
          <div class="action_group">
            <MainButton 
              type="primary" 
              text="Войти"
              @click="signinHandler" 
              :loading="loading || this.authLoading" 
              class="signin_button get_in_button"
            />
            <MainButton 
              type="neutral" 
              text="Регистрация"
              @click="goToRegistration" 
              class="signin_button signin_button--registration"
              button-type="button"
            />
            <!-- <MainButton
              v-if="isDevelopment"
              type="primary-outline"
              text="Следующий шаг (временно)"
              @click="goToNextSteps"
              class="signin_button"
            /> -->
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
     
        </Form>
      </template>
      <template v-if="currentTab === 'by_phone_call'">
        <div class="content_container">
          <template v-if="!callRequested">
            <Form ref="call" @submit.prevent="onSubmitByCall" class="content_container">
              <InputGroup>
                <InputBlock>
                  <FormField label="Телефон">
                    <Input
                      v-model="phone"
                      :errorText="callRequestErrorMsg"
                      name="phone"
                      class="form_input"
                      clearable
                      @input="onPhone"
                      @keyup.enter="onSubmitByCall"
                      :rules="[rules.required, ...rulesSets.phone]"
                    />
                  </FormField>
                </InputBlock>
              </InputGroup>
              <MainButton
                type="primary"
                :text="'Подтвердить исходящим звонком'"
                @click="onSubmitByCall"
                :disabled="disablePhoneHandler"
                :loading="loading"
                class="signin_button"
              />
              
              <FooterInfo 
                text="Введите свой номер телефона для быстрой и безопасной авторизации. Мы отправим его в систему для проверки, после чего вы получите номер, на который нужно будет позвонить. Если звонок поступит с указанного вами номера, доступ будет предоставлен автоматически."
              />
            </Form>
          </template>

          <template v-if="callRequested && !oldMethod">
            <div class="content_container">
              <CodeInput
                label="Код из телеграм"
                placeholder="Введите код из телеграм"
                v-model="smsCode"
              />

              <ResendCodeTimer
                :duration="60"
                :auto-start="true"
                @resend="sendCodeAgain"
              />

              <MainButton
                type="primary"
                text="Продолжить"
                @click="submitSmsCode"
                :disabled="!smsCode || smsCode.length < 4 || loading"
                :loading="loading"
                class="signin_button"
              />

              <MainButton
                type="primary-outline"
                text="Назад"
                @click="changeCallRequestedStatus"
                :disabled="loading"
                class="signin_button"
              />
            </div>
          </template>
          <div v-if="currentTab !== 'by_phone_call'" class="agreements_check">
            <AgreementCheck
              v-model="termAgree"
              text="Я ознакомился(-ась) и согласен(-на) с"
              link-text="политикой в отношении обработки персональных данных"
              link-route="/privacy-policy"
            />
            <AgreementCheck
              v-model="agree"
              text="Я ознакомился(-ась) и даю"
              link-text="согласие на обработку моих персональных данных"
              link-route="/personal"
            />
          </div>
        
        </div>
      </template>
      
      <!-- Временная кнопка в режиме разработки для состояния до запроса звонка -->
      <!-- <template v-if="currentTab === 'by_phone_call' && !callRequested">
        <div class="content_container">
          <MainButton
            v-if="isDevelopment"
            type="primary-outline"
            text="Следующий шаг (временно)"
            @click="goToNextSteps"
            class="signin_button"
          />
        </div>
      </template> -->
      
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import AuthTabs from '@/components/molecules/AuthTabs.vue'
import AuthLogoHeader from '@/components/molecules/AuthLogoHeader.vue'
import MainButton from '@/components/atoms/MainButton.vue'
import Input from '@/components/atoms/Input.vue'
import ResendCodeTimer from '@/components/atoms/ResendCodeTimer.vue'
import CodeInput from '@/components/atoms/CodeInput.vue'
import Checkbox from '@/components/atoms/Checkbox.vue'
import AgreementCheck from '@/components/atoms/AgreementCheck.vue'
import InputGroup from '@/components/molecules/InputGroup.vue'
import InputBlock from '@/components/atoms/InputBlock.vue'
import FormField from '@/components/atoms/FormField.vue'
import FooterInfo from '@/components/atoms/FooterInfo.vue'
import { getAPIError, getAPIErrorMessage, replace8to7inPhone, clearPhoneAlwaysSeven, clearPhoneWithoutPlus, getStringFromSeconds } from '@/constants/helpers'
import { rules, rulesSets } from '@/constants/validations'
import { formatPhone } from '@/constants/masks'
import { useAuth } from '@/composables/useAuth'
const tabs = [
  { text: 'Вход по паролю', value: 'by_password' },
  { text: 'Вход по звонку', value: 'by_phone_call' },
]
const SIGNIN_STATE_KEY = 'signin_state_v1'

export default {
  components: { AuthTabs, AuthLogoHeader, MainButton, Input, ResendCodeTimer, CodeInput, Checkbox, AgreementCheck, InputGroup, InputBlock, FormField, FooterInfo },
  layout: 'empty',
  data () {
    return {
      rules,
      rulesSets,
      loading: false,
      smsCode: '',
      agree: true,
      termAgree: true,
      login: {
        phone_or_email: '',
        password: '',
      },
      phone: '',
      requestHandler: '',
      tabs: [
        { text: 'Вход по паролю', value: 'by_password' },
        { text: 'Вход по звонку', value: 'by_phone_call' },
      ],
      inputRules: [(v) => !!v || 'Заполните поле'],
      passwordRules: [(v) => !!v || 'Заполните поле'],
      currentTab: 'by_password',
      callRequested: false,
      oldMethod: false,
      authInterval: null,
      onceToken: null,
      callToPhone: null,
      callRequestErrorMsg: null,
      loginClient: null,
      authLoading: false,
      authError: null,
      isDevelopment: process.env.NODE_ENV === 'development',
    }
  },
  created () {
    this.restoreSigninState()
    try {
      // Инициализируем loginClient из useAuth
      const { loginClient, loading: authLoading, error: authError, getErrorMessage } = useAuth()
      
      this.loginClient = loginClient
      this.authLoading = authLoading
      this.authError = authError
      this.getErrorMessage = getErrorMessage
    } catch (error) {
      // Ошибка инициализации
    }

  },
  computed: {
    disableHandler () {
      return !this.login.phone_or_email || !this.login.password
    },
    disablePhoneHandler () {
      return !this.phone
    },
  },
  async mounted () {
    if (this.$route.query.once_token) await this.loginByToken(this.$route.query.once_token)
  },
  watch: {
    currentTab () {
      this.persistSigninState()
    },
    callRequested () {
      this.persistSigninState()
    },
    phone () {
      this.persistSigninState()
    },
    onceToken () {
      this.persistSigninState()
    },
    oldMethod () {
      this.persistSigninState()
    },
    smsCode () {
      this.persistSigninState()
    },
    termAgree () {
      this.persistSigninState()
    },
    agree () {
      this.persistSigninState()
    }
  },
  async beforeUnmount () {
    if (this.authInterval) clearInterval(this.authInterval)
  },
  methods: {
    ...mapActions('auth', ['signIn', 'auth']),
    ...mapActions('notifications', ['showNotification']),
    ...mapActions('user', ['fetchUser']),

    persistSigninState () {
      if (typeof window === 'undefined') return
      const state = {
        currentTab: this.currentTab,
        callRequested: this.callRequested,
        phone: this.phone,
        onceToken: this.onceToken,
        oldMethod: this.oldMethod,
        smsCode: this.smsCode,
        termAgree: this.termAgree,
        agree: this.agree,
      }
      try {
        localStorage.setItem(SIGNIN_STATE_KEY, JSON.stringify(state))
      } catch (error) {
        // ignore
      }
    },
    restoreSigninState () {
      if (typeof window === 'undefined') return
      const rawState = localStorage.getItem(SIGNIN_STATE_KEY)
      if (!rawState) return
      try {
        const state = JSON.parse(rawState)
        if (state.currentTab) this.currentTab = state.currentTab
        if (typeof state.callRequested === 'boolean') this.callRequested = state.callRequested
        if (typeof state.phone === 'string') this.phone = state.phone
        if (typeof state.onceToken === 'string') this.onceToken = state.onceToken
        if (typeof state.oldMethod === 'boolean') this.oldMethod = state.oldMethod
        if (typeof state.smsCode === 'string') this.smsCode = state.smsCode
        if (typeof state.termAgree === 'boolean') this.termAgree = state.termAgree
        if (typeof state.agree === 'boolean') this.agree = state.agree
      } catch (error) {
        localStorage.removeItem(SIGNIN_STATE_KEY)
      }
    },
    clearSigninState () {
      if (typeof window === 'undefined') return
      localStorage.removeItem(SIGNIN_STATE_KEY)
    },


    changeTab (value) {
      this.currentTab = value
    },


    changeCallRequestedStatus () {
      this.callRequested = false
      if (this.authInterval) {
        clearInterval(this.authInterval)
        this.authInterval = null
      }
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

    async authCallCheck () {
      const response = await this.$axios.get('v2/auth/recovery/pollingwaitcall', {
        params: {
          once_token: this.onceToken,
        },
      })
      if (response?.data?.data?.status === 'validated') {
        if (this.authInterval) {
          clearInterval(this.authInterval)
          this.authInterval = null
        }
        await this.auth(response.data.data?.token)
        this.clearSigninState()
        this.$router.push('/client/profile')
      }
    },

    changeOldAuthMethod () {
      this.oldMethod = !this.oldMethod
      if (!this.oldMethod) {
        this.authInterval = setInterval(this.authCallCheck, 5000)
      }
     
    },

    async onSubmitByCall (event) {
      if (event) {
        event.preventDefault()
      }
      if (!this?.$refs?.call?.validate() || this.loading) return
      this.callRequestErrorMsg = null
      if (!this.agree || !this.termAgree) {
        this.showNotification({
          type: 'error',
          text: 'Для продолжения использования сервиса необходимо согласиться на обработку персональных данных и с политикой в отношении обработки персональных данных.',
        })
        return
      }
      this.loading = true
      try {
        // Используем правильный API согласно документации
        const phone = clearPhoneWithoutPlus(this.phone)
        const response = await this.$axios.get(
          'api/v2/auth/recovery/client/request-code',
          { 
            params: { 
              login_phone: phone,
              verification_by: 'telegram' // По умолчанию telegram
            },
            errorMessage: 'Ошибка при запросе кода' 
          },
        )
        if (response?.data?.success) {
          // Сохраняем телефон в store
          this.$store.commit('user/setRegistrationData', {
            phone,
            citizenship: 'RU'
          })
          
          this.callRequested = true
          this.onceToken = response?.data?.data?.once_token
          // Согласно документации, код отправляется через Telegram или SMS
          // Не используем waitcall метод
          this.oldMethod = false // Для отображения экрана ввода кода из телеграм
        } else {
          this.callRequestErrorMsg = getAPIErrorMessage(response)
          this.showNotification({
            text: getAPIErrorMessage(response) || 'Ошибка при запросе кода.',
          })
        }
      } catch (error) {
        if (this.authInterval) {
          clearInterval(this.authInterval)
          this.authInterval = null
        }
      }
      this.loading = false
    },

    copyPhoneNumber () {
      navigator.clipboard
        .writeText(this.callToPhone)
        .then(() => {
          this.showNotification({ type: 'success', text: 'Номер скопирован' })
        })
        .catch(() => {
          this.showNotification({ type: 'error', text: 'Не удалось скопировать номер' })
        })
    },

    async signinHandler () {
      if (!this.$refs.form.validate() || this.loading || this.authLoading) {
        return
      }
      
      if (!this.agree || !this.termAgree) {
        this.showNotification({
          type: 'error',
          text: 'Для продолжения использования сервиса необходимо согласиться на обработку персональных данных и с политикой в отношении обработки персональных данных.',
        })
        return
      }
      
      if (this.login.phone_or_email && this.login.password) {
        this.loading = true
        // Очищаем телефон от + и пробелов, оставляем только цифры
        const phoneOrEmail = replace8to7inPhone(this.login.phone_or_email)
        const cleanPhone = phoneOrEmail.replace(/\D/g, '')
        const password = this.login.password
        
        try {
          if (typeof this.loginClient === 'function') {
            const success = await this.loginClient(cleanPhone, password)
            
            if (success) {
              this.clearSigninState()
              this.$router.push('/client/profile')
            } else {
              // Ошибка уже обработана в useAuth
              const errorMsg = this.getErrorMessage(this.authError?.value || this.authError)
              if (errorMsg && errorMsg !== 'Неизвестная ошибка') {
                this.showNotification({
                  text: errorMsg,
                })
              } else {
                this.showNotification({
                  text: 'Ошибка при попытке авторизоваться',
                })
              }
            }
          } else {
            // Попробуем инициализировать loginClient
            try {
              const { loginClient } = useAuth()
              this.loginClient = loginClient
              
              if (typeof this.loginClient === 'function') {
                const success = await this.loginClient(cleanPhone, password)
                
                if (success) {
                  this.clearSigninState()
                  this.$router.push('/client/profile')
                } else {
                  const errorMsg = this.getErrorMessage(this.authError?.value || this.authError)
                  if (errorMsg && errorMsg !== 'Неизвестная ошибка') {
                    this.showNotification({
                      text: errorMsg,
                    })
                  } else {
                    this.showNotification({
                      text: 'Ошибка при попытке авторизоваться',
                    })
                  }
                }
              } else {
                throw new Error('loginClient не является функцией после инициализации')
              }
            } catch (initError) {
              throw new Error('Не удалось инициализировать loginClient')
            }
          }
        } catch (error) {
          this.showNotification({
            text: 'Ошибка при попытке авторизоваться',
          })
        }
      }
      this.loading = false
    },

    async loginByToken (once_token) {
      this.loading = true
      const response = await this.signIn({ once_token })
      if (response?.data?.success) {
        this.clearSigninState()
        this.$router.push('/client/profile')
      } else {
        this.showNotification({
          text: getAPIErrorMessage(response) || 'Ошибка при попытке авторизоваться',
        })
      }
      this.loading = false
    },

    forgot () {
      this.$router.push('/client/signin-recovery')
    },

    goToRegistration () {
      this.$router.push('/client/signup')
    },

    makeCall () {
      const telUrl = `tel:${this.callToPhone}`
      window.location.href = telUrl
    },

    goToNextSteps () {
      // Временный переход по шагам внутри страницы signin
      if (this.currentTab === 'by_phone_call') {
        if (!this.callRequested) {
          // Шаг 1 -> Шаг 2: показать экран ввода кода из телеграм
          this.callRequested = true
          // Для показа экрана ввода кода
          this.oldMethod = false
          return
        }
        if (this.callRequested && this.oldMethod) {
          // Имитация успешной авторизации после ввода кода
          this.$router.push('/client/profile')
          return
        }
        // Иначе завершаем
        this.$router.push('/')
        return
      }
      // Для вкладки по паролю — имитируем успешный вход
      this.$router.push('/client/profile')
    },

    async sendCodeAgain () {
      if (this.loading) return
      this.loading = true
      try {
        const response = await this.$axios.get(
          'api/v2/auth/recovery/client/request-code',
          { 
            params: { login_phone: clearPhoneWithoutPlus(this.phone) },
            errorMessage: 'Ошибка при запросе кода' 
          },
        )
        if (response?.data?.success) {
          this.showNotification({ type: 'success', text: 'Код отправлен повторно' })
        }
      } finally {
        this.loading = false
      }
    },

    async submitSmsCode () {
      if (this.loading) return
      if (!this.onceToken) {
        this.showNotification({
          type: 'error',
          text: 'Ошибка: отсутствует токен. Пожалуйста, запросите код заново.'
        })
        return
      }
      
      this.loading = true
      try {
        // Используем правильный API для подтверждения кода восстановления
        const response = await this.$axios.post(
          'api/v2/auth/recovery/client/submit-code',
          { 
            once_token: this.onceToken,
            code: this.smsCode 
          },
          { errorMessage: 'Ошибка при отправке кода' },
        )
        if (response?.data?.success) {
          // После подтверждения кода получаем новый once_token для установки пароля
          // Но для входа по звонку нужно авторизовать пользователя
          // Согласно документации, после подтверждения кода нужно установить пароль
          // Но для входа по звонку это не требуется - пользователь уже авторизован
          // Проверяем, есть ли токен в ответе
          const newOnceToken = response.data.data?.once_token
          if (newOnceToken) {
            // Сохраняем новый токен для возможной установки пароля
            this.onceToken = newOnceToken
            // Для входа по звонку после подтверждения кода пользователь авторизован
            // Но токен авторизации должен быть получен отдельно
            // Пока что просто переходим на главную
            this.showNotification({
              type: 'success',
              text: 'Код подтвержден'
            })
            // Если в ответе есть токен авторизации, используем его
            if (response.data.data?.token || response.data.data?.authToken) {
              const token = response.data.data?.token || response.data.data?.authToken
              await this.auth(token)
              this.clearSigninState()
              this.$router.push('/client/profile')
            } else {
              // Если токена нет, возможно нужно установить пароль
              // Пока что просто переходим на главную
              this.clearSigninState()
              this.$router.push('/')
            }
          } else {
            this.showNotification({
              type: 'error',
              text: 'Токен не получен'
            })
          }
        } else {
          this.showNotification({
            type: 'error',
            text: getAPIErrorMessage(response) || 'Ошибка при подтверждении кода'
          })
        }
      } catch (error) {
        this.showNotification({
          type: 'error',
          text: getAPIError(error) || 'Ошибка при отправке кода'
        })
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss">
.app_store {
  font-family: SFCompact;
  font-weight: 350;
  line-height: 100%;
  font-style: light;
  letter-spacing: -0.51px;
}
.login_page {
  min-height: 100%;
  width: 100%;
  padding: 24px 16px;
  background: linear-gradient(90.3deg, #edf2ff -1.79%, #ffffff 99.73%);

  display: flex;
  align-items: center;
  justify-content: center;

  .form_header {
    color: #263043;
    font-size: 24px;
    font-weight: 600;
    line-height: 30px;
    text-align: center;
    margin-top: 12px;
  }

  .logo_block {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
  .logo_icons {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
  .ruqi_logo_text {
    width: 146px;
    height: 48px;
  }

  .form_block {
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
    box-shadow:
      0px 8px 48px 4px #0234e30a,
      0px 0px 10px 0px #1735f508;
    @media (max-width: 768px) {
      padding: 0;
      box-shadow: unset;
      max-width: 100%;
      border-radius: 0;
    }
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

  .signin_button {
    width: 100%;
    max-width: none;
  }
  .get_in_button{
    font-weight: 600;
  }
  .password_forgot {
    cursor: pointer;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    color: #4E64F2;
  }

  .action_btn_text::after {
    content: ' исходящим';
  }

  .action_group {
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 24px;
    
  }
  .personal-agreement-checkbox {
    display: flex;
    gap: 12px;
    flex-direction: row;
    align-items: flex-start;
    .checkbox {
      padding: 0;
    }
  }
  .agreement-check {
    display: flex;
    align-items: flex-start;
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
  .footer_info {
    width: 100%;
    border-radius: 16px;
    overflow-wrap: break-word;
    padding: 24px;
    background-color: #eff2fd;
  }
  .action_description {
    align-self: center;
    max-width: 438px;
    font-size: 18px;
    font-weight: 600;
    line-height: 26px;
    text-align: center;
  }
  .phone_no_wrap {
    user-select: none;
    white-space: nowrap;
  }
  .call_to_phone {
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
  }
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

  .change_number_btn {
    width: 100%;
    max-width: none;
    text-align: center;
  }

  .call_btn_mobile {
    width: 100%;
    max-width: none;
    display: none; /* Скрыта по умолчанию */
    text-align: center;
  }

  .call_btn {
    opacity: 0;
    display: none !important;
  }

  .apps_block {
    .title {
      text-align: center;
      margin-bottom: 16px;
    }
    .apps_button_block {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .app_container {
      display: flex;
      gap: 10px;
      border-radius: 8px;
      background: black;
      color: white;
      padding: 9px 16px;
      width: 163px;
      cursor: pointer;
      user-select: none;
      &:hover {
        background: rgb(35, 35, 35);
      }
    }
    .app_text {
      font-size: 12px;
      line-height: 15px;
    }
    .app_name {
      font-weight: 600;
      line-height: 20px;
    }
  }


  @media (max-width: 768px) {
    background: transparent;
    .action_btn_text::after {
      content: '';
    }
    
    /* Показываем кнопку "Позвонить" на мобильных устройствах */
    .call_btn_mobile {
      display: block !important;
    }
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
}
.agreements_check {
  display: flex;
  gap: 4px;
  flex-direction: column;
}
</style>
