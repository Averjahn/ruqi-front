<template>
  <div
    :class="['achievement_card_container', { active, successes: type === 'successes', failures: type === 'failures' }]"
  >
    <div class="img_group">
      <img class="achievement_img" :src="require(`@/assets/imgs/${achievement.icon || 'achievement_oneOfUs.png'}`)" />
      <div class="name">{{ achievement.name }}</div>
    </div>
    <div class="description">{{ achievement.description }}</div>
    <div v-if="achieveDate" class="date">
      {{ achieveDate }}
    </div>
  </div>
</template>

<script>
import { GRADES, LEVELS } from '@/constants/constants'

export default {
  name: 'AchievementCard',
  components: {},
  props: {
    date: { type: String, default: null },
    type: { type: String, default: 'successes' },
    achievement: { type: Object, default: () => {} },
    active: { type: Boolean, default: false },
  },
  data () {
    return {
      GRADES,
    }
  },
  computed: {
    achieveDate () {
      return this.date ? this.$dayjs(this.date).format('DD.MM.YYYY') : null
    },
  },
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.achievement_card_container {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 158px;
  height: 231px;
  padding: 16px 12px;
  padding-top: 8px;
  border-radius: 16px;
  background: #f3f3f3;
  text-align: center;
  color: #000;
  opacity: 0.4;
  overflow: hidden;
  font-size: 12px;
  line-height: 15px;
  .description {
    letter-spacing: 0.1px;
    color: #666;
  }
  .img_group {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 12px;
    .achievement_img {
      display: block;
      width: 90px;
    }
    .name {
      font-size: 15px;
      line-height: 22px;
      letter-spacing: 0%;
    }
  }

  .date {
    margin-top: auto;
    letter-spacing: 0.1px;
    justify-self: end;
  }

  &.active {
    opacity: 1;
    &.successes {
      background: #f2f8ff;
    }
    &.failures {
      background: #fff2f2;
    }
  }
}
</style>
