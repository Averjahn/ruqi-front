<template>
  <teleport to="body">
    <div
      v-if="modelValue"
      class="change-email-code-modal-overlay"
      @click="handleBackdropClick"
    >
      <div class="change-email-code-modal" @click.stop>
        <div class="change-email-code-modal__header">
          <h3 class="change-email-code-modal__title">Введите код</h3>
          <button class="change-email-code-modal__close" @click="handleCancel">
            <img
              src="@/assets/icons/cross_black.svg"
              alt="Close"
              class="change-email-code-modal__close-icon"
            />
          </button>
        </div>

        <div class="change-email-code-modal__content">
          <p class="change-email-code-modal__description">
            На адрес <b>{{ email }}</b> отправлено письмо со ссылкой для подтверждения.
            Перейдите по ней, чтобы завершить привязку e-mail.
          </p>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  name: 'ChangePasswordEmailCodeModal',
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
  emits: ['update:modelValue', 'cancel'],
  methods: {
    handleCancel() {
      this.$emit('cancel')
      this.$emit('update:modelValue', false)
    },
    handleBackdropClick() {
      if (this.closeOnBackdrop) {
        this.handleCancel()
      }
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
}
</style>
