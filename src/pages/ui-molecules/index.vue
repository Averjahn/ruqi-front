<template>
  <div class="ui-molecules">
    <div class="ui-molecules__header">
      <h1>Molecules ({{ componentStats.molecules }})</h1>
      <p>Компоненты, состоящие из нескольких атомов</p>
    </div>

    <div class="ui-molecules__content">
      <!-- File Components -->
      <div class="ui-molecules__subsection">
        <h3>File Components</h3>
        <div class="ui-molecules__showcase">
          <div class="ui-molecules__item">
            <h4>AttachedFilesButton</h4>
            <AttachedFilesButton :files="testFiles" />
          </div>
          
          <div class="ui-molecules__item">
            <h4>AttachedFilesGallery</h4>
            <AttachedFilesGallery :files="testFiles" />
          </div>
          
          <div class="ui-molecules__item">
            <h4>AttachedFilesGalleryMini</h4>
            <AttachedFilesGalleryMini :files="testFiles" />
          </div>
        </div>
      </div>

      <!-- Navigation Components -->
      <div class="ui-molecules__subsection">
        <h3>Navigation Components</h3>
        <div class="ui-molecules__showcase">
          <div class="ui-molecules__item">
            <h4>BreadCrumbs</h4>
            <BreadCrumbs :items="testBreadcrumbs" />
          </div>
          
          <div class="ui-molecules__item">
            <h4>MenuList</h4>
            <MenuList :items="testMenuItems" />
          </div>
        </div>
      </div>

      <!-- Certificate Components -->
      <div class="ui-molecules__subsection">
        <h3>Certificate Components</h3>
        <div class="ui-molecules__showcase">
          <div class="ui-molecules__item">
            <h4>Certificate</h4>
            <Certificate :certificate="testCertificateData" />
          </div>
          
          <div class="ui-molecules__item">
            <h4>CertificateEmpty</h4>
            <CertificateEmpty :loading="false" />
          </div>
        </div>
      </div>

      <!-- Document and List Components -->
      <div class="ui-molecules__subsection">
        <h3>Document and List Components</h3>
        <div class="ui-molecules__showcase">
          <div class="ui-molecules__item">
            <h4>DocumentsList</h4>
            <DocumentsList :documents="[testDocumentData]" />
          </div>
          
          <div class="ui-molecules__item">
            <h4>GradeDescriptionCard</h4>
            <GradeDescriptionCard :grade="testGradeData" />
          </div>
        </div>
      </div>

      <!-- ObjectCard - отдельная строка -->
      <div class="ui-molecules__subsection">
        <h3>ObjectCard</h3>
        <div class="ui-molecules__showcase ui-molecules__showcase--single">
          <div class="ui-molecules__item ui-molecules__item--wide">
            <h4>ObjectCard</h4>
            <ObjectCard :object="testObject" />
          </div>
        </div>
      </div>

      <!-- Password Reset Components -->
      <div class="ui-molecules__subsection">
        <h3>Password Reset Components</h3>
        <div class="ui-molecules__showcase">
          <div class="ui-molecules__item">
            <h4>PasswordResetByEmail</h4>
            <PasswordResetByEmail :user="testUser" />
          </div>
          
          <div class="ui-molecules__item">
            <h4>PasswordResetByOldPassword</h4>
            <PasswordResetByOldPassword :user="testUser" />
          </div>
          
          <div class="ui-molecules__item">
            <h4>PasswordResetByPhone</h4>
            <PasswordResetByPhone :user="testUser" />
          </div>
        </div>
      </div>

      <!-- Form Fields -->
      <div class="ui-molecules__subsection">
        <h3>Form Fields</h3>
        <div class="ui-molecules__showcase">
        </div>
      </div>

      <!-- User Components -->
      <div class="ui-molecules__subsection">
        <h3>User Components</h3>
        <div class="ui-molecules__showcase">
          <div class="ui-molecules__item">
            <h4>UserNotificationItem</h4>
            <UserNotificationItem :notification="testUserNotificationData" />
          </div>
          
          <div class="ui-molecules__item">
            <h4>UserRating</h4>
            <UserRating :rating="testUserRatingData.rating" :reviews="testUserRatingData.reviews" />
          </div>
        </div>
      </div>


        <!-- UnifiedInputField - All Types -->
        <div class="ui-molecules__subsection">
          <h3>UnifiedInputField - All Types</h3>
          <div class="ui-molecules__showcase">
            <div class="ui-molecules__item ui-molecules__item--wide">
              <h4>UnifiedInputField - Phone, Password, SMS Code, INN</h4>
              <div class="ui-molecules__unified-demo">
                <!-- Phone Field -->
                <div class="ui-molecules__field-demo">
                  <h5>Phone Field</h5>
                  <UnifiedInputField 
                    type="phone"
                    label="Номер телефона" 
                    v-model="unifiedValues.phone"
                    placeholder="+7 900 000-00-00"
                    :error="unifiedValidation.phone.error"
                    :success="unifiedValidation.phone.success"
                    :error-message="unifiedValidation.phone.errorMessage"
                    :success-message="unifiedValidation.phone.successMessage"
                  />
                </div>
                
                <!-- Password Field -->
                <div class="ui-molecules__field-demo">
                  <h5>Password Field</h5>
                  <UnifiedInputField 
                    type="password"
                    label="Пароль" 
                    v-model="unifiedValues.password"
                    placeholder="Введите пароль"
                    :error="unifiedValidation.password.error"
                    :success="unifiedValidation.password.success"
                    :error-message="unifiedValidation.password.errorMessage"
                    :success-message="unifiedValidation.password.successMessage"
                  />
                </div>
                
                <!-- SMS Code Field -->
                <div class="ui-molecules__field-demo">
                  <h5>SMS Code Field</h5>
                  <UnifiedInputField 
                    type="sms-code"
                    label="Код из SMS" 
                    v-model="unifiedValues.smsCode"
                    placeholder="123-456"
                    :error="unifiedValidation.smsCode.error"
                    :success="unifiedValidation.smsCode.success"
                    :error-message="unifiedValidation.smsCode.errorMessage"
                    :success-message="unifiedValidation.smsCode.successMessage"
                  />
                  <div class="ui-molecules__resend-timer">
                    <ResendCodeTimer 
                      :duration="60" 
                      :auto-start="true"
                      @resend="handleResendSmsCode"
                    />
                  </div>
                </div>
                
                <!-- INN Field -->
                <div class="ui-molecules__field-demo">
                  <h5>INN Field</h5>
                  <UnifiedInputField 
                    type="inn"
                    label="ИНН" 
                    v-model="unifiedValues.inn"
                    placeholder="1234567890"
                    :error="unifiedValidation.inn.error"
                    :success="unifiedValidation.inn.success"
                    :error-message="unifiedValidation.inn.errorMessage"
                    :success-message="unifiedValidation.inn.successMessage"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Special Components -->
        <div class="ui-molecules__subsection">
          <h3>Special Components</h3>
          <div class="ui-molecules__showcase">
            <div class="ui-molecules__item">
              <h4>DrugAreaNewDesign</h4>
              <DrugAreaNewDesign :area="testDrugAreaData" />
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
// Импорты для молекул
import AttachedFilesButton from '@/components/molecules/AttachedFilesButton.vue'
import AttachedFilesGallery from '@/components/molecules/AttachedFilesGallery.vue'
import AttachedFilesGalleryMini from '@/components/molecules/AttachedFilesGalleryMini.vue'
import BreadCrumbs from '@/components/molecules/BreadCrumbs.vue'
import Certificate from '@/components/molecules/Certificate.vue'
import CertificateEmpty from '@/components/molecules/CertificateEmpty.vue'
import DocumentsList from '@/components/molecules/DocumentsList.vue'
import DrugAreaNewDesign from '@/components/molecules/DrugAreaNewDesign.vue'
import GradeDescriptionCard from '@/components/molecules/GradeDescriptionCard.vue'
import MenuList from '@/components/molecules/MenuList.vue'
import ObjectCard from '@/components/molecules/ObjectCard.vue'
import PasswordResetByEmail from '@/components/molecules/PasswordResetByEmail.vue'
import PasswordResetByOldPassword from '@/components/molecules/PasswordResetByOldPassword.vue'
import PasswordResetByPhone from '@/components/molecules/PasswordResetByPhone.vue'
import UnifiedInputField from '@/components/molecules/UnifiedInputField.vue'
import UserNotificationItem from '@/components/molecules/UserNotificationItem.vue'
import UserRating from '@/components/molecules/UserRating.vue'

