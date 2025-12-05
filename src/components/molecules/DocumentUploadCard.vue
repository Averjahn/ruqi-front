<template>
  <div class="document-upload-card">
    <div class="document-upload-card__header">
      <h3 class="document-upload-card__title">{{ title }}</h3>
      <a 
        v-if="sampleLinkText" 
        href="#" 
        class="document-upload-card__sample-link" 
        @click.prevent="$emit('viewSample', sampleImage)"
      >
        {{ sampleLinkText }}
      </a>
    </div>
    
    <!-- Uploaded File View -->
    <div v-if="file && (file.file || file.name)" class="document-upload-card__uploaded-file">
      <div class="document-upload-card__file-thumbnail" @click="$emit('viewFile')">
        <img 
          v-if="file.preview && (file.isImage === true || file.isImage === undefined)" 
          :src="file.preview || file.file" 
          alt="Document" 
          class="document-upload-card__document-image" 
        />
        <div v-else class="document-upload-card__document-icon">
          <div class="document-upload-card__icon-placeholder">📄</div>
          <span class="document-upload-card__document-type">{{ getFileExtension(file.name || (file.file && file.file.name) || '') }}</span>
        </div>
      </div>
      <div class="document-upload-card__file-info">
        <p class="document-upload-card__file-name">{{ file.name }}</p>
        <p class="document-upload-card__file-size">{{ file.size }}</p>
        <button class="document-upload-card__delete-button" @click="$emit('remove')">
          <img src="@/assets/icons/delete.svg" alt="Delete" class="document-upload-card__delete-icon" />
          Удалить
        </button>
      </div>
    </div>
    
    <!-- Upload Area -->
    <div 
      v-else 
      class="document-upload-card__upload-area"
      :class="{ 'document-upload-card__upload-area--dragover': isDragover }"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <input
        :ref="inputRef"
        type="file"
        :accept="accept"
        style="display: none"
        @change="handleFileSelect"
        @click="(e) => e.target.value = ''"
      />
      <div class="document-upload-card__upload-content">
        <p class="document-upload-card__upload-text">Перетащите файлы сюда или</p>
        <button class="document-upload-card__upload-button" @click="triggerFileInput">
          <div class="document-upload-card__icon-placeholder">📎</div>
          загрузите документы
        </button>
        <p class="document-upload-card__upload-hint">{{ hint || 'Файлы до 5 МВ в форматах PNG, JPG, JPEG, PDF, DOC, DOCX' }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DocumentUploadCard',
  props: {
    title: {
      type: String,
      required: true
    },
    file: {
      type: Object,
      default: null
    },
    sampleLinkText: {
      type: String,
      default: 'Смотреть образец'
    },
    sampleImage: {
      type: String,
      default: null
    },
    hint: {
      type: String,
      default: null
    },
    accept: {
      type: String,
      default: '.png,.jpg,.jpeg,.pdf,.doc,.docx,image/png,image/jpeg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    },
    inputRef: {
      type: String,
      default: 'fileInput'
    }
  },
  emits: ['viewSample', 'viewFile', 'remove', 'upload', 'fileSelected', 'upload-error'],
  data() {
    return {
      isDragover: false
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs[this.inputRef]?.click()
    },
    handleDragOver(event) {
      event.preventDefault()
      this.isDragover = true
    },
    handleDragLeave(event) {
      event.preventDefault()
      this.isDragover = false
    },
    handleDrop(event) {
      event.preventDefault()
      this.isDragover = false
      
      const files = event.dataTransfer.files
      if (files && files.length > 0) {
        this.processFile(files[0])
      }
    },
    handleFileSelect(event) {
      const files = event.target.files
      if (files && files.length > 0) {
        this.processFile(files[0])
      }
    },
    processFile(file) {
      const fileType = file.type || ''
      const fileName = file.name.toLowerCase()
      
      // Проверяем расширения файлов (приоритетная проверка)
      const validExtensions = ['.png', '.jpg', '.jpeg', '.pdf', '.doc', '.docx']
      const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext))
      
      // Если расширение валидное, принимаем файл (независимо от MIME типа)
      if (hasValidExtension) {
        // Продолжаем обработку файла
      } else {
        // Если расширение не валидно, проверяем MIME типы как дополнительную проверку
        const acceptedTypes = this.accept.split(',').map(type => type.trim())
        let isValidMimeType = false
        
        // Проверяем расширения из accept (если они там есть)
        const acceptExtensions = acceptedTypes.filter(type => type.startsWith('.'))
        if (acceptExtensions.length > 0) {
          isValidMimeType = acceptExtensions.some(ext => fileName.endsWith(ext.toLowerCase()))
        }
        
        // Если не нашли по расширению, проверяем MIME типы
        if (!isValidMimeType) {
          isValidMimeType = acceptedTypes.some(type => {
            if (type.startsWith('.')) {
              return false // Уже проверили выше
            }
            // Для MIME типов проверяем точное совпадение
            if (fileType && fileType === type) {
              return true
            }
            // Для image/* проверяем начало
            if (type.startsWith('image/') && fileType && fileType.startsWith('image/')) {
              return true
            }
            // Для application/pdf (разные варианты MIME типов)
            if (type === 'application/pdf' && fileType && 
                (fileType === 'application/pdf' || 
                 fileType === 'application/x-pdf' ||
                 fileType === 'application/acrobat' ||
                 fileType === 'text/pdf')) {
              return true
            }
            // Для DOC
            if (type === 'application/msword' && fileType && 
                (fileType === 'application/msword' || 
                 fileType === 'application/x-msword' ||
                 fileType === 'application/doc' ||
                 fileType === 'application/x-doc')) {
              return true
            }
            // Для DOCX (может определяться как ZIP)
            if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && fileType && 
                (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                 fileType === 'application/zip' ||
                 fileType === 'application/x-zip-compressed')) {
              return true
            }
            return false
          })
        }
        
        if (!isValidMimeType) {
          this.$emit('upload-error', 'Неподдерживаемый формат файла. Разрешены: PNG, JPG, JPEG, PDF, DOC, DOCX')
        return
        }
      }
      
      // Проверка размера (5 МБ)
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$emit('upload-error', 'Размер файла превышает 5 МБ')
        return
      }
      
      // Создание preview
      const isImage = file.type.startsWith('image/') || 
                     fileName.endsWith('.png') || 
                     fileName.endsWith('.jpg') || 
                     fileName.endsWith('.jpeg')
      
      if (isImage) {
        // Для изображений создаем preview
      const reader = new FileReader()
      reader.onload = (e) => {
          const fileData = {
            file: file,
            name: file.name,
            size: this.formatFileSize(file.size),
            preview: e.target.result,
            isImage: true
          }
          this.$emit('fileSelected', fileData)
        }
        reader.readAsDataURL(file)
      } else {
        // Для PDF и DOC файлов не создаем preview, используем null
        const fileData = {
          file: file,
          name: file.name,
          size: this.formatFileSize(file.size),
          preview: null,
          isImage: false
        }
        this.$emit('fileSelected', fileData)
      }
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    },
    getFileExtension(fileName) {
      const parts = fileName.split('.')
      if (parts.length > 1) {
        return parts[parts.length - 1].toUpperCase()
      }
      return 'FILE'
    }
  }
}
</script>

