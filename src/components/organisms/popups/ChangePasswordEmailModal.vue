<template>
  <div class="change-password-email-modal">
    <div class="change-password-email-modal__header">
      <h2 class="change-password-email-modal__title">Смена пароля по email</h2>
      <button
        class="change-password-email-modal__close-button"
        @click="$emit('close')"
      >
        <img
          src="@/assets/icons/cross_black.svg"
          alt="Close"
          class="change-password-email-modal__close-icon"
        />
      </button>
    </div>

    <div class="change-password-email-modal__content">
      <PasswordResetByEmail
        @onBack="$emit('back')"
        @closePopup="$emit('close')"
      />
    </div>
  </div>
</template>

<script>
import PasswordResetByEmail from '@/components/molecules/PasswordResetByEmail.vue'

export default {
  name: 'ChangePasswordEmailModal',
  components: {
    PasswordResetByEmail,
  },
  emits: ['close', 'back'],
}
</script>

<style lang="scss" scoped>
.change-password-email-modal {
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

.change-password-email-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.change-password-email-modal__title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 25px;
  color: #263043;
  margin: 0;
  flex: 1;
}

.change-password-email-modal__close-button {
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

.change-password-email-modal__close-icon {
  width: 15.5px;
  height: 15.5px;
  object-fit: contain;
}

.change-password-email-modal__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>


