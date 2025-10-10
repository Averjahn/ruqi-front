<template>
  <div class="top_banner">
    <div class="banner_text">{{ title }}</div>
    <div v-if="iconTg" class="social_icons">
      <img v-if="iconTg" :src="iconTg" @click="$emit('openTgChannel')" alt="" class="banner_img" />
      <img v-if="iconVk" :src="iconVk" @click="$emit('openVkChannel')" alt="" class="banner_img" />
    </div>
    <slot name="rightAction" />
  </div>
</template>

<script>
import ThinLineLoading from './loaders/ThinLineLoading.vue'

export default {
  components: {},
  emits: ['openTgChannel', 'openVkChannel'],
  props: {
    iconTg: {
      type: String,
      default: '',
    },
    iconVk: {
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
  data () {
    return {}
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.top_banner {
  position: relative;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-radius: 12px;
  padding: 24px;
  position: relative;
  flex: 1;
  cursor: pointer;
  user-select: none;
  overflow: hidden;

  .social_icons {
    display: flex;
    gap: 8px;
  }

  .thin_loading {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
  }
  .banner_img {
    display: block;
    width: 32px;
    height: 32px;
    align-self: flex-start;
  }
  .banner_text {
    width: fit-content;
    align-self: center;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    text-align: left;
    vertical-align: middle;
    overflow-wrap: break-word;
  }
  @media (max-width: 625px) {
    flex-wrap: wrap;
  }
}
</style>
