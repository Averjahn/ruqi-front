<template>
  <div class="calendar_block">
    <div class="calendar_header">
      <div class="left_part">
        <MonthDatePicker
          v-model:date="innerCurrentMonth"
          v-model:isOpen="isMonthSelectOpen"
          :disabled="disabled || loading"
          :airOptions="airOptions"
          :key="airOptions"
        >
          <ButtonText color="grey" :disabled="disabled || loading">
            <span class="month_year">{{ monthYear }}</span>
            <Icon :class="['chevron', { is_open: isMonthSelectOpen }]" name="chevron" :size="20" />
          </ButtonText>
        </MonthDatePicker>
      </div>
      <div class="right_part">
        <ButtonText @click="toggleCalendar" color="grey">
          {{ calendarToggleText }}
          <Icon :class="['chevron', { is_open: isCalendarOpen }]" name="chevron" :size="20" />
        </ButtonText>
      </div>
    </div>
    <div v-if="isCalendarOpen" class="calendar_wrap">
      <Calendar
        :month="currentMonthNumber"
        :year="currentYear"
        :taskCounters="taskCounters"
        :disabled="disabled || loading"
        :min-date="minDate"
        v-model:selectedDate="innerSelectedDate"
        class="calendar"
      />
    </div>
    <HorizontalCalendar
      v-else
      :from="currentMonthRange.from"
      :to="currentMonthRange.to"
      :taskCounters="taskCounters"
      :disabled="disabled || loading"
      v-model:selectedDate="innerSelectedDate"
    />
  </div>
</template>

<script>
import HorizontalCalendar from '@/components/organisms/HorizontalCalendar.vue'
import Calendar from '@/components/organisms/Calendar.vue'
import MonthDatePicker from '@/components/atoms/MonthDatePicker.vue'

const monthsNominative = [
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
]

export default {
  name: 'CalendarBlock',
  components: { HorizontalCalendar, MonthDatePicker, Calendar },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    selectedDate: {
      type: Object,
      default: () => ({}),
    },
    currentMonth: {
      type: Object,
      default: () => ({}),
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
      isMonthSelectOpen: false,
      isCalendarOpen: false,
      loading: false,
    }
  },
  computed: {
    innerSelectedDate: {
      get () {
        return this.selectedDate
      },
      set (val) {
        this.$emit('update:selectedDate', val)
      },
    },
    innerCurrentMonth: {
      get () {
        return this.currentMonth
      },
      set (val) {
        this.$emit('update:currentMonth', val)
      },
    },
    currentYear () {
      return this.$dayjs(this.currentMonth).year()
    },
    currentMonthNumber () {
      return this.$dayjs(this.currentMonth).month()
    },
    calendarToggleText () {
      return this.isCalendarOpen ? 'Свернуть' : 'Развернуть'
    },
    airOptions () {
      return this.minDate ? { minDate: this.minDate } : {}
    },
    currentMonthRange () {
      let from = this.$dayjs(this.currentMonth).startOf('month')
      if (this.minDate && this.$dayjs(this.minDate).month() === this.currentMonthNumber) from = this.minDate
      return {
        from,
        to: this.$dayjs(this.currentMonth).endOf('month'),
      }
    },
    monthYear () {
      const date = this.$dayjs(this.currentMonth)
      const month = monthsNominative[date.month()]
      const year = date.format('YYYY')
      return `${month} ${year}`
    },
  },
  mounted () {},
  unmounted () {},
  watch: {
    airOptions () {
      this.isMonthSelectOpen = false
    },
  },
  methods: {
    toggleCalendar () {
      this.isCalendarOpen = !this.isCalendarOpen
    },
  },
}
</script>

<style lang="scss" scoped>
.calendar_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #7a91a9;
  margin-bottom: 24px;
  .left_part {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 20px;
    line-height: 18px;
  }
}
.month_year {
  &::first-letter {
    text-transform: uppercase;
  }
}
.chevron {
  transition: all 200ms ease-in-out;
  &.is_open {
    transform: rotate(180deg);
  }
}

.calendar_wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
.calendar {
  flex: 1;
  max-width: 980px;
}

@media (max-width: 768px) {
  .month_button {
    font-size: 14px;
  }
  .calendar_header {
    margin-bottom: 16px;
  }
}
</style>
