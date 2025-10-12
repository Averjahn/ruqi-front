<template>
  <div
    :class="{
      error: hasError,
      success: hasSuccess,
      focused: isFocused,
      disabled: disabled,
    }"
    class="unified_input_container"
  >
    <div v-if="label" class="field_label_global">{{ label }}</div>
    <div class="input_section" @click="onClick">
      <!-- Флаг России для телефона -->
      <div v-if="type === 'phone'" class="country_flag">
        <img src="@/assets/icons/flag_ru.svg" alt="Russia" class="flag_icon" />
      </div>
      
      <!-- Поле ввода -->
      <div class="input_wrap">
        <input
          ref="input"
          :value="formattedValue"
          @input="onInput"
          @change="onChange"
          @focus="onFocus"
          @blur="onBlur"
          @keypress="onKeyPress"
          @paste="onPaste"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :type="currentInputType"
          class="unified_input"
          :maxlength="maxLength"
        />
      </div>
      
      <!-- Кнопка очистки (не показываем для пароля) -->
      <ButtonIconGhost 
        v-if="showClearButton && !disabled && type !== 'password'" 
        @click.stop="clear"
        class="clear_button"
      >
        <img class="icon" src="@/assets/icons/cross.svg" />
      </ButtonIconGhost>
      
      <!-- Иконка глаза для пароля -->
      <ButtonIconGhost v-if="type === 'password'" @click="togglePasswordVisibility">
        <img v-if="currentInputType === 'text'" class="icon" src="@/assets/icons/eye_close.svg" />
        <img v-if="currentInputType === 'password'" class="icon" src="@/assets/icons/eye_open.svg" />
      </ButtonIconGhost>
      
      <!-- Индикатор загрузки -->
      <ThinLineLoading class="progress_wrap" :show="loading" />
    </div>
    
    <!-- Сообщение об ошибке/успехе -->
    <FieldMessage :text="computedErrorMessage" :type="messageType" />
  </div>
</template>

<script>
import { formatPhoneNumber, clearPhoneAlwaysSeven } from '@/constants/helpers'
import FieldMessage from '@/components/atoms/FieldMessage.vue'
import ThinLineLoading from '@/components/atoms/loaders/ThinLineLoading.vue'
import ButtonIconGhost from '@/components/atoms/ButtonIconGhost'

