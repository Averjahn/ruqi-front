<template>
  <div class="change-password-code-modal">
    <div class="change-password-code-modal__header">
      <h2 class="change-password-code-modal__title">Смена пароля</h2>
      <button 
        class="change-password-code-modal__close-button"
        @click="$emit('close')"
      >
        <img 
          src="@/assets/icons/cross_black.svg" 
          alt="Close" 
          class="change-password-code-modal__close-icon"
        />
      </button>
    </div>

    <div class="change-password-code-modal__content">
      <p class="change-password-code-modal__description">
        Мы отправили код в телеграм на номер {{ formattedPhone }}. Введите его и задайте новый пароль.
      </p>

      <div class="change-password-code-modal__code-section">
        <div class="change-password-code-modal__input-wrapper">
          <label class="change-password-code-modal__label">
            Код из телеграм
          </label>
          <Input
            :model-value="code"
            @update:model-value="code = $event"
            type="text"
            placeholder="Введите код из телеграм"
            maxlength="6"
            class="change-password-code-modal__input"
          />
        </div>

        <div class="change-password-code-modal__resend-section">
          <button 
            v-if="!isTimerRunning"
            class="change-password-code-modal__resend-button"
            @click="handleResendCode"
          >
            Отправить код повторно
          </button>
          <p v-else class="change-password-code-modal__timer">
            Отправить код повторно ({{ remainingTimeString }})
          </p>
        </div>
      </div>
    </div>

    <div class="change-password-code-modal__actions">
      <Button
        type="outlined"
        color="blue"
        size="l"
        @click="$emit('back')"
      >
        Назад
      </Button>
      <Button
        type="contained"
        color="blue"
        size="l"
        :loading="loading"
        :disabled="!isCodeValid"
        @click="handleContinue"
      >
        Продолжить
      </Button>
    </div>
  </div>
</template>

<script>
import Input from '@/components/atoms/Input.vue'
import Button from '@/components/atoms/Button.vue'
import { formatPhoneNumber, clearPhoneAlwaysSeven } from '@/constants/helpers'

export default {
  name: 'ChangePasswordCodeModal',
  components: {
    Input,
    Button
  },
  props: {
    phone: {
      type: String,
      required: true
    }
  },
  emits: ['close', 'back', 'continue', 'resend-code'],
  data() {
    return {
      code: '',
      loading: false,
      isTimerRunning: false,
      remainingTime: 0,
      timerInterval: null
    }
  },
  computed: {
    formattedPhone() {
      if (!this.phone) return '+7 (999) 999-33-31'
      const digitsOnly = this.phone.replace(/\D/g, '')
      const cleaned = clearPhoneAlwaysSeven(digitsOnly.slice(0, 11))
      const formatted = formatPhoneNumber(cleaned)
      // Format as +7 (999) 999-33-31
      if (formatted.length >= 11) {
        const digits = formatted.replace(/\D/g, '')
        if (digits.length === 11) {
          return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`
        }
      }
      return formatted
    },
    isCodeValid() {
      return this.code.length >= 4
    },
    remainingTimeString() {
      const minutes = Math.floor(this.remainingTime / 60)
      const seconds = this.remainingTime % 60
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }
  },
  mounted() {
    this.startTimer()
  },
  beforeUnmount() {
    this.clearTimer()
  },
  methods: {
    handleContinue() {
      if (!this.isCodeValid) {
        return
      }
      this.loading = true
      // TODO: Implement code verification logic
      setTimeout(() => {
        this.loading = false
        this.$emit('continue', this.code)
      }, 1000)
    },
    handleResendCode() {
      this.loading = true
      // TODO: Implement resend code logic
      setTimeout(() => {
        this.loading = false
        this.startTimer()
        this.$emit('resend-code', this.phone)
      }, 1000)
    },
    startTimer() {
      this.clearTimer()
      this.isTimerRunning = true
      this.remainingTime = 180 // 3 minutes in seconds
      
      this.timerInterval = setInterval(() => {
        this.remainingTime--
        if (this.remainingTime <= 0) {
          this.isTimerRunning = false
          this.clearTimer()
        }
      }, 1000)
    },
    clearTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.change-password-code-modal {
  position: relative;
  background: #ffffff;
  border: 1px solid #dadada;
  border-radius: 14px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 359px;
  max-width: 560px;
  width: 100%;
  box-sizing: border-box;
  margin: auto;

  @media (max-width: 768px) {
    padding: 24px 16px;
    min-width: auto;
    max-width: calc(100vw - 32px);
    border-radius: 16px;
  }
}

.change-password-code-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.change-password-code-modal__title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 25px;
  color: #263043;
  margin: 0;
  flex: 1;
}

.change-password-code-modal__close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}

.change-password-code-modal__close-icon {
  width: 15.5px;
  height: 15.5px;
  object-fit: contain;
}

.change-password-code-modal__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.change-password-code-modal__description {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.1px;
  color: #263043;
  margin: 0;
}

.change-password-code-modal__code-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
}

.change-password-code-modal__input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.change-password-code-modal__label {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.1px;
  color: #666666;
  margin: 0;
}

.change-password-code-modal__input {
  width: 100%;
}

.change-password-code-modal__resend-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.change-password-code-modal__resend-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 26px;
  color: #B0BAFF;
  text-align: center;
  transition: color 0.2s ease;

  &:hover {
    color: #1735F5;
  }
}

.change-password-code-modal__timer {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 26px;
  color: #B0BAFF;
  margin: 0;
  text-align: center;
}

.change-password-code-modal__actions {
  display: flex;
  gap: 16px;
  align-items: center;

  :deep(.rq_button) {
    flex: 1;
  }

  @media (max-width: 768px) {
    flex-direction: column;

    :deep(.rq_button) {
      width: 100%;
    }
  }
}
</style>

