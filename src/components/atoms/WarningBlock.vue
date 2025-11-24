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
  gap: 0;
  padding: 16px 12px 16px 16px;
  margin-bottom: 32px;
  background: #F2F8FF;
  border: 1px solid #B0BAFF;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
}

.warning-block__icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  padding-top: 16px;
  padding-right: 12px;

  img {
    width: 100%;
    height: 100%;
  }
}

.warning-block__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.warning-block__title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #666666;
  margin: 0;
}

.warning-block__text {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.1px;
  color: #666666;
  margin: 0;
}
</style>

