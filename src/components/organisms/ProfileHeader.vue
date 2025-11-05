<template>
  <div class="profile-header">
    <img 
      :src="avatarUrl || require('@/assets/imgs/document.png')" 
      alt="Avatar" 
      class="profile-header__avatar"
    />
    <div class="profile-header__content">
      <h2 class="profile-header__name">{{ name }}</h2>
      <IconText 
        :icon="require('@/assets/icons/profile/wait-doc.svg')"
        text="Документы на проверке"
        class="profile-header__documents"
      />
    </div>
  </div>
</template>

<script>
import IconText from '@/components/molecules/IconText.vue'

export default {
  name: 'ProfileHeader',
  components: {
    IconText
  },
  props: {
    name: {
      type: String,
      required: true
    },
    avatarUrl: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-header {
  display: flex;
  align-items: center;
  height: 112px;
  width: 100%;

  &__avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  &__content {
    margin-left: 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
    justify-content: center;
  }

  &__name {
    font-family: 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 700;
    font-style: normal;
    font-size: 22px;
    line-height: 27.5px; // 125% от 22px
    letter-spacing: 0%;
    color: #263043;
    margin: 0;
  }

  &__documents {
    ::v-deep .icon-text__text {
      color: #666666;
    }
  }
}
</style>

