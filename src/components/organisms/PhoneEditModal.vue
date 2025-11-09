<template>
  <teleport to="body">
    <div 
      v-if="modelValue" 
      class="phone-edit-modal-overlay" 
      @click="handleBackdropClick"
    >
      <div class="phone-edit-modal" @click.stop>
        <div class="phone-edit-modal__header">
          <h3 class="phone-edit-modal__title">Редактирование телефона</h3>
          <button class="phone-edit-modal__close" @click="close">
            <img src="@/assets/icons/cross_black.svg" alt="Close" class="phone-edit-modal__close-icon" />
          </button>
        </div>
        <div class="phone-edit-modal__content">
          <slot />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  name: 'PhoneEditModal',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue'],
  methods: {
    close() {
      this.$emit('update:modelValue', false)
    },
    handleBackdropClick() {
      if (this.closeOnBackdrop) {
        this.close()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.phone-edit-modal-overlay {
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

.phone-edit-modal {
  background: white;
  border-radius: 12px;
  max-width: 560px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.phone-edit-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.phone-edit-modal__title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #263043;
  margin: 0;
}

.phone-edit-modal__close {
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

.phone-edit-modal__close-icon {
  width: 20px;
  height: 20px;
}

.phone-edit-modal__content {
  padding: 24px;
  overflow: auto;
}

@media (max-width: 768px) {
  .phone-edit-modal-overlay {
    padding: 16px;
  }

  .phone-edit-modal {
    max-width: 100%;
  }

  .phone-edit-modal__header,
  .phone-edit-modal__content {
    padding: 16px;
  }
}
</style>


