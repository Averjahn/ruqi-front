<template>
  <div class="calendar_container" :class="{ disabled }" @click="openCalendar" ref="input">
    <slot />
    <input class="input_plug" ref="inputPlug" />
  </div>
</template>

<script>
import AirDatepicker from 'air-datepicker'

export default {
  name: 'DatePicker',
  props: {
    date: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    format: {
      type: String,
      default: null,
    },
    airOptions: {
      type: Object,
      default: () => {},
    },
    airClassArr: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      dp: null,
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
      this.setCalendar(val)
    },
  },
  mounted () {
    this.init()
  },
  unmounted () {
    document.removeEventListener('click', this.closeDatePicker)
    this.dp.destroy()
  },
  methods: {
    init () {
      const self = this
      this.dp = new AirDatepicker(this.$refs.inputPlug, {
        classes: ['rq_calendar', ...self.airClassArr].join(' '),
        keyboardNav: false,
        toggleSelected: false,
        view: 'months',
        minView: 'months',
        onShow: () => {
          setTimeout(() => {
            self.$emit('update:isOpen', true)
            document.addEventListener('click', self.closeDatePicker)
          }, 0)
        },
        onHide: () => {
          document.removeEventListener('click', self.closeDatePicker)
        },
        onSelect: ({ date }) => {
          self.setDate(date)
          self.closeDatePicker()
        },
        ...self.airOptions,
      })
    },
    closeDatePicker (e) {
      if (e?.target !== this.dp.$datepicker && !this.dp.$datepicker.contains(e?.target)) {
        this.dp.hide()
        this.$emit('update:isOpen', false)
      }
    },
    setCalendar (date) {
      if (date && this.$dayjs(date).isValid()) this.dp.selectDate(date, { silent: true })
      else this.dp.clear()
    },
    getFormattedDate (date) {
      return this.format && !!date ? this.$dayjs(date).format(this.format) : date
    },
    setDate (date) {
      if (this.disabled) return
      this.$emit('update:date', this.getFormattedDate(date))
    },
    openCalendar () {
      if (this.isOpen || this.disabled) {
        this.$emit('update:isOpen', false)
        return
      }
      this.dp.opts.position = this.definePosition()
      this.dp.show()
    },
    definePosition () {
      const inputRect = this.$refs.input.getBoundingClientRect()
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
  &.disabled {
    opacity: 0.6;
  }
}
</style>
