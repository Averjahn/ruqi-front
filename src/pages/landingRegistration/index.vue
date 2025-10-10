<template>
  <div class="available-tasks">
    <Popup v-if="$route.path === '/landing-registration'" v-model:show="showPopup" externalControl>
      <PhoneConfirmLanding />
    </Popup>
    <Popup v-if="$route.path === '/getfriend'" v-model:show="showPopup" externalControl>
      <PhoneConfirmGetFriend />
    </Popup>

    <Tabs class="available-tasks__tabs" value="available" type="flat" />

    <div class="basic_container_global">
      <TasksFilter class="mb_40" disableFetch />

      <div class="tabs_wrap">
        <TabsDeprecated :tabs="tabs" v-model="activeTab" />
      </div>
    </div>

    <Window :activeTab="activeTab">
      <template #list>
        <section>
          <div class="basic_container_global tasks_wrap">
            <TasksList
              :tasks="availableTasks"
              :loading="loading"
              :updateTask="updateTask"
              item-key="uuid"
              hide-default-footer
              disable-pagination
            />
          </div>
        </section>
      </template>

      <template #map>
        <div class="map_objects_container">
          <div class="object_bar_wrap" :class="{ open: isBarOpen }">
            <ObjectBar class="object_bar" v-model:object="currentObject" />
          </div>
          <MapTasks class="map" />
        </div>
      </template>
    </Window>
  </div>
</template>

<script>
import _ from 'lodash'
import MapTasks from '@/components/organisms/MapTasks.vue'
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { debounce } from '@/constants/helpers'
import TabsDeprecated from '@/components/page/contractorTasks/Tabs.vue'
import TasksList from '@/components/page/contractorTasks/TasksList.vue'
import TasksFilter from '@/components/page/contractorTasks/TasksFilter.vue'
import ObjectBar from '@/components/organisms/ObjectBar.vue'
import PhoneConfirmLanding from '@/components/organisms/popups/PhoneConfirmLanding'
import PhoneConfirmGetFriend from '@/components/organisms/popups/PhoneConfirmGetFriend'
import { getAPIError } from '@/constants/helpers'

const mockTasks = [
  {
    uuid: '5796cb9c-cc62-4426-a4e1-a7857019fe25',
    user: '798d463f-f924-43b9-812b-845c13ac7195',
    name: 'Комплектовщик',
    object: {
      uuid: '3bbe9c6d-f743-489d-819b-9e7a14af423b',
      code: 'ЛДГТСТ',
      name: 'Ладога Тест',
      address: 'Россия, Московская область, городской округ Пушкинский, М-8 Холмогоры, 33-й километр',
    },
    until_date: '2024-06-18T20:30:00.000000Z',
    start_date: '2024-06-19T08:30:00.000000Z',
    description: 'Комплектовщик',
    status: 'isRecruiting',
    calcStatus: 'is_recruting',
    is_subscribe: false,
    rate: '1880',
    rate_unit: 'час',
    geometry: {
      type: 'Point',
      coordinates: [55, 37],
    },
    properties: {
      hintContent: 'Комплектовщик',
    },
    professions: ['Сортировщик'],
    banners: [],
  },
  {
    uuid: '761e2bb8-e93d-42b4-b3a0-82e425a48a14',
    user: '798d463f-f924-43b9-812b-845c13ac7195',
    name: 'Нужны штучных дел мастера',
    object: {
      uuid: '7760d1a0-1502-45a1-b9ec-6da228935467',
      code: 'ЗС',
      name: 'Звезда смерти',
      address: 'Россия, Москва, улица Новый Арбат, 21',
    },
    until_date: '2024-06-18T20:00:00.000000Z',
    start_date: '2024-06-19T08:00:00.000000Z',
    description: 'Нужны штучных дел мастера',
    status: 'isRecruiting',
    calcStatus: 'is_recruting',
    is_subscribe: false,
    rate: '160',
    rate_unit: 'шт',
    geometry: {
      type: 'Point',
      coordinates: [55, 37],
    },
    properties: {
      hintContent: 'Нужны штучных дел мастера',
    },
    professions: ['Программист'],
    banners: ['convenient_location'],
  },
  {
    uuid: '113ae7e7-8d6f-4f9e-bf07-a54938bb1f74',
    user: '798d463f-f924-43b9-812b-845c13ac7195',
    name: 'Сборщик заказов Доктор',
    object: {
      uuid: '69ec5eb9-bc61-4edb-8c97-920ba07f08df',
      code: 'ОЗ-СПБ',
      name: 'Озон Санкт-Петербург',
      address: 'Россия, Санкт-Петербург, Литейный проспект, 25',
    },
    until_date: '2024-06-17T23:00:00.000000Z',
    start_date: '2024-06-18T11:00:00.000000Z',
    description: 'Сборщик заказов Доктор',
    status: 'isRecruiting',
    calcStatus: 'is_recruting_urgently',
    is_subscribe: false,
    rate: '4',
    rate_unit: 'шт',
    geometry: {
      type: 'Point',
      coordinates: [59, 30],
    },
    properties: {
      hintContent: 'Сборщик заказов Доктор',
    },
    professions: ['Доктор'],
    banners: ['time_set_ends', 'convenient_location'],
  },
]