export default {
  name: 'UIMolecules',
    components: {
      AttachedFilesButton,
      AttachedFilesGallery,
      AttachedFilesGalleryMini,
      BreadCrumbs,
      Certificate,
      CertificateEmpty,
      DocumentsList,
      DrugAreaNewDesign,
      GradeDescriptionCard,
      MenuList,
      ObjectCard,
      PasswordResetByEmail,
      PasswordResetByOldPassword,
      PasswordResetByPhone,
      UnifiedInputField,
      UserNotificationItem,
      UserRating,
    },
  data() {
    return {
      // Test data
      testFiles: [
        { id: 1, name: 'document1.pdf', type: 'pdf' },
        { id: 2, name: 'image1.jpg', type: 'jpg' }
      ],
      
      testBreadcrumbs: [
        { text: 'Главная', href: '/' },
        { text: 'Профиль', href: '/profile' },
        { text: 'Настройки', href: '/profile/settings' }
      ],
      
      testMenuItems: [
        { text: 'Профиль', href: '/profile' },
        { text: 'Задачи', href: '/tasks' },
        { text: 'Настройки', href: '/settings' }
      ],
      
      testCertificateData: {
        name: 'Сертификат по технике безопасности',
        issuedBy: 'Центр обучения "Безопасность"',
        issueDate: '2023-01-01',
        expiryDate: '2024-01-01',
        number: 'CERT-2023-001',
        type: 'safety'
      },
      
      testDocumentData: {
        name: 'Паспорт гражданина РФ',
        type: 'passport',
        status: 'verified',
        uploadDate: '2024-01-01',
        verifiedDate: '2024-01-02',
        fileUrl: null
      },
      
      testObject: {
        name: 'Тестовый объект',
        address: 'г. Москва, ул. Тестовая, д. 1',
        rating: 4.5,
        rate: 2500,
        is_subscribe: false,
        logo_thumb_48x48: null,
        professions: ['Водитель', 'Грузчик', 'Кладовщик']
      },
      
      testGradeData: {
        level: 5,
        title: 'Старший специалист',
        description: 'Высокий уровень квалификации',
        requirements: [
          'Опыт работы более 3 лет',
          'Знание техники безопасности',
          'Сертификат по специальности'
        ],
        benefits: [
          'Повышенная ставка',
          'Приоритет в выборе задач',
          'Дополнительные льготы'
        ]
      },
      
      testUser: {
        name: 'Иван Иванов',
        email: 'ivan@example.com',
        phone: '+7 (999) 123-45-67'
      },
      
      testSmsData: {
        phone: '+7 (999) 123-45-67',
        code: ''
      },
      
      testUserNotificationData: {
        id: 1,
        title: 'Новое уведомление',
        message: 'У вас есть новое сообщение',
        type: 'info',
        isRead: false,
        createdAt: '2024-01-15T10:00:00Z'
      },
      
      testUserRatingData: {
        rating: 4.5,
        reviews: 25,
        averageScore: 4.2
      },
      
      testDrugAreaData: {
        name: 'Зона работы с наркотическими веществами',
        description: 'Специальная зона для работы с медицинскими препаратами',
        requirements: [
          'Медицинская книжка',
          'Справка о прохождении медосмотра',
          'Сертификат по работе с наркотическими веществами'
        ],
        restrictions: [
          'Запрет на употребление алкоголя',
          'Обязательное прохождение тестов',
          'Специальная форма одежды'
        ]
      },
      
      
      
      // UnifiedInputField values
      unifiedValues: {
        phone: '',
        password: '',
        smsCode: '',
        inn: ''
      },
      
      // UnifiedInputField validation
      unifiedValidation: {
        phone: {
          error: false,
          success: false,
          errorMessage: '',
          successMessage: ''
        },
        password: {
          error: false,
          success: false,
          errorMessage: '',
          successMessage: ''
        },
        smsCode: {
          error: false,
          success: false,
          errorMessage: '',
          successMessage: ''
        },
        inn: {
          error: false,
          success: false,
          errorMessage: '',
          successMessage: ''
        }
      },
      
      // Component stats
      componentStats: {
        atoms: 0,
        molecules: 16,
        organisms: 0,
        total: 16
      }
    }
    },
    watch: {
      'unifiedValues.phone'(newValue) {
        this.validateUnifiedField('phone', newValue)
      },
      'unifiedValues.password'(newValue) {
        this.validateUnifiedField('password', newValue)
      },
      'unifiedValues.smsCode'(newValue) {
        this.validateUnifiedField('smsCode', newValue)
      },
      'unifiedValues.inn'(newValue) {
        this.validateUnifiedField('inn', newValue)
      }
    },
    mounted() {
    // Мок для axios чтобы избежать ошибок API
    if (!this.$axios) {
      this.$axios = {
        get: (url) => {
          console.log('Mock axios.get called with:', url)
          return Promise.resolve({ 
            data: { 
              success: true, 
              data: {
                bonus: 0,
                referrals: [],
                link: 'mock-referral-link'
              }
            } 
          })
        },
        post: (url, data) => {
          console.log('Mock axios.post called with:', url, data)
          return Promise.resolve({ 
            data: { 
              success: true, 
              data: {} 
            } 
          })
        }
      }
    }
    
    // Мок для глобальных функций
    if (typeof window !== 'undefined') {
      window.RqloggerError = window.RqloggerError || function() {
        console.warn('RqloggerError called:', arguments)
      }
    }
  },
  methods: {
    // Методы для взаимодействия с компонентами
    handleFileUpload(files) {
      console.log('Загружены файлы:', files)
    },
    handleMenuClick(item) {
      console.log('Выбран пункт меню:', item)
    },
    handleObjectClick(object) {
      console.log('Клик по объекту:', object)
    },
    handleRatingChange(rating) {
      console.log('Изменен рейтинг:', rating)
    },
    handleResendSmsCode() {
      console.log('Запрос на повторную отправку SMS кода')
      // В реальном приложении здесь будет API вызов для повторной отправки SMS
      // После успешной отправки можно сбросить таймер
    },
      validateUnifiedField(fieldType, value) {
        // Сбрасываем состояние
        this.unifiedValidation[fieldType].error = false
        this.unifiedValidation[fieldType].success = false
        this.unifiedValidation[fieldType].errorMessage = ''
        this.unifiedValidation[fieldType].successMessage = ''
        
        if (!value) return
        
        switch (fieldType) {
          case 'phone':
            this.validateUnifiedPhone(value)
            break
          case 'password':
            this.validateUnifiedPassword(value)
            break
          case 'smsCode':
            this.validateUnifiedSmsCode(value)
            break
          case 'inn':
            this.validateUnifiedInn(value)
            break
        }
      },
      validateUnifiedPhone(phone) {
        const cleanPhone = phone.replace(/\D/g, '')
        
        if (cleanPhone.length > 11) {
          this.unifiedValidation.phone.error = true
          this.unifiedValidation.phone.errorMessage = 'Неверный номер телефона'
          return
        }
        
        if (!cleanPhone.startsWith('7')) {
          this.unifiedValidation.phone.error = true
          this.unifiedValidation.phone.errorMessage = 'Неверный номер телефона'
          return
        }
        
        const secondDigit = cleanPhone[1]
        if (secondDigit && secondDigit !== '8' && secondDigit !== '9') {
          this.unifiedValidation.phone.error = true
          this.unifiedValidation.phone.errorMessage = 'Неверный номер телефона'
          return
        }
        
        if (cleanPhone.length === 11) {
          this.unifiedValidation.phone.success = true
          this.unifiedValidation.phone.successMessage = 'Номер телефона корректен'
        }
      },
      validateUnifiedPassword(password) {
        if (password.length > 0 && password.length < 8) {
          this.unifiedValidation.password.error = true
          this.unifiedValidation.password.errorMessage = 'Пароль должен содержать минимум 8 символов'
          this.unifiedValidation.password.success = false
          this.unifiedValidation.password.successMessage = ''
        } else if (password.length >= 8) {
          this.unifiedValidation.password.error = false
          this.unifiedValidation.password.errorMessage = ''
          this.unifiedValidation.password.success = true
          this.unifiedValidation.password.successMessage = 'Пароль корректен'
        } else {
          // Пустой пароль - сбрасываем все состояния
          this.unifiedValidation.password.error = false
          this.unifiedValidation.password.success = false
          this.unifiedValidation.password.errorMessage = ''
          this.unifiedValidation.password.successMessage = ''
        }
      },
      validateUnifiedSmsCode(code) {
        const cleanCode = code.replace(/\D/g, '')
        
        if (cleanCode.length === 6) {
          this.unifiedValidation.smsCode.success = true
          this.unifiedValidation.smsCode.successMessage = 'Код корректен'
        } else if (cleanCode.length > 0 && cleanCode.length < 6) {
          this.unifiedValidation.smsCode.error = true
          this.unifiedValidation.smsCode.errorMessage = 'Код должен содержать 6 цифр'
        }
      },
      validateUnifiedInn(inn) {
        const cleanInn = inn.replace(/\D/g, '')
        
        if (cleanInn.length === 10 || cleanInn.length === 12) {
          this.unifiedValidation.inn.success = true
          this.unifiedValidation.inn.successMessage = 'ИНН корректен'
        } else if (cleanInn.length > 0) {
          this.unifiedValidation.inn.error = true
          this.unifiedValidation.inn.errorMessage = 'ИНН должен содержать 10 или 12 цифр'
        }
      }
  }
}
</script>

