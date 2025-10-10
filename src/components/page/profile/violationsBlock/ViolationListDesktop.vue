<template>
  <div class="violations_container">
    <table v-if="violations?.length" class="violations_table">
      <thead>
        <tr>
          <th v-for="header in headers" :key="header.key">
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(violate, index) in violations" :key="index" class="violate_row">
          <td v-for="header in headers" :key="header.key">
            <div v-if="header.key === 'date'" class="violate_date">
              {{ getViolateDate(violate) ?? '-' }}
            </div>
            <div v-if="header.key === 'type'">{{ getViolateName(violate?.violation) }}</div>
            <div v-if="header.key === 'notWorkedPenalty'" v-html="getNotWorkedPenaltyData(violate)"></div>
            <div
              v-if="header.key === 'task'"
              class="violate_task_name"
              @click="() => openTask(violate?.uuid ?? violate?.not_worked_uuid)"
            >
              {{ violate?.name ?? violate?.not_worked_name }}
            </div>
            <div v-if="header.key === 'progressLoss'">
              <div v-if="violate?.violation && Number(violate?.calculated_points)">
                {{ violate?.calculated_points }}
                {{ declensionOfNumber(violate?.calculated_points, ['лайк', 'лайка', 'лайков']) }}
              </div>
              <div v-else class="dislike_block">
                <span>Дизлайк</span>
              </div>
            </div>
          </td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
    <div v-else class="empty_message">{{ tab === 'by_rank' ? 'Нарушения отсутствуют.' : 'Пропуски отсутствуют.' }}</div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { declensionOfNumber } from '@/constants/helpers'
import { VIOLATIONS_TYPES } from '@/constants/statuses'

export default {
  name: 'NewViolationList',
  props: {
    violations: { type: Array, default: () => [] },
    violationsCounter: { type: Object, default: () => {} },
    headers: { type: Array, default: () => [] },
    tab: { type: String, default: () => '' },
    isAdaptive: Boolean,
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
        return '<p>Пропуск погашен</p>'
      }

      if (index < 2) {
        if (index < 1) {
          return `<p>Без штрафа (${index + 1}/3)</p>`
        } else return `<p>Предупреждение (${index + 1}/3)</p>`
      }

      const total = this.violationsCounter?.not_worked || 0
      const worked = this.violationsCounter?.worked || 0
      const diff = total - worked || 0
      const percentage = total > 0 ? 100 - Math.floor((worked * 100) / total) : 0
      return `
        <p>Ставка понижена –30 ₽/ч 
          <span style="font-size: 14px; color: #666;">
            Осталось смен: 
          </span>
          <span style="font-size: 14px;">
          ${diff} (${percentage}%)
          </span>
        </p>
      `
    },
  },
}
</script>

<style lang="scss" scoped>
.violations_container {
  width: 100%;
  overflow-x: auto;
}

.violations_table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;

  th {
    text-align: left;
    padding: 12px 16px;
    color: #666;
    font-weight: normal;
    border-bottom: 1px solid #eee;
  }

  td {
    padding: 16px;
  }

  tr:not(:last-child) td {
    border-bottom: 1px solid #0000001a;
  }

  th:not(:first-child) {
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 20%;
      bottom: 20%;
      left: 0;
      width: 1px;
      background-color: #0000001a;
    }
  }
}

.violate_row {
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9f9f9;
  }
}

.violate_date {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #263043;
}

.dislike_block {
  display: flex;
  gap: 4px;
  align-items: center;
  color: #263043;
}

.calendar_icon {
  color: #263043;
}

.empty_message {
  text-align: center;
  padding: 24px;
  color: #7a91a9;
}

.violate_task_name {
  cursor: pointer;
  color: #1735f5;
}
</style>
