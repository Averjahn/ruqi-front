<template>
  <div class="modal-notification" :data-state="state">
    <div class="modal-notification__content">
      <div class="modal-notification__icon">
        <img v-if="state === 'Требуется паспорт'" src="@/assets/icons/notification/document_add.svg" class="modal-notification__icon-svg modal-notification__icon-svg--document-add" alt="Document Add" />
        <img v-else-if="state === 'Отклик не может быть отправлен'" src="@/assets/icons/notification/warning_red.svg" class="modal-notification__icon-svg modal-notification__icon-svg--warning-red" alt="Warning Red" />
        <img v-else-if="state === 'Ваши данные приняты'" src="@/assets/icons/notification/document_checkmark.svg" class="modal-notification__icon-svg modal-notification__icon-svg--document-checkmark" alt="Document Checkmark" />
        <img v-else-if="state === 'Отклик на работу'" src="@/assets/icons/notification/clock.svg" class="modal-notification__icon-svg modal-notification__icon-svg--clock" alt="Clock" />
        <img v-else-if="state === 'Истек срок паспорта'" src="@/assets/icons/notification/clock_dismiss.svg" class="modal-notification__icon-svg modal-notification__icon-svg--clock-dismiss" alt="Clock Dismiss" />
        <img v-else-if="state === 'State6' || state === 'документ о Регистрации РФ' || state === 'Загрузите Патент'" src="@/assets/icons/notification/warning_red.svg" class="modal-notification__icon-svg modal-notification__icon-svg--warning-red" alt="Warning Red" />
        <Icon v-else :name="computedIcon" class="modal-notification__icon-svg" />
      </div>
      <div class="modal-notification__text">
        <div class="modal-notification__text-content">
          <h3 class="modal-notification__title">{{ computedTitle }}</h3>
          <p class="modal-notification__description">{{ computedDescription }}</p>
        </div>
        <div class="modal-notification__actions" v-if="computedButtons.length > 0">
                  <MainButton
                    v-for="(button, index) in computedButtons"
                    :key="index"
                    :type="button.type"
                    :text="button.text"
                    :left-icon="button.leftIcon"
                    :right-icon="button.rightIcon"
                    :class="button.className"
                    @click="button.onClick"
                  />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/atoms/icon/Icon.vue'
import MainButton from '@/components/atoms/MainButton.vue'

