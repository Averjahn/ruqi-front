<template>
  <div class="toast" :class="[type, { visible: isVisible }]" @click="onClose">
    <div class="toast__content">
      <div class="toast__icon">
        <img :src="iconSrc" :alt="type" />
      </div>
      <div class="toast__text">
        <div class="toast__content-text">
          <div class="toast__title">Notification title</div>
          <div class="toast__subtitle">Subtitle text or explanation goes here...</div>
        </div>
        <div v-if="showButtons" class="toast__actions">
          <button class="toast__button">
            <img src="@/assets/icons/heart.svg" alt="Heart" class="toast__button-icon" />
            Button
            <img src="@/assets/icons/magnifier.svg" alt="Magnifier" class="toast__button-icon" />
          </button>
          <button class="toast__button">
            <img src="@/assets/icons/attach.svg" alt="Attach" class="toast__button-icon" />
            Button
            <img src="@/assets/icons/chevron_down.svg" alt="Chevron" class="toast__button-icon" />
          </button>
        </div>
      </div>
      <div class="toast__close" @click.stop="onClose">
        <img src="@/assets/icons/cross.svg" alt="Close" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Toast',
  props: {
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['info', 'error', 'success', 'warning'].includes(value)
    },
    isVisible: {
      type: Boolean,
      default: false
    },
    showButtons: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    iconSrc() {
      const icons = {
        info: require('@/assets/icons/notification_blue.svg'),
        error: require('@/assets/icons/notification_red.svg'),
        success: require('@/assets/icons/notification_green.svg'),
        warning: require('@/assets/icons/notification_yellow.svg')
      }
      return icons[this.type]
    }
  },
  methods: {
    onClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.toast {
  display: none;
  border-radius: 8px; // Переиспользуем из ui-molecules
  border: 1px solid;
  padding: 16px;
  margin-bottom: 12px;
  max-width: 400px;
  min-width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  &.visible {
    display: block;
  }
  
  &__content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
  }
  
  &__icon {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    img {
      width: 24px;
      height: 24px;
    }
  }
  
  &__text {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  &__content-text {
    flex: 1;
  }
  
  &__title {
    font-size: 16px;
    font-weight: 600;
    color: #263043;
    margin-bottom: 4px;
    line-height: 1.4;
  }
  
  &__subtitle {
    font-size: 14px;
    color: #666666;
    line-height: 1.4;
  }
  
  &__close {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    
    img {
      width: 12px;
      height: 12px;
    }
  }
  
  &__actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }
  
  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 121px;
    height: 32px;
    border-radius: 8px; // Переиспользуем из Button.vue
    background: transparent;
    color: #1735f5; // Переиспользуем из ButtonText.vue
    font-size: 14px;
    cursor: pointer;
    transition: all 0.1s ease-in 0s; // Переиспользуем из Button.vue
    
    &:first-child {
      border: 2px solid #1735f5;
    }
    
    &:first-child:hover {
      background: #f2f8ff; // Переиспользуем из ButtonText.vue
    }
    
    &:last-child:hover {
      background: transparent;
      color: #4e64f2; // Переиспользуем из ButtonText.vue
    }
    
    &-icon {
      width: 20px;
      height: 20px;
      filter: brightness(0) saturate(100%) invert(27%) sepia(96%) saturate(1352%) hue-rotate(213deg) brightness(97%) contrast(96%);
    }
    
    &:first-child &-icon:last-child {
      filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
    }
  }
  
  // Info Toast
  &.info {
    background-color: #f0f8ff;
    border-color: #b3d9ff;
  }
  
  // Error Toast
  &.error {
    background-color: #fff5f5;
    border-color: #ffb3b3;
  }
  
  // Success Toast
  &.success {
    background-color: #f0fff4;
    border-color: #b3ffb3;
  }
  
  // Warning Toast
  &.warning {
    background-color: #fff8f0;
    border-color: #ffd9b3;
  }
}
</style>