<style lang="scss" scoped>
.document-upload-card {
  padding: 24px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  background: #ffffff;
}

.document-upload-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.document-upload-card__title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.document-upload-card__sample-link {
  font-size: 14px;
  color: #1735f5;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}

.document-upload-card__upload-area {
  border: 1.5px dashed #d1d5db;
  border-radius: 12px;
  text-align: center;
  background: #f9fafb;
  width: 100%;
  height: 116px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: #1735f5;
    background: #f0f4ff;
  }

  &--dragover {
    border-color: #1735f5;
    background: #f0f4ff;
    border-style: solid;
  }
}

.document-upload-card__upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 71px;
}

.document-upload-card__upload-text {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.document-upload-card__upload-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0 4px 0;
  background: none;
  border: none;
  color: #1735f5;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.document-upload-card__icon-placeholder {
  font-size: 14px;
  width: 20px;
  height: 20px;
  margin: 9px 0 5px 0;
}

.document-upload-card__upload-hint {
  font-size: 12px;
  color: #9ca3af;
}

.document-upload-card__uploaded-file {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.document-upload-card__file-thumbnail {
  width: 118px;
  height: 116px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
}

.document-upload-card__document-image {
  width: 118px;
  height: 116px;
  object-fit: cover;
  object-position: center;
}

.document-upload-card__document-icon {
  width: 118px;
  height: 116px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 8px;
  gap: 8px;
}

.document-upload-card__document-type {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
}

.document-upload-card__file-info {
  flex: 1;
}

.document-upload-card__file-name {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.document-upload-card__file-size {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.document-upload-card__delete-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: none;
  border: none;
  color: #dc2626;
  font-size: 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  margin-top: 4px;

  &:hover {
    background: #fef2f2;
  }
}

.document-upload-card__delete-icon {
  width: 14px;
  height: 14px;
  filter: brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%);
}

@media (max-width: 768px) {
  .document-upload-card__upload-area {
    width: 100%;
    height: auto;
    min-height: 116px;
    max-width: none;
  }
}
</style>

