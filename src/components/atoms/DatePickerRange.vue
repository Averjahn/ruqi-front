<template>
  <div class="calendar_container" @click="openCalendar">
    <Input :value="dateString" readonly>
      <template #right>
        <img src="@/assets/icon_deprecated/calendar.svg" />
      </template>
    </Input>
    <input ref="input" class="calendar_input" type="text" readonly />
  </div>
</template>

<script>
import AirDatepicker from 'air-datepicker'

export default {
  name: 'DatePickerRange',
  props: {
    range: {
      type: Array,
      default: null,
    },
  },
  computed: {
    dateString () {
      if (this.range?.[1]) {
        const startDate = this.$dayjs(this.range[0])
        const format = startDate.isSame(new Date(), 'year') ? 'DD.MM' : 'DD.MM.YY'
        const res = startDate.format(format) + ' - ' + this.$dayjs(this.range[1]).format(format)
        return res
      }
      return ''
    },
    showClearIcon () {
      return !!this.range?.[1]
    },
  },
  mounted () {
    const self = this
    this.dp = new AirDatepicker(this.$refs.input, {
      range: true,
      position: 'top left',
      classes: 'rq_calendar_range',
      buttons: [
        {
          content: 'Очистить',
          onClick: () => self.clear(),
        },
        {
          content: 'Ok',
          onClick (dp) {
            dp.hide()
            self.$emit('update:range', dp.selectedDates)
          },
        },
      ],
    })
  },
  methods: {
    clear (e) {
      e?.stopPropagation()
      this.dp.clear()
      if (this.dp.visible) this.dp.hide()
      this.$emit('update:range', null)
    },
    openCalendar () {
      this.dp.opts.position = this.definePosition()
      this.dp.show()
      this.$refs.input.focus()
    },
    definePosition () {
      const inputRect = this.$refs.input.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const distanceBottom = windowHeight - inputRect.bottom
      return distanceBottom < 310 ? 'top left' : 'bottom left'
    },
  },
}
</script>

<style lang="scss">
.calendar_container {
  position: relative;
  display: inline-block;
  .calendar_input {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    width: 10px;
    height: 100%;
    cursor: default;
    padding: 0;
    margin: 0;
    border: 0;
  }
}
</style>
