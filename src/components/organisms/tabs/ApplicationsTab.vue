<template>
  <div class="object-detail-content__tab-content">
    <!-- Toolbar -->
    <div class="object-detail-content__toolbar">
      <div class="object-detail-content__toolbar-left">
        <div class="object-detail-content__search">
          <Input
            v-model="applicationsSearchQuery"
            placeholder="Поиск"
            class="object-detail-content__search-input"
            clearable
          >
            <template #left>
              <img src="@/assets/icon_deprecated/search.svg" alt="Search" class="object-detail-content__search-icon" />
            </template>
          </Input>
        </div>
        <Select
          v-model="applicationsStatusFilter"
          :options="statusFilterOptions"
          placeholder="Статус"
          clearable
          class="object-detail-content__status-filter"
          item-value="value"
          item-text="label"
        />
        <div class="object-detail-content__date-filter">
          <Input
            v-model="applicationsDateFilter"
            placeholder="Даты"
            class="object-detail-content__date-input"
            readonly
          >
            <template #right>
              <img src="@/assets/icon_deprecated/calendar.svg" alt="Calendar" class="object-detail-content__calendar-icon" />
            </template>
          </Input>
        </div>
      </div>
      <div class="object-detail-content__toolbar-right">
        <Button
          type="contained"
          color="blue"
          size="m"
          @click="handleNewApplication"
          class="object-detail-content__add-button"
        >
          <img src="@/assets/icons/profile/Add.svg" alt="Add" class="object-detail-content__add-icon" />
          Новая заявка
        </Button>
      </div>
    </div>

    <!-- Bulk actions (панель массовых действий, как в дизайне заявок) -->
    <div
      v-if="selectedApplications.length > 0"
      class="object-detail-content__bulk-actions"
    >
      <div class="object-detail-content__bulk-actions-info">
        <span class="object-detail-content__bulk-actions-label">Выбрано:</span>
        <span class="object-detail-content__bulk-actions-counter">
          {{ selectedApplications.length }}
        </span>
      </div>
      <button
        type="button"
        class="object-detail-content__bulk-action"
        @click="handleBulkCreateCopies"
      >
        <img src="@/assets/icons/profile/copy.svg" alt="Copy" class="object-detail-content__bulk-action-icon" />
        <span class="object-detail-content__bulk-action-text">Создать копии</span>
      </button>
      <button
        type="button"
        class="object-detail-content__bulk-action"
        @click="handleBulkDownloadPerformers"
      >
        <img src="@/assets/icons/profile/download.svg" alt="Download" class="object-detail-content__bulk-action-icon" />
        <span class="object-detail-content__bulk-action-text">Скачать список исполнителей</span>
      </button>
      <button
        type="button"
        class="object-detail-content__bulk-action"
        @click="handleBulkDelete"
      >
        <img src="@/assets/icons/delete.svg" alt="Delete" class="object-detail-content__bulk-action-icon object-detail-content__bulk-action-icon--delete" />
        <span class="object-detail-content__bulk-action-text">Удалить</span>
      </button>
    </div>

    <!-- Applications Table -->
    <div class="object-detail-content__table-wrapper">
      <table class="object-detail-content__table">
        <thead>
          <tr>
            <th class="object-detail-content__th object-detail-content__th--checkbox">
              <input type="checkbox" class="object-detail-content__checkbox" @change="handleSelectAllApplications" />
            </th>
            <th class="object-detail-content__th object-detail-content__th--name">
              Название заявки
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="object-detail-content__sort-icon">
                <path d="M3 4.5L6 1.5L9 4.5M3 7.5L6 10.5L9 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </th>
            <th class="object-detail-content__th">Ставка</th>
            <th class="object-detail-content__th">Статус</th>
            <th class="object-detail-content__th">Набор от</th>
            <th class="object-detail-content__th">Набор до</th>
            <th class="object-detail-content__th">Наполнение</th>
            <th class="object-detail-content__th object-detail-content__th--actions">
              <button
                v-if="selectedApplications.length > 0"
                type="button"
                class="object-detail-content__actions-button object-detail-content__actions-button--header"
                @click.stop
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="8" cy="4" r="1.5" fill="currentColor" />
                  <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                  <circle cx="8" cy="12" r="1.5" fill="currentColor" />
                </svg>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="application in filteredApplications"
            :key="application.id"
            class="object-detail-content__row"
            :class="{ 'object-detail-content__row--selected': selectedApplications.includes(application.id) }"
            @click="handleApplicationClick(application, $event)"
          >
            <td class="object-detail-content__td object-detail-content__td--checkbox" @click.stop>
              <input
                type="checkbox"
                :checked="selectedApplications.includes(application.id)"
                @change="handleSelectApplication(application.id)"
                class="object-detail-content__checkbox"
              />
            </td>
            <td class="object-detail-content__td object-detail-content__td--name">{{ application.name }}</td>
            <td class="object-detail-content__td">{{ application.rate || '-' }}</td>
            <td class="object-detail-content__td">
              <span class="object-detail-content__status" :class="getApplicationStatusClass(application.status)">
                <span class="object-detail-content__status-dot"></span>
                {{ application.status }}
              </span>
            </td>
            <td class="object-detail-content__td">{{ application.recruitmentStart || '-' }}</td>
            <td class="object-detail-content__td">{{ application.recruitmentEnd || '-' }}</td>
            <td class="object-detail-content__td">
              <span class="object-detail-content__filling" :class="getFillingClass(application.filling)">
                <img src="@/assets/icons/profile/People.svg" alt="People" class="object-detail-content__filling-icon" />
                {{ application.filling }}
              </span>
            </td>
            <td class="object-detail-content__td object-detail-content__td--actions" @click.stop>
              <button
                class="object-detail-content__actions-button"
                @click="handleApplicationActions(application)"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="4" r="1.5" fill="currentColor"/>
                  <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                  <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="filteredApplications.length === 0" class="object-detail-content__row object-detail-content__row--empty">
            <td :colspan="8" class="object-detail-content__td">
              <p class="object-detail-content__empty">Нет заявок для отображения</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Input from '@/components/atoms/Input.vue'
