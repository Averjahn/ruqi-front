<template>
  <div class="info_block" :class="{ yellow, red, blue }">
    <template v-if="!hideIcon">
      <img class="info_icon icon_yellow" src="@/assets/icon_deprecated/info_circle_yellow.svg" alt="info logo" />
      <img class="info_icon icon_red" src="@/assets/icon_deprecated/warn_circle_thin.svg" alt="info logo" />
      <img class="info_icon icon_blue" src="@/assets/icon_deprecated/info_circle_blue.svg" alt="info logo" />
    </template>
    <div v-if="showHeader" class="header">
      <slot name="header" class="header"></slot>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'InfoV2',
  props: {
    hideIcon: {
      type: Boolean,
      default: false,
    },
    yellow: {
      type: Boolean,
      default: false,
    },
    red: {
      type: Boolean,
      default: false,
    },
    blue: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    showHeader () {
      return !!this.$slots.header
    },
  },
}
</script>

<style lang="scss" scoped>
.info_block {
  border-radius: 8px;
  padding: 24px;
  font-size: 14px;
  line-height: 22px;
  color: #666666;
  .info_icon {
    width: 48px;
    height: 48px;
    margin-bottom: 12px;
    display: none;
  }
  .header {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
    line-height: 30px;
    color: #263043;
  }
  &.yellow {
    background-color: #fffcf0;
    .icon_yellow {
      display: block;
    }
  }
  &.red {
    background-color: #fff6f5;
    .icon_red {
      display: block;
    }
  }
  &.blue {
    background-color: #f3faff;
    .icon_blue {
      display: block;
    }
  }
  img {
    margin: 2px 0 0 2px;
  }
  @media (max-width: 769px) {
    .header {
      font-size: 18px;
    }
  }
}
</style>
