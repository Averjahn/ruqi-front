<template>
  <HorizontalCalendar
    v-model:selectedDate="selectedDate"
    :from="calendarPeriod.from"
    :to="calendarPeriod.to"
    :taskCounters="taskCounters"
    :disabled="loading"
    class="mb_24"
  />
  <template v-if="tasks?.length">
    <TasksList :tasks="tasks" :updateTask="updateTask" />
    <LazyLoad ref="lazyLoad" :callBack="loadMore" />
  </template>
  <TasksEmpty v-show="!tasks?.length && !loading" title="Пока нет заявок" />
</template>

<script>
import TasksList from '@/components/page/contractorTasks/TasksList.vue'
import TasksEmpty from '@/components/page/contractorTasks/TasksEmpty.vue'
import dayjs from '@/plugins/dayjs'
import HorizontalCalendar from '@/components/organisms/HorizontalCalendar.vue'
import useGlobalLoading from '@/composables/useGlobalLoading'
import { mapGetters } from 'vuex'

export default {
  components: {
    TasksList,
    TasksEmpty,
    HorizontalCalendar,
  },
  props: {},
  setup () {
    const { startLoading, stopLoading, loading } = useGlobalLoading()
    return { startLoading, stopLoading, loading }
  },
  data: () => ({
    fetchParams: {
      page: 1,
      per_page: 15,
      filters: [],
    },
    selectedDate: dayjs(),
    calendarPeriod: {
      from: dayjs(),
      to: dayjs().add(6, 'day'),
    },
    taskCounters: {},
    tasks: [],
    busy: false,
  }),
  computed: {
    ...mapGetters('user', ['user']),
  },
  watch: {
    'user.search_region': {
      handler () {
        this.init()
      },
      deep: true,
    },
    async selectedDate () {
      this.startLoading()
      await this.fetchTasks()
      this.stopLoading()
    },
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      this.startLoading()
      await Promise.all([this.fetchTasks(), this.fetchTaskCounter()])
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

    async fetchTasks (concat = false) {
      if (!concat) {
        this.tasks = []
        this.fetchParams.page = 1
        this.busy = false
      }
      this.fetchParams.filters = this.getFilterDate(this.selectedDate)
      const response = await this.$axios.post('v1/user/tasks/all', this.fetchParams, {
        errorMessage: 'Не удалось загрузить заявки',
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
        params: { period, type: 'new_work' },
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
