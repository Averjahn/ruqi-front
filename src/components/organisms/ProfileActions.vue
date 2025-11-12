<template>
  <div class="profile-actions">
    <button 
      class="profile-actions__button"
      @click="handleChangePassword"
    >
      <div class="profile-actions__icon-wrapper profile-actions__icon-wrapper--password">
        <img 
          :src="changePassIcon" 
          alt="Change password" 
          class="profile-actions__icon profile-actions__icon--password"
        />
      </div>
      <span class="profile-actions__text">Сменить пароль</span>
    </button>
    
    <button 
      class="profile-actions__button"
      @click="handleLogout"
    >
      <div class="profile-actions__icon-wrapper profile-actions__icon-wrapper--exit">
        <img 
          :src="exitIcon" 
          alt="Log out" 
          class="profile-actions__icon profile-actions__icon--exit"
        />
      </div>
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

  @media (min-width: 769px) {
    margin-top: 16px;
  }

  @media (max-width: 768px) {
    padding: 0 16px;
  }
}

.profile-actions__button {
  display: flex;
  align-items: center;
  width: 100%;
  background: #ffffff;
  border: 1px solid #E3E5E4;
  border-radius: 16px;
  cursor: pointer;
  padding: 12px 16px;
  gap: 16px;
  transition: all 0.2s ease;
  box-sizing: border-box;

  @media (min-width: 769px) {
    border: none;
    padding: 24px;
  }

  &:hover {
    opacity: 0.9;
  }

  &:active {
    opacity: 0.8;
  }
}

.profile-actions__icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 24px;
  padding: 8px;
  box-sizing: border-box;

  &--password {
    background: #ECF1FF;
  }

  &--exit {
    background: #FFF6F5;
  }
}

.profile-actions__icon {
  flex-shrink: 0;
  object-fit: contain;

  &--password {
    width: 24px;
    height: 24px;

    @media (min-width: 769px) {
      width: 40px;
      height: 40px;
    }
  }

  &--exit {
    width: 20px;
    height: 20px;

    @media (min-width: 769px) {
      width: 40px;
      height: 40px;
    }
  }
}

.profile-actions__text {
  font-family: 'Source Sans Pro', 'Source Sans 3', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.25;
  color: #263043;
  white-space: nowrap;
  margin: 0;

  @media (min-width: 769px) {
    font-size: 20px;
  }
}
</style>

