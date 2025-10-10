<template>
  <div class="registration_layout">
    <header class="header">
      <img class="logo" src="@/assets/icons/logo.svg" />
    </header>
    <slot />
  </div>
  <GlobalLoading />
</template>

<script>
import GlobalLoading from '@/components/atoms/GlobalLoading.vue'

export default {
  name: 'RegistrationLayout',
  components: {
    GlobalLoading,
  },
}
</script>

<style lang="scss">
.registration_layout {
  // min-height: 100%;
  height: calc(100dvh - 64px) ;
  .header {
    width: 100%;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #FFFFFF;
    box-shadow: 0px 8px 48px 4px #0234E30A, 0px 0px 10px 0px #1735F508;

  }
  .logo {
    display: inline-block;
  }

  @media (max-width: 900px) {
    // min-height: 10%;
  }
}
</style>
