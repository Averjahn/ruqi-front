<template>
  <div class="object_list">
    <ObjectCard v-for="object in objects" :key="object.id" :object="object" @click="openObject(object.uuid)" />
  </div>
</template>

<script>
import ObjectCard from '@/components/molecules/ObjectCard.vue'

export default {
  name: 'OtherObjectsList',
  components: { ObjectCard },
  props: {
    objects: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {}
  },
  computed: {},
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    openObject (uuid) {
      this.$router.push('/object/' + uuid)
    },
  },
}
</script>

<style lang="scss" scoped>
.object_list {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  width: 100%;
}
@media (max-width: 1000px) {
  .object_list {
    gap: 24px;
    flex-direction: column;
  }
}
</style>
