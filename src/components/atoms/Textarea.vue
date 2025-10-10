<template>
  <div
    :class="{
      error: computedError,
      shake,
      silent_validation_error: !silentIsValid,
    }"
    class="area_container"
  >
    <div v-if="label" class="field_label_global">{{ label }}</div>
    <div class="input_section" :style="{ minHeight: height }">
      <div v-if="$slots.left" class="left_icon">
        <slot name="left" />
      </div>
      <div class="input_wrap">
        <textarea
          ref="textarea"
          rows="1"
          v-bind="filteredAttrs"
          :value="modelValue || value"
          :style="{ height: innerHeight, maxHeight }"
          :type="currentType"
          @input="input"
          @change="change"
          @blur="blur"
        />
      </div>
      <div v-if="isClearIconShow || $slots.right" class="right_icon">
        <slot name="right" />
        <ButtonIconDeprecated v-if="isClearIconShow" @click="clear" :size="20">
          <img class="clear_icon" src="@/assets/icon_deprecated/cross.svg" />
        </ButtonIconDeprecated>
      </div>
    </div>

    <FieldMessage :text="errorMessage" />
  </div>
</template>

<script>
import { debounce } from '@/constants/helpers'
import FieldMessage from '@/components/atoms/FieldMessage.vue'

export default {
  name: 'Textarea',
  components: { FieldMessage },
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
      type: String, // input, blur
      default: 'blur',
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: null,
    },
    maxHeight: {
      type: String,
      default: 'auto',
    },
    autoHeight: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      default: '120px',
    },
  },
  data () {
    return {
      currentType: this.type,
      shake: false,
      isValid: true,
      innerHeight: '100%',
      silentIsValid: true,
      errorMessage: null,
    }
  },
  watch: {
    error (val) {
      if (val) {
        this.shakeIt()
      }
    },
    modelValue () {
      this.silentValidate()
      if (this.validationType === 'input') debounce(this.validate, 50)()
      this.$nextTick(this.calculateHeight)
    },
    value () {
      this.silentValidate()
      if (this.validationType === 'input') debounce(this.validate, 50)()
      this.$nextTick(this.calculateHeight)
    },
    checkValid (val) {
      if (val) this.validate()
    },
  },
  mounted () {
    this.silentValidate()
  },
  computed: {
    filteredAttrs () {
      // eslint-disable-next-line no-unused-vars
      const { class: className, style, ...attrs } = this.$attrs
      return attrs
    },
    computedError () {
      return this.error || !this.isValid
    },
    isClearIconShow () {
      return this.clearable && (this.value?.length > 0 || this.modelValue?.length > 0)
    },
  },
  methods: {
    calculateHeight () {
      if (!this.autoHeight) return
      this.$refs.textarea.style.height = 'auto'
      this.$refs.textarea.style.height = `${this.$refs.textarea.scrollHeight}px`
    },
    input (e) {
      this.$emit('update:modelValue', e.target.value)
      this.$emit('input', e)
      if (this.validationType === 'blur') this.clearValidation()
    },
    clear () {
      this.$emit('update:modelValue', '')
      this.$emit('input', {
        target: {
          value: '',
          selectionEnd: 0,
        },
      })
    },
    change (e) {
      this.$emit('change', e)
    },
    blur () {
      setTimeout(() => {
        if (this.validationType === 'blur') this.validate()
      }, 50)
    },
    shakeIt () {
      this.shake = true
      setTimeout(() => {
        this.shake = false
      }, 260)
    },
    togglePassword () {
      this.currentType = this.currentType === 'password' ? 'text' : 'password'
    },
    clearValidation () {
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
        this.clearValidation()
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
.area_container {
  &.error {
    .input_section {
      border-color: #fff6f5;
      background-color: #fff6f5;
    }
  }
  &.shake {
    animation: vertical-shaking 2s 1 ease-out;
  }
  .input_section {
    display: flex;
    gap: 8px;
    height: inherit;
    box-sizing: border-box;
    border: 1px solid #dadada;
    background-color: white;
    border-radius: 4px;
    overflow: hidden;
    padding: 8px 12px;
    .input_wrap {
      flex: 1;
      display: flex;
      align-items: center;
    }
    textarea {
      padding: 0;
      display: inline-block;
      width: 100%;
      height: 100%;
      background: none;
      color: black;
      box-sizing: border-box;
      border: none;
    }
    ::placeholder {
      font-weight: 400;
      color: #a8acb4;
    }
    .left_icon,
    .right_icon {
      display: flex;
      align-items: flex-end;
    }
  }
  .clear_icon {
    width: 18px;
    min-width: 18px;
    height: 18px;
  }
}
</style>
