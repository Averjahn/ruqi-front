<template>
  <div
    :class="{
      error: hasError,
      success: hasSuccess,
      focused: isFocused,
      disabled: disabled,
    }"
    class="phone_field_container"
  >
    <div v-if="label" class="field_label_global">{{ label }}</div>
    <div class="phone_field_section" @click="onClick">
      <!-- Флаг России -->
      <div class="country_flag">
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
          type="tel"
          class="phone_input"
          maxlength="18"
        />
      </div>
      
      <!-- Кнопка очистки -->
      <ButtonIconGhost 
        v-if="showClearButton && !disabled" 
        @click.stop="clear"
        class="clear_button"
      >
        <img class="icon" src="@/assets/icons/cross.svg" />
      </ButtonIconGhost>
      
      <!-- Иконка глаза для показа/скрытия -->
      <div v-if="type === 'password'" class="eye_icon" @click="togglePasswordVisibility">
        <img 
          :src="showPassword ? '@/assets/icons/eye_open.svg' : '@/assets/icons/eye_closed.svg'" 
          :alt="showPassword ? 'Скрыть' : 'Показать'"
          class="eye_icon_img"
        />
      </div>
      
      <!-- Индикатор загрузки -->
      <ThinLineLoading class="progress_wrap" :show="loading" />
    </div>
    
    <!-- Сообщения об ошибке/успехе -->
    <FieldMessage :text="errorMessage" :type="messageType" />
  </div>
</template>

<script>
import { formatPhoneNumber, clearPhoneAlwaysSeven } from '@/constants/helpers'
import FieldMessage from '@/components/atoms/FieldMessage.vue'
import ThinLineLoading from '@/components/atoms/loaders/ThinLineLoading.vue'

export default {
  name: 'PhoneField',
  components: { FieldMessage, ThinLineLoading },
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '+7 900 000-00-00',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: '',
    },
    success: {
      type: Boolean,
      default: false,
    },
    successMessage: {
      type: String,
      default: '',
    },
    rules: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:modelValue', 'focus', 'blur', 'change'],
  data() {
    return {
      isFocused: false,
      internalValue: this.modelValue || '',
      showPassword: false,
    }
  },
  computed: {
    formattedValue() {
      if (!this.internalValue) return ''
      return formatPhoneNumber(this.internalValue)
    },
    hasError() {
      return this.error || (this.errorMessage && this.errorMessage.length > 0)
    },
    hasSuccess() {
      return this.success || (this.successMessage && this.successMessage.length > 0)
    },
    showClearButton() {
      return this.internalValue && this.internalValue.length > 0 && !this.disabled
    },
    errorMessage() {
      if (this.hasError) {
        return this.errorMessage || 'Неверный номер телефона'
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
  },
  watch: {
    modelValue(newValue) {
      this.internalValue = newValue || ''
    },
  },
  methods: {
    onInput(event) {
      const value = event.target.value
      // Ограничиваем ввод только цифрами и максимум 11 цифр
      const digitsOnly = value.replace(/\D/g, '')
      const limitedDigits = digitsOnly.slice(0, 11)
      const cleaned = clearPhoneAlwaysSeven(limitedDigits)
      
      // Если введено больше 11 цифр, обрезаем
      if (digitsOnly.length > 11) {
        event.target.value = formatPhoneNumber(limitedDigits)
      }
      
      this.internalValue = cleaned
      this.$emit('update:modelValue', cleaned)
      this.$emit('change', cleaned)
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
      // Разрешаем только цифры, backspace, delete, tab, escape, enter
      const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
      const isDigit = /[0-9]/.test(event.key)
      const isAllowedKey = allowedKeys.includes(event.key)
      
      if (!isDigit && !isAllowedKey) {
        event.preventDefault()
      }
    },
    onPaste(event) {
      // Обрабатываем вставку текста
      event.preventDefault()
      const pastedText = event.clipboardData.getData('text')
      const digitsOnly = pastedText.replace(/\D/g, '')
      const limitedDigits = digitsOnly.slice(0, 11)
      const cleaned = clearPhoneAlwaysSeven(limitedDigits)
      this.internalValue = cleaned
      this.$emit('update:modelValue', cleaned)
      this.$emit('change', cleaned)
    },
    onClick() {
      if (!this.disabled && !this.readonly) {
        this.$refs.input.focus()
      }
    },
    clear() {
      this.internalValue = ''
      this.$emit('update:modelValue', '')
      this.$emit('change', '')
      this.$refs.input.focus()
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
      // Переключаем тип input между 'tel' и 'text' для показа/скрытия пароля
      if (this.$refs.input) {
        this.$refs.input.type = this.showPassword ? 'text' : 'tel'
      }
    },
    focus() {
      this.$refs.input.focus()
    },
    blur() {
      this.$refs.input.blur()
    },
  },
}
</script>

<style lang="scss" scoped>
.phone_field_container {
  width: 300px; // Фиксированная ширина как в макете
  

  .progress_wrap {
    position: absolute;
    width: 100%;
    height: 3px;
    left: 0;
    bottom: 0;
  }

  // Состояние ошибки
  &.error {
    .phone_field_section {
      border: none; // Убираем бордер при error состоянии
      background-color: #fff6f5;
    }
  }

  // Состояние успеха (только когда не в фокусе)
  &.success:not(.focused) {
    .phone_field_section {
      border: none; // Убираем бордер при success состоянии
      background-color: #e3fceb;
    }
  }

  // Состояние фокуса
  &.focused {
    .phone_field_section {
      border: 1.5px solid #1735f5;
    }
  }

  // Состояние отключено
  &.disabled {
    .phone_field_section {
      background-color: #f5f5f5;
      border-color: #e0e0e0;
      cursor: not-allowed;
    }
    
    .phone_input {
      color: #999;
      cursor: not-allowed;
    }
  }

  .phone_field_section {
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
    }

    .phone_input {
      display: inline-block;
      width: 100%;
      height: 100%;
      background: none;
      padding: 0;
      color: #263043;
      box-sizing: border-box;
      border: none;
      font-size: 16px;
      outline: none;

      &::placeholder {
        color: #707070;
      }

      &:disabled {
        color: #999;
        cursor: not-allowed;
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
    
    .eye_icon {
      flex-shrink: 0;
      margin-left: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 4px;
      transition: background-color 0.2s ease;
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
      
      .eye_icon_img {
        width: 20px;
        height: 20px;
        object-fit: contain;
      }
    }

    &:focus-within {
      border: 1.5px solid #1735f5;
    }
  }
}
</style>
