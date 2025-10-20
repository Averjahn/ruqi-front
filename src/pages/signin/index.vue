<template>
  <div class="login_page">
    <div class="form_block">
      <div class="logo_block">
        <div class="logo_icons">
          <img src="@/assets/icons/ruqi_dark_blue_rounded.svg" />
          <img class="ruqi_logo_text" src="@/assets/icons/logo.svg" />
        </div>
        <div class="form_header">Вход в систему</div>
      </div>
      <Tabs :tabs="tabs" :value="currentTab" @change="changeTab" type="contained" wide />

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
            <Button size="l" @click="signinHandler" :disabled="disableHandler" :loading="loading" class="signin_button">
              Войти
            </Button>
            <div class="agreements_check">
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
          </div>
          <div class="apps_block">
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
              <Button
                size="l"
                type="outlined"
                @click="onSubmitByCall"
                :disabled="disablePhoneHandler"
                :loading="loading"
                class="signin_button"
              >
                <span class="action_btn_text">Подтвердить</span>звонком
              </Button>
              <div class="footer_info">
                Введите свой номер телефона для быстрой и безопасной авторизации. Мы отправим его в систему для
                проверки, после чего вы получите номер, на который нужно будет позвонить. Если звонок поступит с
                указанного вами номера, доступ будет предоставлен автоматически.
              </div>
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
          </template>
          <div class="agreements_check">
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
          <div class="apps_block">
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
          </div>
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
import { getAPIError, replace8to7inPhone, clearPhoneAlwaysSeven, getStringFromSeconds } from '@/constants/helpers'
import { rules, rulesSets } from '@/constants/validations'
import { formatPhone } from '@/constants/masks'
import useTimer from '@/composables/useSnackbarTimer'
const tabs = [
  { text: 'Вход по паролю', value: 'by_password' },
  { text: 'Вход по звонку', value: 'by_phone_call' },
]

export default {
  components: { SignInBySms },
  layout: 'empty',
  setup () {
    const { launchTimer, isTimerRunning, remaining } = useTimer({
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
      authInterval: null,
      onceToken: null,
      callToPhone: null,
      callRequestErrorMsg: null,
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
        const response = await this.$axios.post(
          'v2/auth/sms/sendcode',
          { login_phone: clearPhoneAlwaysSeven(this.phone) },
          { errorMessage: 'Ошибка при запросе смс кода' },
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
          this.callRequestErrorMsg = getAPIError(response)
          this.showNotification({
            text: getAPIError(response) || 'Ошибка при запросе номера.',
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
      if (!this.$refs.form.validate() || this.loading) return
      if (!this.agree || !this.termAgree) {
        this.showNotification({
          type: 'error',
          text: 'Для продолжения использования сервиса необходимо согласиться на обработку персональных данных и с политикой в отношении обработки персональных данных.',
        })
        return
      }
      if (this.login.phone_or_email && this.login.password) {
        this.loading = true
        const login = JSON.parse(JSON.stringify(this.login))
        login.phone_or_email = replace8to7inPhone(login.phone_or_email)
        const response = await this.signIn(login)
        if (response?.data?.success) {
          this.$router.push('/')
        } else {
          this.showNotification({
            text: getAPIError(response) || 'Ошибка при попытке авторизоваться',
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
          text: getAPIError(response) || 'Ошибка при попытке авторизоваться',
        })
      }
      this.loading = false
    },

    forgot () {
      this.$router.push('/signin-recover')
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
    padding-right: 0;
    padding-left: 0;

    .slot {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
  }
  .password_forgot {
    cursor: pointer;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
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
    text-wrap: nowrap;
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
