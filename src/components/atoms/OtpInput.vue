<template>
  <div class="vue-otp-input">
    <div
      class="otp-wrapper"
      :class="isInputFocused ? activeWrapperClassHandler : wrapperClassHandler"
      :style="wrapperStyle"
      :id="id"
    >
      <input
        v-for="(digitInput, index) in digits"
        ref="digitInput"
        :key="id + index"
        autocomplete="one-time-code"
        v-model="inputValue[index]"
        class="otp-input"
        :class="[inputClassHandler, activeInput === index ? activeInputClassHandler : '']"
        :placeholder="placeholder"
        :disabled="isDisabled"
        @focus="onFocus(index)"
        @blur="onBlur"
        @input="onInput(index, $event)"
        @change="onChanged"
        @keyup="keydownHandler(index, $event)"
        :style="inputStyle"
      />
    </div>
    <span v-if="!isValid" :class="errorClassHandler">
      <slot name="errorMessage"></slot>
    </span>
  </div>
</template>

<script>
export default {
  name: 'OtpInput',
  props: {
    id: {
      type: String,
      default: 'otp',
    },
    digits: {
      type: Number,
      default: 4,
    },
    mode: {
      type: String,
      default: 'separate',
    },
    type: {
      type: String,
      default: 'number',
    },
    placeholder: {
      type: String,
      default: '-',
    },
    radius: {
      type: Number,
      default: 5,
    },
    gap: {
      type: Number,
      default: 16,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    rtl: {
      type: Boolean,
      default: false,
    },
    autoFocus: {
      type: Boolean,
      default: true,
    },
    errorClass: {
      type: String,
      default: '',
    },
    separateInputClass: {
      type: String,
      default: '',
    },
    separateWrapperClass: {
      type: String,
      default: '',
    },
    groupInputClass: {
      type: String,
      default: '',
    },
    groupWrapperClass: {
      type: String,
      default: '',
    },
    activeInputClass: {
      type: String,
      default: '',
    },
    activeWrapperClass: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      inputValue: [],
      isInputFocused: false,
      activeInput: -1,
    }
  },
  mounted () {
    if (this.autoFocus && !this.isDisabled) {
      this.onFocus(0)
      this.$refs.digitInput[0].focus()
      const types = ['text', 'password', 'number']
      if (types.indexOf(this.type) != -1) {
        for (let box of this.$refs.digitInput) {
          box.type = this.type
        }
      }
    }
  },
  computed: {
    wrapperStyle () {
      const dir = this.rtl ? 'rtl' : 'ltr'
      const styles = {
        direction: dir,
        gap: `${this.gap}px`,
        'border-radius': `${this.radius}px`,
      }
      return styles
    },
    inputStyle () {
      return {
        '--border-radius': `${this.radius}px`,
      }
    },
    inputClassHandler () {
      if (this.mode === 'separate') {
        if (this.isValid) {
          return this.separateInputClass ? this.separateInputClass : 'defualt-input-separate'
        } else {
          return this.separateInputClass ? this.separateInputClass : 'defualt-error-input-separate'
        }
      }
      if (this.mode === 'group') {
        return this.groupInputClass ? this.groupInputClass : 'defualt-input-group'
      }
      return ''
    },
    activeInputClassHandler () {
      if (this.mode === 'separate') {
        return this.activeInputClass ? this.activeInputClass : 'defualt-active-input'
      }
      return ''
    },
    activeWrapperClassHandler () {
      if (this.mode === 'group') {
        if (this.isValid) {
          return this.activeWrapperClass ? this.activeWrapperClass : 'defualt-active-wrapper'
        } else {
          return this.activeWrapperClass ? this.activeWrapperClass : 'defualt-error-wrapper-group'
        }
      }
      return ''
    },
    wrapperClassHandler () {
      if (this.mode === 'separate') {
        return this.separateWrapperClass ? this.separateWrapperClass : 'defualt-wrapper-separate'
      }
      if (this.mode === 'group') {
        if (this.isValid) {
          return this.groupWrapperClass ? this.groupWrapperClass : 'defualt-wrapper-group'
        } else {
          return this.groupWrapperClass ? this.groupWrapperClass : 'defualt-error-wrapper-group'
        }
      }
      return ''
    },
    joinedValue () {
      const value = this.inputValue.join('')
      this.$emit('onInput', value)
      return value
    },
    errorClassHandler () {
      return this.errorClass ? this.errorClass : 'default-error-class'
    },
  },
  watch: {},
  methods: {
    keydownHandler (index, e) {
      if (e.keyCode === 8 && e.target.value === '') {
        this.$refs.digitInput[Math.max(0, index - 1)].focus()
      }
    },
    onInput (index) {
      const [first, ...rest] =
        this.type === 'number' ? this.inputValue[index].replace(/[^0-9]/g, '') : this.inputValue[index]
      this.inputValue[index] = first === null || first === undefined ? '' : first
      const lastInputBox = index === this.digits - 1
      const insertedContent = first !== undefined
      if (insertedContent && !lastInputBox) {
        this.$refs.digitInput[index + 1].focus()
        if (rest.length) {
          this.$refs.digitInput[index + 1].value = rest.join('')
          this.$refs.digitInput[index + 1].dispatchEvent(new Event('input'))
        }
      }
      if (lastInputBox && this.inputValue[index] !== '') {
        this.$refs.digitInput[index].blur()
      }
    },
    onFocus (index) {
      this.activeInput = index
      this.isInputFocused = true
      const inputElement = this.$refs.digitInput[index]
      if (!inputElement) return
      inputElement.focus()
      if (typeof inputElement.select === 'function') {
        inputElement.select()
      } else if (typeof inputElement.setSelectionRange === 'function') {
        inputElement.setSelectionRange(0, inputElement.value.length)
      } else if (typeof inputElement.createTextRange === 'function') {
        const range = inputElement.createTextRange()
        range.moveStart('character', 0)
        range.moveEnd('character', inputElement.value.length)
        range.select()
      }
    },
    reset () {
      this.inputValue = []
      this.onFocus(0)
    },
    onBlur () {
      this.activeInput = -1
      this.isInputFocused = false
    },
    onChanged () {
      this.$nextTick(() => {
        this.$emit('onChanged', this.joinedValue)
      })
    },
  },
}
</script>

