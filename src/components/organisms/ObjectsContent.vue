<template>
  <div class="objects-content">
    <!-- Search and Actions Bar -->
    <div class="objects-content__toolbar">
      <div class="objects-content__toolbar-top">
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
          <!-- Table (List) - скрыто на мобильных -->
          <button
            class="objects-content__view-toggle objects-content__view-toggle--desktop"
            :class="{ 'objects-content__view-toggle--active': viewMode === 'list' }"
            @click="viewMode = 'list'"
            title="Таблица"
          >
            <img src="@/assets/icons/profile/Table.svg" alt="Table" class="objects-content__view-toggle-icon" />
          </button>
          <!-- Grid -->
          <button
            class="objects-content__view-toggle"
            :class="{ 'objects-content__view-toggle--active': viewMode === 'grid' }"
            @click="viewMode = 'grid'"
            title="Сетка"
          >
            <img src="@/assets/icons/profile/Grid.svg" alt="Grid" class="objects-content__view-toggle-icon" />
          </button>
          <!-- Map -->
          <button
            class="objects-content__view-toggle"
            :class="{ 'objects-content__view-toggle--active': viewMode === 'map' }"
            @click="viewMode = 'map'"
            title="Карта"
          >
            <img src="@/assets/icons/profile/Map.svg" alt="Map" class="objects-content__view-toggle-icon" />
          </button>
        </div>
      </div>

      <Button
        type="contained"
        color="blue"
        class="objects-content__create-button"
        @click="handleCreateObject"
      >
        <img src="@/assets/icons/profile/Add.svg" alt="Add" class="objects-content__create-icon" />
        Создать объект
      </Button>
    </div>

    <!-- Grid View -->
    <div v-if="viewMode === 'grid'" class="objects-content__grid">
      <div
        v-for="object in filteredObjects"
        :key="object.id"
        class="objects-content__grid-card"
        :class="{ 'objects-content__grid-card--selected': selectedObjects.includes(object.id) }"
        @click="handleObjectClick(object, $event)"
      >
        <div class="objects-content__grid-card-header">
          <input
            type="checkbox"
            :checked="selectedObjects.includes(object.id)"
            @change.stop="handleSelectObject(object.id)"
            class="objects-content__grid-card-checkbox"
          />
          <h3 class="objects-content__grid-card-title">{{ object.name }}</h3>
          <button
            class="objects-content__grid-card-actions"
            @click="handleObjectActions(object)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="4" r="1.5" fill="currentColor"/>
              <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
              <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
            </svg>
          </button>
        </div>
        <div class="objects-content__grid-card-body">
          <div class="objects-content__grid-card-info">
            <div class="objects-content__grid-card-info-item">
              <span class="objects-content__grid-card-label">Заявки:</span>
              <span class="objects-content__grid-card-value">{{ object.applications || 0 }}</span>
            </div>
            <div class="objects-content__grid-card-info-item">
              <span class="objects-content__grid-card-label">Расположен:</span>
              <span class="objects-content__grid-card-value">{{ object.location }}</span>
            </div>
            <div class="objects-content__grid-card-info-item">
              <span class="objects-content__grid-card-label">Ср. выход:</span>
              <span class="objects-content__grid-card-value">{{ object.avgOutput || 0 }}</span>
            </div>
            <div class="objects-content__grid-card-info-item">
              <span class="objects-content__grid-card-label">Выход:</span>
              <span class="objects-content__grid-card-value">{{ object.output || 0 }}</span>
            </div>
            <div class="objects-content__grid-card-info-item">
              <span class="objects-content__grid-card-label">% выхода:</span>
              <span
                class="objects-content__grid-card-value"
                :class="getExitPercentClass(object.exitPercent)"
              >
                {{ object.exitPercent || 0 }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="filteredObjects.length === 0" class="objects-content__grid-empty">
        Нет объектов для отображения
      </div>
    </div>

    <!-- Map View -->
    <div v-else-if="viewMode === 'map'" class="objects-content__map-wrapper">
      <Map
        :markers="mapMarkers"
        :center_coords="mapCenter"
        :zoom="10"
        @action="handleObjectClick"
        @marker-click="handleMarkerClick"
      />
    </div>

    <!-- Table View -->
    <div v-else-if="viewMode === 'list'" class="objects-content__table-wrapper">
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
            @click="handleObjectClick(object, $event)"
          >
            <td class="objects-content__td objects-content__td--checkbox" @click.stop>
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
              {{ object.avgOutput || 0 }}
            </td>
            <td class="objects-content__td">
              {{ object.output || 0 }}
            </td>
            <td class="objects-content__td">
              <span
                class="objects-content__exit-percent"
                :class="getExitPercentClass(object.exitPercent)"
              >
                {{ object.exitPercent || 0 }}
              </span>
            </td>
            <td class="objects-content__td objects-content__td--actions" @click.stop>
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

    <!-- Object Map Modal -->
    <ObjectMapModal
      :show="showObjectModal"
      :object-data="selectedObjectData"
      @close="showObjectModal = false"
      @menu-click="handleObjectMenuClick"
    />
  </div>
</template>

<script>
import Input from '@/components/atoms/Input.vue'
import Tabs from '@/components/atoms/Tabs.vue'
import Button from '@/components/atoms/Button.vue'
import Pagination from '@/components/atoms/Pagination.vue'
import Map from '@/components/organisms/Map.vue'
import ObjectMapModal from '@/components/organisms/popups/ObjectMapModal.vue'

const VIEW_MODE_STORAGE_KEY = 'uiObjects.viewMode'

export default {
  name: 'ObjectsContent',
  components: {
    Input,
    Button,
    Pagination,
    Map,
    ObjectMapModal
  },
  props: {
    objects: {
      type: Array,
      default: () => []
    },
    totalCount: {
      type: Number,
      default: 0
    },
    activeTab: {
      type: String,
      default: 'active'
    },
    defaultViewMode: {
      type: String,
      default: 'list'
    }
  },
  emits: ['create-object', 'object-action', 'page-change', 'filter-change'],
  data() {
    return {
      searchQuery: '',
      viewMode: this.getInitialViewMode(),
      selectedObjects: [],
      currentPage: 1,
      itemsPerPage: 10,
      sortField: null,
      sortOrder: 'asc', // 'asc' | 'desc'
      showObjectModal: false,
      selectedObjectData: null
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
    },
    mapMarkers() {
      // Преобразуем объекты в формат маркеров для карты
      // Предполагаем, что объекты имеют координаты lat/lon или location с координатами
      return this.filteredObjects
        .filter(obj => {
          // Проверяем наличие координат
          return (obj.lat && obj.lon) || 
                 (obj.location && typeof obj.location === 'object' && obj.location.lat && obj.location.lon)
        })
        .map(obj => {
          const lat = obj.lat || obj.location?.lat
          const lon = obj.lon || obj.location?.lon
          
          return {
            geometry: {
              coordinates: [parseFloat(lat), parseFloat(lon)]
            },
            properties: {
              hintContent: obj.name,
              name: obj.name,
              address: obj.location || '',
              applications: obj.applications || 0,
              avgOutput: obj.avgOutput || 0,
              output: obj.output || 0,
              exitPercent: obj.exitPercent || 0
            },
            uuid: obj.id || obj.uuid,
            is_subscribe: obj.is_subscribe || false,
            logo: obj.logo || obj.logo_thumb_48x48 || ''
          }
        })
    },
    mapCenter() {
      // Вычисляем центр карты на основе координат объектов
      if (this.mapMarkers.length === 0) {
        return [55.7708, 37.5967] // Москва по умолчанию
      }
      
      const lats = this.mapMarkers.map(m => m.geometry.coordinates[0])
      const lons = this.mapMarkers.map(m => m.geometry.coordinates[1])
      
      const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length
      const avgLon = lons.reduce((a, b) => a + b, 0) / lons.length
      
      return [avgLat, avgLon]
    }
  },
  mounted() {
    // Не сохраняем viewMode при инициализации, чтобы при переходе через sidebar всегда был 'list'
    // Сохранение происходит только при явном изменении пользователем (через watch)
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
    },
    viewMode(newVal) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, newVal)
      }
    }
  },
  methods: {
    getInitialViewMode() {
      // Для десктопа всегда используем 'list' по умолчанию при переходе через sidebar
      // Для мобильных устройств используем defaultViewMode или проверяем localStorage
      if (this.defaultViewMode === 'list') {
        // Для десктопа всегда 'list', игнорируем localStorage
        return 'list'
      }
      // Для мобильных устройств (map) проверяем localStorage
      if (typeof window !== 'undefined') {
        const stored = window.localStorage.getItem(VIEW_MODE_STORAGE_KEY)
        if (stored && ['grid', 'list', 'map'].includes(stored)) {
          return stored
        }
      }
      return this.defaultViewMode || 'list'
    },
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
    handleObjectClick(object, event) {
      // Предотвращаем клик, если кликнули на чекбокс или кнопку действий
      if (event && (event.target.type === 'checkbox' || event.target.closest('button'))) {
        return
      }
      // Обработка клика на объект (карточка или строка)
      this.$emit('object-action', object)
    },
    handleMarkerClick(marker) {
      // Если это location маркер (для дизайна)
      if (marker.isLocation) {
        this.selectedObjectData = {
          name: marker.properties?.name || marker.properties?.address || 'Объект',
          address: marker.properties?.address || 'Адрес не указан',
          applications: 0,
          avgOutput: 0,
          output: 0,
          exitPercent: 0
        }
        this.showObjectModal = true
        return
      }
      
      // Находим объект по uuid маркера
      const object = this.objects.find(obj => 
        (obj.id || obj.uuid) === marker.uuid
      )
      if (object) {
        this.selectedObjectData = {
          name: object.name,
          address: object.location || marker.properties?.address || '',
          applications: marker.properties?.applications || object.applications || 0,
          avgOutput: marker.properties?.avgOutput || object.avgOutput || 0,
          output: marker.properties?.output || object.output || 0,
          exitPercent: marker.properties?.exitPercent || object.exitPercent || 0
        }
        this.showObjectModal = true
      }
    },
    handleObjectMenuClick(objectData) {
      // Обработка клика на меню в модальном окне
      console.log('Menu clicked for object:', objectData)
      // Можно добавить дополнительную логику
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
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 16px;
    gap: 16px;
  }
}

