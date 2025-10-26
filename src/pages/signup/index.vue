<template>
  <div class="signup-page">
    <div class="signup-page__wrapper">
      <div class="signup-page__header">
        <img src="@/assets/icons/ruqi_dark_blue_rounded.svg" />
        <img class="logo-text" src="@/assets/icons/logo.svg" />
        <h3>Регистрация</h3>
      </div>

      <!-- Шаг 1: Ввод телефона -->
      <div class="signup-page__body" v-if="step === 1">
        <Input 
          class="input" 
          label="Телефон" 
          :value="formattedPhone" 
          @input="onPhone" 
          :disabled="isTimerRunning"
          placeholder="+7 (999) 000-00-00"
        />

        <div class="remaining" v-if="isTimerRunning">
          Отправить код повторно <b>{{ remainingTimeString }}</b>
        </div>

        <MainButton
          v-if="isTimerRunning"
          type="primary"
          text="Подтвердить исходящим звонком"
          :loading="loading"
          class="signup-page__btn"
          @click="step = 2"
        />
        <MainButton
          v-if="!isTimerRunning"
          type="primary"
          text="Подтвердить исходящим звонком"
          :loading="loading"
          class="signup-page__btn"
          @click="requestCode"
        />


        <FooterInfo 
          text="Введите свой номер телефона для быстрой и безопасной авторизации. Мы отправим его в систему для проверки, после чего вы получите номер, на который нужно будет позвонить. Если звонок поступит с указанного вами номера, доступ будет предоставлен автоматически."
        />

        <MainButton 
          type="neutral" 
          text="У меня есть логин" 
          class="signup-page__btn signup-page__btn--secondary"
          @click="goToSignIn" 
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

      <!-- Шаг 2: Инструкция о звонке -->
      <div class="signup-page__body" v-if="step === 2">
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
          class="signup-page__btn call_btn_mobile"
        />
        
        <MainButton
          type="primary-outline"
          :text="!!this.remaining ? `Изменить номер через ${remainingTimeString}` : 'Изменить номер'"
          @click="changeCallRequestedStatus"
          :disabled="loading || isTimerRunning"
          :loading="loading"
          class="signup-page__btn change_number_btn"
        />
      </div>

      <!-- Шаг 3: Создание пароля -->
      <div class="signup-page__body" v-if="step === 3">
        <h4>Создайте пароль</h4>
        
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
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import MainButton from '@/components/atoms/MainButton.vue'
import Input from '@/components/atoms/Input.vue'
import AgreementCheck from '@/components/atoms/AgreementCheck.vue'
import { getAPIError, clearPhoneAlwaysSeven, clearPhoneWithoutPlus, getStringFromSeconds } from '@/constants/helpers'
import { formatPhone } from '@/constants/masks'
import useTimer from '@/composables/useSnackbarTimer'
import authApi from '@/services/authApi'

export default {
  name: 'SignUp',
  layout: 'empty',
  components: { MainButton, Input, AgreementCheck },
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
      loading: false,
      agree: true,
      termAgree: true,
      phone: '',
      step: 1,
      isDevelopment: process.env.NODE_ENV === 'development',
      callToPhone: null,
      password: '',
      confirmPassword: '',
      activationToken: null
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
      if (!this.agree || !this.termAgree) {
        this.showNotification({
          type: 'error',
          text: 'Для продолжения использования сервиса необходимо согласиться на обработку персональных данных и с политикой в отношении обработки персональных данных.',
        })
        return
      }
      
      this.loading = true
      try {
        // Используем authApi для запроса кода
        const phone = clearPhoneWithoutPlus(this.phone)
        const result = await authApi.requestRecoveryCode(phone)
        
        if (result.success) {
          this.step = 2
          this.launchTimer(180)
        } else {
          this.showNotification({
            type: 'error',
            text: result.error?.[0]?.msg || 'Ошибка при запросе кода'
          })
        }
      } catch (error) {
        this.showNotification({
          type: 'error',
          text: getAPIError(error) || 'Ошибка при запросе кода'
        })
      }
      this.loading = false
    },


    // Методы для экрана звонка
    makeCall() {
      // Переходим к заполнению пароля
      this.step = 3
      // В реальном приложении токен активации должен прийти с сервера после звонка
      this.activationToken = 'real_activation_token_' + Date.now() // Заглушка для реального токена
      this.showNotification({
        type: 'success',
        text: 'Звонок выполнен. Переходим к созданию пароля.'
      })
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
      this.step = 1
      if (this.authInterval) {
        clearInterval(this.authInterval)
      }
    },

    async createAccount() {
      if (!this.isPasswordValid) {
        this.showNotification({
          type: 'error',
          text: 'Пароли не совпадают или не заполнены'
        })
        return
      }

      this.loading = true
      try {
        // Отправляем данные на эндпоинт установки пароля
        const response = await this.$axios.post('api/v2/auth/password/client/setup', {
          activation_token: this.activationToken, // Нужно получить токен активации
          password: this.password,
          confirm_password: this.confirmPassword
        })
        
        if (response?.data?.success) {
          this.showNotification({
            type: 'success',
            text: 'Пароль установлен! Переходим к заполнению данных организации.'
          })
          
          // Переходим в organisationData
          this.$router.push('/client/organisationData')
        } else {
          this.showNotification({
            type: 'error',
            text: getAPIError(response) || 'Ошибка при установке пароля'
          })
        }
      } catch (error) {
        console.error('Ошибка установки пароля:', error)
        this.showNotification({
          type: 'error',
          text: 'Ошибка при установке пароля'
        })
      }
      this.loading = false
    },

    goToSignIn () {
      this.$router.push('/client/signin')
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
      border: 1px solid #ced4da;
      color: #212529;
      font-family: 'Source Sans 3', sans-serif;
      font-size: 16px;
      font-weight: 400;
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
