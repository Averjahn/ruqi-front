<template>
  <div class="profile_page">
    <div class="basic_container_global">
      <h2 class="main_header">Личный кабинет</h2>

      <section class="profile_page_container">
        <section ref="menu" class="left_part">
          <div class="info_block_mobile">
            <!-- <AttentionBlock v-if="isShowAttention" @needCertificate="needCertificate" /> -->
            <UserAccountMainBlock
              v-if="activeTab === 'account'"
              @change-tab="handleTabChange"
              :violationsCounter="violationsCounter"
              :loading="firstProfileLoading"
            />
          </div>
          <MenuList v-model="activeTab" :options="tabs" @update:modelValue="onMenu" />
        </section>

        <ButtonText
          v-if="!isMainTab"
          class="back_button"
          :class="{ visibility }"
          ref="backButton"
          type="s"
          color="grey"
          @click="scrollUp"
        >
          <Icon name="arrowUp" :size="20" />Профиль
        </ButtonText>

        <section class="right_part" :class="{ isMainTab }">
          <!-- <AttentionBlock v-if="isShowAttention" class="desktop_attention" @needCertificate="needCertificate" /> -->
          <UserAccountMainBlock
            class="main_info"
            v-if="activeTab === 'account'"
            @change-tab="handleTabChange"
            :violationsCounter="violationsCounter"
            :loading="firstProfileLoading"
          />
          <UserInfoBlock v-if="activeTab === 'personal'" :profile="profile" />
          <AuthDataBlock v-if="activeTab === 'safety'" :profile="profile" />
          <!-- <Block v-if="activeTab === 'passportData'">
            <PassportInfoBlock />
          </Block> -->
          <DocumentsBlock v-if="activeTab === 'documents'" />
          <RatingBlock v-if="activeTab === 'rating'" />
          <AchievementsBlock v-if="activeTab === 'achievements'" />
          <Block v-if="activeTab === 'payment'">
            <PaymentBlock />
          </Block>
          <ViolationsBlock
            v-if="activeTab === 'violations'"
            @change-tab="handleTabChange"
            :violationsCounter="violationsCounter"
          />
          <!-- <Block>
          <AddressBlock :addresses="profile.addresses" />
        </Block> -->
          <ReferralsInfoBlock v-if="activeTab === 'bringYourFriend'" />
          <Block v-if="activeTab === 'signature'" ref="certificateBlock" :heartbeatOn="certificateHeartbeatOn">
            <ElectronicSignatureBlock />
          </Block>
          <Block v-if="activeTab === 'contracts'">
            <ContractsBlock :profile="profile" @needCertificate="needCertificate" />
          </Block>
        </section>
      </section>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import MenuList from '@/components/molecules/MenuList.vue'
// import PassportInfoBlock from '@/components/page/profile/PassportInfoBlock.vue'
import DocumentsBlock from '@/components/page/profile/documentsBlock/DocumentsBlock.vue'
import ContractsBlock from '@/components/page/profile/contractsBlock/ContractsBlock.vue'
import PaymentBlock from '@/components/page/profile/paymentBlock/PaymentBlock.vue'
import UserInfoBlock from '@/components/page/profile/userInfoBlock/UserInfoBlock.vue'
import UserAccountMainBlock from '@/components/page/profile/mainBlock/UserAccountMainBlock.vue'
import ViolationsBlock from '@/components/page/profile/violationsBlock/ViolationsBlock.vue'
import RatingBlock from '@/components/page/profile/ratingBlock/RatingBlock.vue'
import AchievementsBlock from '@/components/page/profile/achievementsBlock/AchievementsBlock.vue'
import ReferralsInfoBlock from '@/components/page/profile/referralsInfoBlock/ReferralsInfoBlock.vue'
//import AddressBlock from '@/components/page/profile/AddressBlock.vue'
import AttentionBlock from '@/components/page/profile/AttentionBlock.vue'
// import InvitedUsersBlock from '@/components/page/profile/InvitedUsersBlock.vue'
import Block from '@/components/page/profile/Block.vue'
import ElectronicSignatureBlock from '@/components/page/profile/electronicSignatureBlock/ElectronicSignatureBlock.vue'
import AuthDataBlock from '@/components/page/profile/safetyBlock/AuthDataBlock.vue'
import { scrollWithAnimation } from '@/constants/scroll'
import { profileTabs } from '@/constants/other'
import useGlobalLoading from '@/composables/useGlobalLoading'

