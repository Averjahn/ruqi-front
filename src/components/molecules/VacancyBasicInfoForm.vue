<template>
  <div class="vacancy-basic-info-form">
    <h2 class="vacancy-basic-info-form__title">Основное</h2>
    
    <div class="vacancy-basic-info-form__fields-row">
      <div class="vacancy-basic-info-form__field">
        <label>Профессия из справочника*</label>
        <Select
          :model-value="formData.profession"
          @update:model-value="updateField('profession', $event)"
          :options="professionOptions"
          placeholder="Выберите значение"
          item-value="value"
          item-text="label"
          clearable
        />
      </div>
      <div class="vacancy-basic-info-form__field">
        <label>Наименование вакансии</label>
        <Input
          :model-value="formData.vacancyName"
          @update:model-value="updateField('vacancyName', $event)"
          placeholder="Введите значение"
        />
      </div>
    </div>

    <!-- Ограничения -->
    <div class="vacancy-basic-info-form__restrictions">
      <h3 class="vacancy-basic-info-form__restrictions-title">Ограничения</h3>
      <div class="vacancy-basic-info-form__restrictions-grid">
        <div class="vacancy-basic-info-form__restrictions-column">
          <Checkbox
            :model-value="formData.restrictions"
            @update:model-value="updateField('restrictions', $event)"
            value="driverLicense"
          >
            Наличие водительского удостоверения
          </Checkbox>
          <Checkbox
            :model-value="formData.restrictions"
            @update:model-value="updateField('restrictions', $event)"
            value="forkliftLicense"
          >
            Удостоверение водителя штабелера
          </Checkbox>
        </div>
        <div class="vacancy-basic-info-form__restrictions-column">
          <Checkbox
            :model-value="formData.restrictions"
            @update:model-value="updateField('restrictions', $event)"
            value="patent"
          >
            Патент
          </Checkbox>
          <Checkbox
            :model-value="formData.restrictions"
            @update:model-value="updateField('restrictions', $event)"
            value="medicalBook"
          >
            Наличие мед. книжки
          </Checkbox>
        </div>
      </div>
    </div>

    <!-- Пол исполнителя -->
    <div class="vacancy-basic-info-form__gender">
      <h3 class="vacancy-basic-info-form__gender-title">Пол исполнителя</h3>
      <div class="vacancy-basic-info-form__gender-options">
        <Radio
          :model-value="formData.gender"
          @update:model-value="updateField('gender', $event)"
          value="male"
          name="gender"
        >
          Мужской
        </Radio>
        <Radio
          :model-value="formData.gender"
          @update:model-value="updateField('gender', $event)"
          value="female"
          name="gender"
        >
          Женский
        </Radio>
        <Radio
          :model-value="formData.gender"
          @update:model-value="updateField('gender', $event)"
          value="all"
          name="gender"
        >
          Все
        </Radio>
      </div>
    </div>
  </div>
</template>

<script>
import Input from '@/components/atoms/Input.vue'
import Select from '@/components/atoms/Select.vue'
import Checkbox from '@/components/atoms/Checkbox.vue'
import Radio from '@/components/atoms/Radio.vue'

export default {
  name: 'VacancyBasicInfoForm',
  components: {
    Input,
    Select,
    Checkbox,
    Radio
  },
  props: {
    formData: {
      type: Object,
      required: true
    },
    professionOptions: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:formData'],
  methods: {
    updateField(field, value) {
      this.$emit('update:formData', {
        ...this.formData,
        [field]: value
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.vacancy-basic-info-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.vacancy-basic-info-form__title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 24px;
  line-height: 1.25;
  color: #263043;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 20px;
    line-height: 28px;
  }
}

.vacancy-basic-info-form__fields-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.vacancy-basic-info-form__field {
  display: flex;
  flex-direction: column;
  gap: 4px;

  label {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-size: 14px;
    line-height: 22px;
    color: #666666;
    letter-spacing: 0.1px;
  }
}

.vacancy-basic-info-form__restrictions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.vacancy-basic-info-form__restrictions-title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: normal;
  color: #1b1b1b;
  margin: 0;
}

.vacancy-basic-info-form__restrictions-grid {
  display: flex;
  gap: 48px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
}

.vacancy-basic-info-form__restrictions-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.vacancy-basic-info-form__gender {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.vacancy-basic-info-form__gender-title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: normal;
  color: #1b1b1b;
  margin: 0;
}

.vacancy-basic-info-form__gender-options {
  display: flex;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: row;
    gap: 24px;
  }
}
</style>

