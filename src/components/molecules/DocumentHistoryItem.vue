<template>
  <div class="document-history-item">
    <div class="document-history-item__content">
      <div class="document-history-item__status">{{ status }}</div>
      <div class="document-history-item__date">{{ date }}</div>
      <div class="document-history-item__author">{{ author }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DocumentHistoryItem',
  props: {
    status: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.document-history-item {
  background: #F3F3F3;
  border-radius: 8px;
  padding: 8px 16px;
  width: 100%;
  box-sizing: border-box;

  &__content {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
    justify-content: center;
  }

  &__status {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 400;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 0.1px;
    color: #666666;
    width: 80px;
  }

  &__date {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0.1px;
    color: #000000;
  }

  &__author {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    color: #000000;
    width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  // Desktop version
  @media (min-width: 769px) {
    &__content {
      flex-direction: row;
      align-items: center;
      gap: 16px;
    }

    &__status {
      font-weight: 600;
      font-size: 16px;
      line-height: 20px;
      color: #263043;
      flex-shrink: 0;
    }

    &__date {
      font-size: 16px;
      color: #263043;
      flex: 1;
    }

    &__author {
      font-size: 16px;
      color: #7A91A9;
      flex-shrink: 0;
    }
  }
}
</style>

