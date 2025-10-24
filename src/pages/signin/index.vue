<template>
  <div class="login_page">
    <!-- DEBUG: Индикатор режима тестирования -->
    <div v-if="debugMode" class="debug-indicator">
      🧪 DEBUG MODE: Нажмите "y" для переключения
    </div>
    <div class="form_block">
      <div class="logo_block">
        <div class="logo_icons">
          <img src="@/assets/icons/ruqi_dark_blue_rounded.svg" />
          <img class="ruqi_logo_text" src="@/assets/icons/logo.svg" />
        </div>
        <div class="form_header">Вход в систему</div>
      </div>
      <AuthTabs :value="currentTab" :old-method="oldMethod" @change="changeTab" />

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
              class="signin_button"
            />
            <MainButton 
              type="neutral" 
              text="Регистрация"
              @click="goToRegistration" 
              class="signin_button signin_button--registration"
              button-type="button"
            />
            <div class="agreements_check">
              <AgreementCheck
                v-model="termAgree"
                text="Я ознакомился (-ась) и согласен (-на) с"
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
          <!-- <div class="apps_block">
            <div class="title">Установите наше приложение</div>

            <div class="apps_button_block">
              <a href="https://play.google.com/store/apps/details?id=ruqi.app&pcampaignid=web_share" target="_blank">
                <div class="app_container">
                  <img src="@/assets/icons/google_store.svg" />
                  <div class="app_text">
                    Скачать в
                    <div class="app_name">Google Play</div>
                  </div>
                </div>
              </a>
              <a href="https://www.rustore.ru/catalog/app/ruqi.app" target="_blank">
                <div class="app_container">
                  <img src="@/assets/icons/rustore.svg" />
                  <div class="app_text">
                    Скачать в
                    <div class="app_name">RuStore</div>
                  </div>
                </div>
              </a>
              <a href="https://apps.apple.com/ru/app/ruqi/id6748985382?platform=iphone" target="_blank">
                <div class="app_container">
                  <img src="@/assets/icons/app_store.svg" />
                  <div class="app_text">
                    Скачать в
                    <div class="app_store">App Store</div>
                  </div>
                </div>
              </a>
            </div>
          </div> -->
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
            <MainButton 
              type="primary" 
              text="Позвонить"
              @click="makeCall" 
              :loading="loading" 
              class="signin_button call_btn" 
            />
            <MainButton
              type="primary-outline"
              :text="!!this.remaining ? `Изменить номер через ${remainingTimeString}` : 'Изменить номер'"
              @click="changeCallRequestedStatus"
              :disabled="loading || isTimerRunning"
              :loading="loading"
              class="signin_button"
            />
          </template>
          <div v-if="currentTab !== 'by_phone_call'" class="agreements_check">
            <div class="personal-agreement-checkbox">
              <Checkbox v-model="termAgree" class="checkbox" />
              <div class="agreement-check">
                <div>
                  Я ознакомился (-ась) и согласен (-на) с
                  <span class="agreement-src" @click="$router.push('/privacy-policy')">
                    политикой в отношении обработки персональных данных
                  </span>
                </div>
              </div>
            </div>
            <div class="personal-agreement-checkbox">
              <Checkbox v-model="agree" class="checkbox" />
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
          <!-- <div class="apps_block">
            <div class="title">Установите наше приложение</div>
            <div class="apps_button_block">
              <a href="https://play.google.com/store/apps/details?id=ruqi.app&pcampaignid=web_share" target="_blank">
                <div class="app_container">
                  <img src="@/assets/icons/google_store.svg" />
                  <div class="app_text">
                    Скачать в
                    <div class="app_name">Google Play</div>
                  </div>
                </div>
              </a>
              <a href="https://www.rustore.ru/catalog/app/ruqi.app" target="_blank">
                <div class="app_container">
                  <img src="@/assets/icons/rustore.svg" />
                  <div class="app_text">
                    Скачать в
                    <div class="app_name">RuStore</div>
                  </div>
                </div>
              </a>
              <a href="https://apps.apple.com/ru/app/ruqi/id6748985382?platform=iphone" target="_blank">
                <div class="app_container">
                  <img src="@/assets/icons/app_store.svg" />
                  <div class="app_text">
                    Скачать в
                    <div class="app_store">App Store</div>
                  </div>
                </div>
              </a>
            </div>
          </div> -->
        </div>
      </template>
      <template v-if="currentTab === 'by_phone_call' && oldMethod">
        <SignInBySms :phone="phone" @goBack="changeCallRequestedStatus" @changeOldMethod="changeOldAuthMethod" />
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import SignInBySms from '@/components/molecules/SignInBySms.vue'
import AuthTabs from '@/components/molecules/AuthTabs.vue'
import MainButton from '@/components/atoms/MainButton.vue'
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
  components: { SignInBySms, AuthTabs, MainButton },
  layout: 'empty',
  data () {
    return {
      rules,
      rulesSets,
      loading: false,
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
      debugMode: false, // Временный переключатель для тестирования
      authInterval: null,
      onceToken: null,
      callToPhone: null,
      callRequestErrorMsg: null,
      loginClient: null,
      authLoading: false,
      authError: null,
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

    console.log('🎧 Добавляем обработчик клавиш keydown')
    console.log('🔧 this.handleKeyPress:', typeof this.handleKeyPress)
    console.log('🔧 document:', document)
    
    // Добавляем глобальный обработчик для тестирования
    const globalKeyHandler = (event) => {
      console.log('🌍 Глобальный обработчик сработал:', event.key)
    }
    document.addEventListener('keydown', globalKeyHandler)
    
    document.addEventListener('keydown', this.handleKeyPress)
    console.log('✅ Обработчик добавлен')
    
    // Очищаем обработчик при размонтировании
    this.$once('hook:beforeDestroy', () => {
      console.log('🧹 Удаляем обработчик клавиш')
      document.removeEventListener('keydown', this.handleKeyPress)
    })
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

    // Временный обработчик клавиши "y" для тестирования
    handleKeyPress (event) {
      console.log('🎯 handleKeyPress вызван!')
      console.log('🔍 Клавиша нажата:', event.key, 'Код:', event.code)
      console.log('🎯 Текущий debugMode:', this.debugMode)
      console.log('🎯 event.target:', event.target)
      console.log('🎯 event.currentTarget:', event.currentTarget)
      
      if (event.key === 'y' || event.key === 'Y') {
        console.log('✅ Клавиша Y обнаружена! Переключаем debugMode')
        this.debugMode = !this.debugMode
        console.log('🔄 Новый debugMode:', this.debugMode)
        
        if (this.debugMode) {
          console.log('🚀 Активируем режим тестирования')
          // Симулируем успешный запрос звонка
          this.callRequested = true
          this.onceToken = 'debug_token_' + Date.now()
          this.callToPhone = '+7 (999) 123-45-67'
          this.launchTimer(180)
          this.showNotification({
            type: 'success',
            text: 'DEBUG: Переключен в режим тестирования. Переходим к вводу кода.'
          })
        } else {
          console.log('⏹️ Отключаем режим тестирования')
          this.showNotification({
            type: 'info',
            text: 'DEBUG: Режим тестирования отключен.'
          })
        }
      } else {
        console.log('❌ Нажата не та клавиша:', event.key)
      }
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
        this.$router.push('/')
      }
    },

    changeOldAuthMethod () {
      this.oldMethod = !this.oldMethod
      if (!this.oldMethod) {
        this.launchTimer(180)
        this.authInterval = setInterval(this.authCallCheck, 5000)
      }
      this.tabs.forEach((tab) => {
        if (tab.value === 'by_phone_call') {
          tab.text = this.oldMethod ? 'Вход по смс' : 'Вход по звонку'
        }
      })
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
          this.callRequested = true
          this.onceToken = response?.data?.data?.once_token
          if (response?.data?.data?.code_sended?.method === 'waitcall') {
            this.callToPhone = replace8to7inPhone(response?.data?.data?.code_sended?.callto)
            this.launchTimer(180)
            this.authInterval = setInterval(this.authCallCheck, 5000)
          } else {
            this.changeOldAuthMethod()
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
  }

  .logo_block {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
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
    height: 40px;
    font-size: 16px;
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
    
    .main-button {
      width: 100%;
      max-width: none;
    }
  }
  .personal-agreement-checkbox {
    display: flex;
    gap: 12px;
    flex-direction: row;
    align-items: flex-start;
    .checkbox {
      padding: 6px 0;
    }
  }
  .agreement-check {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    text-align: left;
    vertical-align: middle;
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

  .debug-indicator {
    position: fixed;
    top: 10px;
    right: 10px;
    background: #ff6b6b;
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
    z-index: 9999;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
  }

  @media (max-width: 768px) {
    background: transparent;
    .action_btn_text::after {
      content: '';
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
