/**
 * Утилиты для работы с датами
 * Помогают избежать циклических ссылок при работе с AirDatepicker
 */

/**
 * Создает чистый Date объект из значения, избегая циклических ссылок
 * @param {Date|string|number|null} date - Дата для преобразования
 * @returns {Date|null} - Новый Date объект или null
 */
export function createCleanDate(date) {
  if (!date) {
    return null
  }
  
  if (date instanceof Date) {
    return new Date(date.getTime())
  }
  
  try {
    return new Date(date)
  } catch (e) {
    console.error('Error creating date:', e)
    return null
  }
}

/**
 * Создает массив чистых Date объектов из диапазона дат
 * @param {Array<Date|string|number>|null} dateRange - Диапазон дат
 * @returns {Array<Date>|null} - Массив новых Date объектов или null
 */
export function createCleanDateRange(dateRange) {
  if (!dateRange || !Array.isArray(dateRange)) {
    return null
  }
  
  if (dateRange.length === 0) {
    return null
  }
  
  if (dateRange.length === 1) {
    const date = createCleanDate(dateRange[0])
    return date ? [date] : null
  }
  
  const dates = dateRange.map(createCleanDate).filter(Boolean)
  return dates.length === dateRange.length ? dates : null
}

/**
 * Проверяет, является ли значение валидной датой
 * @param {any} value - Значение для проверки
 * @returns {boolean} - true, если значение является валидной датой
 */
export function isValidDateValue(value) {
  if (!value) {
    return false
  }
  
  if (value instanceof Date) {
    return !isNaN(value.getTime())
  }
  
  try {
    const date = new Date(value)
    return !isNaN(date.getTime())
  } catch {
    return false
  }
}

