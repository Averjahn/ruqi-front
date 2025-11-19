<template>
  <Teleport to="body">
    <Transition name="filter-modal">
      <div v-if="show" class="object-map-modal-overlay" @click="handleOverlayClick">
        <div class="object-map-modal" @click.stop>
          <!-- Swipe Indicator (Mobile only) -->
          <div class="object-map-modal__swipe-indicator"></div>
          
          <!-- Header -->
          <div class="object-map-modal__header">
            <button
              class="object-map-modal__menu-button"
              @click="handleMenuClick"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="4" r="1.5" fill="currentColor"/>
                <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
              </svg>
            </button>
            <div class="object-map-modal__title-wrapper">
              <img 
                src="@/assets/icons/profile/3dots.svg" 
                alt="Menu" 
                class="object-map-modal__title-icon"
              />
              <h2 class="object-map-modal__title">{{ objectData?.name || 'Объект' }}</h2>
            </div>
            <button
              class="object-map-modal__close-button"
              @click="handleClose"
            >
              <img
                src="@/assets/icons/cross_black.svg"
                alt="Close"
                class="object-map-modal__close-icon"
              />
            </button>
          </div>

          <!-- Content -->
          <div class="object-map-modal__content">
            <!-- Address -->
            <div class="object-map-modal__address">
              {{ objectData?.address || 'Россия, Москва ул. Генерала Горбатого 34' }}
            </div>

            <!-- Metrics -->
            <div class="object-map-modal__metrics">
              <div class="object-map-modal__metric-item">
                <span class="object-map-modal__metric-label">Заявки</span>
                <span class="object-map-modal__metric-value">{{ objectData?.applications || 0 }}</span>
              </div>
              <div class="object-map-modal__metric-item">
                <span class="object-map-modal__metric-label">Ср. выход</span>
                <span class="object-map-modal__metric-value">{{ objectData?.avgOutput || 0 }}</span>
              </div>
              <div class="object-map-modal__metric-item">
                <span class="object-map-modal__metric-label">Выход</span>
                <span class="object-map-modal__metric-value">{{ objectData?.output || 0 }}</span>
              </div>
              <div class="object-map-modal__metric-item">
                <span class="object-map-modal__metric-label">% выхода</span>
                <span class="object-map-modal__metric-value object-map-modal__metric-value--red">{{ objectData?.exitPercent || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- Home Indicator Spacer (Mobile only) -->
          <div class="object-map-modal__home-indicator"></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
export default {
  name: 'ObjectMapModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    objectData: {
      type: Object,
      default: () => ({
        name: null,
        address: null,
        applications: 0,
        avgOutput: 0,
        output: 0,
        exitPercent: 0
      })
    }
  },
  emits: ['close', 'menu-click'],
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
    handleMenuClick() {
      this.$emit('menu-click', this.objectData)
    }
  }
}
</script>

<style lang="scss" scoped>
.object-map-modal-overlay {
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

  @media (min-width: 769px) {
    align-items: center;
  }
}

.object-map-modal {
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
  border: 1px solid rgba(0, 0, 0, 0.1);

  @media (min-width: 769px) {
    max-width: 400px;
    border-radius: 8px;
    max-height: 80vh;
  }
}

.object-map-modal__swipe-indicator {
  width: 36px;
  height: 4px;
  background: #D5D5D6;
  border-radius: 5px;
  margin: 12px auto 8px;
  flex-shrink: 0;

  @media (min-width: 769px) {
    display: none;
  }
}

.object-map-modal__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #E3E5E4;
  position: relative;
  flex-shrink: 0;
}

.object-map-modal__title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.object-map-modal__title-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  object-fit: contain;
}

.object-map-modal__menu-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  color: #263043;

  @media (min-width: 769px) {
    display: none;
  }
}

.object-map-modal__title {
  font-family: 'Source Sans Pro', 'Source Sans 3', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.25;
  color: #263043;
  margin: 0;
  flex: 1;
  text-align: left;
}

.object-map-modal__close-button {
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

.object-map-modal__close-icon {
  width: 15.5px;
  height: 15.5px;
  object-fit: contain;
}

.object-map-modal__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 16px;
  flex: 1;
  overflow-y: auto;
}

.object-map-modal__address {
  font-family: 'Source Sans Pro', 'Source Sans 3', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.25;
  color: #263043;
  padding: 0;
  margin: 0;
  border: none;
}

.object-map-modal__metrics {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.object-map-modal__metric-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  line-height: 22px;
}

.object-map-modal__metric-label {
  font-family: 'Source Sans Pro', 'Source Sans 3', 'Source Sans', sans-serif;
  font-weight: 400;
  color: #666666;
  letter-spacing: 0.1px;
}

.object-map-modal__metric-value {
  font-family: 'Source Sans Pro', 'Source Sans 3', 'Source Sans', sans-serif;
  font-weight: 600;
  color: #263043;
  line-height: 1.25;

  &--red {
    color: #EB4D3D;
  }
}

.object-map-modal__home-indicator {
  height: 34px;
  flex-shrink: 0;
  position: relative;

  @media (min-width: 769px) {
    display: none;
  }

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

.filter-modal-enter-active .object-map-modal,
.filter-modal-leave-active .object-map-modal {
  transition: transform 0.3s ease;
}

.filter-modal-enter-from,
.filter-modal-leave-to {
  opacity: 0;

  .object-map-modal {
    transform: translateY(100%);

    @media (min-width: 769px) {
      transform: scale(0.95);
    }
  }
}

.filter-modal-enter-to,
.filter-modal-leave-from {
  opacity: 1;

  .object-map-modal {
    transform: translateY(0);

    @media (min-width: 769px) {
      transform: scale(1);
    }
  }
}
</style>

