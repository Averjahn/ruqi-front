<template>
  <div class="signup-page">
    <div class="signup-page__wrapper">
      <div class="signup-page__header">
        <img class="mb_8" src="@/assets/icons/ruqi_dark_blue_rounded.svg" />
        <img class="mb_18" src="@/assets/icons/logo.svg" />
        <h3>Регистрация</h3>
      </div>

      <div class="signup-page__body">
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

        <div class="signup-page__info">
          <p>
            Введите свой номер телефона для быстрой и безопасной авторизации. 
            Мы отправим его в систему для проверки, после чего вы получите номер, 
            на который нужно будет позвонить. Если звонок поступит с указанного 
            вами номера, доступ будет предоставлен автоматически.
          </p>
        </div>

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
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import MainButton from '@/components/atoms/MainButton.vue'
import { getAPIError, clearPhoneAlwaysSeven, getStringFromSeconds } from '@/constants/helpers'
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
        const response = await this.$axios.post(
          'v2/auth/sms/sendcode',
          { login_phone: clearPhoneAlwaysSeven(this.phone) },
          { errorMessage: 'Ошибка при запросе кода' },
        )
        if (response?.data?.success) {
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

    goToSignIn () {
      this.$router.push('/signin')
    },
  },
}
</script>

<style lang="scss" scoped>
.signup-page {
  min-height: 100%;
  width: 100%;
  padding: 24px 16px;
  background: linear-gradient(90.3deg, #edf2ff -1.79%, #ffffff 99.73%);
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
    gap: 20px;
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
  }

  &__btn {
    width: 100%;
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
    margin: 16px 0;

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
