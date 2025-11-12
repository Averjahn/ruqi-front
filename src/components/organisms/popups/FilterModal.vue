<template>
  <Teleport to="body">
    <Transition name="filter-modal">
      <div v-if="show" class="filter-modal-overlay" @click="handleOverlayClick">
        <div class="filter-modal" @click.stop>
          <!-- Swipe Indicator -->
          <div class="filter-modal__swipe-indicator"></div>
          
          <!-- Header -->
          <div class="filter-modal__header">
            <h2 class="filter-modal__title">Фильтры</h2>
            <button
              class="filter-modal__close-button"
              @click="handleClose"
            >
              <img
                src="@/assets/icons/cross_black.svg"
                alt="Close"
                class="filter-modal__close-icon"
              />
            </button>
          </div>

          <!-- Content -->
          <div class="filter-modal__content">
            <!-- Date Filter -->
            <div class="filter-modal__filter-item">
              <DatePicker
                :date="date"
                @update:date="handleDateUpdate"
                placeholder="Дата"
                class="filter-modal__date-input"
              />
            </div>

            <!-- Status Filter -->
            <div class="filter-modal__filter-item">
              <Input
                :model-value="status || 'Подписан'"
                placeholder="Статус"
                readonly
                class="filter-modal__status-input"
                @click="handleStatusClick"
              >
                <template #right>
                  <button
                    v-if="status"
                    class="filter-modal__clear-button"
                    @click.stop="handleClearStatus"
                  >
                    <img src="@/assets/icons/cross.svg" alt="Clear" class="filter-modal__clear-icon" />
                  </button>
                  <img src="@/assets/icons/profile/arrow-icon.svg" alt="Dropdown" class="filter-modal__dropdown-icon" />
                </template>
              </Input>
            </div>
          </div>

          <!-- Footer -->
          <div class="filter-modal__footer">
            <Button
              type="outlined"
              color="blue"
              size="m"
              @click="handleReset"
              class="filter-modal__reset-button"
            >
              Сбросить
            </Button>
            <Button
              type="contained"
              color="blue"
              size="m"
              @click="handleApply"
              class="filter-modal__apply-button"
            >
              Применить
            </Button>
          </div>

          <!-- Home Indicator Spacer -->
          <div class="filter-modal__home-indicator"></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import DatePicker from '@/components/atoms/DatePicker.vue'
import Input from '@/components/atoms/Input.vue'
import Button from '@/components/atoms/Button.vue'

export default {
  name: 'FilterModal',
  components: {
    DatePicker,
    Input,
    Button
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      default: ''
    }
  },
  emits: ['close', 'apply', 'reset', 'update:date', 'update:status'],
  mounted() {
    if (this.show) {
      document.body.classList.add('filter-modal-open')
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        document.body.classList.add('filter-modal-open')
      } else {
        document.body.classList.remove('filter-modal-open')
      }
    }
  },
  beforeUnmount() {
    document.body.classList.remove('filter-modal-open')
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleOverlayClick() {
      this.handleClose()
    },
    handleDateUpdate(date) {
      // Создаем чистый Date объект, чтобы избежать циклических ссылок
      if (date) {
        const cleanDate = date instanceof Date ? new Date(date.getTime()) : new Date(date)
        this.$emit('update:date', cleanDate)
      } else {
        this.$emit('update:date', null)
      }
    },
    handleClearDate() {
      this.$emit('update:date', null)
    },
    handleStatusClick() {
      // TODO: Open status dropdown
    },
    handleClearStatus() {
      this.$emit('update:status', '')
    },
    handleReset() {
      this.$emit('reset')
    },
    handleApply() {
      // Создаем чистый Date объект, чтобы избежать циклических ссылок
      let cleanDate = null
      if (this.date) {
        cleanDate = this.date instanceof Date ? new Date(this.date.getTime()) : new Date(this.date)
      }
      
      this.$emit('apply', {
        date: cleanDate,
        status: this.status
      })
      this.handleClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
}

.filter-modal {
  position: relative;
  width: 100%;
  max-width: 100vw;
  background: #ffffff;
  border-radius: 24px 24px 0 0;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 10px 0px rgba(23, 53, 245, 0.03), 0px 8px 48px 4px rgba(2, 52, 227, 0.04);
  max-height: 90vh;
  overflow-y: auto;
}

.filter-modal__swipe-indicator {
  width: 36px;
  height: 4px;
  background: #D5D5D6;
  border-radius: 5px;
  margin: 12px auto 8px;
  flex-shrink: 0;
}

.filter-modal__header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 0;
  position: relative;
  flex-shrink: 0;
}

.filter-modal__title {
  font-family: 'Source Sans Pro', 'Source Sans 3', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;
  color: #263043;
  margin: 0;
  text-align: center;
}

.filter-modal__close-button {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}

.filter-modal__close-icon {
  width: 15.5px;
  height: 15.5px;
  object-fit: contain;
}

.filter-modal__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px 20px;
  flex: 1;
  overflow-y: auto;
}

.filter-modal__filter-item {
  width: 100%;
}

.filter-modal__date-input,
.filter-modal__status-input {
  width: 100%;
}

.filter-modal__clear-button {
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
}

.filter-modal__clear-icon {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
}

.filter-modal__dropdown-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.filter-modal__footer {
  display: flex;
  gap: 16px;
  padding: 12px 20px;
  flex-shrink: 0;

  :deep(.rq_button) {
    flex: 1;
  }
}

.filter-modal__home-indicator {
  height: 34px;
  flex-shrink: 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 134px;
    height: 5px;
    background: #000000;
    border-radius: 100px;
  }
}

// Transitions
.filter-modal-enter-active,
.filter-modal-leave-active {
  transition: opacity 0.3s ease;
}

.filter-modal-enter-active .filter-modal,
.filter-modal-leave-active .filter-modal {
  transition: transform 0.3s ease;
}

.filter-modal-enter-from,
.filter-modal-leave-to {
  opacity: 0;

  .filter-modal {
    transform: translateY(100%);
  }
}

.filter-modal-enter-to,
.filter-modal-leave-from {
  opacity: 1;

  .filter-modal {
    transform: translateY(0);
  }
}

// Увеличиваем z-index для календаря внутри модального окна
// AirDatepicker рендерится в body, поэтому используем глобальный стиль
</style>

<style lang="scss">
// Глобальный стиль для календаря, когда модальное окно фильтров открыто
body.filter-modal-open .air-datepicker {
  z-index: 2100 !important;
  position: fixed !important;
}

// Также для класса rq_calendar_range
body.filter-modal-open .rq_calendar_range {
  z-index: 2100 !important;
  position: fixed !important;
}
</style>

