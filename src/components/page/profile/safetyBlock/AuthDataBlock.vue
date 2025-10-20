<template>
  <div class="auth-data">
    <Popup v-model:show="isDeletePopupOpen">
      <PopupContainer class="change_email_popup" @close="isDeletePopupOpen = false" maxWidth="404px">
        <template v-slot:header>
          <div class="delete_title">
            <img v-if="!hasActiveTask" src="@/assets/icons/info_outlined.svg" class="warning_icon" />
            <img v-else src="@/assets/icons/warning_yellow.svg" class="warning_icon" />
            <ButtonIconGhost @click="isDeletePopupOpen = false" class="close_popup">
              <img src="@/assets/icon_deprecated/cross.svg" />
            </ButtonIconGhost>
          </div>
        </template>
        <div class="field_row">
          <div class="field_col warning_text">
            <div v-if="!hasActiveTask" class="">Вы действительно хотите удалить ваш аккаунт?</div>
            <div v-else class="">Невозможно удалить сейчас</div>
          </div>
        </div>
        <div v-if="hasActiveTask" class="field_row">
          <div class="field_col">
            <div class="value error_description">{{ accountDeleteErrorTxt }}</div>
          </div>
        </div>
        <div class="action_block">
          <template v-if="!hasActiveTask"
            ><Button :disabled="isLoading" @click="isDeletePopupOpen = false">Отмена</Button>
            <Button :loading="isLoading" color="red" @click="deleteAccount">Да, удалить</Button></template
          >
          <template v-else>
            <Button :loading="isLoading" @click="isDeletePopupOpen = false">Ок</Button>
          </template>
        </div>
      </PopupContainer>
    </Popup>
    <Popup v-model:show="isPopupOpen">
      <PasswordReset @close="closePasswordPopup" />
    </Popup>

    <Popup v-model:show="isPopupEmailOpen">
      <PopupContainer
        class="change_email_popup"
        title="Изменить Email для входа в систему"
        @close="isPopupEmailOpen = false"
      >
        <div class="field_row">
          <div class="field_col">
            <div class="label">Введите новый Email</div>
            <Input v-model="newEmail" :rules="[rules.required, rules.email]" />
          </div>
        </div>
        <div class="action_block">
          <Button type="outlined" :disabled="saveNewEmailLoading" @click="isPopupEmailOpen = false">Отмена</Button>
          <Button :loading="saveNewEmailLoading" @click="saveNewEmail">Сохранить</Button>
        </div>
      </PopupContainer>
    </Popup>

    <Popup v-model:show="isPopupPhoneOpen">
      <PopupContainer
        class="change_email_popup"
        title="Изменить телефон для входа в систему"
        @close="isPopupPhoneOpen = false"
      >
        <div class="field_row">
          <div class="field_col">
            <div class="label">Введите новый телефон</div>
            <Input
              :value="newPhone"
              :error="phoneExistError"
              :rules="[rules.required, ...rulesSets.phone]"
              @input="onPhone"
            />
          </div>
        </div>
        <div v-if="isTimerRunning" class="action_block">
          <Button type="outlined" @click="switchToApprovePhone">Ввести код из {{ codeTypeText.headerTarget }}</Button>
          <Button disabled @click="saveNewPhone">Сохранить {{ remainingTimeString }}</Button>
        </div>
        <div v-else class="action_block">
          <Button type="outlined" :disabled="saveNewEmailLoading" @click="isPopupEmailOpen = false">Отмена</Button>
          <Button :loading="saveNewEmailLoading" @click="saveNewPhone">Сохранить</Button>
        </div>
      </PopupContainer>
    </Popup>

    <Popup v-model:show="isPopupApprovePhoneOpen">
      <PopupContainer class="approve_code_popup" :title="approvePhoneTitle" @close="isPopupApprovePhoneOpen = false">
        <div class="code_description mb_24">
          На {{ codeTypeText.target }} <b>{{ verifiedPhone }}</b> сейчас поступит {{ codeTypeText.type }}. Пожалуйста,
          введите код из {{ codeTypeText.target }}.
        </div>

        <OtpInput :digits="4" :isValid="isCodeValid" class="phone_otp mb_16" @onInput="onChangedCode">
          <template #errorMessage>Неверный код</template>
        </OtpInput>

        <ButtonText
          v-if="!isTimerRunning"
          type="s"
          :loading="saveNewPhoneLoading"
          @click="requestCodeAgain('telegram')"
          class="mb_24"
        >
          Отправить код еще раз
        </ButtonText>
        <ButtonText
          v-if="!isTimerRunning"
          type="s"
          :loading="saveNewPhoneLoading"
          @click="requestCodeAgain('sms')"
          class="mb_24"
        >
          Получить код из СМС
        </ButtonText>

        <div v-else class="code_description mb_24">
          Запросить код повторно можно будет через: <b>{{ remainingTimeString }}</b>
        </div>

        <div class="action_block">
          <Button type="outlined" :disabled="loadingSmsCode" @click="isPopupApprovePhoneOpen = false">Отмена</Button>
          <Button :loading="loadingSmsCode" :disabled="continueSendSmsDisabled" @click="sendSmsCode">
            Подтвердить
          </Button>
        </div>
      </PopupContainer>
    </Popup>

    <Popup v-model:show="isPopupApproveEmailOpen">
      <PopupContainer
        class="approve_email_popup"
        title="Подтвердите изменение email"
        @close="isPopupApproveEmailOpen = false"
      >
        <div class="approve_email_description mb_24">
          На email <b>{{ newEmail }}</b>
          отправлено письмо. Пройдите по ссылке, указанной в письме для завершения смены email
        </div>
        <div class="action_block">
          <Button type="outlined" @click="isPopupApproveEmailOpen = false">Ok</Button>
        </div>
      </PopupContainer>
    </Popup>

    <Block>
      <BlockHeader class="mb_24" withoutButton>Безопасность и вход</BlockHeader>

      <div class="section_wrapper">
        <HoverHighlighter>
          <div class="item" @click="isPopupEmailOpen = true">
            <div class="content">
              <div class="label">Email для входа в систему</div>
              <div class="value">
                {{ email }}
                <div v-if="emailStatus === 'approved'" class="approved_status">
                  <img class="icon_status" src="@/assets/icon_deprecated/check_mark_circle.svg" />
                  Email подтвержден
                </div>
                <div v-if="emailStatus === 'notApproved'" class="approved_status red">
                  <img class="icon_status" src="@/assets/icon_deprecated/cross_circle_red.svg" />
                  Подтвердите email
                </div>
              </div>
            </div>
            <img src="@/assets/icons/chevron.svg" />
          </div>
        </HoverHighlighter>

        <HoverHighlighter>
          <div class="item" @click="isPopupPhoneOpen = true">
            <div class="content">
              <div class="label">Телефон для входа в систему</div>
              <div class="value">
                {{ phone }}
                <div v-if="phoneStatus === 'approved'" class="approved_status">
                  <img class="icon_status" src="@/assets/icon_deprecated/check_mark_circle.svg" />
                  Телефон подтвержден
                </div>
                <div v-if="phoneStatus === 'notApproved'" class="approved_status red">
                  <img class="icon_status" src="@/assets/icon_deprecated/cross_circle_red.svg" />
                  Подтвердите телефон
                </div>
              </div>
            </div>
            <img src="@/assets/icons/chevron.svg" />
          </div>
        </HoverHighlighter>

        <HoverHighlighter>
          <div class="item" @click="isPopupOpen = true">
            <div class="content">
              <div class="label">Пароль</div>
              <div class="value">********</div>
            </div>
            <img src="@/assets/icons/chevron.svg" />
          </div>
        </HoverHighlighter>

        <div class="item">
          <div class="content">
            <div class="label">Telegram</div>
            <div class="value">Привяжите Telegram-аккаунт для уведомлений</div>
          </div>
          <ButtonText class="telegram_button" :loading="telegramLoading" @click="connectTelegram">
            {{ user?.telegram_id ? 'Привязать повторно' : 'Привязать' }}
          </ButtonText>
        </div>
      </div>
    </Block>
    <Block>
      <HoverHighlighter>
        <ButtonText
          class="action_button_desktop"
          size="l"
          :loading="isLoading"
          @click="isDeletePopupOpen = true"
          :disabled="isLoading"
        >
          <div class="icon_shadow">
            <img src="@/assets/icons/trash.svg" class="delete_icon" />
          </div>
          <div class="btn_text">Удалить аккаунт</div>
        </ButtonText>
      </HoverHighlighter>
    </Block>
  </div>
