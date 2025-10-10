<template>
  <PopupContainer
    :maxWidth="viewScreen !== 'code_confirm' ? '800px' : '570px'"
    :title="
      viewScreen === 'generate_signature'
        ? 'Проверка данных для выпуска новой электронной подписи'
        : viewScreen === 'show_signature'
          ? `Сертификат электронной подписи ${getCertificateId}`
          : `Пожалуйста подтвердите выпуск ЭЦП кодом из ${codeTypeText.headerTarget}`
    "
    class="reset_password_popup"
    @close="$emit('close')"
  >
    <div v-if="viewScreen === 'generate_signature'" class="electronic_signature_popup">
      <Info yellow class="mb_24">
        При перевыпуске сертификата электронной подписи, активная на данный момент подпись (если имеется) будет
        перемещена в архив. Перед выпуском новой подписи, пожалуйста, убедитесь что внесенные в ваш профиль данные верны
      </Info>

      <PassportInfoBlock class="mb_24" showEditButton />
      <div class="action_block">
        <Button type="outlined" :disabled="loading" @click="$emit('close')">Отмена</Button>
        <Button :loading="loading" @click="requestCode">Выпустить ЭЦП с текущими данными</Button>
      </div>
    </div>

    <div v-if="viewScreen === 'show_signature'" class="sign_popup">
      <div v-if="openedCertificate.status === 'archive'" class="sign_status mb_24">Архивная подпись</div>
      <div class="sign_info_row">
        <div class="label">Владелец</div>
        <div class="value">{{ openedCertificate?.user_name || '-' }}</div>
      </div>
      <div class="sign_info_row">
        <div class="label">Тип владельца</div>
        <div class="value">Физическое лицо</div>
      </div>
      <div class="sign_info_row">
        <div class="label">ИНН</div>
        <div class="value">{{ openedCertificate?.user_inn || '-' }}</div>
      </div>
      <div class="sign_info_row">
        <div class="label">Срок действия</div>
        <div class="value">{{ displayedDate(openedCertificate) }}</div>
      </div>
      <div class="sign_info_row">
        <div class="label">Выдан</div>
        <div class="value">{{ openedCertificate?.issued_by || 'ООО «ПЛАТФОРМЕННЫЕ РЕШЕНИЯ»'}}</div>
      </div>
      <Button v-if="openedCertificate.status === 'active'" :loading="loading" @click="requestCode">
        Архивировать и выпустить новую подпись
      </Button>
    </div>

    <div v-if="viewScreen === 'code_confirm' && loginPhone" class="electronic_signature_popup">
      <div class="code_description mb_24">
        На {{ codeTypeText.target }} <b>{{ loginPhone }}</b> сейчас поступит {{ codeTypeText.type }}.
      </div>

      <div class="resend-sms">
        <OtpInput :digits="4" :isValid="isCodeValid" class="phone_otp mb_16" @onInput="onChangedCode">
          <template #errorMessage>Неверный код</template>
        </OtpInput>
        <ButtonText
          v-if="!isTimerRunning"
          type="s"
          :loading="loadingSmsCode"
          @click="requestCodeAgain('telegram')"
          class="mb_24"
        >
          Отправить код еще раз
        </ButtonText>
        <ButtonText
          v-if="!isTimerRunning && initialResponseMethod !== 'sms'"
          type="s"
          :loading="loadingSmsCode"
          @click="requestCodeAgain('sms')"
          class="mb_24"
        >
          Получить код из СМС
        </ButtonText>

        <div v-if="isTimerRunning" class="code_description mb_24">
          Запросить код повторно можно будет через: <b>{{ remainingTimeString }}</b>
        </div>
      </div>

      <div class="action_block">
        <Button type="outlined" :disabled="confirmSmsLoading" @click="viewScreen = 'generate_signature'">Отмена</Button>
        <Button :loading="confirmSmsLoading" :disabled="continueSendSmsDisabled" @click="createNewCertificate">
          Подтвердить
        </Button>
      </div>
    </div>
  </PopupContainer>
</template>

<script>
import PopupContainer from '@/components/atoms/PopupContainer.vue'
import PassportInfoBlock from '@/components/page/profile/PassportInfoBlock.vue'
import OtpInput from '@/components/atoms/OtpInput.vue'
import useTimer from '@/composables/useTimer'
import { mapGetters, mapActions } from 'vuex'
import { getAPIError, repeatWithInterval, getStringFromSeconds, getClearPhone } from '@/constants/helpers'

