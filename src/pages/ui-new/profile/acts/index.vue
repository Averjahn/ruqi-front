<template>
  <div class="ui-profile-acts">
    <!-- Mobile Header -->
    <div v-if="isMobileView" class="ui-profile-acts__mobile-header">
      <button 
        class="ui-profile-acts__back-button"
        @click="handleBack"
      >
        <img 
          :src="require('@/assets/icons/profile/arrow-left.svg')" 
          alt="Back" 
          class="ui-profile-acts__back-icon"
        />
      </button>
      <h1 class="ui-profile-acts__mobile-title">Акты</h1>
      <div class="ui-profile-acts__mobile-header-spacer"></div>
    </div>

    <!-- Desktop Header -->
    <AppHeader 
      v-if="!isMobileView"
      :show-notifications="true"
      title="Акты"
      :show-documents="false"
    />

    <!-- Content -->
    <div class="ui-profile-acts__content">
      <ActsContent
        :acts="acts"
        :total-count="actsTotalCount"
        @sign="handleActSign"
        @download="handleActDownload"
        @page-change="handleActPageChange"
      />
    </div>

    <!-- Mobile Bottom Navigation -->
    <MobileBottomNav v-if="isMobileView" :menu-items="mobileMenuItems" />
  </div>
</template>

<script>
import AppHeader from '@/components/organisms/AppHeader.vue'
import MobileBottomNav from '@/components/organisms/MobileBottomNav.vue'
import ActsContent from '@/components/organisms/ActsContent.vue'

export default {
  name: 'UIProfileActs',
  components: {
    AppHeader,
    MobileBottomNav,
    ActsContent
  },
  data() {
    return {
      isMobile: false,
      mobileMenuItems: [
        { id: 1, title: 'Заявки', iconPath: require('@/assets/icons/profile/note.svg'), route: null },
        { id: 2, title: 'Объекты', iconPath: require('@/assets/icons/profile/objects-icon.svg'), route: null },
        { id: 3, title: 'Финансы', iconPath: require('@/assets/icons/profile/wallet.svg'), route: null },
        { id: 4, title: 'Исполнители', iconPath: require('@/assets/icons/profile/executor.svg'), route: null },
        { id: 5, title: 'Еще', iconPath: require('@/assets/icons/FAQ/lines-else.svg'), route: null }
      ],
      acts: [
        {
          name: 'Иванов И.И.',
          status: {
            type: 'needs-signature',
            text: 'Нужно подписать'
          },
          createdDate: '01.10.2021',
          requestName: 'Название заявки'
        }
      ],
      actsTotalCount: 100
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
    handleActSign(act) {
      console.log('Sign act:', act)
      // TODO: Implement act signing logic
    },
    handleActDownload(act) {
      console.log('Download act:', act)
      // TODO: Implement act download logic
    },
    handleActPageChange(page) {
      console.log('Page change:', page)
      // TODO: Implement pagination logic
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-profile-acts {
  min-height: 100vh;
  background: #F6F8FB;
  padding-top: 80px; // For desktop header

  @media (max-width: 768px) {
    padding-top: 0;
    background: #ffffff;
  }
}

.ui-profile-acts__mobile-header {
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

.ui-profile-acts__back-button {
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

.ui-profile-acts__mobile-title {
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

.ui-profile-acts__mobile-header-spacer {
  width: 32px;
  flex-shrink: 0;
}

.ui-profile-acts__content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 2px 0 72px 0; // Offset for status bar and bottom nav
  }
}
</style>