<style lang="scss" scoped>
.ui-molecules {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  &__header {
    margin-bottom: 40px;
    
    h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
      color: #263043;
    }
    
    p {
      font-size: 1.2em;
      color: #666;
    }
  }

  &__subsection {
    margin-bottom: 60px;
    
    h3 {
      font-size: 1.8em;
      margin-bottom: 20px;
      color: #263043;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
  }

  &__showcase {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    
    &--single {
      grid-template-columns: 1fr;
    }
  }

  &__item {
    padding: 24px;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    
    &--wide {
      max-width: 100%;
      min-width: 0;
    }
    
    h4 {
      font-size: 1.2em;
      margin-bottom: 15px;
      color: #263043;
    }
    
    > * + * {
      margin-top: 10px;
    }
  }

  // Field Demo Styles
  &__field-demo {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
    margin-top: 20px;
  }

    &__field-item {
      padding: 16px;
      background: white;
      border-radius: 8px;
      border: 1px solid #e9ecef;
      
      h5 {
        font-size: 0.9em;
        margin-bottom: 12px;
        color: #666;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }


    // Unified Demo Styles
    &__unified-demo {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    // Resend Timer Styles
    &__resend-timer {
      display: flex;
      justify-content: center;
      width: 100%;
      text-align: center;
    }
}
</style>
