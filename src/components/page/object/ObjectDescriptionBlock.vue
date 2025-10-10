<template>
  <div v-if="object.uuid" class="object_description_block">
    <div class="section_block">
      <div class="section_block-header">Об объекте</div>
      <section v-if="object.description" class="object-page__description article_body_global">
        <div v-html="object.description" />
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ObjectDescriptionBlock',
  props: {
    object: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style lang="scss" scoped>
.object_description_block {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 32px;
}
.section_block {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 16px;
  .section_block-header {
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
    text-align: left;
  }
}

@media (max-width: 999px) {
  .section_block {
    .section_block-header {
      font-size: 18px;
      line-height: 22px;
    }
  }
}
</style>
