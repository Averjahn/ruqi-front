<template>
  <div class="auth_data_popup">
    <Form ref="formPassword">
      <div class="field_row">
        <div class="field_col">
          <div class="label">Введите текущий пароль</div>
          <Input v-model="currentPassword" :disabled="loadingPassword" :rules="[rules.required]" type="password" />
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
      <Button type="outlined" :disabled="loadingPassword" @click="goBack">Отмена</Button>
      <Button :loading="loadingPassword" @click="submitNewPassword">Сохранить</Button>
    </div>
  </div>
</template>

<script>
import { rules, rulesSets } from '@/constants/validations'
import { mapActions } from 'vuex'
import { getAPIError } from '@/constants/helpers'

export default {
  props: {
    user: {
      type: Object,
      default: null,
    },
  },
  data () {
    return {
      loadingPassword:false,
      rules,
      rulesSets,
      currentPassword: '',
      newPassword: '',
      repeatNewPassword: '',
    }
  },
  computed: {},
  watch: {},
  mounted () {},
  methods: {
    ...mapActions('notifications', ['showNotification']),

    async submitNewPassword () {
      if (!this.$refs.formPassword.validate()) return
      if (this.loadingPassword) return
      this.loadingPassword = true
      const response = await this.$axios.post('v2/user/newpassword', {
        oldPassword: this.currentPassword,
        newPassword: this.newPassword,
      })
      if (response?.data?.success) {
        this.showNotification({ type: 'success', text: 'Пароль успешно изменен' })
        this.closePopup()
      } else {
        this.showNotification({ type: 'error', text: getAPIError(response) || 'Ошибка смены пароля' })
      }

      this.loadingPassword = false
    },

    clearPassword () {
      this.currentPassword = ''
      this.newPassword = ''
      this.repeatNewPassword = ''
    },

    passwordMatchChecking (v) {
      return v === this.newPassword || 'Пароли не совпадают'
    },
    closePopup () {
      this.clearPassword()
      this.$emit('closePopup')
    },
    goBack () {
      this.clearPassword()
      this.$emit('onBack')
    },
  },
}
</script>

<style lang="scss">
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
