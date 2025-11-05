<template>
  <div class="form-field">
    <div v-if="label" class="form-field__label">{{ label }}</div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'FormField',
  props: {
    label: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
.form-field {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-field__label {
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #666666;
}
</style>


