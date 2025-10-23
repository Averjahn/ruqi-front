<template>
  <div class="organisation-data-page">
    <!-- Header -->
    <div class="organisation-data-page__header">
      <div class="organisation-data-page__logo">
        <img src="@/assets/icons/logo.svg" alt="ruqi.ru" class="organisation-data-page__logo-img" />
      </div>
    </div>

    <div class="organisation-data-page__wrapper">
      <!-- Content Header -->
      <div class="organisation-data-page__content-header">
        <h1 class="organisation-data-page__title">{{ currentStepTitle }}</h1>
        <p class="organisation-data-page__description">
          {{ currentStepDescription }}
        </p>
      </div>

      <!-- Step 1: Logo Upload Section -->
      <div v-if="currentStep === 0" class="organisation-data-page__logo-section">
        <LogoUpload 
          v-model="formData.logo"
          :min-width="98"
          :min-height="98"
          @error="handleUploadError"
        />
      </div>

      <!-- Step 2: Documents Upload Section -->
      <div v-if="currentStep === 1" class="organisation-data-page__documents-section">
        <!-- Warning Block -->
        <div class="organisation-data-page__warning-block">
          <div class="organisation-data-page__warning-icon">
            <img src="@/assets/icons/Info.svg" alt="Info" />
          </div>
          <div class="organisation-data-page__warning-content">
            <h3 class="organisation-data-page__warning-title">Внимание!</h3>
            <p class="organisation-data-page__warning-text">
              На фотографии должны быть отчётливо видны серия, номер, основные данные. 
              В поле зрения не должны попадать пальцы и посторонние предметы.
            </p>
          </div>
        </div>

        <!-- Document Upload Areas -->
        <div class="organisation-data-page__documents-list">
          <!-- Свидетельство ИНН -->
          <div class="organisation-data-page__document-card">
            <div class="organisation-data-page__document-header">
              <h3 class="organisation-data-page__document-title">Свидетельство ИНН</h3>
              <a href="#" class="organisation-data-page__sample-link" @click.prevent="openDocumentModal">Смотреть образец</a>
            </div>
            <div v-if="formData.innCertificate && formData.innCertificate.file" class="organisation-data-page__uploaded-file">
              <div class="organisation-data-page__file-thumbnail" @click="openDocumentModal('innCertificate')">
                <img 
                  :src="formData.innCertificate.preview || formData.innCertificate.file" 
                  alt="Document" 
                  class="organisation-data-page__document-image" 
                />
              </div>
              <div class="organisation-data-page__file-info">
                <p class="organisation-data-page__file-name">{{ formData.innCertificate.name }}</p>
                <p class="organisation-data-page__file-size">{{ formData.innCertificate.size }}</p>
                <button class="organisation-data-page__delete-button" @click="removeInnCertificate">
                  <img src="@/assets/icons/delete.svg" alt="Delete" class="organisation-data-page__delete-icon" />
                  Удалить
                </button>
              </div>
            </div>
            <div v-else class="organisation-data-page__upload-area">
              <div class="organisation-data-page__upload-content">
                <p class="organisation-data-page__upload-text">Перетащите файлы сюда или</p>
                <button class="organisation-data-page__upload-button" @click="triggerInnFileInput">
                  <div class="organisation-data-page__icon-placeholder">📎</div>
                  загрузите документы
                </button>
                <p class="organisation-data-page__upload-hint">Файлы до 5 МВ в форматах PNG, JPG, JPEG</p>
              </div>
              <input 
                type="file" 
                ref="innFileInput" 
                @change="handleInnFileUpload" 
                accept="image/png,image/jpg,image/jpeg" 
                style="display: none"
              />
            </div>
          </div>

          <!-- Свидетельство ОГРН -->
          <div class="organisation-data-page__document-card">
            <div class="organisation-data-page__document-header">
              <h3 class="organisation-data-page__document-title">Свидетельство ОГРН</h3>
              <a href="#" class="organisation-data-page__sample-link" @click.prevent="openDocumentModal">Смотреть образец</a>
            </div>
            <div v-if="formData.ogrnCertificate && formData.ogrnCertificate.file" class="organisation-data-page__uploaded-file">
              <div class="organisation-data-page__file-thumbnail" @click="openDocumentModal('ogrnCertificate')">
                <img 
                  :src="formData.ogrnCertificate.preview || formData.ogrnCertificate.file" 
                  alt="Document" 
                  class="organisation-data-page__document-image" 
                />
              </div>
              <div class="organisation-data-page__file-info">
                <p class="organisation-data-page__file-name">{{ formData.ogrnCertificate.name }}</p>
                <p class="organisation-data-page__file-size">{{ formData.ogrnCertificate.size }}</p>
                <button class="organisation-data-page__delete-button" @click="removeOgrnCertificate">
                  <img src="@/assets/icons/delete.svg" alt="Delete" class="organisation-data-page__delete-icon" />
                  Удалить
                </button>
              </div>
            </div>
            <div v-else class="organisation-data-page__upload-area">
              <div class="organisation-data-page__upload-content">
                <p class="organisation-data-page__upload-text">Перетащите файлы сюда или</p>
                <button class="organisation-data-page__upload-button" @click="triggerOgrnFileInput">
                  <div class="organisation-data-page__icon-placeholder">📎</div>
                  загрузите документы
                </button>
                <p class="organisation-data-page__upload-hint">Файлы до 5 МВ в форматах PNG, JPG, JPEG</p>
              </div>
              <input 
                type="file" 
                ref="ogrnFileInput" 
                @change="handleOgrnFileUpload" 
                accept="image/png,image/jpg,image/jpeg" 
                style="display: none"
              />
            </div>
          </div>

          <!-- Свидетельство КПП -->
          <div class="organisation-data-page__document-card">
            <div class="organisation-data-page__document-header">
              <h3 class="organisation-data-page__document-title">Свидетельство КПП</h3>
              <a href="#" class="organisation-data-page__sample-link" @click.prevent="openDocumentModal">Смотреть образец</a>
            </div>
            <div v-if="formData.kppCertificate && formData.kppCertificate.file" class="organisation-data-page__uploaded-file">
              <div class="organisation-data-page__file-thumbnail" @click="openDocumentModal('kppCertificate')">
                <img 
                  :src="formData.kppCertificate.preview || formData.kppCertificate.file" 
                  alt="Document" 
                  class="organisation-data-page__document-image" 
                />
              </div>
              <div class="organisation-data-page__file-info">
                <p class="organisation-data-page__file-name">{{ formData.kppCertificate.name }}</p>
                <p class="organisation-data-page__file-size">{{ formData.kppCertificate.size }}</p>
                <button class="organisation-data-page__delete-button" @click="removeKppCertificate">
                  <img src="@/assets/icons/delete.svg" alt="Delete" class="organisation-data-page__delete-icon" />
                  Удалить
                </button>
              </div>
            </div>
            <div v-else class="organisation-data-page__upload-area">
              <div class="organisation-data-page__upload-content">
                <p class="organisation-data-page__upload-text">Перетащите файлы сюда или</p>
                <button class="organisation-data-page__upload-button" @click="triggerKppFileInput">
                  <div class="organisation-data-page__icon-placeholder">📎</div>
                  загрузите документы
                </button>
                <p class="organisation-data-page__upload-hint">Файлы до 5 МВ в форматах PNG, JPG, JPEG</p>
              </div>
              <input 
                type="file" 
                ref="kppFileInput" 
                @change="handleKppFileUpload" 
                accept="image/png,image/jpg,image/jpeg" 
                style="display: none"
              />
            </div>
          </div>
        </div>
      </div>

        <!-- Form (Step 1 only) -->
        <Form v-if="currentStep === 0" ref="form" class="organisation-data-page__form">
        <!-- Row 1: Вид контрагента + ИНН -->
        <FieldsRow>
          <div class="organisation-data-page__field">
            <label class="organisation-data-page__label">
              Вид контрагента*
            </label>
            <Multiselect
              v-model="formData.counterpartyType"
              :options="counterpartyTypes"
              placeholder="Выберите значение"
              :multiple="false"
              class="organisation-data-page__select"
            />
          </div>
          <div class="organisation-data-page__field">
            <label class="organisation-data-page__label">
              ИНН*
            </label>
            <Input
              v-model="formData.inn"
              placeholder="Введите ИНН"
              :rules="[rules.required]"
              class="organisation-data-page__input"
            />
          </div>
        </FieldsRow>

        <!-- Row 2: Полное наименование организации -->
        <div class="organisation-data-page__field organisation-data-page__field--full">
          <label class="organisation-data-page__label">
            Полное наименование организации*
          </label>
          <Input
            v-model="formData.fullName"
            placeholder="Введите полное наименование"
            :rules="[rules.required]"
            class="organisation-data-page__input"
          />
        </div>

        <!-- Row 3: КПП + ОГРН + ОКАТО -->
        <div class="organisation-data-page__fields-row-three">
          <div class="organisation-data-page__field">
            <label class="organisation-data-page__label">
              КПП*
            </label>
            <Input
              v-model="formData.kpp"
              placeholder="Введите КПП"
              :rules="[rules.required]"
              class="organisation-data-page__input"
            />
          </div>
          <div class="organisation-data-page__field">
            <label class="organisation-data-page__label">
              ОГРН*
            </label>
            <Input
              v-model="formData.ogrn"
              placeholder="Введите ОГРН"
              :rules="[rules.required]"
              class="organisation-data-page__input"
            />
          </div>
          <div class="organisation-data-page__field">
            <label class="organisation-data-page__label">
              ОКАТО*
            </label>
            <Input
              v-model="formData.okato"
              placeholder="Введите ОКАТО"
              :rules="[rules.required]"
              class="organisation-data-page__input"
            />
          </div>
        </div>

        <!-- Row 4: ФИО -->
        <div class="organisation-data-page__field organisation-data-page__field--full">
          <label class="organisation-data-page__label">
            ФИО*
          </label>
          <Input
            v-model="formData.fullNamePerson"
            placeholder="Введите ФИО"
            :rules="[rules.required]"
            class="organisation-data-page__input"
          />
        </div>

        <!-- Row 6: Должность + На основании чего -->
        <FieldsRow>
          <div class="organisation-data-page__field">
            <label class="organisation-data-page__label">
              Должность*
            </label>
            <Multiselect
              v-model="formData.position"
              :options="positions"
              placeholder="Выберите значение"
              :multiple="false"
              class="organisation-data-page__select"
            />
          </div>
          <div class="organisation-data-page__field">
            <label class="organisation-data-page__label">
              На основании чего*
            </label>
            <Multiselect
              v-model="formData.basis"
              :options="bases"
              placeholder="Выберите значение"
              :multiple="false"
              class="organisation-data-page__select"
            />
          </div>
        </FieldsRow>

        <!-- Row 8: Почтовый адрес -->
        <div class="organisation-data-page__field organisation-data-page__field--full">
          <label class="organisation-data-page__label">
            Почтовый адрес*
          </label>
          <Input
            v-model="formData.mailingAddress"
            placeholder="Введите почтовый адрес"
            :rules="[rules.required]"
            class="organisation-data-page__input"
          />
        </div>

        <!-- Row 9: Юридический адрес -->
        <div class="organisation-data-page__field organisation-data-page__field--full">
          <label class="organisation-data-page__label">
            Юридический адрес*
          </label>
          <Input
            v-model="formData.legalAddress"
            placeholder="Введите юридический адрес"
            :rules="[rules.required]"
            class="organisation-data-page__input"
          />
        </div>

        <!-- Row 10: Расчётный счёт + Корреспондентский счёт -->
        <FieldsRow>
          <div class="organisation-data-page__field">
            <label class="organisation-data-page__label">
              Расчётный счёт*
            </label>
            <Input
              v-model="formData.settlementAccount"
              placeholder="Введите расчётный счёт"
              :rules="[rules.required]"
              class="organisation-data-page__input"
            />
          </div>
          <div class="organisation-data-page__field">
            <label class="organisation-data-page__label">
              Корреспондентский счёт*
            </label>
            <Input
              v-model="formData.correspondentAccount"
              placeholder="Введите корреспондентский счёт"
              :rules="[rules.required]"
              class="organisation-data-page__input"
            />
          </div>
        </FieldsRow>

        <!-- Row 11: БИК + Банк -->
        <FieldsRow>
          <div class="organisation-data-page__field">
            <label class="organisation-data-page__label">
              БИК*
            </label>
            <Input
              v-model="formData.bic"
              placeholder="Введите БИК"
              :rules="[rules.required]"
              class="organisation-data-page__input"
            />
          </div>
          <div class="organisation-data-page__field">
            <label class="organisation-data-page__label">
              Банк*
            </label>
            <Input
              v-model="formData.bank"
              placeholder="Введите банк"
              :rules="[rules.required]"
              class="organisation-data-page__input"
            />
          </div>
        </FieldsRow>
        </Form>
      </div>

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
    <teleport to="body">
      <div v-if="showDocumentModal" class="organisation-data-page__modal-overlay" @click="closeDocumentModal">
        <div class="organisation-data-page__modal" @click.stop>
          <div class="organisation-data-page__modal-header">
            <h3 class="organisation-data-page__modal-title">Образец документа</h3>
            <button class="organisation-data-page__modal-close" @click="closeDocumentModal">
              <img src="@/assets/icons/cross_white.svg" alt="Close" class="organisation-data-page__modal-close-icon" />
            </button>
          </div>
          <div class="organisation-data-page__modal-content">
            <img :src="currentDocumentImage" alt="Document Sample" class="organisation-data-page__modal-image" />
          </div>
        </div>
      </div>
    </teleport>
