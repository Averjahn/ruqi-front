<template>
  <div class="contractor_finance_page">
    <Popup v-model:show="isPaymentPopupOpen">
      <ChangePaymentMethod @close="isPaymentPopupOpen = false" @addPayment="addPayment" />
    </Popup>
    <Popup v-model:show="isAddPaymentPopupOpen">
      <AddPayment
        @close="isAddPaymentPopupOpen = false"
        @addPayment="addPayment"
        @paymentMethodCreated="paymentMethodCreated"
      />
    </Popup>
    <Popup v-model:show="isPopupOpen">
      <ElectronicSignaturePopup :window="window" @close="isPopupOpen = false" />
    </Popup>

    <BackButtonHeader
      class="contractor_finance_header"
      to="/finance"
      :title="'Акт выполненных работ ' + (act.id || '')"
    />

    <div class="contractor_finance_body">
      <div class="main_block">
        <div class="main_block_left">
          <h3>Акт на подписание</h3>
          <div class="act_status">
            <div class="status_dot" :style="{ background: getStatusColor(act.status) }"></div>
            {{ getStatusText(act.status) }}
          </div>
          <div class="data_container">
            <div class="data_title">Сформирован:</div>
            <div class="value">{{ $dayjs(act.created_at).format('DD.MM.YYYY') }}</div>
            <div class="data_title">Период работ:</div>
            <div class="value">{{ period_string }}</div>
            <div class="data_title">Адрес задания:</div>
            <div class="value">{{ address }}</div>
          </div>
          <Button
            v-if="!loading && act.is_contractor_signed !== 'signed'"
            :loading="signLoading"
            class="sign_button"
            height="48"
            @click="onSignButtonClick"
          >
            {{ buttonText }}
          </Button>
        </div>
        <div class="main_block_right">
          <div class="act_preview mb_8">
            <img src="@/assets/img_deprecated/act_preview.jpg" />
          </div>
          <ButtonText v-if="!loading" type="s" :loading="pdfLoading" @click="showPdf">Просмотреть pdf</ButtonText>
        </div>
      </div>

      <div class="main_block_mobile">
        <h3>Акт на подписание</h3>
        <div class="act_status">
          <div class="status_dot" :style="{ background: getStatusColor(act.status) }"></div>
          {{ getStatusText(act.status) }}
        </div>
        <div class="preview_wrap">
          <div class="act_preview">
            <img src="@/assets/img_deprecated/act_preview.jpg" />
          </div>
          <div>
            <ButtonText v-if="!loading" type="s" class="mb_24" :loading="pdfLoading" @click="showPdf">
              Просмотреть pdf
            </ButtonText>
          </div>
        </div>
        <Button
          v-if="!loading && act.is_contractor_signed !== 'signed'"
          :loading="signLoading"
          @click="onSignButtonClick"
          class="sign_button_main"
        >
          {{ buttonText }}
        </Button>
        <div class="divider" />
        <div class="data_container">
          <div class="data_title">Сформирован:</div>
          <div class="value">{{ $dayjs(act.created_at).format('DD.MM.YYYY') }}</div>
          <div class="data_title">Период работ:</div>
          <div class="value">{{ period_string }}</div>
          <div class="data_title">Адрес задания:</div>
          <div class="value">{{ address }}</div>
        </div>
      </div>

      <div class="divider" />

      <h3>Данные акта</h3>
      <table class="act_data_table">
        <tr>
          <th class="td_title">Услуги</th>
          <th class="td_unit">Единица</th>
          <th class="td_quantity">Кол-во</th>
          <th class="td_summ">Сумма на руки</th>
          <th class="td_summ">Итого с НПД</th>
        </tr>
        <tr v-for="item in act.act_items" :key="item.id">
          <td>
            {{ `${item.description} (${item?.vacancy_name})` }}
          </td>
          <td>{{ item.unit }}</td>
          <td>{{ getDisplayedNumber(item.quantity, 2) }}</td>
          <td>{{ getDisplayedNumber(item.sum_accrual, 2) }} р.</td>
          <td></td>
        </tr>

        <tr>
          <td class="footer">Итого к выдаче</td>
          <td class="footer" />
          <td class="footer" />
          <td class="footer">{{ getDisplayedNumber(act.sum_accrual, 2) }} ₽</td>
          <td class="footer">{{ getDisplayedNumber(act.sum_to_pay, 2) }} ₽</td>
        </tr>
      </table>

      <div class="act_data_mobile">
        <div v-for="item in act.act_items" :key="item.id" class="item">
          <div class="header">
            {{ item.description }}
          </div>
          <div class="column">
            <div class="act_data_title">Кол-во</div>
            <div class="value">{{ getDisplayedNumber(item.quantity, 2) }} {{ item.unit }}</div>
          </div>
          <div class="column">
            <div class="act_data_title">Сумма на руки</div>
            <div class="value">{{ getDisplayedNumber(item.sum_accrual, 2) }} р.</div>
          </div>
        </div>
        <div class="footer">
          <div class="footer_row">
            <div>Сумма на руки</div>
            <div>{{ getDisplayedNumber(act.sum_accrual, 2) }} ₽</div>
          </div>
          <div class="footer_row">
            <div>Итого с НПД</div>
            <div>{{ getDisplayedNumber(act.sum_to_pay, 2) }} ₽</div>
          </div>
        </div>
      </div>

      <template v-if="!loading && act.is_contractor_signed !== 'signed'">
        <div class="divider" />

        <h3>Куда платить</h3>
        <div class="pay_block">
          <div class="pay_type">
            <div class="payment_info">
              <img :src="paymentDisplayedData.iconBlueRect" />
              <div class="description" v-html="paymentDisplayedData.text"></div>
            </div>
          </div>
          <Button v-if="!loading" type="outlined" height="48px" @click="changePaymentMethod">
            Сменить способ оплаты
            <img src="@/assets/icon_deprecated/setting.svg" />
          </Button>
        </div>

        <div class="divider" />

        <div class="action_block">
          <!--<Button class="dispute_button" type="outlined"> Оспорить </Button>-->
          <Button :loading="signLoading" @click="onSignButtonClick" class="sign_button_main">
            {{ buttonText }}
          </Button>
        </div>
      </template>
    </div>
  </div>
  <div class="thin_line_loading_wrap">
    <ThinLineLoading :show="loading" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { getDisplayedNumber, getAPIError, downloadFile, getPaymentDisplayedData } from '@/constants/helpers'
