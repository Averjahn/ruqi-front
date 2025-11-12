<template>
  <HorizontalScroll :centerOnElement="centerOnElement" :wide="wide" :no-border="type === 'contained'">
    <div class="tabs_container" :class="[type, { wide, disabled }]">
      <div
        v-for="tab in tabs"
        :key="tab[itemValue]"
        class="tab"
        :class="{ active: tab[itemValue] === currentValue, disabled }"
        @mouseup="onChange(tab[itemValue])"
      >
        {{ tab[itemText] }}
        <div v-if="necessaryCounter || counter[tab[itemValue]] > 0" class="counter">
          {{ counter[tab[itemValue]] || 0 }}
        </div>
      </div>
    </div>
  </HorizontalScroll>
</template>

<script>
import HorizontalScroll from '@/components/atoms/HorizontalScroll.vue'

export default {
  name: 'Tabs',
  components: {
    HorizontalScroll,
  },
  props: {
    modelValue: {
      type: String,
      default: null,
    },
    value: {
      type: String,
      default: '',
    },
    tabs: {
      type: Array,
      default: () => [],
    },
    wide: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'rounded', // contained | chip | flat | underlined
    },
    counter: {
      type: Object,
      default: () => ({}),
    },
    itemValue: {
      type: String,
      default: 'value',
    },
    itemText: {
      type: String,
      default: 'text',
    },
    necessaryCounter: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      centerOnElement: null,
    }
  },
  computed: {
    currentValue () {
      return this.modelValue || this.value
    },
  },
  watch: {
    currentValue () {
      this.$nextTick(() => {
        this.centerOnElement = null
        this.$nextTick(() => {
          this.centerOnElement = 'active'
        })
      })
    },
  },
  methods: {
    onChange (value) {
      if (this.disabled) return
      this.$emit('update:modelValue', value)
      this.$emit('change', value)
    },
  },
}
</script>

<style lang="scss" scoped>
.tabs_container {
  width: max-content;
  display: inline-flex;

  &.disabled {
    .tab {
      cursor: default;
      opacity: 0.6;
    }
  }

  &.wide {
    width: 100%;
    .tab {
      justify-content: center;
    }
  }

  .tab {
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 4px;
    height: 100%;
  }

  &.chip {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 40px;
    .tab {
      padding: 8px 24px;
      border-radius: 24px;
      font-weight: 600;
      line-height: 24px;
      border: 1px solid #0000001a;
      transition: all 200ms ease-in-out;
      &:not(.disabled):hover {
        background: #f9f9f9;
      }
    }
    .active {
      background: #f3f3f3;
      border: 1px solid #f3f3f3;
      &:not(.disabled):hover {
        background: #eeeeee;
      }
    }
    .counter {
      font-size: 14px;
      color: #666666;
      line-height: 24px;
    }
  }

  &.rounded {
    border-radius: 40px;
    font-weight: 600;
    border: 1px solid #dadada;
    height: 48px;
    .tab {
      padding: 0px 24px;
      border-radius: 40px;
    }
    .active {
      color: #0082de;
      border: 1px solid #0082de;
      padding: 0 23px;
    }
    @media (max-width: 1000px) {
      .tab {
        padding: 0px 12px;
        font-size: 14px;
      }
      .active {
        padding: 0 13px;
      }
    }
  }

  &.contained {
    border-radius: 8px;
    background-color: #f3f3f3;
    height: 40px;
    padding: 2px;
    gap: 2px;
    .tab {
      flex: 1;
      height: 36px;
      padding: 0px 24px;
      text-align: center;
      border-radius: 8px;
      transition: all 200ms ease-in-out;
      &:not(.disabled):hover {
        background: #f9f9f9;
      }
    }
    .active {
      font-weight: 600;
      background-color: white;
      &:not(.disabled):hover {
        background: #fbfcff;
      }
      box-shadow:
        0px 8px 48px 4px #0234e30a,
        0px 0px 10px 0px #1735f508;
    }
  }

  &.flat {
    display: flex;
    align-items: center;
    user-select: none;
    gap: 24px;
    .tab {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      border-bottom: 2px solid transparent;
      color: #666666;
      padding: 12px 0 10px 0;
      position: relative;
      transition: all 200ms ease-in-out;
      &:not(.disabled):hover {
        border-bottom: 2px solid #b6c0ff;
      }
    }
    .active {
      border-bottom: 2px solid #1735f5;
      color: #263043;
      &:not(.disabled):hover {
        border-bottom: 2px solid #0722d5;
      }
    }
    .counter {
      display: block;
      font-size: 10px;
      color: white;
      background-color: #1735f5;
      border-radius: 16px;
      padding: 4px 9px 1px 9px;
      line-height: 12px;
    }
    @media (max-width: 1000px) {
      gap: 12px;
      .tab {
        font-size: 14px;
        padding: 8px 0 6px 0;
      }
    }
  }

  &.underlined {
    display: flex;
    align-items: flex-start;
    gap: 24px;
    .tab {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 0;
      border-bottom: 2px solid transparent;
      font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
      font-size: 18px;
      font-weight: 400;
      line-height: 24px;
      color: #666666;
      transition: all 200ms ease-in-out;
      cursor: pointer;
      &:not(.disabled):hover {
        color: #263043;
      }
    }
    .active {
      border-bottom: 2px solid #1735F5;
      color: #263043;
      font-weight: 600;
      line-height: 24px;
      &:not(.disabled):hover {
        border-bottom: 2px solid #1735F5;
      }
    }
    .counter {
      display: block;
      font-size: 10px;
      color: white;
      background-color: #1735f5;
      border-radius: 16px;
      padding: 4px 9px 1px 9px;
      line-height: 12px;
    }
  }
}
</style>
