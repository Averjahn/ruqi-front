<template>
  <div class="create-signature-modal">
    <div class="create-signature-modal__header">
      <h2 class="create-signature-modal__title">Выпустить подпись</h2>
      <button 
        class="create-signature-modal__close-button"
        @click="$emit('close')"
      >
        <img 
          src="@/assets/icons/cross_black.svg" 
          alt="Close" 
          class="create-signature-modal__close-icon"
        />
      </button>
    </div>

    <!-- Phone Input Screen -->
    <div v-if="screen === 'phone'" class="create-signature-modal__content">
      <p class="create-signature-modal__description">
        Введите номер телефона, указанный при регистрации
      </p>

      <div class="create-signature-modal__input-wrapper">
        <input
          v-model="phone"
          type="tel"
          class="create-signature-modal__input"
          placeholder="+7 900 000-00-00"
          maxlength="18"
        />
      </div>

      <div class="create-signature-modal__actions">
        <Button
          type="outlined"
          color="blue"
          size="m"
          @click="$emit('close')"
        >
          Отмена
        </Button>
        <Button
          type="contained"
          color="blue"
          size="m"
          :loading="loading"
          @click="handleSubmit"
        >
          Получить код в смс
        </Button>
      </div>
    </div>

    <!-- Code Input Screen -->
    <div v-else-if="screen === 'code'" class="create-signature-modal__content">
      <p class="create-signature-modal__description create-signature-modal__description--code">
        Мы отправили код в телеграм на номер {{ formattedPhone }}. Введите его, чтобы выпустить подпись
      </p>

      <div class="create-signature-modal__code-section">
        <div class="create-signature-modal__input-wrapper">
          <label class="create-signature-modal__label">Код из телеграм</label>
          <input
            v-model="code"
            type="text"
            class="create-signature-modal__input"
            placeholder="Введите код в смс"
            maxlength="6"
          />
        </div>

        <button 
          v-if="!isTimerRunning"
          class="create-signature-modal__resend-button"
          @click="handleResendCode"
        >
          Отправить код повторно
        </button>
        <p v-else class="create-signature-modal__timer">
          Отправить код повторно ({{ remainingTimeString }})
        </p>
      </div>

      <div class="create-signature-modal__actions">
        <Button
          type="outlined"
          color="blue"
          size="m"
          @click="screen = 'phone'"
        >
          Назад
        </Button>
        <Button
          type="contained"
          color="blue"
          size="m"
          :loading="loading"
          :disabled="!isCodeValid"
          @click="handleConfirmCode"
        >
          Подписать
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/atoms/Button.vue'
import { formatPhoneNumber, clearPhoneAlwaysSeven } from '@/constants/helpers'

export default {
  name: 'CreateSignatureModal',
  components: {
    Button
  },
  emits: ['close', 'submit', 'confirm-code'],
  data() {
    return {
      screen: 'phone', // 'phone' or 'code'
      phone: '',
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
  watch: {
    phone(newValue) {
      const digitsOnly = newValue.replace(/\D/g, '')
      const limitedDigits = digitsOnly.slice(0, 11)
      const cleaned = clearPhoneAlwaysSeven(limitedDigits)
      this.phone = formatPhoneNumber(cleaned)
    }
  },
  mounted() {
    // Start timer if we're on code screen
    if (this.screen === 'code') {
      this.startTimer()
    }
  },
  beforeUnmount() {
    this.clearTimer()
  },
  methods: {
    handleSubmit() {
      if (!this.phone || this.phone.replace(/\D/g, '').length < 11) {
        // TODO: Show error message
        return
      }
      this.loading = true
      // TODO: Implement phone submission logic
      setTimeout(() => {
        this.loading = false
        this.screen = 'code'
        this.startTimer()
        this.$emit('submit', this.phone)
      }, 1000)
    },
    handleConfirmCode() {
      if (!this.isCodeValid) {
        return
      }
      this.loading = true
      // TODO: Implement code confirmation logic
      setTimeout(() => {
        this.loading = false
        this.$emit('confirm-code', this.code)
      }, 1000)
    },
    handleResendCode() {
      this.loading = true
      // TODO: Implement resend code logic
      setTimeout(() => {
        this.loading = false
        this.startTimer()
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
.create-signature-modal {
  position: relative;
  background: #ffffff;
  border: 1px solid #dadada;
  border-radius: 14px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 359px;
  max-width: 800px;
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

.create-signature-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.create-signature-modal__title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 25px;
  color: #263043;
  margin: 0;
  flex: 1;
}

.create-signature-modal__close-button {
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

.create-signature-modal__close-icon {
  width: 15.5px;
  height: 15.5px;
  object-fit: contain;
}

.create-signature-modal__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.create-signature-modal__description {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.1px;
  color: #666666;
  margin: 0;
}

.create-signature-modal__description--code {
  color: #263043;
}

.create-signature-modal__input-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.create-signature-modal__label {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.1px;
  color: #666666;
  margin: 0;
}

.create-signature-modal__code-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
}

.create-signature-modal__resend-button {
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

.create-signature-modal__timer {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 26px;
  color: #B0BAFF;
  margin: 0;
  text-align: center;
}

.create-signature-modal__input {
  width: 100%;
  height: 48px;
  padding: 8px 12px;
  border: 1px solid #dadada;
  border-radius: 8px;
  background: #ffffff;
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #666666;
  box-sizing: border-box;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #1735F5;
  }

  &::placeholder {
    color: #666666;
  }
}

.create-signature-modal__actions {
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

