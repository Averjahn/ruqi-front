<template>
  <div class="sign_up_page">
    <Popup v-model:show="smsConfirmPopup">
      <CodeConfirmPopup
        @close="smsConfirmPopup = false"
        @repeatCode="repeatCode"
        :isTimerRunning="isTimerRunning"
        :remaining="remainingTimeString"
        v-model:confirmTarget="dynamicConfirmTarget"
        v-model:onceToken="onceToken"
        v-model:confirmMethod="confirmMethod"
      />
    </Popup>

    <div v-if="!initialLoading" class="form_block">
      <h1 class="mb_16">Добро пожаловать в Ruqi!</h1>
      <div class="text_center mb_40">Для завершения регистрации, пожалуйста, заполните форму ниже</div>
      <div class="mb_24">
        <h4 class="mb_24">Шаг 1. Выберите гражданство</h4>
        <div class="sign_label required_label">Гражданство</div>
        <Select v-model="userData.citizenship" :options="citizenshipOptions" />
      </div>

      <Form ref="form">
        <div class="mb_40">
          <component
            :is="getCitizenForm()"
            v-model:userData="userData"
            :loadings="loadings"
            :photos="photos"
            @addPhoto="addPhoto"
            @deletePhoto="deletePhoto"
          />
        </div>

        <div class="mb_40">
          <h4 class="mb_24">Шаг 4. Параметры входа</h4>

          <div class="sign_label">Придумайте пароль</div>
          <Input
            type="password"
            v-model="userData.password"
            class="form_input mb_16"
            validationType="input"
            :rules="rulesSets.password"
            autocomplete="off"
          />

          <div class="sign_label">Повторите пароль</div>
          <Input
            type="password"
            v-model="repeatPassword"
            class="form_input mb_16"
            :rules="[...rulesSets.password, passwordMatchChecking]"
            autocomplete="off"
          />

          <div class="sign_label">Телефон</div>
          <Input
            :value="userData.phone"
            @input="onPhone"
            class="form_input mb_16"
            :rules="[rules.required, ...rulesSets.phone]"
          />

          <Info blue>
            Мы отправим вам проверочный код на этот номер телефона. В дальнейшем вход в учётную запись будет
            производиться по этому же номеру.
          </Info>
          <div class="agreements_check">
            <div class="personal-agreement-checkbox">
              <Checkbox v-model="termAgree" />
              <div class="agreement-check">
                <div>
                  Я ознакомился (-ась) и согласен (-на) с
                  <span class="agreement-src" @click="$router.push('/privacy-policy')">
                    политикой в отношении обработки персональных данных
                  </span>
                </div>
              </div>
            </div>
            <div class="personal-agreement-checkbox">
              <Checkbox v-model="agree" />
              <div class="agreement-check">
                <div>
                  Я ознакомился(-ась) и даю
                  <span class="agreement-src" @click="$router.push('/personal')">
                    согласие на обработку моих персональных данных
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>

      <div class="btn_block">
        <Button @click="onSubmit" :loading="loading" :disabled="isTimerRunning" class="login_button">
          Продолжить
          <template v-if="isTimerRunning">{{ remainingTimeString }}</template>
        </Button>
      </div>
      <div v-if="isTimerRunning" class="btn_block mt_16">
        <Button @click="smsConfirmPopup = true" :loading="loading" class="login_button">
          Ввести код из {{ confirmMethod === 'telegram' ? 'телеграм' : 'смс' }}</Button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import {
  getAPIError,
  getClearPhone,
  getStringFromSeconds,
  convertToFrontFormat,
  convertToBackFormat,
} from '@/constants/helpers'
import { formatPhone } from '@/constants/masks'
import FormRussianCitizen from '@/components/page/preSignUp/FormRussianCitizen.vue'
import FormEAEUCitizen from '@/components/page/preSignUp/FormEAEUCitizen.vue'
import FormOtherCitizen from '@/components/page/preSignUp/FormOtherCitizen.vue'
import CodeConfirmPopup from '@/components/page/preSignUp/CodeConfirmPopup.vue'
import { rules, rulesSets } from '@/constants/validations'
import { CITIZENSHIP_OPTIONS } from '@/constants/constants'
import { formatNumericString } from '@/constants/masks'
import usePassportPhotos from '@/composables/usePassportPhotos'
import useTimer from '@/composables/useTimer'
import useGlobalLoading from '@/composables/useGlobalLoading'

const CODE_DELAY = 180

