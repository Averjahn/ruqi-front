<template>
  <div class="vacancy-rates-form">
    <div class="vacancy-rates-form__header">
      <h2 class="vacancy-rates-form__title">Значения ставок вакансии</h2>
      <p class="vacancy-rates-form__description">
        Краткое описание что сюда писать, например напишите в наименовании общедоступное название и примерное расположение.
      </p>
    </div>
    
    <div class="vacancy-rates-form__fields-row">
      <div class="vacancy-rates-form__field">
        <label>Ставка за</label>
        <Select
          :model-value="formData.ratePer"
          @update:model-value="updateField('ratePer', $event)"
          :options="ratePerOptions"
          placeholder="Выберите значение"
          item-value="value"
          item-text="label"
          clearable
        />
      </div>
      <div class="vacancy-rates-form__field">
        <label>Количество часов в смене</label>
        <Input
          :model-value="formData.hoursPerShift"
          @update:model-value="updateField('hoursPerShift', $event)"
          placeholder="8"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Input from '@/components/atoms/Input.vue'
import Select from '@/components/atoms/Select.vue'

export default {
  name: 'VacancyRatesForm',
  components: {
    Input,
    Select
  },
  props: {
    formData: {
      type: Object,
      required: true
    },
    ratePerOptions: {
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
.vacancy-rates-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.vacancy-rates-form__header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.vacancy-rates-form__title {
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

.vacancy-rates-form__description {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 14px;
  line-height: 22px;
  color: #666666;
  margin: 0;
  letter-spacing: 0.1px;
}

.vacancy-rates-form__fields-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

.vacancy-rates-form__field {
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
</style>

