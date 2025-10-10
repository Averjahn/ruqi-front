<template>
  <div class="divider_container"></div>
</template>

<script>
export default {
  name: 'Divider',
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
.divider_container {
  height: 1px;
  background-color: #dadada;
}
</style>
