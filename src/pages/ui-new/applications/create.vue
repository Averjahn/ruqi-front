<template>
  <div class="ui-applications-create">
    <!-- Mobile Header -->
    <div v-if="isMobileView" class="ui-applications-create__mobile-header">
      <button class="ui-applications-create__back-button" @click="handleBack">
        <img src="@/assets/icons/profile/arrow-left.svg" alt="Back" />
      </button>
      <h1 class="ui-applications-create__mobile-title">Создание заявки</h1>
      <div class="ui-applications-create__mobile-header-spacer" />
    </div>

    <!-- Sidebar (desktop) -->
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

    <!-- App Header -->
    <AppHeader
      v-if="!isMobileView"
      :show-notifications="true"
      :show-documents="false"
      :breadcrumbs="[
        { text: 'Заявки', path: '/ui-new/applications' },
        { text: 'Создание заявки' }
      ]"
    />

    <div class="ui-applications-create__content">
      <div class="ui-applications-create__heading">
        <div>
          <h1 class="ui-applications-create__title">Создание заявки</h1>
          <p class="ui-applications-create__subtitle">
            Заполните данные заявки, выберите объект, смену и укажите требования к исполнителям.
          </p>
        </div>
        <div class="ui-applications-create__status">
          <span class="ui-applications-create__status-label">Статус</span>
          <span class="ui-applications-create__status-value">Черновик</span>
        </div>
      </div>

      <!-- Основное -->
      <section class="ui-applications-create__section">
        <div class="ui-applications-create__section-header">
          <div>
            <h2>Основное</h2>
            <p>Укажите объект и график работы для исполнителей.</p>
          </div>
        </div>
        <div class="ui-applications-create__grid ui-applications-create__grid--3">
          <div class="ui-applications-create__field">
            <label>Объект</label>
            <Select
              v-model="form.objectId"
              :options="objectOptions"
              placeholder="Выберите объект"
              item-value="value"
              item-text="label"
              clearable
            />
          </div>
          <div class="ui-applications-create__field">
            <label>Место проведения работ</label>
            <Input v-model="form.location" placeholder="Введите адрес" />
          </div>
          <div class="ui-applications-create__field">
            <label>График работ</label>
            <Select
              v-model="form.schedule"
              :options="scheduleOptions"
              placeholder="Выберите значение"
              item-value="value"
              item-text="label"
              clearable
            />
          </div>
          <div class="ui-applications-create__field">
            <label>Начало работ</label>
            <Input v-model="form.startDate" placeholder="ДД.ММ.ГГГГ" />
          </div>
          <div class="ui-applications-create__field">
            <label>Окончание работ</label>
            <Input v-model="form.endDate" placeholder="ДД.ММ.ГГГГ" />
          </div>
          <div class="ui-applications-create__field">
            <label>Рабочие часы</label>
            <Select
              v-model="form.workHours"
              :options="workHoursOptions"
              placeholder="Выберите значение"
              item-value="value"
              item-text="label"
              clearable
            />
          </div>
          <div class="ui-applications-create__field">
            <label>Тип смены</label>
            <Select
              v-model="form.shiftType"
              :options="shiftTypeOptions"
              placeholder="Выберите значение"
              item-value="value"
              item-text="label"
              clearable
            />
          </div>
        </div>
      </section>

      <!-- Вакансия -->
      <section class="ui-applications-create__section">
        <div class="ui-applications-create__section-header">
          <div>
            <h2>Вакансия</h2>
            <p>Опишите требования и условия для исполнителей.</p>
          </div>
        </div>
        <div class="ui-applications-create__tabs">
          <Tabs
            :tabs="vacancyTabs"
            :value="form.vacancyTab"
            @change="form.vacancyTab = $event"
            type="contained"
            wide
          />
        </div>
        <div class="ui-applications-create__grid ui-applications-create__grid--2">
          <div class="ui-applications-create__field">
            <label>Вакансия</label>
            <Select
              v-model="form.vacancy"
              :options="vacancyOptions"
              placeholder="Выберите вакансию"
              item-value="value"
              item-text="label"
              clearable
            />
          </div>
          <div class="ui-applications-create__field">
            <label>Нужно человек</label>
            <Input v-model="form.requiredPeople" type="number" min="1" placeholder="Введите значение" />
          </div>
        </div>
        <div class="ui-applications-create__info-row">
          <div class="ui-applications-create__info">
            <span class="ui-applications-create__info-label">Ставка</span>
            <span class="ui-applications-create__info-value">{{ form.rate }}</span>
          </div>
          <div class="ui-applications-create__info">
            <span class="ui-applications-create__info-label">Действует до</span>
            <span class="ui-applications-create__info-value">{{ form.rateValidUntil }}</span>
          </div>
        </div>
      </section>

      <!-- Общедоступные данные -->
      <section class="ui-applications-create__section">
        <div class="ui-applications-create__section-header">
          <div>
            <h2>Общедоступные данные</h2>
            <p>Эта информация будет видна исполнителям.</p>
          </div>
        </div>
        <div class="ui-applications-create__grid ui-applications-create__grid--2">
          <div class="ui-applications-create__field">
            <label>Внутреннее название заявки</label>
            <Input v-model="form.internalName" placeholder="Введите значение" />
          </div>
          <div class="ui-applications-create__field">
            <label>Общедоступное название заявки</label>
            <Input v-model="form.publicName" placeholder="Введите значение" />
          </div>
        </div>
        <div class="ui-applications-create__editor">
          <div class="ui-applications-create__editor-label">Общедоступное описание заявки</div>
          <ckeditor
            :editor="editor"
            v-model="form.publicDescription"
            :config="editorConfig"
          />
        </div>
      </section>

      <div class="ui-applications-create__actions">
        <Button type="outlined" size="m" @click="handleSaveDraft">Сохранить черновик</Button>
        <Button type="contained" color="blue" size="m" @click="handleSubmit">
          Создать заявку
        </Button>
      </div>
    </div>

    <MobileBottomNav v-if="isMobileView" :menu-items="mobileMenuItems" />
  </div>
