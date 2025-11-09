<template>
  <div class="support-requests-empty">
    <img 
      src="@/assets/icons/FAQ/search-folder.svg" 
      alt="Поиск" 
      class="support-requests-empty__icon"
    />
    <h3 class="support-requests-empty__title">Обращений пока нет</h3>
    <p class="support-requests-empty__description">Нажмите на кнопку, чтобы создать обращение в поддержку</p>
    <MainButton
      type="primary"
      text="Создать обращение"
      @click="handleCreateRequest"
      class="support-requests-empty__button"
    />
  </div>
</template>

<script>
import MainButton from '@/components/atoms/MainButton.vue'

export default {
  name: 'SupportRequestsEmpty',
  components: {
    MainButton
  },
  emits: ['create-request'],
  methods: {
    handleCreateRequest() {
      this.$emit('create-request')
    }
  }
}
</script>

<style lang="scss" scoped>
.support-requests-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-top: 56px;
  text-align: center;
}

.support-requests-empty__icon {
  width: 160px;
  height: 110px;
  object-fit: contain;
}

.support-requests-empty__title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 32px;
  line-height: 40px;
  color: #263043;
  margin: 0;
  text-align: center;
}

.support-requests-empty__description {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #666666;
  margin: 0;
  text-align: center;
}

.support-requests-empty__button {
  margin-top: 0;
}

@media (max-width: 768px) {
  .support-requests-empty {
    margin-top: 32px;
    padding: 0 16px;
  }
  
  .support-requests-empty__title {
    font-size: 24px;
    line-height: 30px;
  }
  
  .support-requests-empty__description {
    font-size: 14px;
    line-height: 20px;
  }
}
</style>

