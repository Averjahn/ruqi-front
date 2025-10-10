<template>
  <div class="parallax_tilt_container" @mousemove="mouseMove" @mouseleave="mouseLeave" @mouseenter="mouseEnter">
    <div
      ref="card"
      class="parallax"
      :style="{ transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)` }"
    >
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ParallaxTilt',
  components: {},
  props: {},
  data () {
    return {
      timer: null,
      rotateX: 0,
      rotateY: 0,
    }
  },
  computed: {},
  mounted () {},
  unmounted () {
    clearInterval(this.timer)
  },
  watch: {},
  methods: {
    animate (stepX, stepY, targetX, targetY) {
      const differenceX = Math.abs(this.rotateX - targetX) > Math.abs(stepX)
      const differenceY = Math.abs(this.rotateY - targetY) > Math.abs(stepY)
      this.rotateX = differenceX ? this.rotateX + stepX : targetX
      this.rotateY = differenceY ? this.rotateY + stepY : targetY
      if (!differenceX && !differenceY) clearInterval(this.timer)
    },
    mouseMove (e) {
      const card = this.$refs.card
      card.style.transition = 'none'
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      const targetX = -y * 20
      const targetY = x * 20
      const differenceX = Math.abs(this.rotateX - targetX) > 3
      const differenceY = Math.abs(this.rotateY - targetY) > 3
      clearInterval(this.timer)
      if (differenceX || differenceY) {
        const stepX = targetX / 20
        const stepY = targetY / 20
        this.rotateX = differenceX ? this.rotateX + stepX : targetX
        this.rotateY = differenceY ? this.rotateY + stepY : targetY
        this.timer = setInterval(() => {
          this.animate(stepX, stepY, targetX, targetY)
        }, 10)
        return
      }
      this.rotateX = targetX
      this.rotateY = targetY
    },
    mouseLeave () {
      const card = this.$refs.card
      clearInterval(this.timer)
      card.style.transition = 'transform 200ms ease'
      this.rotateX = 0
      this.rotateY = 0
    },
  },
}
</script>

<style lang="scss" scoped>
.parallax_tilt_container {
  transform: perspective(1000px) rotateX(0) rotateY(0);
  will-change: transform;
  .parallax {
    display: flex;
  }
}
</style>
