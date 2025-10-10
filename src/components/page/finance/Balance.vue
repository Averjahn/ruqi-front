<template>
  <section class="contractor_finance">
    <Popup v-model:show="isWithdrawOpen">
      <GetBonusPopup @close="isWithdrawOpen = false" @getBonuses="getBonuses" :withdrawLoading="withdrawLoading" />
    </Popup>
    <article class="contractor_finance__card">
      <div class="title_block">
        <img class="contractor_finance__icon" src="@/assets/icons/waiting_payment.svg" />

        <div class="contractor_finance__card_title">Ожидается к выплате</div>
      </div>

      <div class="contractor-finance__value_group">
        <div class="contractor_finance__card-value">{{ formatCurrency(balance?.wait_confirm ?? 0) }}</div>
      </div>
      <div class="contractor_finance__card_info">
          {{ infoText(balance?.count_tasks_on_payment) }}
        </div>
    </article>
    <article class="contractor_finance__card">
      <div class="title_block">
        <img class="contractor_finance__icon" src="@/assets/icons/paid_icon.svg" />

        <div class="contractor_finance__card_title">Выплачено</div>
      </div>

      <div class="contractor-finance__value_group">
        <div class="contractor_finance__card-value">{{ formatCurrency(balance?.paid ?? 0) }}</div>
      </div>
      <div class="contractor_finance__card_info">
        {{ infoText(balance?.count_tasks) }}
      </div>
    </article>
    <article class="contractor_finance__card">
      <div class="title_block">
        <img class="contractor_finance__icon" src="@/assets/icons/bonus_paid.svg" />

        <div class="contractor_finance__card_title">Приведи друга</div>
      </div>

      <div class="contractor-finance__value_group">
        <div class="contractor_finance__card-value">{{ formatCurrency(balance?.bonuses?.created_pd_sum ?? 0) }}</div>
        </div>
      <div class="contractor_finance__card_info">
        <div>{{ `Привёл: ${balance?.bonuses?.all_pd_count}` }}</div>
        <div>{{ `Выплачено: ${formatCurrency(balance?.bonuses?.paid_pd_sum ?? 0)}` }}</div>
      </div>
    </article>
    <article class="contractor_finance__card">
      <div class="title_block">
        <img class="contractor_finance__icon" src="@/assets/icons/ruqi_blue_logo.svg" />

        <div class="contractor_finance__card_title">Бонусный баланс</div>
      </div>

      <div class="contractor-finance__value_group">
        <div class="contractor_finance__card-value">{{ formatCurrency(balance?.bonuses?.created_bonuses_sum ?? 0) }}</div>
      </div>
      <div class="contractor_finance__card_info">
        <div>{{ `Выплачено: ${formatCurrency(balance?.bonuses?.paid_bonuses_sum ?? 0)}` }}</div>
        <ButtonText
          :disabled="!Number(this.balance?.bonuses?.created_bonuses_sum)"
          @click="openWithdrawPopup"
          :color="getButtonColor"
        >
          Вывести
        </ButtonText>
        </div>
    </article>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { getDisplayedNumber, declensionOfNumber, getAPIError } from '@/constants/helpers'
import { formatCurrency } from '@/constants/helpers'
import GetBonusPopup from '@/components/organisms/popups/GetBonusPopup.vue'

export default {
  name: 'Balance',
  components: { GetBonusPopup },
  props: {
    balance: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      isLoading: true,
      subscribeLoading: false,
      isWithdrawOpen: false,
      withdrawLoading: false,
      labelTasks: ['Заявка', 'Заявки', 'Заявок'],
      declensionOfNumber,
    }
  },
  computed: {
    getButtonColor () {
      if (Number(this.balance?.bonuses?.created_bonuses_sum)) {
        return 'blue'
      } else {
        return 'grey'
      }
    },
  },
  methods: {
    ...mapActions('notifications', ['showNotification']),
    getDisplayedNumber,
    formatCurrency,
    infoText (count) {
      return `${declensionOfNumber(count ?? 0, this.labelTasks)}:  ${count}`
    },
    openWithdrawPopup () {
      if (!Number(this.balance?.bonuses?.created_bonuses_sum)) return
      this.isWithdrawOpen = true
    },
    async getBonuses () {
      this.withdrawLoading = true
      const response = await this.$axios.post('v2/user/bonus/withdrawal')
      if (response?.data?.success) {
        this.showNotification({
          type: 'success',
          text: 'Заявка на вывод бонусных средств успешно отправлена',
        })
        this.isWithdrawOpen = false
      } else {
        this.showNotification({ type: 'error', text: getAPIError(response) || 'Возникла ошибка при отправке запроса на вывод средств' })
      }
      this.withdrawLoading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.contractor_finance {
  display: flex;
  gap: 24px;
}

.contractor_finance__card {
  display: inline-flex;
  flex-direction: column;
  background: #fff;
  box-sizing: border-box;
  border-radius: 16px;
  padding: 24px;
  padding-bottom: 12px;
  box-shadow: 0 4px 40px rgba(0, 0, 0, 0.08);

  width: 100%;
  gap: 8px;
}

.contractor_finance__icon {
  width: 32px;
  height: 32px;
}

.title_block {
  width: 100%;
  display: flex;
  gap: 16;
  justify-content: space-between;
}

.contractor_finance__card_title {
  width: auto;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  text-align: left;
  vertical-align: middle;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  color: #666666;
}

.contractor-finance__value_group {
  display: flex;
  gap: 12px;
  align-items: center;
  color: #263043;
}

.contractor_finance__card-value {
  font-size: 32px;
  font-weight: 700;
  line-height: 40px;
  text-align: left;
  vertical-align: middle;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
}
.contractor_finance__card_info {
  justify-self: flex-end;
  border-top: 1px solid #b9b9b9;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
  text-align: left;
  vertical-align: middle;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
}
@media screen and (max-width: 999px) {
  .contractor_finance {
    flex-direction: column;
    gap: 16px;
  }
  .contractor_finance__card {
    padding: 20px;
  }
  .contractor_finance__card-value {
    font-size: 24px;
    line-height: 24px;
  }
}
</style>