export default {
  meta: {
    title: 'Доступные задачи',
  },
  components: {
    MapTasks,
    TabsDeprecated,
    TasksFilter,
    TasksList,
    ObjectBar,
    PhoneConfirmLanding,
    PhoneConfirmGetFriend,
  },
  layout: 'lk',
  data: () => ({
    availableTasks: mockTasks,
    tabs: [
      { value: 'list', text: 'Списком' },
      { value: 'map', text: 'На карте' },
    ],
    busy: true,
    isBarOpen: false,
    showPopup: true,
    activeTab: 'list',
    currentObject: {},
    fetchParams: {
      page: 1,
      per_page: 10,
      sort: null,
      order: null,
      search: null,
    },
  }),
  computed: {},
  async mounted () {
    this.busy = false
  },
  methods: {
    ...mapActions('notifications', ['showNotification']),

    updateTask (newTask) {
      this.tasks.forEach((task) => {
        if (task.uuid === newTask.uuid) Object.assign(task, newTask)
      })
    },
  },
}
</script>

<style scoped lang="scss">
.tasks_wrap {
  padding-bottom: 100px;
}
.available-tasks__header {
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  justify-content: space-between;
  padding-top: 16px;
  padding-bottom: 16px;
  gap: 8px;
}
.map {
  height: 80vh;
}
.available-tasks__tabs {
  margin: 0;
  margin-bottom: 16px;
}

.tabs_wrap {
  display: flex;
  justify-content: start;
  margin-bottom: 24px;
}
.map_objects_container {
  position: relative;
  margin: 0;
}
.object_bar_wrap {
  position: absolute;
  background: white;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0;
  z-index: 5;
  border-radius: 14px 14px 0 0;
  overflow: hidden;
  display: grid;
  grid-template-rows: 0fr;
  transition: all 400ms ease-in-out;
  opacity: 0;
  &.open {
    grid-template-rows: 1fr;
    height: 70vh;
    opacity: 1;
  }
}
.object_bar {
  min-height: 0;
}
.thin_loading {
  position: sticky;
  bottom: 0;
}

@media screen and (min-width: 768px) {
  .tasks_wrap {
    padding-bottom: 36px;
  }
  .available-tasks__header {
    padding-top: 24px;
    padding-bottom: 16px;
  }

  .available-tasks__tabs {
    margin: 0 24px;
    margin-bottom: 32px;
  }
  .map {
    margin-bottom: 30px;
    height: 700px;
  }
  .map_objects_container {
    margin: 0 24px;
  }
  .object_bar_wrap {
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    border-radius: 0;
    grid-template-columns: 0fr;
    transition: all 400ms ease-in-out;
    opacity: 0;
    &.open {
      grid-template-columns: 1fr;
      width: 375px;
      opacity: 1;
      height: 100%;
    }
  }
  .object_bar {
    min-width: 375px;
  }
}
</style>