export default {
  components: {
    PopupContainer,
    PassportInfoBlock,
    OtpInput,
  },
  emits: ['close', 'setPending'],
  props: {
    openedCertificate: {
      type: Object,
      default: () => {},
    },
    window: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      code: '',
      loading: false,
      intervalId: null,
      viewScreen: '',
      isCodeValid: true,
      loadingSmsCode: false,
      confirmSmsLoading: false,
      continueSendSmsDisabled: true,
      confirmMethod: 'telegram',
      verification_by: 'telegram',
      initialResponseMethod: '',
      userCertificateId: '',
    }
  },
  setup () {
    const { launchTimer, clearTimer, isTimerRunning, remaining } = useTimer({
      timerId: 'signatureConfirmSms',
    })

    return {
      launchTimer,
      isTimerRunning,
      remaining,
      clearTimer,
    }
  },
  computed: {
    ...mapGetters('profilePage', ['profile', 'activeCertificate']),
    getCertificateId () {
      return this.activeCertificate?.uuid?.split('-')?.join('')?.slice(0, 12)?.toUpperCase()
    },
    user () {
      return this.profile?.user || null
    },
    loginPhone () {
      return this.profile?.user?.login_phone || null
    },
    remainingTimeString () {
      return getStringFromSeconds(this.remaining)
    },
    approvePhoneTitle () {
      return `Введите код из ${this?.codeTypeText?.headerTarget}`
    },
    codeTypeText () {
      switch (this.confirmMethod) {
        case 'sms':
          return {
            headerTarget: 'смс',
            target: 'номер',
            type: 'смс',
          }
        case 'telegram':
          return {
            headerTarget: 'телеграм',
            target: 'телеграм',
            type: 'сообщение',
          }
        default:
          return {
            headerTarget: 'телеграм',
            target: 'телеграм',
            type: 'сообщение',
          }
      }
    },
  },
  mounted () {
    if (!this.user) {
      this.fetchProfile()
    }
    this.viewScreen = this.window
  },
  unmounted () {
    clearInterval(this.intervalId)
  },
  methods: {
    ...mapActions('profilePage', ['fetchProfile', 'fetchActiveCertificate']),
    ...mapActions('notifications', ['showNotification']),

    requestCodeAgain (method) {
      this.verification_by = method
      this.confirmMethod = method
      this.requestCode()
    },

    async requestCode () {
      if (!this.user?.login_phone) {
        this.showNotification({
          type: 'info',
          text: `Для выпуска ЭЦП нужно сначала подтвердить номер телефона: ${this.user?.login_phone_unverified}`,
        })
        return
      }
      this.loadingSmsCode = true
      const response = await this.$axios.post('v3/my/eds/certificate/create', {
        verification_by: this.verification_by,
      })
      if (response?.data?.success) {
        if (!this.initialResponseMethod)
          this.initialResponseMethod = response.data?.data?.code_sended?.method || 'telegram'
        this.confirmMethod = response.data?.data?.code_sended?.method
        this.userCertificateId = response.data?.data?.user_certificate_id
        this.launchTimer(180)
        this.viewScreen = 'code_confirm'
      } else {
        this.showNotification({
          type: 'error',
          text: getAPIError(response) || 'Ошибка при попытке выпуска сертификата ЭЦП',
        })
      }
      this.loadingSmsCode = false
    },

    displayedDate (certificate) {
      return `Срок действия: ${this.$dayjs(certificate?.valid_from, 'DD.MM.YYYY').format('DD.MM.YYYY')} по  ${this.$dayjs(certificate?.valid_to, 'DD.MM.YYYY').format('DD.MM.YYYY')}`
    },
    async pullingCertificate () {
      await this.fetchActiveCertificate()
      if (this.activeCertificate.status === 'active') this.finishPulling(true)
    },

    finishPulling (isSuccess) {
      this.loading = false
      clearInterval(this.intervalId)
      if (!isSuccess) {
        this.showNotification({
          type: 'info',
          text: 'ЭЦП в данный момент формируется, попробуйте обновить статус через несколько минут',
        })
      }
    },

    onChangedCode (event) {
      this.code = event
      this.isCodeValid = true
      this.continueSendSmsDisabled = event.length < 4
    },

    async createNewCertificate () {
      if (this.confirmSmsLoading) return
      this.confirmSmsLoading = true
      const response = await this.$axios.post('v3/my/eds/certificate/create/submit', {
        code: this.code,
        user_certificate_id: this.userCertificateId,
      })

      if (response?.data?.success) {
        await this.fetchActiveCertificate()
        if (response?.data?.data?.status === 'pending') {
          this.$emit('setPending')
          this.intervalId = repeatWithInterval(this.pullingCertificate, this.finishPulling, 3, 3000)
        }
        this.$emit('close')
      } else {
        if (response?.data?.error?.[0]?.code === 660106) {
          this.isCodeValid = false
        } else {
          this.showNotification({
            type: 'error',
            text: getAPIError(response) || 'Ошибка при попытке выпуска сертификата ЭЦП',
          })
        }
      }
      this.confirmSmsLoading = false
    },

    closePasswordPopup () {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
.reset_password_popup {
  min-width: 359px;
  width: 100%;
}
.sign_popup {
  .sign_info_row {
    margin-bottom: 16px;
  }
  .label {
    color: #7a91a9;
    margin-bottom: 4px;
  }
  .value {
    font-weight: 600;
  }
}

.electronic_signature_popup {
  .action_block {
    margin-top: 8px;
    display: flex;
    gap: 16px;
    // flex-wrap: wrap;
    & > div {
      flex: 1;
      white-space: nowrap;
    }
  }
}

.resend-sms {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
</style>