export default {
  components: {
    FormRussianCitizen,
    FormEAEUCitizen,
    FormOtherCitizen,
    CodeConfirmPopup,
  },
  setup () {
    const { photos, loadings, deletePhoto, addPhoto, preregToken, fetchPhoto } = usePassportPhotos({
      addPhotoUrl: 'v2/preregistration/passportfile',
      deletePhotoUrl: 'v2/preregistration/passportfile',
    })
    const { launchTimer, isTimerRunning, remaining } = useTimer({ timerId: 'preSignUpSms' })
    const { startLoading, stopLoading, loading } = useGlobalLoading()
    return {
      photos,
      loadings,
      deletePhoto,
      addPhoto,
      preregToken,
      fetchPhoto,
      launchTimer,
      isTimerRunning,
      remaining,
      startLoading,
      stopLoading,
      loading,
    }
  },
  data () {
    return {
      rules,
      rulesSets,
      smsConfirmPopup: false,
      onceToken: null,
      confirmMethod: 'telegram',
      confirmTarget: '',
      color: 'red',
      userData: {
        citizenship: CITIZENSHIP_OPTIONS.RU.id,
        citizenship_custom_name: null,
        lastname: null,
        firstname: null,
        middlename: null,
        birthday: null,
        passport: {
          birth_address: null,
          issue_date: null,
          registration_address: null,
          expiration_date: null,
          issue_organization_code: null,
          issue_organization_name: null,
          number: null,
          series: null,
          by_number: null,
          am_number: null,
          kz_number: null,
          kg_number: null,
          by_id_number: null,
        },
        selfie: null,
        registration_address: null,
        password: null,
        phone: null,
        inn: '',
      },
      verification_by: 'telegram',
      passport_files: [],
      repeatPassword: null,
      initialLoading: false,
      citizenshipOptions: Object.values(CITIZENSHIP_OPTIONS),
      login: '',
      loginError: false,
      agree: true,
      termAgree: true,
    }
  },
  computed: {
    remainingTimeString () {
      return getStringFromSeconds(this.remaining)
    },
    dynamicConfirmTarget () {
      return this.confirmTarget || this.userData?.phone
    },
  },
  async mounted () {
    if (!this.$route.query.prereg_token) this.$router.push('/unavailable')
    if (this.$route.query.onceToken) this.onceToken = this.$route.query.onceToken
    this.preregToken = this.$route.query.prereg_token
    this.initialLoading = true
    await this.fetchData()
    this.initialLoading = false
  },
  watch: {},
  methods: {
    ...mapActions('notifications', ['showNotification']),

    getCitizenForm () {
      if (this.userData.citizenship === 'RU') return 'FormRussianCitizen'
      if (['BY', 'AM', 'KZ', 'KG'].includes(this.userData.citizenship)) return 'FormEAEUCitizen'
      if (this.userData.citizenship === 'OTHER') return 'FormOtherCitizen'
    },
    passwordMatchChecking (v) {
      return v === this.userData.password || 'Пароли не совпадают'
    },

    incomingFormatting (data) {
      if (data?.phone) {
        const { formattedValue: phone } = formatPhone({
          value: data.phone,
        })
        data.phone = phone ?? ''
      }
      if (data?.passport?.issue_organization_code) {
        const { formattedValue: code } = formatNumericString({
          value: data.passport.issue_organization_code,
          pattern: '***-***',
        })
        data.passport.issue_organization_code = code
      }
      return data
    },

    outgoingFormatting (data) {
      const result = JSON.parse(JSON.stringify(data))
      if (result?.phone) {
        result.phone = getClearPhone(result.phone)
      }
      if (result?.passport?.issue_organization_code) {
        const { formattedValue: code } = formatNumericString({
          value: result.passport.issue_organization_code,
          pattern: '******',
        })
        result.passport.issue_organization_code = code
      }
      return result
    },

    getPhotosObj (passport_files) {
      const obj = {}
      passport_files.forEach((item) => {
        obj[item.file_type] = item
      })
      return obj
    },

    async fetchData () {
      this.startLoading()
      const response = await this.$axios.get('v2/preregistration/getdata', {
        params: {
          prereg_token: this.$route.query.prereg_token,
        },
      })
      if (response?.data?.success) {
        convertToFrontFormat(response?.data?.data)
        this.userData = this.incomingFormatting(response?.data?.data)
        this.photos = this.getPhotosObj(response.data.data?.passport_files || [])
      } else {
        if (response?.data?.error?.[0]?.code === 300122) {
          this.$router.push('/unavailable')
        } else if (response?.data?.error?.[0]?.code === 300136) {
          this.$router.push('/already-registered')
        } else {
          this.showNotification({ text: getAPIError(response) || 'Ошибка получения данных' })
        }
      }
      this.stopLoading()
    },

    onPhone (event) {
      const { formattedValue, cursorPosition } = formatPhone({
        value: event.target.value,
        cursorPosition: event.target.selectionEnd,
      })
      this.userData.phone = formattedValue ? '' : 'null'
      this.$nextTick(() => {
        this.userData.phone = formattedValue
        this.$nextTick(() => {
          event.target.setSelectionRange(cursorPosition, cursorPosition)
        })
      })
    },

    alignFioAndPassportFio (user) {
      user.firstname = user.passport.firstname || user.firstname
      user.passport.firstname = user.firstname

      user.middlename = user.passport.middlename || user.middlename
      user.passport.middlename = user.middlename

      user.lastname = user.passport.lastname || user.lastname
      user.passport.lastname = user.lastname
    },

    async repeatCode (method) {
      const response = await this.$axios.post('v2/preregistration/code/refresh', {
        once_token: this.onceToken,
        verification_by: method,
      })
      if (response?.data?.success) {
        this.launchTimer(CODE_DELAY)
        this.confirmMethod = response.data.data?.code_sended?.method
        this.confirmTarget = response.data.data?.code_sended?.target
        this.onceToken = response.data.data?.once_token
        this.showNotification({ type: 'success', text: 'Код отправлен повторно' })
      } else {
        this.showNotification({ text: getAPIError(response) || 'Не удалось запросить новый код' })
      }
    },

    async onSubmit () {
      if (!this.agree || !this.termAgree) {
        this.showNotification({
          type: 'error',
          text: 'Для продолжения использования сервиса необходимо согласиться на обработку персональных данных и с политикой в отношении обработки персональных данных.',
        })
        return
      }
      if (this.loading) return
      if (this.$refs.form.validate()) {
        this.startLoading()
        this.alignFioAndPassportFio(this.userData)

        this.userData.phone_confirmed = this.userData.phone

        let response = await this.$axios.post('v2/preregistration/create', {
          prereg_token: this.$route.query.prereg_token,
          userData: convertToBackFormat(this.outgoingFormatting(this.userData)),
          verification_by: this.verification_by,
        })

        if (response?.data?.success) {
          this.confirmMethod = response.data.data?.code_sended?.method
          this.confirmTarget = response.data.data?.code_sended?.target
          this.onceToken = response.data.data?.once_token
          this.$router.push({ query: { ...this.$route.query, onceToken: response.data.data?.once_token } })
          this.smsConfirmPopup = true
          this.launchTimer(CODE_DELAY)
        } else {
          this.showNotification({ text: getAPIError(response) || 'Ошибка при попытке отправить данные на сервер' })
        }
        this.stopLoading()
      } else {
        this.$refs.form.goToError()
      }
    },
  },
}
</script>

