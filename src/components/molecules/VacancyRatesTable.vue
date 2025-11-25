<template>
  <div class="vacancy-rates-table">
    <div class="vacancy-rates-table__header">
      <h2 class="vacancy-rates-table__title">Ставки для исполнителя</h2>
      <button class="vacancy-rates-table__add-button" @click="$emit('add-rate')">
        <img src="@/assets/icons/profile/plus.svg" alt="Add" />
        Добавить ставку
      </button>
    </div>

    <div class="vacancy-rates-table__wrapper">
      <!-- Desktop: Table -->
      <table class="vacancy-rates-table__table">
        <thead>
          <tr>
            <th>Ед. измер.</th>
            <th>Ставка</th>
            <th>Начислено за смену</th>
            <th>К оплате с НПД</th>
            <th>Тип</th>
            <th>Норматив</th>
            <th>Дейтсвует с</th>
            <th>Статус</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(rate, index) in rates" :key="rate.id">
            <td>{{ rate.unit }}</td>
            <td>
              <Input
                v-if="index > 0"
                :model-value="rate.amount"
                @update:model-value="updateRate(rate.id, 'amount', $event)"
                placeholder=""
                class="vacancy-rates-table__rate-input"
              />
              <span v-else>{{ formatCurrency(rate.amount) }}</span>
            </td>
            <td>{{ formatCurrency(rate.accruedPerShift) }}</td>
            <td>{{ formatCurrency(rate.withVAT) }}</td>
            <td>{{ rate.type }}</td>
            <td>
              <Input
                v-if="index > 0"
                :model-value="rate.standard"
                @update:model-value="updateRate(rate.id, 'standard', $event)"
                placeholder=""
                class="vacancy-rates-table__rate-input"
              />
              <span v-else>{{ rate.standard }}</span>
            </td>
            <td>
              <span :class="{ 'vacancy-rates-table__date-link': index > 0 }">{{ rate.validFrom }}</span>
            </td>
            <td>
              <span v-if="rate.status" class="vacancy-rates-table__status-badge">{{ rate.status }}</span>
            </td>
            <td>
              <button class="vacancy-rates-table__delete-button" @click="$emit('remove-rate', rate.id)">
                <img src="@/assets/icons/trash.svg" alt="Delete" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Mobile: Cards -->
      <div class="vacancy-rates-table__cards">
        <div
          v-for="(rate, index) in rates"
          :key="rate.id"
          class="vacancy-rates-table__card"
          :class="{ 'vacancy-rates-table__card--current': rate.status === 'Текущая' }"
        >
          <div class="vacancy-rates-table__card-header">
            <div class="vacancy-rates-table__card-title-row">
              <h3 class="vacancy-rates-table__card-title">Ставка</h3>
              <span v-if="rate.status" class="vacancy-rates-table__card-status-badge">{{ rate.status }}</span>
            </div>
            <div class="vacancy-rates-table__card-actions">
              <button class="vacancy-rates-table__card-delete" @click="$emit('remove-rate', rate.id)">
                <img src="@/assets/icons/trash.svg" alt="Delete" />
              </button>
              <button 
                class="vacancy-rates-table__card-toggle"
                @click="toggleCard(rate.id)"
              >
                <img 
                  src="@/assets/icons/chevron_down.svg" 
                  alt="Toggle"
                  class="vacancy-rates-table__card-toggle-icon"
                  :class="{ 'vacancy-rates-table__card-toggle-icon--rotated': isCardExpanded(rate.id) }"
                />
              </button>
            </div>
          </div>
          
          <div v-if="isCardExpanded(rate.id)" class="vacancy-rates-table__card-content">
            <div class="vacancy-rates-table__card-fields-row">
              <div class="vacancy-rates-table__card-field">
                <label>Ставка</label>
                <Input
                  v-if="index > 0"
                  :model-value="rate.amount"
                  @update:model-value="updateRate(rate.id, 'amount', $event)"
                  placeholder="Введите значение"
                />
                <span v-else>{{ formatCurrency(rate.amount) }}</span>
              </div>
              <div class="vacancy-rates-table__card-field">
                <label>Ставка в час</label>
                <Input
                  v-if="index > 0"
                  :model-value="rate.accruedPerShift"
                  @update:model-value="updateRate(rate.id, 'accruedPerShift', $event)"
                  placeholder="Введите значение"
                />
                <span v-else>{{ formatCurrency(rate.accruedPerShift) }}</span>
              </div>
              <div class="vacancy-rates-table__card-field">
                <label>К оплате с НПД</label>
                <span>{{ formatCurrency(rate.withVAT) }}</span>
              </div>
              <div class="vacancy-rates-table__card-field">
                <label>Тип</label>
                <span>{{ rate.type }}</span>
              </div>
            </div>
            <div class="vacancy-rates-table__card-fields-row">
              <div class="vacancy-rates-table__card-field">
                <label>Ед. измерения</label>
                <Select
                  :model-value="rate.unit"
                  @update:model-value="updateRate(rate.id, 'unit', $event)"
                  :options="[{ value: 'Час', label: 'Час' }]"
                  placeholder="Выбрать"
                />
              </div>
              <div class="vacancy-rates-table__card-field">
                <label>Норматив</label>
                <Input
                  v-if="index > 0"
                  :model-value="rate.standard"
                  @update:model-value="updateRate(rate.id, 'standard', $event)"
                  placeholder="Введите значение"
                />
                <span v-else>{{ rate.standard }}</span>
              </div>
            </div>
            <div class="vacancy-rates-table__card-field">
              <label>Действует с</label>
              <Input
                :model-value="rate.validFrom"
                @update:model-value="updateRate(rate.id, 'validFrom', $event)"
                placeholder="дд.мм.гггг"
                type="date"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Input from '@/components/atoms/Input.vue'
