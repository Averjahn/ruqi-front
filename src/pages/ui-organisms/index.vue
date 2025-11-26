<template>
  <div class="ui-organisms">
    <div class="ui-organisms__header">
      <h1>Organisms ({{ componentStats.organisms }})</h1>
      <p>Сложные блоки интерфейса</p>
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

        <!-- Layout Structure - как в реальном приложении -->
        <div class="ui-organisms__layout-demo">
        <h3>Layout Structure - Desktop</h3>
        <div class="ui-organisms__layout-desktop">
          <!-- Topbar - сверху на всю ширину -->
          <div class="ui-organisms__layout-item ui-organisms__layout-item--topbar">
            <h4>Topbar</h4>
            <Topbar :user="testUser" />
          </div>
          
          <!-- Main Content Area -->
          <div class="ui-organisms__layout-item ui-organisms__layout-item--content">
            <h4>Main Content Area</h4>
            <div class="ui-organisms__content-demo">
              <!-- BackButtonHeader - в начале контента -->
              <div class="ui-organisms__content-item">
                <h5>BackButtonHeader</h5>
                <BackButtonHeader title="Назад" />
              </div>
              
              <!-- User Interface Components -->
              <div class="ui-organisms__content-item">
                <h5>UserMenu</h5>
                <UserMenu :user="testUser" />
              </div>
              
              <div class="ui-organisms__content-item">
                <h5>UserNotifications</h5>
                <UserNotifications :notifications="testNotifications" />
              </div>
              
              <div class="ui-organisms__content-item">
                <h5>BonusBlock</h5>
                <BonusBlock :bonus="1500" :level="3" />
              </div>
            </div>
          </div>
          
          <!-- Footer - снизу на всю ширину -->
          <div class="ui-organisms__layout-item ui-organisms__layout-item--footer">
            <h4>Footer</h4>
            <Footer :links="testMenuItems" />
          </div>
        </div>
        
        <!-- Mobile Layout -->
        <h3>Layout Structure - Mobile</h3>
        <div class="ui-organisms__layout-mobile">
          <!-- TopBarMobile - сверху на всю ширину -->
          <div class="ui-organisms__layout-item ui-organisms__layout-item--topbar-mobile">
            <h4>TopBarMobile</h4>
            <TopBarMobile :user="testUser" />
          </div>
          
          <!-- Main Content Area -->
          <div class="ui-organisms__layout-item ui-organisms__layout-item--content-mobile">
            <h4>Main Content Area</h4>
            <div class="ui-organisms__content-demo">
              <!-- BackButtonHeader - в начале контента -->
              <div class="ui-organisms__content-item">
                <h5>BackButtonHeader</h5>
                <BackButtonHeader title="Назад" />
              </div>
              
              <!-- User Interface Components -->
              <div class="ui-organisms__content-item">
                <h5>UserMenu</h5>
                <UserMenu :user="testUser" />
              </div>
              
              <div class="ui-organisms__content-item">
                <h5>UserNotifications</h5>
                <UserNotifications :notifications="testNotifications" />
              </div>
            </div>
          </div>
          
          <!-- BottomBar - снизу на всю ширину -->
          <div class="ui-organisms__layout-item ui-organisms__layout-item--bottombar">
            <h4>BottomBar</h4>
            <BottomBar :items="testMenuItems" />
          </div>
        </div>
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
          <ProfileHeader name="Неизвестный" />
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
                icon: require('@/assets/icons/profile/input-status-red.svg'),
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

      <!-- Content Sections - логически сгруппированные -->
      <div class="ui-organisms__subsection">
        <h3>Content Sections</h3>
        <div class="ui-organisms__content-sections">
          <!-- Banners and Promotions - сверху контента -->
          <div class="ui-organisms__content-section">
            <h4>Banners and Promotions (Top of Content)</h4>
            <div class="ui-organisms__showcase">
              <div class="ui-organisms__item">
                <h5>AccountMainBlockBanners</h5>
                <AccountMainBlockBanners :banners="testBanners" />
              </div>
              
              <div class="ui-organisms__item">
                <h5>BonusBlock</h5>
                <BonusBlock :bonus="1500" :level="3" />
              </div>
            </div>
          </div>
          
          <!-- User Interface - в сайдбаре или модальных окнах -->
          <div class="ui-organisms__content-section">
            <h4>User Interface (Sidebar/Modals)</h4>
            <div class="ui-organisms__showcase">
              <div class="ui-organisms__item">
                <h5>UserMenu</h5>
                <UserMenu :user="testUser" />
              </div>
              
              <div class="ui-organisms__item">
                <h5>UserNotifications</h5>
                <UserNotifications :notifications="testNotifications" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Calendar and Tasks -->
      <div class="ui-organisms__subsection">
        <h3>Calendar and Tasks</h3>
        <div class="ui-organisms__showcase">
          <div class="ui-organisms__item">
            <h4>Calendar</h4>
            <Calendar :events="testCalendarEvents" />
          </div>
          
          <div class="ui-organisms__item">
            <h4>CalendarBlock</h4>
            <CalendarBlock :events="testCalendarEvents" />
          </div>
          
          <div class="ui-organisms__item">
            <h4>HorizontalCalendar</h4>
            <HorizontalCalendar :events="testCalendarEvents" />
          </div>
          
          <div class="ui-organisms__item">
            <h4>Task</h4>
            <Task :task="testTasks[0]" />
          </div>
          
          <div class="ui-organisms__item">
            <h4>MapTasks</h4>
            <MapTasks :tasks="testTasks" />
          </div>
        </div>
      </div>

      <!-- Lists and Data -->
      <div class="ui-organisms__subsection">
        <h3>Lists and Data</h3>
        <div class="ui-organisms__showcase">
          <div class="ui-organisms__item">
            <h4>FlexibleUniversalList</h4>
            <FlexibleUniversalList :items="testTasks" />
          </div>
          
          <div class="ui-organisms__item">
            <h4>ObjectsList</h4>
            <ObjectsList :objects="testObjects" />
          </div>
          
          <div class="ui-organisms__item">
            <h4>FaqList</h4>
            <FaqList :items="testFaqItems" />
          </div>
          
          <div class="ui-organisms__item">
            <h4>FaqAccordion</h4>
            <FaqAccordion :items="testFaqItems" />
          </div>
          
          <div class="ui-organisms__item">
            <h4>FaqSections</h4>
            <FaqSections :sections="[{ title: 'Общие вопросы', items: testFaqItems }]" />
          </div>
        </div>
      </div>

      <!-- Media and Files -->
      <div class="ui-organisms__subsection">
        <h3>Media and Files</h3>
        <div class="ui-organisms__showcase">
          <div class="ui-organisms__item">
            <h4>ImageGallery</h4>
            <ImageGallery :images="testGalleryImages" />
          </div>
          
          <div class="ui-organisms__item">
            <h4>AttachedFiles</h4>
            <AttachedFiles :files="testFiles" />
          </div>
          
          <div class="ui-organisms__item">
            <h4>UploadPhoto</h4>
            <UploadPhoto :uploadData="testUploadData" />
          </div>
          
          <div class="ui-organisms__item">
            <h4>PassportPhotoLoader</h4>
            <PassportPhotoLoader :passportData="testPassportData" />
          </div>
        </div>
      </div>

      <!-- Forms and Authentication -->
      <div class="ui-organisms__subsection">
        <h3>Forms and Authentication</h3>
        <div class="ui-organisms__showcase">
          <div class="ui-organisms__item">
            <h4>InviteFriendForm</h4>
            <InviteFriendForm :inviteData="testInviteData" />
          </div>
          
          <div class="ui-organisms__item">
            <h4>TelegramLogin</h4>
            <TelegramLogin :telegramData="testTelegramData" />
          </div>
          
          <div class="ui-organisms__item">
            <h4>TelegramNotification</h4>
            <TelegramNotification :notification="testUserNotificationData" />
          </div>
          
          <div class="ui-organisms__item ui-organisms__item--full">
            <h4>OrganisationDataForm</h4>
            <OrganisationDataForm
              v-model="testOrganisationData"
              :counterparty-types="testCounterpartyTypes"
            />
          </div>
        </div>
      </div>

      <!-- Maps and Location -->
      <div class="ui-organisms__subsection">
        <h3>Maps and Location</h3>
        <div class="ui-organisms__showcase">
          <div class="ui-organisms__item">
            <h4>Map</h4>
            <Map :mapData="testMapData" />
          </div>
          
          <div class="ui-organisms__item">
            <h4>Region</h4>
            <Region :regions="testRegions" />
          </div>
          
          <div class="ui-organisms__item">
            <h4>SearchAutocomplete</h4>
            <SearchAutocomplete :searchData="testSearchData" />
          </div>
        </div>
      </div>

      <!-- Business Components -->
      <div class="ui-organisms__subsection">
        <h3>Business Components</h3>
        <div class="ui-organisms__showcase">
          <div class="ui-organisms__item">
            <h4>ActItem</h4>
            <ActItem :item="testActData" />
          </div>
          
          <div class="ui-organisms__item">
            <h4>ContractsItem</h4>
            <ContractsItem :item="testContractData" />
          </div>
          
          <div class="ui-organisms__item">
            <h4>PaymentItem</h4>
            <PaymentItem :payment="testPaymentData" />
          </div>
          
          <div class="ui-organisms__item">
            <h4>Ticket</h4>
            <Ticket :ticket="testTicketData" />
          </div>
          
          <div class="ui-organisms__item">
            <h4>Message</h4>
            <Message :message="testMessageData" />
          </div>
        </div>
      </div>

      <!-- Banners and Ads -->
      <div class="ui-organisms__subsection">
        <h3>Banners and Ads</h3>
        <div class="ui-organisms__showcase">
          <div class="ui-organisms__item">
            <h4>DesktopAdBanners</h4>
            <DesktopAdBanners :banners="testBanners" />
          </div>
          
          <div class="ui-organisms__item">
            <h4>MobileAdBanners</h4>
            <MobileAdBanners :banners="testBanners" />
          </div>
          
          <div class="ui-organisms__item">
            <h4>ProfileTopBanners</h4>
            <ProfileTopBanners :banners="testBanners" />
          </div>
        </div>
      </div>

      <!-- Specialized Components -->
      <div class="ui-organisms__subsection">
        <h3>Specialized Components</h3>
        <div class="ui-organisms__showcase">
          <div class="ui-organisms__item">
            <h4>ViolationsMainInfo</h4>
            <ViolationsMainInfo :violations="testViolationData" />
          </div>
          
          <div class="ui-organisms__item">
            <h4>ObjectBar</h4>
            <ObjectBar :object="testObjectData" />
          </div>
          
          <div class="ui-organisms__item">
            <h4>GlobalPopups</h4>
            <GlobalPopups :popups="testNotifications" />
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
// Импорты для организмов
import AccountMainBlockBanners from '@/components/organisms/AccountMainBlockBanners.vue'
import ActItem from '@/components/organisms/ActItem.vue'
import AttachedFiles from '@/components/organisms/AttachedFiles.vue'
import BackButtonHeader from '@/components/organisms/BackButtonHeader.vue'
import BonusBlock from '@/components/organisms/BonusBlock.vue'
import BottomBar from '@/components/organisms/BottomBar.vue'
import Calendar from '@/components/organisms/Calendar.vue'
import CalendarBlock from '@/components/organisms/CalendarBlock.vue'
import ContractsItem from '@/components/organisms/ContractsItem.vue'
import DesktopAdBanners from '@/components/organisms/DesktopAdBanners.vue'
import FaqAccordion from '@/components/organisms/FaqAccordion.vue'
import FaqList from '@/components/organisms/FaqList.vue'
import FaqSections from '@/components/organisms/FaqSections.vue'
import FlexibleUniversalList from '@/components/organisms/FlexibleUniversalList.vue'
import Footer from '@/components/organisms/Footer.vue'
import GlobalPopups from '@/components/organisms/GlobalPopups.vue'
import HorizontalCalendar from '@/components/organisms/HorizontalCalendar.vue'
import ImageGallery from '@/components/organisms/ImageGallery.vue'
import InviteFriendForm from '@/components/organisms/InviteFriendForm.vue'
import Map from '@/components/organisms/Map.vue'
import MapTasks from '@/components/organisms/MapTasks.vue'
import Message from '@/components/organisms/Message.vue'
import MobileAdBanners from '@/components/organisms/MobileAdBanners.vue'
import ObjectBar from '@/components/organisms/ObjectBar.vue'
import ObjectsList from '@/components/organisms/ObjectsList.vue'
import OrganisationDataForm from '@/components/organisms/OrganisationDataForm.vue'
import PassportPhotoLoader from '@/components/organisms/PassportPhotoLoader.vue'
import Sidebar from '@/components/organisms/Sidebar.vue'
import AppHeader from '@/components/organisms/AppHeader.vue'
import ProfileMenu from '@/components/organisms/ProfileMenu.vue'
import ProfileHeader from '@/components/organisms/ProfileHeader.vue'
import ManagerCard from '@/components/organisms/ManagerCard.vue'
import PersonalData from '@/components/organisms/PersonalData.vue'
import PaymentItem from '@/components/organisms/PaymentItem.vue'
import ProfileTopBanners from '@/components/organisms/ProfileTopBanners.vue'
import Region from '@/components/organisms/Region.vue'
import SearchAutocomplete from '@/components/organisms/SearchAutocomplete.vue'
import Task from '@/components/organisms/Task.vue'
import TelegramLogin from '@/components/organisms/TelegramLogin.vue'
import TelegramNotification from '@/components/organisms/TelegramNotification.vue'
import Ticket from '@/components/organisms/Ticket.vue'
import Topbar from '@/components/organisms/Topbar.vue'
import TopBarMobile from '@/components/organisms/TopBarMobile.vue'
import UploadPhoto from '@/components/organisms/UploadPhoto.vue'
import UserMenu from '@/components/organisms/userMenu.vue'
import UserNotifications from '@/components/organisms/UserNotifications.vue'
import ViolationsMainInfo from '@/components/organisms/ViolationsMainInfo.vue'

