<template>
  <header class="app-header">
    <div class="app-header__content">
      <!-- Left side: Title or Breadcrumbs -->
      <div class="app-header__left">
        <!-- Breadcrumbs -->
        <nav v-if="breadcrumbs && breadcrumbs.length" class="app-header__breadcrumbs">
          <span
            v-for="(crumb, index) in breadcrumbs"
            :key="index"
            class="app-header__breadcrumb-item"
          >
            <span
              v-if="crumb.path || crumb.onClick"
              class="app-header__breadcrumb-link"
              @click="handleBreadcrumbClick(crumb)"
            >
              {{ crumb.text }}
            </span>
            <span v-else class="app-header__breadcrumb-text">
              {{ crumb.text }}
            </span>
            <img
              v-if="index < breadcrumbs.length - 1"
              class="app-header__breadcrumb-separator"
              :src="chevronIcon"
              alt=""
            />
          </span>
        </nav>
        <!-- Title (if no breadcrumbs) -->
        <h1 v-else class="app-header__title">{{ title }}</h1>
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

const OBJECTS_SELECTED_KEY = 'uiObjects.selectedObjectId'

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
    },
    breadcrumbs: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      chevronIcon: require('@/assets/icons/profile/Chevron.svg')
    }
  },
  methods: {
    handleBreadcrumbClick(crumb) {
      if (!crumb) return
      if (typeof crumb.onClick === 'function') {
        crumb.onClick()
        return
      }
      if (crumb.path) {
        if (crumb.path === '/ui-new/objects' && typeof window !== 'undefined') {
          window.localStorage.removeItem(OBJECTS_SELECTED_KEY)
        }
        this.$router.push(crumb.path)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  position: fixed;
  top: 0;
  left: var(--sidebar-width, 286px); // Используем CSS переменную, fallback на 286px
  right: 0;
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  z-index: 90;
  display: flex;
  align-items: center;
  transition: left 0.3s ease;

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

  &__breadcrumbs {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #666666;
  }

  &__breadcrumb-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__breadcrumb-link {
    color: #666666;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: #1735F5;
    }
  }

  &__breadcrumb-text {
    color: #263043;
    font-weight: 500;
  }

  &__breadcrumb-separator {
    width: 12px;
    height: 12px;
    margin: 0 4px;
    object-fit: contain;
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
    
    &__right {
      display: none; /* Скрываем документы, уведомления и меню пользователя */
    }
    
    &__left {
      justify-content: center; /* Центрируем заголовок */
      padding-left: 0;
    }
  }
}

// Стили для collapsed sidebar теперь не нужны, так как используется CSS переменная
</style>

