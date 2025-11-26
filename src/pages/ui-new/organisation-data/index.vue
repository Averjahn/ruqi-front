<template>
  <div class="ui-organisation-data">
    <!-- Mobile Header -->
    <div v-if="isMobile" class="ui-organisation-data__mobile-header">
      <button class="ui-organisation-data__back-button" @click="handleBack">
        <img src="@/assets/icons/profile/arrow-left.svg" alt="Back" />
      </button>
      <h1 class="ui-organisation-data__mobile-title">Об организации</h1>
      <div class="ui-organisation-data__mobile-header-spacer"></div>
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
    
    <div class="ui-organisation-data__main-content">
      <div class="ui-organisation-data__layout">
        <!-- Left Column: ProfileMenu and ManagersList (Desktop only) -->
        <div v-if="!isMobile" class="ui-organisation-data__left-column">
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
        <div class="ui-organisation-data__right-column">
          <!-- Tabs -->
          <Tabs
            :tabs="tabs"
            :value="activeTab"
            @change="handleTabChange"
            type="underlined"
            item-value="id"
            item-text="label"
            class="ui-organisation-data__tabs"
          />

          <!-- Description -->
          <p class="ui-organisation-data__description">
            {{ description }}
          </p>

          <!-- Organisation Data Form -->
          <div v-if="activeTab === 'data'" class="ui-organisation-data__form">
            <OrganisationDataForm
              ref="form"
              v-model="formData"
              :counterparty-types="counterpartyTypes"
              @data-filled="handleDataFilled"
              @upload-error="handleUploadError"
            />
            
            <!-- Action Buttons -->
            <div class="ui-organisation-data__actions">
              <Button
                type="outlined"
                color="blue"
                @click="handleCancel"
              >
                Отменить
              </Button>
              <Button
                type="contained"
                color="blue"
                @click="handleSave"
                :loading="loading"
              >
                Сохранить изменения
              </Button>
            </div>
          </div>

          <!-- Documents Tab Content -->
          <div v-else-if="activeTab === 'documents'" class="ui-organisation-data__documents">
            <h2 class="ui-organisation-data__documents-title">Документы</h2>
            <p class="ui-organisation-data__documents-description">
              Для подтверждения подлинности введенных вами данных, пожалуйста прикрепите скан-фото оригиналов документов
            </p>
            
            <WarningBlock 
              title="Внимание!"
              text="На фотографии должны быть отчётливо видны серия, номер, основные данные. В поле зрения не должны попадать пальцы и посторонние предметы."
              :icon="require('@/assets/icons/info_blue.svg')"
            />
            
            <DocumentCard
              title="Свидетельство о постановке на учет в налоговом органе"
              :file="currentDocument"
              @delete="handleDeleteDocument"
            />
            
            <div v-if="documentHistory.length > 0" class="ui-organisation-data__history">
              <DocumentHistoryItem
                v-for="(item, index) in documentHistory"
                :key="index"
                :status="item.status"
                :date="item.date"
                :author="item.author"
              />
            </div>
            
            <!-- Action Buttons -->
            <div class="ui-organisation-data__actions">
              <Button
                type="outlined"
                color="blue"
                @click="handleCancel"
              >
                Отменить
              </Button>
              <div class="ui-organisation-data__actions-divider"></div>
              <Button
                type="contained"
                color="blue"
                @click="handleSave"
                :loading="loading"
              >
                Сохранить изменения
              </Button>
            </div>
          </div>
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
import ProfileMenu from '@/components/organisms/ProfileMenu.vue'
import ManagersList from '@/components/organisms/ManagersList.vue'
import OrganisationDataForm from '@/components/organisms/OrganisationDataForm.vue'
import Tabs from '@/components/atoms/Tabs.vue'
import Button from '@/components/atoms/Button.vue'
import MobileBottomNav from '@/components/organisms/MobileBottomNav.vue'
import WarningBlock from '@/components/atoms/WarningBlock.vue'
import DocumentCard from '@/components/molecules/DocumentCard.vue'
import DocumentHistoryItem from '@/components/molecules/DocumentHistoryItem.vue'

