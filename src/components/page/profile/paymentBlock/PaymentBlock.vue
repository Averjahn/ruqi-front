<template>
  <Popup v-model:show="isPaymentPopupOpen">
    <ChangePaymentMethod
      withoutLoadData
      @close="isPaymentPopupOpen = false"
      @addPayment="isAddPaymentPopupOpen = true"
    />
  </Popup>
  <Popup v-model:show="isAddPaymentPopupOpen">
    <AddPayment
      @close="isAddPaymentPopupOpen = false"
      @addPayment="isAddPaymentPopupOpen = false"
      @paymentMethodCreated="paymentMethodCreated"
    />
  </Popup>

  <div class="profile_payment_block">
    <BlockHeader class="mb_12" @edit="isAddPaymentPopupOpen = true" isEmpty>Способ оплаты</BlockHeader>

    <div class="description">Счета или карты для получения оплат за выполненные работы</div>

    <div v-if="payments?.length" class="payment_block_wrap scrollbar">
      <PaymentItem
        v-for="item in payments"
        :key="item.id"
        :item="item"
        :disabled="loading"
        @deletePayment="deletePayment"
        @doMain="doMain"
      />
    </div>

    <div v-if="!payments?.length && !loading">
      <div class="mb_16">Способы оплаты не указаны</div>
      <Button type="outlined" @click="isAddPaymentPopupOpen = true" class="add_button">
        <img src="@/assets/icon_deprecated/plus.svg" />
        Добавить карту или счет
      </Button>
    </div>
    <!--<ThinLineLoading :show="loading" />-->
  </div>
</template>

<script>
import ChangePaymentMethod from '@/components/organisms/popups/ChangePaymentMethod.vue'
import AddPayment from '@/components/organisms/popups/AddPayment.vue'
import { mapActions, mapGetters } from 'vuex'
import PaymentItem from '@/components/organisms/PaymentItem.vue'
import BlockHeader from '@/components/page/profile/BlockHeader.vue'
import useGlobalLoading from '@/composables/useGlobalLoading'

export default {
  components: { ChangePaymentMethod, AddPayment, PaymentItem, BlockHeader },
  props: {},
  setup () {
    const { startLoading, stopLoading, loading } = useGlobalLoading()
    return { startLoading, stopLoading, loading }
  },
  data () {
    return {
      isPaymentPopupOpen: false,
      isAddPaymentPopupOpen: false,
    }
  },
  computed: {
    ...mapGetters('payments', ['payments']),
  },
  mounted () {
    this.loadPayments()
  },
  methods: {
    ...mapActions('payments', ['fetchPayments', 'updatePayments']),
    ...mapActions('profilePage', ['fetchProfile']),
    async loadPayments () {
      this.startLoading()
      this.fetchPayments()
      this.stopLoading()
    },

    paymentMethodCreated () {
      this.isAddPaymentPopupOpen = false
      this.loadPayments()
    },

    deletePayment (item) {
      let paymentsCopy = JSON.parse(JSON.stringify(this.payments))
      paymentsCopy = paymentsCopy.filter((method) => method.id !== item.id)
      this.save(paymentsCopy)
    },

    doMain (item) {
      const paymentsCopy = JSON.parse(JSON.stringify(this.payments))
      paymentsCopy.forEach((method) => (method.main = method.id === item.id))
      this.save(paymentsCopy)
    },

    async save (payments) {
      this.startLoading()
      await this.updatePayments(payments)
      this.fetchProfile()
      this.stopLoading()
    },
  },
}
</script>

<style lang="scss" scoped>
.profile_payment_block {
  .description {
    color: #666666;
    font-size: 14px;
    margin-bottom: 24px;
  }
  .payment_block_wrap {
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;
  }
  .add_button {
    height: 40px;
    text-transform: none;
    font-weight: 400;
    font-size: 16px;
  }
}
</style>
