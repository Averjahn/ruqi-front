<template>
  <div class="object_container">
    <div class="header">
      <div class="logo_frame">
        <div class="logo">
          <ObjectLogo :logo="object.logo_thumb_48x48" class="object_logo" />
        </div>
      </div>
      <div class="description">
        <div class="title">
          <div class="name">{{ object.name }}</div>
          <Rating :rating="object.rating" oneStar />
        </div>
        <div class="address">{{ object.address }}</div>
      </div>
      <div class="favorite">
        <div class="action_btn_block">
          <div class="action_btn" @click.stop="onSubscribe(object)">
            <img v-if="object.is_subscribe" src="@/assets/icons/heart_filled.svg" />
            <img v-else src="@/assets/icons/heart.svg" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="object.rate" class="price">до {{ getDisplayedNumber(getNetRate(object.rate)) }} р./смена</div>

    <div class="vacancies">
      <div class="title">На объекте требуются:</div>
      <div class="vacancy_list">
        <ProfessionLabel v-for="profession in object.professions" :key="profession" :profession="profession" size="s" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ObjectLogo from '@/components/atoms/ObjectLogo.vue'
import Rating from '@/components/atoms/Rating.vue'
import ProfessionLabel from '@/components/atoms/ProfessionLabel.vue'
import { getAPIError } from '@/constants/helpers'
import { getDisplayedNumber } from '@/constants/helpers'

export default {
  components: { ObjectLogo, Rating, ProfessionLabel },
  props: {
    object: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      subscribeLoading: false,
    }
  },
  computed: {},
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    ...mapActions('notifications', ['showNotification']),
    getDisplayedNumber,
    getNetRate (rate) {
      if (rate) {
        const netRate = rate - ((6 * rate) / 100)
        return rate
      } else {
        return ''
      }
    },
    async onSubscribe (object) {
      this.subscribeLoading = true
      const action = object.is_subscribe ? 'unsubscribe' : 'subscribe'
      const response = await this.$axios.post('v2/user/objects/' + action, { object_uuids: [object.uuid] })
      if (response?.data?.success) {
        const objectCopy = JSON.parse(JSON.stringify(this.objects.find((item) => item.uuid === object.uuid)))
        objectCopy.is_subscribe = action === 'subscribe'
        this.$emit('updateObject', objectCopy)
      } else {
        this.showNotification({
          type: 'error',
          text: getAPIError(response) || 'Ошибка при изменении статуса подписки',
        })
      }
      this.subscribeLoading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.object_container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  flex: 1;
  min-width: 402px;
  border-radius: 16px;
  border: 1px solid #dadada;
  padding: 24px;
  user-select: none;
  cursor: pointer;
}
.header {
  display: flex;
  gap: 12px;
  align-items: center;
  .logo_frame {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border: 1px solid #dadada;
    border-radius: 50%;
    background-color: white;
  }
  .logo {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .description {
    flex: 1;
    overflow: hidden;
  }
  .title {
    display: flex;
    gap: 12px;
  }
  .name {
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
  }
  .address {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    font-size: 14px;
    color: #7a91a9;
  }
  .favorite {
    align-self: start;
  }
  .action_btn_block {
    display: flex;
    justify-content: flex-end;
  }
  .action_btn {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    width: 24px;
    height: 24px;
    cursor: pointer;
    user-select: none;
  }
}

.price {
  font-size: 22px;
  font-weight: 600;
}

.vacancies {
  display: flex;
  flex-direction: column;
  gap: 12px;
  .title {
    font-weight: 400;
    font-size: 14px;
    color: #666666;
  }
}

.vacancy_list {
  display: flex;
  flex-wrap: wrap;
  row-gap: 6px;
  column-gap: 8px;
  overflow: hidden;
  max-height: 53px;
}

@media (max-width: 450px) {
  .object_container {
    min-width: auto;
  }
}
</style>
