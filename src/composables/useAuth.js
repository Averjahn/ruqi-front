import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import authApiService from '@/services/authApi'

/**
 * Composable для работы с авторизацией
 */
export function useAuth() {
  const store = useStore()
  const router = useRouter()
  
  // Состояние загрузки
  const loading = ref(false)
  const error = ref(null)

  /**
   * Запрос SMS кода на телефон
   * @param {string} phone - Номер телефона
   * @param {string} userType - Тип пользователя
   * @returns {Promise<boolean>} Успешность запроса
   */
  const requestPhoneCode = async (phone, userType = 'contractor') => {
    loading.value = true
    error.value = null
    
    try {
      const result = await authApiService.requestPhoneCode(phone, userType)
      
      if (result.success) {
        return true
      } else {
        error.value = result.error
        return false
      }
    } catch (err) {
      error.value = [{ code: 'UNKNOWN_ERROR', msg: 'Неизвестная ошибка' }]
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Подтверждение SMS кода
   * @param {string} phone - Номер телефона
   * @param {string} code - SMS код
   * @param {string} userType - Тип пользователя
   * @returns {Promise<boolean>} Успешность авторизации
   */
  const confirmPhoneCode = async (phone, code, userType = 'contractor') => {
    loading.value = true
    error.value = null
    
    try {
      const result = await authApiService.confirmPhoneCode(phone, code, userType)
      
      if (result.success && result.data.token) {
        // Сохраняем токен и авторизуем пользователя
        await store.dispatch('auth/auth', result.data.token)
        return true
      } else {
        error.value = result.error
        return false
      }
    } catch (err) {
      error.value = [{ code: 'UNKNOWN_ERROR', msg: 'Неизвестная ошибка' }]
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Авторизация по email/телефону и паролю
   * @param {string} login - Email или телефон
   * @param {string} password - Пароль
   * @param {string} userType - Тип пользователя
   * @returns {Promise<boolean>} Успешность авторизации
   */
  const loginWithPassword = async (login, password, userType = 'contractor') => {
    loading.value = true
    error.value = null
    
    try {
      const result = await authApiService.loginWithPassword(login, password, userType)
      
      if (result.success && result.data.token) {
        // Сохраняем токен и авторизуем пользователя
        await store.dispatch('auth/auth', result.data.token)
        return true
      } else {
        error.value = result.error
        return false
      }
    } catch (err) {
      error.value = [{ code: 'UNKNOWN_ERROR', msg: 'Неизвестная ошибка' }]
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Авторизация клиента по телефону и паролю
   * @param {string} phone - Номер телефона (10-11 цифр)
   * @param {string} password - Пароль
   * @returns {Promise<boolean>} Успешность авторизации
   */
  const loginClient = async (phone, password) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await authApiService.loginClient(phone, password)
      
      if (result.success && result.data) {
        // Согласно документации, авторизация возвращает token (не authToken)
        const token = result.data.token
        if (token) {
          // Сохраняем токен и авторизуем пользователя
          await store.dispatch('auth/auth', token)
          return true
        }
      }
      error.value = result.error
      return false
    } catch (err) {
      error.value = [{ code: 'UNKNOWN_ERROR', msg: 'Неизвестная ошибка' }]
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Запрос кода восстановления пароля для клиента
   * @param {string} loginPhone - Телефон для восстановления (10-11 цифр)
   * @param {string} verificationBy - Метод отправки кода (telegram/sms), по умолчанию telegram
   * @returns {Promise<Object|null>} Объект с once_token и code_sended или null при ошибке
   */
  const requestRecoveryCode = async (loginPhone, verificationBy = 'telegram') => {
    loading.value = true
    error.value = null
    
    try {
      const result = await authApiService.requestRecoveryCode(loginPhone, verificationBy)
      
      if (result.success) {
        return result.data
      } else {
        error.value = result.error
        return null
      }
    } catch (err) {
      error.value = [{ code: 'UNKNOWN_ERROR', msg: 'Неизвестная ошибка' }]
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Подтверждение кода восстановления пароля для клиента (Шаг 1)
   * @param {string} onceToken - Токен из ответа requestRecoveryCode
   * @param {string} code - Код верификации (4 цифры)
   * @returns {Promise<Object|null>} Объект с новым once_token или null при ошибке
   */
  const confirmRecoveryCode = async (onceToken, code) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await authApiService.confirmRecoveryCode(onceToken, code)
      
      if (result.success) {
        return result.data
      } else {
        error.value = result.error
        return null
      }
    } catch (err) {
      error.value = [{ code: 'UNKNOWN_ERROR', msg: 'Неизвестная ошибка' }]
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Установка нового пароля после подтверждения кода восстановления (Шаг 2)
   * @param {string} onceToken - Токен из ответа confirmRecoveryCode
   * @param {string} password - Новый пароль
   * @param {string} confirmPassword - Подтверждение пароля
   * @returns {Promise<boolean>} Успешность установки пароля и авторизации
   */
  const setNewPassword = async (onceToken, password, confirmPassword) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await authApiService.setNewPassword(onceToken, password, confirmPassword)
      
      if (result.success && result.data) {
        // Согласно документации, восстановление пароля возвращает authToken (не token)
        const authToken = result.data.authToken
        if (authToken) {
          // Сохраняем токен и авторизуем пользователя
          await store.dispatch('auth/auth', authToken)
          return true
        }
      } else {
        error.value = result.error
        return false
      }
    } catch (err) {
      error.value = [{ code: 'UNKNOWN_ERROR', msg: 'Неизвестная ошибка' }]
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Авторизация через Telegram
   * @param {Object} telegramData - Данные от Telegram
   * @returns {Promise<boolean>} Успешность авторизации
   */
  const loginWithTelegram = async (telegramData) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await authApiService.loginWithTelegram(telegramData)
      
      if (result.success && result.data.token) {
        // Сохраняем токен и авторизуем пользователя
        await store.dispatch('auth/auth', result.data.token)
        return true
      } else {
        error.value = result.error
        return false
      }
    } catch (err) {
      error.value = [{ code: 'UNKNOWN_ERROR', msg: 'Неизвестная ошибка' }]
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Выход из системы
   */
  const logout = () => {
    store.dispatch('auth/logout')
    router.push('/client/signin')
  }

  /**
   * Получение текста ошибки для отображения пользователю
   * @param {Array|Object} errorData - Данные об ошибке
   * @returns {string} Текст ошибки
   */
  const getErrorMessage = (errorData) => {
    if (!errorData) return 'Неизвестная ошибка'
    
    if (Array.isArray(errorData)) {
      return errorData.map(err => err.msg || err.message).join(', ')
    }
    
    if (typeof errorData === 'object') {
      return errorData.msg || errorData.message || 'Ошибка'
    }
    
    return String(errorData)
  }

  // Computed свойства
  const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
  const currentUser = computed(() => store.getters['auth/currentUser'])

  return {
    // Состояние
    loading,
    error,
    isAuthenticated,
    currentUser,
    
    // Методы
    requestPhoneCode,
    confirmPhoneCode,
    loginWithPassword,
    loginClient,
    requestRecoveryCode,
    confirmRecoveryCode,
    setNewPassword,
    loginWithTelegram,
    logout,
    getErrorMessage
  }
}
