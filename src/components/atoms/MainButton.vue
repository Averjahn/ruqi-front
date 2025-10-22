<template>
  <button
    :type="buttonType"
    class="main-button"
    :class="[
      `main-button--${type}`,
      { 'main-button--loading': loading },
      { 'main-button--disabled': disabled }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <div class="main-button__content">
      <Icon v-if="!loading && leftIcon !== 'none'" :name="leftIcon" class="main-button__icon main-button__icon--left" />
      <div v-if="loading" class="main-button__spinner"></div>
      <span v-if="!loading" class="main-button__text">{{ text }}</span>
      <Icon v-if="!loading && rightIcon !== 'none'" :name="rightIcon" class="main-button__icon main-button__icon--right" />
    </div>
  </button>
</template>

<script>
import Icon from '@/components/atoms/icon/Icon.vue'

export default {
  name: 'MainButton',
  components: { Icon },
  props: {
    type: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'error', 'neutral', 'primary-outline', 'error-outline', 'primary-white'].includes(value)
    },
    text: {
      type: String,
      default: 'Button'
    },
    leftIcon: {
      type: String,
      default: 'none'
    },
    rightIcon: {
      type: String,
      default: 'none'
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    buttonType: {
      type: String,
      default: 'button',
      validator: (value) => ['button', 'submit', 'reset'].includes(value)
    }
  },
  emits: ['click'],
  methods: {
    handleClick(event) {
      if (!this.disabled && !this.loading) {
        this.$emit('click', event)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main-button {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Source Sans 3', sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 26px;
  padding: 10px 16px; // 10px сверху/снизу
  min-height: 40px;
  transition: all 0.2s ease;
  user-select: none;
  box-sizing: border-box;
  outline: none;
  
  &__content {
    display: flex;
    align-items: center;
    gap: 10px; // 10px до текста
  }
  
  &__icon {
    width: 20px; // размер иконки 20px
    height: 20px; // размер иконки 20px
    flex-shrink: 0;
  }
  
  &__spinner {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    animation: spin 1s linear infinite;
  }
  
  // Spinner colors for different button types
  &--primary &__spinner {
    border-top-color: #ffffff;
  }
  
  &--error &__spinner {
    border-top-color: #ffffff;
  }
  
  &--neutral &__spinner {
    border-top-color: #263043;
  }
  
  &--primary-outline &__spinner {
    border-top-color: #1735f5;
  }
  
  &--error-outline &__spinner {
    border-top-color: #eb4d3d;
  }
  
  &--primary-white &__spinner {
    border-top-color: #263043;
  }
  
  &__text {
    white-space: nowrap;
  }
  
  // Primary (Solid Blue)
  &--primary {
    background-color: #1735f5;
    color: #ffffff;
    border: 2px solid #1735f5;
    
    .main-button__icon {
      filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
    }
    
    &:hover:not(.main-button--disabled):not(.main-button--loading) {
      background-color: #4e64f2;
      border-color: #4e64f2;
    }
    
    &:focus:not(.main-button--disabled):not(.main-button--loading) {
      background-color: #1735f5;
      border: 2px solid #00B2FE;
    }
    
    &:active:not(.main-button--disabled):not(.main-button--loading) {
      background-color: #263588;
      border-color: #263588;
      
      .main-button__icon {
        filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
      }
    }
    
    &.main-button--disabled {
      background-color: #b0baff;
      color: #b0baff;
      
      .main-button__icon {
        filter: brightness(0) saturate(100%) invert(69%) sepia(8%) saturate(750%) hue-rotate(201deg) brightness(101%) contrast(89%);
      }
    }
    
    &.main-button--loading {
      background-color: #b0baff;
      color: #ffffff;
    }
  }
  
  // Error (Solid Red)
  &--error {
    background-color: #eb4d3d;
    color: #ffffff;
    border: 2px solid #eb4d3d;
    
    .main-button__icon {
      filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
    }
    
    &:hover:not(.main-button--disabled):not(.main-button--loading) {
      background-color: #d41212;
      border-color: #d41212;
    }
    
    &:focus:not(.main-button--disabled):not(.main-button--loading) {
      background-color: #eb4d3d;
      border: 2px solid #00B2FE;
    }
    
    &:active:not(.main-button--disabled):not(.main-button--loading) {
      background-color: #a90e0e;
      border-color: #a90e0e;
      
      .main-button__icon {
        filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
      }
    }
    
    &.main-button--disabled {
      background-color: #ffb3b3;
      color: #ffb3b3;
      
      .main-button__icon {
        filter: brightness(0) saturate(100%) invert(85%) sepia(15%) saturate(750%) hue-rotate(315deg) brightness(101%) contrast(89%);
      }
    }
    
    &.main-button--loading {
      background-color: #ffb3b3;
      color: #ffffff;
    }
  }
  
  // Neutral (Solid Light Gray)
  &--neutral {
    background-color: #f3f3f3;
    color: #263043;
    border: 2px solid #f3f3f3;
    
    .main-button__icon {
      filter: brightness(0) saturate(100%) invert(15%) sepia(8%) saturate(750%) hue-rotate(201deg) brightness(101%) contrast(89%);
    }
    
    &:hover:not(.main-button--disabled):not(.main-button--loading) {
      background-color: #dadada;
      border-color: #dadada;
    }
    
    &:focus:not(.main-button--disabled):not(.main-button--loading) {
      background-color: #f3f3f3;
      border: 2px solid #00B2FE;
    }
    
    &:active:not(.main-button--disabled):not(.main-button--loading) {
      background-color: #bebebe;
      border-color: #bebebe;
      
      .main-button__icon {
        filter: brightness(0) saturate(100%) invert(15%) sepia(8%) saturate(750%) hue-rotate(201deg) brightness(101%) contrast(89%);
      }
    }
    
    &.main-button--disabled {
      background-color: #f8f8f8;
      color: #c0c0c0;
      
      .main-button__icon {
        filter: brightness(0) saturate(100%) invert(75%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(89%);
      }
    }
    
    &.main-button--loading {
      background-color: #f8f8f8;
      color: #263043;
    }
  }
  
  // Primary Outline (Blue Border)
  &--primary-outline {
    background-color: #ffffff;
    border: 2px solid #1735f5;
    color: #1735f5;
    
    .main-button__icon {
      filter: brightness(0) saturate(100%) invert(27%) sepia(96%) saturate(1352%) hue-rotate(213deg) brightness(97%) contrast(96%);
    }
    
    &:hover:not(.main-button--disabled):not(.main-button--loading) {
      border-color: #2E3F9E;
    }
    
    &:focus:not(.main-button--disabled):not(.main-button--loading) {
      background-color: #ffffff;
      border: 2px solid #00B2FE;
    }
    
    &:active:not(.main-button--disabled):not(.main-button--loading) {
      background-color: #f2f8ff;
      border: 2px solid #1735f5;
      color: #1735f5;
      
      .main-button__icon {
        filter: brightness(0) saturate(100%) invert(27%) sepia(96%) saturate(1352%) hue-rotate(213deg) brightness(97%) contrast(96%);
      }
    }
    
    &.main-button--disabled {
      background-color: #ffffff;
      border-color: #b0baff;
      color: #b0baff;
      
      .main-button__icon {
        filter: brightness(0) saturate(100%) invert(69%) sepia(8%) saturate(750%) hue-rotate(201deg) brightness(101%) contrast(89%);
      }
    }
    
    &.main-button--loading {
      background-color: #ffffff;
      border-color: #b0baff;
      color: #b0baff;
    }
  }
  
  // Error Outline (Red Border)
  &--error-outline {
    background-color: #ffffff;
    border: 2px solid #eb4d3d;
    color: #eb4d3d;
    
    .main-button__icon {
      filter: brightness(0) saturate(100%) invert(44%) sepia(86%) saturate(2196%) hue-rotate(343deg) brightness(95%) contrast(88%);
    }
    
    &:hover:not(.main-button--disabled):not(.main-button--loading) {
      border-color: #D41212;
    }
    
    &:focus:not(.main-button--disabled):not(.main-button--loading) {
      background-color: #ffffff;
      border: 2px solid #00B2FE;
    }
    
    &:active:not(.main-button--disabled):not(.main-button--loading) {
      background-color: #fff5f5;
      border: 2px solid #eb4d3d;
      color: #eb4d3d;
      
      .main-button__icon {
        filter: brightness(0) saturate(100%) invert(44%) sepia(86%) saturate(2196%) hue-rotate(343deg) brightness(95%) contrast(88%);
      }
    }
    
    &.main-button--disabled {
      background-color: #ffffff;
      border-color: #ffb3b3;
      color: #ffb3b3;
      
      .main-button__icon {
        filter: brightness(0) saturate(100%) invert(85%) sepia(15%) saturate(750%) hue-rotate(315deg) brightness(101%) contrast(89%);
      }
    }
    
    &.main-button--loading {
      background-color: #ffffff;
      border-color: #ffb3b3;
      color: #ffb3b3;
    }
  }
  
  // Primary White (Dark Gray Border)
  &--primary-white {
    background-color: #ffffff;
    border: 2px solid #263043;
    color: #263043;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
    
    .main-button__icon {
      filter: brightness(0) saturate(100%) invert(15%) sepia(8%) saturate(750%) hue-rotate(201deg) brightness(101%) contrast(89%);
    }
    
    &:hover:not(.main-button--disabled):not(.main-button--loading) {
      background-color: #f8f9fa;
    }
    
    &:focus:not(.main-button--disabled):not(.main-button--loading) {
      background-color: #ffffff;
      border: 2px solid #00B2FE;
    }
    
    &:active:not(.main-button--disabled):not(.main-button--loading) {
      background-color: #ffffff;
      border: 2px solid #263043;
      color: #263043;
      
      .main-button__icon {
        filter: brightness(0) saturate(100%) invert(15%) sepia(8%) saturate(750%) hue-rotate(201deg) brightness(101%) contrast(89%);
      }
    }
    
    &.main-button--disabled {
      background-color: #f8f8f8;
      border-color: #c0c0c0;
      color: #c0c0c0;
      
      .main-button__icon {
        filter: brightness(0) saturate(100%) invert(75%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(89%);
      }
    }
    
    &.main-button--loading {
      background-color: #ffffff;
      border-color: #c0c0c0;
      color: #c0c0c0;
    }
  }
  
  // Disabled state
  &.main-button--disabled {
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.6;
  }
  
  // Loading state
  &.main-button--loading {
    cursor: not-allowed;
    pointer-events: none;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
