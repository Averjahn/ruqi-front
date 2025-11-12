<template>
  <div class="act-card">
    <div class="act-card__header">
      <div class="act-card__info">
        <h3 class="act-card__title">{{ act.name }}</h3>
        
        <!-- Status or Validity Period -->
        <div v-if="act.status" class="act-card__status">
          <img 
            v-if="act.status.type === 'needs-signature'"
            :src="require('@/assets/icons/profile/yellow-pen.svg')" 
            alt="Status" 
            class="act-card__status-icon"
          />
          <img 
            v-else-if="act.status.icon" 
            :src="act.status.icon" 
            alt="Status" 
            class="act-card__status-icon"
          />
          <span 
            class="act-card__status-text"
            :class="`act-card__status-text--${act.status.type}`"
          >
            {{ act.status.text }}
          </span>
        </div>
        
        <div v-else-if="act.validityPeriod" class="act-card__validity">
          <span class="act-card__validity-text">
            Срок действия: {{ act.validityPeriod }}
          </span>
        </div>
      </div>
      
      <button 
        class="act-card__download-button"
        @click="$emit('download')"
        :title="'Скачать документ'"
      >
        <img 
          src="@/assets/icons/profile/download-doc.svg" 
          alt="Download" 
          class="act-card__download-icon"
        />
      </button>
    </div>
    
    <div class="act-card__details">
      <div v-if="act.createdDate" class="act-card__detail-item">
        <span class="act-card__detail-label">Создан</span>
        <span class="act-card__detail-value">{{ act.createdDate }}</span>
      </div>
      
      <div v-if="act.requestName" class="act-card__detail-item">
        <span class="act-card__detail-label">Заявка</span>
        <span class="act-card__detail-value">{{ act.requestName }}</span>
      </div>
    </div>

    <!-- Sign Button for Mobile -->
    <div v-if="act.status && act.status.type === 'needs-signature'" class="act-card__sign-button-mobile">
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
  name: 'ActCard',
  components: {
    Button
  },
  props: {
    act: {
      type: Object,
      required: true,
      validator: (act) => {
        return act.name && (act.status || act.validityPeriod || act.createdDate)
      }
    }
  },
  emits: ['sign', 'download']
}
</script>

<style lang="scss" scoped>
.act-card {
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

.act-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  min-height: 58px;
}

.act-card__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.act-card__title {
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

.act-card__status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.act-card__status-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.act-card__status-text {
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

.act-card__validity {
  display: flex;
  align-items: center;
}

.act-card__validity-text {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.1px;
  color: #666666;
}

.act-card__download-button {
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

.act-card__sign-button-mobile {
  display: none;

  @media (max-width: 768px) {
    display: flex;
    width: 100%;
    margin-top: 0;
  }
}

.act-card__sign-button-mobile :deep(.rq_button) {
  @media (max-width: 768px) {
    width: 100%;
  }
}

.act-card__download-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.act-card__details {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.act-card__detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.act-card__detail-label {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #666666;
}

.act-card__detail-value {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #263043;
}

@media (max-width: 768px) {
  .act-card {
    padding: 16px;
    gap: 16px;
  }

  .act-card__header {
    flex-direction: row;
    align-items: flex-start;
    gap: 16px;
  }

  .act-card__details {
    gap: 32px;
  }
}
</style>

