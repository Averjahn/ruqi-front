<template>
  <div class="button_icon" :class="[size, { loading, disabled }]">
    <div class="spinner_wrap">
      <Spinner class="spinner" />
    </div>
    <div class="slot_wrapper" :class="[type, { disabled }]">
      <slot />
    </div>
  </div>
</template>

<script>
import Spinner from '@/components/atoms/loaders/Spinner.vue'

export default {
  name: 'ButtonIcon',
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
      default: 'contained', // outlined
    },
    size: {
      type: String,
      default: 'm', // s | m | l | xl
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
.button_icon {
  position: relative;
  &.s {
    width: 32px;
    min-width: 32px;
    max-width: 32px;
    height: 32px;
    min-height: 32px;
    .slot_wrapper img {
      width: 20px;
      height: 20px;
    }
  }
  &.m {
    width: 40px;
    min-width: 40px;
    max-width: 40px;
    height: 40px;
    min-height: 40px;
    .slot_wrapper img {
      width: 24px;
      height: 24px;
    }
  }
  &.l {
    width: 48px;
    min-width: 48px;
    max-width: 48px;
    height: 48px;
    min-height: 48px;
    .slot_wrapper img {
      width: 24px;
      height: 24px;
    }
  }

  .slot_wrapper {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;

    &.contained {
      background-color: #1735f5;
      @media (hover: hover) {
        &:not(.disabled):hover {
          background-color: #4e64f2;
        }
      }
      &:not(.disabled):focus {
        box-shadow: inset 0 0 0 2px #4db5ff;
      }
      &:not(.disabled):active {
        background-color: #263588;
      }
    }

    &.outlined {
      box-shadow: inset 0 0 0 1.5px #0000001a;
      @media (hover: hover) {
        &:not(.disabled):hover {
          box-shadow: inset 0 0 0 1.5px #dadada;
        }
      }
      &:not(.disabled):focus {
        box-shadow: inset 0 0 0 2px #4db5ff;
      }
      &:not(.disabled):active {
        box-shadow: inset 0 0 0 1.5px #666666;
      }
    }
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
    .slot_wrapper {
      cursor: default;
      opacity: 0.3;
    }
  }
}
</style>
