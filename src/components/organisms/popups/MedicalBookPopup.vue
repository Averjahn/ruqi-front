<template>
  <PopupContainer
    :loading="loading"
    class="medical_book_popup"
    title="Медицинская книжка"
    maxWidth="670px"
    @close="close"
  >
    <div class="header">Введите данные серии-номера и срока действия медицинской книжки</div>
    <Form ref="form" class="column_16 mb_24">
      <FieldsRow type="flex-flex-flex">
        <Input :rules="[rules.required]" label="Номер" v-model="documentInfo.number" clearable />
        <DatePicker
          v-model:date="documentInfo.issue_date"
          label="Дата выдачи"
          format="DD.MM.YYYY"
          :airClassArr="['z_index_2']"
          :rules="[rules.required, rules.date]"
          :airOptions="{ maxDate: $dayjs() }"
          clearable
        />
        <DatePicker
          v-model:date="documentInfo.expiration_date"
          :label="getPickerLabel"
          format="DD.MM.YYYY"
          :airClassArr="['z_index_2']"
          :rules="[rules.required, rules.date]"
          :airOptions="{ minDate: $dayjs() }"
          :error="isExpired"
          clearable
        />
      </FieldsRow>
    </Form>

    <div class="header">Прикрепите фото основного разворота медицинской книжки (стр.1–2)</div>
    <Info yellow class="mb_16">
      На фотографии должны быть отчётливо видны серия, номер, основные данные, фотография. В поле зрения не должны
      попадать пальцы и посторонние предметы.
    </Info>

    <UploadPhoto
      class="mb_24"
      :loading="loadings.medical_book_1_2"
      :photo="photos.medical_book_1_2 && photos.medical_book_1_2.thumb_path"
      :status="photos.medical_book_1_2 && photos.medical_book_1_2.check_status"
      :samplePhoto="require('@/assets/img_deprecated/sample_medical_book.jpg')"
      @deletePhoto="deletePhoto('medical_book_1_2')"
      @addFile="addFile($event, 'medical_book', 'medical_book_1_2')"
    />

    <div class="header">Прикрепите фото второго разворота медицинской книжки (стр 28-29)</div>
    <Info yellow class="mb_16">
      На фотографии должны быть отчётливо видны серия, номер, основные данные, фотография. В поле зрения не должны
      попадать пальцы и посторонние предметы.
    </Info>

    <UploadPhoto
      class="mb_24"
      :loading="loadings.medical_book_3_4"
      :photo="photos.medical_book_3_4 && photos.medical_book_3_4.thumb_path"
      :status="photos.medical_book_3_4 && photos.medical_book_3_4.check_status"
      :samplePhoto="require('@/assets/img_deprecated/sample_medical_book_2.jpg')"
      @deletePhoto="deletePhoto('medical_book_3_4')"
      @addFile="addFile($event, 'medical_book', 'medical_book_3_4')"
    />

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
import UploadPhoto from '@/components/organisms/UploadPhoto.vue'
import { rules, rulesSets } from '@/constants/validations'
import { mapActions } from 'vuex'
import { isJSON, getAPIError, convertToFrontFormat, convertToBackFormat } from '@/constants/helpers'
import useDocumentPhotos from '@/composables/useDocumentPhotos'

const initialDocumentInfo = {
  number: null,
  issue_date: null,
  expiration_date: null,
}

export default {
  name: 'MedicalBookPopup',
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
      documentInfo: JSON.parse(JSON.stringify(initialDocumentInfo)),
      documentInfoServer: JSON.parse(JSON.stringify(initialDocumentInfo)),
      loading: false,
      loadingPhoto: false,
    }
  },
  computed: {
    disabled () {
      return JSON.stringify(this.documentInfo) === JSON.stringify(this.documentInfoServer)
    },
    isExpired () {
      if (!this.documentInfo?.expiration_date) return false
      const expirationDate = this.$dayjs(this.documentInfo.expiration_date, 'DD.MM.YYYY')
      return expirationDate.isBefore(this.$dayjs(), 'day')
    },
    getPickerLabel () {
      return this.isExpired ? 'Срок действия истек' : 'Срок действия'
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
        type: 'medical_book',
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
        params: { type: 'medical_book' },
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
.medical_book_popup {
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