export default {
  name: 'UIOrganisationData',
  components: {
    Sidebar,
    AppHeader,
    ProfileMenu,
    ManagersList,
    OrganisationDataForm,
    Tabs,
    Button,
    MobileBottomNav,
    WarningBlock,
    DocumentCard,
    DocumentHistoryItem
  },
  data() {
    return {
      isMobile: false,
      loading: false,
      activeTab: 'data',
      activeProfileMenuItem: 'organization',
      description: 'Укажите основную информацию о вашей организации. Эти данные помогут нам создать ваш профиль, чтобы вы могли размещать вакансии и подработки. Пожалуйста, заполните все обязательные поля внимательно.',
      tabs: [
        { id: 'data', label: 'Данные об организации' },
        { id: 'documents', label: 'Документы' }
      ],
      // ПК меню (8 пунктов) - для Sidebar
      desktopMenuItems: [
        { id: 1, title: 'Заявки', iconPath: require('@/assets/icons/profile/note.svg'), active: false, route: '/ui-new/applications' },
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
      ],
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
      formData: {
        logo: null,
        counterpartyType: 'legal',
        inn: '',
        fullName: '',
        kpp: '',
        ogrn: '',
        okato: '',
        fullNamePerson: '',
        position: '',
        basis: '',
        mailingAddress: '',
        legalAddress: '',
        settlementAccount: '',
        correspondentAccount: '',
        bic: '',
        bank: '',
        vatRate: null
      },
      counterpartyTypes: [
        { value: 'legal', label: 'Юридическое лицо' },
        { value: 'other', label: 'Прочее' }
      ],
      currentDocument: {
        name: 'Screenshot_20241118_183604.jpg',
        size: '3,0МВ',
        preview: require('@/assets/imgs/document.png'),
        file: null
      },
      documentHistory: [
        {
          status: 'Загружен',
          date: '09.11.21 22:00',
          author: 'Худобин А.И.'
        },
        {
          status: 'Утверждён',
          date: '09.11.21 22:00',
          author: 'Ивановский В.С.'
        },
        {
          status: 'Изменён',
          date: '09.11.21 22:00',
          author: 'Ивановский В.С.'
        }
      ]
    }
  },
  computed: {
    isMobileView() {
      return this.isMobile
    },
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
    handleProfileMenuClick(item) {
      if (item.id === 'account') {
        this.$router.push('/ui-new/profile')
      } else if (item.id === 'organization') {
        // Уже на странице организации
        return
      } else if (item.id === 'doc-platform') {
        this.$router.push('/ui-new/platform-documents')
      } else {
        console.log('Profile menu item clicked:', item)
      }
    },
    handleTabChange(tabId) {
      this.activeTab = tabId
    },
    handleDataFilled() {
      console.log('Data filled')
    },
    handleUploadError(error) {
      console.error('Upload error:', error)
    },
    handleCancel() {
      this.$router.push('/ui-new/profile')
    },
    async handleSave() {
      this.loading = true
      try {
        // Здесь будет логика сохранения данных
        console.log('Saving organisation data:', this.formData)
        // Имитация сохранения
        await new Promise(resolve => setTimeout(resolve, 1000))
        // После успешного сохранения можно вернуться на профиль
        // this.$router.push('/ui-new/profile')
      } catch (error) {
        console.error('Save error:', error)
      } finally {
        this.loading = false
      }
    },
    handleDeleteDocument() {
      this.currentDocument = null
      console.log('Document deleted')
    },
    handleBack() {
      this.$router.push('/ui-new/profile')
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-organisation-data {
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
    margin: 0 auto;
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
    gap: 24px;
    background: #ffffff;
    border-radius: 0;
    padding: 16px;
    padding-top: 24px; /* Отступ сверху для статус-бара */

    @media (min-width: 769px) {
      border-radius: 8px;
      padding: 24px;
      padding-top: 24px;
    }
  }

  &__tabs {
    margin-bottom: 0;
  }

  &__description {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: #666666;
    margin: 0;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 15px;
    justify-content: center;
    margin-top: 0;
    padding-top: 0;
    border-top: none;
    background: #ffffff;
    padding: 16px;
    margin-left: -16px;
    margin-right: -16px;
    margin-bottom: -16px;
    width: calc(100% + 32px);

    :deep(.rq_button) {
      flex: 1;
      max-width: 45vw;
      min-width: 40vw;
    }

    @media (min-width: 769px) {
      gap: 12px;
      justify-content: flex-end;
      padding-top: 24px;
      border-top: 1px solid #E0E0E0;
      background: transparent;
      margin-left: 0;
      margin-right: 0;
      margin-bottom: 0;
      width: auto;

      :deep(.rq_button) {
        flex: none;
        max-width: none;
        min-width: auto;
      }
    }
  }

  &__actions-divider {
    display: none;

    @media (min-width: 769px) {
      display: block;
      width: 1px;
      height: 20px;
      background: #E0E0E0;
      flex-shrink: 0;
    }
  }

  &__documents {
    display: flex;
    flex-direction: column;
    gap: 24px;

    @media (min-width: 769px) {
      gap: 32px;
    }
  }

  &__documents-title {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 600;
    font-size: 24px;
    line-height: 30px;
    color: #2E2E2E;
    margin: 0;

    @media (min-width: 769px) {
      font-size: 20px;
      line-height: 28px;
      color: #263043;
    }
  }

  &__documents-description {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #666666;
    margin: 0;
  }

  &__history {
    display: flex;
    flex-direction: column;
    gap: 12px;

    @media (min-width: 769px) {
      gap: 8px;
    }
  }
}

@media (max-width: 1200px) {
  .ui-organisation-data {
    &__layout {
      grid-template-columns: 1fr;
      gap: 24px;
    }
    
    &__left-column {
      width: 100%;
    }
  }
}

@media (max-width: 768px) {
  .ui-organisation-data {
    padding-left: 0;
    /* padding-top: 20px; */
    padding-bottom: 72px;
    background: #ffffff; // Белый фон в мобильной версии
  }
}
</style>

