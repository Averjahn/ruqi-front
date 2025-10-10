<template>
  <div class="user_info">
    <ProfileTopBanners class="hide_mobile" />
    <Block class="main_block">
      <UserAvailable />
    </Block>
    <AccountMainBlockBanners @change-tab="$emit('change-tab', $event)" class="" />
    <ViolationsMainInfo
      @change-tab="$emit('change-tab', 'violations')"
      :violations="violationsCounter"
      :loading="loading"
    />
  </div>
</template>

<script>
import ProfileTopBanners from '@/components/organisms/ProfileTopBanners.vue'
import AccountMainBlockBanners from '@/components/organisms/AccountMainBlockBanners.vue'
import ViolationsMainInfo from '@/components/organisms/ViolationsMainInfo.vue'
import Block from '@/components/page/profile/Block.vue'
import UserAvailable from '@/components/page/profile/mainBlock/UserAvailable.vue'

export default {
  components: {
    UserAvailable,
    Block,
    ProfileTopBanners,
    AccountMainBlockBanners,
    ViolationsMainInfo,
  },
  emits: ['change-tab'],
  props: {
    violationsCounter: {
      type: Object,
      default: () => {},
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  mounted () {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.user_info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  .main_block {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  @media (max-width: 1000px) {
    gap: 8px;
    .main_block {
      gap: 8px;
    }
    .hide_mobile {
      display: none;
      visibility: hidden;
    }
  }
}
</style>