import Select from '@/components/atoms/Select.vue'

export default {
  name: 'VacancyRatesTable',
  components: {
    Input,
    Select
  },
  props: {
    rates: {
      type: Array,
      required: true
    }
  },
  emits: ['add-rate', 'remove-rate', 'update-rate'],
  data() {
    return {
      expandedCards: [] // Массив ID развернутых карточек
    }
  },
  mounted() {
    // По умолчанию первая карточка развернута
    this.initExpandedCards()
  },
  watch: {
    rates: {
      handler() {
        // При изменении списка ставок обновляем развернутые карточки
        this.initExpandedCards()
      },
      deep: true
    }
  },
  methods: {
    formatCurrency(value) {
      if (!value) return ''
      const num = typeof value === 'string' ? parseFloat(value.replace(/\s/g, '')) : value
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(num).replace('₽', '₽')
    },
    updateRate(rateId, field, value) {
      this.$emit('update-rate', { rateId, field, value })
    },
    initExpandedCards() {
      // По умолчанию первая карточка развернута, если список пуст или первая карточка еще не развернута
      if (this.rates.length > 0) {
        const firstRateId = this.rates[0].id
        if (!this.expandedCards.includes(firstRateId) && this.expandedCards.length === 0) {
          this.expandedCards = [firstRateId]
        }
      }
    },
    isCardExpanded(rateId) {
      return this.expandedCards.includes(rateId)
    },
    toggleCard(rateId) {
      const index = this.expandedCards.indexOf(rateId)
      if (index > -1) {
        this.expandedCards.splice(index, 1)
      } else {
        this.expandedCards.push(rateId)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.vacancy-rates-table {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.vacancy-rates-table__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.vacancy-rates-table__title {
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

.vacancy-rates-table__add-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #1735f5;
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 26px;
  cursor: pointer;
  padding: 0;

  img {
    width: 24px;
    height: 24px;
  }
}

.vacancy-rates-table__wrapper {
  border: 1px solid #e3e5e4;
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: 768px) {
    border: none;
    border-radius: 0;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
}

.vacancy-rates-table__table {
  width: 100%;
  border-collapse: collapse;

  @media (max-width: 768px) {
    display: none; // Скрываем таблицу на мобильных
  }

  thead {
    background: #fbfbfb;
    border-bottom: 1px solid #f3f3f3;
  }

  th {
    padding: 12px 8px 13px;
    text-align: left;
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-size: 12px;
    line-height: 16px;
    color: #666666;
    font-weight: 400;
    letter-spacing: 0.1px;
    border-right: 1px solid #f3f3f3;
  }

  tbody tr {
    border-bottom: 1px solid #f3f3f3;
  }

  td {
    padding: 16px 8px 17px;
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-size: 14px;
    line-height: 22px;
    color: #263043;
    border-right: 1px solid #f3f3f3;
  }

  td:last-child {
    border-right: none;
    width: 52px;
  }
}

.vacancy-rates-table__rate-input {
  :deep(.input_section) {
    height: 40px;
  }
}

.vacancy-rates-table__date-link {
  text-decoration: underline;
  color: #263043;
}

.vacancy-rates-table__status-badge {
  display: inline-block;
  padding: 1px 8px;
  background: #e6f4ff;
  border: 1px solid #91caff;
  border-radius: 4px;
  color: #1735f5;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.1px;
}

.vacancy-rates-table__delete-button {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;

  img {
    width: 16px;
    height: 16px;
    filter: grayscale(1);
    transition: filter 0.2s ease;
  }

  &:hover img {
    filter: brightness(0) saturate(100%) invert(58%) sepia(59%) saturate(4717%) hue-rotate(341deg) brightness(99%) contrast(92%);
  }
}

// Mobile: Cards
.vacancy-rates-table__cards {
  display: none; // Скрыто на десктопе

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
}

.vacancy-rates-table__card {
  border: 1px solid #e3e5e4;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.vacancy-rates-table__card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.vacancy-rates-table__card-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.vacancy-rates-table__card-title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: normal;
  color: #263043;
  margin: 0;
}

.vacancy-rates-table__card-status-badge {
  display: inline-block;
  padding: 1px 8px;
  background: #e6f4ff;
  border: 1px solid #91caff;
  border-radius: 4px;
  color: #1735f5;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.1px;
}

.vacancy-rates-table__card-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.vacancy-rates-table__card-delete,
.vacancy-rates-table__card-toggle {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;

  img {
    width: 16px;
    height: 16px;
    filter: grayscale(1);
    transition: transform 0.2s ease;
  }

  &-icon {
    &--rotated {
      transform: rotate(180deg);
    }
  }
}

.vacancy-rates-table__card-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.vacancy-rates-table__card-fields-row {
  display: flex;
  gap: 12px;
}

.vacancy-rates-table__card-field {
  flex: 1;
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

  span {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-size: 14px;
    line-height: 22px;
    color: #263043;
  }
}
</style>

