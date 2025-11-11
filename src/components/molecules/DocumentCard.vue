<template>
  <div class="document-card">
    <h3 class="document-card__title">{{ title }}</h3>
    
    <div v-if="file" class="document-card__file">
      <div class="document-card__thumbnail">
        <img 
          :src="file.preview || file.file" 
          alt="Document" 
          class="document-card__image" 
        />
      </div>
      <div class="document-card__info">
        <p class="document-card__file-name">{{ file.name }}</p>
        <p class="document-card__file-size">{{ file.size }}</p>
        <button class="document-card__delete-button" @click="$emit('delete')">
          <img src="@/assets/icons/delete.svg" alt="Delete" class="document-card__delete-icon" />
          <span>Удалить</span>
        </button>
      </div>
    </div>
    
    <div v-else class="document-card__upload-area">
      <p class="document-card__upload-text">Документ не загружен</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DocumentCard',
  props: {
    title: {
      type: String,
      required: true
    },
    file: {
      type: Object,
      default: null
    }
  },
  emits: ['delete']
}
</script>

<style lang="scss" scoped>
.document-card {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  padding: 20px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 769px) {
    padding: 24px;
    gap: 24px;
  }
}

.document-card__title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: normal;
  color: #263043;
  margin: 0;

  @media (min-width: 769px) {
    font-size: 20px;
    line-height: 28px;
  }
}

.document-card__file {
  display: flex;
  gap: 12px;
  align-items: flex-start;

  @media (min-width: 769px) {
    gap: 16px;
  }
}

.document-card__thumbnail {
  width: 118px;
  height: 116px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f1f1f1;
}

.document-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.document-card__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.document-card__file-name {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.1px;
  color: #263043;
  margin: 0;

  @media (min-width: 769px) {
    font-size: 16px;
  }
}

.document-card__file-size {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 0.1px;
  color: #263043;
  margin: 0;
}

.document-card__delete-button {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  padding: 0;
  margin-top: 4px;
  cursor: pointer;
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.1px;
  color: #EB4D3D;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
}

.document-card__delete-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  object-fit: contain;
}

.document-card__upload-area {
  padding: 24px;
  text-align: center;
  color: #666666;
}
</style>

