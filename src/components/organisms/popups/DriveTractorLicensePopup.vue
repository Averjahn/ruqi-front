<template>
  <PopupContainer
    class="medical_book_popup"
    title="Удостоверение тракториста-машиниста"
    maxWidth="670px"
    :loading="loading"
    @close="close"
  >
    <div class="header">Введите данные серии-номера и срока действия водительского удостоверения</div>

    <Form ref="form" class="column_16 mb_24">
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
          @userEvent="onIssueDate"
          clearable
        />
        <DatePicker
          ref="expiration"
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

    <div class="header">Прикрепите фото лицевой стороны удостоверения</div>

    <Info yellow class="mb_16">
      На фотографии должны быть отчётливо видны серия, номер, основные данные, фотография. В поле зрения не должны
      попадать пальцы и посторонние предметы.
    </Info>

    <UploadPhoto
      class="mb_24"
      :loading="loadings.tractor_driver_license_front"
      :photo="photos.tractor_driver_license_front && photos.tractor_driver_license_front.thumb_path"
      :status="photos.tractor_driver_license_front && photos.tractor_driver_license_front.check_status"
      :samplePhoto="require('@/assets/img_deprecated/tractor_license.png')"
      @deletePhoto="deletePhoto('tractor_driver_license_front')"
      @addFile="addFile($event, 'tractor_driver_license', 'tractor_driver_license_front')"
    />

    <div class="header">Прикрепите фото оборота удостоверения</div>
    <Info yellow class="mb_16">
      На фотографии должны быть отчётливо видны серия, номер, основные данные, фотография. В поле зрения не должны
      попадать пальцы и посторонние предметы.
    </Info>

    <UploadPhoto
      class="mb_24"
      :loading="loadings.tractor_driver_license_back"
      :photo="photos.tractor_driver_license_back && photos.tractor_driver_license_back.thumb_path"
      :status="photos.tractor_driver_license_back && photos.tractor_driver_license_back.check_status"
      :samplePhoto="require('@/assets/img_deprecated/tractor_license_2.png')"
      @deletePhoto="deletePhoto('tractor_driver_license_back')"
      @addFile="addFile($event, 'tractor_driver_license', 'tractor_driver_license_back')"
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
      loadingPhoto: false,
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

    onIssueDate (val) {
      if (!val) return
      if (this.$dayjs(val, 'DD.MM.YYYY').isValid()) {
        if (this.documentInfo.expiration_date) this.$refs.expiration.$refs.input.showUpdateAnimation()
        this.documentInfo.expiration_date = this.$dayjs(val).add(10, 'year').format('DD.MM.YYYY')
        this.$refs.expiration.validate()
      }
    },

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
        type: 'tractor_driver_license',
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
        params: { type: 'tractor_driver_license' },
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
  //  overflow: hidden;
  .popup_scroll_wrap {
    height: calc(100% - 100px);
    overflow-y: auto;
  }
  .header {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  .action_block {
    margin-top: 8px;
    display: flex;
    gap: 16px;
    & > div {
      flex: 1;
    }
  }

  .photo_block {
    margin-bottom: 24px;
  }
  .field_row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }

  .field_col {
    flex: 1;
    margin-bottom: 12px;
    &.fix_width {
      min-width: 187px;
      flex: 1;
    }
  }
  .medical_number {
    min-width: 170px;
  }
  .data_container {
    flex-wrap: nowrap;
    flex: 1;
  }
  .label {
    color: #7a91a9;
    margin-bottom: 8px;
  }
  .data_input {
    display: block;
  }
  @media (max-width: 470px) {
    .medical_number {
      min-width: 100%;
    }
    .data_container {
      flex-wrap: wrap;
    }
  }
}
</style>
