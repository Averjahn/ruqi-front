<template>
  <div class="ui-profile">
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
          <span v-if="item.badge" class="sidebar-nav__badge">{{ item.badge }}</span>
        </div>
      </div>
    </Sidebar>

    <!-- App Header - Fixed to top right of sidebar -->
    <AppHeader 
      :show-notifications="true"
      title="Личный кабинет"
      :show-documents="true"
    />
    
    <div class="ui-profile__main-content">
      <div class="ui-profile__layout">
        <!-- Left Column: ProfileMenu and ManagerCard -->
        <div class="ui-profile__left-column">
          <ProfileMenu 
            :active-item="activeProfileMenuItem"
            @item-click="handleProfileMenuClick"
            @update:active-item="activeProfileMenuItem = $event"
          />
          
          <ManagersList 
            :managers="managers"
          />
        </div>

        <!-- Right Column: ProfileHeader and PersonalData -->
        <div class="ui-profile__right-column">
          <ProfileHeader name="Джон МакКлейн" />
          
          <PersonalData 
            :personal-data="personalData"
            :contacts="{
              phone: '+7 (999) 999-99-99',
              email: 'example@gmail.com',
              telegram: null,
              phoneStatus: {
                type: 'confirmed',
                icon: require('@/assets/icons/checkmark_circle.svg'),
                text: 'Телефон подтверждён'
              },
              emailStatus: {
                type: 'unconfirmed',
                icon: require('@/assets/icons/profile/input-status-red.svg'),
                text: 'Подтвердите email'
              }
            }"
            @edit="handlePersonalDataEdit"
            @save="handlePersonalDataSave"
            @cancel="handlePersonalDataCancel"
            @phone-click="handlePhoneClick"
            @email-click="handleEmailClick"
            @telegram-link="handleTelegramLink"
          />
          
          <ProfileActions 
            @change-password="handleChangePassword"
            @logout="handleLogout"
          />
        </div>
      </div>
    </div>

    <!-- Mobile Bottom Navigation -->
    <MobileBottomNav v-if="isMobileView" :menu-items="mobileMenuItems" />
  </div>
</template>

<script>
// Импорты для profile
import Sidebar from '@/components/organisms/Sidebar.vue'
import AppHeader from '@/components/organisms/AppHeader.vue'
import ProfileMenu from '@/components/organisms/ProfileMenu.vue'
import ProfileHeader from '@/components/organisms/ProfileHeader.vue'
import ManagersList from '@/components/organisms/ManagersList.vue'
import PersonalData from '@/components/organisms/PersonalData.vue'
import ProfileActions from '@/components/organisms/ProfileActions.vue'
import MobileBottomNav from '@/components/organisms/MobileBottomNav.vue'

