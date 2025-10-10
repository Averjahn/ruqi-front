<template>
  <div v-if="violations?.length" class="violations_list">
    <div
      v-for="(violate, index) in violations"
      :key="index"
      class="violate_item"
      @click="() => openTask(violate?.uuid)"
    >
      <div class="left_block">
        <div class="violate_date">
          {{ $dayjs(violate?.start_date || '').format('DD.MM.YYYY') }}
        </div>
        <div class="violate_description">
          {{ getViolateName(violate?.user_like?.violation) }}
        </div>
      </div>
      <div class="right_block violate_penalty">
        <div v-if="violate?.user_like?.violation && Number(violate?.user_like?.calculated_points)">
          {{ violate?.user_like?.calculated_points }}
          {{ declensionOfNumber(violate?.user_like?.calculated_points, ['лайк', 'лайка', 'лайков']) }}
        </div>
        <div v-else class="dislike_block">
          <Icon class="dislike_icon" :size="20" name="dislike" />
          <span>Дизлайк</span>
        </div>
      </div>
    </div>
  </div>
  <div v-else>Нарушения не выявлены, так держать!</div>
</template>

<script>
import { mapActions } from 'vuex'
import { declensionOfNumber } from '@/constants/helpers'
import { VIOLATIONS_TYPES } from '@/constants/statuses'

export default {
  name: 'ViolationsView',
  components: {},
  props: {
    violations: { type: Array, default: () => [] },
  },
  data () {
    return {
      isPopupOpen: false,
      declensionOfNumber,
      VIOLATIONS_TYPES,
    }
  },
  computed: {},
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    ...mapActions('watchedObjects', ['addToWatchedObject']),
    openTask (uuid) {
      if (uuid) {
        this.$router.push('/task/' + uuid)
      }
    },
    getViolateName (violate) {
      return VIOLATIONS_TYPES[violate] || 'Не вышел'
    },
  },
}
</script>

<style lang="scss" scoped>
.violations_list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  .violate_item {
    cursor: pointer;
    padding: 16px;
    min-height: 82%;
    display: flex;
    flex-direction: row;
    gap: 10px;
    border-radius: 12px;
    border: 1px solid #0000001a;
    min-width: 270px;

    .left_block {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
      .violate_date {
        color: #666;
        line-height: 22px;
      }
      .violate_description {
        font-weight: 600;
        line-height: 20px;
      }
    }

    .violate_penalty {
      text-align: center;
      color: #eb4d3d;
      text-wrap: nowrap;
      line-height: 24px;
      .dislike_block {
        display: flex;
        gap: 4px;
        align-items: center;
        flex-wrap: nowrap;
        .dislike_icon {
          color: #eb4d3d;
        }
      }
    }
  }
}
</style>
