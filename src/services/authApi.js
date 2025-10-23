import axios from 'axios'

/**
 * Сервис для работы с API авторизации
 */
class AuthApiService {
  constructor() {
    this.baseURL = process.env.VUE_APP_API_URL || 'https://api.stagelkk.ruqi.ru'
  }

  /**
   * Запрос SMS кода на телефон
   * @param {string} phone - Номер телефона
   * @param {string} userType - Тип пользователя (contractor, manager)
   * @returns {Promise<Object>} Ответ API
   */
  async requestPhoneCode(phone, userType = 'contractor') {
    try {
      const response = await axios.post(`${this.baseURL}/api/auth/phone/request`, {
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
      const response = await axios.post(`${this.baseURL}/api/auth/phone/confirm`, {
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
        endpoint = `${this.baseURL}/api/v2/auth/login/contractor`
      } else if (userType === 'client') {
        endpoint = `${this.baseURL}/api/v2/auth/login/client`
      } else {
        endpoint = `${this.baseURL}/api/v2/auth/login`
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
   * Авторизация клиента по email/телефону и паролю
   * @param {string} login - Email или телефон
   * @param {string} password - Пароль
   * @returns {Promise<Object>} Ответ API
   */
  async loginClient(login, password) {
    try {
      const response = await axios.post(`${this.baseURL}/api/v2/auth/login/client`, {
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
   * Запрос кода восстановления пароля для клиента
   * @param {string} loginPhone - Телефон или email для восстановления
   * @returns {Promise<Object>} Ответ API
   */
  async requestRecoveryCode(loginPhone) {
    try {
      const response = await axios.get(`${this.baseURL}/api/v2/auth/recovery/client/request-code`, {
        params: {
          login_phone: loginPhone
        }
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
   * Авторизация через Telegram
   * @param {Object} telegramData - Данные от Telegram
   * @returns {Promise<Object>} Ответ API
   */
  async loginWithTelegram(telegramData) {
    try {
      const response = await axios.post(`${this.baseURL}/api/v2/auth/telegram`, telegramData)
      
      return {
        success: true,
        data: response.data
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
}

// Создаем экземпляр сервиса
const authApiService = new AuthApiService()

export default authApiService
