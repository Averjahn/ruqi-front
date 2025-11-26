<template>
  <div class="organisation-data-page-wrapper">
  <div class="organisation-data-page">
    <!-- Header -->
    <div class="organisation-data-page__header">
      <div class="organisation-data-page__logo">
        <img src="@/assets/icons/logo.svg" alt="ruqi.ru" class="organisation-data-page__logo-img" />
      </div>
    </div>

    <div class="organisation-data-page__wrapper">
      <!-- Content Header -->
      <ContentHeader 
        :title="currentStepTitle" 
        :description="currentStepDescription"
      />

      <!-- Step 2: Documents Upload Section -->
      <div v-if="currentStep === 1" class="organisation-data-page__documents-section">
        <!-- Warning Block -->
        <WarningBlock 
          title="Внимание!"
          text="На фотографии должны быть отчётливо видны серия, номер, основные данные. В поле зрения не должны попадать пальцы и посторонние предметы."
          :icon="require('@/assets/icons/info_blue.svg')"
        />

        <!-- Document Upload Areas -->
        <div class="organisation-data-page__documents-list">
          <!-- Свидетельство ИНН -->
          <DocumentUploadCard
            title="Свидетельство ИНН"
            :file="formData.innCertificate"
            sample-link-text="Смотреть образец"
            :sample-image="require('@/assets/imgs/INN.jpg')"
            hint="Файлы до 5 МВ в форматах PNG, JPG, JPEG"
            input-ref="innFileInput"
            @view-sample="openDocumentSample"
            @view-file="openDocumentModal('innCertificate')"
            @remove="removeInnCertificate"
            @upload="triggerInnFileInput"
          />
              <input 
                type="file" 
                ref="innFileInput" 
                @change="handleInnFileUpload" 
                accept="image/png,image/jpg,image/jpeg" 
                style="display: none"
              />

          <!-- Свидетельство ОГРН -->
          <DocumentUploadCard
            title="Свидетельство ОГРН"
            :file="formData.ogrnCertificate"
            sample-link-text="Смотреть образец"
            :sample-image="require('@/assets/imgs/OGRN.jpg')"
            hint="Файлы до 5 МВ в форматах PNG, JPG, JPEG"
            input-ref="ogrnFileInput"
            @view-sample="openDocumentSample"
            @view-file="openDocumentModal('ogrnCertificate')"
            @remove="removeOgrnCertificate"
            @upload="triggerOgrnFileInput"
          />
              <input 
                type="file" 
                ref="ogrnFileInput" 
                @change="handleOgrnFileUpload" 
                accept="image/png,image/jpg,image/jpeg" 
                style="display: none"
              />
        </div>
      </div>

        <!-- Form (Step 1 only) -->
        <OrganisationDataForm
          v-if="currentStep === 0"
          ref="form"
          v-model="formData"
          :counterparty-types="counterpartyTypes"
          @data-filled="handleDataFilled"
          @upload-error="handleUploadError"
        />
    </div>

    <!-- Footer Navigation -->
    <RegistrationSteps
      :steps="steps"
      :current-step="currentStep"
      :can-go-back="canGoBack"
      :can-go-next="canGoNext"
      :can-finish="canFinish"
      @step-change="handleStepChange"
      @previous-step="handlePreviousStep"
      @next-step="handleNextStep"
      @finish="handleFinish"
    />

    <!-- Document Modal -->
    <DocumentModal
      v-model="showDocumentModal"
      title="Образец документа"
      :image="currentDocumentImage"
    />
          </div>
          </div>
</template>

<script>
import { mapActions } from 'vuex'
import RegistrationSteps from '@/components/molecules/RegistrationSteps.vue'
import ContentHeader from '@/components/atoms/ContentHeader.vue'
import WarningBlock from '@/components/atoms/WarningBlock.vue'
import DocumentUploadCard from '@/components/molecules/DocumentUploadCard.vue'
import DocumentModal from '@/components/organisms/DocumentModal.vue'
import OrganisationDataForm from '@/components/organisms/OrganisationDataForm.vue'
import authApi from '@/services/authApi'

