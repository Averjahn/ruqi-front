<template>
  <div class="chat">
    <div v-if="!isTicketClosed" class="close_button_container">
      <Button class="close_button" type="outlined" size="s" :loading="sendLoading" @click="$emit('closeTicket')">
        Закрыть обращение
      </Button>
    </div>

    <div ref="messagesBlock" class="messages_block scrollbar">
      <div class="message_absolute">
        <div class="messages_wrap">
          <Message
            v-for="(item, index) in messages"
            :key="item.id"
            :message="item"
            :participants="participants"
            :previousMessage="messages[index - 1]"
          />
        </div>
      </div>
    </div>

    <div class="action_block">
      <AttachedFilesGalleryMini
        v-if="attachedFiles.length"
        class="attached_gallery"
        :files="attachedFiles"
        @deleteFile="deleteAttachedFile"
      />
      <div class="action_footer">
        <Form ref="form" class="form">
          <Textarea v-model="message" height="40px" autoHeight maxHeight="170px">
            <template #left>
              <ButtonIconGhost @click="$emit('openAddFilesPopup')">
                <img src="@/assets/icons/attach.svg" />
              </ButtonIconGhost>
            </template>
          </Textarea>
        </Form>
        <ButtonIcon
          class="action_button_desktop"
          size="l"
          :loading="sendLoading"
          @click="$emit('send')"
          inline
          :disabled="isMessageEmpty"
        >
          <img src="@/assets/icons/arrow_send_right.svg" />
        </ButtonIcon>
        <Button
          class="action_button_mobile"
          :loading="sendLoading"
          @click="$emit('send')"
          inline
          :disabled="isMessageEmpty"
        >
          Отправить
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import Message from '@/components/organisms/Message.vue'
import AttachedFilesGalleryMini from '@/components/molecules/AttachedFilesGalleryMini.vue'

export default {
  name: 'Chat',
  emits: ['send', 'openAddFilesPopup', 'closeTicket', 'update:newMessage'],
  components: {
    Message,
    AttachedFilesGalleryMini,
  },
  props: {
    newMessage: {
      type: String,
      default: '',
    },
    participants: {
      type: Object,
      default: () => ({}),
    },
    messages: {
      type: Array,
      default: () => [],
    },
    attachedFiles: {
      type: Array,
      default: () => [],
    },
    isTicketClosed: {
      type: Boolean,
      default: true,
    },
    isMessageEmpty: {
      type: Boolean,
      default: true,
    },
    sendLoading: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {}
  },
  computed: {
    message: {
      get () {
        return this.newMessage
      },
      set (val) {
        this.$emit('update:newMessage', val)
      },
    },
  },
  mounted () {},
  unmounted () {},
  watch: {
    'messages.length': {
      handler (_, prev) {
        if (prev) this.$nextTick(this.smoothScrollMessagesToBottom)
        else this.$nextTick(this.scrollMessagesToBottom)
      },
      immediate: true,
    },
  },
  methods: {
    deleteAttachedFile (index) {
      this.$emit('deleteAttachedFile', index)
    },

    scrollMessagesToBottom () {
      const el = this.$refs.messagesBlock
      if (el) el.scrollTop = el.scrollHeight
    },

    smoothScrollMessagesToBottom () {
      const el = this.$refs.messagesBlock
      if (el)
        el.scrollTo({
          top: el.scrollHeight,
          behavior: 'smooth',
        })
    },
  },
}
</script>

<style lang="scss">
.chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  .action_block {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px;
    border-top: 1px solid #0000001a;
  }
  .action_footer {
    display: flex;
    align-items: flex-end;
    gap: 16px;
  }
  .form {
    flex: 1;
  }
  .messages_block {
    position: relative;
    flex: 1;
    overflow: auto;
  }
  .message_absolute {
    position: absolute;
    max-height: 100%;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .messages_wrap {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 24px;
    padding: 20px 24px;
  }
  .close_button_container {
    padding: 16px 24px;
    border-bottom: 1px solid #0000001a;
  }
  .close_button {
    width: 100%;
  }
  .action_button_mobile {
    display: none !important;
  }
  .action_button_desktop {
    display: block;
  }
  @media (max-width: 1000px) {
    .close_button_container {
      padding: 16px 32px;
    }
    .action_block {
      padding: 24px 32px;
    }
    .messages_wrap {
      padding: 20px 32px;
    }
  }
  @media (max-width: 768px) {
    .close_button_container {
      padding: 16px;
    }
    .action_block {
      padding: 16px 16px;
    }
    .messages_wrap {
      padding: 20px 16px;
    }
    .action_footer {
      flex-direction: column;
    }
    .form {
      width: 100%;
    }
    .action_button_mobile {
      display: flex !important;
      width: 100%;
    }
    .action_button_desktop {
      display: none;
    }
  }
}
</style>
