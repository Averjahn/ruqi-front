<template>
  <div class="ui-profile-account">
    <!-- Mobile Header -->
    <div v-if="isMobileView" class="ui-profile-account__mobile-header">
      <button 
        class="ui-profile-account__back-button"
        @click="handleBack"
      >
        <img 
          :src="require('@/assets/icons/profile/arrow-left.svg')" 
          alt="Back" 
          class="ui-profile-account__back-icon"
        />
      </button>
      <h1 class="ui-profile-account__mobile-title">Учётная запись</h1>
      <div class="ui-profile-account__mobile-header-spacer"></div>
    </div>

    <!-- Desktop Header -->
    <AppHeader 
      v-if="!isMobileView"
      :show-notifications="true"
      title="Учётная запись"
      :show-documents="false"
    />

    <!-- Content -->
    <div class="ui-profile-account__content">
      <!-- Mobile: Profile Avatar -->
      <ProfileAvatar 
        v-if="isMobileView"
        :name="userName"
        :avatar-url="avatarUrl"
        @avatar-upload="handleAvatarUpload"
        @edit-click="handleAvatarEditClick"
      />
      
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
  </div>
</template>

<script>
import AppHeader from '@/components/organisms/AppHeader.vue'
import ProfileAvatar from '@/components/organisms/ProfileAvatar.vue'
import PersonalData from '@/components/organisms/PersonalData.vue'
import ProfileActions from '@/components/organisms/ProfileActions.vue'

export default {
  name: 'UIProfileAccount',
  components: {
    AppHeader,
    ProfileAvatar,
    PersonalData,
    ProfileActions
  },
  data() {
    return {
      isMobile: false,
      avatarUrl: null,
      userName: 'Джон МакКлейн',
      personalData: {
        lastName: 'Брюс',
        firstName: 'Уэйн',
        middleName: 'Томасович'
      }
    }
  },
  computed: {
    isMobileView() {
      return this.isMobile
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
      this.$router.push('/ui-new/profile')
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
      console.log('Change password clicked')
    },
    handleLogout() {
      console.log('Logout clicked')
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
.ui-profile-account {
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
  }

  &__back-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
  }

  &__back-icon {
    width: 24px;
    height: 24px;
    display: block;
  }

  &__mobile-title {
    font-family: 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 600;
    font-size: 20px;
    line-height: 28px;
    color: #263043;
    margin: 0;
    flex: 1;
    text-align: left;
    padding-left: 16px;
  }

  &__mobile-header-spacer {
    width: 24px;
  }

  &__content {
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    padding: 16px;

    @media (min-width: 769px) {
      padding: 0;
    }

    @media (max-width: 768px) {
      padding: 16px;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }
}

@media (max-width: 768px) {
  .ui-profile-account {
    padding: 0;
    padding-top: 0;
    padding-bottom: 88px; // 16px отступ + 72px для мобильного меню
    background: #ffffff; // Белый фон в мобильной версии
  }
}
</style>

