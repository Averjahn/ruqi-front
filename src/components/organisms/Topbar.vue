<template>
  <div class="topbar basic_container_global">
    <div class="left_part">
      <router-link :to="'/'">
        <img src="@/assets/icons/logo.svg" />
      </router-link>
      <div class="pages">
        <div
          v-for="(item, index) in pages"
          :key="index"
          :class="{ active: isActive(item.link) }"
          class="page"
          @click="goTo(item.link)"
        >
          {{ item.title }}
        </div>
      </div>
    </div>
    <div class="right_panel">
      <Region v-if="isLogged" />
      <UserNotifications v-if="isLogged" />
      <div class="balance_and_avatar">
        <UserMenu />
        <div v-if="isLogged" class="balance">
          <div class="balance_header">Баланс</div>
          <div class="balance_amount">{{ getDisplayedNumber(profile.bonus_amount || 0, 2) }} ₽</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserMenu from '@/components/organisms/userMenu'
import Region from '@/components/organisms/Region'
import UserNotifications from '@/components/organisms/UserNotifications'
import { getDisplayedNumber } from '@/constants/helpers'
import { mapGetters } from 'vuex'

export default {
  name: 'TopbarComponent',
  components: {
    Region,
    UserMenu,
    UserNotifications,
  },
  data () {
    return {
      pages: [
        {
          title: 'Главная',
          link: '/',
          auth: true,
        },
        {
          title: 'Расписание',
          link: '/tasks',
          auth: true,
        },
        {
          title: 'Финансы',
          link: '/finance',
          auth: true,
        },
        {
          title: 'Акции',
          link: '/promo',
          auth: true,
        },
        {
          title: 'Приложение',
          link: '/application',
          auth: false,
        },
        {
          title: 'Поддержка',
          link: '/support',
          auth: false,
        },
      ],
    }
  },
  computed: {
    ...mapGetters('auth', ['isLogged']),
    ...mapGetters('user', ['user']),
    ...mapGetters('profilePage', ['profile']),
  },
  methods: {
    getDisplayedNumber,
    isActive (link) {
      if (this.$route.path === '/' && link === '/') {
        return true
      } else if (link !== '/') {
        return this.$route.path.includes(link)
      }
    },
    goTo (path) {
      this.$router.push(path)
    },
  },
}
</script>

<style lang="scss" scoped>
.topbar {
  display: flex;
  gap: 20px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  z-index: 200;
  position: relative;
}
.balance_and_avatar {
  display: flex;
  align-items: center;
  gap: 8px;
}
.balance {
  .balance_header {
    font-weight: 400;
    font-size: 9px;
    line-height: 125%;
    color: #666666;
  }
  .balance_amount {
    font-weight: 600;
    font-size: 12px;
    line-height: 20px;
  }
}
.left_part {
  display: flex;
  align-items: center;
  gap: 60px;
}
.pages {
  color: #03123a;
  display: inline-flex;
  gap: 24px;
}
.page {
  cursor: pointer;
  border-bottom: 1px solid transparent;
  transition: all 200ms ease-in-out;
  &.active {
    font-weight: 600;
  }
  &:hover {
    border-bottom: 1px solid #03123a;
  }
}

.bread_crumbs {
  cursor: pointer;
  font-weight: 600;
}
.right_panel {
  display: flex;
  overflow: hidden;
  align-items: center;
  gap: 24px;
}
</style>
