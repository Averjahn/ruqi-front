<template>
  <div class="task_page_container basic_container_global">
    <div class="task_page_mobile">
      <MobileAdBanners class="mobile_ad_banners" />

      <TaskBlock :task="task" :updateTask="updateTask" @updateSubscribe="updateSubscribe" />

      <div v-if="filteredAvailableTasks.length" class="same_tasks">
        <div class="same_tasks__header">Похожие заявки</div>
        <div>
          <TasksList
            :tasks="filteredAvailableTasks"
            :loading="loading"
            :updateTask="updateAvailableTask"
            item-key="uuid"
            hide-default-footer
            disable-pagination
          />
          <LazyLoad ref="lazyLoad" :callBack="loadMore" />
        </div>
      </div>
    </div>

    <div class="task_page_desktop">
      <div class="left_column">
        <TaskBlock :task="task" class="mb_24" :updateTask="updateTask" @updateSubscribe="updateSubscribe" />
        <div v-if="filteredAvailableTasks.length" class="same_tasks">
          <div class="same_tasks__header">Похожие заявки</div>
          <div>
            <TasksList
              :tasks="filteredAvailableTasks"
              :loading="loading"
              :updateTask="updateAvailableTask"
              item-key="uuid"
              hide-default-footer
              disable-pagination
            />
            <LazyLoad ref="lazyLoad" :callBack="loadMore" />
          </div>
        </div>
      </div>
      <div class="right_column">
        <ObjectBlock :task="task" @subscribe="subscribe" @unsubscribe="unsubscribe" class="object_block" />
        <DesktopAdBanners />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import TaskBlock from '@/components/page/Task/TaskBlock.vue'
import TasksList from '@/components/page/contractorTasks/TasksList.vue'
import ObjectBlock from '@/components/page/Task/ObjectBlock.vue'
import { getAPIError } from '@/constants/helpers'
import useGlobalLoading from '@/composables/useGlobalLoading'
import MobileAdBanners from '@/components/organisms/MobileAdBanners.vue'
import DesktopAdBanners from '@/components/organisms/DesktopAdBanners.vue'

export default {
  components: { TaskBlock, MobileAdBanners, DesktopAdBanners, TasksList, ObjectBlock },
  setup () {
    const { startLoading, stopLoading, loading } = useGlobalLoading()
    return { startLoading, stopLoading, loading }
  },
  data () {
    return {
      task: {},
      interval: null,
      availableTasks: [],
      busy: false,
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
    ...mapGetters('user', ['user']),
    filteredAvailableTasks () {
      return this.availableTasks?.filter((task) => task?.uuid !== this.task.uuid) || []
    },
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler () {
        if (this.interval) {
          clearInterval(this.interval)
          this.loadTask()
          this.setUpdateInterval()
        }
      },
    },
  },
  mounted () {
    this.setUpdateInterval()
    this.loadTask()
    this.loadGrid(false)
  },
  unmounted () {
    clearInterval(this.interval)
  },
  methods: {
    ...mapActions('notifications', ['showNotification']),

    async loadTask () {
      this.startLoading()
      const response = await this.$axios.get('v2/user/tasks?uuid=' + this.$route.params.id)
      if (response?.data?.success) {
        this.task = response.data.data
        this.$route.meta.title = response.data.data?.name
      } else {
        this.showNotification({ text: getAPIError(response) || 'Не удалось загрузить данные заявки' })
        this.$router.push('/tasks')
      }
      this.stopLoading()
    },

    setUpdateInterval () {
      this.interval = setInterval(this.loadTask, 15 * 60 * 1000)
    },

    async subscribe () {
      const response = await this.$axios.post(
        'v2/tasks/subscribe',
        { task_uuids: [this.task.uuid] },
        { errorMessage: 'Не удалось подписаться на объект' },
      )
      if (response?.data?.success) this.task.is_subscribe = true
    },

    updateSubscribe (subscribe) {
      this.task.is_subscribe = subscribe
    },

    updateTask (newTask) {
      Object.assign(this.task, newTask)
    },

    async unsubscribe () {
      const response = await this.$axios.post(
        'v2/tasks/unsubscribe',
        { task_uuids: [this.task.uuid] },
        { errorMessage: 'Не удалось отписаться от объекта' },
      )
      if (response?.data?.success) this.task.is_subscribe = false
    },

    updateAvailableTask (newTask) {
      this.availableTasks.forEach((task) => {
        if (task.uuid === newTask.uuid) Object.assign(task, newTask)
      })
    },

    async loadGrid (concat = false) {
      if (this.busy) return
      this.startLoading()
      this.busy = true
      const response = await this.$axios.post('v1/user/tasks/all', this.fetchParams)
      if (response?.data?.success) {
        this.availableTasks = concat ? this.availableTasks.concat(response.data.data) : response.data.data
        this.busy = response.data.meta.current_page >= response.data.meta.last_page
      } else {
        this.showNotification({ text: getAPIError(response) || 'Не удалось загрузить заявки' })
      }
      this.stopLoading()
      return
    },

    loadMore () {
      if (!this.busy) {
        this.fetchParams.page++
        this.loadGrid(true)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.task_page_container {
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 38px;
}
.task_page_mobile {
  display: none;
  padding-top: 16px;
  flex-direction: column;
  gap: 16px;
}
.task_page_desktop {
  display: flex;
  gap: 32px;
  height: auto;
  padding-bottom: 36px;
}
.left_column {
  flex: 1;
}
.right_column {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  min-width: 342px;
  width: 24%;
}
.object_block {
  max-width: 406px;
}
.same_tasks {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.same_tasks__header {
  font-size: 24px;
  font-weight: 600;
  line-height: 30px;
  text-align: left;
}
@media screen and (max-width: 1000px) {
  .task_page_mobile {
    display: flex;
  }
  .task_page_desktop {
    display: none;
  }
  .task_page_container {
    gap: 32px;
    padding-top: unset;
    padding-bottom: 100px;
  }
}
</style>
