<template>
  <div class="violations_info">
    <ViolationsMainInfo @change-tab="handleTabChange" :violations="violationsCounter" :loading="loading" />
    <Block class="main_block">
      <Tabs :tabs="tabs" v-model="activeTab" type="flat" class="mb_16" />
      <div v-if="!isAdaptive && activeTab === 'not_worked'" class="warning_info">
        Если наберётся 3 пропуска, тариф станет ниже
      </div>
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
import { mapGetters, mapActions } from 'vuex'
import ViolationsMainInfo from '@/components/organisms/ViolationsMainInfo.vue'
import Block from '@/components/page/profile/Block.vue'
import useGlobalLoading from '@/composables/useGlobalLoading'
import Pagination from '@/components/atoms/Pagination.vue'
import FlexibleUniversalList from '@/components/organisms/FlexibleUniversalList.vue'
import { getAPIError, declensionOfNumber } from '@/constants/helpers'
import { VIOLATIONS_TYPES } from '@/constants/statuses'

export default {
  components: {
    ViolationsMainInfo,
    Block,
    Pagination,
    FlexibleUniversalList,
  },
  props: {
    violationsCounter: {
      type: Object,
      default: () => ({}),
    },
  },
  setup () {
    const { startLoading, stopLoading, loading } = useGlobalLoading()
    return { startLoading, stopLoading, loading }
  },
  data () {
    return {
      initialLoadFinished: false,
      activeTab: 'by_rank',
      isLastPage: false,
      isAdaptive: window.innerWidth <= 1000,
      tabsData: {
        by_rank: {
          list: [],
          columns: [
            { key: 'date', label: 'Дата', formatter: this.getViolateDate },
            { key: 'type', label: 'Тип', formatter: (val, item) => this.getViolateName(item.violation) },
            {
              key: 'task',
              label: 'Заявка',
              formatter: (val, item) => item.name ?? item.not_worked_name,
              clickable: true,
            },
            { key: 'progressLoss', label: 'Потеря прогресса', render: this.renderProgressLoss },
          ],
          adaptiveConfig: [
            { key: 'date', label: 'Дата', formatter: this.getViolateDate, icon: 'schedule' },
            { key: 'type', formatter: (val, item) => this.getViolateName(item.violation) },
            { key: 'progressLoss', label: 'Штраф', render: this.renderProgressLoss },
            { key: 'task', formatter: (val, item) => item.name ?? item.not_worked_name, clickable: true },
          ],
          currentPage: 1,
          totalPages: 0,
          perPage: 15,
          isLastPage: false,
        },
        not_worked: {
          list: [],
          columns: [
            { key: 'date', label: 'Дата', formatter: this.getViolateDate },
            { key: 'notWorkedPenalty', label: 'Пропуск заявки', render: this.getNotWorkedPenaltyData },
            {
              key: 'task',
              label: 'Заявка',
              formatter: (val, item) => item.name ?? item.not_worked_name,
              clickable: true,
            },
          ],
          adaptiveConfig: [
            { key: 'date', label: 'Дата', formatter: this.getViolateDate, icon: 'schedule' },
            { key: 'notWorkedPenalty', render: this.getNotWorkedPenaltyData },
            { key: 'task', formatter: (val, item) => item.name ?? item.not_worked_name, clickable: true },
          ],
          currentPage: 1,
          totalPages: 0,
          perPage: 15,
          isLastPage: false,
        },
      },
      fetchParams: {
        sort: null,
        order: null,
        search: null,
        filters: null,
      },
      filters: [],
      taskLoading: false,
    }
  },
  computed: {
    tabs () {
      return [
        {
          text: `Потери ранга ${this?.violationsCounter?.by_rank ?? '0'}`,
          value: 'by_rank',
        },
        {
          text: `Пропуски заявок ${(this?.violationsCounter?.total ?? 0) - (this?.violationsCounter?.by_rank ?? 0) ?? '0'}`,
          value: 'not_worked',
        },
      ]
    },
    activeTabData () {
      return this.tabsData[this.activeTab]
    },
    activeViolations () {
      return this.activeTabData.list?.filter((violate) => violate?.isActive) ?? []
    },
  },
  watch: {
    activeTab () {
      this.loadViolations()
    },
  },
  async mounted () {
    window.addEventListener('resize', this.checkIsAdaptive)
    this.checkIsAdaptive()
    this.loadViolations()
  },
  beforeUnmount () {
    window.removeEventListener('resize', this.checkIsAdaptive)
  },
  methods: {
    ...mapActions('notifications', ['showNotification']),
    checkIsAdaptive () {
      this.isAdaptive = window.innerWidth <= 1000
    },
    async loadViolations (append = false) {
      if (this.taskLoading) return
      this.taskLoading = true
      this.startLoading()
      try {
        const activeTabData = this.tabsData[this.activeTab]
        const params = {
          ...this.fetchParams,
          page: activeTabData.currentPage,
          per_page: activeTabData.perPage,
          tab: this.activeTab,
          without_cache: true,
        }
        const response = await this.$axios.get('v2/user/violations', { params })
        if (response?.data?.success) {
          let serverData = this.activeTab === 'by_rank' ? response.data.data.data : response.data.data.data?.history
          let currentNotWorked =
            this.activeTab === 'by_rank'
              ? []
              : response.data.data.data?.items?.map((item) => ({ ...item, isActive: true }))
          if (!append) {
            this.initialLoadFinished = true
          }
          if (append && this.isAdaptive) {
            activeTabData.list = [...currentNotWorked, ...[...activeTabData.list, ...serverData]]
          } else {
            activeTabData.list =
              response.data.data.meta.current_page === 1 ? [...currentNotWorked, ...serverData] : serverData
          }
          activeTabData.totalPages = response.data.data.meta.last_page
          activeTabData.isLastPage = response.data.data.meta.current_page >= response.data.data.meta.last_page
        } else {
          this.showNotification({
            type: 'error',
            text: getAPIError(response) || 'Ошибка при получении истории нарушений',
          })
        }
      } finally {
        this.taskLoading = false
        this.stopLoading()
      }
    },
    loadMore () {
      if (!this.initialLoadFinished) return
      const activeTabData = this.tabsData[this.activeTab]
      if (activeTabData.isLastPage || this.taskLoading) return
      if (this.isAdaptive) {
        activeTabData.currentPage++
        this.loadViolations(true)
      }
    },
    handlePageChange (page) {
      this.tabsData[this.activeTab].currentPage = page
      this.loadViolations()
    },
    handleTabChange (newTab) {
      if (this.activeTab !== newTab) {
        const oldTabData = this.tabsData[this.activeTab]
        oldTabData.currentPage = 1
        oldTabData.list = []
        oldTabData.isLastPage = false
        this.activeTab = newTab
        this.loadViolations()
      }
    },
    getViolateName (violate) {
      return VIOLATIONS_TYPES[violate] || 'Не вышел'
    },
    getViolateDate (val, item) {
      const violateDate = item?.start_date || item?.created_at || item?.not_worked_date
      return this.$dayjs(violateDate || '').format('DD.MM.YYYY')
    },
    renderProgressLoss (item) {
      if (item?.violation && Number(item?.calculated_points)) {
        return `${item.calculated_points} ${declensionOfNumber(item.calculated_points, ['лайк', 'лайка', 'лайков'])}`
      } else {
        return '<div class="dislike_block"><span>Дизлайк</span></div>'
      }
    },
    getNotWorkedPenaltyData (item) {
      const index = this.activeViolations.findIndex((v) => v.not_worked_uuid === item.not_worked_uuid)
      if (index === -1) {
        return '<p style="font-weight: 600;">Пропуск погашен</p>'
      }
      if (index < 2) {
        if (index < 1) {
          return `<p style="font-weight: 600;">Без штрафа (${index + 1}/3)</p>`
        } else return `<p style="font-weight: 600;">Предупреждение (${index + 1}/3)</p>`
      }
      const total = this.violationsCounter?.not_worked || 0
      const worked = this.violationsCounter?.worked || 0
      const diff = total - worked || 0
      const percentage = total > 0 ? 100 - Math.floor((worked * 100) / total) : 0
      return `
        <p style="font-weight: 600;">Ставка понижена –30 ₽/ч 
          <span style="font-size: 14px; font-weight: 400; display: flex; gap: 4px;">
            <span style="color: #666; display: block;">
              Осталось смен: 
            </span>
            <span>
              ${diff} (${percentage}%)
            </span>
          </span>
        </p>
      `
    },
    openTask (item, key) {
      const uuid = item?.uuid ?? item?.not_worked_uuid
      if (uuid) {
        this.$router.push('/task/' + uuid)
      }
    },
    getEmptyMessage (tab) {
      return tab === 'by_rank' ? 'Нарушения отсутствуют.' : 'Пропуски отсутствуют.'
    },
  },
}
</script>

<style lang="scss" scoped>
  .pagination_block {
    align-self: end;
    display: flex;
    justify-self: center;
    width: min-content;
    padding-bottom: 12px;
    margin-right: 12px;
  }
.violations_info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  .main_block {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .mt_24 {
    margin-top: 24px;
  }
  .warning_info {
    font-size: 18px;
  }

  .empty_message {
  text-align: center;
  padding: 24px;
  color: #7a91a9;
}
  @media (max-width: 1000px) {
    .hide_mobile {
      display: none;
      visibility: hidden;
    }
    .pagination_block {
      display: none;
      visibility: hidden;
    }
  }
}
</style>
