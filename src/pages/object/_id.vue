<template>
  <div class="object_page_container basic_container_global">
    <MobileAdBanners class="mobile_ad_banners" />
    <div class="object_page_desktop">
      <div class="left_column">
        <ObjectItemBlock
          class="description_block"
          :object="object"
          :taskCount="taskCount"
          @showTasks="showTasks"
          @updateSubscribe="updateSubscribe"
        />
        <div class="tasks_block">
          <div class="description_and_address">
            <ObjectDescriptionBlock :object="object" />
            <div class="section_block">
              <div class="section_block-header">Адрес</div>
              <div class="object_location_container">
                <div class="address_router">
                  <div class="object_address">{{ object.address }}</div>
                  <div @click="makeRoute" class="make_route">
                    <img class="route_link" src="@/assets/icons/point_blue_outlined.svg" />
                    <div class="make_route_text">Проложить маршрут</div>
                  </div>
                </div>
                <YaMap
                  v-if="hasCoordinates"
                  class="map"
                  :center_coords="mapCenter"
                  :markers="mapMarker"
                  zoom="12"
                  placemark_size="small"
                  height="124px"
                />
              </div>
            </div>
          </div>
          <div id="activeTasks" class="available_tasks">
            <div v-if="tasks.length" class="header_txt">Активные заявки</div>
            <TasksList :tasks="tasks" :showFavorites="false" :updateTask="updateTask" />
          </div>
          <div v-if="otherObjects.length" class="available_tasks">
            <div class="header_txt">Другие объекты</div>
            <ObjectsList class="object_list" :objects="otherObjects" @updateObject="updateObject" />
            <LazyLoad ref="lazyLoad" :callBack="loadMore" />
          </div>
        </div>
      </div>
      <div class="right_column">
        <DesktopAdBanners />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import YaMap from '@/components/organisms/Map.vue'
import TasksList from '@/components/page/contractorTasks/TasksList.vue'
import ObjectItemBlock from '@/components/page/object/ObjectItemBlock.vue'
import ObjectDescriptionBlock from '@/components/page/object/ObjectDescriptionBlock.vue'
import ObjectsList from '@/components/organisms/ObjectsList.vue'
import useGlobalLoading from '@/composables/useGlobalLoading'
import MobileAdBanners from '@/components/organisms/MobileAdBanners.vue'
import DesktopAdBanners from '@/components/organisms/DesktopAdBanners.vue'

