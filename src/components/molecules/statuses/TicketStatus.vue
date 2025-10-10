<template>
  <div class="ticket_status" :style="{ background, color, borderColor }">
    {{ text }}
  </div>
</template>

<script>
import { TICKET_STATUSES } from '@/constants/statuses'

export default {
  name: 'TicketStatus',
  components: {},
  props: {
    status: {
      type: String,
      default: '',
    },
  },
  data () {
    return {}
  },
  computed: {
    color () {
      return TICKET_STATUSES[this.status]?.color || '#7a91a9'
    },
    borderColor () {
      return TICKET_STATUSES[this.status]?.border_color || '#7a91a9'
    },
    background () {
      return TICKET_STATUSES[this.status]?.bg_color || '#ebebeb'
    },
    text () {
      return TICKET_STATUSES[this.status]?.displayed || 'Неизвестный статус'
    },
  },
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.ticket_status {
  display: inline-block;
  border: 1px solid #7a91a9;
  padding: 0 8px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 22px;
}
</style>
