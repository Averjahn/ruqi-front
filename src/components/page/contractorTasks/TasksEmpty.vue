<template>
  <div class="rq-tasks-empty-wrapper">
    <div class="rq-tasks-empty">
      <div class="rq-tasks-empty-header mb_16">{{ title }}</div>
      <div class="rq-tasks-empty-content mb_32">{{ description }}</div>
      <div class="rq-tasks-empty-btn">
        <Button class="btn-blue" outlined="outlined" @click="searchTasks">
          <div class="tasks_empty_button">
            <img src="@/assets/icon_deprecated/ico_magnifier.svg" />
            <span>Найти новые заявки</span>
          </div>
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },

  methods: {
    searchTasks () {
      this.$router.push('/')
    },
  },
}
</script>

<style lang="scss">
.rq-tasks-empty-wrapper {
  display: flex;
  justify-content: center;
  padding: 80px 0 50px 0;

  .tasks_empty_button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .rq-tasks-empty {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 380px;
    flex-direction: column;

    .rq-tasks-empty-header {
      font-weight: 700;
      font-size: 22px;
    }

    .rq-tasks-empty-content {
      font-weight: 400;
      text-align: center;
      line-height: 21px;
    }
  }
}

@media screen and (max-width: 768px) {
  .rq-tasks-empty-wrapper {
    padding: 0 10px 160px 10px;
    margin-left: 0;
    margin-top: 0;

    .rq-tasks-empty {
      .rq-tasks-empty-header {
        font-size: 16px;
      }

      .rq-tasks-empty-content {
        font-size: 14px;
      }
    }
  }
}
</style>
