<template>
  <div class="change-password-phone-modal">
    <div class="change-password-phone-modal__header">
      <h2 class="change-password-phone-modal__title">Смена пароля</h2>
      <button 
        class="change-password-phone-modal__close-button"
        @click="$emit('close')"
      >
        <img 
          src="@/assets/icons/cross_black.svg" 
          alt="Close" 
          class="change-password-phone-modal__close-icon"
        />
      </button>
    </div>

    <div class="change-password-phone-modal__content">
      <div class="change-password-phone-modal__input-wrapper">
        <label class="change-password-phone-modal__label">
          Введите номер телефона, указанный при регистрации
        </label>
        <Input
          :model-value="phone"
          @update:model-value="handlePhoneUpdate"
          type="tel"
          placeholder="+7 900 000-00-00"
          class="change-password-phone-modal__input"
        />
      </div>
    </div>

    <div class="change-password-phone-modal__actions">
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
        @click="handleGetCode"
      >
        Получить код в телеграм
      </Button>
    </div>
  </div>
</template>

<script>
import Input from '@/components/atoms/Input.vue'
import Button from '@/components/atoms/Button.vue'
import { formatPhoneNumber, clearPhoneAlwaysSeven } from '@/constants/helpers'

export default {
  name: 'ChangePasswordPhoneModal',
  components: {
    Input,
    Button
  },
  emits: ['close', 'get-code'],
  data() {
    return {
      phone: '',
      loading: false
    }
  },
  methods: {
    handlePhoneUpdate(value) {
      const digitsOnly = value.replace(/\D/g, '')
      const limitedDigits = digitsOnly.slice(0, 11)
      const cleaned = clearPhoneAlwaysSeven(limitedDigits)
      this.phone = formatPhoneNumber(cleaned)
    },
    handleGetCode() {
      if (!this.phone || this.phone.replace(/\D/g, '').length < 11) {
        // TODO: Show error message
        return
      }
      this.loading = true
      // TODO: Implement get code logic
      setTimeout(() => {
        this.loading = false
        this.$emit('get-code', this.phone)
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.change-password-phone-modal {
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

.change-password-phone-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.change-password-phone-modal__title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 25px;
  color: #263043;
  margin: 0;
  flex: 1;
}

.change-password-phone-modal__close-button {
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

.change-password-phone-modal__close-icon {
  width: 15.5px;
  height: 15.5px;
  object-fit: contain;
}

.change-password-phone-modal__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.change-password-phone-modal__input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.change-password-phone-modal__label {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.1px;
  color: #666666;
  margin: 0;
}

.change-password-phone-modal__input {
  width: 100%;
}

.change-password-phone-modal__actions {
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

