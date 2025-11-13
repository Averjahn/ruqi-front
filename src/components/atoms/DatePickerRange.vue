<template>
  <div class="calendar_container" @click="openCalendar">
    <Input :value="dateString" readonly>
      <template #left>
        <img src="@/assets/icons/calendar.svg" />
      </template>
      <template #right>
        <button
          v-if="showClearIcon"
          class="calendar_clear_button"
          @click.stop="clear"
        >
          <img src="@/assets/icons/cross.svg" alt="Clear" />
        </button>
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
  data() {
    return {
      hoveredRange: null, // Временный диапазон при наведении
    }
  },
  computed: {
    dateString () {
      // Используем hoveredRange для отображения при наведении, иначе range
      const displayRange = this.hoveredRange || this.range
      if (displayRange?.[1]) {
        const startDate = this.$dayjs(displayRange[0])
        const format = startDate.isSame(new Date(), 'year') ? 'DD.MM' : 'DD.MM.YY'
        const res = startDate.format(format) + ' - ' + this.$dayjs(displayRange[1]).format(format)
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
    // Преобразуем даты в чистые Date объекты, если они есть
    let initialDates = []
    if (this.range && Array.isArray(this.range) && this.range.length === 2) {
      initialDates = [
        this.range[0] instanceof Date ? new Date(this.range[0]) : this.range[0],
        this.range[1] instanceof Date ? new Date(this.range[1]) : this.range[1]
      ]
    }
    
    this.dp = new AirDatepicker(this.$refs.input, {
      range: true,
      position: 'top left',
      classes: 'rq_calendar_range',
      selectedDates: initialDates,
      buttons: [
        {
          content: 'Очистить',
          onClick: () => self.clear(),
        },
        {
          content: 'Ok',
          onClick (dp) {
            dp.hide()
            if (dp.selectedDates && dp.selectedDates.length === 2) {
              // Создаем новые Date объекты, чтобы избежать циклических ссылок
              const dates = [
                new Date(dp.selectedDates[0]),
                new Date(dp.selectedDates[1])
              ]
              self.$emit('update:range', dates)
            } else {
              self.$emit('update:range', null)
            }
          },
        },
      ],
      onShow: (dp) => {
        // Увеличиваем z-index при открытии календаря
        if (document.body.classList.contains('filter-modal-open')) {
          // Используем setTimeout чтобы календарь успел отрендериться
          setTimeout(() => {
            const datepickerEl = document.querySelector('.air-datepicker')
            if (datepickerEl) {
              datepickerEl.style.zIndex = '2100'
              datepickerEl.style.position = 'fixed'
            }
          }, 0)
        }
        // Добавляем обработчики hover после открытия календаря
        setTimeout(() => {
          self.addHoverHandlers()
        }, 100)
      },
      onRenderCell: ({ date, cellType }) => {
        // Переустанавливаем обработчики при рендеринге ячеек (при смене месяца/года)
        if (cellType === 'day') {
          setTimeout(() => {
            self.addHoverHandlers()
          }, 50)
        }
      },
      onHide: () => {
        // Очищаем hoveredRange при закрытии календаря
        self.hoveredRange = null
      },
    })
    
    // Синхронизируем начальное значение
    if (initialDates.length === 2) {
      this.dp.selectDate(initialDates)
    }
  },
  watch: {
    range(newRange) {
      if (this.dp) {
        if (newRange && Array.isArray(newRange) && newRange.length === 2) {
          // Создаем новые Date объекты, чтобы избежать циклических ссылок
          const dates = [
            newRange[0] instanceof Date ? new Date(newRange[0]) : newRange[0],
            newRange[1] instanceof Date ? new Date(newRange[1]) : newRange[1]
          ]
          this.dp.selectDate(dates)
        } else {
          this.dp.clear()
        }
      }
    }
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
    addHoverHandlers() {
      if (!this.dp || !this.dp.$datepicker) return
      
      const self = this
      const datepickerEl = this.dp.$datepicker
      const cells = datepickerEl.querySelectorAll('.air-datepicker-cell:not(.-disabled-)')
      
      cells.forEach(cell => {
        // Удаляем старые обработчики, если они есть
        const oldHandler = cell._hoverHandler
        const oldLeaveHandler = cell._leaveHandler
        if (oldHandler) {
          cell.removeEventListener('mouseenter', oldHandler)
        }
        if (oldLeaveHandler) {
          cell.removeEventListener('mouseleave', oldLeaveHandler)
        }
        
        // Создаем новые обработчики с привязкой к ячейке
        const hoverHandler = (e) => self.handleCellHover(e, cell)
        const leaveHandler = () => self.handleCellLeave()
        
        // Сохраняем ссылки для последующего удаления
        cell._hoverHandler = hoverHandler
        cell._leaveHandler = leaveHandler
        
        // Добавляем новые обработчики
        cell.addEventListener('mouseenter', hoverHandler)
        cell.addEventListener('mouseleave', leaveHandler)
      })
    },
    handleCellHover(event, cell) {
      // Получаем дату из ячейки через AirDatepicker API
      // AirDatepicker хранит дату в data-атрибутах или можно получить через dp.viewDate
      let hoveredDate = null
      
      // Пробуем разные способы получения даты
      const day = parseInt(cell.getAttribute('data-cell-day') || cell.textContent.trim())
      const month = parseInt(cell.getAttribute('data-cell-month'))
      const year = parseInt(cell.getAttribute('data-cell-year'))
      
      if (day && !isNaN(day)) {
        // Если есть месяц и год, создаем дату
        if (month !== null && !isNaN(month) && year && !isNaN(year)) {
          hoveredDate = new Date(year, month, day)
        } else {
          // Используем текущий месяц и год из календаря
          const viewDate = this.dp.viewDate || new Date()
          hoveredDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
        }
      }
      
      // Если не получилось, пробуем получить из класса ячейки
      if (!hoveredDate || isNaN(hoveredDate.getTime())) {
        // Пробуем получить из data-date
        const dateStr = cell.getAttribute('data-date')
        if (dateStr) {
          hoveredDate = new Date(dateStr)
        }
      }
      
      if (hoveredDate && !isNaN(hoveredDate.getTime())) {
        this.updateHoveredRange(hoveredDate)
      }
    },
    updateHoveredRange(hoveredDate) {
      if (!hoveredDate || isNaN(hoveredDate.getTime())) return
      
      const selectedDates = this.dp.selectedDates || []
      
      // Если уже выбраны две даты, не меняем hoveredRange
      if (selectedDates.length === 2) {
        return
      }
      
      // Если выбрана только одна дата, показываем диапазон от выбранной до наведенной
      if (selectedDates.length === 1) {
        const startDate = selectedDates[0]
        const endDate = hoveredDate
        
        // Определяем правильный порядок дат
        if (endDate < startDate) {
          this.hoveredRange = [new Date(endDate), new Date(startDate)]
        } else {
          this.hoveredRange = [new Date(startDate), new Date(endDate)]
        }
      } else if (selectedDates.length === 0) {
        // Если ничего не выбрано, показываем только наведенную дату
        this.hoveredRange = [new Date(hoveredDate), new Date(hoveredDate)]
      }
    },
    handleCellLeave() {
      // Очищаем hoveredRange при уходе мыши, если ничего не выбрано
      if (!this.dp.selectedDates || this.dp.selectedDates.length === 0) {
        this.hoveredRange = null
      }
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
  .calendar_clear_button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    
    img {
      width: 20px;
      height: 20px;
      opacity: 0.7;
      transition: opacity 0.2s ease;
    }
    
    &:hover img {
      opacity: 1;
    }
  }
}
</style>
