<template>
  <Input v-model="editablePassport.lastname" :rules="rulesSets.lastName" label="Фамилия" validationType="input" />
  <Input v-model="editablePassport.firstname" :rules="rulesSets.firstName" label="Имя" validationType="input" />
  <FieldsRow>
    <Input
      v-model="editablePassport.middlename"
      :rules="rulesSets.middleName"
      label="Отчество"
      validationType="input"
    />
    <DatePicker
      v-model:date="editableUser.birthday"
      label="Дата рождения"
      class="date_picker"
      format="DD.MM.YYYY"
      :airClassArr="['z_index_2']"
      :airOptions="{ maxDate: $dayjs().subtract(14, 'year'), minDate: '1930-01-01' }"
      :rules="rulesSets.birth"
      clearable
    />
  </FieldsRow>
  <Input v-model="editablePassport.birth_address" :rules="[rules.required]" label="Место рождения" />
  <Input
    v-model="editablePassport[getPassportNumber]"
    :rules="[rules.required]"
    :label="editableUserCitizenship === 'BY' ? 'Номер документа' : 'Серия и номер документа'"
  />
  <Input
    v-if="editableUserCitizenship === 'BY'"
    v-model="editablePassport.by_id_number"
    :rules="[rules.required]"
    label="Идентификационный номер"
  />

  <FieldsRow>
    <DatePicker
      v-model:date="editablePassport.issue_date"
      label="Дата выдачи"
      class="date_picker"
      format="DD.MM.YYYY"
      :airClassArr="['z_index_2']"
      :rules="[rules.required, rules.date, rules.notInFuture]"
      :airOptions="{ maxDate: $dayjs() }"
      clearable
    />
    <DatePicker
      v-model:date="editablePassport.expiration_date"
      label="Срок действия"
      class="date_picker"
      format="DD.MM.YYYY"
      :airClassArr="['z_index_2']"
      :rules="[rules.required, rules.date]"
      clearable
    />
  </FieldsRow>

  <Input v-model="editablePassport.issue_organization_name" :rules="[rules.required]" label="Кем выдан" />

  <SearchAutocomplete
    v-model="editablePassport.registration_address"
    :rules="[rules.required]"
    :zIndex="450"
    label="Адрес регистрации в РФ"
  />

  <Input v-model="editableUser.settings.inn" maxlength="12" :rules="[rules.validateInn]" label="ИНН" />
</template>

<script>
import { mapActions } from 'vuex'
import { rules, rulesSets } from '@/constants/validations'
import SearchAutocomplete from '@/components/organisms/SearchAutocomplete.vue'

export default {
  components: { SearchAutocomplete },
  props: {
    passport: {
      type: Object,
      default: () => {},
      required: true,
    },
    user: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data () {
    return {
      rules,
      rulesSets,
    }
  },
  computed: {
    editableUser: {
      get () {
        return this.user
      },
      set (val) {
        this.$emit('update:user', val)
      },
    },
    editableUserCitizenship: {
      get () {
        return this.user.citizenship
      },
    },
    editablePassport: {
      get () {
        return this.passport
      },
      set (val) {
        this.$emit('update:passport', val)
      },
    },
    getPassportNumber: {
      get () {
        if (this.editableUserCitizenship === 'AM') {
          return 'am_number'
        } else if (this.editableUserCitizenship === 'KZ') {
          return 'kz_number'
        } else if (this.editableUserCitizenship === 'KG') {
          return 'kg_number'
        } else {
          return 'by_number'
        }
      },
    },
  },
  methods: {
    ...mapActions('notifications', ['showNotification']),
  },
}
</script>

<style lang="scss" scoped></style>
