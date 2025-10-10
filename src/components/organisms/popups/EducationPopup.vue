<template>
  <PopupContainer class="education_popup" title="Образование" :loading="loading" @close="$emit('close')">
    <Form ref="form" class="form">
      <div>
        <div class="label">Уровень образования</div>
        <!--<Select v-model="citizenship" :options="[]" :rules="[rules.required]" />-->
        <Input v-model="education.level" :rules="[rules.required]" :disabled="saveLoading" clearable />
      </div>
      <div>
        <div class="label">Учебное заведение</div>
        <Input v-model="education.institution" :rules="[rules.required]" :disabled="saveLoading" clearable />
      </div>
      <div>
        <div class="label">Факультет</div>
        <Input v-model="education.faculty" :rules="[rules.required]" :disabled="saveLoading" clearable />
      </div>
      <div>
        <div class="label">Специальность</div>
        <Input v-model="education.specialty" :rules="[rules.required]" :disabled="saveLoading" clearable />
      </div>
      <div>
        <div class="label">Год окончания</div>
        <DatePicker
          v-model:date="education.graduation_year"
          class="data_input"
          format="YYYY"
          :airClassArr="['z_index_2']"
          :rules="[rules.required, rules.year]"
          :airOptions="{ view: 'years', minView: 'years', maxDate: $dayjs() }"
          :disabled="saveLoading"
          clearable
          wide
        />
      </div>
    </Form>

    <template v-slot:footer>
      <div class="action_block">
        <Button v-if="educationEditId" type="outlined" color="red" :disabled="saveLoading" @click="onDelete">
          Удалить
        </Button>
        <Button v-else type="outlined" :disabled="saveLoading" @click="$emit('close')">Отмена</Button>
        <Button :loading="saveLoading" @click="save">Сохранить</Button>
      </div>
    </template>
  </PopupContainer>
</template>

<script>
import PopupContainer from '@/components/atoms/PopupContainer.vue'
import { rules } from '@/constants/validations'
import { mapActions, mapGetters } from 'vuex'

const emptyEducation = {
  level: '',
  institution: '',
  faculty: '',
  specialty: '',
  graduation_year: '',
}

export default {
  name: 'AboutUserPopup',
  components: { PopupContainer },
  props: {
    educationEditId: { type: String },
  },
  data () {
    return {
      rules,
      citizenship: '',
      graduation_year: null,
      loading: false,
      saveLoading: false,
      education: JSON.parse(JSON.stringify(emptyEducation)),
    }
  },
  computed: {
    ...mapGetters('profilePage', ['profile']),
  },
  async mounted () {
    this.loading = true
    await this.fetchProfileOnce()
    this.loading = false
    this.init()
  },
  unmounted () {},
  watch: {
    educationEditId () {
      this.init()
    },
  },
  methods: {
    ...mapActions('profilePage', ['fetchProfileOnce', 'putEducation', 'editEducation', 'deleteEducations']),
    ...mapActions('notifications', ['showNotification']),

    init () {
      this.education = JSON.parse(
        JSON.stringify(this.profile?.education?.find((item) => item.id === this.educationEditId) || emptyEducation),
      )
    },

    async save () {
      if (!this.$refs.form.validate()) return
      this.saveLoading = true
      const result = this.education?.id
        ? await this.editEducation(this.education)
        : await this.putEducation(this.education)
      if (result) {
        this.showNotification({
          type: 'success',
          text: 'Образование успешно изменено',
        })
        this.$emit('close')
      }
      this.saveLoading = false
    },

    async onDelete () {
      this.saveLoading = true
      const result = await this.deleteEducations([this.educationEditId])
      if (result) {
        this.showNotification({
          type: 'success',
          text: 'Образование успешно удалено',
        })
        this.$emit('close')
      }
      this.saveLoading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.education_popup {
  .form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .label {
    color: #666666;
    margin-bottom: 4px;
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