import { CONTRACTOR_ACT_STATUSES } from '@/constants/statuses.js'
import ChangePaymentMethod from '@/components/organisms/popups/ChangePaymentMethod.vue'
import BackButtonHeader from '@/components/organisms/BackButtonHeader.vue'
import AddPayment from '@/components/organisms/popups/AddPayment.vue'
import ElectronicSignaturePopup from '@/components/organisms/popups/ElectronicSignaturePopup.vue'
export default {
  components: { ChangePaymentMethod, AddPayment, BackButtonHeader, ElectronicSignaturePopup },
  data () {
    return {
      act: {},
      loading: true,
      isPaymentPopupOpen: false,
      isAddPaymentPopupOpen: false,
      pdfLoading: false,
      attemptCounter: 0,
      timerId: 0,
      counter: 0,
      isPopupOpen: false,
      window: '',
    }
  },
  computed: {
    ...mapGetters('payments', ['payments']),
    ...mapGetters('profilePage', ['certificates']),
    certificate () {
      return this.certificates[0]
    },
    paymentDisplayedData () {
      const payment = this.payments.find((item) => item.main)
      return getPaymentDisplayedData(payment)
    },
    signLoading () {
      return this.act.is_contractor_signed === 'pending'
    },
    period_string () {
      return this.act.json?.period_string || ''
    },
    address () {
      return this.act.object?.address || ''
    },
    buttonText () {
      if (this.certificate) {
        const status = this.certificate?.status
        if (status === 'active')
          return this.act.is_contractor_signed === 'attempt_exceed'
            ? 'Обновить'
            : 'Подписать АКТ НА СУММУ ' + getDisplayedNumber(this.act.sum_to_pay) + ' ₽'
        if (status === 'error') return 'Обновить статус ЭЦП'
        if (status === 'pending') return 'Обновить статус ЭЦП'
        if (status === 'archive') return 'Выпустить ЭЦП для подписания акта'
      }
      return 'Выпустить ЭЦП для подписания акта'
    },
  },
  mounted () {
    this.loadCertificates()
    this.fetchAct()
    this.fetchPayments()
  },
  unmounted () {
    clearInterval(this.timerId)
  },
  methods: {
    getDisplayedNumber,
    ...mapActions('notifications', ['showNotification']),
    ...mapActions('payments', ['fetchPayments']),
    ...mapActions('profilePage', ['fetchCertificates']),

    startPending () {
      this.repeatWithInterval(this.fetchSignatureStatus, 3, 3000)
    },

    async loadCertificates () {
      if (this.loading) return
      this.loading = true
      await this.fetchCertificates()
      this.loading = false
    },

    async fetchAct () {
      this.loading = true
      const response = await this.$axios.get('v2/user/act', {
        params: {
          id: this.$route.params.id,
        },
      })
      if (response?.data?.success) {
        this.act = response.data.data
        if (this.act.is_contractor_signed === 'pending') this.startPending()
      } else {
        this.showNotification({
          type: 'error',
          text: getAPIError(response) || 'Не удалось загрузить акт',
        })
      }
      this.loading = false
    },

    async signAct () {
      const response = await this.$axios.get('v2/acts/signactcontractor', { params: { id: this.act.id } })
      if (response?.data?.success) {
        if (response?.data?.data?.status === 'pending') this.startPending()
        if (response?.data?.data?.status === 'signed') this.setSignedStatus()
      } else {
        this.act.is_contractor_signed = 'not_signed'
        this.showNotification({
          type: 'error',
          text: getAPIError(response) || 'Ошибка при подписании документа',
        })
      }
    },

    onSignButtonClick () {
      if (this.signLoading) return
      if (this.certificate) {
        const status = this.certificate?.status
        if (status === 'pending' || status === 'error') {
          this.loadCertificates()
          return
        } else if (status === 'active') {
          if ((this.act.is_contractor_signed = 'attempt_exceed')) {
            this.act.is_contractor_signed = 'pending'
            this.startPending()
            return
          }
          this.act.is_contractor_signed = 'pending'
          this.signAct()
          return
        } else {
          this.isPopupOpen = true
          this.window = 'generate_signature'
          return
        }
      }
      this.isPopupOpen = true
      this.window = 'generate_signature'
    },

    finishPulling (isExceedingAttempt) {
      clearInterval(this.timerId)
      this.timerId = null
      this.counter = 0
      this.signLoading = true
      if (isExceedingAttempt) {
        this.act.is_contractor_signed = 'attempt_exceed'
        this.showNotification({
          type: 'info',
          text: 'Акт в процессе подписания, попробуйте обновить через несколько минут',
        })
      }
    },

    repeatWithInterval (func, count, interval) {
      const self = this
      this.timerId = setInterval(function () {
        self.counter++
        if (self.counter > count) {
          self.finishPulling(true)
        } else {
          func()
        }
      }, interval)
    },

    async fetchSignatureStatus () {
      const response = await this.$axios.get('v2/user/acts/signaturestatus', {
        params: {
          act_ids: [this.act.id],
        },
      })

      if (response?.data?.success) {
        const status = response.data?.data[this.act.id]
        if (status === 'signed') {
          this.setSignedStatus()
          this.finishPulling()
        }
      } else {
        this.finishPulling()
        this.showNotification({
          type: 'error',
          text: getAPIError(response) || 'Не удалось получить статусы актов',
        })
      }
    },

    setSignedStatus () {
      this.act.is_contractor_signed = 'signed'
      this.act.status = 'contractor_signed'
      this.showNotification({ type: 'success', text: 'Акт успешно подписан' })
    },

    async showPdf () {
      this.pdfLoading = true
      const response = await this.$axios.get('v2/acts/getpdflink', {
        params: {
          id: this.$route.params.id,
        },
      })
      if (response?.data?.success) {
        if (response.data.data?.status === 'pending') {
          if (this.attemptCounter > 2) {
            this.attemptCounter = 0
            this.pdfLoading = false
            this.showNotification({
              type: 'info',
              text: 'Акт в данный момент формируется, попробуйте через несколько минут',
            })
          } else {
            this.attemptCounter++
            setTimeout(() => {
              this.showPdf()
            }, 3000)
          }
        } else {
          this.attemptCounter = 0
          downloadFile(response.data.data?.url)
          this.pdfLoading = false
        }
      } else {
        this.attemptCounter = 0
        this.showNotification({
          type: 'error',
          text: getAPIError(response) || 'Ошибка при попытке получить PDF',
        })
        this.pdfLoading = false
      }
    },
    paymentMethodCreated () {
      this.isAddPaymentPopupOpen = false
      this.fetchAct()
      this.fetchPayments()
    },
    changePaymentMethod () {
      this.isPaymentPopupOpen = true
    },
    addPayment () {
      this.isPaymentPopupOpen = false
      this.isAddPaymentPopupOpen = true
    },
    getStatusColor (status) {
      return CONTRACTOR_ACT_STATUSES[status]?.color || '#7a91a9'
    },
    getStatusText (status) {
      return CONTRACTOR_ACT_STATUSES[status]?.displayed || ''
    },
  },
}
</script>

