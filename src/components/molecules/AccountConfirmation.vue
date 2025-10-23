<template>
  <div class="account-confirmation">
    <div class="account-confirmation__wrapper">
      <!-- Header -->
      <div class="account-confirmation__header">
        <div class="account-confirmation__logo">
          <img class="account-confirmation__logo-icon" src="@/assets/icons/ruqi_dark_blue_rounded.svg" />
          <img class="account-confirmation__logo-text" src="@/assets/icons/logo.svg" />
        </div>
        <h3 class="account-confirmation__title">Подтверждение учетной записи</h3>
      </div>

      <!-- Form -->
      <div class="account-confirmation__body">
        <Form ref="form" class="account-confirmation__form">
          <!-- SMS Code Input -->
          <div class="account-confirmation__field">
            <Input
              v-model="formData.smsCode"
              label="Код из СМС"
              placeholder="Введите код из СМС"
              :rules="[rules.required]"
              class="account-confirmation__input"
              @keyup.enter="onSubmit"
            />
          </div>

          <!-- Resend Code Timer -->
          <div class="account-confirmation__resend">
            <ResendCodeTimer
              :duration="60"
              :auto-start="true"
              @resend="onResendCode"
            />
          </div>

          <!-- Action Buttons -->
          <div class="account-confirmation__actions">
            <MainButton
              type="primary"
              text="Продолжить"
              :loading="loading"
              :disabled="!formData.smsCode"
              @click="onSubmit"
              class="account-confirmation__button account-confirmation__button--primary"
            />
            <MainButton
              type="primary-outline"
              text="Назад"
              @click="onBack"
              class="account-confirmation__button account-confirmation__button--secondary"
            />
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import MainButton from '@/components/atoms/MainButton.vue'
import Input from '@/components/atoms/Input.vue'
import Form from '@/components/atoms/Form.vue'
import ResendCodeTimer from '@/components/atoms/ResendCodeTimer.vue'

export default {
  name: 'AccountConfirmation',
  components: {
    MainButton,
    Input,
    Form,
    ResendCodeTimer
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    phone: {
      type: String,
      default: ''
    }
  },
  emits: ['submit', 'resend', 'back'],
  data() {
    return {
      formData: {
        smsCode: ''
      },
      rules: {
        required: (v) => !!v || 'Заполните поле'
      }
    }
  },
  methods: {
    onSubmit() {
      if (!this.$refs.form?.validate?.()) return
      this.$emit('submit', this.formData.smsCode)
    },
    onResendCode() {
      this.$emit('resend', this.phone)
    },
    onBack() {
      this.$emit('back')
    }
  }
}
</script>

<style lang="scss" scoped>
.account-confirmation {
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
    gap: 20px;
    align-items: center;

    .account-confirmation__logo {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;
    }

    .account-confirmation__logo-icon {
      width: 42px;
      height: 42px;
    }

    .account-confirmation__logo-text {
      width: auto;
      height: 48px;
    }
  }

  &__title {
    color: #263043;
    font-size: 24px;
    font-weight: 600;
    line-height: 30px;
    text-align: center;
    margin: 0;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
  }

  &__field {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__input {
    width: 100%;
    height: 48px;
  }

  &__resend {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
  }

  &__button {
    width: 100%;
    height: 48px;
    font-size: 18px;
    font-weight: 600;

    &--primary {
      background: #1735f5;
      color: white;
    }

    &--secondary {
      border: 1.5px solid #1735f5;
      background: transparent;
      color: #1735f5;
    }
  }
}
</style>
