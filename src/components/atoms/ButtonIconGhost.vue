<template>
  <div class="button_icon" :class="[size, { loading, disabled }]">
    <div class="spinner_wrap">
      <Spinner class="spinner" />
    </div>
    <div class="substrate" :class="[color]"></div>
    <div class="slot_wrapper" :class="{ disabled }">
      <slot />
    </div>
  </div>
</template>

<script>
import Spinner from '@/components/atoms/loaders/Spinner.vue'

export default {
  name: 'ButtonIconGhost',
  components: { Spinner },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 's', // s | m
    },
    color: {
      type: String,
      default: 'regular', // transparent
    },
  },
  data () {
    return {}
  },
  computed: {},
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.button_icon {
  position: relative;
  display: inline-block;
  height: min-content;
  cursor: pointer;
  &:not(.disabled):hover {
    .substrate {
      opacity: 1;
    }
  }
  &:not(.disabled):focus {
    .substrate {
      box-shadow: inset 0 0 0 2px #4db5ff;
    }
  }
  &:not(.disabled):active {
    .substrate {
      &.regular {
        background: #e6f2ff;
      }
      &.transparent {
        background: #ffffff42;
      }
    }
  }
  .substrate {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #f2f8ff;
    border-radius: 50%;
    z-index: 0;
    cursor: pointer;
    transition:
      top 200ms ease-in-out,
      left 200ms ease-in-out,
      bottom 200ms ease-in-out,
      right 200ms ease-in-out,
      background 40ms ease-in-out;
    &.regular {
      background: #f2f8ff;
    }
    &.transparent {
      background: #ffffff34;
    }
  }
  &.s {
    &:not(.disabled):hover {
      .substrate {
        top: -6px;
        left: -6px;
        bottom: -6px;
        right: -6px;
      }
    }
  }
  &.m {
    &:not(.disabled):hover {
      .substrate {
        top: -8px;
        left: -8px;
        bottom: -8px;
        right: -8px;
      }
    }
  }

  .slot_wrapper {
    position: relative;
    z-index: 1;
    line-height: 0;
  }
  .spinner_wrap {
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
  }
  .spinner {
    width: 20px;
    height: 20px;
    border: 3px solid #1735f5;
  }
  &.loading {
    .slot_wrapper {
      opacity: 0.3;
    }
    .spinner_wrap {
      display: block;
    }
  }
  &.disabled {
    cursor: default;
    .slot_wrapper {
      opacity: 0.3;
    }
  }
}
</style>
