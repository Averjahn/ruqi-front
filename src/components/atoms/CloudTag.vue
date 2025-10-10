<template>
  <ul class="cloud_tag" :class="[listStyle, size]">
    <li v-for="(item, index) in listTag" :key="index">
      {{ item }}
    </li>
  </ul>
</template>

<script>
export default {
  name: 'CloudTag',
  props: ['listTag', 'listStyle', 'size'],
  data () {
    return {}
  },
}
</script>

<style lang="scss">
.cloud_tag {
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  gap: 8px;

  li {
    display: flex;
    padding: 4.5px 8px;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    background: #f3f3f3;
    text-align: center;
    font-size: 12px;
    font-style: normal;
    line-height: 15px;
  }

  &.outline {
    gap: 10px;
    li {
      font-size: 14px;
      text-transform: none;
      color: #263043;
      background: transparent;
      border: 1px solid #e4e9ee;
      border-radius: 5px;
      font-weight: 700;
      padding: 4px 8px;
    }
  }

  &.small {
    li {
      font-size: 12px;
      padding: 4.5px 8px;
    }
  }
  @media (max-width: 768px) {
    &.small {
      li {
        font-size: 12px;
        padding: 6px 16px 5px 16px;
      }
    }
  }

  &.extraSmall {
    li {
      font-size: 12px;
      padding: 7px 16px 5px 16px;
    }
  }
}
</style>
