<template>
  <div class="passport_popup">
    <template v-if="citizenship === 'RU'">
      <div class="header">Прикрепите фото основного разворота паспорта (стр.1–2)</div>
      <Info yellow class="mb_16">
        На фотографии должны быть отчётливо видны серия, номер, основные данные, фотография. В поле зрения не должны
        попадать пальцы и посторонние предметы.
      </Info>

      <UploadPhoto
        class="mb_24"
        :loading="loadings.passport_page_2_3"
        :photo="photos.passport_page_2_3 && photos.passport_page_2_3.thumb_url"
        :status="photos.passport_page_2_3 && photos.passport_page_2_3.check_status"
        :samplePhoto="require('@/assets/img_deprecated/sample_passport.jpg')"
        @deletePhoto="deletePhoto('passport_page_2_3')"
        @addFile="addPhoto($event, 'passport_page_2_3')"
      />

      <div class="header">Прикрепите сканы или фото разворота паспорта с пропиской (4-5 страница)</div>
      <Info yellow class="mb_16">
        На фотографии должны быть отчётливо видны серия, номер, основные данные, штамп прописки. В поле зрения не должны
        попадать пальцы и посторонние предметы.
      </Info>

      <UploadPhoto
        class="mb_24"
        :loading="loadings.passport_page_4_5"
        :photo="photos.passport_page_4_5 && photos.passport_page_4_5.thumb_url"
        :status="photos.passport_page_4_5 && photos.passport_page_4_5.check_status"
        :samplePhoto="require('@/assets/img_deprecated/sample_passport_2.jpg')"
        @deletePhoto="deletePhoto('passport_page_4_5')"
        @addFile="addPhoto($event, 'passport_page_4_5')"
      />
    </template>

    <template v-if="['BY', 'AM', 'KZ', 'KG'].includes(citizenship)">
      <div class="header">Прикрепите сканы или фото документа, удостоверяющего личность</div>
      <Info yellow class="mb_16">
        На фотографии должны быть отчётливо видны номер, основные данные, фотография. В поле зрения не должны попадать
        пальцы и посторонние предметы.
      </Info>

      <UploadPhoto
        class="mb_24"
        :loading="loadings[passportType]"
        :photo="photos[passportType] && photos[passportType].thumb_url"
        :status="photos[passportType] && photos[passportType].check_status"
        @deletePhoto="deletePhoto(passportType)"
        @addFile="addPhoto($event, passportType)"
      />
      <div v-if="citizenship === 'KG'" class="header">Обратная сторона документа (если ID-карта)</div>
      <UploadPhoto v-if="citizenship === 'KG'"
        class="mb_24"
        :loading="loadings['passport_kg_additional']"
        :photo="photos['passport_kg_additional'] && photos['passport_kg_additional'].thumb_url"
        :status="photos['passport_kg_additional'] && photos['passport_kg_additional'].check_status"
        @deletePhoto="deletePhoto('passport_kg_additional')"
        @addFile="addPhoto($event, 'passport_kg_additional')"
      />
    </template>

    <template v-if="citizenship === 'OTHER'">
      <div class="header">Прикрепите сканы или фото документа, удостоверяющего личность</div>
      <Info yellow class="mb_16">
        На фотографии должны быть отчётливо видны серия, номер, основные данные, фотография. В поле зрения не должны
        попадать пальцы и посторонние предметы.
      </Info>

      <UploadPhoto
        class="mb_24"
        :loading="loadings.passport_other"
        :photo="photos.passport_other && photos.passport_other.thumb_url"
        :status="photos.passport_other && photos.passport_other.check_status"
        @deletePhoto="deletePhoto('passport_other')"
        @addFile="addPhoto($event, 'passport_other')"
      />
    </template>
  </div>
  <div>
    <div class="button_row_global mt_8">
      <Button type="outlined" :disabled="loading" @click="$emit('onBack')">Назад</Button>
      <Button :loading="loading" @click="$emit('close')">Далее</Button>
    </div>
  </div>
</template>

<script>
import PopupContainer from '@/components/atoms/PopupContainer.vue'
import UploadPhoto from '@/components/organisms/UploadPhoto.vue'
import usePassportPhotos from '@/composables/usePassportPhotos'
import { mapGetters } from 'vuex'

export default {
  name: 'PassportPopup',
  components: { UploadPhoto },
  props: {},
  setup () {
    const { photos, loadings, deletePhoto, addPhoto, fetchPhoto } = usePassportPhotos({
      needUpdateDocumentsStatuses: true,
    })

    return {
      photos,
      loadings,
      deletePhoto,
      addPhoto,
      fetchPhoto,
    }
  },
  data () {
    return {
      loading: false,
    }
  },
  computed: {
    ...mapGetters('profilePage', ['profile']),
    citizenship () {
      return this.profile?.user?.citizenship
    },
    passportType () {
      if (this.citizenship === 'BY') {
        return 'passport_by'
      } else if (this.citizenship === 'AM') {
        return 'passport_am'
      } else if (this.citizenship === 'KZ') {
        return 'passport_kz'
      }
      return 'passport_kg'
    },
  },
  mounted () {
    this.fetchPhoto()
  },
  unmounted () {},
  watch: {
    'loadings.all': {
      handler (val) {
        this.$emit('loading', val)
        this.loading = val
      },
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.passport_popup {
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
}
</style>
