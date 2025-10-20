<template>
  <div class="skeleton-modal-notification">
    <div class="skeleton-modal-notification__content">
      <div class="skeleton-modal-notification__icon"></div>
      <div class="skeleton-modal-notification__text">
        <div class="skeleton-modal-notification__text-content">
          <div class="skeleton-modal-notification__title"></div>
          <div class="skeleton-modal-notification__description"></div>
        </div>
        <div class="skeleton-modal-notification__actions">
          <div class="skeleton-modal-notification__button skeleton-modal-notification__button--primary"></div>
          <div class="skeleton-modal-notification__button skeleton-modal-notification__button--outline"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkeletonModalNotification'
}
</script>

<style lang="scss" scoped>
.skeleton-modal-notification {
  background: #ffffff;
  border-radius: 14px;
  padding: 24px;
  width: 100%;
  max-width: 772px;
  
  &__content {
    display: flex;
    flex-direction: row;
    gap: 12px;
    align-items: flex-start;
  }
  
  &__icon {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  
  &__text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  &__text-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  &__title {
    height: 22px;
    width: 200px;
    border-radius: 4px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  
  &__description {
    height: 44px;
    width: 100%;
    border-radius: 4px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  
  &__actions {
    display: flex;
    flex-direction: row;
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
      width: 180px;
    }
  }
  
  // Мобильная адаптация
  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 14px;
    
    &__content {
      flex-direction: column;
      gap: 16px;
    }
    
    &__icon {
      width: 28px;
      height: 28px;
    }
    
    &__text {
      width: 100%;
      gap: 12px;
    }
    
    &__title {
      height: 20px;
      width: 150px;
    }
    
    &__description {
      height: 40px;
    }
    
    &__actions {
      flex-direction: column;
      gap: 12px;
      width: 100%;
    }
    
    &__button {
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
