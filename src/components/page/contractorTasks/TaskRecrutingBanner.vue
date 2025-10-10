<template>
  <section
    v-if="status === 'is_recruting' || ('is_recruting_urgently' && remainingTime > 0)"
    class="recruting-ontainer"
    :class="{ red: isTimerRed, blue: !isTimerRed }"
  >
    <header class="ctp-action-block__title">
      <img v-if="status === 'is_recruting'" src="@/assets/icon_deprecated/warn_circle.svg" alt="icon" />
      <img v-else src="@/assets/icon_deprecated/fire.svg" alt="icon" />
      Подбор закончится через:
      <div :class="{ red_text: isTimerRed }">{{ getTimeUntilEnd }}</div>
    </header>
  </section>
</template>

<script>
import { declensionOfNumber } from '@/constants/helpers'

export default {
  name: 'TaskRecrutingBanner',
  props: {
    task: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      interval: null,
      remainingTime: 0,
      remainingShiftTime: 0,
    }
  },
  computed: {
    status () {
      return this.task.calcStatus
    },

    isTimerRed () {
      return this.remainingTime < 12 * 60 * 60 * 1000
    },

    getTimeUntilEnd () {
      const days = Math.floor(this.remainingTime / (24 * 60 * 60 * 1000))
      const hours = Math.floor(this.remainingTime / (60 * 60 * 1000))
      const minutes = Math.floor((this.remainingTime % (60 * 60 * 1000)) / (60 * 1000))
      const seconds = Math.floor((this.remainingTime % (60 * 1000)) / 1000)
      return hours > 24
        ? `${days} ` + declensionOfNumber(days, ['день', 'дня', 'дней'])
        : `${hours} ч. ${minutes} мин. ${seconds} сек.`
    },

    getTimeUntilShiftEnd () {
      const hours = Math.floor(this.remainingShiftTime / (60 * 60 * 1000))
      const minutes = Math.floor((this.remainingShiftTime % (60 * 60 * 1000)) / (60 * 1000))
      const seconds = Math.floor((this.remainingShiftTime % (60 * 1000)) / 1000)

      return `${hours} ч. ${minutes} мин. ${seconds} сек.`
    },

    isTomorrow () {
      const tomorrow = this.$dayjs().add(1, 'day')
      return this.$dayjs(this.task.start_date).isSame(tomorrow, 'date')
    },
  },
  mounted () {
    this.countRemainingTime()
    this.countRemainingShiftTime()
    this.interval = setInterval(() => {
      this.countRemainingTime()
      this.countRemainingShiftTime()
    }, 1000)
  },
  unmounted () {
    clearInterval(this.interval)
  },
  methods: {
    callAction () {},
    countRemainingTime () {
      const untilDate = this.$dayjs(this.task.start_date)
      const currentDate = this.$dayjs()
      this.remainingTime = untilDate.diff(currentDate)
    },
    countRemainingShiftTime () {
      const untilDate = this.$dayjs(this.task.end_date)
      const currentDate = this.$dayjs()
      this.remainingShiftTime = untilDate.diff(currentDate)
    },
  },
}
</script>

<style lang="scss" scoped>
.recruting-container {
}

.ctp-action-block__title {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  text-align: left;

  img {
    width: 20px;
    height: auto;
  }

  @media screen and (max-width: 1200px) {
    font-size: 14px;
  }
}

.red_text {
  color: #eb4d3d;
}

.ctp-action-block__completed-data {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;

  .item {
    width: 24%;
    min-width: 150px;
  }

  .title {
    color: #7a91a9;
    margin-bottom: 16px;
    margin-bottom: 8px;
  }

  .value {
    font-weight: 600;

    &._accrued {
      color: #7a91a9;
    }

    &._penalty {
      color: #eb4d3d;
    }
  }
}

.act_button {
  display: inline-flex;
  background-color: white;
  padding-right: 32px;
  padding-left: 32px;
  color: #0082de;
}

.ctp-action-block__footer-timer {
  display: flex;
  gap: 16px;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  text-align: left;

  .label {
    color: #7a91a9;
  }
}
</style>
