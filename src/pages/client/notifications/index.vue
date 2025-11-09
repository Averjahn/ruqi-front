<template>
  <div class="ui-notifications">
    <!-- Sidebar Component - Fixed to left -->
    <Sidebar 
      :icon-button="require('@/assets/icons/profile/sidebar.svg')"
      icon-button-type="outlined"
      icon-button-size="m"
      :fixed="true"
      @icon-click="handleSidebarIconClick"
    >
      <div class="sidebar-nav">
        <div 
          v-for="item in sidebarMenuItems" 
          :key="item.id"
          class="sidebar-nav__item"
          :class="{ 'sidebar-nav__item--active': item.active || isActiveRoute(item.route) }"
          @click="handleSidebarItemClick(item)"
        >
          <img 
            v-if="item.iconPath" 
            :src="item.iconPath" 
            alt="" 
            class="sidebar-nav__icon"
          />
          <span class="sidebar-nav__text">{{ item.title }}</span>
        </div>
      </div>
    </Sidebar>

    <!-- App Header - Fixed to top right of sidebar -->
    <AppHeader 
      :show-notifications="true"
      title="Уведомления"
      :show-documents="false"
    />
    
    <div class="ui-notifications__main-content">
      <div class="ui-notifications__header">
        <div class="ui-notifications__title-content">
          <h2 class="ui-notifications__title">Уведомления</h2>
          <div v-if="notificationsCounter" class="ui-notifications__counter">{{ notificationsCounter }}</div>
        </div>
        <button 
          v-if="notificationsCounter" 
          @click="setAllReadStatus" 
          class="ui-notifications__read-all"
        >
          <img src="@/assets/icons/FAQ/done_all.svg" alt="Прочитать всё" />
          <span>Прочитать всё</span>
        </button>
      </div>

      <div v-if="userNotifications.length || loading" class="ui-notifications__content">
        <div class="ui-notifications__list scrollbar">
          <UserNotificationItem
            v-for="item in userNotifications"
            :item="item"
            pageView
            :key="item.id"
            @clickToLink="clickToLink"
            @setReadStatus="setReadStatus"
          />
          <ThinLineLoading class="ui-notifications__loading" :show="loading" />
        </div>
        <div v-if="totalPages > 0" class="ui-notifications__pagination">
          <Pagination
            :totalPages="totalPages"
            :currentPage="currentPage"
            :isAdaptive="isAdaptive"
            @page-change="handlePageChange"
          />
        </div>
      </div>
      <div v-else class="ui-notifications__empty">Пока уведомлений нет</div>
    </div>

    <!-- Mobile Bottom Navigation -->
    <MobileBottomNav v-if="isMobileView" :menu-items="mobileMenuItems" />
  </div>
</template>

<script>
import Sidebar from '@/components/organisms/Sidebar.vue'
import AppHeader from '@/components/organisms/AppHeader.vue'
import UserNotificationItem from '@/components/molecules/UserNotificationItem.vue'
import Pagination from '@/components/atoms/Pagination.vue'
import ThinLineLoading from '@/components/atoms/loaders/ThinLineLoading.vue'
import MobileBottomNav from '@/components/organisms/MobileBottomNav.vue'
import { mapActions, mapGetters } from 'vuex'
import useUserNotifications from '@/composables/useUserNotifications'

