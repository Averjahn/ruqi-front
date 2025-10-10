<template>
  <section class="contractor_fns_balance">
    <div class="user_info_block">
      <div class="card_title">Данные из приложения «Мой налог»</div>
      <div class="user_fio">{{ getUserFio }}</div>
      <div class="fns_info">
        <div class="smz_status">
          <img class="smz_icon" :src="getSmzIcon" /> <span class="item_title">Самозанятый</span>
        </div>
        <div class="inn">
          <span class="item_title">ИНН: </span> <span class="item_data">{{ getInn }}</span>
        </div>
      </div>
    </div>
    <div class="balance_block">
      <div class="balance_item">
        <span class="item_title">К оплате: </span>
        <span class="item_data">{{ formatCurrency(taxData?.tax_payable ?? 0) }}</span>
      </div>
      <div class="balance_item">
        <span class="item_title">Налоговый бонус: </span>
        <span class="item_data">{{ formatCurrency(taxData?.tax_bonus ?? 0) }}</span>
      </div>
    </div>
  </section>
</template>

<script>
import { formatCurrency, getAPIError, getDisplayedNumber } from '@/constants/helpers'
import { NEW_SMZ_STATUSES } from '@/constants/statuses'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'FnsBalance',
  components: {},
  props: {},
  data () {
    return {
      isLoading: true,
      taxData: null,
    }
  },
  computed: {
    ...mapGetters('profilePage', ['profile']),
    getInn () {
      return this.profile?.user?.settings?.inn || '-'
    },
    getUserFio () {
      return this.profile?.user?.fio || '-'
    },
    getSmzIcon () {
      const url = NEW_SMZ_STATUSES[this.profile?.user?.smz_status]?.icon || 'smz_inactive.svg'
      return require('@/assets/icons/' + url)
    },
  },
  async mounted () {
    await this.fetchProfileOnce()
    this.getFnsTaxes()
  },
  methods: {
    ...mapActions('notifications', ['showNotification']),
    ...mapActions('profilePage', ['fetchProfileOnce']),
    getDisplayedNumber,
    formatCurrency,
    async getFnsTaxes () {
      if (this.profile?.user?.settings?.inn) {
        this.isLoading = true
        const response = await this.$axios.get('v2/user/tax-info')
        if (response?.data?.success) {
          this.taxData = response.data?.data
        } else {
          if ([456250, 456245].includes(response?.data?.error?.code)) {
            this.showNotification({
              type: 'info',
              text: 'Данные по самозанятому находятся в обработке.',
            })
          } else {
            this.showNotification({
              type: 'error',
              text: getAPIError(response) || 'Не удалось загрузить баланс',
            })
          }
        }
        this.isLoading = false
      } else {
        this.showNotification({
              type: 'info',
              text: 'Необходимо заполнить ИНН.',
            })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.contractor_fns_balance {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  border-radius: 16px;
  background: linear-gradient(90deg, #5f8bf6 0%, #2353e8 100%);
  box-shadow: 0px 4px 40px 0px #00000014;
}

.user_info_block {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ffffff1a;
  padding-bottom: 16px;
}
.card_title,
.user_fio {
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  line-height: 125%;
}

.fns_info {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #fff;
}
.smz_icon {
  width: 28px;
}
.smz_status {
  align-items: center;
  display: flex;
  gap: 8px;
}
.inn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 20px;
}
.balance_block {
  display: flex;
  gap: 24px;
  color: #fff;
}
.balance_item {
  display: flex;
  gap: 4px;
}
.item_title {
  line-height: 22px;
  vertical-align: middle;
}
.item_data {
  display: flex;
  align-items: center;
  font-weight: 600;
  line-height: 125%;
  vertical-align: middle;
}

.contractor_fns_balance__card {
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

.contractor_fns_balance__icon {
  width: 32px;
  height: 32px;
}

.title_block {
  width: 100%;
  display: flex;
  gap: 16;
  justify-content: space-between;
}

.user_fio {
  display: none;
  visibility: hidden;
}

@media screen and (max-width: 999px) {
  .contractor_fns_balance {
    flex-direction: column;
    gap: 16px;
  }
  .user_info_block {
    flex-direction: column;
  }
  .card_title {
    display: none;
    visibility: hidden;
  }
  .user_fio {
    display: block;
    visibility: visible;
  }
  .balance_block {
    flex-direction: column;
    gap: 4px;
  }
  .inn,
  .item_title,
  .item_data {
    font-size: 14px;
  }
  .fns_info {
    flex-wrap: wrap;
    gap: 8px;
  }
  .contractor_fns_balance__card {
    padding: 20px;
  }
  .contractor_fns_balance__card-value {
    font-size: 24px;
    line-height: 24px;
  }
}
</style>
