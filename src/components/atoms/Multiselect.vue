<template>
  <div class="multiselect">
    <label v-if="label" class="multiselect__label">{{ label }}</label>
    <div 
      class="multiselect__field"
      :class="{
        'multiselect__field--off': !hasValue,
        'multiselect__field--on': hasValue,
        'multiselect__field--hovered': isHovered,
        'multiselect__field--pressed': isPressed,
        'multiselect__field--disabled': disabled,
        'multiselect__field--error': hasError
      }"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @mousedown="isPressed = true"
      @mouseup="isPressed = false"
      @click="toggleDropdown"
    >
      <div class="multiselect__content">
        <div v-if="hasError" class="multiselect__error-icon">
          <Icon name="warning" />
        </div>
        <div class="multiselect__text">
          <span v-if="!hasValue" class="multiselect__placeholder">{{ placeholder }}</span>
          <span v-else class="multiselect__value">{{ displayValue }}</span>
        </div>
        <div class="multiselect__actions">
          <button 
            v-if="hasValue && !disabled" 
            class="multiselect__clear"
            @click.stop="clearSelection"
          >
            <Icon name="close" />
          </button>
          <div class="multiselect__chevron">
            <Icon :name="isOpen ? 'chevronUp' : 'chevronDown'" />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Dropdown -->
    <div v-if="isOpen && !disabled" class="multiselect__dropdown">
      <div class="multiselect__options">
        <div 
          v-for="option in options" 
          :key="option.value"
          class="multiselect__option"
          :class="{ 'multiselect__option--selected': isSelected(option.value) }"
          @click="toggleOption(option.value)"
        >
          <div class="multiselect__checkbox">
            <Icon v-if="isSelected(option.value)" name="check" />
          </div>
          <span class="multiselect__option-text">{{ option.label }}</span>
        </div>
      </div>
    </div>
    
    <div v-if="hasError && errorMessage" class="multiselect__error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import Icon from '@/components/atoms/icon/Icon.vue'

