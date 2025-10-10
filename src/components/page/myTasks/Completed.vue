<template>
  <CalendarBlock
    :taskCounters="taskCounters"
    :disabled="loading"
    v-model:selectedDate="selectedDate"
    v-model:currentMonth="currentMonth"
    class="mb_24"
  />
  <template v-if="dateSelected">
    <template v-if="tasks?.length">
      <TasksList :tasks="tasks" :updateTask="updateCompletedTask" />
      <footer v-if="tasks?.length > fetchParams.per_page - 1" class="watch_all">
        <Button class="watch_all_button" type="outlined" @click="$router.push('/?tab=accepted')"> Смотреть все </Button>
      </footer>
    </template>
    <TasksEmpty v-show="!tasks?.length && !loading" title="Пока нет заявок" />
  </template>
  <div v-else class="date_not_selected">Выберите дату</div>
</template>

<script>
import CalendarBlock from '@/components/organisms/CalendarBlock.vue'
import TasksList from '@/components/page/contractorTasks/TasksList.vue'
import TasksEmpty from '@/components/page/contractorTasks/TasksEmpty.vue'
import dayjs from '@/plugins/dayjs'
import useGlobalLoading from '@/composables/useGlobalLoading'

export default {
  components: {
    TasksList,
    TasksEmpty,
    CalendarBlock,
  },
  setup () {
    const { startLoading, stopLoading, loading } = useGlobalLoading()
    return { startLoading, stopLoading, loading }
  },
  data: () => ({
    fetchParams: {
      page: 1,
      per_page: 10,
      filters: [],
    },
    selectedDate: dayjs(),
    currentMonth: dayjs(),
    taskCounters: {},
    tasks: [],
  }),
  computed: {
    dateSelected () {
      return this.$dayjs(this.selectedDate).isSame(this.currentMonth, 'month')
    },
  },
  watch: {
    async currentMonth () {
      this.startLoading()
      await this.fetchTaskCounter()
      this.stopLoading()
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

    async fetchTasks () {
      this.tasks = []
      this.fetchParams.filters = this.getFilterDate(this.selectedDate)
      const response = await this.$axios.get('v2/user/tasks/myTasksByDay', {
        errorMessage: 'Не удалось загрузить предстоящие заявки',
        params: this.fetchParams,
      })
      if (response?.data?.success) this.tasks = response.data.data
    },

    async fetchTaskCounter () {
      const period = {
        from: this.$dayjs(this.currentMonth).startOf('month').format('YYYY-MM-DD'),
        to: this.$dayjs(this.currentMonth).endOf('month').format('YYYY-MM-DD'),
      }
      const response = await this.$axios.get('v2/user/tasks/count', {
        params: { period, type: 'my_work' },
        errorMessage: 'Не удалось загрузить количество заявок',
      })
      if (response?.data?.success) this.taskCounters = response.data.data
    },

    updateCompletedTask (newTask) {
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
.date_not_selected {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
}
</style>
