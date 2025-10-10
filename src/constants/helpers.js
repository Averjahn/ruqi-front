import dayjs from 'dayjs'

export const getAPIError = (response) => {
  let code = response?.data?.error?.[0]?.code || response?.data?.error?.code || ''
  code = code && code + ' '
  const msg = response?.data?.error?.[0]?.msg || response?.data?.error?.msg || ''
  return code + msg
}

export const getClearPhone = (phone) => {
  return (phone.match(/[0-9]/g) || []).join('')
}

export const clearPhoneAlwaysSeven = (phone) => {
  phone = phone.replace(/\s/g, '')
  const firstSymbol = phone[0] === '+' ? '+' : ''
  phone = phone.replace(/\D/g, '')
  if (firstSymbol === '+') return '+' + phone
  if (phone.length === 11 && phone[0] === '8') phone = '+7' + phone.substring(1)
  return phone
}

export function isJSON (str) {
  if (!str) return false
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

export const debounce = (func, wait, immediate) => {
  let timeout
  return function () {
    const context = this,
      args = arguments
    clearTimeout(timeout)
    timeout = setTimeout(function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }, wait)
    if (immediate && !timeout) func.apply(context, args)
  }
}

export const formatCurrency = (value) => {
  if (!value && value !== 0) {
    return ''
  }
  if (value % 1 == 0) {
    return new Intl.NumberFormat('ru', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  } else {
    return new Intl.NumberFormat('ru', {
      style: 'currency',
      currency: 'RUB',
    }).format(value)
  }
}

export const getDisplayedNumber = (value, toFixed) => {
  if (typeof value !== 'number' && typeof value !== 'string') return value
  const parts = ('' + value).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  if (toFixed && parts[1]) parts[1] = parts[1].slice(0, toFixed)
  return parts.join(',')
}

export const getFio = (user) => {
  let fio = user?.lastname || ''
  if (user?.firstname) fio += ` ${user.firstname.slice(0, 1)}.`
  if (user?.middlename) fio += ` ${user.middlename.slice(0, 1)}.`
  return fio
}

export const formatPhoneNumber = (digit) => {
  digit = digit.replace(/\D/g, '')
  let result = ''
  if (digit) {
    if (digit.startsWith('7') || digit.startsWith('8')) {
      if (digit.startsWith('8')) {
        digit = `7${digit.slice(1, digit.length)}`
      }
      for (let i = 0; i < digit.length; i++) {
        if (i === 0) {
          result += '+' + digit[i]
        } else if (i === 1) {
          result += ' (' + digit[i]
        } else if (i === 4) {
          result += ') ' + digit[i]
        } else if (i === 7 || i === 9) {
          result += '-' + digit[i]
        } else {
          result += digit[i]
        }
      }
    } else {
      for (let i = 0; i < digit.length; i++) {
        if (i === 0) {
          result += '+' + digit[i]
        } else if (i === 3) {
          result += ' (' + digit[i]
        } else if (i === 5) {
          result += ') ' + digit[i]
        } else if (i === 6 || i === 9) {
          result += '-' + digit[i]
        } else {
          result += digit[i]
        }
      }
    }
  }
  return result
}

export const declensionOfNumber = (val, words) => {
  if (Math.floor(val) !== +val) return words[1]
  val = Math.abs(val) % 100
  const num = val % 10
  if (val > 10 && val < 20) return words[2]
  if (num > 1 && num < 5) return words[1]
  if (num === 1) return words[0]
  return words[2]
}

export const urlParamsFromObject = (params) => {
  let str = ''
  for (const key in params) {
    if (str !== '') str += '&'
    str += `${key}=${encodeURIComponent(params[key])}`
  }
  return str
}

export const getDisplayedCardNumber = (cardNumber) => {
  if (!cardNumber) return cardNumber
  cardNumber = cardNumber.replace(/\D/g, '')
  if (cardNumber.length < 16) return cardNumber
  const maskedCardNumber = cardNumber.replace(/(\d{4})(\d{2})(\d{2})(\d{4})(\d{4})(\d{0,4})/, '$1 $2** **** $5 $6')
  return maskedCardNumber
}

export const getStringFromSeconds = (sec) => {
  let hours = Math.floor(sec / 3600)
  let minutes = Math.floor((sec % 3600) / 60)
  let seconds = sec % 60
  return dayjs().hour(hours).minute(minutes).second(seconds).format('mm:ss')
}

export const repeatWithInterval = (func, finishFunc, count, interval) => {
  let counter = 0
  return setInterval(function () {
    counter++
    counter > count ? finishFunc() : func()
  }, interval)
}

export const downloadFile = (url, fileName = true) => {
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const openTab = (url) => {
  const link = document.createElement('a')
  link.href = url
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const getPaymentDisplayedData = (item) => {
  let type = item?.payment_type
  let cardType = item?.cache_card_type
  let icon = ''
  let iconBank = ''
  let iconBlueRect = ''
  let text = ''

  if (type === 'sbp') {
    icon = require('@/assets/icons/sbp.svg')
    iconBlueRect = require('@/assets/icon_deprecated/pay_rect_blue_sbp.svg')
    text = formatPhoneNumber(item?.sbp_phone)
  }
  if (type === 'bank_account') {
    icon = require('@/assets/icons/bank.svg')
    iconBlueRect = require('@/assets/icon_deprecated/pay_rect_blue_account.svg')
    text = item?.payment_account
  }
  if (type === 'bank_card') {
    text = getDisplayedCardNumber(item?.bank_card_number)
    icon = require('@/assets/icons/card.svg')
    iconBlueRect = require('@/assets/icon_deprecated/pay_rect_blue_card.svg')
    if (cardType === 'mastercard') iconBank = require('@/assets/icons/master_card.svg')
    if (cardType === 'mir') iconBank = require('@/assets/icons/mir.svg')
    if (cardType === 'visa') iconBank = require('@/assets/icons/visa.svg')
  }
  if (type === 'referral_account') {
    icon = require('@/assets/icons/card_user.svg')
    iconBlueRect = require('@/assets/icon_deprecated/pay_rect_blue_referral.svg')
    text = getDisplayedCardNumber(item?.bank_card_number)
  }
  return {
    text,
    icon,
    iconBank,
    iconBlueRect,
  }
}

export const getScrollableParent = (node) => {
  const isScrollable = (node) => /^(auto|scroll)$/.test(window.getComputedStyle(node)['overflow-y'])
  while (node && !isScrollable(node)) {
    node = node.parentElement
  }
  return node || window
}

export async function readImageFile (file) {
  return new Promise((resolve) => {
    try {
      const reader = new FileReader()
      reader.onload = (event) => resolve(event.target.result)
      reader.onerror = resolve
      reader.readAsDataURL(file)
    } catch (e) {
      resolve()
    }
  })
}

export const truncateFileName = (fileName, maxLength) => {
  if (fileName.length <= maxLength) {
    return fileName
  } else {
    var extensionIndex = fileName.lastIndexOf('.')
    var extension = fileName.substring(extensionIndex).substring(0, 6)
    var truncatedName = fileName.substring(0, maxLength - extension.length) + '.. ' + extension
    return truncatedName
  }
}

export const formatFileSize = (bytes, precision) => {
  if (bytes < 1000) return bytes + ' b'
  if (bytes < 1024) return '1 Kb'
  if (bytes < 1024 ** 2) return (bytes / 1024).toFixed(precision) + ' Kb'
  if (bytes < 1024 ** 3) return (bytes / 1024 ** 2).toFixed(precision) + ' Mb'
  if (bytes < 1024 ** 4) return (bytes / 1024 ** 3).toFixed(precision) + ' Gb'
  return (bytes / 1024 ** 4).toFixed(precision) + ' Tb'
}

export const loadPlacemarkIcon = (src) => {
  return new Promise((resolve, reject) => {
    if (!src) {
      resolve(null)
      return
    }
    const img = new Image()
    img.onload = () => resolve(src)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

export const checkImgAvailability = (src) => {
  if (!src) return false
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = src
  })
}

export const isPlainObject = (object) => Object.prototype.toString.call(object) === '[object Object]'

export const isValidDate = (v, format = 'YYYY-MM-DD') => (v ? dayjs(v, format, true).isValid() : false)

export const convertToFrontFormat = (object) => {
  const processObject = (object) => {
    for (const key in object) {
      if (isPlainObject(object[key])) {
        processObject(object[key])
      } else {
        if (isValidDate(object[key], 'YYYY-MM-DD')) object[key] = dayjs(object[key], 'YYYY-MM-DD').format('DD.MM.YYYY')
      }
    }
  }
  processObject(object)
}

export const convertToBackFormat = (object) => {
  object = JSON.parse(JSON.stringify(object))
  const processObject = (object) => {
    for (const key in object) {
      if (isPlainObject(object[key])) {
        processObject(object[key])
      } else {
        if (isValidDate(object[key], 'DD.MM.YYYY')) object[key] = dayjs(object[key], 'DD.MM.YYYY').format('YYYY-MM-DD')
      }
    }
  }
  processObject(object)
  return object
}

export const replace8to7inPhone = (phone) => {
  phone = phone.replace(/\s/g, '')
  if (phone[0] === '8' || (phone[0] === '7' && !~phone.indexOf('@'))) phone = '+7' + phone.substring(1)
  return phone
}

export const safePing = ({ fetch, handler, intervalSec, localStorId }) => {
  const func = async () => {
    const localData = JSON.parse(localStorage.getItem(localStorId)) || {}
    if (localData?.response && dayjs().diff(dayjs(localData?.date), 'second') < intervalSec) {
      handler(localData.response)
    } else {
      const response = await fetch()
      handler(response)
      localStorage.setItem(
        localStorId,
        JSON.stringify({
          response,
          date: dayjs().toISOString(),
        }),
      )
    }
  }
  func()
  return setInterval(func, (intervalSec + Math.floor(Math.random() * 21)) * 1000)
}
