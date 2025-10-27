<template>
  <div class="avatar-cropper">
    <BaseModal
      v-model="showModal"
      title="Настройка фото логотипа"
      width="800px"
    >
      <div class="cropper-container">
        <div class="instructions">
          <p>Выбранная область будет выводиться на карточке заявки.</p>
          <p>Если изображение ориентировано неправильно, фотографию можно повернуть.</p>
        </div>

        <div class="crop-area">
          <canvas
            ref="canvas"
            width="752"
            height="400"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @wheel="onWheel"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
          />
          
          <!-- SVG слой -->
          <svg
            class="crop-overlay"
            width="752"
            height="400"
            style="position: absolute; top: 0; left: 0;"
          >
            <defs>
              <mask id="crop-mask">
                <rect width="752" height="400" fill="white" />
                <circle :cx="center.x" :cy="center.y" :r="cropRadius" fill="black" />
              </mask>
            </defs>

            <!-- Затемнение -->
            <rect
              width="752"
              height="400"
              fill="rgba(0, 0, 0, 0.6)"
              mask="url(#crop-mask)"
              style="pointer-events: none;"
            />

            <!-- Круг -->
            <circle
              :cx="center.x"
              :cy="center.y"
              :r="cropRadius"
              fill="none"
              stroke="#3b82f6"
              stroke-width="2"
              style="pointer-events: none;"
            />

            <!-- Полоски между квадратами -->
            <rect
              :x="center.x - cropRadius - 1"
              :y="center.y - cropRadius - 1"
              :width="cropRadius * 2 + 2"
              :height="2"
              fill="#3b82f6"
              class="resize-handle"
              data-handle="top"
              @pointerdown="onResizeStart"
            />
            <rect
              :x="center.x - cropRadius - 1"
              :y="center.y + cropRadius - 1"
              :width="cropRadius * 2 + 2"
              :height="2"
              fill="#3b82f6"
              class="resize-handle"
              data-handle="bottom"
              @pointerdown="onResizeStart"
            />
            <rect
              :x="center.x - cropRadius - 1"
              :y="center.y - cropRadius - 1"
              :width="2"
              :height="cropRadius * 2 + 2"
              fill="#3b82f6"
              class="resize-handle"
              data-handle="left"
              @pointerdown="onResizeStart"
            />
            <rect
              :x="center.x + cropRadius - 1"
              :y="center.y - cropRadius - 1"
              :width="2"
              :height="cropRadius * 2 + 2"
              fill="#3b82f6"
              class="resize-handle"
              data-handle="right"
              @pointerdown="onResizeStart"
            />

            <!-- Квадраты -->
            <rect
              v-for="(handle, i) in handles"
              :key="i"
              :x="handle.x - 6"
              :y="handle.y - 6"
              width="12"
              height="12"
              fill="#3b82f6"
              class="resize-handle corner-handle"
              :data-handle="handle.name"
              @pointerdown="onResizeStart"
            />
          </svg>

          <!-- Кнопки поворота -->
          <div class="rotation-buttons">
            <img
              class="rotate-icon rotate-left"
              src="@/assets/icons/rotate-left.svg"
              alt="Повернуть влево"
              @click="rotateLeft"
              title="Повернуть влево"
            />
            <img
              class="rotate-icon rotate-right"
              src="@/assets/icons/rotate-right.svg"
              alt="Повернуть вправо"
              @click="rotateRight"
              title="Повернуть вправо"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <MainButton type="primary-outline" text="Отмена" @click="cancel" />
        <MainButton type="primary" text="Готово" @click="exportAvatar" />
      </template>
    </BaseModal>
  </div>
</template>

<script>
import { ref, computed, nextTick, watch } from 'vue'
import BaseModal from './BaseModal.vue'
import MainButton from './MainButton.vue'

