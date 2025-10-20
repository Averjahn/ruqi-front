<template>
  <div 
    class="snackbar"
    :class="[
      `snackbar--${type}`,
      { 'snackbar--visible': visible }
    ]"
  >
    <div class="snackbar__content">
      <Icon v-if="icon" :name="icon" class="snackbar__icon" />
      <span class="snackbar__text">
        <template v-if="type === 'timer' && timeLeft">
          Подбор завершится: {{ formatTime(timeLeft) }}
        </template>
        <template v-else>
          {{ text }}
        </template>
      </span>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/atoms/icon/Icon.vue'

export default {
  name: 'Snackbar',
  components: { Icon },
  props: {
    type: {
      type: String,
      default: 'button',
      validator: (value) => ['button', 'timer'].includes(value)
    },
    text: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: true
    },
    duration: {
      type: Number,
      default: 0 // в секундах
    }
  },
  data() {
    return {
      timeLeft: 0,
      timer: null
    }
  },
  computed: {
    isTimer() {
      return this.type === 'timer' && this.duration > 0
    }
  },
  mounted() {
    if (this.isTimer) {
      this.startTimer()
    }
  },
  beforeUnmount() {
    this.clearTimer()
  },
  methods: {
    startTimer() {
      this.timeLeft = this.duration
      this.timer = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--
        } else {
          this.clearTimer()
          this.$emit('timer-end')
        }
      }, 1000)
    },
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    formatTime(seconds) {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const secs = seconds % 60
      
      if (hours > 0) {
        return `${hours}ч. ${minutes} мин. ${secs} сек.`
      } else if (minutes > 0) {
        return `${minutes} мин. ${secs} сек.`
      } else {
        return `${secs} сек.`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.snackbar {
  display: inline-flex;
  align-items: center;
  border-radius: 6px;
  padding: 4px 8px;
  height: 24px;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.25;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(-10px);
  
  &--visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  &__content {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  &__icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
  
  &__text {
    white-space: nowrap;
  }
  
  // Button type (синий)
  &--button {
    background-color: #f2f8ff;
    border: 1px solid #b0baff;
    color: #1735f5;
    
    .snackbar__icon {
      filter: brightness(0) saturate(100%) invert(27%) sepia(96%) saturate(1352%) hue-rotate(213deg) brightness(97%) contrast(96%);
    }
  }
  
  // Timer type (оранжевый)
  &--timer {
    background-color: #fff5f0;
    border: 1px solid #ffb3a1;
    color: #ff5c00;
    
    .snackbar__icon {
      filter: brightness(0) saturate(100%) invert(44%) sepia(86%) saturate(2196%) hue-rotate(343deg) brightness(95%) contrast(88%);
    }
  }
}
</style>
