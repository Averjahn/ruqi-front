<template>
  <div class="ui-vacancy-create">
    <!-- Mobile Header -->
    <div v-if="isMobileView" class="ui-vacancy-create__mobile-header">
      <button class="ui-vacancy-create__back-button" @click="handleBack">
        <img src="@/assets/icons/profile/arrow-left.svg" alt="Back" />
      </button>
      <h1 class="ui-vacancy-create__mobile-title">Создание вакансии</h1>
      <div class="ui-vacancy-create__mobile-header-spacer" />
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
      :show-documents="true"
      :breadcrumbs="breadcrumbs"
    />

    <div class="ui-vacancy-create__content">
      <!-- Stepper -->
      <Stepper :steps="stepperSteps" />

      <!-- Form Card -->
      <div class="ui-vacancy-create__card">
        <!-- Основное -->
        <VacancyBasicInfoForm
          :form-data="form"
          :profession-options="professionOptions"
          @update:form-data="form = $event"
        />

        <div class="ui-vacancy-create__divider"></div>

        <!-- Значения ставок вакансии -->
        <VacancyRatesForm
          :form-data="form"
          :rate-per-options="ratePerOptions"
          @update:form-data="form = $event"
        />

        <div class="ui-vacancy-create__divider"></div>

        <!-- Ставки для исполнителя -->
        <VacancyRatesTable
          :rates="form.rates"
          @add-rate="addRate"
          @remove-rate="removeRate"
          @update-rate="updateRate"
        />

        <div class="ui-vacancy-create__divider"></div>

        <!-- Общедоступное описание заявки -->
        <VacancyDescriptionEditor
          :model-value="form.publicDescription"
          @update:model-value="form.publicDescription = $event"
        />
      </div>

    </div>

    <!-- Fixed Action Bar -->
    <FixedActionBar
      @back="handleBack"
      @next="handleNext"
    />

    <MobileBottomNav v-if="isMobileView" :menu-items="mobileMenuItems" />
  </div>
</template>

<script>
import Sidebar from '@/components/organisms/Sidebar.vue'
import AppHeader from '@/components/organisms/AppHeader.vue'
import MobileBottomNav from '@/components/organisms/MobileBottomNav.vue'
import Stepper from '@/components/molecules/Stepper.vue'
import VacancyBasicInfoForm from '@/components/molecules/VacancyBasicInfoForm.vue'
import VacancyRatesForm from '@/components/molecules/VacancyRatesForm.vue'
import VacancyRatesTable from '@/components/molecules/VacancyRatesTable.vue'
import VacancyDescriptionEditor from '@/components/molecules/VacancyDescriptionEditor.vue'
import FixedActionBar from '@/components/molecules/FixedActionBar.vue'

const OBJECTS_SELECTED_KEY = 'uiObjects.selectedObjectId'

