<template>
  <div class="contract_popup">
    <div class="header">
      <div>
        <div class="header2 mb_16">
          {{ getDocumentType }}
        </div>
        {{ agreement.client_company }}
      </div>

      <div class="close" @click="$emit('close')">
        <img src="@/assets/icon_deprecated/cross.svg" />
      </div>
    </div>

    <div class="preview_area scrollbar mb_24">
      <iframe
        ref="pdfIframe"
        v-if="pdfUrl"
        :key="pdfUrl"
        :src="pdfUrl"
        width="100%"
        height="100%"
      ></iframe>
      <Button class="reset_pdf_button" size="xs" @click="fetchContract" v-if="!loading && !loadingPDF && pdfPending">
        Обновить
      </Button>
      <ThinLineLoading class="thin_loading" :show="loading || loadingPDF" />
      <ButtonIconDeprecated
        class="download_button"
        v-if="pdfSrc"
        type="outlined"
        :loading="loadingPDF"
        @click.stop="onDownload"
      >
        <img src="@/assets/icons/document_arrow.svg" />
      </ButtonIconDeprecated>
    </div>
    <div v-if="!isContractSigned" class="footer">
      <div class="header2 mb_16">Подписать документ электронной подписью</div>

      <div class="sign_block">
        <div class="sign_fio">{{ sign.fio }}</div>
        <div class="sign_inn">ИНН: {{ sign.inn }}</div>
      </div>

      <div class="action_block">
        <Button type="outlined" :disabled="loading || loadingSign" @click="$emit('close')">Отмена</Button>
        <Button :disabled="loading || loadingPDF || pdfPending" :loading="loadingSign" @click="onSign">{{
          signButtonText
        }}</Button>
      </div>
    </div>
    <div v-else class="footer">
      <div class="agreement_is_signed">Документ подписан</div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { getAPIError, repeatWithInterval, downloadFile } from '@/constants/helpers'

export default {
  name: 'ContractPopup',
  components: {},
  emits: ['needCertificate', 'signContract'],
  props: {
    sign: {
      type: Object,
      default: () => {},
    },
    contract: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      list: null,
      agreement: {},
      loading: false,
      loadingPDF: false,
      timerId: false,
      pdfSrc: null,
    }
  },
  computed: {
    pdfPending () {
      return this.agreement?.pdf_status === 'pending'
    },
    isContractSigned () {
      return ['all_signed', 'contractor_signed'].includes(this.contract?.status)
    },
    loadingSign () {
      return this.contract?.status === 'pending'
    },
    signButtonText () {
      return ['pulling_exceed', 'pending'].includes(this.contract?.status) ? 'Обновить' : 'Подписать'
    },
    pdfUrl () {
      if (this.pdfSrc) {
        const encodedUrl = encodeURIComponent(this.pdfSrc)
        return `https://docs.google.com/gview?url=${encodedUrl}&embedded=true&t=${Date.now()}`
      } else return null
    },
    getDocumentType () {
      switch (this.contract?.general_type) {
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
  mounted () {
    this.fetchContract()
  },
  unmounted () {},
  watch: {},
  methods: {
    ...mapMutations('profilePage', ['setContractStatus']),
    ...mapActions('notifications', ['showNotification']),

    async fetchContract () {
      if (this.loading) return
      this.loading = true
      const response = await this.$axios.get('v3/user/agreement/?id=' + this.contract?.id)
      if (response?.data?.success) {
        this.agreement = response.data.data
        if (
          this.agreement?.pdf_status === 'pending' ||
          (this.agreement?.pdf_status === 'ready')
        ) {
          this.loadingPDF = true
          this.timerId = repeatWithInterval(this.fetchPDF, this.finishPulling, 1, 3000)
        }
      } else {
        this.showNotification({
          type: 'error',
          text: getAPIError(response) || 'Ошибка при получении договора',
        })
      }
      this.loading = false
    },

    onDownload () {
      downloadFile(this.pdfSrc)
    },

    async fetchPDF () {
      this.loadingPDF = true
      const response = await this.$axios.get('v3/user/agreement/getlink/?id=' + this.contract?.id)
      if (response?.data?.success) {
        if (response.data.data.url) {
          this.finishPulling(true)
          this.pdfSrc = response.data.data.url
          this.agreement.pdf_status = 'ready'
          // this.$nextTick(() => {
          //   if (this.$refs.pdfIframe) {
          //     this.$refs.pdfIframe.src = this.pdfUrl
          //   }
          // })
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

    async onSign () {
      if (!this.sign.hasCertificate) {
        this.$emit('needCertificate')
        return
      }

      if (['pulling_exceed', 'pending'].includes(this.contract?.status)) {
        this.setContractStatus({ id: this.contract.id, status: 'pending' })
        return
      }
      this.$emit('signContract', this.contract?.id, () => {
        this.$nextTick(() => this.fetchPDF())
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.contract_popup {
  position: absolute;
  width: 100%;
  max-width: 800px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 12px;
  padding: 24px;
  background: white;
  height: 95%;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 24px;
  }
  .content_container {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .preview_area {
    position: relative;
    flex: 1;
    overflow-y: auto;
    border-radius: 8px;
    border: 1px solid #dadada;
    line-height: 0;
  }
  .document {
    height: 1000px;
    padding-top: 400px;
    text-align: center;
  }
  .header2 {
    display: flex;
    justify-content: space-between;
    font-weight: 600;
  }
  .action_block {
    display: flex;
    gap: 16px;
    & > div {
      flex: 1;
    }
  }
  .sign_block {
    border-radius: 14px;
    border: 1px solid #dadada;
    padding: 16px;
    margin-bottom: 24px;
  }
  .sign_fio {
    font-weight: 700;
    margin-bottom: 8px;
  }
  .sign_inn {
    color: #666;
    font-size: 14px;
  }
  .close {
    cursor: pointer;
    transition: all 200ms ease-in-out;
    &:hover {
      transform: scale(1.2);
    }
  }
  .thin_loading {
    position: absolute;
    bottom: 0;
  }
  .agreement_is_signed {
    text-align: center;
    color: #71d472;
    font-weight: 600;
  }
  .download_button {
    position: absolute;
    right: 4px;
    bottom: 4px;
  }
  .reset_pdf_button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%);
    width: 200px;
  }
  @media (max-width: 768px) {
    padding: 16px;
  }
}
</style>
