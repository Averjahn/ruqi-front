import dayjs from '@/plugins/dayjs'
import { ref } from 'vue'
import { onMounted, onUnmounted } from 'vue'

export default function useTimer ({ timerId } = {}) {
  const isTimerRunning = ref(false)
  const intervalId = ref(null)
  const expirationDate = ref(null)
  const remaining = ref(0)

  onMounted(() => {
    getFromLocalStorage()
    countRemaining()
    startInterval()
  })

  onUnmounted(() => {
    clearInterval(intervalId.value)
  })

  const putToLocalStorage = (expirationDate) => {
    const timers = JSON.parse(localStorage.getItem('ruqi_employee_timers') || '{}')
    timers[timerId] = expirationDate
    localStorage.setItem('ruqi_employee_timers', JSON.stringify(timers))
  }

  const deleteFromLocalStorage = () => {
    const timers = JSON.parse(localStorage.getItem('ruqi_employee_timers') || '{}')
    delete timers[timerId]
    localStorage.setItem('ruqi_employee_timers', JSON.stringify(timers))
  }

  const getFromLocalStorage = () => {
    const timers = JSON.parse(localStorage.getItem('ruqi_employee_timers') || '{}')
    expirationDate.value = timers[timerId] || null
  }

  const countRemaining = () => {
    if (expirationDate.value) {
      const expiration = dayjs(expirationDate.value)
      remaining.value = expiration.diff(dayjs(), 'second')
      isTimerRunning.value = remaining.value > 1
    }
  }

  const startInterval = () => {
    intervalId.value = setInterval(() => {
      if (remaining.value > 1) {
        countRemaining()
      } else {
        clearTimer()
      }
    }, 1000)
  }

  const launchTimer = (sec) => {
    isTimerRunning.value = true
    expirationDate.value = dayjs().add(sec, 'second').toString()
    putToLocalStorage(expirationDate.value)
    countRemaining()
    startInterval()
  }

  const clearTimer = () => {
    remaining.value = 0
    clearInterval(intervalId.value)
    deleteFromLocalStorage()
    isTimerRunning.value = false
  }

  return {
    launchTimer,
    isTimerRunning,
    remaining,
    clearTimer,
  }
}