export default {
  name: 'OrganisationData',
  layout: 'empty',
  components: {
    RegistrationSteps,
    ContentHeader,
    WarningBlock,
    DocumentUploadCard,
    DocumentModal,
    OrganisationDataForm
  },
  data() {
    return {
      loading: false,
      currentStep: 0,
      showDocumentModal: false,
      currentDocumentFile: null,
      currentSampleImage: null,
      steps: [
        { id: 1, title: 'Данные об организации', description: 'Укажите основную информацию о вашей организации. Эти данные помогут нам создать ваш профиль, чтобы вы могли размещать вакансии и подработки. Пожалуйста, заполните все обязательные поля внимательно.' },
        { id: 2, title: 'Документы', description: 'Для подтверждения подлинности введенных вами данных, пожалуйста прикрепите скан-фото оригиналов документов' }
      ],
      canGoBack: true,
      formData: {
        logo: null,
        counterpartyType: 'legal',
        inn: '',
        fullName: '',
        kpp: '',
        ogrn: '',
        okato: '',
        fullNamePerson: '',
        position: null,
        basis: null,
        mailingAddress: '',
        legalAddress: '',
        settlementAccount: '',
        correspondentAccount: '',
        bic: '',
        bank: '',
        // Documents
        innCertificate: {
          file: null,
          name: '',
          size: '',
          preview: null
        },
        ogrnCertificate: {
          file: null,
          name: '',
          size: '',
          preview: null
        },
      },
      counterpartyTypes: [
        { value: 'legal', label: 'Юридическое лицо' },
        { value: 'other', label: 'Прочее' }
      ]
    }
  },
  computed: {
    currentStepTitle() {
      return this.steps[this.currentStep]?.title || 'Данные об организации'
    },
    currentStepDescription() {
      return this.steps[this.currentStep]?.description || 'Укажите основную информацию о вашей организации'
    },

    currentDocumentImage() {
      if (this.currentSampleImage) {
        return this.currentSampleImage
      }

      if (this.currentDocumentFile) {
        const document = this.formData[this.currentDocumentFile]
        if (document && document.file) {
          return document.preview || document.file
        }
      }

      return '@/assets/imgs/document.png' // Образец по умолчанию
    },

    canGoNext() {
      // На первом шаге проверяем заполненность всех обязательных полей
      if (this.currentStep === 0) {
        const requiredFields = [
          'counterpartyType',
          'vatRate',
          'fullName',
          'inn',
          'kpp',
          'ogrn',
          'okato',
          'fullNamePerson',
          'position',
          'basis',
          'mailingAddress',
          'legalAddress'
        ]

        // Проверяем, что все обязательные поля заполнены
        const allFieldsFilled = requiredFields.every(field => {
          const value = this.formData[field]
          if (!value) return false
          if (typeof value === 'string') {
            return value.trim() !== ''
          }
          return true
        })

        // Дополнительно проверяем валидность ИНН (должен быть 10 или 12 цифр и только цифры)
        const innValid = this.formData.inn && 
          /^[0-9]+$/.test(this.formData.inn) &&
          (this.formData.inn.length === 10 || this.formData.inn.length === 12)

        // Проверяем валидность формы через валидацию компонента
        let formValid = true
        if (this.$refs.form) {
          // Проверяем валидность формы, но не показываем ошибки
          formValid = this.$refs.form.validate ? this.$refs.form.validate() : true
        }

        return allFieldsFilled && innValid && formValid
      }

      // На втором шаге проверяем наличие документов
      if (this.currentStep === 1) {
        const hasInnCertificate = !!this.formData.innCertificate?.file
        const hasOgrnCertificate = !!this.formData.ogrnCertificate?.file
        return hasInnCertificate && hasOgrnCertificate
      }

      return true
    },

    canFinish() {
      // Проверяем, что все обязательные поля заполнены
      // Лого организации необязательно для завершения регистрации
      const hasInn = !!this.formData.inn && this.formData.inn.length >= 10
      const hasFullName = !!this.formData.fullName
      const hasInnCertificate = !!this.formData.innCertificate?.file
      const hasOgrnCertificate = !!this.formData.ogrnCertificate?.file
      
      
      return hasInn && hasFullName && hasInnCertificate && hasOgrnCertificate
    }
  },
  watch: {
    'formData.logo'(newLogo) {
      // console.log('🖼️ formData.logo изменился:', newLogo)
      if (newLogo) {
      }
    }
  },
  methods: {
    ...mapActions('notifications', ['showNotification']),
    openDocumentModal(documentType = null) {
      this.currentSampleImage = null
      this.currentDocumentFile = documentType
      this.showDocumentModal = true
    },

    openDocumentSample(sampleImage) {
      this.currentSampleImage = sampleImage
      this.currentDocumentFile = null
      this.showDocumentModal = true
    },

    closeDocumentModal() {
      this.showDocumentModal = false
      this.currentDocumentFile = null
      this.currentSampleImage = null
    },

    handleStepChange(stepIndex) {
      this.currentStep = stepIndex
      // console.log('Переход на шаг:', stepIndex + 1)
    },

    handlePreviousStep(stepIndex) {
      this.currentStep = stepIndex
      // console.log('Предыдущий шаг:', stepIndex + 1)
    },

    async handleNextStep(stepIndex) {
      // Валидация для первого шага (форма)
      if (this.currentStep === 0) {
        // Проверяем валидацию формы
        if (this.$refs.form && !this.$refs.form.validate()) {
          this.showNotification({
            type: 'error',
            text: 'Пожалуйста, заполните все обязательные поля корректно'
          })
          return
        }

        // Проверяем, что все обязательные поля заполнены
        const requiredFields = [
          'counterpartyType',
          'fullName',
          'inn',
          'kpp',
          'ogrn',
          'okato',
          'fullNamePerson',
          'position',
          'basis',
          'mailingAddress',
          'legalAddress'
        ]

        const emptyFields = requiredFields.filter(field => {
          const value = this.formData[field]
          return !value || (typeof value === 'string' && value.trim() === '')
        })

        if (emptyFields.length > 0) {
          this.showNotification({
            type: 'error',
            text: 'Пожалуйста, заполните все обязательные поля перед переходом к следующему шагу'
          })
          return
        }
      }

      // Валидация для второго шага (документы)
      if (this.currentStep === 1) {
        const requiredDocuments = ['innCertificate', 'ogrnCertificate']
        const missingDocuments = requiredDocuments.filter(doc => !this.formData[doc]?.file)
        
        if (missingDocuments.length > 0) {
          this.showNotification({
            type: 'error',
            text: 'Пожалуйста, загрузите все необходимые документы'
          })
          return
        }
      }

      this.loading = true
      
      // Здесь будет логика сохранения данных
      setTimeout(() => {
        this.loading = false
        this.currentStep = stepIndex
      }, 1000)
    },

    async handleFinish() {
      this.loading = true
      try {
        // Шаг 1: Проверяем, есть ли у клиента организация
        console.log('📤 Шаг 1: Проверяем наличие организации у клиента')
        
        const getOrgResult = await authApi.getClientOrganization()
        
        if (getOrgResult.success) {
          // У клиента уже есть организация
          this.showNotification({
            type: 'info',
            text: 'У вас уже есть организация. Переходим на страницу профиля.',
          })
          
          setTimeout(() => {
            this.$router.push('/ui-new/profile')
          }, 1500)
          this.loading = false
          return
        }
        
        // Если организации нет (ошибка 404), продолжаем создание
        const errorCode = getOrgResult.error?.code || getOrgResult.error?.[0]?.code
        if (errorCode && errorCode !== 980081) {
          // Если ошибка не "У клиента нет привязанной организации", показываем ошибку
          this.showNotification({
            type: 'error',
            text: getOrgResult.error?.msg || getOrgResult.error?.[0]?.msg || 'Ошибка при проверке организации',
          })
          this.loading = false
          return
        }
        
        // Шаг 2: Создание организации (если организации нет)
        // Маппим данные из формы в формат API
        // Извлекаем короткое название из полного наименования (до кавычек или первые слова)
        const fullName = this.formData.fullName || ''
        const shortName = fullName.match(/["«]([^"»]+)["»]/)?.[1] || 
                         fullName.split(' ').slice(0, 3).join(' ') || 
                         fullName
        
        // Маппим тип контрагента в тип организации
        const counterpartyTypeMap = {
          legal: 'ООО',
          other: 'Прочее'
        }
        
        // Подготавливаем данные организации для отправки согласно API
        const organizationData = {
          name: shortName,
          company_name: this.formData.fullName || '',
          inn: this.formData.inn || undefined,
          kpp: this.formData.kpp || undefined,
          ogrn: this.formData.ogrn || undefined,
          legal_address: this.formData.legalAddress || undefined,
          address: this.formData.mailingAddress || undefined,
          bank: this.formData.bank || undefined,
          bik: this.formData.bic || undefined,
          payment_account: this.formData.settlementAccount || undefined,
          correspondent_account: this.formData.correspondentAccount || undefined,
          gen_director: this.formData.fullNamePerson || undefined,
          signee_fio: this.formData.fullNamePerson || undefined,
          signee_basis: this.formData.basis || undefined,
          signee_job_title: this.formData.position || undefined,
          type: counterpartyTypeMap[this.formData.counterpartyType] || undefined
        }
        
        // Удаляем undefined значения
        Object.keys(organizationData).forEach(key => {
          if (organizationData[key] === undefined || organizationData[key] === null || organizationData[key] === '') {
            delete organizationData[key]
          }
        })

        console.log('📤 Шаг 2: Создаем организацию с данными:', organizationData)

        // Отправляем данные организации через API
        const organizationResult = await authApi.createClientOrganization(organizationData)
        
        if (organizationResult.success) {
          this.showNotification({
            type: 'success',
            text: organizationResult.data?.message || 'Организация успешно создана!',
          })
          
          // Переход на страницу профиля
          setTimeout(() => {
            this.$router.push('/ui-new/profile')
          }, 1500)
        } else {
          // Проверяем, не создана ли организация уже (код ошибки 980091)
          const orgErrorCode = organizationResult.error?.code || organizationResult.error?.[0]?.code
          if (orgErrorCode === 980091) {
            this.showNotification({
              type: 'info',
              text: 'У вас уже есть организация. Переходим на страницу профиля.',
            })
            
            setTimeout(() => {
              this.$router.push('/ui-new/profile')
            }, 1500)
          } else {
            this.showNotification({
              type: 'error',
              text: organizationResult.error?.msg || organizationResult.error?.[0]?.msg || 'Ошибка при создании организации',
            })
          }
        }
      } catch (error) {
        console.error('Ошибка при завершении регистрации:', error)
        this.showNotification({
          type: 'error',
          text: 'Произошла ошибка при завершении регистрации',
        })
      } finally {
        this.loading = false
      }
    },

    handleUploadError(errorMessage) {
      console.error('Upload error:', errorMessage)
    },

    // Отладочный метод для отслеживания изменений logo
    watchFormDataLogo() {
      // console.log('🖼️ formData.logo изменился:', this.formData.logo)
      if (this.formData.logo) {
      }
    },

    // Обработчик заполнения данных из DaData
    handleDataFilled(organization) {
      // Данные уже заполнены в компоненте формы
      // Этот метод можно использовать для дополнительной логики
    },

    handleOgrnFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.formData.ogrnCertificate = {
          file: file,
          name: file.name,
          size: this.formatFileSize(file.size),
          preview: URL.createObjectURL(file)
        }
      }
    },

    removeOgrnCertificate() {
      if (this.formData.ogrnCertificate && this.formData.ogrnCertificate.preview) {
        URL.revokeObjectURL(this.formData.ogrnCertificate.preview)
      }
      this.formData.ogrnCertificate = {
        file: null,
        name: '',
        size: '',
        preview: null
      }
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    },

    triggerOgrnFileInput() {
      this.$refs.ogrnFileInput.click()
    },

    handleInnFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.formData.innCertificate = {
          file: file,
          name: file.name,
          size: this.formatFileSize(file.size),
          preview: URL.createObjectURL(file)
        }
      }
    },

    removeInnCertificate() {
      if (this.formData.innCertificate && this.formData.innCertificate.preview) {
        URL.revokeObjectURL(this.formData.innCertificate.preview)
      }
      this.formData.innCertificate = {
        file: null,
        name: '',
        size: '',
        preview: null
      }
    },

    triggerInnFileInput() {
      this.$refs.innFileInput.click()
    }
  }
}
</script>

