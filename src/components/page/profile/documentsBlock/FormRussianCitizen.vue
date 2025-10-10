<template>
  <Input v-model="editablePassport.lastname" :rules="rulesSets.lastName" label="Фамилия" />
  <Input v-model="editablePassport.firstname" :rules="rulesSets.firstName" label="Имя" />
  <FieldsRow>
    <Input v-model="editablePassport.middlename" :rules="rulesSets.middleName" label="Отчество" />
    <DatePicker
      v-model:date="editableUser.birthday"
      format="DD.MM.YYYY"
      label="Дата рождения"
      :airClassArr="['z_index_2']"
      :airOptions="{ maxDate: $dayjs().subtract(14, 'year'), minDate: '1930-01-01' }"
      :rules="rulesSets.birth"
      clearable
    />
  </FieldsRow>

  <Input v-model="editablePassport.birth_address" :rules="[rules.required]" label="Место рождения" />

  <FieldsRow>
    <Input
      :value="editablePassport.series"
      :rules="[rules.required, rules.onlyNumbers]"
      @input="onPassportSeries"
      label="Серия паспорта"
    />
    <Input
      :value="editablePassport.number"
      :rules="[rules.required, rules.onlyNumbers]"
      @input="onPassportNumber"
      label="Номер паспорта"
    />
  </FieldsRow>

  <FieldsRow>
    <DatePicker
      v-model:date="editablePassport.issue_date"
      label="Дата выдачи"
      format="DD.MM.YYYY"
      :airClassArr="['z_index_2']"
      :rules="[rules.required, rules.date, rules.notInFuture]"
      :airOptions="{ maxDate: $dayjs() }"
      clearable
    />
    <Input
      :value="editablePassport.issue_organization_code"
      :rules="[rules.required]"
      @input="onDivisionCode"
      label="Код подразделения"
    />
  </FieldsRow>

  <Input v-model="editablePassport.issue_organization_name" :rules="[rules.required]" label="Кем выдан" />
  <SearchAutocomplete
    v-model="editablePassport.registration_address"
    :rules="[rules.required]"
    :zIndex="450"
    label="Адрес регистрации"
  />
  <Input v-model="editableUser.settings.inn" maxlength="12" :rules="[rules.validateInn]" label="ИНН" />
</template>

<script>
import { mapActions } from 'vuex'
import { formatNumericString } from '@/constants/masks'
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

    onPassportSeries (event) {
      const { formattedValue, cursorPosition } = formatNumericString({
        value: event.target.value,
        pattern: '****',
        cursorPosition: event.target.selectionEnd,
      })
      this.editablePassport.series = formattedValue ? '' : 'null'
      this.$nextTick(() => {
        this.editablePassport.series = formattedValue
        this.$nextTick(() => {
          event.target.setSelectionRange(cursorPosition, cursorPosition)
        })
      })
    },

    onPassportNumber (event) {
      const { formattedValue, cursorPosition } = formatNumericString({
        value: event.target.value,
        pattern: '******',
        cursorPosition: event.target.selectionEnd,
      })
      this.editablePassport.number = formattedValue ? '' : 'null'
      this.$nextTick(() => {
        this.editablePassport.number = formattedValue
        this.$nextTick(() => {
          event.target.setSelectionRange(cursorPosition, cursorPosition)
        })
      })
    },

    onDivisionCode (event) {
      const { formattedValue, cursorPosition } = formatNumericString({
        value: event.target.value,
        pattern: '***-***',
        cursorPosition: event.target.selectionEnd,
      })
      this.editablePassport.issue_organization_code = formattedValue ? '' : 'null'
      this.$nextTick(() => {
        this.editablePassport.issue_organization_code = formattedValue
        this.$nextTick(() => {
          event.target.setSelectionRange(cursorPosition, cursorPosition)
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
