<template>
  <div class="badge_container">
    <div v-if="badgeData" class="badge" :class="[color]">{{ badgeData }}</div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Badge',
  components: {},
  props: {
    color: {
      type: String,
      default: 'pink', // 'yellow', 'red'
    },
    badgeData: {
      type: [Number, String],
      default: 0,
    },
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
.badge_container {
  display: flex;
  position: relative;
}
.badge {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: -5px;
  left: 45%;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 9px;
  z-index: 10;
  color: #fff;
  font-size: 9px;
  font-weight: 100;
  line-height: 12px;

  &.red {
    background-color: #eb4d3d;
  }
  &.yellow {
    background-color: #f4d150;
  }
  &.pink {
    background-color: #ea358c;
  }
}
</style>
