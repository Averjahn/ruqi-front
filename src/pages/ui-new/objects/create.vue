<template>
  <div class="ui-object-create">
    <!-- Mobile Header -->
    <div v-if="isMobileView" class="ui-object-create__mobile-header">
      <button class="ui-object-create__back-button" @click="handleCancel">
        <img src="@/assets/icons/profile/arrow-left.svg" alt="Back" />
      </button>
      <h1 class="ui-object-create__mobile-title">Создание объекта</h1>
      <div class="ui-object-create__mobile-header-spacer" />
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
      :breadcrumbs="[
        { text: 'Объекты', path: '/ui-new/objects' },
        { text: 'Создание объекта' }
      ]"
    />

    <div class="ui-object-create__content">
      <section class="ui-object-create__card">
        <div class="ui-object-create__section-headline">
          <div>
            <h1>Информация об объекте</h1>
            <p>Краткое описание чего сюда писать, например напишите в наименовании общедоступное название и примерное расположение.</p>
          </div>
        </div>

        <LogoUpload 
          :model-value="form.logo"
          @update:model-value="value => (form.logo = value)"
          :min-width="98"
          :min-height="98"
        />
        <p class="ui-object-create__upload-hint">
          Рекомендуем использовать изображение размером не менее 98 × 98 пикселей в формате PNG или GIF. Анимированные картинки загружать нельзя. Размер файла — не более 4 МБ.
        </p>

        <div class="ui-object-create__grid">
          <div class="ui-object-create__field ui-object-create__field--full">
            <label>Название объекта для исполнителей</label>
            <Input v-model="form.name" placeholder="Введите значение" />
          </div>
          <div class="ui-object-create__field ui-object-create__field--full">
            <label>Часовой пояс</label>
            <Select
              v-model="form.timezone"
              :options="timezoneOptions"
              placeholder="Выберите часовой пояс"
              clearable
              item-value="value"
              item-text="label"
            />
          </div>
          <div class="ui-object-create__field">
            <label>Время начала дневной смены</label>
            <Input v-model="form.dayShiftStart" placeholder="Выберите время" />
          </div>
          <div class="ui-object-create__field">
            <label>Время начала ночной смены</label>
            <Input v-model="form.nightShiftStart" placeholder="Выберите время" />
          </div>
          <div class="ui-object-create__field">
            <label>График работы</label>
            <Select
              v-model="form.schedule"
              :options="scheduleOptions"
              placeholder="Выберите график"
              clearable
              item-value="value"
              item-text="label"
            />
          </div>
          <div class="ui-object-create__field">
            <label>Вид объекта</label>
            <Select
              v-model="form.objectType"
              :options="objectTypeOptions"
              placeholder="Выберите объект"
              clearable
              item-value="value"
              item-text="label"
            />
          </div>
          <div class="ui-object-create__field ui-object-create__field--full">
            <label>Описание</label>
            <Textarea
              v-model="form.description"
              placeholder="Введите описание"
              :height="'120px'"
              :maxlength="200"
            />
            <div class="ui-object-create__counter">{{ descriptionRemaining }}</div>
          </div>
          <div class="ui-object-create__field ui-object-create__field--full">
            <label>Адрес</label>
            <Input v-model="form.address" placeholder="Введите значение" />
          </div>
        </div>

        <div class="ui-object-create__contacts">
          <div
            v-for="(contact, index) in contacts"
            :key="contact.id"
            class="ui-object-create__contact-card"
          >
            <div class="ui-object-create__contact-card-header">
              <h3>Контакт</h3>
              <button
                v-if="contacts.length > 1"
                class="ui-object-create__contact-remove"
                type="button"
                @click="removeContact(contact.id)"
              >
                <img src="@/assets/icons/trash.svg" alt="Удалить" />
              </button>
            </div>
            <div class="ui-object-create__contact-fields">
              <div class="ui-object-create__field">
                <label>ФИО</label>
                <Input v-model="contact.fullName" placeholder="Введите ФИО" />
              </div>
              <div class="ui-object-create__field">
                <label>Должность</label>
                <Input v-model="contact.position" placeholder="Введите значение" />
              </div>
              <div class="ui-object-create__field">
                <label>Телефон</label>
                <Input v-model="contact.phone" placeholder="Введите значение" />
              </div>
              <div class="ui-object-create__field">
                <label>Email</label>
                <Input v-model="contact.email" placeholder="Введите значение" />
              </div>
            </div>
          </div>
          <button class="ui-object-create__add-contact" type="button" @click="addContact">
            <img src="@/assets/icons/profile/plus.svg" alt="" />
            Добавить контактное лицо
          </button>
        </div>
      </section>

      <div class="ui-object-create__actions">
        <Button type="outlined" size="m" @click="handleCancel">Закрыть</Button>
        <Button type="contained" color="blue" size="m" @click="handleSubmit">Создать</Button>
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
import Textarea from '@/components/atoms/Textarea.vue'
import Button from '@/components/atoms/Button.vue'
import LogoUpload from '@/components/atoms/LogoUpload.vue'

