<template>
  <Form ref="form" class="organisation-data-form">
    <!-- Logo Upload Section -->
    <div class="organisation-data-form__logo-section">
      <LogoUpload 
        :model-value="modelValue.logo"
        @update:model-value="updateField('logo', $event)"
        :min-width="98"
        :min-height="98"
        @error="handleUploadError"
      />
    </div>

    <!-- Row 1: Вид контрагента + ИНН -->
    <FieldsRow>
      <div class="organisation-data-form__field">
        <label class="organisation-data-form__label">
          Вид контрагента*
        </label>
        <Select
          :model-value="modelValue.counterpartyType"
          @update:model-value="updateField('counterpartyType', $event)"
          :options="counterpartyTypes"
          placeholder="Выберите вид контрагента"
          class="organisation-data-form__input"
          item-value="value"
          item-text="label"
        />
      </div>
      <div class="organisation-data-form__field">
        <label class="organisation-data-form__label">
          ИНН*
        </label>
        <div class="organisation-data-form__inn-search">
          <Input
            :model-value="modelValue.inn"
            @update:model-value="updateField('inn', $event)"
            placeholder="Введите ИНН"
            :rules="[rules.required]"
            class="organisation-data-form__input"
            @input="onInnChange"
          />
        </div>
        <div v-if="dadataError" class="organisation-data-form__error">
          {{ dadataError }}
        </div>
      </div>
    </FieldsRow>

    <!-- Row 2: Полное наименование организации -->
    <div class="organisation-data-form__field organisation-data-form__field--full">
      <label class="organisation-data-form__label">
        Полное наименование организации*
      </label>
      <Input
        :model-value="modelValue.fullName"
        @update:model-value="updateField('fullName', $event)"
        placeholder="Введите полное наименование"
        :rules="[rules.required]"
        class="organisation-data-form__input"
      />
    </div>

    <!-- Row 3: КПП + ОГРН + ОКАТО -->
    <div class="organisation-data-form__fields-row-three">
      <div class="organisation-data-form__field">
        <label class="organisation-data-form__label">
          КПП*
        </label>
        <Input
          :model-value="modelValue.kpp"
          @update:model-value="updateField('kpp', $event)"
          placeholder="Введите КПП"
          :rules="[rules.required]"
          class="organisation-data-form__input"
        />
      </div>
      <div class="organisation-data-form__field">
        <label class="organisation-data-form__label">
          ОГРН*
        </label>
        <Input
          :model-value="modelValue.ogrn"
          @update:model-value="updateField('ogrn', $event)"
          placeholder="Введите ОГРН"
          :rules="[rules.required]"
          class="organisation-data-form__input"
        />
      </div>
      <div class="organisation-data-form__field">
        <label class="organisation-data-form__label">
          ОКАТО*
        </label>
        <Input
          :model-value="modelValue.okato"
          @update:model-value="updateField('okato', $event)"
          placeholder="Введите ОКАТО"
          :rules="[rules.required]"
          class="organisation-data-form__input"
        />
      </div>
    </div>

    <!-- Row 4: ФИО -->
    <div class="organisation-data-form__field organisation-data-form__field--full">
      <label class="organisation-data-form__label">
        ФИО*
      </label>
      <Input
        :model-value="modelValue.fullNamePerson"
        @update:model-value="updateField('fullNamePerson', $event)"
        placeholder="Введите ФИО"
        :rules="[rules.required]"
        class="organisation-data-form__input"
      />
    </div>

    <!-- Row 6: Должность -->
    <div class="organisation-data-form__field organisation-data-form__field--full">
      <label class="organisation-data-form__label">
        Должность*
      </label>
      <Input
        :model-value="modelValue.position"
        @update:model-value="updateField('position', $event)"
        placeholder="Введите должность"
        :rules="[rules.required]"
        class="organisation-data-form__input"
      />
    </div>

    <!-- Row 7: На основании чего -->
    <div class="organisation-data-form__field organisation-data-form__field--full">
      <label class="organisation-data-form__label">
        На основании чего*
      </label>
      <Input
        :model-value="modelValue.basis"
        @update:model-value="updateField('basis', $event)"
        placeholder="Введите основание"
        :rules="[rules.required]"
        class="organisation-data-form__input"
      />
    </div>

    <!-- Row 8: Почтовый адрес -->
    <div class="organisation-data-form__field organisation-data-form__field--full">
      <label class="organisation-data-form__label">
        Почтовый адрес*
      </label>
      <Input
        :model-value="modelValue.mailingAddress"
        @update:model-value="updateField('mailingAddress', $event)"
        placeholder="Введите почтовый адрес"
        :rules="[rules.required]"
        class="organisation-data-form__input"
      />
    </div>

    <!-- Row 9: Юридический адрес -->
    <div class="organisation-data-form__field organisation-data-form__field--full">
      <label class="organisation-data-form__label">
        Юридический адрес*
      </label>
      <Input
        :model-value="modelValue.legalAddress"
        @update:model-value="updateField('legalAddress', $event)"
        placeholder="Введите юридический адрес"
        :rules="[rules.required]"
        class="organisation-data-form__input"
      />
    </div>

    <!-- Row 10: Расчётный счёт + Корреспондентский счёт -->
    <FieldsRow>
      <div class="organisation-data-form__field">
        <label class="organisation-data-form__label">
          Расчётный счёт*
        </label>
        <Input
          :model-value="modelValue.settlementAccount"
          @update:model-value="updateField('settlementAccount', $event)"
          placeholder="Введите расчётный счёт"
          :rules="[rules.required]"
          class="organisation-data-form__input"
        />
      </div>
      <div class="organisation-data-form__field">
        <label class="organisation-data-form__label">
          Корреспондентский счёт*
        </label>
        <Input
          :model-value="modelValue.correspondentAccount"
          @update:model-value="updateField('correspondentAccount', $event)"
          placeholder="Введите корреспондентский счёт"
          :rules="[rules.required]"
          class="organisation-data-form__input"
        />
      </div>
    </FieldsRow>

    <!-- Row 11: БИК + Банк -->
    <FieldsRow>
      <div class="organisation-data-form__field">
        <label class="organisation-data-form__label">
          БИК*
        </label>
        <Input
          :model-value="modelValue.bic"
          @update:model-value="updateField('bic', $event)"
          placeholder="Введите БИК"
          :rules="[rules.required]"
          class="organisation-data-form__input"
        />
      </div>
      <div class="organisation-data-form__field">
        <label class="organisation-data-form__label">
          Банк*
        </label>
        <Input
          :model-value="modelValue.bank"
          @update:model-value="updateField('bank', $event)"
          placeholder="Введите банк"
          :rules="[rules.required]"
          class="organisation-data-form__input"
        />
      </div>
    </FieldsRow>
  </Form>
