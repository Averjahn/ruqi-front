<template>
  <div class="container">
    <!--<div v-if="banners.includes('time_set_ends') && showEndTime" class="task_tag out_of_time">
      Заканчивается набор
      <img src="@/assets/icon_deprecated/fire.svg" alt="icon" />
    </div>-->
    <div v-if="banners.includes('convenient_location')" class="task_tag close_located">
      <img src="@/assets/icons/point_blue.svg" alt="icon" />
      Удобное расположение
    </div>
    <!-- <div v-if="assignedCounter?.required" class="task_tag assigned_counter">
      <img src="@/assets/icons/two_people.svg" alt="icon" />
      <div>{{ assignedCounter?.assigned }}/{{ assignedCounter?.required }}</div>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'TaskTag',
  props: {
    banners: {
      type: Array,
      default: () => [],
    },
    assignedCounter: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    //showEndTime () {
    //  return new Date() < new Date(this?.untilDate)
    //},
  },
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  row-gap: 8px;
  column-gap: 16px;
}
.task_tag {
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 1px 8px;
  font-size: 14px;
  line-height: 22px;
  font-weight: 400;
  &.out_of_time {
    color: #ff5c00;
    background: #fffcf0;
    img {
      width: 16px;
      height: 16px;
    }
  }
  &.close_located {
    color: #1735f5;
    background: #f4f0fe;
    border: 1px solid #a5abe8;
    img {
      width: 16px;
      height: 16px;
    }
  }
  &.assigned_counter {
    color: #15caa9;
    background: #e6fffb;
    border: 1px solid #87e8de;
    img {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
