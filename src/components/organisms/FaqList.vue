<template>
  <div class="faq_list">
    <div v-for="(section, index) in faqs" :key="index" class="section">
      <div class="title">{{ section.title }}</div>
      <router-link
        v-for="article in section.articles"
        :key="article.id"
        :to="'/faq-article/' + article.id"
        class="section_item"
      >
        {{ article.title }}
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FaqSections',
  components: {},
  props: {
    faqs: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style lang="scss" scoped>
.faq_list {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
}

.section {
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.title {
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
  padding-bottom: 8px;
}
.section_item {
  cursor: pointer;
  color: #666666;
  &:hover {
    text-decoration: underline;
    color: #263043;
  }
}
</style>
