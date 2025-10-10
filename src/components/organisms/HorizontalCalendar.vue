<template>
  <div class="horizontal_calendar">
    <div v-if="dates.length > 8" class="button_container left">
      <div class="swipe_btn" @click="onLeft()">
        <img src="@/assets/icons/chevron_grey.svg" />
      </div>
    </div>
    <div
      ref="centerSection"
      class="center_section"
      @wheel="onWheel"
      @touchstart="startMove"
      @mousedown="startMove"
      @touchmove="(e) => e.preventDefault()"
    >
      <div
        ref="scrollContent"
        class="scroll_section"
        :class="{ transition: transition }"
        :style="{ left: left + 'px' }"
      >
        <div
          class="item"
          v-for="(item, index) of dates"
          :key="index"
          :class="{
            selected: item.selected,
            disabled: disabled,
            current: item.current,
            red: item.week === 'Сб' || item.week === 'Вс',
          }"
          @click="selectDate(item)"
        >
          <div class="week_day">{{ item.week }}</div>
          <div class="day_months">{{ item.dayMonths }}</div>
          <div v-if="item.taskCounter > 0" class="task_counter_label">
            {{ item.taskCounter }}
          </div>
          <div v-else class="task_counter">Нет</div>
        </div>
      </div>
    </div>
    <div v-if="dates.length > 8" class="button_container right">
      <div class="swipe_btn" @click="onRight()">
        <img src="@/assets/icons/chevron_grey.svg" />
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from '@/plugins/dayjs'

