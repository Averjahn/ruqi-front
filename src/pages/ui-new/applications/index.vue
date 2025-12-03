<template>
  <div class="ui-applications">
    <!-- Mobile Header -->
    <div v-if="isMobileView" class="ui-applications__mobile-header">
      <button class="ui-applications__back-button" @click="handleBack">
        <img src="@/assets/icons/profile/arrow-left.svg" alt="Back" />
      </button>
      <h1 class="ui-applications__mobile-title">Заявки</h1>
      <div class="ui-applications__mobile-header-spacer"></div>
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
      title="Заявки"
      :show-documents="false"
    />
    
    <div class="ui-applications__main-content">
      <!-- Toolbar -->
      <div class="ui-applications__toolbar">
        <div class="ui-applications__toolbar-left">
          <div class="ui-applications__search">
            <Input
              v-model="searchQuery"
              placeholder="Поиск"
              class="ui-applications__search-input"
              clearable
            >
              <template #left>
                <img src="@/assets/icon_deprecated/search.svg" alt="Search" class="ui-applications__search-icon" />
              </template>
            </Input>
          </div>
          <div class="ui-applications__object-filter">
            <Select
              v-model="selectedObject"
              :options="objectOptions"
              placeholder="Объект"
              clearable
              class="ui-applications__select"
              item-value="value"
              item-text="label"
            />
          </div>
          <div class="ui-applications__status-filter">
            <Select
              v-model="selectedStatus"
              :options="statusOptions"
              placeholder="Статус"
              clearable
              class="ui-applications__select"
              item-value="value"
              item-text="label"
            />
          </div>
          <button class="ui-applications__filter-button" @click="handleFilterClick">
            <img src="@/assets/icons/profile/Filter.svg" alt="Filter" class="ui-applications__filter-icon" />
          </button>
        </div>
        <div class="ui-applications__toolbar-right">
          <Button
            type="contained"
            color="blue"
            size="m"
            @click="handleCreateApplication"
            class="ui-applications__create-button"
          >
            <img src="@/assets/icons/profile/Add.svg" alt="Add" class="ui-applications__create-icon" />
            Создать заявку
          </Button>
          <div class="ui-applications__view-toggles">
            <button
              class="ui-applications__view-toggle"
              :class="{ 'ui-applications__view-toggle--active': viewMode === 'table' }"
              @click="viewMode = 'table'"
              title="Таблица"
            >
              <img src="@/assets/icons/profile/Table.svg" alt="Table" class="ui-applications__view-toggle-icon" />
            </button>
            <button
              class="ui-applications__view-toggle"
              :class="{ 'ui-applications__view-toggle--active': viewMode === 'grid' }"
              @click="viewMode = 'grid'"
              title="Сетка"
            >
              <img src="@/assets/icons/profile/Grid.svg" alt="Grid" class="ui-applications__view-toggle-icon" />
            </button>
          </div>
        </div>
      </div>

      <!-- Table View -->
      <div v-if="viewMode === 'table'" class="ui-applications__table-wrapper">
        <table class="ui-applications__table">
          <thead>
            <tr>
              <th class="ui-applications__th ui-applications__th--checkbox">
                <input
                  type="checkbox"
                  :checked="allSelected"
                  @change="handleSelectAll"
                  class="ui-applications__checkbox"
                />
              </th>
              <th class="ui-applications__th">Название</th>
              <th class="ui-applications__th">Ставка в час</th>
              <th class="ui-applications__th">Объект</th>
              <th class="ui-applications__th">Статус</th>
              <th class="ui-applications__th">Закрытие</th>
              <th class="ui-applications__th">Набор</th>
              <th class="ui-applications__th">Наполнение</th>
              <th class="ui-applications__th ui-applications__th--actions"></th>
            </tr>
          </thead>
          <tbody>
            <!-- Empty State внутри таблицы -->
            <tr v-if="!hasObjects && applications.length === 0" class="ui-applications__empty-row">
              <td colspan="9" class="ui-applications__empty-cell">
                <div class="ui-applications__empty">
                  <div class="ui-applications__empty-content">
                    <img 
                      src="@/assets/icons/FAQ/search-folder.svg" 
                      alt="Empty" 
                      class="ui-applications__empty-icon"
                    />
                    <div class="ui-applications__empty-text">
                      <h3 class="ui-applications__empty-title">
                        У вас нет ни одного объекта
                      </h3>
                      <p class="ui-applications__empty-description">
                        Для создания заявки вам нужно добавить хотя бы один объект
                      </p>
                    </div>
                    <Button
                      type="contained"
                      color="blue"
                      size="l"
                      @click="handleCreateObject()"
                      class="ui-applications__empty-button"
                    >
                      <img src="@/assets/icons/profile/Add.svg" alt="Add" class="ui-applications__empty-button-icon" />
                      Добавить объект
                    </Button>
                  </div>
                </div>
              </td>
            </tr>
            <!-- Empty State когда есть объекты, но нет заявок -->
            <tr v-else-if="hasObjects && applications.length === 0" class="ui-applications__empty-row">
              <td colspan="9" class="ui-applications__empty-cell">
                <div class="ui-applications__empty">
                  <div class="ui-applications__empty-content">
                    <img 
                      src="@/assets/icons/FAQ/search-folder.svg" 
                      alt="Empty" 
                      class="ui-applications__empty-icon"
                    />
                    <div class="ui-applications__empty-text">
                      <h3 class="ui-applications__empty-title">
                        У вас нет еще заявок
                      </h3>
                      <p class="ui-applications__empty-description">
                        Нажмите на кнопку, чтобы создать заявку
                      </p>
                    </div>
                    <Button
                      type="contained"
                      color="blue"
                      size="l"
                      @click="handleCreateApplication()"
                      class="ui-applications__empty-button"
                    >
                      <img src="@/assets/icons/profile/Add.svg" alt="Add" class="ui-applications__empty-button-icon" />
                      Создать заявку
                    </Button>
                  </div>
                </div>
              </td>
            </tr>
            <!-- Заявки -->
            <tr
              v-for="application in filteredApplications"
              :key="application.id"
              class="ui-applications__row"
            >
              <td class="ui-applications__td ui-applications__td--checkbox">
                <input
                  type="checkbox"
                  :checked="selectedApplications.includes(application.id)"
                  @change="handleSelectApplication(application.id)"
                  class="ui-applications__checkbox"
                />
              </td>
              <td class="ui-applications__td">{{ application.name }}</td>
              <td class="ui-applications__td">{{ application.hourlyRate || '-' }}</td>
              <td class="ui-applications__td">{{ application.objectName }}</td>
              <td class="ui-applications__td">
                <span class="ui-applications__status" :class="`ui-applications__status--${application.status}`">
                  {{ application.statusText }}
                </span>
              </td>
              <td class="ui-applications__td">{{ application.closingDate || '-' }}</td>
              <td class="ui-applications__td">{{ application.recruitment || '-' }}</td>
              <td class="ui-applications__td">{{ application.filling || '-' }}</td>
              <td class="ui-applications__td ui-applications__td--actions" @click.stop>
                <button
                  class="ui-applications__actions-button"
                  @click="handleApplicationActions(application)"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="4" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Grid View -->
      <div v-else-if="viewMode === 'grid'" class="ui-applications__grid">
        <div
          v-for="application in filteredApplications"
          :key="application.id"
          class="ui-applications__grid-card"
        >
          <div class="ui-applications__grid-card-header">
            <input
              type="checkbox"
              :checked="selectedApplications.includes(application.id)"
              @change="handleSelectApplication(application.id)"
              class="ui-applications__grid-card-checkbox"
            />
            <h3 class="ui-applications__grid-card-title">{{ application.name }}</h3>
            <button
              class="ui-applications__grid-card-actions"
              @click="handleApplicationActions(application)"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="4" r="1.5" fill="currentColor"/>
                <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
              </svg>
            </button>
          </div>
          <div class="ui-applications__grid-card-body">
            <div class="ui-applications__grid-card-item">
              <span class="ui-applications__grid-card-label">Объект:</span>
              <span class="ui-applications__grid-card-value">{{ application.objectName }}</span>
            </div>
            <div class="ui-applications__grid-card-item">
              <span class="ui-applications__grid-card-label">Статус:</span>
              <span class="ui-applications__grid-card-value" :class="`ui-applications__status--${application.status}`">
                {{ application.statusText }}
              </span>
            </div>
            <div class="ui-applications__grid-card-item">
              <span class="ui-applications__grid-card-label">Дата создания:</span>
              <span class="ui-applications__grid-card-value">{{ formatDate(application.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Bottom Navigation (только на мобильных) -->
    <MobileBottomNav v-if="isMobileView" :menu-items="mobileMenuItems" />

    <!-- Notification about unsigned documents -->
    <div v-if="showDocumentsWarning" class="ui-applications__notification">
      <div class="ui-applications__notification-content">
        <div class="ui-applications__notification-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="9" fill="#EB4D3D" stroke="white" stroke-width="2"/>
            <text x="10" y="14" text-anchor="middle" fill="white" font-size="12" font-weight="bold">i</text>
          </svg>
        </div>
        <div class="ui-applications__notification-text">
          <div class="ui-applications__notification-title">Не возможно создать заявку</div>
          <div class="ui-applications__notification-message">Не подписаны документы</div>
          <a href="/ui-new/profile" class="ui-applications__notification-link">Перейти в профиль</a>
        </div>
        <button class="ui-applications__notification-close" @click="showDocumentsWarning = false">
          <img src="@/assets/icons/cross.svg" alt="Close" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/organisms/Sidebar.vue'
import AppHeader from '@/components/organisms/AppHeader.vue'
import MobileBottomNav from '@/components/organisms/MobileBottomNav.vue'
import Input from '@/components/atoms/Input.vue'
import Select from '@/components/atoms/Select.vue'
import Button from '@/components/atoms/Button.vue'

export default {
  name: 'UIApplications',
  components: {
    Sidebar,
    AppHeader,
    MobileBottomNav,
    Input,
    Select,
    Button
  },
  data() {
    return {
      isMobile: false,
      // ПК меню (8 пунктов) - для Sidebar
      desktopMenuItems: [
        { id: 1, title: 'Заявки', iconPath: require('@/assets/icons/profile/note.svg'), active: true, route: '/ui-new/applications' },
        { id: 2, title: 'Объекты', iconPath: require('@/assets/icons/profile/objects-icon.svg'), active: false, route: '/ui-new/objects' },
        { id: 3, title: 'Исполнители', iconPath: require('@/assets/icons/profile/executor.svg'), active: false, route: null },
        { id: 4, title: 'Поддержка', iconPath: require('@/assets/icons/profile/help.svg'), active: false, route: '/ui-new/FAQ' },
        { id: 5, title: 'Чат', iconPath: require('@/assets/icons/profile/chat-icon.svg'), active: false, route: null, badge: 11 },
        { id: 6, title: 'Реестры', iconPath: require('@/assets/icons/profile/book.svg'), active: false, route: null },
        { id: 7, title: 'Финансы', iconPath: require('@/assets/icons/profile/wallet.svg'), active: false, route: null },
        { id: 8, title: 'Шаблоны документов', iconPath: require('@/assets/icons/profile/document.svg'), active: false, route: '/ui-new/document-templates' }
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
      selectedObject: null,
      selectedStatus: null,
      viewMode: 'table', // 'table' | 'grid'
      selectedApplications: [],
      applications: [], // Mock data - будет заменено на реальные данные
      showDocumentsWarning: false, // Показывать уведомление о неподписанных документах
      objectOptions: [
        { label: 'Магнит косметик', value: 1 },
        { label: 'Пятёрочка', value: 2 },
        { label: 'Озон фреш', value: 3 }
      ],
      statusOptions: [
        { label: 'В работе', value: 'active' },
        { label: 'Завершена', value: 'completed' },
        { label: 'На проверке', value: 'review' },
        { label: 'Отменена', value: 'cancelled' }
      ]
    }
  },
  computed: {
    isMobileView() {
      return this.isMobile
    },
    sidebarMenuItems() {
      return this.desktopMenuItems
    },
    hasObjects() {
      return Array.isArray(this.objectOptions) && this.objectOptions.length > 0
    },
    filteredApplications() {
      let filtered = this.applications

      // Поиск
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(app =>
          app.name.toLowerCase().includes(query) ||
          app.objectName.toLowerCase().includes(query)
        )
      }

      // Фильтр по объекту
      if (this.selectedObject) {
        filtered = filtered.filter(app => app.objectId === this.selectedObject)
      }

      // Фильтр по статусу
      if (this.selectedStatus) {
        filtered = filtered.filter(app => app.status === this.selectedStatus)
      }

      return filtered
    },
    allSelected() {
      return this.filteredApplications.length > 0 &&
        this.filteredApplications.every(app => this.selectedApplications.includes(app.id))
    }
  },
  mounted() {
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
    this.loadApplications()
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
    handleFilterClick() {
      console.log('Filter clicked')
      // TODO: Open filter modal
    },
    handleCreateApplication() {
      this.$router.push('/ui-new/applications/create')
    },
    handleCreateObject() {
      this.$router.push('/ui-new/objects/create')
    },
    handleSelectAll(event) {
      if (event.target.checked) {
        this.selectedApplications = this.filteredApplications.map(app => app.id)
      } else {
        this.selectedApplications = []
      }
    },
    handleSelectApplication(id) {
      const index = this.selectedApplications.indexOf(id)
      if (index > -1) {
        this.selectedApplications.splice(index, 1)
      } else {
        this.selectedApplications.push(id)
      }
    },
    handleApplicationActions(application) {
      console.log('Application actions:', application)
      // TODO: Open actions menu
    },
    formatDate(date) {
      if (!date) return ''
      const d = new Date(date)
      return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
    },
    loadApplications() {
      // TODO: Replace with actual API call
      // Mock data for now
      this.applications = []
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-applications {
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
  position: relative;

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
    max-width: none;
    width: 100%;
    margin: 0;
    overflow-x: hidden;
    box-sizing: border-box;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: #ffffff;
    border-radius: 10px;

    @media (max-width: 768px) {
      padding: 16px;
      border-radius: 0;
      background: #F6F8FB;
    }
  }

  &__toolbar {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 12px;
    }
  }

  &__toolbar-left {
    display: flex;
    gap: 16px;
    align-items: center;
    flex-wrap: wrap;
    flex: 1;

    @media (max-width: 768px) {
      width: 100%;
      flex-wrap: wrap;
    }
  }

  &__toolbar-right {
    display: flex;
    gap: 16px;
    align-items: center;
    flex-shrink: 0;

    @media (max-width: 768px) {
      width: 100%;
      justify-content: space-between;
    }
  }

  &__search {
    flex: 0 0 auto;
    width: 220px;

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  &__object-filter {
    flex: 0 0 auto;
    width: 160px;

    @media (max-width: 768px) {
      width: calc(50% - 8px);
    }
  }

  &__status-filter {
    flex: 0 0 auto;
    width: 200px;

    @media (max-width: 768px) {
      width: calc(50% - 8px);
    }
  }

  &__filter-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 8px;
    border: 1px solid #dadada;
    background: #ffffff;
    border-radius: 8px;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.2s ease;

    &:hover {
      background: #F2F8FF;
      border-color: #1735F5;
    }

    img {
      width: 16px;
      height: 16px;
    }
  }

  &__create-button {
    flex-shrink: 0;
  }

  &__view-toggles {
    display: flex;
    gap: 2px;
    background: #F3F3F3;
    border-radius: 8px;
    padding: 2px;
    flex-shrink: 0;
  }

  &__view-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 0;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    &--active {
      background: #ffffff;
      box-shadow: 0px 0px 10px 0px rgba(23, 53, 245, 0.03), 0px 8px 48px 4px rgba(2, 52, 227, 0.04);
    }

    img {
      width: 20px;
      height: 20px;
    }
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 683px;
    padding: 16px;
    width: 100%;
  }

  &__empty-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    max-width: 500px;
    text-align: center;
  }

  &__empty-icon {
    width: 160px;
    height: 110px;
    object-fit: contain;
  }

  &__empty-text {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__empty-title {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 400;
    font-size: 20px;
    line-height: 1.25;
    color: #263043;
    margin: 0;
  }

  &__empty-description {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 1.5;
    color: #666666;
    margin: 0;
  }

  &__empty-button {
    width: 220px;
  }

  &__empty-row {
    &:hover {
      background-color: transparent;
    }
  }

  &__empty-cell {
    padding: 0;
    border: none;
  }

  &__table-wrapper {
    overflow-x: auto;
    width: 100%;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    background: #ffffff;
  }

  &__th {
    padding: 12px 16px;
    text-align: left;
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: #666666;
    border-bottom: 1px solid #f3f3f3;
    background: #fbfbfb;

    &--checkbox {
      width: 64px;
      text-align: center;
      padding: 12px 24px;
    }

    &--actions {
      width: 64px;
      text-align: center;
    }
  }

  &__td {
    padding: 12px 16px;
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: #263043;
    border-bottom: 1px solid #f3f3f3;

    &--checkbox {
      text-align: center;
      padding: 12px 24px;
    }

    &--actions {
      text-align: center;
    }
  }

  &__row {
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #F6F8FB;
    }
  }

  &__checkbox {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  &__status {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;

    &--active {
      background: #E6F7FF;
      color: #1735F5;
    }

    &--completed {
      background: #E6F7E6;
      color: #52C41A;
    }

    &--review {
      background: #FFF7E6;
      color: #FA8C16;
    }

    &--cancelled {
      background: #FFE6E6;
      color: #EB4D3D;
    }
  }

  &__actions-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    color: #666666;
    transition: color 0.2s ease;

    &:hover {
      color: #263043;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
    width: 100%;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &__grid-card {
    background: #ffffff;
    border: 1px solid #E3E5E4;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
    }
  }

  &__grid-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__grid-card-checkbox {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  &__grid-card-title {
    flex: 1;
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #263043;
    margin: 0;
  }

  &__grid-card-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    color: #666666;
  }

  &__grid-card-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__grid-card-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  &__grid-card-label {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #666666;
  }

  &__grid-card-value {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #263043;
    text-align: right;
  }

  &__notification {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 1000;
    max-width: 400px;

    @media (max-width: 768px) {
      bottom: 80px;
      right: 16px;
      left: 16px;
      max-width: none;
    }
  }

  &__notification-content {
    display: flex;
    gap: 12px;
    padding: 16px;
    background: #ffffff;
    border: 1px solid #EB4D3D;
    border-radius: 8px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  }

  &__notification-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }

  &__notification-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__notification-title {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: #263043;
    margin: 0;
  }

  &__notification-message {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #666666;
    margin: 0;
  }

  &__notification-link {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #1735F5;
    text-decoration: none;
    margin-top: 4px;

    &:hover {
      text-decoration: underline;
    }
  }

  &__notification-close {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 16px;
      height: 16px;
    }
  }
}

@media (max-width: 768px) {
  .ui-applications {
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
    padding-bottom: 72px;
    background: #ffffff;
  }

  :deep(.sidebar) {
    display: none;
  }

  .ui-applications :deep(.app-header) {
    display: none;
  }
}
</style>


