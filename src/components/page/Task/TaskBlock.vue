<template>
  <div class="task_item_block">
    <div class="task_info">
      <div class="task_info_main">
        <div class="top_block">
          <div class="header">
            <div class="top_header">
              <div class="labels">
                <TaskTag
                  v-if="task && task.banners"
                  :banners="task.banners"
                  :until-date="task.until_date"
                  :assigned-counter="assignedCounter"
                  class="labels_taskTag"
                />
              </div>
            </div>
            <div class="task_header">
              <div class="header_with_back_button">
                {{ task.name }}
              </div>
            </div>
          </div>

          <section class="task_rate_block">
            <div class="contractor-task-page__pay">{{ getDisplayedNumber(getNetRate(task.rate), 2) }} ₽/смена</div>
            <CloudTag :listTag="task.professions" />
          </section>

          <div v-if="task.start_date" class="task_date">
            <img src="@/assets/icons/calendar_black.svg" />
            {{ $dayjs(task.start_date).utc().format('DD MMMM YYYY г. HH:mm') }}
          </div>
        </div>
        <div class="task_action_block">
          <div class="task_actions">
            <TaskItemCardBanner :task="task" :cardBannerType="taskBannerType">
              <TaskActions
                ref="actions"
                :actionsList="actionsList"
                :loading="loading"
                @callAction="callAction"
              />
            </TaskItemCardBanner>
          </div>
        </div>
      </div>
    </div>
    <div class="object_block">
      <ObjectBlock :task="task" @subscribe="subscribe" @unsubscribe="unsubscribe" />
    </div>
    <div class="description_block">
      <div class="divider" />
      <div class="description_header">Описание</div>
      <TaskDescriptionBlock :task="task" />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TaskItemCardBanner from '@/components/page/contractorTasks/TaskItemCardBanner.vue'
import TaskDescriptionBlock from '@/components/page/Task/TaskDescriptionBlock.vue'
import TaskActions from '@/components/page/contractorTasks/TaskActions.vue'
import TaskTag from '@/components/page/contractorTasks/TaskTag.vue'
import ObjectBlock from '@/components/page/Task/ObjectBlock.vue'
import { toRef } from 'vue'
import useTask from '@/composables/useTask'
import { getDisplayedNumber } from '@/constants/helpers'

export default {
  components: { TaskItemCardBanner, ObjectBlock, TaskDescriptionBlock, TaskTag, TaskActions },
  props: {
    task: {
      type: Object,
      required: true,
    },
    updateTask: {
      type: Function,
      default: () => {},
    },
  },
  data () {
    return {
      months: [
        'января',
        'февраля',
        'марта',
        'апреля',
        'мая',
        'июня',
        'июля',
        'августа',
        'сентября',
        'октября',
        'ноября',
        'декабря',
      ],
      isLoading: true,
    }
  },
  setup (props) {
    const task = toRef(props, 'task')
    const { taskBannerType, actionsList, callAction, loading } = useTask(task, props.updateTask)

    return {
      taskBannerType,
      actionsList,
      callAction,
      loading,
    }
  },
  computed: {
    status () {
      return this.task.calcStatus
    },
    assignedCounter () {
      if (this.task?.requires_contractors && this.task?.calcStatus !== 'refused' && this.task?.status !== 'client_cancel') {
        return {
          assigned: this.task?.working_contractors || 0,
          required: this.task?.requires_contractors,
        }
      } else return null
    },
    emptyBanner () {
      return this?.cardBannerType === 'empty' || this?.cardBannerType === undefined
    },
    showRecrutingDesc () {
      return this.task.calcStatus === 'is_recruting_urgently' || this.task.calcStatus === 'is_recruting'
    },
  },
  async created () {},
  methods: {
    getDisplayedNumber,
    ...mapActions('notifications', ['showNotification']),
    getNetRate (rate) {
      if (rate) {
        const netRate = rate - (6 * rate) / 100
        return rate
      } else {
        return ''
      }
    },

    getRegDate (created_at) {
      if (!created_at) return ''
      const [year, month, date] = created_at.split('T')[0].split('-')
      return `${date} ${this.months[month - 1]} ${year}`
    },

    async subscribe () {
      const response = await this.$axios.post(
        'v2/tasks/subscribe',
        { task_uuids: [this.task.uuid] },
        { errorMessage: 'Не удалось подписаться на объект' },
      )
      if (response?.data?.success) this.$emit('updateSubscribe', true)
    },

    async unsubscribe () {
      const response = await this.$axios.post(
        'v2/tasks/unsubscribe',
        { task_uuids: [this.task.uuid] },
        { errorMessage: 'Не удалось отписаться от объекта' },
      )
      if (response?.data?.success) this.$emit('updateSubscribe', false)
    },

    getRegTime (time) {
      if (!time) return ''
      return time.substr(11, 5)
    },
  },
}
</script>

