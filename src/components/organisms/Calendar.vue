<template>
  <div :class="['calendar_container', { disabled }]">
    <div class="header">
      <div class="item">Пн</div>
      <div class="item">Вт</div>
      <div class="item">Ср</div>
      <div class="item">Чт</div>
      <div class="item">Пт</div>
      <div class="item">Сб</div>
      <div class="item">Вс</div>
    </div>
    <div class="body">
      <div
        v-for="(item, index) in dates"
        :key="index"
        :class="{
          item: !!item.dayMonths,
          current: item.current,
          disabled: item.disabled,
          selected: item.selected,
        }"
        @click="selectDate(item)"
      >
        <div class="day_wrap">
          <div class="day">{{ item.day }}</div>
          <div class="day_months">{{ item.dayMonths }}</div>
        </div>
        <div v-if="item.taskCounter > 0" class="task_counter_label">
          {{ item.taskCounter }}
        </div>
        <div v-else class="task_counter">Нет</div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from '@/plugins/dayjs'
const monthsRus = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек', 'Янв']
const rusWeek = [6, 0, 1, 2, 3, 4, 5]
import { declensionOfNumber } from '@/constants/helpers'

export default {
  name: 'Calendar',
  components: {},
  props: {
    month: {
      type: Number,
      default: dayjs().month(),
    },
    year: {
      type: Number,
      default: dayjs().year(),
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
    minDate: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      dates: [],
    }
  },
  computed: {},
  mounted () {
    this.init()
  },
  unmounted () {},
  watch: {
    month () {
      this.init()
    },
    year () {
      this.init()
    },
    selectedDate () {
      this.init()
    },
    taskCounters () {
      this.init()
    },
  },
  methods: {
    getFirstDayOfMonth () {
      return dayjs(new Date(this.year, this.month, 1))
    },
    addEmptyObjects (array, n) {
      for (let i = 0; i < n; i++) array.push({})
      return array
    },
    getTaskCounterString (count) {
      if (count > 0) return count + declensionOfNumber(count, [' заявка', ' заявки', ' заявок'])
      return 'Hет'
    },
    selectDate (item) {
      if (item.disabled || this.disabled) return
      this.$emit('update:selectedDate', item.date)
    },
    init () {
      const firstDayOfMonth = this.getFirstDayOfMonth()
      const daysInMonth = firstDayOfMonth.daysInMonth()
      const addPreviewMountDay = rusWeek[firstDayOfMonth.day()]
      const firstDay = firstDayOfMonth.subtract(addPreviewMountDay, 'day')
      this.dates = []
      const currentDateFormat = this.$dayjs().format('YYYY-MM-DD')
      const selectedDateFormat = this.selectedDate?.format('YYYY-MM-DD')
      for (let i = 0; i < daysInMonth + addPreviewMountDay; i++) {
        const date = firstDay.add(i, 'day')
        const dateFormat = date.format('YYYY-MM-DD')
        const day = date.date()
        const months = monthsRus[date.get('month')]
        const taskCounter = this.taskCounters?.[dateFormat]
        this.dates.push({
          weekday: date.day(),
          day,
          date,
          taskCounter,
          dayMonths: `${day} ${months}`,
          current: dateFormat === currentDateFormat,
          selected: dateFormat === selectedDateFormat,
          disabled: date.month() !== firstDayOfMonth.month() || date < this.minDate,
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.calendar_container {
  padding: 1px;
  transition: opacity 200ms ease-in-out;
  &.disabled {
    opacity: 0.6;
  }
  .header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    margin-bottom: 1px;
    :nth-child(6n),
    :nth-child(7n) {
      color: red;
    }
    :last-child {
      border-radius: 0 12px 0 0;
    }
    :first-child {
      border-radius: 12px 0 0 0;
    }
    .item {
      box-shadow: 0 0 0 1px #dadada;
      text-align: center;
      text-transform: uppercase;
      height: 46px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .body {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    :nth-child(7n + 6),
    :nth-child(7n) {
      color: red;
    }
    .item {
      display: flex;
      flex-direction: column;
      box-shadow: 0 0 0 1px #dadada;
      text-align: center;
      height: 80px;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
      transition: background 200ms ease-in-out;
      &.disabled {
        cursor: default;
        .task_counter {
          opacity: 0;
        }
        .day_wrap {
          opacity: 0.8;
          color: #bebebe;
        }
        &:hover {
          background: transparent;
        }
      }
      &.selected {
        box-shadow: 0 0 0 1px #1735f5;
        z-index: 2;
        background: #f6f7ff;
        &:hover {
          background: #f2f3ff;
        }
      }
      &.current {
        color: #1735f5;
      }
      &:hover {
        background: #f6f7ff;
      }
    }
  }
  .day_wrap {
    position: relative;
  }
  .day {
    display: none;
  }
  .day_months {
    text-transform: lowercase;
    margin-bottom: 4px;
  }
  .task_counter {
    font-size: 14px;
    line-height: 22px;
    color: #bebebe;
  }
  .task_counter_label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 19px;
    height: 19px;
    border-radius: 50%;
    background: #ea358c;
    color: white;
    font-size: 11px;
    line-height: 10px;
    margin-bottom: 2px;
  }
  @media (max-width: 768px) {
    .header .item {
      font-size: 14px;
      height: 30px;
    }
    .body .item {
      padding-top: 5.5px;
      line-height: 16.8px;
      font-size: 14px;
      height: 40px;
    }
    .day {
      display: inline-block;
    }
    .day_months {
      display: none;
    }
    .task_counter {
      line-height: 13px;
      font-size: 8px;
    }
    .task_counter_label {
      width: 14px;
      height: 14px;
      font-size: 8px;
      margin-bottom: 0px;
    }
    .dot {
      right: -6px;
      top: 0px;
      width: 4px;
      height: 4px;
    }
  }
}
</style>
