<template>
  <div class="stepper-line" :class="lineClass">
    <div v-if="state === 'half-blue'" class="stepper-line__blue-part"></div>
  </div>
</template>

<script>
export default {
  name: 'StepperLine',
  props: {
    state: {
      type: String,
      required: true,
      validator: (value) => {
        return ['gray', 'half-blue', 'blue'].includes(value)
      }
    }
  },
  computed: {
    lineClass() {
      return {
        'stepper-line--gray': this.state === 'gray',
        'stepper-line--half-blue': this.state === 'half-blue',
        'stepper-line--blue': this.state === 'blue'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.stepper-line {
  height: 4px;
  border-radius: 2px;
  position: relative;
  flex-shrink: 0;

  // Полностью серая
  &--gray {
    background: #e3e5e4;
  }

  // Наполовину синяя (50% синяя, 50% серая)
  &--half-blue {
    background: #e3e5e4;
    
    .stepper-line__blue-part {
      position: absolute;
      left: 0;
      top: 0;
      width: 50%;
      height: 100%;
      background: #1735f5;
      border-radius: 2px;
    }
  }

  // Полностью синяя
  &--blue {
    background: #1735f5;
  }
}
</style>

