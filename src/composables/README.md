# useTimer Composable

Утилиты для работы с таймерами в snackbar компонентах.

## Использование

### Создание времени

```javascript
import { createTime } from '@/composables/useTimer.js'

// Простое создание времени
const time = createTime({ hours: 19, minutes: 38, seconds: 13 })

// Создание с частичными значениями (остальные будут 0)
const time2 = createTime({ hours: 2, minutes: 30 }) // 2ч 30м 0с
const time3 = createTime({ minutes: 45 }) // 0ч 45м 0с
```

### Создание snackbar с таймером

```javascript
import { createTimerSnackbar, createTime } from '@/composables/useTimer.js'

const timerSnackbar = createTimerSnackbar({
  id: 2,
  icon: 'flame',
  time: createTime({ hours: 19, minutes: 38, seconds: 13 })
})
// Результат:
// {
//   id: 2,
//   type: 'timer',
//   text: 'Подбор завершится: 19ч. 38 мин. 13 сек.',
//   icon: 'flame',
//   time: { hours: 19, minutes: 38, seconds: 13 },
//   duration: 70393
// }
```

### Создание обычного snackbar

```javascript
import { createButtonSnackbar } from '@/composables/useTimer.js'

const buttonSnackbar = createButtonSnackbar({
  id: 1,
  text: 'Удобное расположение',
  icon: 'location'
})
// Результат:
// {
//   id: 1,
//   type: 'button',
//   text: 'Удобное расположение',
//   icon: 'location'
// }
```

### Форматирование времени

```javascript
import { formatTime, calculateDuration } from '@/composables/useTimer.js'

const duration = calculateDuration({ hours: 1, minutes: 30, seconds: 45 })
console.log(formatTime(duration)) // "1ч. 30 мин. 45 сек."

console.log(formatTime(3661)) // "1ч. 1 мин. 1 сек."
console.log(formatTime(125)) // "2 мин. 5 сек."
console.log(formatTime(45)) // "45 сек."
```

## API

### createTime(time)
Создает объект времени из простых параметров.

**Параметры:**
- `time.hours` (number, default: 0) - часы
- `time.minutes` (number, default: 0) - минуты  
- `time.seconds` (number, default: 0) - секунды

**Возвращает:** `Object` - объект времени

### calculateDuration(time)
Вычисляет duration в секундах из объекта времени.

**Параметры:**
- `time` (Object) - объект времени

**Возвращает:** `number` - duration в секундах

### formatTime(totalSeconds)
Форматирует секунды в читаемый вид.

**Параметры:**
- `totalSeconds` (number) - общее количество секунд

**Возвращает:** `string` - отформатированное время

### createTimerSnackbar(options)
Создает объект snackbar с таймером.

**Параметры:**
- `options.id` (string) - уникальный ID
- `options.icon` (string) - иконка
- `options.time` (Object) - объект времени

**Возвращает:** `Object` - объект snackbar с duration

### createButtonSnackbar(options)
Создает объект snackbar с кнопкой.

**Параметры:**
- `options.id` (string) - уникальный ID
- `options.text` (string) - текст
- `options.icon` (string) - иконка

**Возвращает:** `Object` - объект snackbar
