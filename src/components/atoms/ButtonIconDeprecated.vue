<template>
  <div
    class="button_icon_deprecated"
    :class="[type, { loading, disabled }]"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <div class="spinner_wrap">
      <Spinner class="spinner" />
    </div>
    <div class="slot_wrapper">
      <slot />
    </div>
  </div>
</template>

<script>
import Spinner from '@/components/atoms/loaders/Spinner.vue'

export default {
  name: 'ButtonIconDeprecated',
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
    type: {
      type: String,
      default: 'default', // 'outlined'
    },
    size: {
      type: Number,
      default: 32,
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
.button_icon_deprecated {
  position: relative;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  color: #666666;
  transition: all 200ms ease-in-out;
  &.outlined {
    border-radius: 8px;
    border: 1px solid #dadada;
    &:hover {
      border-color: #bebebe;
    }
  }
  &:hover {
    background-color: #f3f3f3;
    color: #000000;
  }
  .slot_wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .spinner_wrap {
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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
    &:hover {
      background-color: initial;
      color: #666666;
    }
  }
}
</style>
