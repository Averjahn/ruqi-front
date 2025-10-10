<template>
  <template v-if="watchedObjects?.length">
    <div class="object_list">
      <ObjectCard
        v-for="object in watchedObjects"
        :key="object.uuid"
        :object="object"
        @click="$router.push('/object/' + object.uuid)"
      />
      <div v-if="!watchedObjects.length">Пока нет просмотренных объектов</div>
    </div>
  </template>
  <div class="empty_block" v-show="!watchedObjects?.length">История просмотров пуста</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ObjectCard from '@/components/molecules/ObjectCard.vue'

export default {
  components: {
    ObjectCard,
  },
  data: () => ({}),
  computed: {
    ...mapGetters('watchedObjects', ['watchedObjects']),
  },
  watch: {},
  mounted () {
    this.getWatchedObjects()
  },
  methods: {
    ...mapActions('watchedObjects', ['getWatchedObjects']),
  },
}
</script>

<style lang="scss" scoped>
.object_list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
