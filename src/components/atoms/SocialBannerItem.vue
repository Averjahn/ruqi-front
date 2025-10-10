<template>
  <div class="social_banner_item" :class="{ lightBg }">
    <div class="title_block">
      <div class="banner_title">
        <div class="banner_text">{{ title }}</div>
      </div>
    </div>

    <div v-if="iconTg" class="content_block">
      <img :src="iconTg" @click="openTgChannel" alt="" class="banner_img" />
      <img :src="iconVk" @click="openVkChannel" alt="" class="banner_img" />
    </div>
    <slot name="children" />
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    iconTg: {
      type: String,
      default: '',
    },
    iconVk: {
      type: String,
      default: '',
    },
    lightBg: {
      type: Boolean,
      default: true,
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
  methods: {
    openTgChannel () {
      window.open('https://t.me/ruqi_job', '_blank')
    },
    openVkChannel () {
      window.open('https://vk.com/club232685726', '_blank')
    },
  },
}
</script>

<style lang="scss" scoped>
.social_banner_item {
  // height: 100%;
  background-color: #f6f8fb;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  border-radius: 16px;
  padding: 8px 12px;
  position: relative;
  flex: 1;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  &.lightBg {
    height: 100%;
    gap: 12px;
    border-radius: 12px;
    background-color: #ffffff;
    padding: 24px;
    .banner_title .banner_text {
      font-size: 16px;
    }
  }

  .title_block {
    align-items: center;
    width: 100%;
    justify-content: flex-start;
    display: flex;
    gap: 8px;
  }

  .banner_title {
    flex: 1;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    .banner_text {
      width: fit-content;
      vertical-align: middle;
      font-size: 11px;
      line-height: 22px;
      text-align: left;
      white-space: normal;
    }
    .title_description {
      font-size: 12px;
      line-height: 125%;
      color: #666666;
    }
  }

  .content_block {
    display: flex;
    gap: 8px;

    .content_value {
      font-size: 30px;
      font-weight: 700;
      line-height: 125%;
      letter-spacing: 0;
    }

    .content_action {
      align-self: center;
      line-height: 22px;
      letter-spacing: 0.1px;
      vertical-align: middle;
      color: #1735f5;
    }
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
    align-self: center;
  }
  @media (max-width: 1000px) {
    &.lightBg {
      padding: 10px;
      border-radius: 10px;
      gap: 8px;
    }

    // .title_block {
    //   align-items: flex-start;
    //   flex-direction: column;
    //   gap: 8px;
    // }
    .content_block {
      .content_value {
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0%;
      }
    }
  }
}
</style>
