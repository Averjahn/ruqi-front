<template>
  <div class="job_card">
    <div class="job_card__header">
      <div class="job_card__statuses">
                    <Snackbar 
                      v-for="snackbar in snackbars" 
                      :key="snackbar.id"
                      :type="snackbar.type" 
                      :text="snackbar.text" 
                      :icon="snackbar.icon" 
                      :duration="snackbar.duration"
                      :visible="true" 
                      @timer-end="onTimerEnd"
                    />
      </div>
      <div class="job_card__heart">
        <Icon name="heart" class="job_card__heart-icon" />
      </div>
    </div>
    
    <div class="job_card__content">
      <div class="job_card__title-section">
        <h3 class="job_card__title">{{ job.title }}</h3>
        <p class="job_card__price">{{ job.price }}</p>
        <div class="job_card__date-section">
          <Icon name="calendar" class="job_card__calendar-icon" />
          <p class="job_card__date">{{ job.date }}</p>
        </div>
      </div>
      
      <div class="job_card__info">
        <div class="job_card__location-section">
          <div class="job_card__avatar">
            <div class="job_card__avatar-placeholder">{{ job.company }}</div>
          </div>
          <p class="job_card__location">{{ job.location }}</p>
        </div>
      </div>
    </div>
    
    <div class="job_card__buttons">
      <MainButton type="primary" :text="job.primaryButton" :left-icon="null" :right-icon="null" class="job_card__button" />
      <MainButton type="primary-outline" :text="job.secondaryButton" :left-icon="null" :right-icon="null" class="job_card__button" />
                  <div class="job_card__icon-button">
                    <Icon name="documentCopy" class="job_card__document-icon" />
                  </div>
    </div>
    
    <div v-if="job.notification" class="job_card__notification">
      <ModalNotification 
        :state="job.notification.state || 'Требуется паспорт'"
        @action="onNotificationAction"
      />
    </div>
  </div>
</template>

<script>
import Snackbar from '@/components/atoms/Snackbar.vue'
import MainButton from '@/components/atoms/MainButton.vue'
import Icon from '@/components/atoms/icon/Icon.vue'
import ModalNotification from '@/components/molecules/ModalNotification.vue'
import { createTime, createTimerSnackbar, createButtonSnackbar } from '@/composables/useSnackbarTimer.js'

export default {
  name: 'JobCard',
  components: { Snackbar, MainButton, Icon, ModalNotification },
  props: {
    job: {
      type: Object,
      default: () => ({
        title: 'Грузчик',
        price: '200 ₽/смена',
        date: '14 октября 2024 г.',
        company: 'OZ',
        location: 'Россия, Москва, улица Новый Арбат, 21 ( Метро Анино)',
        primaryButton: 'Откликнуться',
        secondaryButton: '+400₽ к заявке',
        snackbars: [
          createButtonSnackbar({
            id: 1,
            text: 'Удобное расположение',
            icon: 'location'
          }),
          createTimerSnackbar({
            id: 2,
            icon: 'flame',
            time: createTime({ hours: 19, minutes: 38, seconds: 13 })
          })
        ],
        notification: {
          state: 'Требуется паспорт'
        }
      })
    }
  },
  computed: {
    snackbars() {
      return this.job.snackbars || []
    }
  },
  methods: {
    onTimerEnd() {
      // console.log('Таймер подбора завершился')
      // Здесь можно добавить логику для обработки окончания таймера
      // Например, обновить статус заявки или показать уведомление
    },
    onNotificationAction(action) {
      // console.log('Notification action:', action)
      this.$emit('notification-action', action)
      // Здесь можно добавить логику для обработки действий уведомлений
    }
  }
}
</script>

<style lang="scss" scoped>
.job_card {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  
  &__statuses {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: flex-start;
    flex: 1;
  }
  
  &__heart {
    margin-left: 16px;
  }
  
  &__heart-icon {
    width: 24px;
    height: 24px;
    color: #bebebe;
  }
  
  &__content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  &__title-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  &__title {
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 22px;
    font-weight: 600;
    line-height: 1.25;
    color: #263043;
    margin: 0;
  }
  
  &__price {
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 18px;
    font-weight: 600;
    line-height: 1;
    color: #263043;
    margin: 0;
  }
  
  &__date-section {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  &__calendar-icon {
    width: 20px;
    height: 20px;
    color: #263043;
  }
  
  &__date {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: #263043;
    margin: 0;
  }
  
  &__info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  &__location-section {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  &__avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid #dadada;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  &__avatar-placeholder {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #1735f5;
  }
  
  &__location {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: #263043;
    margin: 0;
  }
  
  &__buttons {
    display: flex;
    gap: 16px;
    align-items: center;
  }
  
  &__button {
    width: 220px;
    flex-shrink: 0;
  }
  
  &__icon-button {
    width: 48px;
    height: 48px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: #f8f9fa;
      border-color: #1735f5;
      
      .job_card__document-icon {
        color: #1735f5;
      }
    }
  }
  
  &__document-icon {
    width: 24px;
    height: 24px;
    color: #212121;
  }
  
  &__notification {
    background: #fff6f5;
    border-radius: 14px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  &__notification-content {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }
  
  &__notification-icon {
    width: 28px;
    height: 28px;
    color: #eb4d3d;
    flex-shrink: 0;
  }
  
  &__notification-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  &__notification-title {
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.25;
    color: #263043;
    margin: 0;
  }
  
  &__notification-description {
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    color: #666666;
    margin: 0;
  }
  
  &__notification-buttons {
    display: flex;
    gap: 16px;
    align-items: center;
  }
  
  &__notification-button {
    flex: 1;
    min-width: 0;
  }
  
  // Мобильная адаптация
  @media (max-width: 768px) {
    padding: 20px;
    gap: 24px;
    width: 100vw; // растянуть на всю ширину экрана
    max-width: 100vw;
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    
    &__header {
      flex-direction: column;
      gap: 16px;
      align-items: flex-start;
    }
    
    &__statuses {
      width: 100%;
    }
    
    &__heart {
      margin-left: 0;
      align-self: flex-end;
    }
    
    &__content {
      gap: 16px;
    }
    
    &__title-section {
      gap: 8px;
    }
    
    &__title {
      font-size: 22px;
      line-height: 1.25;
    }
    
    &__price {
      font-size: 18px;
      line-height: 1;
    }
    
    &__date {
      font-size: 14px;
      line-height: 22px;
    }
    
    &__location {
      font-size: 14px;
      line-height: 22px;
    }
    
    &__buttons {
      flex-direction: row;
      gap: 8px;
      align-items: stretch;
      width: 100%;
      max-width: none; // на всю ширину карточки
      margin: 0; // без центрирования, использовать отступы карточки
    }
    
    &__button {
      flex: 1;
      width: auto;
      min-width: 0;
    }
    
    &__icon-button {
      width: 40px;
      height: 40px;
    }
    
    &__document-icon {
      width: 20px;
      height: 20px;
    }
    
    &__notification {
      padding: 16px;
      gap: 16px;
    }
  }
}
</style>
