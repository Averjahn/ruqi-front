<template>
  <div class="faq-tabs">
    <div
      v-for="tab in tabs"
      :key="tab.value"
      class="faq-tabs__item"
      :class="{ 'faq-tabs__item--active': currentTab === tab.value }"
      @click="handleTabClick(tab.value)"
    >
      {{ tab.text }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'FaqTabs',
  props: {
    modelValue: {
      type: String,
      required: true
    },
    activeTab: {
      type: String,
      default: null
    },
    tabs: {
      type: Array,
      default: () => [
        { value: 'knowledge-base', text: 'База знаний' },
        { value: 'my-requests', text: 'Мои обращения' }
      ]
    }
  },
  emits: ['update:modelValue', 'tab-change'],
  computed: {
    currentTab() {
      return this.modelValue || this.activeTab
    }
  },
  methods: {
    handleTabClick(value) {
      this.$emit('update:modelValue', value)
      this.$emit('tab-change', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.faq-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 32px;
}

.faq-tabs__item {
  padding: 13px 8px;
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #666666;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;
  background: transparent;

  &:hover {
    color: #263043;
  }

  &--active {
    color: #263043;
    border-bottom-color: #1735F5;
    background: #F2F8FF;
  }
}

@media (max-width: 768px) {
  .faq-tabs__item {
    font-size: 14px;
    padding: 10px 8px;
  }
}
</style>

