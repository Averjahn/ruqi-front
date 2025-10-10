<template>
  <div class="contractor-finances basic_container_global">
    <h1 class="contractor-finances__title">Мои финансы</h1>

    <FnsBalance class="contractor-finances__balance" />
    <Balance v-if="balances.loaded" class="contractor-finances__balance" :balance="balances" />

    <Block class="main_block" :shadow="true">
      <Tabs :tabs="tabs" v-model="activeTab" type="flat" class="mb_16" />
      <Window :activeTab="activeTab">
        <template #waiting>
          <FlexibleUniversalList
            :items="activeTabData.list"
            :columns="activeTabData.columns"
            :adaptiveConfig="activeTabData.adaptiveConfig"
            :onClick="openTask"
            :emptyMessage="getEmptyMessage(activeTab)"
          />
        </template>
        <template #paid>
          <FlexibleUniversalList
            :items="activeTabData.list"
            :columns="activeTabData.columns"
            :adaptiveConfig="activeTabData.adaptiveConfig"
            :onClick="openTask"
            :emptyMessage="getEmptyMessage(activeTab)"
          />
        </template>
        <template #bonus_withdrawal>
          <FlexibleUniversalList
            :items="activeTabData.list"
            :columns="activeTabData.columns"
            :adaptiveConfig="activeTabData.adaptiveConfig"
            :onClick="openTask"
            :emptyMessage="getEmptyMessage(activeTab)"
          />
        </template>
      </Window>
      <Pagination
        v-if="activeTabData.totalPages > 1 && !this.isAdaptive"
        :totalPages="activeTabData.totalPages"
        :currentPage="activeTabData.currentPage"
        @page-change="handlePageChange"
        class="mt_24 pagination_block"
      />
      <LazyLoad v-if="!activeTabData.isLastPage && this.isAdaptive" ref="lazyLoad" :callBack="loadMore" />
      <!-- <div v-else>
        <Window :activeTab="activeTab">
          <template #by_rank>
            <FlexibleUniversalList
              :items="activeTabData.list"
              :columns="activeTabData.columns"
              :adaptiveConfig="activeTabData.adaptiveConfig"
              :onClick="openTask"
              :emptyMessage="getEmptyMessage(activeTab)"
            />
          </template>
          <template #not_worked>
            <FlexibleUniversalList
              :items="activeTabData.list"
              :columns="activeTabData.columns"
              :adaptiveConfig="activeTabData.adaptiveConfig"
              :onClick="openTask"
              :emptyMessage="getEmptyMessage(activeTab)"
            />
          </template>
        </Window>
        
      </div> -->
    </Block>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Balance from '@/components/page/finance/Balance.vue'
import FnsBalance from '@/components/page/finance/FnsBalance.vue'
import Block from '@/components/page/profile/Block.vue'
// import ActItem from '@/components/organisms/ActItem'
import { getDisplayedNumber, getAPIError, formatCurrency } from '@/constants/helpers'
import useGlobalLoading from '@/composables/useGlobalLoading'
import Pagination from '@/components/atoms/Pagination.vue'
import FlexibleUniversalList from '@/components/organisms/FlexibleUniversalList.vue'

