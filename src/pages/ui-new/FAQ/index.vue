<template>
  <div class="ui-faq">
    <!-- Mobile Header -->
    <div v-if="isMobileView" class="ui-faq__mobile-header">
      <button class="ui-faq__back-button" @click="handleBack">
        <img src="@/assets/icons/profile/arrow-left.svg" alt="Back" />
      </button>
      <h1 class="ui-faq__mobile-title">Поддержка</h1>
      <div class="ui-faq__mobile-header-spacer"></div>
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
      title="Поддержка"
      :show-documents="false"
    />
    
    <div class="ui-faq__main-content">
      <!-- Search Bar -->
      <FaqSearchBar
        v-model="searchQuery"
        @search="handleSearch"
        @create-request="handleCreateRequest"
      />

      <!-- Tabs -->
      <Tabs
        :tabs="tabs"
        :value="activeTab"
        @change="handleTabChange"
        type="contained"
        wide
        class="ui-faq__tabs"
      />

      <!-- Content -->
      <div v-if="activeTab === 'knowledge-base'" class="ui-faq__content">
        <!-- Desktop: Cards -->
        <div v-if="!isMobileView" class="ui-faq__cards">
          <FaqCard
            v-for="(card, index) in knowledgeBaseCards"
            :key="index"
            :title="card.title"
            :links="card.links"
          />
        </div>
        <!-- Mobile: Accordion -->
        <div v-else class="ui-faq__accordion">
          <FaqAccordionItem
            v-for="(card, index) in knowledgeBaseCards"
            :key="index"
            :title="card.title"
            :links="card.links"
            :class="{ 'faq-accordion-item--bordered': index < knowledgeBaseCards.length - 1 }"
          />
        </div>
      </div>

      <div v-else-if="activeTab === 'my-requests'" class="ui-faq__content">
        <SupportRequestsList
          v-if="supportRequests.length > 0"
          :requests="supportRequests"
          @request-click="handleRequestClick"
        />
        <SupportRequestsEmpty
          v-else
          @create-request="handleCreateRequest"
        />
      </div>
    </div>

    <!-- Mobile Bottom Navigation (только на мобильных) -->
    <MobileBottomNav v-if="isMobileView" :menu-items="mobileMenuItems" />
  </div>
</template>

<script>
import Sidebar from '@/components/organisms/Sidebar.vue'
import AppHeader from '@/components/organisms/AppHeader.vue'
import FaqSearchBar from '@/components/molecules/FaqSearchBar.vue'
import Tabs from '@/components/atoms/Tabs.vue'
import FaqCard from '@/components/molecules/FaqCard.vue'
import FaqAccordionItem from '@/components/molecules/FaqAccordionItem.vue'
import MobileBottomNav from '@/components/organisms/MobileBottomNav.vue'
import MainButton from '@/components/atoms/MainButton.vue'
import SupportRequestsList from '@/components/organisms/SupportRequestsList.vue'
import SupportRequestsEmpty from '@/components/organisms/SupportRequestsEmpty.vue'
import testSupportRequestsData from '@/test-support-requests.json'

