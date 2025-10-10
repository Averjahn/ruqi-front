<template>
  <div class="welcome_prompt">
    <div class="prompt_block">
      <div class="prompt_header-block">
        <div class="header_text">Приветствуем вас в сервисе RUQI.RU</div>
        <div class="description_text">
          Помогите нам подобрать релевантные заявки специально для вас. Ответьте пожалуйста всего на 3 вопроса и
          получите персональную подборку.
        </div>
      </div>

      <div v-if="promptStep === 1" class="prompt_steps">
        <UniversalSelect
          v-model="selectedProfessions"
          :options="professionOptions"
          label="Какая профессия вам ближе всего?"
          description="Выбрать можно не больше 6"
          multiple
          :max-selected="6"
        />
      </div>

      <div v-else class="prompt_steps">
        <UniversalSelect
          v-model="selectedShiftType"
          :options="shiftTypeOptions"
          label="В какое время суток вам предпочтительнее выходить на заявки?"
          multiple
        />

        <UniversalSelect
          v-model="selectedShiftDuration"
          :options="shiftDurationOptions"
          label="Какая продолжительность заявки для вас более предпочтительна?"
          multiple
        />
      </div>
    </div>

    <div class="prompt_footer-block">
      <Button class="action_btns" color="grey" @click="onBack">
        {{ promptStep === 1 ? 'Закрыть' : 'Назад' }}
      </Button>
      <div class="step_progress">{{ `Шаг ${promptStep}/2` }}</div>
      <Button class="action_btns" @click="onNext">Далее</Button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import UniversalSelect from '@/components/atoms/UniversalSelect.vue'
import useGlobalLoading from '@/composables/useGlobalLoading'
import { INITIAL_TASK_FILTERS } from '@/constants/constants'
import { getAPIError } from '@/constants/helpers'

export default {
  components: { UniversalSelect },
  setup () {
    const { startLoading, stopLoading, loading } = useGlobalLoading()
    return { startLoading, stopLoading, loading }
  },
  props: {},
  data () {
    return {
      promptStep: 1,
      selectedProfessions: [],
      selectedShiftType: [],
      selectedShiftDuration: [],
    }
  },

  computed: {
    ...mapGetters('dictionary', ['professions', 'professionsLoading']),

    professionOptions () {
      return this?.professions?.map((p) => ({
        text: p?.name || '',
        value: p?.uuid || '',
      }))
    },

    shiftTypeOptions () {
      return [
        { text: 'Дневная', value: 'Дневная' },
        { text: 'Ночная', value: 'Ночная' },
      ]
    },

    shiftDurationOptions () {
      return [
        { text: '8 часов', value: 8 },
        { text: '12 часов', value: 12 },
      ]
    },
  },

  async mounted () {
    this.startLoading()
    await this.fetchProfessionsOnce()
    this.stopLoading()
  },
  
  beforeUnmount () {
    this.markPressedShowed()
  },

  methods: {
    ...mapActions('notifications', ['showNotification']),
    ...mapActions('dictionary', ['fetchProfessionsOnce']),
    ...mapMutations('user', ['setViewedFiltersTrue']),
    async markPressedShowed () {
      const response = await this.$axios.post('v2/user/filter')
      if (response.data.success) {
        this.setViewedFiltersTrue()
      } else {
        this.showNotification({
          type: 'error',
          text: getAPIError(response) || 'Ошибка при сохранении статуса фильтров',
        })
      }
    },
    onBack () {
      if (this.promptStep === 1) {
        localStorage.setItem('userTaskFilters', JSON.stringify(INITIAL_TASK_FILTERS))
        this.setViewedFiltersTrue()
        this.$router.push('/')
      } else {
        this.promptStep = 1
      }
    },

    async onNext () {
      if (this.promptStep === 1) {
        this.promptStep = 2
      } else {
        this.savePreferences()
        this.setViewedFiltersTrue()
        this.$router.push('/')
      }
    },

    savePreferences () {
      const initialFilters = JSON.parse(JSON.stringify(INITIAL_TASK_FILTERS))

      if (this.selectedProfessions?.length) initialFilters.professions = this.selectedProfessions.map((p) => p?.value)
      if (this.selectedShiftType?.length) initialFilters.shift_type = this.selectedShiftType.map((p) => p?.value)
      if (this.selectedShiftDuration?.length)
        initialFilters.shift_duration = this.selectedShiftDuration.map((p) => p?.value)

      localStorage.setItem('userTaskFilters', JSON.stringify(initialFilters))
    },
  },
}
</script>

<style lang="scss" scoped>
.welcome_prompt {
  width: 100%;
  height: 100%;
  min-height: auto;
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .prompt_block {
    margin: 0 auto;
    max-width: 674px;
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    height: max-content;
    align-items: center;
    .prompt_header-block {
      display: flex;
      width: 100%;
      flex-direction: column;
      gap: 12px;
      .header_text {
        font-size: 24px;
        font-weight: 600;
        line-height: 30px;
      }
      .description_text {
        color: #666;
        font-size: 16px;
        font-weight: 400;
        line-height: 22px;
      }
    }

    @media (max-width: 768px) {
      .prompt_header-block {
        .header_text {
          font-size: 20px;
          line-height: 28px;
        }
        .description_text {
          font-size: 14px;
        }
      }
    }
  }
  .prompt_footer-block {
    justify-self: flex-end;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 24px 96px;
    border-top: 1px solid #0000001a;
    .step_progress {
      color: #666;
    }
    .action_btns {
      width: 200px;
    }
    @media (max-width: 768px) {
      padding: 16px;
      gap: 15px;
      .action_btns {
        width: 100%;
      }
      .step_progress {
        display: none;
      }
    }
  }
}
</style>