export default {
  name: 'UINotifications',
  components: {
    Sidebar,
    AppHeader,
    UserNotificationItem,
    Pagination,
    ThinLineLoading,
    MobileBottomNav
  },
  setup () {
    const {
      loading,
      sendReadStatus,
      sendReadStatusAll,
      fetchUserNotifications,
      userNotifications,
      navigateTo,
      totalPages,
      loadPage,
    } = useUserNotifications({
      needUpdateDocumentsStatuses: true,
    })

    return {
      loading,
      fetchUserNotifications,
      userNotifications,
      navigateTo,
      sendReadStatus,
      sendReadStatusAll,
      totalPages,
      loadPage,
    }
  },
  data () {
    return {
      isMobile: false,
      currentPage: 1,
      // ПК меню (7 пунктов) - для Sidebar
      desktopMenuItems: [
        { id: 1, title: 'Заявки', iconPath: require('@/assets/icons/profile/note.svg'), active: false, route: '/ui-new/profile' },
        { id: 2, title: 'Объекты', iconPath: require('@/assets/icons/profile/objects-icon.svg'), active: false, route: null },
        { id: 3, title: 'Исполнители', iconPath: require('@/assets/icons/profile/executor.svg'), active: false, route: null },
        { id: 4, title: 'Поддержка', iconPath: require('@/assets/icons/profile/help.svg'), active: false, route: '/ui-new/FAQ' },
        { id: 5, title: 'Реестры', iconPath: require('@/assets/icons/profile/book.svg'), active: false, route: null },
        { id: 6, title: 'Финансы', iconPath: require('@/assets/icons/profile/wallet.svg'), active: false, route: null },
        { id: 7, title: 'Шаблоны документов', iconPath: require('@/assets/icons/profile/document.svg'), active: false, route: '/ui-new/document-templates' }
      ],
      // Мобильное меню (5 пунктов) - для MobileBottomNav
      mobileMenuItems: [
        { id: 1, title: 'Заявки', iconPath: require('@/assets/icons/profile/note.svg'), route: '/ui-new/profile' },
        { id: 2, title: 'Объекты', iconPath: require('@/assets/icons/profile/objects-icon.svg'), route: null },
        { id: 3, title: 'Финансы', iconPath: require('@/assets/icons/profile/wallet.svg'), route: null },
        { id: 4, title: 'Исполнители', iconPath: require('@/assets/icons/profile/executor.svg'), route: null },
        { id: 5, title: 'Еще', iconPath: require('@/assets/icons/FAQ/lines-else.svg'), route: null }
      ]
    }
  },
  computed: {
    ...mapGetters('user', ['notificationsCount']),
    isMobileView() {
      return this.isMobile
    },
    isAdaptive () {
      return window.innerWidth <= 768
    },
    notificationsCounter () {
      // Если нет данных из store, используем тестовые данные
      if (!this.notificationsCount || this.notificationsCount.all === 0) {
        return this.userNotifications.filter(n => n.web_status !== 3).length
      }
      return this.notificationsCount.all
    },
    // Для Sidebar используем ПК меню (7 пунктов)
    sidebarMenuItems() {
      return this.desktopMenuItems
    }
  },
  async mounted () {
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
    this.fetchUserNotifications()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile)
  },
  methods: {
    ...mapActions('user', ['fetchNotificationsCount']),
    checkMobile() {
      this.isMobile = window.innerWidth <= 768
    },
    handleSidebarIconClick() {
      console.log('Sidebar icon clicked')
    },
    handleSidebarItemClick(item) {
      if (item.route) {
        this.$router.push(item.route)
      }
    },
    isActiveRoute(route) {
      if (!route) return false
      return this.$route.path === route || this.$route.path.startsWith(route + '/')
    },
    clickToLink (item) {
      this.navigateTo(item)
    },
    async handlePageChange (page) {
      const success = await this.loadPage(page)
      if (success) {
        this.currentPage = page
      }
    },
    async setAllReadStatus () {
      await this.sendReadStatusAll()
      // ВРЕМЕННО ОТКЛЮЧЕНО: запрос к API уведомлений
      // this.fetchNotificationsCount()
    },
    async setReadStatus (item) {
      await this.sendReadStatus([item.id])
      // ВРЕМЕННО ОТКЛЮЧЕНО: запрос к API уведомлений
      // this.fetchNotificationsCount()
    },
  },
}
</script>

<style lang="scss" scoped>
.ui-notifications {
  padding: 20px;
  padding-left: 306px; // 286px sidebar + 20px margin
  padding-top: 100px; // 80px header + 20px margin
  height: 100vh;
  background: #F6F8FB;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &__main-content {
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
    flex: 1;
    min-height: 0;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
  }

  &__title-content {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  &__title {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 600;
    font-size: 32px;
    line-height: 40px;
    color: #263043;
    margin: 0;
  }

  &__counter {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #EA358C;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: 0.1px;
    text-align: center;
    color: #ffffff;
  }

  &__read-all {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    cursor: pointer;
    color: #1735F5;
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    padding: 0;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }

    img {
      width: 20px;
      height: 20px;
    }
  }

  &__content {
    width: 100%;
    background-color: #fff;
    box-shadow:
      0px 8px 48px 4px rgba(2, 52, 227, 0.04),
      0px 0px 10px 0px rgba(23, 53, 245, 0.03);
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
  }

  &__list {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
  }

  &__loading {
    padding: 16px;
  }

  &__pagination {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    padding: 16px 24px;
    border-top: 1px solid #0000001A;
  }

  &__empty {
    text-align: center;
    color: #7a91a9;
    padding: 32px;
    background-color: #fff;
    border-radius: 16px;
  }
}

// Sidebar Navigation Styles (same as profile page)
.sidebar-nav {
  padding: 0 0 8px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  &__item {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 270px;
    height: 42px;
    padding: 9px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-family: 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 16px;
    line-height: 22px;
    letter-spacing: 0%;
    color: #AAB3D1;
    opacity: 1;
    box-sizing: border-box;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.18);
    }
    
    &--active {
      background-color: rgba(255, 255, 255, 0.18);
      color: #ffffff;
      
      .sidebar-nav__icon {
        filter: brightness(0) invert(1);
      }
    }
  }
  
  &__icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    opacity: 0.7;
  }
  
  &__item--active &__icon {
    opacity: 1;
    filter: brightness(0) invert(1);
  }
  
  &__text {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .ui-notifications {
    padding-left: 0;
    padding-right: 0;
    padding-top: 20px;
    padding-bottom: 72px;
  }

  .ui-notifications__main-content {
    width: calc(100% - 32px);
    padding: 0 16px;
    margin-top: 63px;
  }

  .ui-notifications__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .ui-notifications__title {
    font-size: 24px;
    line-height: 30px;
  }

  .ui-notifications__list {
    max-height: calc(100vh - 400px);
  }

  // Скрываем обычный Sidebar на мобильных
  :deep(.sidebar) {
    display: none;
  }
}
</style>


