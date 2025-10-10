<template>
  <div class="hover_highlighter">
    <div class="highlight"></div>
    <div class="wrapper">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HoverHighlighter',
  components: {},
  props: {
    options: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      list: null,
    }
  },
  computed: {},
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    open () {},
  },
}
</script>

<style lang="scss" scoped>
.hover_highlighter {
  position: relative;
  cursor: pointer;
  .highlight {
    display: none;
    position: absolute;
    top: -16px;
    bottom: -16px;
    left: -16px;
    right: -16px;
    z-index: 0;
    border-radius: 16px;
    box-shadow:
      0px 4px 20px 5px #1735f50a,
      0px -1px 4px 0px #1735f508;
  }
  .wrapper {
    position: relative;
    z-index: 1;
  }
  &:hover {
    .highlight {
      display: block;
    }
  }
}
</style>
