<template>
  <teleport to="body">
    <div 
      v-if="modelValue" 
      class="change-phone-modal-overlay" 
      @click="handleBackdropClick"
    >
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
          />
        </div>
        <div class="change-phone-modal__footer">
          <MainButton
            type="primary-outline"
            text="Отмена"
            @click="close"
            class="change-phone-modal__button"
          />
          <MainButton
            type="primary"
            text="Получить код"
            @click="handleGetCode"
            class="change-phone-modal__button"
          />
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
    MainButton
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    initialPhone: {
      type: String,
      default: '+7 900 000-00-00'
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue', 'get-code'],
  data() {
    return {
      phoneValue: this.initialPhone
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
    handleGetCode() {
      this.$emit('get-code', this.phoneValue)
    }
  }
}
</script>

<style lang="scss" scoped>
.change-phone-modal-overlay {
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

.change-phone-modal {
  background: white;
  border-radius: 12px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.change-phone-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.change-phone-modal__title {
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

.change-phone-modal__close {
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

.change-phone-modal__close-icon {
  width: 20px;
  height: 20px;
}

.change-phone-modal__content {
  margin-bottom: 24px;
}

.change-phone-modal__input {
  width: 100%;
}

.change-phone-modal__footer {
  display: flex;
  gap: 16px;
}

.change-phone-modal__button {
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
  .change-phone-modal-overlay {
    padding: 16px;
  }

  .change-phone-modal {
    padding: 24px;
  }
}
</style>

