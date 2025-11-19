<template>
  <div class="ui-objects">
    <!-- Mobile Header -->
    <div v-if="isMobileView" class="ui-objects__mobile-header">
      <button class="ui-objects__back-button" @click="selectedObject ? handleBackToObjects() : handleBack()">
        <img src="@/assets/icons/profile/arrow-left.svg" alt="Back" />
      </button>
      <h1 class="ui-objects__mobile-title">{{ selectedObject ? (selectedObject.name || 'Объект') : 'Объекты' }}</h1>
      <div class="ui-objects__mobile-header-spacer"></div>
    </div>

    <!-- Mobile Tabs (только когда выбран объект) -->
    <div v-if="isMobileView && selectedObject" class="ui-objects__mobile-tabs">
      <Tabs
        :tabs="objectDetailTabs"
        :value="activeObjectTab"
        @change="activeObjectTab = $event"
        type="underlined"
        class="ui-objects__mobile-tabs-content"
      />
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
      :title="selectedObject ? null : 'Объекты'"
      :breadcrumbs="selectedObject ? [
        { text: 'Объекты', path: '/ui-new/objects' },
        { text: selectedObject.name || 'Объект' }
      ] : null"
      :show-documents="false"
    />
    
    <div class="ui-objects__main-content">
      <!-- Tabs: Активные / Архив - выше основного компонента (скрываются при просмотре детальной информации) -->
      <Tabs
        v-if="!selectedObject"
        :tabs="tabs"
        :value="activeTab"
        @change="activeTab = $event"
        type="contained"
        wide
        class="ui-objects__tabs"
      />
      
      <!-- Object Detail View -->
      <ObjectDetailContent
        v-if="selectedObject"
        :object="selectedObject"
        :active-tab="activeObjectTab"
        @back="handleBackToObjects"
        @tab-change="activeObjectTab = $event"
      />
      
      <!-- Objects List/Grid/Map View -->
      <ObjectsContent
        v-else
        :objects="objects"
        :total-count="objectsTotalCount"
        :active-tab="activeTab"
        default-view-mode="map"
        @create-object="handleCreateObject"
        @object-action="handleObjectAction"
        @page-change="handleObjectsPageChange"
        @filter-change="handleObjectsFilterChange"
      />
    </div>

    <!-- Mobile Bottom Navigation (только на мобильных) -->
    <MobileBottomNav v-if="isMobileView" :menu-items="mobileMenuItems" />
  </div>
</template>

<script>
import Sidebar from '@/components/organisms/Sidebar.vue'
import AppHeader from '@/components/organisms/AppHeader.vue'
import ObjectsContent from '@/components/organisms/ObjectsContent.vue'
import ObjectDetailContent from '@/components/organisms/ObjectDetailContent.vue'
import MobileBottomNav from '@/components/organisms/MobileBottomNav.vue'
import Tabs from '@/components/atoms/Tabs.vue'

