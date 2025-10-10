<template>
  <div class="act_item_container" @click="openAct($event, item.id)">
    <Popup v-model:show="isPopupOpen">
      <ElectronicSignaturePopup :window="window" @close="isPopupOpen = false" />
    </Popup>
    <div class="act_icon">
      <img :src="getStatusIcon(item)" />
    </div>

    <div class="act_name">
      <div class="long_text">
        {{ item.json.purpose_text }}
      </div>
    </div>

    <div class="act_period">
      {{ item.json.period_string }}
    </div>

    <div class="act_created">
      {{ $dayjs(item.created_at).format('DD.MM.YYYY') }}
    </div>

    <div class="act_mobile_period">
      {{ item.json.period_string }}
    </div>

    <div class="act_signed">
      <div class="long_text">
        {{ isSigned(item) ? 'Подписан' : 'Нужна подпись' }}
      </div>
    </div>

    <div class="act_sum">{{ getDisplayedNumber(item.sum_accrual, 2) }} р.</div>

    <div class="pay_status" :class="{ green_text: item.pay_status === 'paid' }">
      <div class="pay_status_desktop">
        <div class="long_text">
          {{ item.pay_status === 'paid' ? 'Оплачено' : 'Не оплачено' }}
        </div>
      </div>
      <div class="pay_status_mobile">
        <div v-if="item.pay_status === 'paid'" class="green_text">Оплачено</div>
        <div v-else-if="isSigned(item)" class="green_text">
          {{ mobileSignedText(item) }}
        </div>
        <Button
          v-else
          :loading="loading || item.sign_status === 'pending'"
          class="act_signed_button act_signed_button_mobile"
          :type="buttonType"
          @click="onSignButtonClick"
        >
          {{ buttonText }}
        </Button>
      </div>
    </div>
    <div class="act_signed_action">
      <Button
        v-if="!isSigned(item)"
        :loading="loading || item.sign_status === 'pending'"
        class="act_signed_button"
        :type="buttonType"
        @click.prevent="onSignButtonClick"
      >
        {{ buttonText }}
      </Button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { getDisplayedNumber, getAPIError } from '@/constants/helpers'
import createdIcon from '@/assets/icon_deprecated/act-status-created.svg'
import expireIcon from '@/assets/icon_deprecated/act-status-expire.svg'
import signedIcon from '@/assets/icon_deprecated/act-status-signed.svg'
import ElectronicSignaturePopup from '@/components/organisms/popups/ElectronicSignaturePopup.vue'

export default {
  name: 'ActItem',
  components: { ElectronicSignaturePopup },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      loading: false,
      isPopupOpen: false,
      window: '',
    }
  },
  computed: {
    ...mapGetters('profilePage', ['certificates']),
    certificate () {
      return this.certificates[0]
    },
    buttonText () {
      if (this.certificate) {
        const status = this.certificate?.status
        if (status === 'active') return this.item.sign_status === 'attempt_exceed' ? 'Обновить' : 'Подписать'
        if (status === 'error') return 'Обновить статус ЭЦП'
        if (status === 'pending') return 'Обновить статус ЭЦП'
        if (status === 'archive') return 'Выпустить ЭЦП'
      }
      return 'Выпустить ЭЦП'
    },
    buttonType () {
      return this.item.sign_status === 'attempt_exceed' ? 'outlined' : 'contained'
    },
  },
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    getDisplayedNumber,
    ...mapActions('profilePage', ['fetchCertificates']),
    ...mapActions('notifications', ['showNotification']),

    openRequest (id) {
      this.$router.push('/clients/' + id)
    },

    async loadCertificates () {
      if (this.loading) return
      this.loading = true
      await this.fetchCertificates()
      this.loading = false
    },

    isSigned (item) {
      return item?.sign_status === 'all_signed' || item?.sign_status === 'contractor_signed'
    },

    mobileSignedText (item) {
      const date = item.contractor_signed_at ? ': ' + item.contractor_signed_at : ''
      return 'Подписан' + date
    },

    async signAct () {
      this.loading = true
      const response = await this.$axios.get('v2/acts/signactcontractor', { params: { id: this.item.id } })
      if (response?.data?.success) {
        if (response?.data?.data?.status === 'pending') {
          this.$emit('addToPending', this.item.id)
        }
      } else {
        this.showNotification({
          type: 'error',
          text: getAPIError(response) || 'Ошибка при подписании документа',
        })
      }
      this.loading = false
    },

    async onSignButtonClick () {
      if (this.certificate) {
        const status = this.certificate?.status
        if (status === 'pending' || status === 'error') {
          this.loadCertificates()
          return
        } else if (status === 'active') {
          if (this.item.sign_status === 'pending') return
          if (this.item.sign_status === 'attempt_exceed') {
            this.$emit('addToPending', this.item.id)
            return
          }
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

    openAct (e, id) {
      if (e?.target?.closest('.act_signed_button')) return
      this.$router.push('/finance/' + id)
    },

    getStatusIcon (act) {
      if (!act?.status || !act?.sign_status) {
        return createdIcon
      }
      if (act.status === 'created' || act.status === 'ready_to_sign' || act.sign_status === 'manager_signed') {
        return createdIcon
      }
      if (act?.sign_status === 'contractor_signed' || act?.sign_status === 'all_signed') {
        return signedIcon
      }
      return expireIcon
    },
  },
}
</script>

<style lang="scss" scoped>
.act_item_container {
  display: grid;
  column-gap: 16px;
  row-gap: 9px;
  padding: 30px 19px;
  border-radius: 14px;
  border: 1px solid #dadada;
  grid-template-areas: 'I N P C S U T A';
  grid-template-columns: 24px 2fr 180px repeat(4, 1fr) 159px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  color: #666;
  &:hover {
    transform: scale(1.004);
  }

  > div {
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  .act_icon {
    grid-area: I;
  }
  .act_name {
    grid-area: N;
    font-weight: 600;
    color: #263043;
  }
  .act_mobile_period {
    grid-area: M;
    display: none;
  }
  .act_period {
    grid-area: P;
  }
  .act_created {
    grid-area: C;
  }
  .act_signed {
    grid-area: S;
  }
  .act_sum {
    font-weight: 700;
    grid-area: U;
  }
  .pay_status {
    grid-area: T;
  }
  .act_signed_action {
    grid-area: A;
  }
  .long_text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.pay_status_desktop {
  display: block;
}

.pay_status_mobile {
  display: none;
  width: 100%;
}

@media (max-width: 1280px) {
  .act_item_container {
    grid-template-areas:
      'I N S U T A'
      'I M S U T A';
    grid-template-columns: 24px 4fr 2fr 1fr 2fr 159px;
    .act_mobile_period {
      display: flex;
    }
    .act_period {
      display: none;
    }
    .act_created {
      display: none;
    }
  }
}

@media (max-width: 1020px) {
  .act_item_container {
    grid-template-areas:
      'I N S U A'
      'I M S T A';
    grid-template-columns: 24px 4fr 2fr 2fr 159px;
  }
}

@media (max-width: 880px) {
  .act_item_container {
    grid-template-areas:
      'I N N'
      'I M M'
      'I U T';
    grid-template-columns: 24px 1.4fr 2fr;
    padding: 16px;
    .act_signed {
      display: none;
    }
    .act_icon {
      align-items: flex-start;
    }
    .act_sum {
      color: #000;
      font-weight: 700;
    }
    .act_signed_action {
      display: none;
    }
    .pay_status_desktop {
      display: none;
    }
    .pay_status_mobile {
      display: block;
    }
    .act_name .long_text {
      white-space: normal;
      overflow: visible;
    }
  }
}
</style>