export default {
  name: 'UIVacancyCreate',
  components: {
    Sidebar,
    AppHeader,
    MobileBottomNav,
    Stepper,
    VacancyBasicInfoForm,
    VacancyRatesForm,
    VacancyRatesTable,
    VacancyDescriptionEditor,
    FixedActionBar
  },
  data() {
    return {
      isMobile: false,
      desktopMenuItems: [
        { id: 1, title: 'Заявки', iconPath: require('@/assets/icons/profile/note.svg'), active: false, route: '/ui-new/applications' },
        { id: 2, title: 'Объекты', iconPath: require('@/assets/icons/profile/objects-icon.svg'), active: true, route: '/ui-new/objects' },
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
        profession: null,
        vacancyName: '',
        restrictions: [],
        gender: 'all',
        ratePer: 'hour',
        hoursPerShift: '8',
        rates: [
          {
            id: 1,
            unit: 'Час',
            amount: '8000',
            accruedPerShift: '8000',
            withVAT: '8510.64',
            type: '1 час',
            standard: '06.11.2...',
            validFrom: '06.11.2025',
            status: 'Текущая'
          }
        ],
        publicDescription: ''
      },
      professionOptions: [
        { value: 'loader', label: 'Грузчик' },
        { value: 'picker', label: 'Сборщик заказов' },
        { value: 'courier', label: 'Курьер' },
        { value: 'warehouse', label: 'Складской работник' }
      ],
      ratePerOptions: [
        { value: 'hour', label: 'Час' },
        { value: 'shift', label: 'Смена' },
        { value: 'day', label: 'День' }
      ],
      stepperSteps: [
        { number: 1, label: 'Основное', status: 'active' },
        { number: 2, label: 'Данные чека', status: 'waiting' },
        { number: 5, label: 'Фотографии и описание', status: 'waiting' }
      ],
      objectId: null,
      objectName: null
    }
  },
  computed: {
    isMobileView() {
      return this.isMobile
    },
    sidebarMenuItems() {
      return this.desktopMenuItems
    },
    breadcrumbs() {
      const crumbs = [
        { text: 'Объекты', path: '/ui-new/objects' }
      ]
      
      // Добавляем имя объекта в хлебные крошки, если оно есть
      const objectName = this.objectName || (this.objectId ? `Объект ${this.objectId}` : null)
      if (objectName) {
        crumbs.push({
          text: objectName,
          onClick: () => {
            // Возвращаемся к объекту, если он был выбран
            if (this.objectId && typeof window !== 'undefined') {
              window.localStorage.setItem(OBJECTS_SELECTED_KEY, String(this.objectId))
            }
            this.$router.push('/ui-new/objects')
          }
        })
      }
      
      crumbs.push({ text: 'Создание вакансии' })
      
      return crumbs
    }
  },
  mounted() {
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
    
    // Получаем ID и имя объекта из query параметров или localStorage
    if (this.$route.query.objectId) {
      this.objectId = this.$route.query.objectId
    } else if (typeof window !== 'undefined') {
      const savedObjectId = window.localStorage.getItem(OBJECTS_SELECTED_KEY)
      if (savedObjectId) {
        this.objectId = savedObjectId
      }
    }
    
    // Получаем имя объекта из query параметров
    if (this.$route.query.objectName) {
      this.objectName = this.$route.query.objectName
    } else if (this.objectId) {
      // Если есть ID, но нет имени, используем дефолтное значение
      this.objectName = `Объект ${this.objectId}`
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
      if (item.route) {
        this.$router.push(item.route)
      }
    },
    handleBack() {
      if (this.objectId) {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(OBJECTS_SELECTED_KEY, String(this.objectId))
        }
        this.$router.push('/ui-new/objects')
      } else {
        this.$router.push('/ui-new/objects')
      }
    },
    handleNext() {
      console.log('Next step', this.form)
      // TODO: Переход на следующий шаг
    },
    addRate() {
      const newRate = {
        id: Date.now(),
        unit: 'Час',
        amount: '',
        accruedPerShift: '8 000 ₽',
        withVAT: '8 510,64 ₽',
        type: '1 час',
        standard: '',
        validFrom: '06.11.2025',
        status: null
      }
      this.form.rates.push(newRate)
    },
    removeRate(rateId) {
      this.form.rates = this.form.rates.filter(rate => rate.id !== rateId)
    },
    updateRate({ rateId, field, value }) {
      const rate = this.form.rates.find(r => r.id === rateId)
      if (rate) {
        rate[field] = value
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-vacancy-create {
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
    max-width: 800px;
    margin: 0 auto;
    padding: 32px 24px;
    padding-bottom: 120px; // Отступ для фиксированного бара
    display: flex;
    flex-direction: column;
    gap: 32px;

    @media (max-width: 768px) {
      padding: 24px 16px;
      padding-bottom: 88px; // Отступ для фиксированного бара на мобильных (72px + 16px)
      gap: 32px;
      max-width: 100%;
    }
  }


  &__card {
    background: #ffffff;
    border-radius: 10px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 32px;

    @media (max-width: 768px) {
      padding: 24px;
      gap: 24px;
      border-radius: 0;
      margin: 0 -16px; // Убираем отступы по бокам на мобильных
      width: calc(100% + 32px);
    }
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: 32px;

    &--no-gap {
      gap: 0;
    }
  }

  &__section-header {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__section-title {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 600;
    font-size: 24px;
    line-height: 1.25;
    color: #263043;
    margin: 0;
  }

  &__section-description {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-size: 14px;
    line-height: 22px;
    color: #666666;
    margin: 0;
  }

  &__fields-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 4px;

    label {
      font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
      font-size: 14px;
      line-height: 22px;
      color: #666666;
      letter-spacing: 0.1px;
    }
  }


  &__divider {
    height: 1px;
    background: #e3e5e4;
    width: 100%;
  }


}
</style>

