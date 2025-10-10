<template>
  <div class="object_block">
    <div class="object_data">
      <div class="header">
        <ObjectLogo :logo="task?.object?.logo_thumb_48x48" class="object_logo" />
        <div class="object_name_block">
          <div v-if="task.object" class="object_name">{{ task?.object?.view_name ?? task?.object?.name }}</div>
          <div v-if="rating" class="rating">
            <img src="@/assets/icon_deprecated/star-full.svg" />
            {{ rating }}
          </div>
        </div>

        <div class="action_btn_block">
          <img
            @click="onSubscribe"
            style="cursor: pointer"
            v-if="task.is_subscribe"
            src="@/assets/icons/heart_filled.svg"
          />
          <img v-else @click="onSubscribe" style="cursor: pointer" src="@/assets/icons/heart.svg" />
        </div>
      </div>

      <div class="tasks_counter">
        Заявок: <span>{{ count_tasks }}</span>
      </div>

      <div class="tasks_counter">{{ address }}</div>
      <div @click="makeRoute" class="make_route">
        <img class="route-link" src="@/assets/icons/point_blue_outlined.svg" />
        <div class="make_route_text">Проложить маршрут</div>
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
      <Button
        v-if="object_uuid"
        class="object_action_button"
        size="m"
        type="outlined"
        @click="$router.push('/object/' + object_uuid)"
      >
        Об объекте
      </Button>
    </div>
    <div
      v-if="(contactPhone || task?.contacts?.tg) && ['requested', 'acceptInvited', 'working'].includes(task.calcStatus)"
      class="object_contact"
    >
      <div class="contact_name">Менеджер объекта</div>
      <div class="contact_data">
        <div v-if="contactPhone" class="contact_item" @click="makeCall(contactPhone)">
          <img style="cursor: pointer" class="call_icon" src="@/assets/icons/person_call.svg" />
          <div class="contact_phone">{{ contactPhone }}</div>
        </div>
        <div v-if="task?.contacts?.tg" class="contact_item" @click="contactTelegram">
          <img style="cursor: pointer" class="call_icon" src="@/assets/icons/chat.svg" />
          <div class="contact_phone">Написать в телеграм</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import YaMap from '@/components/organisms/Map.vue'
import ObjectLogo from '@/components/atoms/ObjectLogo.vue'
import { formatPhone } from '@/constants/masks'
import { mapGetters } from 'vuex'

export default {
  name: 'ObjectBlock',
  components: { YaMap, ObjectLogo },
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      routeLink: null,
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    address () {
      if (this.task.location?.scheme) return this.task.location.scheme
      if (this.task.location?.region && this.task.location?.city)
        return this.task.location.region + ', ' + this.task.location.city
      if (this.task.object?.address) return this.task.object?.address
      return null
    },
    object_uuid () {
      return this.task?.object?.uuid
    },
    contactPhone () {
      const { formattedValue } = formatPhone({ value: this?.task?.contacts?.phone || '' })
      return formattedValue
    },
    count_tasks () {
      return this.task?.object?.count_tasks || ''
    },
    rating () {
      return this.task?.object?.raiting || ''
    },
    hasCoordinates () {
      const lat = +this.task?.location?.coordinates?.lat
      const lon = +this.task?.location?.coordinates?.lon
      return !!lat && !!lon
    },
    taskCoordinates () {
      const lat = +this.task?.location?.coordinates?.lat
      const lon = +this.task?.location?.coordinates?.lon
      return { lat, lon }
    },
    mapCenter () {
      return [this.task?.location?.coordinates?.lat, this.task?.location?.coordinates?.lon]
    },
    mapMarker () {
      return [
        {
          geometry: {
            type: 'Point',
            coordinates: [this.task?.location?.coordinates?.lat, this.task?.location?.coordinates?.lon],
          },
          properties: {
            hintContent: this.task.name,
          },
          uuid: this.task.uuid,
          info: this.task.description,
          is_subscribe: this.task.is_subscribe,
          logo: this.task.object?.logo_thumb_48x48,
        },
      ]
    },
  },
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    onSubscribe () {
      this.$emit(this.task.is_subscribe ? 'unsubscribe' : 'subscribe')
    },

    makeCall (number) {
      navigator.clipboard.writeText(number)
      const telUrl = `tel:${number}`
      window.location.href = telUrl
    },

    async makeRoute () {
      const { lat, lon } = this.taskCoordinates
      const regionLocation = `https://yandex.ru/maps/?rtext=${this.user?.search_region?.lat ?? '55.75'},${this.user?.search_region?.lon ?? '37.61'}~${lat},${lon}&rtt=mt`

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLatitude = position.coords.latitude
            const userLongitude = position.coords.longitude
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
    contactTelegram () {
      window.open(this?.task?.contacts?.tg, '_blank')
    },
  },
}
</script>

<style lang="scss" scoped>
.object_block {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.object_data,
.object_contact {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  border-radius: 14px;
  border: 1px solid #dadada;
}

.object_contact {
  letter-spacing: 0px;
}
.contact_name {
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
}
.contact_item {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  .contact_phone {
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
  }
}

.header {
  align-items: center;
  display: flex;
  gap: 12px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 50%;
  background: #71d472;
}

.object_name_block {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3px 0;
  overflow: hidden;
}

.object_name {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 5px;
  overflow: hidden;
  white-space: nowrap;
  line-height: 25px;
  text-overflow: ellipsis;
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
.action_btn_block {
  display: flex;
  justify-content: flex-end;
}
.action_btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #dadada;
  cursor: pointer;
  user-select: none;
}

.tasks_counter {
  color: #7a91a9;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  text-align: left;

  span {
    color: #263043;
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
    text-align: left;
  }
}

.address {
  font-weight: 400;
}

.map {
  border-radius: 14px 14px 0px 0px;
  overflow: hidden;
  height: 124px;
}

.route-link {
  display: block;
  width: 24px;
  height: 24px;
}
.contact_data {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

@media (max-width: 999px) {
  .object_data {
    border: none;
    padding: none;
    background-color: #f5f5f5;
  }
  .object_contact {
    border: none;
    padding: unset;
  }

  .make_route {
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
  }
  .object_name_block {
    grid-row: 2;
    grid-column: 1 / 3;
  }

  .object_name {
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
    text-align: left;
    white-space: normal;
  }

  .action_btn_block {
    grid-row: 1;
    grid-column: 2;
  }
  .tasks_counter {
    font-size: 14px;
    span {
      font-size: 14px;
      line-height: 17.5px;
    }
  }
}
</style>
