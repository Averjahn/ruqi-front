<template>
  <div class="contracts_item" ref="container" @click="openContract">
    <div class="content">
      <div class="left_part">
        <div class="desktop_name">
          <div class="contract_name">{{ item.client_company }}</div>
          <div v-if="isSigned && item?.expires_at" class="contract_status">
            Срок действия:
            {{ $dayjs(item.expires_at).format('DD.MM.YYYY') }}
          </div>
          <div v-else class="contract_status" :style="{ color: statusColor }">{{ statusText }}</div>
        </div>
        <div class="dates">
          <div class="data">
            <div class="label">Тип документа</div>
            {{ getDocumentType }}
          </div>
          <div class="data">
            <div class="label">Создан</div>
            {{ $dayjs(item.created_at).format('DD.MM.YYYY') }}
          </div>
          <div v-if="item.signed_at" class="data">
            <div class="label">Подписан</div>
            <span>{{ $dayjs(item.signed_at).format('DD.MM.YYYY') }}</span>
          </div>
        </div>
      </div>
      <div class="right_part">
        <Button
          class="sign_button_desktop"
          v-if="!isSigned"
          :loading="item.status === 'pending'"
          @click.stop="signContract"
          size="s"
        >
          {{ signButtonText }}
        </Button>
        <ButtonIconDeprecated type="outlined" :loading="loadingPDF" @click.stop="onDownload">
          <img src="@/assets/icons/document_arrow.svg" />
        </ButtonIconDeprecated>
      </div>
    </div>
    <Button
      class="sign_button_mobile"
      v-if="!isSigned"
      :loading="item.status === 'pending'"
      @click.stop="signContract"
      size="s"
    >
      {{ signButtonText }}
    </Button>
  </div>
</template>

<script>
import { CONTRACT_STATUSES } from '@/constants/statuses'
import { mapActions, mapMutations } from 'vuex'
import { getAPIError, repeatWithInterval, downloadFile } from '@/constants/helpers'

export default {
  name: 'ContractsItem',
  components: {},
  emits: ['needCertificate', 'openContract', 'signContract'],
  props: {
    certificate: {
      type: Object,
      default: () => {},
    },
    item: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      loading: false,
      loadingPDF: false,
      timerId: null,
    }
  },
  computed: {
    signButtonText () {
      return ['pulling_exceed', 'pending'].includes(this.item?.status) ? 'Обновить' : 'Подписать'
    },
    statusColor () {
      return CONTRACT_STATUSES[this.item?.status]?.color || '#7a91a9'
    },
    statusText () {
      return CONTRACT_STATUSES[this.item?.status]?.displayed || 'Неизвестный статус'
    },
    isSigned () {
      return this.item?.status === 'all_signed' || this.item?.status === 'contractor_signed'
    },
    getDocumentType () {
      switch (this.item?.general_type) {
        case 'personal_data':
          return 'Согласие на обработку персональных данных'
        case 'user_agreement':
          return 'Пользовательское соглашение'
        case 'platform':
          return 'Договор с платформой'
        case 'task':
          return 'Договор по заявке'

        default:
          return 'Договор'
      }
    },
  },
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    ...mapActions('notifications', ['showNotification']),
    ...mapMutations('profilePage', ['setContractStatus']),

    openContract () {
      this.$emit('openContract', this.item)
    },

    signContract () {
      if (this.certificate?.status !== 'active') {
        this.$emit('needCertificate')
      } else if (['pending', 'pulling_exceed'].includes(this.item.status)) {
        this.setContractStatus({ id: this.item.id, status: 'pending' })
      } else {
        this.$emit('signContract', this.item.id)
      }
    },

    async onDownload () {
      this.loadingPDF = true
      this.fetchPDF()
      this.timerId = repeatWithInterval(this.fetchPDF, this.finishPulling, 1, 3000)
    },

    async fetchPDF () {
      this.loadingPDF = true
      const response = await this.$axios.get('v3/user/agreement/getlink/?id=' + this.item.id)
      if (response?.data?.success) {
        if (response.data.data.url) {
          this.finishPulling(true)
          downloadFile(response.data.data.url)
        }
      } else {
        this.finishPulling()
        this.showNotification({
          type: 'error',
          text: getAPIError(response) || 'Ошибка при получении pdf файла',
        })
      }
    },

    finishPulling (isSuccess) {
      this.loadingPDF = false
      clearInterval(this.timerId)
      if (!isSuccess) {
        this.showNotification({
          type: 'info',
          text: 'PDF в данный момент формируется, попробуйте обновить статус через несколько минут',
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.contracts_item {
  cursor: pointer;
  border-radius: 16px;
  border: 1px solid #0000001a;
  background: #fff;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  .content {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 32px;
  }
  .sign_button_mobile {
    display: none;
  }
  .right_part {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .contract_name {
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
    word-break: break-all;
    margin-bottom: 4px;
  }
  .contract_status {
    font-size: 14px;
    color: #666666;
    &.green {
      color: #71d472;
    }
  }
  .desktop_name {
    margin-bottom: 16px;
  }
  .dates {
    display: flex;
    align-items: center;
    gap: 32px;
  }
  .label {
    color: #666666;
    margin-bottom: 4px;
  }
  @media (max-width: 1000px) {
    padding: 16px;
    .dates {
      align-items: flex-start;
      flex-direction: column;
      gap: 12px;
    }
    .contract_name {
      font-size: 16px;
      line-height: 20px;
    }
    .sign_button_desktop {
      display: none;
    }
    .sign_button_mobile {
      display: flex;
    }
  }
}
</style>
