<template>
  <div class="auth-logo-header">
    <div class="auth-logo-header__icons">
      <img src="@/assets/icons/ruqi_dark_blue_rounded.svg" alt="Ruqi" />
      <img class="auth-logo-header__text" src="@/assets/icons/logo.svg" alt="Ruqi" />
    </div>
    <div class="auth-logo-header__title">{{ title }}</div>
  </div>
</template>

<script>
export default {
  name: 'AuthLogoHeader',
  props: { title: { type: String, default: 'Вход в систему' } },
}
</script>

<style lang="scss" scoped>
.auth-logo-header {
  display: flex; flex-direction: column; gap: 20px; align-items: center;
  &__icons { display: flex; flex-direction: column; gap: 8px; align-items: center; }
  &__text { height: 48px; width: auto; }
  &__title { color: #263043; font-size: 24px; font-weight: 600; line-height: 30px; text-align: center; }
}
</style>



