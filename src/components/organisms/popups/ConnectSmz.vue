<template>
  <template v-if="window === 'inn'">
    <PopupContainer
      :loading="loading"
      class="connect_smz_popup"
      title="Укажите свой ИНН"
      maxWidth="560px"
      @close="close"
    >
      <Form ref="form" class="column_16 mb_24">
        <FieldsRow type="flex-flex-flex">
          <Input :rules="[rules.required, rules.validateInn]" label="Введите ИНН" v-model="inn" clearable />
        </FieldsRow>
      </Form>

      <template v-slot:footer>
        <div class="button_row_global mt_8">
          <Button type="outlined" :disabled="loading" @click="close">Отмена</Button>
          <Button :loading="loading" @click="setWindow('smzInstruction')">Далее</Button>
        </div>
      </template>
    </PopupContainer>
  </template>

  <template v-if="window === 'smzInstruction'">
    <PopupContainer
      :loading="loading"
      class="connect_smz_popup"
      title="Необходимо встать на учет"
      maxWidth="820px"
      @close="close"
    >
      <div class="info_content">
        <img src="@/assets/icons/info_blue.svg" />
        <div>
          <div class="title">Как стать самозанятым?</div>
          <div class="description">Следуйте инструкции</div>
        </div>
      </div>

      <div class="instruction_container_desktop">
        <div class="instruction_card">
          <img src="@/assets/imgs/smz_instruction_pc.jpg" />
          <div>
            1. Перейдите на <a href="https://lknpd.nalog.ru/auth/register" target="blank">сайт налоговой</a> и нажмите
            «Далее»
          </div>
        </div>
        <div class="instruction_card">
          <img src="@/assets/imgs/smz_instruction_pc1.jpg" />
          2. Дайте согласие на обработку персональных данных и правил пользования приложением
        </div>
        <div class="instruction_card">
          <img src="@/assets/imgs/smz_instruction_pc2.jpg" />
          3. Согласитесь с условиями предупреждения и нажмите "Согласен"
        </div>
        <div class="instruction_card">
          <img src="@/assets/imgs/smz_instruction_pc3.jpg" />
          4. Авторизуйтесь на сайте, введя свой ИНН и пароль
        </div>
      </div>
      <div class="instruction_container_mobile">
        <div>
          <div class="title">1. Скачайте и зарегистрируйтесь в приложении «Мой налог»</div>
          <div class="apps_button_block">
            <a href="https://play.google.com/store/apps/details?id=com.gnivts.selfemployed&hl=ru" target="_blank">
              <div class="app_container">
                <img src="@/assets/icons/google_store.svg" />
                <div class="app_text">
                  Скачать в
                  <div class="app_name">Google Play</div>
                </div>
              </div>
            </a>
            <a href="https://www.rustore.ru/catalog/app/com.gnivts.selfemployed" target="_blank">
              <div class="app_container">
                <img src="@/assets/icons/rustore.svg" />
                <div class="app_text">
                  Скачать в
                  <div class="app_name">RuStore</div>
                </div>
              </div>
            </a>
            <a href="https://apps.apple.com/ru/app/мой-налог/id1437518854" target="_blank">
              <div class="app_container">
                <img src="@/assets/icons/app_store.svg" />
                <div class="app_text">
                  Скачать в
                  <div class="app_name">App Store</div>
                </div>
              </div>
            </a>
          </div>
        </div>
        <div>
          <div class="title">2. Нажмите «Регистрация по паспорту»</div>
          <div class="img_center"><img src="@/assets/imgs/smz_instruction_mobile.jpg" /></div>
        </div>
        <div>
          <div class="title">3. Введите номер телефона</div>
          <div class="img_center"><img src="@/assets/imgs/smz_instruction_mobile1.jpg" /></div>
        </div>
        <div>
          <div class="title">4. Введите свой регион</div>
          <div class="img_center"><img src="@/assets/imgs/smz_instruction_mobile2.jpg" /></div>
        </div>
        <div>
          <div class="title">5. Отсканируйте паспорт или введите вручную</div>
          <div class="img_center"><img src="@/assets/imgs/smz_instruction_mobile3.jpg" /></div>
        </div>
        <div>
          <div class="title">6. После подтверждения регистрации, нажмите «Далее» и завершите регистрацию</div>
          <div class="img_center"><img src="@/assets/imgs/smz_instruction_mobile4.jpg" /></div>
        </div>
      </div>

      <template v-slot:footer>
        <div class="button_row_global mt_8">
          <Button type="outlined" :disabled="loading" @click="close">Отмена</Button>
          <Button :loading="loading" @click="setWindow('passportInfo')">Далее</Button>
        </div>
      </template>
    </PopupContainer>
  </template>

  <!-- <template v-if="window === 'passport'">
    <PopupContainer
      class="passport_popup"
      title="Паспорт"
      maxWidth="670px"
      :loading="passportPhotoLoading"
      @close="$emit('close')"
    >
      <PassportPhotoLoader @loading="setPassportPhotoLoading" />
      <template v-slot:footer>
        <div class="button_row_global mt_8">
          <Button type="outlined" :disabled="loading" @click="close">Отмена</Button>
          <Button :loading="loading" @click="setWindow('passportInfo')">Далее</Button>
        </div>
      </template>
    </PopupContainer>
  </template> -->

  <template v-if="window === 'passportInfo'">
    <PopupContainer
      :loading="loading"
      class="connect_smz_popup"
      title="Паспортные данные"
      maxWidth="560px"
      @close="close"
    >
      <PassportInfoBlock class="mb_24" @close="close" hideEditButton />

      <template v-slot:footer>
        <div class="button_row_global mt_24">
          <Button type="outlined" :disabled="loading" @click="close">Отмена</Button>
          <Button :loading="loading" @click="close">Сохранить</Button>
        </div>
      </template>
    </PopupContainer>
  </template>