export default {
  name: 'ModalNotification',
  components: { Icon, MainButton },
  props: {
    state: {
      type: String,
      required: true,
      validator: (value) => [
        'Отклик не может быть отправлен',
        'Ваши данные приняты',
        'Требуется паспорт',
        'Отклик на работу',
        'Истек срок паспорта',
        'State6',
        'документ о Регистрации РФ',
        'Загрузите Патент'
      ].includes(value)
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'warning'
    },
    buttons: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    notificationData() {
      const states = {
        'Отклик не может быть отправлен': {
          title: 'Отклик не может быть отправлен',
          description: 'У вас не заполнены паспортные данные. Пока вы не внесете данные вас не смогут включить в заявку',
          icon: 'warning',
          buttons: [
            { type: 'primary', text: 'Заполнить вручную', onClick: () => this.handleAction('fill-manually') },
            { type: 'primary-outline', text: 'Внести данные', className: 'modal-notification__btn-outline', onClick: () => this.handleAction('enter-data') }
          ]
        },
        'Ваши данные приняты': {
          title: 'Ваши данные приняты',
          description: 'Ваши данные приняты и находятся на проверке, пока вы не можете откликнуться на заявку. По завершению проверки вы получите уведомление по смс или в телеграм.',
          icon: 'doneAll',
          buttons: [
            { type: 'primary', text: 'Внести вручную', onClick: () => this.handleAction('fill-manually') },
            { type: 'primary-outline', text: 'Привязать для уведомлений', leftIcon: 'telegram', className: 'modal-notification__btn-outline', onClick: () => this.handleAction('bind-notifications') }
          ]
        },
        'Требуется паспорт': {
          title: 'Отклик отправлен, но требуется скан паспорта',
          description: 'У вас не загружен скан паспорта или документы не прошли проверку, нужно загрузить снова. Вы не сможете получить оплату после завершения смены при отсутствии подтверждающих документов.',
          icon: 'documentAdd',
          buttons: [
            { type: 'primary', text: 'Внести данные', onClick: () => this.handleAction('enter-data') },
            { type: 'primary-outline', text: 'Привязать для уведомлений', leftIcon: 'telegram', className: 'modal-notification__btn-outline', onClick: () => this.handleAction('bind-notifications') }
          ]
        },
        'Отклик на работу': {
          title: 'Вы откликнулись на работы',
          description: 'На данный момент вы можете отменить отлик на заявку. Это не повлияет на ваш рейтинг и ранг в системе.',
          icon: 'clock',
          buttons: [
            { type: 'primary-outline', text: 'Отозвать отклик', className: 'modal-notification__btn-outline', onClick: () => this.handleAction('withdraw-application') }
          ]
        },
        'Истек срок паспорта': {
          title: 'Срок действия паспорта истек',
          description: 'Срок действия вашего паспорта истек, вы не можете записаться на заявку. Пожалуйста загрузите скан нового паспорта',
          icon: 'warning',
          buttons: [
            { type: 'primary-outline', text: 'Загрузить скан', className: 'modal-notification__btn-outline', onClick: () => this.handleAction('upload-passport') }
          ]
        },
        'State6': {
          title: 'Внимание',
          description: 'Если вы сейчас откажетесь от заявки, то вам будет начислен дислайк. Если вы еще 2 раза откажетесь от заявки, за 3 часа до начала, то мы будем вынуждены заблокировать ваш аккаунт',
          icon: 'warning',
          buttons: [
            { type: 'primary-outline', text: 'Отменить', className: 'modal-notification__btn-outline', onClick: () => this.handleAction('cancel') },
            { type: 'error', text: 'Отказаться от заявки', onClick: () => this.handleAction('reject-application') }
          ]
        },
        'документ о Регистрации РФ': {
          title: 'Загрузите документ о регистрации в РФ',
          description: 'Ваш отклик не будет отправлен, пожалуйста загрузите документ о регистрации в РФ',
          icon: 'warning',
          buttons: [
            { type: 'primary', text: 'Загрузить', onClick: () => this.handleAction('upload-registration') }
          ]
        },
        'Загрузите Патент': {
          title: 'Загрузите патент',
          description: 'Ваш отклик не будет отправлен, пожалуйста загрузите ваш патент',
          icon: 'warning',
          buttons: [
            { type: 'primary', text: 'Загрузить', onClick: () => this.handleAction('upload-patent') }
          ]
        }
      }
      
      return states[this.state] || states['Отклик не может быть отправлен']
    },
    computedTitle() {
      return this.title || this.notificationData.title
    },
    computedDescription() {
      return this.description || this.notificationData.description
    },
    computedIcon() {
      return this.icon || this.notificationData.icon
    },
    computedButtons() {
      return this.buttons.length > 0 ? this.buttons : this.notificationData.buttons
    }
  },
  methods: {
    handleAction(action) {
      this.$emit('action', action)
      // console.log('Modal notification action:', action)
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-notification {
  background: #ffffff;
  border-radius: 14px;
  padding: 24px;
  width: 100%;
  max-width: 772px;
  
  // Цветные фоны для разных состояний
  &[data-state="Отклик не может быть отправлен"] {
    background: #FFF6F5; // Светло-красный
  }
  
  &[data-state="Ваши данные приняты"] {
    background: #F0F9F0; // Светло-зеленый
  }
  
  &[data-state="Требуется паспорт"] {
    background: #FFF4E6; // Светло-оранжевый
  }
  
  &[data-state="Отклик на работу"] {
    background: #FFF8E1; // Светло-желтый
  }
  
  &[data-state="Истек срок паспорта"] {
    background: #FFF6F5; // Светло-красный
  }
  
  &[data-state="State6"] {
    background: #FFF6F5; // Светло-красный
  }
  
  &[data-state="документ о Регистрации РФ"] {
    background: #FFF6F5; // Светло-красный
  }
  
  &[data-state="Загрузите Патент"] {
    background: #FFF6F5; // Светло-красный
  }
  
  &__content {
    display: flex;
    flex-direction: row;
    gap: 12px;
    align-items: flex-start;
  }
  
  &__icon {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &__icon-svg {
    width: 24px;
    height: 24px;
    color: #eb4d3d; // По умолчанию красный
    
    // Специальные стили для documentAdd (SVG файл)
    &--document-add {
      width: 28px;
      height: 28px;
      object-fit: contain;
    }
    
    // Специальные стили для warning_red (SVG файл)
    &--warning-red {
      width: 28px;
      height: 28px;
      object-fit: contain;
    }
    
    // Специальные стили для document_checkmark (SVG файл)
    &--document-checkmark {
      width: 28px;
      height: 28px;
      object-fit: contain;
    }
    
    // Специальные стили для clock (SVG файл)
    &--clock {
      width: 28px;
      height: 28px;
      object-fit: contain;
    }
    
    // Специальные стили для clock_dismiss (SVG файл)
    &--clock-dismiss {
      width: 28px;
      height: 28px;
      object-fit: contain;
    }
    
    // Цвета для разных типов уведомлений
    .modal-notification[data-state="Ваши данные приняты"] & {
      color: #71D472; // Зеленый для успешных уведомлений
    }
    
    .modal-notification[data-state="Отклик на работу"] & {
      color: #FFA500; // Оранжевый для информационных уведомлений
    }
    
    .modal-notification[data-state="Требуется паспорт"] & {
      color: #1735f5; // Синий для документов
    }
  }
  
  &__text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  &__text-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  &__title {
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 18px;
    font-weight: 600;
    line-height: 1;
    color: #263043;
    margin: 0;
  }
  
  &__description {
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    color: #666666;
    margin: 0;
  }
  
  &__actions {
    display: flex;
    flex-direction: row;
    gap: 16px;
    align-items: center;
  }

  /* Прозрачный фон для outline-кнопок в модалке */
  :deep(.modal-notification__btn-outline) {
    background: transparent !important;
  }
  
  // Мобильная адаптация
  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 14px;
    
    &__content {
      flex-direction: column;
      gap: 16px;
    }
    
    &__icon {
      width: 28px;
      height: 28px;
    }
    
    &__text {
      width: 100%;
      gap: 12px;
    }
    
    &__title {
      font-size: 16px;
      line-height: 24px;
    }
    
    &__description {
      font-size: 14px;
      line-height: 22px;
    }
    
    &__actions {
      flex-direction: column;
      gap: 12px;
      width: 100%;
      padding: 0 10px; // боковые отступы 10px
      box-sizing: border-box;

      > * {
        width: 100%; // кнопки на всю доступную ширину
      }
    }
  }
}
</style>
