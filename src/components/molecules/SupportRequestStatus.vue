<template>
  <div class="support-request-status" :class="`support-request-status--${status}`">
    {{ statusText }}
  </div>
</template>

<script>
import { TICKET_STATUSES } from '@/constants/statuses'

export default {
  name: 'SupportRequestStatus',
  props: {
    status: {
      type: String,
      default: 'open'
    }
  },
  computed: {
    statusConfig() {
      return TICKET_STATUSES[this.status] || TICKET_STATUSES.open
    },
    statusText() {
      return this.statusConfig.displayed || 'На рассмотрении'
    }
  }
}
</script>

<style lang="scss" scoped>
.support-request-status {
  display: inline-flex;
  align-items: center;
  padding: 0 8px;
  border-radius: 4px;
  font-family: 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0.1px;
  white-space: nowrap;
  flex-shrink: 0;
  
  &--open {
    background-color: #FFF2E8;
    border: 1px solid #FFBB96;
    color: #EB4D3D;
  }
  
  &--closed_by_support,
  &--closed_by_contractor {
    background-color: #F6FFED;
    border: 1px solid #B7EB8F;
    color: #71D472;
  }
}
</style>

