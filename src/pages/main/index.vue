<template>
  <div v-if="isMapOpen" class="map_container">
    <div class="map_objects_container">
      <div class="content_wrapper basic_container_global">
        <Button class="close_map_button" type="shadow" color="white" @click="isMapOpen = false">К списку</Button>
        <div class="relative_container">
          <div class="object_bar_wrap" :class="{ open: isBarOpen }">
            <ObjectBar class="object_bar" v-model:object="currentObject" @close="closeObject" />
          </div>
        </div>
      </div>
    </div>

    <MapTasks class="map" @openObject="openObject" @closeObject="closeObject" />
  </div>

  <div class="task_container basic_container_global">
    <div class="main_block">
      <div class="filters_block" :class="{ open: isFiltersOpen }">
        <div class="mobile_header">
          <div class="title">Фильтры</div>
          <ButtonIconGhost @click="isFiltersOpen = false">
            <img src="@/assets/icons/cross_black.svg" />
          </ButtonIconGhost>
        </div>
        <TasksFilter
          ref="taskFilter"
          v-model:filtersCounter="filtersCounter"
          v-model:appliedFilters="appliedFilters"
          @apply="applyFilters"
        />
      </div>
      <div class="tasks_block">
        <ImageGallery
          class="stories"
          :isStories="true"
          v-if="stories.length"
          :items="stories"
          :makeViewed="makeViewed"
        />

        <div class="search_block">
          <Input :value="fetchParams.search" @input="updateSearchText" class="search" placeholder="Поиск" clearable>
            <template #left>
              <img src="@/assets/icons/magnifier.svg" />
            </template>
          </Input>
          <Button class="filter_icon" size="sTall" color="darkBlue" @click="isFiltersOpen = true">
            Фильтры
            <img src="@/assets/icons/filter.svg" />
            <div v-if="filtersCounter" class="counter">{{ filtersCounter }}</div>
          </Button>
        </div>
        <div class="map_preview">
          <Button type="shadow" color="white" @click="isMapOpen = true">На карте</Button>
        </div>
        <div class="tasks_container">
          <div>
            <TasksList
              :tasks="tasks"
              :loading="loading"
              :updateTask="updateTask"
              item-key="uuid"
              hide-default-footer
              disable-pagination
            />
            <LazyLoad ref="lazyLoad" :callBack="loadMore" />
          </div>

          <div v-if="showMoreBlock" class="show_more_block">
            <div>Больше нет заявок, по заданным фильтрам</div>
            <Button @click="showMoreTasks" inline> Показать другие заявки</Button>
          </div>

          <div v-if="objects.length">
            <h2 class="second_header">Добавь в избранное, чтобы первым получать заявки</h2>
            <ObjectsList :objects="objects" @updateObject="updateObject" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { debounce, convertToBackFormat } from '@/constants/helpers'
import MapTasks from '@/components/organisms/MapTasks.vue'
import TasksList from '@/components/page/contractorTasks/TasksList.vue'
import TasksFilter from '@/components/page/contractorTasks/TasksFilter.vue'
import ObjectBar from '@/components/organisms/ObjectBar.vue'
import ObjectsList from '@/components/organisms/ObjectsList.vue'
import useGlobalLoading from '@/composables/useGlobalLoading'
import { scrollWithAnimation } from '@/constants/scroll'
import ImageGallery from '@/components/organisms/ImageGallery'

