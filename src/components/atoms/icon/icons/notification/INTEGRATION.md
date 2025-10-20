# Интеграция иконок уведомлений

## После загрузки иконок выполните следующие шаги:

### 1. Обновите `src/components/atoms/icon/icons/index.js`:

```javascript
// Добавьте импорты
import notificationWarning from './notification/warning.vue'
import notificationSuccess from './notification/success.vue'
import notificationDocument from './notification/document.vue'
import notificationClock from './notification/clock.vue'

// Добавьте в экспорт
export const icons = shallowRef({
  // ... существующие иконки
  notificationWarning,
  notificationSuccess,
  notificationDocument,
  notificationClock,
})
```

### 2. Обновите `src/components/molecules/ModalNotification.vue`:

Замените иконки в данных состояний:

```javascript
'Отклик не может быть отправлен': {
  icon: 'notificationWarning', // вместо 'warning'
  // ...
},
'Ваши данные приняты': {
  icon: 'notificationSuccess', // вместо 'doneAll'
  // ...
},
'Требуется паспорт': {
  icon: 'notificationDocument', // вместо 'passport'
  // ...
},
'Отклик на работу': {
  icon: 'notificationClock', // вместо 'clock'
  // ...
},
```

### 3. Проверьте отображение:

- Убедитесь, что иконки отображаются корректно
- Проверьте цвета иконок в разных состояниях
- Убедитесь, что размеры иконок соответствуют дизайну

## Структура папки:

```
src/components/atoms/icon/icons/notification/
├── README.md              # Описание иконок
├── INTEGRATION.md         # Инструкции по интеграции
├── warning.vue           # Иконка предупреждений
├── success.vue           # Иконка успеха
├── document.vue          # Иконка документов
└── clock.vue             # Иконка часов
```
