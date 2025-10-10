<template>
  <div class="mobile_ad_banners">
    <Popup v-model:show="showInviteFriendPopup">
      <InviteFriendPopup @close="showInviteFriendPopup = false" />
    </Popup>
    <TopBannerMobile
      @click="showInviteFriendPopup = true"
      :icon="require('@/assets/icons/get_friend_banner.svg')"
      title="Приведи друга и получи бонус"
    />
    <SocialBannerItem
      :iconTg="require('@/assets/icons/telegram_native.svg')"
      :iconVk="require('@/assets/icons/vk.svg')"
      title="Подпишитесь на наши социальные сети"
      :lightBg="false"
    />
    <SocialBannerItem
      v-if="!user.telegram_id"
      :loading="telegramLoading"
      title="Привяжите Telegram-аккаунт"
      :lightBg="false"
    >
      <template #children>
        <ButtonText @click.stop="connectTelegram">
          <div class="tg_button">
            <img class="icon" src="@/assets/icons/tg_blue.svg" />
            <div>Привязать</div>
          </div>
        </ButtonText>
      </template>
    </SocialBannerItem>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import useTelegramConnect from '@/composables/useTelegramConnect'
import TopBannerMobile from '@/components/atoms/TopBannerMobile.vue'
import InviteFriendPopup from '@/components/organisms/popups/InviteFriendPopup.vue'
import SocialBannerItem from '@/components/atoms/SocialBannerItem.vue'

export default {
  name: 'MobileAdBanners',
  components: {
    TopBannerMobile,
    InviteFriendPopup,
    SocialBannerItem,
  },
  props: {},
  setup () {
    const { telegramLoading, connectTelegram } = useTelegramConnect()
    return {
      telegramLoading,
      connectTelegram,
    }
  },
  data () {
    return {
      showInviteFriendPopup: false,
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
  },
  beforeMount () {},
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    openChannel () {
      window.open('https://t.me/ruqi_job', '_blank')
    },
  },
}
</script>

<style lang="scss" scoped>
.mobile_ad_banners {
  display: flex;
  gap: 8px;
  .tg_button {
    display: flex;
    align-items: center;
    color: #1735f5;
    font-size: 11px;
    gap: 4px;
    .icon {
      width: 16px;
      display: block;
    }
  }

  @media (max-width: 1000px) {
  }
}
</style>
