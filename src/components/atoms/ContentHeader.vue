<template>
  <div class="content-header">
    <h1 v-if="title" class="content-header__title">{{ title }}</h1>
    <p v-if="description" class="content-header__description">{{ description }}</p>
  </div>
</template>

<script>
export default {
  name: 'ContentHeader',
  props: {
    title: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
.content-header {
  margin-bottom: 40px;
}

.content-header__title {
  font-size: 32px;
  font-weight: 700;
  color: #263043;
  margin: 0 0 16px 0;
  text-align: left;
}

.content-header__description {
  font-size: 16px;
  line-height: 24px;
  color: #666666;
  margin: 0;
  text-align: left;
}

@media (max-width: 768px) {
  .content-header {
    margin-bottom: 24px;
  }

  .content-header__title {
    font-size: 24px;
    line-height: 30px;
    margin-bottom: 12px;
  }

  .content-header__description {
    font-size: 14px;
    line-height: 20px;
  }
}
</style>