export default {
  name: 'Profile',
  components: {
    MenuList,
    AuthDataBlock,
    ElectronicSignatureBlock,
    Block,
    // ProfileTopBanners,
    RatingBlock,
    //AddressBlock,
    // AttentionBlock,
    // InvitedUsersBlock,
    UserAccountMainBlock,
    UserInfoBlock,
    ReferralsInfoBlock,
    PaymentBlock,
    // PassportInfoBlock,
    DocumentsBlock,
    ContractsBlock,
    AchievementsBlock,
    ViolationsBlock,
  },
  setup () {
    const { startLoading, stopLoading, loading } = useGlobalLoading()
    return { startLoading, stopLoading, loading }
  },
  data () {
    return {
      activeTab: 'account',
      certificate: null,
      docStatus: null,
      certificateHeartbeatOn: false,
      isMobile: false,
      visibility: false,
      firstProfileLoading: false,
      observer: null,
      violationsCounter: null,
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    ...mapGetters('profilePage', ['profile', 'agreements']),

    isMainTab () {
      return this.activeTab === 'account'
    },
    isShowAttention () {
      return ['RU', 'BY'].includes(this.user?.citizenship)
    },

    isPassportExist () {
      return this.profile?.documents?.passport === 'confirmed'
    },

    tabs () {
      const tabs = JSON.parse(JSON.stringify(profileTabs))
      if (!this.firstProfileLoading) {
        if (!this.user?.settings?.inn) {
          tabs.documents.suggestText = 'Необходимо заполнить'
          tabs.documents.type = 'attention'
        }
        const passportStatus = this.profile?.documents?.passport
        if (!passportStatus || ['need_upload', 'not_upload'].includes(passportStatus) || !this.user?.settings?.inn) {
          tabs.documents.suggestText = 'Необходимо заполнить'
          tabs.documents.type = 'attention'
        }
        if (['decline', 'declined'].includes(passportStatus)) {
          tabs.documents.suggestText = 'Документы отклонены'
          tabs.documents.type = 'attention'
        }
        if (this.agreements?.some((item) => item.status === 'ready_to_sign' || item.status === 'created')) {
          tabs.contracts.suggestText = 'Необходимо подписать'
          tabs.contracts.type = 'attention'
        }
      }
      return Object.values(tabs)
    },
  },
  watch: {
    activeTab (tab) {
      this.$router.push({ query: { tab } })
    },
    '$route.query.tab': {
      handler (val) {
        this.activeTab = val || 'account'
        if (this.activeTab === 'account') this.$nextTick(this.scrollUp)
        if (this.activeTab !== 'account') this.$nextTick(this.goToBackButton)
      },
      immediate: true,
    },
  },
  async mounted () {
    this.initObserver()
    this.firstProfileLoading = true
    await this.loadData()
    await this.loadViolationsCounter()
    if (this.isPassportExist) this.fetchAgreementsOnce()
    this.firstProfileLoading = false
  },
  beforeUnmount () {
    this.observer?.unobserve(this.$refs.menu)
  },
  unmounted () {},
  methods: {
    ...mapActions('notifications', ['showNotification']),
    ...mapActions('profilePage', ['fetchProfile', 'fetchAgreementsOnce']),
    ...mapMutations('profilePage', ['setContractStatus']),
    async loadViolationsCounter () {
      this.startLoading()
      try {
        const response = await this.$axios.get('v2/user/violations/count')
        if (response.data.success) this.violationsCounter = response.data.data
      } finally {
        this.stopLoading()
      }
    },
    initObserver () {
      this.observer = new IntersectionObserver(
        ([entry]) => {
          this.visibility = !entry.isIntersecting
        },
        {
          root: null,
          rootMargin: '85px',
          threshold: 0.2,
        },
      )
      if (this.$refs.menu) this.observer.observe(this.$refs.menu)
    },
    handleTabChange (newTab) {
      this.activeTab = newTab
      this.scrollUp()
    },

    showCertificateHeartbeat () {
      this.certificateHeartbeatOn = true
      setTimeout(() => {
        this.certificateHeartbeatOn = false
      }, 3000)
    },

    needCertificate () {
      this.showNotification({
        timeout: 6000,
        text: 'Необходим действующий сертификат электронной подписи',
      })
      this.$router.push('/ui-new/profile?tab=signature')
    },

    async loadData () {
      this.startLoading()
      await this.fetchProfile()
      this.stopLoading()
    },

    onMenu (tab) {
      if (tab === 'exit') this.logout()
      else this.scrollUp()
    },

    goToBackButton () {
      const el = this.$refs.backButton.$el
      if (el) {
        const elTop = el.getBoundingClientRect().top
        const root = document.getElementById('default_layout')
        const scrollY = root.scrollTop
        scrollWithAnimation({
          root,
          speed: 1000,
          scrollTargetY: scrollY + elTop - 72,
        })
      }
    },

    scrollUp () {
      const root = document.getElementById('default_layout')
      scrollWithAnimation({
        root,
        speed: 1000,
        scrollTargetY: 0,
      })
    },

    logout () {
      store.dispatch('auth/logOut')
      this.$router.push('/client/signin')
    },
  },
}
</script>

<style lang="scss" scoped>
.info_block_mobile {
  display: none;
  visibility: hidden;
}

.profile_page {
  background-color: #f5f5f5;
  min-height: 100%;
  padding-bottom: 48px;
}

.main_header {
  padding-top: 32px;
  padding-bottom: 32px;
}

.back_button {
  display: none;
  opacity: 0;
  transition: all 300ms ease-in-out;
  &.visibility {
    opacity: 1;
  }
}

.profile_page_container {
  display: flex;
  gap: 24px;
  flex-direction: initial;
}

.left_part {
  max-width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 330px;
  flex: 0 0 330px;
}

.right_part {
  flex: 1 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow: hidden;
}

@media (max-width: 1000px) {
  .main_info {
    display: none;
    visibility: hidden;
  }
  .info_block_mobile {
    display: flex;
    flex-direction: column;
    gap: 16px;
    visibility: visible;
  }
  .desktop_attention {
    display: none;
  }
  .main_header {
    display: none;
  }
  .profile_page {
    padding-top: 24px;
    padding-bottom: 100px;
  }
  .back_button {
    display: flex;
  }
  .profile_page_container {
    flex-direction: column;
    gap: 16px;
  }
  .right_part {
    min-height: calc(100dvh - 205px);
    &.isMainTab {
      display: none;
      min-height: unset;
    }
  }
  .left_part {
    max-width: 100%;
  }
}
</style>
