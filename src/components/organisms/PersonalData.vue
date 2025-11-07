<template>
  <div class="personal-data">
    <!-- Section 1: Персональные данные -->
    <div class="personal-data__section">
      <div class="personal-data__header">
        <h2 class="personal-data__title">Персональные данные</h2>
        <a 
          v-if="showEdit"
          href="#" 
          class="personal-data__edit-link"
          @click.prevent="handleEdit"
        >
          <img 
            src="@/assets/icons/profile/Edit.svg" 
            alt="Edit" 
            class="personal-data__edit-icon"
          />
          Изменить
        </a>
      </div>
      <div class="personal-data__fields">
        <DataField 
          label="Фамилия"
          :value="personalData.lastName"
          placeholder="Введите фамилию"
        />
        <DataField 
          label="Имя"
          :value="personalData.firstName"
          placeholder="Введите имя"
        />
        <DataField 
          label="Отчество"
          :value="personalData.middleName"
          placeholder="Введите отчество"
        />
      </div>
    </div>

    <!-- Section 2: Контакты -->
    <div class="personal-data__section">
      <div class="personal-data__header">
        <h2 class="personal-data__title">Контакты</h2>
      </div>
      <div class="personal-data__fields">
        <DataField 
          label="Телефон"
          :value="contacts.phone"
          placeholder="Введите телефон"
          :status="contacts.phoneStatus"
          :action="{ type: 'icon', icon: require('@/assets/icons/arrow_send_right.svg') }"
          @action-click="handlePhoneClick"
        />
        <DataField 
          label="Адрес электронной почты"
          :value="contacts.email"
          placeholder="Введите email"
          :status="contacts.emailStatus"
          :action="{ type: 'icon', icon: require('@/assets/icons/arrow_send_right.svg') }"
          @action-click="handleEmailClick"
        />
        <DataField 
          label="Telegram"
          :value="contacts.telegram || 'Привяжите Telegram-аккаунт для уведомлений'"
          placeholder="Привяжите Telegram-аккаунт для уведомлений"
          :action="{ type: 'link', text: 'Привязать' }"
          @action-click="handleTelegramLink"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DataField from '@/components/molecules/DataField.vue'

export default {
  name: 'PersonalData',
  components: {
    DataField
  },
  props: {
    personalData: {
      type: Object,
      default: () => ({
        lastName: '',
        firstName: '',
        middleName: ''
      })
    },
    contacts: {
      type: Object,
      default: () => ({
        phone: '',
        email: '',
        telegram: null,
        phoneStatus: null,
        emailStatus: null
      })
    },
    showEdit: {
      type: Boolean,
      default: true
    }
  },
  emits: ['edit', 'phone-click', 'email-click', 'telegram-link'],
  methods: {
    handleEdit() {
      this.$emit('edit')
    },
    handlePhoneClick() {
      this.$emit('phone-click')
    },
    handleEmailClick() {
      this.$emit('email-click')
    },
    handleTelegramLink() {
      this.$emit('telegram-link')
    }
  }
}
</script>

<style lang="scss" scoped>
.personal-data {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
}

.personal-data__section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.personal-data__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.personal-data__title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
  color: #263043;
  margin: 0;
}

.personal-data__edit-link {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Source Sans Pro', 'Source Sans 3', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 125%; // 20px (16px * 1.25)
  letter-spacing: 0%;
  vertical-align: middle;
  color: #1735F5;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
}

.personal-data__edit-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.personal-data__fields {
  display: flex;
  flex-direction: column;
}
</style>

