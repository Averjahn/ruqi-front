<template>
  <div ref="button" class="menu_slot_container" @click="onOpen" @mouseover="mouseover" @mouseout="mouseout">
    <slot name="activator" />
  </div>
  <div ref="measuringBlock" class="measuring_block">
    <slot />
  </div>
  <Teleport to="body">
    <div ref="menuWrap" class="menu_wrap" :class="{ isOpen, isClose: !isOpen, isMenuVisible }">
      <div ref="menu" class="menu" @mouseover="mouseover" @mouseout="mouseout">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script>
import { getScrollableParent } from '@/constants/helpers'

export default {
  name: 'Menu',
  props: {
    modelValue: {
      type: Boolean,
      default: null,
    },
    horizontalAlign: {
      type: String, // left, leftBorder, center, rightBorder, right
      default: 'rightBorder',
    },
    verticalAlign: {
      type: String, // top, topBorder, center, bottomBorder, bottom
      default: 'bottom',
    },
    widthAlign: {
      type: String, // button
      default: 'children',
    },
    openMode: {
      type: String, // innerControl | hover
      default: 'click',
    },
    offsetX: {
      type: Number,
      default: 0,
    },
    offsetY: {
      type: Number,
      default: 0,
    },
    position: {
      type: String,
      default: 'absolute',
    },
    zIndex: {
      type: Number,
      default: 100,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    delay: {
      type: Number,
      default: 0,
    },
  },
  data () {
    return {
      menu: null,
      value: false,
      isMenuVisible: null,
      parentNode: null,
      childrenWidth: null,
      closeTimer: null,
    }
  },
  computed: {
    isOpen: {
      get () {
        return this.modelValue !== null ? this.modelValue : this.value
      },
      set (val) {
        this.$emit('update:modelValue', val)
        this.value = val
      },
    },
  },
  mounted () {
    this.button = this.$refs.button
    if (this.isOpen) this.openMenu()
  },
  unmounted () {
    if (this.closeTimer) clearTimeout(this.closeTimer)
  },
  updated () {
    this.updatePosition()
  },
  beforeUnmount () {
    this.closeMenu()
  },
  watch: {
    isOpen (val) {
      val ? this.openMenu() : this.closeMenu()
    },
  },
  methods: {
    onOpen () {
      if (this.openMode !== 'click') return
      this.isOpen = !this.isOpen
    },

    mouseover () {
      if (this.openMode !== 'hover') return
      this.open()
    },

    mouseout () {
      if (this.openMode !== 'hover') return
      this.close()
    },

    open () {
      if (this.closeTimer) clearTimeout(this.closeTimer)
      this.isOpen = true
    },

    close () {
      this.closeTimer = setTimeout(() => {
        this.isOpen = false
      }, this.delay)
    },

    calculatePosition () {
      const menu = this.$refs.menu
      const menuSize = this.$refs.menu.getBoundingClientRect()
      const buttonSize = this.button.getBoundingClientRect()
      const windowWidth = document.documentElement.clientWidth
      const offsetY = +this.offsetY
      const offsetX = +this.offsetX
      this.childrenWidth = this.$refs.measuringBlock?.getBoundingClientRect()?.width
      switch (this.verticalAlign) {
        case 'bottom':
          menu.style.bottom = 'auto'
          menu.style.top = buttonSize.bottom + offsetY + 'px'
          break
      }
      switch (this.widthAlign) {
        case 'button':
          menu.style.width = buttonSize.width + 'px'
          break
      }
      switch (this.horizontalAlign) {
        case 'center':
          menu.style.left = buttonSize.left + buttonSize.width / 2 + offsetX - menuSize.width / 2 + 'px'
          break
        case 'leftBorder':
          menu.style.left = buttonSize.left + offsetX + 'px'
          break
        case 'rightBorder':
          let right = windowWidth - buttonSize.right + offsetX
          const maxRight = windowWidth - this.childrenWidth - 10
          menu.style.right = right > maxRight ? maxRight + 'px' : right + 'px'
          menu.style.left = 'auto'
          break
      }
      menu.style.position = this.position
      this.$refs.menuWrap.style.zIndex = this.zIndex
    },

    correctPositionByEdge () {
      const menu = this.$refs.menu
      const buttonSize = this.button.getBoundingClientRect()
      const menuSize = this.$refs.menu.getBoundingClientRect()
      const windowHeight = document.documentElement.clientHeight
      const windowWidth = document.documentElement.clientWidth
      switch (this.verticalAlign) {
        case 'bottom':
          if (menuSize.bottom > windowHeight) {
            menu.style.top = 'auto'
            menu.style.bottom = +this.offsetY + windowHeight - buttonSize.top + 'px'
          }
          break
      }
      if (menuSize.left < 10) menu.style.left = '10px'
      if (menuSize.right > windowWidth - 10) menu.style.right = '10px'
    },

    updatePosition () {
      this.calculatePosition()
      this.correctPositionByEdge()
    },

    openMenu () {
      if (this.disabled) return
      this.parentNode = getScrollableParent(this.$refs.button)
      window.addEventListener('resize', this.updatePosition)
      this.parentNode.addEventListener('scroll', this.updatePosition)
      this.childrenWidth = this.$refs.measuringBlock?.getBoundingClientRect()?.width
      this.calculatePosition()
      setTimeout(() => {
        this.correctPositionByEdge()
        this.isMenuVisible = true
        document.addEventListener('click', this.documentClick)
      }, 0)
    },

    closeMenu () {
      document.removeEventListener('click', this.documentClick)
      window.removeEventListener('resize', this.updatePosition)
      this.parentNode?.removeEventListener('scroll', this.updatePosition)
      this.isMenuVisible = false
      this.isOpen = false
    },

    documentClick (e) {
      if (this.openMode === 'innerControl') return
      const menu = this.$refs.menu
      if (e.target !== menu && !menu.contains(e.target)) this.closeMenu()
    },
  },
}
</script>

<style lang="scss">
.menu_slot_container {
  display: flex;
}
.menu_wrap {
  --animation-delay: 300ms;
  display: none;
  opacity: 0;
  visibility: hidden;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  transition:
    opacity var(--animation-delay),
    display var(--animation-delay);
  &.isOpen {
    display: flex;
    opacity: 1;
    animation: openAnimation var(--animation-delay) forwards;
  }
  &.isClose {
    opacity: 1;
    animation: closeAnimation var(--animation-delay) forwards;
  }
  &.isMenuVisible {
    visibility: visible;
  }
  .menu {
    position: absolute;
    box-sizing: border-box;
    pointer-events: all;
  }
}
@keyframes openAnimation {
  0% {
    display: block;
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes closeAnimation {
  0% {
    display: block;
    visibility: visible;
    opacity: 1;
  }
  100% {
    display: none;
    visibility: hidden;
    opacity: 0;
  }
}
.measuring_block {
  width: max-content;
  position: absolute;
  top: -10000px;
  left: -10000px;
}
</style>
