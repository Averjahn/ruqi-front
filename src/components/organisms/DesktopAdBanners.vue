<template>
  <div class="desktop_ad_banners">
    <Popup v-model:show="showInviteFriendPopup">
      <InviteFriendPopup @close="showInviteFriendPopup = false" />
    </Popup>
    <div @click="showInviteFriendPopup = true" class="add_banners">
      <img class="ruqi_banner" src="@/assets/imgs/ready_getFriend_banner.png" />
    </div>
    <TelegramNotification composition="vertical" />
    <div class="grey_banner">
      <div class="text_body">
        <div class="title">Всегда на связи с новостями и предложениями</div>
        <div class="mb_24">Подпишитесь на наши социальные сети, чтобы первыми узнать важные новости и обновления</div>
        <div class="social_buttons">
          <img src="@/assets/icons/telegram_native.svg" @click="openTgChannel" alt="" class="banner_img" />
          <img src="@/assets/icons/vk.svg" @click="openVkChannel" alt="" class="banner_img" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import useTelegramConnect from '@/composables/useTelegramConnect'
import InviteFriendPopup from '@/components/organisms/popups/InviteFriendPopup.vue'
import TelegramNotification from '@/components/organisms/TelegramNotification.vue'

export default {
  name: 'DesktopAdBanners',
  components: {
    InviteFriendPopup,
    TelegramNotification,
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
.desktop_ad_banners {
  display: flex;
  flex-direction: column;
  gap: 24px;
  .add_banners {
    cursor: pointer;
    width: 100%;
    .ruqi_banner {
      margin: 0 auto;
      display: block;
      width: 100%;
      max-width: 406px;
      height: auto;
    }
  }
  .social_buttons {
    display: flex;
    height: 32px;
    gap: 12px;
  }
  .grey_banner {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 24px;
    border-radius: 16px;
    border: 1px solid #0000000a;
    background: #f6f8fb;
    .title {
      font-weight: 600;
      font-size: 18px;
      line-height: 22px;
      margin-bottom: 8px;
    }
  }
}
</style>
