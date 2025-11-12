<template>
  <div :class="['base-modal', `base-modal--${variant}`]">
    <ModalHeader 
      :title="title"
      @close="$emit('close')"
    />
    <ModalContent :variant="contentVariant">
      <slot />
    </ModalContent>
    <div v-if="$slots.actions" class="base-modal__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script>
import ModalHeader from '@/components/molecules/ModalHeader.vue'
import ModalContent from '@/components/molecules/ModalContent.vue'

export default {
  name: 'BaseModal',
  components: {
    ModalHeader,
    ModalContent
  },
  props: {
    title: {
      type: String,
      required: true
    },
    variant: {
      type: String,
      default: 'default', // 'default' | 'compact'
      validator: (value) => ['default', 'compact'].includes(value)
    },
    contentVariant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'compact'].includes(value)
    }
  },
  emits: ['close']
}
</script>

<style lang="scss" scoped>
.base-modal {
  position: relative;
  background: #ffffff;
  border: 1px solid #dadada;
  border-radius: 14px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 359px;
  max-width: 800px;
  width: 100%;
  box-sizing: border-box;
  margin: auto;

  &--compact {
    padding: 24px;
    gap: 16px;
  }

  @media (max-width: 768px) {
    padding: 24px 16px;
    min-width: auto;
    max-width: calc(100vw - 32px);
    border-radius: 16px;
  }
}

.base-modal__actions {
  display: flex;
  gap: 16px;
  align-items: center;

  :deep(.rq_button) {
    flex: 1;
  }

  @media (max-width: 768px) {
    flex-direction: column;

    :deep(.rq_button) {
      width: 100%;
    }
  }
}
</style>

