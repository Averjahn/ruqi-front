<template>
  <div class="document-links-list">
    <div
      v-for="(link, index) in links"
      :key="index"
      class="document-links-list__item"
      @click="handleLinkClick(link)"
    >
      <p class="document-links-list__title">{{ link.title }}</p>
      <p class="document-links-list__date">{{ link.date }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DocumentLinksList',
  props: {
    links: {
      type: Array,
      default: () => []
    }
  },
  emits: ['link-click'],
  methods: {
    handleLinkClick(link) {
      this.$emit('link-click', link)
    }
  }
}
</script>

<style lang="scss" scoped>
.document-links-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.document-links-list__item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
}

.document-links-list__title {
  font-family: 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
  color: #1735F5;
  margin: 0;
}

.document-links-list__date {
  font-family: 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0.1px;
  color: #666666;
  margin: 0;
}
</style>

