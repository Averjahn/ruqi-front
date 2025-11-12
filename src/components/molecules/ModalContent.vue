<template>
  <div :class="['modal-content', `modal-content--${variant}`]">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'ModalContent',
  props: {
    variant: {
      type: String,
      default: 'default', // 'default' | 'compact'
      validator: (value) => ['default', 'compact'].includes(value)
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  
  &--default {
    gap: 24px;
  }
  
  &--compact {
    gap: 16px;
  }
}
</style>

