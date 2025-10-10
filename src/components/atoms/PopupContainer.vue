<template>
  <div :class="['popup_container', { noPadding }]" :style="{ maxWidth }">
    <div v-if="loading" class="loading_container">
      <ThinLineLoading class="thin_loading" :show="loading" />
    </div>
    <div v-if="!noHeader" class="header">
      <div v-if="showDefaultHeader" class="default_header">
        <div>{{ title }}</div>
        <ButtonIconGhost @click="$emit('close')">
          <img src="@/assets/icons/cross_black.svg" />
        </ButtonIconGhost>
      </div>
      <slot name="header" />
    </div>

    <div class="popup_scroll_container">
      <div class="content_block scrollbar">
        <slot />
      </div>

      <div class="footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopupContainer',
  components: {},
  props: {
    title: {
      type: String,
      default: '',
    },
    maxWidth: {
      type: String,
      default: '560px',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    noHeader: {
      type: Boolean,
      default: false,
    },
    noPadding: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      list: null,
    }
  },
  computed: {
    showDefaultHeader () {
      return !this.$slots.header
    },
  },
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    open () {},
  },
}
</script>

<style lang="scss" scoped>
.popup_container {
  position: absolute;
  width: 100%;
  max-width: 560px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 12px;
  padding: 24px 0 24px 24px;
  background: white;
  max-height: 95%;
  display: flex;
  flex-direction: column;
  overflow: auto;

  &.noPadding {
    padding: 0;
    .header,
    .content_block,
    .footer {
      padding-right: 0;
    }
  }

  .default_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    font-size: 20px;
    font-weight: 700;
  }

  .popup_scroll_container {
    display: flex;
    flex-direction: column;
    overflow: auto;
  }
  .header {
    margin-bottom: 24px;
  }
  .content_block {
    flex: 1;
    overflow-y: auto;
  }
  .header,
  .content_block,
  .footer {
    padding-right: 24px;
  }
  .loading_container {
    position: absolute;
    background-color: #ffffffbf;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
  }
  .thin_loading {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 5px;
  }
  @media (max-width: 600px) {
    padding: 16px 0 16px 16px;
    .header,
    .content_block,
    .footer {
      padding-right: 16px;
    }
    &.noPadding {
      padding: 0;
      .header,
      .content_block,
      .footer {
        padding-right: 0;
      }
    }
  }
}
</style>
