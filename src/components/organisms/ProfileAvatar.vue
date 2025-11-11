<template>
  <div class="profile-avatar">
    <div class="profile-avatar__container">
      <div 
        class="profile-avatar__circle"
        :class="{ 'profile-avatar__circle--has-image': avatarUrl }"
        @click="handleAvatarClick"
      >
        <img 
          v-if="avatarUrl"
          :src="avatarUrl" 
          alt="Avatar" 
          class="profile-avatar__image"
        />
        <img 
          v-else
          :src="require('@/assets/icons/camera.svg')" 
          alt="Camera" 
          class="profile-avatar__camera-icon"
        />
      </div>
      <button 
        class="profile-avatar__edit-button"
        @click="handleEditClick"
      >
        <img 
          :src="require('@/assets/icons/profile/icon_circle.svg')" 
          alt="Edit" 
          class="profile-avatar__edit-icon"
        />
      </button>
      <input 
        ref="fileInput"
        type="file"
        accept="image/*"
        class="profile-avatar__file-input"
        @change="handleFileChange"
      />
    </div>
    <h2 class="profile-avatar__name">{{ name }}</h2>
  </div>
</template>

<script>
export default {
  name: 'ProfileAvatar',
  props: {
    name: {
      type: String,
      required: true
    },
    avatarUrl: {
      type: String,
      default: null
    }
  },
  emits: ['avatar-upload', 'edit-click'],
  data() {
    return {
      fileInput: null
    }
  },
  methods: {
    handleAvatarClick() {
      this.$refs.fileInput?.click()
    },
    handleEditClick() {
      this.$emit('edit-click')
      this.$refs.fileInput?.click()
    },
    handleFileChange(event) {
      const file = event.target.files?.[0]
      if (file) {
        // Создаем URL для предпросмотра
        const imageUrl = URL.createObjectURL(file)
        this.$emit('avatar-upload', {
          file,
          imageUrl
        })
      }
      // Сбрасываем input для возможности загрузки того же файла снова
      event.target.value = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 16px 0;
  background: #ffffff;

  &__container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__circle {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: rgba(89, 120, 210, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    &--has-image {
      background: transparent;
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  &__camera-icon {
    width: 28px;
    height: 28px;
    display: block;
    // Иконка камеры уже синяя (#1735F5) из SVG
  }

  &__edit-button {
    position: absolute;
    left: 36px;
    top: 73px;
    width: 24px;
    height: 24px;
    background: none;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    box-sizing: border-box;
  }

  &__edit-icon {
    width: 24px;
    height: 24px;
    display: block;
  }

  &__file-input {
    display: none;
  }

  &__name {
    font-family: 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 600;
    font-size: 20px;
    line-height: 28px;
    color: #2E2E2E;
    margin: 0;
    text-align: center;
  }
}
</style>

