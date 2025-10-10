<template>
  <div class="progress_bar_container" :style="{ height: `${height}px` }">
    <div class="progress" :style="{ width }"></div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  components: {},
  props: {
    height: { type: String, default: '8' },
    value: { type: Number, default: 0 },
    targetValue: { type: Number, default: 0 },
  },
  data () {
    return {
      myTemplate2: null,
    }
  },
  computed: {
    width () {
      return this.value >= this.targetValue ? '100%' : (this.value / this.targetValue) * 100 + '%'
    },
  },
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.progress_bar_container {
  position: relative;
  border-radius: 8px;
  background-color: #efefef;
  .progress {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    border-radius: 8px;
    background-color: #1735f5;
  }
}
</style>
