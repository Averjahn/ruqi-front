<template>
  <div class="task_description_container">
    <section v-if="task.object_description" class="description article_body_global">
      <div v-html="task.object_description"></div>
    </section>

    <ImageGallery v-if="galleryTask.length" :items="galleryTask" />

    <template v-else>
      <section v-if="task.vacancy_description" class="description article_body_global">
        <div v-html="task.vacancy_description"></div>
      </section>

      <section v-if="task.requirements && task.requirements.length" class="description">
        <div class="title">Дополнительные условия</div>
        <CloudTag :listTag="task.requirements" listStyle="outline" />
      </section>
    </template>
  </div>
</template>

<script>
import ImageGallery from '@/components/organisms/ImageGallery'
export default {
  name: 'TaskDescriptionBlock',
  components: { ImageGallery },
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  computed: {
    galleryTask () {
      return (
        this.task?.todo?.map((t) => ({
          thumbnail: t.thumbnail,
          main: t.main,
          title: t.title,
          description: t.description,
        })) || []
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.task_description_container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  .description {
    font-weight: 400;
    font-size: 14px;
    color: #263043;

    @media screen and (min-width: 1000x) {
      font-size: 16px;
    }
  }

  .title {
    color: #7a91a9;
    font-size: 18px;
    margin-bottom: 10px;
    line-height: 1;

    @media screen and (min-width: 1000px) {
      font-size: 22px;
      margin-bottom: 16px;
      font-weight: 600;
    }
  }
}
</style>
