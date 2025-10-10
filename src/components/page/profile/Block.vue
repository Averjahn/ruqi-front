<template>
  <div class="block" :class="{ attention: heartbeatOn, hovered, shadow }">
    <header v-if="$slots.header" class="block__header">
      <div class="block__title">
        <slot name="title" />
      </div>
    </header>

    <slot />
  </div>
</template>

<script>
export default {
  name: 'Block',
  props: {
    heartbeatOn: {
      type: Boolean,
      default: false,
    },
    hovered: {
      type: Boolean,
      default: false,
    },
    shadow: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.block {
  width: 100%;
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;

  &.attention {
    animation: heartbeat 1.5s ease-in-out infinite both;
  }
  &.shadow {
    box-shadow: 0px 4px 40px 0px #00000014;
  }
  &.hovered {
    cursor: pointer;
    &:hover {
      background: #f2f8ff;
    }
  }
}

.block__header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.block__title {
  font-size: 18px;
  font-weight: 700;
}
@media (max-width: 768px) {
  .block {
    padding: 16px;
  }
}
</style>
