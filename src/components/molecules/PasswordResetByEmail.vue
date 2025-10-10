<template>
  <div class="reset_by_email">
    <div v-if="showWindow === 'email_input'" class="new_password_form">
      <div class="title">Введите email, указанный при регистрации</div>
      <Form ref="form">
        <div class="field_row">
          <Input
            placeholder="ivanov@mail.ru"
            class="field_col"
            v-model="email"
            :rules="[rules.required, rules.email]"
          />
        </div>
        <div class="action_block">
          <Button type="outlined" :disabled="loading" @click="$emit('onBack')">Отмена</Button>
          <Button :disabled="loading" :loading="loading" @click="requestCode">Получить код</Button>
        </div>
      </Form>
    </div>
    <div v-if="showWindow === 'change_password'" class="new_password_form">
      <div class="title" v-html="smsMessage" />
      <Form ref="formPassword">
        <div class="field_row">
          <div class="field_col">
            <div class="label">Введите код из письма</div>
            <OtpInput
              ref="otpInput"
              :rules="[rules.required]"
              :isValid="isCodeValid"
              class="otp_input"
              @onChanged="onChanged"
            >
              <template #errorMessage>Неверный код</template>
            </OtpInput>
          </div>
        </div>
        <div class="field_row">
          <div class="field_col">
            <div class="label">Введите новый пароль</div>
            <Input
              v-model="newPassword"
              :disabled="loadingPassword"
              validationType="input"
              :rules="rulesSets.password"
              type="password"
            />
          </div>
        </div>
        <div class="field_row">
          <div class="field_col">
            <div class="label">Повторите новый пароль</div>
            <Input
              v-model="repeatNewPassword"
              :disabled="loadingPassword"
              :rules="[...rulesSets.password, passwordMatchChecking]"
              type="password"
            />
          </div>
        </div>
      </Form>
      <div class="action_block">
        <Button type="outlined" :disabled="loadingPassword" @click="onBack">Отмена</Button>
        <Button :disabled="continueDisabled || loadingPassword" :loading="loadingPassword" @click="submitNewPassword"
          >Подтвердить</Button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { rules, rulesSets } from '@/constants/validations'
import { getAPIError } from '@/constants/helpers'
import { mapActions, mapGetters } from 'vuex'
import OtpInput from '@/components/atoms/OtpInput.vue'

export default {
  components: {
    OtpInput,
  },
  props: {},
  data () {
    return {
      rules,
      rulesSets,
      code: null,
      newPassword: '',
      repeatNewPassword: '',
      loadingPassword: false,
      showWindow: 'email_input',
      continueDisabled: true,
      isCodeValid: true,
      email: null,
      loading: false,
    }
  },
  computed: {
    ...mapGetters('profilePage', ['profile']),
    smsMessage () {
      return `Мы отправили письмо  с кодом на email <b>${this.email}</b>. Введите его и задайте новый пароль.`
    },
    getUserLoginEmail () {
      return this?.profile?.user?.login_email
    },
  },
  mounted () {
    if (this.getUserLoginEmail) {
      this.email = this.getUserLoginEmail
    }
  },
  methods: {
    ...mapActions('notifications', ['showNotification']),

    onChanged (event) {
      this.code = event
      this.isCodeValid = true
      this.continueDisabled = event.length < 4
    },

    async submitNewPassword () {
      if (!this.$refs.formPassword.validate()) return
      if (this.loadingPassword) return
      this.loadingPassword = true
      const response = await this.$axios.patch('v2/user/setnewpasswordbycode', {
        code_confirm: this.code,
        type: 'email',
        newPassword: this.newPassword,
      })
      if (response?.data?.success) {
        this.showNotification({ type: 'success', text: 'Пароль успешно изменен' })
        this.closePopup()
      } else {
        if (response?.data?.error?.code === 400444) {
          this.isCodeValid = false
        }
        this.showNotification({ type: 'error', text: getAPIError(response) || 'Ошибка смены пароля' })
      }

      this.loadingPassword = false
    },

    clearPassword () {
      this.newPassword = ''
      this.repeatNewPassword = ''
    },

    passwordMatchChecking (v) {
      return v === this.newPassword || 'Пароли не совпадают'
    },

    async requestCode () {
      if (!this.$refs.form.validate()) return
      this.loading = true
      const response = await this.$axios.post('v2/user/sendrecoverypasswordcode', {
        phone_or_email: this.email,
      })
      if (response?.data?.success) {
        this.showWindow = 'change_password'
      } else {
        this.showNotification({ type: 'error', text: getAPIError(response) || 'Ошибка при получении кода' })
      }
      this.loading = false
    },

    closePopup () {
      this.clearPassword()
      this.$emit('closePopup')
    },

    onBack () {
      this.clearPassword()
      this.showWindow = 'email_input'
    },
  },
}
</script>

<style lang="scss">
.reset_by_email {
  width: 100%;
}
.new_password_form {
  display: flex;
  flex-direction: column;
  gap: 24px;
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
