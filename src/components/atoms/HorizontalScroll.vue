<template>
  <div class="horizontal_scroll" :class="{ wide }">
    <div class="swipe_btn left" @click="onLeft()">
      <slot name="left_button"></slot>
    </div>
    <div
      ref="visibleWrapperBlock"
      class="center_section"
      :class="{ 'no-border': noBorder }"
      @wheel="onWheel"
      @touchstart="startMove"
      @mousedown="startMove"
      @touchmove="(e) => e.preventDefault()"
    >
      <div
        ref="scrolledBlock"
        class="scroll_section"
        :class="{ transition, swiping }"
        :style="{ transform: `translateX( ${left}px)` }"
      >
        <slot />
      </div>
    </div>
    <div class="swipe_btn right" @click="onRight()">
      <slot name="right_button"></slot>
    </div>
  </div>
</template>

<script>
const x = (e) => {
  return e?.pageX || e.touches?.[0]?.pageX || 0
}

export default {
  name: 'HorizontalScroll',
  props: {
    resizeTrigger: {
      type: Boolean,
      default: false,
    },
    autoScrollToRight: {
      type: Boolean,
      default: false,
    },
    wide: {
      type: Boolean,
      default: false,
    },
    centerOnElement: {
      type: String,
      default: null,
    },
    noBorder: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      swiping: false,
      transition: true,
      left: 0,
      visibleWrapperBlockWidth: 0,
      scrolledBlockWidth: 0,
      scrollLimit: 0,
    }
  },
  computed: {},
  watch: {
    resizeTrigger (val) {
      if (val) {
        this.calculateSize()
      }
    },
    centerOnElement (className) {
      this.setCenterToElem(className)
    },
  },
  created () {},
  mounted () {
    this.observer = new MutationObserver(() => {
      this.calculateSize()
    })
    this.observer.observe(this.$refs.scrolledBlock, {
      childList: true,
      subtree: true,
    })
    setTimeout(() => {
      this.calculateSize()
      if (this.centerOnElement) this.setCenterToElem(this.centerOnElement)
    }, 100)
    this.calculateSize()
    window.addEventListener('resize', this.calculateSize)
  },
  unmounted () {
    this.observer.disconnect()
    window.removeEventListener('resize', this.calculateSize)
  },
  methods: {
    calculateSize () {
      this.visibleWrapperBlockWidth = this.$refs.visibleWrapperBlock?.getBoundingClientRect().width || 0
      this.scrolledBlockWidth = this.$refs.scrolledBlock?.getBoundingClientRect().width || 0
      const difference = this.visibleWrapperBlockWidth - this.scrolledBlockWidth
      this.scrollLimit = difference > 0 ? 0 : difference
      if (this.left < this.scrollLimit) this.left = this.scrollLimit
      if (this.previousScrolledBlockWith < this.scrolledBlockWidth && this.autoScrollToRight) this.scrollToRight()
      this.previousScrolledBlockWith = this.scrolledBlockWidth
    },

    scrollToRight () {
      const wrapperRect = this.$refs.scrolledBlock?.getBoundingClientRect() || 0
      this.setLeftWithLimit(-wrapperRect.width)
    },

    setCenterToElem (className) {
      const elem = this.$refs.visibleWrapperBlock?.querySelector('.' + className)
      if (!elem) return
      const wrapperRect = this.$refs.visibleWrapperBlock?.getBoundingClientRect() || 0
      const elemRect = elem.getBoundingClientRect()
      const wrapCenter = wrapperRect.left + wrapperRect.width / 2
      const elemCenter = elemRect.left + elemRect.width / 2
      const left = this.left + (wrapCenter - elemCenter)
      this.setLeftWithLimit(left)
    },

    setLeftWithLimit (left) {
      if (left > 0) {
        this.left = 0
      } else if (left < this.scrollLimit) {
        this.left = this.scrollLimit
      } else this.left = left
    },

    onLeft () {
      const left = this.left + (this.visibleWrapperBlockWidth - 50)
      this.setLeftWithLimit(left)
    },
    onRight () {
      const left = this.left - (this.visibleWrapperBlockWidth - 50)
      this.setLeftWithLimit(left)
    },
    onWheel (event) {
      const left = this.left - event.deltaY
      this.setLeftWithLimit(left)
      event.preventDefault()
    },

    startMove (e) {
      const cursorStart = x(e)

      const move = (event) => {
        if (Math.abs(x(event) - cursorStart) > 5) {
          this.startScroll(e)
          endMove()
        }
      }

      const endMove = () => {
        document.removeEventListener('mousemove', move)
        document.removeEventListener('touchmove', move)
        document.removeEventListener('mouseup', endMove)
        document.removeEventListener('touchend', endMove)
      }

      if (e.pageX) {
        document.addEventListener('mousemove', move)
        document.addEventListener('mouseup', endMove)
      } else {
        document.addEventListener('touchmove', move)
        document.addEventListener('touchend', endMove)
      }
    },

    startScroll (e) {
      this.transition = false
      const cursorStart = x(e)
      const currentLeft = this.left
      const move = (event) => {
        e.preventDefault()
        const distance = cursorStart - x(event)
        let l = currentLeft - distance
        if (distance > 30 || distance < -30) this.swiping = true
        l = l < this.scrollLimit ? this.scrollLimit : l > 0 ? 0 : l
        this.left = l
      }

      const endMove = (e) => {
        e.stopPropagation()
        e.preventDefault()
        this.transition = true
        setTimeout(() => {
          this.swiping = false
        }, 100)
        document.removeEventListener('mousemove', move)
        document.removeEventListener('touchmove', move)
        document.removeEventListener('mouseup', endMove, true)
        document.removeEventListener('touchend', endMove, true)
      }

      if (e.pageX) {
        document.addEventListener('mousemove', move)
        document.addEventListener('mouseup', endMove, true)
      } else {
        document.addEventListener('touchmove', move)
        document.addEventListener('touchend', endMove, true)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.horizontal_scroll {
  display: flex;
  overflow: hidden;
  .swipe_btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .center_section {
    flex: 1;
    position: relative;
    overflow-x: hidden;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    
    &.no-border {
      border-bottom: none;
    }
  }
  .scroll_section {
    width: max-content;
    white-space: nowrap;
    display: flex;
    user-select: none;
    user-drag: none;
    &.transition {
      transition: transform 0.2s cubic-bezier(0, 0.55, 0.45, 1);
    }
    &.swiping {
      pointer-events: none;
    }
  }
  &.wide {
    min-width: 100%;
    .scroll_section {
      min-width: 100%;
    }
  }
}
</style>
