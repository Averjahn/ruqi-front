<template>
  <teleport to="body">
    <div v-if="modelValue" class="change-phone-modal-overlay" @click="handleBackdropClick">
      <div class="change-phone-modal" @click.stop>
        <div class="change-phone-modal__header">
          <h3 class="change-phone-modal__title">Изменить телефон для входа</h3>
          <button class="change-phone-modal__close" @click="close">
            <img src="@/assets/icons/cross_black.svg" alt="Close" class="change-phone-modal__close-icon" />
          </button>
        </div>
        <div class="change-phone-modal__content">
          <UnifiedInputField
            v-model="phoneValue"
            label="Введите новый телефон"
            type="phone"
            placeholder="+7 900 000-00-00"
            class="change-phone-modal__input"
            :class="{ 'input-error': errorMessage }"
          />
          <p v-if="errorMessage" class="change-phone-modal__error">
            {{ errorMessage }}
          </p>
        </div>
        <div class="change-phone-modal__footer">
          <MainButton type="primary-outline" text="Отмена" @click="close" class="change-phone-modal__button" />
          <MainButton type="primary" text="Получить код" @click="handleGetCode" class="change-phone-modal__button" />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import UnifiedInputField from '@/components/molecules/UnifiedInputField.vue'
import MainButton from '@/components/atoms/MainButton.vue'

export default {
  name: 'ChangePhoneModal',
  components: {
    UnifiedInputField,
    MainButton,
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    initialPhone: {
      type: String,
      default: '+7 900 000-00-00',
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue', 'get-code'],
  data() {
    return {
      phoneValue: this.initialPhone,
      errorMessage: '',
    }
  },
  watch: {
    modelValue(newVal) {
      if (newVal) {
        this.phoneValue = this.initialPhone
      }
    },
    initialPhone(newVal) {
      this.phoneValue = newVal
    },
    phoneValue(value) {
      if (!value.startsWith('+7')) {

        const digits = value.replace(/\D/g, '');

        const normalized = digits.startsWith('8')
          ? '7' + digits.slice(1)
          : digits;

        this.phoneValue = '+7' + normalized.slice(1);
      }
    },
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
    handleGetCode() {
      const digits = this.phoneValue.replace(/\D/g, '')

      const isValid = digits.length === 11 && digits.startsWith('7')

      if (!isValid) {
        this.errorMessage = 'Неверный номер, попробуйте еще раз'
        return
      }

      this.errorMessage = ''
      this.$emit('get-code', digits)
    },
  },
}
</script>

<style lang="scss" scoped>
.change-phone-modal-overlay {
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

.change-phone-modal {
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

.change-phone-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.change-phone-modal__title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 25px;
  color: #263043;
  margin: 0;
  flex: 1;
}

.change-phone-modal__close {
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

.change-phone-modal__close-icon {
  width: 15.5px;
  height: 15.5px;
  object-fit: contain;
}

.change-phone-modal__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.change-phone-modal__input {
  width: 100%;
}

.change-phone-modal__footer {
  display: flex;
  gap: 16px;
  align-items: center;

  :deep(.main-button) {
    flex: 1;
  }
}

.change-phone-modal__button {
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

.change-phone-modal__error {
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
  .change-phone-modal-overlay {
    padding: 20px;
    align-items: center;
    justify-content: center;
  }

  .change-phone-modal {
    padding: 24px 16px;
    min-width: auto;
    max-width: calc(100vw - 32px);
    border-radius: 16px;
    gap: 24px;
  }

  .change-phone-modal__title {
    font-size: 18px;
    line-height: 24px;
  }

  .change-phone-modal__footer {
    flex-direction: column;

    :deep(.main-button) {
      width: 100%;
    }
  }
}

</style>
