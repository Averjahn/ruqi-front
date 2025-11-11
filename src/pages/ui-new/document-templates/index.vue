<template>
  <div class="ui-document-templates">
    <!-- Mobile Header -->
    <div v-if="isMobileView" class="ui-document-templates__mobile-header">
      <button class="ui-document-templates__back-button" @click="handleBack">
        <img src="@/assets/icons/profile/arrow-left.svg" alt="Back" />
      </button>
      <h1 class="ui-document-templates__mobile-title">Документы</h1>
      <div class="ui-document-templates__mobile-header-spacer"></div>
    </div>

    <!-- Sidebar Component - Fixed to left (Desktop only) -->
    <Sidebar 
      v-if="!isMobileView"
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
      v-if="!isMobileView"
      :show-notifications="true"
      title="Документы"
      :show-documents="false"
    />
    
    <div class="ui-document-templates__main-content">
      <div class="ui-document-templates__layout">
        <!-- Left Column: DocumentTemplatesMenu (Desktop only) -->
        <div v-if="!isMobileView" class="ui-document-templates__left-column">
          <DocumentTemplatesMenu 
            :active-item="activeMenuItem"
            @item-click="handleMenuClick"
            @update:active-item="activeMenuItem = $event"
          />
        </div>

        <!-- Right Column: Content -->
        <div class="ui-document-templates__right-column">
          <h2 class="ui-document-templates__title">{{ currentMenuTitle }}</h2>
          
          <DocumentLinksList 
            :links="currentLinks"
            @link-click="handleLinkClick"
          />
        </div>
      </div>
    </div>

    <!-- Mobile Bottom Navigation -->
    <MobileBottomNav v-if="isMobileView" :menu-items="mobileMenuItems" />
  </div>
</template>

<script>
import Sidebar from '@/components/organisms/Sidebar.vue'
import AppHeader from '@/components/organisms/AppHeader.vue'
import DocumentTemplatesMenu from '@/components/organisms/DocumentTemplatesMenu.vue'
import DocumentLinksList from '@/components/organisms/DocumentLinksList.vue'
import MobileBottomNav from '@/components/organisms/MobileBottomNav.vue'