</template>

<script>
import PopupContainer from '@/components/atoms/PopupContainer.vue'
import UploadPhoto from '@/components/organisms/UploadPhoto.vue'
import { rules, rulesSets } from '@/constants/validations'
import { mapActions, mapGetters } from 'vuex'
import { isJSON, getAPIError, convertToFrontFormat, convertToBackFormat } from '@/constants/helpers'
import { SMZ_STATUSES } from '@/constants/statuses'
import useDocumentPhotos from '@/composables/useDocumentPhotos'
import PassportInfoBlock from '@/components/page/profile/PassportInfoBlock.vue'
import PassportPhotoLoader from '@/components/organisms/PassportPhotoLoader.vue'
//const initialDocumentInfo = {
//  number: null,
//  issue_date: null,
//  expiration_date: null,
//}

export default {
  name: 'MedicalBookPopup',
  components: {
    PopupContainer,
    PassportPhotoLoader,
    PassportInfoBlock,
    // UploadPhoto
  },
  props: {},
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

      inn: null,
      //documentInfo: JSON.parse(JSON.stringify(initialDocumentInfo)),
      //documentInfoServer: JSON.parse(JSON.stringify(initialDocumentInfo)),
      window: 'inn',
      passportPhotoLoading: false,
      loading: false,
      loadingPhoto: false,
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    disabled () {
      return JSON.stringify(this.documentInfo) === JSON.stringify(this.documentInfoServer)
    },
  },
  mounted () {
    //this.fetchData()
    this.inn = this?.user?.settings?.inn || null
  },
  unmounted () {},
  watch: {},
  methods: {
    ...mapActions('notifications', ['showNotification']),
    ...mapActions('profilePage', ['updateDocumentsStatuses', 'putUserInitialData', 'fetchProfile']),

    setPassportPhotoLoading (val) {
      this.passportPhotoLoading = val
    },

    close () {
      this.$emit('close')
    },

    async setWindow (windowName) {
      if (this?.$refs?.form && !this?.$refs?.form?.validate()) {
        this.showNotification({ type: 'error', text: 'Заполните все поля' })
        return
      }

      if (windowName === 'smzInstruction') {
        if (this.user?.settings?.inn !== this.inn) {
          const newUserData = { ...this.user, settings: { ...this.user?.settings, inn: this?.inn } }
          this.loading = true
          try {
            const status = await this.putUserInitialData({ user: newUserData })
            if (status) {
              await new Promise((resolve) => setTimeout(resolve, 3000))
              await this.fetchProfile()
            }
          } finally {
            this.loading = false
          }
        }
        if (!this.user?.smz_status || this.user?.smz_status === 'error') {
          this.showNotification({
            type: 'error',
            text: SMZ_STATUSES[this.user?.smz_status]?.displayed || 'Неизвестный статус самозанятого',
          })
          this.window = 'smzInstruction'
          return
        } else if (this.user?.smz_status === 'pending') {
          this.showNotification({
            type: 'info',
            text: SMZ_STATUSES[this.user?.smz_status]?.displayed || 'Неизвестный статус самозанятого',
          })
          return
        }
        this.window = 'passportInfo'
        return
      }
      this.window = windowName
    },

    //async fetchData () {
    //  this.loading = true
    //  const response = await this.$axios.get('v2/user/documents', {
    //    params: { type: 'medical_book' },
    //  })
    //  if (response?.data?.success) {
    //    const data = response?.data?.data?.[0] || {}
    //    if (data.files) this.photos = data.files
    //    this.documentInfoServer = isJSON(data?.json)
    //      ? JSON.parse(data.json)
    //      : JSON.parse(JSON.stringify(initialDocumentInfo))
    //    convertToFrontFormat(this.documentInfoServer)
    //    this.documentInfo = JSON.parse(JSON.stringify(this.documentInfoServer))
    //  } else {
    //    this.showNotification({ type: 'error', text: getAPIError(response) || 'Ошибка получения данных документа' })
    //  }
    //  this.loading = false
    //},
  },
}
</script>

<style lang="scss" scoped>
.connect_smz_popup {
  .info_content {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 16px;
    border-radius: 8px;
    background: #f2f8ff;
    margin-bottom: 24px;
    .title {
      font-weight: 600;
      margin-bottom: 4px;
    }
    .description {
      font-size: 14px;
    }
  }
  .instruction_container_desktop {
    display: flex;
    column-gap: 32px;
    row-gap: 24px;
    flex-wrap: wrap;
    margin-bottom: 32px;
    .instruction_card {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 12px;
    }
    img {
      margin-bottom: 12px;
    }
    a {
      color: #1aa0ff;
    }
  }
  .instruction_container_mobile {
    display: none;
    margin-bottom: 24px;
  }

  .popup_scroll_wrap {
    height: calc(100% - 100px);
    overflow-y: auto;
  }

  .apps_button_block {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 8px;
  }
  .app_container {
    display: flex;
    gap: 10px;
    border-radius: 8px;
    background: black;
    color: white;
    padding: 9px 16px;
    width: 163px;
    cursor: pointer;
    user-select: none;
    &:hover {
      background: rgb(35, 35, 35);
    }
  }
  .app_text {
    font-size: 12px;
    line-height: 15px;
  }
  .app_name {
    font-weight: 600;
    line-height: 20px;
  }
  .img_center {
    text-align: center;
  }

  @media (max-width: 1000px) {
    .instruction_container_desktop {
      display: none;
    }
    .instruction_container_mobile {
      display: flex;
      flex-direction: column;
      gap: 24px;
      .title {
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 16px;
      }
    }
  }
}
</style>
