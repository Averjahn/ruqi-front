<template>
  <div class="contractor-finances basic_container_global">
    <h1 class="contractor-finances__title">Мои финансы</h1>

    <Balance v-if="balances.loaded" class="contractor-finances__balance" :balance="balances" />

    <Tabs class="contractor-finances__tabs" :value="activeTab" :tabs="tabs" @change="changeTab" type="flat" />

    <!--     <div class="act_container act_container_header">
      <div class="act_icon"></div>
      <div class="act_name">наименование</div>
      <div class="act_period">Период работ</div>
      <div class="act_created">сформирован</div>
      <div class="act_signed">подписан</div>
      <div class="act_sum">начислено</div>
      <div class="pay_status">статус оплаты</div>
      <div class="act_signed_action"></div>
    </div> -->

    <div class="finance_list">
      <TasksList
        :is-row="true"
        :tasks="tasks"
        :loading="loading"
        item-key="uuid"
        hide-default-footer
        disable-pagination
        :show-actions="false"
        :show-lables="false"
        class="mb_48"
      />
      <!-- <ActItem v-for="item in acts" :key="item.id" :item="item" @addToPending="addToPending" /> -->
      <LazyLoad ref="lazyLoad" :callBack="loadMore" />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Balance from '@/components/page/finance/Balance'
// import ActItem from '@/components/organisms/ActItem'
import { getDisplayedNumber, getAPIError } from '@/constants/helpers'
import TasksList from '@/components/page/contractorTasks/TasksList.vue'
import useGlobalLoading from '@/composables/useGlobalLoading'

const taskUrls = {
  waiting: 'v2/user/acts/wait',
  paid: 'v2/user/acts/paid',
}

