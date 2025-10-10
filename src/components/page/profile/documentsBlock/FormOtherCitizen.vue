<template>
  <Input v-model="editableUser.citizenship_custom_name" :rules="[rules.required]" label="Название страны" />
  <Input v-model="editablePassport.lastname" :rules="[rules.required]" label="Фамилия (на русском)" />
  <Input v-model="editablePassport.firstname" :rules="[rules.required]" label="Имя (на русском)" />
  <FieldsRow>
    <Input v-model="editablePassport.middlename" label="Отчество (если есть)" />
    <DatePicker
      v-model:date="editableUser.birthday"
      label="Дата рождения"
      class="date_picker"
      format="DD.MM.YYYY"
      :airClassArr="['z_index_2']"
      :rules="rulesSets.birth"
      :airOptions="{ maxDate: $dayjs().subtract(14, 'year'), minDate: '1930-01-01' }"
      clearable
    />
  </FieldsRow>
  <Input v-model="editablePassport.birth_address" :rules="[rules.required]" label="Место рождения" />
  <Select
    v-model="editablePassport.identity_document"
    :options="identityDocumentOptions"
    :rules="[rules.required]"
    label="Документ удостоверяющий личность"
  />
  <Input v-model="editablePassport.series_and_number" :rules="[rules.required]" label="Серия и номер документа" />
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

  <SearchAutocomplete
    v-model="editablePassport.registration_address"
    :rules="[rules.required]"
    label="Адрес регистрации в РФ"
    :zIndex="450"
  />
  <Input v-model="editableUser.settings.inn" maxlength="12" :rules="[rules.validateInn]" label="ИНН" />
</template>

<script>
import { mapActions } from 'vuex'
import { rules, rulesSets } from '@/constants/validations'
import { IDENTITY_DOCUMENT_TYPE } from '@/constants/constants'
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
      identityDocumentOptions: Object.values(IDENTITY_DOCUMENT_TYPE),
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
    editablePassport: {
      get () {
        return this.passport
      },
      set (val) {
        this.$emit('update:passport', val)
      },
    },
  },
  methods: {
    ...mapActions('notifications', ['showNotification']),
  },
}
</script>

<style lang="scss" scoped></style>