export default {
  name: 'UnifiedInputField',
  components: { FieldMessage, ThinLineLoading, ButtonIconGhost },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    value: {
      type: [String, Number],
      default: '',
    },
    type: {
      type: String,
      default: 'text',
      validator: (value) => ['phone', 'password', 'sms-code', 'inn', 'text'].includes(value)
    },
    label: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: '',
    },
    error: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    success: {
      type: Boolean,
      default: false,
    },
    successMessage: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue', 'focus', 'blur', 'change', 'input'],
  data() {
    return {
      isFocused: false,
      internalValue: this.modelValue || this.value || '',
      showPassword: false,
    }
  },
  computed: {
    filteredAttrs() {
      const attrs = { ...this.$attrs }
      delete attrs.class
      return attrs
    },
    formattedValue() {
      if (!this.internalValue) return ''
      
      switch (this.type) {
        case 'phone':
          return formatPhoneNumber(this.internalValue)
        case 'sms-code':
          return this.formatSmsCode(this.internalValue)
        case 'inn':
          return this.internalValue.toString()
        default:
          return this.internalValue.toString()
      }
    },
    hasError() {
      return this.error || (this.errorMessage && this.errorMessage.length > 0)
    },
    hasSuccess() {
      return this.success || (this.successMessage && this.successMessage.length > 0)
    },
    computedErrorMessage() {
      if (this.hasError) {
        return this.errorMessage || 'Неверное значение'
      }
      if (this.hasSuccess) {
        return this.successMessage || ''
      }
      return ''
    },
    messageType() {
      if (this.hasSuccess) {
        return 'success'
      }
      return 'error'
    },
    showClearButton() {
      return this.clearable && !this.disabled && !this.loading && this.internalValue.length > 0
    },
    currentInputType() {
      if (this.type === 'password') {
        return this.showPassword ? 'text' : 'password'
      }
      return 'text'
    },
    maxLength() {
      switch (this.type) {
        case 'phone':
          return 18 // +7 900 000-00-00
        case 'sms-code':
          return 7 // 123-456
        case 'inn':
          return 12
        default:
          return undefined
      }
    }
  },
  watch: {
    modelValue(newValue) {
      this.internalValue = newValue || ''
    },
    value(newValue) {
      this.internalValue = newValue || ''
    },
    error(val) {
      if (val) {
        this.shake = true
        setTimeout(() => {
          this.shake = false
        }, 1000)
      }
    },
  },
  methods: {
    onInput(event) {
      const value = event.target.value
      let processedValue = value
      
      switch (this.type) {
        case 'phone':
          processedValue = this.processPhoneInput(value)
          break
        case 'sms-code':
          processedValue = this.processSmsInput(value)
          break
        case 'inn':
          processedValue = this.processInnInput(value)
          break
        case 'password':
          processedValue = value
          break
        default:
          processedValue = value
      }
      
      this.internalValue = processedValue
      this.$emit('update:modelValue', processedValue)
      this.$emit('input', processedValue)
      this.$emit('change', processedValue)
    },
    onChange(event) {
      this.$emit('change', this.internalValue)
    },
    onFocus(event) {
      this.isFocused = true
      this.$emit('focus', event)
    },
    onBlur(event) {
      this.isFocused = false
      this.$emit('blur', event)
    },
    onKeyPress(event) {
      const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
      const isAllowedKey = allowedKeys.includes(event.key)
      
      let isDigit = false
      if (this.type === 'phone' || this.type === 'sms-code' || this.type === 'inn') {
        isDigit = /[0-9]/.test(event.key)
      } else {
        isDigit = true // Для password и text разрешаем все символы
      }
      
      if (!isDigit && !isAllowedKey) {
        event.preventDefault()
      }
    },
    onPaste(event) {
      event.preventDefault()
      const pastedText = event.clipboardData.getData('text')
      let processedValue = pastedText
      
      switch (this.type) {
        case 'phone':
          processedValue = this.processPhoneInput(pastedText)
          break
        case 'sms-code':
          processedValue = this.processSmsInput(pastedText)
          break
        case 'inn':
          processedValue = this.processInnInput(pastedText)
          break
        default:
          processedValue = pastedText
      }
      
      this.internalValue = processedValue
      this.$emit('update:modelValue', processedValue)
      this.$emit('input', processedValue)
      this.$emit('change', processedValue)
    },
    onClick() {
      if (!this.disabled && !this.readonly) {
        this.$refs.input.focus()
      }
    },
    clear() {
      this.internalValue = ''
      this.$emit('update:modelValue', '')
      this.$emit('input', '')
      this.$emit('change', '')
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
    focus() {
      this.$refs.input.focus()
    },
    blur() {
      this.$refs.input.blur()
    },
    
    // Обработка ввода для телефона
    processPhoneInput(value) {
      const digitsOnly = value.replace(/\D/g, '')
      const limitedDigits = digitsOnly.slice(0, 11)
      return clearPhoneAlwaysSeven(limitedDigits)
    },
    
    // Обработка ввода для SMS кода
    processSmsInput(value) {
      const digitsOnly = value.replace(/\D/g, '')
      return digitsOnly.slice(0, 6)
    },
    
    // Обработка ввода для ИНН
    processInnInput(value) {
      const digitsOnly = value.replace(/\D/g, '')
      return digitsOnly.slice(0, 12)
    },
    
    // Форматирование SMS кода
    formatSmsCode(value) {
      if (!value) return ''
      const digitsOnly = value.replace(/\D/g, '')
      if (digitsOnly.length >= 3) {
        return digitsOnly.slice(0, 3) + '-' + digitsOnly.slice(3, 6)
      }
      return digitsOnly
    },
    
  },
}
</script>

<style lang="scss" scoped>
.unified_input_container {
  width: 300px; 
  

  .progress_wrap {
    position: absolute;
    width: 100%;
    height: 3px;
    left: 0;
    bottom: 0;
  }

  .input_section {
    position: relative;
    height: 48px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 12px;
    box-sizing: border-box;
    border: 1px solid #dadada;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.2s ease-in-out;

    .country_flag {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      
      .flag_icon {
        width: 20px;
        height: 20px;
        object-fit: contain;
        border-radius: 2px;
      }
    }

    .input_wrap {
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;

      .unified_input {
        display: inline-block;
        width: 100%;
        height: 100%;
        background: none;
        padding: 0;
        color: #263043;
        box-sizing: border-box;
        border: none;
        font-size: 16px;

        &:focus {
          outline: none;
        }

        &::placeholder {
          color: #707070;
        }
      }
    }

    .clear_button {
      flex-shrink: 0;
      
      .icon {
        width: 20px;
        min-width: 20px;
        height: 20px;
      }
    }
    
    .icon {
      width: 20px;
      min-width: 20px;
      height: 20px;
    }
  }

  // Состояние ошибки
  &.error {
    .input_section {
      border: none; // Убираем бордер при error состоянии
      background-color: #fff6f5;
    }
  }

  // Состояние успеха (только когда не в фокусе)
  &.success:not(.focused) {
    .input_section {
      border: none; // Убираем бордер при success состоянии
      background-color: #e3fceb;
    }
  }

  // Состояние фокуса
  &.focused {
    .input_section {
      border: 1.5px solid #1735f5;
    }
  }

  // Состояние отключено
  &.disabled {
    .input_section {
      background-color: #f5f5f5;
      color: #a0a0a0;
      cursor: not-allowed;
      
      .unified_input {
        cursor: not-allowed;
      }
    }
  }


  // Анимация тряски при ошибке
  &.shake {
    animation: vertical-shaking 0.8s 1 ease-out;
  }

  @keyframes vertical-shaking {
    0%, 100% { transform: translateY(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateY(-5px); }
    20%, 40%, 60%, 80% { transform: translateY(5px); }
  }
}
</style>
