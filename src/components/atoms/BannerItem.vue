<template>
  <div class="banner_item">
    <div class="title_block">
      <img :src="icon" alt="" class="banner_img" />
      <div class="left_side">
        <div class="banner_title">
          <div class="banner_text">{{ title }}</div>
          <div v-if="titleDescription" class="title_description">{{ titleDescription }}</div>
        </div>
        <slot name="rightAction" />
      </div>
    </div>

    <div v-if="content" class="content_block">
      <div v-if="content?.value" class="content_value">{{ content.value }}</div>
      <div v-if="content?.action" class="content_action">{{ content.action }}</div>
    </div>

    <ThinLineLoading class="thin_loading" :show="loading" />
  </div>
</template>

<script>
import ThinLineLoading from './loaders/ThinLineLoading.vue'

export default {
  components: { ThinLineLoading },
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    titleDescription: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    content: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({}),
  methods: {},
}
</script>

<style lang="scss" scoped>
.banner_item {
  height: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 12px;
  border-radius: 12px;
  padding: 24px;
  position: relative;
  flex: 1;
  cursor: pointer;
  user-select: none;
  overflow: hidden;

  .title_block {
    align-items: center;
    width: 100%;
    justify-content: flex-start;
    display: flex;
    gap: 8px;
  }
  .left_side {
    width: 100%;
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
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
      font-size: 16px;
      line-height: 22px;
      text-align: left;
      overflow-wrap: break-word;
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
    padding: 10px;
    border-radius: 10px;
    gap: 8px;
    // .title_block {
    //   align-items: flex-start;
    //   flex-direction: column;
    //   gap: 8px;
    // }
    .left_side {
      gap: 8px;
    }
    .banner_img {
      width: 24px;
      height: 24px;
    }
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
