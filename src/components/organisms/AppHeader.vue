<template>
  <header class="app-header">
    <div class="app-header__content">
      <!-- Left side: Title -->
      <div class="app-header__left">
        <h1 class="app-header__title">{{ title }}</h1>
      </div>

      <!-- Right side: User actions -->
      <div class="app-header__right">
        <IconText 
          v-if="showDocuments"
          :icon="require('@/assets/icons/profile/wait-doc.svg')"
          text="Документы на проверке"
          class="app-header__documents"
        />
        <UserNotifications v-if="showNotifications" class="app-header__notifications" />
        <div class="app-header__user-section">
          <UserMenu />
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import UserMenu from '@/components/organisms/userMenu.vue'
import UserNotifications from '@/components/organisms/UserNotifications.vue'
import IconText from '@/components/molecules/IconText.vue'

export default {
  name: 'AppHeader',
  components: {
    UserMenu,
    UserNotifications,
    IconText
  },
  props: {
    showNotifications: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: 'Личный кабинет'
    },
    showDocuments: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 286px; // Sidebar width
  right: 0;
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  z-index: 90;
  display: flex;
  align-items: center;

  &__content {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }

  &__left {
    display: flex;
    align-items: center;
    flex: 1;
    padding-left: 24px;
  }

  &__title {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 600;
    font-style: normal;
    font-size: 20px;
    line-height: 28px;
    letter-spacing: 0%;
    color: #03123a;
    margin: 0;
  }

  &__right {
    display: flex;
    align-items: center;
    padding-right: 24px;
    height: 100%;
  }

  &__documents {
    margin-right: 26px;
    display: flex;
    align-items: center;
    height: 100%;

    ::v-deep .icon-text__text {
      color: #666666;
    }
  }

  &__notifications {
    margin-right: 16px;
    display: flex;
    align-items: center;
    height: 100%;
  }

  &__user-section {
    margin-left: 16px;
    display: flex;
    align-items: center;
    height: 100%;
  }

  // Убеждаемся, что дочерние компоненты не имеют лишних отступов
  ::v-deep .notification_badge {
    margin: 0;
    padding: 0;
  }

  ::v-deep .rq_user_button {
    margin: 0;
    padding: 0;
  }
}

@media (max-width: 768px) {
  .app-header {
    left: 0;
  }
}
</style>

