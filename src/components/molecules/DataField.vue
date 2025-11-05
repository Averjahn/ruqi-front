<template>
  <div class="data-field">
    <label class="data-field__label">{{ label }}</label>
    <div class="data-field__content">
      <div class="data-field__value-wrapper">
        <span class="data-field__value">{{ value || placeholder }}</span>
        <span v-if="status" class="data-field__status" :class="`data-field__status--${status.type}`">
          <img 
            v-if="status.icon" 
            :src="status.icon" 
            alt="" 
            class="data-field__status-icon"
          />
          <span class="data-field__status-text">{{ status.text }}</span>
        </span>
      </div>
      <div v-if="action" class="data-field__action">
        <a 
          v-if="action.type === 'link'"
          href="#" 
          class="data-field__action-link"
          @click.prevent="handleAction"
        >
          {{ action.text }}
        </a>
        <img 
          v-else-if="action.type === 'icon'"
          :src="action.icon" 
          alt="" 
          class="data-field__action-icon"
          @click="handleAction"
        />
      </div>
    </div>
    <div v-if="showDivider" class="data-field__divider"></div>
  </div>
</template>

<script>
export default {
  name: 'DataField',
    props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    status: {
      type: Object,
      default: null
      // { type: 'confirmed' | 'unconfirmed', icon: String, text: String }
    },
    action: {
      type: Object,
      default: null
      // { type: 'link' | 'icon', text: String (for link), icon: String (for icon) }
    },
    showDivider: {
      type: Boolean,
      default: true
    }
  },
  emits: ['action-click'],
  methods: {
    handleAction() {
      this.$emit('action-click', this.action)
    }
  }
}
</script>

<style lang="scss" scoped>
.data-field {
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  
  &__label {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #666666;
    margin-bottom: 8px;
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  &__value-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
  }

  &__value {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #263043;
  }

  &__status {
    display: flex;
    align-items: center;
    gap: 4px;

    &--confirmed {
      color: #10B981;
    }

    &--unconfirmed {
      color: #EF4444;
    }
  }

  &__status-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  &__status-text {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
  }

  &__action {
    display: flex;
    align-items: center;
  }

  &__action-link {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #1735F5;
    text-decoration: none;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.7;
    }
  }

  &__action-icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.7;
    }
  }

  &__divider {
    height: 1px;
    background-color: #E5E7EB;
    margin-top: 16px;
  }
}
</style>