export default {
  components: {
    DesktopAdBanners,
    TasksList,
    YaMap,
    ObjectItemBlock,
    ObjectDescriptionBlock,
    MobileAdBanners,
    ObjectsList,
  },
  props: {},
  setup () {
    const { startLoading, stopLoading, loading, resetLoading } = useGlobalLoading()
    return { startLoading, stopLoading, loading, resetLoading }
  },
  data () {
    return {
      subscribeLoading: false,
      tasks: [],
      otherObjects: [],
      object: {},
      busy: true,
      fetchParams: {
        page: 1,
        per_page: 10,
        sort: null,
        order: null,
        search: null,
      },
    }
  },
  computed: {
    hasCoordinates () {
      const lat = +this.object.lat
      const lon = +this.object.lon
      return !!lat && !!lon
    },
    taskCount () {
      return this.tasks?.length ?? 0
    },
    mapCenter () {
      return [this.object.lat, this.object.lon]
    },
    mapMarker () {
      return [
        {
          geometry: {
            type: 'Point',
            coordinates: [this.object.lat, this.object.lon],
          },
          properties: {
            hintContent: this.object.view_name,
          },
          uuid: this.object.uuid,
          info: this.object.description,
          is_subscribe: this.object.is_subscribe,
          logo: this.object?.logo_thumb_48x48,
        },
      ]
    },
    taskCoordinates () {
      const lat = +this.object?.location?.coordinates?.lat
      const lon = +this.object?.location?.coordinates?.lon
      return { lat, lon }
    },
  },
  mounted () {
    this.init()
  },
  unmounted () {},
  watch: {
    '$route.params.id' () {
      this.resetLoading()
      this.init()
    },
  },
  methods: {
    ...mapActions('notifications', ['showNotification']),

    async init () {
      this.busy = false
      this.fetchParams.page = 1
      this.loadObjects(false)
      this.fetchObject()
      this.fetchTasks()
    },

    showTasks () {
      const taskSection = document.getElementById('activeTasks')
      taskSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },

    async loadObjects (concat = false) {
      if (this.busy) return
      this.startLoading()
      const params = {
        ...this.fetchParams,
        without_object: this.$route.params.id,
      }
      const response = await this.$axios.get('v2/user/subscribableobjects', {
        params,
        errorMessage: 'Не удалось загрузить объекты',
      })
      if (response?.data?.success) {
        this.otherObjects = concat ? this.otherObjects.concat(response.data.data) : response.data.data
        this.busy = response?.data?.meta?.current_page >= response?.data?.meta?.last_page
      }
      this.stopLoading()
    },

    async makeRoute () {
      const { lat, lon } = this.taskCoordinates
      const regionLocation = `https://yandex.ru/maps/?rtext=${this.user?.search_region?.lat ?? '55.75'},${this.user?.search_region?.lon ?? '37.61'}~${lat},${lon}&rtt=mt`
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLatitude = position?.coords?.latitude
            const userLongitude = position?.coords?.longitude
            const routeLink = `https://yandex.ru/maps/?rtext=${userLatitude},${userLongitude}~${lat},${lon}&rtt=mt`
            window.open(routeLink, '_blank')
          },
          (error) => {
            window.open(regionLocation, '_blank')
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          },
        )
      } else {
        window.open(regionLocation, '_blank')
      }
    },

    async fetchTasks () {
      this.startLoading()
      const params = {
        object_uuid: this.$route.params.id,
        offset: 1,
        limit: 20,
      }
      const response = await this.$axios.get('v2/user/object/tasks', {
        params,
        errorMessage: 'Не удалось загрузить активные заявки',
      })
      if (response?.data?.success) this.tasks = response.data.data
      this.stopLoading()
    },

    async fetchObject () {
      this.startLoading()
      const response = await this.$axios.get('v2/user/object', {
        params: { uuid: this.$route.params.id },
        errorMessage: 'Не удалось загрузить данные объекта',
      })
      if (response?.data?.success) this.object = response.data.data
      this.stopLoading()
    },

    updateSubscribe (subscribe) {
      this.object.is_subscribe = subscribe
      this.tasks.forEach((item) => (item.is_subscribe = subscribe))
    },

    updateObject (object) {
      this.otherObjects.forEach((item) => {
        if (item.uuid === object.uuid) item.is_subscribe = object.is_subscribe
      })
    },

    updateTask (newTask) {
      this.tasks.forEach((task) => {
        if (task.uuid === newTask.uuid) Object.assign(task, newTask)
      })
    },

    loadMore () {
      if (!this.busy || !this.loading) {
        this.fetchParams.page++
        this.loadObjects(true)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.object_page_container {
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  width: 100%;
  column-gap: 32px;
  row-gap: 16px;
}
.mobile_ad_banners {
  display: none;
  padding-top: 12px;
}
.object_page_desktop {
  display: flex;
  gap: 32px;
  height: auto;
}
.left_column {
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
  overflow: hidden;
}
.right_column {
  width: 100%;
  max-width: 406px;
  min-width: 342px;
}
.description_and_address {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 32px;
  padding: 24px;
  border-radius: 14px;
  border: 1px solid #dadada;
}
.section_block {
  display: flex;
  width: auto;
  flex-direction: column;
  gap: 16px;
  .section_block-header {
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
    text-align: left;
  }
}
.object_location_container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}
.address_router {
  display: flex;
  flex-direction: column;
  gap: 4px;
  .object_address {
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0.1px;
    text-align: left;
  }
}

.make_route {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;
  color: #1735f5;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  text-align: left;
}
.route_link {
  display: block;
  width: 24px;
  height: 24px;
}
.tasks_block {
  display: flex;
  flex-direction: column;
  gap: 38px;
}
.object_list {
  width: 100%;
}
.map {
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
  height: 100px;
}

.available_tasks {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  .header_txt {
    color: #000000;
    font-size: 24px;
    font-weight: 600;
    line-height: 30px;
    text-align: left;
  }
}

.location_container {
  padding: 16px;
  border-radius: 14px;
  border: 1px solid #dadada;
}

@media (max-width: 1000px) {
  .mobile_ad_banners {
    display: flex;
  }
  .right_column {
    display: none;
  }
  .object_page_container {
    padding-top: unset;
    padding-bottom: 100px;
  }
  .tasks_block .description_and_address .section_block .section_block-header {
    font-size: 18px;
    line-height: 22px;
  }
}
</style>