export default {
  components: {
    Balance,
    TasksList,
    // ActItem,
  },
  setup () {
    const { startLoading, stopLoading, loading } = useGlobalLoading()
    return { startLoading, stopLoading, loading }
  },
  data () {
    return {
      busy: false,
      acts: [],
      tasks: [],
      taskUrl: null,
      activeTab: null,
      isLastPage: false,

      // tabs: [
      //   { text: 'Все акты', value: 'all' },
      //   { text: 'Нужно подписать', value: 'not_signed' },
      //   { text: 'Подписаны', value: 'signed' },
      // ],
      balances: {
        loaded: false,
        balance: 0,
        tasks: 0,
        wait_confirm: 0,
        bonus: 0,
      },
      tasksFetchParams: {
        page: 1,
        per_page: 10,
        sort: null,
        order: null,
        search: null,
        filters: null,
      },
      fetchParams: {
        section: 'all',
        page: 0,
        per_page: 10,
        sort: null,
        order: null,
        search: null,
      },
      headers: [
        { text: '', value: 'status' },
        { text: 'наименование', align: 'start', value: 'purpose_text' },
        { text: 'период работ', value: 'task_start_date' },
        { text: 'сформирован', value: 'created_at' },
        { text: 'подписан', value: 'contractor_signed_at' },
        { text: 'начислено', value: 'sum_accrual' },
        { text: 'статус оплаты', value: 'pay_status' },
      ],
      formValues: [],
      counter: 0,
      timerId: null,
      actsInPending: [],
    }
  },

  computed: {
    tabs () {
      return [
        { text: `Ждут оплаты ${this?.balances?.count_tasks_on_payment ?? ''}`, value: 'waiting' },
        { text: `Оплаченные ${this?.balances?.count_tasks ?? ''}`, value: 'paid' },
      ]
    },
  },
  watch: {
    activeTab (tab) {
      this.taskUrl = taskUrls[tab]
      this.tasksFetchParams.page = 1
      this.fetchEndedTasks()
    },
    // actsInPending: {
    //   handler (val) {
    //     if (val.length) {
    //       if (!this.timerId) this.repeatWithInterval(this.fetchSignatureStatus, 3, 3000)
    //       this.counter = 0
    //     } else {
    //       this.finishPulling()
    //     }
    //   },
    //   deep: true,
    // },
  },

  async created () {
    // const type = this.$route.query.type || 'all'
    // this.fetchParams.section = type
    // this.activeTab = type
    // this.loadGrid(false)
    this.activeTab = this.$route.query.tab || 'waiting'

    this.loadBalance()
  },

  async mounted () {
    this.fetchCertificates()
  },

  unmounted () {
    clearInterval(this.timerId)
  },

  methods: {
    getDisplayedNumber,
    ...mapActions('profilePage', ['fetchCertificates']),
    ...mapActions('finances', ['fetchActs', 'fetchBalances']),
    ...mapActions('notifications', ['showNotification']),

    finishPulling (isExceedingAttempt) {
      clearInterval(this.timerId)
      this.timerId = null
      this.counter = 0
      if (isExceedingAttempt) {
        this.actsInPending = []
        this.acts.forEach((act) => {
          if (act.sign_status === 'pending') act.sign_status = 'attempt_exceed'
        })
        this.showNotification({
          type: 'info',
          text: 'Акты в процессе подписания, попробуйте обновить через несколько минут',
        })
      }
    },

    repeatWithInterval (func, count, interval) {
      const self = this
      this.timerId = setInterval(function () {
        self.counter++
        if (self.counter > count) {
          self.finishPulling(true)
        } else {
          func()
        }
      }, interval)
    },

    async loadBalance () {
      const response = await this.fetchBalances()
      if (response?.data?.success) {
        this.balances = response.data.data
        this.balances.loaded = true
      } else {
        this.showNotification({
          type: 'error',
          text: getAPIError(response) || 'Не удалось загрузить баланс',
        })
      }
    },

    addToPending (id) {
      this.acts.forEach((act) => {
        if (act.id === id) act.sign_status = 'pending'
      })
      this.actsInPending.push(id)
    },

    async fetchSignatureStatus () {
      const response = await this.$axios.get('v2/user/acts/signaturestatus', {
        params: {
          act_ids: this.actsInPending,
        },
      })

      if (response?.data?.success) {
        const statuses = response.data?.data
        this.acts.forEach((item) => {
          if (statuses[item.id] === 'signed') {
            item.sign_status = 'contractor_signed'
            item.status = 'contractor_signed'
            this.actsInPending = this.actsInPending.filter((id) => id !== item.id)
          }
        })
      } else {
        this.finishPulling()
        this.showNotification({
          type: 'error',
          text: getAPIError(response) || 'Не удалось получить статусы актов',
        })
      }
    },
    async fetchEndedTasks () {
      let success = false
      this.startLoading()
      const response = await this.$axios.get(this.taskUrl, {
        params: this.tasksFetchParams,
      })

      if (response?.data?.success) {
        this.tasks =
          this.tasksFetchParams.page > 1
            ? this.tasks.concat(response.data.data?.map((item) => item.task)) ?? []
            : response.data.data?.map((item) => item.task) ?? []
        this.isLastPage = response.data.meta.current_page >= response.data.meta.last_page
        success = true
      }
      this.stopLoading()
      return success
    },
    // if (response?.data?.success) {
    //   const statuses = response.data?.data
    //   this.acts.forEach((item) => {
    //     if (statuses[item.id] === 'signed') {
    //       item.sign_status = 'contractor_signed'
    //       item.status = 'contractor_signed'
    //       this.actsInPending = this.actsInPending.filter((id) => id !== item.id)
    //     }
    //   })
    // } else {
    //   this.finishPulling()
    //   this.showNotification({
    //     type: 'error',
    //     text: getAPIError(response) || 'Не удалось получить статусы актов',
    //   })
    // }

    // async loadGrid (concat = false) {
    //   if (this.busy) return
    //   this.startLoading()
    //   this.busy = true

    //   const params = this.fetchParams
    //   const response = await this.$axios.get('v2/user/acts', {
    //     params,
    //   })

    //   if (response?.data?.success) {
    //     this.acts = concat ? this.acts.concat(response.data.data) : response.data.data
    //     this.findPending(response.data.data)
    //     if (response.data.meta?.current_page < response.data.meta?.last_page) this.busy = false
    //   } else {
    //     this.showNotification({
    //       type: 'error',
    //       text: getAPIError(response) || 'Не удалось загрузить акты',
    //     })
    //   }
    //   this.stopLoading()
    // },

    findPending (acts) {
      acts.forEach((item) => {
        if (item.sign_status === 'pending') this.actsInPending.push(item.id)
      })
    },

    // loadMore () {
    //   if (!this.busy) {
    //     this.fetchParams.page++
    //     // this.loadGrid(true)
    //   }
    // },

    loadMore () {
      if (this.isLastPage || this.loading) return
      this.tasksFetchParams.page++
      this.fetchEndedTasks()
    },

    changeTab (tab) {
      if (tab === this.activeTab) return
      this.tasks = []
      this.$router.push({ query: { tab } })
      this.activeTab = tab
    },

    // changeTab (type) {
    //   this.$router.push({ query: { type } })
    //   this.activeTab = type
    //   this.fetchParams.section = type
    //   this.fetchParams.page = 1
    //   this.busy = false
    //   // this.loadGrid(false)
    // },
  },
}
</script>

<style lang="scss" scoped>
.contractor-finances {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 24px;
  gap: 24px;
}

.act_signed_button {
  height: 40px;
  width: 159px;
  @media (max-width: 768px) {
    display: none;
  }
}

.act_signed_button_mobile {
  height: 40px;
  width: 100%;
}

.contractor-finances__title {
  font-size: 32px;
}

.contractor-finances__balance {
  padding-bottom: 16px;
}

.contractor-finances__tabs {
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
  text-underline-position: from-font;
  margin-bottom: 32px;
}

.green_text {
  color: #71d472;
}

.finance_list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  @media (max-width: 768px) {
    padding-bottom: 80px;
  }
}

.act_container_header {
  padding: 0 19px;
  margin-bottom: 16px;
  border: none;
  color: #7a91a9;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.36px;
  text-transform: uppercase;
  display: grid;
  column-gap: 16px;
  grid-template-columns: 24px 2fr 180px repeat(4, 1fr) 159px;
}
@media (max-width: 1280px) {
  .act_container_header {
    display: none;
  }
}
@media (max-width: 999px) {
  .contractor-finances__balance {
    margin-bottom: unset;
  }
}
</style>
