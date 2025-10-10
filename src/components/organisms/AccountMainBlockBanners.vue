<template>
  <div class="new_ad_banners">
    <Popup v-model:show="showInviteFriendPopup">
      <InviteFriendPopup @close="showInviteFriendPopup = false" />
    </Popup>
    <Popup v-model:show="isWithdrawOpen">
      <GetBonusPopup @close="isWithdrawOpen = false" @getBonuses="getBonuses" :withdrawLoading="withdrawLoading" />
    </Popup>
    <!-- <BannerItem
      v-if="showInviteFriends"
      @click="showInviteFriendPopup = true"
      :icon="require('@/assets/icons/get_friend_banner.svg')"
      title="Приведи друга и получи бонус"
    /> -->
    <!-- <BannerItem @click="openWithdrawPopup" :icon="getSmzIcon" title="Самозанятый" /> -->
    <!-- <BannerItem @click="openWithdrawPopup" :icon="require('@/assets/icons/checkmark_circle.svg')" title="Партнёрство">
      <template #rightAction>
        <ButtonText @click="cancelPartnership" :loading="loading" type="s" class="load_button" color="red">
          Отключить
        </ButtonText>
      </template>
    </BannerItem> -->
    <BannerItem
      @click="openWithdrawPopup"
      :icon="require('@/assets/icons/ruqi_balance.svg')"
      title="Бонусный баланс"
      :loading="withdrawLoading"
      :content="bonusContent"
    />
    <BannerItem
      @click="goToGetFriend"
      :loading="loading"
      :icon="require('@/assets/icons/person_money_violet.svg')"
      title="Приведи друга"
      :content="friendsContent"
    />
    <SocialBannerItem
      class="additional_banners_social"
      :iconTg="require('@/assets/icons/telegram_native.svg')"
      :iconVk="require('@/assets/icons/vk.svg')"
      title="Подпишитесь на наши социальные сети"
    />
    <SocialBannerItem
      class="additional_banners_bot"
      v-if="!user.telegram_id"
      :loading="telegramLoading"
      title="Привяжите Telegram-аккаунт"
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
import { mapGetters, mapActions } from 'vuex'
import { getDisplayedNumber } from '@/constants/helpers'
import { NEW_SMZ_STATUSES } from '@/constants/statuses'
import useTelegramConnect from '@/composables/useTelegramConnect'
import BannerItem from '@/components/atoms/BannerItem.vue'
import SocialBannerItem from '@/components/atoms/SocialBannerItem.vue'
import InviteFriendPopup from '@/components/organisms/popups/InviteFriendPopup.vue'
import GetBonusPopup from '@/components/organisms/popups/GetBonusPopup.vue'
import useGlobalLoading from '@/composables/useGlobalLoading'

const contentData = {
  value: '10 000 ₽',
  action: 'Вывести',
}

export default {
  name: 'AccountMainBlockBanners',
  components: {
    BannerItem,
    InviteFriendPopup,
    GetBonusPopup,
    SocialBannerItem,
  },
  props: {
    showInviteFriends: {
      type: Boolean,
      default: false,
    },
  },
  setup () {
    const { startLoading, stopLoading, loading } = useGlobalLoading()
    const { telegramLoading, connectTelegram } = useTelegramConnect()
    return {
      telegramLoading,
      connectTelegram,
      startLoading,
      stopLoading,
      loading,
    }
  },
  data () {
    return {
      showInviteFriendPopup: false,
      content: contentData,
      isWithdrawOpen: false,
      withdrawLoading: false,
      referrals: null,
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    ...mapGetters('profilePage', ['profile']),

    isProd () {
      return process.env.IS_PROD
    },

    getSmzIcon () {
      const url = NEW_SMZ_STATUSES[this.profile?.user?.smz_status]?.icon || 'smz_inactive.svg'
      return require('@/assets/icons/' + url)
    },
    likesInteger () {
      return Math.trunc(this.profile?.likes_total || 0)
    },
    bonusContent () {
      return {
        value: `${getDisplayedNumber(this.profile.bonus_amount || 0, 2)}  ₽`,
        action: this.profile.bonus_amount ? 'Вывести' : null,
      }
    },
    friendsContent () {
      return {
        value: `${getDisplayedNumber(this.referrals?.bonus ?? 0)}  ₽`,
      }
    },
  },
  beforeMount () {},
  mounted () {
    this.loadReferralsData()
  },
  unmounted () {},
  watch: {},
  methods: {
    getDisplayedNumber,
    ...mapActions('profilePage', ['fetchProfileOnce']),
    ...mapActions('notifications', ['showNotification']),

    async loadReferralsData () {
      this.startLoading()
      const response = await this.$axios.get('v2/user/referrallink')
      if (response.data.success) this.referrals = response.data.data
      this.stopLoading()
    },

    goToGetFriend () {
      this.$emit('change-tab', 'bringYourFriend')
    },

    openWithdrawPopup () {
      if (!this.profile.bonus_amount) return
      this.isWithdrawOpen = true
    },
    cancelPartnership () {
      console.info('Партнёрство будет отключено.')
    },
    async getBonuses () {
      this.withdrawLoading = true
      const response = await this.$axios.post('v2/user/bonus/withdrawal', {
        errorMessage: 'Возникла ошибка при отправке запроса на вывод средств',
      })
      if (response?.data?.success) {
        this.showNotification({
          type: 'success',
          text: 'Заявка на вывод бонусных средств успешно отправлена',
        })
        this.isWithdrawOpen = false
      }
      this.withdrawLoading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.new_ad_banners {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  & > * {
    &:last-child:nth-child(odd) {
      grid-column: span 2;
    }
  }

  .additional_banners_social, .additional_banners_bot {
    display: none;
    visibility: hidden;
  }
  .tg_button {
      align-items: center;
      color: #1735f5;
      font-size: 14px;
      display: flex;
      gap: 4px;
      .icon {
        display: block;
      }
    }

  @media (max-width: 1000px) {
    gap: 8px;
    .additional_banners_social, .additional_banners_bot {
      display: flex;
      visibility: visible;
    }
  }
}
</style>
