<template>
  <div v-if="banner.title" class="info_contain" :class="[banner.color]">
    <img :src="banner.icon" />
    <div class="right_part">
      <div class="contend_block">
        <div class="title">{{ banner.title }}</div>
        <div v-if="banner.description" class="description">{{ banner.description }}</div>
      </div>
      <div v-if="isAddInfo && banner.additionalInfo" class="additional_infos">
        <div v-for="(info, index) in banner.additionalInfo" :key="index" class="info_item">
          <section v-for="(value, key) in info" :key="key">
            <div class="description">{{ value }}</div>
            <div class="info_data">{{ getCompletedTaskData(key) }}</div>
          </section>
        </div>
      </div>
      <div v-if="shiftHasBegun && banner.additionalInfo" class="additional_infos">
        <div v-for="(info, index) in banner.additionalInfo" :key="index" class="info_item shift_has_begun">
          <div class="description">{{ info }}</div>
          <div class="info_data">{{ getTimeUntilShiftEnd }}</div>
        </div>
      </div>
      <div class="action_block">
        <slot />
      </div>
    </div>
  </div>

  <template v-else>
    <div class="action_block">
      <slot />
    </div>
  </template>
</template>

<script>
const bannersContent = {
  waitMedicalBookApprove: {
    title: 'Дождитесь проверки медицинской книжки',
    description: 'Для работы на данной заявке необходима Медицинская книжка',
    icon: require('@/assets/icons/exclamation.svg'),
  },
  waitSmz: {
    color: 'yellow',
    title: 'Подключение самозанятости в процессе',
    description: 'Дождитесь подключения статус самозанятого',
    icon: require('@/assets/icons/exclamation.svg'),
  },
  needSmz: {
    color: 'yellow',
    title: 'У вас отсутствует подключённый статус самозанятого',
    description: 'Подключите статус самозанятого, чтобы откликнуться на заявку ',
    icon: require('@/assets/icons/exclamation.svg'),
  },
  needPDAgreement: {
    color: 'yellow',
    title: 'Ваш отклик не может быть отправлен',
    description: 'У вас не подписано соглашение на обработку персональных данных',
    icon: require('@/assets/icons/exclamation.svg'),
  },
  needUserAgreement: {
    color: 'yellow',
    title: 'Ваш отклик не может быть отправлен',
    description: 'У вас не подписано пользовательское соглашение',
    icon: require('@/assets/icons/exclamation.svg'),
  },
  needRegistrationInRf: {
    color: 'yellow',
    title: 'Отклик не может быть отправлен',
    description: 'Пожалуйста добавьте актуальный документ о регистрации в РФ',
    icon: require('@/assets/icons/exclamation.svg'),
  },
  needPatent: {
    color: 'yellow',
    title: 'Отклик не может быть отправлен',
    description: 'Пожалуйста добавьте актуальный патент',
    icon: require('@/assets/icons/exclamation.svg'),
  },
  needPartnership: {
    color: 'yellow',
    title: 'У вас не подключено партнерство',
    description: 'Система отправила запрос. Предоставьте доступ Ruqi  в сервисе «Мой налог» ',
    icon: require('@/assets/icons/exclamation.svg'),
  },
  needMedicalBook: {
    title: 'Для работы на данной заявке необходима Медицинская книжка',
    description: 'Внесите данные и прикрепите фото мед. книжки',
    icon: require('@/assets/icons/exclamation.svg'),
  },
  taskIsCanceled: {
    color: 'yellow',
    title: 'Заявка отменена',
    description: 'Заявка была отменена, пожалуйста выберите себе другую заявку.',
    icon: require('@/assets/icons/exclamation.svg'),
  },
  needUploadPhoto: {
    color: 'yellow',
    title: 'Отклик не может быть отправлен',
    description: 'У вас не заполнены паспортные данные или документы не прошли проверку, нужно загрузить снова.',
    icon: require('@/assets/icons/exclamation.svg'),
  },
  waitVerification: {
    color: 'blue',
    title: 'Ваши данные приняты',
    description:
      'Ваши данные приняты и находятся на проверке, пока вы не можете откликнуться на заявку. По завершению проверки вы получите уведомление по смс или в телеграм.',
    icon: require('@/assets/icons/document_checked.svg'),
  },
  needPaymentCard: {
    color: 'yellow',
    title: 'Отклик не может быть отправлен',
    description: 'Вы не сможете оставить свой отклик, пока не добавите способ оплаты',
    icon: require('@/assets/icons/exclamation.svg'),
  },
  canCancelTask: {
    color: 'yellow',
    title: 'Вы откликнулись на работы',
    description:
      'На данный момент вы можете отменить отклик на заявку. Это не повлияет на ваш рейтинг и ранг в системе.',
    icon: require('@/assets/icons/clock.svg'),
  },
  taskCompleted: {
    color: 'green',
    title: 'Работа завершена',
    additionalInfo: [
      { workedHours: 'Отработано' },
      { aggregate: 'Начислено' },
      { penaltyAndBonuses: 'Штраф/премия' },
      { totalAggregate: 'Итого на руки' },
    ],
    icon: require('@/assets/icons/checkbox_person_green.svg'),
  },
  working: {
    color: 'green',
    title: 'Работаем',
    description:
      'Вы по прежнему можете отказаться от участия, отказ на данном этапе не повлияет на ваш рейтинг и ранг в системе.',
    additionalInfo: [{ address: 'Ждем вас по адресу:' }, { startDate: 'Время начала работ:' }],
    icon: require('@/assets/icons/handshake_green.svg'),
  },
  shiftHasBegun: {
    color: 'yellow',
    title: 'Смена началась',
    description:
      'Ваша смена началась. Следуйте указаниям руководителя смены. Мы оповестим вас, когда статус изменится.',
    additionalInfo: [{ timeUntilShiftEnd: 'Смена закончится через:' }],
    icon: require('@/assets/icons/person_clock_orange.svg'),
  },
  recrutingUrgently: {
    title: 'Срочный набор',
    description:
      'На эту работу срочно требуется персонал. При отклике на нее, потребуется подтвердить ваше участие сразу.',
    icon: require('@/assets/icons/fire.svg'),
  },
  invite: {
    title: 'Приглашаем на работу',
    color: 'blue',
    description:
      'Мы нашли работу, которая отлично подходит вам по профессиональным навыкам, а также объект удобно расположен относительно места, которое вы указали.',
    icon: require('@/assets/icons/personal_mail.svg'),
  },
  waitingConfirm: {
    title: 'Ждём окончательного подтверждения',
    description:
      'Поздравляем, ваше участие в работах подтверждено. Работы начинаются уже завтра. Мы просим еще раз подтвердить ваше участие. Вы по прежнему можете отказаться от участия, отказ на данном этапе не повлияет на ваш рейтинг в системе.',
    icon: require('@/assets/icons/personal_mail.svg'),
  },
  shiftDataProcessing: {
    color: 'yellow',
    title: 'Данные смены на обработке',
    description:
      'Смена завершена. Пожалуйста, дождитесь окончания процесса обработки данных. Мы оповестим вас, когда статус изменится.',
    icon: require('@/assets/icons/person_clock_orange.svg'),
  },
}

