<template>
  <div v-if="!user?.telegram_id" class="telegram_notification" :class="[type, composition]">
    <img class="logo" src="@/assets/icon_deprecated/telegram_rounded.svg" />
    <div class="content_part">
      <div class="text_part">
        <div class="title">Привяжите Telegram-аккаунт</div>
        <div class="description">
          Удобное отслеживание заявок, уведомления о статусах заявки, уведомления об операциях и документах
        </div>
      </div>
      <div class="action_part">
        <ButtonText
          v-if="type === 'whiteContained'"
          type="s"
          color="telegram"
          :loading="telegramLoading"
          @click="connectTelegram"
        >
          Привязать
        </ButtonText>
        <Button v-else size="m" :background="buttonBackground" :loading="telegramLoading" @click="connectTelegram">
          Привязать
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import useTelegramConnect from '@/composables/useTelegramConnect'

export default {
  name: 'TelegramNotification',
  components: {},
  props: {
    type: {
      type: String,
      default: '', // white | whiteContained,
    },
    composition: {
      type: String,
      default: '', // vertical,
    },
  },
  setup () {
    const { telegramLoading, connectTelegram } = useTelegramConnect()
    return {
      telegramLoading,
      connectTelegram,
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    buttonBackground () {
      if (this.type === 'white') return '#26A3E1'
      if (this.type === 'whiteContained') return '#26A3E1'
      return 'rgba(255, 255, 255, 0.1)'
    },
  },
  beforeMount () {},
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.telegram_notification {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: #263043;
  border-radius: 12px;
  color: white;
  &.vertical {
    align-items: flex-start;
    .content_part {
      flex-direction: column;
      align-items: flex-start;
    }
  }
  &.white {
    background-color: white;
    color: #263043;
    border: 1px solid #0000001a;
  }
  &.whiteContained {
    background-color: white;
    color: #263043;
    border: none;
  }
  .content_part {
    flex: 1;
    display: flex;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
    row-gap: 12px;
    column-gap: 16px;
  }
  .text_part {
    flex: 1;
    min-width: 200px;
  }
  .title {
    font-size: 14px;
    font-weight: 700;
  }
  .description {
    font-size: 12px;
    line-height: 15px;
  }

  @media (max-width: 1000px) {
    gap: 12px;
    padding: 12px;

    .logo {
      align-self: flex-start;
    }
  }

  @media (max-width: 600px) {
    .content_part {
      flex-direction: column;
      gap: 8px;
    }
    .action_part {
      align-self: flex-start;
    }
  }
}
</style>
