<template>
  <div class="step_progress_bar_container">
    <div v-for="(_, i) in totalSteps" :key="i" :class="['step', { active: i < Math.floor(completedSteps) }]"></div>
  </div>
</template>

<script>
export default {
  name: 'StepProgressBar',
  components: {},
  props: {
    totalSteps: { type: Number, default: 5 },
    completedSteps: { type: Number, default: 0 },
  },
  data () {
    return {}
  },
  computed: {},
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.step_progress_bar_container {
  display: flex;
  gap: 4px;
  .step {
    flex: 1;
    height: 6px;
    background: #efefef;
    border-radius: 4px;
    &.active {
      background: #1735f5;
    }
  }
}
</style>