export default {
  name: 'Multiselect',
  components: { Icon },
  props: {
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Placeholder'
    },
    modelValue: {
      // Поддержка v-model (Vue 3)
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: 'Prompt'
    },
    options: {
      type: Array,
      default: () => [
        { value: 'programmer', label: 'Программист' },
        { value: 'designer', label: 'Дизайнер' },
        { value: 'manager', label: 'Менеджер' },
        { value: 'analyst', label: 'Аналитик' },
        { value: 'tester', label: 'Тестировщик' },
        { value: 'devops', label: 'DevOps' }
      ]
    }
  },
  data() {
    return {
      isHovered: false,
      isPressed: false,
      isOpen: false
    }
  },
  computed: {
    currentValue() {
      // Приоритет v-model; если передан non-empty value без v-model — используем его
      const hasModel = Array.isArray(this.modelValue)
      const hasValueProp = Array.isArray(this.value)
      if (hasModel && this.modelValue.length > 0) return this.modelValue
      if (hasValueProp && this.value.length > 0) return this.value
      // если оба пустые, вернем modelValue (v-model по умолчанию)
      return hasModel ? this.modelValue : (hasValueProp ? this.value : [])
    },
    hasValue() {
      return this.currentValue && this.currentValue.length > 0
    },
    hasError() {
      return this.error
    },
    displayValue() {
      if (!this.hasValue) return ''
      if (this.currentValue.length === 1) {
        const option = this.options.find(opt => opt.value === this.currentValue[0])
        return option ? option.label : this.currentValue[0]
      }
      const count = this.currentValue.length
      const mod10 = count % 10
      const mod100 = count % 100
      let word = 'профессий'
      if (mod10 === 1 && mod100 !== 11) {
        word = 'профессия'
      } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
        word = 'профессии'
      }
      return `Выбрано ${count} ${word}`
    }
  },
  methods: {
    toggleDropdown() {
      if (this.disabled) return
      this.isOpen = !this.isOpen
      this.$emit('toggle', this.isOpen)
    },
    clearSelection() {
      // Совместимость: эмитим оба события
      this.$emit('update:modelValue', [])
      this.$emit('input', [])
      this.$emit('clear')
    },
    toggleOption(optionValue) {
      if (this.disabled) return
      
      const currentValue = [...(this.currentValue || [])]
      const index = currentValue.indexOf(optionValue)
      
      if (index > -1) {
        // Remove if already selected
        currentValue.splice(index, 1)
      } else {
        // Add if not selected
        currentValue.push(optionValue)
      }
      
      // Эмитим оба для совместимости
      this.$emit('update:modelValue', currentValue)
      this.$emit('input', currentValue)
    },
    isSelected(optionValue) {
      return (this.currentValue || []).includes(optionValue)
    }
  },
  mounted() {
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.isOpen = false
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.multiselect {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 300px;
  position: relative;
  
  &__label {
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #333333;
  }
  
  &__field {
    position: relative;
    border-radius: 8px;
    border: 1px solid #E0E0E0;
    background: #FFFFFF;
    cursor: pointer;
    transition: all 0.2s ease;
    
    // Off state (empty)
    &--off {
      border-color: #E0E0E0;
      background: #FFFFFF;
      
      .multiselect__placeholder {
        color: #828282;
      }
      
      .multiselect__chevron {
        color: #828282;
      }
    }
    
    // On state (filled)
    &--on {
      border-color: #E0E0E0;
      background: #FFFFFF;
      
      .multiselect__value {
        color: #333333;
      }
      
      .multiselect__clear {
        color: #BDBDBD;
      }
      
      .multiselect__chevron {
        color: #BDBDBD;
      }
    }
    
    // Hovered state
    &--hovered {
      border-color: #BDBDBD;
      background: #FFFFFF;
    }
    
    // Pressed state
    &--pressed {
      border-color: #2F80ED;
      background: #FFFFFF;
      
      .multiselect__chevron {
        color: #2F80ED;
      }
    }
    
    // Disabled state
    &--disabled {
      border-color: #F2F2F2;
      background: #F2F2F2;
      cursor: not-allowed;
      
      .multiselect__placeholder,
      .multiselect__value {
        color: #E0E0E0;
      }
      
      .multiselect__clear,
      .multiselect__chevron {
        color: #E0E0E0;
      }
    }
    
    // Error state
    &--error {
      border-color: #EB5757;
      background: #FFF0F0;
      
      .multiselect__placeholder,
      .multiselect__value {
        color: #EB5757;
      }
      
      .multiselect__error-icon {
        color: #EB5757;
      }
      
      .multiselect__chevron {
        color: #EB5757;
      }
    }
    
    // Error pressed state
    &--error.multiselect__field--pressed {
      border-color: #EB5757;
      background: #F0F8FF;
      
      .multiselect__chevron {
        color: #EB5757;
      }
    }
  }
  
  &__content {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    min-height: 48px;
  }
  
  &__error-icon {
    margin-right: 8px;
    display: flex;
    align-items: center;
    
    :deep(svg) {
      width: 16px;
      height: 16px;
    }
  }
  
  &__text {
    flex: 1;
    display: flex;
    align-items: center;
  }
  
  &__placeholder {
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
  }
  
  &__value {
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
  }
  
  &__actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  &__clear {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
    
    :deep(svg) {
      width: 16px;
      height: 16px;
    }
  }
  
  &__chevron {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    
    :deep(svg) {
      width: 16px;
      height: 16px;
    }
  }
  
  &__error-message {
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #EB5757;
  }
  
  &__dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 1000;
    background: #FFFFFF;
    border: 1px solid #E0E0E0;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin-top: 4px;
    max-height: 200px;
    overflow-y: auto;
  }
  
  &__options {
    padding: 8px 0;
  }
  
  &__option {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: #F5F5F5;
    }
    
    &--selected {
      background-color: #E3F2FD;
      
      &:hover {
        background-color: #BBDEFB;
      }
    }
  }
  
  &__checkbox {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border: 1px solid #BDBDBD;
    border-radius: 2px;
    margin-right: 12px;
    background: #FFFFFF;
    transition: all 0.2s ease;
    
    :deep(svg) {
      width: 12px;
      height: 12px;
      color: #2F80ED;
    }
  }
  
  &__option--selected &__checkbox {
    border-color: #2F80ED;
    background: #2F80ED;
    
    :deep(svg) {
      color: #FFFFFF;
    }
  }
  
  &__option-text {
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #333333;
  }
}
</style>