export default {
  name: 'UIDocumentTemplates',
  components: {
    Sidebar,
    AppHeader,
    DocumentTemplatesMenu,
    DocumentLinksList,
    MobileBottomNav
  },
  data() {
    return {
      isMobile: false,
      activeMenuItem: 'legal',
      // ПК меню (7 пунктов) - для Sidebar
      desktopMenuItems: [
        { id: 1, title: 'Заявки', iconPath: require('@/assets/icons/profile/note.svg'), active: false, route: null },
        { id: 2, title: 'Объекты', iconPath: require('@/assets/icons/profile/objects-icon.svg'), active: false, route: null },
        { id: 3, title: 'Исполнители', iconPath: require('@/assets/icons/profile/executor.svg'), active: false, route: null },
        { id: 4, title: 'Поддержка', iconPath: require('@/assets/icons/profile/help.svg'), active: false, route: '/ui-new/FAQ' },
        { id: 5, title: 'Чат', iconPath: require('@/assets/icons/profile/chat-icon.svg'), active: false, route: null, badge: 11 },
        { id: 6, title: 'Реестры', iconPath: require('@/assets/icons/profile/book.svg'), active: false, route: null },
        { id: 7, title: 'Финансы', iconPath: require('@/assets/icons/profile/wallet.svg'), active: false, route: null },
        { id: 8, title: 'Шаблоны документов', iconPath: require('@/assets/icons/profile/document.svg'), active: true, route: '/ui-new/document-templates' }
      ],
      // Мобильное меню (5 пунктов) - для MobileBottomNav
      mobileMenuItems: [
        { id: 1, title: 'Заявки', iconPath: require('@/assets/icons/profile/note.svg'), route: null },
        { id: 2, title: 'Объекты', iconPath: require('@/assets/icons/profile/objects-icon.svg'), route: null },
        { id: 3, title: 'Финансы', iconPath: require('@/assets/icons/profile/wallet.svg'), route: null },
        { id: 4, title: 'Исполнители', iconPath: require('@/assets/icons/profile/executor.svg'), route: null },
        { id: 5, title: 'Еще', iconPath: require('@/assets/icons/FAQ/lines-else.svg'), route: null }
      ],
      // Данные для разных разделов меню
      menuData: {
        legal: {
          title: 'Юридические документы',
          links: [
            { title: 'Пользовательское соглашение c RUQI', date: 'Действует с 10.08.2025', url: '' },
            { title: 'Пользовательское соглашение c RUQI', date: 'Действует с 10.08.2025', url: '' },
            { title: 'Пользовательское соглашение c RUQI', date: 'Действует с 10.08.2025', url: '' },
            { title: 'Пользовательское соглашение c RUQI', date: 'Действует с 10.08.2025', url: '' },
            { title: 'Пользовательское соглашение c RUQI', date: 'Действует с 10.08.2025', url: '' }
          ]
        },
        licenses: {
          title: 'Лицензии',
          links: []
        },
        other: {
          title: 'Какие то еще',
          links: []
        }
      }
    }
  },
  computed: {
    isMobileView() {
      return this.isMobile
    },
    sidebarMenuItems() {
      return this.desktopMenuItems
    },
    currentMenuTitle() {
      return this.menuData[this.activeMenuItem]?.title || ''
    },
    currentLinks() {
      return this.menuData[this.activeMenuItem]?.links || []
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
    handleSidebarIconClick() {
      console.log('Sidebar icon clicked')
    },
    handleSidebarItemClick(item) {
      // Обработка клика по элементу меню (если нужна дополнительная логика)
      console.log('Sidebar item clicked:', item)
    },
    handleMenuClick(item) {
      console.log('Menu item clicked:', item)
    },
    handleLinkClick(link) {
      console.log('Link clicked:', link)
      if (link.url) {
        // Здесь будет логика перехода по ссылке
      }
    },
    handleBack() {
      this.$router.push('/ui-new/profile')
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-document-templates {
  padding: 0;
  padding-left: 0;
  padding-top: 0;
  min-height: 100vh;
  background: #F6F8FB;

  @media (min-width: 769px) {
    padding: 20px;
    padding-left: 306px; // 286px sidebar + 20px margin
    padding-top: 100px; // 80px header + 20px margin
  }

  &__mobile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background: #ffffff;
    border-bottom: 1px solid #E3E5E4;
    position: sticky;
    top: 0;
    z-index: 100;

    @media (min-width: 769px) {
      display: none;
    }
  }

  &__back-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    flex-shrink: 0;

    img {
      width: 24px;
      height: 24px;
    }
  }

  &__mobile-title {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    color: #263043;
    margin: 0;
    flex: 1;
    text-align: center;
  }

  &__mobile-header-spacer {
    width: 40px;
    flex-shrink: 0;
  }

  &__main-content {
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    padding-top: 24px; /* Отступ сверху для статус-бара на мобильной */

    @media (min-width: 769px) {
      padding-top: 0;
    }
  }

  &__layout {
    display: block;

    @media (min-width: 769px) {
      display: grid;
      grid-template-columns: 290px 1fr;
      gap: 16px;
      align-items: start;
    }
  }

  &__left-column {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 290px;
  }

  &__right-column {
    display: flex;
    flex-direction: column;
    gap: 32px;
    background: #ffffff;
    border-radius: 10px;
    padding: 24px;
    width: 100%;
  }

  &__title {
    font-family: 'Source Sans Pro', 'Source Sans', sans-serif;
    font-size: 22px;
    font-weight: 700;
    line-height: 1.25;
    color: #263043;
    margin: 0;
  }
}

@media (max-width: 1200px) {
  .ui-document-templates {
    &__layout {
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }
}

@media (max-width: 768px) {
  .ui-document-templates {
    padding-left: 0;
    padding-right: 0;
    padding-top: 20px;
    padding-bottom: 72px;
    background: #ffffff; // Белый фон в мобильной версии
  }

  .ui-document-templates__main-content {
    width: calc(100% - 32px);
    padding: 0 16px;
    margin-top: 63px;
  }

  .ui-document-templates__layout {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .ui-document-templates__left-column {
    width: 100%;
  }

  .ui-document-templates__right-column {
    padding: 16px;
  }

  .ui-document-templates__title {
    font-size: 20px;
  }

  // Скрываем обычный Sidebar на мобильных
  :deep(.sidebar) {
    display: none;
  }
}
</style>

