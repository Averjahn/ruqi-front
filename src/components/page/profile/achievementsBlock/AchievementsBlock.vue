<template>
  <div class="achievements_block">
    <Block>
      <h3 class="mb_24">Успехи</h3>
      <Reveal height="231px" mobileOnly>
        <div class="achievement_wrap">
          <AchievementCard
            v-for="achievement in ACHIEVEMENTS.successes"
            :key="achievement"
            :achievement="achievement"
            type="successes"
            :active="achievementsData?.successes?.find((ach) => ach.alias === achievement.alias)"
            :date="achievementsData?.successes?.find((ach) => ach.alias === achievement.alias)?.created_at || null"
          />
        </div>
      </Reveal>
    </Block>
    <Block>
      <h3 class="mb_24">Неудачи</h3>
      <Reveal height="231px" mobileOnly>
        <div class="achievement_wrap">
          <AchievementCard
            v-for="achievement in ACHIEVEMENTS.failures"
            :key="achievement"
            :achievement="achievement"
            type="failures"
            :active="achievementsData?.failures?.find((ach) => ach.alias === achievement.alias)"
            :date="achievementsData?.failures?.find((ach) => ach.alias === achievement.alias)?.created_at || null"
          />
        </div>
      </Reveal>
    </Block>
  </div>
</template>

<script>
import Block from '@/components/page/profile/Block.vue'
import Reveal from '@/components/atoms/Reveal.vue'
import AchievementCard from '@/components/page/profile/achievementsBlock/AchievementCard.vue'
import { getAPIError } from '@/constants/helpers'
import { mapGetters, mapActions } from 'vuex'
import { ACHIEVEMENTS } from '@/constants/constants'

export default {
  components: { Block, Reveal, AchievementCard },
  props: {},
  data () {
    return {
      tasks: [],
      taskLoading: false,
      loading: false,
      ratingData: {},
      achievementsData: {},
      ACHIEVEMENTS,
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    ...mapGetters('profilePage', ['profile']),

    grade () {
      return this.profile.grade || 1
    },
  },
  watch: {},
  async mounted () {
    await this.fetchProfileOnce()
    await this.fetchAchievmentsData()
  },
  methods: {
    ...mapActions('profilePage', ['fetchProfileOnce']),
    ...mapActions('notifications', ['showNotification']),
    async fetchAchievmentsData () {
      this.loading = true
      try {
        const response = await this.$axios.get('v2/user/achievements')
        if (response?.data?.success) {
          this.achievementsData = response.data.achievements
        } else {
          this.showNotification({
            type: 'error',
            text: getAPIError(response) || 'Ошибка при получении данных по достижениям',
          })
        }
      } catch (error) {
        this.showNotification({
          type: 'error',
          text: getAPIError(error) || 'Неизвестная ошибка сервера',
        })
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.achievements_block {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 36px;

  .achievement_wrap {
    display: flex;
    flex-wrap: wrap;
    row-gap: 36px;
    column-gap: 16px;
    justify-content: flex-start;
  }

  @media (max-width: 1000px) {
    .achievement_wrap {
      row-gap: 16px;
      column-gap: 16px;
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
