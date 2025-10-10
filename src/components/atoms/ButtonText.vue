<template>
  <div class="button_text" :class="[color, size, { disabled }]">
    <div class="slot" :class="{ loading }">
      <slot />
    </div>
    <DotsFlowLoader v-if="loading" class="loading_bar" :radius="8" />
  </div>
</template>

<script>
import DotsFlowLoader from '@/components/atoms/loaders/DotsFlowLoader.vue'

export default {
  name: 'ButtonText',
  components: { DotsFlowLoader },
  props: {
    color: {
      type: String,
      default: 'blue', // 'green' 'grey' 'telegram' 'white'
    },
    size: {
      type: String,
      default: 'm', // s | m | l
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      list: null,
    }
  },
  computed: {},
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    open () {},
  },
}
</script>

<style lang="scss" scoped>
.button_text {
  position: relative;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 400;
  transition: all 200ms ease-in-out;
  user-select: none;
  line-height: 0;
  &.s {
    font-size: 14px;
    .slot {
      letter-spacing: 0.1px;
      line-height: 22px;
      gap: 8px;
    }
  }
  &.m {
    font-size: 16px;
    .slot {
      line-height: 22px;
      gap: 8px;
    }
  }
  &.l {
    font-size: 18px;
    .slot {
      line-height: 26px;
      gap: 8px;
    }
  }
  &.blue {
    color: #1735f5;
    &:hover {
      color: #4e64f2;
    }
    &:active {
      background: #f2f8ff;
    }
  }
  &.green {
    color: #34ab35;
    &:hover {
      color: #1f8821;
    }
  }
  &.grey {
    color: #666666;
    &:hover {
      color: #414141;
    }
  }
  &.white {
    color: #ffffff;
    &:hover {
      color: #f5f5f5;
    }
  }
  &.telegram {
    color: #25a3e0;
    &:hover {
      color: #1b8cc5;
    }
  }
  &.red {
    color: #eb4d3d;
    &:hover {
      color: #d41212
    };
    // --activeColor: #a90e0e;
    // --textColor: #ffffff;
  }
  &.disabled {
    opacity: 0.4;
    cursor: default;
    transition: all 1ms ease-in-out;
  }
  .loading_bar {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -4px 0 0 -25px;
  }
  .slot {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    &.loading {
      visibility: hidden;
    }
  }
}
</style>
