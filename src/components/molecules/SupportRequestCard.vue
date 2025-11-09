<template>
  <div class="support-request-card" @click="handleClick">
    <div class="support-request-card__header">
      <div class="support-request-card__info">
        <div class="support-request-card__comment">
          <img src="@/assets/icons/comment.svg" alt="" class="support-request-card__comment-icon" />
          <span class="support-request-card__comment-count">{{ item.messages_count || 0 }}</span>
        </div>
        <div class="support-request-card__dot"></div>
        <div class="support-request-card__number">№{{ item.number || item.id }}</div>
        <div class="support-request-card__dot"></div>
        <div class="support-request-card__date">{{ formattedDate }}</div>
      </div>
      <SupportRequestStatus :status="item.status" />
    </div>
    
    <div class="support-request-card__title">{{ item.title }}</div>
    
    <div v-if="item.description" class="support-request-card__description">{{ item.description }}</div>
  </div>
</template>

<script>
import SupportRequestStatus from '@/components/molecules/SupportRequestStatus.vue'

export default {
  name: 'SupportRequestCard',
  components: {
    SupportRequestStatus
  },
  props: {
    item: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  emits: ['click'],
  computed: {
    formattedDate() {
      if (!this.item.created_at) return ''
      const date = this.$dayjs(this.item.created_at)
      if (!date.isValid()) return ''
      
      const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
      ]
      
      const day = date.date()
      const month = months[date.month()]
      const time = date.format('HH:mm')
      const year = date.year()
      
      return `Создано ${day} ${month} в ${time} ${year}г.`
    }
  },
  methods: {
    handleClick() {
      this.$emit('click', this.item)
    }
  }
}
</script>

<style lang="scss" scoped>
.support-request-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px;
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
  
  &:hover {
    box-shadow:
      0px 8px 48px 4px rgba(2, 52, 227, 0.04),
      0px 0px 10px 0px rgba(23, 53, 245, 0.03);
  }
  
  &__header {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
  }
  
  &__info {
    display: flex;
    gap: 12px;
    align-items: center;
    flex: 1;
    min-width: 0;
  }
  
  &__comment {
    display: flex;
    gap: 2px;
    align-items: center;
    flex-shrink: 0;
  }
  
  &__comment-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
  
  &__comment-count {
    font-family: 'Source Sans Pro', 'Source Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0.1px;
    color: #263043;
  }
  
  &__dot {
    width: 2px;
    height: 2px;
    border-radius: 50%;
    background-color: #666666;
    flex-shrink: 0;
  }
  
  &__number {
    font-family: 'Source Sans Pro', 'Source Sans', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    color: #263043;
    white-space: nowrap;
  }
  
  &__date {
    font-family: 'Source Sans Pro', 'Source Sans', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    color: #1b1b1b;
    white-space: nowrap;
  }
  
  &__title {
    font-family: 'Source Sans Pro', 'Source Sans', sans-serif;
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
    color: #000000;
    margin: 0;
  }
  
  &__description {
    font-family: 'Source Sans Pro', 'Source Sans', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    color: #666666;
    max-width: 640px;
    margin: 0;
  }
}

@media (max-width: 768px) {
  .support-request-card {
    padding: 24px;
    
    &__header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
    
    &__info {
      flex-wrap: wrap;
    }
    
    &__date {
      font-size: 14px;
    }
    
    &__title {
      font-size: 18px;
      line-height: 24px;
    }
    
    &__description {
      font-size: 14px;
      line-height: 20px;
    }
  }
}
</style>

