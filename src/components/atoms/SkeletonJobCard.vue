<template>
  <div class="skeleton-job-card">
    <div class="skeleton-job-card__header">
      <div class="skeleton-job-card__statuses">
        <div class="skeleton-job-card__badge skeleton-job-card__badge--location"></div>
        <div class="skeleton-job-card__badge skeleton-job-card__badge--timer"></div>
      </div>
      <div class="skeleton-job-card__heart"></div>
    </div>
    
    <div class="skeleton-job-card__content">
      <div class="skeleton-job-card__title-section">
        <div class="skeleton-job-card__title"></div>
        <div class="skeleton-job-card__price"></div>
        <div class="skeleton-job-card__date-section">
          <div class="skeleton-job-card__calendar-icon"></div>
          <div class="skeleton-job-card__date"></div>
        </div>
      </div>
      
      <div class="skeleton-job-card__info">
        <div class="skeleton-job-card__location-section">
          <div class="skeleton-job-card__avatar"></div>
          <div class="skeleton-job-card__location"></div>
        </div>
      </div>
    </div>
    
    <div class="skeleton-job-card__buttons">
      <div class="skeleton-job-card__button skeleton-job-card__button--primary"></div>
      <div class="skeleton-job-card__button skeleton-job-card__button--outline"></div>
      <div class="skeleton-job-card__icon-button"></div>
    </div>
    
    <div class="skeleton-job-card__notification">
      <div class="skeleton-job-card__notification-content">
        <div class="skeleton-job-card__notification-icon"></div>
        <div class="skeleton-job-card__notification-text">
          <div class="skeleton-job-card__notification-title"></div>
          <div class="skeleton-job-card__notification-description"></div>
          <div class="skeleton-job-card__notification-buttons">
            <div class="skeleton-job-card__notification-button"></div>
            <div class="skeleton-job-card__notification-button"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkeletonJobCard'
}
</script>

<style lang="scss" scoped>
.skeleton-job-card {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  
  &__statuses {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: flex-start;
    flex: 1;
  }
  
  &__badge {
    height: 24px;
    border-radius: 6px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    
    &--location {
      width: 120px;
    }
    
    &--timer {
      width: 180px;
    }
  }
  
  &__heart {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  
  &__content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  &__title-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  &__title {
    height: 28px;
    width: 120px;
    border-radius: 4px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  
  &__price {
    height: 22px;
    width: 100px;
    border-radius: 4px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  
  &__date-section {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  &__calendar-icon {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  
  &__date {
    height: 20px;
    width: 140px;
    border-radius: 4px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  
  &__info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  &__location-section {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  &__avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  
  &__location {
    height: 20px;
    width: 200px;
    border-radius: 4px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  
  &__buttons {
    display: flex;
    gap: 16px;
    align-items: center;
  }
  
  &__button {
    height: 40px;
    border-radius: 8px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    
    &--primary {
      width: 140px;
    }
    
    &--outline {
      width: 160px;
    }
  }
  
  &__icon-button {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  
  &__notification {
    background: #fff6f5;
    border-radius: 14px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  &__notification-content {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }
  
  &__notification-icon {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    flex-shrink: 0;
  }
  
  &__notification-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  &__notification-title {
    height: 22px;
    width: 200px;
    border-radius: 4px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  
  &__notification-description {
    height: 44px;
    width: 100%;
    border-radius: 4px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  
  &__notification-buttons {
    display: flex;
    gap: 16px;
    align-items: center;
  }
  
  &__notification-button {
    height: 32px;
    width: 100%;
    border-radius: 8px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  
  // Мобильная адаптация
  @media (max-width: 768px) {
    padding: 20px;
    gap: 24px;
    
    &__header {
      flex-direction: column;
      gap: 16px;
      align-items: flex-start;
    }
    
    &__statuses {
      width: 100%;
    }
    
    &__heart {
      align-self: flex-end;
    }
    
    &__buttons {
      flex-direction: row;
      gap: 8px;
      align-items: stretch;
    }
    
    &__button {
      flex: 1;
      width: auto;
    }
    
    &__icon-button {
      width: 40px;
      height: 40px;
    }
    
    &__notification {
      padding: 16px;
      gap: 16px;
    }
    
    &__notification-content {
      flex-direction: column;
      gap: 16px;
    }
    
    &__notification-text {
      width: 100%;
      gap: 12px;
    }
    
    &__notification-buttons {
      flex-direction: column;
      gap: 12px;
      width: 100%;
    }
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