export default {
  name: 'TaskItemActionsWrapper',
  components: {},
  props: {
    cardBannerType: {
      type: String,
      default: '',
    },
    task: {
      type: Object,
      default: () => {},
      interval: null,
    },
  },
  data () {
    return {
      remainingShiftTime: 0,
    }
  },
  computed: {
    banner () {
      return bannersContent[this.cardBannerType] || {}
    },
    isAddInfo () {
      return this.cardBannerType === 'taskCompleted' || this.cardBannerType === 'working'
    },
    shiftHasBegun () {
      return this.cardBannerType === 'shiftHasBegun'
    },
    getTimeUntilShiftEnd () {
      const hours = Math.floor(this.remainingShiftTime / (60 * 60 * 1000))
      const minutes = Math.floor((this.remainingShiftTime % (60 * 60 * 1000)) / (60 * 1000))
      const seconds = Math.floor((this.remainingShiftTime % (60 * 1000)) / 1000)

      return `${hours} ч. ${minutes} мин. ${seconds} сек.`
    },
    isTomorrow () {
      const tomorrow = this.$dayjs().add(1, 'day')
      return this.$dayjs(this?.task?.start_date?.replace('.000000Z', ''))?.isSame(tomorrow, 'date')
    },
  },
  mounted () {
    if (this.cardBannerType === 'working' || this.shiftHasBegun) {
      this.countRemainingTime()
      this.countRemainingShiftTime()
      this.interval = setInterval(() => {
        this.countRemainingTime()
        this.countRemainingShiftTime()
      }, 1000)
    }
  },
  unmounted () {
    clearInterval(this.interval)
  },
  watch: {},
  methods: {
    getCompletedTaskData (info) {
      if (info === 'address') {
        return `${this.isTomorrow ? 'Завтра ' : ''}${this.task?.object?.address}`
      }
      if (info === 'startDate') {
        return `${this.task.start_date.substr(11, 5)}`
      }
      if (info === 'workedHours') {
        return `${this.task?.cnt_work_hours || 0} ${this.task?.rate_unit}`
      }
      if (info === 'aggregate') {
        return `${this.task?.aggregate || 0} р.`
      }
      if (info === 'penaltyAndBonuses') {
        return ''
      }
      if (info === 'totalAggregate') {
        return `${this.task?.aggregate || 0} р.`
      }
    },
    countRemainingTime () {
      const untilDate = this.$dayjs(this?.task?.until_date)
      const currentDate = this.$dayjs()
      this.remainingTime = untilDate.diff(currentDate)
    },
    countRemainingShiftTime () {
      const untilDate = this.$dayjs(this?.task?.end_date)
      const currentDate = this.$dayjs()
      this.remainingShiftTime = untilDate.diff(currentDate)
    },
    open () {},
  },
}
</script>

<style lang="scss" scoped>
.info_contain {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  width: 100%;
  padding: 24px;
  border-radius: 14px;
  background-color: #fff6f5;
  &.yellow {
    background-color: #fef2e1;
  }
  &.green {
    background-color: #f0fdf4;
  }
  &.blue {
    background-color: #f3faff;
  }
}
.right_part {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 24px;
}
.contend_block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.title {
  font-size: 18px;
  font-weight: 600;
}
.description {
  color: #666666;
}
.additional_infos {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 24px;
  .info_item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
    justify-content: center;
    &.shift_has_begun {
      flex-direction: row;
      gap: 16px;
    }
  }
  .info_data {
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
    text-align: left;
  }
}
.action_block {
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  row-gap: 12px;
  column-gap: 16px;
  width: max-content;
}

@media (max-width: 768px) {
  .action_block {
    width: 100%;
  }
  .info_contain {
    padding: 16px;
    gap: 16px;
    flex-direction: column;
  }
  .title {
    font-size: 16px;
  }
  .description {
    font-size: 14px;
  }
}
</style>
