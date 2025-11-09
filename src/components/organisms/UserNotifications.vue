<template>
  <Menu v-model="isOpen" horizontalAlign="rightBorder" :offsetY="20">
    <template #activator>
      <Badge color="pink" :badgeData="notificationsCounter" class="notification_badge">
        <ButtonIconGhost>
          <img src="@/assets/icons/alert_bell.svg" />
        </ButtonIconGhost>
      </Badge>
    </template>

    <div class="notification_menu">
      <div class="notification_title">
        <div class="title_content">
          <div class="title_text">Уведомления</div>
          <div v-if="notificationsCounter" class="counter_view">{{ notificationsCounter }}</div>
        </div>
        <ButtonText size="s" v-if="notificationsCounter" @click="setAllReadStatus" class="title_action mark_read_btn">
          <img src="@/assets/icons/FAQ/done_all.svg" alt="Прочитать всё" />
          <div>Прочитать всё</div>
        </ButtonText>
      </div>

      <div v-if="userNotifications.length || loading" class="notification_block scrollbar">
        <UserNotificationItem
          v-for="item in userNotifications"
          :item="item"
          :key="item.id"
          @clickToLink="clickToLink"
          @setReadStatus="setReadStatus"
        />
        <LazyLoad ref="lazyLoad" :callBack="loadMore" />
      </div>
      <div v-else class="empty_notify">Пока уведомлений нет</div>
      <div class="footer_actions">
        <ButtonText @click="showAllNotifications">Показать всё</ButtonText>
      </div>
      <ThinLineLoading class="thin_loading" :show="loading" />
    </div>
  </Menu>
</template>

<script>
import UserNotificationItem from '@/components/molecules/UserNotificationItem.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import useUserNotifications from '@/composables/useUserNotifications'
import { safePing } from '@/constants/helpers'
import ThinLineLoading from '../atoms/loaders/ThinLineLoading.vue'

export default {
  name: 'UserNotifications',
  components: { UserNotificationItem, ThinLineLoading },
  props: {
    isMobile: {
      type: Boolean,
      default: false,
    },
  },
  setup () {
    const {
      loading,
      sendReadStatus,
      sendReadStatusAll,
      fetchUserNotifications,
      userNotifications,
      loadMore,
      navigateTo,
    } = useUserNotifications({
      needUpdateDocumentsStatuses: true,
    })

    return {
      loading,
      fetchUserNotifications,
      userNotifications,
      loadMore,
      navigateTo,
      sendReadStatus,
      sendReadStatusAll,
    }
  },
  data () {
    return {
      isOpen: false,
      intervalId: null,
    }
  },
  computed: {
    ...mapGetters('user', ['notificationsCount']),
    notificationsCounter () {
      return this.notificationsCount.all
    },
  },
  mounted () {
    this.intervalId = safePing({
      fetch: this.notificationsFetch,
      handler: this.notificationsHandler,
      intervalSec: 9 * 60,
      localStorId: 'userNotificationPing',
    })
  },
  unmounted () {
    clearInterval(this.intervalId)
  },
  watch: {
    isOpen (val) {
      if (val) {
        this.fetchNotificationsCount()
        this.fetchUserNotifications()
      }
    },
  },
  methods: {
    ...mapActions('user', ['fetchNotificationsCount']),
    ...mapMutations('user', ['setNotificationsCount']),

    showAllNotifications () {
      this.isOpen = false
      this.$router.push('/ui-new/notifications')
    },

    clickToLink (item) {
      this.isOpen = false
      this.navigateTo(item)
    },
    async notificationsFetch () {
      // ВРЕМЕННО ОТКЛЮЧЕНО: запрос к API уведомлений
      // return await this.$axios.get('v2/user/notification/getcount', {
      //   errorMessage: 'Ошибка при получении количества непрочитанных уведомлений',
      // })
      
      // Возвращаем пустой ответ, чтобы не было запроса
      return Promise.resolve({ data: { success: false } })
    },
    async notificationsHandler (response) {
      if (response?.data?.success) this.setNotificationsCount(response.data.data)
    },
    async setAllReadStatus () {
      await this.sendReadStatusAll()
      this.fetchNotificationsCount()
    },
    async setReadStatus (item) {
      await this.sendReadStatus([item.id])
      this.fetchNotificationsCount()
    },
  },
}
</script>

<style lang="scss" scoped>
.notification_menu {
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #fff;
  box-shadow:
    0px 8px 48px 4px rgba(0, 0, 0, 0.1),
    0px 0px 10px 0px rgba(23, 53, 245, 0.03);
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  width: calc(100dvw - 24px);
  max-height: calc(100dvh - 135px);
  max-width: 480px;
  overflow: hidden;
}
.notification_title {
  border-bottom: 1px solid #0000001a;
  display: flex;
  width: 100%;
  gap: 24px;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  .title_content {
    display: flex;
    gap: 4px;
    align-items: center;
    .title_text {
      font-size: 20px;
      font-weight: 600;
      line-height: 28px;
      text-align: left;
    }
    .counter_view {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #ea358c;
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      letter-spacing: 0.1px;
      vertical-align: middle;
      text-align: center;
      color: #ffffff;
    }
  }
  .title_action {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #1735F5;
    
    div {
      color: #1735F5;
    }
    
    img {
      width: 20px;
      height: 20px;
    }
  }
}
.notification_badge {
  cursor: pointer;
}
.footer_actions {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 16px 24px;
}
.notification_block {
  max-height: calc(100vh - 320px);
  overflow-y: auto;
  overflow-x: hidden;
}
.empty_notify {
  text-align: center;
  color: #7a91a9;
  padding: 12px 0;
}
</style>
