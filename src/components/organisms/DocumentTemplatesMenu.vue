<template>
  <div class="document-templates-menu">
    <div
      v-for="item in menuItems"
      :key="item.id"
      class="document-templates-menu__item"
      :class="{ 'document-templates-menu__item--active': activeItem === item.id }"
      @click="handleItemClick(item)"
    >
      <span class="document-templates-menu__text">{{ item.text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DocumentTemplatesMenu',
  props: {
    activeItem: {
      type: String,
      default: null
    },
    menuItems: {
      type: Array,
      default: () => [
        {
          id: 'legal',
          text: 'Юридические документы'
        },
        {
          id: 'licenses',
          text: 'Лицензии'
        },
        {
          id: 'other',
          text: 'Какие то еще'
        }
      ]
    }
  },
  emits: ['item-click', 'update:activeItem'],
  methods: {
    handleItemClick(item) {
      this.$emit('item-click', item)
      this.$emit('update:activeItem', item.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.document-templates-menu {
  width: 290px;
  background: #ffffff;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.document-templates-menu__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  background: transparent;
  color: #666666;
  font-family: 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;

  &:hover {
    background-color: #F2F8FF;
    color: #1735F5;
  }

  &--active {
    background-color: #F2F8FF;
    color: #1735F5;
  }
}

.document-templates-menu__text {
  font-family: 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  color: inherit;
  transition: color 0.2s ease;
}
</style>