export default {
  name: 'UIProfile',
  components: {
    Sidebar,
    AppHeader,
    ProfileMenu,
    ProfileHeader,
    ManagersList,
    PersonalData,
    ProfileActions,
    MobileBottomNav,
  },
  data() {
    return {
      isMobile: false,
      // ПК меню (7 пунктов) - для Sidebar
      desktopMenuItems: [
        { id: 1, title: 'Заявки', iconPath: require('@/assets/icons/profile/note.svg'), active: false, route: '/ui-new/profile' },
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
        { id: 1, title: 'Заявки', iconPath: require('@/assets/icons/profile/note.svg'), route: '/ui-new/profile' },
        { id: 2, title: 'Объекты', iconPath: require('@/assets/icons/profile/objects-icon.svg'), route: null },
        { id: 3, title: 'Финансы', iconPath: require('@/assets/icons/profile/wallet.svg'), route: null },
        { id: 4, title: 'Исполнители', iconPath: require('@/assets/icons/profile/executor.svg'), route: null },
        { id: 5, title: 'Еще', iconPath: require('@/assets/icons/FAQ/lines-else.svg'), route: null }
      ],
      
      activeProfileMenuItem: 'account',
      
      personalData: {
        lastName: 'Брюс',
        firstName: 'Уэйн',
        middleName: 'Томасович'
      },
      
      managers: [
        {
          name: 'Иванов Иван Иванович',
          role: 'Объект 1',
          phone: '+7 (999) 999-99-99',
          email: 'anna.smirnova@ruqi.ru',
          avatarUrl: null
        },
        {
          name: 'Иванов Иван Иванович',
          role: 'Объект 1',
          phone: '+7 (999) 999-99-99',
          email: 'anna.smirnova@ruqi.ru',
          avatarUrl: null
        }
      ],
    }
  },
  computed: {
    isMobileView() {
      return this.isMobile
    },
    // Для Sidebar используем ПК меню (7 пунктов)
    sidebarMenuItems() {
      return this.desktopMenuItems
    }
  },
  mounted() {
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
    // Мок для axios чтобы избежать ошибок API
    if (!this.$axios) {
      this.$axios = {
        get: (url) => {
          console.log('Mock axios.get called with:', url)
          return Promise.resolve({ 
            data: { 
              success: true, 
              data: {
                bonus: 0,
                referrals: [],
                link: 'mock-referral-link'
              }
            } 
          })
        },
        post: (url, data) => {
          console.log('Mock axios.post called with:', url, data)
          return Promise.resolve({ 
            data: { 
              success: true, 
              data: {} 
            } 
          })
        }
      }
    }
    
    // Мок для глобальных функций
    if (typeof window !== 'undefined') {
      window.RqloggerError = window.RqloggerError || function() {
        console.warn('RqloggerError called:', arguments)
      }
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile)
  },
  methods: {
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
    handleProfileMenuClick(item) {
      if (item.id === 'organization') {
        this.$router.push('/ui-new/organisation-data')
      } else {
        console.log('Profile menu item clicked:', item)
      }
    },
    handlePersonalDataEdit() {
      console.log('Edit personal data clicked')
    },
    handlePersonalDataSave(data) {
      this.personalData = {
        ...this.personalData,
        ...data
      }
      console.log('Personal data saved:', this.personalData)
    },
    handlePersonalDataCancel() {
      console.log('Personal data edit cancelled')
    },
    handlePhoneClick() {
      console.log('Phone click')
    },
    handleEmailClick() {
      console.log('Email click')
    },
    handleTelegramLink() {
      console.log('Telegram link clicked')
    },
    handleChangePassword() {
      console.log('Change password clicked')
    },
    handleLogout() {
      console.log('Logout clicked')
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-profile {
  padding: 20px;
  padding-left: 306px; // 286px sidebar + 20px margin
  padding-top: 100px; // 80px header + 20px margin
  min-height: 100vh;
  background: #F6F8FB;

  &__main-content {
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;

    @media (max-width: 768px) {
      width: 100%;
      padding: 0;
    }
  }

  &__layout {
    display: grid;
    grid-template-columns: 290px 1fr;
    gap: 16px;
    align-items: start;

    @media (max-width: 768px) {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }

  &__left-column {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 290px;

    @media (max-width: 768px) {
      margin: 0 -16px;
      width: calc(100% + 32px);
    }
  }

  &__right-column {
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: #ffffff;
    border-radius: 8px;
    padding: 24px;

    @media (max-width: 768px) {
      width: 100%;
      border-radius: 0;
      padding: 16px;
    }
  }
}

// Sidebar Navigation Styles
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
      background-color: rgba(255, 255, 255, 0.18); // #FFFFFF2E = rgba(255, 255, 255, 0.18)
    }
    
    &--active {
      background-color: rgba(255, 255, 255, 0.18); // #FFFFFF2E - такой же как hover
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
  
  &__badge {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    background: #ffffff;
    border-radius: 10px;
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #263043;
    flex-shrink: 0;
  }
}

@media (max-width: 1200px) {
  .ui-profile {
    &__layout {
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }
}

@media (max-width: 768px) {
  .ui-profile {
    padding: 16px;
    padding-top: 24px; /* Отступ сверху для статус-бара */
    padding-bottom: 88px; /* 16px отступ + 72px для мобильного меню */
  }

  // Скрываем обычный Sidebar на мобильных
  :deep(.sidebar) {
    display: none;
  }
}
</style>

