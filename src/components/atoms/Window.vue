<template>
  <div :class="['window_with_tabs', direction]">
    <transition name="fade" mode="out-in">
      <div class="tab_content" :key="activeTab">
        <slot :name="activeTab"></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Window',
  props: {
    activeTab: {
      type: [Number, String],
      default: null,
    },
  },
  data () {
    return {
      direction: 'right',
    }
  },
  watch: {
    activeTab: {
      handler (current, prev) {
        const keys = Object.keys(this.$slots)
        const prevIndex = keys.findIndex((item) => item === prev)
        const currentIndex = keys.findIndex((item) => item === current)
        this.direction = currentIndex > prevIndex ? 'left' : 'right'
      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.window_with_tabs {
  display: flex;
  flex-direction: column;
  max-width: 100%;
  .tab_content {
    display: block;
    width: 100%;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.5s;
  }

  &.right {
    .fade-enter,
    .fade-leave-to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  &.left {
    .fade-enter,
    .fade-leave-to {
      transform: translateX(-100%);
      opacity: 0;
    }
  }
}
</style>
