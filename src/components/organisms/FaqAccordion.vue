<template>
  <div class="faq_accordion">
    <Accordion class="accordion" v-for="(section, index) in faqs" :key="index" :title="section.title">
      <div class="link_container">
        <router-link
          v-for="article in section.articles"
          :key="article.id"
          :to="'/faq-article/' + article.id"
          class="section_item"
        >
          {{ article.title }}
        </router-link>
      </div>
    </Accordion>
  </div>
</template>

<script>
import Accordion from '@/components/atoms/Accordion.vue'
export default {
  name: 'FaqAccordion',
  components: {
    Accordion,
  },
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
.faq_accordion {
  .accordion:not(:last-child) {
    border-bottom: none;
  }
  .link_container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 0 10px 32px 10px;
  }
  .section_item {
    cursor: pointer;
    color: #666666;
    &:hover {
      text-decoration: underline;
      color: #263043;
    }
  }
}
</style>
