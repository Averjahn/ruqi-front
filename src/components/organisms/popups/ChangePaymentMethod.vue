<template>
  <div class="payment_method_popup">
    <div class="header">
      <h4>Сменить способ оплаты</h4>
      <img class="popup_cross" @click="$emit('close')" src="@/assets/icon_deprecated/cross_s.svg" />
    </div>

    <div v-if="editablePayments.length" class="payment_block_wrap scrollbar">
      <PaymentItem
        v-for="item in editablePayments"
        :key="item.id"
        :item="item"
        @deletePayment="deletePayment"
        @doMain="doMain"
        @recover="recover"
      />
    </div>
    <div class="loading_wrap">
      <ThinLineLoading :show="loading" />
    </div>
    <Button type="outlined" @click="$emit('addPayment')" class="add_button">
      <img src="@/assets/icon_deprecated/plus.svg" />
      Добавить карту или счет
    </Button>
    <div class="action">
      <Button @click="$emit('close')" type="outlined" class="button"> Отмена </Button>
      <Button :loading="saveLoading" :disabled="!hasChanges" @click="save" class="button"> Сохранить </Button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import PaymentItem from '@/components/organisms/PaymentItem.vue'

export default {
  components: { PaymentItem },
  props: {
    withoutLoadData: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      loading: false,
      saveLoading: false,
      checked: false,
      editablePayments: [],
    }
  },
  computed: {
    ...mapGetters('payments', ['payments']),
    hasChanges () {
      return JSON.stringify(this.editablePayments) !== JSON.stringify(this.payments)
    },
    paymentToSave () {
      return this.editablePayments.filter((item) => !item.toDelete)
    },
  },
  watch: {
    payments () {
      this.initData()
    },
  },
  mounted () {
    if (this.withoutLoadData) {
      this.initData()
    } else this.loadPayments()
  },
  methods: {
    ...mapActions('notifications', ['showNotification']),
    ...mapActions('payments', ['fetchPayments', 'updatePayments']),
    initData () {
      this.editablePayments = JSON.parse(JSON.stringify(this.payments))
    },
    async deletePayment (item) {
      this.editablePayments.forEach((method) => {
        if (method.id === item.id) {
          method.toDelete = true
          method.main = false
        }
      })
    },
    recover (item) {
      this.editablePayments.forEach((method) => {
        if (method.id === item.id) delete method.toDelete
      })
    },
    doMain (item) {
      this.editablePayments.forEach((method) => (method.main = method.id === item.id))
    },
    checkMainPayment () {
      if (this.paymentToSave.length === 0) return true
      const main = this.paymentToSave.find((item) => item.main)
      return !!main
    },
    async save () {
      if (this.checkMainPayment()) {
        this.saveLoading = true
        await this.updatePayments(this.paymentToSave)
        this.saveLoading = false
      } else {
        this.showNotification({
          type: 'error',
          text: 'Выберите основной способ оплаты',
        })
      }
    },

    async loadPayments () {
      this.loading = true
      this.fetchPayments()
      this.loading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.payment_method_popup {
  position: absolute;
  width: 100%;
  max-width: 560px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 12px;
  padding: 24px;
  background: white;
  max-height: 95%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}
.popup_cross {
  width: 24px;
  height: 24px;
  cursor: pointer;
}
.button {
  width: 100%;
}
.add_button {
  height: 40px;
  text-transform: none;
  font-weight: 400;
  font-size: 16px;
  margin-bottom: 24px;
}
.action {
  display: flex;
  gap: 16px;
  .button {
    height: 40px;
  }
}

.payment_block_wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: auto;
  flex: 1;
}

.loading_wrap {
  height: 3px;
  margin-bottom: 16px;
}
@media (max-width: 592px) {
  .payment_method_popup {
    width: calc(100% - 32px);
    padding: 16px;
  }
}
</style>
