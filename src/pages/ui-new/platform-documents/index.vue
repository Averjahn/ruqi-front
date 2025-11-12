<template>
  <div class="ui-platform-documents">
    <!-- Mobile Header -->
    <div v-if="isMobile" class="ui-platform-documents__mobile-header">
      <button class="ui-platform-documents__back-button" @click="handleBack">
        <img src="@/assets/icons/profile/arrow-left.svg" alt="Back" />
      </button>
      <h1 class="ui-platform-documents__mobile-title">Документы с платформой</h1>
      <div class="ui-platform-documents__mobile-header-spacer"></div>
    </div>

    <!-- Sidebar Component - Fixed to left (Desktop only) -->
    <Sidebar 
      v-if="!isMobile"
      :icon-button="require('@/assets/icons/profile/sidebar.svg')"
      icon-button-type="outlined"
      icon-button-size="m"
      :fixed="true"
      :menu-items="desktopMenuItems"
      @icon-click="handleSidebarIconClick"
      @item-click="handleSidebarItemClick"
    />

    <!-- App Header - Fixed to top right of sidebar (Desktop only) -->
    <AppHeader 
      v-if="!isMobile"
      :show-notifications="true"
      title="Личный кабинет"
      :show-documents="true"
    />
    
    <div class="ui-platform-documents__main-content">
      <div class="ui-platform-documents__layout">
        <!-- Left Column: ProfileMenu and ManagersList (Desktop only) -->
        <div v-if="!isMobile" class="ui-platform-documents__left-column">
          <ProfileMenu 
            :active-item="activeProfileMenuItem"
            @item-click="handleProfileMenuClick"
            @update:active-item="activeProfileMenuItem = $event"
          />
          
          <ManagersList 
            :managers="managers"
          />
        </div>

        <!-- Right Column: Content -->
        <div class="ui-platform-documents__right-column">
          <h2 v-if="!isMobile" class="ui-platform-documents__title">Документы с платформой</h2>
          
          <div class="ui-platform-documents__list">
            <PlatformDocumentCard
              v-for="(document, index) in documents"
              :key="index"
              :document="document"
              @sign="handleSign(document)"
              @download="handleDownload(document)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Bottom Navigation -->
    <MobileBottomNav v-if="isMobile" :menu-items="mobileMenuItems" />
  </div>
</template>

<script>
import Sidebar from '@/components/organisms/Sidebar.vue'
import AppHeader from '@/components/organisms/AppHeader.vue'
import ProfileMenu from '@/components/organisms/ProfileMenu.vue'
import ManagersList from '@/components/organisms/ManagersList.vue'
import MobileBottomNav from '@/components/organisms/MobileBottomNav.vue'
import PlatformDocumentCard from '@/components/molecules/PlatformDocumentCard.vue'

