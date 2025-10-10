<template>
  <div v-if="banner.title" class="info_contain" :class="[banner.color]">
    <img :src="banner.icon" />
    <div class="right_part">
      <div class="content_block">
        <div class="title">{{ banner.title }}</div>
        <div class="description">{{ banner.description }}</div>
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
  needMedicalBook: {
    title: 'Для работы на данной заявке необходима Медицинская книжка',
    description: 'Внесите данные и прикрепите фото мед. книжки',
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
  needPaymentCard: {
    color: 'yellow',
    title: 'Отклик не может быть отправлен',
    description: 'Вы не сможете оставить свой отклик, пока не добавите способ оплаты',
    icon: require('@/assets/icons/exclamation.svg'),
  },
  waitSmz: {
    color: 'yellow',
    title: 'Подключение самозанятости в процессе',
    description: 'Дождитесь подключения статус самозанятого',
    icon: require('@/assets/icons/exclamation.svg'),
  },
  needPartnership: {
    color: 'yellow',
    title: 'У вас не подключено партнерство',
    description: 'Система отправила запрос. Предоставьте доступ Ruqi  в сервисе «Мой налог» ',
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
  canCancelTask: {
    color: 'yellow',
    title: 'Вы откликнулись на работы',
    description:
      'На данный момент вы можете отменить отклик на заявку. Это не повлияет на ваш рейтинг и ранг в системе.',
    icon: require('@/assets/icons/clock.svg'),
  },
}

export default {
  name: 'TaskActionsWrapper',
  components: {},
  props: {
    cardBannerType: {
      type: String,
      default: '',
    },
  },
  data () {
    return {}
  },
  computed: {
    banner () {
      return bannersContent[this.cardBannerType] || {}
    },
  },
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
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
  &.blue {
    background-color: #f3faff;
  }
}
.right_part {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.content_block {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.title {
  font-size: 18px;
  font-weight: 600;
}
.description {
  width: 100%;
  white-space: normal;
  color: #666666;
}

.action_block {
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  row-gap: 12px;
  column-gap: 16px;
  width: 100%;
}

@media (max-width: 1000px) {
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
