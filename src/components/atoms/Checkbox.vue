<template>
  <label class="checkbox">
    <input type="checkbox" :checked="checked" @change="handleChange" />
    <slot />
  </label>
</template>

<script>
export default {
  name: 'Checkbox',
  emits: ['update:modelValue'],
  props: {
    modelValue: [Array, Boolean],
    value: [String, Number, Boolean],
  },
  computed: {
    checked () {
      return Array.isArray(this.modelValue) ? this.modelValue.includes(this.value) : this.modelValue
    },
  },
  methods: {
    handleChange () {
      if (Array.isArray(this.modelValue)) {
        let value
        if (this.checked) {
          value = this.modelValue.filter((item) => item !== this.value)
        } else {
          value = [...this.modelValue]
          value.push(this.value)
        }
        this.$emit('update:modelValue', value)
      } else {
        this.$emit('update:modelValue', !this.checked)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}
</style>
