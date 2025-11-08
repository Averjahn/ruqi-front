<template>
  <div class="profile-actions">
    <button 
      class="profile-actions__button"
      @click="handleChangePassword"
    >
      <img 
        :src="changePassIcon" 
        alt="Change password" 
        class="profile-actions__icon"
      />
      <span class="profile-actions__text">Сменить пароль</span>
    </button>
    
    <button 
      class="profile-actions__button"
      @click="handleLogout"
    >
      <img 
        :src="exitIcon" 
        alt="Log out" 
        class="profile-actions__icon"
      />
      <span class="profile-actions__text">Выйти из аккаунта</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'ProfileActions',
  emits: ['change-password', 'logout'],
  computed: {
    changePassIcon() {
      return require('@/assets/icons/profile/change-pass-icon.svg')
    },
    exitIcon() {
      return require('@/assets/icons/profile/exit-icon.svg')
    }
  },
  methods: {
    handleChangePassword() {
      this.$emit('change-password')
    },
    handleLogout() {
      this.$emit('logout')
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.profile-actions__button {
  display: flex;
  align-items: center;
  width: 100%;
  background: #ffffff;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  padding-left: 24px;
  gap: 16px;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }
}

.profile-actions__icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  object-fit: contain;
}

.profile-actions__text {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-style: normal;
  font-size: 20px;
  line-height: 28px;
  letter-spacing: 0%;
  color: #263043;
  padding: 30px 0;
}
</style>

