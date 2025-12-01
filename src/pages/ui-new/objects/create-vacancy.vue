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
      <div class="ui-vacancy-create__stepper-wrapper">
        <Stepper :steps="stepperSteps" />
      </div>

      <!-- Шаг 1: Основное -->
      <div
        v-if="currentStepIndex === 0"
        class="ui-vacancy-create__card ui-vacancy-create__card--narrow"
      >
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

      <!-- Шаг 2: Данные чека -->
      <div
        v-else-if="currentStepIndex === 1"
        class="ui-vacancy-create__step2-layout"
      >
        <div class="ui-vacancy-create__card ui-vacancy-create__step2-card">
          <div class="ui-vacancy-create__section">
            <div class="ui-vacancy-create__section-header">
              <h2 class="ui-vacancy-create__section-title">
                Данные для формирования чека
                <br />
                при расчёте с исполнителем
              </h2>
              <p class="ui-vacancy-create__section-description">
                Краткое описание что сюда писать, например напишите в
                наименовании общедоступное название и примерное расположение.
              </p>
            </div>

            <div class="ui-vacancy-create__fields-row">
              <div class="ui-vacancy-create__field">
                <label>Юниты/Единицы измерения</label>
                <Select
                  v-model="form.ratePer"
                  :options="ratePerOptions"
                  placeholder="Выберите значение"
                />
              </div>

              <div class="ui-vacancy-create__field">
                <label>Норма выработки</label>
                <Input
                  v-model="form.hoursPerShift"
                  placeholder="8"
                />
              </div>
            </div>

            <div class="ui-vacancy-create__field">
              <label>Наименование услуги в чеке для самозанятого*</label>
              <Input
                v-model="form.checkServiceName"
                placeholder="Введите значение"
              />
            </div>
          </div>
        </div>

        <!-- Карточка предпросмотра чека (пока статичная) -->
        <div class="ui-vacancy-create__check-card">
          <h3 class="ui-vacancy-create__check-title">Чек № 123</h3>
          <div class="ui-vacancy-create__check-row ui-vacancy-create__check-row--meta">
            <span>10.07.25</span>
            <span>15:00 (+03:00)</span>
          </div>
          <div class="ui-vacancy-create__check-divider"></div>
          <div class="ui-vacancy-create__check-person">
            <p>ИВАНОВ ИВАН</p>
            <p>ИВАНОВИЧ</p>
          </div>
          <div class="ui-vacancy-create__check-divider"></div>
          <div class="ui-vacancy-create__check-table">
            <div class="ui-vacancy-create__check-row ui-vacancy-create__check-row--header">
              <span>Наименование</span>
              <span>Сумма</span>
            </div>
            <div class="ui-vacancy-create__check-row ui-vacancy-create__check-row--item">
              <span>
                1. {{ form.checkServiceName || 'Услуги по комплектованию товара на складе заказчика в соответствии с требованиями с 16.06.2023 по 18.06.2023 в количестве 12 шт' }}
              </span>
              <span>0,00₽</span>
            </div>
          </div>
          <div class="ui-vacancy-create__check-divider"></div>
          <div class="ui-vacancy-create__check-row ui-vacancy-create__check-row--total">
            <span>Итого</span>
            <span>0,00 ₽</span>
          </div>
          <div class="ui-vacancy-create__check-divider"></div>
          <div class="ui-vacancy-create__check-row">
            <span>Режим НО</span>
            <span>НПД</span>
          </div>
          <div class="ui-vacancy-create__check-row">
            <span>ИНН</span>
            <span>1111111111111</span>
          </div>
          <div class="ui-vacancy-create__check-divider"></div>
          <div class="ui-vacancy-create__check-row ui-vacancy-create__check-row--buyer">
            <span>Покупатель:</span>
          </div>
          <div class="ui-vacancy-create__check-row ui-vacancy-create__check-row--buyer">
            <span>ИНН: 11111111111111</span>
          </div>
        </div>
      </div>

      <!-- Шаг 3: Фотографии и описание -->
      <div
        v-else
        class="ui-vacancy-create__card ui-vacancy-create__card--narrow"
      >
        <div class="ui-vacancy-create__photos-section">
          <!-- Заголовок с кнопкой -->
          <div class="ui-vacancy-create__photos-header">
            <div class="ui-vacancy-create__photos-header-text">
              <h2 class="ui-vacancy-create__photos-title">
                Чем предстоит заниматься
              </h2>
              <p class="ui-vacancy-create__photos-description">
                Загружайте изображения в разрешении 1080×1920 для основной фотографии. Размер файла — до 20 Мб
              </p>
            </div>
            <button class="ui-vacancy-create__photos-add-button" @click="addPhotoItem">
              <img src="@/assets/icons/profile/Add.svg" alt="Add" />
              Добавить
            </button>
          </div>

          <!-- Кнопка "Добавить из библиотеки" -->
          <button class="ui-vacancy-create__photos-library-button" @click="addFromLibrary">
            <img src="@/assets/icons/camera.svg" alt="Library" />
            Добавить из библиотеки
          </button>

          <!-- Карточки с фотографиями -->
          <PhotoUploadCard
            v-for="(photo, index) in form.photos"
            :key="photo.id"
            :main-image="photo.mainImage"
            :thumbnail="photo.thumbnail"
            :title="photo.title"
            :description="photo.description"
            @update:main-image="photo.mainImage = $event"
            @update:thumbnail="photo.thumbnail = $event"
            @update:title="photo.title = $event"
            @update:description="photo.description = $event"
            @delete="removePhotoItem(index)"
            @generate-image="generateImage(index)"
            @generate-description="generateDescription(index)"
          />
        </div>
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
import PhotoUploadCard from '@/components/molecules/PhotoUploadCard.vue'
import Input from '@/components/atoms/Input.vue'
import Select from '@/components/atoms/Select.vue'

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
    FixedActionBar,
    PhotoUploadCard,
    Input,
    Select
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
        publicDescription: '',
        // Поле для шага "Данные чека"
        checkServiceName: '',
        // Поля для шага "Фотографии и описание"
        photos: []
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
      currentStepIndex: 0,
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
    this.updateStepperStatuses()
    
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
      // Временно: если мы не на первом шаге, переходим на предыдущий шаг.
      // Иначе ведем себя как раньше — возвращаемся к списку объектов.
      if (this.currentStepIndex > 0) {
        this.currentStepIndex -= 1
        this.updateStepperStatuses()
        return
      }

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
      // Временно: переключаем шаги по кнопке "Далее", чтобы можно было попасть на шаг 2 и 3.
      if (this.currentStepIndex < this.stepperSteps.length - 1) {
        this.currentStepIndex += 1
        this.updateStepperStatuses()
        return
      }

      // Последний шаг — пока просто логируем данные формы
      console.log('Finish wizard (последний шаг)', this.form)
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
    },
    updateStepperStatuses() {
      // Обновляем статусы шагов в соответствии с текущим индексом
      this.stepperSteps = this.stepperSteps.map((step, index) => {
        let status = 'waiting'
        if (index < this.currentStepIndex) {
          status = 'completed'
        } else if (index === this.currentStepIndex) {
          status = 'active'
        }
        return { ...step, status }
      })
    },
    // Методы для работы с фотографиями
    addPhotoItem() {
      const newPhoto = {
        id: Date.now(),
        mainImage: null,
        thumbnail: null,
        title: '',
        description: ''
      }
      this.form.photos.push(newPhoto)
    },
    removePhotoItem(index) {
      this.form.photos.splice(index, 1)
    },
    addFromLibrary() {
      // TODO: Реализовать добавление из библиотеки
      console.log('Add from library')
    },
    generateImage(index) {
      // TODO: Реализовать генерацию изображения
      console.log('Generate image', index)
    },
    generateDescription(index) {
      // TODO: Реализовать генерацию описания
      console.log('Generate description', index)
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
    padding-left: calc(var(--sidebar-width, 286px) + 20px);
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
    padding: 32px 24px;
    padding-bottom: 120px; // Отступ для фиксированного бара
    display: flex;
    flex-direction: column;
    gap: 32px;

    @media (max-width: 768px) {
      padding: 24px 16px;
      padding-bottom: 88px; // Отступ для фиксированного бара на мобильных (72px + 16px)
      gap: 32px;
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

  &__card--narrow {
    max-width: 800px;
    margin: 0 auto;

    @media (max-width: 768px) {
      max-width: 100%;
      margin: 0 -16px;
      width: calc(100% + 32px);
    }
  }

  &__stepper-wrapper {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
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

  &__step2-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.8fr) minmax(0, 1fr);
    gap: 16px;
    align-items: start;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  }

  &__step2-card {
    margin: 0;
    display: flex;
    flex-direction: column;
  }

  &__check-card {
    background: #ffffff;
    border-radius: 8px;
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-sizing: border-box;
    width: 330px;
    flex-shrink: 0;

    @media (max-width: 1024px) {
      width: 100%;
    }
  }

  &__check-title {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 700;
    font-size: 24px;
    line-height: 24px;
    color: #263043;
    margin: 0;
  }

  &__check-row {
    display: flex;
    justify-content: space-between;
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-size: 16px;
    line-height: 22px;
    color: #263043;
    gap: 8px;

    &--header {
      font-weight: 700;
    }

    &--item {
      align-items: flex-start;
    }

    &--total {
      font-weight: 700;
    }

    &--buyer {
      justify-content: flex-start;
    }
  }

  // Текст наименования в чеке с переносами
  &__check-row--item {
    span:first-child {
      flex: 1;
      white-space: normal;
      word-wrap: break-word;
      word-break: break-word;
    }

    span:last-child {
      white-space: nowrap;
      flex-shrink: 0;
    }
  }

  &__check-person {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-size: 20px;
    line-height: 24px;
    color: #263043;

    p {
      margin: 0;
    }
  }

  &__check-table {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__check-divider {
    height: 1px;
    background: #e3e5e4;
    width: 100%;
  }
  // Стили для шага "Фотографии и описание"
  &__photos-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
  }

  &__photos-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
  }

  &__photos-header-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__photos-title {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 600;
    font-size: 24px;
    line-height: 1.25;
    color: #263043;
    margin: 0;
  }

  &__photos-description {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-size: 16px;
    line-height: 22px;
    color: #263043;
    margin: 0;
    white-space: pre-wrap;
  }

  &__photos-add-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    color: #1735f5;
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 26px;
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;

    img {
      width: 24px;
      height: 24px;
    }
  }

  &__photos-library-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    color: #1735f5;
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    cursor: pointer;
    padding: 0;
    letter-spacing: 0.1px;

    img {
      width: 20px;
      height: 20px;
    }
  }

}
</style>

