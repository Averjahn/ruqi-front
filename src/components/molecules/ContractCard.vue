<template>
  <div class="contract-card">
    <div class="contract-card__header">
      <div class="contract-card__info">
        <h3 class="contract-card__title">{{ contract.performerName }}</h3>
        
        <!-- Status or Validity Period -->
        <div v-if="contract.status" class="contract-card__status">
          <img 
            v-if="contract.status.type === 'needs-signature'"
            :src="require('@/assets/icons/profile/yellow-pen.svg')" 
            alt="Status" 
            class="contract-card__status-icon"
          />
          <img 
            v-else-if="contract.status.icon" 
            :src="contract.status.icon" 
            alt="Status" 
            class="contract-card__status-icon"
          />
          <span 
            class="contract-card__status-text"
            :class="`contract-card__status-text--${contract.status.type}`"
          >
            {{ contract.status.text }}
          </span>
        </div>
        
        <div v-else-if="contract.validityPeriod" class="contract-card__validity">
          <span class="contract-card__validity-text">
            Срок действия: {{ contract.validityPeriod }}
          </span>
        </div>
      </div>
      
      <button 
        class="contract-card__download-button"
        @click="$emit('download')"
        :title="'Скачать документ'"
      >
        <img 
          src="@/assets/icons/profile/download-doc.svg" 
          alt="Download" 
          class="contract-card__download-icon"
        />
      </button>
    </div>
    
    <!-- Document Type -->
    <div v-if="contract.documentType" class="contract-card__document-type">
      <span class="contract-card__document-type-label">Тип документы</span>
      <span class="contract-card__document-type-value">{{ contract.documentType }}</span>
    </div>
    
    <div class="contract-card__dates">
      <div v-if="contract.createdDate" class="contract-card__date-item">
        <span class="contract-card__date-label">Создан</span>
        <span class="contract-card__date-value">{{ contract.createdDate }}</span>
      </div>
      
      <div v-if="contract.signedDate" class="contract-card__date-item">
        <span class="contract-card__date-label">Подписан</span>
        <span class="contract-card__date-value">{{ contract.signedDate }}</span>
      </div>
    </div>

    <!-- Sign Button for Mobile -->
    <div v-if="contract.status && contract.status.type === 'needs-signature'" class="contract-card__sign-button-mobile">
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
  name: 'ContractCard',
  components: {
    Button
  },
  props: {
    contract: {
      type: Object,
      required: true,
      validator: (contract) => {
        return contract.performerName && (contract.status || contract.validityPeriod || contract.createdDate)
      }
    }
  },
  emits: ['sign', 'download']
}
</script>

<style lang="scss" scoped>
.contract-card {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  padding: 20px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (min-width: 769px) {
    padding: 24px;
  }
}

.contract-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  min-height: 58px;
}

.contract-card__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.contract-card__title {
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

.contract-card__status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.contract-card__status-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.contract-card__status-text {
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

.contract-card__validity {
  display: flex;
  align-items: center;
}

.contract-card__validity-text {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.1px;
  color: #666666;
}

.contract-card__download-button {
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
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover {
    border-color: #1735F5;
    background: #F2F8FF;
  }

  &:active {
    transform: scale(0.95);
  }
}

.contract-card__document-type {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contract-card__document-type-label {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #666666;
}

.contract-card__document-type-value {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #263043;
}

.contract-card__download-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.contract-card__dates {
  display: flex;
  gap: 32px;
  align-items: center;
  flex-wrap: wrap;
}

.contract-card__date-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contract-card__date-label {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #666666;
}

.contract-card__date-value {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #263043;
}

.contract-card__sign-button-mobile {
  display: none;

  @media (max-width: 768px) {
    display: flex;
    width: 100%;
    margin-top: 0;
  }
}

.contract-card__sign-button-mobile :deep(.rq_button) {
  @media (max-width: 768px) {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .contract-card {
    padding: 16px;
    gap: 16px;
  }

  .contract-card__header {
    flex-direction: row;
    align-items: flex-start;
    gap: 16px;
  }

  .contract-card__dates {
    gap: 32px;
  }
}
</style>

