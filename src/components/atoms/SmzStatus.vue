<template>
  <div class="smz_status">
    <img class="smz_ico" :src="getSmzIcon" />
    <div class="smz_tooltip">{{ getTooltipSmz }}</div>
  </div>
</template>

<script>
import { SMZ_STATUSES } from '@/constants/statuses'

export default {
  name: 'SmzStatus',
  props: {
    status: {
      type: String,
      default: '',
    },
    errorMessage: {
      type: String,
      default: '',
    },
  },
  computed: {
    getSmzIcon () {
      const url = SMZ_STATUSES[this.status]?.icon || 'smz_grey.svg'
      return require('@/assets/img_deprecated/' + url)
    },
    getTooltipSmz () {
      return SMZ_STATUSES[this.status]?.displayed || 'Неизвестный статус'
    },
  },
}
</script>

<style lang="scss" scoped>
.smz_status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background-color: #f3f3f3;
  padding: 2px 8px 2px 4px;
  border-radius: 4px;
}
.smz_ico {
  width: 15px;
  height: 15px;
}
.smz_tooltip {
  font-size: 12px;
  color: #666666;
}
</style>
