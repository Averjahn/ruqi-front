<template>
  <aside class="sidebar" :class="{ 'sidebar--relative': !fixed, 'sidebar--collapsed': isCollapsed }">
    <!-- Header with Logo and Icon Button -->
    <div class="sidebar__header">
      <div class="sidebar__logo">
        <img 
          v-if="!isCollapsed"
          src="@/assets/icons/profile/Logo.svg" 
          alt="Ruqi" 
          class="sidebar__logo-img" 
        />
        <img 
          v-else
          src="@/assets/icons/profile/mini-logo.svg" 
          alt="Ruqi" 
          class="sidebar__logo-img sidebar__logo-img--mini" 
        />
      </div>
      <ButtonIcon 
        v-if="iconButton && !isCollapsed"
        :type="iconButtonType"
        :size="iconButtonSize"
        @click="handleToggleCollapse"
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
          :title="isCollapsed ? item.title : ''"
        >
          <img 
            v-if="item.iconPath" 
            :src="item.iconPath" 
            alt="" 
            class="sidebar-nav__icon"
          />
          <span v-if="!isCollapsed" class="sidebar-nav__text">{{ item.title }}</span>
          <span v-if="item.badge && !isCollapsed" class="sidebar-nav__badge">{{ item.badge }}</span>
        </div>
      </div>
      <slot v-else />
    </div>

    <!-- Collapse Button at Bottom -->
    <div v-if="isCollapsed" class="sidebar__footer">
      <ButtonIcon 
        :type="iconButtonType"
        :size="iconButtonSize"
        @click="handleToggleCollapse"
        class="sidebar__collapse-button"
      >
        <img :src="iconButton" alt="Expand" />
      </ButtonIcon>
    </div>
  </aside>
</template>

<script>
import ButtonIcon from '@/components/atoms/ButtonIcon.vue'

const SIDEBAR_COLLAPSED_KEY = 'sidebar.collapsed'

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
  data() {
    // Загружаем состояние из localStorage синхронно при инициализации
    let isCollapsed = false
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
      if (saved !== null) {
        isCollapsed = saved === 'true'
      }
    }
    return {
      isCollapsed
    }
  },
  mounted() {
    // Обновляем класс body после монтирования
    this.updateBodyClass()
  },
  beforeUnmount() {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('sidebar-collapsed')
    }
  },
  watch: {
    isCollapsed(newVal) {
      // Сохраняем состояние в localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(newVal))
      }
      this.updateBodyClass()
      // Эмитим событие для родительского компонента
      this.$emit('icon-click')
    }
  },
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
    },
    handleToggleCollapse() {
      this.isCollapsed = !this.isCollapsed
    },
    updateBodyClass() {
      if (typeof document !== 'undefined') {
        if (this.isCollapsed) {
          document.body.classList.add('sidebar-collapsed')
        } else {
          document.body.classList.remove('sidebar-collapsed')
        }
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
  transition: width 0.3s ease;

  // Устанавливаем CSS переменную для ширины sidebar
  --sidebar-width: 286px;

  &--relative {
    position: relative;
    height: 100%;
  }

  &--collapsed {
    width: 64px;
    --sidebar-width: 64px;

    .sidebar__header {
      padding: 24px 12px;
      justify-content: center;
    }

    .sidebar__logo {
      justify-content: center;
    }

    .sidebar-nav__item {
      width: 48px;
      padding: 9px;
      justify-content: center;
    }
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
    justify-content: flex-start;
  }

  &__logo-img {
    height: 30px;
    width: 90px;
    object-fit: contain;

    &--mini {
      width: 24px;
      height: 24px;
    }
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

  &__collapse-button {
    width: 270px;
    height: 42px;
    padding: 9px 16px;
    margin: 0 auto;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.18);
    }
    
    :deep(.slot_wrapper) {
      box-shadow: none;
      background: transparent;
      
      img {
        width: 20px;
        height: 20px;
        opacity: 0.7;
      }
    }
    
    &:hover :deep(.slot_wrapper img) {
      opacity: 1;
    }
  }
  
  &--collapsed &__collapse-button {
    width: 48px;
    padding: 9px;
  }

  &__content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 0 8px 0;
  }

  &__footer {
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 0 8px 0;
    /* border-top: 1px solid rgba(255, 255, 255, 0.1); */
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
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
    white-space: nowrap;
    overflow: hidden;
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

.sidebar--collapsed {
  .sidebar-nav__text,
  .sidebar-nav__badge {
    display: none;
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

