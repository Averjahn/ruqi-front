<template>
  <div class="personal-data">
    <!-- Section 1: Персональные данные -->
    <div class="personal-data__section">
      <div class="personal-data__header">
        <h2 class="personal-data__title">Персональные данные</h2>
        <a 
          v-if="showEdit && !isEditing"
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
        <template v-if="!isEditing">
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
        </template>
        <template v-else>
          <div class="personal-data__input-field">
            <label class="personal-data__input-label">Фамилия</label>
            <input 
              v-model="editedData.lastName"
              type="text"
              class="personal-data__input"
              placeholder="Введите фамилию"
            />
          </div>
          <div class="personal-data__input-field">
            <label class="personal-data__input-label">Имя</label>
            <input 
              v-model="editedData.firstName"
              type="text"
              class="personal-data__input"
              placeholder="Введите имя"
            />
          </div>
          <div class="personal-data__input-field">
            <label class="personal-data__input-label">Отчество</label>
            <input 
              v-model="editedData.middleName"
              type="text"
              class="personal-data__input"
              placeholder="Введите отчество"
            />
          </div>
          <div class="personal-data__actions">
            <button 
              class="personal-data__button personal-data__button--outline"
              @click="handleCancel"
            >
              Отменить
            </button>
            <button 
              class="personal-data__button personal-data__button--primary"
              @click="handleSave"
            >
              Сохранить
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- Section 2: Контакты -->
    <div class="personal-data__section">
      <div class="personal-data__header">
        <h2 class="personal-data__title">Контакты</h2>
      </div>
      <div class="personal-data__fields">
        <div class="personal-data__clickable-field" @click="handlePhoneClick">
          <DataField 
            label="Телефон"
            :value="contacts.phone"
            placeholder="Введите телефон"
            :status="contacts.phoneStatus"
            :action="{ type: 'icon', icon: require('@/assets/icons/profile/arrow-icon.svg') }"
            @action-click="handlePhoneClick"
          />
        </div>
        <DataField 
          label="Адрес электронной почты"
          :value="contacts.email"
          placeholder="Введите email"
          :status="contacts.emailStatus"
          :action="{ type: 'icon', icon: require('@/assets/icons/profile/arrow-icon.svg') }"
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
    
    <!-- Phone Edit Modal -->
    <ChangePhoneModal 
      v-model="isPhoneModalOpen"
      :initial-phone="contacts.phone || '+7 900 000-00-00'"
      @get-code="handleGetCode"
    />
    
    <!-- Confirm Code Modal -->
    <ConfirmCodeModal
      v-model="isConfirmCodeModalOpen"
      :phone="pendingPhone"
      @confirm="handleConfirmCode"
      @resend="handleResendCode"
    />
  </div>
</template>

<script>
import DataField from '@/components/molecules/DataField.vue'
import ChangePhoneModal from '@/components/organisms/ChangePhoneModal.vue'
import ConfirmCodeModal from '@/components/organisms/ConfirmCodeModal.vue'

export default {
  name: 'PersonalData',
  components: {
    DataField,
    ChangePhoneModal,
    ConfirmCodeModal
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
  emits: ['edit', 'phone-click', 'phone-get-code', 'phone-confirm-code', 'phone-resend-code', 'email-click', 'telegram-link', 'save', 'cancel'],
  data() {
    return {
      isEditing: false,
      editedData: {
        lastName: '',
        firstName: '',
        middleName: ''
      },
      isPhoneModalOpen: false,
      isConfirmCodeModalOpen: false,
      pendingPhone: ''
    }
  },
  watch: {
    personalData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.editedData = {
            lastName: newVal.lastName || '',
            firstName: newVal.firstName || '',
            middleName: newVal.middleName || ''
          }
        }
      }
    }
  },
  methods: {
    handleEdit() {
      this.isEditing = true
      this.editedData = {
        lastName: this.personalData.lastName || '',
        firstName: this.personalData.firstName || '',
        middleName: this.personalData.middleName || ''
      }
      this.$emit('edit')
    },
    handleCancel() {
      this.isEditing = false
      this.editedData = {
        lastName: this.personalData.lastName || '',
        firstName: this.personalData.firstName || '',
        middleName: this.personalData.middleName || ''
      }
      this.$emit('cancel')
    },
    handleSave() {
      this.isEditing = false
      this.$emit('save', { ...this.editedData })
    },
    handlePhoneClick() {
      this.isPhoneModalOpen = true
      this.$emit('phone-click')
    },
    handleGetCode(phone) {
      this.pendingPhone = phone
      this.isPhoneModalOpen = false
      this.isConfirmCodeModalOpen = true
      this.$emit('phone-get-code', phone)
    },
    handleConfirmCode(code) {
      this.isConfirmCodeModalOpen = false
      this.$emit('phone-confirm-code', { phone: this.pendingPhone, code })
    },
    handleResendCode() {
      this.$emit('phone-resend-code', this.pendingPhone)
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
  background: white;
  padding: 24px;
  border-radius: 10px;

  @media (max-width: 768px) {
    width: 100%;
    margin: 0 -16px;
    padding: 16px;
    padding-left: 16px;
    padding-right: 16px;
    width: calc(100% + 32px);
    border-radius: 0;
  }
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
  gap: 16px;
}

.personal-data__input-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.personal-data__input-label {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #666666;
}

.personal-data__input {
  width: 100%;
  height: 48px;
  padding: 12px 16px;
  border: 1px solid #dadada;
  border-radius: 8px;
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #263043;
  background-color: #ffffff;
  box-sizing: border-box;
  transition: border-color 0.2s ease;

  &::placeholder {
    color: #707070;
  }

  &:focus {
    outline: none;
    border-color: #1735f5;
    border-width: 1.5px;
  }

  &:hover:not(:focus) {
    border-color: #9ca3af;
  }
}

.personal-data__actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.personal-data__button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 152px;
  height: 40px;
  padding: 0;
  border-radius: 8px;
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  box-sizing: border-box;

  &--primary {
    background-color: #1735f5;
    color: #ffffff;

    &:hover:not(:disabled) {
      background-color: #2E3F9E;
    }

    &:active:not(:disabled) {
      background-color: #263588;
    }
  }

  &--outline {
    background-color: #ffffff;
    border: 2px solid #1735f5;
    color: #1735f5;

    &:hover:not(:disabled) {
      border-color: #2E3F9E;
    }

    &:active:not(:disabled) {
      background-color: #f2f8ff;
      border-color: #1735f5;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.personal-data__clickable-field {
  cursor: pointer;
  
  :deep(.data-field__content) {
    cursor: pointer;
  }
}
</style>

