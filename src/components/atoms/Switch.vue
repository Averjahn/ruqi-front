<template>
  <label class="switch_container">
    <input :value="modelValue || value" type="checkbox" @change="onChange" :disabled="disabled" />
    <div class="switch_block" :class="{ checked: modelValue || value }">
      <div class="slider_wrap">
        <div class="slider"><Spinner v-if="loading" class="spinner" /></div>
      </div>
    </div>
  </label>
</template>

<script>
import Spinner from '@/components/atoms/loaders/Spinner.vue'

export default {
  name: 'Switch',
  components: { Spinner },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
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
    onChange (e) {
      this.$emit('onChange', e.target.value === 'false')
      this.$emit('update:modelValue', e.target.value === 'false')
    },
  },
}
</script>

<style lang="scss" scoped>
.switch_container {
  input {
    display: block;
    visibility: hidden;
    height: 0;
    margin: 0;
    margin-top: 0;
    margin-bottom: 0;
    padding: 0;
  }
  .switch_block {
    width: 32px;
    height: 20px;
    border-radius: 12px;
    background-color: #dadada;
    padding: 3px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    &.checked {
      background-color: #1735f5;
      .slider_wrap {
        width: 102%;
      }
    }
  }
  .slider_wrap {
    display: flex;
    width: 15px;
    height: 100%;
    justify-content: flex-end;
    align-items: center;
    transition: all 0.3s ease-in-out;
  }
  .slider {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    border-radius: 50%;
    width: 16px;
    min-width: 16px;
    height: 16px;
  }
  .spinner {
    display: block;
    width: 12px;
    height: 12px;
    border: 2px solid #1735f5;
  }
}
</style>
