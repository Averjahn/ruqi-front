<template>
  <Popup v-model:show="isPopupOpen">
    <PopupContainer class="new_ticket_popup" title="Обращение в поддержку" @close="isPopupOpen = false">
      <Form ref="newTicketForm">
        <div class="field_row">
          <div class="field_col">
            <div class="label required_label">Тема обращения</div>
            <Input v-model="newTicket.title" :rules="[rules.required]" />
          </div>
        </div>
        <div class="field_row mb_8">
          <div class="field_col">
            <div class="label required_label">Опишите вашу проблему</div>
            <Textarea v-model="newTicket.message" :rules="[rules.required]" height="174px" />
          </div>
        </div>
        <AttachedFiles v-model:files="files" class="attached_files" @deleteFile="deleteFile" />
      </Form>

      <template v-slot:footer>
        <div class="action_block">
          <Button :loading="loadingNewTicket" :disabled="loadingNewTicket" @click="isPopupOpen = false" type="outlined">
            Отмена
          </Button>
          <Button :loading="loadingNewTicket" :disabled="loadingNewTicket" @click="sendTicket">Отправить</Button>
        </div>
      </template>
    </PopupContainer>
  </Popup>

  <div class="support_page basic_container_global">
    <div class="banner">
      <div class="content">
        <div class="header">
          <img src="@/assets/icons/logo_white.svg" />
          База знаний и служба поддержки
        </div>
        <div class="sub_header">Чем мы можем вам помочь?</div>
        <div class="actions">
          <Input v-if="isLogged" v-model="search" placeholder="Поиск" class="input" clearable @input="onSearch">
            <template #left>
              <img src="@/assets/icons/magnifier.svg" />
            </template>
          </Input>
          <Button v-if="isLogged" class="create_button" @click="isPopupOpen = true"> Создать обращение </Button>
        </div>
      </div>
      <img class="background" src="@/assets/icons/u_letter.svg" />
    </div>

    <Tabs v-if="isLogged" class="mb_32" :tabs="tabs" v-model="activeTab" type="contained" />

    <Window :activeTab="activeTab">
      <template #faqs>
        <FaqList v-if="isListView" :faqs="faqs" />
        <template v-else>
          <FaqAccordion class="faq_accordion" :faqs="faqs" />
          <FaqSections class="faq_section" :faqs="faqs" />
        </template>
      </template>

      <template #tickets>
        <div v-if="tickets.length" class="ticket_wrap">
          <Ticket v-for="item in tickets" :key="item.id" :item="item" />
        </div>
        <div v-if="!loading && !tickets.length" class="no_items_block">
          <img src="@/assets/icons/paper_plus.svg" class="mb_16" />
          <div class="title">Обращений пока нет</div>
          <div class="mb_24">Нажмите на кнопку, чтобы создать обращение в поддержку</div>
          <Button v-if="!search" @click="isPopupOpen = true" inline> Создать обращение </Button>
        </div>
      </template>
    </Window>
  </div>
</template>

<script>
import PopupContainer from '@/components/atoms/PopupContainer.vue'
import Ticket from '@/components/organisms/Ticket.vue'
import AttachedFiles from '@/components/organisms/AttachedFiles.vue'
import FaqSections from '@/components/organisms/FaqSections.vue'
import FaqList from '@/components/organisms/FaqList.vue'
import { rules } from '@/constants/validations'
import { mapActions, mapGetters } from 'vuex'
import { getAPIError } from '@/constants/helpers'
import { debounce } from '@/constants/helpers'
import axios from 'axios'
import FaqAccordion from '@/components/organisms/FaqAccordion.vue'
import useGlobalLoading from '@/composables/useGlobalLoading'

const initialTicket = {
  title: '',
  message: '',
}

let ticketsController = new AbortController()
let faqsController = new AbortController()

