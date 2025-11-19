<template>
  <div class="object-detail-content__tab-content">
    <div class="object-detail-content__data-wrapper">
      <div class="object-detail-content__data-section">
        <h2 class="object-detail-content__data-title">Данные объекта</h2>
        <div class="object-detail-content__data-content">
          <div class="object-detail-content__data-image">
            <img 
              v-if="objectData.image" 
              :src="objectData.image" 
              :alt="objectData.name"
              class="object-detail-content__data-image-img"
            />
            <div v-else class="object-detail-content__data-image-placeholder">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="8" fill="#F6F8FB"/>
                <path d="M24 16C26.2091 16 28 17.7909 28 20C28 22.2091 26.2091 24 24 24C21.7909 24 20 22.2091 20 20C20 17.7909 21.7909 16 24 16Z" fill="#666666"/>
                <path d="M16 32C16 28.6863 18.6863 26 22 26H26C29.3137 26 32 28.6863 32 32V34H16V32Z" fill="#666666"/>
              </svg>
            </div>
          </div>
          <div class="object-detail-content__data-fields">
            <div class="object-detail-content__data-field">
              <span class="object-detail-content__data-label">Название объекта для исполнителей</span>
              <span class="object-detail-content__data-value">{{ objectData.performerName || objectData.name || '-' }}</span>
            </div>
            <div class="object-detail-content__data-field">
              <span class="object-detail-content__data-label">График работы</span>
              <span class="object-detail-content__data-value">{{ objectData.workSchedule || '-' }}</span>
            </div>
            <div class="object-detail-content__data-field">
              <span class="object-detail-content__data-label">Вид объекта</span>
              <span class="object-detail-content__data-value">{{ objectData.type || '-' }}</span>
            </div>
            <div class="object-detail-content__data-field">
              <span class="object-detail-content__data-label">Описание</span>
              <span class="object-detail-content__data-value">{{ objectData.description || '-' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataTab',
  props: {
    object: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    objectData() {
      // Тестовые данные для вкладки "Данные"
      const testData = {
        name: 'Объект',
        performerName: 'Дандер Мифлин',
        workSchedule: '12ч',
        type: 'Производство',
        description: 'Текст описания'
      }
      
      // Объединяем пропс с тестовыми данными (пропс имеет приоритет)
      return {
        ...testData,
        ...this.object
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// Стили наследуются от родительского компонента ObjectDetailContent
</style>