</template>

<script>
import Input from '@/components/atoms/Input.vue'
import Select from '@/components/atoms/Select.vue'
import Form from '@/components/atoms/Form.vue'
import FieldsRow from '@/components/atoms/FieldsRow.vue'
import LogoUpload from '@/components/atoms/LogoUpload.vue'
import { rules } from '@/constants/validations'
import dadataApi from '@/services/dadataApi'

export default {
  name: 'OrganisationDataForm',
  components: {
    Input,
    Select,
    Form,
    FieldsRow,
    LogoUpload
  },
  props: {
    modelValue: {
      type: Object,
      required: true
    },
    counterpartyTypes: {
      type: Array,
      default: () => [
        { value: 'physical', label: 'Физическое лицо' },
        { value: 'legal', label: 'Юридическое лицо' },
        { value: 'individual', label: 'Индивидуальный предприниматель' }
      ]
    }
  },
  emits: ['update:modelValue', 'data-filled', 'upload-error'],
  data() {
    return {
      rules,
      dadataLoading: false,
      dadataError: null
    }
  },
  methods: {
    updateField(field, value) {
      this.$emit('update:modelValue', {
        ...this.modelValue,
        [field]: value
      })
    },

    onInnChange() {
      // Очищаем ошибку при изменении ИНН
      this.dadataError = null
      
      // Если ИНН пустой - очищаем все поля
      if (!this.modelValue.inn || this.modelValue.inn.length === 0) {
        this.clearAllFields()
        return
      }
      
      // Автоматический поиск при достижении 10 или 12 символов
      const innLength = this.modelValue.inn.length
      if (innLength === 10 || innLength === 12) {
        this.searchByInn()
      }
    },

    async searchByInn() {
      if (!this.modelValue.inn || this.modelValue.inn.length < 10) {
        this.dadataError = 'ИНН должен содержать минимум 10 цифр'
        return
      }

      this.dadataLoading = true
      this.dadataError = null

      try {
        const result = await dadataApi.findParty(this.modelValue.inn)
        
        if (result.success && result.data.suggestions && result.data.suggestions.length > 0) {
          const organization = result.data.suggestions[0].data
          this.fillOrganizationData(organization)
          this.$emit('data-filled', organization)
        } else {
          this.dadataError = 'Организация не найдена'
        }
      } catch (error) {
        console.error('Ошибка при поиске организации:', error)
        this.dadataError = 'Ошибка при поиске организации'
      } finally {
        this.dadataLoading = false
      }
    },

    fillOrganizationData(organization) {
      // Заполняем поля формы данными из DaData
      const updates = {
        fullName: organization.name?.full_with_opf || organization.name?.full || '',
        kpp: organization.kpp || '',
        ogrn: organization.ogrn || '',
        okato: organization.address?.data?.okato || ''
      }
      
      // Адрес
      if (organization.address?.data) {
        const address = organization.address.data
        const fullAddress = [
          address.postal_code,
          address.region_with_type,
          address.city_with_type,
          address.street_with_type,
          address.house_with_type
        ].filter(Boolean).join(', ')
        
        updates.legalAddress = fullAddress
        updates.mailingAddress = fullAddress
      }

      // Банковские реквизиты
      if (organization.bank) {
        updates.bank = organization.bank.name || ''
        updates.bic = organization.bank.bic || ''
        updates.correspondentAccount = organization.bank.correspondent_account || ''
      }

      // Статус организации
      if (organization.type === 'LEGAL') {
        updates.counterpartyType = 'legal'
      } else if (organization.type === 'INDIVIDUAL') {
        updates.counterpartyType = 'individual'
      }

      // Должность руководителя
      if (organization.management?.post) {
        updates.position = organization.management.post
      }

      // ФИО руководителя
      if (organization.management?.name) {
        updates.fullNamePerson = organization.management.name
      }

      // Обновляем все поля сразу
      this.$emit('update:modelValue', {
        ...this.modelValue,
        ...updates
      })
    },

    clearAllFields() {
      const cleared = {
        fullName: '',
        kpp: '',
        ogrn: '',
        okato: '',
        fullNamePerson: '',
        position: '',
        basis: '',
        mailingAddress: '',
        legalAddress: '',
        settlementAccount: '',
        correspondentAccount: '',
        bic: '',
        bank: '',
        counterpartyType: this.counterpartyTypes[0]?.value || 'legal'
      }
      
      this.$emit('update:modelValue', {
        ...this.modelValue,
        ...cleared
      })
    },

    validate() {
      return this.$refs.form?.validate()
    },

    handleUploadError(errorMessage) {
      this.$emit('upload-error', errorMessage)
    }
  }
}
</script>

<style lang="scss" scoped>
.organisation-data-form {
  margin-bottom: 40px;

  &__logo-section {
    margin-bottom: 40px;
  }

  &__fields-row-three {
    display: flex;
    gap: 16px;

    .organisation-data-form__field {
      flex: 1;
    }
  }

  &__field {
    flex: 1;
    margin-bottom: 20px;

    &--full {
      flex: 100%;
    }
  }

  &__label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
    margin-bottom: 8px;
  }

  &__input,
  &__select {
    width: 100%;
    color: #666666;
  }

  &__inn-search {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__error {
    color: #dc2626;
    font-size: 14px;
    margin-top: 8px;
    padding: 8px 12px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 6px;
  }
}

@media (max-width: 768px) {
  .organisation-data-form {
    margin-bottom: 24px;

    &__logo-section {
      margin-bottom: 24px;
    }

    &__field {
      margin-bottom: 16px;

      &--full {
        margin-bottom: 16px;
      }
    }

    &__label {
      font-size: 14px;
      margin-bottom: 6px;
      color: #6b7280;
    }

    &__input,
    &__select {
      font-size: 16px; // Предотвращает зум на iOS
    }

    &__fields-row-three {
      flex-direction: column;
      gap: 16px;
    }
  }
}
</style>