export default {
  name: 'support',
  components: { PopupContainer, Ticket, AttachedFiles, FaqSections, FaqList, FaqAccordion },
  props: {
    options: {
      type: Array,
      default: () => [],
    },
  },
  setup () {
    const { startLoading, stopLoading, loading } = useGlobalLoading()
    return { startLoading, stopLoading, loading }
  },
  data () {
    return {
      rules,
      search: '',
      isPopupOpen: false,
      tickets: [],
      faqs: [],
      files: [],
      isListView: false,
      loadingNewTicket: false,
      newTicket: JSON.parse(JSON.stringify(initialTicket)),
      activeTab: null,
      tabs: [
        { value: 'faqs', text: 'База знаний RUQI' },
        { value: 'tickets', text: 'Мои обращения' },
      ],
    }
  },
  computed: {
    ...mapGetters('auth', ['isLogged']),
  },
  mounted () {
    this.activeTab = this.$route.query?.tab || 'faqs'
    if (!this.isLogged) this.activeTab = 'faqs'
  },
  unmounted () {},
  watch: {
    activeTab (value) {
      this.search = ''
      this.tickets = []
      this.faqs = []
      this.$router.push({ query: { tab: value } })
      if (value === 'faqs') this.fetchFaqs()
      if (value === 'tickets') this.fetchTickets()
    },
  },
  methods: {
    ...mapActions('notifications', ['showNotification']),

    debounceTickets: debounce(async function () {
      this.fetchTickets()
    }, 700),

    debounceFaqs: debounce(function () {
      this.fetchFaqs()
    }, 700),

    onSearch () {
      if (this.activeTab === 'faqs') this.debounceFaqs()
      if (this.activeTab === 'tickets') this.debounceTickets()
    },

    deleteFile (index) {
      this.files.splice(index, 1)
    },

    async fetchTickets () {
      this.startLoading()
      ticketsController.abort()
      ticketsController = new AbortController()
      const response = await this.$axios.get('v2/user/ticket/list', {
        signal: ticketsController.signal,
        params: {
          search: this.search,
        },
      })
      if (response?.data?.success) {
        this.tickets = response?.data?.data
      } else if (!axios.isCancel(response)) {
        this.showNotification({
          type: 'error',
          text: getAPIError(response) || 'Не удалось загрузить список обращений',
        })
      }
      this.stopLoading()
    },

    async fetchFaqs () {
      this.startLoading()
      faqsController.abort()
      faqsController = new AbortController()
      const search = this.search
      const url = this.isLogged ? 'v2/faq/articles' : 'v2/faq/faqInfo'
      const response = await this.$axios.get(url, {
        signal: faqsController.signal,
        params: { search },
      })
      if (response?.data?.success) {
        this.faqs = response.data.data
        this.isListView = !!search
      } else if (!axios.isCancel(response)) {
        this.showNotification({
          type: 'error',
          text: getAPIError(response) || 'Не удалось загрузить список обращений',
        })
      }
      this.stopLoading()
    },

    async sendTicket () {
      if (!this.$refs.newTicketForm.validate()) return
      if (this.loadingNewTicket) return
      this.loadingNewTicket = true
      const formData = new FormData()
      this.files.forEach((file) => {
        formData.append('files[]', file)
      })
      formData.append('message', this.newTicket.message)
      formData.append('title', this.newTicket.title)
      const response = await this.$axios.post('v2/user/ticket/message/new', formData)
      if (response?.data?.success) {
        this.isPopupOpen = false
        this.newTicket = JSON.parse(JSON.stringify(initialTicket))
        this.search = ''
        this.fetchTickets()
      } else {
        this.showNotification({
          type: 'error',
          text: getAPIError(response) || 'Ошибка при сохранении обращения',
        })
      }
      this.loadingNewTicket = false
    },
  },
}
</script>

<style lang="scss" scoped>
.support_page {
  padding-top: 32px;
  padding-bottom: 36px;
  .banner {
    display: flex;
    align-items: center;
    position: relative;
    height: 320px;
    border-radius: 16px;
    background-color: #03123a;
    color: white;
    padding: 51px;
    margin-bottom: 32px;
    .content {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: 18px;
      z-index: 1;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 24px;
      font-weight: 600;
    }
    .sub_header {
      font-size: 32px;
      line-height: 40px;
      font-weight: 600;
    }
    .actions {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 19px;
    }
    .input {
      width: 100%;
      max-width: 550px;
    }
    .background {
      position: absolute;
      right: 23px;
      top: -10px;
      z-index: 0;
    }
  }
  .create_button {
    height: 48px;
    min-width: 220px;
  }
  .no_items_block {
    text-align: center;
    padding: 32px 0;
    font-size: 20px;
    line-height: 25px;
    color: #666666;
    .title {
      color: #000000;
      margin-bottom: 12px;
    }
  }
  .ticket_wrap {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .faq_accordion {
    display: none;
  }
  .faq_section {
    display: grid;
  }
  @media (max-width: 1000px) {
    padding-bottom: 100px;
    padding-top: 24px;
    .faq_accordion {
      display: block;
    }
    .faq_section {
      display: none;
    }
    .banner {
      padding: 24px;
      height: min-content;
      margin-bottom: 24px;
      .input {
        max-width: 100%;
      }
      .header {
        font-size: 16px;
        line-height: 20px;
      }
      .sub_header {
        font-size: 24px;
        line-height: 30px;
      }
    }
    .create_button {
      width: 100%;
    }
  }

  @media (max-width: 600px) {
    .banner {
      .background {
        width: 200px;
        right: -7px;
        top: -18px;
      }
    }
  }
}

.new_ticket_popup {
  .field_row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .field_col {
    flex: 1;
    margin-bottom: 24px;
  }
  .label {
    color: #707070;
    font-size: 14px;
    margin-bottom: 4px;
  }
  .action_block {
    display: flex;
    gap: 16px;
    & > div {
      flex: 1;
    }
  }
  textarea {
    height: 200px;
  }
  .attached_files {
    margin-bottom: 24px;
  }
}
</style>
