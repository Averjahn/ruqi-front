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
      <slot />
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
    }
  },
  emits: ['icon-click']
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