export default {
  name: 'UIFAQ',
  components: {
    Sidebar,
    AppHeader,
    FaqSearchBar,
    Tabs,
    FaqCard,
    FaqAccordionItem,
    MobileBottomNav,
    MainButton,
    SupportRequestsList,
    SupportRequestsEmpty
  },
  data() {
    return {
      isMobile: false,
      // ПК меню (7 пунктов) - для Sidebar
      desktopMenuItems: [
        { id: 1, title: 'Заявки', iconPath: require('@/assets/icons/profile/note.svg'), route: '/ui-new/applications' },
        { id: 2, title: 'Объекты', iconPath: require('@/assets/icons/profile/objects-icon.svg'), route: '/ui-new/objects' },
        { id: 3, title: 'Исполнители', iconPath: require('@/assets/icons/profile/executor.svg'), route: null },
        { id: 4, title: 'Поддержка', iconPath: require('@/assets/icons/profile/help.svg'), route: '/ui-new/FAQ' },
        { id: 5, title: 'Чат', iconPath: require('@/assets/icons/profile/chat-icon.svg'), route: null, badge: 11 },
        { id: 6, title: 'Реестры', iconPath: require('@/assets/icons/profile/book.svg'), route: null },
        { id: 7, title: 'Финансы', iconPath: require('@/assets/icons/profile/wallet.svg'), route: null },
        { id: 8, title: 'Шаблоны документов', iconPath: require('@/assets/icons/profile/document.svg'), route: '/ui-new/document-templates' }
      ],
      // Мобильное меню (5 пунктов) - для MobileBottomNav
      mobileMenuItems: [
        { id: 1, title: 'Заявки', iconPath: require('@/assets/icons/profile/note.svg'), route: '/ui-new/applications' },
        { id: 2, title: 'Объекты', iconPath: require('@/assets/icons/profile/objects-icon.svg'), route: '/ui-new/objects' },
        { id: 3, title: 'Финансы', iconPath: require('@/assets/icons/profile/wallet.svg'), route: null },
        { id: 4, title: 'Исполнители', iconPath: require('@/assets/icons/profile/executor.svg'), route: null },
        { id: 5, title: 'Еще', iconPath: require('@/assets/icons/FAQ/lines-else.svg'), route: null }
      ],
      searchQuery: '',
      activeTab: 'knowledge-base',
      tabs: [
        { text: 'База знаний', value: 'knowledge-base' },
        { text: 'Мои обращения', value: 'my-requests' }
      ],
      knowledgeBaseCards: [
        {
          title: 'Личный кабинет исполнителя',
          links: [
            { text: 'Регистрация', to: null },
            { text: 'Заполнение документов в личном кабинете', to: null, underlined: true },
            { text: 'Смена e-mail', to: null },
            { text: 'Добавление способов оплаты', to: null },
            { text: 'Как обратиться в поддержку?', to: null },
            { text: 'Смена номера телефона', to: null },
            { text: 'Смена пароля учетной записи', to: null }
          ]
        },
        {
          title: 'Профиль пользователя',
          links: [
            { text: 'Статья про профиль пользователя', to: null },
            { text: 'Как получить статус Самозанятого', to: null },
            { text: 'Кто такие самозанятые', to: null }
          ]
        },
        {
          title: 'Личный кабинет исполнителя',
          links: [
            { text: 'Как записаться на заявку?', to: null }
          ]
        }
      ],
      supportRequests: testSupportRequestsData.data || []
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
    handleSearch(query) {
      console.log('Search:', query)
      // Здесь будет логика поиска
    },
    handleCreateRequest() {
      console.log('Create request clicked')
      // Здесь будет логика создания обращения
    },
    handleTabChange(tab) {
      this.activeTab = tab
      console.log('Tab changed to:', tab)
    },
    handleRequestClick(request) {
      console.log('Request clicked:', request)
      // Здесь будет логика перехода к деталям обращения
      // this.$router.push(`/support/${request.id}`)
    },
    handleBack() {
      this.$router.push('/ui-new/profile')
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-faq {
  padding: 0;
  padding-left: 0;
  padding-top: 0;
  min-height: 100vh;
  background: #F6F8FB;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden; // Предотвращаем горизонтальную прокрутку
  width: 100%;
  box-sizing: border-box;

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
    width: 100%;

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
    display: flex;
    flex-direction: column;
    gap: 32px;
    align-items: stretch; /* Для ПК: растягиваем элементы на всю ширину */
    padding-top: 24px; /* Отступ сверху для статус-бара на мобильной */
    overflow-x: hidden; // Предотвращаем горизонтальную прокрутку
    box-sizing: border-box;

    @media (min-width: 769px) {
      padding-top: 0;
    }
  }
}

.ui-faq__tabs {
  // margin-bottom: 32px;
  width: 392px !important;
  // margin-left: auto; /* Для ПК: центрируем Tabs по горизонтали */
  // margin-right: auto; /* Для ПК: центрируем Tabs по горизонтали */
  
  @media (min-width: 769px) {
    margin-left: calc(50% - 196px);
  }
  
  :deep(.tabs_container) {
    width: 392px !important;
  }
  
  :deep(.horizontal-scroll) {
    width: 392px !important;
  }
  
  :deep(.horizontal_scroll.wide .scroll_section) {
    min-width: 392px !important;
    width: 392px !important;
  }
}

.ui-faq__content {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

/* Desktop: Cards */
.ui-faq__cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30%, 1fr));
  gap: 24px;
  align-items: stretch;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

/* Mobile: Accordion */
.ui-faq__accordion {
  display: flex;
  flex-direction: column;
  gap: 0; /* Убираем зазоры между элементами, так как бордеры будут внутри */
  background: #f6f8fb; /* Фон для всего блока аккордеона */
  border-radius: 16px;
  border-top: 1px solid #0000001A; /* Общий бордер для всего блока */
  border-bottom: 1px solid #0000001A; /* Общий бордер для всего блока */
  overflow: hidden; /* Для корректного отображения border-radius с внутренними бордерами */
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.faq-accordion-item--bordered {
  border-bottom: 1px solid #0000001A; /* Бордер между элементами аккордеона */
}



@media (max-width: 1200px) {
  .ui-faq__cards {
    grid-template-columns: repeat(auto-fit, minmax(45%, 1fr));
  }
}

@media (max-width: 768px) {
  .ui-faq {
    padding-left: 0;
    padding-right: 0;
    padding-top: 20px; /* Уменьшаем отступ сверху, так как Sidebar скрыт */
    padding-bottom: 72px; /* Отступ снизу для мобильного меню (высота меню 72px) */
    background: #ffffff; // Белый фон в мобильной версии
  }

  .ui-faq__main-content {
    width: 100%; /* Изменено с calc(100% - 32px) */
    padding: 0 16px; /* Отступы по 16px для основного контента */
    margin-top: 63px;
  }

  .ui-faq__tabs {
    width: 100% !important; /* Изменено с calc(100vw - 32px) */
    
    :deep(.tabs_container) {
      width: 100% !important; /* Изменено с calc(100vw - 32px) */
      
      &.contained {
        width: 100%; /* Изменено с calc(100vw - 32px) */
        
        .tab {
          width: 100%; /* Изменено с calc(100vw - 32px) */
        }
      }
    }
    
    :deep(.horizontal-scroll) {
      width: 100% !important; /* Изменено с calc(100vw - 32px) */
    }
    
    :deep(.horizontal_scroll.wide .scroll_section) {
      min-width: 100% !important; /* Изменено с calc(100vw - 32px) */
      width: 100% !important; /* Изменено с calc(100vw - 32px) */
    }
  }

  .faq-search-bar__actions {
    width: 100%; /* Изменено с calc(100dvw - 32px) */
    gap: 19px;
  }

  .faq-search-bar {
    gap: 19px;
  }

  .ui-faq__accordion {
    width: 100%;
    border-radius: 0; /* Убираем border-radius на мобильных */
    margin: auto; /* Центрируем блок аккордеона */
    background: #f6f8fb; /* Фон для контейнера аккордеона */
  }

  .ui-faq__cards {
    width: 100%; /* Изменено с calc(100dvw - 32px) */
  }

  // Скрываем обычный Sidebar на мобильных
  :deep(.sidebar) {
    display: none;
  }
}

@media (max-width: 440px) {
  .ui-faq__cards {
    grid-template-columns: 1fr;
  }
}
</style>

