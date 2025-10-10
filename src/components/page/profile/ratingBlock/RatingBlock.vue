<template>
  <div class="rating_block">
    <HorizontalScroll wide>
      <BonusBlock />
    </HorizontalScroll>
    <Block>
      <div class="user_block">
        <Avatar class="desktop" :width="64" />
        <Avatar class="mobile" :width="32" />
        <div class="info">
          <h2 class="mb_8 user_name">{{ user.fio }}</h2>
          <UserRating class="mb_8" showSuggestion />
        </div>
      </div>
    </Block>

    <Block>
      <div class="ranks_header_block mb_24">
        <h3>Ранги</h3>
        <ButtonText @click="openGradesPage" color="blue" size="l">Как это работает?</ButtonText>
      </div>
      <Reveal height="363px" mobileOnly>
        <div class="grade_wrap">
          <ProfileGradeCard v-for="n in 6" :key="n" :grade="n" :active="n <= grade" :animation="n === grade" />
          <ProfileGradeCard plug />
        </div>
      </Reveal>
    </Block>

    <Block>
      <h3 class="mb_24">Звёзды для ранга</h3>
      <div class="progress_wrap">
        <ProgressCard
          :value="ratingData.progress?.regularity?.value || 0"
          :targetValue="ratingData.progress?.regularity?.target_value || 0"
          title="Регулярность выхода"
          hint="Эту звезду можно получить, если за неделю набрать 4 лайка, успешно завершив 4 заявки"
        />
        <ProgressCard
          :value="ratingData.progress?.friends?.value || 0"
          :targetValue="ratingData.progress?.friends?.target_value || 0"
          title="Пригласить друга"
          hint="Эту звезду можно получить за приглашённого друга в рамках акции «Приведи друга». Достаточно пригласить всего одного друга. 
          За каждого друга скорость получения уровня увеличивается на 10%"
        />
        <ProgressCard
          :value="ratingData.progress?.objects?.value || 0"
          :targetValue="ratingData.progress?.objects?.target_value || 0"
          title="Тройная сила"
          hint="Эту звезду можно получить за 3 лайка, полученные на трёх разных
          объектах. Для этого необходимо успешно завершить 3 заявки на разных объектах"
        />
        <ProgressCard
          :value="ratingData.progress?.brigadier?.value || 0"
          :targetValue="ratingData.progress?.brigadier?.target_value || 1"
          title="Бригадир"
          :showProgress="false"
          hint="Эту звезду можно получить став бригадиром. За статус бригадира скорость получения уровня увеличивается на 10%"
        />
        <ProgressCard
          :value="ratingData.progress?.likes?.value || 0"
          :targetValue="ratingData.progress?.likes?.target_value || 0"
          title="Количество лайков"
          hint="Эту звезду можно получить за 10 лайков, что требует успешного завершения 10 заявок"
        />
      </div>
    </Block>

    <Block>
      <h3 class="mb_24">История</h3>
      <Tabs :tabs="tabs" v-model="activeTab" type="flat" class="mb_16" />
      <Window :activeTab="activeTab">
        <template #like>
          <TasksList :tasks="tasks" :showActions="false" :showLabels="false" :loading="taskLoading" :showTodos="false" />
        </template>

        <template #dislike>
          <TasksList :tasks="tasks" :showActions="false" :showLabels="false" :showTodos="false" :loading="taskLoading" />
        </template>
        <template #violation>
          <ViolationsView :violations="tasks" />
        </template>
      </Window>
      <LazyLoad ref="lazyLoad" :callBack="loadMore" />
    </Block>
  </div>
</template>

<script>
import Block from '@/components/page/profile/Block.vue'
import ProgressCard from '@/components/page/profile/ratingBlock/ProgressCard.vue'
import ViolationsView from '@/components/page/profile/ratingBlock/ViolationsView.vue'
import UserRating from '@/components/molecules/UserRating.vue'
import HorizontalScroll from '@/components/atoms/HorizontalScroll.vue'
import BonusBlock from '@/components/organisms/BonusBlock.vue'
import Avatar from '@/components/atoms/Avatar.vue'
import Reveal from '@/components/atoms/Reveal.vue'
import TasksList from '@/components/page/contractorTasks/TasksList.vue'
import ProfileGradeCard from '@/components/page/profile/ratingBlock/ProfileGradeCard.vue'
import { getAPIError } from '@/constants/helpers'
import { mapGetters, mapActions } from 'vuex'

