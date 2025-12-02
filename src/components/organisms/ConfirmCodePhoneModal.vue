=<template>
  <teleport to="body">
    <div
      v-if="modelValue"
      class="confirm-code-modal-overlay"
      @click="handleBackdropClick"
    >
      <div class="confirm-code-modal" @click.stop>
        <div class="confirm-code-modal__header">
          <h3 class="confirm-code-modal__title">Введите код</h3>
          <button class="confirm-code-modal__close" @click="close">
            <img src="@/assets/icons/cross_black.svg" alt="Close" class="confirm-code-modal__close-icon" />
          </button>
        </div>
        <div class="confirm-code-modal__content">
          <p class="confirm-code-modal__description">
            На номер <b>{{ phone }}</b> сейчас поступит 4х значный код
          </p>
          <OtpInput
            :digits="4"
            :isValid="isCodeValid"
            class="confirm-code-modal__otp-input"
            @onChanged="handleCodeChanged"
          >
            <template #errorMessage>Неверный код</template>
          </OtpInput>
          <p v-if="isTimerRunning" class="confirm-code-modal__timer">
            Выслать код заново можно будет через <b>{{ remainingTimeString }}</b>
          </p>
        </div>
        <div class="confirm-code-modal__footer">
          <MainButton
            type="primary-outline"
            text="Отмена"
            @click="close"
            class="confirm-code-modal__button"
          />
          <MainButton
            type="primary"
            text="Подтвердить"
            @click="handleConfirm"
            :disabled="!isCodeComplete || !isCodeValid || isLoading"
            class="confirm-code-modal__button"
          />

        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import OtpInput from '@/components/atoms/OtpInput.vue'
import MainButton from '@/components/atoms/MainButton.vue'
import useTimer from '@/composables/useSnackbarTimer'
import { getStringFromSeconds } from '@/constants/helpers'
import authApi from '@/services/authApi'

export default {
  name: 'ConfirmCodeModal',
  components: {
    OtpInput,
    MainButton
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    phone: {
      type: String,
      required: true
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue', 'confirm', 'resend'],
  setup() {
    const { launchTimer, isTimerRunning, remaining, clearTimer } = useTimer({
      timerId: 'confirmCodeModal'
    })

    return {
      launchTimer,
      isTimerRunning,
      remaining,
      clearTimer
    }
  },
  data() {
    return {
      code: '',
      isCodeValid: true,
      isCodeComplete: false,
      isLoading: false
    }
  },

  computed: {
    remainingTimeString() {
      if (!this.remaining) return '0 секунд'
      const totalSeconds = this.remaining
      if (totalSeconds < 60) {
        return `${totalSeconds} секунд`
      }
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60
      if (seconds === 0) {
        return `${minutes} ${minutes === 1 ? 'минуту' : minutes < 5 ? 'минуты' : 'минут'}`
      }
      return `${minutes} ${minutes === 1 ? 'минуту' : minutes < 5 ? 'минуты' : 'минут'} ${seconds} ${seconds === 1 ? 'секунду' : seconds < 5 ? 'секунды' : 'секунд'}`
    }
  },
  watch: {
    modelValue(newVal) {
      if (newVal) {
        this.code = ''
        this.isCodeValid = true
        this.isCodeComplete = false
        this.launchTimer()
      } else {
        this.clearTimer()
      }
    }
  },
  methods: {
    close() {
      this.$emit('update:modelValue', false)
    },
    handleBackdropClick() {
      if (this.closeOnBackdrop) {
        this.close()
      }
    },
    handleCodeChanged(code) {
      this.code = code
      this.isCodeComplete = code.length === 4
      this.isCodeValid = true
    },

    async handleConfirm() {
      if (!this.isCodeComplete || !this.isCodeValid || this.isLoading) return

      this.isLoading = true
      this.isCodeValid = true

      // НИКАКИХ запросов из модалки
      this.$emit('confirm', this.code)

      this.isLoading = false
    }
,

    handleResend() {
      this.clearTimer()
      this.launchTimer()
      this.$emit('resend')
    }
  }
}
</script>

<style lang="scss" scoped>
.confirm-code-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.confirm-code-modal {
  background: white;
  border-radius: 12px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.confirm-code-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.confirm-code-modal__title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-style: normal;
  font-size: 20px;
  line-height: 125%;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #263043;
  margin: 0;
}

.confirm-code-modal__close {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f3f4f6;
  }
}

.confirm-code-modal__close-icon {
  width: 20px;
  height: 20px;
}

.confirm-code-modal__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 24px;
}

.confirm-code-modal__description {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #263043;
  margin: 0;
  text-align: center;

  b {
    font-weight: 600;
  }
}

.confirm-code-modal__otp-input {
  display: flex;
  justify-content: center;
  width: 100%;

  :deep(.otp-wrapper) {
    margin: 0 auto;
  }
}

.confirm-code-modal__timer {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #263043;
  margin: 0;
  text-align: center;

  b {
    font-weight: 600;
  }
}

.confirm-code-modal__footer {
  display: flex;
  gap: 16px;
}

.confirm-code-modal__button {
  width: 240px;

  :deep(.main-button__text) {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 600;
    font-style: normal;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0px;
    vertical-align: middle;
  }

  &.main-button--primary-outline :deep(.main-button__text) {
    color: #1735F5;
  }

  &.main-button--primary :deep(.main-button__text) {
    color: #FFFFFF;
  }
}

@media (max-width: 768px) {
  .confirm-code-modal-overlay {
    padding: 16px;
  }

  .confirm-code-modal {
    padding: 24px;
  }
}
</style>

