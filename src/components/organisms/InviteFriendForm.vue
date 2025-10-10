<template>
  <div class="invite_friend_form_container">
    <Form class="column_16" ref="friendLink">
      <Input v-model="editableUser.lastname" label="Фамилия" :rules="[rules.required, rules.cyrillicDash]" />
      <Input v-model="editableUser.firstname" label="Имя" :rules="[rules.required, rules.cyrillicDash]" />
      <Input
        v-model="editableUser.phone"
        label="Телефон"
        :rules="[rules.required, ...rulesSets.phone]"
        @input="onPhone"
      />
    </Form>

    <Input v-if="link" readonly :value="link">
      <template #right>
        <ButtonIconGhost @click="copyLink">
          <img src="@/assets/icon_deprecated/content_copy.svg" />
        </ButtonIconGhost>
      </template>
    </Input>

    <div class="action_block">
      <Button v-if="!link" :loading="loading" :disabled="loading" @click="generateLink">Получить ссылку</Button>
      <Button v-else :loading="loading" @click="copyLink">Скопировать ссылку</Button>
    </div>
  </div>
</template>

<script>
import { rules, rulesSets } from '@/constants/validations'
import { mapActions } from 'vuex'
import { formatPhone } from '@/constants/masks'

export default {
  name: 'InviteFriendForm',
  components: {},
  props: {},
  data () {
    return {
      rules,
      rulesSets,
      code: '',
      loading: false,
      editableUser: {
        lastname: null,
        firstname: null,
        phone: null,
      },
      link: null,
    }
  },
  computed: {},
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    ...mapActions('notifications', ['showNotification']),
    ...mapActions('profilePage', ['putPassport', 'putUserInitialData', 'fetchProfile', 'updateDocumentsStatuses']),

    copyLink () {
      navigator.clipboard.writeText(this.link)
      this.showNotification({ type: 'success', text: 'Ссылка скопирована' })
    },

    async generateLink () {
      if (this.loading || !this.$refs.friendLink.validate()) return
      this.loading = true
      const result = await this.$axios.post('v2/user/referrallink', this.editableUser, {
        errorMessage: 'Не предвиденная ошибка при генерации ссылки',
      })
      if (result.data.success) {
        this.showNotification({ type: 'success', text: 'Ссылка успешно сгенерирована' })
        this.link = result.data.data.referral_link
        this.$emit('referralInvited')
      }
      this.loading = false
    },

    onPhone (event) {
      const { formattedValue, cursorPosition } = formatPhone({
        value: event.target.value,
        cursorPosition: event.target.selectionEnd,
      })
      this.editableUser.phone = formattedValue ? '' : 'null'
      this.$nextTick(() => {
        this.editableUser.phone = formattedValue
        this.$nextTick(() => {
          event.target.setSelectionRange(cursorPosition, cursorPosition)
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.invite_friend_form_container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