export default {
  meta: {
    title: 'Доступные задачи',
  },
  components: {
    MapTasks,
    TasksFilter,
    TasksList,
    //Search,
    ObjectBar,
    ObjectsList,
    ImageGallery,
  },
  setup () {
    const { startLoading, stopLoading, loading } = useGlobalLoading()
    return { startLoading, stopLoading, loading }
  },
  data: () => ({
    tasks: [],
    isLastPage: false,
    isBarOpen: false,
    isMapOpen: false,
    activeTab: null,
    currentObject: {},
    fetchParams: {
      page: 1,
      per_page: 10,
      sort: null,
      order: null,
      search: null,
      filters: null,
    },
    showMoreBlock: false,
    isFiltersOpen: false,
    last_page: 1,
    appliedFilters: {},
    filtersCounter: null,
    objects: [],
    stories: [],
  }),
  computed: {
    ...mapGetters('user', ['user']),
    isFilterView () {
      return this.user.is_filter_view
    },
  },
  watch: {
    ['user.search_region']: {
      handler () {
        this.fetchParams.page = 1
        this.loadTasks()
      },
      deep: true,
    },
  },
  async mounted () {
    this.loadStories()
    this.loadObjects()
    this.checkUserPreferences()
    this.loadTasks()
  },

  methods: {
    ...mapActions('notifications', ['showNotification']),

    checkUserPreferences () {
      if (!this.isFilterView) this.$router.push({ path: '/ui-new/profile' })
    },

    async loadObjects () {
      this.startLoading()
      const response = await this.$axios.get('v2/user/subscribableobjects', {
        errorMessage: 'Не удалось загрузить объекты',
      })
      if (response?.data?.success) this.objects = response.data.data
      this.stopLoading()
    },
    async loadStories () {
      this.startLoading()
      const response = await this.$axios.get('v2/histories/getList', {
        params: {
          status: 'published',
        },
      })
      if (response?.data?.success) this.stories = response.data.data
      this.stopLoading()
    },
    async makeViewed (story) {
      const response = await this.$axios.post('v2/histories/view', {
        history_id: story.id,
      })
      if (response?.data?.success) {
        this.stories.forEach((s) => {
          if (s.id === story.id) story.is_viewed = true
        })
      }
    },

    async applyFilters (newFilters) {
      this.isFiltersOpen = false
      this.fetchParams.page = 1
      const success = await this.loadTasks(newFilters)
      if (success) {
        this.appliedFilters = newFilters
        localStorage.setItem('userTaskFilters', JSON.stringify(newFilters))
      }
    },

    async loadTasks (newFilters) {
      let success = false
      this.startLoading()
      this.showMoreBlock = false
      const filters = this.prepareFilters(newFilters || this.appliedFilters)
      this.fetchParams.filters = [...filters]
      const response = await this.$axios.post('v1/user/tasks/all', this.fetchParams, {
        errorMessage: 'Не удалось загрузить заявки',
      })
      this.stopLoading()
      if (response?.data?.success) {
        this.tasks = this.fetchParams.page > 1 ? this.tasks.concat(response.data.data) : response.data.data
        this.isLastPage = response.data.meta.current_page >= response.data.meta.last_page
        this.checkMoreBlockNecessity()
        success = true
      }
      return success
    },

    prepareFilters (filters) {
      const res = []
      for (let field in filters) {
        const value = filters[field]
        if (
          ((typeof value === 'string' || Array.isArray(value)) && value.length > 0) ||
          value?.from ||
          (typeof value === 'boolean' && !!value)
        )
          res.push({ field, value })
      }
      return convertToBackFormat(res)
    },

    async checkMoreBlockNecessity () {
      await this.$nextTick() // delay for filtersCounter update
      await this.$nextTick()
      this.showMoreBlock = this.isLastPage && this.filtersCounter > 0
    },

    loadMore () {
      if (this.isLastPage || this.loading) return
      this.fetchParams.page++
      this.loadTasks()
    },

    openObject (item) {
      this.isBarOpen = true
      this.currentObject = item
    },

    closeObject () {
      this.isBarOpen = false
    },

    showMoreTasks () {
      this.$refs.taskFilter.clearAll()
      const root = document.getElementById('default_layout')
      scrollWithAnimation({
        root,
        scrollTargetY: 0,
        easing: 'easeOutExpo',
        speed: 4000,
      })
    },

    updateTask (newTask) {
      this.tasks.forEach((task) => {
        if (task.uuid === newTask.uuid) Object.assign(task, newTask)
      })
    },

    updateSearchText: debounce(function (e) {
      this.fetchParams.search = e.target.value
      this.fetchParams.page = 1
      this.loadTasks()
    }, 400),

    changeTab (tab) {
      if (tab === this.activeTab) return
      this.tasks = []
      this.$router.push({ query: { tab } })
      this.activeTab = tab
    },

    updateObject (object) {
      for (let i = 0; i < this.objects.length; i++) {
        if (this.objects[i].uuid === object.uuid) {
          this.objects[i] = object
          break
        }
      }
    },
  },
}
</script>

