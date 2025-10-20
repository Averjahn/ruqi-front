<template>
  <div class="object-card-skeleton">
    <!-- Header section -->
    <div class="object-card-skeleton__header">
      <div class="object-card-skeleton__logo-frame">
        <div class="object-card-skeleton__logo"></div>
      </div>
      <div class="object-card-skeleton__description">
        <div class="object-card-skeleton__title">
          <div class="object-card-skeleton__name"></div>
          <div class="object-card-skeleton__rating"></div>
        </div>
        <div class="object-card-skeleton__address"></div>
      </div>
      <div class="object-card-skeleton__favorite">
        <div class="object-card-skeleton__heart"></div>
      </div>
    </div>

    <!-- Price section -->
    <div class="object-card-skeleton__price"></div>

    <!-- Vacancies section -->
    <div class="object-card-skeleton__vacancies">
      <div class="object-card-skeleton__vacancies-title"></div>
      <div class="object-card-skeleton__vacancy-list">
        <div class="object-card-skeleton__vacancy-tag"></div>
        <div class="object-card-skeleton__vacancy-tag"></div>
        <div class="object-card-skeleton__vacancy-tag"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ObjectCardSkeleton'
}
</script>

<style lang="scss" scoped>
.object-card-skeleton {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  flex: 1;
  min-width: 402px;
  border-radius: 16px;
  border: 1px solid #dadada;
  padding: 24px;
  background: #ffffff;
  
  &__header {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  
  &__logo-frame {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border: 1px solid #dadada;
    border-radius: 50%;
    background-color: #f0f0f0;
  }
  
  &__logo {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
  }
  
  &__description {
    flex: 1;
    overflow: hidden;
  }
  
  &__title {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 8px;
  }
  
  &__name {
    width: 40%;
    height: 20px;
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: 4px;
  }
  
  &__rating {
    width: 60px;
    height: 16px;
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: 4px;
  }
  
  &__address {
    width: 50%;
    height: 16px;
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: 4px;
  }
  
  &__favorite {
    align-self: start;
  }
  
  &__heart {
    width: 24px;
    height: 24px;
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: 4px;
  }
  
  &__price {
    width: 35%;
    height: 28px;
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: 4px;
  }
  
  &__vacancies {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  &__vacancies-title {
    width: 30%;
    height: 16px;
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: 4px;
  }
  
  &__vacancy-list {
    display: flex;
    flex-wrap: wrap;
    row-gap: 6px;
    column-gap: 8px;
    overflow: hidden;
    max-height: 53px;
  }
  
  &__vacancy-tag {
    width: 50px;
    height: 24px;
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: 12px;
    
    &:nth-child(2) {
      width: 45px;
    }
    
    &:nth-child(3) {
      width: 55px;
    }
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@media (max-width: 450px) {
  .object-card-skeleton {
    min-width: auto;
  }
}
</style>
