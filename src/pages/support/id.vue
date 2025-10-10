<template>
  <Modal v-model:show="isModalOpen" @confirm="fetchCloseTicket" title="Вы уверены, что хотите закрыть обращение?" />

  <Popup v-model:show="isAddFilesPopupOpen">
    <PopupContainer
      class="add_files_popup"
      title="Загрузить файлы"
      maxWidth="560px"
      @close="isAddFilesPopupOpen = false"
    >
      <Form ref="addFilesPopupForm">
        <AttachedFiles v-model:files="files" class="mb_24" @deleteFile="deleteFile" />
      </Form>
      <template v-slot:footer>
        <div class="action_block">
          <Button type="outlined" @click="isAddFilesPopupOpen = false">Отмена</Button>
          <Button @click="attachFiles">Прикрепить</Button>
        </div>
      </template>
    </PopupContainer>
  </Popup>

  <div class="ticket_page">
    <div class="back_button_block">
      <ButtonText
        class="back_button basic_container_global"
        color="grey"
        type="s"
        @click="$router.push('/support?tab=tickets')"
      >
        <Icon class="back_icon" name="arrowUp" :size="20" /> Поддержка
      </ButtonText>
    </div>

    <div class="basic_container_global">
      <div v-if="!loading" class="ticket_container_desktop">
        <div class="left_part">
          <div class="ticket_header fs_24 fw_600">
            <img src="@/assets/icons/logo_dark.svg" />
            Служба поддержки
          </div>
          <Chat
            v-model:newMessage="newMessage"
            :isTicketClosed="isTicketClosed"
            :isMessageEmpty="isMessageEmpty"
            :sendLoading="sendLoading"
            :attachedFiles="attachedFiles"
            :messages="messages"
            :participants="participants"
            @openAddFilesPopup="isAddFilesPopupOpen = true"
            @deleteAttachedFile="deleteAttachedFile"
            @closeTicket="closeTicket"
            @send="send"
          />
        </div>

        <div class="right_part">
          <div class="ticket_header fs_20 fw_600">№{{ ticket.id }}<TicketStatus :status="ticket.status" /></div>
          <Info class="info_desktop" :ticket="ticket" :messages="messages" />
        </div>
      </div>
    </div>

    <div v-if="!loading" class="ticket_container_mobile">
      <div class="mobile_header_block basic_container_global">
        <div class="ticket_header_mobile">
          <div class="fw_600">№{{ ticket.id }}</div>
          <TicketStatus :status="ticket.status" />
        </div>
        <Tabs :value="activeTab" :tabs="tabs" @change="changeTab" type="flat" />
      </div>

      <Window class="window" :activeTab="activeTab">
        <template #chat>
          <Chat
            v-model:newMessage="newMessage"
            :isTicketClosed="isTicketClosed"
            :isMessageEmpty="isMessageEmpty"
            :sendLoading="sendLoading"
            :attachedFiles="attachedFiles"
            :messages="messages"
            :participants="participants"
            @openAddFilesPopup="isAddFilesPopupOpen = true"
            @deleteAttachedFile="deleteAttachedFile"
            @closeTicket="closeTicket"
            @send="send"
          />
        </template>
        <template #info>
          <div class="mobile_info">
            <Info class="basic_container_global" :ticket="ticket" :messages="messages" />
          </div>
        </template>
      </Window>
    </div>
    <ThinLineLoading class="thin_loading" :show="loading" />
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { getAPIError } from '@/constants/helpers'
import TicketStatus from '@/components/molecules/statuses/TicketStatus.vue'
import Modal from '@/components/organisms/popups/Modal.vue'
import { rules } from '@/constants/validations'
import PopupContainer from '@/components/atoms/PopupContainer.vue'
import AttachedFiles from '@/components/organisms/AttachedFiles.vue'
import Chat from '@/components/page/support/Chat.vue'
import Info from '@/components/page/support/Info'

