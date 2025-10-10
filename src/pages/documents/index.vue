<template>
  <div class="profile_page">
    <div class="basic_container_global">
      <h2 class="main_header">Документы</h2>

      <section class="profile_page_container">
        <section ref="menu" class="left_part">
          <MenuList v-model="activeTab" :options="tabs" @update:modelValue="onMenu" />
        </section>

        <ButtonText
          class="back_button"
          :class="{ visibility }"
          ref="backButton"
          type="s"
          color="grey"
          @click="scrollUp"
        >
          <Icon name="arrowUp" :size="20" />Документы
        </ButtonText>

        <section class="right_part">
          <ForOrganizationsBlock v-if="activeTab === 'organizations'" />
          <PerformersDocsBlock v-if="activeTab === 'performers'" />
        </section>
      </section>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import MenuList from '@/components/molecules/MenuList.vue'
import ForOrganizationsBlock from '@/components/page/documents/organizationsDocs/organizationsDocumentsBlock.vue'
import PerformersDocsBlock from '@/components/page/documents/performersDocs/performersDocumentsBlock.vue'
import { scrollWithAnimation } from '@/constants/scroll'
import { documentsTabs } from '@/constants/other'
import useGlobalLoading from '@/composables/useGlobalLoading'

export default {
  name: 'Documents',
  components: {
    MenuList,
    PerformersDocsBlock,
    ForOrganizationsBlock,
  },
  props: {
    myTemplate: { type: Array, default: () => [] },
    myTemplate1: { type: Object, default: () => ({}) },
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
    tabs () {
      const tabs = JSON.parse(JSON.stringify(documentsTabs))
      return Object.values(tabs)
    },
  },
  watch: {
    activeTab (tab) {
      this.$router.push({ query: { tab } })
    },
    '$route.query.tab': {
      handler (val) {
        this.activeTab = val || 'organizations'
        this.$nextTick(this.goToBackButton)
      },
      immediate: true,
    },
  },
  async mounted () {
    this.initObserver()
  },
  beforeUnmount () {
    this.observer?.unobserve(this.$refs.menu)
  },
  unmounted () {},
  methods: {
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

    onMenu () {
      this.scrollUp()
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
