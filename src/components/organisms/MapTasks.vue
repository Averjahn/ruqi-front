<template>
  <div ref="map" class="map_tasks_container"></div>
</template>

<script>
import { initYandexMap } from '@/plugins/ymapPlugin'
import { mapActions, mapGetters } from 'vuex'
import { getAPIError } from '@/constants/helpers'
import { debounce, loadPlacemarkIcon } from '@/constants/helpers'

export default {
  name: 'YaMap',
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
    object: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      loading: true,
      center: [55.7708, 37.5967],
      objects: [],
      bounds: [
        [53.74233172960166, 33.81263677328144],
        [58.057531002151435, 41.492080132656426],
      ],
    }
  },
  computed: {
    ...mapGetters('profilePage', ['profile']),
    ...mapGetters('user', ['user']),
  },
  async mounted () {
    await this.fetchProfileOnce()
    this.setInitCoord()
    initYandexMap(this.initMap)
  },
  watch: {
    'object.is_subscribe': {
      handler () {
        this.setGeoObjects()
      },
    },
    ['user.search_region']: {
      handler (val) {
        this._map?.setCenter([val.lat, val.lon])
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions('profilePage', ['fetchProfileOnce']),
    ...mapActions('notifications', ['showNotification']),

    loadObjects: debounce(function () {
      this.fetchObjects()
    }, 700),

    async fetchObjects () {
      this.loading = true
      const response = await this.$axios.get('v2/user/geo/objectwtasks', {
        params: {
          bounds: JSON.stringify(this._map.getBounds()),
          ...this.params,
        },
      })

      if (response?.data?.success) {
        this.objects = response?.data?.data
        this.setGeoObjects()
      } else {
        this.showNotification({ text: getAPIError(response) || 'Ошибка при отправке данных на сервер' })
      }
      this.loading = false
    },

    initMap () {
      const self = this
      this._map = new window.ymaps.Map(this.$refs.map, {
        center: this.center,
        zoom: 10,
      })

      this._map
      const zoom = this._map.getZoom()
      if (zoom > 14) this._map.setZoom(14)

      this._map.controls.remove('zoomControl')
      this._map.controls.remove('searchControl')
      this._map.controls.remove('trafficControl')
      this._map.controls.remove('typeSelector')
      this._map.controls.remove('routeEditor')
      this._map.controls.remove('routePanelControl')
      this._map.controls.remove('fullscreenControl')
      this._map.controls.remove('rulerControl')
      this._map.controls.remove('geolocationControl')
      this._map.controls.remove('routeButtonControl')

      this._map.events.add('boundschange', function (event) {
        self.loadObjects()
      })

      this._map.events.add('click', function () {
        self.$emit('closeObject')
      })

      self.fetchObjects()
    },

    setGeoObjects () {
      const self = this
      this._map.geoObjects.removeAll()

      const myGeoObjects = []
      this.objects.forEach((item) => {
        if (item?.lat && item?.lon) {
          const circleLayout = window.ymaps.templateLayoutFactory.createClass(`<ymaps style="border-color: ${
            item.is_subscribe ? '#9747FF' : '#1735F5'
          }; background-image: url(${item.logo_thumb_48x48}); " class="placemark_layout_container">
              </ymaps>`)
          const myPlacemark = new window.ymaps.Placemark(
            [+item.lat, +item.lon],
            {
              hintContent: item.view_name,
            },
            {
              iconLayout: 'default#image',
              iconImageHref: this.getDefaultPlacemarkIcon(item),
              iconImageSize: [40, 40],
              iconImageOffset: [-20, -40],
              balloonCloseButton: false,
              hideIconOnBalloonOpen: false,
              balloonPanelMaxMapArea: 0,
            },
          )
          loadPlacemarkIcon(item.logo_thumb_48x48).then((icon) => {
            if (icon) {
              myPlacemark.options.set('pane', 'overlaps')

              myPlacemark.options.set('iconShape', {
                type: 'Circle',
                coordinates: [0, 0],
                radius: 24,
              })
              myPlacemark.options.set('iconLayout', circleLayout)
            }
          })
          myPlacemark.events.add('click', function () {
            self.$emit('openObject', item)
          })
          myPlacemark.balloon.events.add('open', function () {})
          myGeoObjects.push(myPlacemark)
        }
      })

      var clusterer = new window.ymaps.Clusterer({ clusterDisableClickZoom: false, clusterIconColor: '#1735F5' })
      clusterer.add(myGeoObjects)
      this._map.geoObjects.add(clusterer)

      const objectManager = new window.ymaps.ObjectManager({
        clusterize: true,
      })
      this._map.geoObjects.add(objectManager)
    },

    getDefaultPlacemarkIcon (task) {
      if (task.is_subscribe) return require('@/assets/icon_deprecated/location_purple.svg')
      return require('@/assets/icons/location_blue.svg')
    },

    callAction (action) {
      this.$emit('callAction', action)
    },

    setInitCoord () {
      const lat = this.user.search_region?.lat || this.profile?.addresses?.[0]?.lat || this.center[0]
      const lon = this.user.search_region?.lon || this.profile?.addresses?.[0]?.lon || this.center[1]
      this.center = [lat, lon]
    },
  },
}
</script>

<style lang="scss">
.map_tasks_container {
  height: 100%;
  .placemark_layout_container {
    width: 48px;
    z-index: 999;
    height: 48px;
    background: #fff;
    border: 4px solid transparent;
    background-size: 40px;
    background-position: 4px 4px;
    background-repeat: no-repeat;
    border-radius: 50%;
    position: absolute;
    top: -48px;
    left: -28px;
  }
  .ymaps-2-1-79-balloon__layout {
    border-radius: 14px;
  }
  .ymaps-2-1-79-balloon {
    padding: 0;
    border-radius: 14px;
  }
  .ymaps-2-1-79-balloon__content {
    padding-top: 12px !important;
    padding-bottom: 12px !important;
  }
  .ymaps-2-1-79-balloon__content > ymaps {
    width: 100% !important;
    height: 100% !important;
  }
}
.task_balloon {
  width: 320px;
  min-height: 270px;
}
#button {
  display: inline-block;
  background-color: bisque;
  padding: 5px 20px;
  border-radius: 10px;
  cursor: pointer;
}
</style>

<style lang="scss" scoped>
.map_tasks_container {
  overflow: hidden;
  height: 400px;
}
</style>