</template>

<script>
import { mapActions } from 'vuex'
import MainButton from '@/components/atoms/MainButton.vue'
import Input from '@/components/atoms/Input.vue'
import Multiselect from '@/components/atoms/Multiselect.vue'
import LogoUpload from '@/components/atoms/LogoUpload.vue'
import Upload from '@/components/atoms/Upload.vue'
import Form from '@/components/atoms/Form.vue'
import FieldsRow from '@/components/atoms/FieldsRow.vue'
import RegistrationSteps from '@/components/molecules/RegistrationSteps.vue'
import { rules } from '@/constants/validations'

export default {
  name: 'OrganisationData',
  layout: 'empty',
  components: {
    MainButton,
    Input,
    Multiselect,
    LogoUpload,
    Upload,
    Form,
    FieldsRow,
    RegistrationSteps
  },
  data() {
    return {
      loading: false,
      rules,
      currentStep: 0,
      showDocumentModal: false,
      currentDocumentFile: null,
      steps: [
        { id: 1, title: 'Данные об организации', description: 'Укажите основную информацию о вашей организации. Эти данные помогут нам создать ваш профиль, чтобы вы могли размещать вакансии и подработки. Пожалуйста, заполните все обязательные поля внимательно.' },
        { id: 2, title: 'Документы', description: 'Для подтверждения подлинности введенных вами данных, пожалуйста прикрепите скан-фото оригиналов документов' }
      ],
      canGoBack: true,
      canGoNext: true,
      canFinish: false,
      formData: {
        logo: null,
        counterpartyType: 'Юридическое лицо',
        inn: '1047712345678',
        fullName: 'Общество с ограниченной ответственностью «Солюшен Про Интерпрайсес»',
        kpp: '1047712345678',
        ogrn: '1047712345678',
        okato: '1047712345678',
        fullNamePerson: 'Петров Сергей Петрович',
        position: null,
        basis: null,
        mailingAddress: '123456, г. Москва, ул. Подвойского, д. 14, стр. 7',
        legalAddress: '123456, г. Москва, ул. Подвойского, д. 14, стр. 7',
        settlementAccount: '1047712345678',
        correspondentAccount: '1047712345678',
        bic: '1047712345678',
        bank: 'Московский банк ПАО Сбербанк г. Москва',
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
        kppCertificate: {
          file: null,
          name: '',
          size: '',
          preview: null
        }
      },
      counterpartyTypes: [
        'Юридическое лицо',
        'Индивидуальный предприниматель',
        'Физическое лицо'
      ],
      positions: [
        'Генеральный директор',
        'Директор',
        'Заместитель директора',
        'Главный бухгалтер',
        'Исполнительный директор'
      ],
      bases: [
        'Устав',
        'Доверенность',
        'Приказ',
        'Решение учредителей'
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
      if (!this.currentDocumentFile) {
        return '@/assets/imgs/document.png' // Образец по умолчанию
      }
      
      const document = this.formData[this.currentDocumentFile]
      if (document && document.file) {
        return document.preview || document.file
      }
      
      return '@/assets/imgs/document.png' // Образец по умолчанию
    }
  },
  methods: {
    openDocumentModal(documentType = null) {
      this.currentDocumentFile = documentType
      this.showDocumentModal = true
    },

    closeDocumentModal() {
      this.showDocumentModal = false
      this.currentDocumentFile = null
    },

    handleStepChange(stepIndex) {
      this.currentStep = stepIndex
      console.log('Переход на шаг:', stepIndex + 1)
    },

    handlePreviousStep(stepIndex) {
      this.currentStep = stepIndex
      console.log('Предыдущий шаг:', stepIndex + 1)
    },

    async handleNextStep(stepIndex) {
      // Валидация для первого шага (форма)
      if (this.currentStep === 0 && this.$refs.form && !this.$refs.form.validate()) {
        return
      }

      // Валидация для второго шага (документы)
      if (this.currentStep === 1) {
        const requiredDocuments = ['innCertificate', 'ogrnCertificate', 'kppCertificate']
        const missingDocuments = requiredDocuments.filter(doc => !this.formData[doc])
        
        if (missingDocuments.length > 0) {
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

    handleFinish() {
      // Переход на главную страницу или следующую страницу
      this.$router.push('/')
    },

    handleUploadError(errorMessage) {
      console.error('Upload error:', errorMessage)
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
    },

    handleKppFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.formData.kppCertificate = {
          file: file,
          name: file.name,
          size: this.formatFileSize(file.size),
          preview: URL.createObjectURL(file)
        }
      }
    },

    removeKppCertificate() {
      if (this.formData.kppCertificate && this.formData.kppCertificate.preview) {
        URL.revokeObjectURL(this.formData.kppCertificate.preview)
      }
      this.formData.kppCertificate = {
        file: null,
        name: '',
        size: '',
        preview: null
      }
    },

    triggerKppFileInput() {
      this.$refs.kppFileInput.click()
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
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    padding: 32px;
    text-align: center;
    background: #f9fafb;
    width: 100%;
    max-width: 624px;
    height: 146px;
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
    gap: 12px;
    width: 100%;
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
    padding: 8px 16px;
    background: none;
    border: none;
    color: #1735f5;
    font-size: 14px;
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
    width: 16px;
    height: 16px;
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
    margin-bottom: 24px;

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
    color: #263043;
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
    }

    &__input,
    &__select {
      font-size: 16px; // Предотвращает зум на iOS
    }

    &__upload-area {
      width: 100%;
      height: auto;
      min-height: 200px;
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
