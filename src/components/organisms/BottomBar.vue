<template>
  <div class="mobile_bottom_bar">
    <div class="item" :class="{ active: isActive('/') }" @click="goTo('/')">
      <div class="icon home" />
      <div class="title">Главная</div>
    </div>
    <div class="item" :class="{ active: isActive('/tasks') }" @click="goTo('/tasks')">
      <div class="icon tasks" />
      <div class="title">Расписание</div>
    </div>
    <div class="item" :class="{ active: isActive('/finance') }" @click="goTo('/finance')">
      <div class="icon finances" />
      <div class="title">Финансы</div>
    </div>
    <div class="item" :class="{ active: isActive('/support') }" @click="goTo('/support')">
      <div class="icon support" />
      <div class="title">Поддержка</div>
    </div>
    <div class="item" :class="{ active: isActive('/profile') }" @click="goTo('/profile')">
      <div class="icon profile" />
      <div class="title">Профиль</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'BottomBar',
  computed: {
    ...mapGetters('user', ['user']),
  },
  methods: {
    goTo (path) {
      window.scroll({
        top: 0,
        behavior: 'smooth', // Плавный скролл
      })
      document.getElementById('default_layout').scrollTop = 0
      this.$router.push(path)
    },
    isActive (link) {
      if (this.$route.path === '/' && link === '/') {
        return true
      } else if (link !== '/') {
        return this.$route.path.includes(link)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.mobile_bottom_bar {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 200;
  display: flex;
  background: #ffffff;
  border-top: 0.5px solid #dadada;
}
.item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 9px 10px;
  gap: 2px;
  font-size: 11px;
  line-height: 20px;
  font-weight: 600;
  color: #666666;
  border-radius: 4px;
  overflow: hidden;
  img {
    height: 24px;
    width: 24px;
  }
  .icon {
    width: 24px;
    height: 24px;
    background: url('@/assets/sprites/menu.png') no-repeat;
    background-position-y: 0;
  }
  &.active {
    color: #1735f5;
    .icon {
      background-position-y: -24px;
    }
  }
  .home {
    background-position-x: 0;
  }
  .tasks {
    background-position-x: -24px;
  }
  .finances {
    background-position-x: -48px;
  }
  .support {
    background-position-x: -72px;
  }
  .profile {
    background-position-x: -96px;
  }
  .title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
