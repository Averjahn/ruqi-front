<template>
  <teleport to="body">
    <div v-if="modelValue" class="change-email-code-modal-overlay" @click="handleBackdropClick">
      <div class="change-email-code-modal" @click.stop>
        <div class="change-email-code-modal__header">
          <h3 class="change-email-code-modal__title">Введите код</h3>
          <button class="change-email-code-modal__close" @click="handleCancel">
            <img src="@/assets/icons/cross_black.svg" alt="Close" class="change-email-code-modal__close-icon" />
          </button>
        </div>

        <div class="change-email-code-modal__content">
          <p class="change-email-code-modal__description">
            На e-mail <b>{{ email }}</b> сейчас поступит 4х значный код
          </p>

          <div class="change-email-code-modal__field">
            <label class="change-email-code-modal__label" for="code"> Код из письма </label>

            <input
              id="code"
              v-model="code"
              type="text"
              maxlength="6"
              class="change-email-code-modal__input"
              :class="{
                'change-email-code-modal__input--invalid': codeTouched && !isValidCode,
              }"
              @blur="codeTouched = true"
            />

            <p v-if="codeTouched && !isValidCode" class="change-email-code-modal__error">
              Введите корректный код (минимум 4 символа)
            </p>
          </div>
        </div>

        <div class="change-email-code-modal__footer">
          <MainButton
            type="primary-outline"
            text="Отмена"
            @click="handleCancel"
            class="change-email-code-modal__button"
          />
          <MainButton
            type="primary"
            text="Подтвердить"
            :disabled="!isValidCode"
            @click="handleSubmitCode"
            class="change-email-code-modal__button"
          />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import MainButton from '@/components/atoms/MainButton.vue'

export default {
  name: 'ChangePasswordEmailCodeModal',
  components: {
    MainButton,
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      required: true,
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue', 'submit-code', 'cancel'],
  data() {
    return {
      code: '',
      codeTouched: false,
    }
  },
  computed: {
    isValidCode() {
      return this.code && this.code.trim().length >= 4
    },
  },
  methods: {
    handleCancel() {
      this.code = ''
      this.codeTouched = false
      this.$emit('cancel')
      this.$emit('update:modelValue', false)
    },
    handleBackdropClick() {
      if (this.closeOnBackdrop) {
        this.handleCancel()
      }
    },
    handleSubmitCode() {
      this.codeTouched = true
      if (!this.isValidCode) return

      this.$emit('submit-code', {
        email: this.email,
        code: this.code.trim(),
      })
      this.$emit('update:modelValue', false)
    },
  },
}
</script>

<style scoped lang="scss">
.change-email-code-modal-overlay {
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

.change-email-code-modal {
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

.change-email-code-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.change-email-code-modal__title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 25px;
  color: #263043;
  margin: 0;
  flex: 1;
}

.change-email-code-modal__close {
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

.change-email-code-modal__close-icon {
  width: 15.5px;
  height: 15.5px;
  object-fit: contain;
}

.change-email-code-modal__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.change-email-code-modal__description {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.1px;
  color: #263043;
  margin: 0;
}

/* Поле */
.change-email-code-modal__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.change-email-code-modal__label {
  font-size: 14px;
  color: #263043;
  margin-bottom: 4px;
}

.change-email-code-modal__input {
  padding: 12px 16px;
  border: 1px solid #dadada;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}

.change-email-code-modal__input--invalid {
  border-color: #e03131;
}

.change-email-code-modal__error {
  color: #e03131;
  font-size: 13px;
  margin-top: 4px;
}

.change-email-code-modal__footer {
  display: flex;
  gap: 16px;
  align-items: center;

  :deep(.main-button) {
    flex: 1;
  }
}

.change-email-code-modal__button {
  :deep(.main-button__text) {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
  }

  &.main-button--primary-outline :deep(.main-button__text) {
    color: #1735f5;
  }

  &.main-button--primary :deep(.main-button__text) {
    color: #ffffff;
  }
}

.change-email-code-modal__button :deep(.main-button[disabled]) {
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .change-email-code-modal-overlay {
    padding: 20px;
    align-items: center;
    justify-content: center;
  }

  .change-email-code-modal {
    padding: 24px 16px;
    min-width: auto;
    max-width: calc(100vw - 32px);
    border-radius: 16px;
    gap: 24px;
  }

  .change-email-code-modal__title {
    font-size: 18px;
    line-height: 24px;
  }

  .change-email-code-modal__footer {
    flex-direction: column;

    :deep(.main-button) {
      width: 100%;
    }
  }
}
</style>
