<template>
  <div class="object-detail-content">
    <!-- Header Section: Object Name + Tabs + Actions -->
    <div class="object-detail-content__header-section">
      <div class="object-detail-content__header">
        <div class="object-detail-content__header-content">
          <h1 class="object-detail-content__object-title">{{ object.name || 'Объект' }}</h1>
          <Tabs
            :tabs="tabs"
            :value="activeTab"
            @change="handleTabChange"
            type="underlined"
            class="object-detail-content__tabs"
          />
        </div>
        <div class="object-detail-content__header-actions">
          <button
            type="button"
            class="object-detail-content__actions-button"
            @click.stop="toggleHeaderMenu"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="4" r="1.5" fill="currentColor"/>
              <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
              <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
            </svg>
          </button>
          <div
            v-if="showHeaderMenu"
            class="object-detail-content__actions-menu"
          >
            <button
              type="button"
              class="object-detail-content__actions-menu-item"
              @click="handleHeaderMenuAction('add-vacancy')"
            >
              <img src="@/assets/icons/profile/Add.svg" alt="Добавить вакансию" />
              <span>Добавить вакансию</span>
            </button>
            <button
              type="button"
              class="object-detail-content__actions-menu-item"
              @click="handleHeaderMenuAction('edit')"
            >
              <img src="@/assets/icons/profile/Edit.svg" alt="Редактировать" />
              <span>Редактировать</span>
            </button>
            <button
              type="button"
              class="object-detail-content__actions-menu-item"
              @click="handleHeaderMenuAction('archive')"
            >
              <img src="@/assets/icons/trash.svg" alt="Архивировать" />
              <span>Архивировать</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Content Section -->
    <div class="object-detail-content__content-section">
      <VacanciesTab
        v-if="activeTab === 'vacancies'"
        :vacancies="vacancies"
      />
      <ApplicationsTab
        v-else-if="activeTab === 'applications'"
        :applications="applications"
      />
      <DataTab
        v-else-if="activeTab === 'data'"
        :object="object"
      />
      <ContactsTab
        v-else-if="activeTab === 'contacts'"
        :contacts="contacts"
      />
      <HistoryTab
        v-else-if="activeTab === 'history'"
        :history-items="historyItems"
      />
            </div>
          </div>
</template>

<script>
import Tabs from '@/components/atoms/Tabs.vue'
import VacanciesTab from '@/components/organisms/tabs/VacanciesTab.vue'
import ApplicationsTab from '@/components/organisms/tabs/ApplicationsTab.vue'
import DataTab from '@/components/organisms/tabs/DataTab.vue'
import ContactsTab from '@/components/organisms/tabs/ContactsTab.vue'
import HistoryTab from '@/components/organisms/tabs/HistoryTab.vue'

