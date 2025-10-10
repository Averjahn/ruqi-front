<template>
  <HorizontalCalendar
    v-model:selectedDate="selectedDate"
    :from="calendarPeriod.from"
    :to="calendarPeriod.to"
    :taskCounters="taskCounters"
    :disabled="loading"
    class="mb_24"
  />
  <Tabs
    v-model="activeObject"
    :tabs="favoriteObjects"
    :counter="objectCounter"
    :disabled="loading"
    itemValue="uuid"
    itemText="brand"
    class="mb_32"
    type="chip"
    necessaryCounter
    @change="init"
  />
  <template v-if="tasks?.length">
    <TasksList :tasks="tasks" :updateTask="updateTask" />
    <LazyLoad ref="lazyLoad" :callBack="loadMore" />
  </template>
  <TasksEmpty v-show="!tasks?.length && !loading" title="Пока нет заявок" />
</template>

<script>
import { mapActions } from 'vuex'
import TasksList from '@/components/page/contractorTasks/TasksList.vue'
import TasksEmpty from '@/components/page/contractorTasks/TasksEmpty.vue'
import dayjs from '@/plugins/dayjs'
import HorizontalCalendar from '@/components/organisms/HorizontalCalendar.vue'
import useGlobalLoading from '@/composables/useGlobalLoading'

export default {
  components: {
    TasksList,
    TasksEmpty,
    HorizontalCalendar,
  },
  props: {
    favoriteObjects: { type: Object, default: () => ({}) },
  },
  setup () {
    const { startLoading, stopLoading, loading } = useGlobalLoading()
    return { startLoading, stopLoading, loading }
  },
  data: () => ({
    fetchParams: {
      page: 1,
      per_page: 30,
      filters: [],
    },
    selectedDate: dayjs(),
    calendarPeriod: {
      from: dayjs(),
      to: dayjs().add(6, 'day'),
    },
    activeObject: 'all',
    objectCounter: {},
    taskCounters: {},
    tasks: [],
    busy: false,
  }),
  computed: {},
  watch: {
    async selectedDate () {
      this.activeObject = 'all'
      this.startLoading()
      await Promise.all([this.fetchTasks(), this.fetchObjectsCounter()])
      this.stopLoading()
    },
  },
  async mounted () {
    await this.init()
  },
  methods: {
    ...mapActions('notifications', ['showNotification']),

    async init () {
      this.startLoading()
      await Promise.all([this.fetchTasks(), this.fetchTaskCounter(), this.fetchObjectsCounter()])
      this.stopLoading()
    },

    getFilterDate (date) {
      return [
        {
          field: 'start_date',
          type: 'datetime',
          value: {
            from: this.$dayjs(date).format('YYYY-MM-DD'),
            to: this.$dayjs(date).format('YYYY-MM-DD'),
          },
        },
      ]
    },

    async fetchObjectsCounter () {
      const response = await this.$axios.get('v2/user/objects/subscribe/countTasks', {
        params: { filters: [{ field: 'favorites', value: true }, ...this.getFilterDate(this.selectedDate)] },
        errorMessage: 'Не удалось загрузить счётчик заявок в избранных объектах',
      })
      if (response?.data?.success) this.objectCounter = response.data.data
    },

    async fetchTasks (concat = false) {
      if (!concat) {
        this.tasks = []
        this.fetchParams.page = 1
        this.busy = false
      }
      this.fetchParams.filters = [{ field: 'favorites', value: true }, ...this.getFilterDate(this.selectedDate)]
      if (this.activeObject !== 'all') this.fetchParams.filters.push({ field: 'object', value: [this.activeObject] })
      const response = await this.$axios.post('v1/user/tasks/all', this.fetchParams, {
        errorMessage: 'Не удалось загрузить избранные заявки',
      })
      if (response?.data?.success) {
        this.tasks = [...this.tasks, ...response.data.data]
        this.busy = response.data?.meta?.current_page >= response.data?.meta?.last_page
      }
    },

    async loadMore () {
      if (this.busy || this.loading) return
      this.fetchParams.page++
      this.startLoading()
      await this.fetchTasks(true)
      this.stopLoading()
    },

    async fetchTaskCounter () {
      const period = {
        from: this.$dayjs(this.calendarPeriod.from).format('YYYY-MM-DD'),
        to: this.$dayjs(this.calendarPeriod.to).format('YYYY-MM-DD'),
      }
      const response = await this.$axios.get('v2/user/tasks/count', {
        params: { period, type: 'favorite' },
        errorMessage: 'Не удалось загрузить количество заявок',
      })
      if (response?.data?.success) this.taskCounters = response.data.data
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
.watch_all {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 16px 100px 16px;
}
.watch_all_button {
  width: fit-content;
}
</style>
