<template>
  <div class="progress_card_container" @click="openPopup">
    <div class="top_block">
      <div class="achieved_icon">
        <img v-if="achieved" src="@/assets/icons/achieved_star.svg" />
        <img v-else src="@/assets/icons/empty_star.svg" />
      </div>
      <div class="header">
        {{ title }}
      </div>
      <div class="description">
        {{ hint }}
      </div>
    </div>
    <div v-if="!achieved && showProgress" class="data_block">
      <ProgressBar class="progress_bar" :value="value" :targetValue="targetValue" />
      <div class="value">
        <span>{{ value }}</span> / {{ targetValue }}
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from '@/components/atoms/ProgressBar.vue'

export default {
  name: 'ProgressCard',
  components: { ProgressBar },
  props: {
    title: { type: String },
    hint: { type: String },
    showProgress: { type: Boolean, default: true },
    value: { type: Number, default: 0 },
    targetValue: { type: Number, default: 0 },
    myTemplate1: { type: Object, default: () => ({}) },
  },
  data () {
    return {
      isPopupOpen: false,
    }
  },
  computed: {
    achieved () {
      return this.value >= this.targetValue ? true : false
    },
  },
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    openPopup () {
      if (this.hint) this.isPopupOpen = true
    },
  },
}
</script>

<style lang="scss" scoped>
.progress_card_container {
  padding: 16px;
  min-height: 110px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: space-between;
  border-radius: 12px;
  border: 1px solid #2e2e2e14;
  min-width: 270px;

  .top_block {
    display: flex;
    flex-direction: column;
    gap: 16px;
    .header {
      display: flex;
      align-items: center;
    }
    .description {
      font-size: 14px;
      color: #666;
    }
  }

  .data_block {
    width: 100%;
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 8px;
    .progress_bar {
      width: 100%;
    }
  }
  .value {
    text-wrap: nowrap;
    font-size: 14px;
    color: #666666;
    span {
      color: #263043;
      font-weight: 600;
    }
  }
}
.progress_card_menu_popup {
  max-width: 300px;
  padding: 16px;
  background-color: white;
  border-radius: 16px;
  box-shadow:
    0px 8px 48px 4px rgba(2, 52, 227, 0.04),
    0px 0px 10px 0px rgba(23, 53, 245, 0.03);
}
</style>
