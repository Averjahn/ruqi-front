<template>
  <div class="ticket_item" @click="$router.push('/support/' + item.id)">
    <div class="header">
      <div class="left_part">
        <div class="count">
          <img src="@/assets/icons/comment.svg" />
          {{ item.messages_count }}
        </div>
        <div class="dot" />
        <div class="number">№{{ item.id }}</div>
        <div class="dot" />
        <div class="date">
          Создано
          <span>{{ $dayjs(item.created_at).format('DD MMMM') }}</span> в
          {{ $dayjs(item.created_at).format('HH:mm') }}
        </div>
      </div>

      <TicketStatus :status="item.status" />
    </div>

    <div class="title">
      {{ item.title }}
    </div>

    <div v-if="item.message" class="description ticket_text_global" v-html="item.message" />
  </div>
</template>

<script>
import TicketStatus from '@/components/molecules/statuses/TicketStatus.vue'

export default {
  name: 'Ticket',
  components: { TicketStatus },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      list: null,
    }
  },
  computed: {},
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    open () {},
  },
}
</script>

<style lang="scss" scoped>
.ticket_item {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px;
  border-radius: 16px;
  border: 1px solid #0000001a;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  user-select: none;
  &:hover {
    box-shadow:
      0px 8px 48px 4px #0234e30a,
      0px 0px 10px 0px #1735f508;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
  }
  .left_part {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .count {
    display: flex;
    align-items: center;
    gap: 2px;
  }
  .dot {
    width: 2px;
    min-width: 2px;
    height: 2px;
    border-radius: 50%;
    background-color: #666666;
  }
  .date span {
    text-transform: lowercase;
  }
  .title {
    font-weight: 600;
    font-size: 20px;
  }
  .description {
    max-width: 640px;
    color: #666666;
  }

  @media (max-width: 1000px) {
    padding: 24px;
    .header {
      font-size: 14px;
      flex-direction: column-reverse;
      align-items: flex-start;
      gap: 16px;
    }
  }
}
</style>
