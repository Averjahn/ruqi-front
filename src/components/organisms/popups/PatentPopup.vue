<template>
  <PopupContainer class="patent_popup" title="Патент" maxWidth="670px" :loading="loading" @close="close">
    <Form ref="form" class="column_16 mb_24">
      <Input
        :rules="[rules.required]"
        label="Профессия (специальность, вид трудовой деятельности)"
        v-model="documentInfo.profession"
        clearable
      />

      <FieldsRow type="flex-flex">
        <Input :rules="[rules.required]" label="Серия" v-model="documentInfo.series" clearable />
        <Input :rules="[rules.required]" label="Номер" v-model="documentInfo.number" clearable />
      </FieldsRow>

      <FieldsRow type="flex-flex">
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
          label="Срок действия"
          format="DD.MM.YYYY"
          :airClassArr="['z_index_2']"
          :rules="[rules.required, rules.date]"
          :airOptions="{}"
          clearable
        />
      </FieldsRow>
    </Form>

    <div class="header">Прикрепите фото лицевой стороны</div>

    <Info yellow class="mb_16">
      На фотографии должны быть отчётливо видны серия, номер, основные данные, фотография. В поле зрения не должны
      попадать пальцы и посторонние предметы.
    </Info>

    <UploadPhoto
      class="mb_24"
      :loading="loadings.patent_front"
      :photo="photos.patent_front && photos.patent_front.thumb_path"
      :status="photos.patent_front && photos.patent_front.check_status"
      :samplePhoto="require('@/assets/img_deprecated/patent.png')"
      @deletePhoto="deletePhoto('patent_front')"
      @addFile="addFile($event, 'patent', 'patent_front')"
    />

    <div class="header">Прикрепите фото оборотной стороны</div>
    <Info yellow class="mb_16">
      На фотографии должны быть отчётливо видны серия, номер, основные данные, фотография. В поле зрения не должны
      попадать пальцы и посторонние предметы.
    </Info>

    <UploadPhoto
      class="mb_24"
      :loading="loadings.patent_back"
      :photo="photos.patent_back && photos.patent_back.thumb_path"
      :status="photos.patent_back && photos.patent_back.check_status"
      :samplePhoto="require('@/assets/img_deprecated/patent_2.png')"
      @deletePhoto="deletePhoto('patent_back')"
      @addFile="addFile($event, 'patent', 'patent_back')"
    />

    <div class="header">Прикрепите фото чека об уплате патента</div>

    <UploadPhoto
      class="mb_24"
      :loading="loadings.patent_receipt"
      :photo="photos.patent_receipt && photos.patent_receipt.thumb_path"
      :status="photos.patent_receipt && photos.patent_receipt.check_status"
      :samplePhoto="require('@/assets/img_deprecated/patent_receipt.png')"
      @deletePhoto="deletePhoto('patent_receipt')"
      @addFile="addFile($event, 'patent', 'patent_receipt')"
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
  profession: null,
  series: null,
  number: null,
  issue_date: null,
  expiration_date: null,
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
        type: 'patent',
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
        params: { type: 'patent' },
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
.patent_popup {
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