export default {
  components: {
    TicketStatus,
    Modal,
    PopupContainer,
    AttachedFiles,
    Chat,
    Info,
  },
  data () {
    return {
      rules,
      tabs: [
        { text: 'Чат', value: 'chat' },
        { text: 'Информация', value: 'info' },
      ],
      activeTab: 'chat',
      messages: [],
      participants: {},
      ticket: {},
      files: [],
      attachedFiles: [],
      newMessage: '',
      loading: false,
      isModalOpen: false,
      isAddFilesPopupOpen: false,
      sendLoading: false,
    }
  },
  computed: {
    isTicketClosed () {
      return this.ticket.status === 'closed_by_contractor' || this.ticket.status === 'closed_by_support'
    },
    isMessageEmpty () {
      return !this.newMessage && !this.attachedFiles.length
    },
  },
  mounted () {
    this.fetchTicket()
  },
  methods: {
    ...mapActions('notifications', ['showNotification']),

    changeTab (tab) {
      this.activeTab = tab
    },

    deleteFile (index) {
      this.files.splice(index, 1)
    },

    deleteAttachedFile (index) {
      this.attachedFiles.splice(index, 1)
    },

    async fetchTicket () {
      this.loading = true
      const response = await this.$axios.get('v2/user/ticket', {
        params: {
          ticket_id: this.$route.params.id,
        },
      })
      if (response?.data?.success) {
        this.messages = response.data.data?.messages || []
        this.participants = response.data.data?.participants || {}
        this.ticket = response.data.data?.ticket || {}
      } else {
        this.showNotification({
          type: 'error',
          text: getAPIError(response) || 'Не удалось загрузить данные обращения',
        })
      }
      this.loading = false
    },

    async send () {
      if (this.sendLoading || this.isMessageEmpty) return
      this.sendLoading = true

      const formData = new FormData()
      this.attachedFiles.forEach((file) => {
        formData.append('files[]', file)
      })
      formData.append('message', this.newMessage)
      formData.append('ticket_id', this.$route.params.id)
      const response = await this.$axios.post('v2/user/ticket/message', formData)
      if (response?.data?.success) {
        this.newMessage = ''
        this.messages = response.data.data?.messages || []
        this.ticket = response.data.data?.ticket || {}
        this.files = []
        this.attachedFiles = []
      } else {
        this.showNotification({
          type: 'error',
          text: getAPIError(response) || 'Не удалось отправить сообщение',
        })
      }
      this.sendLoading = false
    },

    closeTicket () {
      this.isModalOpen = true
    },

    attachFiles () {
      if (!this.$refs.addFilesPopupForm.validate()) return
      this.files.forEach((file) => this.attachedFiles.push(file))
      this.files = []
      this.isAddFilesPopupOpen = false
    },

    async fetchCloseTicket () {
      this.isModalOpen = false
      if (this.sendLoading) return
      this.sendLoading = true
      const response = await this.$axios.post('v2/user/ticket', {
        ticket_id: this.$route.params.id,
      })
      if (response?.data?.success) {
        this.ticket = response.data.data?.ticket || {}
      } else {
        this.showNotification({
          type: 'error',
          text: getAPIError(response) || 'Не удалось закрыть обращение',
        })
      }
      this.sendLoading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.add_files_popup {
  .action_block {
    display: flex;
    align-items: center;
    gap: 16px;
    > div {
      flex: 1;
    }
  }
}
.ticket_page {
  height: 100%;

  .ticket_container_desktop {
    display: flex;
    height: calc(100vh - 160px);
    border-radius: 16px;
    box-shadow:
      0px 4px 20px 5px #1735f50a,
      0px -1px 4px 0px #1735f508;
  }
  .left_part {
    flex: 1;
    min-width: 49%;
    display: flex;
    flex-direction: column;
  }
  .right_part {
    flex: 1;
    min-width: 49%;
    border-left: 1px solid #0000001a;
  }
  .ticket_header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    height: 80px;
    min-height: 80px;
    padding: 0 24px;
    border-bottom: 1px solid #0000001a;
  }
  .info_desktop {
    padding: 24px;
  }

  .back_button_block {
    padding: 24px 0;
  }

  .back_icon {
    transform: rotate(-90deg);
  }

  .ticket_container_mobile {
    display: none;
    height: 100%;
  }
  .ticket_header_mobile {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .mobile_header_block {
    width: 100%;
    padding-top: 24px;
    border-top: 1px solid #0000001a;
    border-bottom: 1px solid #0000001a;
  }
  .mobile_info {
    padding-top: 24px;
    padding-bottom: 24px;
    overflow: auto;
    height: 100%;
  }
  .thin_loading {
    position: absolute;
    bottom: 0;
    width: initial;
    right: 0;
    left: 0;
  }

  @media (max-width: 1000px) {
    height: calc(100% - 65px);
    .ticket_container_desktop {
      display: none;
    }
    .ticket_container_mobile {
      display: flex;
      flex-direction: column;
      height: calc(100% - 40px);
    }
    .window {
      flex: 1;
      overflow: hidden;
      :deep(.tab_content) {
        height: 100%;
      }
    }
    .window :deep(.tab-content) {
      height: 100%;
    }
    .back_button_block {
      padding: 8px 0;
    }
  }
}
</style>
