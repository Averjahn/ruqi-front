<template>
  <Popup v-model:show="isPopupOpen">
    <ContractPopup
      :sign="signData"
      :contract="currentContract"
      @close="isPopupOpen = false"
      @needCertificate="needCertificate"
      @signContract="signContract"
    />
  </Popup>
  <div class="contracts_block">
    <BlockHeader class="mb_24" withoutButton>Документы платформы </BlockHeader>

    <div v-if="isPassportExist" class="item_wrap">
      <ContractsItem
        v-for="item in agreements"
        :key="item.id"
        :item="item"
        :certificate="activeCertificate"
        @openContract="openContract"
        @signContract="signContract"
        @needCertificate="needCertificate"
      />
    </div>
    <div v-else-if="!loading && !isPassportExist" class="empty">
      Сначала необходимо заполнить паспортные данные или дождаться подтверждения паспорта.
    </div>
    <ThinLineLoading class="thin_loading" :show="loading" />
  </div>
</template>

<script>
import ContractsItem from '@/components/organisms/ContractsItem.vue'
import ContractPopup from '@/components/organisms/popups/ContractPopup.vue'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { getAPIError } from '@/constants/helpers'
import BlockHeader from '@/components/page/profile/BlockHeader.vue'

export default {
  name: 'DocumentsBlock',
  components: { ContractPopup, BlockHeader, ContractsItem },
  emits: ['needCertificate'],
  props: {
    profile: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      isPopupOpen: false,
      loading: false,
      observer: null,
      currentContract: null,
      timerId: null,
      counter: 0,
    }
  },
  computed: {
    ...mapGetters('profilePage', ['activeCertificate', 'agreements']),
    // agreements () {
    //   return this.profile?.agreements || []
    // },
    signData () {
      return {
        fio: this.activeCertificate?.user_name || '-',
        inn: this.activeCertificate?.user_inn || '-',
        hasCertificate: this.activeCertificate?.status === 'active',
      }
    },
    isPassportExist () {
      return this.profile?.documents?.passport === 'confirmed'
    },
    pendingContracts () {
      return this?.agreements?.filter((item) => item?.status === 'pending')
    },
    pendingContractIds () {
      return this?.pendingContracts?.map((item) => item?.id)
    },
  },
  async mounted () {},
  unmounted () {},
  watch: {
    isPassportExist: {
      async handler (newValue) {
        if (newValue) {
          this.fetchActiveCertificateOnce()
          this.loading = true
          await this.fetchAgreements()
          this.loading = false
        }
      },
      immediate: true,
    },
    pendingContracts: {
      handler (val) {
        if (val.length) {
          if (!this.timerId) this.repeatWithInterval(this.fetchSignatureStatus, 2, 3000)
          this.counter = 0
        } else {
          this.finishPulling()
        }
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations('profilePage', ['setContractStatus']),
    ...mapActions('profilePage', ['fetchAgreements', 'fetchActiveCertificateOnce']),
    ...mapActions('notifications', ['showNotification']),

    openContract (contract) {
      this.isPopupOpen = true
      this.currentContract = contract
    },
    async signContract (id, callback = null) {
      this.setContractStatus({ id, status: 'pending' })
      const response = await this.$axios.get('v3/user/agreement/signcontractor/?id=' + id)
      if (response?.data?.success) {
        if (response.data.data?.url) {
          this.setContractStatus({ id, status: 'contractor_signed' })
          if (callback) callback()
        } else {
          this.setContractStatus({ id, status: response?.data.data?.status })
        }
      } else {
        this.setContractStatus({ id, status: 'ready_to_sign' })
        this.showNotification({
          type: 'error',
          text: getAPIError(response) || 'Ошибка при подписании договора',
        })
      }
    },
    needCertificate () {
      this.isPopupOpen = false
      this.$emit('needCertificate')
    },
    finishPulling () {
      clearInterval(this.timerId)
      this.timerId = null
      this.counter = 0
    },
    pullingExceed () {
      this.showNotification({
        type: 'info',
        text: 'Подписание договора займет чуть больше времени, попробуйте обновить статус через несколько минут',
      })
      this.pendingContracts.forEach((item) => {
        this.setContractStatus({ id: item.id, status: 'pulling_exceed' })
      })
    },
    repeatWithInterval (func, count, interval) {
      const self = this
      this.timerId = setInterval(function () {
        self.counter++
        if (self.counter > count) {
          self.finishPulling()
          self.pullingExceed()
        } else {
          func()
        }
      }, interval)
    },
    async fetchSignatureStatus () {
      const response = await this.$axios.get('v3/user/agreement/signaturestatus', {
        params: {
          agreement_ids: this.pendingContractIds,
        },
      })

      if (response?.data?.success) {
        const statuses = response.data?.data
        this.agreements.forEach((item) => {
          if (statuses[item.id] === 'contractor_signed') {
            this.setContractStatus({ id: item.id, status: statuses[item.id] })
          }
        })
      } else {
        this.finishPulling()
        this.showNotification({
          type: 'error',
          text: getAPIError(response) || 'Не удалось получить статусы договоров',
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.contracts_block {
  .item_wrap {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
}
.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 46px;
  color: #666;
}
</style>