export default {
  name: 'ObjectDetailContent',
  components: {
    Tabs,
    VacanciesTab,
    ApplicationsTab,
    DataTab,
    ContactsTab,
    HistoryTab
  },
  props: {
    object: {
      type: Object,
      required: true,
      default: () => ({})
    },
    activeTab: {
      type: String,
      default: 'vacancies'
    }
  },
  emits: ['back', 'tab-change'],
  data() {
    return {
      // Mock data for vacancies
      vacancies: [
        {
          id: 1,
          name: 'Грузчик',
          service: 'Название услуги',
          gender: 'M',
          age: '18-70',
          currentRate: '235',
          plannedRate: '0',
          unit: 'Шт',
          status: 'На проверке'
        }
      ],
      // Mock data for contacts
      contacts: [
        {
          id: 1,
          fullName: 'Майкл Скот Иванович',
          position: 'Менеджер',
          phone: '+7 999 999 99 99',
          email: 'Mail@example.com'
        },
        {
          id: 2,
          fullName: 'Майкл Скот Иванович',
          position: 'Менеджер',
          phone: '+7 999 999 99 99',
          email: 'Mail@example.com'
        },
        {
          id: 3,
          fullName: 'Майкл Скот Иванович',
          position: 'Менеджер',
          phone: '+7 999 999 99 99',
          email: 'Mail@example.com'
        },
        {
          id: 4,
          fullName: 'Майкл Скот Иванович',
          position: 'Менеджер',
          phone: '+7 999 999 99 99',
          email: 'Mail@example.com'
        }
      ],
      // Mock data for applications
      applications: [
        {
          id: 1,
          name: 'Комплектация заказов на складе сб...',
          rate: '200 р.',
          status: 'Завершена',
          recruitmentStart: '1.10 08:00',
          recruitmentEnd: '3.10 08:00',
          filling: '22/24'
        },
        {
          id: 2,
          name: 'Комплектация заказов на складе сб...',
          rate: '200 р.',
          status: 'Завершена',
          recruitmentStart: '1.10 08:00',
          recruitmentEnd: '3.10 08:00',
          filling: '0/5'
        },
        {
          id: 3,
          name: 'Комплектация заказов на складе сб...',
          rate: '200 р.',
          status: 'Завершена',
          recruitmentStart: '1.10 08:00',
          recruitmentEnd: '3.10 08:00',
          filling: '2/24'
        },
        {
          id: 4,
          name: 'Комплектация заказов на складе сб...',
          rate: '200 р.',
          status: 'Завершена',
          recruitmentStart: '1.10 08:00',
          recruitmentEnd: '3.10 08:00',
          filling: '22/24'
        },
        {
          id: 5,
          name: 'Комплектация заказов на складе сб...',
          rate: '200 р.',
          status: 'Завершена',
          recruitmentStart: '1.10 08:00',
          recruitmentEnd: '3.10 08:00',
          filling: '22/24'
        },
        {
          id: 6,
          name: 'Комплектация заказов на складе сб...',
          rate: '200 р.',
          status: 'Завершена',
          recruitmentStart: '1.10 08:00',
          recruitmentEnd: '3.10 08:00',
          filling: '22/24'
        },
        {
          id: 7,
          name: 'Комплектация заказов на складе сб...',
          rate: '200 р.',
          status: 'Завершена',
          recruitmentStart: '1.10 08:00',
          recruitmentEnd: '3.10 08:00',
          filling: '22/24'
        },
        {
          id: 8,
          name: 'Комплектация заказов на складе сб...',
          rate: '200 р.',
          status: 'Завершена',
          recruitmentStart: '1.10 08:00',
          recruitmentEnd: '3.10 08:00',
          filling: '22/24'
        }
      ],
      // Mock data for history
      historyItems: [
        {
          id: 1,
          date: '10.10.2025',
          time: '15:00',
          event: 'Изменение статуса объекта - Активен',
          detailLabel: 'Объект',
          detailValue: 'Брюс Уйен'
        },
        {
          id: 2,
          date: '10.10.2025',
          time: '15:00',
          event: 'Изменение статуса объекта - Активен',
          detailLabel: 'Объект',
          detailValue: 'Брюс Уйен'
        },
        {
          id: 3,
          date: '10.10.2025',
          time: '15:00',
          event: 'Изменение статуса объекта - Активен',
          detailLabel: 'Объект',
          detailValue: 'Брюс Уйен'
        },
        {
          id: 4,
          date: '10.10.2025',
          time: '15:00',
          event: 'Изменение статуса объекта - Активен',
          detailLabel: 'Объект',
          detailValue: 'Брюс Уйен'
        },
        {
          id: 5,
          date: '10.10.2025',
          time: '15:00',
          event: 'Изменение статуса объекта - Активен',
          detailLabel: 'Объект',
          detailValue: 'Брюс Уйен'
        },
        {
          id: 6,
          date: '10.10.2025',
          time: '15:00',
          event: 'Изменение статуса объекта - Активен',
          detailLabel: 'Объект',
          detailValue: 'Брюс Уйен'
        },
        {
          id: 7,
          date: '10.10.2025',
          time: '15:00',
          event: 'Изменение статуса объекта - Активен',
          detailLabel: 'Объект',
          detailValue: 'Брюс Уйен'
        }
      ],
      showHeaderMenu: false
    }
  },
  computed: {
    tabs() {
      return [
        { text: 'Вакансии', value: 'vacancies' },
        { text: 'Заявки', value: 'applications' },
        { text: 'Данные', value: 'data' },
        { text: 'Контакты', value: 'contacts' },
        { text: 'История', value: 'history' }
      ]
    }
  },
  mounted() {
    if (typeof document !== 'undefined') {
      document.addEventListener('click', this.handleDocumentClick)
    }
  },
  beforeUnmount() {
    if (typeof document !== 'undefined') {
      document.removeEventListener('click', this.handleDocumentClick)
    }
  },
  methods: {
    handleDocumentClick() {
      this.showHeaderMenu = false
    },
    handleBack() {
      this.$emit('back')
    },
    handleMenuClick() {
      console.log('Menu clicked')
      // TODO: Implement menu logic
    },
    handleTabChange(tab) {
      this.$emit('tab-change', tab)
    },
    toggleHeaderMenu() {
      this.showHeaderMenu = !this.showHeaderMenu
    },
    handleHeaderMenuAction(action) {
      this.showHeaderMenu = false
      if (action === 'add-vacancy') {
        // Логика аналогична VacanciesTab.handleAddVacancy
        const object = this.object || {}
        const objectId = object.id || (typeof window !== 'undefined'
          ? window.localStorage.getItem('uiObjects.selectedObjectId')
          : null)
        const objectName = object.name || null

        const query = {}
        if (objectId) query.objectId = objectId
        if (objectName) query.objectName = objectName

        this.$router.push({ path: '/ui-new/objects/create-vacancy', query })
        return
      }

      // Здесь позже можно реализовать реальные действия для edit/archive
      console.log('Object header action:', action, this.object)
    }
  }
}
</script>

