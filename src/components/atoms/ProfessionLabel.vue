<template>
  <div class="profession_label" :class="[size, { checked }]">
    <img v-if="checked" class="checked_icon" src="@/assets/icon_deprecated/checkmark_blue.svg" />
    <div class="profession_title">{{ profession }}</div>
    <div v-if="counter" class="profession_counter">{{ counter }}</div>
  </div>
</template>

<script>
export default {
  name: 'ProfessionLabel',
  components: {},
  props: {
    profession: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'm', //s
    },
    checked: {
      type: Boolean,
      default: false,
    },
    counter: {
      type: [Number, String],
      default: '',
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
.profession_label {
  display: inline-flex;
  align-items: center;
  background: #f3f3f3;
  cursor: pointer;

  &.m {
    font-size: 16px;
    line-height: 22px;
    padding: 6px 20px;
    border-radius: 6px;
  }
  &.s {
    font-size: 12px;
    line-height: 15px;
    padding: 4px 8px;
    border-radius: 12px;
  }

  .checked_icon {
    margin-left: -7px;
  }
  .profession_title {
    padding: 0 8px;
  }
  .profession_counter {
    padding: 0 10px;
    display: flex;
    align-items: center;
    color: white;
    background-color: #0082de;
    border-radius: 48px;
    height: 20px;
    font-size: 14px;
    font-weight: 600;
  }
  &.checked {
    border: 1px solid #0082de;
  }
}
</style>
