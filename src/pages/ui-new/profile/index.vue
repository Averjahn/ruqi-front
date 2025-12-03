<template>
  <div class="ui-profile" :class="{ 'ui-profile--objects': activeContent === 'objects' }">
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
    
    <div class="ui-profile__main-content" :class="{ 'ui-profile__main-content--objects': activeContent === 'objects' }">
      <div class="ui-profile__layout" :class="{ 
        'ui-profile__layout--show-menu': isMobileView && activeContent === null,
        'ui-profile__layout--objects': !isMobileView && activeContent === 'objects'
      }">
        <!-- Mobile: ProfileHeader, ProfileMenu, ManagersList (vertical order) - показываются только когда контент не выбран -->
        <template v-if="isMobileView && activeContent === null">
          <div class="ui-profile__mobile-block">
            <ProfileHeader :name="userName || 'Пользователь'" />
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
        <!-- Скрываем меню профиля и менеджеров когда выбраны Объекты -->
        <div v-if="!isMobileView && activeContent !== 'objects'" class="ui-profile__left-column">
          <ProfileMenu 
            :active-item="activeProfileMenuItem"
            @item-click="handleProfileMenuClick"
            @update:active-item="activeProfileMenuItem = $event"
          />
          
          <ManagersList 
            :managers="managers"
          />
        </div>

        <!-- Mobile: Content with Header - показывается только когда контент выбран -->
        <template v-if="isMobileView && activeContent !== null">
          <!-- Mobile Header -->
          <div class="ui-profile__mobile-header">
            <button 
              class="ui-profile__mobile-back-button"
              @click="handleBack"
            >
              <img 
                :src="require('@/assets/icons/profile/arrow-left.svg')" 
                alt="Back" 
                class="ui-profile__mobile-back-icon"
              />
            </button>
            <h1 class="ui-profile__mobile-title">{{ getMobileTitle() }}</h1>
            <div class="ui-profile__mobile-header-spacer"></div>
          </div>

          <!-- Mobile Content -->
          <div class="ui-profile__mobile-content">
            <!-- Account Content -->
            <!-- PersonalData и ProfileActions показываются только когда меню скрыто (activeContent !== null) -->
            <div v-if="activeContent === 'account'" class="ui-profile__content-block">
              <ProfileAvatar 
                :name="userName"
                :avatar-url="avatarUrl"
                @avatar-upload="handleAvatarUpload"
                @edit-click="handleAvatarEditClick"
              />
              
              <PersonalData 
                :personal-data="personalData"
                :contacts="contacts"
                @edit="handlePersonalDataEdit"
                @save="handlePersonalDataSave"
                @cancel="handlePersonalDataCancel"
                @phone-click="handlePhoneClick"
                @phone-get-code="handlePhoneGetCode"
                @phone-confirm-code="handlePhoneConfirmCode"
                @phone-resend-code="handlePhoneResendCode"
                @email-click="handleEmailClick"
                @telegram-link="handleTelegramLink"
              />
              
              <ProfileActions 
                @change-password="handleChangePassword"
                @logout="handleLogout"
              />
            </div>

            <!-- Objects Content -->
            <div v-else-if="activeContent === 'objects'" class="ui-profile__content-block">
              <ObjectsContent
                :objects="objects"
                :total-count="objectsTotalCount"
                @create-object="handleCreateObject"
                @object-action="handleObjectAction"
                @page-change="handleObjectsPageChange"
                @filter-change="handleObjectsFilterChange"
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
        </template>

        <!-- Desktop: Right Column: Content -->
        <!-- При выборе Объекты контент занимает всю ширину -->
        <div v-if="!isMobileView" class="ui-profile__right-column" :class="{ 'ui-profile__right-column--full-width': activeContent === 'objects' }">
          <!-- Objects Content - занимает всю ширину -->
          <div v-if="activeContent === 'objects'" class="ui-profile__content-block ui-profile__content-block--full-width">
            <ObjectsContent
              :objects="objects"
              :total-count="objectsTotalCount"
              @create-object="handleCreateObject"
              @object-action="handleObjectAction"
              @page-change="handleObjectsPageChange"
              @filter-change="handleObjectsFilterChange"
            />
          </div>

          <!-- Account Content -->
          <div v-else-if="activeContent === 'account' || activeContent === null" class="ui-profile__content-block">
            <ProfileHeader :name="userName || 'Пользователь'" />
            
            <PersonalData 
              :personal-data="personalData"
              :contacts="contacts"
              @edit="handlePersonalDataEdit"
              @save="handlePersonalDataSave"
              @cancel="handlePersonalDataCancel"
              @phone-click="handlePhoneClick"
              @phone-get-code="handlePhoneGetCode"
              @phone-confirm-code="handlePhoneConfirmCode"
              @phone-resend-code="handlePhoneResendCode"
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
        :method="passwordChangeMethod"
        @close="showChangePasswordNewPasswordModal = false"
        @back="handleNewPasswordModalBack"
        @confirm="handlePasswordConfirm"
      />
    </Popup>

    <!-- Change Password Email Input Modal -->
    <Popup :show="showChangePasswordEmailInputModal" @update:show="showChangePasswordEmailInputModal = $event">
      <ChangePasswordEmailInputModal
        @close="handleEmailPasswordClose"
        @get-code="handleGetEmailCode"
      />
    </Popup>

    <!-- Change Password Email Code Modal -->
    <Popup :show="showChangePasswordEmailCodeModal" @update:show="showChangePasswordEmailCodeModal = $event">
      <ChangePasswordEmailCodeModal
        :email="changePasswordEmail"
        @close="handleEmailPasswordClose"
        @back="handleEmailCodeModalBack"
        @continue="handleEmailCodeContinue"
        @resend-code="handleResendEmailCode"
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
import ProfileAvatar from '@/components/organisms/ProfileAvatar.vue'
import ManagersList from '@/components/organisms/ManagersList.vue'
import PersonalData from '@/components/organisms/PersonalData.vue'
import ProfileActions from '@/components/organisms/ProfileActions.vue'
import MobileBottomNav from '@/components/organisms/MobileBottomNav.vue'
import PlatformDocumentCard from '@/components/molecules/PlatformDocumentCard.vue'
import OrganisationDataContent from '@/components/organisms/OrganisationDataContent.vue'
import ElectronicSignatureContent from '@/components/organisms/ElectronicSignatureContent.vue'
import ContractsWithPerformersContent from '@/components/organisms/ContractsWithPerformersContent.vue'
import ActsContent from '@/components/organisms/ActsContent.vue'
import ObjectsContent from '@/components/organisms/ObjectsContent.vue'
import Popup from '@/components/atoms/Popup.vue'
import ChangePasswordModal from '@/components/organisms/popups/ChangePasswordModal.vue'
import ChangePasswordPhoneModal from '@/components/organisms/popups/ChangePasswordPhoneModal.vue'
import ChangePasswordCodeModal from '@/components/organisms/popups/ChangePasswordCodeModal.vue'
import ChangePasswordNewPasswordModal from '@/components/organisms/popups/ChangePasswordNewPasswordModal.vue'
import ChangePasswordEmailModal from '@/components/organisms/popups/ChangePasswordEmailModal.vue'
import ChangePasswordEmailInputModal from '@/components/organisms/popups/ChangePasswordEmailInputModal.vue'
import ChangePasswordEmailCodeModal from '@/components/organisms/popups/ChangePasswordEmailCodeModal.vue'
import { mapState } from 'vuex'
import authApiService from '@/services/authApi'

