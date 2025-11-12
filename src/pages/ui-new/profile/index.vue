<template>
  <div class="ui-profile">
    <!-- Sidebar Component - Fixed to left -->
    <Sidebar 
      :icon-button="require('@/assets/icons/profile/sidebar.svg')"
      icon-button-type="outlined"
      icon-button-size="m"
      :fixed="true"
      :menu-items="sidebarMenuItems"
      @icon-click="handleSidebarIconClick"
      @item-click="handleSidebarItemClick"
    />

    <!-- App Header - Fixed to top right of sidebar -->
    <AppHeader 
      :show-notifications="true"
      title="Личный кабинет"
      :show-documents="true"
    />
    
    <div class="ui-profile__main-content">
      <div class="ui-profile__layout">
        <!-- Mobile: ProfileHeader, ProfileMenu, ManagersList (vertical order) -->
        <template v-if="isMobileView">
          <div class="ui-profile__mobile-block">
            <ProfileHeader name="Джон МакКлейн" />
          </div>
          <div class="ui-profile__mobile-block">
            <ProfileMenu 
              :active-item="activeProfileMenuItem"
              @item-click="handleProfileMenuClick"
              @update:active-item="activeProfileMenuItem = $event"
            />
          </div>
          <div class="ui-profile__mobile-block">
            <ManagersList 
              :managers="managers"
            />
          </div>
        </template>

        <!-- Desktop: Left Column: ProfileMenu and ManagerCard -->
        <div v-else class="ui-profile__left-column">
          <ProfileMenu 
            :active-item="activeProfileMenuItem"
            @item-click="handleProfileMenuClick"
            @update:active-item="activeProfileMenuItem = $event"
          />
          
          <ManagersList 
            :managers="managers"
          />
        </div>

        <!-- Desktop: Right Column: Content -->
        <div v-if="!isMobileView" class="ui-profile__right-column">
          <!-- Account Content -->
          <div v-if="activeContent === 'account' || activeContent === null" class="ui-profile__content-block">
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

          <!-- Organization Content -->
          <div v-else-if="activeContent === 'organization'" class="ui-profile__content-block">
            <OrganisationDataContent
              :form-data="organisationFormData"
              @update:form-data="organisationFormData = $event"
              :counterparty-types="counterpartyTypes"
              @data-filled="handleOrganisationDataFilled"
              @save="handleOrganisationSave"
              @cancel="handleOrganisationCancel"
            />
          </div>

          <!-- Platform Documents Content -->
          <div v-else-if="activeContent === 'platform-documents'" class="ui-profile__content-block">
            <div class="ui-profile__documents-content">
              <h2 class="ui-profile__content-title">Документы с платформой</h2>
              
              <div class="ui-profile__documents-list">
                <PlatformDocumentCard
                  v-for="(document, index) in platformDocuments"
                  :key="index"
                  :document="document"
                  @sign="handleSign(document)"
                  @download="handleDownload(document)"
                />
              </div>
            </div>
          </div>

          <!-- Acts Content -->
          <div v-else-if="activeContent === 'acts'" class="ui-profile__content-block">
            <ActsContent
              :acts="acts"
              :total-count="actsTotalCount"
              @sign="handleActSign"
              @download="handleActDownload"
              @page-change="handleActPageChange"
            />
          </div>

          <!-- Contracts with Performers Content -->
          <div v-else-if="activeContent === 'docs-executors'" class="ui-profile__content-block">
            <ContractsWithPerformersContent
              :contracts="contracts"
              :total-count="contractsTotalCount"
              @sign="handleContractSign"
              @download="handleContractDownload"
              @page-change="handleContractPageChange"
            />
          </div>

          <!-- Electronic Signature Content -->
          <div v-else-if="activeContent === 'signature'" class="ui-profile__content-block">
            <ElectronicSignatureContent @archive="handleSignatureArchive" />
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Bottom Navigation -->
    <MobileBottomNav v-if="isMobileView" :menu-items="mobileMenuItems" />

    <!-- Change Password Modal -->
    <Popup :show="showChangePasswordModal" @update:show="showChangePasswordModal = $event">
      <ChangePasswordModal
        @close="showChangePasswordModal = false"
        @select-option="handlePasswordOptionSelect"
      />
    </Popup>

    <!-- Change Password Phone Modal -->
    <Popup :show="showChangePasswordPhoneModal" @update:show="showChangePasswordPhoneModal = $event">
      <ChangePasswordPhoneModal
        @close="showChangePasswordPhoneModal = false"
        @get-code="handleGetCode"
      />
    </Popup>

    <!-- Change Password Code Modal -->
    <Popup :show="showChangePasswordCodeModal" @update:show="showChangePasswordCodeModal = $event">
      <ChangePasswordCodeModal
        :phone="changePasswordPhone"
        @close="showChangePasswordCodeModal = false"
        @back="handleCodeModalBack"
        @continue="handleCodeContinue"
        @resend-code="handleResendCode"
      />
    </Popup>

    <!-- Change Password New Password Modal -->
    <Popup :show="showChangePasswordNewPasswordModal" @update:show="showChangePasswordNewPasswordModal = $event">
      <ChangePasswordNewPasswordModal
        @close="showChangePasswordNewPasswordModal = false"
        @back="handleNewPasswordModalBack"
        @confirm="handlePasswordConfirm"
      />
    </Popup>
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
import PlatformDocumentCard from '@/components/molecules/PlatformDocumentCard.vue'
import OrganisationDataContent from '@/components/organisms/OrganisationDataContent.vue'
import ElectronicSignatureContent from '@/components/organisms/ElectronicSignatureContent.vue'
import ContractsWithPerformersContent from '@/components/organisms/ContractsWithPerformersContent.vue'
import ActsContent from '@/components/organisms/ActsContent.vue'
import Popup from '@/components/atoms/Popup.vue'
import ChangePasswordModal from '@/components/organisms/popups/ChangePasswordModal.vue'
import ChangePasswordPhoneModal from '@/components/organisms/popups/ChangePasswordPhoneModal.vue'
import ChangePasswordCodeModal from '@/components/organisms/popups/ChangePasswordCodeModal.vue'
import ChangePasswordNewPasswordModal from '@/components/organisms/popups/ChangePasswordNewPasswordModal.vue'

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
    PlatformDocumentCard,
    OrganisationDataContent,
    ElectronicSignatureContent,
    ContractsWithPerformersContent,
    ActsContent,
    Popup,
    ChangePasswordModal,
    ChangePasswordPhoneModal,
    ChangePasswordCodeModal,
    ChangePasswordNewPasswordModal,
  },
  data() {
    return {
      isMobile: false,
      // ПК меню (7 пунктов) - для Sidebar
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
      ],
      
      activeProfileMenuItem: null, // В мобильной версии по умолчанию нет активного пункта
      activeContent: null, // null = account, 'platform-documents' = documents
      showChangePasswordModal: false,
      showChangePasswordPhoneModal: false,
      showChangePasswordCodeModal: false,
      showChangePasswordNewPasswordModal: false,
      changePasswordPhone: '',
      
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

      platformDocuments: [
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
      contracts: [
        {
          performerName: 'Иванов И.И.',
          status: {
            type: 'needs-signature',
            text: 'Нужно подписать',
            icon: require('@/assets/icons/profile/document.svg')
          },
          createdDate: '01.10.2021'
        },
        {
          performerName: 'Петров П.П.',
          validityPeriod: '01.10.2022',
          createdDate: '01.10.2021',
          signedDate: '01.10.2021'
        },
        {
          performerName: 'Петров П.П.',
          validityPeriod: '01.10.2022',
          createdDate: '01.10.2021',
          signedDate: '01.10.2021'
        }
      ],
      contractsTotalCount: 100,
      acts: [
        {
          name: 'Смирнова В.К.',
          status: {
            type: 'needs-signature',
            text: 'Нужно подписать'
          },
          createdDate: '01.10.2021',
          requestName: 'Название заявки'
        },
        {
          name: 'ООО «Секвоя»',
          validityPeriod: '01.10.2022',
          createdDate: '01.10.2021',
          requestName: 'Название заявки'
        },
        {
          name: 'ООО «Секвоя»',
          validityPeriod: '01.10.2022',
          createdDate: '01.10.2021',
          requestName: 'Название заявки'
        }
      ],
      actsTotalCount: 100,
      organisationFormData: {
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
        { value: 'physical', label: 'Физическое лицо' },
        { value: 'legal', label: 'Юридическое лицо' },
        { value: 'individual', label: 'Индивидуальный предприниматель' }
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
      // Обработка клика по элементу меню (если нужна дополнительная логика)
      console.log('Sidebar item clicked:', item)
    },
    handleProfileMenuClick(item) {
      if (this.isMobileView) {
        // В мобильной версии при клике на "Учетная запись" переходим на отдельную страницу
        if (item.id === 'account') {
          this.$router.push('/ui-new/profile/account')
        } else if (item.id === 'organization') {
          this.$router.push('/ui-new/organisation-data')
        } else if (item.id === 'doc-platform') {
          this.$router.push('/ui-new/platform-documents')
        } else if (item.id === 'signature') {
          this.$router.push('/ui-new/profile/signature')
        } else if (item.id === 'docs-executors') {
          this.$router.push('/ui-new/profile/contracts')
        } else if (item.id === 'acts') {
          this.$router.push('/ui-new/profile/acts')
        } else {
          console.log('Profile menu item clicked:', item)
        }
      } else {
        // В десктопной версии меняем контент в правой колонке
        if (item.id === 'account') {
          this.activeContent = null
          this.activeProfileMenuItem = 'account'
        } else if (item.id === 'organization') {
          this.activeContent = 'organization'
          this.activeProfileMenuItem = 'organization'
        } else if (item.id === 'doc-platform') {
          this.activeContent = 'platform-documents'
          this.activeProfileMenuItem = 'doc-platform'
        } else if (item.id === 'acts') {
          this.activeContent = 'acts'
          this.activeProfileMenuItem = 'acts'
        } else if (item.id === 'docs-executors') {
          this.activeContent = 'docs-executors'
          this.activeProfileMenuItem = 'docs-executors'
        } else if (item.id === 'signature') {
          this.activeContent = 'signature'
          this.activeProfileMenuItem = 'signature'
        } else {
          console.log('Profile menu item clicked:', item)
        }
      }
    },
    handleOrganisationDataFilled() {
      console.log('Organisation data filled')
    },
    handleOrganisationSave() {
      console.log('Organisation data saved')
    },
    handleOrganisationCancel() {
      this.activeContent = null
      this.activeProfileMenuItem = null
    },
    handleSign(document) {
      console.log('Sign document:', document)
      // TODO: Implement sign document logic
    },
    handleDownload(document) {
      console.log('Download document:', document)
      // TODO: Implement download document logic
    },
    handleContractSign(contract) {
      console.log('Sign contract:', contract)
      // TODO: Implement sign contract logic
    },
    handleContractDownload(contract) {
      console.log('Download contract:', contract)
      // TODO: Implement download contract logic
    },
    handleContractPageChange(page) {
      console.log('Contract page change:', page)
      // TODO: Implement pagination logic
    },
    handleActSign(act) {
      console.log('Sign act:', act)
      // TODO: Implement sign act logic
    },
    handleActDownload(act) {
      console.log('Download act:', act)
      // TODO: Implement download act logic
    },
    handleActPageChange(page) {
      console.log('Act page change:', page)
      // TODO: Implement pagination logic
    },
    handleSignatureArchive(certificate) {
      console.log('Archive signature:', certificate)
      // TODO: Implement archive signature logic
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
      this.showChangePasswordModal = true
    },
    handlePasswordOptionSelect(option) {
      if (option === 'phone') {
        // Закрываем первое модальное окно и открываем модальное окно с телефоном
        this.showChangePasswordModal = false
        this.showChangePasswordPhoneModal = true
      } else {
        // TODO: Implement password change logic for other options
        console.log('Password option selected:', option)
        this.showChangePasswordModal = false
      }
    },
    handleGetCode(phone) {
      console.log('Get code for phone:', phone)
      // Сохраняем номер телефона и открываем модальное окно с кодом
      this.changePasswordPhone = phone
      this.showChangePasswordPhoneModal = false
      this.showChangePasswordCodeModal = true
    },
    handleCodeModalBack() {
      // Возвращаемся к модальному окну с телефоном
      this.showChangePasswordCodeModal = false
      this.showChangePasswordPhoneModal = true
    },
    handleCodeContinue(code) {
      console.log('Continue with code:', code)
      // Закрываем модальное окно с кодом и открываем модальное окно для нового пароля
      this.showChangePasswordCodeModal = false
      this.showChangePasswordNewPasswordModal = true
    },
    handleNewPasswordModalBack() {
      // Возвращаемся к модальному окну с кодом
      this.showChangePasswordNewPasswordModal = false
      this.showChangePasswordCodeModal = true
    },
    handlePasswordConfirm({ password, confirmPassword }) {
      console.log('Password confirmed:', password, confirmPassword)
      // TODO: Implement password change logic
      this.showChangePasswordNewPasswordModal = false
    },
    handleResendCode(phone) {
      console.log('Resend code for phone:', phone)
      // TODO: Implement resend code logic
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

  @media (max-width: 768px) {
    background: #F6F8FB;
  }

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
  }

  &__right-column {
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: transparent;
    overflow-x: hidden;
    min-width: 0;
  }

  &__content-title {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 600;
    font-size: 20px;
    line-height: 28px;
    color: #263043;
    margin: 0;
  }

  &__content-block {
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-x: hidden;
    min-width: 0;
  }

  &__documents-content {
    display: flex;
    flex-direction: column;
    gap: 32px;
    background: #ffffff;
    border-radius: 10px;
    padding: 24px;
  }

  &__documents-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__content-placeholder {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: #666666;
    margin: 0;
  }

  &__mobile-block {
    width: 100%;
    margin: 0 -16px;
    padding: 0 16px;

    @media (min-width: 769px) {
      display: none;
    }
  }
}

@media (max-width: 1200px) {
  .ui-profile {
    &__layout {
      grid-template-columns: 1fr;
      gap: 24px;
      align-items: center;
    }
  }
}

@media (max-width: 768px) {
  .ui-profile {
    padding: 16px;
    padding-top: 24px; /* Отступ сверху для статус-бара */
    padding-bottom: 88px; /* 16px отступ + 72px для мобильного меню */
    margin-top: 64px; /* Отступ сверху для header */
  }

  // Скрываем обычный Sidebar на мобильных
  :deep(.sidebar) {
    display: none;
  }
}
</style>

