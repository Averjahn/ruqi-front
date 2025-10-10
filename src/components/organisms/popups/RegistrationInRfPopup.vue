<template>
  <PopupContainer
    :loading="loading"
    class="inn_popup"
    title="Документ о регистрации в РФ"
    maxWidth="670px"
    @close="close"
  >
    <Form ref="form" class="mb_24">
      <FieldsRow type="flex-flex">
        <DatePicker
          v-model:date="documentInfo.issue_date"
          label="Дата получения регистрации"
          format="DD.MM.YYYY"
          :airClassArr="['z_index_2']"
          :rules="[rules.required, rules.date]"
          :airOptions="{ maxDate: $dayjs() }"
          clearable
          wide
        />
        <DatePicker
          v-model:date="documentInfo.expiration_date"
          label="Дата окончания регистрации"
          format="DD.MM.YYYY"
          :airClassArr="['z_index_2']"
          :rules="[rules.required, rules.date]"
          clearable
          wide
        />
      </FieldsRow>
    </Form>

    <div class="header">
      Прикрепите сканы или фото уведомления о прибытии или другого документа о регистрации в РФ (лицевая сторона)
    </div>
    <Info yellow class="mb_16">
      На фотографии должны быть отчётливо видны номер, основные данные, фотография. В поле зрения не должны попадать
      пальцы и посторонние предметы.
    </Info>
    <UploadPhoto
      class="mb_24"
      :loading="loadings.document_registration_in_rf"
      :photo="photos.document_registration_in_rf?.thumb_path"
      :status="photos.document_registration_in_rf?.check_status"
      @deletePhoto="deletePhoto('document_registration_in_rf')"
      @addFile="addFile($event, 'document_registration_in_rf', 'document_registration_in_rf')"
    />

    <div class="header">
      Прикрепите сканы или фото уведомления о прибытии или другого документа о регистрации в РФ (оборотная сторона)
    </div>
    <Info yellow class="mb_16">
      На фотографии должны быть отчётливо видны номер, основные данные, фотография. В поле зрения не должны попадать
      пальцы и посторонние предметы.
    </Info>
    <UploadPhoto
      class="mb_24"
      :loading="loadings.document_registration_in_rf_back"
      :photo="photos.document_registration_in_rf_back?.thumb_path"
      :status="photos.document_registration_in_rf_back?.check_status"
      @deletePhoto="deletePhoto('document_registration_in_rf_back')"
      @addFile="addFile($event, 'document_registration_in_rf', 'document_registration_in_rf_back')"
    />

    <div class="header">
      Прикрепите сканы или фото уведомления о прибытии или другого документа о регистрации в РФ (доп.)
    </div>
    <Info yellow class="mb_16">
      На фотографии должны быть отчётливо видны номер, основные данные, фотография. В поле зрения не должны попадать
      пальцы и посторонние предметы.
    </Info>
    <UploadPhoto
      class="mb_24"
      :loading="loadings.document_registration_in_rf_add"
      :photo="photos.document_registration_in_rf_add?.thumb_path"
      :status="photos.document_registration_in_rf_add?.check_status"
      @deletePhoto="deletePhoto('document_registration_in_rf_add')"
      @addFile="addFile($event, 'document_registration_in_rf', 'document_registration_in_rf_add')"
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
import { convertToFrontFormat, convertToBackFormat, isJSON } from '@/constants/helpers'
import { mapActions, mapMutations } from 'vuex'
import { getAPIError } from '@/constants/helpers'
import useDocumentPhotos from '@/composables/useDocumentPhotos'

const initialDocumentInfo = {
  issue_date: null,
  expiration_date: null,
}

export default {
  name: 'RegistrationInRfPopup',
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
        type: 'document_registration_in_rf',
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
        params: { type: 'document_registration_in_rf' },
      })
      if (response?.data?.success) {
        const data = response?.data?.data?.find((reg) => reg?.check_status !== 'declined' && reg?.status !== 'expired') || response?.data?.data?.[0] || {}
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
.inn_popup {
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
