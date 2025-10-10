<template>
  <div id="default_layout" class="desktop_scrollbar" :class="{ scrollable }">
    <header v-if="isMobile" class="header_mobile">
      <TopBarMobile :setLayoutScroll="setLayoutScroll" />
    </header>
    <header v-else class="header">
      <TopBar />
    </header>
    <main class="content_wrapper">
      <slot />
      <Footer
        v-if="isApplicationPage || !hideMobileBottomBar"
        class="app_footer"
        :class="{ hide_footer: !isApplicationPage }"
      />
      <BottomBar v-if="!hideMobileBottomBar" class="bottom_bar" />
    </main>
    <GlobalPopups />
    <GlobalLoading />
  </div>
</template>

<script>
import BottomBar from '@/components/organisms/BottomBar.vue'
import Footer from '@/components/organisms/Footer.vue'
import TopBar from '@/components/organisms/Topbar.vue'
import TopBarMobile from '@/components/organisms/TopBarMobile.vue'
import GlobalPopups from '@/components/organisms/GlobalPopups.vue'
import GlobalLoading from '@/components/atoms/GlobalLoading.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    BottomBar,
    TopBar,
    TopBarMobile,
    GlobalLoading,
    GlobalPopups,
    Footer,
  },
  name: 'DefaultLayout',
  props: {
    hideMobileBottomBar: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      scrollable: true,
      isMobile: true,
    }
  },
  computed: {
    isApplicationPage () {
      return [
        '/application',
        '/documents',
        '/privacy-policy',
        '/customer-contract',
        '/edo',
        '/personal',
        '/dogovor-okazaniya-uslug',
        '/terms-of-use',
      ].includes(this.$route.path)
    },
  },
  methods: {
    ...mapGetters('user', ['user']),
    setLayoutScroll (val) {
      // Эта функция нужна для мобильных браузеров, у которых из-за вертикального свайпа
      // может изменяться высота окна браузера за счёт скрытия верхнего или нижнего меню
      // из-за чего из под попапа меню торчит содержимое страницы на высоту скрытого меню браузера
      this.scrollable = val
    },
    defineDevice () {
      this.isMobile = window.innerWidth < 1000
    },
  },
  beforeMount () {
    this.defineDevice()
  },
  mounted () {
    window.addEventListener('resize', this.defineDevice)
  },
  unmounted () {
    window.removeEventListener('resize', this.defineDevice)
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/mixins.scss';
#default_layout {
  --header-height: 60px;
  position: relative;
  height: 100%;
  padding-top: var(--header-height);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease-in-out;
  overflow-y: scroll;
  @include scrollbar();

  .header {
    position: fixed;
    display: flex;
    align-items: center;
    overflow: hidden;
    top: 0;
    left: 0;
    opacity: 1;
    right: 0;
    height: var(--header-height);
    box-shadow: 0px 8px 48px 4px #0234e30a;
    transition: all 0.3s ease-in-out;
    background: #fff;
    z-index: 200;
  }
  .content_wrapper {
    min-height: 100%;
  }

  .app_footer {
    display: block;
    width: 100%;
    opacity: 1;
    visibility: 1;
    pointer-events: all;
    transition: all 0.3s ease-in-out;
  }
  .bottom_bar {
    opacity: 0;
    visibility: 0;
    user-select: none;
    pointer-events: none;
    transition: all 0.3s ease-in-out;
  }
  .header_mobile {
    display: none;
  }

  @media (max-width: 1000px) {
    .header,
    .bottom_bar {
      opacity: 1;
      visibility: 1;
      pointer-events: all;
    }
    .hide_footer {
      display: none;
      opacity: 0;
      visibility: 0;
      user-select: none;
      pointer-events: none;
    }
    .header_mobile {
      position: fixed;
      display: block;
      top: 0;
      right: 0;
      left: 0;
      box-shadow: 0px 8px 48px 4px rgba(2, 52, 227, 0.0392156863);
      z-index: 210;
    }
    &:not(.scrollable) {
      overflow-y: hidden;
    }
  }

  @media (min-width: 1000px) {
    &.desktop_scrollbar {
      @include scrollbar();
    }
  }
}
</style>