<style lang="scss">
div.vue-otp-input {
  width: max-content;
}
div.vue-otp-input > div.otp-wrapper {
  direction: var(--direction);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 0.3s;
}

div.vue-otp-input > div.otp-wrapper > input.otp-input {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 0.3s;
  border-radius: var(--border-radius);
}
div.vue-otp-input > div.otp-wrapper > input.otp-input:disabled {
  background-color: #ececec !important;
}

div.vue-otp-input > div.otp-wrapper > input.defualt-input-separate {
  text-align: center;
  font-weight: 600;
  background-color: transparent;
  border: solid 1px #dadada;
  width: 40px;
  height: 48px;
}

@media only screen and (max-width: 600px) {
  div.vue-otp-input > div.otp-wrapper > input.defualt-input-separate {
    width: 40px;
    height: 48px;
  }
}

div.vue-otp-input > div.defualt-wrapper-separate {
  background: transparent;
}

div.vue-otp-input > div.defualt-wrapper-group {
  border: solid 1px #dadada;
}

div.vue-otp-input > div.otp-wrapper > input.defualt-input-group {
  background-color: transparent;
  font-weight: 600;
  border: none;
  width: 40px;
  height: 48px;
  text-align: center;
}
@media only screen and (max-width: 600px) {
  div.vue-otp-input > div.otp-wrapper > input.defualt-input-group {
    width: 40px;
    height: 40px;
  }
}
div.vue-otp-input > div.otp-wrapper > input.defualt-active-input {
  border: solid 1px #636363;
}

div.vue-otp-input > div.otp-wrapper > input.defualt-error-input-separate {
  text-align: center;
  font-weight: 600;
  background-color: transparent;
  border: solid 1px #eb4d3d;
  width: 40px;
  height: 48px;
  &.defualt-active-input {
    border: solid 1px #fd9c8f;
  }
}

div.vue-otp-input > div.defualt-active-wrapper {
  border: solid 1px #636363;
}

div.vue-otp-input > div.defualt-error-wrapper-group {
  border: solid 1px #eb4d3d;
}

div.vue-otp-input > span.default-error-class {
  display: block;
  color: #eb4d3d;
  margin-top: 4px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 15px;
  letter-spacing: 0.1px;
}
input:focus {
  outline: none;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