export default {
  name: 'UIObjectCreate',
  components: {
    Sidebar,
    AppHeader,
    MobileBottomNav,
    Input,
    Select,
    Textarea,
    Button,
    LogoUpload
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
        logo: [],
        name: '',
        timezone: null,
        dayShiftStart: '',
        nightShiftStart: '',
        schedule: null,
        objectType: null,
        description: '',
        address: ''
      },
      timezoneOptions: [
        { value: 'utc+3', label: 'UTC+3 (Москва)' },
        { value: 'utc+4', label: 'UTC+4 (Самара)' },
        { value: 'utc+7', label: 'UTC+7 (Красноярск)' }
      ],
      scheduleOptions: [
        { value: '5/2', label: '5/2' },
        { value: '2/2', label: '2/2' },
        { value: 'гибкий', label: 'Гибкий' }
      ],
      objectTypeOptions: [
        { value: 'food_production', label: 'Пищевое производство' },
        { value: 'retail_shop', label: 'Ритэйл розница' },
        { value: 'retail_warehouse', label: 'Ритэйл склад' },
        { value: '3pl_operator', label: '3PL оператор' },
        { value: 'agrofarm', label: 'Агроферма' },
        { value: 'non_food_production', label: 'Не пищевое производство' }
      ],
      contacts: [
        { id: 1, fullName: '', position: '', phone: '', email: '' }
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
    descriptionRemaining() {
      const remaining = 200 - (this.form.description?.length || 0)
      return remaining >= 0 ? remaining : 0
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
      if (item.route) {
        this.$router.push(item.route)
      }
    },
    addContact() {
      const nextId = Date.now()
      this.contacts.push({ id: nextId, fullName: '', position: '', phone: '', email: '' })
    },
    removeContact(id) {
      if (this.contacts.length === 1) return
      this.contacts = this.contacts.filter(contact => contact.id !== id)
    },
    handleCancel() {
      this.$router.push('/ui-new/objects')
    },
    handleSubmit() {
      console.log('Object data submitted', {
        form: this.form,
        contacts: this.contacts
      })
      // TODO: replace with API call
      this.$router.push('/ui-new/objects')
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-object-create {
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
    max-width: 960px;
    margin: 0 auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    @media (max-width: 768px) {
      padding: 16px;
    }
  }

  &__card {
    background: #ffffff;
    border-radius: 12px;
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    @media (max-width: 768px) {
      padding: 20px;
    }
  }

  &__section-headline {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    h1 {
      margin: 0 0 8px;
      font-size: 24px;
      line-height: 32px;
      color: #263043;
    }

    p {
      margin: 0;
      font-size: 14px;
      line-height: 20px;
      color: #667085;
    }
  }

  &__upload-hint {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    color: #667085;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 8px;

    label {
      font-size: 14px;
      font-weight: 400;
      color: #666666;
    }
  }

  &__field--full {
    grid-column: 1 / -1;
  }

  &__counter {
    font-size: 12px;
    color: #98a2b3;
    text-align: right;
  }

  &__contacts {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__contact-card {
    border: 1px solid #e4e7ec;
    border-radius: 12px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__contact-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h3 {
      margin: 0;
      font-size: 18px;
      line-height: 24px;
      color: #263043;
    }
  }

  &__contact-fields {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  &__contact-remove {
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;

    img {
      width: 20px;
      height: 20px;
      filter: grayscale(1);
    }
  }

  &__add-contact {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    color: #1735f5;
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    padding: 0;

    img {
      width: 24px;
      height: 24px;
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 16px;

    @media (max-width: 768px) {
      flex-direction: column;

      button {
        width: 100%;
      }
    }
  }

  @media (max-width: 768px) {
    &__contact-fields {
      grid-template-columns: 1fr;
    }
  }
}
</style>

