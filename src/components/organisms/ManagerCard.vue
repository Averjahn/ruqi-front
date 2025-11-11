<template>
  <div class="manager-card">
    <div class="manager-card__avatar-wrapper">
      <img 
        :src="avatarUrl || require('@/assets/imgs/document.png')" 
        alt="Manager Avatar" 
        class="manager-card__avatar"
      />
    </div>
    <div class="manager-card__content">
      <div class="manager-card__info">
        <p class="manager-card__role">{{ role }}</p>
        <h3 class="manager-card__name">{{ name }}</h3>
      </div>
      <div class="manager-card__contacts">
        <div class="manager-card__contact-item">
          <img 
            :src="require('@/assets/icons/profile/Call.svg')" 
            alt="Phone" 
            class="manager-card__contact-icon"
          />
          <span class="manager-card__contact-text">{{ phone }}</span>
        </div>
        <div class="manager-card__contact-item">
          <img 
            :src="require('@/assets/icons/profile/Mail.svg')" 
            alt="Email" 
            class="manager-card__contact-icon"
          />
          <span class="manager-card__contact-text">{{ email }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ManagerCard',
  props: {
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: 'Объект 1'
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    avatarUrl: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
.manager-card {
  width: 258px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 100%;
    min-height: 130px;
  }

  &__avatar-wrapper {
    position: relative;
    flex-shrink: 0;
  }

  &__avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    background: #f3f3f3;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
    justify-content: flex-start;
    flex: 1;
    min-width: 0;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    align-items: flex-start;
    width: 100%;
  }

  &__role {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 600;
    font-style: normal;
    font-size: 14px;
    line-height: 17.5px;
    letter-spacing: 0%;
    color: #000000;
    margin: 0;
  }

  &__name {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0.1px;
    color: #000000;
    margin: 0;
  }

  &__contacts {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
  }

  &__contact-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__contact-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    object-fit: contain;
  }

  &__contact-text {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0.1px;
    color: #666666;
  }
}
</style>

