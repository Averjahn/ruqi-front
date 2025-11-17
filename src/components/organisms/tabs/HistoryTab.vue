<template>
  <div class="object-detail-content__tab-content">
    <div class="object-detail-content__history-wrapper">
      <div class="object-detail-content__history-timeline">
        <div
          v-for="(item, index) in historyItems"
          :key="item.id"
          class="object-detail-content__history-item"
        >
          <div class="object-detail-content__history-time">
            {{ item.date }} {{ item.time }}
          </div>
          <div class="object-detail-content__history-line-container">
            <div class="object-detail-content__history-marker"></div>
            <div
              v-if="index < historyItems.length - 1"
              class="object-detail-content__history-line"
            ></div>
          </div>
          <div class="object-detail-content__history-content">
            <div class="object-detail-content__history-event">
              {{ item.event }}
            </div>
            <div class="object-detail-content__history-details">
              <span class="object-detail-content__history-detail-label">{{ item.detailLabel }}</span>
              <span class="object-detail-content__history-detail-value">{{ item.detailValue }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HistoryTab',
  props: {
    historyItems: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
// Стили наследуются от родительского компонента ObjectDetailContent
</style>

