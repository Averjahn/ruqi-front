<template>
  <div class="faq_sections">
    <div v-for="(section, index) in faqs" class="section" :key="index">
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
  data () {
    return {
      list: null,
    }
  },
  computed: {},
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.faq_sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  align-items: stretch;
  flex-wrap: wrap;
  gap: 24px;
}
.section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  padding: 32px;
  border: 1px solid #0000001a;
  border-radius: 16px;
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
@media (max-width: 1000px) {
  .section {
    padding: 20px;
  }
}
@media (max-width: 440px) {
  .faq_sections {
    grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
  }
}
</style>