<style lang="scss">
.object-detail-content {
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding-top: 16px;
    overflow-y: hidden;
  }
}


.object-detail-content__header-section {
    padding: 24px;
    padding-bottom: 0;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 0;
  border-radius: 10px;

  @media (max-width: 768px) {
    display: none;
  }
}

.object-detail-content__toolbar-wrapper{
padding-right: 24px;
padding-left: 24px;

  @media (max-width: 768px) {
    padding: 0;
  }
}


.object-detail-content__object-title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  color: #263043;
  margin: 0 0 0 0;
  padding: 0;
}

.object-detail-content__content-section {
  margin-top: 24px;
  background: #ffffff;
  border-radius: 10px;

  @media (max-width: 768px) {
    margin: 0;
    padding: 0;
    background: transparent;
    border-radius: 0;
  }
}


.object-detail-content__header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 0;
  border-bottom: none;
}

.object-detail-content__header-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.object-detail-content__header-actions {
  position: relative;
}

.object-detail-content__breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}

.object-detail-content__breadcrumb-item {
  color: #666666;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #1735F5;
  }

  &--active {
    color: #263043;
    cursor: default;
    font-weight: 500;

    &:hover {
      color: #263043;
    }
  }
}

.object-detail-content__breadcrumb-separator {
  color: #666666;
}

.object-detail-content__menu-button {
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
  border-radius: 8px;
  transition: background 0.2s ease;
  color: #666666;
  margin-top: 0;

  &:hover {
    background: #F2F8FF;
    color: #1735F5;
  }

  svg {
    width: 16px;
    height: 16px;
  }
}

.object-detail-content__tabs {
  margin-top: 0;
  margin-bottom: 0;
  align-self: flex-start;
}

.object-detail-content__back-button {
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
  border-radius: 8px;
  transition: background 0.2s ease;

  &:hover {
    background: #F2F8FF;
  }

  img {
    width: 24px;
    height: 24px;
  }
}

.object-detail-content__title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  color: #263043;
  margin: 0;
}

.object-detail-content__actions-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  color: #666666;
  transition: background-color 0.2s ease, color 0.2s ease;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background-color: #F2F8FF;
    color: #1735F5;
  }
}

