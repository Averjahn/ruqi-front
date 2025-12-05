/**
 * Утилита для сохранения и восстановления данных форм в localStorage
 */

/**
 * Сохраняет данные формы в localStorage
 * @param {string} storageKey - Ключ для хранения в localStorage
 * @param {Object} formData - Данные формы для сохранения
 */
export function saveFormData(storageKey, formData) {
  try {
    // Исключаем файлы из сохранения (они не могут быть сериализованы)
    const dataToSave = { ...formData }
    
    // Удаляем файлы и большие объекты
    Object.keys(dataToSave).forEach(key => {
      if (dataToSave[key] instanceof File || 
          (typeof dataToSave[key] === 'object' && dataToSave[key] !== null && dataToSave[key].file)) {
        // Сохраняем только метаданные файла (имя, размер), но не сам файл
        if (dataToSave[key] && typeof dataToSave[key] === 'object' && dataToSave[key].file) {
          dataToSave[key] = {
            name: dataToSave[key].name,
            size: dataToSave[key].size,
            isImage: dataToSave[key].isImage,
            // Не сохраняем preview и file, так как они не сериализуются
          }
        } else {
          delete dataToSave[key]
        }
      }
    })
    
    const serialized = JSON.stringify(dataToSave)
    localStorage.setItem(storageKey, serialized)
  } catch (error) {
    console.warn('Не удалось сохранить данные формы в localStorage:', error)
  }
}

/**
 * Загружает данные формы из localStorage
 * @param {string} storageKey - Ключ для получения данных из localStorage
 * @param {Object} defaultData - Данные по умолчанию, если в localStorage ничего нет
 * @returns {Object} - Восстановленные данные формы
 */
export function loadFormData(storageKey, defaultData = {}) {
  try {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      const parsed = JSON.parse(saved)
      // Объединяем с данными по умолчанию, чтобы не потерять структуру
      return { ...defaultData, ...parsed }
    }
  } catch (error) {
    console.warn('Не удалось загрузить данные формы из localStorage:', error)
  }
  return defaultData
}

/**
 * Очищает сохраненные данные формы
 * @param {string} storageKey - Ключ для удаления данных из localStorage
 */
export function clearFormData(storageKey) {
  try {
    localStorage.removeItem(storageKey)
  } catch (error) {
    console.warn('Не удалось очистить данные формы из localStorage:', error)
  }
}

/**
 * Миксин для автоматического сохранения данных формы
 * @param {string} storageKey - Ключ для хранения в localStorage
 * @param {string} dataProperty - Название свойства data с данными формы
 * @returns {Object} - Vue миксин
 */
export function createFormStorageMixin(storageKey, dataProperty = 'formData') {
  return {
    mounted() {
      // Восстанавливаем данные при монтировании компонента
      const savedData = loadFormData(storageKey, this[dataProperty])
      if (savedData && Object.keys(savedData).length > 0) {
        this[dataProperty] = { ...this[dataProperty], ...savedData }
      }
    },
    watch: {
      [dataProperty]: {
        handler(newValue) {
          // Сохраняем данные при изменении (с debounce для производительности)
          if (this._saveTimeout) {
            clearTimeout(this._saveTimeout)
          }
          this._saveTimeout = setTimeout(() => {
            saveFormData(storageKey, newValue)
          }, 300) // Сохраняем через 300ms после последнего изменения
        },
        deep: true
      }
    },
    beforeUnmount() {
      // Очищаем таймер при размонтировании
      if (this._saveTimeout) {
        clearTimeout(this._saveTimeout)
      }
    }
  }
}

