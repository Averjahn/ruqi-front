<template>
  <div class="objects-content">
    <!-- Tabs: Активные / Архив -->
    <div class="objects-content__tabs">
      <button
        class="objects-content__tab"
        :class="{ 'objects-content__tab--active': activeTab === 'active' }"
        @click="activeTab = 'active'"
      >
        Активные
      </button>
      <button
        class="objects-content__tab"
        :class="{ 'objects-content__tab--active': activeTab === 'archive' }"
        @click="activeTab = 'archive'"
      >
        Архив
      </button>
    </div>

    <!-- Search and Actions Bar -->
    <div class="objects-content__toolbar">
      <div class="objects-content__search">
        <Input
          v-model="searchQuery"
          placeholder="Поиск"
          class="objects-content__search-input"
          clearable
        >
          <template #left>
            <img src="@/assets/icon_deprecated/search.svg" alt="Search" class="objects-content__search-icon" />
          </template>
        </Input>
      </div>

      <div class="objects-content__view-toggles">
        <button
          class="objects-content__view-toggle"
          :class="{ 'objects-content__view-toggle--active': viewMode === 'grid' }"
          @click="viewMode = 'grid'"
          title="Сетка"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="5" height="5" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <rect x="9" y="2" width="5" height="5" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <rect x="2" y="9" width="5" height="5" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <rect x="9" y="9" width="5" height="5" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
        </button>
        <button
          class="objects-content__view-toggle"
          :class="{ 'objects-content__view-toggle--active': viewMode === 'list' }"
          @click="viewMode = 'list'"
          title="Список"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="2" y1="4" x2="14" y2="4" stroke="currentColor" stroke-width="1.5"/>
            <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" stroke-width="1.5"/>
            <line x1="2" y1="12" x2="14" y2="12" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </button>
        <button
          class="objects-content__view-toggle"
          :class="{ 'objects-content__view-toggle--active': viewMode === 'map' }"
          @click="viewMode = 'map'"
          title="Карта"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2L6 4L10 2L14 4V12L10 14L6 12L2 14V2Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <circle cx="8" cy="7" r="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
        </button>
      </div>

      <Button
        type="contained"
        color="blue"
        class="objects-content__create-button"
        @click="handleCreateObject"
      >
        <img src="@/assets/icon_deprecated/plus.svg" alt="Plus" class="objects-content__create-icon" />
        Создать объект
      </Button>
    </div>

    <!-- Table -->
    <div class="objects-content__table-wrapper">
      <table class="objects-content__table">
        <thead>
          <tr>
            <th class="objects-content__th objects-content__th--checkbox">
              <input
                type="checkbox"
                :checked="allSelected"
                @change="handleSelectAll"
                class="objects-content__checkbox"
              />
            </th>
            <th class="objects-content__th objects-content__th--name" @click="handleSort('name')">
              Название объекта
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="objects-content__sort-icon">
                <path d="M3 4.5L6 1.5L9 4.5M3 7.5L6 10.5L9 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </th>
            <th class="objects-content__th">Заявки</th>
            <th class="objects-content__th">Расположен</th>
            <th class="objects-content__th">Ср. выход</th>
            <th class="objects-content__th">Выход</th>
            <th class="objects-content__th">% выхода</th>
            <th class="objects-content__th objects-content__th--actions">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="object in filteredObjects"
            :key="object.id"
            class="objects-content__row"
            :class="{ 'objects-content__row--selected': selectedObjects.includes(object.id) }"
          >
            <td class="objects-content__td objects-content__td--checkbox">
              <input
                type="checkbox"
                :checked="selectedObjects.includes(object.id)"
                @change="handleSelectObject(object.id)"
                class="objects-content__checkbox"
              />
            </td>
            <td class="objects-content__td objects-content__td--name">
              {{ object.name }}
            </td>
            <td class="objects-content__td">
              {{ object.applications || 0 }}
            </td>
            <td class="objects-content__td">
              {{ object.location }}
            </td>
            <td class="objects-content__td">
              {{ object.avgExit || 0 }}
            </td>
            <td class="objects-content__td">
              {{ object.exit || 0 }}
            </td>
            <td class="objects-content__td">
              <span
                class="objects-content__exit-percent"
                :class="getExitPercentClass(object.exitPercent)"
              >
                {{ object.exitPercent || 0 }}%
              </span>
            </td>
            <td class="objects-content__td objects-content__td--actions">
              <button
                class="objects-content__actions-button"
                @click="handleObjectActions(object)"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="4" r="1.5" fill="currentColor"/>
                  <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                  <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="filteredObjects.length === 0" class="objects-content__row objects-content__row--empty">
            <td colspan="8" class="objects-content__td objects-content__td--empty">
              Нет объектов для отображения
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="objects-content__pagination">
      <Pagination
        :total-pages="totalPages"
        :current-page="currentPage"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import Input from '@/components/atoms/Input.vue'
