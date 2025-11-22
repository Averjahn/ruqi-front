<template>
  <div class="object-detail-content__tab-content">
    <div class="object-detail-content__toolbar-wrapper">
      <div class="object-detail-content__toolbar">
        <div class="object-detail-content__toolbar-top">
          <div class="object-detail-content__search">
            <Input
              v-model="searchQuery"
              placeholder="Поиск"
              class="object-detail-content__search-input"
              clearable
            >
              <template #left>
                <img src="@/assets/icon_deprecated/search.svg" alt="Search" class="object-detail-content__search-icon" />
              </template>
            </Input>
          </div>
          <button class="object-detail-content__filter-button" @click="handleFilterClick">
            <img src="@/assets/icons/profile/Filter.svg" alt="Filter" class="object-detail-content__filter-icon" />
          </button>
          <button class="object-detail-content__filter-button-mobile" @click="handleFilterClick">
            <img src="@/assets/icons/profile/Filter.svg" alt="Filter" class="object-detail-content__filter-icon" />
            Фильтры
          </button>
        </div>
        <div class="object-detail-content__toolbar-bottom">
          <div class="object-detail-content__vat-info">
            ндс текущий: <strong>0%</strong>
          </div>
          <Button
            type="contained"
            color="blue"
            size="m"
            @click="handleAddVacancy"
            class="object-detail-content__add-button"
          >
            <img src="@/assets/icons/profile/Add.svg" alt="Add" class="object-detail-content__add-icon" />
            Добавить вакансию
          </Button>
        </div>
      </div>
    </div>
    <!-- Vacancies Table (Desktop) -->
    <div class="object-detail-content__table-wrapper object-detail-content__table-wrapper--desktop">
      <table class="object-detail-content__table">
        <thead>
          <tr>
            <th class="object-detail-content__th object-detail-content__th--checkbox">
              <input type="checkbox" class="object-detail-content__checkbox" @change="handleSelectAll" />
            </th>
            <th class="object-detail-content__th object-detail-content__th--name">
              Вакансия
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="object-detail-content__sort-icon">
                <path d="M3 4.5L6 1.5L9 4.5M3 7.5L6 10.5L9 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </th>
            <th class="object-detail-content__th">Услуга</th>
            <th class="object-detail-content__th">Пол</th>
            <th class="object-detail-content__th">Возраст</th>
            <th class="object-detail-content__th">Ставка текущая</th>
            <th class="object-detail-content__th">Ставка плановая</th>
            <th class="object-detail-content__th">Юнит</th>
            <th class="object-detail-content__th object-detail-content__th--status">Статус</th>
            <th class="object-detail-content__th object-detail-content__th--actions">
              <input type="checkbox" class="object-detail-content__checkbox" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="vacancy in filteredVacancies"
            :key="vacancy.id"
            class="object-detail-content__row"
            :class="{ 'object-detail-content__row--selected': selectedVacancies.includes(vacancy.id) }"
          >
            <td class="object-detail-content__td object-detail-content__td--checkbox" @click.stop>
              <input
                type="checkbox"
                :checked="selectedVacancies.includes(vacancy.id)"
                @change="handleSelectVacancy(vacancy.id)"
                class="object-detail-content__checkbox"
              />
            </td>
            <td class="object-detail-content__td object-detail-content__td--name">{{ vacancy.name }}</td>
            <td class="object-detail-content__td">{{ vacancy.service }}</td>
            <td class="object-detail-content__td">{{ vacancy.gender }}</td>
            <td class="object-detail-content__td">{{ vacancy.age }}</td>
            <td class="object-detail-content__td">{{ vacancy.currentRate }}</td>
            <td class="object-detail-content__td">{{ vacancy.plannedRate }}</td>
            <td class="object-detail-content__td">{{ vacancy.unit }}</td>
            <td class="object-detail-content__td">
              <span class="object-detail-content__status" :class="getStatusClass(vacancy.status)">
                <span class="object-detail-content__status-dot"></span>
                {{ vacancy.status }}
              </span>
            </td>
            <td class="object-detail-content__td object-detail-content__td--actions" @click.stop>
              <button
                class="object-detail-content__actions-button"
                @click="handleVacancyActions(vacancy)"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="4" r="1.5" fill="currentColor"/>
                  <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                  <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="filteredVacancies.length === 0" class="object-detail-content__row object-detail-content__row--empty">
            <td :colspan="10" class="object-detail-content__td">
              <p class="object-detail-content__empty">Нет вакансий для отображения</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Vacancies Cards (Mobile) -->
    <div class="object-detail-content__cards-wrapper">
      <div
        v-for="vacancy in filteredVacancies"
        :key="vacancy.id"
        class="object-detail-content__card"
        :class="{ 'object-detail-content__card--selected': selectedVacancies.includes(vacancy.id) }"
      >
        <div class="object-detail-content__card-header">
          <input
            type="checkbox"
            :checked="selectedVacancies.includes(vacancy.id)"
            @change="handleSelectVacancy(vacancy.id)"
            class="object-detail-content__card-checkbox"
          />
          <h3 class="object-detail-content__card-title">{{ vacancy.name }}</h3>
          <button
            class="object-detail-content__card-actions"
            @click.stop="handleVacancyActions(vacancy)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="4" r="1.5" fill="currentColor"/>
              <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
              <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
            </svg>
          </button>
        </div>
        <div class="object-detail-content__card-body">
          <div class="object-detail-content__card-item">
            <span class="object-detail-content__card-label">Услуга:</span>
            <span class="object-detail-content__card-value">{{ vacancy.service }}</span>
          </div>
          <div class="object-detail-content__card-item">
            <span class="object-detail-content__card-label">Пол:</span>
            <span class="object-detail-content__card-value">{{ vacancy.gender || 'Все' }}</span>
          </div>
          <div class="object-detail-content__card-item">
            <span class="object-detail-content__card-label">Возраст:</span>
            <span class="object-detail-content__card-value">{{ vacancy.age }}</span>
          </div>
          <div class="object-detail-content__card-item">
            <span class="object-detail-content__card-label">Ставка текущая:</span>
            <span class="object-detail-content__card-value">{{ vacancy.currentRate }}</span>
          </div>
          <div class="object-detail-content__card-item">
            <span class="object-detail-content__card-label">Юнит:</span>
            <span class="object-detail-content__card-value">{{ vacancy.unit }}</span>
          </div>
        </div>
      </div>
      <div v-if="filteredVacancies.length === 0" class="object-detail-content__cards-empty">
        <p class="object-detail-content__empty">Нет вакансий для отображения</p>
      </div>
    </div>
  </div>
