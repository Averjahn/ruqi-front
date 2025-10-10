<template>
  <PopupContainer :loading="loading" class="snils_popup" title="Добавление СНИЛС" maxWidth="670px" @close="close">
    <Form ref="form" class="mb_24">
      <Input
        :rules="[rules.isSnilsValid]"
        label="Введите номер документа"
        placeholder="XXX-XXX-XXX XX"
        :value="snils"
        clearable
        @input="onSnils"
      />
    </Form>

    <div class="instructions_block mb_24">
      <div class="header">Как найти номер СНИЛС?</div>
      <div class="description">
        Если у вас нет под рукой пластиковой карты СНИЛС, вы можете найти его в своем профиле на портале Госуслуги:
      </div>
      <ol>
        <li>Авторизуйтесь на сайте или в приложении Госуслуг</li>
        <li>Перейдите в раздел «Профиль» → «Документы»</li>
        <li>Найдите номер СНИЛС в списке ваших данных</li>
      </ol>
      <div class="photo_block">
        <img src="@/assets/imgs/snils_gosuslugi.jpg" />
        <img src="@/assets/imgs/snils.jpg" />
      </div>
    </div>

    <template v-slot:footer>
      <div class="button_row_global mt_8">
        <Button type="outlined" :disabled="loading || disabled" @click="close">Отмена</Button>
        <Button :disabled="disabled" :loading="loading" @click="save">Сохранить</Button>
      </div>
    </template>
  </PopupContainer>
</template>

<script>
import PopupContainer from '@/components/atoms/PopupContainer.vue'
import { rules, rulesSets } from '@/constants/validations'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { getAPIError } from '@/constants/helpers'
import { formatNumericString } from '@/constants/masks'

export default {
  name: 'SnilsPopup',
  components: { PopupContainer },
  props: {},
  data () {
    return {
      rules,
      rulesSets,
      snils: null,
      loading: false,
    }
  },
  computed: {
    ...mapGetters('profilePage', ['profile']),
  },
  async mounted () {
    await this.fetchProfileOnce()
    const { formattedValue } = formatNumericString({
      value: this.profile?.user?.settings?.snils,
      pattern: '***-***-*** **',
    })
    this.snils = formattedValue || null
  },
  unmounted () {},
  watch: {},
  methods: {
    ...mapActions('profilePage', ['fetchProfileOnce']),
    ...mapActions('notifications', ['showNotification']),
    ...mapMutations('profilePage', ['setSnils']),

    close () {
      this.$emit('close')
    },

    onSnils (e) {
      const { formattedValue, cursorPosition } = formatNumericString({
        value: e.target.value,
        pattern: '***-***-*** **',
        cursorPosition: e.target.selectionEnd,
      })
      this.snils = formattedValue ? '' : 'null'
      this.$nextTick(() => {
        this.snils = formattedValue
        this.$nextTick(() => {
          e.target.setSelectionRange(cursorPosition, cursorPosition)
        })
      })
    },

    async save () {
      if (!this.$refs.form.validate()) {
        this.showNotification({ type: 'error', text: 'Заполните все поля' })
        return
      }
      if (this.loading) return
      this.loading = true
      const snils = this.snils.replace(/\D/g, '')
      const response = await this.$axios.post('v2/user/snils', {
        snils,
      })
      if (response?.data?.success) {
        this.setSnils(snils)
        this.showNotification({ type: 'success', text: 'Данные успешно сохранены' })
      } else {
        this.showNotification({ type: 'error', text: getAPIError(response) || 'Ошибка при сохранении номера СНИЛС' })
      }
      this.loading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.snils_popup {
  .popup_scroll_wrap {
    height: calc(100% - 100px);
    overflow-y: auto;
  }

  .header {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
  }
  .instructions_block {
    padding: 24px;
    background: #eff2fd;
    border-radius: 16px;
    font-size: 14px;
    .header {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 8px;
    }
    .description {
      margin-bottom: 10px;
    }
    ol {
      line-height: 24px;
      list-style-type: decimal;
      color: #666666;
      margin-left: 18px;
      margin-bottom: 24px;
    }
  }

  .photo_block {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    img {
      flex: 1;
      border-radius: 12px;
      max-width: calc(50% - 6px);
    }
  }
}
</style>
