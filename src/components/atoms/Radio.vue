<template>
  <label :class="['radio', { checked }]">
    <input type="radio" :value="value" :name="name" :checked="checked" @change="handleChange" class="radio__input" />
    <div class="input_imitation">
      <div class="center"></div>
    </div>
    <span class="radio__label">
      <slot />
    </span>
  </label>
</template>

<script>
export default {
  name: 'Radio',
  components: {},
  emits: ['update:modelValue'],
  props: {
    modelValue: [String, Number, Boolean],
    value: [String, Number, Boolean],
    name: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      checked: false,
    }
  },
  computed: {},
  mounted () {},
  unmounted () {},
  watch: {
    modelValue: {
      handler (newValue) {
        this.checked = newValue === this.value
      },
      immediate: true,
    },
  },
  methods: {
    handleChange () {
      if (this.modelValue !== this.value) {
        this.$emit('update:modelValue', this.value)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.radio {
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
  &.checked {
    .input_imitation {
      border: 1px solid #1735f5;
      .center {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #1735f5;
      }
    }
  }
}

.radio__input {
  display: none;
}

.radio__label {
  position: relative;
}

.input_imitation {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 1px solid #dadada;
  border-radius: 50%;
  &.checked {
    border: 1px solid #1735f5;
    .center {
      width: 10px;
      height: 10px;
    }
  }
}
</style>
