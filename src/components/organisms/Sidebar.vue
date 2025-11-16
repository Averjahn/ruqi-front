<template>
  <aside class="sidebar" :class="{ 'sidebar--relative': !fixed }">
    <!-- Header with Logo and Icon Button -->
    <div class="sidebar__header">
      <div class="sidebar__logo">
        <img src="@/assets/icons/profile/Logo.svg" alt="Ruqi" class="sidebar__logo-img" />
      </div>
      <ButtonIcon 
        v-if="iconButton"
        :type="iconButtonType"
        :size="iconButtonSize"
        @click="$emit('icon-click')"
        class="sidebar__icon-button"
      >
        <img :src="iconButton" alt="Icon" />
      </ButtonIcon>
    </div>

    <!-- Sidebar Content -->
    <div class="sidebar__content">
      <div v-if="menuItems && menuItems.length > 0" class="sidebar-nav">
        <div 
          v-for="item in menuItems" 
          :key="item.id"
          class="sidebar-nav__item"
          :class="{ 'sidebar-nav__item--active': item.active || isActiveRoute(item.route) }"
          @click="handleItemClick(item)"
        >
          <img 
            v-if="item.iconPath" 
            :src="item.iconPath" 
            alt="" 
            class="sidebar-nav__icon"
          />
          <span class="sidebar-nav__text">{{ item.title }}</span>
          <span v-if="item.badge" class="sidebar-nav__badge">{{ item.badge }}</span>
        </div>
      </div>
      <slot v-else />
    </div>

    <!-- Sidebar Footer (optional) -->
    <div v-if="$slots.footer" class="sidebar__footer">
      <slot name="footer" />
    </div>
  </aside>
</template>

<script>
import ButtonIcon from '@/components/atoms/ButtonIcon.vue'

export default {
  name: 'Sidebar',
  components: {
    ButtonIcon
  },
  props: {
    iconButton: {
      type: String,
      default: null
    },
    iconButtonType: {
      type: String,
      default: 'outlined'
    },
    iconButtonSize: {
      type: String,
      default: 'm'
    },
    fixed: {
      type: Boolean,
      default: true
    },
    menuItems: {
      type: Array,
      default: () => []
    }
  },
  emits: ['icon-click', 'item-click'],
  methods: {
    isActiveRoute(route) {
      if (!route) return false
      // Если мы на странице /ui-new/profile, ничего не должно быть active
      if (this.$route.path === '/ui-new/profile' || this.$route.path === '/profile') {
        return false
      }
      return this.$route.path === route || this.$route.path.startsWith(route + '/')
    },
    handleItemClick(item) {
      // Сначала эмитим событие, чтобы родительский компонент мог обработать клик
      this.$emit('item-click', item)
      // Переход происходит только если есть route и родитель не предотвратил его
      // (родитель может вернуть false из обработчика, но мы не проверяем это явно)
      // Вместо этого, если route === null, переход не происходит
      if (item.route) {
        this.$router.push(item.route)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 286px;
  height: 100vh;
  background: #03123A;
  display: flex;
  flex-direction: column;
  z-index: 100;

  &--relative {
    position: relative;
    height: 100%;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px;
    min-height: 80px;
  }

  &__logo {
    display: flex;
    align-items: center;
    flex: 1;
  }

  &__logo-img {
    height: 30px;
    width: 90px;
    object-fit: contain;
  }

  &__icon-button {
    flex-shrink: 0;
    margin-left: 16px;
    
    :deep(.slot_wrapper) {
      box-shadow: inset 0 0 0 1.5px rgba(255, 255, 255, 0.3);
      background: transparent;
      
      img {
        width: 20px;
        height: 20px;
      }
    }
  }

  &__content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 0 8px 0;
  }

  &__footer {
    padding: 20px 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    flex-shrink: 0;
  }
}

// Sidebar Navigation Styles
.sidebar-nav {
  padding: 0 0 8px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  &__item {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 270px;
    height: 42px;
    padding: 9px 16px;
    margin-bottom: 2px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-family: 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 16px;
    line-height: 22px;
    letter-spacing: 0%;
    color: #AAB3D1;
    opacity: 1;
    box-sizing: border-box;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.18); // #FFFFFF2E = rgba(255, 255, 255, 0.18)
    }
    
    &--active {
      background-color: rgba(255, 255, 255, 0.18); // #FFFFFF2E - такой же как hover
      color: #ffffff;
      
      .sidebar-nav__icon {
        filter: brightness(0) invert(1);
      }
    }
  }
  
  &__icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    opacity: 0.7;
  }
  
  &__item--active &__icon {
    opacity: 1;
    filter: brightness(0) invert(1);
  }
  
  &__text {
    flex: 1;
  }
  
  &__badge {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    background: #ffffff;
    border-radius: 10px;
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #263043;
    flex-shrink: 0;
  }
}

// Scrollbar styling
.sidebar__content {
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    max-width: 286px;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    
    &--open {
      transform: translateX(0);
    }
  }
}
</style>

