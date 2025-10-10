<template>
  <PopupContainer class="about_user_popup" title="О себе" :loading="loading" @close="$emit('close')">
    <Form ref="form">
      <Textarea
        v-model="aboutYourself"
        :rules="[rules.required]"
        :disabled="saveLoading"
        height="200px"
        placeholder="Расскажите заказчикам о себе"
      />
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
import { rules } from '@/constants/validations'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AboutUserPopup',
  components: { PopupContainer },
  props: {},
  data () {
    return {
      rules,
      loading: false,
      saveLoading: false,
      aboutYourself: '',
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
    'profile.about_yourself': {
      handler () {
        this.init()
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions('profilePage', ['fetchProfileOnce', 'putAboutYourself']),
    ...mapActions('notifications', ['showNotification']),

    init () {
      this.aboutYourself = JSON.parse(JSON.stringify(this.profile?.about_yourself || ''))
    },

    async save () {
      if (!this.$refs.form.validate()) return
      this.saveLoading = true
      const result = await this.putAboutYourself(this.aboutYourself)
      if (result) {
        this.showNotification({
          type: 'success',
          text: 'Данные о себе успешно сохранены',
        })
        this.$emit('close')
      }
      this.saveLoading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.about_user_popup {
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
