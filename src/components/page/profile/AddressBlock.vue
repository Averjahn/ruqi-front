<template>
  <div class="addresses">
    <Popup v-model:show="isPopupOpen">
      <PopupContainer
        class="user_addresses_popup"
        maxWidth="1200px"
        title="Регионы поиска работы"
        @close="isPopupOpen = false"
      >
        <div class="popup_description">
          Рядом с указанными адресами будет производиться поиск и приоритетный показ новых объектов, заявок и работ
        </div>
        <Form ref="form">
          <div v-for="(item, index) in editableData" :key="index" class="field_row">
            <div class="field_col">
              <div class="label">{{ getLabel(index) }}</div>
              <div class="input_wrap">
                <SearchAutocomplete
                  class="address_input"
                  loading="false"
                  :disabled="loading"
                  v-model="item.address"
                  :rules="[rules.required]"
                  z-index="250"
                />
                <div v-if="index !== 0" class="delete_button" @click="onDelete(index)">
                  <img src="@/assets/icon_deprecated/cross_circle.svg" />
                </div>
              </div>
            </div>
          </div>
        </Form>
        <template v-slot:footer>
          <ButtonText class="mb_24" type="s" @click="addAddress">
            <img src="@/assets/icon_deprecated/plus_circle.svg" />
            Добавить адрес
          </ButtonText>
          <div class="action_block">
            <Button type="outlined" :disabled="loading" @click="onCancel">Отмена</Button>
            <Button :loading="loading" @click="onSave">Сохранить</Button>
          </div>
        </template>
      </PopupContainer>
    </Popup>

    <div class="user-info__sub-title mb_8">
      Регионы поиска работы
      <ButtonText type="s" @click="isPopupOpen = true">Изменить</ButtonText>
    </div>

    <div class="description">
      Рядом с указанными адресами будет производиться поиск и приоритетный показ новых объектов, заявок и работ
    </div>

    <Divider class="my_16" />

    <section v-if="addresses" class="addresses__list">
      <article v-for="(item, index) in addresses" :key="index" class="addresses__item">
        <div class="addresses__item-label">
          {{ getLabel(index) }}
        </div>
        <div class="addresses__item-value">
          {{ item.address }}
        </div>
      </article>
    </section>

    <div v-if="!addresses">Адреса не указаны</div>
  </div>
</template>

<script>
import PopupContainer from '@/components/atoms/PopupContainer.vue'
import { rules, rulesSets } from '@/constants/validations'
import SearchAutocomplete from '@/components/organisms/SearchAutocomplete.vue'
import { mapActions } from 'vuex'

export default {
  components: { PopupContainer, SearchAutocomplete },
  props: {
    addresses: {
      type: Object,
      default: null,
    },
  },
  data () {
    return {
      rules,
      rulesSets,
      editableData: {},
      loading: false,
      isPopupOpen: false,
    }
  },
  watch: {
    addresses: {
      handler () {
        this.init()
      },
      deep: true,
    },
  },
  async mounted () {
    this.init()
  },
  methods: {
    ...mapActions('profilePage', ['putAddress']),
    ...mapActions('notifications', ['showNotification']),
    init () {
      this.editableData = JSON.parse(JSON.stringify(this.addresses))
    },
    async onSave () {
      if (!this.$refs.form.validate()) {
        this.showNotification({ type: 'error', text: 'Заполните все поля' })
        return
      }
      if (this.loading) return
      this.loading = true
      const result = await this.putAddress(this.editableData)
      if (result) {
        this.isPopupOpen = false
        this.showNotification({
          type: 'success',
          text: 'Регионы поиска работы успешно изменены',
        })
      }
      this.loading = false
    },
    onDelete (index) {
      if (this.loading) return
      this.editableData.splice(index, 1)
    },
    addAddress () {
      if (this.loading) return
      this.editableData.push({ address: '' })
    },
    getLabel (index) {
      return index === 0 ? 'Домашний' : 'Адрес работы ' + index
    },
    onCancel () {
      this.init()
      this.isPopupOpen = false
    },
  },
}
</script>

<style lang="scss" scoped>
.addresses {
  .user-info__sub-title {
    font-size: 18px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .addresses__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .addresses__item-label {
    color: #7a91a9;
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 4px;
  }

  .addresses__item-value {
    font-size: 16px;
    font-weight: 600;
  }
}
.user_addresses_popup {
  .field_row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .field_col {
    flex: 1;
    margin-bottom: 16px;
  }
  .label {
    color: #7a91a9;
    margin-bottom: 8px;
  }
  .address_input {
    width: 100%;
  }
  .action_block {
    margin-top: 8px;
    display: flex;
    gap: 16px;
    & > div {
      flex: 1;
    }
  }

  .input_wrap {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .input {
    flex: 1;
  }
  .delete_button {
    cursor: pointer;
  }

  .popup_description {
    margin-bottom: 24px;
  }
}
</style>
