<template>
  <div v-if="show" class="bulk-actions-modal-backdrop" @click="handleBackdropClick">
    <div class="bulk-actions-modal-container" @click.stop>
      <div class="bulk-actions-modal__header">
        <h3 class="bulk-actions-modal__title">{{ title }}</h3>
        <button class="bulk-actions-modal__close" @click="handleClose">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="bulk-actions-modal__content">
        <p class="bulk-actions-modal__message">{{ message }}</p>
        <div v-if="showObjectList" class="bulk-actions-modal__objects-list">
          <div
            v-for="object in selectedObjects"
            :key="object.id"
            class="bulk-actions-modal__object-item"
          >
            {{ object.name }}
          </div>
        </div>
      </div>
      <div class="bulk-actions-modal__actions">
        <Button
          type="outlined"
          color="gray"
          size="m"
          @click="handleClose"
          class="bulk-actions-modal__cancel-button"
        >
          Отмена
        </Button>
        <Button
          type="contained"
          :color="actionButtonColor"
          size="m"
          @click="handleConfirm"
          class="bulk-actions-modal__confirm-button"
        >
          {{ confirmButtonText }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/atoms/Button.vue'

export default {
  name: 'BulkActionsModal',
  components: {
    Button
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Массовые действия'
    },
    message: {
      type: String,
      required: true
    },
    confirmButtonText: {
      type: String,
      default: 'Подтвердить'
    },
    actionButtonColor: {
      type: String,
      default: 'blue'
    },
    selectedObjects: {
      type: Array,
      default: () => []
    },
    showObjectList: {
      type: Boolean,
      default: true
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close', 'confirm'],
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleConfirm() {
      this.$emit('confirm')
    },
    handleBackdropClick() {
      if (this.closeOnBackdrop) {
        this.handleClose()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bulk-actions-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.2s ease-out forwards;
}

.bulk-actions-modal-container {
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  transform: scale(0.9);
  animation: scaleIn 0.2s ease-out forwards;
}

.bulk-actions-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #E3E5E4;
  padding-bottom: 16px;
}

.bulk-actions-modal__title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
  color: #263043;
  margin: 0;
}

.bulk-actions-modal__close {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: #666666;
  transition: color 0.2s;

  &:hover {
    color: #263043;
  }

  svg {
    width: 24px;
    height: 24px;
  }
}

.bulk-actions-modal__content {
  padding: 24px;
  flex: 1;
}

.bulk-actions-modal__message {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #263043;
  margin: 0 0 16px 0;
}

.bulk-actions-modal__objects-list {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #E3E5E4;
  border-radius: 8px;
  padding: 8px;
  margin-top: 16px;
}

.bulk-actions-modal__object-item {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #666666;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background: #F6F8FB;
  }
}

.bulk-actions-modal__actions {
  display: flex;
  gap: 12px;
  padding: 0 24px 24px 24px;
  border-top: 1px solid #E3E5E4;
  padding-top: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.bulk-actions-modal__cancel-button,
.bulk-actions-modal__confirm-button {
  flex: 1;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
  }
  to {
    transform: scale(1);
  }
}
</style>

