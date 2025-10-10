<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :aria-labelledby="name"
    role="presentation"
    data-qa="icon-svg"
  >
    <g :fill="color">
      <Component :is="icons[name]" />
    </g>
  </svg>
</template>

<script>
import { icons } from './icons'

export default {
  name: 'Icon',
  components: {},
  props: {
    size: {
      type: Number,
      default: 24,
    },
    color: {
      type: String,
      default: 'currentColor',
    },
    name: {
      type: String,
      default: 'currentColor',
    },
  },
  data () {
    return {
      icons,
    }
  },
  computed: {},
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {},
}
</script>

<style lang="scss" scoped>
svg {
  display: inline-block;
  vertical-align: baseline;
}
</style>
