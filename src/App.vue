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

// Устанавливаем CSS переменную для ширины sidebar по умолчанию
body {
  --sidebar-width: 286px;
}

// Sidebar collapsed state
body.sidebar-collapsed {
  --sidebar-width: 64px;

  @media (min-width: 769px) {
    // Обновляем padding для всех страниц с sidebar
    .ui-objects,
    .ui-applications,
    .ui-object-create,
    .ui-applications-create,
    .ui-organisation-data,
    .ui-document-templates {
      padding-left: 84px !important; // 64px sidebar + 20px margin
    }
  }
}
</style>
