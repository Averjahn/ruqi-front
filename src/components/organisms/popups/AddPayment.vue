<template>
  <div class="payment_method_popup">
    <div class="header">
      <h4>Способ оплаты</h4>
      <img class="popup_cross" @click="$emit('close')" src="@/assets/icon_deprecated/cross_s.svg" />
    </div>

    <div class="payment_block_wrap scrollbar mb_16">
      <Form ref="form">
        <Tabs :tabs="tabs" :value="currentTab" class="mb_16" @change="changeTab" type="contained" wide />
        <!-- <template v-if="currentTab === 'bank_account'">
          <Info blue class="mb_16">
            <div class="description">
              <div class="description_header">Где взять платёжные реквизиты?</div>
              <div class="description_text">
                Мы подготовили краткие инструкции как найти платёжные реквизиты в личных кабинетах популярных банков
              </div>
              <ul>
                <li><img src="@/assets/icon_deprecated/link.svg" /> Сбербанк инструкция</li>
                <li><img src="@/assets/icon_deprecated/link.svg" /> Тинькофф инструкция</li>
                <li><img src="@/assets/icon_deprecated/link.svg" /> Альфа-банк инструкция</li>
              </ul>
            </div>
          </Info>

          <div class="sign_label required_label">БИК</div>
          <Input
            v-model="bank_account.bik"
            class="form_input mb_16"
            :rules="[rules.required, validateBik]"
            @input="onBik($event, 'bank_account')"
          />
          <div class="sign_label required_label">Номер счета</div>
          <Input
            v-model="bank_account.payment_account"
            class="form_input mb_16"
            :rules="[rules.required, (v) => validatePaymentAccount(v, bank_account.bik)]"
            @input="onPaymentAccount"
          />
          <div class="sign_label required_label">Название банка</div>
          <Input v-model="bank_account.bank_name" class="form_input mb_16" :rules="[rules.required]" />
          <div class="sign_label required_label">ФИО получателя</div>
          <Input v-model="bank_account.recipient_name" class="form_input mb_16" :rules="[rules.required]" />
          <label class="main_switcher">
            <Switch v-model="bank_account.main" />
            Сделать этот способ оплаты основным
          </label>
        </template>
        -->

        <template v-if="currentTab === 'bank_card'">
          <div class="sign_label required_label">Номер карты</div>
          <Input
            :value="bank_card.bank_card_number"
            class="form_input mb_16"
            :rules="[rules.required, rules.bankCard]"
            @input="onBankCardNumber"
          />
          <label class="main_switcher">
            <Switch v-model="bank_card.main" />
            Сделать этот способ оплаты основным
          </label>
        </template>

        <template v-if="currentTab === 'sbp'">
<!--           <Info blue class="mb_16">
            <div class="description">
              <div class="description_header">
                Перед подключением данного способа оплаты убедитесь, что ваш счет подключен к системе быстрых платежей
              </div>
              <div class="description_text">
                Инструкции по подключению к системе быстрых платежей популярных банков-партнеров
              </div>
              <ul>
                <li><img src="@/assets/icon_deprecated/link.svg" /> Сбербанк инструкция</li>
                <li><img src="@/assets/icon_deprecated/link.svg" /> Тинькофф инструкция</li>
                <li><img src="@/assets/icon_deprecated/link.svg" /> Альфа-банк инструкция</li>
              </ul>
            </div>
          </Info> -->
          <div class="sign_label required_label">Номер телефона к которому привязан счет</div>
          <Input
            :value="sbp.sbp_phone"
            class="form_input mb_16"
            :rules="[rules.required, ...rulesSets.phone]"
            @input="onPhone"
          />
          <div class="sign_label required_label">БИК Банка</div>
          <Input
            :value="sbp.bik"
            class="form_input mb_16"
            :rules="[rules.required, validateBik]"
            @input="onBik($event, 'sbp')"
          />
          <label class="main_switcher">
            <Switch v-model="sbp.main" />
            Сделать этот способ оплаты основным
          </label>
        </template>
      </Form>
    </div>
    <div class="action">
      <Button @click="$emit('close')" type="outlined" class="button"> Отмена </Button>
      <Button :loading="saveLoading" :disabled="savingDisabled" @click="save" class="button"> Сохранить </Button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { rules, rulesSets, validateBik, validatePaymentAccount } from '@/constants/validations'
import { formatNumericString } from '@/constants/masks'
import { getAPIError, clearPhoneAlwaysSeven } from '@/constants/helpers'
import { formatPhone } from '@/constants/masks'

const initialBankAccount = {
  bank_name: null,
  bik: null,
  main: true,
  payment_account: null,
  payment_type: 'bank_account',
  recipient_name: null,
  status: 'active',
}

const initialBankCard = {
  bank_name: null,
  bik: null,
  main: true,
  payment_account: null,
  payment_type: 'bank_card',
  recipient_name: null,
  status: 'active',
}

const initialSbp = {
  bank_name: null,
  bik: null,
  main: true,
  payment_type: 'sbp',
  status: 'active',
  sbp_phone: null,
}

