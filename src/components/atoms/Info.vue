<template>
  <div class="info_block" :class="{ yellow, red, blue }">
    <img class="info_icon icon_yellow" src="@/assets/icon_deprecated/info_circle_yellow.svg" alt="info logo" />
    <img class="info_icon icon_red" src="@/assets/icon_deprecated/warn_circle.svg" alt="info logo" />
    <img class="info_icon icon_blue" src="@/assets/icon_deprecated/info_circle_blue.svg" alt="info logo" />
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Info',
  props: {
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
}
</script>

<style lang="scss" scoped>
.info_block {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  border-radius: 8px;
  padding: 8px;
  font-size: 14px;
  line-height: 16px;
  .info_icon {
    display: none;
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
}
</style>