</template>

<script>
import store from '@/store'
import PopupContainer from '@/components/atoms/PopupContainer.vue'
import HoverHighlighter from '@/components/atoms/HoverHighlighter.vue'
import PasswordReset from '@/components/organisms/popups/PasswordReset.vue'
import OtpInput from '@/components/atoms/OtpInput.vue'
import useTimer from '@/composables/useSnackbarTimer'
import useTelegramConnect from '@/composables/useTelegramConnect'
import { rules, rulesSets } from '@/constants/validations'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { getAPIError, formatPhoneNumber, getStringFromSeconds, getClearPhone } from '@/constants/helpers'
import { formatPhone } from '@/constants/masks'
import Block from '@/components/page/profile/Block.vue'
import BlockHeader from '@/components/page/profile/BlockHeader.vue'
import ButtonIcon from '@/components/atoms/ButtonIcon.vue'

export default {
  components: { PasswordReset, PopupContainer, HoverHighlighter, OtpInput, Block, BlockHeader },
  props: {
    profile: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      rules,
      rulesSets,
      newEmail: '',
      newPhone: '',
      code: '',
      isLoading: false,
      isCodeValid: true,
      phoneExistError: false,
      continueSendSmsDisabled: true,
      loadingSmsCode: false,
      saveNewPhoneLoading: false,
      saveNewEmailLoading: false,
      isPopupOpen: false,
      isDeletePopupOpen: false,
      isPopupEmailOpen: false,
      isPopupPhoneOpen: false,
      isPopupApprovePhoneOpen: false,
      isPopupApproveEmailOpen: false,
      hasActiveTask: false,
      confirmMethod: 'telegram',
      verification_by: 'telegram',
      accountDeleteErrorTxt: '',
    }
  },

  setup () {
    const { telegramLoading, connectTelegram } = useTelegramConnect()
    const { launchTimer, clearTimer, isTimerRunning, remaining } = useTimer({
      timerId: 'preSignUpSms',
    })

    return {
      launchTimer,
      isTimerRunning,
      remaining,
      clearTimer,
      telegramLoading,
      connectTelegram,
    }
  },
  computed: {
    ...mapGetters('user', ['user']),

    verifiedPhone () {
      return formatPhoneNumber(this.profile?.user?.login_phone || '')
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
    phone () {
      const phone =
        this.profile?.user?.login_phone_unverified || this.profile?.user?.login_phone || this.profile?.user?.phone
      return !phone ? '-' : formatPhoneNumber(phone)
    },
    phoneStatus () {
      if (
        this.profile?.user?.login_phone_unverified &&
        this.profile?.user?.login_phone_unverified !== this.profile?.user?.login_phone
      )
        return 'notApproved'
      if (this.profile?.user?.login_phone) return 'approved'
      if (this.profile?.user?.phone) return 'notApproved'
      return false
    },
    email () {
      return this.profile?.user?.login_email_unverified || this.profile?.user?.login_email || '-'
    },
    emailStatus () {
      if (
        this.profile?.user?.login_email_unverified &&
        this.profile?.user?.login_email_unverified !== this.profile?.user?.login_email
      )
        return 'notApproved'
      if (this.profile?.user?.login_email) return 'approved'
      return false
    },
  },
  watch: {
    'profile.user': {
      handler () {
        this.init()
      },
      deep: true,
    },
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions('notifications', ['showNotification']),
    ...mapMutations('profilePage', ['setUnVerifiedEmail', 'setUnVerifiedPhone', 'setVerifiedPhone']),

    init () {
      if (this.emailStatus === 'notApproved') {
        this.newEmail = this.profile?.user?.login_email_unverified || this.profile?.user?.login_email
      } else {
        this.newEmail = ''
      }
      this.newPhone = formatPhoneNumber(
        this.profile?.user?.login_phone_unverified ||
          this.profile?.user?.login_phone ||
          this.profile?.user?.phone ||
          '',
      )
    },

    switchToApprovePhone () {
      this.isPopupPhoneOpen = false
      this.isPopupApprovePhoneOpen = true
    },
    requestCodeAgain (method) {
      this.verification_by = method
      this.confirmMethod = method
      this.saveNewPhone()
    },
    async saveNewPhone () {
      this.saveNewPhoneLoading = true
      const response = await this.$axios.patch('v2/user/setunverifiedloginphone', {
        login_phone_unverified: this.newPhone,
        verification_by: this.verification_by,
      })
      if (!response?.data?.success && [974905, 976905].includes(response?.data?.error[0]?.code)) {
        this.confirmMethod = 'sms'
        this.switchToApprovePhone()
        this.setUnVerifiedPhone(getClearPhone(this.newPhone))
        this.launchTimer(180)
        return
      }
      if (response?.data?.success) {
        this.confirmMethod = response.data.data?.code_sended?.method
        this.switchToApprovePhone()
        this.setUnVerifiedPhone(getClearPhone(this.newPhone))
        this.launchTimer(180)
      } else {
        if (response?.data?.error?.code === 538406) this.phoneExistError = true

        this.showNotification({ type: 'error', text: getAPIError(response) || 'Ошибка смены телефона' })
      }
      this.saveNewPhoneLoading = false
    },

    async sendSmsCode () {
      if (this.loadingSmsCode) return
      this.loadingSmsCode = true
      const response = await this.$axios.patch('v2/user/setnewloginphone', {
        code_confirm: this.code,
      })
      if (response?.data?.success) {
        this.isPopupApprovePhoneOpen = false
        this.setUnVerifiedPhone(null)
        this.setVerifiedPhone(getClearPhone(this.newPhone))
        this.clearTimer()
        this.showNotification({ type: 'success', text: 'Телефон успешно подтверждён' })
      } else {
        if (response?.data?.error?.code === 547403) {
          this.isCodeValid = false
          this.showNotification({ text: getAPIError(response) || 'Ошибка смены пароля' })
        } else {
          this.showNotification({ text: getAPIError(response) || 'Ошибка смены пароля' })
        }
      }
      this.loadingSmsCode = false
    },

    async saveNewEmail () {
      this.saveNewEmailLoading = true
      const response = await this.$axios.patch('v2/user/setunverifiedloginemail', {
        login_email_unverified: this.newEmail,
      })
      if (response?.data?.success) {
        this.isPopupEmailOpen = false
        this.isPopupApproveEmailOpen = true
        this.setUnVerifiedEmail(this.newEmail)
      } else {
        this.showNotification({ type: 'error', text: getAPIError(response) || 'Ошибка смены email' })
      }
      this.saveNewEmailLoading = false
    },

    onChangedCode (event) {
      this.code = event
      this.isCodeValid = true
      this.continueSendSmsDisabled = event.length < 4
    },

    closePasswordPopup () {
      this.isPopupOpen = false
    },

    onPhone (event) {
      if (this.phoneExistError) this.phoneExistError = false
      const { formattedValue, cursorPosition } = formatPhone({
        value: event.target.value,
        cursorPosition: event.target.selectionEnd,
      })
      this.newPhone = formattedValue ? '' : 'null'
      this.$nextTick(() => {
        this.newPhone = formattedValue
        this.$nextTick(() => {
          event.target.setSelectionRange(cursorPosition, cursorPosition)
        })
      })
    },

    async deleteAccount () {
      this.isLoading = true
      const response = await this.$axios.post('v2/user/deleteaccount')
      if (response?.data?.success) {
        this.logout()
      } else {
        if (response.data?.error?.code === 456222) {
          this.hasActiveTask = true
          this.accountDeleteErrorTxt =
            'Вы не можете сейчас удалить ваш аккаунт, так как вы находитесь в активной заявке и не сможете получить оплату. Для удаления аккаунта дождитесь завершения заявки'
        } else {
          this.accountDeleteErrorTxt =
            response.data?.error?.msg || 'Не удалось удалить аккаунт. Повторите попытку позже.'
        }
        this.showNotification({ type: 'error', text: getAPIError(response) || 'Ошибка удаления аккаунта' })
      }
      this.isLoading = false
    },

    logout () {
      store.dispatch('auth/logOut')
      this.$router.push('/signin')
    },

    onSave () {
      this.isPopupApprovePhoneOpen = true
    },
  },
}
</script>

