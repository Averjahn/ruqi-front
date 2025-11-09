<template>
  <div class="mobile-bottom-nav">
    <div
      v-for="item in menuItems"
      :key="item.id"
      class="mobile-bottom-nav__item"
      :class="{ 'mobile-bottom-nav__item--active': isActiveRoute(item.route) }"
      @click="handleItemClick(item)"
    >
      <img
        v-if="item.iconPath"
        :src="item.iconPath"
        alt=""
        class="mobile-bottom-nav__icon"
      />
      <span v-if="item.title" class="mobile-bottom-nav__text">{{ item.title }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MobileBottomNav',
  props: {
    menuItems: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  methods: {
    handleItemClick(item) {
      if (item.route) {
        this.$router.push(item.route)
      }
    },
    isActiveRoute(route) {
      if (!route) return false
      return this.$route.path === route || this.$route.path.startsWith(route + '/')
    }
  }
}
</script>

<style lang="scss" scoped>
.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 72px;
  display: none; /* Скрыто по умолчанию, показывается только на мобильных */
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  background: #ffffff;
  padding: 0;
  padding-bottom: env(safe-area-inset-bottom); /* Учитываем безопасную зону на iOS */
  z-index: 1000;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 64px;
    min-width: 60px;
    cursor: pointer;
    transition: color 0.2s ease;
    flex: 1;
    max-width: 80px;
    gap: 4px;

    &:hover {
      .mobile-bottom-nav__icon {
        filter: brightness(0) saturate(100%) invert(27%) sepia(94%) saturate(7499%) hue-rotate(231deg) brightness(97%) contrast(96%);
      }

      .mobile-bottom-nav__text {
        color: #1735F5;
      }
    }

    &--active {
      .mobile-bottom-nav__icon {
        filter: brightness(0) saturate(100%) invert(27%) sepia(94%) saturate(7499%) hue-rotate(231deg) brightness(97%) contrast(96%);
      }

      .mobile-bottom-nav__text {
        color: #1735F5;
      }
    }
  }

  &__icon {
    width: 24px;
    height: 24px;
    transition: filter 0.2s ease;
    /* По умолчанию иконки должны быть #666666 */
    /* Фильтр для преобразования черного в #666666 (rgb(102, 102, 102)) */
    /* brightness(0) делает черным, затем invert(40%) дает примерно #666666 */
    filter: brightness(0) saturate(100%) invert(40%);
    opacity: 1;
  }

  &__text {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #666666;
    transition: color 0.2s ease;
    text-align: center;
  }
}

// Показываем мобильное меню только на мобильных устройствах
@media (max-width: 768px) {
  .mobile-bottom-nav {
    display: flex;
  }
}
</style>

