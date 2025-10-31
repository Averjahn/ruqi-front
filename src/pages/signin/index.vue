<template>
  <div class="login_page">
    <div class="form_block">
      <div class="logo_block">
        <div class="logo_icons">
          <img src="@/assets/icons/ruqi_dark_blue_rounded.svg" />
          <img class="ruqi_logo_text" src="@/assets/icons/logo.svg" />
        </div>
        <div class="form_header">{{ callRequested ? 'Восстановление пароля' : 'Вход в систему' }}</div>
      </div>
      <AuthTabs v-if="!callRequested" :value="currentTab" :old-method="oldMethod" @change="changeTab" />

      <template v-if="currentTab === 'by_password'">
        <Form ref="form" class="content_container">
          <div class="input_group">
            <div class="input_block">
              <div class="label">Email или номер телефона</div>
              <Input
                v-model="login.phone_or_email"
                name="phone_or_email"
                @keyup.enter="signinHandler"
                class="form_input"
                clearable
                :rules="inputRules"
              />
            </div>
            <div class="input_block">
              <div class="label">Пароль</div>
              <Input
                v-model="login.password"
                name="password"
                class="form_input"
                type="password"
                :rules="passwordRules"
                @keyup.enter="signinHandler"
              />
            </div>
            <ButtonText class="password_forgot" type="s" @click="forgot()">Забыли пароль?</ButtonText>
          </div>
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
            <MainButton
              v-if="isDevelopment"
              type="primary-outline"
              text="Следующий шаг (временно)"
              @click="goToNextSteps"
              class="signin_button"
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
     
        </Form>
      </template>
      <template v-if="currentTab === 'by_phone_call'">
        <div class="content_container">
          <template v-if="!callRequested">
            <Form ref="call" @submit.prevent="onSubmitByCall" class="content_container">
              <div class="input_group">
                <div class="input_block">
                  <div class="label">Телефон</div>
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
                </div>
              </div>
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
            <div class="call_instruction_card">
              <div class="call_instruction_text">
                Сделайте бесплатный звонок с номера {{ phone }}, чтобы авторизоваться
              </div>
              <div class="phone_display">
                <img class="phone_icon" src="@/assets/icons/phone_call_filled_lightBlue.svg" />
                <span class="phone_number">{{ callToPhone || '+7 (999) 999-99-99' }}</span>
                <img class="copy_icon" src="@/assets/icons/copy_outlined.svg" @click="copyPhoneNumber" />
              </div>
            </div>
            <!-- Кнопка "Позвонить" - видна только на мобильных устройствах -->
            <MainButton
              type="primary"
              text="Позвонить"
              @click="makeCall"
              :loading="loading"
              class="signin_button call_btn_mobile"
            />
            
            <MainButton
              type="primary-outline"
              :text="!!this.remaining ? `Изменить номер через ${remainingTimeString}` : 'Изменить номер'"
              @click="changeCallRequestedStatus"
              :disabled="loading || isTimerRunning"
              :loading="loading"
              class="signin_button change_number_btn"
            />
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
      <template v-if="currentTab === 'by_phone_call' && !callRequested">
        <div class="content_container">
          <MainButton
            v-if="isDevelopment"
            type="primary-outline"
            text="Следующий шаг (временно)"
            @click="goToNextSteps"
            class="signin_button"
          />
        </div>
      </template>
      
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import AuthTabs from '@/components/molecules/AuthTabs.vue'
import MainButton from '@/components/atoms/MainButton.vue'
import ResendCodeTimer from '@/components/atoms/ResendCodeTimer.vue'
import Checkbox from '@/components/atoms/Checkbox.vue'
import AgreementCheck from '@/components/atoms/AgreementCheck.vue'
import { getAPIError, getAPIErrorMessage, replace8to7inPhone, clearPhoneAlwaysSeven, clearPhoneWithoutPlus, getStringFromSeconds } from '@/constants/helpers'
import { rules, rulesSets } from '@/constants/validations'
import { formatPhone } from '@/constants/masks'
import useTimer from '@/composables/useSnackbarTimer'
import { useAuth } from '@/composables/useAuth'
const tabs = [
  { text: 'Вход по паролю', value: 'by_password' },
  { text: 'Вход по звонку', value: 'by_phone_call' },
]

