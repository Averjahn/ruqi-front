<template>
  <div class="code-input">
    <label class="code-input__label">{{ label }}</label>
    <input
      class="code-input__field"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </div>
</template>

<script>
export default {
  name: 'CodeInput',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: 'Код'
    },
    placeholder: {
      type: String,
      default: 'Введите код'
    },
    type: {
      type: String,
      default: 'text'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'focus', 'blur'],
  methods: {
    handleInput(event) {
      this.$emit('update:modelValue', event.target.value)
    },
    handleFocus(event) {
      this.$emit('focus', event)
    },
    handleBlur(event) {
      this.$emit('blur', event)
    }
  }
}
</script>

<style lang="scss" scoped>
.code-input {
  width: 100%;
  margin-bottom: 16px;

  &__label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
    line-height: 20px;
  }

  &__field {
    width: 100%;
    height: 48px;
    padding: 12px 16px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 16px;
    line-height: 24px;
    color: #111827;
    background-color: #ffffff;
    transition: all 0.15s ease-in-out;
    box-sizing: border-box;

    &::placeholder {
      color: #9ca3af;
    }

    &:focus {
      outline: none;
      border-color: #4e64f2;
      box-shadow: 0 0 0 3px rgba(78, 100, 242, 0.1);
    }

    &:disabled {
      background-color: #f9fafb;
      color: #6b7280;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      border-color: #9ca3af;
    }
  }
}
</style>
