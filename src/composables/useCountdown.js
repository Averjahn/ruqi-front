import { ref, computed, onMounted, onUnmounted } from 'vue'

export default function useCountdown(initialSeconds = 60) {
  const timeLeft = ref(initialSeconds)
  const isActive = ref(false)
  const intervalId = ref(null)

  const formattedTime = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60)
    const seconds = timeLeft.value % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })

  const isExpired = computed(() => timeLeft.value <= 0)

  const start = () => {
    if (isActive.value) return
    
    isActive.value = true
    timeLeft.value = initialSeconds
    
    intervalId.value = setInterval(() => {
      timeLeft.value--
      if (timeLeft.value <= 0) {
        stop()
      }
    }, 1000)
  }

  const stop = () => {
    isActive.value = false
    if (intervalId.value) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
  }

  const reset = () => {
    stop()
    timeLeft.value = initialSeconds
  }

  onUnmounted(() => {
    stop()
  })

  return {
    timeLeft,
    isActive,
    isExpired,
    formattedTime,
    start,
    stop,
    reset
  }
}
