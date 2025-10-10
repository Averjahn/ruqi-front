<template>
  <div class="top_bar_mobile" :class="{ open }">
    <div class="top_bar basic_container_global">
      <img class="logo" src="@/assets/icons/logo.svg" @click="$router.push('/')" />

      <div class="right_part">
        <Region v-if="isLogged" />
        <div class="notifications">
          <UserNotifications v-if="isLogged" isMobile />
        </div>
        <div class="menu_button" @click="openMobileMenu">
          <img src="@/assets/icons/burger.svg" />
        </div>
      </div>
    </div>

    <div class="mobile_menu_shadow" :class="{ open }" @click="closeMobileMenu" />

    <div class="mobile_menu" :class="{ open }">
      <div class="content_wrap">
        <div class="header basic_container_global">
          <img class="logo" src="@/assets/icons/logo.svg" @click="$router.push('/')" />
          <ButtonIconGhost @click="closeMobileMenu">
            <img src="@/assets/icons/cross.svg" />
          </ButtonIconGhost>
        </div>

        <div class="scroll_part">
          <template v-if="isLogged">
            <HorizontalScroll class="mb_16" wide>
              <div class="bonus_block_wrapper basic_container_global">
                <BonusBlock withBorder />
              </div>
            </HorizontalScroll>
            <div class="basic_container_global">
              <UserAvailable class="user_available" />
              <div class="column_4 mb_16">
                <ButtonText @click="goTo('/')" color="grey"> <Icon name="home" /> Главная </ButtonText>
                <ButtonText @click="goTo('/tasks')" color="grey"><Icon name="schedule" />Расписание</ButtonText>
                <ButtonText @click="goTo('/finance')" color="grey"> <Icon name="wallet" />Финансы </ButtonText>
                <ButtonText @click="goTo('/promo')" color="grey"><Icon name="promo" />Акции</ButtonText>
                <ButtonText @click="goTo('/application')" color="grey"> <Icon name="phone" />Приложение </ButtonText>
                <ButtonText @click="goTo('/support')" color="grey"> <Icon name="support" />Поддержка </ButtonText>
                <ButtonText @click="goTo('/profile')" color="grey"> <Icon name="user" />Профиль </ButtonText>
                <ButtonText @click="goTo('/documents')" color="grey"> <Icon name="documentsFolder" />Документы RUQI </ButtonText>
              </div>
              <ButtonText class="last_button" @click="exit" color="grey"> <Icon name="arrowExit" />Выйти </ButtonText>
            </div>
          </template>
          <template v-else>
            <div class="basic_container_global">
              <div class="column_4 mb_16">
                <ButtonText @click="goTo('/support')" color="grey"> <Icon name="heart" />Поддержка </ButtonText>
              </div>
              <Button class="" @click="login">Войти </Button>
            </div>
          </template>
        </div>
        <!--</div>-->
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import UserNotifications from '@/components/organisms/UserNotifications'
import Region from '@/components/organisms/Region'
import UserAvailable from '@/components/page/profile/mainBlock/UserAvailable.vue'
import HorizontalScroll from '@/components/atoms/HorizontalScroll.vue'
import BonusBlock from '@/components/organisms/BonusBlock.vue'

export default {
  name: 'AppBar',
  components: {
    UserNotifications,
    Region,
    UserAvailable,
    HorizontalScroll,
    BonusBlock,
  },
  props: {
    setLayoutScroll: {
      type: Function,
      default: () => {},
    },
  },
  data: () => ({
    open: false,
  }),
  computed: {
    ...mapGetters('auth', ['isLogged']),
  },
  watch: {
    open (val) {
      // Эта функция нужна для мобильных браузеров, у которых из-за вертикального свайпа
      // может изменяться высота окна браузера за счёт скрытия верхнего или нижнего меню
      // из-за чего из под попапа меню торчит содержимое страницы на высоту скрытого меню браузера
      this.setLayoutScroll(!val)
    },
  },
  mounted () {},
  methods: {
    ...mapActions('auth', ['logOut']),

    openMobileMenu () {
      this.open = true
    },
    closeMobileMenu () {
      this.open = false
    },
    exit () {
      this.logOut()
      this.$router.push('/signin')
    },
    login () {
      this.$router.push('/signin')
    },
    goTo (link) {
      this.open = false
      this.$router.push(link)
    },
  },
}
</script>

<style lang="scss" scoped>
$barHeight: 60px;

.top_bar_mobile {
  display: none;
  gap: 12px;

  @media screen and (max-width: 1024px) {
    display: block;
  }
}
.top_bar {
  height: $barHeight;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  .logo {
    margin-right: 12px;
  }
}

.right_part {
  display: flex;
  gap: 10px;
  align-items: center;
  overflow: hidden;
}

.menu_button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 40px;
  cursor: pointer;
}

.mobile_menu {
  overflow: hidden;
  display: grid;
  grid-template-rows: 0fr;
  transition: all 300ms ease-in-out;
  opacity: 0;
  z-index: 100000;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  border-radius: 0 0 16px 16px;
  background: white;
  max-height: 90vh;
  .bonus_block_wrapper {
    width: 100%;
  }
  .content_wrap {
    overflow: hidden;
    min-height: 0px;
  }
  &.open {
    grid-template-rows: 1fr;
    opacity: 1;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: $barHeight;
    align-items: center;
    border-bottom: 1px solid #0000001a;
  }
  .scroll_part {
    overflow: auto;
    padding-top: 24px;
    padding-bottom: 24px;
    max-height: calc(100% - 60px);
  }
  .user_available {
    padding: 16px;
    border-radius: 16px;
    border: 1px solid #0000001a;
    margin-bottom: 16px;
  }
  :deep(.button_text) {
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .last_button {
    padding-top: 12px;
    border-top: 1px solid #0000001a;
  }
}

.mobile_menu_shadow {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
  height: 100%;
  width: 100%;
  transition: all 150ms ease-in-out;
  background: #d6d6d649;
  z-index: 299;
  opacity: 0.3;
  pointer-events: none;
  &.open {
    opacity: 1;
    backdrop-filter: blur(10px);
    pointer-events: all;
  }
}
</style>
