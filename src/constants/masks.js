import { getClearPhone } from '@/constants/helpers'

export const formatNumericString = ({ value, pattern, cursorPosition = 0 }) => {
  let i = 0
  let formattedValue = ''
  while (value.length > 0) {
    if (!pattern[i]) {
      break
    }
    if (pattern[i] === '*') {
      if (/\d/.test(value[0])) {
        formattedValue += value[0]
        i++
      } else if (i < cursorPosition) {
        cursorPosition--
      }
      value = value.slice(1)
      continue
    }
    if (pattern[i] === value[0]) {
      formattedValue += value[0]
      value = value.slice(1)
    } else {
      formattedValue += pattern[i]
      if (i < cursorPosition) {
        cursorPosition++
      }
    }
    i++
  }
  return { formattedValue, cursorPosition }
}

export const formatPhone = ({ value, cursorPosition = 0 }) => {
  value = value || ''
  const clearPhone = getClearPhone(value)

  let pattern = '+****************'
  switch (true) {
    case /^\+7/.test(clearPhone) || clearPhone[0] === '7':
      pattern = '+* (***) ***-**-**'
      break
    case clearPhone[0] === '8':
      pattern = '* (***) ***-**-**'
      break
    case clearPhone[0] === '9':
      pattern = '+7 (***) ***-**-**'
      break
  }

  return formatNumericString({
    value,
    pattern,
    cursorPosition,
  })
}

export const formatInteger = ({ value, cursorPosition = 0 }) => {
  const newValue = value.replace(/\D/g, '')
  const newCursorPosition = cursorPosition - (value.length - newValue.length)
  return { value: newValue, cursorPosition: newCursorPosition }
}

export const formatComma = ({ value, cursorPosition = 0, decimalLength }) => {
  let newValue = value
    .replace('.', ',')
    .replace(/[^\d,]|^,/g, '')
    .replace(/^0\d/, '0,')
    .replace(/,+/g, ',')
  const arr = newValue.split(',')
  newValue = arr[0]
  if (arr[1] !== undefined) {
    newValue += ',' + (decimalLength ? arr[1].slice(0, decimalLength) : arr[1])
  }
  const newCursorPosition = cursorPosition - (value.length - newValue.length)
  return { value: newValue, cursorPosition: newCursorPosition }
}

export const formatFloat = ({ value, cursorPosition = 0, decimalLength }) => {
  let newValue = value
    .replace(',', '.')
    .replace(/[^\d.]|^\./g, '')
    .replace(/^0\d/, '0.')
    .replace(/\.+/g, '.')
  const arr = newValue.split('.')
  newValue = arr[0]
  if (arr[1] !== undefined) {
    newValue += '.' + (decimalLength ? arr[1].slice(0, decimalLength) : arr[1])
  }
  const newCursorPosition = cursorPosition - (value.length - newValue.length)
  return { value: newValue, cursorPosition: newCursorPosition }
}
