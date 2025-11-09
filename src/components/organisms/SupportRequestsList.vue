<template>
  <div class="support-requests-list">
    <SupportRequestCard
      v-for="request in requests"
      :key="request.id"
      :item="request"
      @click="handleRequestClick"
    />
  </div>
</template>

<script>
import SupportRequestCard from '@/components/molecules/SupportRequestCard.vue'

export default {
  name: 'SupportRequestsList',
  components: {
    SupportRequestCard
  },
  props: {
    requests: {
      type: Array,
      default: () => []
    }
  },
  emits: ['request-click'],
  methods: {
    handleRequestClick(request) {
      this.$emit('request-click', request)
    }
  }
}
</script>

<style lang="scss" scoped>
.support-requests-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}
</style>

