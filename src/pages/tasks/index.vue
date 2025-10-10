<template>
  <div class="tasks_page basic_container_global">
    <h1 class="mb_32">Расписание</h1>

    <Tabs v-model="activeTab" :tabs="tabs" class="mb_32" type="flat" />

    <div class="task_window">
      <Window :activeTab="activeTab">
        <template #accepted>
          <Accepted />
        </template>

        <template #favorite>
          <Favorite :favoriteObjects="favoriteObjects" />
        </template>

        <template #tasks>
          <Tasks />
        </template>

        <template #watched>
          <Watched />
        </template>

        <template #completedTasks>
          <Completed />
        </template>
      </Window>
    </div>
  </div>
</template>

<script>
import Completed from '@/components/page/myTasks/Completed.vue'
import Favorite from '@/components/page/myTasks/Favorite.vue'
import Tasks from '@/components/page/myTasks/Tasks.vue'
import Accepted from '@/components/page/myTasks/Accepted.vue'
import Watched from '@/components/page/myTasks/Watched.vue'
import useGlobalLoading from '@/composables/useGlobalLoading'

const ALL_OBJECT = { uuid: 'all', brand: 'Все объекты' }

export default {
  components: {
    Completed,
    Favorite,
    Tasks,
    Watched,
    Accepted,
  },
  setup () {
    const { startLoading, stopLoading, loading } = useGlobalLoading()
    return { startLoading, stopLoading, loading }
  },
  data: () => ({
    tabs: [
      { value: 'accepted', text: 'Откликнулся' },
      { value: 'favorite', text: 'Избранное' },
      { value: 'tasks', text: 'Ближайшие заявки' },
      { value: 'watched', text: 'История просмотров' },
      { value: 'completedTasks', text: 'Завершено' },
    ],
    activeTab: null,
    favoriteObjects: [ALL_OBJECT],
  }),
  computed: {},
  watch: {
    activeTab (value) {
      this.$router.push({ query: { tab: value } })
    },
  },
  async mounted () {
    await this.fetchFavoriteObjectsOnce()
    this.activeTab = this.$route.query?.tab || 'accepted'
  },
  methods: {
    async fetchFavoriteObjectsOnce () {
      this.startLoading()
      const response = await this.$axios.get('v2/user/accounts/subscribe/list', {
        errorMessage: 'Не удалось загрузить избранные объекты',
      })
      if (response?.data?.success) this.favoriteObjects = [ALL_OBJECT, ...response.data.data]
      this.stopLoading()
    },
  },
}
</script>

<style lang="scss" scoped>
.tasks_page {
  padding-top: 24px;
  padding-bottom: 36px;
}

@media screen and (max-width: 1000px) {
  .tasks_page {
    padding-bottom: 100px;
  }
}
</style>
