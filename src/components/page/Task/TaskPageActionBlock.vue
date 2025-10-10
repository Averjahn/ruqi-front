<template>
  <section v-if="status === 'requested' || status === 'acceptInvited'" class="container yellow">
    <header class="ctp-action-block__title">
      <img src="@/assets/icon_deprecated/requested-icon.svg" alt="icon" />
      Вы откликнулись на заявку
    </header>

    <div class="ctp-action-block__description">
      На данный момент вы можете отменить отклик на заявку. Это не повлияет на ваш рейтинг и ранг в системе.
    </div>

    <TaskActions :calcStatus="status" :taskUuid="task.uuid" @updateItemCalcStatus="updateItemCalcStatus" xl longText />
  </section>

  <section v-if="status === 'task_completed'" class="container green">
    <header class="ctp-action-block__title">
      <img src="@/assets/icon_deprecated/check_mark_circle.svg" alt="icon" />
      Работа завершена
    </header>

    <div class="ctp-action-block__completed-data">
      <article v-if="task.cnt_work_hours" class="item">
        <div class="title">Отработано</div>
        <div class="value">{{ task.cnt_work_hours || 0 }} {{ task.rate_unit }}</div>
      </article>

      <article v-if="task.aggregate" class="item">
        <div class="title">Начислено</div>
        <div class="value">{{ task.aggregate }} р.</div>
      </article>
    </div>

    <TaskActions :calcStatus="status" :taskUuid="task.uuid" @updateItemCalcStatus="updateItemCalcStatus" xl longText />
  </section>

  <section
    v-if="status === 'is_recruting' && remainingTime > 0"
    class="container"
    :class="{ red: isTimerRed, blue: !isTimerRed }"
  >
    <header class="ctp-action-block__title mb_16">
      <img src="@/assets/icon_deprecated/warn_circle.svg" alt="icon" />
      Подбор закончится через:
      <div :class="{ red_text: isTimerRed }">{{ getTimeUntilEnd }}</div>
    </header>

    <TaskActions :calcStatus="status" :taskUuid="task.uuid" @updateItemCalcStatus="updateItemCalcStatus" xl longText />
  </section>

  <section v-if="status === 'is_recruting_urgently' && remainingTime > 0" class="container orange">
    <header class="ctp-action-block__title mb_16">
      <img src="@/assets/icon_deprecated/fire.svg" alt="icon" />
      Срочный набор
    </header>

    <div class="ctp-action-block__description">
      На эту работу срочно требуется персонал. При отклике на нее, потребуется подтвердить ваше участие сразу
    </div>

    <TaskActions :calcStatus="status" :taskUuid="task.uuid" @updateItemCalcStatus="updateItemCalcStatus" xl longText />
  </section>

  <section v-if="status === 'waiting_confirm'" class="container red">
    <header class="ctp-action-block__title">
      <img src="@/assets/icon_deprecated/warn_circle.svg" alt="icon" />
      Ждём окончательного подтверждения
    </header>

    <div class="ctp-action-block__description">
      Поздравляем, ваше участие в работах подтверждено. Работы начинаются уже завтра. Мы просим еще раз подтвердить ваше
      участие. Вы по прежнему можете отказаться от участия, отказ на данном этапе не повлияет на ваш рейтинг в системе.
    </div>

    <TaskActions :calcStatus="status" :taskUuid="task.uuid" @updateItemCalcStatus="updateItemCalcStatus" xl longText />
  </section>

  <section v-if="status === 'working'" class="container green">
    <header class="ctp-action-block__title mb_16">
      <img src="@/assets/icon_deprecated/check_mark_circle.svg" alt="icon" />
      Работаем
    </header>

    <div class="working_data">
      <article v-if="task.object && task.object.address">
        <div class="working_label">Ждем вас по адресу:</div>
        {{ task.object.address }}
      </article>

      <article v-if="task.start_date">
        <div class="working_label">Время начала работ:</div>
        {{ task.start_date.substr(11, 5) }}
        <template v-if="isTomorrow">Завтра</template>
      </article>
    </div>

    <div class="ctp-action-block__description">
      Вы по прежнему можете отказаться от участия, но <b>отказ на данном этапе может повлиять на ваш рейтинг.</b>
    </div>

    <TaskActions :calcStatus="status" :taskUuid="task.uuid" @updateItemCalcStatus="updateItemCalcStatus" xl longText />
  </section>

  <section v-if="status === 'recruting_closed' || status === 'rejected'" class="container red">
    <header class="ctp-action-block__title">
      <img src="@/assets/icon_deprecated/cross_circle_red.svg" alt="icon" />
      Набор закрыт
    </header>

    <div class="ctp-action-block__description">
      Клиент прекратил набор персонала на работы. Вы всегда можете найти другие подходящие вам заявки в системе.
    </div>

    <TaskActions :calcStatus="status" :taskUuid="task.uuid" @updateItemCalcStatus="updateItemCalcStatus" xl longText />
  </section>

  <section v-if="status === 'shift_data_on_processing'" class="container blue">
    <header class="ctp-action-block__title">
      <img src="@/assets/icon_deprecated/requested_blue.svg" alt="icon" />
      Данные смены на обработке
    </header>

    <div class="ctp-action-block__description">
      Смена завершена. Пожалуйста, дождитесь окончания процесса обработки данных. Мы оповестим вас, когда статус
      изменится
    </div>

    <TaskActions :calcStatus="status" :taskUuid="task.uuid" @updateItemCalcStatus="updateItemCalcStatus" xl longText />
  </section>

  <section v-if="status === 'need_to_sign_documents'" class="container yellow">
    <header class="ctp-action-block__title">
      <img src="@/assets/icon_deprecated/requested-icon.svg" alt="icon" />
      Требуется подписать документы
    </header>
    <div class="ctp-action-block__description">
      Для того, чтобы мы могли быстро перевести вам оплату за работу, вам нужно подписать акт выполненных работ
      посредством своей электронной подписи, а так же подтвердить выбранный способ оплаты.
    </div>

    <TaskActions :calcStatus="status" :taskUuid="task.uuid" @updateItemCalcStatus="updateItemCalcStatus" xl longText />
  </section>

  <section v-if="status === 'shift_has_begun'" class="container yellow">
    <header class="ctp-action-block__title">
      <img src="@/assets/icon_deprecated/clock_yellow.svg" alt="icon" />
      Смена началась
    </header>
    <div class="ctp-action-block__description">
      Ваша смена началась. Следуйте указаниям руководителя смены. Мы оповестим вас, когда статус изменится
    </div>
    <div v-if="remainingShiftTime > 0" class="ctp-action-block__footer-timer">
      <div class="label">Смена закончится через:</div>
      <div>
        {{ getTimeUntilShiftEnd }}
      </div>
    </div>

    <TaskActions :calcStatus="status" :taskUuid="task.uuid" @updateItemCalcStatus="updateItemCalcStatus" xl longText />
  </section>

  <section v-if="status === 'invite' && remainingTime >= 0" class="container">
    <header class="ctp-action-block__title">
      <img src="@/assets/icon_deprecated/envelope.svg" alt="icon" />
      Приглашаем на работу
    </header>

    <div class="ctp-action-block__description">
      Мы нашли работу, которая отлично подходит вам по профессиональным навыкам, а также объект удобно расположен
      относительно места, которое вы указали.
    </div>

    <div class="ctp-action-block__footer-timer">
      <div class="label">Подбор закончится через:</div>
      <div :class="{ red_text: isTimerRed }">
        {{ getTimeUntilEnd }}
      </div>
    </div>

    <TaskActions :calcStatus="status" :taskUuid="task.uuid" @updateItemCalcStatus="updateItemCalcStatus" xl longText />
  </section>

  <section v-if="(status === 'invite' || status === 'is_recruting') && remainingTime < 0" class="container red">
    <header class="ctp-action-block__title">
      <img src="@/assets/icon_deprecated/fire.svg" alt="icon" />
      Срочный набор
    </header>

    <div class="ctp-action-block__description">
      На эту вакансию срочно требуется персонал. При отклике на нее, потребуется подтвердить ваше участие сразу
    </div>

    <TaskActions :calcStatus="status" :taskUuid="task.uuid" @updateItemCalcStatus="updateItemCalcStatus" xl longText />
  </section>