</template>

<script>
import Input from '@/components/atoms/Input.vue'
import Button from '@/components/atoms/Button.vue'

export default {
  name: 'VacanciesTab',
  components: {
    Input,
    Button
  },
  props: {
    vacancies: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchQuery: '',
      selectedVacancies: []
    }
  },
  computed: {
    filteredVacancies() {
      if (!this.searchQuery) return this.vacancies
      const query = this.searchQuery.toLowerCase()
      return this.vacancies.filter(vacancy =>
        vacancy.name.toLowerCase().includes(query) ||
        vacancy.service.toLowerCase().includes(query)
      )
    }
  },
  methods: {
    handleFilterClick() {
      console.log('Filter clicked')
      // TODO: Implement filter logic
    },
    handleAddVacancy() {
      console.log('Add vacancy clicked')
      // TODO: Implement add vacancy logic
    },
    handleSelectAll(event) {
      if (event.target.checked) {
        this.selectedVacancies = [...this.filteredVacancies.map(v => v.id)]
      } else {
        this.selectedVacancies = []
      }
    },
    handleSelectVacancy(vacancyId) {
      const index = this.selectedVacancies.indexOf(vacancyId)
      if (index > -1) {
        this.selectedVacancies.splice(index, 1)
      } else {
        this.selectedVacancies.push(vacancyId)
      }
    },
    handleVacancyActions(vacancy) {
      console.log('Vacancy actions:', vacancy)
      // TODO: Implement vacancy actions menu
    },
    getStatusClass(status) {
      if (status === 'На проверке') return 'object-detail-content__status--review'
      if (status === 'Активна') return 'object-detail-content__status--active'
      if (status === 'Завершена') return 'object-detail-content__status--completed'
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
// Стили наследуются от родительского компонента ObjectDetailContent
</style>