<style scoped lang="scss">
.task_container {
  padding-bottom: 36px;
}
.map {
  margin-bottom: 30px;
  height: 100%;
}

.map_container {
  position: fixed;
  top: 60px; /* Отступ для header */
  left: 0;
  right: 0;
  height: calc(100% - 60px); /* Учитываем высоту header */
  z-index: 47;
  background: white;
}
.close_map_button {
  z-index: 100;
  width: 129px;
  margin-bottom: 12px;
}
.map_objects_container {
  position: absolute;
  width: 100%;
  height: 100%;
  user-select: none;
  padding-top: 12px; /* Уменьшенный отступ, так как уже есть отступ для header */
}
.content_wrapper {
  height: 100%;
}
.relative_container {
  position: relative;
  height: calc(100% - 50px);
  width: 100%;
}
.show_more_block {
  font-size: 20px;
  color: #000000;
  text-align: center;
  padding: 0 0 32px 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
}
.second_header {
  width: 100%;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
}

.main_block {
  padding-top: 48px;
  display: flex;
  align-items: start;
  gap: 48px;
}

.search_block {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
.search {
  flex: 1;
}
.filter_icon {
  display: none;
  .counter {
    position: absolute;
    right: 8px;
    top: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #ea358c;
    font-size: 9px;
    line-height: 9px;
    color: white;
  }
  .icon-group {
    position: relative;
    .counter {
      position: absolute;
      right: -2px;
      top: 0px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #ea358c;
      font-size: 9px;
      font-weight: 400;
      line-height: 12px;
      text-align: center;
      color: white;
    }
  }

  @media (max-width: 1000px) {
    display: flex;
  }
}
.filters_block {
  width: 380px;
  min-width: 380px;
  @media (max-width: 1000px) {
    display: none;
    position: fixed;
    background-color: white;
    top: 0;
    left: 0;
    z-index: 500;
    padding: 16px 16px 0 16px;
    overflow: auto;
    height: 100%;
    &.open {
      display: block;
    }
  }
}
.tasks_block {
  flex: 1;
}
.tasks_container {
  display: flex;
  flex-direction: column;
  gap: 48px;
}
.map_preview {
  display: flex;
  align-items: end;
  justify-items: stretch;
  padding: 12px 16px;
  height: 200px;
  border-radius: 16px;
  background-image: url('@/assets/imgs/map.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  margin-bottom: 24px;
  div {
    width: 100%;
  }
  @media (max-width: 768px) {
    height: 80px;
  }
}

.object_bar_wrap {
  position: absolute;
  background: white;
  bottom: 0;
  left: 0;
  z-index: 5;
  border-radius: 14px 14px 0 0;
  overflow: hidden;
  height: 0;
  transition: all 400ms ease-in-out;
  opacity: 0;
  width: 480px;
  &.open {
    height: 100%;
    opacity: 1;
  }
}

.object_bar {
  grid-template-rows: 1fr;
  height: 100%;
  opacity: 1;
  min-width: 375px;
}

.mobile_header {
  display: none;
  position: relative;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  padding: 0 0 36px 0;
  .title {
    padding-left: 24px;
    flex: 1;
    text-align: center;
  }
  @media (max-width: 1000px) {
    display: flex;
  }
}

.filter_button {
  gap: 4px;
  align-items: center;
}

.stories {
  padding-top: 8px;
  margin-bottom: 24px;
  @media (max-width: 1000px) {
    padding-top: 4px;
    margin-bottom: 26px;
  }
}

@media (max-width: 1000px) {
  .object_bar_wrap {
    width: calc(100% + 32px);
    margin-left: -16px;
    &.open {
      height: 100%;
    }
  }
  .map_preview {
    height: 80px;
  }

  .main_block {
    padding-top: 28px;
    flex-wrap: wrap;
  }
  .filters_block {
    width: 100%;
    min-width: 100%;
  }
  .task_container {
    padding-bottom: 100px;
  }
}
</style>
