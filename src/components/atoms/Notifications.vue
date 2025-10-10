<template>
  <div class="container">
    <div id="notificationContainer"></div>
    <div class="fake_bottom_bar">
      <div class="notification" :class="[notification.type, { visible: notification.isVisible }]" @click="onHide">
        {{ notification.text }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Notifications',
  props: ['requestSuccess'],
  data () {
    return {}
  },
  computed: {
    ...mapGetters('notifications', ['notification']),
  },
  methods: {
    onHide () {
      this.$store.commit('notifications/removeNotification')
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  pointer-events: none;
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 500;
}
#notificationContainer {
  pointer-events: all;
}

.fake_bottom_bar {
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: end;
}

.notification {
  display: none;
  min-height: 42px;
  box-sizing: border-box;
  padding: 12px 28px;
  color: white;
  background-color: #1735f5;
  pointer-events: all;
  z-index: 500;
  &.visible {
    display: block;
  }
  &.error {
    background-color: #eb4d3d;
  }
  &.success {
    background-color: #71d472;
  }
}
@media (max-width: 768px) {
  .fake_bottom_bar {
    min-height: 68px;
  }
}
</style>
