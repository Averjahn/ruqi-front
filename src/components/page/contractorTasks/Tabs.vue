<template>
  <div class="contractor_tabs">
    <div
      v-for="tab in tabs"
      :key="tab.page"
      :class="{ active: active === tab.page }"
      @click="$router.push(`/main/${tab.page}`)"
      class="contractor_tabs_item"
    >
      {{ tab.text }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: String,
    },
  },
  data: () => ({
    tabs: [
      { text: 'Доступно', page: 'available' },
      { text: 'Откликнулся', page: 'accepted' },
      { text: 'Избранное', page: 'favorite' },
      { text: 'Завершено', page: 'completed' },
    ],
  }),
  mounted () {},
}
</script>

<style lang="scss" scoped>
.contractor_tabs {
  display: inline-flex;
  gap: 24px;
  border-bottom: 1px solid #dadada;
}

.contractor_tabs_item {
  padding: 13px 8px;
  font-weight: 600;
  line-height: 125%;
  cursor: pointer;
  &.active {
    border-bottom: 2px solid #0082de;
    background: #f2f8ff;
  }
}

@media (max-width: 767px) {
  .contractor_tabs {
    max-width: 392px;
    overflow-x: auto;
    display: flex;
    padding: 0 16px;
    justify-content: flex-start;
  }
  .contractor_tabs::-webkit-scrollbar {
    width: 0;
  }
  .contractor_tabs_item {
    padding: 0 0 7px 0;
    font-weight: 600;
    line-height: 125%;
    cursor: pointer;
    color: #7a91a9;
    border-bottom: 2px solid #7a91a9;
    &.active {
      color: #0082de;
      border-bottom: 2px solid #0082de;
      background: transparent;
    }
  }
}
</style>