<style lang="scss">
.pay_block .description .attention {
  color: #eb4d3d;
  font-size: 12px;
  position: relative;
  top: -3px;
  padding-left: 6px;
}
</style>

<style lang="scss">
.contractor_finance_page {
  background-color: white;
  min-height: 100%;
  padding-bottom: 64px;
  h2 {
    font-size: 32px;
  }
  h3 {
    font-size: 24px;
    margin-bottom: 24px;
  }
  .divider {
    margin: 32px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  }

  .contractor_finance_header {
    padding: 32px 44px 36px 44px;
  }

  .contractor_finance_body {
    background-color: white;
    margin: 0 36px 0 107px;
    padding: 24px 24px 40px 24px;
    border: 1px solid #dadada;
    border-radius: 20px;
    max-width: 950px;
  }
  .main_block {
    display: flex;
    gap: 24px;
  }
  .main_block_left {
    flex: 1;
  }
  .act_status {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }
  .status_dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  .data_container {
    margin-bottom: 24px;
    .data_title {
      color: #666666;
      margin-bottom: 4px;
    }
    .value {
      margin-bottom: 16px;
      font-weight: 600;
    }
  }
  .main_block_right {
    flex: 1;
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .act_preview {
    padding: 13px;
    background-color: #f3f3f3;
    border-radius: 10px;
    line-height: 0;
    margin-bottom: 8px;
    img {
      width: 183px;
      height: 253px;
    }
  }
  .v_btn_text {
    text-transform: none;
  }
  .act_data_table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    th {
      color: #dadada;
      font-weight: 400;
      text-align: left;
      padding: 0 0 10px 16px;
    }
    td {
      font-size: 14px;
      padding: 6px 0 6px 16px;
      font-weight: 600;
      vertical-align: top;
    }
    tr:nth-last-child(2) td {
      padding-bottom: 20px;
    }
    .footer {
      background-color: #f3faff;
      color: #1735f5;
      font-size: 18px;
      font-weight: 700;
      line-height: 28px;
      padding-top: 10px;
      padding-bottom: 10px;
      &:first-child {
        border-radius: 12px 0 0 12px;
      }
      &:last-child {
        border-radius: 0 12px 12px 0;
      }
    }
  }

  .sign_button {
    display: inline-flex;
    padding: 0 32px;
  }

  .td_unit {
    width: 100px;
  }
  .td_quantity {
    width: 100px;
  }
  .td_summ {
    width: 130px;
  }
  .pay_block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    row-gap: 12px;
    column-gap: 16px;
  }
  .pay_type {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .payment_info {
    display: flex;
    align-items: center;
    gap: 16px;
    font-weight: 600;
  }

  .pay_warning {
    color: #eb4d3d;
    font-size: 12px;
    margin-top: -3px;
  }
  .outlined_btn {
    img {
      width: 24px;
      height: 24px;
      margin-left: 8px;
    }
  }
  .action_block {
    display: flex;
    column-gap: 16px;
    .outlined_btn {
      width: 230px;
    }
    .btn-blue {
      flex: 1;
    }
  }
  .act_data_mobile {
    display: none;
    font-size: 14px;
    .item {
      border-top: 1px solid;
      border-color: rgb(0 0 0 / 4%) !important;
      padding: 16px;
    }
    .header {
      font-weight: 600;
      margin-bottom: 12px;
    }
    .column {
      display: flex;
      justify-content: space-between;
      margin-bottom: 9px;
    }
    .act_data_title {
      color: #666666;
    }
    .value {
      font-weight: 700;
    }
    .footer {
      display: flex;
      flex-direction: column;
      gap: 8px;
      background-color: #f3faff;
      color: #1735f5;
      font-size: 18px;
      font-weight: 700;
      line-height: 28px;
      padding: 10px 16px;
    }
    .footer_row {
      display: flex;
      justify-content: space-between;
    }
  }
  .main_block_mobile {
    display: none;
  }

  .sign_button_main {
    width: 100%;
  }

  @media (max-width: 1024px) {
    .contractor_finance_header {
      padding: 32px 36px 36px 36px;
    }
    .contractor_finance_body {
      margin: 0 36px 0 36px;
    }
  }
  @media (max-width: 900px) {
    .act_data_table {
      display: none;
    }
    .act_data_mobile {
      display: block;
    }
  }
  @media (max-width: 768px) {
    & {
      padding-bottom: 100px;
    }
    .contractor_finance_header {
      padding: 16px 16px 20px 16px;
    }
    .dispute_button {
      width: 100%;
    }
    .contractor_finance_body {
      margin: 0 16px 0 16px;
      padding: 12px;
    }
    h3 {
      font-size: 18px;
      margin-bottom: 16px;
    }
    .data_container {
      font-size: 14px;
      .data_title {
        font-size: 14px;
      }
    }
    .main_block {
      display: none;
    }
    .main_block_mobile {
      display: block;
      h3 {
        margin-bottom: 8px;
      }
      .sign_btn {
        width: 100%;
      }
    }
    .preview_wrap {
      text-align: center;
      margin-bottom: 12px;
    }
    .act_preview {
      display: inline-block;
    }
    .pay_block .outlined_btn {
      width: 100%;
    }
    .action_block {
      flex-wrap: wrap;
      gap: 12px;
      .outlined_btn {
        width: 100%;
      }
      .btn-blue {
        width: 100%;
      }
    }
    .divider {
      margin: 24px 0;
    }
  }
}
</style>