export default {
  name: 'UIOrganisms',
  components: {
    AccountMainBlockBanners,
    ActItem,
    AttachedFiles,
    BackButtonHeader,
    BonusBlock,
    BottomBar,
    Calendar,
    CalendarBlock,
    ContractsItem,
    DesktopAdBanners,
    FaqAccordion,
    FaqList,
    FaqSections,
    FlexibleUniversalList,
    Footer,
    GlobalPopups,
    HorizontalCalendar,
    ImageGallery,
    InviteFriendForm,
    Map,
    MapTasks,
    Message,
    MobileAdBanners,
    ObjectBar,
    ObjectsList,
    OrganisationDataForm,
    PassportPhotoLoader,
    Sidebar,
    AppHeader,
    ProfileMenu,
    ProfileHeader,
    ManagerCard,
    PersonalData,
    PaymentItem,
    ProfileTopBanners,
    Region,
    SearchAutocomplete,
    Task,
    TelegramLogin,
    TelegramNotification,
    Ticket,
    Topbar,
    TopBarMobile,
    UploadPhoto,
    UserMenu,
    UserNotifications,
    ViolationsMainInfo,
  },
  data() {
    return {
      // Test data
      testMenuItems: [
        { text: 'Профиль', href: '/ui-new/profile' },
        { text: 'Задачи', href: '/tasks' },
        { text: 'Настройки', href: '/settings' }
      ],
      
      testUser: {
        name: 'Иван Иванов',
        email: 'ivan@example.com',
        phone: '+7 (999) 123-45-67'
      },
      
      testNotifications: [
        { id: 1, text: 'Новое уведомление 1', type: 'info' },
        { id: 2, text: 'Новое уведомление 2', type: 'warning' }
      ],
      
      testBanners: [
        { id: 1, title: 'Реклама 1', image: null },
        { id: 2, title: 'Реклама 2', image: null }
      ],
      
      testCalendarEvents: [
        { date: '2024-01-15', title: 'Событие 1' },
        { date: '2024-01-20', title: 'Событие 2' }
      ],
      
      testTasks: [
        { id: 1, title: 'Задача 1', status: 'active' },
        { id: 2, title: 'Задача 2', status: 'completed' }
      ],
      
      testObjects: [
        { id: 1, name: 'Объект 1', address: 'Адрес 1' },
        { id: 2, name: 'Объект 2', address: 'Адрес 2' }
      ],
      
      testFaqItems: [
        { question: 'Как зарегистрироваться?', answer: 'Перейдите на страницу регистрации...' },
        { question: 'Как восстановить пароль?', answer: 'Нажмите "Забыли пароль?"...' }
      ],
      
      testGalleryImages: [
        { id: 1, src: null, alt: 'Изображение 1' },
        { id: 2, src: null, alt: 'Изображение 2' }
      ],
      
      testFiles: [
        { id: 1, name: 'document1.pdf', type: 'pdf' },
        { id: 2, name: 'image1.jpg', type: 'jpg' }
      ],
      
      testUploadData: {
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        maxSize: 5242880,
        maxFiles: 5,
        currentFiles: []
      },
      
      testPassportData: {
        series: '1234',
        number: '567890',
        issuedBy: 'ОВД г. Москвы',
        issueDate: '2020-01-01',
        expiryDate: '2030-01-01',
        birthPlace: 'г. Москва',
        registration: 'г. Москва, ул. Тестовая, д. 1'
      },
      
      testInviteData: {
        email: 'friend@example.com',
        message: 'Присоединяйся к нашей команде!',
        referralCode: 'REF123456'
      },
      
      testTelegramData: {
        botUsername: '@ruqi_bot',
        botName: 'Ruki Bot',
        isConnected: false,
        username: null
      },
      
      testUserNotificationData: {
        id: 1,
        title: 'Новое уведомление',
        message: 'У вас есть новое сообщение',
        type: 'info',
        isRead: false,
        createdAt: '2024-01-15T10:00:00Z'
      },
      
      testMapData: {
        center: { lat: 55.7558, lng: 37.6176 },
        zoom: 10,
        markers: [
          { lat: 55.7558, lng: 37.6176, title: 'Объект 1', type: 'object' },
          { lat: 55.7658, lng: 37.6276, title: 'Объект 2', type: 'object' }
        ],
        geoObjects: [
          { 
            lat: 55.7558, 
            lng: 37.6176, 
            title: 'Объект 1', 
            type: 'object',
            id: 1,
            address: 'г. Москва, ул. Тестовая, д. 1'
          },
          { 
            lat: 55.7658, 
            lng: 37.6276, 
            title: 'Объект 2', 
            type: 'object',
            id: 2,
            address: 'г. Москва, ул. Примерная, д. 2'
          }
        ],
        tasks: [
          {
            id: 1,
            title: 'Задача 1',
            lat: 55.7558,
            lng: 37.6176,
            status: 'active'
          },
          {
            id: 2,
            title: 'Задача 2', 
            lat: 55.7658,
            lng: 37.6276,
            status: 'completed'
          }
        ]
      },
      
      testRegions: [
        { id: 1, name: 'Москва' },
        { id: 2, name: 'Санкт-Петербург' },
        { id: 3, name: 'Новосибирск' }
      ],
      
      testSearchData: {
        query: '',
        results: [
          { id: 1, title: 'Объект "Солнечный"', type: 'object', address: 'г. Москва' },
          { id: 2, title: 'Задача "Укладка плитки"', type: 'task', object: 'Объект 1' }
        ],
        filters: {
          type: 'all',
          location: 'all',
          dateRange: null
        }
      },
      
      testActData: {
        id: 1,
        title: 'Акт выполненных работ',
        date: '2024-01-15',
        amount: 15000,
        status: 'completed',
        sign_status: 'pending',
        pay_status: 'paid',
        sum_accrual: 15000,
        created_at: '2024-01-15T10:00:00Z',
        json: {
          purpose_text: 'Выполнение работ по договору подряда',
          period_string: '15.01.2024 - 20.01.2024'
        }
      },
      
      testContractData: {
        id: 1,
        title: 'Договор подряда',
        client_company: 'ООО "Тест"',
        amount: 50000,
        status: 'all_signed',
        created_at: '2024-01-15T10:00:00Z',
        signed_at: '2024-01-16T10:00:00Z',
        expires_at: '2025-01-15T10:00:00Z',
        general_type: 'platform',
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      },
      
      testPaymentData: {
        id: 1,
        amount: 25000,
        method: 'card',
        status: 'completed',
        date: '2024-01-15'
      },
      
      testTicketData: {
        id: 1,
        title: 'Техническая поддержка',
        description: 'Проблема с авторизацией',
        status: 'open',
        priority: 'high',
        createdAt: '2024-01-15T10:00:00Z'
      },
      
      testMessageData: {
        id: 1,
        text: 'Добро пожаловать в систему!',
        sender: 'Администратор',
        timestamp: '2024-01-15T10:00:00Z',
        isRead: false
      },
      
      testViolationData: {
        total: 3,
        byType: {
          'Опоздание': 2,
          'Пропуск': 1
        },
        recent: [
          { type: 'Опоздание', date: '2024-01-14', description: 'Опоздание на 15 минут' }
        ]
      },
      
      testObjectData: {
        id: 1,
        name: 'Строительный объект "Солнечный"',
        address: 'г. Москва, ул. Строителей, д. 10',
        rating: 4.8,
        rate: 3000,
        isSubscribed: false,
        logo: null,
        professions: ['Строитель', 'Крановщик', 'Сварщик'],
        description: 'Современный жилой комплекс с развитой инфраструктурой'
      },
      
      testCounterpartyTypes: [
        { value: 'legal', label: 'Юридическое лицо' },
        { value: 'other', label: 'Прочее' }
      ],
      
      testOrganisationData: {
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
        bank: ''
      },
      
      sidebarMenuItems: [
        { id: 1, title: 'Заявки', iconPath: require('@/assets/icons/profile/note.svg'), active: true },
        { id: 2, title: 'Объекты', iconPath: require('@/assets/icons/profile/objects-icon.svg'), active: false },
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
        organisms: 31,
        total: 31
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

  // Layout Demo Styles
  &__layout-demo {
    margin-bottom: 60px;
    
    h3 {
      font-size: 1.8em;
      margin-bottom: 20px;
      color: #263043;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
  }

  &__layout-desktop,
  &__layout-mobile {
    display: flex;
    flex-direction: column;
    border: 2px solid #ddd;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 30px;
    background: #f9f9f9;
  }

  &__layout-item {
    padding: 16px;
    border-bottom: 1px solid #ddd;
    
    &:last-child {
      border-bottom: none;
    }
    
    h4 {
      font-size: 1.1em;
      margin-bottom: 10px;
      color: #263043;
      font-weight: 600;
    }
    
    h5 {
      font-size: 0.9em;
      margin-bottom: 8px;
      color: #666;
      font-weight: 500;
    }
    
    // Topbar - сверху на всю ширину
    &--topbar,
    &--topbar-mobile {
      background: #fff;
      border-bottom: 2px solid #007bff;
    }
    
    // Main Content Area
    &--content,
    &--content-mobile {
      background: #f8f9fa;
      flex: 1;
      min-height: 200px;
    }
    
    // Footer - снизу на всю ширину
    &--footer {
      background: #343a40;
      color: white;
      
      h4 {
        color: white;
      }
    }
    
    // BottomBar - снизу на всю ширину (мобильная версия)
    &--bottombar {
      background: #fff;
      border-top: 2px solid #007bff;
    }
  }

  &__content-demo {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__content-item {
    padding: 12px;
    background: white;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  // Content Sections
  &__content-sections {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  &__content-section {
    h4 {
      font-size: 1.4em;
      margin-bottom: 15px;
      color: #263043;
      font-weight: 600;
      padding-left: 10px;
      border-left: 4px solid #007bff;
    }
    
    h5 {
      font-size: 1em;
      margin-bottom: 10px;
      color: #666;
      font-weight: 500;
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