export default {
  components: {
    Balance,
    // ActItem,
    Block,
    FnsBalance,
    Pagination,
    FlexibleUniversalList,
  },
  setup () {
    const { startLoading, stopLoading, loading } = useGlobalLoading()
    return { startLoading, stopLoading, loading }
  },
  data () {
    return {
      initialLoadFinished: false,
      activeTab: 'waiting',
      isLastPage: false,
      isAdaptive: window.innerWidth <= 1000,
      tabsData: {
        waiting: {
          urlSrc: 'v2/user/acts/wait',
          list: [],
          columns: [
            { key: 'startDate', label: 'Дата', formatter: this.getViewStartDate },
            { key: 'actDate', label: 'Дата акта', formatter: this.getViewActDate },
            { key: 'sumToPay', label: 'Сумма', formatter: (val, item) => formatCurrency(item?.sum_accrual) },
            {
              key: 'task',
              label: 'Заявка',
              formatter: (val, item) => item.task_name,
              clickable: true,
            },
          ],
          adaptiveConfig: [
            { key: 'startDate', label: 'Дата', formatter: this.getViewStartDate, icon: 'schedule' },
            { key: 'actDate', label: 'Дата акта', formatter: this.getViewActDate, icon: 'schedule' },
            { key: 'sumToPay', formatter: (val, item) => formatCurrency(item?.sum_accrual) },
            { key: 'task', formatter: (val, item) => item.task_name, clickable: true },
          ],
          currentPage: 1,
          totalPages: 0,
          perPage: 15,
          isLastPage: false,
          fetchParams: {},
        },
        paid: {
          urlSrc: 'v2/user/acts/paid',
          list: [],
          columns: [
            { key: 'startDate', label: 'Дата', formatter: this.getViewStartDate },
            { key: 'actDate', label: 'Дата акта', formatter: this.getViewActDate },
            { key: 'sumToPay', label: 'Сумма', formatter: (val, item) => formatCurrency(item?.sum_accrual) },
            {
              key: 'task',
              label: 'Заявка',
              formatter: (val, item) => item.task_name,
              clickable: true,
            },
          ],
          adaptiveConfig: [
            { key: 'startDate', label: 'Дата', formatter: this.getViewStartDate, icon: 'schedule' },
            { key: 'actDate', label: 'Дата акта', formatter: this.getViewActDate, icon: 'schedule' },
            { key: 'sumToPay', formatter: (val, item) => formatCurrency(item?.sum_accrual) },
            { key: 'task', formatter: (val, item) => item.task_name, clickable: true },
          ],
          currentPage: 1,
          totalPages: 0,
          perPage: 15,
          isLastPage: false,
          fetchParams: {},
        },
        bonus_withdrawal: {
          urlSrc: 'v2/accrual-items/list',
          list: [],
          columns: [
            { key: 'startDate', label: 'Дата', formatter: this.getViewStartDate },
            { key: 'sumToPay', label: 'Сумма', formatter: (val, item) => formatCurrency(item?.sum_accrual) },
            { key: 'bonusType', label: 'Тип бонуса', formatter: (val, item) => item?.bonus_type },
            { key: 'comment', label: 'Детали бонуса', formatter: (val, item) => this.getBonusDescription(item) },
            {
              key: 'task',
              label: 'Заявка',
              formatter: (val, item) => item.task_name,
              clickable: true,
            },
          ],
          adaptiveConfig: [
            { key: 'startDate', label: 'Дата', formatter: this.getViewStartDate, icon: 'schedule' },
            { key: 'sumToPay', formatter: (val, item) => formatCurrency(item?.sum_accrual) },
            { key: 'bonusType', formatter: (val, item) => item?.bonus_type },
            { key: 'comment', formatter: (val, item) => this.getBonusDescription(item) },
            { key: 'task', formatter: (val, item) => item.task_name, clickable: true },
          ],
          currentPage: 1,
          totalPages: 0,
          perPage: 15,
          isLastPage: false,
          fetchParams: {
            // type: 'bonus',
            // status: 'full_paid',
            // without_cache: true,
            // return_count: null,
          },
        },
      },
      acts: [],
      tasks: [],
      taskUrl: null,
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
        sort: null,
        order: null,
        search: null,
        filters: null,
      },
      filters: [],
      // fetchParams: {
      //   section: 'all',
      //   page: 0,
      //   per_page: 10,
      //   sort: null,
      //   order: null,
      //   search: null,
      // },
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
      localLoading: false,
      actsInPending: [],
    }
  },

  computed: {
    ...mapGetters('user', ['user']),
    tabs () {
      return [
        { text: `Ждут оплаты ${this?.balances?.count_tasks_on_payment ?? ''}`, value: 'waiting' },
        { text: `Оплаченные ${this?.balances?.count_tasks ?? ''}`, value: 'paid' },
        { text: `Выплата бонусов ${this?.balances?.bonuses?.paid_bonuses_count ?? ''}`, value: 'bonus_withdrawal' },
      ]
    },
    activeTabData () {
      return this.tabsData[this.activeTab]
    },
  },
  watch: {
    activeTab (tab) {
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
    // this.activeTab = this.$route.query.tab || 'waiting'

    this.loadBalance()
  },

  async mounted () {
    this.activeTab = this.$route.query.tab || 'waiting'
    window.addEventListener('resize', this.checkIsAdaptive)
    this.checkIsAdaptive()
    this.fetchEndedTasks()
    // this.fetchCertificates()
  },

  unmounted () {
    clearInterval(this.timerId)
  },

  methods: {
    getDisplayedNumber,
    formatCurrency,
    // ...mapActions('profilePage', ['fetchCertificates']),
    ...mapActions('finances', ['fetchActs', 'fetchBalances']),
    ...mapActions('notifications', ['showNotification']),
    checkIsAdaptive () {
      this.isAdaptive = window.innerWidth <= 1000
    },

    getViewStartDate (val, item) {
      const viewDate = item?.start_date
      return viewDate ? this.$dayjs(viewDate || '').format('DD.MM.YYYY') : '-'
    },
    getViewActDate (val, item) {
      const viewDate = item?.created_at || item?.start_date || item?.not_worked_date
      return viewDate ? this.$dayjs(viewDate || '').format('DD.MM.YYYY') : '-'
    },

    getBonusDescription (item) {
      const itemType = item?.bonus_type
      switch (itemType) {
        case 'Акция "Приведи друга"':
          return `Имя друга: ${item?.comment}`
        case 'Премия за 2 ранг':
        case 'Премия за 3 ранг':
        case 'Премия за 4 ранг':
        case 'Премия за 5 ранг':
        case 'Премия за 6 ранг':
          return `Достижение ранга: ${item?.comment}`

        default:
          return item?.comment || item?.bonus_type
      }
    },

    // finishPulling(isExceedingAttempt) {
    //   clearInterval(this.timerId)
    //   this.timerId = null
    //   this.counter = 0
    //   if (isExceedingAttempt) {
    //     this.actsInPending = []
    //     this.acts.forEach((act) => {
    //       if (act.sign_status === 'pending') act.sign_status = 'attempt_exceed'
    //     })
    //     this.showNotification({
    //       type: 'info',
    //       text: 'Акты в процессе подписания, попробуйте обновить через несколько минут',
    //     })
    //   }
    // },

    // repeatWithInterval(func, count, interval) {
    //   const self = this
    //   this.timerId = setInterval(function () {
    //     self.counter++
    //     if (self.counter > count) {
    //       self.finishPulling(true)
    //     } else {
    //       func()
    //     }
    //   }, interval)
    // },

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

    // addToPending (id) {
    //   this.acts.forEach((act) => {
    //     if (act.id === id) act.sign_status = 'pending'
    //   })
    //   this.actsInPending.push(id)
    // },

    // async fetchSignatureStatus () {
    //   const response = await this.$axios.get('v2/user/acts/signaturestatus', {
    //     params: {
    //       act_ids: this.actsInPending,
    //     },
    //   })

    //   if (response?.data?.success) {
    //     const statuses = response.data?.data
    //     this.acts.forEach((item) => {
    //       if (statuses[item.id] === 'signed') {
    //         item.sign_status = 'contractor_signed'
    //         item.status = 'contractor_signed'
    //         this.actsInPending = this.actsInPending.filter((id) => id !== item.id)
    //       }
    //     })
    //   } else {
    //     this.finishPulling()
    //     this.showNotification({
    //       type: 'error',
    //       text: getAPIError(response) || 'Не удалось получить статусы актов',
    //     })
    //   }
    // },
    async fetchEndedTasks (append = false) {
      if (this.localLoading) return
      this.localLoading = true
      this.startLoading()
      try {
        const activeTabData = this.tabsData[this.activeTab]
        const params = {
          ...this.fetchParams,
          ...activeTabData.fetchParams,
          page: activeTabData.currentPage,
          per_page: activeTabData.perPage,
        }
        const response = await this.$axios.get(this.activeTabData.urlSrc, { params })
        if (response?.data?.success) {
          let listWithTasksData =
            this.activeTab !== 'bonus_withdrawal'
              ? response.data.data?.map((taskItem) => ({
                  sum_accrual: taskItem?.sum_to_pay,
                  start_date: taskItem?.task?.start_date,
                  created_at: taskItem?.created_at,
                  task_name: taskItem?.task?.name,
                  task_uuid: taskItem?.task?.uuid,
                }))
              : response.data.data
          if (!append) {
            this.initialLoadFinished = true
          }
          if (append && this.isAdaptive) {
            activeTabData.list = [...activeTabData.list, ...listWithTasksData]
          } else {
            activeTabData.list = response.data.meta.current_page === 1 ? [...listWithTasksData] : listWithTasksData
          }
          activeTabData.totalPages = response.data.meta.last_page
          activeTabData.isLastPage = response.data.meta.current_page >= response.data.meta.last_page
        } else {
          this.showNotification({
            type: 'error',
            text: getAPIError(response) || 'Ошибка при получении истории нарушений',
          })
        }
      } finally {
        this.localLoading = false
        this.stopLoading()
      }
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

    // findPending (acts) {
    //   acts.forEach((item) => {
    //     if (item.sign_status === 'pending') this.actsInPending.push(item.id)
    //   })
    // },

    // loadMore () {
    //   if (!this.busy) {
    //     this.fetchParams.page++
    //     // this.loadGrid(true)
    //   }
    // },

    // loadMore () {
    //   if (this.isLastPage || this.loading) return
    //   this.tasksFetchParams.page++
    //   this.fetchEndedTasks()
    // },

    // changeTab (tab) {
    //   if (tab === this.activeTab) return
    //   this.tasks = []
    //   this.$router.push({ query: { tab } })
    //   this.activeTab = tab
    // },

    loadMore () {
      if (!this.initialLoadFinished) return
      const activeTabData = this.tabsData[this.activeTab]
      if (activeTabData.isLastPage || this.taskLoading) return
      if (this.isAdaptive) {
        activeTabData.currentPage++
        this.fetchEndedTasks(true)
      }
    },
    handlePageChange (page) {
      this.tabsData[this.activeTab].currentPage = page
      this.fetchEndedTasks()
    },
    handleTabChange (newTab) {
      if (this.activeTab !== newTab) {
        const oldTabData = this.tabsData[this.activeTab]
        oldTabData.currentPage = 1
        oldTabData.list = []
        oldTabData.isLastPage = false
        this.activeTab = newTab
        this.fetchEndedTasks()
      }
    },

    openTask (item, key) {
      const uuid = item?.task_uuid
      if (!uuid) return
      this.$router.push('/task/' + uuid)
    },
    getEmptyMessage (tab) {
      switch (tab) {
        case 'wait':
          return 'Заявки к выплате отсутствуют.'
        case 'paid':
          return 'Выплаченные заявки отсутствуют.'
        case 'wait':
          return 'Отсутствуют выплаченные бонусы.'

        default:
          return 'Отсутствуют данные.'
      }
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
.main_block {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 24px;
}
.pagination_block {
  align-self: end;
  display: flex;
  justify-self: center;
  width: min-content;
  padding-bottom: 12px;
  margin-right: 12px;
}
.contractor-finances {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 24px;
  gap: 20px;
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
  .contractor-finances {
    padding-bottom: 52px;
  }
  .contractor-finances__balance {
    margin-bottom: unset;
  }
}
</style>