<style lang="scss" scoped>
.organisation-data-page {
  min-height: 100vh;
  background: linear-gradient(180deg, rgba(89, 120, 210, 0.08) 64px, #ffffff 104px);
  padding-bottom: 100px; // Отступ для скролла


  &__wrapper {
    max-width: 624px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  &__header {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    border-bottom: 1px solid #e9ecef;
  }

  &__logo {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__logo-img {
    height: 32px;
    width: auto;
  }

  &__content-header {
    margin-bottom: 40px;
  }

  &__title {
    font-size: 32px;
    font-weight: 700;
    color: #263043;
    margin: 0 0 16px 0;
    text-align: left;
  }

  &__description {
    font-size: 16px;
    line-height: 24px;
    color: #666666;
    margin: 0;
    text-align: left;
  }

  &__logo-section {
    margin-bottom: 40px;
  }

  &__documents-section {
    margin-bottom: 40px;
  }

  &__warning-block {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    background: #EFF2FD;
    border: 1px solid #B0BAFF;
    border-radius: 12px;
    margin-bottom: 32px;
  }

  &__warning-content {
    flex: 1;
  }

  &__warning-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 8px 0;
  }

  &__warning-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    margin-top: 2px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  &__icon-placeholder {
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  &__warning-text {
    font-size: 14px;
    line-height: 20px;
    color: #1a1a1a;
    margin: 0;
  }

  &__documents-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__document-card {
    padding: 24px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 16px;
    background: #ffffff;
  }

  &__document-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  &__document-title {
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
  }

  &__sample-link {
    font-size: 14px;
    color: #1735f5;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  &__upload-area {
    border: 1.5px dashed #d1d5db;
    border-radius: 12px;
    text-align: center;
    background: #f9fafb;
    width: 100%;
    max-width: 624px;
    height: 116px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    transition: all 0.2s ease;

    &:hover {
      border-color: #1735f5;
      background: #f0f4ff;
    }
  }

  &__upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 71px;
  }

  &__upload-text {
    font-size: 16px;
    color: #6b7280;
    margin: 0;
  }

  &__upload-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0 4px 0;
    background: none;
    border: none;
    color: #1735f5;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  &__upload-icon {
    width: 16px;
    height: 16px;
  }

  &__upload-button .organisation-data-page__icon-placeholder {
    font-size: 14px;
    width: 20px;
    height: 20px;
    margin: 9px 0 5px 0;
  }

  &__upload-hint {
    font-size: 12px;
    color: #9ca3af;
  }

  &__uploaded-file {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  &__file-thumbnail {
    width: 118px;
    height: 116px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }
  }

  &__document-image {
    width: 118px;
    height: 116px;
    object-fit: cover;
    object-position: center;
  }

  &__file-icon {
    width: 20px;
    height: 20px;
  }

  &__file-preview .organisation-data-page__icon-placeholder {
    font-size: 20px;
    width: 20px;
    height: 20px;
  }

  &__file-info {
    flex: 1;
  }

  &__file-name {
    font-size: 14px;
    font-weight: 500;
    color: #1a1a1a;
    margin: 0 0 4px 0;
  }

  &__file-size {
    font-size: 12px;
    color: #6b7280;
    margin: 0;
  }

  &__delete-button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    background: none;
    border: none;
    color: #dc2626;
    font-size: 12px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s ease;
    margin-top: 4px;

    &:hover {
      background: #fef2f2;
    }
  }

  &__delete-icon {
    width: 14px;
    height: 14px;
    filter: brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%);
  }

  &__delete-button .organisation-data-page__icon-placeholder {
    font-size: 12px;
    width: 14px;
    height: 14px;
  }

  &__form {
    margin-bottom: 40px;
  }

  &__fields-row-three {
    display: flex;
    gap: 16px;

    .organisation-data-page__field {
      flex: 1;
    }
  }

  &__field {
    flex: 1;
    margin-bottom: 20px;

    &--full {
      flex: 100%;
    }
  }

  &__label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
    margin-bottom: 8px;
  }


  &__input,
  &__select {
    width: 100%;
    color: #666666;
  }

}

