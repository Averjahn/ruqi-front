<template>
  <ThinLineLoading class="thin_loading" :show="$store.getters['app/loading']" />
</template>

<script>
import ThinLineLoading from '../atoms/loaders/ThinLineLoading.vue'

export default {
  name: 'GlobalLoading',
  components: { ThinLineLoading },
}
</script>

<style lang="scss" scoped>
.thin_loading {
  height: 5px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2000;
}
</style>
