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
            width="600"
            height="600"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @wheel="onWheel"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
          />
        </div>

        <div class="controls">
          <div class="rotation-controls">
            <button @click="rotateImage" class="rotate-btn">↻ Повернуть</button>
          </div>
        </div>
      </div>

      <template #footer>
        <button class="cancel-btn" @click="cancel">Отмена</button>
        <button class="apply-btn" @click="exportAvatar">Готово</button>
      </template>
    </BaseModal>
  </div>
</template>

<script>
import { ref, nextTick, watch, onMounted } from 'vue'
import BaseModal from './BaseModal.vue'

export default {
  name: 'AvatarCropper',
  components: {
    BaseModal
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

    // Watch for file changes
    watch(() => props.file, (newFile) => {
      if (newFile) {
        const img = new Image()
        img.onload = () => {
          image.value = img
          showModal.value = true
          nextTick(() => {
            draw()
          })
        }
        img.src = URL.createObjectURL(newFile)
      }
    }, { immediate: true })

    const draw = () => {
      if (!canvas.value || !image.value) return
      
      const ctx = canvas.value.getContext('2d')
      ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

      // Сначала рисуем полное изображение
      ctx.save()
      ctx.translate(300 + position.value.x, 300 + position.value.y)
      ctx.rotate(rotation.value * Math.PI / 180)
      ctx.scale(scale.value, scale.value)
      ctx.drawImage(image.value, -image.value.width / 2, -image.value.height / 2)
      ctx.restore()

      // Добавляем темное затемнение с вырезом для прямоугольной области
      const radius = cropRadius.value
      const cropX = 300 - radius
      const cropY = 300 - radius
      const cropSize = radius * 2
      
      ctx.save()
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
      
      // Создаем путь с вырезом для прямоугольной области
      ctx.beginPath()
      ctx.rect(0, 0, canvas.value.width, canvas.value.height)
      ctx.rect(cropX, cropY, cropSize, cropSize)
      ctx.fill('evenodd')
      ctx.restore()


      // Рисуем 4 синих квадрата по углам
      const squareSize = 12
      const halfSquare = squareSize / 2
      
      // Координаты углов
      const corners = [
        { x: 300 - radius - halfSquare, y: 300 - radius - halfSquare }, // левый верхний
        { x: 300 + radius - halfSquare, y: 300 - radius - halfSquare }, // правый верхний
        { x: 300 + radius - halfSquare, y: 300 + radius - halfSquare }, // правый нижний
        { x: 300 - radius - halfSquare, y: 300 + radius - halfSquare }  // левый нижний
      ]
      
      // Рисуем квадраты
      ctx.fillStyle = '#3b82f6'
      corners.forEach(corner => {
        ctx.fillRect(corner.x, corner.y, squareSize, squareSize)
      })
      
      // Рисуем синий круг
      ctx.beginPath()
      ctx.arc(300, 300, radius, 0, Math.PI * 2)
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 2
      ctx.stroke()
    }

    const onPointerDown = (e) => {
      const rect = canvas.value.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      // Проверяем, кликнули ли на любой из квадратов для изменения размера
      const squareSize = 12
      const halfSquare = squareSize / 2
      const radius = cropRadius.value
      
      const corners = [
        { x: 300 - radius - halfSquare, y: 300 - radius - halfSquare }, // левый верхний
        { x: 300 + radius - halfSquare, y: 300 - radius - halfSquare }, // правый верхний
        { x: 300 + radius - halfSquare, y: 300 + radius - halfSquare }, // правый нижний
        { x: 300 - radius - halfSquare, y: 300 + radius - halfSquare }  // левый нижний
      ]
      
      let clickedOnSquare = false
      corners.forEach(corner => {
        if (x >= corner.x && x <= corner.x + squareSize && 
            y >= corner.y && y <= corner.y + squareSize) {
          clickedOnSquare = true
        }
      })
      
      if (clickedOnSquare) {
        resizing.value = true
        resizeStart.value.x = e.clientX
        resizeStart.value.y = e.clientY
        resizeStart.value.radius = cropRadius.value
      } else {
        dragging.value = true
        start.value.x = e.clientX - position.value.x
        start.value.y = e.clientY - position.value.y
      }
    }

    const onPointerMove = (e) => {
      if (resizing.value) {
        const deltaX = e.clientX - resizeStart.value.x
        const deltaY = e.clientY - resizeStart.value.y
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        
        // Определяем направление движения относительно центра
        const centerX = 300
        const centerY = 300
        const startDistanceFromCenter = Math.sqrt(
          Math.pow(resizeStart.value.x - centerX, 2) + 
          Math.pow(resizeStart.value.y - centerY, 2)
        )
        const currentDistanceFromCenter = Math.sqrt(
          Math.pow(e.clientX - centerX, 2) + 
          Math.pow(e.clientY - centerY, 2)
        )
        
        // Если тянем от центра - увеличиваем, если к центру - уменьшаем
        const direction = currentDistanceFromCenter > startDistanceFromCenter ? 1 : -1
        const newRadius = Math.max(50, Math.min(300, resizeStart.value.radius + distance * direction))
        cropRadius.value = newRadius
        draw()
      } else if (dragging.value) {
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

    const rotateImage = () => {
      rotation.value += 90
      draw()
    }

    const exportAvatar = () => {
      const size = 256
      const resultCanvas = document.createElement('canvas')
      const ctx = resultCanvas.getContext('2d')
      resultCanvas.width = size
      resultCanvas.height = size

      // Создаем круглую маску для обрезки
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
      ctx.clip()

      // Рассчитываем масштаб и сдвиг относительно исходного canvas
      const radius = cropRadius.value
      const cropX = 300 - radius
      const cropY = 300 - radius
      const cropSize = radius * 2
      
      // Рисуем область обрезки с круглой маской
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
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onWheel,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      rotateImage,
      exportAvatar,
      cancel
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
    margin-bottom: 20px;
    color: #6b7280;
    font-size: 14px;
    line-height: 1.5;

    p {
      margin: 0 0 8px 0;
    }
  }

  .crop-area {
    display: flex;
    justify-content: center;
    margin: 0 auto 20px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #f9fafb;

    canvas {
      border-radius: 8px;
      cursor: grab;
      user-select: none;

      &:active {
        cursor: grabbing;
      }
    }
  }

  .controls {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 0;

    .rotation-controls {
      display: flex;
      gap: 8px;

      .rotate-btn {
        width: 40px;
        height: 40px;
        border: 1px solid #d1d5db;
        background: white;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: #374151;
        transition: all 0.2s ease;

        &:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }
      }
    }
  }
}

.cancel-btn,
.apply-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;

  &:hover {
    background: #e5e7eb;
  }
}

.apply-btn {
  background: #1735f5;
  color: white;
  border: none;

  &:hover {
    background: #1d4ed8;
  }
}

@media (max-width: 768px) {
  .cropper-container {
    .crop-area {
      canvas {
        width: 100%;
        height: auto;
        max-width: 400px;
        max-height: 400px;
      }
    }
  }
}
</style>
