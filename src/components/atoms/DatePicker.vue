<template>
  <div class="calendar_container" :class="{ wide }">
    <Input
      :value="inputValue"
      ref="input"
      @input="onInput"
      @onClick="openCalendar"
      v-bind="filteredAttrs"
    >
      <template #left>
        <img src="@/assets/icons/calendar.svg" />
      </template>
    </Input>

    <input class="input_plug" ref="inputPlug" />
  </div>
</template>

<script>
import AirDatepicker from 'air-datepicker'
import { formatNumericString } from '@/constants/masks'
import { isValidDate } from '@/constants/helpers'

export default {
  name: 'DatePicker',
  props: {
    date: {
      type: [String, Date],
      default: null,
    },
    format: {
      type: String,
      default: 'DD.MM.YYYY',
    },
    airOptions: {
      type: Object,
      default: () => {},
    },
    airClassArr: {
      type: Array,
      default: () => [],
    },
    wide: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      inputValue: null,
    }
  },
  computed: {
    filteredAttrs () {
      const { class: className, style, ...attrs } = this.$attrs
      return attrs
    },
  },
  watch: {
    date (val) {
      this.setInput(val)
      this.setCalendar(val)
    },
  },
  mounted () {
    const self = this
    this.dp = new AirDatepicker(this.$refs.inputPlug, {
      classes: ['rq_calendar', ...this.airClassArr].join(' '),
      keyboardNav: false,
      startDate: isValidDate(this.date, this.format) ? this.$dayjs(this.date, this.format) : this.$dayjs(),
      toggleSelected: false,
      autoClose: true,
      onShow: () => {
        setTimeout(() => {
          document.addEventListener('click', this.closeDatePicker)
        }, 0)
      },
      onHide: () => {
        document.removeEventListener('click', this.closeDatePicker)
      },
      onSelect: ({ date }) => {
        self.setDate(date)
        self.userEvent(date)
        self.validate()
      },
      ...this.airOptions,
    })
    this.setInput(this.date)
    this.setCalendar(this.date)
  },

  unmounted () {
    document.removeEventListener('click', this.closeDatePicker)
    this.dp.destroy()
  },
  methods: {
    clear (e) {
      e?.stopPropagation()
      this.dp.clear()
      if (this.dp.visible) this.dp.hide()
      this.setDate(null)
      this.userEvent(null)
    },
    validate () {
      setTimeout(this.$refs.input?.validate, 50)
    },
    closeDatePicker (e) {
      if (e.target !== this.dp.$datepicker && !this.dp.$datepicker.contains(e.target)) this.dp.hide()
    },
    onInput (e) {
      const pattern = this.format.replace(/[a-zA-Z]/g, '*')
      const { formattedValue, cursorPosition } = formatNumericString({
        value: e.target.value,
        pattern,
        cursorPosition: e.target.selectionEnd,
      })
      this.inputValue = null
      if (this.$dayjs(formattedValue, this.format, true).isValid()) {
        const date = this.$dayjs(formattedValue, this.format).toDate()
        this.dp.selectDate(date)
        this.dp.setViewDate(date)
        this.setDate(date)
        this.userEvent(date)
      }
      if (formattedValue === '') {
        this.setDate(null)
        this.userEvent(null)
      }
      this.$nextTick(() => {
        this.inputValue = formattedValue
        this.$nextTick(() => {
          if (!e?.target?.setSelectionRange) return
          e.target.setSelectionRange(cursorPosition, cursorPosition)
        })
      })
    },
    setInput (date) {
      this.inputValue = date || ''
    },
    setCalendar (date) {
      if (isValidDate(date, this.format)) this.dp.selectDate(this.$dayjs(date, this.format), { silent: true })
    },
    getOuterDate (date) {
      return this.format && !!date ? this.$dayjs(date).format(this.format) : date
    },
    setDate (date) {
      this.$emit('update:date', this.getOuterDate(date))
    },
    userEvent (date) {
      this.$emit('userEvent', this.getOuterDate(date))
    },
    openCalendar () {
      this.dp.opts.position = this.definePosition()
      this.dp.show()
    },
    definePosition () {
      const inputRect = this.$refs.input.$el.getBoundingClientRect()
      const distanceBottom = window.innerHeight - inputRect.bottom
      const distanceRight = window.innerWidth - inputRect.left
      const verticalAlign = distanceBottom < 310 ? 'top ' : 'bottom '
      const horizontalAlign = distanceRight < 260 ? 'right' : 'left'
      return verticalAlign + horizontalAlign
    },
  },
}
</script>

<style lang="scss">
.input_plug {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  visibility: hidden;
  user-select: none;
  pointer-events: none;
  height: 100%;
  display: block;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
  border: 0;
  z-index: -100;
}

.calendar_container {
  position: relative;
  display: inline-block;
  .date_input {
    // border: 1px solid red;
  }
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
  &.wide {
    display: block;
  }
}
</style>
