<template>
  <div
    :class="['reveal_container', { mobileOnly, onlySlot }]"
    :style="{ '--reveal-height': height, '--reveal-mobile-height': mobileHeight || height }"
  >
    <div :class="['body', { open }]">
      <div ref="contentWrap" class="content_wrap">
        <div ref="slotWrap">
          <slot />
        </div>
      </div>
    </div>
    <div class="button_container">
      <ButtonText @click="toggle">{{ open ? 'Скрыть' : 'Показать ещё' }}</ButtonText>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Reveal',
  components: {},
  props: {
    height: { type: String },
    mobileHeight: { type: String },
    mobileOnly: { type: Boolean, default: false },
  },
  data () {
    return {
      open: false,
      onlySlot: false,
    }
  },
  computed: {},
  async mounted () {
    window.addEventListener('resize', this.onResize)
    this.onResize()
  },
  unmounted () {
    window.removeEventListener('resize', this.onResize)
  },
  watch: {},
  methods: {
    onResize () {
      const contentHeight = this.$refs.contentWrap?.getBoundingClientRect()?.height
      const slotHeight = this.$refs.slotWrap?.getBoundingClientRect()?.height
      this.onlySlot = this.$refs.contentWrap && contentHeight > slotHeight
    },
    toggle () {
      this.open = !this.open
    },
  },
}
</script>

<style lang="scss" scoped>
.reveal_container {
  .body {
    overflow: hidden;
    display: grid;
    grid-template-rows: 0fr;
    transition: all 400ms ease-out;
    &.open {
      grid-template-rows: 1fr;
    }
  }
  .content_wrap {
    min-height: var(--reveal-height);
  }
  .button_container {
    padding-top: 24px;
    text-align: center;
  }
  &.onlySlot {
    .body {
      display: contents;
    }
    .button_container {
      display: none;
    }
  }
  @media (max-width: 1000px) {
    .content_wrap {
      min-height: var(--reveal-mobile-height);
    }
  }
  @media (min-width: 1001px) {
    &.mobileOnly {
      .body,
      .content_wrap {
        display: contents;
      }
      .button_container {
        display: none;
      }
    }
  }
}
</style>
