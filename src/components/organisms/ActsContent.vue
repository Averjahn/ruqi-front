<template>
  <div class="acts-content">
    <h2 class="acts-content__title">Акты</h2>
    
    <!-- Filters -->
    <div class="acts-content__filters">
      <div class="acts-content__filter-item">
        <Input
          v-model="searchQuery"
          placeholder="Поиск"
          class="acts-content__search-input"
        >
          <template #left>
            <img src="@/assets/icon_deprecated/search.svg" alt="Search" class="acts-content__search-icon" />
          </template>
        </Input>
      </div>
      
      <!-- Desktop Filters -->
      <div class="acts-content__filter-item acts-content__filter-item--desktop">
        <DatePickerRange
          :range="selectedDateRange"
          @update:range="selectedDateRange = $event"
          class="acts-content__date-input"
        />
      </div>
      
      <div class="acts-content__filter-item acts-content__filter-item--desktop">
        <Select
          v-model="selectedStatus"
          :options="statusOptions"
          placeholder="Статус"
          clearable
          class="acts-content__status-input"
          item-value="value"
          item-text="label"
        />
      </div>

      <!-- Mobile Filter Button -->
      <div class="acts-content__filter-item acts-content__filter-item--mobile">
        <button class="acts-content__filter-button" @click="toggleFilterMenu">
          <img src="@/assets/icons/profile/filter-icon.svg" alt="Filter" class="acts-content__filter-icon" />
          <span class="acts-content__filter-text">Фильтры</span>
        </button>
      </div>
    </div>
    
    <!-- Acts List -->
    <div class="acts-content__list">
      <ActCard
        v-for="(act, index) in filteredActs"
        :key="index"
        :act="act"
        @sign="handleSign(act)"
        @download="handleDownload(act)"
      />
    </div>
    
    <!-- Pagination -->
    <div v-if="!isMobile" class="acts-content__pagination">
      <span class="acts-content__pagination-total">Всего: {{ totalCount }}</span>
      <Pagination
        v-if="totalPages > 1"
        :total-pages="totalPages"
        :current-page="currentPage"
        @page-change="handlePageChange"
      />
    </div>

    <!-- Filter Modal (Mobile only) -->
    <FilterModal
      v-if="isMobile"
      :show="showFilterModal"
      :date-range="selectedDateRange"
      :status="selectedStatus"
      @close="showFilterModal = false"
      @apply="handleFilterApply"
      @reset="handleFilterReset"
      @update:date-range="selectedDateRange = $event"
      @update:status="selectedStatus = $event"
    />
  </div>
</template>

<script>
import ActCard from '@/components/molecules/ActCard.vue'
import Input from '@/components/atoms/Input.vue'
import Select from '@/components/atoms/Select.vue'
import DatePickerRange from '@/components/atoms/DatePickerRange.vue'
import Pagination from '@/components/atoms/Pagination.vue'
import FilterModal from '@/components/organisms/popups/FilterModal.vue'

export default {
  name: 'ActsContent',
  components: {
    ActCard,
    Input,
    Select,
    DatePickerRange,
    Pagination,
    FilterModal
  },
  props: {
    acts: {
      type: Array,
      default: () => []
    },
    totalCount: {
      type: Number,
      default: 0
    }
  },
  emits: ['sign', 'download', 'page-change', 'filter-change'],
  data() {
    return {
      searchQuery: '',
      selectedDateRange: null,
      selectedStatus: null,
      currentPage: 1,
      itemsPerPage: 10,
      showFilterModal: false,
      isMobile: false,
      statusOptions: [
        { value: 'signed', label: 'Подписан' },
        { value: 'not-signed', label: 'Не подписан' }
      ]
    }
  },
  mounted() {
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile)
  },
  computed: {
    filteredActs() {
      // TODO: Implement filtering logic
      let acts = this.acts
      
      // Применяем пагинацию только на ПК версии
      if (!this.isMobile && this.currentPage && this.itemsPerPage) {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage
        const endIndex = startIndex + this.itemsPerPage
        acts = acts.slice(startIndex, endIndex)
      }
      
      return acts
    },
    totalPages() {
      return Math.ceil(this.totalCount / this.itemsPerPage)
    },
  },
  methods: {
    handleSign(act) {
      this.$emit('sign', act)
    },
    handleDownload(act) {
      this.$emit('download', act)
    },
    handlePageChange(page) {
      this.currentPage = page
      this.$emit('page-change', page)
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768
    },
    toggleFilterMenu() {
      this.showFilterModal = true
    },
    handleFilterApply(filters) {
      this.selectedDateRange = filters.dateRange
      this.selectedStatus = filters.status
      this.$emit('filter-change', {
        search: this.searchQuery,
        dateRange: filters.dateRange,
        status: filters.status
      })
    },
    handleFilterReset() {
      this.selectedDateRange = null
      this.selectedStatus = null
      this.$emit('filter-change', {
        search: this.searchQuery,
        dateRange: null,
        status: null
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.acts-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: #ffffff;
  border-radius: 10px;
  padding: 24px;
}

.acts-content__title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
  color: #263043;
  margin: 0;
}

.acts-content__filters {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.acts-content__filter-item {
  flex: 1;
  min-width: 200px;
}

.acts-content__search-input,
.acts-content__date-input,
.acts-content__status-input {
  width: 100%;
}

.acts-content__search-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.acts-content__dropdown-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.acts-content__list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.acts-content__pagination {
  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: flex-start;
}

.acts-content__pagination-total {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #263043;
}

.acts-content__filter-item--desktop {
  @media (max-width: 768px) {
    display: none;
  }
}

.acts-content__filter-item--mobile {
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
}

.acts-content__filter-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 40px;
  border: 1px solid #dadada;
  border-radius: 8px;
  background: #ffffff;
  cursor: pointer;
  padding: 8px 16px;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:hover {
    border-color: #1735F5;
    background: #F2F8FF;
  }

  &:active {
    transform: scale(0.98);
  }
}

.acts-content__filter-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.acts-content__filter-text {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  color: #263043;
}

@media (max-width: 768px) {
  .acts-content {
    padding: 16px;
    gap: 16px;
    background: transparent;
    border-radius: 0;
  }

  .acts-content__title {
    display: none;
  }

  .acts-content__filters {
    flex-direction: column;
    gap: 16px;
  }

  .acts-content__filter-item {
    min-width: 100%;
  }

  .acts-content__list {
    gap: 24px;
  }

  .acts-content__pagination {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>

