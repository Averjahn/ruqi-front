<template>
  <BaseModal
    title="Смена пароля"
    @close="$emit('close')"
  >
    <div class="change-password-modal__content">
      <p class="change-password-modal__description">
        Выберите подходящий способ смены пароля
      </p>

      <div class="change-password-modal__options">
        <!-- Option 1: Through current password -->
        <div 
          class="change-password-modal__option"
          @click="handleOptionClick('current-password')"
        >
          <div class="change-password-modal__option-title">
            Через ввод текущего пароля
          </div>
          <div class="change-password-modal__option-description">
            Если вы помните текущий пароль, но хотите изменить его для защиты своих данных
          </div>
        </div>

        <!-- Option 2: Through phone (highlighted) -->
        <div 
          class="change-password-modal__option change-password-modal__option--highlighted"
          @click="handleOptionClick('phone')"
        >
          <div class="change-password-modal__option-title">
            Через телефон
          </div>
          <div class="change-password-modal__option-description">
            Если вы забыли текущий пароль, но у вас есть доступ к номеру телефона, указанному при регистрации
          </div>
        </div>

        <!-- Option 3: Through email -->
        <div 
          class="change-password-modal__option"
          @click="handleOptionClick('email')"
        >
          <div class="change-password-modal__option-title">
            Через email
          </div>
          <div class="change-password-modal__option-description">
            Если вы забыли текущий пароль и у вас нет доступа к телефону, указанному при регистрации
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script>
import BaseModal from '@/components/molecules/BaseModal.vue'

export default {
  name: 'ChangePasswordModal',
  components: {
    BaseModal
  },
  emits: ['close', 'select-option'],
  methods: {
    handleOptionClick(option) {
      this.$emit('select-option', option)
    }
  }
}
</script>

<style lang="scss" scoped>
.change-password-modal__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.change-password-modal__description {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.1px;
  color: #263043;
  margin: 0;
}

.change-password-modal__options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.change-password-modal__option {
  background: #ffffff;
  border: 1px solid #dadada;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #1735F5;
    background: #F2F8FF;
  }

  &--highlighted {
    background: #F2F8FF;
    border-color: #dadada;
  }
}

.change-password-modal__option-title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #263043;
  margin: 0;
}

.change-password-modal__option-description {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #666666;
  margin: 0;
  white-space: pre-wrap;
}
</style>