<style lang="scss">
.sign_up_page {
  display: flex;
  align-items: center;
  justify-content: center;

  .form_block {
    width: 100%;
    max-width: 740px;
    padding: 40px 35px 136px 35px;

    h2 {
      margin-bottom: 20px;
    }
  }

  .text_center {
    text-align: center;
  }

  .sign_label {
    color: #7a91a9;
    margin-bottom: 8px;
  }

  .form_input {
    width: 100%;
    margin-bottom: 20px;
  }

  .one_thirds {
    flex: 1;
  }

  .double_field {
    display: flex;
    row-gap: 0px;
    column-gap: 12px;
  }

  .two_thirds {
    width: 57%;
    flex: none;
  }

  .half_field {
    flex: 1;
  }

  .photo_container {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    height: 166px;
    width: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .clear_button {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    background-color: rgb(255 255 255 / 25%);
    right: 10px;
    top: 10px;
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.3s ease-in-out;

    &:hover {
      background-color: white;
    }

    img {
      width: 20px;
      height: auto;
    }
  }

  .password_input {
    width: 100%;
    margin-bottom: 25px;
  }

  .double_input {
    display: flex;
    gap: 12px;
  }

  .login_button {
    width: 100%;
  }

  .required_label::after {
    content: '*';
    display: inline-block;
    color: #eb4d3d;
    margin-left: 2px;
  }

  @media (max-width: 650px) {
    h1 {
      font-size: 28px;
      text-align: center;
    }
    .mb_40 {
      margin-bottom: 32px;
    }
    .form_block {
      padding-left: 16px;
      padding-right: 16px;
      padding: 24px 16px 24px 16px;
    }
  }

  @media (max-width: 470px) {
    .double_field {
      flex-wrap: wrap;
    }
    .two_thirds,
    .one_thirds,
    .half_field {
      width: 100%;
      flex: auto;
    }
  }

  .personal-agreement-checkbox {
    margin-top: 24px;
    gap: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .agreement-check {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    text-align: left;
    vertical-align: middle;
    .agreement-src {
      cursor: pointer;
      color: #0082de;
      text-decoration: underline;
    }
  }
}
.agreements_check {
  display: flex;
  gap: 4px;
  flex-direction: column;
}
</style>