</template>

<script>
import Sidebar from '@/components/organisms/Sidebar.vue'
import AppHeader from '@/components/organisms/AppHeader.vue'
import MobileBottomNav from '@/components/organisms/MobileBottomNav.vue'
import Input from '@/components/atoms/Input.vue'
import Select from '@/components/atoms/Select.vue'
import Button from '@/components/atoms/Button.vue'
import Tabs from '@/components/atoms/Tabs.vue'
import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default {
  name: 'UIApplicationsCreate',
  components: {
    Sidebar,
    AppHeader,
    MobileBottomNav,
    Input,
    Select,
    Button,
    Tabs,
    ckeditor: CKEditor.component
  },
  data() {
    return {
      isMobile: false,
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
      mobileMenuItems: [
        { id: 1, title: 'Заявки', iconPath: require('@/assets/icons/profile/note.svg'), route: '/ui-new/applications' },
        { id: 2, title: 'Объекты', iconPath: require('@/assets/icons/profile/objects-icon.svg'), route: '/ui-new/objects' },
        { id: 3, title: 'Финансы', iconPath: require('@/assets/icons/profile/wallet.svg'), route: null },
        { id: 4, title: 'Исполнители', iconPath: require('@/assets/icons/profile/executor.svg'), route: null },
        { id: 5, title: 'Еще', iconPath: require('@/assets/icons/FAQ/lines-else.svg'), route: null }
      ],
      form: {
        objectId: null,
        location: 'Россия, Москва, улица Новый Арбат, 21',
        schedule: null,
        startDate: '',
        endDate: '',
        workHours: null,
        shiftType: null,
        vacancyTab: 'general',
        vacancy: null,
        requiredPeople: '',
        rate: '233₽/час',
        rateValidUntil: '01.09.2024',
        internalName: 'Врач',
        publicName: '',
        publicDescription: ''
      },
      vacancyTabs: [
        { text: 'Общее', value: 'general' },
        { text: 'Контакты', value: 'contacts' },
        { text: 'Услуги', value: 'services' }
      ],
      objectOptions: [
        { value: 1, label: 'Магнит косметик' },
        { value: 2, label: 'Пятёрочка' },
        { value: 3, label: 'Озон фреш' }
      ],
      scheduleOptions: [
        { value: '5/2', label: '5/2' },
        { value: '2/2', label: '2/2' },
        { value: 'гибкий', label: 'Гибкий' }
      ],
      workHoursOptions: [
        { value: 'any', label: 'Любой' },
        { value: 'day', label: 'Дневные' },
        { value: 'night', label: 'Ночные' }
      ],
      shiftTypeOptions: [
        { value: 'full', label: 'Полная смена' },
        { value: 'half', label: 'Пол смены' },
        { value: 'custom', label: 'Индивидуально' }
      ],
      vacancyOptions: [
        { value: 'loader', label: 'Грузчик' },
        { value: 'picker', label: 'Сборщик заказов' },
        { value: 'courier', label: 'Курьер' }
      ],
      editor: ClassicEditor,
      editorConfig: {
        toolbar: [
          'undo',
          'redo',
          '|',
          'heading',
          '|',
          'bold',
          'italic',
          'link',
          'bulletedList',
          'numberedList',
          'blockQuote'
        ]
      }
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
    handleBack() {
      this.$router.push('/ui-new/applications')
    },
    handleSidebarIconClick() {
      console.log('Sidebar icon clicked')
    },
    handleSidebarItemClick(item) {
      if (item.route) {
        this.$router.push(item.route)
      }
    },
    handleSaveDraft() {
      console.log('Draft saved', this.form)
    },
    handleSubmit() {
      console.log('Application created', this.form)
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-applications-create {
  min-height: 100vh;
  background: #f6f8fb;
  display: flex;
  flex-direction: column;
  position: relative;

  @media (min-width: 769px) {
    padding-left: 306px;
    padding-top: 100px;
  }

  &__mobile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background: #ffffff;
    border-bottom: 1px solid #e3e5e4;
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
    margin: 0;
  }

  &__mobile-header-spacer {
    width: 40px;
  }

  &__content {
    width: 100%;
    max-width: 1040px;
    margin: 0 auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    @media (max-width: 768px) {
      padding: 16px;
    }
  }

  &__heading {
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  &__title {
    font-size: 28px;
    line-height: 34px;
    font-weight: 600;
    color: #263043;
    margin: 0 0 8px 0;
  }

  &__subtitle {
    margin: 0;
    color: #667085;
    font-size: 16px;
    line-height: 24px;
  }

  &__status {
    background: #f2f8ff;
    border: 1px solid #d1e3ff;
    border-radius: 12px;
    padding: 16px;
    min-width: 180px;
  }

  &__status-label {
    display: block;
    font-size: 12px;
    color: #667085;
    margin-bottom: 4px;
  }

  &__status-value {
    font-size: 16px;
    font-weight: 600;
    color: #1735f5;
  }

  &__section {
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    @media (max-width: 768px) {
      padding: 16px;
    }
  }

  &__section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;

    h2 {
      margin: 0;
      font-size: 20px;
      line-height: 28px;
      color: #263043;
    }

    p {
      margin: 4px 0 0;
      color: #667085;
      font-size: 14px;
      line-height: 20px;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 16px;

    &--2 {
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    }

    &--3 {
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 8px;

    label {
      font-size: 14px;
      font-weight: 500;
      color: #263043;
    }
  }

  &__info-row {
    display: flex;
    gap: 40px;
    flex-wrap: wrap;
    padding: 8px 0 4px;
    border-top: 1px solid #f0f0f0;
  }

  &__info {
    min-width: 160px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__info-label {
    font-size: 14px;
    color: #6b7280;
  }

  &__info-value {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
  }

  &__tabs {
    width: 100%;

    ::v-deep .tabs_container {
      width: 100%;
    }
  }

  &__editor {
    display: flex;
    flex-direction: column;
    gap: 12px;

    ::v-deep .ck-editor__editable {
      min-height: 160px;
    }
  }

  &__editor-label {
    font-size: 14px;
    font-weight: 500;
    color: #263043;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    flex-wrap: wrap;
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;

    @media (max-width: 768px) {
      flex-direction: column;
      button {
        width: 100%;
      }
    }
  }
}
</style>

