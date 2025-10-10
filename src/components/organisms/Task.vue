<template>
  <div class="task_container" @click="($event) => openTask($event)">
    <div class="info_block">
      <div class="header" :class="{ hidden_header: !showLables }">
        <div class="labels">
          <!--<Status :status="task.calcStatus || ''" />-->
          <TaskTag
            v-if="task && task.banners"
            :banners="task.banners"
            :until-date="task.until_date"
            :assigned-counter="assignedCounter"
            class="labels_taskTag"
          />
          <!--<div v-if="!isMobile && showRecruting" class="recruting_label">
            <TaskRecrutingBanner :task="task" />
          </div>-->
        </div>
        <section v-if="showFavorites">
          <img v-if="task.is_subscribe" src="@/assets/icons/heart_filled.svg" />
          <img v-else src="@/assets/icons/heart.svg" />
        </section>
      </div>

      <div class="mini_group">
        <div class="task_name">{{ task.name }}</div>

        <div class="task_rate">
          <div v-if="task.rate" class="task_rate_text">{{ getDisplayedNumber(getNetRate(task.rate), 2) }} р./смена</div>
        </div>

        <div v-if="task.start_date" class="task_date">
          <img src="@/assets/icons/calendar_black.svg" />
          {{ $dayjs(task.start_date).utc().format('DD MMMM YYYY г. HH:mm') }}
        </div>
      </div>

      <div class="mini_group">
        <div class="task_object">
          <ObjectLogo :logo="task.object?.logo_thumb_48x48" :size="32" class="object_logo" />
          <div>{{ task.object?.view_name ?? task.object?.name }}</div>
          <div v-if="task.rating" class="rating">
            <img src="@/assets/icon_deprecated/star-full.svg" />
            {{ task.rating }}
          </div>
        </div>

        <div class="address">{{ task.object.address }}</div>
      </div>
    </div>

    <ImageGallery v-if="showTodo" :items="galleryTask" />

    <TaskCardBanner v-if="showActions" :cardBannerType="cardBannerType">
      <TaskActions ref="actions" :actionsList="actionsList" :loading="loading" @callAction="callAction" />
    </TaskCardBanner>
    <ThinLineLoading class="thin_loading" :show="loading" />
  </div>
</template>

<script>
import { getDisplayedNumber } from '@/constants/helpers'
import Status from '@/components/page/contractorTasks/Status.vue'
import TaskRecrutingBanner from '@/components/page/contractorTasks/TaskRecrutingBanner.vue'
import TaskTag from '@/components/page/contractorTasks/TaskTag.vue'
import { mapActions } from 'vuex'
import ObjectLogo from '@/components/atoms/ObjectLogo.vue'
import TaskActions from '@/components/page/contractorTasks/TaskActions.vue'
import TaskCardBanner from '@/components/page/contractorTasks/TaskCardBanner.vue'
import useTask from '@/composables/useTask'
import ImageGallery from '@/components/organisms/ImageGallery'
import { toRef } from 'vue'
export default {
  name: 'Task',
  components: {
    //Status,
    //TaskRecrutingBanner,
    TaskCardBanner,
    TaskTag,
    TaskActions,
    ObjectLogo,
    ImageGallery,
  },
  props: {
    task: {
      type: Object,
      default: () => ({}),
    },
    updateTask: {
      type: Function,
      default: () => {},
    },
    showFavorites: {
      type: Boolean,
      default: true,
    },
    showLables: {
      type: Boolean,
      default: true,
    },
    showActions: {
      type: Boolean,
      default: true,
    },
    showTodos: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {}
  },
  setup (props) {
    const task = toRef(props, 'task')
    const { cardBannerType, actionsList, callAction, loading } = useTask(task, props.updateTask)

    return {
      cardBannerType,
      actionsList,
      callAction,
      loading,
    }
  },
  computed: {
    galleryTask () {
      return (
        this.task?.todo?.map((t) => ({
          thumbnail: t.thumbnail,
          main: t.main,
          title: t.title,
          description: t.description,
        })) || []
      )
    },
    assignedCounter () {
      if (this.task?.requires_contractors && this.task?.calcStatus !== 'refused' && this.task?.status !== 'client_cancel') {
        return {
          assigned: this.task?.working_contractors || 0,
          required: this.task?.requires_contractors,
        }
      } else return null
    },
    showTodo () {
      return this.galleryTask.length && this.cardBannerType === 'empty' && this.showTodos
    },
  },
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    ...mapActions('watchedObjects', ['addToWatchedObject']),
    getDisplayedNumber,
    getNetRate (rate) {
      if (rate) {
        const netRate = rate - (6 * rate) / 100
        return rate
      } else {
        return ''
      }
    },
    openTask (e) {
      if (e.target !== this?.$refs?.actions?.$el && !this?.$refs?.actions?.$el.contains(e.target)) {
        this.$router.push('/task/' + this.task.uuid)
        this.addToWatchedObject(this.task?.object?.uuid)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.task_container {
  display: flex;
  padding: 24px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
  border-radius: 14px;
  border: 1px solid #dadada;
  background: #fff;
  color: #263043;
  position: relative;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  @media screen and (max-width: 768px) {
    padding: 20px;
  }
  &:hover {
    box-shadow:
      0 0 48px 4px #0234e30a,
      0 0 10px 0 #1735f508;
  }
}
.info_block {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 16px;
}
.header {
  width: 100%;
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 24px;
  &.hidden_header {
    height: 0;
    display: none;
    visibility: hidden;
  }
}
.labels {
  display: flex;
  align-items: start;
  flex-wrap: wrap;
  row-gap: 8px;
  column-gap: 16px;
}

.mini_group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task_name {
  align-self: stretch;
  font-size: 22px;
  font-weight: 600;
  line-height: 28px;
}
.task_date {
  display: flex;
  align-items: center;
  gap: 8px;
}

.task_rate {
  display: flex;
  align-items: center;
  gap: 16px;
}

.footer {
  display: flex;
  align-items: center;
  gap: 16px;
  align-self: stretch;
  @media screen and (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: flex-start;
  }
}

.task_object {
  display: flex;
  align-items: center;
  gap: 8px;
  @media screen and (max-width: 768px) {
    min-width: 240px;
    gap: 8px;
  }
}

.logo {
  display: flex;
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  border-radius: 80px;
  background: #71d472;
  img {
    flex-shrink: 0;
  }
}

.rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.task_menu {
  width: 30px;
  height: 30px;
  position: absolute;
  right: 24px;
  top: 24px;
  @media screen and (max-width: 768px) {
    right: 16px;
    top: 16px;
  }
}

.task_rate_text {
  font-size: 18px;
  font-weight: 600;
  line-height: 22px;
}

.address {
  color: #666666;
  font-size: 14px;
  font-weight: 40;
  line-height: 20px;
}

.subscribe_status {
  color: #bebebe;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  gap: 4px;
}

.ThinLineLoading.thin_loading {
  position: absolute;
  bottom: 0;
  left: 0;
}
.object_logo {
  min-width: 48px;
}

.task_actions_block {
  display: flex;
  align-items: center;
  row-gap: 12px;
  flex-wrap: wrap;
  column-gap: 16px;
  width: 100%;
}

@media (max-width: 1000px) {
}
</style>
