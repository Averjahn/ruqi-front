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
    <div v-if="file && file.file" class="document-upload-card__uploaded-file">
      <div class="document-upload-card__file-thumbnail" @click="$emit('viewFile')">
        <img 
          :src="file.preview || file.file" 
          alt="Document" 
          class="document-upload-card__document-image" 
        />
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
    <div v-else class="document-upload-card__upload-area">
      <div class="document-upload-card__upload-content">
        <p class="document-upload-card__upload-text">Перетащите файлы сюда или</p>
        <button class="document-upload-card__upload-button" @click="$emit('upload')">
          <div class="document-upload-card__icon-placeholder">📎</div>
          загрузите документы
        </button>
        <p class="document-upload-card__upload-hint">{{ hint || 'Файлы до 5 МВ в форматах PNG, JPG, JPEG' }}</p>
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
      default: 'image/png,image/jpg,image/jpeg'
    },
    inputRef: {
      type: String,
      default: 'fileInput'
    }
  },
  emits: ['viewSample', 'viewFile', 'remove', 'upload'],
  methods: {
    triggerFileInput() {
      this.$refs[this.inputRef]?.click()
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

  &:hover {
    border-color: #1735f5;
    background: #f0f4ff;
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