export default {
  components: {},
  props: {},
  data () {
    return {
      rules,
      rulesSets,

      currentTab: 'bank_card',
      savingDisabled: false,
      saveLoading: false,
      loading: false,
      bank_account: {},
      bank_card: {},
      sbp: {},
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    tabs () {
      const tabs = [
        // { text: 'Расчетный счет', value: 'bank_account' },
        { text: 'Карта', value: 'bank_card' },
      ]
      if (this.user.citizenship === 'RU') tabs.push({ text: 'СБП', value: 'sbp' })
      return tabs
    },
  },
  mounted () {
    this.refreshData()
  },
  methods: {
    ...mapActions('notifications', ['showNotification']),
    ...mapActions('profilePage', ['fetchProfile']),

    validateBik,
    validatePaymentAccount,
    refreshData () {
      this.bank_account = JSON.parse(JSON.stringify(initialBankAccount))
      this.bank_card = JSON.parse(JSON.stringify(initialBankCard))
      this.sbp = JSON.parse(JSON.stringify(initialSbp))
    },
    async save () {
      if (this.$refs.form.validate()) {
        this.saveLoading = true
        const paymentinfos = JSON.parse(JSON.stringify(this[this.currentTab]))
        if (paymentinfos.bank_card_number)
          paymentinfos.bank_card_number = paymentinfos.bank_card_number.replaceAll(' ', '')
        if (paymentinfos.sbp_phone) paymentinfos.sbp_phone = clearPhoneAlwaysSeven(paymentinfos.sbp_phone)
        const response = await this.$axios.post('v2/user/paymentinfos', paymentinfos)
        if (response?.data?.success) {
          this.$emit('paymentMethodCreated')
          this.fetchProfile()
          this.refreshData()
          this.showNotification({
            type: 'success',
            text: 'Новый способ оплаты успешно создан',
          })
          this.$emit('close')
        } else {
          this.showNotification({
            type: 'error',
            text: getAPIError(response) || 'Ошибка при сохранении списка оплат',
          })
        }
        this.saveLoading = false
      }
    },
    onBik (event, storage) {
      const { formattedValue, cursorPosition } = formatNumericString({
        value: event.target.value,
        pattern: '**********',
        cursorPosition: event.target.selectionEnd,
      })
      this[storage].bik = formattedValue ? '' : 'null'
      this.$nextTick(() => {
        this[storage].bik = formattedValue
        this.$nextTick(() => {
          event.target.setSelectionRange(cursorPosition, cursorPosition)
        })
      })
    },
    onPaymentAccount (event) {
      const { formattedValue, cursorPosition } = formatNumericString({
        value: event.target.value,
        pattern: '************************',
        cursorPosition: event.target.selectionEnd,
      })
      this.bank_account.payment_account = formattedValue ? '' : 'null'
      this.$nextTick(() => {
        this.bank_account.payment_account = formattedValue
        this.$nextTick(() => {
          event.target.setSelectionRange(cursorPosition, cursorPosition)
        })
      })
    },
    onBankCardNumber (event) {
      const { formattedValue, cursorPosition } = formatNumericString({
        value: event.target.value,
        pattern: '**** **** **** **** ****',
        cursorPosition: event.target.selectionEnd,
      })
      this.bank_card.bank_card_number = formattedValue ? '' : 'null'
      this.$nextTick(() => {
        this.bank_card.bank_card_number = formattedValue
        this.$nextTick(() => {
          event.target.setSelectionRange(cursorPosition, cursorPosition)
        })
      })
    },
    onPhone (event) {
      const { formattedValue, cursorPosition } = formatPhone({
        value: event.target.value,
        cursorPosition: event.target.selectionEnd,
      })
      this.sbp.sbp_phone = formattedValue ? '' : 'null'
      this.$nextTick(() => {
        this.sbp.sbp_phone = formattedValue
        this.$nextTick(() => {
          event.target.setSelectionRange(cursorPosition, cursorPosition)
        })
      })
    },
    changeTab (value) {
      this.currentTab = value
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

.payment_block_wrap {
  overflow: auto;
  flex: 1;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.sign_label {
  color: #7a91a9;
  margin-bottom: 8px;
}
.required_label::after {
  content: '*';
  display: inline-block;
  color: #eb4d3d;
  margin-left: 2px;
}
.form_input {
  width: 100%;
  margin-bottom: 16px;
}
.popup_cross {
  width: 24px;
  height: 24px;
  cursor: pointer;
}
.main_switcher {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  margin-bottom: 24px;
  cursor: pointer;
}
.button {
  width: 100%;
}
.action {
  display: flex;
  gap: 16px;
  .button {
    height: 40px;
  }
}

.description {
  li {
    display: flex;
    gap: 8px;
    align-items: center;
    color: #0082de;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 8px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.description_header {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}
.description_text {
  font-size: 12px;
  margin-bottom: 8px;
}

@media (max-width: 592px) {
  .payment_method_popup {
    width: calc(100% - 32px);
  }
}

@media (max-width: 550px) {
  .payment_method_popup {
    padding: 16px;
  }
}
</style>
