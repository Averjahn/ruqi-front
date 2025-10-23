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
        accept="image/*"
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
          <div class="logo-upload__hint">Рекомендуем использовать изображение размером не менее {{ minWidth }} x {{ minHeight }} пикселей в формате PNG или GIF.</div>
          <div class="logo-upload__hint">Анимированные картинки загружать нельзя.</div>
          <div class="logo-upload__hint">Размер файла – не более {{ formatFileSize(maxSize) }}.</div>
          <button class="logo-upload__upload-link" type="button" @click.stop="openDialog">
            Загрузить
          </button>
        </div>
      </div>
      
      <div v-else class="logo-upload__preview-content">
        <div class="logo-upload__preview-area">
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
      
      // Проверка типа файла
      if (!file.type.startsWith('image/')) {
        this.setError('Пожалуйста, выберите изображение')
        return
      }
      
      // Проверка размера файла
      if (file.size > this.maxSize) {
        this.setError(`Размер файла превышает ${this.formatFileSize(this.maxSize)}`)
        return
      }
      
      // Проверка размеров изображения и открытие модального окна обрезки
      this.validateImageDimensions(file)
    },
    
    validateImageDimensions(file) {
      const img = new Image()
      img.onload = () => {
        if (img.width < this.minWidth || img.height < this.minHeight) {
          this.setError(`Минимальный размер изображения: ${this.minWidth}×${this.minHeight}px. Текущий размер: ${img.width}×${img.height}px`)
          return
        }
        
        // Все проверки пройдены - открываем cropper
        this.pendingFile = file
        this.showCropper = true
      }
      
      img.onerror = () => {
        this.setError('Не удалось загрузить изображение')
      }
      
      img.src = URL.createObjectURL(file)
    },
    
    createPreview(file) {
      this.clearPreview()
      this.previewUrl = URL.createObjectURL(file)
      this.fileName = file.name
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
      // Создаем файл из blob
      const file = new File([blob], this.pendingFile.name, { type: 'image/png' })
      this.$emit('update:modelValue', file)
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
  max-width: 600px;
  margin: 0 auto;

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
  }

  &__upload-area {
    width: 98px;
    height: 98px;
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
    width: 98px;
    height: 98px;
    background: transparent;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
  }

  &__preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    border-radius: 8px;
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
    &__card {
      padding: 16px;
    }

    &__content,
    &__preview-content {
      flex-direction: column;
      gap: 16px;
    }

    &__upload-area,
    &__preview-area {
      width: 80px;
      height: 80px;
      align-self: center;
    }

    &__texts,
    &__preview-texts {
      text-align: center;
    }

    &__upload-link,
    &__remove-link {
      text-align: center;
    }
  }
}

</style>

