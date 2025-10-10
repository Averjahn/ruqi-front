<template>
  <div class="universal-select">
    <div v-if="label" class="select-label">{{ label }}</div>
    <div v-if="description" class="select-description">{{ description }}</div>

    <div class="select-options">
      <Button
        v-for="(option, index) in options"
        :key="index"
        :type="isSelected(option) ? 'outlined' : 'contained'"
        color="grey"
        :disabled="maxSelected && selectedValues.length >= maxSelected && !isSelected(option)"
        @click="toggleOption(option)"
      >
        {{ option.text }}
      </Button>
    </div>

    <div v-if="maxSelected" class="select-limit">Выбрано {{ selectedValues.length }} из {{ maxSelected }}</div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true,
    },
    label: String,
    description: String,
    multiple: Boolean,
    maxSelected: Number,
    modelValue: [Array, String, Object],
  },

  emits: ['update:modelValue'],

  computed: {
    selectedValues () {
      return this.multiple ? this.modelValue || [] : this.modelValue ? [this.modelValue] : []
    },
  },

  methods: {
    isSelected (option) {
      return this.multiple
        ? this.selectedValues.some((v) => v.value === option.value)
        : this.selectedValues[0]?.value === option.value
    },

    toggleOption (option) {
      if (this.multiple) {
        const newValues = this.selectedValues.some((v) => v.value === option.value)
          ? this.selectedValues.filter((v) => v.value !== option.value)
          : [...this.selectedValues, option]

        if (!this.maxSelected || newValues.length <= this.maxSelected) {
          this.$emit('update:modelValue', newValues)
        }
      } else {
        this.$emit('update:modelValue', this.isSelected(option) ? null : option)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.universal-select {
  margin-bottom: 24px;

  .select-label {
    font-weight: 600;
    margin-bottom: 8px;
  }

  .select-description {
    color: #666;
    margin-bottom: 16px;
  }

  .select-options {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .select-limit {
    margin-top: 12px;
    font-size: 14px;
    color: #666;
  }
}
</style>
