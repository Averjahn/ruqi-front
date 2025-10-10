<template>
  <div class="violations_banners">
    <ViolationBannerItem @click="changeTab('by_rank')" :isViolation="true" :loading="loading" :content="violations" />
    <ViolationBannerItem @click="changeTab('not_worked')" :loading="loading" :content="violations" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getDisplayedNumber } from '@/constants/helpers'
import useTelegramConnect from '@/composables/useTelegramConnect'
import ViolationBannerItem from '@/components/atoms/ViolationBannerItem.vue'
import InviteFriendPopup from '@/components/organisms/popups/InviteFriendPopup.vue'
import GetBonusPopup from '@/components/organisms/popups/GetBonusPopup.vue'

const mockData = {
  by_rank: 3,
  not_worked: 3,
  worked: 1,
  reduced_rate_period_start_date: '2025-05-07',
  total: 3,
}

export default {
  name: 'ProfileTopBanners',
  components: {
    ViolationBannerItem,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    violations: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      showInviteFriendPopup: false,
      content: {},
      isWithdrawOpen: false,
      withdrawLoading: false,
      mockData,
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    ...mapGetters('profilePage', ['profile']),
  },
  beforeMount () {},
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    getDisplayedNumber,
    ...mapActions('profilePage', ['fetchProfileOnce']),

    changeTab (tabName) {
      this.$emit('change-tab', tabName)
    },
  },
}
</script>

<style lang="scss" scoped>
.violations_banners {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  @media (max-width: 1000px) {
    grid-template-columns: repeat(1, 1fr);
    gap: 8px;
  }
}
</style>