export default {
  name: 'UIProfile',
  components: {
    Sidebar,
    AppHeader,
    ProfileMenu,
    ProfileHeader,
    ProfileAvatar,
    ManagersList,
    PersonalData,
    ProfileActions,
    MobileBottomNav,
    PlatformDocumentCard,
    OrganisationDataContent,
    ElectronicSignatureContent,
    ContractsWithPerformersContent,
    ActsContent,
    ObjectsContent,
    Popup,
    ChangePasswordModal,
    ChangePasswordPhoneModal,
    ChangePasswordCodeModal,
    ChangePasswordNewPasswordModal,
    ChangePasswordEmailModal,
    ChangePasswordEmailInputModal,
    ChangePasswordEmailCodeModal,
  },
  data() {
    return {
      isMobile: false,
      mobileMediaQuery: null,
      avatarUrl: null,
      userName: 'Неизвестный',
      // ПК меню (7 пунктов) - для Sidebar
      desktopMenuItems: [
        { id: 1, title: 'Заявки', iconPath: require('@/assets/icons/profile/note.svg'), active: false, route: '/ui-new/applications' },
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
        { id: 1, title: 'Заявки', iconPath: require('@/assets/icons/profile/note.svg'), route: null },
        { id: 2, title: 'Объекты', iconPath: require('@/assets/icons/profile/objects-icon.svg'), route: '/ui-new/objects' },
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
      showChangePasswordEmailModal: false,
      showChangePasswordEmailInputModal: false,
      showChangePasswordEmailCodeModal: false,
      changePasswordPhone: '',
      changePasswordCode: '',
      changePasswordEmail: '',
      changePasswordEmailCode: '',
      
      personalData: {
        lastName: '',
        firstName: '',
        middleName: ''
      },
      contacts: {
        phone: '',
        email: '',
        telegram: null,
        phoneStatus: {
          type: 'success',
          icon: require('@/assets/icons/profile/input-status-red.svg'),
          text: 'Телефон не подтверждён'
        },
        emailStatus: {
          type: 'success',
          icon: require('@/assets/icons/profile/input-status-red.svg'),
          text: 'Подтвердите email'
        }
      },
      profileLoading: false,
      
      managers: [
        {
          name: 'Иванов Иван Иванович',
          role: 'Объект 1',
          phone: '+7 (999) 999-99-99',
          email: 'anna.smirnova@ruqi.ru',
          avatarUrl: null
        },
        {
          name: 'Петров Петр Петрович',
          role: 'Объект 2',
          phone: '+7 (999) 888-88-88',
          email: 'petrov@ruqi.ru',
          avatarUrl: null
        },
        {
          name: 'Сидоров Сидор Сидорович',
          role: 'Объект 3',
          phone: '+7 (999) 777-77-77',
          email: 'sidorov@ruqi.ru',
          avatarUrl: null
        },
        {
          name: 'Кузнецова Мария Сергеевна',
          role: 'Объект 4',
          phone: '+7 (999) 666-66-66',
          email: 'kuznetsova@ruqi.ru',
          avatarUrl: null
        },
        {
          name: 'Смирнов Алексей Владимирович',
          role: 'Объект 5',
          phone: '+7 (999) 555-55-55',
          email: 'smirnov@ruqi.ru',
          avatarUrl: null
        },
        {
          name: 'Волкова Елена Дмитриевна',
          role: 'Объект 6',
          phone: '+7 (999) 444-44-44',
          email: 'volkova@ruqi.ru',
          avatarUrl: null
        },
        {
          name: 'Новиков Дмитрий Александрович',
          role: 'Объект 7',
          phone: '+7 (999) 333-33-33',
          email: 'novikov@ruqi.ru',
          avatarUrl: null
        },
        {
          name: 'Морозова Анна Игоревна',
          role: 'Объект 8',
          phone: '+7 (999) 222-22-22',
          email: 'morozova@ruqi.ru',
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
      objects: [],
      objectsTotalCount: 0,
      objectsLoading: false,
      // Текущий способ смены пароля: 'phone' | 'current-password' | 'email' | null
      passwordChangeMethod: null,
    }
  },
  computed: {
    ...mapState('profileDocuments', {
      acts: (state) => state.acts,
      actsTotalCount: (state) => state.actsTotalCount,
      contracts: (state) => state.contracts,
      contractsTotalCount: (state) => state.contractsTotalCount,
    }),
    isMobileView() {
      return this.isMobile
    },

    sidebarMenuItems() {
      return this.desktopMenuItems
    },
    
    // Отслеживаем изменения статуса клиента в store
    clientStatus() {
      return this.$store.getters['auth/clientStatus']
    }
  },
  watch: {
    // Автоматически обновляем контакты при изменении статуса в store
    clientStatus: {
      handler(newStatus) {
        if (newStatus) {
          this.initContactsFromStatus()
        }
      },
      immediate: true
    }
  },
  async mounted() {
    this.initMobileTracking()

    if (typeof window !== 'undefined') {
      window.RqloggerError = window.RqloggerError || function() {
        console.warn('RqloggerError called:', arguments)
      }
    }

    // Всегда загружаем статус клиента при заходе на страницу профиля
    await this.$store.dispatch('auth/checkClientStatus')
    
    // Инициализируем контакты из статуса (приоритетный источник для телефона и email)
    this.initContactsFromStatus()

    // Загружаем профиль для дополнительных данных (имя, фамилия и т.д.)
    await this.loadClientProfile()
  },

  beforeUnmount() {
    this.cleanupMobileTracking()
  },
  methods: {
initContactsFromStatus() {
  const status = this.$store.getters['auth/clientStatus']

  if (!status) {
    return
  }

  // Проверяем оба варианта: login_phone и phone (API может возвращать любой из них)
  const phoneNumber = status.login_phone || status.phone
  
  if (phoneNumber) {
    const raw = String(phoneNumber)
    const digits = raw.replace(/\D/g, '')

    let formatted = raw

    if (digits.length === 11 && digits.charAt(0) === '7') {
      formatted =
        '+7 (' +
        digits.slice(1, 4) + ') ' +
        digits.slice(4, 7) + '-' +
        digits.slice(7, 9) + '-' +
        digits.slice(9, 11)
    } else if (raw.charAt(0) !== '+') {
      formatted = '+' + raw
    }

    this.contacts.phone = formatted

    // 👉 Как в почте: если телефон есть в статусе — считаем его подтверждённым
    const isConfirmed =
      true // или, если хочешь подстраховаться: !!phoneNumber || status.phone_verified === true

    this.contacts.phoneStatus = {
      type: isConfirmed ? 'success' : 'error',
      icon: isConfirmed
        ? require('@/assets/icons/checkmark_circle.svg')
        : require('@/assets/icons/profile/input-status-red.svg'),
      text: isConfirmed ? 'Телефон подтверждён' : 'Телефон не подтверждён'
    }
  }

  // email часть можно оставить как есть
  const email = status.login_email || status.email
  
  if (email) {
    this.contacts.email = email

    const isEmailConfirmed = status.email_verified === true

    this.contacts.emailStatus = {
      type: isEmailConfirmed ? 'success' : 'error',
      icon: isEmailConfirmed
        ? require('@/assets/icons/checkmark_circle.svg')
        : require('@/assets/icons/profile/input-status-red.svg'),
      text: isEmailConfirmed ? 'Email подтверждён' : 'Email не подтверждён'
    }
  }
},

    initMobileTracking() {
      if (typeof window !== 'undefined' && window.matchMedia) {
        this.mobileMediaQuery = window.matchMedia('(max-width: 768px)')
        this.isMobile = this.mobileMediaQuery.matches
        
        if (this.mobileMediaQuery.addEventListener) {
          this.mobileMediaQuery.addEventListener('change', this.handleMediaChange)
        } else if (this.mobileMediaQuery.addListener) {
          this.mobileMediaQuery.addListener(this.handleMediaChange)
        }
      } else {
        this.checkMobile()
        window.addEventListener('resize', this.checkMobile)
      }
    },
    cleanupMobileTracking() {
      if (this.mobileMediaQuery) {
        if (this.mobileMediaQuery.removeEventListener) {
          this.mobileMediaQuery.removeEventListener('change', this.handleMediaChange)
        } else if (this.mobileMediaQuery.removeListener) {
          this.mobileMediaQuery.removeListener(this.handleMediaChange)
        }
      } else {
        window.removeEventListener('resize', this.checkMobile)
      }
    },
    handleMediaChange(e) {
      this.isMobile = e.matches
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768
    },
    getMobileTitle() {
      const titles = {
        'account': 'Учётная запись',
        'objects': 'Объекты',
        'organization': 'Данные организации',
        'platform-documents': 'Документы с платформой',
        'acts': 'Акты',
        'docs-executors': 'Договора с исполнителями',
        'signature': 'Электронная подпись'
      }
      return titles[this.activeContent] || 'Личный кабинет'
    },
    handleBack() {
      this.activeContent = null
      this.activeProfileMenuItem = null
    },
    handleSidebarIconClick() {
      console.log('Sidebar icon clicked')
    },
    handleSidebarItemClick(item) {
      console.log('Sidebar item clicked:', item)
    },
    handleProfileMenuClick(item) {
      if (item.id === 'account') {
        this.activeContent = 'account'
        this.activeProfileMenuItem = 'account'
      } else if (item.id === 'objects') {
        this.activeContent = 'objects'
        this.activeProfileMenuItem = 'objects'
        // Загружаем объекты при открытии вкладки
        this.loadObjects()
      } else if (item.id === 'organization') {
        this.activeContent = 'organization'
        this.activeProfileMenuItem = 'organization'
        // Загружаем данные организации при открытии вкладки
        this.loadClientOrganization()
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
    },
    /**
     * Загрузить данные организации клиента
     */
    async loadClientOrganization() {
      try {
        const result = await authApiService.getClientOrganization()
        
        if (result.success && result.data) {
          const org = result.data
          
          // Маппим данные из API в формат формы
          this.organisationFormData = {
            logo: null, // Логотип не приходит из API
            counterpartyType: 'legal', // По умолчанию, можно определить по ИНН
            inn: org.inn || '',
            fullName: org.company_name || org.name || '',
            kpp: org.kpp || '',
            ogrn: org.ogrn || '',
            okato: '', // Не приходит из API
            fullNamePerson: '', // Не приходит из API
            position: '', // Не приходит из API
            basis: '', // Не приходит из API
            mailingAddress: org.address || '',
            legalAddress: org.legal_address || org.address || '',
            settlementAccount: '', // Не приходит из API
            correspondentAccount: '', // Не приходит из API
            bic: '', // Не приходит из API
            bank: '', // Не приходит из API
            vatRate: org.vat || null
          }
        } else if (result.error?.code === 980081) {
          // У клиента нет привязанной организации (404)
          // Оставляем форму пустой для создания новой организации
          console.log('У клиента нет привязанной организации')
        } else {
          // Другая ошибка
          const errorMsg = result.error?.msg || 'Ошибка при загрузке данных организации'
          this.$store.dispatch('notifications/showNotification', {
            text: errorMsg
          })
        }
      } catch (error) {
        console.error('Ошибка при загрузке организации:', error)
        // Не показываем ошибку, если это 404 (организации нет)
        if (error?.response?.status !== 404) {
          this.$store.dispatch('notifications/showNotification', {
            text: 'Ошибка при загрузке данных организации'
          })
        }
      }
    },
    
    handleOrganisationDataFilled() {
      console.log('Organisation data filled')
    },
    
    /**
     * Сохранить данные организации
     */
    async handleOrganisationSave() {
      try {
        // Проверяем, есть ли уже организация (по UUID или другим признакам)
        // Если есть - обновляем, если нет - создаем
        const orgData = {
          name: this.organisationFormData.fullName,
          company_name: this.organisationFormData.fullName,
          inn: this.organisationFormData.inn,
          kpp: this.organisationFormData.kpp || null,
          ogrn: this.organisationFormData.ogrn || null,
          legal_address: this.organisationFormData.legalAddress,
          address: this.organisationFormData.mailingAddress || this.organisationFormData.legalAddress,
          vat: this.organisationFormData.vatRate || null
        }
        
        // Удаляем пустые поля
        Object.keys(orgData).forEach(key => {
          if (orgData[key] === '' || orgData[key] === null) {
            delete orgData[key]
          }
        })
        
        // Пытаемся сначала получить организацию, чтобы понять - создавать или обновлять
        const getResult = await authApiService.getClientOrganization()
        
        let result
        if (getResult.success && getResult.data) {
          // Организация существует - обновляем (нужен PUT или PATCH эндпоинт)
          // Пока используем createClientOrganization, так как обновления может не быть
          result = await authApiService.createClientOrganization(orgData)
        } else {
          // Организации нет - создаем
          result = await authApiService.createClientOrganization(orgData)
        }
        
        if (result.success) {
          this.$store.dispatch('notifications/showNotification', {
            text: 'Данные организации успешно сохранены'
          })
          
          // Перезагружаем данные организации
          await this.loadClientOrganization()
        } else {
          const errorMsg = result.error?.[0]?.msg || result.error?.msg || 'Ошибка при сохранении данных организации'
          this.$store.dispatch('notifications/showNotification', {
            text: errorMsg
          })
        }
      } catch (error) {
        console.error('Ошибка при сохранении организации:', error)
        this.$store.dispatch('notifications/showNotification', {
          text: 'Ошибка при сохранении данных организации'
        })
      }
    },
    
    handleOrganisationCancel() {
      this.activeContent = null
      this.activeProfileMenuItem = null
      // Перезагружаем данные организации, чтобы отменить изменения
      this.loadClientOrganization()
    },
    
    /**
     * Загрузить объекты клиента
     */
    async loadObjects() {
      try {
        this.objectsLoading = true
        // TODO: Заменить на реальный API эндпоинт
        // const result = await objectsApiService.getClientObjects()
        
        // Временные моковые данные для демонстрации
        this.objects = [
          {
            id: 1,
            name: 'Магнит косметик',
            applications: 5,
            location: 'Россия, Санкт-Петербург пр. Невский, 85',
            avgExit: 3,
            exit: 2,
            exitPercent: 70,
            archived: false
          },
          {
            id: 2,
            name: 'Пятёрочка',
            applications: 11,
            location: 'Россия, Екатеринбург ул. Ленина, 12',
            avgExit: 5,
            exit: 3,
            exitPercent: 100,
            archived: false
          },
          {
            id: 3,
            name: 'Озон фреш',
            applications: 0,
            location: 'Россия, Москва ул. Генерала Горбатого 34',
            avgExit: 0,
            exit: 0,
            exitPercent: 0,
            archived: false
          },
          {
            id: 4,
            name: 'Карусель',
            applications: 3,
            location: 'Россия, Москва ул. Примерная, 1',
            avgExit: 2,
            exit: 1,
            exitPercent: 50,
            archived: false
          },
          {
            id: 5,
            name: 'Билла',
            applications: 7,
            location: 'Россия, Санкт-Петербург ул. Примерная, 2',
            avgExit: 4,
            exit: 2,
            exitPercent: 40,
            archived: false
          },
          {
            id: 6,
            name: 'Твой дом',
            applications: 2,
            location: 'Россия, Москва ул. Примерная, 3',
            avgExit: 1,
            exit: 1,
            exitPercent: 1,
            archived: false
          },
          {
            id: 7,
            name: 'Дикси',
            applications: 4,
            location: 'Россия, Екатеринбург ул. Примерная, 4',
            avgExit: 2,
            exit: 1,
            exitPercent: 2,
            archived: false
          },
          {
            id: 8,
            name: 'Лента',
            applications: 8,
            location: 'Россия, Москва ул. Примерная, 5',
            avgExit: 6,
            exit: 2,
            exitPercent: 100,
            archived: false
          },
          {
            id: 9,
            name: 'Светофор',
            applications: 1,
            location: 'Россия, Санкт-Петербург ул. Примерная, 6',
            avgExit: 0,
            exit: 0,
            exitPercent: 0,
            archived: false
          },
          {
            id: 10,
            name: 'Ашан',
            applications: 9,
            location: 'Россия, Москва ул. Примерная, 7',
            avgExit: 7,
            exit: 3,
            exitPercent: 100,
            archived: false
          },
          {
            id: 11,
            name: 'Окей',
            applications: 6,
            location: 'Россия, Екатеринбург ул. Примерная, 8',
            avgExit: 3,
            exit: 2,
            exitPercent: 70,
            archived: false
          },
          {
            id: 12,
            name: 'Перекрёсток',
            applications: 10,
            location: 'Россия, Москва ул. Примерная, 9',
            avgExit: 4,
            exit: 2,
            exitPercent: 50,
            archived: false
          }
        ]
        this.objectsTotalCount = this.objects.length
      } catch (error) {
        console.error('Ошибка при загрузке объектов:', error)
        this.$store.dispatch('notifications/showNotification', {
          text: 'Ошибка при загрузке объектов'
        })
      } finally {
        this.objectsLoading = false
      }
    },
    
    /**
     * Обработка создания объекта
     */
    handleCreateObject() {
      console.log('Создать объект')
      // TODO: Открыть модальное окно или перейти на страницу создания объекта
      this.$store.dispatch('notifications/showNotification', {
        text: 'Функция создания объекта будет реализована'
      })
    },
    
    /**
     * Обработка действий с объектом
     */
    handleObjectAction(object) {
      console.log('Действие с объектом:', object)
      // TODO: Открыть меню действий (редактировать, удалить, архивировать и т.д.)
      this.$store.dispatch('notifications/showNotification', {
        text: `Действие с объектом "${object.name}"`
      })
    },
    
    /**
     * Обработка изменения страницы объектов
     */
    handleObjectsPageChange(page) {
      console.log('Смена страницы объектов:', page)
      // TODO: Загрузить объекты для указанной страницы
    },
    
    /**
     * Обработка изменения фильтров объектов
     */
    handleObjectsFilterChange(filters) {
      console.log('Изменение фильтров объектов:', filters)
      // TODO: Применить фильтры и перезагрузить объекты
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
    /**
     * Загрузить профиль клиента
     */
    async loadClientProfile() {
      try {
        this.profileLoading = true
        const result = await authApiService.getClientProfile()
        
        if (result.success && result.data) {
          const profile = result.data
          
          // Обновляем персональные данные
          if (profile.first_name || profile.last_name || profile.middle_name) {
            this.personalData = {
              firstName: profile.first_name || '',
              lastName: profile.last_name || '',
              middleName: profile.middle_name || ''
            }
          }

          // Обновляем телефон из профиля только если его нет в статусе
          // (данные из статуса имеют приоритет, так как они более актуальные)
          if (profile.phone && !this.contacts.phone) {
            this.contacts.phone = profile.phone
            this.contacts.phoneStatus = {
              type: profile.phone_verified ? 'success' : 'unconfirmed',
              icon: profile.phone_verified
                ? require('@/assets/icons/checkmark_circle.svg')
                : require('@/assets/icons/profile/input-status-red.svg'),
              text: profile.phone_verified ? 'Телефон подтверждён' : 'Телефон не подтверждён'
            }
          }


          // Обновляем email из профиля только если его нет в статусе
          // (данные из статуса имеют приоритет, так как они более актуальные)
          if (profile.email && !this.contacts.email) {
            this.contacts.email = profile.email

            const emailConfirmed = true // считаем привязанный email подтверждённым

            this.contacts.emailStatus = {
              type: emailConfirmed ? 'success' : 'unconfirmed',
              icon: emailConfirmed
                ? require('@/assets/icons/checkmark_circle.svg')
                : require('@/assets/icons/profile/input-status-red.svg'),
              text: emailConfirmed ? 'Email подтверждён' : 'Email не подтверждён'
            }
          }

          
          if (profile.telegram) {
            this.contacts.telegram = profile.telegram
          }
          
          // Обновляем имя пользователя для заголовка
          if (profile.first_name || profile.last_name) {
            this.userName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке профиля:', error)
      } finally {
        this.profileLoading = false
      }
    },
    
    handlePersonalDataEdit() {
      console.log('Edit personal data clicked')
    },
    
    /**
     * Сохранить персональные данные профиля
     */
    async handlePersonalDataSave(data) {
      try {
        // Используем PATCH для частичного обновления
        const profileData = {
          first_name: data.firstName,
          last_name: data.lastName,
          middle_name: data.middleName
        }
        
        const result = await authApiService.patchClientProfile(profileData)
        
        if (result.success) {
          // Обновляем локальные данные
      this.personalData = {
        ...this.personalData,
        ...data
      }
          
          // Обновляем имя пользователя
          if (data.firstName || data.lastName) {
            this.userName = `${data.firstName || ''} ${data.lastName || ''}`.trim()
          }
          
          // Показываем уведомление об успехе
          this.$store.dispatch('notifications/showNotification', {
            type: 'success',
            text: 'Профиль успешно обновлён'
          })
        } else {
          // Показываем ошибку
          const errorMsg = result.error?.[0]?.msg || 'Ошибка при сохранении профиля'
          this.$store.dispatch('notifications/showNotification', {
            text: errorMsg
          })
        }
      } catch (error) {
        console.error('Ошибка при сохранении профиля:', error)
        this.$store.dispatch('notifications/showNotification', {
          text: 'Ошибка при сохранении профиля'
        })
      }
    },
    
    handlePersonalDataCancel() {
      console.log('Personal data edit cancelled')
    },
    
    /**
     * Обработка клика по телефону (открытие модального окна)
     */
    handlePhoneClick() {
      console.log('Phone click')
    },
    
    /**
     * Запросить код для смены телефона
     */
    async handlePhoneGetCode(phone) {
      try {
        const result = await authApiService.requestPhoneChange(phone)
        
        if (result.success) {
          // Код успешно отправлен, модальное окно подтверждения уже открыто в PersonalData
          // Уведомление снизу не показываем (по запросу дизайна)
        } else {
          const errorMsg = result.error?.[0]?.msg || 'Ошибка при запросе кода'
          this.$store.dispatch('notifications/showNotification', {
            text: errorMsg
          })
        }
      } catch (error) {
        console.error('Ошибка при запросе кода смены телефона:', error)
        this.$store.dispatch('notifications/showNotification', {
          text: 'Ошибка при запросе кода'
        })
      }
    },
    
    /**
     * Подтвердить смену телефона
     */
    async handlePhoneConfirmCode({ phone, code }) {
      try {
        const result = await authApiService.confirmPhoneChange(code, phone)
        
        if (result.success) {
          // Обновляем телефон в контактах
          this.contacts.phone = phone
          this.contacts.phoneStatus = {
            type: 'confirmed',
            icon: require('@/assets/icons/checkmark_circle.svg'),
            text: 'Телефон подтверждён'
          }
          
          // Телефон успешно изменён — нижнее уведомление не показываем
        } else {
          const errorMsg = result.error?.[0]?.msg || 'Ошибка при подтверждении кода'
          this.$store.dispatch('notifications/showNotification', {
            text: errorMsg
          })
        }
      } catch (error) {
        console.error('Ошибка при подтверждении смены телефона:', error)
        this.$store.dispatch('notifications/showNotification', {
          text: 'Ошибка при подтверждении кода'
        })
      }
    },
    
    /**
     * Повторно отправить код для смены телефона
     */
    async handlePhoneResendCode(phone) {
      try {
        const result = await authApiService.requestPhoneChange(phone)
        
        if (result.success) {
          // Код успешно отправлен повторно — уведомление снизу не показываем
        } else {
          const errorMsg = result.error?.[0]?.msg || 'Ошибка при повторной отправке кода'
          this.$store.dispatch('notifications/showNotification', {
            text: errorMsg
          })
        }
      } catch (error) {
        console.error('Ошибка при повторной отправке кода:', error)
        this.$store.dispatch('notifications/showNotification', {
          text: 'Ошибка при повторной отправке кода'
        })
      }
    },
    
    /**
     * Обработка клика по email
     */
    async handleEmailClick() {
      try {
        // Здесь можно открыть модальное окно для ввода email
        // Пока просто запрашиваем привязку email (нужно будет добавить модальное окно)
        console.log('Email click - нужно добавить модальное окно для ввода email')
        // TODO: Добавить модальное окно для ввода email и вызова requestEmailBind
      } catch (error) {
        console.error('Ошибка при обработке клика по email:', error)
      }
    },
    
    /**
     * Получить ссылку для привязки Telegram
     */
    async handleTelegramLink() {
      try {
        const response = await authApiService.getTelegramLink()

        if (response.success && response.data && response.data.telegramLink) {
          const link = response.data.telegramLink

          // на всякий случай заменим экранированные слэши
          const normalizedLink = link.replace(/\\\//g, '/')

          window.open(normalizedLink, '_blank')
        } else {
          console.error('Не удалось получить ссылку для Telegram', response)
          // тут можешь показать тост/уведомление
        }
      } catch (e) {
        console.error('Ошибка при получении Telegram ссылки', e)
        // тоже можно тост
      }
    },

    handleChangePassword() {
      // Сбрасываем предыдущий выбранный способ и открываем стартовое модальное окно
      this.passwordChangeMethod = null
      this.changePasswordPhone = ''
      this.changePasswordCode = ''
      this.showChangePasswordModal = true
    },
    handlePasswordOptionSelect(option) {
      this.passwordChangeMethod = option

      if (option === 'phone') {
        // Закрываем первое модальное окно и открываем модальное окно с телефоном
        this.showChangePasswordModal = false
        this.showChangePasswordPhoneModal = true
      } else if (option === 'current-password') {
        // Для варианта "через текущий пароль" сразу открываем модальное окно ввода нового пароля
        this.showChangePasswordModal = false
        this.showChangePasswordNewPasswordModal = true
      } else if (option === 'email') {
        // Для варианта "через email" открываем модалку ввода email
        this.showChangePasswordModal = false
        this.showChangePasswordEmailInputModal = true
      } else {
        // На всякий случай закрываем модалку и логируем неизвестный опшен
        console.log('Unknown password option selected:', option)
        this.showChangePasswordModal = false
      }
    },
    async handleGetCode(phone) {
      try {
        // Очищаем телефон от + и пробелов, оставляем только цифры
        const cleanPhone = phone.replace(/\D/g, '')
        
        const result = await authApiService.sendPasswordRecoveryCode('phone', {
          phone: cleanPhone,
          verificationBy: 'telegram'
        })
        
        if (result.success) {
          // Сохраняем номер телефона и открываем модальное окно с кодом
          this.changePasswordPhone = phone
          this.showChangePasswordPhoneModal = false
          this.showChangePasswordCodeModal = true
          
          this.$store.dispatch('notifications/showNotification', {
            text: 'Код восстановления отправлен'
          })
        } else {
          const errorMsg = result.error?.[0]?.msg || result.error?.msg || 'Ошибка при отправке кода'
          this.$store.dispatch('notifications/showNotification', {
            text: errorMsg
          })
        }
      } catch (error) {
        console.error('Ошибка при запросе кода восстановления:', error)
        this.$store.dispatch('notifications/showNotification', {
          text: 'Ошибка при отправке кода'
        })
      }
    },
    handleCodeModalBack() {
      // Возвращаемся к модальному окну с телефоном
      this.showChangePasswordCodeModal = false
      this.showChangePasswordPhoneModal = true
    },
    handleCodeContinue(code) {
      // Сохраняем код и открываем модальное окно для нового пароля
      this.changePasswordCode = code
      this.showChangePasswordCodeModal = false
      this.showChangePasswordNewPasswordModal = true
    },
    handleNewPasswordModalBack() {
      // Возврат зависит от выбранного способа смены пароля
      this.showChangePasswordNewPasswordModal = false

      if (this.passwordChangeMethod === 'phone') {
        // Возвращаемся к модальному окну с кодом для сценария по телефону
        this.showChangePasswordCodeModal = true
      } else if (this.passwordChangeMethod === 'email') {
        // Возвращаемся к модальному окну с кодом для сценария по email
        this.showChangePasswordEmailCodeModal = true
      } else {
        // Для сценария "через текущий пароль"
        // возвращаемся к первому модальному окну выбора способа
        this.showChangePasswordModal = true
      }
    },
    async handlePasswordConfirm({ oldPassword, password, confirmPassword }) {
      try {
        if (this.passwordChangeMethod === 'current-password') {
          // Смена пароля через старый пароль
          if (!oldPassword) {
            this.$store.dispatch('notifications/showNotification', {
              text: 'Введите старый пароль'
            })
            return
          }
          
          const result = await authApiService.changePasswordByOldPassword(oldPassword, password)
          
          if (result.success) {
            this.$store.dispatch('notifications/showNotification', {
              text: 'Пароль успешно изменён'
            })
            this.showChangePasswordNewPasswordModal = false
            this.passwordChangeMethod = null
          } else {
            const errorMsg = result.error?.[0]?.msg || result.error?.msg || 'Ошибка при смене пароля'
            this.$store.dispatch('notifications/showNotification', {
              text: errorMsg
            })
          }
        } else if (this.passwordChangeMethod === 'phone') {
          // Смена пароля через телефон
          if (!this.changePasswordCode) {
            this.$store.dispatch('notifications/showNotification', {
              text: 'Код восстановления не найден'
            })
            return
          }
          
          const result = await authApiService.setNewPasswordByCode('phone', this.changePasswordCode, password)
          
          if (result.success) {
            this.$store.dispatch('notifications/showNotification', {
              text: 'Пароль успешно изменён'
            })
            this.showChangePasswordNewPasswordModal = false
            this.passwordChangeMethod = null
            this.changePasswordCode = ''
            this.changePasswordPhone = ''
          } else {
            const errorMsg = result.error?.[0]?.msg || result.error?.msg || 'Ошибка при смене пароля'
            this.$store.dispatch('notifications/showNotification', {
              text: errorMsg
            })
          }
        } else if (this.passwordChangeMethod === 'email') {
          // Смена пароля через email
          if (!this.changePasswordEmailCode) {
            this.$store.dispatch('notifications/showNotification', {
              text: 'Код восстановления не найден'
            })
            return
          }
          
          const result = await authApiService.setNewPasswordByCode('email', this.changePasswordEmailCode, password)
          
          if (result.success) {
            this.$store.dispatch('notifications/showNotification', {
              text: 'Пароль успешно изменён'
            })
            this.showChangePasswordNewPasswordModal = false
            this.passwordChangeMethod = null
            this.changePasswordEmailCode = ''
            this.changePasswordEmail = ''
          } else {
            const errorMsg = result.error?.[0]?.msg || result.error?.msg || 'Ошибка при смене пароля'
            this.$store.dispatch('notifications/showNotification', {
              text: errorMsg
            })
          }
        } else {
          // Для других методов (email) логика будет реализована позже
          console.log(
            'Password confirmed with method:',
            this.passwordChangeMethod,
            password,
            confirmPassword
          )
          // TODO: Implement password change logic для других методов
          this.showChangePasswordNewPasswordModal = false
          this.passwordChangeMethod = null
        }
      } catch (error) {
        console.error('Ошибка при смене пароля:', error)
        this.$store.dispatch('notifications/showNotification', {
          text: 'Ошибка при смене пароля'
        })
      }
    },
    async handleGetEmailCode(email) {
      try {
        const result = await authApiService.sendPasswordRecoveryCode('email', {
          email: email
        })
        
        if (result.success) {
          // Сохраняем email и открываем модальное окно с кодом
          this.changePasswordEmail = email
          this.showChangePasswordEmailInputModal = false
          this.showChangePasswordEmailCodeModal = true
          
          this.$store.dispatch('notifications/showNotification', {
            text: 'Код восстановления отправлен'
          })
        } else {
          const errorMsg = result.error?.[0]?.msg || result.error?.msg || 'Ошибка при отправке кода'
          this.$store.dispatch('notifications/showNotification', {
            text: errorMsg
          })
        }
      } catch (error) {
        console.error('Ошибка при запросе кода восстановления:', error)
        this.$store.dispatch('notifications/showNotification', {
          text: 'Ошибка при отправке кода'
        })
      }
    },
    handleEmailCodeModalBack() {
      // Возвращаемся к модальному окну с email
      this.showChangePasswordEmailCodeModal = false
      this.showChangePasswordEmailInputModal = true
    },
    handleEmailCodeContinue(code) {
      // Сохраняем код и открываем модальное окно для нового пароля
      this.changePasswordEmailCode = code
      this.showChangePasswordEmailCodeModal = false
      this.showChangePasswordNewPasswordModal = true
    },
    async handleResendEmailCode(email) {
      try {
        const result = await authApiService.sendPasswordRecoveryCode('email', {
          email: email
        })
        
        if (result.success) {
          this.$store.dispatch('notifications/showNotification', {
            text: 'Код восстановления отправлен повторно'
          })
        } else {
          const errorMsg = result.error?.[0]?.msg || result.error?.msg || 'Ошибка при повторной отправке кода'
          this.$store.dispatch('notifications/showNotification', {
            text: errorMsg
          })
        }
      } catch (error) {
        console.error('Ошибка при повторной отправке кода:', error)
        this.$store.dispatch('notifications/showNotification', {
          text: 'Ошибка при повторной отправке кода'
        })
      }
    },
    handleEmailPasswordBack() {
      // Закрываем модалку email-сценария и возвращаемся к окну выбора способа
      this.showChangePasswordEmailInputModal = false
      this.showChangePasswordModal = true
      this.passwordChangeMethod = null
    },
    handleEmailPasswordClose() {
      // Полное закрытие сценария смены пароля по email
      this.showChangePasswordEmailInputModal = false
      this.showChangePasswordEmailCodeModal = false
      this.passwordChangeMethod = null
    },
    async handleResendCode(phone) {
      try {
        // Очищаем телефон от + и пробелов, оставляем только цифры
        const cleanPhone = phone.replace(/\D/g, '')
        
        const result = await authApiService.sendPasswordRecoveryCode('phone', {
          phone: cleanPhone,
          verificationBy: 'telegram'
        })
        
        if (result.success) {
          this.$store.dispatch('notifications/showNotification', {
            text: 'Код восстановления отправлен повторно'
          })
        } else {
          const errorMsg = result.error?.[0]?.msg || result.error?.msg || 'Ошибка при повторной отправке кода'
          this.$store.dispatch('notifications/showNotification', {
            text: errorMsg
          })
        }
      } catch (error) {
        console.error('Ошибка при повторной отправке кода:', error)
        this.$store.dispatch('notifications/showNotification', {
          text: 'Ошибка при повторной отправке кода'
        })
      }
    },
    /**
     * Выход из аккаунта
     */
    async handleLogout() {
      try {
        // Вызываем logout из store
        await this.$store.dispatch('auth/logOut')
        
        // Перенаправляем на страницу входа
        this.$router.push('/client/signin')
      } catch (error) {
        console.error('Ошибка при выходе из аккаунта:', error)
        // В любом случае перенаправляем на страницу входа
        this.$router.push('/client/signin')
      }
    },
    handleAvatarUpload({ file, imageUrl }) {
      // Здесь будет логика загрузки аватара на сервер
      console.log('Avatar upload:', file)
      // Временно сохраняем URL для предпросмотра
      this.avatarUrl = imageUrl
    },
    handleAvatarEditClick() {
      console.log('Avatar edit clicked')
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
  overflow-x: hidden; // Предотвращаем горизонтальную прокрутку

  // Когда выбраны Объекты, оставляем стандартный padding (контент будет справа от sidebar)
  // padding-left остается 306px

  @media (max-width: 768px) {
    background: #F6F8FB;
    padding-left: 20px;
  }

  &__main-content {
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    overflow-x: hidden; // Предотвращаем горизонтальную прокрутку

    // Когда выбраны Объекты, убираем ограничение max-width, но оставляем width: 100%
    // Контент автоматически займет всю доступную ширину справа от sidebar
    &--objects {
      max-width: none;
      margin: 0;
      width: 100%;
    }

    @media (max-width: 768px) {
      width: 100%;
      padding: 0;
      
      &--objects {
        width: 100%;
      }
    }
  }

  &__layout {
    display: grid;
    grid-template-columns: 290px 1fr;
    gap: 16px;
    align-items: start;

    // Когда выбраны Объекты, убираем левую колонку
    &--objects {
      grid-template-columns: 1fr;
    }

    @media (max-width: 768px) {
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: center;
      background: #ffffff; // По умолчанию белый фон
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
    max-width: 100%;
    box-sizing: border-box;

    // Когда выбраны Объекты, контент занимает всю ширину
    &--full-width {
      width: 100%;
      max-width: 100%;
    }
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
    max-width: 100%;
    box-sizing: border-box;

    // Когда выбраны Объекты, контент занимает всю ширину
    &--full-width {
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }
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

  &__mobile-header {
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
      width: 100vw;
      margin-left: calc(-50vw + 50%);
      box-sizing: border-box;
    }
  }

  &__mobile-back-button {
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
  }

  &__mobile-back-icon {
    width: 24px;
    height: 24px;
    display: block;
  }

  &__mobile-title {
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

  &__mobile-header-spacer {
    width: 32px;
    flex-shrink: 0;
  }

  &__mobile-content {
    @media (max-width: 768px) {
      width: 100%;
      padding: 16px;
      padding-bottom: 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }
}

@media (max-width: 768px) {
  .ui-profile {
    padding: 0;
    padding-top: 0;
    padding-bottom: 88px; /* 16px отступ + 72px для мобильного меню */
    background: #ffffff;
  }

  // Фон #DADADA только когда показывается меню (activeContent === null)
  .ui-profile__layout--show-menu {
    background: #DADADA;
  }

  // Скрываем обычный Sidebar на мобильных
  :deep(.sidebar) {
    display: none;
  }

  // Скрываем AppHeader на мобильных
  .ui-profile :deep(.app-header) {
    display: none;
  }

  // Стили для мобильного контента
  .ui-profile__content-block {
    background: transparent;
    padding: 0;
  }

  .ui-profile__documents-content {
    background: transparent;
    border-radius: 0;
    padding: 0;
  }

  .ui-profile__mobile-content :deep(.electronic-signature-content) {
    background: transparent;
    border-radius: 0;
    padding: 0;
  }

  .ui-profile__mobile-content :deep(.electronic-signature-content__tabs-wrapper) {
    margin: 0;
    padding: 0;
    padding-top: 0;
  }
}
</style>

