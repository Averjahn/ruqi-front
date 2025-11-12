<template>
  <div class="ui-profile-signature">
    <!-- Mobile Header -->
    <div v-if="isMobileView" class="ui-profile-signature__mobile-header">
      <button 
        class="ui-profile-signature__back-button"
        @click="handleBack"
      >
        <img 
          :src="require('@/assets/icons/profile/arrow-left.svg')" 
          alt="Back" 
          class="ui-profile-signature__back-icon"
        />
      </button>
      <h1 class="ui-profile-signature__mobile-title">Электронная подпись</h1>
      <div class="ui-profile-signature__mobile-header-spacer"></div>
    </div>

    <!-- Desktop Header -->
    <AppHeader 
      v-if="!isMobileView"
      :show-notifications="true"
      title="Электронная подпись"
      :show-documents="false"
    />

    <!-- Content -->
    <div class="ui-profile-signature__content">
      <ElectronicSignatureContent @archive="handleSignatureArchive" />
    </div>

    <!-- Mobile Bottom Navigation -->
    <MobileBottomNav v-if="isMobileView" :menu-items="mobileMenuItems" />
  </div>
</template>

<script>
import AppHeader from '@/components/organisms/AppHeader.vue'
import MobileBottomNav from '@/components/organisms/MobileBottomNav.vue'
import ElectronicSignatureContent from '@/components/organisms/ElectronicSignatureContent.vue'

export default {
  name: 'UIProfileSignature',
  components: {
    AppHeader,
    MobileBottomNav,
    ElectronicSignatureContent
  },
  data() {
    return {
      isMobileView: false,
      // Мобильное меню (5 пунктов) - для MobileBottomNav
      mobileMenuItems: [
        { id: 1, title: 'Заявки', iconPath: require('@/assets/icons/profile/note.svg'), route: null },
        { id: 2, title: 'Объекты', iconPath: require('@/assets/icons/profile/objects-icon.svg'), route: null },
        { id: 3, title: 'Финансы', iconPath: require('@/assets/icons/profile/wallet.svg'), route: null },
        { id: 4, title: 'Исполнители', iconPath: require('@/assets/icons/profile/executor.svg'), route: null },
        { id: 5, title: 'Еще', iconPath: require('@/assets/icons/FAQ/lines-else.svg'), route: null }
      ]
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
      this.isMobileView = window.innerWidth <= 768
    },
    handleBack() {
      this.$router.push('/ui-new/profile')
    },
    handleSignatureArchive(certificate) {
      console.log('Archive signature:', certificate)
      // TODO: Implement archive signature logic
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-profile-signature {
  min-height: 100vh;
  background: #F6F8FB;

  @media (max-width: 768px) {
    background: #ffffff;
    padding-top: 2px; // Offset for status bar
    padding-bottom: 72px; // Space for mobile bottom nav
  }
}

.ui-profile-signature__mobile-header {
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
  }
}

.ui-profile-signature__back-button {
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

  img {
    width: 24px;
    height: 24px;
  }
}

.ui-profile-signature__mobile-title {
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

.ui-profile-signature__mobile-header-spacer {
  width: 32px;
  flex-shrink: 0;
}

.ui-profile-signature__content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  padding-left: 306px; // 286px sidebar + 20px margin
  padding-top: 100px; // 80px header + 20px margin

  @media (max-width: 768px) {
    padding: 24px 16px;
    padding-top: 0;
  }
}

@media (max-width: 768px) {
  .ui-profile-signature__content :deep(.electronic-signature-content) {
    background: transparent;
    border-radius: 0;
    padding: 0;
  }

  .ui-profile-signature__content :deep(.electronic-signature-content__tabs-wrapper) {
    margin: 0;
    padding: 0;
    padding-top: 0;
  }
}
</style>

