<template>
  <div class="registration-steps">
    <!-- Progress Bar -->
    <div class="registration-steps__progress">
      <div 
        v-for="(step, index) in steps" 
        :key="index"
        class="registration-steps__progress-item"
        :class="{
          'registration-steps__progress-item--completed': index < currentStep,
          'registration-steps__progress-item--current': index === currentStep
        }"
      >
        <div class="registration-steps__progress-bar"></div>
      </div>
    </div>
    
    <!-- Navigation Buttons -->
    <div class="registration-steps__navigation">
      <button 
        class="registration-steps__button registration-steps__button--back"
        :disabled="!canGoBack"
        @click="goToPreviousStep"
      >
        Назад
      </button>
      
      <!-- Step Counter (Desktop only) -->
      <div class="registration-steps__step-counter">
        Шаг {{ currentStep + 1 }}/{{ totalSteps }}
      </div>
      
      <button 
        v-if="currentStep < totalSteps - 1"
        class="registration-steps__button registration-steps__button--next"
        :disabled="!canGoNext"
        @click="goToNextStep"
      >
        Далее
      </button>
      
      <button 
        v-if="currentStep === totalSteps - 1"
        class="registration-steps__button registration-steps__button--finish"
        :disabled="!canFinish"
        @click="finish"
      >
        Завершить
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegistrationSteps',
  props: {
    steps: {
      type: Array,
      required: true,
      validator: (steps) => steps.length > 0
    },
    currentStep: {
      type: Number,
      default: 0,
      validator: (value) => value >= 0
    },
    canGoBack: {
      type: Boolean,
      default: true
    },
    canGoNext: {
      type: Boolean,
      default: true
    },
    canFinish: {
      type: Boolean,
      default: true
    },
    finishText: {
      type: String,
      default: 'Завершить'
    }
  },
  emits: ['step-change', 'previous-step', 'next-step', 'finish'],
  computed: {
    totalSteps() {
      return this.steps.length
    }
  },
  methods: {
    goToPreviousStep() {
      if (this.currentStep > 0 && this.canGoBack) {
        this.$emit('previous-step', this.currentStep - 1)
        this.$emit('step-change', this.currentStep - 1)
      }
    },
    
    goToNextStep() {
      if (this.currentStep < this.totalSteps - 1 && this.canGoNext) {
        this.$emit('next-step', this.currentStep + 1)
        this.$emit('step-change', this.currentStep + 1)
      }
    },
    
    finish() {
      if (this.canFinish) {
        this.$emit('finish')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.registration-steps {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  
  &__progress {
    display: flex;
    gap: 8px;
    padding: 4px 10px;
  }
  
  &__progress-item {
    flex: 1;
    display: flex;
    align-items: center;
    min-height: 8px;
    min-width: 0;
    
    &--completed {
      .registration-steps__progress-bar {
        background: #1735f5;
      }
    }
    
    &--current {
      .registration-steps__progress-bar {
        background: #1735f5;
      }
    }
  }
  
  &__progress-bar {
    width: 100%;
    height: 8px;
    background: #f3f3f3;
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }
  
  &__navigation {
    display: flex;
    gap: 15px;
    align-items: center;
    padding: 16px;
    justify-content: space-between;
  }
  
  &__step-counter {
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    color: #666666;
    white-space: nowrap;
  }
  
  &__button {
    min-width: 0;
    height: 40px;
    border: none;
    border-radius: 8px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 24px;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 8px 16px;
    flex: 1;
    
    &--back {
      background: #f3f3f3;
      color: #263043;
      
      &:hover:not(:disabled) {
        background: #e8e8e8;
      }
    }
    
    &--next,
    &--finish {
      background: #1735f5;
      color: #ffffff;
      
      &:hover:not(:disabled) {
        background: #4e64f2;
      }
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

// Десктопная версия
@media (min-width: 769px) {
  .registration-steps {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    max-width: 100vw;
    z-index: 1000;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    transform: translateZ(0); // Принудительное создание слоя для лучшей производительности
    
    &__navigation {
      padding: 24px 96px;
      gap: 0;
      justify-content: space-between;
    }
    
    &__button {
      width: 200px;
      height: 48px;
      font-size: 18px;
      font-weight: 600;
      padding: 12px 24px;
      flex: none;
    }
    
    &__step-counter {
      font-size: 16px;
      font-weight: 400;
    }
  }
}

// Мобильная версия
@media (max-width: 768px) {
  .registration-steps {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    max-width: 100vw;
    z-index: 1000;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    transform: translateZ(0); // Принудительное создание слоя для лучшей производительности
    
    &__progress {
      padding: 4px 10px;
    }
    
    &__navigation {
      padding: 16px;
      gap: 15px;
      justify-content: space-between;
    }
    
    &__step-counter {
      display: none;
    }
    
    &__button {
      flex: 1;
      height: 40px;
      font-size: 14px;
      font-weight: 500;
      padding: 8px 16px;
    }
  }
}
</style>
