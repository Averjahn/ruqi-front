<template>
  <div class="dots" ref="dots"></div>
</template>

<script>
export default {
  props: {
    diameter: {
      type: Number,
      default: 10,
    },
    distance: {
      type: Number,
      default: 18,
    },
  },
  mounted () {
    this.$refs.dots.style.setProperty('--dot-width', this.diameter + 'px')
    this.$refs.dots.style.setProperty('--dot-height', this.diameter + 'px')
    this.$refs.dots.style.setProperty('--dot-distance', this.distance + 'px')
    this.$refs.dots.style.setProperty('--dot-negativeDistance', '-' + this.distance + 'px')
  },
}
</script>

<style lang="scss">
.dots {
  width: var(--dot-width, 10px);
  height: var(--dot-height, 10px);
  background: #1735f5;
  color: #1735f5;
  border-radius: 50%;
  box-shadow:
    var(--dot-distance, 18px) 0,
    var(--dot-negativeDistance, -18px) 0;
  animation: dots 1s infinite linear alternate;
}

@keyframes dots {
  0% {
    box-shadow:
      var(--dot-distance, 18px) 0,
      var(--dot-negativeDistance, -18px) 0;
  }

  33% {
    box-shadow:
      var(--dot-distance, 18px) 0,
      var(--dot-negativeDistance, -18px) 0 rgba(0, 130, 222, 0.13);
    background: rgba(0, 130, 222, 0.13);
  }

  66% {
    box-shadow:
      var(--dot-distance, 18px) 0 rgba(0, 130, 222, 0.13),
      var(--dot-negativeDistance, -18px) 0;
    background: rgba(0, 130, 222, 0.13);
  }
}
</style>