const weekDaysRus = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const monthsRus = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек', 'Янв']
export default {
  name: 'TimePicker',
  props: {
    from: {
      type: Object,
      default: dayjs(),
    },
    to: {
      type: Object,
      default: dayjs().add(30, 'day'),
    },
    selectedDate: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    taskCounters: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      swiping: false,
      transition: true,
      left: 0,
      currentDate: null,
      currentDatePosition: 0,
      centerSectionWidth: 177,
      scrollContentWidth: 720,
      scrollLimit: 177 - 720,
      dates: [],
    }
  },
  computed: {},
  watch: {
    from: {
      handler () {
        this.init()
        this.calculateSize()
      },
      deep: true,
    },
    to: {
      handler () {
        this.init()
        this.calculateSize()
      },
      deep: true,
    },
    selectedDate: {
      handler () {
        this.init()
        this.calculateSize()
      },
      deep: true,
    },
    taskCounters: {
      handler () {
        this.init()
        this.calculateSize()
      },
      deep: true,
    },
  },
  created () {
    this.init()
  },
  mounted () {
    setTimeout(() => {
      this.calculateSize()
    }, 100)
    this.calculateSize()
    window.addEventListener('resize', this.calculateSize)
  },
  unmounted () {
    window.removeEventListener('resize', this.calculateSize)
  },
  methods: {
    selectDate (item) {
      if (item.disabled || this.disabled || this.swiping) return
      this.$emit('update:selectedDate', item.date)
    },
    init () {
      this.dates = []
      const firstDate = this.from
      const differenceInDays = this.to.diff(this.from, 'day')
      const selectedDateFormat = this.selectedDate?.format('YYYY-MM-DD')
      const currentDateFormat = this.$dayjs().format('YYYY-MM-DD')
      for (let i = 0; i < differenceInDays + 1; i++) {
        const date = firstDate.add(i, 'day')
        const dateFormat = date.format('YYYY-MM-DD')
        const day = date.date()
        const months = monthsRus[date.get('month')]
        if (dateFormat === selectedDateFormat) {
          this.currentDatePosition = this.dates.length
        }
        const taskCounter = this.taskCounters?.[dateFormat]
        this.dates.push({
          week: weekDaysRus[date.day()],
          day,
          months,
          dayMonths: `${day} ${months}`,
          date,
          current: dateFormat === currentDateFormat,
          selected: dateFormat === selectedDateFormat,
          taskCounter,
        })
      }
    },
    calculateSize () {
      this.centerSectionWidth = this.$refs.centerSection?.getBoundingClientRect().width || 0
      this.scrollContentWidth = this.$refs.scrollContent?.getBoundingClientRect().width || 0
      this.scrollLimit = this.centerSectionWidth - this.scrollContentWidth
      const left =
        (-this.scrollContentWidth / this.dates.length) * this.currentDatePosition + this.centerSectionWidth / 3
      this.left = left > 0 ? 0 : left < this.scrollLimit ? this.scrollLimit : left
    },

    onLeft () {
      const left = this.left + (this.centerSectionWidth - 50)
      this.left = left > 0 ? 0 : left
    },
    onRight () {
      const left = this.left - (this.centerSectionWidth - 50)
      this.left = left < this.scrollLimit ? this.scrollLimit : left
    },
    onWheel (event) {
      const left = this.left - event.deltaY
      this.left = left > 0 ? 0 : left < this.scrollLimit ? this.scrollLimit : left
      event.preventDefault()
    },
    startMove (e) {
      this.transition = false
      const cursorStart = e.pageX || e.touches[0].pageX
      const currentLeft = this.left
      const move = (event) => {
        e.preventDefault()
        const distance = cursorStart - (event.pageX || event.touches?.[0]?.pageX || 0)
        let l = currentLeft - distance
        if (distance > 30 || distance < -30) this.swiping = true
        l = l < this.scrollLimit ? this.scrollLimit : l > 0 ? 0 : l
        this.left = l
      }

      const endMove = (e) => {
        this.transition = true
        setTimeout(() => {
          this.swiping = false
        }, 100)
        document.removeEventListener('mousemove', move)
        document.removeEventListener('touchmove', move)
        document.removeEventListener('mouseup', endMove)
        document.removeEventListener('touchend', endMove)
      }

      if (e.pageX) {
        document.addEventListener('mousemove', move)
        document.addEventListener('mouseup', endMove)
      } else {
        document.addEventListener('touchmove', move)
        document.addEventListener('touchend', endMove)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.horizontal_calendar {
  background-color: white;
  display: flex;
  height: 94px;
  min-width: 220px;
  .button_container {
    display: flex;
    align-items: center;
    &.right {
      margin-left: 16px;
      img {
        transform: rotate(180deg);
      }
    }
    &.left {
      margin-right: 16px;
    }
  }
  .swipe_btn {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    background-color: #f3f3f3;
    cursor: pointer;
    user-select: none;
    &:hover {
      background-color: #e6e6e6;
    }
  }
  .center_section {
    flex: 1;
    position: relative;
    overflow: hidden;
  }
  .scroll_section {
    position: absolute;
    min-width: 100%;
    top: 0;
    bottom: 0;
    white-space: nowrap;
    display: flex;
    justify-content: space-between;
    gap: 24px;
    &.transition {
      transition: left 0.2s cubic-bezier(0, 0.55, 0.45, 1);
    }
  }
  .vertical_dashed {
    height: 100%;
    width: 0;
    border-left: 1px dashed #bebebe;
  }
  .month {
    position: absolute;
    background-color: white;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 50%;
    margin-top: -12px;
  }
  .item {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 123px;
    height: 94px;
    gap: 4px;
    user-select: none;
    padding: 8px;
    border-radius: 16px;
    &.red {
      color: #eb4d3d;
    }
    &.disabled {
      opacity: 0.6;
      cursor: default;
      &:hover {
        background-color: transparent !important;
      }
    }
    &.selected {
      background-color: #f3f3f3;
      &:hover {
        background-color: #e6e6e6;
      }
    }
    &.current {
      color: #1735f5;
    }
    &:hover {
      background-color: #f9f9f9;
    }
  }
  .week_day {
    text-transform: uppercase;
  }
  .day_months {
    text-transform: lowercase;
  }
  .task_counter {
    font-size: 14px;
    line-height: 26px;
    color: #bebebe;
  }
  .task_counter_label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background-color: #ea358c;
    color: white;
    font-size: 14px;
    line-height: 10px;
  }

  @media (max-width: 1280px) {
    .button_container {
      display: none;
    }
  }
  @media (max-width: 768px) {
    font-size: 14px;
    height: 73px;
    .scroll_section {
      gap: 8px;
    }

    .day_months {
      font-size: 12px;
      line-height: 15px;
    }

    .task_counter {
      line-height: 20px;
    }

    .task_counter_label {
      width: 20px;
      height: 20px;
      font-size: 12px;
    }
    .item {
      width: 42px;
      height: 73px;
      padding: 4px;
      border-radius: 8px;
    }
  }
}
</style>
