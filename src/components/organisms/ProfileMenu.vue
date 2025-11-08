<template>
  <div class="profile-menu">
    <div
      v-for="item in menuItems"
      :key="item.id"
      class="profile-menu__item"
      :class="{ 'profile-menu__item--active': activeItem === item.id }"
      @click="handleItemClick(item)"
    >
      <img :src="item.icon" alt="" class="profile-menu__icon" />
      <span class="profile-menu__text">{{ item.text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileMenu',
  props: {
    activeItem: {
      type: String,
      default: null
    },
    menuItems: {
      type: Array,
      default: () => [
        {
          id: 'account',
          icon: require('@/assets/icons/profile/tabs/Shield-task.svg'),
          text: 'Учетная запись'
        },
        {
          id: 'organization',
          icon: require('@/assets/icons/profile/tabs/Info.svg'),
          text: 'Об организации'
        },
        {
          id: 'doc-platform',
          icon: require('@/assets/icons/profile/tabs/Doc-platform.svg'),
          text: 'Документы с платформы'
        },
        {
          id: 'acts',
          icon: require('@/assets/icons/profile/Профиль/tabs/Acts.svg'),
          text: 'Акты'
        },
        {
          id: 'docs-executors',
          icon: require('@/assets/icons/profile/Профиль/tabs/Docs-executors.svg'),
          text: 'Договора с исполнителями'
        },
        {
          id: 'signature',
          icon: require('@/assets/icons/profile/Профиль/tabs/Signature.svg'),
          text: 'Электронная подпись'
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
.profile-menu {
  width: 290px;
  background: #ffffff;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-menu__item {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  background: transparent;
  color: #666666;

  &:hover {
    background-color: #F2F8FF;
    
    .profile-menu__text {
      color: #1735F5;
    }
    
    .profile-menu__icon {
      filter: brightness(0) saturate(100%) invert(27%) sepia(94%) saturate(7499%) hue-rotate(231deg) brightness(97%) contrast(96%);
    }
  }

  &--active {
    background-color: #F2F8FF;
    
    .profile-menu__text {
      color: #1735F5;
    }
    
    .profile-menu__icon {
      filter: brightness(0) saturate(100%) invert(27%) sepia(94%) saturate(7499%) hue-rotate(231deg) brightness(97%) contrast(96%);
    }
  }
}

.profile-menu__icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  object-fit: contain;
  transition: filter 0.2s ease;
}

.profile-menu__text {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #666666;
  transition: color 0.2s ease;
}
</style>