</template>

<script>
import { declensionOfNumber, getDisplayedNumber } from '@/constants/helpers'
import TaskActions from '@/components/page/contractorTasks/TaskActions.vue'

export default {
  components: { TaskActions },
  emits: ['action', 'updateItemCalcStatus'],
  name: 'TaskPageBanner',
  props: {
    task: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      interval: null,
      remainingTime: 0,
      remainingShiftTime: 0,
    }
  },
  computed: {
    status () {
      return this.task.calcStatus
    },

    isTimerRed () {
      return this.remainingTime < 12 * 60 * 60 * 1000
    },

    getTimeUntilEnd () {
      const days = Math.floor(this.remainingTime / (24 * 60 * 60 * 1000))
      const hours = Math.floor(this.remainingTime / (60 * 60 * 1000))
      const minutes = Math.floor((this.remainingTime % (60 * 60 * 1000)) / (60 * 1000))
      const seconds = Math.floor((this.remainingTime % (60 * 1000)) / 1000)
      return hours > 24
        ? `${days} ` + declensionOfNumber(days, ['день', 'дня', 'дней'])
        : `${hours} ч. ${minutes} мин. ${seconds} сек.`
    },

    getTimeUntilShiftEnd () {
      const hours = Math.floor(this.remainingShiftTime / (60 * 60 * 1000))
      const minutes = Math.floor((this.remainingShiftTime % (60 * 60 * 1000)) / (60 * 1000))
      const seconds = Math.floor((this.remainingShiftTime % (60 * 1000)) / 1000)

      return `${hours} ч. ${minutes} мин. ${seconds} сек.`
    },

    isTomorrow () {
      const tomorrow = this.$dayjs().add(1, 'day')
      return this.$dayjs(this.task.start_date.replace('.000000Z', '')).isSame(tomorrow, 'date')
    },
  },
  mounted () {
    this.countRemainingTime()
    this.countRemainingShiftTime()
    this.interval = setInterval(() => {
      this.countRemainingTime()
      this.countRemainingShiftTime()
    }, 1000)
  },
  unmounted () {
    clearInterval(this.interval)
  },
  methods: {
    getDisplayedNumber,
    callAction () {},
    updateItemCalcStatus (status) {
      this.$emit('updateItemCalcStatus', status)
    },
    countRemainingTime () {
      const untilDate = this.$dayjs(this.task.until_date)
      const currentDate = this.$dayjs()
      this.remainingTime = untilDate.diff(currentDate)
    },
    countRemainingShiftTime () {
      const untilDate = this.$dayjs(this.task.end_date)
      const currentDate = this.$dayjs()
      this.remainingShiftTime = untilDate.diff(currentDate)
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  background: #f6fbff;
  border-radius: 8px;
  padding: 16px;

  &.yellow {
    background: #fffcf0;
  }

  &.blue {
    background: #f3faff;
  }

  &.green {
    background: #f0fdf4;
  }

  &.red {
    background: #fff6f5;
  }

  &.orange {
    background: #fff6f5;
  }
}

.spacer {
  flex: 1;
}

.ctp-action-block__description {
  font-weight: 400;
  line-height: 22px;
  margin-bottom: 16px;
}

.ctp-action-block__title {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;

  img {
    width: 24px;
    height: auto;
  }

  @media screen and (min-width: 1200px) {
    font-size: 18px;
  }
}

.red_text {
  color: #eb4d3d;
}

.main_action_button {
  min-width: 280px;
  padding-left: 48px;
  padding-right: 48px;
}

.ctp-action-block__time {
  color: #0082de;
  font-weight: 700;
  font-size: 28px;
}

.working_data {
  font-weight: 600;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 16px;

  article {
    flex: 1;
    min-width: 300px;
  }
}

.working_label {
  color: #7a91a9;
  margin-bottom: 8px;
}

.ctp-action-block__completed-data {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;

  .item {
    width: 24%;
    min-width: 150px;
  }

  .title {
    color: #7a91a9;
    margin-bottom: 16px;
    margin-bottom: 8px;
  }

  .value {
    font-weight: 600;

    &._accrued {
      color: #7a91a9;
    }

    &._penalty {
      color: #eb4d3d;
    }
  }
}

.act_button {
  display: inline-flex;
  background-color: white;
  padding-right: 32px;
  padding-left: 32px;
  color: #0082de;
}

.ctp-action-block__footer-timer {
  display: flex;
  gap: 16px;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;

  .label {
    color: #7a91a9;
  }
}
</style>
