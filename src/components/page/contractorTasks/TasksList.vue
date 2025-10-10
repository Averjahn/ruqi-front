<template>
  <div class="tasks_list" :class="{ flex_row: isRow }">
    <Task
      v-for="item in tasks"
      class="task_item"
      :showFavorites="showFavorites"
      :showActions="showActions"
      :showTodos="showTodos"
      :showLables="showLables"
      :key="item.uuid"
      :task="item"
      :updateTask="updateTask"
    />
    <div v-if="!tasks.length && !loading" class="no_task_message">Нет активных заявок</div>
  </div>
</template>

<script>
import Task from '@/components/organisms/Task.vue'

export default {
  components: {
    Task,
  },
  emits: ['updateItemCalcStatus'],
  props: {
    tasks: {
      type: Array,
      required: true,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
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
    isRow: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {}
  },
  watch: {},
  mounted () {},
  unmounted () {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.tasks_list {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  &.flex_row {
    @media screen and (min-width: 1000px) {
      flex-direction: row;
      flex-wrap: wrap;
      box-sizing: border-box;
      .task_item {
        flex-basis: calc(50% - 8px);
      }
    }
  }
}
.no_task_message {
  padding: 48px 0;
}
</style>
