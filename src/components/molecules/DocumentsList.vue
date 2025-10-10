<template>
  <div class="container">
    <div
      v-for="item in options"
      :key="item.id"
      class="item"
      :class="[item.type, { active: modelValue === item.id }]"
      @click="select(item.id)"
    >
      <div class="icon_wrap">
        <div class="dot"><div /></div>
        <Icon :name="item.icon" />
      </div>
      <div>
        {{ item.text }}
        <div v-if="item.suggestText" class="suggest_text">{{ item.suggestText }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuList',
  components: {},
  props: {
    modelValue: String,
    options: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {}
  },
  computed: {},
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    select (id) {
      this.$emit('update:modelValue', id)
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 16px;
  border-radius: 16px;
  background-color: white;
  display: flex;
  flex-direction: column;
}
.item {
  padding: 12px 16px;
  display: flex;
  gap: 8px;
  color: #666666;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  &.active {
    background-color: #f2f8ff;
    color: #1735f5;
    &:hover {
      background-color: #ecf4fd;
      color: #112fee;
    }
  }
  .icon_wrap {
    position: relative;
  }
  .dot {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: absolute;
    top: -1px;
    left: -1px;
    margin: 0;
    padding: 0;
    > div {
      margin: 0;
      padding: 0;
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
  }
  &.attention {
    .dot {
      background-color: #f5d8d5;
      > div {
        background-color: #eb4d3d;
      }
    }
    .suggest_text {
      color: #eb4d3d;
    }
  }
  .suggest_text {
    font-size: 12px;
    line-height: 15px;
  }
  &:hover {
    background-color: #f5f5f5;
    color: #535353;
  }
}
</style>
