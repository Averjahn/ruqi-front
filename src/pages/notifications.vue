<template>
  <div class="basic_container_global">
    <div class="notification_page_menu">
      <div class="notification_page_title">
        <div class="title_content">
          <div class="title_text">Уведомления</div>
          <div v-if="notificationsCounter" class="counter_view">{{ notificationsCounter }}</div>
        </div>
        <ButtonText size="s" v-if="notificationsCounter" @click="setAllReadStatus" class="title_action mark_read_btn">
          <Icon name="doneAll" />
          <div>Прочитать все</div>
        </ButtonText>
      </div>
      <div v-if="userNotifications.length || loading" class="notifications_content">
        <div class="notification_page_block scrollbar">
          <UserNotificationItem
            v-for="item in userNotifications"
            :item="item"
            pageView
            :key="item.id"
            @clickToLink="clickToLink"
            @setReadStatus="setReadStatus"
          />
          <ThinLineLoading class="thin_loading" :show="loading" />
        </div>
        <div v-if="!!totalPages" class="footer_actions">
          <Pagination
            :totalPages="totalPages"
            :currentPage="currentPage"
            :isAdaptive="isAdaptive"
            @page-change="handlePageChange"
          />
        </div>
      </div>
      <div v-else class="empty_notify">Пока уведомлений нет</div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Pagination from '@/components/atoms/Pagination'
import UserNotificationItem from '@/components/molecules/UserNotificationItem'
import useUserNotifications from '@/composables/useUserNotifications'
import ThinLineLoading from '@/components/atoms/loaders/ThinLineLoading.vue'

export default {
  components: { UserNotificationItem, Pagination, ThinLineLoading },
  setup () {
    const {
      loading,
      sendReadStatus,
      sendReadStatusAll,
      fetchUserNotifications,
      userNotifications,
      navigateTo,
      totalPages,
      loadPage,
    } = useUserNotifications({
      needUpdateDocumentsStatuses: true,
    })

    return {
      loading,
      fetchUserNotifications,
      userNotifications,
      navigateTo,
      sendReadStatus,
      sendReadStatusAll,
      totalPages,
      loadPage,
    }
  },
  data () {
    return {
      currentPage: 1,
    }
  },
  computed: {
    ...mapGetters('user', ['notificationsCount']),
    isAdaptive () {
      return window.innerWidth <= 768
    },
    badgeColor () {
      if (this.notificationsCount.all > 0) return 'pink'
      return 'transparent'
    },
    notificationsCounter () {
      return this.notificationsCount.all
    },
  },
  async mounted () {
    this.fetchUserNotifications()
  },
  methods: {
    ...mapActions('user', ['fetchNotificationsCount']),
    clickToLink (item) {
      this.navigateTo(item)
    },
    handlePageChange (page) {
      const success = this.loadPage(page)
      if (success) this.currentPage = page
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

<style scoped lang="scss">
.notification_page_menu {
  padding: 16px 50px 24px 50px;
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 24px;

  font-size: 16px;
  font-weight: 600;
  width: calc(100vw - 24px);
  max-width: 820px;
  overflow: hidden;
  @media (max-width: 768px) {
    padding: 16px 8px;
  }
}
.notification_page_title {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  .title_content {
    display: flex;
    gap: 4px;
    align-items: center;
    .title_text {
      font-size: 32px;
      font-weight: 600;
      line-height: 44px;
      text-align: left;
      @media (max-width: 768px) {
        font-size: 24px;
        line-height: 30px;
      }
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
}
.title_action {
  display: flex;
  align-items: center;
}
.footer_actions {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 16px 24px;
}
.notifications_content {
  width: 100%;
  background-color: #fff;
  box-shadow:
    0px 8px 48px 4px rgba(2, 52, 227, 0.04),
    0px 0px 10px 0px rgba(23, 53, 245, 0.03);
  border-radius: 16px;
}
.notification_page_block {
  height: calc(100dvh - 250px);
  @media (max-width: 999px) {
    height: calc(100dvh - 280px);
  }
  overflow-y: auto;
  overflow-x: hidden;
}
.empty_notify {
  text-align: center;
  color: #7a91a9;
  padding: 12px 0;
}
</style>
