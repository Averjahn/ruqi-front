<template>
  <div v-if="violations?.length" class="violations_list">
    <div v-for="(violate, index) in violations" :key="index" class="violate_item">
      <div class="violate_main_info">
        <div class="violate_date">
          <Icon class="calendar_icon" :size="20" name="schedule" />
          {{ getViolateDate(violate) ?? '-' }}
        </div>
        <div v-if="violate?.uuid" class="violate_description">
          {{ getViolateName(violate?.violation) }}
        </div>
        <div v-else v-html="getNotWorkedPenaltyData(violate)"/>
      </div>
      <div v-if="violate?.uuid" class="violate_penalty">
        <div class="penalty_description">Штраф</div>
        <div v-if="violate?.violation && Number(violate?.calculated_points)">
          {{ violate?.calculated_points }}
          {{ declensionOfNumber(violate?.calculated_points, ['лайк', 'лайка', 'лайков']) }}
        </div>
        <div v-else class="dislike_block violate_description">
          <span>Дизлайк</span>
        </div>
      </div>
      <div class="violate_task_name" @click="() => openTask(violate?.uuid ?? violate?.not_worked_uuid)">
        {{ violate?.name ?? violate?.not_worked_name }}
      </div>
    </div>
  </div>
  <div class="empty_message" v-else>{{ tab === 'by_rank' ? 'Нарушения отсутствуют.' : 'Пропуски отсутствуют.' }}</div>
</template>

<script>
import { mapActions } from 'vuex'
import { declensionOfNumber } from '@/constants/helpers'
import { VIOLATIONS_TYPES } from '@/constants/statuses'

export default {
  name: 'NewViolationList',
  components: {},
  props: {
    violations: { type: Array, default: () => [] },
    tab: { type: String, default: () => '' },
    violationsCounter: { type: Object, default: () => {} },
  },
  data () {
    return {
      isPopupOpen: false,
      declensionOfNumber,
      VIOLATIONS_TYPES,
    }
  },
  computed: {
    activeViolations () {
      return this.violations?.filter((violate) => violate?.isActive) ?? []
    },
  },
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
    getViolateDate (violate) {
      const violateDate = violate?.start_date || violate?.created_at || violate?.not_worked_date
      return this.$dayjs(violateDate || '').format('DD.MM.YYYY')
    },
    getNotWorkedPenaltyData (violate) {
      const index = this.activeViolations.findIndex((v) => v.not_worked_uuid === violate.not_worked_uuid)

      if (index === -1) {
        return '<p style="font-weight: 600;">Пропуск погашен</p>'
      }

      if (index < 2) {
        if (index < 1) {
          return `<p style="font-weight: 600;">Без штрафа (${index + 1}/3)</p>`
        } else return `<p style="font-weight: 600;">Предупреждение (${index + 1}/3)</p>`
      }

      const total = this.violationsCounter?.not_worked || 0
      const worked = this.violationsCounter?.worked || 0
      const diff = total - worked || 0
      const percentage = total > 0 ? 100 - Math.floor((worked * 100) / total) : 0
      return `
        <p style="font-weight: 600;">Ставка понижена –30 ₽/ч 
          <span style="font-size: 14px; font-weight: 400; display: flex; gap: 4px;">
          <span style="color: #666; display: block;">
            Осталось смен: 
          </span>
          <span>
          ${diff} (${percentage}%)
          </span>
          </span>
        </p>
      `
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
    padding: 20px;
    min-height: 82%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-radius: 16px;
    border: 1px solid #0000001a;
    width: 100%;
    min-width: 270px;
    gap: 12px;
    .violate_main_info {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .violate_date {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      line-height: 22px;
    }
    .violate_description {
      font-weight: 600;
      font-size: 16;
      line-height: 125%;
    }

    .violate_penalty {
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 4px;
      color: #263043;
      white-space: nowrap;
      .penalty_description {
        line-height: 22px;
        color: #666;
      }
      .dislike_block {
        display: flex;
        gap: 4px;
        align-items: center;
        line-height: 125%;
        flex-wrap: nowrap;
      }
    }
  }
  .calendar_icon {
    color: #263043;
  }
  .violate_task_name {
    cursor: pointer;
    color: #1735f5;
  }
}
</style>
