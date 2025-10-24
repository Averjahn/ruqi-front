<template>
  <div class="signup-page">
    <div class="signup-page__wrapper">
      <div class="signup-page__header">
        <img class="mb_8" src="@/assets/icons/ruqi_dark_blue_rounded.svg" />
        <img class="mb_18" src="@/assets/icons/logo.svg" />
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
          <div class="personal-agreement-checkbox">
            <Checkbox v-model="termAgree" class="checkbox" />
            <div class="agreement-check">
              <div>
                Я ознакомился(-ась) и согласен(-на) с
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

      <!-- Шаг 2: Форма регистрации -->
      <div class="signup-page__body" v-if="step === 2">
        <h4>Завершите регистрацию</h4>
        
        <div class="form-row">
          <Input 
            class="input" 
            label="Имя" 
            v-model="registrationData.firstname"
            placeholder="Введите имя"
          />
          <Input 
            class="input" 
            label="Фамилия" 
            v-model="registrationData.lastname"
            placeholder="Введите фамилию"
          />
        </div>

        <Input 
          class="input" 
          label="Отчество" 
          v-model="registrationData.middlename"
          placeholder="Введите отчество (необязательно)"
        />

        <Input 
          class="input" 
          label="Email" 
          v-model="registrationData.email"
          type="email"
          placeholder="example@email.com"
        />

        <Input 
          class="input" 
          label="Дата рождения" 
          v-model="registrationData.birthday"
          type="date"
        />

        <Input 
          class="input" 
          label="Гражданство" 
          v-model="registrationData.citizenship"
          placeholder="RU"
        />

        <Input 
          class="input" 
          label="Название компании" 
          v-model="registrationData.company_name"
          placeholder="ООО Ромашка"
        />

        <Input 
          class="input" 
          label="ИНН компании" 
          v-model="registrationData.company_inn"
          placeholder="1234567890"
        />

        <MainButton
          type="primary"
          text="Завершить регистрацию"
          :loading="loading"
          :disabled="!isRegistrationFormValid"
          class="signup-page__btn"
          @click="submitRegistration"
        />

        <MainButton 
          type="neutral" 
          text="Назад" 
          class="signup-page__btn signup-page__btn--secondary"
          @click="step = 1" 
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import MainButton from '@/components/atoms/MainButton.vue'
import { getAPIError, clearPhoneAlwaysSeven, clearPhoneWithoutPlus, getStringFromSeconds } from '@/constants/helpers'
import { formatPhone } from '@/constants/masks'
import useTimer from '@/composables/useSnackbarTimer'

export default {
  name: 'SignUp',
  layout: 'empty',
  components: { MainButton },
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
      registrationData: {
        firstname: '',
        lastname: '',
        middlename: '',
        phone: '',
        email: '',
        birthday: '',
        citizenship: 'RU',
        company_name: '',
        company_inn: ''
      }
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
    isRegistrationFormValid () {
      return !!(
        this.registrationData.firstname && 
        this.registrationData.lastname && 
        this.registrationData.email && 
        this.registrationData.phone
      )
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
      if (!this.agree || !this.termAgree) {
        this.showNotification({
          type: 'error',
          text: 'Для продолжения использования сервиса необходимо согласиться на обработку персональных данных и с политикой в отношении обработки персональных данных.',
        })
        return
      }
      
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
          // Сохраняем номер телефона для регистрации
          this.registrationData.phone = clearPhoneWithoutPlus(this.phone)
          this.step = 2
          this.launchTimer(180)
        } else {
          this.showNotification({
            text: getAPIError(response) || 'Ошибка при запросе кода.',
          })
        }
      } catch (error) {
        this.showNotification({
          text: 'Ошибка при запросе кода.',
        })
      }
      this.loading = false
    },

    async submitRegistration () {
      // Валидация обязательных полей
      if (!this.registrationData.firstname || !this.registrationData.lastname || 
          !this.registrationData.email || !this.registrationData.phone) {
        this.showNotification({
          type: 'error',
          text: 'Пожалуйста, заполните все обязательные поля.',
        })
        return
      }

      this.loading = true
      try {
        const response = await this.$axios.post('api/auth/register/client', this.registrationData)
        
        if (response?.data?.success) {
          this.showNotification({
            type: 'success',
            text: 'Регистрация успешно завершена!',
          })
          // Перенаправляем на страницу входа
          this.$router.push('/client/signin')
        } else {
          this.showNotification({
            type: 'error',
            text: getAPIError(response) || 'Ошибка при регистрации.',
          })
        }
      } catch (error) {
        this.showNotification({
          type: 'error',
          text: 'Ошибка при регистрации.',
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
    gap: 10px;
    align-items: center;

    h3 {
      color: #263043;
      font-size: 24px;
      font-weight: 600;
      line-height: 30px;
      text-align: center;
      margin: 0;
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
    gap: 20px;
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
    min-height: 48px;
    font-size: 16px;
    font-weight: 500;

    &--secondary {
      margin-top: 8px;
    }
  }

  &__info {
    background: #EFF2FD;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 24px;
    margin: 8px 0;

    p {
      margin: 0;
      font-size: 14px;
      line-height: 20px;
      color: #666666;
    }
  }

  .remaining {
    text-align: center;
    font-size: 14px;
    color: #666666;
    margin: 8px 0;
  }

  .agreements_check {
    margin-top: 24px;
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
      font-size: 14px;
      line-height: 20px;
      color: #333333;

      .agreement-src {
        color: #1735f5;
        cursor: pointer;
        text-decoration: underline;

        &:hover {
          color: #4e64f2;
        }
      }
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
