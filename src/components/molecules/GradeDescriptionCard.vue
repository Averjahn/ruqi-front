<template>
  <ParallaxTilt class="parallax_wrapper">
    <div :class="['grade_description_card_container', { isPlug }]">
      <div class="header">
        <img :src="require('@/assets/icons/' + GRADES[grade]?.iconColor)" />
        <div class="stars">
          <img v-for="n in GRADES[grade]?.stars || 0" :key="n" src="@/assets/icons/star.svg" />
        </div>
        {{ levelsText }}
      </div>
      <h3>{{ GRADES[grade]?.name || 'Неизвестный ранг' }}</h3>
      <div class="list">
        <div v-for="level in GRADES[grade]?.levels || []" :key="level" class="list_item">
          <div class="name">Уровень {{ level }}</div>
          <div class="value">{{ getLevelCondition(level) }}</div>
        </div>
        <div class="list_item">
          <div class="name">Количество звёзд</div>
          <div class="value">{{ GRADES[grade]?.stars || '1' }}</div>
        </div>
      </div>
      <div class="description_rank" v-html="GRADES[grade]?.descriptionHtml" />
    </div>
  </ParallaxTilt>
</template>

<script>
import { declensionOfNumber } from '@/constants/helpers'
import { GRADES, LEVELS } from '@/constants/constants'
import ParallaxTilt from '@/components/atoms/ParallaxTilt'

export default {
  name: 'GradeDescriptionCard',
  components: { ParallaxTilt },
  props: {
    isPlug: { type: Boolean, default: false },
    grade: { type: Number, default: 1 },
  },
  data () {
    return {
      GRADES,
      LEVELS,
    }
  },
  computed: {
    levelsText () {
      const levels = GRADES[this.grade]?.levels || []
      return `${levels[0] || '0'}-${levels[levels.length - 1] || '0'} уровень`
    },
  },
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    getLevelCondition (level) {
      const likes = LEVELS[level]?.likes
      if (likes === 0) return 'Стартовый'
      return (likes || 0) + declensionOfNumber(likes || 0, [' лайк', ' лайка', ' лайков'])
    },
  },
}
</script>

<style lang="scss" scoped>
.parallax_wrapper {
  max-width: 450px;
  flex: 1;
  min-width: 400px;
  height: max-content;
  @media (max-width: 1000px) {
    min-width: 290px;
  }
}
.grade_description_card_container {
  width: 100%;
  height: 100%;
  min-height: 660px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  &.isPlug {
    min-height: unset;
    height: 0px;
    padding: 0 24px;
    overflow: hidden;
  }
  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .stars {
    display: flex;
    gap: 4px;
  }
  .description_rank {
    align-self: start;
  }
  .list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 9px;
  }
  .list_item {
    display: flex;
    padding-bottom: 6px;
    justify-content: space-between;
    border-bottom: 1px solid #0000001a;
    line-height: 28px;
  }
  .name {
    font-size: 18px;
  }
  .value {
    font-weight: 600;
  }
  .bonuses {
    display: flex;
    gap: 4px;
    align-items: center;
    align-self: flex-start;
  }

  @media (max-width: 1000px) {
    min-width: 290px;
  }
}
</style>