export default {
  name: 'AvatarCropper',
  components: {
    BaseModal,
    MainButton
  },
  props: {
    file: {
      type: File,
      default: null
    }
  },
  emits: ['avatar-ready', 'close'],
  setup(props, { emit }) {
    const showModal = ref(false)
    const image = ref(null)
    const canvas = ref(null)
    const position = ref({ x: 0, y: 0 })
    const scale = ref(1)
    const rotation = ref(0)
    const dragging = ref(false)
    const start = ref({ x: 0, y: 0 })
    const cropRadius = ref(150)
    const resizing = ref(false)
    const resizeStart = ref({ x: 0, y: 0, radius: 0 })

    const canvasWidth = 752
    const canvasHeight = 400
    const center = ref({ x: canvasWidth / 2, y: canvasHeight / 2 })

    // Динамические углы квадратиков
    const handles = computed(() => [
      { name: 'top-left', x: center.value.x - cropRadius.value, y: center.value.y - cropRadius.value },
      { name: 'top-right', x: center.value.x + cropRadius.value, y: center.value.y - cropRadius.value },
      { name: 'bottom-right', x: center.value.x + cropRadius.value, y: center.value.y + cropRadius.value },
      { name: 'bottom-left', x: center.value.x - cropRadius.value, y: center.value.y + cropRadius.value }
    ])

    // Watch for file changes
    watch(() => props.file, (newFile) => {
      if (newFile) {
        const img = new Image()
        img.onload = () => {
          image.value = img
          showModal.value = true
          nextTick(draw)
        }
        img.src = URL.createObjectURL(newFile)
      }
    }, { immediate: true })

    const draw = () => {
      if (!canvas.value || !image.value) return
      const ctx = canvas.value.getContext('2d')
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)
      ctx.save()
      ctx.translate(center.value.x + position.value.x, center.value.y + position.value.y)
      ctx.rotate(rotation.value * Math.PI / 180)
      ctx.scale(scale.value, scale.value)
      ctx.drawImage(image.value, -image.value.width / 2, -image.value.height / 2)
      ctx.restore()
    }

    // === Перетаскивание ===
    const onPointerDown = (e) => {
      e.preventDefault()
      dragging.value = true
      start.value.x = e.clientX - position.value.x
      start.value.y = e.clientY - position.value.y
    }

    const onPointerMove = (e) => {
      if (resizing.value) return
      if (dragging.value) {
        position.value.x = e.clientX - start.value.x
        position.value.y = e.clientY - start.value.y
        draw()
      }
    }

    const onPointerUp = () => {
      dragging.value = false
      resizing.value = false
    }

    const onWheel = (e) => {
      e.preventDefault()
      scale.value = Math.min(3, Math.max(0.5, scale.value + e.deltaY * -0.001))
      draw()
    }

    // === Touch Events ===
    const onTouchStart = (e) => {
      e.preventDefault()
      if (e.touches.length === 1) {
        const touch = e.touches[0]
        dragging.value = true
        start.value.x = touch.clientX - position.value.x
        start.value.y = touch.clientY - position.value.y
      }
    }

    const onTouchMove = (e) => {
      e.preventDefault()
      if (dragging.value && e.touches.length === 1) {
        const touch = e.touches[0]
        position.value.x = touch.clientX - start.value.x
        position.value.y = touch.clientY - start.value.y
        draw()
      }
    }

    const onTouchEnd = (e) => {
      e.preventDefault()
      dragging.value = false
    }

    // === Поворот ===
    const rotateLeft = () => {
      rotation.value -= 90
      draw()
    }

    const rotateRight = () => {
      rotation.value += 90
      draw()
    }

    // === Изменение размера области ===
    const onResizeStart = (e, handle) => {
      e.preventDefault()
      e.stopPropagation()
      resizing.value = true
      dragging.value = false

      const rect = canvas.value.getBoundingClientRect()
      resizeStart.value.x = e.clientX - rect.left
      resizeStart.value.y = e.clientY - rect.top
      resizeStart.value.radius = cropRadius.value

      document.addEventListener('pointermove', onResizeMove)
      document.addEventListener('pointerup', onResizeEnd)
    }

    const onResizeMove = (e) => {
      if (!resizing.value) return

      const rect = canvas.value.getBoundingClientRect()
      const currentX = e.clientX - rect.left
      const currentY = e.clientY - rect.top

      const startDistance = Math.hypot(resizeStart.value.x - center.value.x, resizeStart.value.y - center.value.y)
      const currentDistance = Math.hypot(currentX - center.value.x, currentY - center.value.y)
      const delta = currentDistance - startDistance

      cropRadius.value = Math.max(50, Math.min(300, resizeStart.value.radius + delta))
      draw()
    }

    const onResizeEnd = () => {
      resizing.value = false
      document.removeEventListener('pointermove', onResizeMove)
      document.removeEventListener('pointerup', onResizeEnd)
    }

    // === Экспорт ===
    const exportAvatar = () => {
      const size = 256
      const resultCanvas = document.createElement('canvas')
      const ctx = resultCanvas.getContext('2d')
      resultCanvas.width = size
      resultCanvas.height = size
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
      ctx.clip()

      const radius = cropRadius.value
      const cropX = center.value.x - radius
      const cropY = center.value.y - radius
      const cropSize = radius * 2

      ctx.drawImage(canvas.value, cropX, cropY, cropSize, cropSize, 0, 0, size, size)

      resultCanvas.toBlob((blob) => {
        const dataUrl = resultCanvas.toDataURL('image/png')
        emit('avatar-ready', { blob, dataUrl })
        cancel()
      }, 'image/png')
    }

    const cancel = () => {
      showModal.value = false
      image.value = null
      position.value = { x: 0, y: 0 }
      scale.value = 1
      rotation.value = 0
      cropRadius.value = 150
      emit('close')
    }

    return {
      showModal,
      canvas,
      center,
      cropRadius,
      handles,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onWheel,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      rotateLeft,
      rotateRight,
      exportAvatar,
      cancel,
      onResizeStart
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-cropper {
  display: contents;
}

.cropper-container {
  .instructions {
    margin-bottom: 12px;
    color: #6b7280;
    font-size: 12px;
    line-height: 1.4;

    p {
      margin: 0 0 4px 0;
    }
  }

  .crop-area {
    position: relative;
    display: flex;
    justify-content: center;
    margin: 0 auto 12px;
    border: 1px solid #e5e7eb;
    background: #f9fafb;
    max-height: 50vh;
    overflow: hidden;

    canvas {
      border-radius: 8px;
      cursor: grab;
      user-select: none;
      max-width: 100%;
      height: auto;

      &:active {
        cursor: grabbing;
      }
    }

    .crop-overlay {
      border-radius: 8px;
      z-index: 1;
      pointer-events: none;

      .resize-handle {
        pointer-events: all;
        cursor: pointer;
        transition: none !important;

        &.corner-handle:hover {
          fill: #2563eb;
        }

        &.corner-handle:active {
          fill: #1d4ed8;
          transform: scale(1);
        }

        &[data-handle="top-left"],
        &[data-handle="bottom-right"] {
          cursor: nwse-resize;
        }

        &[data-handle="top-right"],
        &[data-handle="bottom-left"] {
          cursor: nesw-resize;
        }

        &[data-handle="top"],
        &[data-handle="bottom"] {
          cursor: ns-resize;
        }

        &[data-handle="left"],
        &[data-handle="right"] {
          cursor: ew-resize;
        }
      }
    }

    .rotation-buttons {
      position: absolute;
      bottom: 8px;
      right: 8px;
      display: flex;
      gap: 8px;
      z-index: 10;

      .rotate-icon {
        width: 28px;
        height: 28px;
        cursor: pointer;
        transition: all 0.2s ease;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
        
        &:hover {
          transform: scale(1.05);
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
        }

        &:active {
          transform: scale(0.95);
        }
      }
    }
  }
}

@media (max-height: 900px) {
  .cropper-container {
    .crop-area {
      max-height: 45vh;
      canvas {
        width: auto;
        height: auto;
        max-width: 600px;
        max-height: 350px;
      }
    }
    
    .instructions {
      margin-bottom: 8px;
      font-size: 11px;
    }
    
    .rotation-buttons {
      bottom: 6px;
      right: 6px;
      
      .rotate-icon {
        width: 24px;
        height: 24px;
      }
    }
  }
}

@media (max-width: 768px) {
  .cropper-container {
    .instructions {
      margin-bottom: 8px;
      font-size: 11px;
    }
    
    .crop-area {
      max-height: 60vh;
      margin-bottom: 8px;
      
      canvas {
        width: 100%;
        height: auto;
        max-width: 400px;
        max-height: 300px;
      }
    }
    
    .rotation-buttons {
      bottom: 4px;
      right: 4px;
      gap: 6px;
      
      .rotate-icon {
        width: 22px;
        height: 22px;
      }
    }
  }
}
</style>
