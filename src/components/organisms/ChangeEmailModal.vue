<template>
  <teleport to="body">
    <div
      v-if="modelValue"
      class="change-email-modal-overlay"
      @click="handleBackdropClick"
    >
      <div class="change-email-modal" @click.stop>
        <div class="change-email-modal__header">
          <h3 class="change-email-modal__title">Изменить адрес электронной почты</h3>
          <button class="change-email-modal__close" @click="close">
            <img
              src="@/assets/icons/cross_black.svg"
              alt="Close"
              class="change-email-modal__close-icon"
            />
          </button>
        </div>

        <div class="change-email-modal__content">
          <UnifiedInputField
            v-model="emailValue"
            label="Введите новый адрес"
            type="email"
            placeholder="andreyandrey@yandex.ru"
            class="change-email-modal__input"
            :class="{ 'input-error': errorMessage }"
          />

          <p v-if="errorMessage" class="change-email-modal__error">
            {{ errorMessage }}
          </p>
        </div>

        <div class="change-email-modal__footer">
          <MainButton
            type="primary-outline"
            text="Отмена"
            @click="close"
            class="change-email-modal__button"
          />
          <MainButton
            type="primary"
            text="Продолжить"
            @click="handleGetCode"
            :disabled="isLoading"
            class="change-email-modal__button"
          />
        </div>
      </div>
    </div>
  </teleport>
</template>


<script>
import UnifiedInputField from '@/components/molecules/UnifiedInputField.vue'
import MainButton from '@/components/atoms/MainButton.vue'
import authApi from '@/services/authApi'

export default {
  name: 'ChangeEmailModal',
  components: {
    UnifiedInputField,
    MainButton
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    initialEmail: {
      type: String,
      default: ''
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue', 'get-code'],
  data() {
    return {
      emailValue: this.initialEmail,
      errorMessage: '',
      isLoading: false
    }
  },
  watch: {
    modelValue(newVal) {
      if (newVal) {
        this.emailValue = this.initialEmail
        this.errorMessage = ''
      }
    },
    initialEmail(newVal) {
      this.emailValue = newVal
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
    async handleGetCode() {
      const email = this.emailValue.trim()
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (!regex.test(email)) {
        this.errorMessage = 'Неверный email, попробуйте ещё раз'
        return
      }

      this.errorMessage = ''
      this.isLoading = true

      const result = await authApi.requestEmailBind(email)

      this.isLoading = false

      if (result.success) {
        // успех — даём родителю знать, он уже откроет модалку с кодом
        this.$emit('get-code', email)
      } else {
        const err = result.error

        // у тебя handleError иногда отдаёт массив ошибок
        if (Array.isArray(err)) {
          const first = err[0] || {}
          this.errorMessage = first.msg || 'Ошибка при отправке кода'
        } else if (err && err.msg) {
          // нормальный объект вида { code, msg }
          this.errorMessage = err.msg
        } else {
          this.errorMessage = 'Ошибка при отправке кода'
        }
      }
    }
  }
}
</script>



<style lang="scss" scoped>
.change-email-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(0px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
}

.change-email-modal {
  background: white;
  border-radius: 14px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  min-width: 359px;
  max-width: 560px;
  width: 100%;
  box-sizing: border-box;
}

.change-email-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.change-email-modal__title {
  font-family: 'Source Sans 3', 'Source Sans Pro', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 25px;
  color: #263043;
  margin: 0;
  flex: 1;
}

.change-email-modal__close {
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

.change-email-modal__close-icon {
  width: 15.5px;
  height: 15.5px;
  object-fit: contain;
}

.change-email-modal__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.change-email-modal__input {
  width: 100%;
}

.change-email-modal__footer {
  display: flex;
  gap: 16px;
  align-items: center;

  :deep(.main-button) {
    flex: 1;
  }
}

.change-email-modal__error {
  font-size: 14px;
  color: #e53935;
  margin-top: -8px;
}

.input-error {
  background: #fff6f6;
  border-color: #ffb3b3 !important;
}

.input-error :deep(input) {
  background: #fff6f6 !important;
  border-color: #ffb3b3 !important;
}

@media (max-width: 768px) {
  .change-email-modal {
    padding: 24px 16px;
    max-width: calc(100vw - 32px);
    border-radius: 16px;
  }

  .change-email-modal__footer {
    flex-direction: column;

    :deep(.main-button) {
      width: 100%;
    }
  }
}

</style>
