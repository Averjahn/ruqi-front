<template>
  <div class="icon-text" :class="{ 'icon-text--clickable': clickable }" @click="handleClick">
    <img v-if="icon" :src="icon" alt="" class="icon-text__icon" />
    <span class="icon-text__text">{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'IconText',
  props: {
    icon: {
      type: String,
      default: null
    },
    text: {
      type: String,
      required: true
    },
    clickable: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  methods: {
    handleClick() {
      if (this.clickable) {
        this.$emit('click')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #03123a;

  &--clickable {
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.7;
    }
  }

  &__icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    object-fit: contain;
  }

  &__text {
    line-height: 22px;
  }
}
</style>

