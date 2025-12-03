import axios from 'axios'

class DadataApiService {
  constructor() {
    this.baseURL = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs'
    this.apiToken = 'f64233b4b6e48a66e94cde958f4ce1e67f854ac0'
    this.apiSecret = '80c252aad82f30bd2913b4c340cc37dafa9fea23'
  }

  // Поиск организации по ИНН или ОГРН
  async findParty(inn) {
    try {
      console.log('🚀 Отправка запроса в DaData API:', {
        url: `${this.baseURL}/findById/party`,
        query: inn,
        token: this.apiToken
      })
      
      const response = await axios.post(`${this.baseURL}/findById/party`, {
        query: inn,
        count: 1
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Token ${this.apiToken}`
        }
      })

      console.log('📨 Ответ от DaData API:', response.data)

      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('❌ Ошибка в DaData API:', error)
      return this.handleError(error)
    }
  }

  // Поиск организации по названию (подсказки)
  async suggestParty(query) {
    try {
      const response = await axios.post(`${this.baseURL}/suggest/party`, {
        query: query,
        count: 10
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Token ${this.apiToken}`
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

  // Поиск банка по БИК, SWIFT, ИНН или регистрационному номеру
  async findBank(query, kpp = null) {
    try {
      console.log('🚀 Отправка запроса в DaData API для поиска банка:', {
        url: `${this.baseURL}/findById/bank`,
        query: query,
        kpp: kpp,
        token: this.apiToken
      })

      const requestBody = { query }
      if (kpp) {
        requestBody.kpp = kpp
      }

      const response = await axios.post(`${this.baseURL}/findById/bank`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Token ${this.apiToken}`
        }
      })

      console.log('📨 Ответ от DaData API (банк):', response.data)

      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('❌ Ошибка в DaData API (банк):', error)
      return this.handleError(error)
    }
  }

  // Обработка ошибок
  handleError(error) {
    let errorMessage = 'Произошла ошибка при обращении к DaData API'
    
    if (error.response) {
      const status = error.response.status
      const data = error.response.data
      
      switch (status) {
        case 400:
          errorMessage = 'Некорректный запрос к DaData API'
          break
        case 401:
          errorMessage = 'Неверный API ключ DaData'
          break
        case 403:
          errorMessage = 'Превышен лимит запросов к DaData API'
          break
        case 404:
          errorMessage = 'Организация не найдена'
          break
        case 429:
          errorMessage = 'Слишком много запросов к DaData API'
          break
        default:
          errorMessage = data?.message || `Ошибка DaData API: ${status}`
      }
    } else if (error.request) {
      errorMessage = 'Нет соединения с DaData API'
    }

    return {
      success: false,
      error: errorMessage
    }
  }
}

export default new DadataApiService()
