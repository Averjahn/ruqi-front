<template>
  <form action="">
    <slot />
  </form>
</template>

<script>
import { computed } from 'vue'
import { scrollWithAnimation } from '@/constants/scroll'

export default {
  name: 'Form',
  data () {
    return {
      checkValid: false,
    }
  },
  provide () {
    return {
      checkValid: computed(() => this.checkValid),
    }
  },
  methods: {
    getFirstError () {
      return this.$el.querySelector('.silent_validation_error')
    },
    validate () {
      this.checkValid = true
      this.$nextTick(() => {
        this.checkValid = false
      })
      return !this.getFirstError()
    },
    goToError () {
      const el = this.getFirstError()
      if (el) {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop
        const elTop = el.getBoundingClientRect().top
        scrollWithAnimation({
          scrollTargetY: scrollY + elTop - 50,
          easing: 'easeOutExpo',
        })
      }
    },
  },
}
</script>

<style></style>
