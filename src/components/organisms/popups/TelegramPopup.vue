<template>
  <div class="telegram_popup">
    <h1>{{ title }}</h1>
    <div class="text">{{ description }}</div>
    <div class="widget_section">
      <Spinner v-if="loadingWidget" class="icon" />
      <TelegramLogin
        mode="callback"
        request-access="write"
        @loaded="telegramLoadedCallbackFunc"
        @callback="telegramCallback"
      />
    </div>
    <div class="table_progress_wrap">
      <ThinLineLoading :show="loading" />
    </div>
  </div>
</template>

<script>
import TelegramLogin from '@/components/organisms/TelegramLogin.vue'
import Spinner from '@/components/atoms/loaders/Spinner.vue'

export default {
  components: {
    TelegramLogin,
    Spinner,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      loadingWidget: true,
    }
  },
  methods: {
    telegramLoadedCallbackFunc () {
      this.loadingWidget = false
    },
    telegramCallback (user) {
      this.$emit('callback', user)
    },
  },
}
</script>

<style lang="scss">
.telegram_popup {
  background: #ffffff;
  position: absolute;
  max-width: 500px;
  padding: 32px;
  left: 50%;
  top: 50%;
  border-radius: 14px;
  transform: translate(-50%, -50%);
  h1 {
    margin: -15px 0 0 0;
  }
  .text {
    margin-bottom: 95px;
  }
  .widget_section {
    margin-bottom: 20px;
  }
}
</style>