import Select from '@/components/atoms/Select.vue'
import Button from '@/components/atoms/Button.vue'

export default {
  name: 'ApplicationsTab',
  components: {
    Input,
    Select,
    Button
  },
  props: {
    applications: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      applicationsSearchQuery: '',
      selectedApplications: [],
      applicationsStatusFilter: null,
      applicationsDateFilter: '',
      statusFilterOptions: [
        { label: 'В работе', value: 'active' },
        { label: 'Завершена', value: 'completed' },
        { label: 'На проверке', value: 'review' },
        { label: 'Отменена', value: 'cancelled' }
      ]
    }
  },
  computed: {
    filteredApplications() {
      let filtered = this.applications
      
      // Поиск
      if (this.applicationsSearchQuery) {
        const query = this.applicationsSearchQuery.toLowerCase()
        filtered = filtered.filter(application =>
          application.name.toLowerCase().includes(query)
        )
      }
      
      // Фильтр по статусу
      if (this.applicationsStatusFilter) {
        const statusMap = {
          'active': 'В работе',
          'completed': 'Завершена',
          'review': 'На проверке',
          'cancelled': 'Отменена'
        }
        filtered = filtered.filter(application =>
          application.status === statusMap[this.applicationsStatusFilter]
        )
      }
      
      return filtered
    }
  },
  watch: {
    filteredApplications() {
      // Очищаем выбранные заявки, которые больше не в отфильтрованном списке
      const filteredIds = this.filteredApplications.map(a => a.id)
      this.selectedApplications = this.selectedApplications.filter(id => filteredIds.includes(id))
    }
  },
  methods: {
    handleNewApplication() {
      console.log('New application clicked')
      // TODO: Implement new application logic
    },
    getFillingClass(filling) {
      if (!filling) return ''
      const [filled, total] = filling.split('/').map(Number)
      const percentage = (filled / total) * 100
      
      if (percentage === 0) return 'object-detail-content__filling--empty'
      if (percentage > 0 && percentage < 90) return 'object-detail-content__filling--partial'
      if (percentage >= 90) return 'object-detail-content__filling--full'
      return ''
    },
    handleSelectAllApplications(event) {
      if (event.target.checked) {
        this.selectedApplications = [...this.filteredApplications.map(a => a.id)]
      } else {
        this.selectedApplications = []
      }
    },
    handleSelectApplication(applicationId) {
      const index = this.selectedApplications.indexOf(applicationId)
      if (index > -1) {
        this.selectedApplications = this.selectedApplications.filter(id => id !== applicationId)
      } else {
        this.selectedApplications = [...this.selectedApplications, applicationId]
      }
    },
    handleApplicationClick(application, event) {
      // Предотвращаем клик, если кликнули на чекбокс или кнопку действий
      if (event && (event.target.type === 'checkbox' || event.target.closest('button'))) {
        return
      }
      console.log('Application clicked:', application)
      // TODO: Navigate to application detail or show modal
    },
    handleApplicationActions(application) {
      console.log('Application actions:', application)
      // TODO: Implement application actions menu
    },
    handleBulkCreateCopies() {
      // TODO: Реализовать создание копий заявок
      console.log('Bulk create copies for applications:', this.selectedApplications)
    },
    handleBulkDownloadPerformers() {
      // TODO: Реализовать скачивание списка исполнителей
      console.log('Bulk download performers for applications:', this.selectedApplications)
    },
    handleBulkDelete() {
      // TODO: Реализовать массовое удаление заявок
      console.log('Bulk delete applications:', this.selectedApplications)
    },
    getApplicationStatusClass(status) {
      if (status === 'В работе') return 'object-detail-content__status--active'
      if (status === 'Завершена') return 'object-detail-content__status--completed'
      if (status === 'На проверке') return 'object-detail-content__status--review'
      if (status === 'Отменена') return 'object-detail-content__status--cancelled'
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
// Стили наследуются от родительского компонента ObjectDetailContent
</style>