.object-detail-content__actions-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  min-width: 320px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow:
    0px 8px 48px 4px #0234e30a,
    0px 0px 10px 0px #1735f508;
  padding: 8px 0;
  z-index: 20;
}

.object-detail-content__actions-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #263043;

  img {
    width: 16px;
    height: 16px;
    filter: grayscale(1);
  }

  &:hover {
    background: #F6F8FB;
  }
}


.object-detail-content__data-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;

  @media (max-width: 768px) {
    padding: 0;
    gap: 16px;
  }
}

.object-detail-content__data-title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
  color: #263043;
  margin: 0;
  padding: 0 16px 16px 16px;
  border-bottom: 1px solid #E3E5E4;

  @media (max-width: 768px) {
    font-size: 16px;
    line-height: 1.25;
    padding: 0 0 12px 0;
    margin-bottom: 0;
  }
}

.object-detail-content__data-content {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  padding: 0 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    padding: 0;
  }
}

.object-detail-content__data-image {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  border-radius: 10px;
  overflow: hidden;
  background: #F6F8FB;
  border: 1px solid #E3E5E4;

  @media (max-width: 768px) {
    width: 56px;
    height: 56px;
    border-radius: 8px;
  }
}

.object-detail-content__data-image-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.object-detail-content__data-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F6F8FB;
}

.object-detail-content__data-fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;

  @media (max-width: 768px) {
    gap: 16px;
    width: 100%;
  }
}

.object-detail-content__data-field {
  display: flex;
  flex-direction: column;
  gap: 4px;

  @media (max-width: 768px) {
    gap: 8px;
  }
}

.object-detail-content__data-label {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #666666;

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0.1px;
  }
}

.object-detail-content__data-value {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #263043;

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 1.25;
  }
}

.object-detail-content__info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.object-detail-content__section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.object-detail-content__section-title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
  color: #263043;
  margin: 0;
}

.object-detail-content__info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.object-detail-content__info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.object-detail-content__info-label {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #666666;
}

.object-detail-content__info-value {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #263043;
}

.object-detail-content__exit-percent {
  font-weight: 600;

  &--zero {
    color: #263043;
  }

  &--low {
    color: #E53E3E;
  }

  &--medium {
    color: #F6AD55;
  }

  &--high {
    color: #38A169;
  }
}

.object-detail-content__tab-content {
  padding: 0;
  margin-top: 24px;

  @media (max-width: 768px) {
    margin: 0;
    padding: 0;
  }
}

.object-detail-content__toolbar {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    padding: 0;
    margin-bottom: 16px;
  }
}

.object-detail-content__toolbar-left {
  display: flex;
  gap: 16px;
  align-items: center;
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;
    flex-wrap: wrap;
    gap: 12px;
  }
}

.object-detail-content__toolbar-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
  }
}

.object-detail-content__toolbar-top {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: nowrap;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    flex-wrap: nowrap;
    gap: 12px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}

.object-detail-content__toolbar-bottom {
  display: flex;
  gap: 12px;
  align-items: center;
  /* width: 100%; */
  justify-content: space-between;

  @media (max-width: 768px) {
    gap: 12px;
    flex-direction: column;
    align-items: stretch;
  }
}

.object-detail-content__filter-button-mobile {
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-direction: row;
    padding: 10px 16px;
    border: 1px solid #dadada;
    background: #ffffff;
    border-radius: 8px;
    cursor: pointer;
    color: #263043;
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    white-space: nowrap;
    flex: 0 0 auto;
    flex-shrink: 0;
    transition: all 0.2s ease;

    &:hover {
      background: #F2F8FF;
      border-color: #1735F5;
      color: #1735F5;
    }
  }
}

.object-detail-content__filter-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.object-detail-content__filter-button {
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

  @media (max-width: 768px) {
    display: none !important;
  }
}

