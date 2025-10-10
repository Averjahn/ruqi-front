<template>
  <div class="payment_item" :class="{ checked: item.main, to_delete: item.toDelete }">
    <div class="payment_info">
      <div class="left_part">
        <img :src="paymentDisplayedData.icon" />
        <div class="title">
          <div class="mobile_title">{{ title }}</div>
          <div v-if="item.referral_user" class="referral_name_mobile">{{ getFio(item.referral_user) }}</div>
          <span class="mobile_account" v-html="paymentDisplayedData.text" />
        </div>
      </div>
      <div class="center_part">
        <div class="description">
          <span class="desktop_account" v-html="paymentDisplayedData.text" />
          <img class="bankIcon" v-if="paymentDisplayedData.iconBank" :src="paymentDisplayedData.iconBank" />
        </div>
        <div v-if="item.referral_user" class="referral_name_desktop">{{ getFio(item.referral_user) }}</div>
      </div>
    </div>
    <div class="payment_actions">
      <ButtonText
        class="main_payment"
        :color="item?.main ? 'green' : 'blue'"
        type="s"
        :disabled="disabled"
        @click="doMain"
      >
        {{ isMainTitle }}
      </ButtonText>
      <template v-if="!notEditable">
        <ButtonIconDeprecated :disabled="disabled" @click="onDelete">
          <Icon name="basket" :size="20" />
        </ButtonIconDeprecated>
      </template>
    </div>
  </div>
</template>

<script>
import { getPaymentDisplayedData, getFio } from '@/constants/helpers'

const TITLES = {
  sbp: 'СБП',
  bank_account: 'Расч. счёт',
  bank_card: 'Карта',
  referral_account: 'Реф. счёт',
}

export default {
  name: 'PaymentItem',
  components: {},
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    notEditable: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {}
  },
  computed: {
    title () {
      if (this.item?.cache_bank_title) return this.item.cache_bank_title
      return TITLES[this.item?.payment_type] || ''
    },
    paymentDisplayedData () {
      return getPaymentDisplayedData(this.item)
    },
    isMainTitle () {
      if (this.notEditable) return this.item?.main ? 'Основной' : ''
      return this.item?.main ? 'Основной' : 'Сделать основным'
    },
  },
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    getFio,
    doMain () {
      if (this.notEditable || this.item?.main || this.disabled) return
      this.$emit('doMain', this.item)
    },
    onDelete () {
      if (this.notEditable || this.disabled) return
      this.$emit('deletePayment', this.item)
    },
  },
}
</script>

<style lang="scss">
.payment_item .description .attention {
  color: #eb4d3d;
  font-size: 12px;
  position: relative;
  top: -3px;
  padding-left: 6px;
}
</style>

<style lang="scss" scoped>
.payment_item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 24px;
  min-height: 80px;
  border-radius: 16px;
  transition: all 0.3s ease-in;
  border: 1px solid #0000001a;
}
.payment_info {
  display: flex;
  align-items: center;
  flex: 1;
  font-weight: 600;
  gap: 8px;
}
.left_part {
  display: flex;
  align-items: center;
  gap: 12px;
}
.title {
  width: auto;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.description {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
.referral_name_desktop {
  font-weight: 400;
  font-size: 14px;
}
.referral_name_mobile {
  display: none;
}
.mobile_account {
  display: none;
  word-break: break-all;
}
.desktop_account {
  word-break: break-all;
}
.bankIcon {
  height: 12px;
  width: auto;
}
.payment_actions {
  width: 175px;
  min-width: 175px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}
.main_payment {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  cursor: pointer;
}

.delete_button_desktop {
  display: block;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .payment_item {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 16px;
  }
  .payment_info {
    width: 100%;
    justify-content: space-between;
  }
  .left_part {
    gap: 8px;
  }
  .payment_actions {
    width: 100%;
    justify-content: space-between;
  }
  .description {
    justify-content: flex-end;
  }
  .mobile_title {
    margin-bottom: 2px;
  }
  .mobile_account {
    display: block;
    color: #666666;
    font-size: 12px;
    font-weight: 400;
    line-height: 15px;
  }
  .desktop_account {
    display: none;
  }
  .title {
    width: auto;
    max-width: none;
    white-space: normal;
  }
  .referral_name_desktop {
    display: none;
  }
  .referral_name_mobile {
    display: block;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
  }
}
</style>
