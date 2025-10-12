<template>
  <div class="field_message" :class="{ open: !!text, success: type === 'success' }">
    <div class="text_wrap">
      <div class="text">{{ innerText }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FieldMessage',
  components: {},
  props: {
    text: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: 'error',
      validator: (value) => ['error', 'success'].includes(value)
    },
  },
  data () {
    return {
      innerText: this.text,
      timer: null,
    }
  },
  computed: {},
  mounted () {},
  unmounted () {
    if (this.timer) clearTimeout(this.timer)
  },
  watch: {
    text (val, prev) {
      if (!val) {
        this.innerText = prev
        this.timer = setTimeout(() => (this.innerText = val), 400)
      } else {
        if (this.timer) clearTimeout(this.timer)
        this.innerText = val
      }
    },
  },
  methods: {
    open () {},
  },
}
</script>

<style lang="scss" scoped>
.field_message {
  overflow: hidden;
  display: grid;
  grid-template-rows: 0fr;
  transition: all 200ms ease-in-out;
  opacity: 0;
  &.open {
    grid-template-rows: 1fr;
    opacity: 1;
  }
  .text_wrap {
    justify-self: left;
    min-height: 0px;
  }

  .text {
    padding-top: 4px;
    font-size: 14px;
    line-height: 22px;
    color: #eb4d3d;
  }

  &.success .text {
    color: #71d472;
  }
}
</style>
