<template>
  <div class="notification_item">
    <div v-if="unread" class="unread_tag">
      <div class="unread_dot" />
    </div>
    <div class="header">
      <div class="date">{{ date }}</div>
      <template v-if="!pageView && !isSurvey">
        <ButtonText v-if="unread" class="header_action" type="s" @click="$emit('setReadStatus', item)">
          <Icon :size="16" class="action_icon" name="mailCheckmark" />
          <div class="header_action_text">Прочитано</div>
        </ButtonText>
      </template>
    </div>
    <div class="title">{{ item.name }}</div>
    <div class="description" :class="{ shortView: !pageView }">{{ item.description }}</div>
    <div class="link">
      <ButtonText v-if="linkText" gap="4px" class="link-button" @click="$emit('clickToLink', item)">
        <div class="div">
          {{ linkText }}
        </div>
        <Icon :size="16" class="action_icon" name="paginationArrowRight" />
      </ButtonText>
      <template v-if="pageView && !isSurvey">
        <ButtonText v-if="unread" class="header_action" type="s" @click="$emit('setReadStatus', item)">
          <Icon :size="16" class="action_icon" name="mailCheckmark" />
          <div class="header_action_text">Прочитано</div>
        </ButtonText>
      </template>
    </div>
  </div>
</template>

<script>
import { USER_NOTIFICATIONS } from '@/constants/constants'

export default {
  name: 'UserNotificationItem',
  components: {},
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    pageView: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      list: null,
    }
  },
  computed: {
    isSurvey () {
      return this.item?.mailing_list?.type === 'survey'
    },
    linkText () {
      if (this.item?.type === 'mailing_app') {
        return USER_NOTIFICATIONS[this.item?.mailing_list?.type]?.linkText
      }
      return USER_NOTIFICATIONS[this.item?.type]?.linkText
    },
    unread () {
      return this.item.web_status !== 3
    },
    date () {
      const date = this.item.created_at
      return this.$dayjs(date).isValid() ? this.$dayjs(date).format('DD.MM.YYYY HH:mm') : '-'
    },
  },
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    open () {},
  },
}
</script>

<style lang="scss" scoped>
.notification_item {
  min-height: 150px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-bottom: 1px solid #dadada;
  padding: 24px;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  &:hover {
    background: #f2f8ff;
  }
  &.unread {
    border-left: 4px solid #80c0ef;
  }
  .title {
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
    text-align: left;
  }
  .unread_tag {
    position: absolute;
    right: 24px;
    top: 24px;
    display: flex;
    align-items: center;
    justify-content: center;

    box-sizing: border-box;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid rgba(23, 53, 245, 0.24);
    .unread_dot {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #1735f5;
    }
  }
  .header {
    display: flex;
    gap: 24px;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0.1px;
    text-align: left;
    color: #666666;
  }
  .description {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    text-align: left;
    color: #666666;
    &.shortView {
      display: -webkit-box;
      line-clamp: 3;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
  .link {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: nowrap;
    width: 100%;
    min-width: 0;
    
    // Стили для кнопки "Перейти"
    .link-button {
      display: flex !important;
      align-items: center !important;
      color: #1735F5 !important;
      font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif !important;
      font-weight: 400 !important;
      font-size: 16px !important;
      line-height: 22px !important;
      white-space: nowrap;
      flex-shrink: 0;
      cursor: pointer;
      
      :deep(*) {
        color: #1735F5 !important;
        font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif !important;
        font-weight: 400 !important;
        font-size: 16px !important;
        line-height: 22px !important;
        white-space: nowrap;
        flex-shrink: 0;
      }
      
      :deep(.slot) {
        display: flex !important;
        align-items: center !important;
        gap: 4px;
        white-space: nowrap;
        flex-shrink: 0;
      }
      
      :deep(.div) {
        display: inline !important;
        white-space: nowrap;
        flex-shrink: 0;
      }
      
      :deep(.action_icon) {
        flex-shrink: 0;
      }
    }
    
    .header_action {
      flex-shrink: 0;
      white-space: nowrap;
    }
  }

  .header_action {
    color: #666;
    display: flex;
    align-items: center;
    gap: 4px;
    .action_icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .header_action_text {
      text-decoration: none;
    }

    &:hover {
      color: #03123a;
    }
  }
}
</style>
