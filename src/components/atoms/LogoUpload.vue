<template>
  <div class="logo-upload">
    <div
      class="logo-upload__card"
      :class="{ 
        'logo-upload__card--dragover': isDragOver, 
        'logo-upload__card--error': errorMessage
      }"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @click="openDialog"
    >
      <input
        ref="fileInput"
        class="logo-upload__input"
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        @change="onFileChange"
      />
      
      <div v-if="!hasFile" class="logo-upload__content">
        <div class="logo-upload__upload-area">
          <div class="logo-upload__icon">
            <img src="@/assets/icons/camera.svg" alt="Upload logo" width="40" height="40" />
          </div>
        </div>
        <div class="logo-upload__texts">
          <div class="logo-upload__title">Загрузите логотип компании</div>
          <div class="logo-upload__hint">Рекомендуем использовать изображение размером не менее {{ minWidth }} x {{ minHeight }} пикселей в формате PNG или JPG.</div>
          <div class="logo-upload__hint">Анимированные картинки загружать нельзя.</div>
          <div class="logo-upload__hint">Размер файла – не более 4MB.</div>
          <button class="logo-upload__upload-link" type="button" @click.stop="openDialog">
            Загрузить
          </button>
        </div>
      </div>
      
      <div v-else class="logo-upload__preview-content">
        <div class="logo-upload__preview-area logo-upload__preview-area--has-image" :style="{ background: 'transparent' }">
          <img 
            :src="previewUrl" 
            :alt="fileName" 
            class="logo-upload__preview-image"
          />
        </div>
        <div class="logo-upload__preview-texts">
          <div class="logo-upload__title">Логотип загружен</div>
          <div class="logo-upload__hint">{{ fileName }}</div>
          <button class="logo-upload__upload-link" type="button" @click.stop="openDialog">
            Изменить
          </button>
          <button class="logo-upload__remove-link" type="button" @click.stop="removeFile">
            Удалить
          </button>
        </div>
      </div>
    </div>

    <p v-if="errorMessage" class="logo-upload__error">{{ errorMessage }}</p>

    <!-- Avatar Cropper Modal -->
    <AvatarCropper 
      v-if="showCropper"
      :file="pendingFile"
      @avatar-ready="handleAvatarReady"
      @close="closeCropper"
    />
  </div>
</template>

<script>
import AvatarCropper from './AvatarCropper.vue'

export default {
  name: 'LogoUpload',
  components: {
    AvatarCropper
  },
  props: {
    modelValue: { type: File, default: null },
    maxSize: { type: Number, default: 4 * 1024 * 1024 }, // 4MB по умолчанию
    minWidth: { type: Number, default: 98 },
    minHeight: { type: Number, default: 98 }
  },
  emits: ['update:modelValue', 'error'],
  data() {
    return {
      isDragOver: false,
      errorMessage: '',
      previewUrl: null,
      fileName: '',
      showCropper: false,
      pendingFile: null
    }
  },
  computed: {
    hasFile() {
      return this.modelValue && this.previewUrl
    }
  },
  watch: {
    modelValue(newFile) {
      // console.log('📁 modelValue изменился:', newFile)
      if (newFile) {
        this.createPreview(newFile)
      } else {
        this.clearPreview()
      }
    }
  },
  mounted() {
    if (this.modelValue) {
      this.createPreview(this.modelValue)
    }
  },
  beforeUnmount() {
    this.clearPreview()
  },
  methods: {
    openDialog() {
      this.$refs.fileInput && this.$refs.fileInput.click()
    },
    
    onDragOver() {
      this.isDragOver = true
      this.clearError()
    },
    
    onDragLeave() {
      this.isDragOver = false
    },
    
    onDrop(e) {
      this.isDragOver = false
      const files = Array.from(e.dataTransfer.files || [])
      if (files.length > 0) {
        this.handleFile(files[0])
      }
    },
    
    onFileChange(e) {
      const files = Array.from(e.target.files || [])
      if (files.length > 0) {
        this.handleFile(files[0])
      }
      // Сброс input для возможности повторного выбора того же файла
      e.target.value = ''
    },
    
    handleFile(file) {
      this.clearError()
      
      // Проверка типа файла - только PNG и JPG
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
      if (!allowedTypes.includes(file.type)) {
        this.setError('Пожалуйста, выберите изображение в формате PNG или JPG')
        return
      }
      
      // Проверка размера файла (4MB = 4 * 1024 * 1024 байт)
      const maxSizeBytes = 4 * 1024 * 1024
      if (file.size > maxSizeBytes) {
        this.setError(`Размер файла превышает 4MB. Текущий размер: ${this.formatFileSize(file.size)}`)
        return
      }
      
      // Проверка размеров изображения и открытие модального окна обрезки
      this.validateImageDimensions(file)
    },
    
    validateImageDimensions(file) {
      // console.log('🔍 validateImageDimensions для файла:', file.name, file.size, 'байт')
      const img = new Image()
      img.onload = () => {
        // console.log('📐 Размеры изображения:', img.width, 'x', img.height, 'px')
        // console.log('📏 Минимальные требования:', this.minWidth, 'x', this.minHeight, 'px')
        
        if (img.width < this.minWidth || img.height < this.minHeight) {
          // console.log('❌ Изображение слишком маленькое')
          this.setError(`Минимальный размер изображения: ${this.minWidth}×${this.minHeight}px. Текущий размер: ${img.width}×${img.height}px`)
          return
        }
        
        // console.log('✅ Все проверки пройдены - открываем cropper')
        // Все проверки пройдены - открываем cropper
        this.pendingFile = file
        this.showCropper = true
      }
      
      img.onerror = () => {
        // console.log('❌ Ошибка загрузки изображения')
        this.setError('Не удалось загрузить изображение')
      }
      
      img.src = URL.createObjectURL(file)
    },
    
    createPreview(file) {
      this.clearPreview()
      if (file) {
        this.previewUrl = URL.createObjectURL(file)
        this.fileName = file.name
        // console.log('🖼️ Создан превью для файла:', file.name, 'Размер:', file.size, 'байт')
      }
    },
    
    clearPreview() {
      if (this.previewUrl) {
        URL.revokeObjectURL(this.previewUrl)
        this.previewUrl = null
        this.fileName = ''
      }
    },
    
    removeFile() {
      this.$emit('update:modelValue', null)
      this.clearPreview()
      this.clearError()
    },
    
    setError(message) {
      this.errorMessage = message
      this.$emit('error', message)
    },
    
    clearError() {
      this.errorMessage = ''
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    },

    // Cropper methods
    handleAvatarReady({ blob, dataUrl }) {
      // console.log('🎯 handleAvatarReady вызван с:', { blob, dataUrl })
      // Создаем файл из blob
      const file = new File([blob], this.pendingFile.name, { type: 'image/png' })
      // console.log('📁 Создан файл из blob:', file.name, file.size, 'байт')
      this.$emit('update:modelValue', file)
      // console.log('📤 Эмитирован update:modelValue с файлом:', file.name)
      this.createPreview(file)
      this.closeCropper()
    },

    closeCropper() {
      this.showCropper = false
      this.pendingFile = null
    }
  }
}
</script>

