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

    <!-- Row 1 Desktop: Вид контрагента + Ставка НДС -->
    <FieldsRow type="flex-flex" class="organisation-data-form__row-1-desktop">
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
      <div class="organisation-data-form__field organisation-data-form__row-vat-desktop">
        <label class="organisation-data-form__label">
          Ставка НДС*
        </label>
        <Select
          :model-value="modelValue.vatRate"
          @update:model-value="updateField('vatRate', $event)"
          :options="vatRateOptions"
          placeholder="Выберите значение"
          class="organisation-data-form__input"
          item-value="value"
          item-text="label"
        />
      </div>
    </FieldsRow>

    <!-- Row 1 Mobile: Вид контрагента + Ставка НДС -->
    <FieldsRow type="flex-flex" class="organisation-data-form__row-1-mobile">
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
          Ставка НДС*
        </label>
        <Select
          :model-value="modelValue.vatRate"
          @update:model-value="updateField('vatRate', $event)"
          :options="vatRateOptions"
          placeholder="Выберите значение"
          class="organisation-data-form__input"
          item-value="value"
          item-text="label"
        />
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

    <!-- Row 2.5 Desktop: ИНН -->
    <div class="organisation-data-form__field organisation-data-form__field--full organisation-data-form__field-inn organisation-data-form__field-inn-desktop">
      <label class="organisation-data-form__label">
        ИНН*
      </label>
      <div class="organisation-data-form__inn-search">
        <Input
          :model-value="modelValue.inn"
          @update:model-value="handleInnUpdate"
          placeholder="Введите ИНН"
          :rules="[rules.required]"
          class="organisation-data-form__input"
        />
      </div>
      <div v-if="dadataError" class="organisation-data-form__error">
        {{ dadataError }}
      </div>
    </div>

    <!-- Row 3 Desktop: КПП + ОГРН + ОКАТО -->
    <!-- Row 3 Mobile: ОКАТО + ИНН -->
    <div class="organisation-data-form__fields-row-three organisation-data-form__row-3-desktop">
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

    <!-- Row 3 Mobile: ОКАТО + ИНН -->
    <FieldsRow class="organisation-data-form__row-3-mobile">
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
      <div class="organisation-data-form__field organisation-data-form__field-inn-mobile">
        <label class="organisation-data-form__label">
          ИНН*
        </label>
        <div class="organisation-data-form__inn-search">
          <Input
            :model-value="modelValue.inn"
            @update:model-value="handleInnUpdate"
            placeholder="Введите ИНН"
            :rules="[rules.required]"
            class="organisation-data-form__input"
          />
        </div>
        <div v-if="dadataError" class="organisation-data-form__error">
          {{ dadataError }}
        </div>
      </div>
    </FieldsRow>

    <!-- Row 4 Mobile: КПП + ОГРН -->
    <FieldsRow class="organisation-data-form__row-4-mobile">
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
    </FieldsRow>

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
      dadataError: null,
      searchTimeout: null,
      currentSearchInn: null,
      vatRateOptions: [
        { value: '0', label: '0%' },
        { value: '10', label: '10%' },
        { value: '20', label: '20%' },
        { value: 'without', label: 'Без НДС' }
      ]
    }
  },
  beforeUnmount() {
    // Очищаем таймер при размонтировании компонента
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
  },
  methods: {
    updateField(field, value) {
      this.$emit('update:modelValue', {
        ...this.modelValue,
        [field]: value
      })
    },

    handleInnUpdate(value) {
      // Очищаем предыдущий таймер, если он есть
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
        this.searchTimeout = null
      }
      
      // Очищаем ошибку при изменении ИНН
      this.dadataError = null
      
      // Если ИНН пустой - очищаем все поля, включая сам ИНН
      if (!value || value.length === 0) {
        this.currentSearchInn = null
        // Обновляем все поля, включая ИНН, одним событием
        const cleared = {
          inn: '',
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
          vatRate: '',
          counterpartyType: this.counterpartyTypes[0]?.value || 'legal'
        }
        this.$emit('update:modelValue', {
          ...this.modelValue,
          ...cleared
        })
        return
      }
      
      // Обновляем поле ИНН
      this.updateField('inn', value)
      
      // Автоматический поиск при достижении 10 или 12 символов с debounce
      const innLength = value.length
      if (innLength === 10 || innLength === 12) {
        // Сохраняем текущий ИНН для проверки после загрузки
        this.currentSearchInn = value
        
        // Добавляем задержку перед поиском, чтобы пользователь успел закончить ввод
        this.searchTimeout = setTimeout(() => {
          // Проверяем, что ИНН не изменился за время ожидания
          if (this.currentSearchInn === value) {
            this.searchByInn(value)
          }
        }, 500) // Задержка 500ms
      } else {
        this.currentSearchInn = null
      }
    },

    async searchByInn(inn = null) {
      const innToSearch = inn || this.modelValue.inn
      
      if (!innToSearch || innToSearch.length < 10) {
        this.dadataError = 'ИНН должен содержать минимум 10 цифр'
        return
      }

      // Проверяем, что ИНН не изменился во время загрузки
      if (this.currentSearchInn && this.currentSearchInn !== innToSearch) {
        // ИНН изменился, не показываем ошибку
        return
      }

      this.dadataLoading = true
      this.dadataError = null

      try {
        const result = await dadataApi.findParty(innToSearch)
        
        // Проверяем, что ИНН не изменился после получения ответа
        if (this.currentSearchInn && this.currentSearchInn !== innToSearch) {
          // ИНН изменился, игнорируем результат
          return
        }
        
        if (result.success && result.data.suggestions && result.data.suggestions.length > 0) {
          const organization = result.data.suggestions[0].data
          this.fillOrganizationData(organization)
          this.$emit('data-filled', organization)
          // Очищаем ошибку, если данные успешно загружены
          this.dadataError = null
        } else {
          // Показываем ошибку только если ИНН не изменился
          if (!this.currentSearchInn || this.currentSearchInn === innToSearch) {
            this.dadataError = 'Организация не найдена'
          }
        }
      } catch (error) {
        console.error('Ошибка при поиске организации:', error)
        // Показываем ошибку только если ИНН не изменился
        if (!this.currentSearchInn || this.currentSearchInn === innToSearch) {
          this.dadataError = 'Ошибка при поиске организации'
        }
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
        vatRate: '',
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

    // Скрываем десктопные блоки в мобильной версии
    &__row-1-desktop,
    &__row-3-desktop,
    &__row-vat-desktop {
      display: none;
    }

    // Скрываем ИНН из десктопной версии
    &__field-inn-desktop {
      display: none;
    }

    // Показываем мобильные блоки
    &__row-1-mobile,
    &__row-3-mobile,
    &__row-4-mobile {
      display: flex;
      
      .organisation-data-form__field {
        flex: 1;
        min-width: 0;
      }
    }

    &__fields-row-three {
      display: none; // Скрываем тройной ряд в мобильной версии
    }
  }
}

@media (min-width: 769px) {
  .organisation-data-form {
    // Скрываем мобильные блоки в десктопной версии
    &__row-1-mobile,
    &__row-3-mobile,
    &__row-4-mobile {
      display: none;
    }

    // Показываем десктопные блоки
    &__row-1-desktop,
    &__row-3-desktop {
      display: flex;
    }

    &__row-vat-desktop {
      display: block;
    }

    // Показываем ИНН в десктопной версии
    &__field-inn-desktop {
      display: block;
    }
  }
}
</style>

