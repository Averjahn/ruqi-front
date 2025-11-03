<template>
  <button
    class="resend-text-button"
    :class="[`resend-text-button--${buttonColor}`, { 'resend-text-button--disabled': !isExpired }]"
    :disabled="!isExpired"
    @click="handleClick"
  >
    {{ isExpired ? 'Отправить код повторно' : `Отправить код повторно (${formattedTime})` }}
  </button>
</template>

<script>
import { computed } from 'vue'
import useCountdown from '@/composables/useCountdown'

export default {
  name: 'ResendCodeTimer',
  props: {
    duration: {
      type: Number,
      default: 60
    },
    autoStart: {
      type: Boolean,
      default: true
    }
  },
  emits: ['resend'],
  setup(props, { emit }) {
    const { isExpired, formattedTime, start, reset } = useCountdown(props.duration)

    const buttonColor = computed(() => {
      return isExpired.value ? 'blue' : 'light-blue'
    })

    const handleClick = () => {
      if (isExpired.value) {
        emit('resend')
        reset()
        start()
      }
    }

    if (props.autoStart) {
      start()
    }

    return {
      isExpired,
      formattedTime,
      buttonColor,
      handleClick
    }
  }
}
</script>

<style lang="scss" scoped>
.resend-text-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 32px;
  border-radius: 8px;
  border: 2px solid transparent;
  background: transparent;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 18px;
  line-height: 26px;
  color: #1735f5;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.resend-text-button--blue { color: #1735f5; }
.resend-text-button--light-blue { color: #b0baff; }
.resend-text-button--disabled { cursor: default; opacity: .7; }
</style>
