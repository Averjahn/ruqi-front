<template>
  <Popup v-model:show="isSelectPopupOpen">
    <PopupContainer class="modal_popup" title="Выберите город" maxWidth="600px" @close="close">
      <div class="select_city_body">
        <SearchAutocomplete
          class="address_input"
          clearable
          v-model="search_region.city_name"
          :disabled="loading"
          :z-index="250"
          @onInput="clearCoord"
        />
      </div>
      <div class="quick_options">
        <div class="popular_cities">
          <div
            v-for="(city, i) in defaultCities"
            class="city"
            :class="{ selected: city.city_name === search_region.city_name }"
            :key="i"
            @click="selectCity(city)"
          >
            {{ city.city_name }}
            <img src="@/assets/icon_deprecated/checkmark_blue.svg" />
          </div>
        </div>
      </div>
      <template v-slot:footer>
        <div class="action_block">
          <Button :disabled="!search_region.city_name.length || loading" :loading="loading" @click="confirmCity">
            Ок
          </Button>
        </div>
      </template>
    </PopupContainer>
  </Popup>

  <div class="container">
    <Menu v-model="isConfirmMenuOpen" openMode="innerControl" horizontalAlign="rightBorder" :offsetY="8" :zIndex="200">
      <template #activator>
        <div class="region_button" @click="openSelectRegion">
          <img class="location_icon" src="@/assets/icons/point.svg" />
          <div class="region_name">{{ title }}</div>
          <img class="chevron" src="@/assets/icons/arrow_down.svg" />
        </div>
      </template>

      <div class="confirm_modal drop_menu_global">
        <div class="defined_city">
          Ваш город <b>{{ search_region.city_name }}?</b>
        </div>
        <div class="action_block">
          <Button type="outlined" :disabled="loading || disabled" @click="onAnotherCity">Нет, другой</Button>
          <Button :disabled="disabled" :loading="loading" @click="confirmCity">Да, верно</Button>
        </div>
      </div>
    </Menu>
  </div>
</template>

<script>
import PopupContainer from '@/components/atoms/PopupContainer.vue'
import SearchAutocomplete from '@/components/organisms/SearchAutocomplete.vue'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { YANDEX_MAP_API_TOKEN } from '@/constants/constants'

const initSearchRegion = {
  city_name: '',
  lon: '',
  lat: '',
}

const defaultCities = {
  moscow: {
    id: 'moscow',
    city_name: 'Москва',
    lon: '37.617698',
    lat: '55.755864',
  },
  spb: {
    id: 'spb',
    city_name: 'Санкт-Петербург',
    lon: '30.314997',
    lat: '59.938784',
  },
  ekaterinburg: {
    id: 'ekaterinburg',
    city_name: 'Екатеринбург',
    lon: '60.597474',
    lat: '56.838011',
  },
  kazan: {
    id: 'kazan',
    city_name: 'Казань',
    lat: '55.796127',
    lon: '49.106414',
  },
  kovrov: {
    id: 'kovrov',
    city_name: 'Ковров',
    lat: '56.362506',
    lon: '41.310933',
  },
  // nNovgorod: {
  //   id: 'nNovgorod',
  //   city_name: 'Нижний Новгород',
  //   lon: '44.006516',
  //   lat: '56.326797',
  // },
  novosibirsk: {
    id: 'novosibirsk',
    city_name: 'Новосибирск',
    lon: '82.92043',
    lat: '55.030204',
  },
  perm: {
    id: 'perm',
    city_name: 'Пермь',
    lat: '58.010455',
    lon: '56.229443',
  },
  pushkin: {
    id: 'pushkin',
    city_name: 'Пушкин',
    lon: '30.416767',
    lat: '59.722336',
  },
  saratov: {
    id: 'saratov',
    city_name: 'Саратов',
    lat: '51.533338',
    lon: '46.034176',
  },
}

