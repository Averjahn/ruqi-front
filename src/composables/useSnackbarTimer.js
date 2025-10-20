/**
 * Composable для работы с таймерами
 */

/**
 * Создает объект времени из простых параметров
 * @param {Object} time - объект с часами, минутами и секундами
 * @param {number} time.hours - часы (по умолчанию 0)
 * @param {number} time.minutes - минуты (по умолчанию 0)
 * @param {number} time.seconds - секунды (по умолчанию 0)
 * @returns {Object} объект времени
 */
export function createTime({ hours = 0, minutes = 0, seconds = 0 } = {}) {
  return { hours, minutes, seconds }
}

/**
 * Вычисляет duration в секундах из объекта времени
 * @param {Object} time - объект времени
 * @returns {number} duration в секундах
 */
export function calculateDuration(time) {
  const { hours = 0, minutes = 0, seconds = 0 } = time
  return hours * 3600 + minutes * 60 + seconds
}

/**
 * Форматирует секунды в читаемый вид
 * @param {number} totalSeconds - общее количество секунд
 * @returns {string} отформатированное время
 */
export function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  
  if (hours > 0) {
    return `${hours}ч. ${minutes} мин. ${seconds} сек.`
  } else if (minutes > 0) {
    return `${minutes} мин. ${seconds} сек.`
  } else {
    return `${seconds} сек.`
  }
}

/**
 * Создает объект snackbar с таймером
 * @param {Object} options - параметры snackbar
 * @param {string} options.id - уникальный ID
 * @param {string} options.icon - иконка
 * @param {Object} options.time - объект времени
 * @returns {Object} объект snackbar с duration
 */
export function createTimerSnackbar({ id, icon, time }) {
  return {
    id,
    type: 'timer',
    text: `Подбор завершится: ${formatTime(calculateDuration(time))}`,
    icon,
    time,
    duration: calculateDuration(time)
  }
}

/**
 * Создает объект snackbar с кнопкой
 * @param {Object} options - параметры snackbar
 * @param {string} options.id - уникальный ID
 * @param {string} options.text - текст
 * @param {string} options.icon - иконка
 * @returns {Object} объект snackbar
 */
export function createButtonSnackbar({ id, text, icon }) {
  return {
    id,
    type: 'button',
    text,
    icon
  }
}

// Default export для совместимости с существующим кодом
export default {
  createTime,
  calculateDuration,
  formatTime,
  createTimerSnackbar,
  createButtonSnackbar
}