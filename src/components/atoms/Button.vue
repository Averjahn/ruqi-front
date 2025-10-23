<template>
  <div
    class="rq_button"
    :class="[type, size, color, { disabled, inline, loading }]"
    :style="{ background }"
    v-bind="$attrs"
  >
    <div class="slot nowrap" :style="{ gap, fontSize, nowrap }"><slot /></div>
    <DotsFlowLoader v-if="loading" class="loading_bar" :radius="8" />
  </div>
</template>

<script>
import DotsFlowLoader from '@/components/atoms/loaders/DotsFlowLoader.vue'

export default {
  name: 'Button',
  components: { DotsFlowLoader },
  props: {
    type: {
      type: String,
      default: 'contained', // outlined | shadow
    },
    size: {
      type: String,
      default: 'm', // s, m, l
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'blue', // red | grey | white | darkBlue
    },
    background: {
      type: String,
      default: null,
    },
    gap: {
      type: String,
      default: null,
    },
    fontSize: {
      type: String,
      default: null,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    nowrap: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.rq_button {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  text-align: center;
  border: none;
  cursor: pointer;
  color: white;
  min-height: 48px;
  border-radius: 8px;
  transition: all 0.1s ease-in 0s;
  user-select: none;
  box-sizing: border-box;

  .slot {
    display: flex;
    align-items: center;
    gap: 8px;
    &.nowrap {
      white-space: nowrap;
    }
  }
  .loading_bar {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -4px 0 0 -25px;
  }

  &.blue {
    --mainColor: #1735f5;
    --secondaryColor: #4e64f2;
    --activeColor: #263588;
    --textColor: #ffffff;
  }

  &.darkBlue {
    --mainColor: #03123a;
    --secondaryColor: #0b205b;
    --activeColor: #01091f;
    --textColor: #ffffff;
  }

  &.red {
    --mainColor: #eb4d3d;
    --secondaryColor: #d41212;
    --activeColor: #a90e0e;
    --textColor: #ffffff;
  }

  &.grey {
    --mainColor: #f3f3f3;
    --secondaryColor: #dadada;
    --activeColor: #bebebe;
    --textColor: #263043;
  }

  &.white {
    --mainColor: #ffffff;
    --secondaryColor: #f8f9ff;
    --activeColor: #f3f4ff;
    --textColor: #263043;
  }

  &.disabled {
    cursor: default;
    pointer-events: none;
    opacity: 0.3;
  }
  &.loading .slot {
    visibility: hidden;
  }
  &.inline {
    display: inline-flex;
  }

  &.contained {
    background-color: var(--mainColor);
    color: var(--textColor);
    @media (hover: hover) {
      &:not(.disabled):hover {
        background-color: var(--secondaryColor);
      }
    }
    &:not(.disabled):active {
      background-color: var(--activeColor);
    }
  }

  &.outlined {
    box-shadow: inset 0 0 0 1.5px var(--mainColor);
    color: var(--mainColor);
    @media (hover: hover) {
      &:not(.disabled):hover {
        box-shadow: inset 0 0 0 1.5px var(--secondaryColor);
        color: var(--secondaryColor);
      }
    }
    &:not(.disabled):active {
      box-shadow: inset 0 0 0 1.5px var(--activeColor);
      color: var(--activeColor);
    }
    &.grey {
      background-color: var(--mainColor);
      box-shadow: inset 0 0 0 1.5px #1735f5;;
      color: #1735f5;
    }
  }

  &.shadow {
    background-color: var(--mainColor);
    color: var(--textColor);
    box-shadow: 0px 2px 4px 0px #0000003d;
    @media (hover: hover) {
      &:not(.disabled):hover {
        background-color: var(--secondaryColor);
      }
    }
    &:not(.disabled):active {
      background-color: var(--mainColor);
      box-shadow: none;
    }
  }
  &.sTall {
    padding: 8px 12px;
    min-height: 48px;
    font-weight: 500;
    font-size: 14px;
    line-height: 14px;
    .slot {
      gap: 4px;
    }
  }
  &.s {
    padding: 8px 12px;
    min-height: 32px;
    font-weight: 500;
    font-size: 14px;
    line-height: 14px;
  }
  &.m {
    padding: 8px 16px;
    min-height: 40px;
    font-size: 14px;
    line-height: 22px;
    font-weight: 500;
  }
  &.l {
    padding: 12px 24px;
    min-height: 48px;
    line-height: 24px;
    font-size: 18px;
    font-weight: 600;
  }
}
</style>