export default {
  name: 'Region',
  components: { PopupContainer, SearchAutocomplete },
  props: {},
  data () {
    return {
      loading: false,
      disabled: false,
      search_region: JSON.parse(JSON.stringify(initSearchRegion)),
      isConfirmMenuOpen: false,
      isSelectPopupOpen: false,
      defaultCities: JSON.parse(JSON.stringify(defaultCities)),
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    title () {
      return this.search_region?.city_name || 'Выбрать местоположение'
    },
  },
  mounted () {
    if (!this.user?.search_region?.city_name) {
      this.defineRegion()
    } else {
      this.search_region = this.user.search_region
    }
  },
  unmounted () {},
  watch: {},
  methods: {
    ...mapActions('notifications', ['showNotification']),
    ...mapMutations('user', ['updateUserData']),

    async defineRegion () {
      if (navigator?.geolocation?.getCurrentPosition) {
        navigator.geolocation.getCurrentPosition(this.fetchDefineRegion, this.fetchDefineRegion, { timeout: 10000 })
      } else {
        this.fetchDefineRegion()
      }
    },

    async fetchDefineRegion (position) {
      const params = {}
      if (position?.coords?.latitude) {
        params.lat = position.coords.latitude
        params.lon = position.coords.longitude
      }
      const response = await this.$axios.get('https://locator.ruqi.ru/api/geo', { params })
      if (response?.data?.city_name && response?.data?.country_code === 'RU') {
        this.search_region = response.data
        this.isConfirmMenuOpen = true
      } else {
        this.isSelectPopupOpen = true
      }
    },

    async defineCoord () {
      const response = await this.$axios.get(
        `https://geocode-maps.yandex.ru/1.x/?apikey=${YANDEX_MAP_API_TOKEN}&geocode=${this.search_region.city_name}&format=json`,
      )
      let lon = 37.61
      let lat = 55.75
      const pos = response?.data?.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject?.Point?.pos
      if (pos) [lon, lat] = pos.split(' ')
      this.search_region.lat = lat
      this.search_region.lon = lon
    },

    async confirmCity () {
      if (!this.search_region.lat || !this.search_region.lon) await this.defineCoord()
      this.fetchConfirmCity({ search_region: this.search_region })
    },

    async fetchConfirmCity (params) {
      this.loading = true
      const response = await this.$axios.post('v1/user/region', params, {
        errorMessage: 'Ошибка при попытке сохранить регион',
      })
      if (response?.data?.success) {
        this.isConfirmMenuOpen = false
        this.isSelectPopupOpen = false
        this.updateUserData({
          search_region: response.data.data,
        })
        this.showNotification({ type: 'success', text: 'Регион успешно сохранён' })
      }
      this.loading = false
    },

    selectCity (city) {
      this.search_region = JSON.parse(JSON.stringify(city))
    },
    onAnotherCity () {
      this.isConfirmMenuOpen = false
      this.isSelectPopupOpen = true
    },
    openSelectRegion () {
      this.isSelectPopupOpen = true
      this.isConfirmMenuOpen = false
    },
    clearCoord () {
      this.search_region.lat = ''
      this.search_region.lon = ''
    },
    close () {
      this.isConfirmMenuOpen = false
      this.isSelectPopupOpen = false
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  overflow: hidden;
  max-width: 100%;
}
.confirm_modal {
  max-width: 400px;
  width: 100%;
  padding: 16px !important;
}
.region_button {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  user-select: none;
  .chevron {
    display: block;
  }

  @media (any-hover: hover) {
    &:hover {
      color: #61768c;
    }
  }
}
.region_name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.action_block {
  margin-top: 8px;
  display: flex;
  gap: 16px;
  & > div {
    flex: 1;
  }
  .rq_button {
    white-space: nowrap;
  }
}
.address_input {
  margin-bottom: 8px;
}
.quick_options {
  padding: 0 16px;
}
.auto_button {
  margin-bottom: 16px;
}
.popular_cities {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 700;
  margin-bottom: 16px;
}
.city {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 24px;
  cursor: pointer;
  user-select: none;
  img {
    display: none;
  }
  &.selected {
    color: #0082de;
    img {
      display: block;
    }
  }
  &:hover {
    color: #004474;
    &.selected {
      color: #0076ca;
    }
  }
}
.select_city_body {
  margin-bottom: 24px;
}
.defined_city {
  font-weight: 400;
  margin-bottom: 16px;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
@media (max-width: 768px) {
  .region_button {
    .location_icon {
      display: none;
    }
  }
  .chevron {
    display: none;
  }
}
</style>
