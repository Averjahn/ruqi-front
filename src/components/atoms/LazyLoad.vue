<template>
  <div class="lazy_load_wrap">
    <div ref="triggeringSection" class="triggeringSection"></div>
  </div>
</template>

<script>
export default {
  name: 'LazyLoad',
  props: {
    callBack: {
      type: Function,
      default: () => {},
    },
  },
  data () {
    return {
      observer: null,
      isIntersecting: null,
    }
  },
  watch: {},
  mounted () {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) this.callBack()
        this.isIntersecting = entry.isIntersecting
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 1,
      },
    )
    this.observer.observe(this.$refs.triggeringSection)
  },
  methods: {
    checkObserver () {
      if (this.isIntersecting) this.callBack()
    },
  },
  beforeUnmount () {
    this.observer?.unobserve(this.$refs.triggeringSection)
  },
}
</script>

<style lang="scss" scope>
.lazy_load_wrap {
  position: relative;
  height: 1px;
}
</style>