export default {
  name: 'PlatformDocuments',
  components: {
    Sidebar,
    AppHeader,
    ProfileMenu,
    ManagersList,
    MobileBottomNav,
    PlatformDocumentCard
  },
  data() {
    return {
      isMobile: false,
      activeProfileMenuItem: 'platform-documents',
      documents: [
        {
          organizationName: 'ООО «Секвоя»',
          status: {
            type: 'needs-signature',
            text: 'Нужно подписать',
            icon: require('@/assets/icons/profile/document.svg')
          },
          createdDate: '01.10.2021'
        },
        {
          organizationName: 'ООО «Секвоя»',
          validityPeriod: '01.10.2022',
          createdDate: '01.10.2021',
          signedDate: '01.10.2021'
        }
      ],
      managers: [
        {
          role: 'Объект 1',
          name: 'Иванов Иван Иванович',
          phone: '+7 (999) 999-99-99',
          email: 'anna.smirnova@ruqi.ru',
          avatar: require('@/assets/imgs/document.png')
        },
        {
          role: 'Объект 1',
          name: 'Иванов Иван Иванович',
          phone: '+7 (999) 999-99-99',
          email: 'anna.smirnova@ruqi.ru',
          avatar: require('@/assets/imgs/document.png')
        }
      ],
      // ПК меню (8 пунктов) - для Sidebar
      desktopMenuItems: [
        { id: 1, title: 'Заявки', iconPath: require('@/assets/icons/profile/note.svg'), active: false, route: null },
        { id: 2, title: 'Объекты', iconPath: require('@/assets/icons/profile/objects-icon.svg'), active: false, route: null },
        { id: 3, title: 'Исполнители', iconPath: require('@/assets/icons/profile/executor.svg'), active: false, route: null },
        { id: 4, title: 'Поддержка', iconPath: require('@/assets/icons/profile/help.svg'), active: false, route: '/ui-new/FAQ' },
        { id: 5, title: 'Чат', iconPath: require('@/assets/icons/profile/chat-icon.svg'), active: false, route: null, badge: 11 },
        { id: 6, title: 'Реестры', iconPath: require('@/assets/icons/profile/book.svg'), active: false, route: null },
        { id: 7, title: 'Финансы', iconPath: require('@/assets/icons/profile/wallet.svg'), active: false, route: null },
        { id: 8, title: 'Шаблоны документов', iconPath: require('@/assets/icons/profile/document.svg'), active: false, route: '/ui-new/document-templates' }
      ],
      // Мобильное меню (5 пунктов) - для MobileBottomNav
      mobileMenuItems: [
        { id: 1, title: 'Заявки', iconPath: require('@/assets/icons/profile/note.svg'), route: null },
        { id: 2, title: 'Объекты', iconPath: require('@/assets/icons/profile/objects-icon.svg'), route: null },
        { id: 3, title: 'Финансы', iconPath: require('@/assets/icons/profile/wallet.svg'), route: null },
        { id: 4, title: 'Исполнители', iconPath: require('@/assets/icons/profile/executor.svg'), route: null },
        { id: 5, title: 'Еще', iconPath: require('@/assets/icons/FAQ/lines-else.svg'), route: null }
      ]
    }
  },
  mounted() {
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile)
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 768
    },
    handleBack() {
      this.$router.push('/ui-new/profile')
    },
    handleSidebarIconClick() {
      // Handle sidebar icon click
    },
    handleSidebarItemClick(item) {
      if (item.route) {
        this.$router.push(item.route)
      }
    },
    handleProfileMenuClick(item) {
      if (item.id === 'account') {
        this.$router.push('/ui-new/profile/account')
      } else if (item.id === 'organization') {
        this.$router.push('/ui-new/organisation-data')
      } else if (item.id === 'doc-platform' || item.id === 'platform-documents') {
        // Already on this page
        return
      } else if (item.route) {
        this.$router.push(item.route)
      }
    },
    handleSign(document) {
      console.log('Sign document:', document)
      // TODO: Implement sign document logic
    },
    handleDownload(document) {
      console.log('Download document:', document)
      // TODO: Implement download document logic
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-platform-documents {
  min-height: 100vh;
  background: #F6F8FB;
  padding: 20px;
  padding-left: 306px; // 286px sidebar + 20px margin
  padding-top: 100px; // 80px header + 20px margin

  @media (max-width: 768px) {
    padding: 0;
    padding-top: 0;
    background: #ffffff;
  }
}

.ui-platform-documents__mobile-header {
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: #ffffff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }
}

.ui-platform-documents__back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;

  img {
    width: 24px;
    height: 24px;
  }
}

.ui-platform-documents__mobile-title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  color: #263043;
  margin: 0;
  flex: 1;
  text-align: left;
  padding-left: 8px;
}

.ui-platform-documents__mobile-header-spacer {
  width: 32px;
  flex-shrink: 0;
}

.ui-platform-documents__main-content {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    width: 100%;
    padding: 0;
  }
}

.ui-platform-documents__layout {
  display: grid;
  grid-template-columns: 290px 1fr;
  gap: 16px;
  align-items: start;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
}

.ui-platform-documents__left-column {
  width: 290px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ui-platform-documents__right-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;

  @media (max-width: 768px) {
    padding: 24px 16px;
    border-radius: 0;
    background: #ffffff;
    width: 100%;
    box-sizing: border-box;
  }
}

.ui-platform-documents__title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
  color: #263043;
  margin: 0;
}

.ui-platform-documents__list {
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    gap: 24px;
    width: 100%;
  }
}

@media (max-width: 1200px) {
  .ui-platform-documents {
    &__layout {
      grid-template-columns: 1fr;
      gap: 24px;
      align-items: center;
    }
  }
}

@media (max-width: 768px) {
  .ui-platform-documents {
    padding: 0;
    padding-top: 2px; // Offset for status bar
    padding-bottom: 72px; // Space for mobile bottom nav
  }

  .ui-platform-documents__title {
    font-size: 18px;
    line-height: 24px;
    padding: 0;
  }
}
</style>

