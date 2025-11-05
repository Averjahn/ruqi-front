<template>
  <div class="warning-block">
    <div class="warning-block__icon" v-if="icon">
      <img :src="icon" alt="Warning" />
    </div>
    <div class="warning-block__content">
      <h3 v-if="title" class="warning-block__title">{{ title }}</h3>
      <p v-if="text" class="warning-block__text">{{ text }}</p>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'WarningBlock',
  props: {
    title: {
      type: String,
      default: null
    },
    text: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
.warning-block {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #EFF2FD;
  border: 1px solid #B0BAFF;
  border-radius: 12px;
  margin-bottom: 32px;
}

.warning-block__icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 2px;

  img {
    width: 100%;
    height: 100%;
  }
}

.warning-block__content {
  flex: 1;
}

.warning-block__title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.warning-block__text {
  font-size: 14px;
  line-height: 20px;
  color: #1a1a1a;
  margin: 0;
}
</style>

