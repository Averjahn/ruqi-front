<template>
  <div id="globalPopupContainer"></div>
  <cookie-consent />
  <component :is="layout" v-bind="$route.meta?.props || {}">
    <router-view />
  </component>
  <Notifications />
</template>

<script>
import RegistrationLayout from '@/layouts/RegistrationLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Notifications from '@/components/atoms/Notifications.vue'
import CookieConsent from '@/components/atoms/CookieConsent.vue'

export default {
  components: {
    RegistrationLayout,
    Notifications,
    DefaultLayout,
    CookieConsent,
  },
  computed: {
    layout () {
      return this.$route.meta?.layout
    },
  },
}
</script>

<style lang="scss">
@import '@/assets/css/index.scss';
</style>
