<template>
  <button
    class="copy-button"
    :class="[
      `copy-button--${type}`,
      { 'copy-button--loading': loading },
      { 'copy-button--disabled': disabled }
    ]"
    :disabled="disabled || loading"
    @click="handleCopy"
  >
    <div class="copy-button__content">
      <Icon v-if="!loading" :name="icon" class="copy-button__icon" />
      <div v-if="loading" class="copy-button__spinner"></div>
      <span v-if="!loading && showText" class="copy-button__text">{{ text }}</span>
    </div>
  </button>
</template>

<script>
import Icon from '@/components/atoms/icon/Icon.vue'

export default {
  name: 'CopyButton',
  components: { Icon },
  props: {
    type: {
      type: String,
      default: 'outline', // 'outline' | 'filled'
      validator: (value) => ['outline', 'filled'].includes(value)
    },
    text: {
      type: String,
      default: 'Копировать'
    },
    icon: {
      type: String,
      default: 'documentCopy'
    },
    showText: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    dataToCopy: {
      type: String,
      required: true
    }
  },
  emits: ['copy', 'error'],
  methods: {
    async handleCopy() {
      if (this.disabled || this.loading) return
      
      try {
        await navigator.clipboard.writeText(this.dataToCopy)
        this.$emit('copy', this.dataToCopy)
      } catch (error) {
        console.error('Failed to copy text: ', error)
        this.$emit('error', error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.copy-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 12px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 48px;
  height: 48px;
  
  &__content {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  &__icon {
    width: 24px;
    height: 24px;
    color: #212121;
    flex-shrink: 0;
  }
  
  &__text {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 22px;
    color: #1735f5;
    white-space: nowrap;
  }
  
  &__spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid #1735f5;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  // Outline type (default)
  &--outline {
    border-color: rgba(0, 0, 0, 0.1);
    background: transparent;
    
    &:hover {
      background-color: #f8f9fa;
      border-color: #1735f5;
      
      .copy-button__icon {
        color: #1735f5;
      }
    }
    
    &:active {
      background-color: #f0f8ff;
      border-color: #1735f5;
      
      .copy-button__icon {
        color: #1735f5;
      }
    }
  }
  
  // Filled type
  &--filled {
    border-color: #1735f5;
    background: #1735f5;
    
    .copy-button__icon {
      color: #ffffff;
    }
    
    .copy-button__text {
      color: #ffffff;
    }
    
    .copy-button__spinner {
      border-top-color: #ffffff;
    }
    
    &:hover {
      background-color: #4e64f2;
      border-color: #4e64f2;
    }
    
    &:active {
      background-color: #263588;
      border-color: #263588;
    }
  }
  
  // Disabled state
  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
  
  // Loading state
  &--loading {
    cursor: not-allowed;
    pointer-events: none;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
