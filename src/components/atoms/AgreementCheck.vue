<template>
  <div class="agreement-check">
    <Checkbox v-model="localValue" class="checkbox" />
    <div class="agreement-check__text">
      <div>
        {{ text }}
        <span class="agreement-check__link" @click="handleLinkClick">
          {{ linkText }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AgreementCheck',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      required: true
    },
    linkText: {
      type: String,
      required: true
    },
    linkRoute: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue'],
  computed: {
    localValue: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  methods: {
    handleLinkClick() {
      this.$router.push(this.linkRoute)
    }
  }
}
</script>

<style lang="scss" scoped>
.agreement-check {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;

  &__text {
    font-size: 14px;
    line-height: 20px;
    color: #374151;
    flex: 1;
  }

  &__link {
    color: #4E64F2;
    cursor: pointer;
    text-decoration: underline;
    
    &:hover {
      text-decoration: none;
    }
  }
}
</style>