export default {
  components: { AuthTabs, MainButton, ResendCodeTimer, Checkbox, AgreementCheck },
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
        { text: 'Вход по звонку', value: 'by_phone_call' },
        { text: 'Вход по паролю', value: 'by_password' },
      ],
      inputRules: [(v) => !!v || 'Заполните поле'],
      passwordRules: [(v) => !!v || 'Заполните поле'],
      currentTab: 'by_phone_call',
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
  mounted () {
    try {
      // Инициализируем loginClient из useAuth
      const { loginClient, loading: authLoading, error: authError } = useAuth()
      
      this.loginClient = loginClient
      this.authLoading = authLoading
      this.authError = authError
    } catch (error) {
      // Ошибка инициализации
    }

  },
  computed: {
    remainingTimeString () {
      return getStringFromSeconds(this.remaining)
    },
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
  async beforeUnmount () {
    if (this.authInterval) clearInterval(this.authInterval)
  },
  methods: {
    ...mapActions('auth', ['signIn', 'auth']),
    ...mapActions('notifications', ['showNotification']),
    ...mapActions('user', ['fetchUser']),


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
        this.$router.push('/')
      }
    },

    changeOldAuthMethod () {
      this.oldMethod = !this.oldMethod
      if (!this.oldMethod) {
        this.launchTimer(180)
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
        // Используем правильный API v2/auth/sms/sendcode
        const response = await this.$axios.get(
          'api/v2/auth/recovery/client/request-code',
          { 
            params: { login_phone: clearPhoneWithoutPlus(this.phone) },
            errorMessage: 'Ошибка при запросе смс кода' 
          },
        )
        if (response?.data?.success) {
          // Сохраняем телефон в store
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
          
          this.callRequested = true
          this.onceToken = response?.data?.data?.once_token
          if (response?.data?.data?.code_sended?.method === 'waitcall') {
            this.callToPhone = replace8to7inPhone(response?.data?.data?.code_sended?.callto)
            this.launchTimer(180)
            this.authInterval = setInterval(this.authCallCheck, 5000)
          } else {
          this.changeOldAuthMethod()
          this.launchTimer(180)
          }
        } else {
          this.callRequestErrorMsg = getAPIErrorMessage(response)
          this.showNotification({
            text: getAPIErrorMessage(response) || 'Ошибка при запросе номера.',
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
        const phoneOrEmail = replace8to7inPhone(this.login.phone_or_email)
        const password = this.login.password
        
        try {
          if (typeof this.loginClient === 'function') {
            const success = await this.loginClient(phoneOrEmail, password)
            
            if (success) {
              this.$router.push('/')
            } else {
              // Ошибка уже обработана в useAuth
              if (this.authError) {
                this.showNotification({
                  text: this.authError.msg || 'Ошибка при попытке авторизоваться',
                })
              }
            }
          } else {
            // Попробуем инициализировать loginClient
            try {
              const { loginClient } = useAuth()
              this.loginClient = loginClient
              
              if (typeof this.loginClient === 'function') {
                const success = await this.loginClient(phoneOrEmail, password)
                
                if (success) {
                  this.$router.push('/')
                } else {
                  if (this.authError) {
                    this.showNotification({
                      text: this.authError.msg || 'Ошибка при попытке авторизоваться',
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
        this.$router.push('/')
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
          // Шаг 1 -> Шаг 2: показать экран с инструкцией звонка
          this.callRequested = true
          // Переходим сразу на ввод кода (как в макете)
          this.oldMethod = true
          this.launchTimer(180)
          return
        }
        if (this.callRequested && this.oldMethod) {
          // Имитация успешной авторизации после ввода кода
          this.$router.push('/')
          return
        }
        // Иначе завершаем
        this.$router.push('/')
        return
      }
      // Для вкладки по паролю — имитируем успешный вход
      this.$router.push('/')
    },

    async sendCodeAgain () {
      if (this.loading) return
      this.loading = true
      try {
        const response = await this.$axios.get(
          'api/v2/auth/recovery/client/request-code',
          { 
            params: { login_phone: clearPhoneWithoutPlus(this.phone) },
            errorMessage: 'Ошибка при запросе смс кода' 
          },
        )
        if (response?.data?.success) {
          this.launchTimer(180)
          this.showNotification({ type: 'success', text: 'Код отправлен повторно' })
        }
      } finally {
        this.loading = false
      }
    },

    async submitSmsCode () {
      if (this.loading) return
      this.loading = true
      try {
        const response = await this.$axios.post(
          'v2/auth/login/contractor',
          { phone_or_email: clearPhoneWithoutPlus(this.phone), code: this.smsCode },
          { errorMessage: 'Ошибка при отправке смс кода' },
        )
        if (response?.data?.success) {
          await this.auth(response.data.data?.token)
          this.$router.push('/')
        }
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
  background: #f8f9fa;

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
    font-weight: 500;
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