import Button from '@/components/atoms/Button.vue'
import Pagination from '@/components/atoms/Pagination.vue'

export default {
  name: 'ObjectsContent',
  components: {
    Input,
    Button,
    Pagination
  },
  props: {
    objects: {
      type: Array,
      default: () => []
    },
    totalCount: {
      type: Number,
      default: 0
    }
  },
  emits: ['create-object', 'object-action', 'page-change', 'filter-change'],
  data() {
    return {
      activeTab: 'active', // 'active' | 'archive'
      searchQuery: '',
      viewMode: 'list', // 'grid' | 'list' | 'map'
      selectedObjects: [],
      currentPage: 1,
      itemsPerPage: 10,
      sortField: null,
      sortOrder: 'asc' // 'asc' | 'desc'
    }
  },
  computed: {
    filteredObjects() {
      let objects = this.objects

      // Фильтр по вкладке
      if (this.activeTab === 'archive') {
        objects = objects.filter(obj => obj.archived === true)
      } else {
        objects = objects.filter(obj => !obj.archived)
      }

      // Фильтр по поиску
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        objects = objects.filter(obj =>
          obj.name?.toLowerCase().includes(query) ||
          obj.location?.toLowerCase().includes(query)
        )
      }

      // Сортировка
      if (this.sortField) {
        objects = [...objects].sort((a, b) => {
          const aVal = a[this.sortField] || ''
          const bVal = b[this.sortField] || ''
          const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0
          return this.sortOrder === 'asc' ? comparison : -comparison
        })
      }

      // Пагинация
      const startIndex = (this.currentPage - 1) * this.itemsPerPage
      const endIndex = startIndex + this.itemsPerPage
      return objects.slice(startIndex, endIndex)
    },
    totalPages() {
      let objects = this.objects
      if (this.activeTab === 'archive') {
        objects = objects.filter(obj => obj.archived === true)
      } else {
        objects = objects.filter(obj => !obj.archived)
      }
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        objects = objects.filter(obj =>
          obj.name?.toLowerCase().includes(query) ||
          obj.location?.toLowerCase().includes(query)
        )
      }
      return Math.ceil(objects.length / this.itemsPerPage)
    },
    allSelected() {
      return this.filteredObjects.length > 0 &&
        this.filteredObjects.every(obj => this.selectedObjects.includes(obj.id))
    }
  },
  watch: {
    activeTab() {
      this.currentPage = 1
      this.selectedObjects = []
      this.$emit('filter-change', {
        tab: this.activeTab,
        search: this.searchQuery
      })
    },
    searchQuery() {
      this.currentPage = 1
      this.$emit('filter-change', {
        tab: this.activeTab,
        search: this.searchQuery
      })
    }
  },
  methods: {
    handleSelectAll(event) {
      if (event.target.checked) {
        this.selectedObjects = [...this.filteredObjects.map(obj => obj.id)]
      } else {
        this.selectedObjects = []
      }
    },
    handleSelectObject(objectId) {
      const index = this.selectedObjects.indexOf(objectId)
      if (index > -1) {
        this.selectedObjects.splice(index, 1)
      } else {
        this.selectedObjects.push(objectId)
      }
    },
    handleSort(field) {
      if (this.sortField === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortField = field
        this.sortOrder = 'asc'
      }
    },
    handleCreateObject() {
      this.$emit('create-object')
    },
    handleObjectActions(object) {
      this.$emit('object-action', object)
    },
    handlePageChange(page) {
      this.currentPage = page
      this.$emit('page-change', page)
    },
    getExitPercentClass(percent) {
      if (!percent || percent === 0) return 'objects-content__exit-percent--zero'
      if (percent < 30) return 'objects-content__exit-percent--low'
      if (percent < 70) return 'objects-content__exit-percent--medium'
      return 'objects-content__exit-percent--high'
    }
  }
}
</script>

