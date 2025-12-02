<template>
  <div class="change-password-email-code-modal">
    <div class="change-password-email-code-modal__header">
      <h2 class="change-password-email-code-modal__title">Смена пароля</h2>
      <button 
        class="change-password-email-code-modal__close-button"
        @click="$emit('close')"
      >
        <img 
          src="@/assets/icons/cross_black.svg" 
          alt="Close" 
          class="change-password-email-code-modal__close-icon"
        />
      </button>
    </div>

    <div class="change-password-email-code-modal__content">
      <p class="change-password-email-code-modal__description">
        Мы отправили код на email <b>{{ email }}</b>. Введите его и задайте новый пароль.
      </p>

      <div class="change-password-email-code-modal__code-section">
        <div class="change-password-email-code-modal__input-wrapper">
          <label class="change-password-email-code-modal__label">
            Код из письма
          </label>
          <Input
            :model-value="code"
            @update:model-value="code = $event"
            type="text"
            placeholder="Введите код из письма"
            maxlength="4"
            class="change-password-email-code-modal__input"
          />
        </div>

        <div class="change-password-email-code-modal__resend-section">
          <button 
            v-if="!isTimerRunning"
            class="change-password-email-code-modal__resend-button"
            @click="handleResendCode"
          >
            Отправить код повторно
          </button>
          <p v-else class="change-password-email-code-modal__timer">
            Отправить код повторно ({{ remainingTimeString }})
          </p>
        </div>
      </div>
    </div>

    <div class="change-password-email-code-modal__actions">
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

export default {
  name: 'ChangePasswordEmailCodeModal',
  components: {
    Input,
    Button
  },
  props: {
    email: {
      type: String,
      required: true
    }
  },
  emits: ['close', 'back', 'continue', 'resend-code'],
  data() {
    return {
      code: '',
      isTimerRunning: false,
      remainingTime: 0,
      timerInterval: null
    }
  },
  computed: {
    isCodeValid() {
      return this.code.length === 4
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
      this.$emit('continue', this.code)
    },
    handleResendCode() {
      this.startTimer()
      this.$emit('resend-code', this.email)
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
.change-password-email-code-modal {
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

.change-password-email-code-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.change-password-email-code-modal__title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 25px;
  color: #263043;
  margin: 0;
  flex: 1;
}

.change-password-email-code-modal__close-button {
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

.change-password-email-code-modal__close-icon {
  width: 15.5px;
  height: 15.5px;
  object-fit: contain;
}

.change-password-email-code-modal__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.change-password-email-code-modal__description {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.1px;
  color: #263043;
  margin: 0;

  b {
    font-weight: 600;
  }
}

.change-password-email-code-modal__code-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
}

.change-password-email-code-modal__input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.change-password-email-code-modal__label {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.1px;
  color: #666666;
  margin: 0;
}

.change-password-email-code-modal__input {
  width: 100%;
}

.change-password-email-code-modal__resend-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.change-password-email-code-modal__resend-button {
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

.change-password-email-code-modal__timer {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 26px;
  color: #B0BAFF;
  margin: 0;
  text-align: center;
}

.change-password-email-code-modal__actions {
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

