<template>
  <div class="ui-organisms">
    <div class="ui-organisms__header">
      <h1>Organisms ({{ componentStats.organisms }})</h1>
      <p>Новые сложные блоки интерфейса</p>
    </div>

    <div class="ui-organisms__content">
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
            :class="{ 'sidebar-nav__item--active': item.active }"
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
      />
      
      <div class="ui-organisms__main-content">
        <!-- Sidebar Component Demo -->
        <div class="ui-organisms__subsection">
          <h3>Sidebar</h3>
          <p>Sidebar находится слева на всю высоту экрана</p>
        </div>

        <!-- AppHeader Component Demo -->
        <div class="ui-organisms__subsection">
          <h3>AppHeader</h3>
          <p>AppHeader находится сверху справа от sidebar</p>
        </div>

        <!-- ProfileMenu Component Demo -->
        <div class="ui-organisms__subsection">
          <h3>ProfileMenu</h3>
          <div class="ui-organisms__item">
            <ProfileMenu 
              :active-item="activeProfileMenuItem"
              @item-click="handleProfileMenuClick"
              @update:active-item="activeProfileMenuItem = $event"
            />
          </div>
        </div>

        <!-- ProfileHeader Component Demo -->
        <div class="ui-organisms__subsection">
          <h3>ProfileHeader</h3>
          <div class="ui-organisms__item" style="width: 640px;">
            <ProfileHeader name="Джон МакКлейн" />
          </div>
        </div>

        <!-- ManagerCard Component Demo -->
        <div class="ui-organisms__subsection">
          <h3>ManagerCard</h3>
          <div class="ui-organisms__item">
            <ManagerCard 
              name="Иванов Иван Иванович"
              phone="+7 (999) 999-99-99"
              email="anna.smirnova@ruqi.ru"
            />
          </div>
        </div>

        <!-- PersonalData Component Demo -->
        <div class="ui-organisms__subsection">
          <h3>PersonalData</h3>
          <div class="ui-organisms__item" style="width: 640px;">
            <PersonalData 
              :personal-data="{
                lastName: 'Брюс',
                firstName: 'Уэйн',
                middleName: 'Томасович'
              }"
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
                  icon: require('@/assets/icons/cross.svg'),
                  text: 'Подтвердите email'
                }
              }"
              @edit="handlePersonalDataEdit"
              @phone-click="handlePhoneClick"
              @email-click="handleEmailClick"
              @telegram-link="handleTelegramLink"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Импорты для новых организмов
import Sidebar from '@/components/organisms/Sidebar.vue'
import AppHeader from '@/components/organisms/AppHeader.vue'
import ProfileMenu from '@/components/organisms/ProfileMenu.vue'
import ProfileHeader from '@/components/organisms/ProfileHeader.vue'
import ManagerCard from '@/components/organisms/ManagerCard.vue'
import PersonalData from '@/components/organisms/PersonalData.vue'

export default {
  name: 'UIOrganismsNew',
  components: {
    Sidebar,
    AppHeader,
    ProfileMenu,
    ProfileHeader,
    ManagerCard,
    PersonalData,
  },
  data() {
    return {
      sidebarMenuItems: [
        { id: 1, title: 'Заявки', iconPath: require('@/assets/icons/profile/note.svg'), active: true },
        { id: 2, title: 'Объекты', iconPath: require('@/assets/icons/profile/note.svg'), active: false },
        { id: 3, title: 'Исполнители', iconPath: require('@/assets/icons/profile/executor.svg'), active: false },
        { id: 4, title: 'Поддержка', iconPath: require('@/assets/icons/profile/help.svg'), active: false },
        { id: 5, title: 'Реестры', iconPath: require('@/assets/icons/profile/book.svg'), active: false },
        { id: 6, title: 'Финансы', iconPath: require('@/assets/icons/profile/wallet.svg'), active: false },
        { id: 7, title: 'Шаблоны документов', iconPath: require('@/assets/icons/profile/document.svg'), active: false }
      ],
      
      activeProfileMenuItem: 'account',
      
      // Component stats
      componentStats: {
        atoms: 0,
        molecules: 0,
        organisms: 6,
        total: 6
      }
    }
  },
  mounted() {
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
  methods: {
    handleSidebarIconClick() {
      console.log('Sidebar icon clicked')
    },
    handleProfileMenuClick(item) {
      console.log('Profile menu item clicked:', item)
    },
    handlePersonalDataEdit() {
      console.log('Edit personal data clicked')
    },
    handlePhoneClick() {
      console.log('Phone click')
    },
    handleEmailClick() {
      console.log('Email click')
    },
    handleTelegramLink() {
      console.log('Telegram link clicked')
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-organisms {
  padding: 20px;
  padding-left: 306px; // 286px sidebar + 20px margin
  padding-top: 100px; // 80px header + 20px margin
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;

  &__header {
    margin-bottom: 40px;
    
    h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
      color: #263043;
    }
    
    p {
      font-size: 1.2em;
      color: #666;
    }
  }

  &__subsection {
    margin-bottom: 60px;
    
    h3 {
      font-size: 1.8em;
      margin-bottom: 20px;
      color: #263043;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
  }

  &__showcase {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }

  &__item {
    padding: 24px;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    background: #fafafa;
    
    h4 {
      font-size: 1.2em;
      margin-bottom: 15px;
      color: #263043;
    }
    
    > * + * {
      margin-top: 10px;
    }
    
    &--full {
      grid-column: 1 / -1;
    }
  }

  &__main-content {
    width: 100%;
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
}
</style>