<style lang="scss" scoped>
.logo-upload {
  width: 100%;
  max-width: 100%;
  margin: 0;

  &__card {
    position: relative;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #ffffff;
    padding: 24px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);

    &--dragover {
      border-color: #1735f5;
      background: #f0f4ff;
    }

    &--error {
      border-color: #dc2626;
      background: #fef2f2;
    }
  }

  &__input {
    display: none;
  }

  &__content {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    width: 100%;
  }

  &__upload-area {
    width: 120px;
    height: 120px;
    background: #f3f4f6;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    img {
      width: 40px;
      height: 40px;
    }
  }

  &__texts {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  &__hint {
    font-size: 14px;
    color: #6b7280;
    line-height: 1.4;
    margin: 0;
  }

  &__upload-link {
    background: none;
    border: none;
    color: #1735f5;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    padding: 0;
    text-align: left;
    margin-top: 8px;

    &:hover {
      text-decoration: underline;
    }
  }

  &__remove-link {
    background: none;
    border: none;
    color: #dc2626;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    padding: 0;
    text-align: left;
    margin-top: 4px;

    &:hover {
      text-decoration: underline;
    }
  }

  &__preview-content {
    display: flex;
    align-items: flex-start;
    gap: 20px;
  }

  &__preview-area {
    width: 120px;
    height: 120px;
    background: #f3f4f6;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;

    &--has-image {
      background: transparent !important;
    }
  }

  &__preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    border-radius: 8px;
    display: block;
    max-width: 120px;
    max-height: 120px;
  }

  &__preview-texts {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__error {
    color: #dc2626;
    font-size: 14px;
    margin-top: 12px;
    text-align: left;
  }
}

@media (max-width: 768px) {
  .logo-upload {
    max-width: 100%;
    
    &__card {
      padding: 16px;
      border-radius: 8px;
    }

    &__content,
    &__preview-content {
      flex-direction: row; // Иконка слева, текст справа
      gap: 16px;
      align-items: flex-start; // Выравнивание по верхнему краю
    }

    &__upload-area,
    &__preview-area {
      width: 64px; // Минимальный размер 64x64px
      height: 64px; // Минимальный размер 64x64px
      flex-shrink: 0; // Не сжимается
      border-radius: 8px;
    }

    &__icon {
      width: 28px; // Размер иконки камеры
      height: 28px;
      
      img {
        width: 28px;
        height: 28px;
      }
    }

    &__texts,
    &__preview-texts {
      text-align: left; // Текст слева
      flex: 1; // Занимает оставшееся место
      min-width: 0; // Позволяет тексту сжиматься
    }

    &__title {
      font-size: 16px;
      margin-bottom: 8px;
      font-weight: 600;
      line-height: 1.2;
    }

    &__hint {
      font-size: 13px;
      line-height: 1.3;
      margin-bottom: 4px;
      color: #6b7280;
    }

    &__upload-link,
    &__remove-link {
      text-align: left;
      margin-top: 8px;
      font-size: 14px;
      display: inline-block;
    }

    &__upload-link {
      color: #1735f5;
      font-weight: 500;
    }

    &__remove-link {
      color: #dc2626;
      font-weight: 500;
    }

    &__preview-image {
      max-width: 64px;
      max-height: 64px;
      border-radius: 8px;
    }
  }
}

</style>

