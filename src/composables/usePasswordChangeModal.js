/**
 * Composable для управления модальными окнами смены пароля
 * Переиспользуемая логика для страниц profile/index.vue и profile/account/index.vue
 */
export function usePasswordChangeModal() {
  return {
    data() {
      return {
        showChangePasswordModal: false,
        showChangePasswordPhoneModal: false,
        showChangePasswordCodeModal: false,
        showChangePasswordNewPasswordModal: false,
        changePasswordPhone: ''
      }
    },
    methods: {
      handleChangePassword() {
        this.showChangePasswordModal = true
      },
      handlePasswordOptionSelect(option) {
        if (option === 'phone') {
          this.showChangePasswordModal = false
          this.showChangePasswordPhoneModal = true
        } else {
          // TODO: Implement password change logic for other options
          console.log('Password option selected:', option)
          this.showChangePasswordModal = false
        }
      },
      handleGetCode(phone) {
        console.log('Get code for phone:', phone)
        this.changePasswordPhone = phone
        this.showChangePasswordPhoneModal = false
        this.showChangePasswordCodeModal = true
      },
      handleCodeModalBack() {
        this.showChangePasswordCodeModal = false
        this.showChangePasswordPhoneModal = true
      },
      handleCodeContinue(code) {
        console.log('Continue with code:', code)
        this.showChangePasswordCodeModal = false
        this.showChangePasswordNewPasswordModal = true
      },
      handleNewPasswordModalBack() {
        this.showChangePasswordNewPasswordModal = false
        this.showChangePasswordCodeModal = true
      },
      handlePasswordConfirm({ password, confirmPassword }) {
        console.log('Password confirmed:', password, confirmPassword)
        // TODO: Implement password change logic
        this.showChangePasswordNewPasswordModal = false
      },
      handleResendCode(phone) {
        console.log('Resend code for phone:', phone)
        // TODO: Implement resend code logic
      }
    }
  }
}

