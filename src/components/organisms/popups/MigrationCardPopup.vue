<template>
  <PopupContainer
    class="migration_card_popup"
    title="Миграционная карта"
    maxWidth="670px"
    :loading="loading"
    @close="close"
  >
    <div class="header">Введите данные указанные в миграционной карте</div>
    <Form ref="form" class="column_16 mb_24">
      <Select
        :options="visitPurposes"
        label="Цель визита"
        :rules="[rules.required]"
        v-model="documentInfo.visit_purpose"
      />

      <FieldsRow type="flex-flex">
        <DatePicker
          v-model:date="documentInfo.stay_from"
          label="Срок прибывания с"
          format="DD.MM.YYYY"
          :airClassArr="['z_index_2']"
          :rules="[rules.required, rules.date]"
          :airOptions="{}"
          clearable
        />
        <DatePicker
          v-model:date="documentInfo.stay_to"
          label="По"
          format="DD.MM.YYYY"
          :airClassArr="['z_index_2']"
          :rules="[rules.required, rules.date]"
          :airOptions="{}"
          clearable
        />
      </FieldsRow>

      <Input
        :rules="[rules.required]"
        label="Сведения о приглашающей стороне"
        v-model="documentInfo.inviting_party_information"
      />
    </Form>

    <div class="header">Прикрепите фото Стороны А</div>

    <Info yellow class="mb_16">
      На фотографии должны быть отчётливо видны серия, номер, основные данные, фотография. В поле зрения не должны
      попадать пальцы и посторонние предметы.
    </Info>

    <UploadPhoto
      class="mb_24"
      :loading="loadings.migration_card_front"
      :photo="photos.migration_card_front && photos.migration_card_front.thumb_path"
      :status="photos.migration_card_front && photos.migration_card_front.check_status"
      :samplePhoto="require('@/assets/img_deprecated/migration_card_front.png')"
      @deletePhoto="deletePhoto('migration_card_front')"
      @addFile="addFile($event, 'migration_card', 'migration_card_front')"
    />

    <div class="header">Прикрепите фото Стороны B</div>
    <Info yellow class="mb_16">
      На фотографии должны быть отчётливо видны серия, номер, основные данные, фотография. В поле зрения не должны
      попадать пальцы и посторонние предметы.
    </Info>

    <UploadPhoto
      class="mb_24"
      :loading="loadings.migration_card_back"
      :photo="photos.migration_card_back && photos.migration_card_back.thumb_path"
      :status="photos.migration_card_back && photos.migration_card_back.check_status"
      :samplePhoto="require('@/assets/img_deprecated/migration_card_back.png')"
      @deletePhoto="deletePhoto('migration_card_back')"
      @addFile="addFile($event, 'migration_card', 'migration_card_back')"
    />

    <template v-slot:footer>
      <div class="button_row_global">
        <Button type="outlined" :disabled="loading || disabled" @click="close">Отмена</Button>
        <Button :disabled="disabled" :loading="loading" @click="save">Сохранить</Button>
      </div>
    </template>
  </PopupContainer>
</template>

<script>
import PopupContainer from '@/components/atoms/PopupContainer.vue'
import UploadPhoto from '@/components/organisms/UploadPhoto.vue'
import { rules, rulesSets } from '@/constants/validations'
import { mapActions } from 'vuex'
import { isJSON, getAPIError, convertToFrontFormat, convertToBackFormat } from '@/constants/helpers'
import useDocumentPhotos from '@/composables/useDocumentPhotos'

const visitPurposes = [
  { id: 'tourism', name: 'Туризм' },
  { id: 'study', name: 'Учёба' },
  { id: 'work', name: 'Работа' },
  { id: 'transit', name: 'Транзит' },
  { id: 'private', name: 'Частный' },
  { id: 'official', name: 'Служебный' },
]

const initialDocumentInfo = {
  visit_purpose: null,
  stay_from: null,
  stay_to: null,
  inviting_party_information: null,
}

export default {
  name: 'DriveLicensePopup',
  components: { PopupContainer, UploadPhoto },
  props: {
    options: {
      type: Array,
      default: () => [],
    },
  },
  setup () {
    const { photos, loadings, deletePhoto, addFile } = useDocumentPhotos({
      needUpdateDocumentsStatuses: true,
    })

    return {
      photos,
      loadings,
      deletePhoto,
      addFile,
    }
  },
  data () {
    return {
      rules,
      rulesSets,
      visitPurposes,
      documentInfo: JSON.parse(JSON.stringify(initialDocumentInfo)),
      documentInfoServer: JSON.parse(JSON.stringify(initialDocumentInfo)),
      loading: false,
    }
  },
  computed: {
    disabled () {
      return JSON.stringify(this.documentInfo) === JSON.stringify(this.documentInfoServer)
    },
  },
  mounted () {
    this.fetchData()
  },
  unmounted () {},
  watch: {},
  methods: {
    ...mapActions('notifications', ['showNotification']),
    ...mapActions('profilePage', ['updateDocumentsStatuses']),

    close () {
      this.$emit('close')
    },

    async save () {
      if (!this.$refs.form.validate()) {
        this.showNotification({ type: 'error', text: 'Заполните все поля' })
        return
      }
      if (this.loading) return
      this.loading = true
      const response = await this.$axios.put('v2/user/document ', {
        type: 'migration_card',
        ...convertToBackFormat(this.documentInfo),
      })
      if (response?.data?.success) {
        this.updateDocumentsStatuses()
        this.documentInfoServer = JSON.parse(JSON.stringify(this.documentInfo))
        this.showNotification({ type: 'success', text: 'Данные успешно сохранены' })
      } else {
        this.showNotification({ type: 'error', text: getAPIError(response) || 'Ошибка при сохранении данных' })
      }
      this.loading = false
    },

    async fetchData () {
      this.loading = true
      const response = await this.$axios.get('v2/user/documents', {
        params: { type: 'migration_card' },
      })
      if (response?.data?.success) {
        const data = response?.data?.data?.[0] || {}
        if (data.files) this.photos = data.files
        this.documentInfoServer = isJSON(data?.json)
          ? JSON.parse(data.json)
          : JSON.parse(JSON.stringify(initialDocumentInfo))
        convertToFrontFormat(this.documentInfoServer)
        this.documentInfo = JSON.parse(JSON.stringify(this.documentInfoServer))
      } else {
        this.showNotification({ type: 'error', text: getAPIError(response) || 'Ошибка получения данных документа' })
      }
      this.loading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.migration_card_popup {
  .popup_scroll_wrap {
    height: calc(100% - 100px);
    overflow-y: auto;
  }
  .header {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
  }
}
</style>
