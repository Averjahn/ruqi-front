<template>
  <div class="circles_water_container">
    <div></div>
    <div></div>
  </div>
</template>

<script>
export default {
  name: 'LoadingCircles',
  props: {
    color: {
      type: String,
      default: '#dbe6ff',
    },
    radius: {
      type: Number,
      default: 12,
    },
  },
  data () {
    return {
      dotsStyles: {
        background: this.color,
        width: this.radius + 'px',
        height: this.radius + 'px',
      },
      containerStyles: {
        height: this.radius + 'px',
      },
    }
  },
  watch: {
    color (val) {
      this.dotsStyles.background = val
    },
    radius (val) {
      this.dotsStyles.width = val
      this.dotsStyles.height = val
      this.containerStyles.height = val
    },
  },
}
</script>

<style lang="scss">
.circles_water_container {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.circles_water_container div {
  position: absolute;
  border: 4px solid #1735f5;
  opacity: 1;
  border-radius: 50%;
  animation: circles_water 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.circles_water_container div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes circles_water {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  4.9% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  5% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
</style>
