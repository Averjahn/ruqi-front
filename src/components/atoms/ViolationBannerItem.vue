<template>
  <div class="violation_banner_item">
    <div class="main_block">
      <div class="title_block">
        <img :src="cardIcon" alt="" class="banner_img" />
        <div v-if="isViolation" class="banner_title">Мои промахи</div>
      </div>
      <div v-if="content" class="content_block">
        <div v-if="isViolation" class="content_value">{{ totalViolations }}</div>
        <div v-else class="absence_content">
          <div v-if="showWarning" class="warning_data">
            <div class="absence_value">
              {{ absencesData?.absenceValue }}
            </div>
            <div class="absence_description">
              {{ absencesData?.absenceDescription }}
            </div>
          </div>
          <div v-if="this?.content?.not_worked >= 3 && absencesData?.reduceRateStartDate" class="warning_data">
            <div class="absence_value">
              {{ absencesData?.absenceValue }}
            </div>
            <div class="absence_description">
              Начало: <span class="start_date">{{ absencesData?.reduceRateStartDate }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isViolation" class="divider" />
    <ProgressBar
      v-if="!isViolation && absencesData?.reduceRateStartDate"
      class="progress"
      :value="progressData.value"
      :targetValue="progressData.max"
      height="8"
    />
    <div class="add_info">
      <div v-if="isViolation" class="violation_info">
        <div class="ranks_violation">
          По рангам: <span class="bold_text">{{ content?.by_rank ?? 0 }}</span>
        </div>
        <div class="ranks_violation">
          Пропуски заявок: <span class="bold_text">{{ notWorkedCount }}</span>
        </div>
      </div>
      <div v-if="!isViolation && absencesData?.reduceRateStartDate" class="absence_info">
        <div class="shifts_left">
          Осталось смен с пониженной ставкой:
          <span class="shifts_left_data">{{ progressData.max - progressData.value }}</span>
        </div>
        <div class="progress_percentage">{{ progressData.percentage }}</div>
      </div>
    </div>

    <ThinLineLoading class="thin_loading" :show="loading" />
  </div>
</template>

<script>
import ThinLineLoading from './loaders/ThinLineLoading.vue'
import ProgressBar from '@/components/atoms/ProgressBar.vue'

export default {
  components: { ThinLineLoading, ProgressBar },
  props: {
    isViolation: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    content: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    totalViolations () {
      return this?.content?.total ?? 0
    },
    notWorkedCount () {
      return (this.content?.total || 0) - (this.content?.by_rank || 0) ?? 0
    },
    cardIcon () {
      if (this.isViolation) {
        return require('@/assets/icons/violations_warning.svg')
      } else {
        if (!this?.content?.not_worked) {
          return require('@/assets/icons/absence_fine.svg')
        } else if (this?.content?.not_worked === this?.content?.worked) {
          return require('@/assets/icons/absence_fine.svg')
        } else if (this?.content?.not_worked >= 3) {
          return require('@/assets/icons/absence_shy.svg')
        } else {
          return require('@/assets/icons/absence_bored.svg')
        }
      }
    },
    showWarning () {
      return this?.content?.not_worked < 3 || this?.content?.not_worked === this.content?.worked
    },
    absencesData () {
      if (!this?.content?.not_worked || this?.content?.not_worked === this.content?.worked) {
        return {
          absenceValue: 'Нет пропусков — всё в порядке',
          absenceDescription: 'Вы ни одной заявки не пропустили — так держать!',
        }
      } else if (this?.content?.not_worked === 1) {
        return {
          absenceValue: 'Одна неявка',
          absenceDescription: 'Еще две неявки и будет снижение ставки',
        }
      } else if (this?.content?.not_worked === 2) {
        return {
          absenceValue: 'У вас две неявки на смену',
          absenceDescription: 'Будьте осторожны, еще одна не явка и будет снижение ставки',
        }
      } else {
        return {
          absenceValue: 'Ставка снижена на 30₽/ч',
          reduceRateStartDate: this?.content?.reduced_rate_period_start_date ? this.$dayjs(this?.content?.reduced_rate_period_start_date)?.format('DD.MM.YYYY') : '-',
        }
      }
    },
    progressData () {
      if (this.content?.not_worked <= 2) {
        return null
      }
      let calculatedMax = this.content?.not_worked === 3 ? 3 : 3 + (this.content?.not_worked - 3)
      return {
        max: calculatedMax,
        value: this.content?.worked,
        percentage: `${Math.floor((this.content?.worked * 100) / calculatedMax)}%`,
      }
    },
  },
  data: () => ({}),
  methods: {},
}
</script>

<style lang="scss" scoped>
.violation_banner_item {
  height: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  padding: 24px;
  padding-bottom: 12px;
  position: relative;
  flex: 1;
  cursor: pointer;
  user-select: none;
  overflow: hidden;

  .main_block {
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: 100%;
  }
  .start_date {
    font-weight: 600;
    line-height: 125%;
    color: #263043;
  }
  .divider {
    height: 1px;
    width: 100%;
    background: #0000000f;
  }
  .progress {
    height: 8px;
    width: 100%;
  }

  .title_block {
    display: flex;
    gap: 8px;
  }

  .violation_info {
    display: flex;
    gap: 16px;
  }
  .add_info {
    width: 100%;
  }
  .absence_info {
    width: 100%;
    display: flex;
    gap: 16px;
  }
  .shifts_left {
    width: 100%;
    font-size: 14;
    line-height: 22px;
    color: #666666;
  }
  .shifts_left_data {
    font-weight: 600;
    color: #263043;
  }
  .progress_percentage {
    font-size: 14;
    line-height: 22px;
    color: #666666;
  }
  .ranks_violation {
    font-size: 16;
    line-height: 22px;
    color: #666666;
  }
  .bold_text {
    font-weight: 600;
    color: #263043;
  }
  .banner_title {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    width: fit-content;
    vertical-align: middle;
    font-size: 16px;
    line-height: 22px;
    text-align: left;
    overflow-wrap: break-word;
  }

  .content_block {
    display: flex;
    gap: 8px;

    .content_value {
      font-size: 30px;
      font-weight: 700;
      line-height: 125%;
      letter-spacing: 0;
    }

    .content_action {
      align-self: center;
      line-height: 22px;
      letter-spacing: 0.1px;
      vertical-align: middle;
      color: #1735f5;
    }
  }
  .absence_content,
  .warning_data {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .warning_data {
  }
  .absence_value {
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
    color: #263043;
  }
  .absence_description {
    font-size: 16px;
    line-height: 22px;
    color: #666666;
  }

  .thin_loading {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
  }
  .banner_img {
    display: block;
    width: 32px;
    height: 32px;
    align-self: center;
  }
  @media (max-width: 1000px) {
    padding: 10px;
    .banner_img {
      width: 24px;
      height: 24px;
    }
    // .banner_title {
    //   font-size: 12px;
    // }
    .content_block {
      .content_value {
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0%;
      }
    }
    .absence_content {
      .absence_value {
        font-size: 16px;
        line-height: 20px;
      }
      .absence_description {
        font-size: 12px;
        line-height: 125%;
      }
    }
  }
}
</style>
