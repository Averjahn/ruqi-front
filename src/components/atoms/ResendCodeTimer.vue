<template>
  <ButtonText 
    :color="buttonColor"
    size="xl"
    :disabled="!isExpired"
    @click="handleClick"
  >
    {{ isExpired ? 'Отправить код повторно' : `Отправить код повторно (${formattedTime})` }}
  </ButtonText>
</template>

<script>
import { computed } from 'vue'
import useCountdown from '@/composables/useCountdown'
import ButtonText from '@/components/atoms/ButtonText.vue'

export default {
  name: 'ResendCodeTimer',
  components: { ButtonText },
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
:deep(.button_text) {
  text-align: center;
  width: 100%;
  font-family: 'Source Sans', sans-serif;
  font-weight: 400;
}
</style>
