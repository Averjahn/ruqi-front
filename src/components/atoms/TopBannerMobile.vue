<template>
  <div class="top_banner">
    <img :src="icon" alt="" class="banner_img" />
    <div class="banner_text">{{ title }}</div>
    <ThinLineLoading class="thin_loading" :show="loading" />
  </div>
</template>

<script>
import ThinLineLoading from '../atoms/loaders/ThinLineLoading.vue'

export default {
  components: {},
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({}),
  methods: {},
}
</script>

<style lang="scss" scoped>
.top_banner {
  position: relative;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 15px;
  border-radius: 16px;
  padding: 12px;
  position: relative;
  flex: 1;
  cursor: pointer;
  user-select: none;
  overflow: hidden;

  .thin_loading {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
  }
  .banner_img {
    display: block;
    width: 42px;
    height: 42px;
    align-self: flex-start;
  }
  .banner_text {
    width: fit-content;
    align-self: center;
    font-size: 11px;
    font-weight: 400;
    line-height: 15px;
    text-align: left;
    overflow-wrap: break-word;
  }
  @media (max-width: 625px) {
    flex-wrap: wrap;
  }
}
</style>
