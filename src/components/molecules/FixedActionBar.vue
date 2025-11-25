<template>
  <div class="fixed-action-bar">
    <div class="fixed-action-bar__buttons">
      <Button
        type="contained"
        color="grey"
        size="m"
        :style="{ width: '200px' }"
        @click="$emit('back')"
      >
        Назад
      </Button>
      <Button
        type="contained"
        color="blue"
        size="m"
        :style="{ width: '200px' }"
        @click="$emit('next')"
      >
        Далее
      </Button>
    </div>
  </div>
</template>

<script>
import Button from '@/components/atoms/Button.vue'

export default {
  name: 'FixedActionBar',
  components: {
    Button
  },
  emits: ['back', 'next']
}
</script>

<style lang="scss" scoped>
.fixed-action-bar {
  position: fixed;
  bottom: 0;
  left: var(--sidebar-width, 286px);
  right: 0;
  background: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 24px;
  z-index: 100;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  @media (max-width: 768px) {
    left: 0;
    padding: 16px;
    height: 72px;
  }
}

.fixed-action-bar__buttons {
  display: flex;
  gap: 16px;
  align-items: center;
  height: 48px;

  @media (max-width: 768px) {
    width: 100%;
    gap: 15px;
    height: auto;
    
    :deep(.rq_button) {
      flex: 1;
      width: auto !important;
      min-height: 40px;
    }
  }
}
</style>