export default {
  name: 'UIObjects',
  components: {
    Sidebar,
    AppHeader,
    ObjectsContent,
    ObjectDetailContent,
    MobileBottomNav,
    Tabs
  },
  data() {
    return {
      isMobile: false,
      // ПК меню (8 пунктов) - для Sidebar
      desktopMenuItems: [
        { id: 1, title: 'Заявки', iconPath: require('@/assets/icons/profile/note.svg'), active: false, route: null },
        { id: 2, title: 'Объекты', iconPath: require('@/assets/icons/profile/objects-icon.svg'), active: true, route: '/ui-new/objects' },
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
        { id: 2, title: 'Объекты', iconPath: require('@/assets/icons/profile/objects-icon.svg'), route: '/ui-new/objects' },
        { id: 3, title: 'Финансы', iconPath: require('@/assets/icons/profile/wallet.svg'), route: null },
        { id: 4, title: 'Исполнители', iconPath: require('@/assets/icons/profile/executor.svg'), route: null },
        { id: 5, title: 'Еще', iconPath: require('@/assets/icons/FAQ/lines-else.svg'), route: null }
      ],
      activeTab: 'active', // 'active' | 'archive'
      activeObjectTab: 'vacancies', // 'vacancies' | 'applications' | 'data' | 'contacts' | 'history'
      objects: [],
      objectsTotalCount: 0,
      selectedObject: null // Выбранный объект для детального просмотра
    }
  },
  computed: {
    tabs() {
      return [
        { text: 'Активные', value: 'active' },
        { text: 'Архив', value: 'archive' }
      ]
    },
    objectDetailTabs() {
      return [
        { text: 'Вакансии', value: 'vacancies' },
        { text: 'Заявки', value: 'applications' },
        { text: 'Данные', value: 'data' },
        { text: 'Контакты', value: 'contacts' },
        { text: 'История', value: 'history' }
      ]
    },
    isMobileView() {
      return this.isMobile
    },
    // Для Sidebar используем ПК меню
    sidebarMenuItems() {
      return this.desktopMenuItems
    }
  },
  mounted() {
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
    this.loadObjects()
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
      console.log('Sidebar icon clicked')
    },
    handleSidebarItemClick(item) {
      if (item.route) {
        this.$router.push(item.route)
      }
    },
    handleCreateObject() {
      console.log('Create object clicked')
      // TODO: Implement create object logic
    },
    handleObjectAction(object) {
      // При клике на объект показываем детальную информацию
      this.selectedObject = object
    },
    handleBackToObjects() {
      // Возвращаемся к списку объектов
      this.selectedObject = null
    },
    handleObjectsPageChange(page) {
      console.log('Page changed to:', page)
      this.loadObjects(page)
    },
    handleObjectsFilterChange(filter) {
      console.log('Filter changed:', filter)
      this.loadObjects(1, filter)
    },
    loadObjects(page = 1, filter = {}) {
      // TODO: Replace with actual API call
      // Mock data for now
      this.objects = [
        { id: 1, name: 'Магнит косметик', applications: 5, location: 'Россия, Санкт-Петербург пр. Невский, 85', avgOutput: 3, output: 2, exitPercent: 70, lat: 59.9343, lon: 30.3351, archived: false },
        { id: 2, name: 'Пятёрочка', applications: 11, location: 'Россия, Екатеринбург ул. Ленина, 12', avgOutput: 5, output: 3, exitPercent: 100, lat: 56.8431, lon: 60.6454, archived: false },
        { id: 3, name: 'Озон фреш', applications: 0, location: 'Россия, Москва ул. Генерала Горбатого 34', avgOutput: 0, output: 0, exitPercent: 0, lat: 55.7650, lon: 37.6350, archived: false },
        { id: 4, name: 'Карусель', applications: 3, location: 'Россия, Москва ул. Примерная, 1', avgOutput: 2, output: 1, exitPercent: 50, lat: 55.7558, lon: 37.6173, archived: false },
        { id: 5, name: 'Билла', applications: 7, location: 'Россия, Санкт-Петербург ул. Примерная, 2', avgOutput: 4, output: 2, exitPercent: 40, lat: 59.9343, lon: 30.3351, archived: false },
        { id: 6, name: 'Твой дом', applications: 2, location: 'Россия, Москва ул. Примерная, 3', avgOutput: 1, output: 1, exitPercent: 1, lat: 55.7512, lon: 37.6184, archived: false },
        { id: 7, name: 'Дикси', applications: 4, location: 'Россия, Екатеринбург ул. Примерная, 4', avgOutput: 2, output: 1, exitPercent: 2, lat: 56.8431, lon: 60.6454, archived: false },
        { id: 8, name: 'Лента', applications: 8, location: 'Россия, Москва ул. Примерная, 5', avgOutput: 6, output: 2, exitPercent: 100, lat: 55.7520, lon: 37.6156, archived: false },
        { id: 9, name: 'Светофор', applications: 1, location: 'Россия, Санкт-Петербург ул. Примерная, 6', avgOutput: 0, output: 0, exitPercent: 0, lat: 59.9343, lon: 30.3351, archived: false },
        { id: 10, name: 'Ашан', applications: 9, location: 'Россия, Москва ул. Примерная, 7', avgOutput: 7, output: 3, exitPercent: 100, lat: 55.7540, lon: 37.6200, archived: false }
      ]
      this.objectsTotalCount = 10
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-objects {
  padding: 0;
  padding-left: 0;
  padding-top: 0;
  min-height: 100vh;
  background: #F6F8FB;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
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

  &__mobile-tabs {
    display: none;

    @media (max-width: 768px) {
      display: block;
      width: 100%;
      background: #ffffff;
      border-bottom: 1px solid #E3E5E4;
      padding: 16px 16px 0 16px;
      margin: 0;
    }
  }

  &__mobile-tabs-content {
    width: 100%;

    :deep(.horizontal-scroll) {
      width: 100%;
      padding: 0;
      margin: 0;
    }

    :deep(.center_section) {
      width: 100%;
    }

    :deep(.scroll_section) {
      width: 100%;
      min-width: 100%;
    }

    :deep(.tabs_container) {
      width: 100%;
      padding: 0;
      margin: 0;
      display: flex;
      gap: 0;
    }

    :deep(.tabs_container.underlined) {
      gap: 0;
      justify-content: space-between;
      width: 100%;
    }

    :deep(.tab) {
      flex: 0 0 auto;
      text-align: center;
    }
  }

  &__main-content {
    max-width: none;
    width: 100%;
    margin: 0;
    overflow-x: hidden;
    box-sizing: border-box;
    padding-top: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;

    @media (min-width: 769px) {
      padding-top: 0;
    }

    @media (max-width: 768px) {
      width: 100%;
      padding: 16px;
      padding-top: 0;
    }
  }

  &__tabs {
    width: 400px; // Фиксированная ширина как в Figma
    align-self: flex-start; // Прижимаем к левому краю
    
    :deep(.tabs_container) {
      width: 400px; // Фиксированная ширина на десктопе
      
      &.wide {
        width: 400px; // Фиксированная ширина 400px на десктопе
        
        .tab {
          justify-content: center;
          padding: 0px 24px;
        }
      }
    }

    @media (max-width: 768px) {
      width: 100%; // На всю ширину в мобильной версии
      
      :deep(.tabs_container) {
        width: 100%; // На всю ширину в мобильной версии
        
        &.wide {
          width: 100%; // На всю ширину в мобильной версии
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .ui-objects {
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
    padding-bottom: 72px; // Отступ снизу для мобильного меню
    background: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  // Скрываем обычный Sidebar на мобильных
  :deep(.sidebar) {
    display: none;
  }

  // Скрываем AppHeader на мобильных
  .ui-objects :deep(.app-header) {
    display: none;
  }
}
</style>

