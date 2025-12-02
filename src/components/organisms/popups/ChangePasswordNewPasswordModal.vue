<template>
  <div class="change-password-new-password-modal">
    <div class="change-password-new-password-modal__header">
      <h2 class="change-password-new-password-modal__title">Смена пароля</h2>
      <button 
        class="change-password-new-password-modal__close-button"
        @click="$emit('close')"
      >
        <img 
          src="@/assets/icons/cross_black.svg" 
          alt="Close" 
          class="change-password-new-password-modal__close-icon"
        />
      </button>
    </div>

    <div class="change-password-new-password-modal__content">
      <!-- Поле старого пароля показывается только при смене через текущий пароль -->
      <div 
        v-if="method === 'current-password'"
        class="change-password-new-password-modal__input-wrapper"
      >
        <label class="change-password-new-password-modal__label">
          Старый пароль
        </label>
        <Input
          :model-value="oldPassword"
          @update:model-value="oldPassword = $event"
          type="password"
          placeholder="Введите старый пароль"
          class="change-password-new-password-modal__input"
        />
      </div>

      <div class="change-password-new-password-modal__input-wrapper">
        <label class="change-password-new-password-modal__label">
          {{ method === 'current-password' ? 'Новый пароль' : 'Пароль' }}
        </label>
        <Input
          :model-value="password"
          @update:model-value="password = $event"
          type="password"
          placeholder="Введите пароль"
          class="change-password-new-password-modal__input"
        />
      </div>

      <div class="change-password-new-password-modal__input-wrapper">
        <label class="change-password-new-password-modal__label">
          Повторите {{ method === 'current-password' ? 'новый ' : '' }}пароль
        </label>
        <Input
          :model-value="confirmPassword"
          @update:model-value="confirmPassword = $event"
          type="password"
          placeholder="Повторите пароль"
          class="change-password-new-password-modal__input"
        />
      </div>

      <div class="change-password-new-password-modal__requirements">
        <h3 class="change-password-new-password-modal__requirements-title">
          Требования к паролю
        </h3>
        <ul class="change-password-new-password-modal__requirements-list">
          <li>Пароль должен состоять минимум из 8 символов.</li>
          <li>Обязательно используйте заглавные и строчные буквы.</li>
          <li>Добавьте хотя бы одну цифру.</li>
          <li>Включите специальные символы (например: %, #, $, @ и другие) для усиления безопасности.</li>
        </ul>
      </div>
    </div>

    <div class="change-password-new-password-modal__actions">
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
        :disabled="!isFormValid"
        @click="handleConfirm"
      >
        Подтвердить
      </Button>
    </div>
  </div>
</template>

<script>
import Input from '@/components/atoms/Input.vue'
import Button from '@/components/atoms/Button.vue'

export default {
  name: 'ChangePasswordNewPasswordModal',
  components: {
    Input,
    Button
  },
  props: {
    method: {
      type: String,
      default: null // 'current-password' | 'phone' | 'email' | null
    }
  },
  emits: ['close', 'back', 'confirm'],
  data() {
    return {
      oldPassword: '',
      password: '',
      confirmPassword: ''
    }
  },
  computed: {
    isFormValid() {
      const passwordValid = this.password.length >= 8 && 
             this.password === this.confirmPassword &&
             /[A-Z]/.test(this.password) &&
             /[a-z]/.test(this.password) &&
             /[0-9]/.test(this.password) &&
             /[^A-Za-z0-9]/.test(this.password)
      
      // Если меняем через старый пароль, проверяем что старый пароль введен
      if (this.method === 'current-password') {
        return passwordValid && this.oldPassword.length > 0
      }
      
      return passwordValid
    }
  },
  methods: {
    handleConfirm() {
      if (!this.isFormValid) {
        return
      }
      if (this.method === 'current-password') {
        this.$emit('confirm', {
          oldPassword: this.oldPassword,
          password: this.password,
          confirmPassword: this.confirmPassword
        })
      } else {
        this.$emit('confirm', {
          password: this.password,
          confirmPassword: this.confirmPassword
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.change-password-new-password-modal {
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

.change-password-new-password-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.change-password-new-password-modal__title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 25px;
  color: #263043;
  margin: 0;
  flex: 1;
}

.change-password-new-password-modal__close-button {
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

.change-password-new-password-modal__close-icon {
  width: 15.5px;
  height: 15.5px;
  object-fit: contain;
}

.change-password-new-password-modal__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.change-password-new-password-modal__input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.change-password-new-password-modal__label {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.1px;
  color: #666666;
  margin: 0;
}

.change-password-new-password-modal__input {
  width: 100%;
}

.change-password-new-password-modal__requirements {
  background: #EFF2FD;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.change-password-new-password-modal__requirements-title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #263043;
  margin: 0;
}

.change-password-new-password-modal__requirements-list {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.1px;
  color: #666666;
  margin: 0;
  padding-left: 21px;
  list-style: disc;

  li {
    margin-bottom: 0;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.change-password-new-password-modal__actions {
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

