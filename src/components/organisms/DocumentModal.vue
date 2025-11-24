<template>
  <teleport to="body">
    <div 
      v-if="modelValue" 
      class="document-modal-overlay" 
      @click="handleBackdropClick"
    >
      <div class="document-modal" @click.stop>
        <div class="document-modal__header">
          <h3 class="document-modal__title">{{ title }}</h3>
          <button class="document-modal__close" @click="close">
            <img src="@/assets/icons/cross.svg" alt="Close" class="document-modal__close-icon" />
          </button>
        </div>
        <div class="document-modal__content">
          <img :src="image" alt="Document Sample" class="document-modal__image" />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  name: 'DocumentModal',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Образец документа'
    },
    image: {
      type: String,
      required: true
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
.document-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.document-modal {
  background: white;
  border-radius: 12px;
  max-width: 90vw;
  max-height: 90vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.document-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: none;
}

.document-modal__title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.document-modal__close {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s ease;

  &:hover {
    background: transparent;
  }
}

.document-modal__close-icon {
  width: 24px;
  height: 24px;
  filter: brightness(0) saturate(100%) invert(41%) sepia(0%) saturate(0%) hue-rotate(345deg) brightness(95%) contrast(87%);
}

.document-modal__content {
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
}

.document-modal__image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .document-modal-overlay {
    padding: 20px !important;
    width: 100vw !important;
    height: 100vh !important;
  }

  .document-modal {
    max-width: 90vw !important;
    max-height: 90vh !important;
    width: 100% !important;
    border: 3px solid red !important;
    min-height: 200px !important;
  }
}
</style>


