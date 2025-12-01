<template>
  <div class="photo-upload-card">
    <!-- Верхняя панель с действиями -->
    <div class="photo-upload-card__header">
      <div class="photo-upload-card__actions-left">
        <img src="@/assets/icons/profile/reorder-dots.svg" alt="Reorder" class="photo-upload-card__reorder-icon" />
      </div>
      <button class="photo-upload-card__delete-button" @click="$emit('delete')">
        <img src="@/assets/icons/trash.svg" alt="Delete" />
      </button>
    </div>

    <!-- Основной контент карточки -->
    <div class="photo-upload-card__content">
      <!-- Левая часть: области загрузки -->
      <div class="photo-upload-card__upload-areas">
        <!-- Основная фотография -->
        <div 
          class="photo-upload-card__upload-main" 
          @click="triggerMainPhotoInput"
          @dragover.prevent="onDragOverMain"
          @dragleave.prevent="onDragLeaveMain"
          @drop.prevent="onDropMain"
        >
          <input
            ref="mainPhotoInput"
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            style="display: none"
            @change="handleMainPhotoChange"
          />
          <img v-if="mainImage" :src="mainImage" alt="Main photo" class="photo-upload-card__preview" />
          <div v-else class="photo-upload-card__upload-placeholder">
            <img src="@/assets/icons/profile/Add.svg" alt="Add" />
            <span>Добавить фото</span>
          </div>
        </div>
        <!-- Миниатюра -->
        <div 
          class="photo-upload-card__upload-thumbnail" 
          @click="triggerThumbnailInput"
          @dragover.prevent="onDragOverThumbnail"
          @dragleave.prevent="onDragLeaveThumbnail"
          @drop.prevent="onDropThumbnail"
        >
          <input
            ref="thumbnailInput"
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            style="display: none"
            @change="handleThumbnailChange"
          />
          <img v-if="thumbnail" :src="thumbnail" alt="Thumbnail" class="photo-upload-card__preview" />
          <div v-else class="photo-upload-card__upload-placeholder">
            <img src="@/assets/icons/profile/Edit.svg" alt="Edit" />
            <span>Миниатюра</span>
          </div>
        </div>
      </div>

      <!-- Правая часть: поля ввода -->
      <div class="photo-upload-card__fields">
        <div class="photo-upload-card__field">
          <label>Заголовок*</label>
          <Input
            :model-value="title"
            @update:model-value="$emit('update:title', $event)"
            placeholder="Введите значение"
          />
        </div>
        <div class="photo-upload-card__field">
          <div class="photo-upload-card__field-header">
            <label>Описание</label>
          </div>
          <div class="photo-upload-card__textarea-wrapper">
            <Textarea
              :model-value="description"
              @update:model-value="$emit('update:description', $event)"
              placeholder="Введите описание"
              :maxlength="200"
              :height="'100px'"
            />
            <div class="photo-upload-card__char-counter">
              {{ (description || '').length }}/200
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Input from '@/components/atoms/Input.vue'
import Textarea from '@/components/atoms/Textarea.vue'

export default {
  name: 'PhotoUploadCard',
  components: {
    Input,
    Textarea
  },
  props: {
    mainImage: {
      type: String,
      default: null
    },
    thumbnail: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  },
  emits: ['update:mainImage', 'update:thumbnail', 'update:title', 'update:description', 'delete', 'generate-image', 'generate-description'],
  data() {
    return {
      isDragOverMain: false,
      isDragOverThumbnail: false
    }
  },
  methods: {
    triggerMainPhotoInput() {
      this.$refs.mainPhotoInput?.click()
    },
    triggerThumbnailInput() {
      this.$refs.thumbnailInput?.click()
    },
    handleMainPhotoChange(event) {
      const file = event.target.files?.[0]
      if (file) {
        this.handleFileUpload(file, 'main')
      }
    },
    handleThumbnailChange(event) {
      const file = event.target.files?.[0]
      if (file) {
        this.handleFileUpload(file, 'thumbnail')
      }
    },
    handleFileUpload(file, type) {
      // Проверка типа файла
      if (!file.type.match('image.*')) {
        console.error('Файл должен быть изображением')
        return
      }

      // Проверка размера (20 МБ)
      const maxSize = 20 * 1024 * 1024
      if (file.size > maxSize) {
        console.error('Размер файла не должен превышать 20 МБ')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        if (type === 'main') {
          this.$emit('update:mainImage', e.target.result)
        } else {
          this.$emit('update:thumbnail', e.target.result)
        }
      }
      reader.readAsDataURL(file)
    },
    onDragOverMain(e) {
      e.preventDefault()
      this.isDragOverMain = true
    },
    onDragLeaveMain() {
      this.isDragOverMain = false
    },
    onDropMain(e) {
      e.preventDefault()
      this.isDragOverMain = false
      const file = e.dataTransfer.files?.[0]
      if (file) {
        this.handleFileUpload(file, 'main')
      }
    },
    onDragOverThumbnail(e) {
      e.preventDefault()
      this.isDragOverThumbnail = true
    },
    onDragLeaveThumbnail() {
      this.isDragOverThumbnail = false
    },
    onDropThumbnail(e) {
      e.preventDefault()
      this.isDragOverThumbnail = false
      const file = e.dataTransfer.files?.[0]
      if (file) {
        this.handleFileUpload(file, 'thumbnail')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.photo-upload-card {
  background: #ffffff;
  border: 1px solid #dadada;
  border-radius: 12px;
  padding: 16px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.photo-upload-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.photo-upload-card__actions-left {
  display: flex;
  gap: 16px;
  align-items: center;
}

.photo-upload-card__reorder-icon {
  width: 20px;
  height: 20px;
  cursor: move;
}

.photo-upload-card__delete-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  img {
    width: 20px;
    height: 20px;
    filter: grayscale(1);
    transition: filter 0.2s ease;
  }

  &:hover img {
    filter: brightness(0) saturate(100%) invert(58%) sepia(59%) saturate(4717%) hue-rotate(341deg) brightness(99%) contrast(92%);
  }
}

.photo-upload-card__content {
  display: flex;
  gap: 24px;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.photo-upload-card__upload-areas {
  display: flex;
  gap: 16px;
  flex-shrink: 0;
}

.photo-upload-card__upload-main {
  width: 340px;
  height: 200px;
  border: 1px dashed #dadada;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background: #ffffff;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #1735f5;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
}

.photo-upload-card__upload-thumbnail {
  width: 120px;
  height: 150px;
  border: 1px solid #dadada;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background: #ffffff;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #1735f5;
  }
}

.photo-upload-card__upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;

  img {
    width: 40px;
    height: 40px;
  }

  span {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-size: 14px;
    line-height: 1.25;
    color: #263043;
    text-align: center;
  }
}

.photo-upload-card__preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-upload-card__fields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.photo-upload-card__field {
  display: flex;
  flex-direction: column;
  gap: 4px;

  label {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-size: 14px;
    line-height: 22px;
    color: #666666;
    letter-spacing: 0.1px;
  }
}

.photo-upload-card__field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.photo-upload-card__textarea-wrapper {
  position: relative;
  
  :deep(.area_container) {
    .input_section {
      padding-bottom: 28px; // Отступ для счетчика символов
    }
  }
}

.photo-upload-card__char-counter {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 12px;
  line-height: 16px;
  color: #666666;
  pointer-events: none;
  z-index: 1;
}
</style>