.object-detail-content__search {
  flex: 0 0 auto;
  min-width: 200px;
  max-width: 280px;
  width: 280px;

  @media (max-width: 768px) {
    flex: 1;
    min-width: 0;
    max-width: none;
    width: auto;
  }
}

.object-detail-content__search-input {
  width: 100%;
}

.object-detail-content__search-icon {
  width: 20px;
  height: 20px;
}

.object-detail-content__filter-button {
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

  color: #666666;

  &:hover {
    background: #F2F8FF;
    border-color: #1735F5;
    color: #1735F5;
  }

  @media (max-width: 768px) {
    display: none !important;
  }

  svg {
    width: 16px;
    height: 16px;
  }
}

.object-detail-content__vat-info {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #666666;
  padding: 10px 16px;
  background: #F6F8FB;
  border-radius: 8px;
}

.object-detail-content__add-button {
  display: flex;
  align-items: center;
  gap: 8px;

  :deep(.rq_button .slot) {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 0px;
  }
}

.object-detail-content__add-icon {
  width: 16px;
  height: 16px;
}

.object-detail-content__bulk-actions {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 16px 24px;
  background: #ffffff;
  margin-bottom: 16px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 12px 16px;
  }
}

.object-detail-content__bulk-actions-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.object-detail-content__bulk-actions-label {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #263043;
}

.object-detail-content__bulk-actions-counter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  padding: 2px 8px;
  border-radius: 16px;
  background: #F3F3F3;
  font-family: 'Nunito Sans', 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #263043;
}

.object-detail-content__bulk-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #263043;

  &:hover {
    color: #1735F5;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
}

.object-detail-content__bulk-action-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  object-fit: contain;
  opacity: 1;
  display: block;
  // Базовый цвет для иконок (серый #263043)
  filter: brightness(0) saturate(100%) invert(15%) sepia(8%) saturate(750%) hue-rotate(201deg) brightness(101%) contrast(89%);
}

.object-detail-content__bulk-action-text {
  white-space: nowrap;
}

.object-detail-content__table-wrapper {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
  background: #ffffff;
  border: 1px solid #E3E5E4;
  border-radius: 10px;

  @media (max-width: 768px) {
    display: none;
  }

  &--desktop {
    @media (max-width: 768px) {
      display: none;
    }
  }
}

.object-detail-content__cards-wrapper {
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }
}

.object-detail-content__card {
  background: #ffffff;
  border: 1px solid #dadada;
  border-radius: 10px;
  padding: 16px;
  transition: all 0.2s ease;

  &--selected {
    border-color: #1735F5;
    background: #F2F8FF;
  }
}

.object-detail-content__card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.object-detail-content__card-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  flex-shrink: 0;
  // Цвет чекбокса в вакансиях / карточках объекта
  accent-color: #666666;
}

.object-detail-content__card-title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #263043;
  margin: 0;
  flex: 1;
}

.object-detail-content__card-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  color: #666666;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #F2F8FF;
    color: #1735F5;
  }

  svg {
    width: 16px;
    height: 16px;
  }
}

.object-detail-content__card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.object-detail-content__card-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 14px;
  line-height: 20px;
}

.object-detail-content__card-label {
  color: #666666;
  font-weight: 400;
  min-width: 120px;
  flex-shrink: 0;
}

.object-detail-content__card-value {
  color: #263043;
  font-weight: 400;
  flex: 1;
  word-break: break-word;
}

.object-detail-content__cards-empty {
  text-align: center;
  padding: 40px 16px;
  color: #666666;
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 16px;
}

.object-detail-content__table {
  width: 100%;
  max-width: 100%;
  border-collapse: collapse;
  box-sizing: border-box;
  border-spacing: 0;
}

.object-detail-content__table thead tr {
  border-bottom: 1px solid #E3E5E4;
}

