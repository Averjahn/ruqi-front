<template>
  <div class="bread_crumbs_container">
    <template v-for="item in items" :key="item.text">
      <template v-if="item.url">
        <ButtonText @click="$router.push(item.url)" color="grey" size="m"> {{ item.text }}</ButtonText>
        <img class="img" src="@/assets/icons/chevron.svg" />
      </template>
      <template v-else>
        {{ item.text }}
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: 'BreadCrumbs',
  components: {},
  props: {
    items: { type: Array, default: () => [] },
  },
  data () {
    return {
      myTemplate2: null,
    }
  },
  computed: {},
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    myTemplate3 () {},
  },
}
</script>

<style lang="scss" scoped>
.bread_crumbs_container {
  display: flex;
  gap: 12px;
  align-items: center;
  .img {
    width: 16px;
    min-width: 16px;
    height: 16px;
  }
}
</style>
