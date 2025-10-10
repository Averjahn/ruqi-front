<template>
  <div
    :class="{
      error: computedError,
      shake,
      updateAnimation,
      silent_validation_error: !silentIsValid,
    }"
    class="input_container"
  >
    <div v-if="label" class="field_label_global">{{ label }}</div>
    <div class="input_section" @click="onClick">
      <slot name="left" />
      <div class="input_wrap">
        <input
          ref="input"
          :value="modelValue || value"
          @input="onInput"
          @change="onChange"
          :type="currentType"
          v-bind="filteredAttrs"
        />
      </div>
      <ButtonIconGhost v-if="isClearIconShow" @click.stop="clear">
        <img class="icon" src="@/assets/icons/cross.svg" />
      </ButtonIconGhost>
      <ButtonIconGhost v-if="type === 'password'" @click="togglePassword">
        <img v-if="currentType === 'text'" class="icon" src="@/assets/icons/eye_close.svg" />
        <img v-if="currentType === 'password'" class="icon" src="@/assets/icons/eye_open.svg" />
      </ButtonIconGhost>
      <slot name="right" />
      <ThinLineLoading class="progress_wrap" :show="loading" />
    </div>
    <FieldMessage :text="errorMessage" />
  </div>
</template>

<script>
import { debounce } from '@/constants/helpers'
import FieldMessage from '@/components/atoms/FieldMessage.vue'
import ThinLineLoading from '@/components/atoms/loaders/ThinLineLoading.vue'

export default {
  name: 'Input',
  components: { FieldMessage, ThinLineLoading },
  inject: {
    checkValid: {
      default: false,
    },
  },
  props: {
    modelValue: [String, Number],
    value: [String, Number],
    label: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: 'text',
    },
    disableValidation: {
      type: Boolean,
      default: false,
    },
    validationType: {
      type: String, // input, change
      default: 'change',
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
    errorText: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: null,
    },
  },
  data () {
    return {
      currentType: this.type,
      shake: false,
      isValid: true,
      updateAnimation: false,
      silentIsValid: true,
      errorMessage: null,
    }
  },
  watch: {
    value () {
      this.silentValidate()
    },
    modelValue () {
      this.silentValidate()
    },
    error (val) {
      if (val) this.shakeIt()
    },
    checkValid (val) {
      if (val) this.validate()
    },
    errorText (val) {
      if (val) {
        this.errorMessage = val
        this.shakeIt()
      }
    },
  },
  mounted () {
    this.silentValidate()
  },
  computed: {
    filteredAttrs () {
      const { class: className, style, ...attrs } = this.$attrs
      return attrs
    },
    computedError () {
      return this.error || !this.isValid || this.errorMessage
    },
    isClearIconShow () {
      return this.clearable && (this.value?.length > 0 || this.modelValue?.length > 0)
    },
  },
  methods: {
    onInput (e) {
      this.$emit('update:modelValue', e.target.value)
      if (this.validationType === 'input') debounce(this.validate, 50)()
      if (this.validationType === 'change') this.resetError()
    },
    clear () {
      const e = {
        target: {
          value: '',
          selectionEnd: 0,
        },
      }
      this.$refs.input.focus()
      this.$emit('input', e)
      this.onChange(e)
    },
    onChange (e) {
      this.$emit('change', e)
      this.$emit('update:modelValue', e.target.value)
      this.afterChange()
    },
    afterChange () {
      if (this.validationType === 'change') setTimeout(this.validate, 50)
    },
    shakeIt () {
      this.shake = true
      setTimeout(() => {
        this.shake = false
      }, 260)
    },
    showUpdateAnimation () {
      this.updateAnimation = true
      setTimeout(() => {
        this.updateAnimation = false
      }, 260)
    },
    onClick () {
      this.$refs.input.focus()
      this.$emit('onClick')
    },
    togglePassword () {
      this.currentType = this.currentType === 'password' ? 'text' : 'password'
    },
    resetError () {
      this.isValid = true
      this.errorMessage = null
    },
    validate () {
      if (this.rules && !this.disableValidation) {
        const value = this.modelValue || this.value
        for (let i = 0; i < this.rules.length; i++) {
          const res = this.rules[i](value)
          if (res !== true) {
            this.shakeIt()
            this.isValid = false
            this.errorMessage = res
            return
          }
        }
        this.resetError()
      }
    },
    silentValidate () {
      this.$nextTick(() => {
        if (this.rules) {
          const value = this.modelValue || this.value
          for (let i = 0; i < this.rules.length; i++) {
            if (this.rules[i](value) !== true) {
              this.silentIsValid = false
              return
            }
          }
          this.silentIsValid = true
        }
      })
    },
  },
}
</script>

<style lang="scss">
.input_container {
  input {
    font-size: 16px;
  }
  .progress_wrap {
    position: absolute;
    width: 100%;
    height: 3px;
    left: 0;
    bottom: 0;
  }
  &.error {
    .input_section {
      border: 1px solid #d11803;
      background-color: #fff6f5;
    }
  }
  &.shake {
    animation: vertical-shaking 2s 1 ease-out;
  }
  &.updateAnimation {
    .input_section {
      animation: onset 260ms 1 ease-in-out;
    }
  }
  .icon {
    width: 20px;
    min-width: 20px;
    height: 20px;
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
    .input_wrap {
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
      .loader_dots {
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        margin-top: 4px;
      }
    }
    &:focus-within {
      border: 1.5px solid #1735f5;
    }
    input {
      display: inline-block;
      width: 100%;
      height: 100%;
      background: none;
      padding: 0;
      color: #263043;
      box-sizing: border-box;
      border: none;
    }
    ::placeholder {
      color: #707070;
    }
  }
}
</style>
