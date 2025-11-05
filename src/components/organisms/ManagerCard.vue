<template>
  <div class="manager-card">
    <img 
      :src="avatarUrl || require('@/assets/imgs/document.png')" 
      alt="Manager Avatar" 
      class="manager-card__avatar"
    />
    <div class="manager-card__content">
      <h3 class="manager-card__name">{{ name }}</h3>
      <p class="manager-card__role">{{ role }}</p>
      <div class="manager-card__contacts">
        <div class="manager-card__contact-item">
          <img 
            :src="require('@/assets/icons/profile/Профиль/Call.svg')" 
            alt="Phone" 
            class="manager-card__contact-icon"
          />
          <span class="manager-card__contact-text">{{ phone }}</span>
        </div>
        <div class="manager-card__contact-item">
          <img 
            :src="require('@/assets/icons/profile/Профиль/Mail.svg')" 
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
      default: 'Ваш персональный менеджер'
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
  width: 100%;
  min-width: 290px;
  height: 130px;
  display: flex;
  align-items: flex-start;
  padding: 16px;
  background: #ffffff;
  border-radius: 8px;
  box-sizing: border-box;

  &__avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  &__content {
    margin-left: 24px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    align-items: flex-start;
    justify-content: flex-start;
    flex: 1;
    padding-top: 0;
  }

  &__name {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 600;
    font-style: normal;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0%;
    vertical-align: middle;
    color: #263043;
    margin: 0;
  }

  &__role {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0.1px;
    vertical-align: middle;
    color: #666666;
    margin: 0;
  }

  &__contacts {
    display: flex;
    flex-direction: column;
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
    vertical-align: middle;
    color: #666666;
  }
}
</style>

