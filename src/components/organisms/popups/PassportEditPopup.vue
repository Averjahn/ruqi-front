<template>
  <Form class="form" ref="form">
    <Select v-model="editableUser.gender" :options="genderOptions" label="Пол" :rules="[rules.required]" />
    <Select
      v-model="editableUser.citizenship"
      :options="citizenshipOptions"
      label="Гражданство"
      :rules="[rules.required]"
    />

    <component :is="getCitizenForm()" v-model:user="editableUser" v-model:passport="editablePassport" />
  </Form>

  <div>
    <div class="button_row_global mt_8">
      <Button type="outlined" :disabled="loading" @click="$emit('close')">Отмена</Button>
      <Button :loading="loading" @click="onSave">Далее</Button>
    </div>
  </div>
</template>

<script>
import { CITIZENSHIP_OPTIONS, GENDER } from '@/constants/constants'
import FormRussianCitizen from '@/components/page/profile/documentsBlock/FormRussianCitizen.vue'
import FormEAEUCitizen from '@/components/page/profile/documentsBlock/FormEAEUCitizen.vue'
import FormOtherCitizen from '@/components/page/profile/documentsBlock/FormOtherCitizen.vue'
import PopupContainer from '@/components/atoms/PopupContainer.vue'
import { rules, rulesSets } from '@/constants/validations'
import { mapActions, mapGetters } from 'vuex'
import { convertToFrontFormat, convertToBackFormat } from '@/constants/helpers'

export default {
  name: 'PassportEditPopup',
  components: {
    FormRussianCitizen,
    FormEAEUCitizen,
    FormOtherCitizen,
    PopupContainer,
  },
  props: {
    onSuccess: {
      type: Function,
      default: () => {},
    },
  },
  data () {
    return {
      rules,
      rulesSets,
      loading: false,
      editablePassport: {},
      editableUser: {},
      citizenshipOptions: Object.values(CITIZENSHIP_OPTIONS),
      genderOptions: Object.values(GENDER),
    }
  },
  computed: {
    ...mapGetters('profilePage', ['profile']),
  },
  async mounted () {
    // await this.fetchProfileOnce()
    this.init()
  },
  unmounted () {},
  watch: {},
  methods: {
    ...mapActions('profilePage', ['putPassport', 'updateDocumentsStatuses', 'fetchProfileOnce', 'fetchProfile', 'fetchAgreements']),
    ...mapActions('notifications', ['showNotification']),

    getCitizenForm () {
      if (this.editableUser.citizenship === 'RU') return 'FormRussianCitizen'
      if (['BY', 'AM', 'KZ', 'KG'].includes(this.editableUser.citizenship)) return 'FormEAEUCitizen'
      if (this.editableUser.citizenship === 'OTHER') return 'FormOtherCitizen'
    },

    init () {
      this.editablePassport = JSON.parse(JSON.stringify(this.profile?.passport || {}))
      this.editableUser = JSON.parse(JSON.stringify(this.profile?.user || {}))
      convertToFrontFormat(this.editablePassport)
      convertToFrontFormat(this.editableUser)
    },

    async onSave () {
      if (this.loading) return
      if (!this.$refs.form.validate()) {
        this.showNotification({ type: 'error', text: 'Заполните все поля' })
        return
      }
      this.loading = true
      const result = await this.putPassport({
        passport: convertToBackFormat(this.editablePassport),
        user: convertToBackFormat(this.editableUser),
      })
      if (result) {
        this.showNotification({ type: 'success', text: 'Данные успешно сохранены' })
        this.updateDocumentsStatuses()
        await this.fetchProfile()
        this.fetchAgreements()
        this.$emit('success')
      }
      this.loading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.passport_edit_popup {
  .form {
    min-height: 300px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-bottom: 16px;
  }
}
</style>
