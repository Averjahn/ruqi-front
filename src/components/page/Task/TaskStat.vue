<template>
  <div class="details_block">
    <div class="num">№ {{ task.number }}</div>
    <div class="views">
      <img src="@/assets/icon_deprecated/eye_grey.svg" />
      <span>{{ task.view || 1 }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskStat',
  props: {
    task: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style lang="scss" scoped>
.details_block {
  display: flex;
  align-items: center;
  gap: 17px;
  font-size: 16px;
  font-weight: 600;
  color: #7a91a9;
  margin-bottom: 16px;

  @media screen and (min-width: 768px) {
    margin-bottom: 24px;
  }
}

.num {
  white-space: nowrap;
}
.views {
  display: flex;
  align-items: center;
  gap: 7px;
}
</style>
