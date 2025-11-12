<template>
  <div class="platform-document-card">
    <div class="platform-document-card__header">
      <div class="platform-document-card__info">
        <h3 class="platform-document-card__title">{{ document.organizationName }}</h3>
        
        <!-- Status or Validity Period -->
        <div v-if="document.status" class="platform-document-card__status">
          <img 
            v-if="document.status.type === 'needs-signature'"
            :src="require('@/assets/icons/profile/yellow-pen.svg')" 
            alt="Status" 
            class="platform-document-card__status-icon"
          />
          <img 
            v-else-if="document.status.icon" 
            :src="document.status.icon" 
            alt="Status" 
            class="platform-document-card__status-icon"
          />
          <span 
            class="platform-document-card__status-text"
            :class="`platform-document-card__status-text--${document.status.type}`"
          >
            {{ document.status.text }}
          </span>
        </div>
        
        <div v-else-if="document.validityPeriod" class="platform-document-card__validity">
          <span class="platform-document-card__validity-text">
            Срок действия: {{ document.validityPeriod }}
          </span>
        </div>
      </div>
      
      <div class="platform-document-card__actions">
        <Button
          v-if="document.status && document.status.type === 'needs-signature'"
          type="contained"
          color="blue"
          size="m"
          class="platform-document-card__sign-button"
          @click="$emit('sign')"
        >
          Подписать
        </Button>
        
        <button 
          class="platform-document-card__download-button"
          @click="$emit('download')"
          :title="'Скачать документ'"
        >
          <img 
            src="@/assets/icons/profile/download-doc.svg" 
            alt="Download" 
            class="platform-document-card__download-icon"
          />
        </button>
      </div>
    </div>
    
    <div class="platform-document-card__dates">
      <div v-if="document.createdDate" class="platform-document-card__date-item">
        <span class="platform-document-card__date-label">Создан</span>
        <span class="platform-document-card__date-value">{{ document.createdDate }}</span>
      </div>
      
      <div v-if="document.signedDate" class="platform-document-card__date-item">
        <span class="platform-document-card__date-label">Подписан</span>
        <span class="platform-document-card__date-value">{{ document.signedDate }}</span>
      </div>
    </div>
    
    <!-- Sign Button for Mobile -->
    <div v-if="document.status && document.status.type === 'needs-signature'" class="platform-document-card__sign-button-mobile">
      <Button
        type="contained"
        color="blue"
        size="m"
        @click="$emit('sign')"
      >
        Подписать
      </Button>
    </div>
  </div>
</template>

<script>
import Button from '@/components/atoms/Button.vue'

export default {
  name: 'PlatformDocumentCard',
  components: {
    Button
  },
  props: {
    document: {
      type: Object,
      required: true,
      validator: (doc) => {
        return doc.organizationName && (doc.status || doc.validityPeriod || doc.createdDate)
      }
    }
  },
  emits: ['sign', 'download']
}
</script>

<style lang="scss" scoped>
.platform-document-card {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  padding: 20px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 16px;
    width: 100%;
    box-sizing: border-box;
  }

  @media (min-width: 769px) {
    padding: 24px;
  }
}

.platform-document-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  min-height: 58px;
}

.platform-document-card__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.platform-document-card__title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 28px;
  color: #263043;
  margin: 0;

  @media (min-width: 769px) {
    font-size: 20px;
  }
}

.platform-document-card__status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.platform-document-card__status-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.platform-document-card__status-text {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.1px;

  &--needs-signature {
    color: #f38816;
  }

  &--signed {
    color: #666666;
  }
}

.platform-document-card__validity {
  display: flex;
  align-items: center;
}

.platform-document-card__validity-text {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.1px;
  color: #666666;
}

.platform-document-card__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.platform-document-card__download-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #dadada;
  border-radius: 8px;
  background: #ffffff;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;

  &:hover {
    border-color: #1735F5;
    background: #F2F8FF;
  }

  &:active {
    transform: scale(0.95);
  }
}

.platform-document-card__download-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.platform-document-card__dates {
  display: flex;
  gap: 32px;
  align-items: center;
  flex-wrap: wrap;
}

.platform-document-card__date-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.platform-document-card__date-label {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #666666;
}

.platform-document-card__date-value {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #263043;
}

@media (max-width: 768px) {
  .platform-document-card__header {
    flex-direction: row;
    align-items: stretch;
    gap: 16px;
  }

  .platform-document-card__actions {
    justify-content: flex-end;
  }

  .platform-document-card__sign-button {
    display: none;
  }

  .platform-document-card__sign-button-mobile {
    display: flex;
    width: 100%;
    margin-top: 0;
  }

  .platform-document-card__sign-button-mobile :deep(.rq_button) {
    width: 100%;
  }

  .platform-document-card__dates {
    gap: 16px;
  }
}

@media (min-width: 769px) {
  .platform-document-card__sign-button-mobile {
    display: none;
  }
}
</style>

