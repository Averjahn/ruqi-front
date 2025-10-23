import axios from 'axios'
import store from '@/store/index'
import { getAPIError } from '@/constants/helpers'

const qs = require('qs')

const serialize = (params) => {
  return qs.stringify(params, {
    arrayFormat: 'brackets',
    encode: false,
    skipNulls: true,
    filter: (prefix, value) => {
      if (prefix !== '' && typeof value === 'object' && value !== null && !Array.isArray(value))
        return JSON.stringify(value)
      return value
    },
  })
}

// console.log('API_URL:', process.env.API_URL)

const instance = axios.create({
  // baseURL: process.env.API_URL,
  baseURL: 'https://api.stagelkk.ruqi.ru/', // Updated to staging API
  paramsSerializer: serialize,
})

instance.setToken = function (token) {
  if (token) {
    this.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete this.defaults.headers.common['Authorization']
  }
}

instance.interceptors.response.use(
  (response) => {
    if (response?.data?.error?.code === 746200 && store.getters['auth/isLogged']) {
      store.dispatch('auth/logOut')
      location.href = '/client/signin'
    }
    if (response.config.errorMessage && !response?.data?.success) {
      store.dispatch('notifications/showNotification', {
        text: getAPIError(response) || response.config.errorMessage,
      })
    }
    return response
  },
  (error) => {
    if (!axios.isCancel(error)) {
      window.RqloggerError({ type: 'axios', error: error.toJSON() })
    }
    if (error.config.errorMessage) {
      store.dispatch('notifications/showNotification', {
        text: error.config.errorMessage,
      })
    }
    const status = error?.response?.status
    if (!status) {
      return error
    }
    if (status === 500) {
      store.dispatch('notifications/showNotification', {
        text: `Ошибка сервера. "${error?.response?.data?.message}"`,
      })
    } else if (status === 401 || status === 403) {
      store.dispatch('notifications/showNotification', {
        text: 'Отказано в доступе',
      })
    } else if (status === 422) {
      store.dispatch('notifications/showNotification', {
        text: 'Некорректно сформированный запрос',
      })
    }
    return error
  },
)

export default instance