.object-detail-content__th {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 14px;
  /* font-weight: 600; */
  line-height: 20px;
  color: #666666;
  text-align: left;
  padding: 12px 16px;
  background: #FBFBFB;
  white-space: nowrap;
  position: relative;

  &:not(:last-child):not(&--actions):not(&--status)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 22px;
    background: #E3E5E4;
  }

  &--checkbox {
    width: 48px;
    text-align: center;
  }

  &--name {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &--actions {
    width: 64px;
    text-align: right;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}

.object-detail-content__sort-icon {
  width: 12px;
  height: 12px;
  color: #666666;
  cursor: pointer;
}

.object-detail-content__row {
  border-bottom: 1px solid #F6F8FB;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #F6F8FB;
  }

  &--selected {
    background-color: #F2F8FF;
  }

  &:first-child {
    border-top: none;
  }

  &--empty {
    &:hover {
      background-color: transparent;
    }
  }
}

.object-detail-content__td {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #263043;
  padding: 12px 16px;
  border-bottom: 1px solid #F6F8FB;

  &--checkbox {
    text-align: center;
    width: 48px;
  }

  &--name {
    font-weight: 500;
  }

  &--actions {
    text-align: center;
    width: 48px;
  }
}

.object-detail-content__checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  flex-shrink: 0;
  accent-color: #1735F5;
}

.object-detail-content__status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;

  &--review {
    color: #F6AD55;
  }

  &--active {
    color: #38A169;
  }

  &--completed {
    color: #666666;
  }

  &--cancelled {
    color: #E53E3E;
  }
}

.object-detail-content__status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #F6AD55;
}

.object-detail-content__actions-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  color: #666666;
  transition: all 0.2s ease;

  &:hover {
    background: #F2F8FF;
    color: #1735F5;
  }

  svg {
    width: 16px;
    height: 16px;
  }

  &--header {
    margin-left: auto;
    margin-right: 0;
  }
}

.object-detail-content__empty {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #666666;
  text-align: center;
  margin: 0;
}

.object-detail-content__filling {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  white-space: nowrap;
  border: 1px solid transparent;

  &--empty {
    background: #F6F8FB;
    border-color: #E3E5E4;
    color: #666666;
  }

  &--partial {
    background: #FFF2E8;
    border-color: #FFBB96;
    color: #EB4D3D;
  }

  &--full {
    background: #E6FFFA;
    border-color: #15CAA9;
    color: #15CAA9;
  }
}

.object-detail-content__filling-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  display: block;
}

// Применяем цвет к иконке через CSS переменные или прямое изменение fill
.object-detail-content__filling--empty .object-detail-content__filling-icon {
  filter: brightness(0) saturate(100%) invert(40%);
}

.object-detail-content__filling--partial .object-detail-content__filling-icon {
  filter: brightness(0) saturate(100%) invert(54%) sepia(33%) saturate(3434%) hue-rotate(336deg) brightness(101%) contrast(97%);
}

.object-detail-content__filling--full .object-detail-content__filling-icon {
  // Для цвета #15CAA9 используем специальный фильтр
  filter: brightness(0) saturate(100%) invert(65%) sepia(80%) saturate(500%) hue-rotate(140deg);
}

.object-detail-content__history-wrapper {
  padding: 24px;
}

.object-detail-content__history-timeline {
  display: flex;
  flex-direction: column;
  position: relative;
}

.object-detail-content__history-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  position: relative;
}

.object-detail-content__history-time {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #666666;
  white-space: nowrap;
  min-width: 120px;
}

.object-detail-content__history-line-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex-shrink: 0;
  width: 20px;
  align-self: stretch;
}

.object-detail-content__history-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #1735F5;
  flex-shrink: 0;
  z-index: 1;
  position: absolute;
  top: 0;
}

.object-detail-content__history-line {
  width: 1px;
  height: 100%;
  background: #E3E5E4;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.object-detail-content__history-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  padding-bottom: 24px;
}

.object-detail-content__history-item:last-child .object-detail-content__history-content {
  padding-bottom: 0;
}

.object-detail-content__history-event {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #263043;
}

.object-detail-content__history-details {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-left: 0;
}

.object-detail-content__history-detail-label {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #666666;
}

.object-detail-content__history-detail-value {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #1735F5;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #0d28c4;
  }
}
</style>

