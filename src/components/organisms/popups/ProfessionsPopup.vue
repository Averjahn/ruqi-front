<template>
  <PopupContainer
    class="professions_popup"
    title="Профессии и условия работы"
    :loading="loading"
    @close="$emit('close')"
  >
    <Form ref="form" class="form">
      <div>
        <div class="label mb_16">Профессии</div>
        <Select
          v-model="editableData.professions"
          item-value="uuid"
          :options="professions"
          searchable
          clearable
          multiselect
          ignoreOverflow
          returnObject
          :rules="[rules.required]"
        >
          <template #selection>
            <span v-if="editableData.professions.length === 1">{{ professionsTitle }}</span>
            <span v-else-if="editableData.professions.length > 1">
              Выбрано {{ editableData.professions.length }}
              {{ declensionOfNumber(editableData.professions.length, ['профессия', 'профессии', 'профессий']) }}
            </span>
          </template>
        </Select>
      </div>

      <div class="checkbox_container">
        <div class="label">Тип занятости</div>
        <Checkbox v-for="item in employmentType" v-model="editableData.employment_type" :key="item.id" :value="item.id">
          {{ item.name }}
        </Checkbox>
      </div>

      <div class="checkbox_container">
        <div class="label">График работы</div>
        <Checkbox v-model="editableData.work_schedule" value="2/2">2/2</Checkbox>
        <Checkbox v-model="editableData.work_schedule" value="5/2">5/2</Checkbox>
      </div>
    </Form>

    <template v-slot:footer>
      <div class="action_block">
        <Button type="outlined" :disabled="saveLoading" @click="$emit('close')">Отмена</Button>
        <Button :loading="saveLoading" @click="save">Сохранить</Button>
      </div>
    </template>
  </PopupContainer>
</template>

<script>
import PopupContainer from '@/components/atoms/PopupContainer.vue'
import { mapActions, mapGetters } from 'vuex'
import { rules } from '@/constants/validations'
import { declensionOfNumber } from '@/constants/helpers'
import { EMPLOYMENT_TYPE } from '@/constants/constants'

const emptyData = {
  professions: [],
  employment_type: [],
  work_schedule: [],
}

export default {
  name: 'ProfessionsPopup',
  components: { PopupContainer },
  props: {},
  data () {
    return {
      employmentType: Object.values(EMPLOYMENT_TYPE),
      rules,
      declensionOfNumber,
      loading: false,
      saveLoading: false,
      editableData: JSON.parse(JSON.stringify(emptyData)),
    }
  },
  computed: {
    ...mapGetters('dictionary', ['professions']),
    ...mapGetters('profilePage', ['profile']),
    professionsTitle () {
      return this.professions.find((item) => item.uuid === this.editableData?.professions?.[0])?.name || ''
    },
  },
  async mounted () {
    this.loading = true
    await Promise.all([this.fetchProfessionsOnce(), this.fetchProfileOnce()])
    this.loading = false
    this.init()
  },
  unmounted () {},
  watch: {
    profile: {
      handler () {
        this.init()
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions('dictionary', ['fetchProfessionsOnce']),
    ...mapActions('profilePage', ['fetchProfileOnce', 'putProfessions']),
    ...mapActions('notifications', ['showNotification']),
    init () {
      this.editableData = JSON.parse(
        JSON.stringify({
          professions: this.profile?.professions || [],
          employment_type: this.profile?.employment_type || [],
          work_schedule: this.profile?.work_schedule || [],
        }),
      )
    },

    async save () {
      this.saveLoading = true
      const result = await this.putProfessions(this.editableData)
      if (result) {
        this.showNotification({
          type: 'success',
          text: 'Профессии успешно изменены',
        })
        this.$emit('close')
      }
      this.saveLoading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.professions_popup {
  .form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .label {
    font-weight: 600;
  }
  .checkbox_container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .action_block {
    margin-top: 24px;
    display: flex;
    gap: 16px;
    & > div {
      flex: 1;
    }
  }
}
</style>
