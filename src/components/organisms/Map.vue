<template>
  <div ref="map" class="map_tasks_container"></div>
</template>

<script>
import { initYandexMap } from '@/plugins/ymapPlugin'
import { loadPlacemarkIcon, getDisplayedNumber } from '@/constants/helpers'

export default {
  name: 'YaMap',
  props: ['center_coords', 'markers', 'zoom', 'placemark_size', 'entity'],
  data () {
    return {
      actionUUId: null,
    }
  },
  async mounted () {
    initYandexMap(this.initMap)
  },
  watch: {
    markers () {
      this.setGeoObjects()
    },
    center_coords () {
      this._map.setCenter(this.center_coords)
    },
  },
  methods: {
    getDisplayedNumber,
    initMap () {
      // eslint-disable-next-line no-undef
      this._map = new ymaps.Map(this.$refs.map, {
        center: [55.7708, 37.5967],
        zoom: 7,
      })
      if (this.zoom) this._map.setZoom(this.zoom)
      if (this.center_coords) this._map.setCenter(this.center_coords)
      this._map.controls.remove('searchControl')
      this._map.controls.remove('trafficControl')
      this._map.controls.remove('typeSelector')
      this._map.controls.remove('routeEditor')
      this._map.controls.remove('routePanelControl')
      this._map.controls.remove('fullscreenControl')
      this._map.controls.remove('rulerControl')
      this._map.controls.remove('geolocationControl')
      this._map.controls.remove('routeButtonControl')
      this._map.controls.remove('RulerButton')
      this._map.behaviors.disable(['scrollZoom'])
      // Убеждаемся, что карта занимает всю высоту контейнера
      this.$nextTick(() => {
        if (this._map) {
          // Принудительно устанавливаем размеры карты
          const container = this.$refs.map
          if (container) {
            const height = container.offsetHeight || 600
            // eslint-disable-next-line no-undef
            this._map.container.getElement().style.height = height + 'px'
            this._map.container.fitToViewport()
          }
        }
      })
      this.setGeoObjects()
    },
    setGeoObjects () {
      const self = this
      this._map.geoObjects.removeAll()
      this.markers.forEach((item) => {
        if (item.geometry?.coordinates) {
          // eslint-disable-next-line no-undef
          const circleLayout = ymaps.templateLayoutFactory.createClass(`<ymaps style="border-color: ${
            item.is_subscribe ? '#9747FF' : '#0082DE'
          }; background-image: url(${item.logo});  " class="placemark_layout_container ${this.placemark_size ?? ''}">
              </ymaps>`)
          // eslint-disable-next-line no-undef
          const myPlacemark = new ymaps.Placemark(
            item.geometry.coordinates,
            {
              hintContent: item.properties.hintContent,
            },
            {
              iconLayout: 'default#image',
              iconImageHref: this.getPlacemarkIcon(item),
              iconImageSize: [40, 40],
              iconImageOffset: [-20, -40],
              balloonCloseButton: false,
              hideIconOnBalloonOpen: false,
              balloonPanelMaxMapArea: 0,
            },
          )
          self._map.geoObjects.add(myPlacemark)
          self._map.events.add('click', function () {
            self._map.balloon.close()
          })
          loadPlacemarkIcon(item.logo).then((icon) => {
            if (icon) {
              myPlacemark.options.set('pane', 'overlaps')

              myPlacemark.options.set('iconShape', {
                type: 'Circle',
                coordinates: [0, 0],
                radius: this.placemark_size === 'small' ? 12 : 24,
              })
              myPlacemark.options.set('iconLayout', circleLayout)
            }
          })
        }
      })
    },

    getNetRate (rate) {
      if (rate) {
        const netRate = rate - ((6 * rate) / 100)
        return rate
      } else {
        return ''
      }
    },

    getPlacemarkIcon (item) {
      if (item.is_subscribe) return require('@/assets/icon_deprecated/location_purple.svg')
      return require('@/assets/icon_deprecated/location_blue.svg')
    },

    balloonTemplate (info) {
      if (this.entity === 'contractor') {
        let task_date

        if (info.start_date) {
          task_date =
            this.parseDate({
              date: info.start_date.substr(0, 10),
              type: 'date',
            }) +
            ' ' +
            info.start_date.substring(11, 16)
        }

        let icon_object =
          '<i aria-hidden="true" class="v-icon notranslate mdi mdi-star-outline theme--light" style="color: rgb(244, 209, 80); caret-color: rgb(244, 209, 80);"></i>'

        if (info.subscribe) {
          icon_object =
            '<i aria-hidden="true" class="v-icon notranslate mdi mdi-star theme--light" style="color: rgb(244, 209, 80); caret-color: rgb(244, 209, 80);"></i>'
        }

        return `
          <h2 class="balloon-header">${info.name}</h2>
          <div class="status">открыт набор</div>
          <div class="wrap-rate-date">
          <div class="rate">${getDisplayedNumber(this.getNetRate(info.rate))} р./смена</div><div class="date">${task_date}</div></div>
          <div class="wrap-professions">${info.professions}</div>
          <div class="wrap-object">${icon_object} ${info.object?.view_name ?? info.object?.name}</div>
          <button id="request_task" type="button" class="elevation-0 add btn-blue
          v-btn baloon-btn"><span class="v-btn__content">откликнуться</span></button>
        `
      } else {
        let balloon = `<h2 class="balloon-header">${info.info?.name ?? 'Объект'}</h2>`
        if (info.info?.address) {
          balloon += `<p>${info.info?.address}</p>`
        }
        if (info.info?.description) {
          balloon += `<p>Описание: ${info.info?.description}</p>`
        }
        if (info.uuid) {
          balloon += `<a href="/object/${info.uuid}">Перейти</a>`
        }
        return balloon
      }
    },

    parseDate: (payload = {}) => {
      const date = payload.date.split('-')

      if (payload.type === 'date') {
        return `${date[2]}.${date[1]}.${date[0]}`
      }
    },

    requestBtn (uuid) {
      this.actionUUId = uuid
      if (this.entity === 'contractor') {
        document.getElementById('request_task').addEventListener('click', this.handlerTask)
      }
    },

    handlerTask () {
      this.$emit('action', this.actionUUId)
    },
  },
}
</script>