.objects-content__tabs {
  width: max-content;
  align-self: flex-start; // Прижимаем к левому краю
  
  :deep(.tabs_container) {
    width: max-content;
    
    &.wide {
      width: max-content;
      
      .tab {
        justify-content: flex-start;
        padding: 0px 24px;
      }
    }
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
    gap: 12px;
  }
}

.objects-content__toolbar-top {
  display: flex;
  gap: 16px;
  align-items: center;
  flex: 1;
  flex-wrap: wrap;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-wrap: nowrap;
    gap: 12px;
  }
}

.objects-content__search {
  flex: 1;
  min-width: 200px;
  max-width: 280px;

  @media (max-width: 768px) {
    min-width: 0;
    max-width: none;
    flex: 1;
  }
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
  gap: 2px; // Как у табов (contained type)
  align-items: center;
  border-radius: 8px;
  background-color: #f3f3f3; // Фон как у табов
  padding: 2px; // Отступ как у табов
  height: 40px; // Высота как у табов
  width: 112px; // Общая ширина как в Figma

  @media (max-width: 768px) {
    width: auto; // Автоматическая ширина на мобильных
    flex-shrink: 0;
    min-width: 152px; // Минимальная ширина для двух табов (76px * 2)
  }
}

.objects-content__view-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1; // Равномерное распределение внутри контейнера 112px
  height: 36px; // Высота внутри контейнера (40px - 4px padding)
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666666;

  &:hover {
    background: #f9f9f9;
  }

  &--active {
    font-weight: 600;
    background-color: white; // Белый фон для активного
    color: #263043;
    box-shadow:
      0px 8px 48px 4px #0234e30a,
      0px 0px 10px 0px #1735f508; // Тень как у активного таба
  }

  &--desktop {
    @media (max-width: 768px) {
      display: none; // Скрываем кнопку list на мобильных
    }
  }

  @media (max-width: 768px) {
    min-width: 76px; // Минимальная ширина таба в мобильной версии
  }
}

