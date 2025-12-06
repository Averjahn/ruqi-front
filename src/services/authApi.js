import axios from '@/plugins/axios'

/**
 * Сервис для работы с API авторизации
 */
class AuthApiService {
  constructor() {
    // baseURL уже настроен в plugins/axios.js
  }

  /**
   * Запрос SMS кода на телефон
   * @param {string} phone - Номер телефона
   * @param {string} userType - Тип пользователя (contractor, manager)
   * @returns {Promise<Object>} Ответ API
   */
  async requestPhoneCode(phone, userType = 'contractor') {
    try {
      const response = await axios.post('/api/auth/phone/request', {
        phone: phone,
        user_type: userType
      })

      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Подтверждение SMS кода
   * @param {string} phone - Номер телефона
   * @param {string} code - SMS код
   * @param {string} userType - Тип пользователя
   * @returns {Promise<Object>} Ответ API
   */
  async confirmPhoneCode(phone, code, userType = 'contractor') {
    try {
      const response = await axios.post('/api/auth/phone/confirm', {
        phone: phone,
        code: code,
        user_type: userType
      })
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Авторизация по email/телефону и паролю
   * @param {string} login - Email или телефон
   * @param {string} password - Пароль
   * @param {string} userType - Тип пользователя
   * @returns {Promise<Object>} Ответ API
   */
  async loginWithPassword(login, password, userType = 'contractor') {
    try {
      let endpoint
      if (userType === 'contractor') {
        endpoint = '/api/v2/auth/login/contractor'
      } else if (userType === 'client') {
        endpoint = '/api/v2/auth/login/client'
      } else {
        endpoint = '/api/v2/auth/login'
      }
      
      const response = await axios.post(endpoint, {
        phone_or_email: login,
        password: password
      })
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Отправка SMS кода для входа клиента
   * POST /api/v2/auth/login/client/sms/sendcode
   * @param {string} phone - Номер телефона (10-11 цифр, без +)
   * @returns {Promise<Object>} Ответ API
   */
  async sendClientLoginSmsCode(phone) {
    try {
      // Очищаем телефон от + и пробелов, оставляем только цифры
      const cleanPhone = phone.replace(/\D/g, '')
      
      const response = await axios.post('/api/v2/auth/login/client/sms/sendcode', {
        phone: cleanPhone
      })
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Авторизация клиента по телефону и паролю
   * @param {string} phone - Номер телефона (10-11 цифр, без +)
   * @param {string} password - Пароль
   * @returns {Promise<Object>} Ответ API
   */
  async loginClient(phone, password) {
    try {
      // Очищаем телефон от + и пробелов, оставляем только цифры
      const cleanPhone = phone.replace(/\D/g, '')
      
      const response = await axios.post('/api/v2/auth/login/client', {
        phone: cleanPhone,
        password: password
      })
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data || response.data
        }
      } else {
        return {
          success: false,
          error: response.data.error
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Запрос кода восстановления пароля для клиента
   * @param {string} loginPhone - Телефон для восстановления (10-11 цифр, без +)
   * @param {string} verificationBy - Метод отправки кода (telegram/sms), по умолчанию telegram
   * @returns {Promise<Object>} Ответ API
   */
  async requestRecoveryCode(loginPhone, verificationBy = 'telegram') {
    try {
      // Очищаем телефон от + и пробелов, оставляем только цифры
      const cleanPhone = loginPhone.replace(/\D/g, '')
      
      const response = await axios.get('/api/v2/auth/recovery/client/request-code', {
        params: {
          login_phone: cleanPhone,
          verification_by: verificationBy
        }
      })
      
      // Проверяем успешность ответа от API
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data || response.data
        }
      } else {
        return {
          success: false,
          error: response.data.error
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Подтверждение кода восстановления пароля для клиента (Шаг 1)
   * @param {string} onceToken - Токен из ответа requestRecoveryCode
   * @param {string} code - Код верификации (4 цифры)
   * @returns {Promise<Object>} Ответ API с новым once_token
   */
  async confirmRecoveryCode(onceToken, code) {
    try {
      const response = await axios.post('/api/v2/auth/recovery/client/submit-code', {
        once_token: onceToken,
        code: code
      })
      
      // Проверяем успешность ответа от API
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data || response.data
        }
      } else {
        return {
          success: false,
          error: response.data.error
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Установка нового пароля после подтверждения кода восстановления (Шаг 2)
   * @param {string} onceToken - Токен из ответа confirmRecoveryCode
   * @param {string} password - Новый пароль
   * @param {string} confirmPassword - Подтверждение пароля
   * @returns {Promise<Object>} Ответ API с authToken
   */
  async setNewPassword(onceToken, password, confirmPassword) {
    try {
      const response = await axios.post('/api/v2/auth/recovery/client/submit-password', {
        once_token: onceToken,
        password: password,
        confirm_password: confirmPassword
      })
      
      // Проверяем успешность ответа от API
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data || response.data
        }
      } else {
        return {
          success: false,
          error: response.data.error
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Запрос верификации email для клиента
   * @param {string} email - Email адрес
   * @returns {Promise<Object>} Ответ API
   */
  async requestEmailVerification(email) {
    try {
      const response = await axios.post('/api/v2/auth/email/client/request-verification', {
        email: email
      })
      
      // Проверяем успешность ответа от API
      if (response.data.success) {
        return {
          success: true,
          data: response.data
        }
      } else {
        return {
          success: false,
          error: response.data.error
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Верификация email клиента по токену
   * @param {string} token - Токен верификации
   * @returns {Promise<Object>} Ответ API
   */
  async verifyEmail(token) {
    try {
      const response = await axios.get('/api/v2/auth/email/client/verify', {
        params: {
          token: token
        }
      })
      
      // Проверяем успешность ответа от API
      if (response.data.success) {
        return {
          success: true,
          data: response.data
        }
      } else {
        return {
          success: false,
          error: response.data.error
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Получение статуса клиентского кабинета
   * Требуется авторизация через Bearer токен
   * @returns {Promise<Object>} Ответ API с user_status, ready_status, onboarding_status, available, is_login, login_email, login_phone, email_verified, phone_verified
   */
  async getClientStatus() {
    try {
      const response = await axios.get('/api/v2/auth/client/status')
      
      // Проверяем успешность ответа от API
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data || response.data
        }
      } else {
        return {
          success: false,
          error: response.data.error
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Первичная установка пароля для клиента
   * @param {string} token - Токен для установки пароля
   * @param {string} password - Новый пароль
   * @returns {Promise<Object>} Ответ API
   */
  async setupPassword(token, password) {
    try {
      const response = await axios.post('/api/v2/auth/password/client/setup', {
        token: token,
        password: password
      })
      
      // Проверяем успешность ответа от API
      if (response.data.success) {
        return {
          success: true,
          data: response.data
        }
      } else {
        return {
          success: false,
          error: response.data.error
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Регистрация клиента (Шаг 1) - отправка номера телефона
   * @param {string} phone - Номер телефона (10-11 цифр, без +)
   * @returns {Promise<Object>} Ответ API с once_token, client_uuid, account_uuid, code_sended
   */
  async registerClient(phone) {
    try {
      // Очищаем телефон от + и пробелов, оставляем только цифры
      const cleanPhone = phone.replace(/\D/g, '')
      
      const response = await axios.post('/api/v2/auth/register/client', {
        phone: cleanPhone
      })
      
      // Проверяем успешность ответа от API
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data || response.data
        }
      } else {
        return {
          success: false,
          error: response.data.error
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Подтверждение кода регистрации клиента (Шаг 2)
   * @param {string} onceToken - Токен из ответа registerClient
   * @param {string} code - Код верификации из Telegram/SMS (4 цифры)
   * @returns {Promise<Object>} Ответ API с client_uuid, account_uuid, authToken
   */
  async verifyCode(onceToken, code) {
    try {
      const response = await axios.post('/api/v2/auth/register/client/verify-code', {
        once_token: onceToken,
        code: code
      })
      
      // Проверяем успешность ответа от API
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data || response.data
        }
      } else {
        return {
          success: false,
          error: response.data.error
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Установка пароля при регистрации клиента
   * POST /api/v2/auth/register/client/setup-password
   * @param {string} authToken - Токен авторизации (Bearer токен), полученный на предыдущем шаге (подтверждение кода)
   * @param {string} password - Пароль
   * @param {string} confirmPassword - Подтверждение пароля
   * @returns {Promise<Object>} Ответ API
   */
  async setupClientPassword(authToken, password, confirmPassword) {
    try {
      // Отправляем password и password_confirmation как form-data (application/x-www-form-urlencoded)
      // authToken используется как Bearer токен в заголовке Authorization
      const formData = new URLSearchParams()
      formData.append('password', password)
      formData.append('password_confirmation', confirmPassword)
      
      const response = await axios.post('/api/v2/auth/register/client/setup-password', formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${authToken}`
        }
      })
      
      // Проверяем успешность ответа от API
      if (response.data.success) {
        return {
          success: true,
          data: response.data
        }
      } else {
        return {
          success: false,
          error: response.data.error
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Получение организации текущего клиента
   * GET /api/v2/auth/client/organization
   * Требуется авторизация (Bearer токен)
   * @returns {Promise<Object>} Ответ API с данными организации или ошибкой 404 если организации нет
   */
  async getClientOrganization() {
    try {
      const response = await axios.get('/api/v2/auth/client/organization')
      
      // Проверяем успешность ответа от API
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data || response.data
        }
      } else {
        return {
          success: false,
          error: response.data.error
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Создание организации для текущего клиента
   * POST /api/v2/auth/client/organization
   * Требуется авторизация (Bearer токен)
   * @param {Object} organizationData - Данные организации
   * @returns {Promise<Object>} Ответ API с uuid организации
   */
  async createClientOrganization(organizationData) {
    try {
      const response = await axios.post('/api/v2/auth/client/organization', organizationData)
      
      // Проверяем успешность ответа от API
      // Согласно документации, при успешном создании возвращается статус 201 и success: true
      if (response.status === 201 || (response.data && response.data.success)) {
        return {
          success: true,
          data: response.data.data || response.data
        }
      } else {
        return {
          success: false,
          error: response.data.error
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Верификация клиента
   * @param {number} userId - ID пользователя
   * @returns {Promise<Object>} Ответ API
   */
  async verifyClient(userId) {
    try {
      const response = await axios.post('/api/v2/auth/client/verify', {
        user_id: userId
      })
      
      // Проверяем успешность ответа от API
      if (response.data.success) {
        return {
          success: true,
          data: response.data
        }
      } else {
        return {
          success: false,
          error: response.data.error
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Авторизация через Telegram
   * @param {Object} telegramData - Данные от Telegram
   * @returns {Promise<Object>} Ответ API
   */
  async loginWithTelegram(telegramData) {
    try {
      const response = await axios.post('/api/v2/auth/telegram', telegramData)
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Получить профиль текущего клиента
   * GET /api/v2/auth/client/profile
   * Требуется авторизация (Bearer токен)
   * @returns {Promise<Object>} Ответ API с данными профиля клиента
   */
  async getClientProfile() {
    try {
      const response = await axios.get('/api/v2/auth/client/profile')
      
      // Проверяем успешность ответа от API
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data || response.data
        }
      } else {
        return {
          success: false,
          error: response.data.error
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Создать или обновить профиль клиента (PUT)
   * PUT /api/v2/auth/client/profile
   * Требуется авторизация (Bearer токен)
   * @param {Object} profileData - Данные профиля для обновления
   * @returns {Promise<Object>} Ответ API
   */
  async updateClientProfile(profileData) {
    try {
      const response = await axios.put('/api/v2/auth/client/profile', profileData)
      
      // Проверяем успешность ответа от API
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data || response.data
        }
      } else {
        return {
          success: false,
          error: response.data.error
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Создать или обновить профиль клиента (PATCH)
   * PATCH /api/v2/auth/client/profile
   * Требуется авторизация (Bearer токен)
   * @param {Object} profileData - Данные профиля для частичного обновления
   * @returns {Promise<Object>} Ответ API
   */
  async patchClientProfile(profileData) {
    try {
      const response = await axios.patch('/api/v2/auth/client/profile', profileData)
      
      // Проверяем успешность ответа от API
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data || response.data
        }
      } else {
        return {
          success: false,
          error: response.data.error
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Запросить код для смены номера телефона
   * POST /api/v2/auth/client/phone/request-change
   * Требуется авторизация (Bearer токен)
   * @param {string} phone - Новый номер телефона
   * @returns {Promise<Object>} Ответ API
   */
  async requestPhoneChange(phone) {
    try {
      // Очищаем телефон от + и пробелов, оставляем только цифры
      const cleanPhone = phone.replace(/\D/g, '')
      
      const response = await axios.post('/api/v2/auth/client/phone/request-change', {
        new_phone: cleanPhone,
        verification_by: "sms"
      })
      
      // Проверяем успешность ответа от API
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data || response.data
        }
      } else {
        return {
          success: false,
          error: response.data.error
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Подтвердить смену номера телефона
   * POST /api/v2/auth/client/phone/confirm-change
   * Требуется авторизация (Bearer токен)
   * @param {string} code - Код подтверждения
   * @param {string} phone - Номер телефона (опционально, если требуется)
   * @returns {Promise<Object>} Ответ API
   */
  async confirmPhoneChange(code, phone = null) {
    try {
      const requestData = { code }
      
      const response = await axios.post('/api/v2/auth/client/phone/confirm-change', requestData)
      
      // Проверяем успешность ответа от API
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data || response.data
        }
      } else {
        return {
          success: false,
          error: response.data.error
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Запросить привязку email
   * POST /api/v2/auth/client/email/request-bind
   * Требуется авторизация (Bearer токен)
   * @param {string} email - Email адрес для привязки
   * @returns {Promise<Object>} Ответ API
   */
  async requestEmailBind(email) {
    try {
      const response = await axios.post('/api/v2/auth/client/email/request-bind', {
        email: email
      })
      
      // Проверяем успешность ответа от API
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data || response.data
        }
      } else {
        return {
          success: false,
          error: response.data.error
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Подтвердить привязку email
   * POST /api/v2/auth/client/email/confirm-bind
   * Требуется авторизация (Bearer токен)
   * @param {string} token - Токен подтверждения
   * @param {string} email - Email адрес (опционально, если требуется)
   * @returns {Promise<Object>} Ответ API
   */
  async confirmEmailBind(token, email = null) {
    try {
      const requestData = { token }
      if (email) {
        requestData.email = email
      }
      
      const response = await axios.post('/api/v2/auth/client/email/confirm-bind', requestData)
      
      // Проверяем успешность ответа от API
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data || response.data
        }
      } else {
        return {
          success: false,
          error: response.data.error
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Получить ссылку для привязки Telegram
   * GET /api/v2/auth/client/telegram/link
   * Требуется авторизация (Bearer токен)
   * @returns {Promise<Object>} Ответ API с ссылкой для привязки Telegram
   */
  async getTelegramLink() {
    try {
      const response = await axios.get('/api/v2/auth/client/telegram/link')
      
      // Проверяем успешность ответа от API
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data || response.data
        }
      } else {
        return {
          success: false,
          error: response.data.error
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Смена пароля через старый пароль
   * POST /api/v2/auth/client/password/change
   * Требуется авторизация (Bearer токен)
   * @param {string} oldPassword - Старый пароль
   * @param {string} newPassword - Новый пароль
   * @returns {Promise<Object>} Ответ API
   */
  async changePasswordByOldPassword(oldPassword, newPassword) {
    try {
      const response = await axios.post('/api/v2/auth/client/password/change', {
        old_password: oldPassword,
        new_password: newPassword
      })
      
      // Проверяем успешность ответа от API
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data || response.data
        }
      } else {
        return {
          success: false,
          error: response.data.error
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Отправка кода восстановления пароля
   * POST /api/v2/auth/client/password/send-recovery-code
   * @param {string} recoveryType - Тип восстановления (email/phone)
   * @param {string} email - Email для восстановления (если recovery_type=email)
   * @param {string} phone - Телефон для восстановления (если recovery_type=phone)
   * @param {string} verificationBy - Метод отправки кода для телефона (telegram/sms)
   * @returns {Promise<Object>} Ответ API
   */
  async sendPasswordRecoveryCode(recoveryType, { email = null, phone = null, verificationBy = 'telegram' }) {
    try {
      const requestData = {
        recovery_type: recoveryType
      }
      
      if (recoveryType === 'email' && email) {
        requestData.email = email
      } else if (recoveryType === 'phone' && phone) {
        // Очищаем телефон от + и пробелов, оставляем только цифры
        const cleanPhone = phone.replace(/\D/g, '')
        requestData.phone = cleanPhone
        requestData.verification_by = verificationBy
      }
      
      const response = await axios.post('/api/v2/auth/client/password/send-recovery-code', requestData)
      
      // Проверяем успешность ответа от API
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data || response.data
        }
      } else {
        return {
          success: false,
          error: response.data.error
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Установка нового пароля по коду восстановления
   * POST /api/v2/auth/client/password/set-new-by-code
   * @param {string} recoveryType - Тип восстановления (email/phone)
   * @param {string} code - 4-значный код восстановления
   * @param {string} newPassword - Новый пароль (минимум 8 символов)
   * @returns {Promise<Object>} Ответ API
   */
  async setNewPasswordByCode(recoveryType, code, newPassword) {
    try {
      const response = await axios.patch('/api/v2/auth/client/password/set-new-by-code', {
        recovery_type: recoveryType,
        code: code,
        new_password: newPassword
      })
      
      // Проверяем успешность ответа от API
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data || response.data
        }
      } else {
        return {
          success: false,
          error: response.data.error
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Обработка ошибок API
   * @param {Error} error - Ошибка
   * @returns {Object} Форматированная ошибка
   */
  handleError(error) {
    if (error.response) {
      // Сервер ответил с кодом ошибки
      const { data } = error.response
      
      if (data && data.success === false) {
        return {
          success: false,
          error: data.error
        }
      }
      
      // Другие ошибки сервера
      return {
        success: false,
        error: [{
          code: error.response.status,
          msg: error.response.statusText || 'Ошибка сервера'
        }]
      }
    }
    
    // Ошибки сети или другие
    return {
      success: false,
      error: [{
        code: 'NETWORK_ERROR',
        msg: 'Ошибка сети или сервера'
      }]
    }
  }

  /**
   * Загрузка логотипа организации
   * POST /api/v2/org/{uuid}/logo
   * Требуется авторизация (Bearer токен)
   * @param {string} orgUuid - UUID организации
   * @param {File} file - Файл логотипа
   * @returns {Promise<Object>} Ответ API
   */
// пример внутри класса AuthApiService
  async uploadOrganizationLogo(orgUuid, file) {
    try {
      const formData = new FormData()
      formData.append('file', file) // имя поля строго "file" как в доке

      const response = await axios.post(`/api/v2/org/${orgUuid}/logo`, formData, {
        headers: {
          Accept: 'application/json',
          // Content-Type для FormData axios сам поставит (с boundary)
        },
      })

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data || response.data,
        }
      } else {
        return {
          success: false,
          error: response.data.error,
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Загрузка документа организации
   * POST /api/v2/org/{uuid}/document
   * Требуется авторизация (Bearer токен)
   * @param {string} orgUuid - UUID организации
   * @param {File} file - Файл документа
   * @param {string} documentType - Тип документа ('inn' или 'ogrn')
   * @returns {Promise<Object>} Ответ API
   */
  async uploadOrganizationDocument(orgUuid, file, documentType) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', documentType)

      const response = await axios.post(`/api/v2/org/${orgUuid}/document`, formData, {
        headers: {
          Accept: 'application/json',
          // Content-Type для FormData axios сам поставит (с boundary)
        },
      })

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data || response.data,
        }
      } else {
        return {
          success: false,
          error: response.data.error,
        }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getOrganizationLogo(orgUuid) {
    try {
      const response = await axios.get(
        `/img/organizations/${orgUuid}/logo/original`,
        {
          responseType: 'blob', // получаем файл
          headers: {
            Accept: 'application/json',
          },
        }
      )

      const blob = response.data
      const url = URL.createObjectURL(blob)

      return {
        success: true,
        data: {
          blob,
          url,
        },
      }
    } catch (error) {
      return this.handleError(error)
    }
  }


}

// Создаем экземпляр сервиса
const authApiService = new AuthApiService()

export default authApiService