<style lang="scss" scoped>
.task_item_block {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 32px;
  padding: 24px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #dadada;
}
.task_info {
  width: 100%;
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 24px;
  .task_info_main {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 32px;
  }
}
.divider {
  display: block;
  width: 100%;
  height: 1px;
  background-color: #0000001a;
}
.top_block {
  width: 100%;
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 16px;
}
.task_stat_desktop {
  display: flex;
}
.task_stat_mobile {
  display: none;
  margin-top: 18px;
  margin-bottom: 0;
}

.task_header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.task_rate_block {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.header_with_back_button {
  display: inline-flex;
  gap: 16px;
  align-items: center;
  cursor: pointer;
  font-size: 36px;
  font-weight: 700;
  line-height: 46px;
  text-align: left;

  padding-right: 16px;
}

.contractor-task-page {
  padding-top: 24px;
  display: grid;
  gap: 24px;
  grid-template-columns: 100%;
  padding-bottom: 100px;

  @media (min-width: 960px) {
    grid-template-columns: auto 340px;
    grid-template-rows: min-content 1fr;
  }
}

.contractor-task-page__pay {
  font-size: 18px;
  font-weight: 600;
  line-height: 22.63px;
  text-align: left;
  white-space: nowrap;
}

.contractor-task-page__date {
  font-size: 16px;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;

  @media screen and (min-width: 768px) {
    flex-direction: row;
  }
}

.contractor-task-page__date-title {
  font-weight: 400;
  font-size: 14px;
  margin-right: 6px;
}

.contractor-task-page__date-value {
  color: #263043;
  font-size: 14px;
  font-weight: 700;
}
.header {
  width: 100%;
  display: flex;
  gap: 16px;
  flex-direction: column;
}
.top_header {
  width: 100%;
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 24px;
}
.labels {
  display: flex;
  align-items: start;
  flex-wrap: wrap;
  row-gap: 8px;
  column-gap: 16px;
}
.task_date {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
}
.description_block {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.description_header {
  font-size: 22px;
  font-weight: 600;
  line-height: 27.5px;
  text-align: left;
}
.action_desciption {
  display: flex;
  flex-direction: row;
  gap: 16px;
  height: 100%;
  width: 100%;
  border-radius: 8px;
  background-color: #f3faff;
  padding: 16px;
  .description_right_side {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
    .description_text {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 12px;
      .header {
        font-size: 18px;
        font-weight: 600;
        line-height: 22.63px;
        text-align: left;
      }
      .subtitle {
        font-size: 16px;
        font-weight: 400;
        line-height: 22px;
        text-align: left;
        color: #666666;
      }
    }
  }
}
.object_block {
  display: none;
}

@media (max-width: 999px) {
  .divider {
    display: none;
  }
  .task_item_block {
    padding: 24px 20px;
  }
  .task_stat_desktop {
    display: none;
  }
  .task_stat_mobile {
    display: flex;
  }
  .header_with_back_button {
    font-size: 26px;
    font-weight: 600;
    line-height: 32.5px;
    text-align: left;
  }
  .description_header {
    font-size: 18px;
    font-weight: 600;
    line-height: 22.63px;
    text-align: left;
  }
  .contractor-task-page__pay {
    font-size: 18px;
  }
  .object_block {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 16px;
  }
}
</style>
