<template>
  <div class="user_rating_container">
    <div class="header">
      {{ gradeProperty.name }}, {{ level }} уровень
      <div class="stars">
        <img v-for="n in star" :key="n" src="@/assets/icons/star.svg" />
      </div>
    </div>
    <StepProgressBar
      v-if="isNextLevelExist"
      class="progress_bar"
      :completedSteps="completedSteps"
      :totalSteps="totalSteps"
    />
    <div v-if="showSuggestion && isNextLevelExist" class="mt_8">
      Чтобы перейти на {{ level + 1 }} уровень, вам осталось получить {{ conditionText }}
    </div>
  </div>
</template>

<script>
import StepProgressBar from '@/components/atoms/StepProgressBar.vue'
import { mapGetters, mapActions } from 'vuex'
import { GRADES, LEVELS } from '@/constants/constants'
import { declensionOfNumber } from '@/constants/helpers'

export default {
  name: 'UserRating',
  components: { StepProgressBar },
  props: {
    showSuggestion: { type: Boolean, default: false },
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters('profilePage', ['profile']),

    grade () {
      return this.profile?.grade || 1
    },
    gradeProperty () {
      return GRADES[this.grade]
    },
    level () {
      return this.profile.level || 1
    },
    like () {
      return this.profile.like || 0
    },
    star () {
      return this.profile.star || 0
    },
    completedSteps () {
      return this.like - LEVELS[this.level]?.likes
    },
    totalSteps () {
      return LEVELS[this.level + 1]?.likes - LEVELS[this.level]?.likes
    },
    isNextLevelExist () {
      return !!LEVELS[this.level + 1]
    },
    conditionText () {
      const res = []
      const likesLeft = (this.totalSteps - this.completedSteps).toFixed(2)
      if (likesLeft > 0) res.push(likesLeft + ' ' + declensionOfNumber(likesLeft, ['лайк', 'лайка', 'лайков']))
      const nextLevel = this.level + 1
      const nextLevelGrade = Object.values(GRADES).find((grade) => grade.levels.includes(nextLevel))
      const starsLeft = (nextLevelGrade?.stars || 5) - this.star
      if (starsLeft > 0) res.push(starsLeft + ' ' + declensionOfNumber(starsLeft, ['звезду', 'звезды', 'звёзд']))
      return res.join(' и ')
    },
  },
  mounted () {
    this.fetchProfileOnce()
  },
  unmounted () {},
  watch: {},
  methods: {
    ...mapActions('profilePage', ['fetchProfileOnce']),
  },
}
</script>

<style lang="scss" scoped>
.user_rating_container {
  .header {
    color: #263043;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .stars {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .progress_bar {
    padding: 4px 0;
  }
}
</style>
