<template>
  <div class="object_item_block">
    <div class="top_block">
      <ObjectLogo :logo="object.logo_thumb_48x48" class="object_logo" />
      <div class="object_name">{{ object.view_name ?? object.name }}</div>
    </div>
    <div class="object_main_block">
      <div class="rating_address">
        <Rating :rating="object.rating" />
        <div class="object_block_address">{{ object.address }}</div>
        <div class="object_task_count">{{ `${taskCount} ${declensionOfNumber(taskCount, labelTasks)}` }}</div>
      </div>
      <div class="object_action_block">
        <Button @click="$emit('showTasks')" class="action_btn">Смотреть заявки</Button>
        <Button class="action_btn" @click="onSubscribe(subscribeAction)" :loading="subscribeLoading" type="outlined">
          <Icon :size="24" color="#1735F5" :name="heartType" />
          <span>{{ subscribeText }}</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Rating from '@/components/atoms/Rating.vue'
import ObjectLogo from '@/components/atoms/ObjectLogo.vue'
import { getDisplayedNumber, getAPIError, declensionOfNumber } from '@/constants/helpers'

export default {
  components: { Rating, ObjectLogo },
  props: {
    taskCount: {
      type: Number,
      default: 0,
    },
    object: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      subscribeLoading: false,
      labelTasks: ['заявка', 'заявки', 'заявок'],
      declensionOfNumber,
    }
  },
  computed: {
    subscribeText () {
      return this?.object.is_subscribe ? 'Убрать из избранного' : 'Добавить в избранное'
    },
    subscribeAction () {
      return !this?.object.is_subscribe ? 'subscribe' : 'unsubscribe'
    },
    heartType () {
      return !this?.object.is_subscribe ? 'heart' : 'heartFilled'
    },
  },
  async created () {},
  methods: {
    getDisplayedNumber,
    ...mapActions('notifications', ['showNotification']),

    async onSubscribe (action) {
      this.subscribeLoading = true
      const response = await this.$axios.post(
        'v2/user/objects/' + action,
        { object_uuids: [this.$route.params.id] },
        { errorMessage: 'Ошибка при изменении статуса подписки' },
      )
      if (response?.data?.success) this.$emit('updateSubscribe', action === 'subscribe')
      this.subscribeLoading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.object_item_block {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 32px;
  padding: 24px;
  border-radius: 14px;
  border: 1px solid #dadada;
  .top_block {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .object_name {
    font-size: 24px;
    font-weight: 600;
    line-height: 30px;
    text-align: left;
  }
}
.object_main_block {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
  .rating_address {
    color: #666666;
    display: flex;
    flex-direction: row;
    gap: 24px;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    text-align: left;
  }
}

.object_action_block {
  flex-shrink: 1;
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 16px;
}
.action_btn {
  flex: 1;
}

@media (max-width: 999px) {
  .object_item_block {
    padding: 16px;
  }
  .object_name {
    font-size: 16px;
    line-height: 20px;
    text-align: left;
  }
  .object_main_block {
    .rating_address {
      flex-direction: column;
      gap: 8px;
    }
  }
  .object_action_block {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