<style lang="scss" scoped>
.map_tasks_container {
  width: 100%;
  height: 100%;
  min-height: 400px;
  position: relative;
  
  :deep(.ymaps-2-1-79-map) {
    width: 100% !important;
    height: 100% !important;
    min-height: 400px;
  }
}

.ymap-container {
  width: 100%;
  height: 100%;

  .ymaps-2-1-79-balloon {
    border: 1px solid #e0e0e0;
    border-radius: 14px;
    box-shadow: none;
    overflow: hidden;
    padding: 16px;
    width: 355px;
    background: #fff;
  }

  .ymaps-2-1-79-balloon__tail {
    display: none;
  }
}

.balloon-header {
  font-weight: 600;
  font-size: 16px;
}

.map-container {
  overflow: hidden;
}

.map-container .status {
  padding: 4px 8px;
  height: 24px;
  box-sizing: border-box;
  border-radius: 5px;
  display: inline-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: center;
  align-items: center;
  background: #e4f4ff;
  border: 1px solid #0082de;
  font-weight: 700;
  font-size: 12px;
  color: #0082de;
  text-transform: uppercase;
  margin: 16px 0;
}

.wrap-rate-date {
  display: flex;
  align-items: center;
  line-height: 1;
  margin-bottom: 16px;

  .rate {
    font-weight: 700;
    font-size: 16px;
    margin-right: 16px;
  }

  .date {
    font-weight: 600;
    font-size: 16px;
  }
}

.wrap-professions {
  font-weight: 600;
  font-size: 14px;
  line-height: 2;
  color: #666;
  display: flex;
  flex-direction: column;
}

.wrap-object {
  font-weight: 600;
  font-size: 14px;
  margin: 24px 0;
  display: flex;
  align-items: center;

  .v-icon {
    margin-right: 6px;
  }
}

.baloon-btn {
  height: 48px;
  width: 100%;
  font-weight: 700;
  font-size: 14px;
  border-radius: 8px;
}
</style>

<style lang="scss">
.placemark_layout_container {
  width: 48px;
  z-index: 999;
  height: 48px;
  background: #fff;
  border-radius: 50%;
  border: 4px solid transparent;
  background-size: 40px;
  background-position: 4px 4px;
  background-repeat: no-repeat;
  position: absolute;
  top: -48px;
  left: -28px;
  &.small {
    width: 24px;
    height: 24px;
    border: 2px solid transparent;
    background-size: 20px;
    background-position: 2px 2px;
    top: -24px;
    left: -18px;
  }
}
</style>
