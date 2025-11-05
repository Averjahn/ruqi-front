<template>
  <div :class="['bonus_block_container', { withBorder }]">
    <Popup v-model:show="isWithdrawOpen">
      <GetBonusPopup @close="isWithdrawOpen = false" @getBonuses="getBonuses" :withdrawLoading="withdrawLoading" />
    </Popup>
    <div class="stat_card stat_card_blue">
      <div class="header">
        <div class="icon"><img src="@/assets/icons/profile/wallet.svg" /></div>
        <div class="text">Баланс</div>
      </div>
      <div class="footer">
        <div class="value">{{ getDisplayedNumber(profile.bonus_amount || 0, 2) }} ₽</div>
        <ButtonText :disabled="!profile.bonus_amount" @click="openWithdrawPopup" color="white"> Вывести </ButtonText>
      </div>
    </div>

    <div class="stat_card">
      <div class="header">
        <div class="icon pink"><img src="@/assets/icons/like_white.svg" /></div>
        <div class="text">Лайки</div>
      </div>
      <div class="footer">
        <div class="value">
          {{ getDisplayedNumber(likesInteger, 2) }}
          <span v-if="!!likesDecimal" class="green_value"> +{{ getDisplayedNumber(likesDecimal, 2) }} </span>
        </div>
      </div>
    </div>

    <div class="stat_card">
      <div class="header">
        <div class="icon green"><img src="@/assets/icons/peoples.svg" /></div>
        <div class="text">Приглашенные друзья</div>
      </div>
      <div class="footer">
        <div class="value">{{ getDisplayedNumber(profile.friends_total || 0) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getDisplayedNumber } from '@/constants/helpers'
import GetBonusPopup from '@/components/organisms/popups/GetBonusPopup.vue'

export default {
  name: 'BonusBlock',
  components: { GetBonusPopup },
  props: {
    withBorder: { type: Boolean, default: false },
  },
  data () {
    return {
      isWithdrawOpen: false,
      withdrawLoading: false,
    }
  },
  computed: {
    ...mapGetters('profilePage', ['profile']),

    likesInteger () {
      return Math.trunc(this.profile?.likes_total || 0)
    },
    likesDecimal () {
      const decimal = this.profile?.likes_total?.toString()?.split('.')?.[1]
      return decimal ? '0.' + decimal : ''
    },
  },
  mounted () {
    this.fetchProfileOnce()
  },
  unmounted () {},
  watch: {},
  methods: {
    getDisplayedNumber,
    ...mapActions('profilePage', ['fetchProfileOnce']),
    ...mapActions('notifications', ['showNotification']),

    openWithdrawPopup () {
      if (!this.profile.bonus_amount) return
      this.isWithdrawOpen = true
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
.withdraw_popup {
  .content {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 12px;
  }
  .title {
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;
    margin-bottom: 8px;
  }
  .text {
    font-size: 14px;
    line-height: 22px;
  }
  .action_block {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
  .ok_button {
    min-width: 80px;
  }
}

.bonus_block_container {
  width: 100%;
  display: flex;
  align-items: stretch;
  gap: 16px;

  &.withBorder {
    .stat_card {
      border: 1px solid #0000001a;
    }
    .stat_card_blue {
      border: none;
    }
  }

  .stat_card {
    flex: 1;
    padding: 24px;
    border-radius: 16px;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 152px;
    overflow: hidden;
    .header {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }
    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      min-width: 32px;
      height: 32px;
      border-radius: 4px;
      background: #ffffff33;
      &.pink {
        background: #f06fad;
      }
      &.green {
        background: #34ab35;
      }
      img {
        width: 24px;
        height: 24px;
      }
    }
    .text {
      overflow-wrap: break-word;
      word-break: break-word;
      white-space: normal;
    }
    .footer {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      row-gap: 0;
      column-gap: 12px;
    }
    .value {
      font-size: 32px;
      font-weight: 700;
      line-height: 40px;
    }
    .green_value {
      font-size: 24px;
      line-height: 24px;
      color: #71d472;
    }
  }
  .stat_card_blue {
    color: white;
    background: linear-gradient(180deg, #061339 1.64%, #004e7f 94.01%);
  }
  @media (max-width: 1000px) {
    gap: 8px;
    .stat_card {
      min-width: 160px;
      min-height: 114px;
      padding: 16px;
      .value {
        font-size: 20px;
        font-weight: 700;
        line-height: 25px;
      }
    }
  }
}
</style>
