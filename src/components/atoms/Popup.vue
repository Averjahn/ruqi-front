<template>
  <Transition mode="out-in">
    <teleport to="body">
      <div v-if="!!show" id="popup_shadow" @mousedown="hideFromShadow">
        <slot />
      </div>
    </teleport>
  </Transition>
</template>

<script>
export default {
  name: 'Popup',
  props: {
    show: {
      type: Boolean,
      default: true,
    },
    externalControl: {
      type: Boolean,
      default: false,
    },
  },
  mounted () {},
  methods: {
    hidePopup () {
      this.$emit('update:show', false)
    },
    hideFromShadow (event) {
      if (this.externalControl) return
      if (event.target?.id === 'popup_shadow') {
        this.hidePopup()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#popup_shadow {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  z-index: 220;
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
