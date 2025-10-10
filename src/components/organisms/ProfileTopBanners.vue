<template>
  <div class="new_ad_banners">
    <Popup v-model:show="showInviteFriendPopup">
      <InviteFriendPopup @close="showInviteFriendPopup = false" />
    </Popup>
    <TopBannerDesktop
      v-if="showInviteFriends"
      @click="showInviteFriendPopup = true"
      :icon="require('@/assets/icons/get_friend_banner.svg')"
      title="Приведи друга и получи бонус"
    />
    <TopBannerDesktopSocial
      @openTgChannel="openTgChannel"
      @openVkChannel="openVkChannel"
      :iconTg="require('@/assets/icons/telegram_native.svg')"
      :iconVk="require('@/assets/icons/vk.svg')"
      title="Подпишитесь на наши социальные сети"
    />

    <TopBannerDesktopSocial v-if="!user.telegram_id" :loading="telegramLoading" title="Привяжите Telegram-аккаунт">
      <template #rightAction>
        <ButtonText @click.stop="connectTelegram">
          <div class="tg_buttons">
            <img class="icon" src="@/assets/icons/tg_blue.svg" />
            <div>Привязать</div>
          </div>
        </ButtonText>
      </template>
    </TopBannerDesktopSocial>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import useTelegramConnect from '@/composables/useTelegramConnect'
import TopBannerDesktop from '@/components/atoms/TopBannerDesktop.vue'
import TopBannerDesktopSocial from '@/components/atoms/TopBannerDesktopSocial.vue'
import InviteFriendPopup from '@/components/organisms/popups/InviteFriendPopup.vue'

export default {
  name: 'ProfileTopBanners',
  components: {
    TopBannerDesktop,
    InviteFriendPopup,
    TopBannerDesktopSocial,
  },
  props: {
    showInviteFriends: {
      type: Boolean,
      default: false,
    },
  },
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
    openTgChannel () {
      window.open('https://t.me/ruqi_job', '_blank')
    },
    openVkChannel () {
      window.open('https://vk.com/club232685726', '_blank')
    },
  },
}
</script>

<style lang="scss" scoped>
.tg_buttons {
  align-items: center;
  color: #1735f5;
  font-size: 14px;
  display: flex;
  gap: 4px;
  .icon {
    display: block;
  }
}
.new_ad_banners {
  display: flex;
  gap: 16px;

  @media (max-width: 1000px) {
  }
}
</style>