const mockedViolationsData = [
  {
    date: '2025.01.13',
    description: 'Кража или подмена товара',
    penalty: {
      type: 'decrease_level',
      value: '1',
    },
    task: {
      uuid: '9cc65a2b-8c9e-459f-9873-8bb7752a66f0',
    },
  },
  {
    date: '2025.01.11',
    description: 'Некорректная упаковка или маркировка товара',
    penalty: {
      type: 'dislike',
      value: '1',
    },
    task: {
      uuid: 'c2faf1dc-f11f-4616-836d-43fe6f88b850',
    },
  },
  {
    date: '2025.01.09',
    description: 'Нахождение без СИЗ',
    penalty: {
      type: 'decrease_level',
      value: '0.5',
    },
    task: {
      uuid: 'c8d3cb2f-51af-48ce-91f6-fa8663c30917',
    },
  },
]

export default {
  components: {
    Block,
    HorizontalScroll,
    Avatar,
    UserRating,
    Reveal,
    ProgressCard,
    BonusBlock,
    TasksList,
    ProfileGradeCard,
    ViolationsView,
  },
  props: {},
  data () {
    return {
      tasks: [],
      violations: [],
      taskLoading: false,
      loading: false,
      activeTab: 'like',
      ratingData: {},
      tasksCount: {},
      fetchParams: {
        page: 1,
        per_page: 15,
        sort: null,
        order: null,
        search: null,
        filters: null,
      },
      filters: [],
      isLastPage: false,
      mockedViolationsData,
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    ...mapGetters('profilePage', ['profile']),
    defaultFilters () {
      return this.activeTab === 'like' ? [{ field: 'history_likes', value: 'like' }] : []
    },
    tabs () {
      return [
        { text: `Лайки ${this?.tasksCount?.likes ?? ''}`, value: 'like' },
        { text: `Дизлайки ${this?.tasksCount?.dislikes ?? ''}`, value: 'dislike' },
        { text: `Нарушения ${this?.tasksCount?.violations ?? ''}`, value: 'violation' },
      ]
    },
    grade () {
      return this.profile.grade || 0
    },
  },
  watch: {
    activeTab (tab) {
      this.fetchParams.page = 1
      this.filters = [{ field: 'history_likes', value: tab }]
      this.loadTasks()
    },
  },
  mounted () {
    this.fetchProfileOnce()
    this.fetchRatingData()
    this.loadTasks()
  },
  methods: {
    ...mapActions('profilePage', ['fetchProfileOnce']),
    ...mapActions('notifications', ['showNotification']),
    async loadTasks () {
      this.taskLoading = true
      this.fetchParams.filters = [...this.defaultFilters, ...this.filters]
      const response = await this.$axios.get('v1/user/tasks/completed', {
        params: this.fetchParams,
      })
      if (response?.data?.success) {
        this.tasks = this.fetchParams.page > 1 ? this.tasks.concat(response.data.data) : response.data.data
        this.isLastPage = response.data.meta.current_page >= response.data.meta.last_page
      } else {
        this.showNotification({
          type: 'error',
          text: getAPIError(response) || 'Ошибка при получении истории заявок',
        })
      }
      this.taskLoading = false
    },

    loadMore () {
      if (this.isLastPage || this.taskLoading || this.activeTab === 'violation') return
      this.fetchParams.page++
      this.loadTasks()
    },

    async fetchRatingData () {
      this.loading = true
      const response = await this.$axios.get('v2/user/likes')
      if (response?.data?.success) {
        this.ratingData = response.data.data
      } else {
        this.showNotification({
          type: 'error',
          text: getAPIError(response) || 'Ошибка при получении данных по рейтингу',
        })
      }
      this.loading = false
    },

    openGradesPage () {
      const route = this.$router.resolve('/promo/grades')
      window.open(route.href, '_blank')
    },
  },
}
</script>

<style lang="scss" scoped>
.rating_block {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 36px;
  .ranks_header_block {
    align-items: center;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .user_block {
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }
  .info {
    flex: 1;
    font-size: 14px;
    line-height: 22px;
    color: #666666;
    .user_name {
      color: #2e2e2e;
    }
  }
  .desktop {
    display: flex;
  }
  .mobile {
    display: none;
  }

  .grade_wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }

  .progress_wrap {
    display: flex;
    gap: 16px;
    align-items: stretch;
    flex-wrap: wrap;
    :deep(.progress_card_container) {
      flex: 1;
    }
  }

  @media (max-width: 1000px) {
    .user_block {
      gap: 12px;
    }
    .desktop {
      display: none;
    }
    .mobile {
      display: flex;
    }
    .grade_wrap {
      gap: 16px;
      justify-content: center;
    }
    .grade_card {
      width: 140px;
      .img {
        width: 100px;
      }
    }
  }
}
</style>