<style lang="scss" scoped>
.objects-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: #ffffff;
  border-radius: 10px;
  padding: 24px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 16px;
    gap: 16px;
  }
}

.objects-content__tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid #E3E5E4;
}

.objects-content__tab {
  padding: 12px 24px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  color: #666666;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #1735F5;
  }

  &--active {
    color: #1735F5;
    border-bottom-color: #1735F5;
    font-weight: 600;
  }
}

.objects-content__toolbar {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.objects-content__search {
  flex: 1;
  min-width: 200px;
}

.objects-content__search-input {
  width: 100%;
}

.objects-content__search-icon {
  width: 20px;
  height: 20px;
}

.objects-content__view-toggles {
  display: flex;
  gap: 8px;
  align-items: center;
}

.objects-content__view-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid #dadada;
  border-radius: 8px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666666;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    border-color: #1735F5;
    background: #F2F8FF;
    color: #1735F5;
  }

  &--active {
    border-color: #1735F5;
    background: #F2F8FF;
    color: #1735F5;
  }
}

.objects-content__create-button {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.objects-content__create-icon {
  width: 16px;
  height: 16px;
}

.objects-content__table-wrapper {
  overflow-x: auto;
  width: 100%;
}

.objects-content__table {
  width: 100%;
  border-collapse: collapse;
}

.objects-content__th {
  padding: 12px 16px;
  text-align: left;
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #666666;
  border-bottom: 1px solid #E3E5E4;
  cursor: default;

  &--name {
    cursor: pointer;
    user-select: none;

    &:hover {
      color: #1735F5;
    }
  }

  &--checkbox {
    width: 40px;
  }

  &--actions {
    width: 60px;
    text-align: center;
  }
}

.objects-content__sort-icon {
  width: 12px;
  height: 12px;
  margin-left: 4px;
  opacity: 0.5;
  color: #666666;
  display: inline-block;
  vertical-align: middle;
}

.objects-content__row {
  border-bottom: 1px solid #F6F8FB;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #F6F8FB;
  }

  &--selected {
    background-color: #F2F8FF;
  }

  &--empty {
    &:hover {
      background-color: transparent;
    }
  }
}

.objects-content__td {
  padding: 16px;
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #263043;

  &--checkbox {
    width: 40px;
    text-align: center;
  }

  &--name {
    font-weight: 500;
  }

  &--actions {
    width: 60px;
    text-align: center;
  }

  &--empty {
    text-align: center;
    color: #666666;
    padding: 40px;
  }
}

.objects-content__checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #1735F5;
}

.objects-content__exit-percent {
  font-weight: 600;

  &--zero {
    color: #263043;
  }

  &--low {
    color: #E53E3E;
  }

  &--medium {
    color: #F6AD55;
  }

  &--high {
    color: #38A169;
  }
}

.objects-content__actions-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  color: #666666;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background-color: #F2F8FF;
    color: #1735F5;
  }
}

.objects-content__pagination {
  display: flex;
  justify-content: center;
  padding-top: 16px;
}

@media (max-width: 768px) {
  .objects-content {
    background: transparent;
    border-radius: 0;
    padding: 0;
  }

  .objects-content__table-wrapper {
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
  }

  .objects-content__th,
  .objects-content__td {
    padding: 12px 8px;
    font-size: 12px;
    white-space: nowrap;
  }
}
</style>

