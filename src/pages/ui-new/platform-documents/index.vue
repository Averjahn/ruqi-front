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
      :menu-items="sidebarMenuItems"
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
          <h2 class="ui-platform-documents__title">Документы с платформой</h2>
          
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
      sidebarMenuItems: [
        {
          id: 'requests',
          label: 'Заявки',
          icon: require('@/assets/icons/profile/objects-icon.svg'),
          route: null,
          active: false
        },
        {
          id: 'chat',
          label: 'Чат',
          icon: require('@/assets/icons/profile/chat-icon.svg'),
          route: null,
          badge: 11,
          active: false
        },
        {
          id: 'support',
          label: 'Поддержка',
          icon: require('@/assets/icons/profile/help.svg'),
          route: '/ui-new/FAQ',
          active: false
        },
        {
          id: 'registries',
          label: 'Реестры',
          icon: require('@/assets/icons/profile/book.svg'),
          route: '/ui-new/document-templates',
          active: false
        }
      ],
      mobileMenuItems: [
        {
          id: 'requests',
          label: 'Заявки',
          icon: require('@/assets/icons/profile/objects-icon.svg'),
          route: null
        },
        {
          id: 'chat',
          label: 'Чат',
          icon: require('@/assets/icons/profile/chat-icon.svg'),
          route: null,
          badge: 11
        },
        {
          id: 'support',
          label: 'Поддержка',
          icon: require('@/assets/icons/profile/help.svg'),
          route: '/ui-new/FAQ'
        },
        {
          id: 'registries',
          label: 'Реестры',
          icon: require('@/assets/icons/profile/book.svg'),
          route: '/ui-new/document-templates'
        }
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
  padding-top: 64px; // Space for AppHeader

  @media (max-width: 768px) {
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
  padding: 24px;
  padding-top: 24px;

  @media (max-width: 768px) {
    padding: 16px;
    padding-top: 2px; // Offset for status bar
  }
}

.ui-platform-documents__layout {
  display: flex;
  gap: 16px;
  max-width: 1440px;
  margin: 0 auto;

  @media (max-width: 768px) {
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
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
  background: #ffffff;
  border-radius: 10px;
  padding: 24px;

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 0;
    background: #ffffff;
  }
}

.ui-platform-documents__title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
  color: #263043;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 18px;
    line-height: 24px;
  }
}

.ui-platform-documents__list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>