@media (max-width: 768px) {
  .organisation-data-page {
    background: linear-gradient(180deg, rgba(89, 120, 210, 0.08) 56px, #ffffff 96px);
    padding-bottom: 120px; // Больший отступ для мобильных

    &__header {
      height: 56px;
      padding: 0 16px;
    }

    &__logo-img {
      height: 28px;
    }

    &__wrapper {
      padding: 24px 16px;
      max-width: 100%;
    }

    &__content-header {
      margin-bottom: 24px;
    }

    &__title {
      font-size: 24px;
      line-height: 30px;
      margin-bottom: 12px;
    }

    &__description {
      font-size: 14px;
      line-height: 20px;
    }

    &__logo-section {
      margin-bottom: 24px;
    }

    &__form {
      margin-bottom: 24px;
    }

    &__field {
      margin-bottom: 16px;

      &--full {
        margin-bottom: 16px;
      }
    }

    &__label {
      font-size: 14px;
      margin-bottom: 6px;
      color: #6b7280;
    }

    &__input,
    &__select {
      font-size: 16px; // Предотвращает зум на iOS
    }

    &__upload-area {
      width: 100%;
      height: auto;
      min-height: 116px;
      max-width: none;
    }

    // Поля в одну строку на мобильных
    .fields-row {
      display: flex;
      gap: 12px;
      
      .organisation-data-page__field {
        flex: 1;
        margin-bottom: 16px;
      }
    }
  }

  // Modal styles
  .organisation-data-page__modal-overlay {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    background: rgba(0, 0, 0, 0.8) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 99999 !important;
    padding: 20px !important;
    width: 100vw !important;
    height: 100vh !important;
  }

  .organisation-data-page__modal {
    background: white !important;
    border-radius: 12px !important;
    max-width: 90vw !important;
    max-height: 90vh !important;
    width: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
    border: 3px solid red !important;
    min-height: 200px !important;
  }

  .organisation-data-page__modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
  }

  .organisation-data-page__modal-title {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }

  .organisation-data-page__modal-close {
    background: none;
    border: none;
    padding: 8px;
    cursor: pointer;
    border-radius: 6px;
    transition: background-color 0.2s ease;

    &:hover {
      background: #f3f4f6;
    }
  }

  .organisation-data-page__modal-close-icon {
    width: 16px;
    height: 16px;
  }

  .organisation-data-page__modal-content {
    padding: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
  }

  .organisation-data-page__modal-image {
    max-width: 100%;
    max-height: 70vh;
    object-fit: contain;
    border-radius: 8px;
  }

  // DaData стили
  .organisation-data-page__inn-search {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .organisation-data-page__error {
    color: #dc2626;
    font-size: 14px;
    margin-top: 8px;
    padding: 8px 12px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 6px;
  }
}
</style>

<style lang="scss">
/* Global modal styles */
.organisation-data-page__modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.organisation-data-page__modal {
  background: white;
  border-radius: 12px;
  max-width: 90vw;
  max-height: 90vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.organisation-data-page__modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.organisation-data-page__modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.organisation-data-page__modal-close {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.organisation-data-page__modal-close:hover {
  background: #f3f4f6;
}

.organisation-data-page__modal-close-icon {
  width: 16px;
  height: 16px;
}

.organisation-data-page__modal-content {
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
}

.organisation-data-page__modal-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 8px;
}
</style>