.objects-content__view-toggle-icon {
  width: 16px;
  height: 16px;
  display: block;
  
  // Изменяем цвет иконок через filter для неактивного состояния
  .objects-content__view-toggle:not(.objects-content__view-toggle--active) & {
    filter: brightness(0) saturate(100%) invert(40%); // Серый цвет #666666
  }
  
  // Для активного состояния - темный цвет #263043
  .objects-content__view-toggle--active & {
    filter: brightness(0) saturate(100%) invert(15%); // Темный цвет #263043
  }
}

.objects-content__create-button {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;

  :deep(.rq_button .slot) {
    font-family: sans-serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 0px;
  }
}

.objects-content__create-icon {
  width: 16px;
  height: 16px;
}

.objects-content__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.objects-content__grid-card {
  background: #ffffff;
  border-radius: 10px;
  padding: 24px;
  border: 1px solid #dadada;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: #1735F5;
    box-shadow: 0px 4px 12px rgba(23, 53, 245, 0.1);
  }

  &--selected {
    border-color: #1735F5;
    background: #F2F8FF;
  }
}

.objects-content__grid-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #E3E5E4;
}

.objects-content__grid-card-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
  flex-shrink: 0;
  accent-color: #1735F5;
}

.objects-content__grid-card-title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  color: #263043;
  margin: 0;
  flex: 1;
}

.objects-content__grid-card-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  color: #666666;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #F2F8FF;
    color: #1735F5;
  }

  svg {
    width: 16px;
    height: 16px;
  }
}

.objects-content__grid-card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.objects-content__grid-card-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.objects-content__grid-card-info-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 14px;
  line-height: 20px;
}

.objects-content__grid-card-label {
  color: #666666;
  font-weight: 400;
  min-width: 100px;
}

.objects-content__grid-card-value {
  color: #263043;
  font-weight: 400;
  flex: 1;
}

.objects-content__grid-empty {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: #666666;
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 16px;
}

.objects-content__map-wrapper {
  width: 100%;
  height: 600px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #dadada;
  background: #ffffff;

  @media (max-width: 768px) {
    height: 55dvh;
  }
}

.objects-content__table-wrapper {
  overflow-x: auto;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  
  // Скрываем скроллбар, но оставляем возможность прокрутки
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #F6F8FB;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #dadada;
    border-radius: 4px;
    
    &:hover {
      background: #9ca3af;
    }
  }
}

.objects-content__table {
  width: 100%;
  max-width: 100%;
  border-collapse: collapse;
  table-layout: auto; // Автоматическая ширина колонок
}

.objects-content__table thead tr {
  border-bottom: 1px solid #E3E5E4;
}

.objects-content__th {
  padding: 12px 16px;
  text-align: left;
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #666666;
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
  cursor: pointer;

  &:first-child {
    border-top: none;
  }

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