<style lang="scss" scoped>
.delete_title {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.warning_icon {
  flex: 1;
  height: 32px;
}
.close_popup {
  position: absolute;
  top: 12px;
  right: 12px;
}
.warning_text {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  line-height: 125%;
  color: #263043;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.error_description {
  font-size: 20px;
  line-height: 28px;
  font-weight: 400;
  color: #263043;
}
.action_button_desktop {
  background: white;
  display: flex;
  flex-direction: row;
  gap: 16px;
}
.delete_icon {
  width: 24px;
  display: block;
}
.icon_shadow {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  width: 48px;
  background: #fff6f5;
  border-radius: 24px;
}
.btn_text {
  color: #eb4d3d;
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
}
.auth-data {
  display: flex;
  flex-direction: column;
  gap: 24px;
  .section_wrapper {
    display: flex;
    flex-direction: column;
    gap: 36px;
  }

  .item {
    display: flex;
    gap: 16px;
  }

  .content {
    flex: 1 auto;
  }

  .label {
    color: #c7c7c7;
    margin-bottom: 8px;
  }

  .value {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .approved_status {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #71d472;
    font-size: 12px;
    line-height: 125%;
    letter-spacing: 0.1px;
    &.red {
      color: #eb4d3d;
    }
  }
  .icon_status {
    width: 16px;
    height: 16px;
  }
  .code_description {
    text-align: center;
  }

  .approve_email_description {
    text-align: center;
  }
  .approve_code_popup {
    text-align: center;
  }
  .telegram_button {
    width: min-content;
    white-space: normal;
  }

  @media (max-width: 1000px) {
    .value {
      flex-direction: column;
      align-items: flex-start;
    }
  }
}

.change_email_popup,
.approve_email_popup,
.approve_code_popup,
.auth_data_popup {
  .field_row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .field_col {
    flex: 1;
    margin-bottom: 16px;
  }
  .label {
    color: #7a91a9;
    margin-bottom: 8px;
  }
  .action_block {
    margin-top: 8px;
    display: flex;
    gap: 16px;
    & > div {
      flex: 1;
    }
  }
  .phone_otp {
    display: inline-block;
  }
}
</style>
