<template>
  <div class="object_bar">
    <div class="header_block mb_32">
      <div class="mobile_stick">
        <div></div>
      </div>
      <div class="header">
        <ObjectLogo :logo="object.logo_thumb_48x48" class="object_logo" />
        <div class="center_header">
          <div class="name_and_rating">
            <span class="object_name">{{ object.view_name ?? object.name }}</span>
            <Rating class="object_rating" :rating="object.rating" oneStar />
          </div>
          <div class="address">{{ object.address }}</div>
        </div>
        <div class="close" @click="$emit('close')">
          <img src="@/assets/icons/cross.svg" />
        </div>
      </div>

      <div class="action_block">
        <Button
          type="outlined"
          v-if="object.is_subscribe"
          :loading="subscribeLoading"
          @click="onSubscribe('unsubscribe')"
        >
          Отписаться от объекта
        </Button>
        <Button v-else :loading="subscribeLoading" @click="onSubscribe('subscribe')"> В избранное </Button>
        <Button type="outlined" @click="$router.push('/object/' + object.uuid)"> Подробнее </Button>
      </div>
    </div>
    <h3 class="tasks_title mb_24">Активные заявки</h3>
    <div class="task_list scrollbar">
      <TasksList
        :tasks="tasks"
        :loading="loading"
        :updateTask="updateTask"
        item-key="uuid"
        hide-default-footer
        disable-pagination
        class="mb_48"
      />
      <ThinLineLoading class="thin_loading" :show="tasksLoading" />
    </div>
  </div>
</template>

<script>
import ObjectLogo from '@/components/atoms/ObjectLogo.vue'
import Rating from '@/components/atoms/Rating.vue'
import TasksList from '@/components/page/contractorTasks/TasksList.vue'
import { mapActions, mapGetters } from 'vuex'
import { getAPIError } from '@/constants/helpers'

export default {
  name: 'ObjectBar',
  components: { ObjectLogo, Rating, TasksList },
  emits: ['close'],
  props: {
    object: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      subscribeLoading: false,
      tasksLoading: false,
      tasks: [],
    }
  },
  computed: {},
  mounted () {
    this.fetchTasks()
  },
  unmounted () {},
  watch: {
    'object.uuid' () {
      this.tasks = []
      this.fetchTasks()
    },
  },
  methods: {
    ...mapActions('notifications', ['showNotification']),

    async fetchTasks () {
      if (!this.object.uuid) return
      this.tasksLoading = true
      const params = {
        object_uuid: this.object.uuid,
        offset: 1,
        limit: 10,
      }
      const response = await this.$axios.get('v2/user/object/tasks', { params })
      if (response?.data?.success) {
        this.tasks = response.data.data
      } else {
        this.showNotification({
          type: 'error',
          text: getAPIError(response) || 'Не удалось загрузить активные заявки',
        })
      }
      this.tasksLoading = false
    },

    async onSubscribe (action) {
      this.subscribeLoading = true
      const response = await this.$axios.post('v2/user/objects/' + action, { object_uuids: [this.object.uuid] })
      if (response?.data?.success) {
        const object = this.object
        object.is_subscribe = action === 'subscribe'
        this.$emit('update:object', object)
      } else {
        this.showNotification({
          type: 'error',
          text: getAPIError(response) || 'Ошибка при изменении статуса подписки',
        })
      }
      this.subscribeLoading = false
    },

    updateTask (newTask) {
      this.tasks.forEach((task) => {
        if (task.uuid === newTask.uuid) Object.assign(task, newTask)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.object_bar {
  padding: 16px 0 0 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
  .header_block {
    margin-right: 16px;
  }
  .header {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }
  .center_header {
    padding-right: 34px;
  }
  .name_and_rating {
    margin-bottom: 4px;
  }
  .object_name {
    font-weight: 600;
    font-size: 16px;
  }
  .object_rating {
    display: inline-flex;
    margin-left: 12px;
    vertical-align: -1px;
    flex-wrap: nowrap;
  }
  .address {
    font-size: 14px;
    color: #666666;
  }
  .close {
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
  }
  .task_list {
    overflow-y: auto;
    padding-right: 16px;
  }
  .mobile_stick {
    margin-bottom: 16px;
    display: none;
    justify-content: center;
    div {
      width: 80px;
      height: 4px;
      border-radius: 16px;
      background: #f3f3f3;
    }
  }
  .tasks_title {
    font-weight: 600;
  }
  .action_block {
    display: flex;
    align-items: center;
    gap: 16px;
    > div {
      flex: 1;
    }
  }
  @media (max-width: 1000px) {
    padding-bottom: 67px;
    .mobile_stick {
      display: flex;
    }
  }
}
</style>
